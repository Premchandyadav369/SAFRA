import asyncio
import time
from typing import Dict, Any, List, Optional
from datetime import datetime

from app.services.simulation_engine import simulation_engine
from app.ai.gemma_client import safra_ai_provider

class ScenarioManager:
    """
    Manages Scenario Injections, Scripted 3-Minute Buildathon Demonstrations, and Temporal Replay Sessions.
    """

    def __init__(self):
        self.active_demo_task: Optional[asyncio.Task] = None
        self.demo_current_phase = "IDLE"
        self.demo_elapsed_seconds = 0

    async def inject_scenario(self, scenario_name: str, **kwargs) -> Dict[str, Any]:
        """
        Injects failure or traffic scenario into the live simulation engine and generates root cause hypothesis.
        """
        simulation_engine.set_scenario(scenario_name, **kwargs)
        kpis = simulation_engine.get_live_kpis()

        # Generate structured root cause hypothesis
        if scenario_name == "BANK_OUTAGE":
            hypothesis = (
                "Failure concentration increased around provider HDFC Bank. "
                "CBS timeout rate is 4.2x above baseline. "
                "SAFRA policy automatically engaged WAIT barrier to suppress immediate retries and prevent double charges."
            )
            confidence = 0.94
            rec_action = "WAIT_FOR_CBS_CALLBACK"
        elif scenario_name == "UPI_DEGRADATION":
            hypothesis = (
                "NPCI UPI transit rail acknowledgment delay detected. "
                "Callback latency increased to 1,400ms across 5 providers. "
                "SAFRA policy routing high-value checkout intents to alternate payment methods."
            )
            confidence = 0.89
            rec_action = "ROUTE_ALTERNATE_METHOD"
        elif scenario_name == "FLASH_SALE":
            hypothesis = (
                "5.0x traffic surge on merchant checkout endpoints. "
                "Elevated cart abandonment detected. "
                "SAFRA automated recovery dispatching smart SMS/WhatsApp cart recovery links."
            )
            confidence = 0.92
            rec_action = "SEND_SMART_RECOVERY_LINK"
        else:
            hypothesis = "System operating within nominal baseline parameters across all 8 payment rails."
            confidence = 0.98
            rec_action = "STANDARD_MONITORING"

        return {
            "scenario": scenario_name,
            "traffic_multiplier": simulation_engine.traffic_multiplier,
            "root_cause_hypothesis": hypothesis,
            "ai_confidence": confidence,
            "recommended_bounded_action": rec_action,
            "kpi_snapshot": kpis
        }

    async def run_buildathon_scripted_demo(self):
        """
        Executes a 3-minute scripted realistic demonstration for the Razorpay Buildathon.
        0:00 - Normal payments
        0:30 - Payday traffic surge
        1:00 - Bank switch degradation (HDFC CBS timeout spike)
        1:40 - SAFRA detects anomaly and engages Duplicate Barrier
        2:20 - Automated recovery execution and revenue clearing
        3:00 - Incident stabilization
        """
        self.demo_current_phase = "RUNNING"
        self.demo_elapsed_seconds = 0

        # Phase 1: 00:00 - 00:30 (Normal baseline)
        self.demo_current_phase = "PHASE_1_NORMAL"
        simulation_engine.set_scenario("NORMAL")
        await asyncio.sleep(8)

        # Phase 2: 00:30 - 01:00 (Traffic Surge)
        self.demo_current_phase = "PHASE_2_SURGE"
        simulation_engine.set_scenario("PAYDAY_SURGE", traffic_multiplier=3.5)
        await asyncio.sleep(8)

        # Phase 3: 01:00 - 01:40 (Bank Switch Degradation)
        self.demo_current_phase = "PHASE_3_BANK_OUTAGE"
        simulation_engine.set_scenario("BANK_OUTAGE", bank_latency_ms=1850)
        await asyncio.sleep(10)

        # Phase 4: 01:40 - 02:20 (SAFRA Anomaly & Barrier Engagement)
        self.demo_current_phase = "PHASE_4_BARRIER_ENGAGED"
        await asyncio.sleep(10)

        # Phase 5: 02:20 - 03:00 (Recovery Clearing & Stabilization)
        self.demo_current_phase = "PHASE_5_STABILIZATION"
        simulation_engine.set_scenario("NORMAL")
        await asyncio.sleep(8)

        self.demo_current_phase = "COMPLETED"

    def start_demo_script(self):
        if self.active_demo_task and not self.active_demo_task.done():
            self.active_demo_task.cancel()
        self.active_demo_task = asyncio.create_task(self.run_buildathon_scripted_demo())

scenario_manager = ScenarioManager()
