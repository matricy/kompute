# Run both API and dashboard
dev:
    just dev-api & just dev-dashboard & wait

# FastAPI backend
dev-api:
    cd api && uv run uvicorn main:app --reload --port 8000

# React dashboard
dev-dashboard:
    cd dashboard && npm run dev

# Install all dependencies
install:
    cd api && uv sync
    cd dashboard && npm install

# Lint and format the backend
lint:
    cd api && uv run ruff check .

fix:
    cd api && uv run ruff check --fix .

fmt:
    cd api && uv run ruff format .

typecheck:
    cd api && uv run ty check .
