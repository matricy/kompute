import { useEffect, useMemo, useState } from "react";
import { Check, Cloud, Loader2 } from "lucide-react";

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
import { useProviders } from "@/hooks/use-providers";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { NodeProvider } from "@/types";

type Step = "provider" | "config" | "provisioning";

interface AddCloudNodeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clusterId: string | null;
  onProvisioned?: () => void;
}

const provisioningSteps = [
  "Validating API credentials",
  "Reserving instance in region",
  "Creating cloud VM",
  "Installing k3s agent",
  "Joining Kompute cluster",
  "Node online",
];

export function AddCloudNodeSheet({
  open,
  onOpenChange,
  clusterId,
  onProvisioned,
}: AddCloudNodeSheetProps) {
  const [step, setStep] = useState<Step>("provider");
  const [provider, setProvider] = useState<NodeProvider | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [region, setRegion] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [name, setName] = useState("");
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const [provisionError, setProvisionError] = useState<string | null>(null);

  const {
    providers: providerOptions,
    loading: providersLoading,
    error: providersError,
  } = useProviders(open);

  const providerOpt = useMemo(
    () => providerOptions.find((p) => p.id === provider) ?? null,
    [providerOptions, provider]
  );

  useEffect(() => {
    if (!open) {
      // reset after close animation
      const t = setTimeout(() => {
        setStep("provider");
        setProvider(null);
        setApiKey("");
        setRegion("");
        setSize("");
        setName("");
        setCompletedSteps(0);
        setProvisionError(null);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (step !== "provisioning") return;
    if (!clusterId || !provider) return;
    setCompletedSteps(0);
    setProvisionError(null);

    const timers: number[] = [];
    // Local progress animation so the user sees motion while the backend works.
    provisioningSteps.slice(0, -1).forEach((_, i) => {
      timers.push(
        window.setTimeout(() => setCompletedSteps(i + 1), (i + 1) * 700)
      );
    });

    let cancelled = false;
    (async () => {
      try {
        await api.provisionNode(clusterId, {
          provider,
          region,
          size,
          api_key: apiKey,
          name,
        });
        if (cancelled) return;
        setCompletedSteps(provisioningSteps.length);
        onProvisioned?.();
      } catch (e) {
        if (cancelled) return;
        setProvisionError(
          e instanceof Error ? e.message : "provisioning failed"
        );
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach((id) => clearTimeout(id));
    };
  }, [step, clusterId, provider, region, size, apiKey, name, onProvisioned]);

  const canContinueFromConfig =
    Boolean(apiKey) && Boolean(region) && Boolean(size) && Boolean(name);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Cloud className="size-4 text-primary" />
            Add cloud node
          </SheetTitle>
          <SheetDescription>
            Provision a new compute node with one of your cloud providers. The
            node will auto-join the cluster once installed.
          </SheetDescription>
          <StepIndicator step={step} />
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {step === "provider" && providersLoading && (
            <div className="rounded-lg border border-dashed border-border bg-surface/60 p-12 text-center text-sm text-muted-foreground">
              Loading providers…
            </div>
          )}

          {step === "provider" && providersError && !providersLoading && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive-foreground">
              {providersError}
            </div>
          )}

          {step === "provider" && !providersLoading && !providersError && (
            <div className="flex flex-col gap-3">
              {providerOptions.map((p) => (
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
                  <ProviderMark provider={p.id} />
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
          )}

          {step === "config" && providerOpt && (
            <div className="flex flex-col gap-5">
              <Field label="Node name">
                <Input
                  placeholder={`${providerOpt.id}-${providerOpt.regions[0]?.value ?? "node"}-1`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
              <Field label="API key">
                <Input
                  type="password"
                  placeholder="dop_v1_…"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Scoped read/write. Encrypted at rest, never logged.
                </p>
              </Field>
              <Field label="Region">
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pick a region" />
                  </SelectTrigger>
                  <SelectContent>
                    {providerOpt.regions.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Size">
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pick an instance size" />
                  </SelectTrigger>
                  <SelectContent>
                    {providerOpt.sizes.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        <span className="font-mono">{s.label}</span>
                        <span className="ml-2 text-muted-foreground">
                          {s.specs}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          )}

          {step === "provisioning" && (
            <div>
              {provisionError && (
                <div className="mb-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive-foreground">
                  {provisionError}
                </div>
              )}
              <div className="mb-5 flex items-center gap-3 rounded-lg border border-border bg-background/50 p-4">
                {completedSteps < provisioningSteps.length ? (
                  <Loader2 className="size-4 animate-spin text-primary" />
                ) : (
                  <Check className="size-4 text-primary" />
                )}
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">
                    {completedSteps < provisioningSteps.length
                      ? "Provisioning…"
                      : "Node joined cluster"}
                  </div>
                  <div className="font-mono text-[11px] text-muted-foreground">
                    {provider} · {region} · {size}
                  </div>
                </div>
              </div>

              <ol className="flex flex-col gap-1.5">
                {provisioningSteps.map((label, i) => {
                  const done = i < completedSteps;
                  const active = i === completedSteps;
                  return (
                    <li
                      key={label}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 font-mono text-[12px] transition-colors",
                        done && "text-foreground",
                        active && "bg-surface-elevated text-foreground",
                        !done && !active && "text-muted-foreground"
                      )}
                    >
                      {done ? (
                        <Check className="size-3.5 text-primary" />
                      ) : active ? (
                        <Loader2 className="size-3.5 animate-spin text-primary" />
                      ) : (
                        <div className="size-3.5 rounded-full border border-[#2a2a2a]" />
                      )}
                      <span>{label}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>

        <SheetFooter>
          {step === "provider" && (
            <>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                disabled={!provider}
                onClick={() => setStep("config")}
              >
                Continue
              </Button>
            </>
          )}
          {step === "config" && (
            <>
              <Button variant="ghost" onClick={() => setStep("provider")}>
                Back
              </Button>
              <Button
                disabled={!canContinueFromConfig}
                onClick={() => setStep("provisioning")}
              >
                Provision node
              </Button>
            </>
          )}
          {step === "provisioning" && (
            <Button
              disabled={completedSteps < provisioningSteps.length}
              onClick={() => onOpenChange(false)}
            >
              {completedSteps < provisioningSteps.length
                ? "Provisioning…"
                : "Done"}
            </Button>
          )}
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

function StepIndicator({ step }: { step: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: "provider", label: "Provider" },
    { id: "config", label: "Configure" },
    { id: "provisioning", label: "Provision" },
  ];
  const activeIdx = steps.findIndex((s) => s.id === step);
  return (
    <div className="mt-3 flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-5 items-center justify-center rounded-full border text-[10px] font-medium transition-colors",
              i < activeIdx &&
                "border-primary bg-primary text-primary-foreground",
              i === activeIdx && "border-primary text-primary",
              i > activeIdx &&
                "border-[#2a2a2a] text-muted-foreground"
            )}
          >
            {i < activeIdx ? <Check className="size-3" /> : i + 1}
          </div>
          <span
            className={cn(
              "text-[11px] font-medium",
              i === activeIdx ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {s.label}
          </span>
          {i < steps.length - 1 && (
            <div className="h-px w-6 bg-[#2a2a2a]" />
          )}
        </div>
      ))}
    </div>
  );
}

function ProviderMark({ provider }: { provider: NodeProvider }) {
  const styles: Record<NodeProvider, string> = {
    home: "bg-primary/15 text-primary",
    digitalocean: "bg-[#0080ff]/15 text-[#5aa9ff]",
    hetzner: "bg-[#ff6b00]/15 text-[#ffa35a]",
    aws: "bg-[#ff9900]/15 text-[#ffc24d]",
  };
  const letters: Record<NodeProvider, string> = {
    home: "H",
    digitalocean: "DO",
    hetzner: "HZ",
    aws: "AWS",
  };
  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-semibold",
        styles[provider]
      )}
    >
      {letters[provider]}
    </div>
  );
}
