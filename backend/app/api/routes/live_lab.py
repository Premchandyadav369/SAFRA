from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any

from app.services.simulation_engine import simulation_engine
from app.services.scenario_manager import scenario_manager

router = APIRouter(prefix="/lab", tags=["Simulated Payment Intelligence Lab Controls"])

class ScenarioTriggerRequest(BaseModel):
    scenario: str
    traffic_multiplier: Optional[float] = None
    bank_latency_ms: Optional[int] = None
    timeout_rate: Optional[float] = None
    failure_rate: Optional[float] = None

class FatigueCalculationRequest(BaseModel):
    messages_sent: int
    retry_count: int
    minutes_since_last_intervention: float
    previous_complaints: int

class ImpactCalculationRequest(BaseModel):
    amount: float
    recovery_probability: float
    intervention_cost: Optional[float] = 42.0

@router.get("/status")
async def get_live_lab_status():
    """
    Returns live dynamic KPI calculations and streaming simulation state.
    """
    return {
        "engine_status": "RUNNING" if simulation_engine.is_running else "INITIALIZING",
        "label": "SIMULATED PAYMENT ENVIRONMENT",
        "kpis": simulation_engine.get_live_kpis(),
        "scripted_demo_phase": scenario_manager.demo_current_phase
    }

@router.post("/scenario/trigger")
async def trigger_simulation_scenario(body: ScenarioTriggerRequest):
    """
    Injects realistic failure scenarios (BANK_OUTAGE, FLASH_SALE, PAYDAY_SURGE, etc.) into live event stream.
    """
    res = await scenario_manager.inject_scenario(
        scenario_name=body.scenario,
        traffic_multiplier=body.traffic_multiplier,
        bank_latency_ms=body.bank_latency_ms
    )
    return res

@router.post("/demo/start-script")
async def start_buildathon_scripted_demo():
    """
    Triggers the 3-minute scripted Buildathon demonstration sequence.
    """
    scenario_manager.start_demo_script()
    return {
        "status": "SCRIPTED_DEMO_STARTED",
        "timeline": "3 Minutes (Normal -> Payday Surge -> HDFC Outage -> Anomaly Detection -> Stabilization)"
    }

@router.post("/fatigue/calculate")
async def calculate_customer_fatigue_score(body: FatigueCalculationRequest):
    """
    Computes bounded customer fatigue score (0 to 100).
    """
    score = (
        (body.messages_sent * 22) +
        (body.retry_count * 18) +
        (body.previous_complaints * 30) -
        (min(60, body.minutes_since_last_intervention) * 0.4)
    )
    clamped_score = max(0.0, min(100.0, round(score, 1)))

    decision = "EXECUTE"
    if clamped_score >= 80:
        decision = "STOP (FATIGUE_LIMIT_REACHED)"
    elif clamped_score >= 50:
        decision = "WAIT (COOLDOWN_PERIOD)"

    return {
        "customer_fatigue_score": clamped_score,
        "fatigue_level": "CRITICAL" if clamped_score >= 80 else "ELEVATED" if clamped_score >= 50 else "LOW",
        "recommended_bounded_action": decision
    }

@router.post("/impact/calculate")
async def calculate_money_impact(body: ImpactCalculationRequest):
    """
    Computes Expected Net Financial Value for recovery intervention:
    Expected Net Value = (Amount * RecoveryProbability) - InterventionCost
    """
    expected_gross = body.amount * body.recovery_probability
    cost = body.intervention_cost or 42.0
    expected_net = expected_gross - cost

    return {
        "transaction_amount_inr": body.amount,
        "recovery_probability": body.recovery_probability,
        "expected_gross_recovery_inr": round(expected_gross, 2),
        "intervention_cost_inr": cost,
        "expected_net_value_inr": round(expected_net, 2),
        "is_economically_viable": expected_net > 0
    }
