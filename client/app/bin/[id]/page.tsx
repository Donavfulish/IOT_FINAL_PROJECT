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

// Hooks & Types
import { useBinDetailById, BinDetailType } from "@/hook/detailHook";
import { useUpdateOled } from "@/hook/oledHook";
import { useParams } from "next/navigation";

interface Temp {
  time: Date;
  temp: number;
}

export default function BinDetailsPage() {
  const { id } = useParams();

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
        const data = await useGetTempInHour(parseInt(id));
        if (mounted) {
          setTempHour(data.result ?? []);
          setNowTemp(
            data.result.reduce((max: Temp, item: Temp) =>
              item.temp > max.temp ? item : max
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
      console.log("e", e);
      const payload = JSON.parse(e.data);
      if (payload.id === "temp") {
        setNowTemp(payload.temp);
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

    // 1. Update OLED Message
    await useUpdateOled({
      id: id,
      message: message,
    });

    //  Note: API 'useUpdateOled' hiện chỉ update message.
    // await useUpdateBinConfig({ id, is_display_fill: isDisplayFill });

    // Tạm thời refresh lại data để đồng bộ
    await fetchBinDetail();
  };

  const handleSaveLED = async (
    mode: "auto" | "manual",
    start: string,
    end: string
  ) => {
    if (!binDetail) return;

    // TODO: Hiện tại chưa có API hook update LED cụ thể
    //  cần implement: await useUpdateLed({ id, mode, start, end });

    console.log("Saving LED config:", { mode, start, end });
    alert("API Update LED chưa được implement. Vui lòng kiểm tra lại hook.");

    // Refresh data sau khi update
    await fetchBinDetail();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Loading data...</p> {/* Thay bằng LoadingSpinner nếu có */}
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
              <div className="w-full h-[320px]">
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
                  <div className="space-y-3 max-h-64 overflow-y-auto">
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
                temperature={nowTemp}
              />

              {/* API-connected LCD Setting */}
              <LCDSetting
                isDisplayFill={binDetail.is_display_fill}
                message={binDetail.message}
                fillLevel={binDetail.fill_level}
                onSave={handleSaveLCD}
              />

              <LEDSetting
                mode={binDetail.led_mode}
                startTime={binDetail.time_on_led}
                endTime={binDetail.time_off_led}
                onSave={handleSaveLED}
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
