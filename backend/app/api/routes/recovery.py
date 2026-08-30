from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Optional
from app.database.session import get_db
from app.database.models import RecoveryAction
from app.services.recovery_service import RecoveryService
from app.schemas.recovery import SimulationScenariosResponse, RecoveryActionOut, ApproveActionRequest

router = APIRouter(prefix="/recovery", tags=["Recovery Lab & Playbooks"])

@router.get("/simulate", response_model=SimulationScenariosResponse)
async def simulate_recovery_scenarios(
    exposure: float = Query(4270000.0, description="Exposure in INR"),
    affected_count: int = Query(1842, description="Affected transactions count")
):
    """Simulates Scenario A (Do Nothing), Scenario B (Notify), and Scenario C (SAFRA Playbook)."""
    return RecoveryService.simulate_incident_scenarios(exposure, affected_count)

@router.get("/actions", response_model=List[RecoveryActionOut])
async def list_recovery_actions(db: AsyncSession = Depends(get_db)):
    stmt = select(RecoveryAction).order_by(desc(RecoveryAction.created_at))
    result = await db.execute(stmt)
    actions = result.scalars().all()
    if not actions:
        # Create initial proposal for demo
        demo_action = await RecoveryService.create_or_get_recovery_proposal(db)
        return [demo_action]
    return actions

@router.post("/actions/{action_id}/approve")
async def approve_recovery_action(
    action_id: str,
    req: ApproveActionRequest,
    db: AsyncSession = Depends(get_db)
):
    """Human-in-the-loop approval: Executes the recommended recovery playbook."""
    result = await RecoveryService.approve_and_execute_action(db, action_id, req.approver_name)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@router.post("/actions/{action_id}/reject")
async def reject_recovery_action(
    action_id: str,
    req: ApproveActionRequest,
    db: AsyncSession = Depends(get_db)
):
    result = await RecoveryService.reject_action(db, action_id, req.approver_name)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result
