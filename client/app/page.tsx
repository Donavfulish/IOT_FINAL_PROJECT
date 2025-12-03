"use client";

import BinCard from "@/components/BinCard/BinCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import Header from "@/components/Header";
import LoginRedirection from "@/components/LoginRedirection";
import { useEffect } from "react";
import { cleanSocket, createSocket } from "@/lib/socket";

// Đây là trang dashboard
export default function HomePage() {
  useEffect(() => {
    const ws = createSocket();
    ws.onmessage = (e) => {
      console.log("WS mess received: ", e.data);
    };

    return () => cleanSocket(ws);
  }, []);

  return (
    <>
      <LoginRedirection />
      <Header accountRole="user" />
      <div className="p-8 bg-[#030712]">
        <SearchBar />
      </div>
      <div className="grid grid-cols-3 bg-[#030712]">
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
