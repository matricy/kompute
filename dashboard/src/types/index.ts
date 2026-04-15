export type NodeProvider = "home" | "digitalocean" | "hetzner" | "aws";

export type NodeStatus = "online" | "offline" | "draining" | "provisioning";

export type NodeRole = "control-plane" | "worker";

export type ClusterStatus = "healthy" | "degraded" | "down" | "provisioning";

export interface Cluster {
  id: string;
  name: string;
  status: ClusterStatus;
  version: string;
  created_at: string;
  control_plane_endpoint: string | null;
  labels: Record<string, string>;
}

export interface Node {
  id: string;
  cluster_id: string;
  name: string;
  provider: NodeProvider;
  status: NodeStatus;
  role: NodeRole;
  region: string;
  cpu_cores: number;
  cpu_percent: number;
  memory_gb: number;
  memory_used_gb: number;
  workload_count: number;
  joined_at: string;
  ip_address: string | null;
  labels: Record<string, string>;
}

export interface ClusterHealth {
  status: ClusterStatus;
  node_count: number;
  version: string;
}

export type ActivityLevel = "info" | "warn" | "error";

export interface ActivityEntry {
  id: string;
  cluster_id: string;
  timestamp: string;
  level: ActivityLevel;
  node: string;
  message: string;
}

export interface ProviderOption {
  id: NodeProvider;
  label: string;
  description: string;
  regions: { value: string; label: string }[];
  sizes: { value: string; label: string; specs: string }[];
}

export type CloudProvider = "digital_ocean" | "hetzner" | "aws";

export interface CloudAccount {
  id: string;
  provider: CloudProvider;
  name: string;
  created_at: string;
}

export interface CloudAccountRef {
  id: string;
  provider: CloudProvider;
  keyring_ref: string;
  name: string;
  created_at: string;
}
