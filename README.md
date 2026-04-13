# Kompute

Self-hosted compute provisioning platform. Control your own nodes,
whether they live in your garage or on a cloud provider.

---

## Prerequisites

- **[uv](https://docs.astral.sh/uv/)** — Python toolchain (replaces pip/venv/poetry)
- **Node 20+** and **npm** — for the dashboard

---

## Run it

### API

```bash
cd api
uv sync
uv run uvicorn main:app --reload --port 8000
```

API is now at `http://localhost:8000` (docs at `/docs`).

### Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Dashboard is now at `http://localhost:5173`. Vite proxies `/api` to
`localhost:8000`, and the backend is already CORS-allow-listed for it.

---

## Backend tooling

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