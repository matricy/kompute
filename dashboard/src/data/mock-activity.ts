import type { ActivityEntry } from "@/types";

const now = Date.now();
const minutesAgo = (m: number) => new Date(now - m * 60000).toISOString();

export const mockActivity: ActivityEntry[] = [
  {
    id: "act_01",
    timestamp: minutesAgo(2),
    level: "info",
    node: "do-nyc-1",
    message: "Workload nginx-proxy restarted on do-nyc-1",
  },
  {
    id: "act_02",
    timestamp: minutesAgo(11),
    level: "info",
    node: "beelink-01",
    message: "Pulled image ghcr.io/kompute/runner:2.4.1",
  },
  {
    id: "act_03",
    timestamp: minutesAgo(27),
    level: "warn",
    node: "hetzner-fsn-2",
    message: "Node marked for drain by operator root",
  },
  {
    id: "act_04",
    timestamp: minutesAgo(48),
    level: "info",
    node: "beelink-01",
    message: "Volume pg-data-01 mounted (ext4, 120 GiB)",
  },
  {
    id: "act_05",
    timestamp: minutesAgo(93),
    level: "error",
    node: "old-thinkpad",
    message: "Heartbeat lost — node transitioned offline",
  },
  {
    id: "act_06",
    timestamp: minutesAgo(140),
    level: "info",
    node: "do-nyc-1",
    message: "Workload postgres-15 scheduled (1 replica)",
  },
  {
    id: "act_07",
    timestamp: minutesAgo(201),
    level: "info",
    node: "beelink-01",
    message: "k3s agent reconnected after network blip",
  },
];
