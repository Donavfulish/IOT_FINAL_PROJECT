"use client";
import { useEffect, useState } from "react";
import { initSocket } from "@/lib/socket";
import { SuggestItem } from "@/components/SuggestItem/SuggestItem";
import { LogItem } from "@/components/LogItem/LogItem";
import { AlertItem } from "@/components/AlertItem/AlertItem";
import TemperatureChart from "@/components/TemperatureChart/TemperatureChart";
import LCDSetting from "@/components/LCDSetting"
import LEDSetting from "@/components/LEDSetting"
import QuickStatus from "@/components/QuickStatus/QuickStatus";
import BinCard from "@/components/BinCard/BinCard";
import { Bin } from "@/components/BinCard/BinCard";

const bins: Bin[] = [
    {
        id: "BIN-76623",
        name: "Bin 76623",
        status: "operational",
        fillLevel: 45,
        battery: 85,
        temperature: 28,
        lastUpdated: "2025-11-03 09:12:00Z",
    },
    {
        id: "BIN-88901",
        name: "Bin 88901",
        status: "warning",
        fillLevel: 78,
        battery: 35,
        temperature: 32,
        lastUpdated: "2025-11-03 08:00:00Z",
    },
    {
        id: "BIN-34567",
        name: "Bin 34567",
        status: "critical",
        fillLevel: 95,
        battery: 12,
        temperature: 35,
        lastUpdated: "2025-11-03 07:15:00Z",
    },
    {
        id: "BIN-45678",
        name: "Bin 45678",
        status: "operational",
        fillLevel: 32,
        battery: 92,
        temperature: 26,
        lastUpdated: "2025-11-03 09:00:00Z",
    },
]

export default function Home() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const ws = initSocket();
    ws.onmessage = (e) => setMsg(e.data);
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">WebSocket Test</h1>
      <p className="mt-2">Message from server: {msg}</p>
      <div className="w-100 flex flex-col gap-5">
        <LEDSetting/>
        <LCDSetting/>
        <QuickStatus/>
        {bins.map((b) => (
            <BinCard {...b}/>
        ))}
      </div>
    </div>
  )
}
