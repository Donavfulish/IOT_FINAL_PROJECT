import React from "react";
interface Alert {
  bin_id: number;
  title: string;
  message: string;
  time_at: string;
  type: string;
}
interface Props {
  alert: Alert;
}
export const AlertItem = ({ alert }: Props) => {
  const colors = [
    {
      name: "danger",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-circle-alert text-[#FF3B30]"
        >
          <circle cx={12} cy={12} r={10} />
          <line x1={12} x2={12} y1={8} y2={12} />
          <line x1={12} x2="12.01" y1={16} y2={16} />
        </svg>
      ),
      border: "border-[#FF3B30]",
      bg: "bg-[#26151A]",
    },
    {
      name: "warning",
      border: "border-[#FFB86B]",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-triangle-alert text-[#FFB86B]"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      ),

      bg: "bg-[#262120]",
    },
    {
      name: "info",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-info text-[#00C2FF]"
        >
          <circle cx={12} cy={12} r={10} />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      ),

      border: "border-[#00C2FF]",
      bg: "bg-[#0C222F]",
    },
  ];
  const color = colors.filter((item) => item.name === alert.type)[0];
  return (
    <div
      className={` border ${color.border} rounded-xl p-5 flex items-start gap-4  transition-all group cursor-pointer ${color.bg} `}
    >
      <div className="mt-1">{color.icon}</div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-white transition-colors">
          BIN-
          {alert.bin_id}: {alert.title}
        </h4>
        <p className="text-sm text-[#8B949E] mt-1">{alert.message}</p>
        <p className="text-xs text-[#8B949E]  mt-2">
          {new Date(alert.time_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};
