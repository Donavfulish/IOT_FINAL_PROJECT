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

interface QuickStatusProps {
  battery: number;
  fillLevel: number;
  // temperature: number; // Uncomment nếu API có trả về nhiệt độ
}

const QuickStatus: React.FC<QuickStatusProps> = ({ battery, fillLevel }) => {
  return (
    <div className="bg-gray-950 flex items-center justify-center">
      <div className="w-full bg-gray-900 rounded-3xl p-8 shadow-2xl card-primary px-5!">
        <h1 className="text-2xl font-bold text-white mb-7.5">Quick Stats</h1>

        <StatItem
          icon={<Battery className="w-5 h-5" />}
          label="Battery Level"
          value={`${battery}%`}
          percentage={battery}
          color={battery < 20 ? "#ef4444" : "#10b981"}
        />

        {/* Placeholder cho Temperature nếu sau này API có */}
        {/* <StatItem
          icon={<Thermometer className="w-5 h-5" />}
          label="Current Temperature"
          value={`-- °C`}
          percentage={0}
          color="transparent"
        /> */}

        <StatItem
          icon={<Droplet className="w-5 h-5" />}
          label="Fill Level"
          value={`${fillLevel}%`}
          percentage={fillLevel}
          color={fillLevel > 80 ? "#ef4444" : "#06b6d4"}
        />
      </div>
    </div>
  );
};

export default QuickStatus;