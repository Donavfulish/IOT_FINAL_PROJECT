"use client";
import { useEffect, useState } from "react";
import { initSocket } from "@/lib/socket";
import { SuggestItem } from "@/components/SuggestItem/SuggestItem";
import { LogItem } from "@/components/LogItem/LogItem";
import { AlertItem } from "@/components/AlertItem/AlertItem";
import TemperatureChart from "@/components/TemperatureChart";
import LCDSetting from "@/components/LCDSetting";
import LEDSetting from "@/components/LEDSetting";
import QuickStatus from "@/components/QuickStatus/QuickStatus";
import BinCard from "@/components/BinCard/BinCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

// Đây là trang dashboard
export default function HomePage() {
  const [msg, setMsg] = useState("");

  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  if (user === undefined) {
    return <div>Đang tải...</div>;
  }

  useEffect(() => {
    // Chỉ chạy nếu đã xác định trạng thái, và người dùng chưa đăng nhập (null)
    if (user === null) {
      router.replace("/login");
    }
  }, [user, router]);

  useEffect(() => {
    const ws = initSocket();
    ws.onmessage = (e) => setMsg(e.data);
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">WebSocket Test</h1>
      <p className="mt-2">Message from server: {msg}</p>
      <div className="w-100 flex flex-col gap-5">
        <SearchBar />
        <LEDSetting />
        <LCDSetting />
        <QuickStatus />
        <BinCard />
      </div>
    </div>
  );
}
