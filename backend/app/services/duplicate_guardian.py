import datetime
from typing import Dict, Any, Optional
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import Payment

class DuplicatePaymentGuardian:
    """
    Safeguards consumers and merchants by detecting duplicate payment retry attempts
    within proximity windows for identical or near-identical amounts and merchants.
    """

    @classmethod
    async def analyze_duplicate_risk(
        cls,
        db: AsyncSession,
        customer_id: str,
        merchant_id: str,
        amount: float,
        payment_method: str = "UPI",
        time_window_minutes: int = 30
    ) -> Dict[str, Any]:
        cutoff_time = datetime.datetime.utcnow() - datetime.timedelta(minutes=time_window_minutes)

        # Look for existing pending or recently debited transactions
        stmt = select(Payment).where(
            and_(
                Payment.customer_id == customer_id,
                Payment.merchant_id == merchant_id,
                Payment.created_at >= cutoff_time,
                Payment.status.in_(["PENDING", "UNCERTAIN", "PROCESSING"])
            )
        ).order_by(Payment.created_at.desc())

        result = await db.execute(stmt)
        pending_matches = result.scalars().all()

        if not pending_matches:
            return {
                "is_duplicate_risk": False,
                "similarity_score": 0.0,
                "risk_level": "LOW",
                "recommendation": "SAFE_TO_PROCEED",
                "message": "No conflicting active or pending transactions detected."
            }

        # Take closest pending payment
        matched_payment = pending_matches[0]
        amount_diff = abs(matched_payment.amount - amount)
        
        # Calculate similarity score based on amount, merchant, and time proximity
        amount_similarity = 1.0 if amount_diff == 0 else max(0.0, 1.0 - (amount_diff / amount))
        time_diff_sec = (datetime.datetime.utcnow() - (matched_payment.created_at or datetime.datetime.utcnow())).total_seconds()
        time_proximity = max(0.0, 1.0 - (time_diff_sec / (time_window_minutes * 60)))
        
        similarity_score = (amount_similarity * 0.7) + (time_proximity * 0.3)
        similarity_pct = round(similarity_score * 100, 1)

        is_high_risk = similarity_pct >= 85.0

        return {
            "is_duplicate_risk": is_high_risk,
            "similarity_score": similarity_score,
            "similarity_percentage": similarity_pct,
            "risk_level": "HIGH" if is_high_risk else "MEDIUM",
            "previous_payment": {
                "id": matched_payment.id,
                "reference": matched_payment.payment_reference,
                "amount": matched_payment.amount,
                "status": matched_payment.status,
                "bank": matched_payment.bank,
                "bank_debited": matched_payment.bank_debited,
                "success_probability": matched_payment.success_probability or 0.81,
                "estimated_resolution_minutes": matched_payment.estimated_resolution_minutes or 6.0,
                "created_at": matched_payment.created_at.isoformat() if matched_payment.created_at else None
            },
            "recommendation": "DO_NOT_PAY_AGAIN" if is_high_risk else "PROCEED_WITH_CAUTION",
            "message": (
                f"A previous payment of ₹{matched_payment.amount:,.0f} was initiated {int(time_diff_sec//60)} mins ago "
                f"and is currently pending with {int((matched_payment.success_probability or 0.81)*100)}% likelihood of settling. "
                f"Retrying now has a {similarity_pct}% probability of causing a duplicate charge."
            )
        }
