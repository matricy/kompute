import { cn, formatRelativeTime } from "@/lib/utils";
import { mockActivity } from "@/data/mock-activity";

const levelColors = {
  info: "text-muted-foreground",
  warn: "text-[#eab308]",
  error: "text-destructive-foreground",
} as const;

export function ActivityFeed() {
  return (
    <ol className="flex flex-col divide-y divide-border-subtle">
      {mockActivity.map((entry) => (
        <li key={entry.id} className="flex items-start gap-3 py-3 first:pt-0">
          <span
            className={cn(
              "mt-[3px] font-mono text-[10px] font-medium uppercase tracking-wider",
              levelColors[entry.level]
            )}
          >
            {entry.level}
          </span>
          <span className="mt-[3px] shrink-0 font-mono text-[11px] text-muted-foreground">
            {formatRelativeTime(entry.timestamp)}
          </span>
          <span className="flex-1 text-sm text-foreground">
            {entry.message}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            {entry.node}
          </span>
        </li>
      ))}
    </ol>
  );
}
