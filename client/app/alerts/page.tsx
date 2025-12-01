import { AlertItem } from "@/components/AlertItem/AlertItem";
import Header from "@/components/Header";
import React from "react";

const AlertsPage = () => {
  return (
    <div>
      <Header accountRole="user" />
      <div className="p-8">
        <h1 className="text-3xl text-white font-bold mb-8">Systems alerts</h1>
        <div className="grid gap-y-4">
          <AlertItem />
          <AlertItem />
          <AlertItem />
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
