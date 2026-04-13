import { cn } from "@/lib/utils";
import type { NodeStatus } from "@/types";

interface StatusDotProps {
  status: NodeStatus;
  className?: string;
}

const statusStyles: Record<NodeStatus, string> = {
  online: "bg-primary",
  offline: "bg-[#404040]",
  draining: "bg-[#eab308]",
  provisioning: "bg-[#3b82f6]",
};

export function StatusDot({ status, className }: StatusDotProps) {
  return (
    <div className={cn("relative flex size-2.5 items-center justify-center", className)}>
      <div
        className={cn(
          "size-2.5 rounded-full",
          statusStyles[status],
          status === "online" && "pulse-green"
        )}
      />
    </div>
  );
}
