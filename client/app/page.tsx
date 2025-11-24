"use client";
import { useEffect, useState } from "react";
import { initSocket } from "@/lib/socket";
import { SuggestItem } from "@/components/SuggestItem/SuggestItem";
import { LogItem } from "@/components/LogItem/LogItem";
import { AlertItem } from "@/components/AlertItem/AlertItem";
import TemperatureChart from "@/components/TemperatureChart/TemperatureChart";

export default function Home() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const ws = initSocket();
    ws.onmessage = (e) => setMsg(e.data);
  }, []);

  return (
    <div className="p-20">
      <TemperatureChart />
    </div>
  );
}
