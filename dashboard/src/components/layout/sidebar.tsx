import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Server,
  Box,
  Database,
  Key,
  Settings,
} from "lucide-react";

import { ClusterSwitcher } from "@/components/layout/cluster-switcher";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/nodes", label: "Nodes", icon: Server },
  { to: "/workloads", label: "Workloads", icon: Box },
  { to: "/volumes", label: "Volumes", icon: Database },
  { to: "/tokens", label: "Tokens", icon: Key },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-55 flex-col border-r border-[#1e1e1e] bg-[#0f0f0f]">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2.5 border-b border-[#1e1e1e] px-5">
        <div className="relative flex size-6 items-center justify-center rounded-[5px] bg-primary">
          <div className="size-2 rounded-[1px] bg-[#0a0a0a]" />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          Kompute
        </span>
      </div>

      {/* Cluster switcher */}
      <div className="border-b border-[#1e1e1e] px-3 py-3">
        <ClusterSwitcher />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "absolute inset-y-1 left-0 w-0.5 rounded-r-full bg-primary transition-opacity",
                        isActive ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <item.icon className="size-4" />
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Account */}
      <div className="border-t border-[#1e1e1e] p-3">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-2 hover:bg-surface-elevated">
          <div className="flex size-7 items-center justify-center rounded-full bg-primary/20 text-[11px] font-semibold text-primary">
            MK
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium text-foreground">
              michael
            </div>
            <div className="truncate text-[11px] text-muted-foreground">
              root@kompute.local
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
