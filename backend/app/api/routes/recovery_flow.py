from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime
import hashlib
import uuid

from app.database.session import get_db
from app.database.models import Transaction, Track03RecoveryAction, AuditEvent, BatchRun, AIExplanation, BarrierInterception
from app.services.signal_engine import SignalEngine
from app.services.recovery_engine import RecoveryEngine
from app.services.policy_engine import PolicyEngine
from app.services.graph_engine import GraphEngine
from app.services.workflow_executor import WorkflowExecutor
from app.ai.gemma_client import safra_ai_provider

router = APIRouter(tags=["Revenue Recovery Flow"])

class RecoverRequestBody(BaseModel):
    action: Optional[str] = "AUTO"

class ExplainRequestBody(BaseModel):
    question: Optional[str] = None

class AskRequestBody(BaseModel):
    question: str

class InjectTransactionBody(BaseModel):
    amount: float = 4999.0
    currency: str = "INR"
    merchant_name: str = "Zenith Electronics"
    customer_name: str = "Aryan Sharma"
    payment_method: str = "UPI"
    bank: str = "HDFC Bank"
    payment_status: str = "PENDING"
    failure_reason: str = "UPI Callback Timeout (1,420ms latency)"
    retry_count: int = 1
    customer_history_score: float = 0.90
    bank_latency_ms: int = 1420

class BarrierInterceptBody(BaseModel):
    transaction_id: str
    amount: float
    currency: str = "INR"
    customer_id: str
    merchant_id: str = "m_zenith_01"

# 1. GET /api/events
@router.get("/events")
async def get_events(
    status: Optional[str] = None,
    currency: Optional[str] = None,
    failure_reason: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=500),
    db: AsyncSession = Depends(get_db)
):
    query = select(Transaction)
    if status and status.upper() != "ALL":
        query = query.where(Transaction.payment_status == status.upper())
    if currency:
        query = query.where(Transaction.currency == currency.upper())
    if failure_reason:
        query = query.where(Transaction.failure_reason.ilike(f"%{failure_reason}%"))

    # Total count
    count_query = select(func.count()).select_from(query.subquery())
    total_res = await db.execute(count_query)
    total_count = total_res.scalar() or 0

    # Paginated results
    offset = (page - 1) * limit
    paginated_query = query.order_by(desc(Transaction.timestamp)).offset(offset).limit(limit)
    res = await db.execute(paginated_query)
    txns = res.scalars().all()

    return {
        "total": total_count,
        "page": page,
        "limit": limit,
        "events": [
            {
                "id": t.id,
                "timestamp": t.timestamp.isoformat() if t.timestamp else None,
                "merchant": t.merchant_name,
                "customer_name": t.customer_name,
                "customer_segment": t.customer_segment,
                "amount": t.amount,
                "currency": t.currency,
                "payment_method": t.payment_method,
                "payment_status": t.payment_status,
                "checkout_status": t.checkout_status,
                "failure_reason": t.failure_reason,
                "bank": t.bank,
                "retry_count": t.retry_count,
                "customer_history_score": t.customer_history_score,
                "recovery_probability": t.recovery_probability,
                "estimated_recovery_value": t.estimated_recovery_value,
                "recommended_action": t.recommended_action,
                "actual_outcome": t.actual_outcome,
                "signals": t.signals
            }
            for t in txns
        ]
    }

# 2. GET /api/metrics
@router.get("/metrics")
async def get_dashboard_metrics(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Transaction))
    txns = res.scalars().all()

    total_events = len(txns)
    events_at_risk = len([t for t in txns if t.payment_status in ["PENDING", "FAILED", "ABANDONED"]])
    
    total_revenue_at_risk_inr = sum(t.amount if t.currency == "INR" else t.amount * 84 for t in txns if t.payment_status in ["PENDING", "FAILED", "ABANDONED"])
    estimated_recoverable_inr = sum(t.estimated_recovery_value if t.currency == "INR" else t.estimated_recovery_value * 84 for t in txns)
    recovered_revenue_inr = sum(t.amount if t.currency == "INR" else t.amount * 84 for t in txns if t.actual_outcome == "RECOVERED")
    
    stopped_safely_count = len([t for t in txns if t.actual_outcome == "STOPPED_SAFELY"])
    escalated_count = len([t for t in txns if t.actual_outcome == "ESCALATED"])

    return {
        "total_events": total_events,
        "events_at_risk": events_at_risk,
        "total_revenue_at_risk_inr": round(total_revenue_at_risk_inr, 2),
        "estimated_recoverable_inr": round(estimated_recoverable_inr, 2),
        "recovered_revenue_inr": round(recovered_revenue_inr, 2),
        "stopped_safely_count": stopped_safely_count,
        "escalated_count": escalated_count,
        "recovery_velocity": "+82.4%"
    }

# 3. POST /api/events/inject (Interactive Chaos Sandbox Injection)
@router.post("/events/inject")
async def inject_event(body: InjectTransactionBody, db: AsyncSession = Depends(get_db)):
    txn_id = f"CHAOS-{uuid.uuid4().hex[:8].upper()}"
    
    # Create transient model to run engines
    temp_txn = Transaction(
        id=txn_id,
        timestamp=datetime.utcnow(),
        merchant_id="m_chaos_01",
        merchant_name=body.merchant_name,
        customer_id=f"cust_{uuid.uuid4().hex[:6]}",
        customer_name=body.customer_name,
        customer_segment="HIGH_VALUE" if body.customer_history_score > 0.8 else "STANDARD",
        amount=body.amount,
        currency=body.currency,
        payment_method=body.payment_method,
        payment_status=body.payment_status,
        checkout_status="BANK_DEBITED_AWAITING_WEBHOOK" if "timeout" in body.failure_reason.lower() else "FAILED",
        failure_reason=body.failure_reason,
        bank=body.bank,
        retry_count=body.retry_count,
        customer_history_score=body.customer_history_score,
        actual_outcome="UNDER_INVESTIGATION"
    )

    signals = SignalEngine.extract_signals(temp_txn)
    recovery_score = RecoveryEngine.calculate_score(temp_txn, signals)
    policy_eval = PolicyEngine.evaluate(temp_txn, signals, recovery_score)

    temp_txn.signals = signals
    temp_txn.risk_score = recovery_score["risk_score"]
    temp_txn.recovery_probability = recovery_score["recovery_probability"]
    temp_txn.estimated_recovery_value = recovery_score["estimated_recovery_value"]
    temp_txn.recommended_action = policy_eval["decision"]

    db.add(temp_txn)

    # Add Initial Audit Event
    audit = AuditEvent(
        id=f"aud_{txn_id}_init",
        transaction_id=txn_id,
        event_type="CHAOS_INJECTION",
        message=f"Chaos transaction injected with failure: {body.failure_reason}",
        details=f"P(Recovery)={recovery_score['recovery_probability']:.2f}, Action={policy_eval['decision']}",
        timestamp=datetime.utcnow()
    )
    db.add(audit)
    await db.commit()

    graph = GraphEngine.build_graph(temp_txn)

    return {
        "transaction_id": txn_id,
        "status": "INJECTED_AND_EVALUATED",
        "evaluated_action": policy_eval["decision"],
        "recovery_probability": recovery_score["recovery_probability"],
        "signals": signals,
        "score_breakdown": recovery_score["score_breakdown"],
        "stopping_rule": policy_eval["stopping_rule_triggered"],
        "graph": graph
    }

# 4. GET /api/events/{event_id}
@router.get("/events/{event_id}")
async def get_event_details(event_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Transaction).where(Transaction.id == event_id))
    txn = res.scalar_one_or_none()
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return txn

# 5. GET /api/events/{event_id}/graph
@router.get("/events/{event_id}/graph")
async def get_event_graph(event_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Transaction).where(Transaction.id == event_id))
    txn = res.scalar_one_or_none()
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return GraphEngine.build_graph(txn)

# 6. POST /api/events/{event_id}/recover
@router.post("/events/{event_id}/recover")
async def recover_event(
    event_id: str,
    body: Optional[RecoverRequestBody] = None,
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Transaction).where(Transaction.id == event_id))
    txn = res.scalar_one_or_none()
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")

    requested_action = body.action if body else "AUTO"
    try:
        result = await WorkflowExecutor.execute_recovery(txn, requested_action, db)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# 7. GET /api/events/{event_id}/audit
@router.get("/events/{event_id}/audit")
async def get_event_audit(event_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(
        select(AuditEvent).where(AuditEvent.transaction_id == event_id).order_by(AuditEvent.timestamp)
    )
    events = res.scalars().all()
    return {
        "transaction_id": event_id,
        "audit_trail": [
            {
                "id": a.id,
                "event_type": a.event_type,
                "message": a.message,
                "details": a.details,
                "timestamp": a.timestamp.isoformat() if a.timestamp else None
            }
            for a in events
        ]
    }

# 8. POST /api/events/{event_id}/ask (Copilot Q&A with Google Gemma 3)
@router.post("/events/{event_id}/ask")
async def ask_copilot_about_event(
    event_id: str,
    body: AskRequestBody,
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Transaction).where(Transaction.id == event_id))
    txn = res.scalar_one_or_none()
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")

    signals = SignalEngine.extract_signals(txn)
    recovery_score = RecoveryEngine.calculate_score(txn, signals)
    policy_eval = PolicyEngine.evaluate(txn, signals, recovery_score)

    context = {
        "transaction_id": txn.id,
        "amount": txn.amount,
        "currency": txn.currency,
        "status": txn.payment_status,
        "failure_reason": txn.failure_reason,
        "bank": txn.bank,
        "retry_count": txn.retry_count,
        "customer_purchase_history": "high" if txn.customer_history_score > 0.7 else "standard",
        "recovery_probability": recovery_score["recovery_probability"],
        "allowed_actions": policy_eval["allowed_actions"],
        "selected_action": policy_eval["decision"]
    }

    answer = await safra_ai_provider.answer_event_question(context, body.question)

    # Persist explanation
    ai_record = AIExplanation(
        id=f"ai_q_{txn.id}_{int(datetime.utcnow().timestamp())}",
        transaction_id=txn.id,
        model_name="google/gemma-3-12b-it",
        prompt_context=context,
        explanation=answer,
        question=body.question,
        created_at=datetime.utcnow()
    )
    db.add(ai_record)
    await db.commit()

    return {
        "transaction_id": event_id,
        "question": body.question,
        "answer": answer,
        "model": "google/gemma-3-12b-it"
    }

# 9. POST /api/barrier/intercept & GET /api/barrier/logs
@router.post("/barrier/intercept")
async def log_barrier_interception(body: BarrierInterceptBody, db: AsyncSession = Depends(get_db)):
    collision_hash = hashlib.sha256(
        f"{body.merchant_id}:{body.customer_id}:{body.amount}:{int(datetime.utcnow().timestamp() // 60)}".encode()
    ).hexdigest()

    record = BarrierInterception(
        id=f"bar_{uuid.uuid4().hex[:8]}",
        transaction_id=body.transaction_id,
        collision_hash=collision_hash,
        prevented_amount=body.amount,
        currency=body.currency,
        customer_id=body.customer_id,
        merchant_id=body.merchant_id,
        interception_reason="Duplicate payment barrier engaged: prevented double-debit during bank settlement delay"
    )
    db.add(record)
    await db.commit()

    return {
        "status": "INTERCEPTED_AND_LOGGED",
        "interception_id": record.id,
        "collision_hash": collision_hash,
        "prevented_amount": body.amount
    }

@router.get("/barrier/logs")
async def get_barrier_logs(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(BarrierInterception).order_by(desc(BarrierInterception.created_at)).limit(20))
    logs = res.scalars().all()
    return {
        "total_prevented_inr": sum(l.prevented_amount for l in logs),
        "interceptions_count": len(logs),
        "logs": [
            {
                "id": l.id,
                "transaction_id": l.transaction_id,
                "collision_hash": l.collision_hash,
                "prevented_amount": l.prevented_amount,
                "currency": l.currency,
                "customer_id": l.customer_id,
                "merchant_id": l.merchant_id,
                "reason": l.interception_reason,
                "timestamp": l.created_at.isoformat() if l.created_at else None
            }
            for l in logs
        ]
    }

# 10. POST /api/batch/run
@router.post("/batch/run")
async def run_batch_simulation(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Transaction))
    txns = res.scalars().all()

    total_events = len(txns)
    events_at_risk = 0
    total_risk_val = 0.0
    recovered_val = 0.0
    interventions_used = 0
    stopped_safely = 0
    escalated = 0

    for t in txns:
        is_at_risk = t.payment_status in ["PENDING", "FAILED", "ABANDONED"]
        if is_at_risk:
            events_at_risk += 1
            amt_inr = t.amount if t.currency == "INR" else t.amount * 84
            total_risk_val += amt_inr

        # Perform bounded workflow simulation
        signals = SignalEngine.extract_signals(t)
        score = RecoveryEngine.calculate_score(t, signals)
        policy = PolicyEngine.evaluate(t, signals, score)

        if policy["decision"] == "STOP":
            stopped_safely += 1
            t.actual_outcome = "STOPPED_SAFELY"
        elif policy["decision"] == "ESCALATE":
            escalated += 1
            t.actual_outcome = "ESCALATED"
        elif score["recovery_probability"] >= 0.40:
            interventions_used += 1
            amt_inr = t.amount if t.currency == "INR" else t.amount * 84
            recovered_val += amt_inr
            t.actual_outcome = "RECOVERED"
            t.payment_status = "RECOVERED"
        else:
            t.actual_outcome = "CUSTOMER_DECLINED"

    await db.commit()

    batch_run = BatchRun(
        id=f"batch_{int(datetime.utcnow().timestamp())}",
        total_events=total_events,
        events_at_risk=events_at_risk,
        total_revenue_at_risk=total_risk_val,
        estimated_recoverable=total_risk_val * 0.76,
        recovered_revenue=recovered_val,
        recovery_rate=round(recovered_val / max(1.0, total_risk_val), 3),
        interventions_used=interventions_used,
        cases_stopped_safely=stopped_safely,
        cases_escalated=escalated,
        created_at=datetime.utcnow()
    )
    db.add(batch_run)
    await db.commit()

    return {
        "batch_id": batch_run.id,
        "total_events": total_events,
        "events_at_risk": events_at_risk,
        "total_revenue_at_risk": round(total_risk_val, 2),
        "recovered_revenue": round(recovered_val, 2),
        "recovery_rate": f"{batch_run.recovery_rate * 100:.1f}%",
        "interventions_used": interventions_used,
        "cases_stopped_safely": stopped_safely,
        "cases_escalated": escalated
    }
