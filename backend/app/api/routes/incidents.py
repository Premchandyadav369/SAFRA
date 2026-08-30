from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Dict, Any
from app.database.session import get_db
from app.database.models import FinancialIncident
from app.schemas.investigation import IncidentOut, BlastRadiusResponse
from app.services.blast_radius import BlastRadiusService
from app.services.counterfactual import CounterfactualService

router = APIRouter(prefix="/incidents", tags=["Incidents"])

@router.get("", response_model=List[IncidentOut])
async def list_incidents(db: AsyncSession = Depends(get_db)):
    stmt = select(FinancialIncident).order_by(desc(FinancialIncident.created_at))
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{incident_id}", response_model=IncidentOut)
async def get_incident(incident_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(FinancialIncident).where((FinancialIncident.id == incident_id) | (FinancialIncident.incident_reference == incident_id))
    result = await db.execute(stmt)
    incident = result.scalar_one_or_none()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident

@router.get("/{incident_id}/blast-radius", response_model=BlastRadiusResponse)
async def get_incident_blast_radius(incident_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(FinancialIncident).where((FinancialIncident.id == incident_id) | (FinancialIncident.incident_reference == incident_id))
    result = await db.execute(stmt)
    incident = result.scalar_one_or_none()
    if not incident:
        # Fallback dynamic blast radius for demo
        return BlastRadiusService.calculate_incident_blast_radius("HDFC Bank", 1842, 4270000.0, 47)

    return BlastRadiusService.calculate_incident_blast_radius(
        affected_bank=incident.affected_bank or "HDFC Bank",
        current_pending_count=incident.affected_transactions,
        current_exposure_amount=incident.estimated_exposure,
        affected_merchants=incident.affected_merchants
    )

@router.get("/{incident_id}/counterfactual")
async def get_incident_counterfactual(incident_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(FinancialIncident).where((FinancialIncident.id == incident_id) | (FinancialIncident.incident_reference == incident_id))
    result = await db.execute(stmt)
    incident = result.scalar_one_or_none()
    if not incident:
        return CounterfactualService.evaluate_causality(1842, "HDFC Bank", 0.021)

    return CounterfactualService.evaluate_causality(
        observed_pending=incident.affected_transactions,
        affected_bank=incident.affected_bank or "HDFC Bank",
        baseline_rate=0.021
    )
