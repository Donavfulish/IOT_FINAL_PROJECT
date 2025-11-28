"use client";
import { useEffect, useState } from "react";
import { initSocket } from "@/lib/socket";
import { SuggestItem } from "@/components/SuggestItem/SuggestItem";
import { LogItem } from "@/components/LogItem/LogItem";
import { AlertItem } from "@/components/AlertItem/AlertItem";
import TemperatureChart from "@/cogmponents/TemperatureChart/TemperatureChart";
import LCDSetting from "@/components/LCDSetting"
import LEDSetting from "@/components/LEDSetting"
import QuickStatus from "@/components/QuickStatus/QuickStatus";
import BinCard from "@/components/BinCard/BinCard";
import SearchBar from "@/components/SearchBar/SearchBar";

// Đây là trang dashboard
export default function HomePage() {
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
<<<<<<< HEAD
        <LEDSetting />
        <LCDSetting />
=======
        <SearchBar/>
        <LEDSetting/>
        <LCDSetting/>
        <QuickStatus/>
        <BinCard/>
>>>>>>> origin/feature/componenst/Ha
      </div>
    </div>
  );
}
