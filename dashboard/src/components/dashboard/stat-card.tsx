import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: "up" | "down" | "flat";
}

export function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  trendDirection = "flat",
}: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold tabular-nums text-primary">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-medium text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
      {trend && (
        <div
          className={cn(
            "mt-2 text-xs font-medium tabular-nums",
            trendDirection === "up" && "text-primary",
            trendDirection === "down" && "text-destructive-foreground",
            trendDirection === "flat" && "text-muted-foreground"
          )}
        >
          {trend}
        </div>
      )}
    </Card>
  );
}
