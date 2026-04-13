import type { ProviderOption } from "@/types";

export const providerOptions: ProviderOption[] = [
  {
    id: "digitalocean",
    label: "DigitalOcean",
    description: "Droplets across 14 global regions. Great starter option.",
    regions: [
      { value: "nyc3", label: "New York 3 (nyc3)" },
      { value: "sfo3", label: "San Francisco 3 (sfo3)" },
      { value: "ams3", label: "Amsterdam 3 (ams3)" },
      { value: "fra1", label: "Frankfurt 1 (fra1)" },
      { value: "sgp1", label: "Singapore 1 (sgp1)" },
    ],
    sizes: [
      { value: "s-1vcpu-1gb", label: "s-1vcpu-1gb", specs: "1 vCPU · 1 GB" },
      { value: "s-2vcpu-4gb", label: "s-2vcpu-4gb", specs: "2 vCPU · 4 GB" },
      { value: "s-4vcpu-8gb", label: "s-4vcpu-8gb", specs: "4 vCPU · 8 GB" },
    ],
  },
  {
    id: "hetzner",
    label: "Hetzner Cloud",
    description: "Cheap, fast EU nodes. Best price/perf for long-running work.",
    regions: [
      { value: "fsn1", label: "Falkenstein (fsn1)" },
      { value: "nbg1", label: "Nuremberg (nbg1)" },
      { value: "hel1", label: "Helsinki (hel1)" },
      { value: "ash", label: "Ashburn, VA (ash)" },
    ],
    sizes: [
      { value: "cx21", label: "cx21", specs: "2 vCPU · 4 GB" },
      { value: "cx31", label: "cx31", specs: "2 vCPU · 8 GB" },
      { value: "cx41", label: "cx41", specs: "4 vCPU · 16 GB" },
    ],
  },
  {
    id: "aws",
    label: "AWS EC2",
    description: "On-demand EC2 instances. Requires IAM-scoped API key.",
    regions: [
      { value: "us-east-1", label: "N. Virginia (us-east-1)" },
      { value: "us-west-2", label: "Oregon (us-west-2)" },
      { value: "eu-central-1", label: "Frankfurt (eu-central-1)" },
      { value: "ap-southeast-1", label: "Singapore (ap-southeast-1)" },
    ],
    sizes: [
      { value: "t3.small", label: "t3.small", specs: "2 vCPU · 2 GB" },
      { value: "t3.medium", label: "t3.medium", specs: "2 vCPU · 4 GB" },
      { value: "t3.large", label: "t3.large", specs: "2 vCPU · 8 GB" },
    ],
  },
];
