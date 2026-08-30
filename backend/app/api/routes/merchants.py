from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from app.database.session import get_db
from app.database.models import Merchant
from app.services.merchant_twin import MerchantDigitalTwinService
from app.schemas.recovery import MerchantTwinResponse

router = APIRouter(prefix="/merchants", tags=["Merchants & Digital Twin"])

@router.get("/twin", response_model=MerchantTwinResponse)
async def get_default_merchant_twin(merchant_id: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    """Returns Expected Reality vs Observed Reality and ₹73,000 unexplained drift breakdown."""
    data = await MerchantDigitalTwinService.get_merchant_financial_position(db, merchant_id)
    return data

@router.get("")
async def list_merchants(db: AsyncSession = Depends(get_db)):
    stmt = select(Merchant)
    result = await db.execute(stmt)
    return result.scalars().all()
