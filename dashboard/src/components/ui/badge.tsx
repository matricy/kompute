import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-ring",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/15 text-primary",
        secondary:
          "border-border bg-surface-elevated text-foreground",
        outline: "border-border text-muted-foreground",
        destructive:
          "border-transparent bg-destructive/20 text-destructive-foreground",
        // Provider colors for node cards
        home: "border-transparent bg-primary/15 text-primary",
        digitalocean:
          "border-transparent bg-[#0080ff]/15 text-[#5aa9ff]",
        hetzner:
          "border-transparent bg-[#ff6b00]/15 text-[#ffa35a]",
        aws: "border-transparent bg-[#ff9900]/15 text-[#ffc24d]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
