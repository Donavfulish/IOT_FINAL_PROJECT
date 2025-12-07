import Link from "next/link";
import React from "react";
import { ArrowLeft } from "lucide-react";

const DetailHeader = () => {
  return (
    <div className="z-100 sticky top-0 flex flex-col gap-2 justify-between items-baseline bg-gray-800/60 backdrop-blur-sm border-b border-b-gray-700 pt-5 pb-4 px-10 select-none">
      <Link
        href="/"
        className="flex flex-row gap-1.5 text-sm text-white hover:text-blue-500 transition-colors duration-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <div className="flex flex-col gap-1">
        <h1 className="text-white text-3xl font-bold">ID: 34567</h1>
        <p className="text-gray-400 text-sm">
          Last updated: 24/11/2025 19:00:00
        </p>
      </div>
    </div>
  );
};

export default DetailHeader;
