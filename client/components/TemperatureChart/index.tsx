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

interface Temp {
  time: Date;
  temp: number;
}
interface Props {
  tempHour: Temp[];
}
export default function TemperatureChart({ tempHour }: Props) {
  const now = new Date();
  const endTime = now.getTime(); // Thời điểm hiện tại (ví dụ: 13:42:22)
  const startTime = now.getTime() - 60 * 60 * 1000; // 1 giờ trước (ví dụ: 12:42:22)

  const chartData = tempHour
    .map((item) => {
      const temp = {
        temp: item.temp,
        time: new Date(
          new Date(item.time).getTime() - 7.05 * 60 * 60 * 1000
        ).getTime(),
      };

      return temp;
    })
    .filter((item) => item.time <= endTime && item.time >= startTime);

  if (chartData.length > 0) {
    const firstPoint = chartData[0];
    const lastPoint = chartData[chartData.length - 1];

    if (firstPoint.time > startTime) {
      chartData.unshift({
        temp: firstPoint.temp,
        time: startTime,
      });
    }

    if (lastPoint.time < endTime) {
      chartData.push({
        temp: lastPoint.temp,
        time: endTime,
      });
    }
  }
  return (
    <div className="flex flex-col w-full h-80 rounded-2xl pb-8 px-4 pt-8 bg-[#0f172a] border border-amber-300">
      <h2 className="text-white text-lg mb-6 font-semibold">
        Temperature Trend
      </h2>
      <div className="flex-1 min-h-0 min-w-0">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="tempColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis
              stroke="#94a3b8"
              dataKey="time"
              type="number"
              domain={[startTime, endTime]}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              }}
            />
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
    </div>
  );
}
