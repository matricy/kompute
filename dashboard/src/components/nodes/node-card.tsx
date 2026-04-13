import { MoreHorizontal, Eye, Trash2, Pause } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { StatusDot } from "@/components/nodes/status-dot";
import { formatRelativeTime } from "@/lib/utils";
import type { Node, NodeProvider } from "@/types";

const providerLabels: Record<NodeProvider, string> = {
  home: "home",
  digitalocean: "digitalocean",
  hetzner: "hetzner",
  aws: "aws",
};

interface NodeCardProps {
  node: Node;
  onDrain?: (node: Node) => void;
  onRemove?: (node: Node) => void;
  onView?: (node: Node) => void;
}

export function NodeCard({ node, onDrain, onRemove, onView }: NodeCardProps) {
  const memPercent = Math.min(
    100,
    Math.round((node.memory_used_gb / node.memory_gb) * 100)
  );
  const cpuPercent = Math.round(node.cpu_percent);

  return (
    <Card className="group transition-colors hover:border-[#2b2b2b]">
      <div className="flex items-center gap-5 p-5">
        {/* Left: status + identity */}
        <div className="flex min-w-0 flex-[1.2] items-center gap-4">
          <StatusDot status={node.status} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-[15px] font-semibold text-foreground">
                {node.name}
              </span>
              <Badge variant={node.provider}>
                {providerLabels[node.provider]}
              </Badge>
            </div>
            <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <span>{node.region}</span>
              {node.ip_address && (
                <>
                  <span className="text-[#2a2a2a]">·</span>
                  <span>{node.ip_address}</span>
                </>
              )}
              <span className="text-[#2a2a2a]">·</span>
              <span>
                {node.cpu_cores} vCPU · {node.memory_gb.toFixed(0)} GB
              </span>
            </div>
          </div>
        </div>

        {/* CPU */}
        <div className="hidden w-[140px] shrink-0 md:block">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>CPU</span>
            <span className="font-mono tabular-nums text-foreground">
              {cpuPercent}%
            </span>
          </div>
          <Progress value={cpuPercent} className="mt-1.5" />
        </div>

        {/* Memory */}
        <div className="hidden w-[140px] shrink-0 md:block">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>MEM</span>
            <span className="font-mono tabular-nums text-foreground">
              {memPercent}%
            </span>
          </div>
          <Progress value={memPercent} className="mt-1.5" />
        </div>

        {/* Meta */}
        <div className="hidden w-[120px] shrink-0 text-right lg:block">
          <div className="text-[13px] text-foreground">
            {node.workload_count} workload{node.workload_count === 1 ? "" : "s"}
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">
            joined {formatRelativeTime(node.joined_at)}
          </div>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(node)}>
              <Eye className="size-3.5" /> View details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDrain?.(node)}
              disabled={node.status !== "online"}
            >
              <Pause className="size-3.5" /> Drain
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive-foreground focus:text-destructive-foreground"
              onClick={() => onRemove?.(node)}
            >
              <Trash2 className="size-3.5" /> Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
