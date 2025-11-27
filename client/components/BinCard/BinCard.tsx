"use client"

export interface Bin {
    id: string
    name: string
    status: "operational" | "warning" | "critical"
    fillLevel: number
    battery: number
    temperature: number
    lastUpdated: string
}

const bins: Bin[] = [
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
]

export default function BinCard(bin: Bin) {

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

    const getStatusBadgeText = (status: string) => {
        switch (status) {
            case "operational":
                return "OPERATIONAL"
            case "warning":
                return "WARNING"
            case "critical":
                return "CRITICAL"
            default:
                return "UNKNOWN"
        }
    }

    const getStatusBarColor = (status: string) => {
        switch (status) {
            case "operational":
                return "bg-[#5DE29A]"
            case "warning":
                return "bg-[#FFB86B]"
            case "critical":
                return "bg-[#FF3B30]"
            default:
                return "bg-primary"
        }
    }

    return (
        <div className="card-glass card-border rounded-xl p-5 hover:border-primary/60 transition-all hover:shadow-lg hover:shadow-primary/10 h-full group cursor-pointer">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {bin.id}
                    </h3>
                </div>
                <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusColor(bin.status)}`}>
                    {getStatusBadgeText(bin.status)}
                </div>
            </div>

            <div className="space-y-4">
                {/* Fill Level */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-muted-foreground">Fill Level</span>
                        <span className="text-sm font-semibold text-foreground">{bin.fillLevel}%</span>
                    </div>
                    <div className="w-full bg-secondary/50 rounded-full h-2.5 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${getStatusBarColor(bin.status)}`}
                            style={{ width: `${bin.fillLevel}%` }}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/30">
                    <div className="bg-secondary/30 rounded-lg p-2">
                        <p className="text-xs text-muted-foreground mb-1">Battery</p>
                        <p className="text-sm font-bold text-[#00C2FF]">{bin.battery}%</p>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-2">
                        <p className="text-xs text-muted-foreground mb-1">Temp</p>
                        <p className="text-sm font-bold text-[#5DE29A]">{bin.temperature}°C</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
