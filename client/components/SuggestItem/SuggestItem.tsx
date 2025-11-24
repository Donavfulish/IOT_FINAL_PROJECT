import React from "react";

export const SuggestItem = (onClick: () => {}) => {
  return (
    <div
      onClick={() => onClick}
      className="w-full h-full relative bg-[#171D23] text-white hover:cursor-pointer"
    >
      <div className=" p-4">
        <div className="flex flex-col">
          <p className="font-semibold text-[16px]">BIN-{23123}</p>
        </div>
        <div className="grid grid-cols-3 mt-4">
          <div>
            <p className="font-semibold text-[14px]">Fill Level: {45}%</p>
          </div>
          <div>
            <p className="font-semibold text-[14px]">Battery: {15}%</p>
          </div>
          <div>
            <p className="font-semibold text-[14px]">Temp: {15}C</p>
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <span className="inline-block px-2 py-1 rounded-md text-xs font-semibold border bg-[#5DE29A]/20 text-[#5DE29A] border-[#5DE29A]/40">
          ✓
        </span>
      </div>
    </div>
  );
};
