"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  ArrowLeft,
  Lightbulb,
  Thermometer,
  Droplets,
} from "lucide-react";
import TemperatureChart from "@/components/TemperatureChart";
import { use } from "react";
import { useGetOled, useUpdateOled } from "@/hook/useOled";
import LoginRedirection from "@/components/LoginRedirection";
import { useGetTempInHour } from "@/hook/useTemp";
import { cleanSocket, createSocket } from "@/lib/socket";
import DetailHeader from "@/components/DetailHeader";
import QuickStatus from "@/components/QuickStatus/QuickStatus";
import LEDSetting from "@/components/LEDSetting";
import LCDSetting from "@/components/LCDSetting";

interface BinData {
  id: string;
  status: "operational" | "warning" | "critical";
  fillLevel: number;
  battery: number;
  temperature: number;
  humidity: number;
  lastUpdated: string;
  lastEmptied: string;
}

interface Temp {
  time: Date;
  temp: number;
}

export default function BinDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [lcdMessageData, setLcdMessageData] = useState<string | null>(null);
  const binId = `BIN-${id.toUpperCase()}`;

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [lcdMode, setLcdMode] = useState<"fillLevel" | "message">("message");
  const [lcdMessage, setLcdMessage] = useState<string>("no message");
  const [newMessage, setNewMessage] = useState<string>("no message");
  const [ledEnabled, setLedEnabled] = useState(true);
  const [isSavingMessage, setIsSavingMessage] = useState(false);
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

  useEffect(() => {
    let mounted = true;
    async function fetchOled() {
      try {
        const res = await useGetOled(id);
        const data = (res as any)?.data ?? res;
        if (mounted) {
          setLcdMessageData(data.result.message ?? "no message");
        }
      } catch (e) {
        if (mounted) setLcdMessageData("no message");
      }
    }
    fetchOled();
    return () => {
      mounted = false;
    };
  }, [id]);

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

  useEffect(() => {
    if (lcdMessageData !== null && lcdMessageData !== undefined) {
      setLcdMessage(String(lcdMessageData));
      setNewMessage(String(lcdMessageData));
    }
  }, [lcdMessageData]);
  const [ledSchedule, setLedSchedule] = useState("manual");
  const [ledStartTime, setLedStartTime] = useState("18:00");
  const [ledEndTime, setLedEndTime] = useState("06:00");

  // Mock bin data
  const binData: BinData = {
    id: binId,
    status: "operational",
    fillLevel: 45,
    battery: 85,
    temperature: 28,
    humidity: 65,
    lastUpdated: "2025-11-03 09:12:00Z",
    lastEmptied: "2025-10-25 14:30:00Z",
  };

  useEffect(() => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      const auth = JSON.parse(authData);
      setIsAuthenticated(auth.isAuthenticated && !auth.isGuest);
    }
  }, []);

  async function updateOled(message: string) {
    try {
      const res = await useUpdateOled({ id, message });
      const data = (res as any)?.data ?? res;
    } catch (e) {
      console.error(e);
    }
  }

  const handleSaveMessage = async () => {
    setIsSavingMessage(true);

    try {
      await updateOled(newMessage);

      setLcdMessage(newMessage);
      setLcdMode("message");

      alert("Saved! LCD message updated successfully.");
    } catch (e) {
      alert("Failed to save. Please try again.");
    } finally {
      setIsSavingMessage(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "critical":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      default:
        return "";
    }
  };
  console.log(tempHour);
  return (
    <>
      <LoginRedirection />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <DetailHeader />

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              <div className="w-full h-[320px]">
                <TemperatureChart tempHour={tempHour} />
              </div>

              {/* Event Log */}
              <Card className="card-primary">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-foreground">
                    Event Log
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    <div className="flex gap-3 pb-3 border-b border-border/30">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink"></div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Status: Operational
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2025-11-03 09:12:00
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 pb-3 border-b border-border/30">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 shrink"></div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Fill Level Warning: 78%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2025-11-03 08:30:00
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 pb-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Device Emptied
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2025-10-25 14:30:00
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Stats and Controls */}
            <div className="space-y-6">
              {/* Quick Status */}
              <QuickStatus />

              <div className="pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                  <Thermometer size={14} />
                  Current Temperature
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {nowTemp}°C
                </p>
              </div>

              <div className="pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                  <Droplets size={14} />
                  Fill Level
                </p>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${binData.fillLevel}%` }}
                  ></div>
                </div>
                <p className="text-sm font-semibold text-foreground mt-1">
                  {binData.fillLevel}%
                </p>
              </div>

              <CardContent />
              <Card />
              {/* Au's LCD Setting */}
              <LCDSetting />

              {/* LCD Message Control */}
              {isAuthenticated && (
                <Card className="border-border/50 bg-card/50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare size={18} />
                      LCD Display
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setLcdMode("fillLevel")}
                        className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                          lcdMode === "fillLevel"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-foreground hover:bg-secondary/80"
                        }`}
                      >
                        Fill Level
                      </button>
                      <button
                        onClick={() => setLcdMode("message")}
                        className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                          lcdMode === "message"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-foreground hover:bg-secondary/80"
                        }`}
                      >
                        Message
                      </button>
                    </div>

                    {/* Display content based on mode */}
                    {lcdMode === "fillLevel" ? (
                      <div className="p-3 bg-secondary rounded border border-border/50 text-sm text-foreground h-16 flex items-center justify-center text-center">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Fill Level
                          </p>
                          <p className="text-2xl font-bold text-primary">
                            {binData.fillLevel}%
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Message edit mode */}
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Enter message..."
                          maxLength={32}
                          className="w-full p-2 bg-secondary border border-primary/20 rounded text-foreground text-sm resize-none h-20"
                        />
                        <p className="text-xs text-muted-foreground">
                          {newMessage.length}/32 characters
                        </p>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSaveMessage}
                            size="sm"
                            className="flex-1 cursor-pointer"
                            disabled={isSavingMessage}
                          >
                            {isSavingMessage ? (
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                                Saving...
                              </div>
                            ) : (
                              "Save"
                            )}
                          </Button>
                          <Button
                            onClick={() => {
                              setNewMessage(lcdMessage);
                              setLcdMode("message");
                            }}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* LED Light Control */}
              {isAuthenticated && <LEDSetting />}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
