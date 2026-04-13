import type {
  ActivityEntry,
  Cluster,
  ClusterHealth,
  Node,
  NodeProvider,
  ProviderOption,
} from "@/types";

const BASE = "/api";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      // ignore
    }
    throw new ApiError(res.status, detail);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export interface ProvisionRequest {
  provider: NodeProvider;
  region: string;
  size: string;
  api_key: string;
  name: string;
}

export interface CreateClusterRequest {
  name: string;
  version?: string;
  labels?: Record<string, string>;
}

export const api = {
  listClusters: () => request<Cluster[]>("/clusters"),
  getCluster: (id: string) => request<Cluster>(`/clusters/${id}`),
  createCluster: (req: CreateClusterRequest) =>
    request<Cluster>("/clusters", {
      method: "POST",
      body: JSON.stringify(req),
    }),
  deleteCluster: (id: string) =>
    request<void>(`/clusters/${id}`, { method: "DELETE" }),
  getClusterHealth: (id: string) =>
    request<ClusterHealth>(`/clusters/${id}/health`),

  listProviders: () => request<ProviderOption[]>("/providers"),

  listNodes: (clusterId: string) =>
    request<Node[]>(`/clusters/${clusterId}/nodes`),
  provisionNode: (clusterId: string, req: ProvisionRequest) =>
    request<Node>(`/clusters/${clusterId}/nodes/provision`, {
      method: "POST",
      body: JSON.stringify(req),
    }),
  drainNode: (clusterId: string, nodeId: string) =>
    request<Node>(`/clusters/${clusterId}/nodes/${nodeId}/drain`, {
      method: "POST",
    }),
  removeNode: (clusterId: string, nodeId: string) =>
    request<void>(`/clusters/${clusterId}/nodes/${nodeId}`, {
      method: "DELETE",
    }),

  listActivity: (clusterId: string, limit?: number) => {
    const qs = limit !== undefined ? `?limit=${limit}` : "";
    return request<ActivityEntry[]>(`/clusters/${clusterId}/activity${qs}`);
  },
};
