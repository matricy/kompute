import { useEffect, useState } from "react";
import { Check, KeyRound, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { CloudProvider } from "@/types";

interface AddCloudAccountSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

const providers: { id: CloudProvider; label: string; description: string }[] = [
  {
    id: "digital_ocean",
    label: "DigitalOcean",
    description: "Provision droplets via the DigitalOcean API.",
  },
  {
    id: "hetzner",
    label: "Hetzner",
    description: "Provision cloud servers via the Hetzner API.",
  },
  {
    id: "aws",
    label: "AWS",
    description: "Provision EC2 instances via the AWS API.",
  },
];

const providerStyles: Record<CloudProvider, string> = {
  digital_ocean: "bg-[#0080ff]/15 text-[#5aa9ff]",
  hetzner: "bg-[#ff6b00]/15 text-[#ffa35a]",
  aws: "bg-[#ff9900]/15 text-[#ffc24d]",
};

const providerLetters: Record<CloudProvider, string> = {
  digital_ocean: "DO",
  hetzner: "HZ",
  aws: "AWS",
};

export function AddCloudAccountSheet({
  open,
  onOpenChange,
  onCreated,
}: AddCloudAccountSheetProps) {
  const [provider, setProvider] = useState<CloudProvider | null>(null);
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setProvider(null);
        setName("");
        setToken("");
        setError(null);
        setSubmitting(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const canSubmit = Boolean(provider) && Boolean(name) && Boolean(token);

  const handleSubmit = async () => {
    if (!provider || !name || !token) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.createCloudAccount({ provider, name, token });
      onCreated?.();
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <KeyRound className="size-4 text-primary" />
            Add cloud account
          </SheetTitle>
          <SheetDescription>
            Connect a cloud provider account. Your API token is stored securely
            in the system keychain.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-5">
            <Field label="Provider">
              <div className="flex flex-col gap-2">
                {providers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProvider(p.id)}
                    className={cn(
                      "flex items-start gap-4 rounded-lg border p-4 text-left transition-colors",
                      provider === p.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-surface hover:border-[#2b2b2b]"
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-semibold",
                        providerStyles[p.id]
                      )}
                    >
                      {providerLetters[p.id]}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">
                        {p.label}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {p.description}
                      </div>
                    </div>
                    {provider === p.id && (
                      <Check className="mt-1 size-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Account name">
              <Input
                placeholder="e.g. production, staging, personal"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                A friendly label to identify this account.
              </p>
            </Field>

            <Field label="API token">
              <Input
                type="password"
                placeholder="dop_v1_…"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Stored in your system keychain. Never logged or transmitted
                beyond initial validation.
              </p>
            </Field>
          </div>

          {error && (
            <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive-foreground">
              {error}
            </div>
          )}
        </div>

        <SheetFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!canSubmit || submitting} onClick={handleSubmit}>
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Validating…
              </>
            ) : (
              "Add account"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
