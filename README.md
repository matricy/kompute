# Kompute

Self-hosted compute provisioning platform. A dark, fast, developer-focused
dashboard over a FastAPI control plane. Think Railway / Vercel / Coder for
your own nodes — whether they live in your garage or on a cloud provider.

```
kompute/
├── api/         # FastAPI backend (uv + ruff + ty)
└── dashboard/   # Vite + React + Tailwind + shadcn/ui
```

---

## Prerequisites

- **[uv](https://docs.astral.sh/uv/)** — Python toolchain (replaces pip/venv/poetry)
- **Node 20+** and **npm** — for the dashboard

Install uv with:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

---

## Run it

Two services, two terminals.

### Terminal 1 — API

```bash
cd api
uv sync                       # creates .venv and installs everything
uv run uvicorn main:app --reload --port 8000
```

API is now at `http://localhost:8000` (docs at `/docs`).

### Terminal 2 — Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Dashboard is now at `http://localhost:5173`. Vite proxies `/api` to
`localhost:8000`, and the backend is already CORS-allow-listed for it.

---

## Backend tooling (Astral)

All Python tooling is managed through uv and configured in `api/pyproject.toml`.

| Task                    | Command                     |
| ----------------------- | --------------------------- |
| Install / sync deps     | `uv sync`                   |
| Run the API             | `uv run uvicorn main:app`   |
| Lint                    | `uv run ruff check .`       |
| Auto-fix lint           | `uv run ruff check --fix .` |
| Format                  | `uv run ruff format .`      |
| Type-check              | `uv run ty check .`         |
| Add a runtime dep       | `uv add <package>`          |
| Add a dev dep           | `uv add --dev <package>`    |

Everything is strictly typed. All request and response bodies flow through
Pydantic v2 models in `api/models/` — nothing leaves the API as a loose dict.

---

## API surface

| Method | Path                        | Notes                                     |
| ------ | --------------------------- | ----------------------------------------- |
| GET    | `/api/nodes`                | List all nodes                            |
| GET    | `/api/nodes/{id}`           | Get one node                              |
| POST   | `/api/nodes/provision`      | Mock cloud provision (2s → online)        |
| DELETE | `/api/nodes/{id}`           | Remove node                               |
| POST   | `/api/nodes/{id}/drain`     | Move node to `draining`                   |
| GET    | `/api/cluster/health`       | Cluster status + k3s version              |
| GET    | `/api/workloads`            | (stub)                                    |
| GET    | `/api/tokens`               | (stub)                                    |

The store is in-memory for now and seeds four mock nodes on boot
(`beelink-01`, `do-nyc-1`, `old-thinkpad`, `hetzner-fsn-2`) so the dashboard
has something to render end-to-end.

---

## Frontend

- **React 18 + TypeScript + Vite**
- **React Router v7** in declarative mode (plain SPA, no framework mode)
- **TailwindCSS 3** with a hand-tuned dark-green palette
- **shadcn/ui** (`new-york` style, `neutral` base) adapted to the Kompute theme
- **Lucide** icons, **Geist** / **Geist Mono** typography

The sidebar is persistent and fixed at 220px. The main content sits on the
signature radial-dot grid background. Primary pages:

- `/dashboard` — stat cards, cluster health, activity feed
- `/nodes` — filterable node list with live status dots, provider badges,
  CPU/MEM meters, and an "Add cloud node" sheet that walks through a
  3-step provider → config → provision flow

`/workloads`, `/volumes`, `/tokens`, `/settings` are scaffolded as placeholder
pages.

---

## Project layout

```
api/
├── main.py                 # FastAPI app, CORS, root + health endpoints
├── store.py                # in-memory state with mock seed
├── models/
│   ├── cluster.py          # ClusterHealth, RootInfo
│   ├── node.py             # Node, ProvisionRequest
│   ├── token.py
│   └── workload.py
├── routers/
│   ├── nodes.py            # CRUD + provision + drain
│   ├── tokens.py
│   └── workloads.py
└── pyproject.toml          # uv, ruff, and ty config

dashboard/
├── index.html
├── tailwind.config.ts
├── components.json         # shadcn configuration
└── src/
    ├── App.tsx             # BrowserRouter + routes
    ├── main.tsx
    ├── globals.css         # palette + dot grid + pulse animation
    ├── components/
    │   ├── ui/             # shadcn primitives
    │   ├── layout/         # Sidebar, AppLayout
    │   ├── dashboard/      # StatCard, ActivityFeed, ClusterHealth
    │   └── nodes/          # NodeCard, StatusDot, AddCloudNodeSheet
    ├── pages/              # DashboardPage, NodesPage, placeholders
    ├── data/               # mock nodes, activity, providers
    ├── types/              # shared TS types
    └── lib/utils.ts        # cn(), formatRelativeTime()
```
