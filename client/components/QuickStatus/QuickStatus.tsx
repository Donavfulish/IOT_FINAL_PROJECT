import React from "react";
import { Battery, Thermometer, Droplet } from "lucide-react";

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
    <div className="mb-8">
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
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
};

const QuickStatus: React.FC = () => {
  // Mock data
  const stats = {
    battery: {
      percentage: 85,
      color: "#10b981",
    },
    temperature: {
      value: 28,
      unit: "°C",
    },
    fillLevel: {
      percentage: 45,
      color: "#06b6d4",
    },
  };

  return (
    <div className="bg-gray-950 flex items-center justify-center">
      <div className="w-full bg-gray-900 rounded-3xl p-8 shadow-2xl card-primary px-5!">
        <h1 className="text-2xl font-bold text-white mb-7.5">Quick Stats</h1>

        <StatItem
          icon={<Battery className="w-5 h-5" />}
          label="Battery Level"
          value={`${stats.battery.percentage}%`}
          percentage={stats.battery.percentage}
          color={stats.battery.color}
        />

        <StatItem
          icon={<Thermometer className="w-5 h-5" />}
          label="Current Temperature"
          value={`${stats.temperature.value}${stats.temperature.unit}`}
          percentage={0}
          color="transparent"
        />

        <StatItem
          icon={<Droplet className="w-5 h-5" />}
          label="Fill Level"
          value={`${stats.fillLevel.percentage}%`}
          percentage={stats.fillLevel.percentage}
          color={stats.fillLevel.color}
        />
      </div>
    </div>
  );
};

export default QuickStatus;
