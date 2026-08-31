import asyncio
import io
import csv
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, HTTPException, Query, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.simulation import (
    large_scale_engine,
    IncidentLibrary,
    MerchantProfiles,
    RecoveryQueuePrioritizer,
    ExperimentEngine,
    FlagshipTenCroreDay
)

router = APIRouter(prefix="/simulation", tags=["Large-Scale Payment Simulation Control Room"])

class SimulationControlRequest(BaseModel):
    action: str  # PLAY, PAUSE, RESET, STEP

class SpeedRequest(BaseModel):
    speed: float  # 1, 5, 10, 50, 100, 1000

class ScaleRequest(BaseModel):
    scale: str  # LEVEL_1_DEMO, LEVEL_2_MERCHANT_DAY, LEVEL_3_HIGH_VOLUME, LEVEL_4_STRESS_TEST, LEVEL_5_INCIDENT_MODE

class SeedRequest(BaseModel):
    seed: str

class MerchantRequest(BaseModel):
    merchant_profile: str

class IncidentInjectRequest(BaseModel):
    incident_type: str
    severity: float  # 0.0 to 1.0
    duration_minutes: float
    target_provider: Optional[str] = None

class PrioritizeQueueRequest(BaseModel):
    max_interventions_per_min: Optional[int] = 500
    recovery_budget_inr: Optional[float] = 50000.0

class MonteCarloRequest(BaseModel):
    scenario: Optional[str] = "PAYDAY_SURGE"
    num_runs: Optional[int] = 50

@router.get("/status")
async def get_simulation_status():
    """
    Returns complete real-time telemetry from large-scale discrete event engine.
    """
    return large_scale_engine.get_summary_kpis()

@router.post("/control")
async def control_simulation(body: SimulationControlRequest):
    act = body.action.upper()
    if act == "PLAY":
        if not large_scale_engine.is_playing:
            large_scale_engine.is_playing = True
            if not large_scale_engine.background_task or large_scale_engine.background_task.done():
                large_scale_engine.background_task = asyncio.create_task(large_scale_engine.run_simulation_loop())
    elif act == "PAUSE":
        large_scale_engine.is_playing = False
    elif act == "RESET":
        large_scale_engine.reset_state()
    elif act == "STEP":
        await large_scale_engine.step_simulation_tick(1.0 * large_scale_engine.virtual_speed)
    return {"status": "SUCCESS", "current_action": act, "is_playing": large_scale_engine.is_playing}

@router.post("/speed")
async def set_simulation_speed(body: SpeedRequest):
    large_scale_engine.set_virtual_speed(body.speed)
    return {"status": "UPDATED", "virtual_speed": large_scale_engine.virtual_speed}

@router.post("/scale")
async def set_simulation_scale(body: ScaleRequest):
    large_scale_engine.set_scale(body.scale)
    return {"status": "UPDATED", "scale": large_scale_engine.simulation_scale}

@router.post("/seed")
async def set_simulation_seed(body: SeedRequest):
    large_scale_engine.set_seed(body.seed)
    return {"status": "RE_SEEDED", "seed": large_scale_engine.seed}

@router.post("/merchant")
async def set_merchant_profile(body: MerchantRequest):
    large_scale_engine.set_merchant_profile(body.merchant_profile)
    return {"status": "UPDATED", "merchant_profile": large_scale_engine.merchant_profile_key}

@router.post("/scenario/select")
async def select_scenario(scenario_key: str = Query(...)):
    large_scale_engine.set_scenario(scenario_key)
    return {"status": "SCENARIO_SELECTED", "active_scenario": large_scale_engine.active_scenario}

@router.post("/incident/inject")
async def inject_incident(body: IncidentInjectRequest):
    large_scale_engine.inject_custom_incident(
        incident_type=body.incident_type,
        severity=body.severity,
        duration_mins=body.duration_minutes,
        target_provider=body.target_provider
    )
    return {
        "status": "INCIDENT_INJECTED",
        "incident": large_scale_engine.injected_incident
    }

@router.post("/prioritize-queue")
async def prioritize_recovery_queue(body: PrioritizeQueueRequest):
    queue = list(large_scale_engine.failed_queue)
    if not queue:
        # Fallback realistic sample queue for testing
        queue = [
            {"transaction_id": "txn_sample_1", "amount": 84200.0, "recovery_probability": 0.84, "customer_fatigue": 15, "customer_loyalty": 0.92},
            {"transaction_id": "txn_sample_2", "amount": 62500.0, "recovery_probability": 0.68, "customer_fatigue": 22, "customer_loyalty": 0.88},
            {"transaction_id": "txn_sample_3", "amount": 4999.0, "recovery_probability": 0.85, "customer_fatigue": 10, "customer_loyalty": 0.95},
            {"transaction_id": "txn_sample_4", "amount": 1499.0, "recovery_probability": 0.72, "customer_fatigue": 85, "customer_loyalty": 0.40}
        ]

    res = RecoveryQueuePrioritizer.prioritize_and_allocate(
        queue=queue,
        max_interventions_per_min=body.max_interventions_per_min or 500,
        recovery_budget_inr=body.recovery_budget_inr or 50000.0
    )
    return res

@router.post("/experiments/multi-strategy")
async def evaluate_multi_strategies():
    queue = list(large_scale_engine.failed_queue)
    if not queue:
        queue = [
            {"transaction_id": f"txn_b_{i}", "amount": float((i * 1200) % 25000 + 499), "recovery_probability": 0.76}
            for i in range(1, 40)
        ]
    return ExperimentEngine.evaluate_multi_strategy_comparison(queue)

@router.post("/experiments/monte-carlo")
async def run_monte_carlo(body: MonteCarloRequest):
    return ExperimentEngine.run_monte_carlo_experiment(
        scenario_name=body.scenario or "PAYDAY_SURGE",
        num_runs=body.num_runs or 50
    )

@router.get("/flagship/10crore-day")
async def get_flagship_scenario_report():
    return FlagshipTenCroreDay.get_summary_report()

@router.get("/report/download")
async def download_simulation_report(format: str = Query("json", description="json or csv")):
    kpis = large_scale_engine.get_summary_kpis()
    if format == "csv":
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["metric", "value"])
        for k, v in kpis.items():
            if k != "recent_events":
                writer.writerow([k, str(v)])
        output.seek(0)
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode("utf-8")),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=safra_simulation_report.csv"}
        )
    return {
        "report_type": "SAFRA_LARGE_SCALE_SIMULATION_REPORT",
        "environment": "SIMULATED PAYMENT INTELLIGENCE ENVIRONMENT",
        "kpis": kpis
    }
