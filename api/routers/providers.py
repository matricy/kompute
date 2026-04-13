from __future__ import annotations

from fastapi import APIRouter

from models import ProviderOption, ProviderRegion, ProviderSize

router = APIRouter(prefix="/api/providers", tags=["providers"])

# Static catalog of cloud providers Kompute knows how to provision against.
# For v1 this is hand-seeded; a future version can fetch live regions/sizes from
# each provider's API using the credentials on file for the cloud account.
_PROVIDERS: list[ProviderOption] = [
    ProviderOption(
        id="digitalocean",
        label="DigitalOcean",
        description="Droplets across 14 global regions. Great starter option.",
        regions=[
            ProviderRegion(value="nyc3", label="New York 3 (nyc3)"),
            ProviderRegion(value="sfo3", label="San Francisco 3 (sfo3)"),
            ProviderRegion(value="ams3", label="Amsterdam 3 (ams3)"),
            ProviderRegion(value="fra1", label="Frankfurt 1 (fra1)"),
            ProviderRegion(value="sgp1", label="Singapore 1 (sgp1)"),
        ],
        sizes=[
            ProviderSize(value="s-1vcpu-1gb", label="s-1vcpu-1gb", specs="1 vCPU · 1 GB"),
            ProviderSize(value="s-2vcpu-4gb", label="s-2vcpu-4gb", specs="2 vCPU · 4 GB"),
            ProviderSize(value="s-4vcpu-8gb", label="s-4vcpu-8gb", specs="4 vCPU · 8 GB"),
        ],
    ),
    ProviderOption(
        id="hetzner",
        label="Hetzner Cloud",
        description="Cheap, fast EU nodes. Best price/perf for long-running work.",
        regions=[
            ProviderRegion(value="fsn1", label="Falkenstein (fsn1)"),
            ProviderRegion(value="nbg1", label="Nuremberg (nbg1)"),
            ProviderRegion(value="hel1", label="Helsinki (hel1)"),
            ProviderRegion(value="ash", label="Ashburn, VA (ash)"),
        ],
        sizes=[
            ProviderSize(value="cx21", label="cx21", specs="2 vCPU · 4 GB"),
            ProviderSize(value="cx31", label="cx31", specs="2 vCPU · 8 GB"),
            ProviderSize(value="cx41", label="cx41", specs="4 vCPU · 16 GB"),
        ],
    ),
    ProviderOption(
        id="aws",
        label="AWS EC2",
        description="On-demand EC2 instances. Requires IAM-scoped API key.",
        regions=[
            ProviderRegion(value="us-east-1", label="N. Virginia (us-east-1)"),
            ProviderRegion(value="us-west-2", label="Oregon (us-west-2)"),
            ProviderRegion(value="eu-central-1", label="Frankfurt (eu-central-1)"),
            ProviderRegion(value="ap-southeast-1", label="Singapore (ap-southeast-1)"),
        ],
        sizes=[
            ProviderSize(value="t3.small", label="t3.small", specs="2 vCPU · 2 GB"),
            ProviderSize(value="t3.medium", label="t3.medium", specs="2 vCPU · 4 GB"),
            ProviderSize(value="t3.large", label="t3.large", specs="2 vCPU · 8 GB"),
        ],
    ),
]


@router.get("", response_model=list[ProviderOption])
async def list_providers() -> list[ProviderOption]:
    return _PROVIDERS
