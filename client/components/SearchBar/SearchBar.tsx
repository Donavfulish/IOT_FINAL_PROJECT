"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Battery, Droplet, Search } from "lucide-react";
import { BinPreview } from "@/hook/binHook";

interface BinSearchBarProps {
  bins: BinPreview[];
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  percentage: number;
  color: string;
}

const StatItem: React.FC<StatItemProps> = ({
  icon,
  label,
  value,
  percentage,
  color,
}) => {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-3">
        <div className="text-gray-400">{icon}</div>
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2 mb-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <div className="absolute top-0 right-2 text-2xl font-bold text-white">
        {value}
      </div>
    </div>
  );
};

export default function SearchBar({ bins }: BinSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredBins = bins.filter((bin) =>
    String(bin.id).includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-[#5DE29A]/20 text-[#5DE29A] border-[#5DE29A]/40";
      case "warning":
        return "bg-[#FFB86B]/20 text-[#FFB86B] border-[#FFB86B]/40";
      case "critical":
        return "bg-[#FF3B30]/20 text-[#FF3B30] border-[#FF3B30]/40";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  return (
    <div className="mb-8" ref={searchRef}>
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <input
          type="text"
          placeholder="Search bins by ID or name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSearchDropdown(true);
          }}
          onFocus={() => setShowSearchDropdown(true)}
          className="w-full pl-12 pr-4 py-3 bg-[#1a1f2e] border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        {showSearchDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-md border border-border/60 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
            {filteredBins.length > 0 ? (
              filteredBins.map((bin) => (
                <Link
                  key={bin.id}
                  href={`/bin/${bin.id}`}
                  className="block px-4 py-3 bg-secondary hover:bg-secondary/85 transition-colors border-b border-border/30 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-lg truncate">
                        ID-{bin.id}
                      </p>
                    </div>
                    <div className="text-right"></div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-10 text-xs">
                    {/* <div>
                      <span className="text-muted-foreground">Fill Level:</span>
                      <p className="font-semibold text-green-600 text-lg">
                        {bin.fill_level}%
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Battery:</span>
                      <p className="font-semibold text-cyan-400 text-lg">
                        {bin.battery}%
                      </p>
                    </div> */}
                    <StatItem
                      icon={<Battery className="w-5 h-5" />}
                      label="Battery Level"
                      value={`${bin.battery}%`}
                      percentage={bin.battery}
                      color={bin.battery < 20 ? "#ef4444" : "#10b981"}
                    />
                    <StatItem
                      icon={<Droplet className="w-5 h-5" />}
                      label="Fill Level"
                      value={`${bin.fill_level}%`}
                      percentage={bin.fill_level}
                      color={bin.fill_level > 80 ? "#ef4444" : "#06b6d4"}
                    />
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-muted-foreground">
                No bins found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
