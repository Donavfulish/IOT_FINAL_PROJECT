"use client";

import BinCard from "@/components/BinCard/BinCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import Header from "@/components/Header";
import LoginRedirection from "@/components/LoginRedirection";
import { useEffect, useState } from "react";
import { createSocket, cleanSocket } from "@/lib/socket";
import { useSendNotification } from "@/hook/notificationHook";
import { useAuthStore } from "@/store/auth.store";
import { BinPreview, useAllBins } from "@/hook/binHook";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

// Đây là trang dashboard
export default function HomePage() {
  // useEffect(() => {
  //   const ws = createSocket();
  //   ws.onmessage = (e) => {
  //     const payload = JSON.parse(e.data);

  //     // Kiểm tra id xem tin nhắn nhận được phải của mình không
  //     if (payload.id === "button-fault-signal")
  //       console.log("Thùng rác hư r thằng kia");
  //   };

  //   return () => cleanSocket(ws);
  // }, []);
  const user = useAuthStore((state) => state.user);

  const [bins, setBins] = useState<BinPreview[]>([]);

  useEffect(() => {
    const fetching = async () => {
      const binsData = await useAllBins();
      setBins(binsData || []);
    };

    fetching();
  }, []);

  if (user === undefined) return <LoadingSpinner />;

  return (
    <>
      {/* {user && (
        <button
          onClick={() => useSendNotification(user.id, "Title", "Body", {})}
          className="w-100 h-100 border border-gray-200 bg-blue-200/80"
        >
          Click here to get pushed notification
        </button> 
      )} */}

      <LoginRedirection />
      {user && (
        <>
          {" "}
          <Header accountRole={user!.role} />
          <div className="p-8 bg-[#030712]">
            <SearchBar />
          </div>
          <div className="grid grid-cols-3">
            {bins.length == 0 && <LoadingSpinner />}
            {bins
              .filter((bin) => bin.id === user?.bin_id)
              .map((bin) => (
                <BinCard
                  key={bin.id}
                  binId={bin.id}
                  status="OPERATIONAL"
                  fillLevel={bin.fill_level}
                  battery={bin.battery}
                  temperature={50}
                  isManaged={true}
                />
              ))}

            {bins
              .filter((bin) => bin.id !== user?.bin_id)
              .sort((first, second) => first.fill_level - second.fill_level)
              .map((bin) => (
                <BinCard
                  key={bin.id}
                  binId={bin.id}
                  status="OPERATIONAL"
                  fillLevel={bin.fill_level}
                  battery={bin.battery}
                  temperature={50}
                />
              ))}
          </div>{" "}
        </>
      )}
    </>
  );
}
