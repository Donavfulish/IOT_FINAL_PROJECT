"use client";

import BinCard from "@/components/BinCard/BinCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import Header from "@/components/Header";
import LoginRedirection from "@/components/LoginRedirection";
import { useEffect } from "react";
import { createSocket, cleanSocket } from "@/lib/socket";
import { useSendNotification } from "@/hook/notificationHook";
import { useAuthStore } from "@/store/auth.store";

// Đây là trang dashboard
export default function HomePage() {
  useEffect(() => {
    const ws = createSocket();
    ws.onmessage = (e) => {
      const payload = JSON.parse(e.data);

      // Kiểm tra id xem tin nhắn nhận được phải của mình không
      if (payload.id === "button-fault-signal")
        console.log("Thùng rác hư r thằng kia");
    };

    return () => cleanSocket(ws);
  }, []);

  const user = useAuthStore((state) => state.user) || undefined;

  return (
    <>
      {user && (
        <button
          onClick={() => useSendNotification(user.id, "Title", "Body", {})}
          className="w-100 h-100 border border-gray-200 bg-blue-200/80"
        >
          Click here to get pushed notification
        </button>
      )}

      <LoginRedirection />
      <Header accountRole="user" />
      <div className="p-8 bg-[#030712]">
        <SearchBar />
      </div>
      <div className="grid grid-cols-3">
        <BinCard />
        <BinCard />
        <BinCard />
        <BinCard />
        <BinCard />
        <BinCard />
        <BinCard />
      </div>
    </>
  );
}
