import React from "react";

interface BinData {
  binId: number;
  status: "OPERATIONAL" | "WARNING" | "FULL" | "MAINTENANCE";
  fillLevel: number;
  battery: number;
  temperature: number;
}

const BinCard: React.FC = () => {
  // Mock data cho thùng rác
  const binData: BinData = {
    binId: 1,
    status: "OPERATIONAL",
    fillLevel: 45,
    battery: 85,
    temperature: 28,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPERATIONAL":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "WARNING":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "FULL":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "MAINTENANCE":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getFillLevelColor = (level: number) => {
    if (level < 50) return "bg-emerald-400";
    if (level < 75) return "bg-yellow-400";
    return "bg-red-400";
  };

  return (
    <div className="w-full h-full bg-gray-950 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-800 hover:border-blue-500 transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white tracking-wide">
            {binData.binId}
          </h2>
          <div
            className={`px-6 py-2 rounded-full border ${getStatusColor(
              binData.status
            )}`}
          >
            <span className="text-sm font-semibold tracking-wider">
              {binData.status}
            </span>
          </div>
        </div>

        {/* Fill Level Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-lg">Fill Level</span>
            <span className="text-white text-3xl font-bold">
              {binData.fillLevel}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getFillLevelColor(
                binData.fillLevel
              )}`}
              style={{ width: `${binData.fillLevel}%` }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Battery and Temperature */}
        <div className="grid grid-cols-2 gap-3">
          {/* Battery */}
          <div className="bg-gray-800 rounded-lg py-3 px-5">
            <div className="text-gray-400 text-lg mb-3">Battery</div>
            <div className="text-cyan-400 text-2xl font-bold">
              {binData.battery}%
            </div>
          </div>

          {/* Temperature */}
          <div className="bg-gray-800 rounded-lg py-3 px-5">
            <div className="text-gray-400 text-lg mb-3">Temp</div>
            <div className="text-emerald-400 text-2xl font-bold">
              {binData.temperature}°C
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinCard;
