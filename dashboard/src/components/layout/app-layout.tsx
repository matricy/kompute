import { Outlet } from "react-router-dom";

import { Sidebar } from "@/components/layout/sidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="bg-dot-grid ml-55 min-h-screen">
        <div className="mx-auto max-w-7xl px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
