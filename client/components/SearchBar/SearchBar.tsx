"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

interface Bin {
    id: string
    name: string
    status: "operational" | "warning" | "critical"
    fillLevel: number
    battery: number
    temperature: number
    lastUpdated: string
}

interface BinSearchBarProps {
    bins?: Bin[]
}

// Mock data mặc định
const mockBins: Bin[] = [
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
    {
        id: "BIN-12345",
        name: "Bin 12345",
        status: "operational",
        fillLevel: 55,
        battery: 78,
        temperature: 27,
        lastUpdated: "2025-11-03 08:45:00Z",
    },
    {
        id: "BIN-98765",
        name: "Bin 98765",
        status: "warning",
        fillLevel: 82,
        battery: 45,
        temperature: 31,
        lastUpdated: "2025-11-03 08:30:00Z",
    },
]

export default function SearchBar({ bins = mockBins }: BinSearchBarProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [showSearchDropdown, setShowSearchDropdown] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchDropdown(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const filteredBins = bins.filter(
        (bin) =>
            bin.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bin.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case "operational":
                return "bg-[#5DE29A]/20 text-[#5DE29A] border-[#5DE29A]/40"
            case "warning":
                return "bg-[#FFB86B]/20 text-[#FFB86B] border-[#FFB86B]/40"
            case "critical":
                return "bg-[#FF3B30]/20 text-[#FF3B30] border-[#FF3B30]/40"
            default:
                return "bg-muted/20 text-muted-foreground"
        }
    }

    return (
        <div className="mb-8" ref={searchRef}>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                    type="text"
                    placeholder="Search bins by ID or name..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setShowSearchDropdown(true)
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
                                    className="block px-4 py-3 hover:bg-secondary/50 transition-colors border-b border-border/30 last:border-b-0"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-foreground truncate">{bin.id}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{bin.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`inline-block px-2 py-1 rounded-md text-xs font-semibold border ${getStatusColor(bin.status)}`}
                                            >
                                                {bin.status === "operational" ? "✓" : "!"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-muted-foreground">Fill Level:</span>
                                            <p className="font-semibold text-foreground">{bin.fillLevel}%</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Battery:</span>
                                            <p className="font-semibold text-foreground">{bin.battery}%</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-center text-muted-foreground">No bins found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}