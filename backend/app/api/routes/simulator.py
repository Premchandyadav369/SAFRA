from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any
from pydantic import BaseModel
from app.database.session import get_db, Base, engine
from app.services.simulation_service import SimulationService
from app.api.websockets import ws_manager

router = APIRouter(prefix="/simulator", tags=["Simulator & Controls"])

class InjectIncidentRequest(BaseModel):
    affected_bank: str = "HDFC Bank"
    affected_transactions: int = 1842
    exposure_inr: float = 4270000.0

@router.post("/inject-incident")
async def inject_systemic_incident(
    req: InjectIncidentRequest,
    db: AsyncSession = Depends(get_db)
):
    """Simulates a systemic bank processing latency surge affecting 1,000+ payments."""
    result = await SimulationService.inject_systemic_upi_incident(
        db=db,
        affected_bank=req.affected_bank,
        count=req.affected_transactions,
        exposure=req.exposure_inr
    )
    # Broadcast to WebSocket
    await ws_manager.broadcast({
        "event": "SYSTEMIC_INCIDENT_INJECTED",
        "data": result
    })
    return result

@router.post("/inject-callback-failure")
async def inject_callback_failure(db: AsyncSession = Depends(get_db)):
    """Simulates 24 merchant webhook callback drops to induce financial drift."""
    result = await SimulationService.inject_merchant_callback_failure(db)
    await ws_manager.broadcast({
        "event": "CALLBACK_FAILURE_INJECTED",
        "data": result
    })
    return result

@router.post("/reset-topology")
async def reset_topology(db: AsyncSession = Depends(get_db)):
    """Wipes the database and recreates the pristine canonical SAFRA financial topology."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    await SimulationService.initialize_seed_data(db)
    await ws_manager.broadcast({"event": "TOPOLOGY_RESET", "message": "Pristine topology restored."})
    return {"status": "RESET_SUCCESSFUL", "message": "Database and Graph reset to initial canonical state."}
