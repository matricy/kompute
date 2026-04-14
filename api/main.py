from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from lib.config import load_config
from models import RootInfo
from routers import activity, clusters, nodes, providers, tokens, workloads


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.config = load_config()
    yield


app = FastAPI(title="Kompute API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clusters.router)
app.include_router(nodes.router)
app.include_router(activity.router)
app.include_router(providers.router)
app.include_router(workloads.router)
app.include_router(tokens.router)


@app.get("/", response_model=RootInfo)
async def root() -> RootInfo:
    return RootInfo(service="kompute-api", version="0.1.0")
