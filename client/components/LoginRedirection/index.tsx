"use client";

import { useAuthStore } from "@/store/auth.store";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const LoginRedirection = () => {
  const user = useAuthStore.getState().user;
  const router = useRouter();
  const pathName = usePathname();
  useEffect(() => {
    if (user === undefined) return;
    if (user === null) router.replace("/login");
    // if (pathName === "/alerts" && user?.role === "guest")
    // router.replace("/login");
  }, [user, router]);

  return <></>;
};

export default LoginRedirection;
