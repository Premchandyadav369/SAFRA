import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.session import engine, Base, AsyncSessionLocal
from app.database import models
from app.data.generate_dataset import seed_dataset_if_empty
from app.api.websockets import ws_manager

# Import API Routers
from app.api.routes.recovery_flow import router as recovery_flow_router
from app.api.routes.payments import router as payments_router
from app.api.routes.investigations import router as investigations_router
from app.api.routes.incidents import router as incidents_router
from app.api.routes.graph import router as graph_router
from app.api.routes.merchants import router as merchants_router
from app.api.routes.recovery import router as recovery_router
from app.api.routes.analytics import router as analytics_router
from app.api.routes.simulator import router as simulator_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[SAFRA] Initializing SAFRA Revenue Recovery Engine (Track 03)...")
    
    # 1. Initialize Database Tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("[SAFRA] Database schema verified.")

    # 2. Seed 500-event realistic synthetic dataset
    async with AsyncSessionLocal() as session:
        await seed_dataset_if_empty(session)

    yield
    print("[SAFRA] Shutting down SAFRA services...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Signal-Aware Financial Revenue Agent: Catch the ₹ slipping before it disappears.",
    version=settings.VERSION,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(recovery_flow_router, prefix=settings.API_PREFIX)
app.include_router(payments_router, prefix=settings.API_PREFIX)
app.include_router(investigations_router, prefix=settings.API_PREFIX)
app.include_router(incidents_router, prefix=settings.API_PREFIX)
app.include_router(graph_router, prefix=settings.API_PREFIX)
app.include_router(merchants_router, prefix=settings.API_PREFIX)
app.include_router(recovery_router, prefix=settings.API_PREFIX)
app.include_router(analytics_router, prefix=settings.API_PREFIX)
app.include_router(simulator_router, prefix=settings.API_PREFIX)

@app.get("/")
async def root():
    return {
        "engine": "SAFRA",
        "track": "Track 03: AI Revenue Recovery",
        "competition": "Razorpay AI Buildathon",
        "tagline": settings.PROJECT_TAGLINE,
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "docs_url": "/docs"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "HEALTHY",
        "engine": "SAFRA",
        "ai_model": settings.HF_MODEL_ID,
        "database": "CONNECTED"
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
