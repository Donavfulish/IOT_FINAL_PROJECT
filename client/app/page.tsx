"use client";

import BinCard from "@/components/BinCard/BinCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import Header from "@/components/Header";

// Đây là trang dashboard
export default function HomePage() {
  return (
    <>
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
