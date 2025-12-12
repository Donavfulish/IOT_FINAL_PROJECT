"use client";
import { AlertItem } from "@/components/AlertItem/AlertItem";
import Header from "@/components/Header";
import LoginRedirection from "@/components/LoginRedirection";
import { useGetSystemAlerts } from "@/hook/useNotification";
import React from "react";
import { useEffect, useState } from "react";
import { cleanSocket, createSocket } from "@/lib/socket";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useAuthStore } from "@/store/auth.store";

interface Alert {
  title: string;
  message: string;
  time_at: string;
  type: string;
}
const AlertsPage = () => {
  const user = useAuthStore((store) => store.user);
  const [systemAlerts, setSystemAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    let mounted = true;
    async function fetchSystemAlerts() {
      if (!user) return;
      try {
        const data = await useGetSystemAlerts(user.bin_id);

        if (mounted) {
          setSystemAlerts(data.result);
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchSystemAlerts();
    return () => {
      mounted = false;
    };
  }, [user]);

  if (user === undefined) return <LoadingSpinner />;
  if (user && user.role == "guest") {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <p>You don't have the permission to access this page</p>
      </div>
    );
  }

  return (
    <div>
      <LoginRedirection />
      <Header accountRole="user" />
      <div className="p-8">
        <h1 className="text-3xl text-white font-bold mb-8">System Alerts</h1>
        <div className="grid gap-y-4">
          {systemAlerts.length == 0 && <LoadingSpinner />}
          {systemAlerts &&
            systemAlerts.map((s, index) => <AlertItem key={index} alert={s} />)}
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
