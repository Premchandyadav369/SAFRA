import asyncio
import time
import math
import random
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from collections import deque

from app.simulation.distributions import StatisticalDistributions
from app.simulation.profiles import MerchantProfiles, CustomerPopulation
from app.simulation.incidents import IncidentLibrary
from app.simulation.anomaly_detector import DeterministicAnomalyDetector
from app.simulation.recovery_prioritizer import RecoveryQueuePrioritizer
from app.api.websockets import ws_manager

class LargeScalePaymentSimulationEngine:
    """
    Event-driven discrete simulation engine with virtual time clock, seeded PRNG determinism,
    and high-throughput event batching for up to 1,000,000+ payments.
    """

    SCALE_CONFIGS = {
        "LEVEL_1_DEMO": {"target_events": 1000, "base_rate_per_sec": 15},
        "LEVEL_2_MERCHANT_DAY": {"target_events": 25000, "base_rate_per_sec": 80},
        "LEVEL_3_HIGH_VOLUME": {"target_events": 250000, "base_rate_per_sec": 350},
        "LEVEL_4_STRESS_TEST": {"target_events": 1000000, "base_rate_per_sec": 1200},
        "LEVEL_5_INCIDENT_MODE": {"target_events": 150000, "base_rate_per_sec": 500}
    }

    def __init__(self, seed: str = "SAFRA-2026-DEMO"):
        self.seed = seed
        self.prng = random.Random(seed)

        # Virtual Time Engine
        self.sim_clock_seconds = 9.0 * 3600.0  # Starts at 09:00:00
        self.virtual_speed = 1.0  # 1x, 5x, 10x, 50x, 100x, 1000x
        self.is_playing = False
        self.simulation_scale = "LEVEL_1_DEMO"
        self.active_scenario = "NORMAL"

        # Dynamic Incident Injections
        self.injected_incident: Optional[Dict[str, Any]] = None

        # Modules
        self.merchant_profile_key = "DIGITAL_COMMERCE"
        self.customer_population = CustomerPopulation(self.prng, population_size=3000)
        self.anomaly_detector = DeterministicAnomalyDetector()

        # Cumulative & Rolling Analytics
        self.total_events_processed = 0
        self.total_gmv_inr = 0.0
        self.success_count = 0
        self.pending_count = 0
        self.failed_count = 0
        self.recovered_count = 0
        self.revenue_at_risk_inr = 0.0
        self.recovered_revenue_inr = 0.0
        self.duplicates_prevented = 0
        self.interventions_executed = 0

        # Memory bounded event batch buffer for WebSocket streaming
        self.recent_events_batch = deque(maxlen=200)
        self.recent_transactions = deque(maxlen=500)
        self.failed_queue = deque(maxlen=200)
        self.sim_history = deque(maxlen=40)

        self.background_task: Optional[asyncio.Task] = None
        self._init_history()

    def _init_history(self):
        for i in range(20, 0, -1):
            t_sec = max(0, self.sim_clock_seconds - (i * 300))
            hours = int(t_sec // 3600) % 24
            mins = int((t_sec % 3600) // 60)
            self.sim_history.append({
                "time": f"{hours:02d}:{mins:02d}",
                "throughput_per_min": self.prng.randint(45, 80),
                "at_risk_inr": self.prng.randint(80000, 240000),
                "recovered_inr": self.prng.randint(60000, 190000)
            })

    def set_seed(self, new_seed: str):
        """
        Resets and re-seeds PRNG for 100% reproducible deterministic replay.
        """
        self.seed = new_seed
        self.prng = random.Random(new_seed)
        self.customer_population = CustomerPopulation(self.prng, population_size=3000)
        self.reset_state()

    def reset_state(self):
        self.sim_clock_seconds = 9.0 * 3600.0
        self.total_events_processed = 0
        self.total_gmv_inr = 0.0
        self.success_count = 0
        self.pending_count = 0
        self.failed_count = 0
        self.recovered_count = 0
        self.revenue_at_risk_inr = 0.0
        self.recovered_revenue_inr = 0.0
        self.duplicates_prevented = 0
        self.interventions_executed = 0
        self.recent_events_batch.clear()
        self.recent_transactions.clear()
        self.failed_queue.clear()

    def set_virtual_speed(self, speed: float):
        self.virtual_speed = max(0.1, min(1000.0, float(speed)))

    def set_scale(self, scale_key: str):
        if scale_key in self.SCALE_CONFIGS:
            self.simulation_scale = scale_key

    def set_merchant_profile(self, profile_key: str):
        if profile_key in MerchantProfiles.PROFILES:
            self.merchant_profile_key = profile_key

    def set_scenario(self, scenario_key: str):
        self.active_scenario = scenario_key.upper()

    def inject_custom_incident(self, incident_type: str, severity: float, duration_mins: float, target_provider: Optional[str] = None):
        self.injected_incident = {
            "type": incident_type,
            "severity": max(0.0, min(1.0, severity)),
            "duration_seconds": duration_mins * 60.0,
            "remaining_seconds": duration_mins * 60.0,
            "target_provider": target_provider
        }

    def format_sim_time(self) -> str:
        hours = int(self.sim_clock_seconds // 3600) % 24
        mins = int((self.sim_clock_seconds % 3600) // 60)
        secs = int(self.sim_clock_seconds % 60)
        return f"{hours:02d}:{mins:02d}:{secs:02d}"

    async def step_simulation_tick(self, delta_sim_seconds: float):
        """
        Advances virtual simulation time and generates discrete payment lifecycle transitions.
        """
        self.sim_clock_seconds += delta_sim_seconds
        sim_time_str = self.format_sim_time()

        # Check injected incident expiration
        incident_mult_latency = 1.0
        incident_boost_timeout = 0.0
        incident_boost_fail = 0.0
        if self.injected_incident:
            self.injected_incident["remaining_seconds"] -= delta_sim_seconds
            sev = self.injected_incident["severity"]
            incident_mult_latency = 1.0 + (sev * 3.5)
            incident_boost_timeout = sev * 0.40
            incident_boost_fail = sev * 0.35
            if self.injected_incident["remaining_seconds"] <= 0:
                self.injected_incident = None

        # Resolve scenario config
        sc_cfg = IncidentLibrary.get_incident_config(self.active_scenario)
        traffic_mult = sc_cfg.get("traffic_multiplier", 1.0)
        diurnal = StatisticalDistributions.compute_diurnal_multiplier(self.sim_clock_seconds / 3600.0)

        # Merchant Profile
        m_cfg = MerchantProfiles.PROFILES.get(self.merchant_profile_key, MerchantProfiles.PROFILES["DIGITAL_COMMERCE"])

        # Determine number of transactions for this tick
        base_rate = self.SCALE_CONFIGS[self.simulation_scale]["base_rate_per_sec"]
        events_this_tick = max(1, int(base_rate * traffic_mult * diurnal * min(2.0, delta_sim_seconds)))

        generated_batch = []
        bank_stats = {
            "HDFC": {"latency_ms": 650, "timeouts": 0},
            "ICICI": {"latency_ms": 490, "timeouts": 0},
            "SBI": {"latency_ms": 810, "timeouts": 0},
            "Axis": {"latency_ms": 540, "timeouts": 0},
            "Kotak": {"latency_ms": 510, "timeouts": 0},
            "Yes Bank": {"latency_ms": 590, "timeouts": 0}
        }

        # Apply incident latency multipliers to bank stats
        target_p = (self.injected_incident and self.injected_incident.get("target_provider")) or sc_cfg.get("target_provider")
        for b_name in bank_stats:
            b_lat = bank_stats[b_name]["latency_ms"] * sc_cfg.get("latency_multiplier", 1.0) * incident_mult_latency
            if target_p and b_name == target_p:
                b_lat *= 2.2
            bank_stats[b_name]["latency_ms"] = int(b_lat)

        for _ in range(events_this_tick):
            txn_id = f"txn_{self.prng.randint(100000, 999999)}"
            customer = self.customer_population.get_or_sample_customer()

            # Rail selection
            rails = list(m_cfg["rail_weights"].keys())
            weights = list(m_cfg["rail_weights"].values())
            rail = self.prng.choices(rails, weights=weights)[0]

            # Bank selection
            bank_name = self.prng.choice(list(bank_stats.keys()))

            # Amount (Log-normal)
            amount = StatisticalDistributions.generate_log_normal_amount(
                self.prng,
                median=m_cfg["median_order_value"],
                sigma=m_cfg["order_sigma"]
            )

            # Latency (Pareto long-tail)
            base_lat = bank_stats[bank_name]["latency_ms"]
            effective_latency = StatisticalDistributions.generate_pareto_latency(self.prng, base_ms=base_lat)

            # Lifecycle Outcome determination
            base_timeout_prob = 0.015 + sc_cfg.get("timeout_boost", 0.0) + incident_boost_timeout
            base_fail_prob = 0.035 + sc_cfg.get("failure_boost", 0.0) + incident_boost_fail

            if target_p and bank_name == target_p:
                base_timeout_prob += 0.35
                base_fail_prob += 0.20

            roll = self.prng.random()
            is_pending = roll < base_timeout_prob
            is_failure = (not is_pending) and (roll < (base_timeout_prob + base_fail_prob))
            is_success = (not is_pending) and (not is_failure)

            # Duplicate barrier logic
            barrier_active = False
            if is_pending and customer["intervention_fatigue"] > 30 and self.prng.random() < 0.25:
                barrier_active = True
                self.duplicates_prevented += 1

            if is_success:
                status = "SUCCESS"
                rec_action = "NO_ACTION"
                rec_prob = 0.98
                fail_reason = None
                self.success_count += 1
            elif is_pending:
                status = "PENDING"
                rec_action = "WAIT"
                rec_prob = round(self.prng.uniform(0.74, 0.92), 2)
                fail_reason = f"{bank_name} CBS Timeout ({effective_latency}ms)"
                self.pending_count += 1
                self.revenue_at_risk_inr += amount
            else:
                status = "FAILED"
                rec_action = "SEND_RECOVERY_LINK" if customer["intervention_fatigue"] < 60 else "STOP"
                rec_prob = round(self.prng.uniform(0.45, 0.78), 2)
                fail_reason = "3DS2 OTP Drop / Auth Expired" if rail in ["CREDIT_CARD", "DEBIT_CARD"] else "Payment Rejected"
                self.failed_count += 1
                self.revenue_at_risk_inr += amount

            # Record customer outcome
            self.customer_population.record_outcome(
                cid=customer["customer_id"],
                amount=amount,
                success=is_success,
                had_intervention=(rec_action != "NO_ACTION")
            )

            # Automatic SAFRA Recovery execution
            if (status in ["PENDING", "FAILED"]) and (not barrier_active) and (customer["intervention_fatigue"] < 80):
                if self.prng.random() < rec_prob:
                    self.recovered_count += 1
                    self.recovered_revenue_inr += amount
                    self.revenue_at_risk_inr -= amount
                    self.interventions_executed += 1

            record = {
                "transaction_id": txn_id,
                "sim_time": sim_time_str,
                "merchant_type": self.merchant_profile_key,
                "customer_id": customer["customer_id"],
                "customer_segment": customer["segment"],
                "customer_fatigue": customer["intervention_fatigue"],
                "customer_loyalty": customer["payment_success_history"],
                "amount": amount,
                "payment_method": rail,
                "bank": bank_name,
                "latency_ms": effective_latency,
                "status": status,
                "failure_reason": fail_reason,
                "recovery_probability": rec_prob,
                "recommended_action": rec_action,
                "barrier_active": barrier_active
            }

            self.total_events_processed += 1
            self.total_gmv_inr += amount
            generated_batch.append(record)

            if status in ["PENDING", "FAILED"]:
                self.failed_queue.append(record)

        self.recent_events_batch.extend(generated_batch[-20:])
        self.recent_transactions.extend(generated_batch[-50:])

        # Anomaly Detection Step
        avg_lat = sum(b["latency_ms"] for b in bank_stats.values()) / max(1, len(bank_stats))
        current_timeout_rate = base_timeout_prob
        current_fail_rate = base_fail_prob
        anomaly_report = self.anomaly_detector.update_and_detect(
            current_latency=avg_lat,
            current_timeout_rate=current_timeout_rate,
            current_failure_rate=current_fail_rate,
            bank_stats=bank_stats
        )

        # Broadcast EVENT_BATCH over WebSockets
        await ws_manager.broadcast({
            "type": "EVENT_BATCH",
            "batch_size": len(generated_batch),
            "sim_time": sim_time_str,
            "kpis": self.get_summary_kpis(),
            "anomaly_report": anomaly_report
        })

    def get_summary_kpis(self) -> Dict[str, Any]:
        tot = max(1, self.total_events_processed)
        succ = self.success_count + self.recovered_count
        succ_rate = round((succ / tot) * 100, 1)

        return {
            "environment": "SIMULATED PAYMENT INTELLIGENCE ENVIRONMENT",
            "seed": self.seed,
            "sim_time": self.format_sim_time(),
            "virtual_speed": self.virtual_speed,
            "is_playing": self.is_playing,
            "simulation_scale": self.simulation_scale,
            "merchant_profile": self.merchant_profile_key,
            "active_scenario": self.active_scenario,
            "injected_incident": self.injected_incident,
            "total_events_processed": self.total_events_processed,
            "total_gmv_inr": round(self.total_gmv_inr, 2),
            "success_rate_pct": succ_rate,
            "revenue_at_risk_inr": round(self.revenue_at_risk_inr, 2),
            "recovered_revenue_inr": round(self.recovered_revenue_inr, 2),
            "recovery_rate_pct": round((self.recovered_count / max(1, self.pending_count + self.failed_count)) * 100, 1),
            "duplicates_prevented": self.duplicates_prevented,
            "interventions_executed": self.interventions_executed,
            "failed_queue_length": len(self.failed_queue),
            "recent_events": list(self.recent_events_batch)[-15:]
        }

    async def run_simulation_loop(self):
        self.is_playing = True
        print(f"[SAFRA Large-Scale Engine] Running on Seed {self.seed}...")
        while self.is_playing:
            try:
                # Real wall-clock step duration is 0.5s
                wall_delta = 0.5
                sim_delta = wall_delta * self.virtual_speed
                await asyncio.sleep(wall_delta)
                await self.step_simulation_tick(sim_delta)
            except Exception as e:
                print(f"[SAFRA Simulation Loop Exception]: {e}")
                await asyncio.sleep(1)

large_scale_engine = LargeScalePaymentSimulationEngine()
