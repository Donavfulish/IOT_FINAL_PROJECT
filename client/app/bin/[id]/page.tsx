"use client";

import { useEffect, useState, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TemperatureChart from "@/components/TemperatureChart"; // Giữ nguyên chart
import LoginRedirection from "@/components/LoginRedirection";
import { useGetTempInHour } from "@/hook/useTemp";
import { cleanSocket, createSocket } from "@/lib/socket";
import DetailHeader from "@/components/DetailHeader";
import QuickStatus from "@/components/QuickStatus/QuickStatus";
import LEDSetting from "@/components/LEDSetting";
import LCDSetting from "@/components/LCDSetting";
import { useUpdateLed } from "@/hook/ledHook";
import { useBinDetailById, BinDetailType } from "@/hook/binHook";
import { useUpdateOled } from "@/hook/oledHook";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useAuthStore } from "@/store/auth.store";

interface Temp {
  time: Date;
  temp: number;
}

export default function BinDetailsPage() {
  const id = Number(useParams().id);
  const user = useAuthStore((store) => store.user);

  // State
  const [binDetail, setBinDetail] = useState<BinDetailType | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [tempHour, setTempHour] = useState<Temp[]>([]);
  const [nowTemp, setNowTemp] = useState(0);
  // Fetch temperature in 1 hour
  useEffect(() => {
    let mounted = true;

    const loadTempHour = async () => {
      try {
        const data = await useGetTempInHour(parseInt(String(id)));
        if (mounted) {
          setTempHour(data.result ?? []);
          setNowTemp(
            data.result.reduce((max: Temp, item: Temp) =>
              item.time > max.time ? item : max
            ).temp
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadTempHour();
    return () => {
      mounted = false;
    };
  }, [id, nowTemp]);

  // Socket
  useEffect(() => {
    const ws = createSocket();
    ws.onmessage = (e) => {
      const payload = JSON.parse(e.data);
      if (payload.id == "temp") {
        console.log("temperature:", payload);
        setNowTemp(payload.temp);
      } else if (payload.id == "ultra") {
        console.log("ws ultra:", payload);
        setBinDetail((prev) => ({ ...prev!, fill_level: payload.fillLevel }));
      }
    };

    return () => cleanSocket(ws);
  }, []);

  // Check auth
  useEffect(() => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      const auth = JSON.parse(authData);
      setIsAuthenticated(auth.isAuthenticated && !auth.isGuest);
    }
  }, []);

  // Fetch Data
  const fetchBinDetail = async () => {
    setLoading(true);
    try {
      const data = await useBinDetailById(Number(id));
      if (data) {
        setBinDetail(data);
      }
    } catch (error) {
      console.error("Failed to fetch bin detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBinDetail();
  }, [id]);

  // Handlers for updating settings
  const handleSaveLCD = async (message: string, isDisplayFill: boolean) => {
    if (!binDetail) return;

    const messageToSend = isDisplayFill ? "RESET" : message;

try {
      await useUpdateOled({
        id: Number(id),
        message: messageToSend,
      });
      
      await fetchBinDetail();
    } catch (error) {
      console.error("Error updating OLED:", error);
    }
  };

  const handleSaveLED = async (
    mode: "auto" | "manual",
    start: string,
    end: string
  ) => {
    if (!binDetail) return;

    try {
      await useUpdateLed({ 
        id: Number(id), 
        led_mode: mode, 
        time_on_led: start, 
        time_off_led: end 
      });
      
      await fetchBinDetail();
    } catch (error) {
      console.error("Error updating LED:", error);
      alert("Failed to update LED settings.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (!binDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Bin not found or error loading data.</p>
      </div>
    );
  }

  return (
    <>
      <LoginRedirection />
      <div className="min-h-screen bg-background">
        <DetailHeader />

        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Charts & Logs */}
            <div className="lg:col-span-2 space-y-6">
              <div className="w-full h-80">
                <TemperatureChart tempHour={tempHour} />
              </div>

              {/* Event Log mapped from API alerts */}
              <Card className="card-primary">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-foreground">
                    Event Log
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-100 overflow-y-auto">
                    {binDetail.alerts && binDetail.alerts.length > 0 ? (
                      binDetail.alerts.map((alert, index) => (
                        <div
                          key={index}
                          className="flex gap-3 pb-3 border-b border-border/30 last:border-0"
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                              alert.title.toLowerCase().includes("warning")
                                ? "bg-yellow-500"
                                : alert.title.toLowerCase().includes("critical")
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {alert.title}: {alert.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(alert.time_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No recent events.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Stats and Controls */}
            <div className="space-y-6">
              {/* API Data injected here */}
              <QuickStatus
                battery={binDetail.battery}
                fillLevel={binDetail.fill_level}
                temperature={Number(nowTemp)}
              />

              {/* API-connected LCD Setting */}
              <LCDSetting
                isDisplayFill={binDetail.is_display_fill}
                message={binDetail.message}
                fillLevel={binDetail.fill_level}
                onSave={handleSaveLCD}
                isEditable={user?.bin_id == id}
              />

              <LEDSetting
                mode={binDetail.led_mode}
                startTime={binDetail.time_on_led}
                endTime={binDetail.time_off_led}
                onSave={handleSaveLED}
                isEditable={user?.bin_id == id}
              />
              {/* API-connected LED Setting */}
              {/* {isAuthenticated && (
                                <LEDSetting
                                    mode={binDetail.led_mode}
                                    startTime={binDetail.time_on_led}
                                    endTime={binDetail.time_off_led}
                                    onSave={handleSaveLED}
                                />
                            )} */}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
