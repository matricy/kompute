import { Link } from "react-router-dom";
import { Check, ChevronsUpDown, Plus, Settings2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClusters } from "@/context/cluster-context";

export function ClusterSwitcher() {
  const { clusters, currentCluster, setCurrentClusterId } = useClusters();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group flex w-full items-center gap-2 rounded-md border border-[#1e1e1e] bg-[#0a0a0a] px-2.5 py-2 text-left transition-colors hover:border-[#2a2a2a] hover:bg-surface-elevated"
        >
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-medium text-foreground">
              {currentCluster?.name ?? "No cluster"}
            </div>
            <div className="truncate font-mono text-[10px] text-muted-foreground">
              {currentCluster?.id ?? "select a cluster"}
            </div>
          </div>
          <ChevronsUpDown className="size-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-50">
        <DropdownMenuLabel>Clusters</DropdownMenuLabel>
        {clusters.map((c) => {
          const isActive = c.id === currentCluster?.id;
          return (
            <DropdownMenuItem
              key={c.id}
              onSelect={() => setCurrentClusterId(c.id)}
              className="flex items-center gap-2"
            >
              <span className="flex-1 truncate text-[13px]">{c.name}</span>
              {isActive && <Check className="size-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/clusters" className="flex items-center gap-2">
            <Settings2 className="size-3.5" />
            Manage clusters
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/clusters?new=1" className="flex items-center gap-2">
            <Plus className="size-3.5" />
            Create cluster
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
