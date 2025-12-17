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
import OledSetting from "@/components/oledSetting";
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
            } else if (payload.id == "event" || payload.id == "button-fault-signal") {
                console.log("event");
                setBinDetail((prev) =>
                    prev
                        ? {
                            ...prev,
                            events: [
                                {
                                    message: payload.message,
                                    time_at: new Date(),
                                    type: payload.type,
                                },
                                ...prev.events,
                            ],
                        }
                        : prev
                );
            } else if (payload.id === "ultra") {
                const fillLevel = Number(payload.fillLevel);

                setBinDetail((prev): BinDetailType | undefined => {
                    if (!prev) return prev;

                    const events =
                        fillLevel === 100
                            ? ([
                                {
                                    message: "The bin is full",
                                    time_at: new Date(),
                                    type: "danger",
                                },
                                ...prev.events,
                            ] as typeof prev.events)
                            : prev.events;

                    return {
                        ...prev,
                        fill_level: payload.fillLevel, // đúng kiểu
                        events,
                    };
                });
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
    const handleSaveoled = async (message: string, isDisplayFill: boolean) => {
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
        end: string,
        isLedOn: boolean
    ) => {
        if (!binDetail) return;

        try {
            await useUpdateLed({
                id: Number(id),
                led_mode: mode,
                time_on_led: start,
                time_off_led: end,
                is_led_on: isLedOn,
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
                <DetailHeader bin={binDetail} />

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
                                            binDetail.events.map((event, index) => (
                                                <div
                                                    key={index}
                                                    className="flex gap-3 pb-3 border-b border-border/30 last:border-0"
                                                >
                                                    <div
                                                        className={`w-2 h-2 rounded-full mt-2 shrink-0 ${event.type === "warning"
                                                            ? "bg-yellow-500"
                                                            : event.type === "danger"
                                                                ? "bg-red-500"
                                                                : "bg-green-500"
                                                            }`}
                                                    ></div>
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground break-all line-clamp-2 pr-5">
                                                            {event.message}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(event.time_at).toLocaleString()}
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

                            {/* API-connected oled Setting */}
                            <OledSetting
                                isDisplayFill={binDetail.is_display_fill}
                                message={binDetail.message}
                                fillLevel={binDetail.fill_level}
                                onSave={handleSaveoled}
                                isEditable={user?.bin_id == id}
                            />

                            <LEDSetting
                                mode={binDetail.led_mode}
                                startTime={binDetail.time_on_led}
                                endTime={binDetail.time_off_led}
                                is_led_on={binDetail.is_led_on}
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
