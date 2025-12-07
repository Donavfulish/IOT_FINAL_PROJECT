"use client";

import Header from "@/components/Header";
import DetailHeader from "@/components/DetailHeader";
import FlowbiteInit from "@/components/FlowbiteInit";

import { usePathname } from "next/navigation";
import React from "react";
import { useAuthStore } from "@/store/auth.store";
import NotificationSetup from "@/components/NotificationSetup/NotificationSetup";

const authRoutes = new Set(["/login", "/register"]);

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  if (authRoutes.has(pathname)) return <>{children}</>;

  const user = useAuthStore((state) => state.user);

  return (
    <>
      {user?.role == "user" && <NotificationSetup userId={user.id} />}
      <FlowbiteInit />  
      {children}
    </>
  );
};

export default LayoutWrapper;
