"use client";

import { useState } from "react";
import AgentChat from "@/components/AgentChat";
import UpcomingPanel from "@/components/UpcomingPanel";

export default function BookingPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <section className="lg:col-span-3">
        <AgentChat onDataChanged={() => setRefreshKey((k) => k + 1)} />
      </section>
      <section className="lg:col-span-2">
        <UpcomingPanel refreshKey={refreshKey} />
      </section>
    </div>
  );
}
