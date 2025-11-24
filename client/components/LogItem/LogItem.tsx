import React from "react";

export const LogItem = () => {
  return (
    <div className="w-full h-full relative bg-[#171D23] text-white hover:cursor-pointer">
      <div className=" p-4">
        <div className="ml-6">
          <p className="text-[16px] font-bold">Status: Operational</p>
          <p className="text-[14px] font-medium  text-[#8B949E]">Time here</p>
        </div>
      </div>
      <div className="absolute top-4 left-6">
        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
      </div>
    </div>
  );
};
