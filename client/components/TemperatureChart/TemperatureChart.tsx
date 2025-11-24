"use client";

import {
  AreaChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";

const data = [
  { time: "00:00", temp: 16 },
  { time: "04:00", temp: 15 },
  { time: "08:00", temp: 20 },
  { time: "12:00", temp: 27 },
  { time: "16:00", temp: 30 },
  { time: "20:00", temp: 24 },
  { time: "24:00", temp: 18 },
];

export default function TemperatureChart() {
  return (
    <div className="w-full h-80 rounded-2xl pb-16 px-8 pt-8 bg-[#0f172a] border border-amber-300">
      <h2 className="text-white text-lg mb-6 font-semibold">
        Temperature Trend
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="tempColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
          <XAxis dataKey="time" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="temp"
            stroke="none"
            fill="url(#tempColor)"
          />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={false}
            fill="url(#tempColor)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
