"use client";
import FlowbiteInit from "@/components/FlowbiteInit";

import { usePathname } from "next/navigation";
import React from "react";

const authRoutes = new Set(["/login", "/register"]);

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  if (authRoutes.has(pathname)) return <>{children}</>;

  return (
    <>
      <FlowbiteInit />
      {children}
    </>
  );
};

export default LayoutWrapper;
