import React from "react";
import { KeyRound } from "lucide-react";
import Link from "next/link";

interface BinData {
  binId: number;
  fillLevel: number;
  battery: number;
  temperature: number;
  isManaged?: boolean;
}

const BinCard = ({
  binId,
  fillLevel,
  battery,
  temperature,
  isManaged = false,
}: BinData) => {

  const getFillLevelColor = (level: number) => {
    if (level < 50) return "bg-emerald-400";
    if (level < 75) return "bg-yellow-400";
    return "bg-red-400";
  };

  return (
    <div className="relative w-full h-full bg-gray-950 p-6 flex items-center justify-center">
      {isManaged && (
        <div className="absolute top-1 left-12.5 p-2 rounded-md border border-yellow-200 bg-yellow-900 text-lg font-medium text-yellow-200">
          <KeyRound />
        </div>
      )}

      <div
        className={
          isManaged
            ? "w-full max-w-2xl bg-gray-900 rounded-3xl p-8 shadow-2xl border border-yellow-200 center-glow hover:shadow-xltransition-all duration-200"
            : "w-full max-w-2xl bg-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-800 hover:border-blue-500 transition-colors duration-200"
        }
      >
        {/* Header */}
        <Link
          href={`/bin/${binId}`}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="text-3xl font-bold text-white tracking-wide">
            {binId}
          </h2>
        </Link>

        {/* Fill Level Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-lg">Fill Level</span>
            <span className="text-white text-3xl font-bold">{fillLevel}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getFillLevelColor(
                fillLevel
              )}`}
              style={{ width: `${fillLevel}%` }}
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
            <div className="text-cyan-400 text-2xl font-bold">{battery}%</div>
          </div>

          {/* Temperature */}
          <div className="bg-gray-800 rounded-lg py-3 px-5">
            <div className="text-gray-400 text-lg mb-3">Temp</div>
            <div className="text-emerald-400 text-2xl font-bold">
              {temperature}°C
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinCard;
