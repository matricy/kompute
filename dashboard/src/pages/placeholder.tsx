import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function PlaceholderPage({
  title,
  description,
  icon: Icon,
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="flex size-10 items-center justify-center rounded-lg bg-surface-elevated text-muted-foreground">
            <Icon className="size-5" />
          </div>
          <div className="text-sm font-medium text-foreground">
            Coming soon
          </div>
          <div className="max-w-sm text-xs text-muted-foreground">
            This area of the dashboard isn't wired up yet. The Nodes surface is
            the current focus.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
