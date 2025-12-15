"use client";

import BinCard from "@/components/BinCard/BinCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import Header from "@/components/Header";
import LoginRedirection from "@/components/LoginRedirection";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { BinPreview, useAllBins } from "@/hook/binHook";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

// Đây là trang dashboard
export default function HomePage() {
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

  console.log(bins);

  return (
    <>
      <LoginRedirection />
      {user && (
        <>
          {" "}
          <Header accountRole={user!.role} />
          <div className="p-8 bg-[#030712]">
            <SearchBar bins={bins} />
          </div>
          <div className="grid grid-cols-3">
            {bins.length == 0 && <LoadingSpinner />}
            {bins
              .filter((bin) => bin.id === user?.bin_id)
              .map((bin) => (
                <BinCard
                  key={bin.id}
                  binId={bin.id}
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
