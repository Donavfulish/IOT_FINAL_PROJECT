"use client";
import { AlertItem } from "@/components/AlertItem/AlertItem";
import Header from "@/components/Header";
import LoginRedirection from "@/components/LoginRedirection";
import { useGetSystemAlerts } from "@/hook/useNotification";
import React from "react";
import { useEffect, useState } from "react";
import { cleanSocket, createSocket } from "@/lib/socket";

interface Alert {
  title: string;
  message: string;
  time_at: string;
  type: string;
}
const AlertsPage = () => {
  const bin_id = 1;
  const [systemAlerts, setSystemAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    let mounted = true;
    async function fetchSystemAlerts() {
      try {
        const data = await useGetSystemAlerts(bin_id);

        if (mounted) {
          setSystemAlerts(data.result);
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchSystemAlerts();
    const ws = createSocket();
    ws.onmessage = (e) => {
      const payload = JSON.parse(e.data);
      if (payload.id === "fill_level") {
        fetchSystemAlerts();
      }
    };
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <LoginRedirection />
      <Header accountRole="user" />
      <div className="p-8">
        <h1 className="text-3xl text-white font-bold mb-8">System Alerts</h1>
        <div className="grid gap-y-4">
          {systemAlerts &&
            systemAlerts.map((s, index) => <AlertItem key={index} alert={s} />)}
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
