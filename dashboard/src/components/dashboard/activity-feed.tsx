import { AlertTriangle, CircleAlert, Info } from "lucide-react";

import { cn, formatRelativeTime } from "@/lib/utils";
import type { ActivityEntry, ActivityLevel } from "@/types";

interface ActivityFeedProps {
  entries: ActivityEntry[];
  loading?: boolean;
  error?: string | null;
}

const levelStyles: Record<
  ActivityLevel,
  { icon: typeof Info; dot: string; text: string }
> = {
  info: {
    icon: Info,
    dot: "bg-muted-foreground/60",
    text: "text-muted-foreground",
  },
  warn: {
    icon: AlertTriangle,
    dot: "bg-yellow-500",
    text: "text-yellow-500",
  },
  error: {
    icon: CircleAlert,
    dot: "bg-destructive",
    text: "text-destructive",
  },
};

export function ActivityFeed({ entries, loading, error }: ActivityFeedProps) {
  if (loading && entries.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-muted-foreground">
        Loading activity…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive-foreground">
        {error}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-muted-foreground">
        No recent activity on this cluster.
      </div>
    );
  }

  return (
    <ul className="flex flex-col">
      {entries.map((entry, idx) => {
        const style = levelStyles[entry.level];
        const Icon = style.icon;
        return (
          <li
            key={entry.id}
            className={cn(
              "flex items-start gap-3 py-2.5",
              idx !== entries.length - 1 && "border-b border-border/60"
            )}
          >
            <Icon className={cn("mt-0.5 size-3.5 shrink-0", style.text)} />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] text-foreground">{entry.message}</div>
              <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                <span>{entry.node}</span>
                <span>·</span>
                <span>{formatRelativeTime(entry.timestamp)}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
