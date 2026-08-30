from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from typing import List, Optional
from app.database.session import get_db
from app.database.models import Payment, PaymentEvent
from app.schemas.payment import PaymentOut, PaymentCreate, DuplicateCheckRequest, DuplicateCheckResponse
from app.services.duplicate_guardian import DuplicatePaymentGuardian

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.get("", response_model=List[PaymentOut])
async def list_payments(
    status: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Payment).options(selectinload(Payment.events)).order_by(desc(Payment.created_at)).limit(limit)
    if status:
        stmt = stmt.where(Payment.status == status)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{payment_id}", response_model=PaymentOut)
async def get_payment(payment_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Payment).options(selectinload(Payment.events)).where(
        (Payment.id == payment_id) | (Payment.payment_reference == payment_id)
    )
    result = await db.execute(stmt)
    payment = result.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@router.get("/{payment_id}/timeline")
async def get_payment_timeline(payment_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Payment).where((Payment.id == payment_id) | (Payment.payment_reference == payment_id))
    result = await db.execute(stmt)
    payment = result.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    stmt_events = select(PaymentEvent).where(PaymentEvent.payment_id == payment.id).order_by(PaymentEvent.event_timestamp)
    ev_res = await db.execute(stmt_events)
    events = ev_res.scalars().all()

    return {
        "payment_id": payment.id,
        "payment_reference": payment.payment_reference,
        "amount": payment.amount,
        "status": payment.status,
        "events": [
            {
                "id": e.id,
                "event_type": e.event_type,
                "source": e.source,
                "status": e.status,
                "latency_ms": e.latency_ms,
                "timestamp": e.event_timestamp.isoformat() if e.event_timestamp else None
            }
            for e in events
        ]
    }

@router.post("/check-duplicate", response_model=DuplicateCheckResponse)
async def check_duplicate_payment(
    req: DuplicateCheckRequest,
    db: AsyncSession = Depends(get_db)
):
    result = await DuplicatePaymentGuardian.analyze_duplicate_risk(
        db=db,
        customer_id=req.customer_id,
        merchant_id=req.merchant_id,
        amount=req.amount,
        payment_method=req.payment_method
    )
    return result
