"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const LoginRedirection = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  useEffect(() => {
    if (user === undefined) return;
    if (user === null) router.replace("/login");
  }, [user, router]);

  return <></>;
};

export default LoginRedirection;
