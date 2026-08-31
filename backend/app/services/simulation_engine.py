import asyncio
import random
import time
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from collections import deque

from app.database.models import Transaction, AuditEvent, Track03RecoveryAction, BarrierInterception
from app.database.session import AsyncSessionLocal
from app.services.signal_engine import SignalEngine
from app.services.recovery_engine import RecoveryEngine
from app.services.policy_engine import PolicyEngine
from app.core.crypto_engine import CryptoEngine
from app.api.websockets import ws_manager

class PaymentSimulationEngine:
    """
    Continuous Asynchronous Production-like Payment Event Simulation Engine.
    Simulates real-world lifecycle transitions across 8 payment rails and 6 bank provider profiles.
    """

    PAYMENT_RAILS = [
        "UPI",
        "CREDIT_CARD",
        "DEBIT_CARD",
        "NETBANKING",
        "WALLET",
        "BANK_TRANSFER",
        "SUBSCRIPTION",
        "INVOICE"
    ]

    BANK_PROFILES = {
        "HDFC": {"base_latency_ms": 650, "timeout_prob": 0.018, "temp_failure_prob": 0.026},
        "ICICI": {"base_latency_ms": 490, "timeout_prob": 0.012, "temp_failure_prob": 0.018},
        "SBI": {"base_latency_ms": 810, "timeout_prob": 0.032, "temp_failure_prob": 0.041},
        "Axis": {"base_latency_ms": 540, "timeout_prob": 0.015, "temp_failure_prob": 0.022},
        "Kotak": {"base_latency_ms": 510, "timeout_prob": 0.014, "temp_failure_prob": 0.019},
        "Yes Bank": {"base_latency_ms": 590, "timeout_prob": 0.021, "temp_failure_prob": 0.029}
    }

    MERCHANTS = [
        {"id": "m_zenith_01", "name": "Zenith Retail Corp"},
        {"id": "m_cloudsaas_02", "name": "CloudScale Software Ltd"},
        {"id": "m_quickmart_03", "name": "QuickMart Direct"},
        {"id": "m_apexhealth_04", "name": "Apex Healthcare Solutions"},
        {"id": "m_solarex_05", "name": "Solaris B2B Energy"}
    ]

    def __init__(self):
        self.is_running = False
        self.traffic_pattern = "NORMAL"  # NORMAL, MORNING_SPIKE, EVENING_PEAK, PAYDAY_SURGE, FLASH_SALE, BANK_OUTAGE, UPI_DEGRADATION, HIGH_ABANDONMENT, QUIET_PERIOD
        self.traffic_multiplier = 1.0
        self.latency_override_ms: Optional[int] = None
        self.forced_timeout_rate: Optional[float] = None
        self.forced_failure_rate: Optional[float] = None
        self.targeted_outage_bank: Optional[str] = None

        # Rolling active transaction state (window of recent 1,000 transactions)
        self.recent_events = deque(maxlen=200)
        self.recent_transactions = deque(maxlen=1000)

        # Reconstructed metrics
        self.stats = {
            "total_transactions": 0,
            "total_gmv_inr": 0.0,
            "success_count": 0,
            "failed_count": 0,
            "pending_count": 0,
            "recovered_count": 0,
            "revenue_at_risk_inr": 0.0,
            "recovered_revenue_inr": 0.0,
            "interventions_executed": 0,
            "interventions_stopped": 0,
            "duplicate_barrier_blocked": 0
        }

        # 30-minute rolling throughput bucket: timestamp_minute -> count
        self.throughput_history = deque(maxlen=30)
        self._init_mock_history()

    def _init_mock_history(self):
        now = time.time()
        for i in range(30, 0, -1):
            t_str = (datetime.now() - timedelta(minutes=i)).strftime("%H:%M")
            self.throughput_history.append({
                "time": t_str,
                "throughput_per_min": random.randint(45, 85),
                "success_rate": round(random.uniform(84.0, 92.5), 1),
                "at_risk_inr": round(random.uniform(120000, 380000), 2)
            })

    def set_scenario(self, scenario_name: str, **kwargs):
        """
        Dynamically adjusts simulation parameters for realistic scenario injection.
        """
        self.traffic_pattern = scenario_name.upper()
        if self.traffic_pattern == "NORMAL":
            self.traffic_multiplier = 1.0
            self.latency_override_ms = None
            self.forced_timeout_rate = None
            self.forced_failure_rate = None
            self.targeted_outage_bank = None
        elif self.traffic_pattern == "PAYDAY_SURGE":
            self.traffic_multiplier = 3.5
            self.latency_override_ms = 450
        elif self.traffic_pattern == "FLASH_SALE":
            self.traffic_multiplier = 5.0
            self.latency_override_ms = 850
        elif self.traffic_pattern == "BANK_OUTAGE":
            self.traffic_multiplier = 2.0
            self.targeted_outage_bank = "HDFC"
            self.latency_override_ms = 1850
            self.forced_timeout_rate = 0.45
        elif self.traffic_pattern == "UPI_DEGRADATION":
            self.traffic_multiplier = 2.5
            self.latency_override_ms = 1400
            self.forced_timeout_rate = 0.38
        elif self.traffic_pattern == "HIGH_ABANDONMENT":
            self.traffic_multiplier = 1.2
            self.forced_failure_rate = 0.40
        elif self.traffic_pattern == "QUIET_PERIOD":
            self.traffic_multiplier = 0.3

        if "traffic_multiplier" in kwargs:
            self.traffic_multiplier = float(kwargs["traffic_multiplier"])
        if "bank_latency_ms" in kwargs:
            self.latency_override_ms = int(kwargs["bank_latency_ms"])

    async def generate_single_transaction_lifecycle(self) -> Dict[str, Any]:
        """
        Simulates an end-to-end payment transaction moving through realistic asynchronous stages.
        """
        txn_id = f"txn_{uuid.uuid4().hex[:12]}"
        now = datetime.utcnow()
        now_str = datetime.now().strftime("%H:%M:%S.%f")[:-3]

        merchant = random.choice(self.MERCHANTS)
        customer_id = f"cus_{random.randint(1000, 9999)}"
        customer_name = f"Customer #{customer_id[-4:]}"
        customer_loyalty = round(random.uniform(0.35, 0.98), 2)

        rail = random.choice(self.PAYMENT_RAILS)
        bank_name = random.choice(list(self.BANK_PROFILES.keys()))
        bank_profile = self.BANK_PROFILES[bank_name]

        # Calculate realistic base latency
        effective_latency = self.latency_override_ms or bank_profile["base_latency_ms"]
        effective_latency += random.randint(-80, 120)
        if self.targeted_outage_bank and bank_name == self.targeted_outage_bank:
            effective_latency = max(effective_latency, 1600 + random.randint(0, 800))

        # Amount distribution based on rail
        if rail == "UPI":
            amount = round(random.choice([199, 499, 999, 1499, 2499, 4999, 7999]), 2)
        elif rail in ["CREDIT_CARD", "DEBIT_CARD"]:
            amount = round(random.choice([1200, 2499, 4999, 8900, 14500, 28000]), 2)
        elif rail == "INVOICE":
            amount = round(random.choice([25000, 50000, 120000, 240000]), 2)
        else:
            amount = round(random.choice([499, 1299, 3999, 6499]), 2)

        # Stage 1: PAYMENT_CREATED
        created_event = {
            "timestamp": now_str,
            "event_type": "PAYMENT_CREATED",
            "transaction_id": txn_id,
            "stage": "CHECKOUT",
            "details": f"Payment intent created by {customer_id} on {merchant['name']}"
        }
        self.recent_events.append(created_event)

        # Determine outcome based on rail and provider profile
        timeout_prob = self.forced_timeout_rate if self.forced_timeout_rate is not None else bank_profile["timeout_prob"]
        fail_prob = self.forced_failure_rate if self.forced_failure_rate is not None else bank_profile["temp_failure_prob"]

        roll = random.random()
        is_pending = roll < timeout_prob
        is_failure = (not is_pending) and (roll < (timeout_prob + fail_prob))
        is_success = (not is_pending) and (not is_failure)

        if is_success:
            status = "SUCCESS"
            checkout_status = "SETTLED"
            failure_reason = None
            actual_outcome = "COMPLETED"
            action_type = "NO_ACTION"
            rec_prob = 0.98
        elif is_pending:
            status = "PENDING"
            checkout_status = "BANK_DEBITED_AWAITING_WEBHOOK"
            failure_reason = f"{rail} Callback Delayed: {bank_name} CBS switch latency ({effective_latency}ms)"
            actual_outcome = "PENDING_RECOVERY"
            action_type = "WAIT"
            rec_prob = round(random.uniform(0.72, 0.94), 2)
        else:
            status = "FAILED"
            checkout_status = "CHECKOUT_DROPPED"
            if rail == "CREDIT_CARD":
                failure_reason = random.choice(["3DS2 OTP Verification Abandoned", "Insufficient Card Credit Limit", "Issuer Authorization Timeout"])
            elif rail == "NETBANKING":
                failure_reason = "Bank Redirect Session Timed Out"
            elif rail == "SUBSCRIPTION":
                failure_reason = "Mandate Auto-Debit Authorization Expired"
            elif rail == "INVOICE":
                failure_reason = "Invoice Past Net-30 Payment Terms"
            else:
                failure_reason = "Payment Auth Token Rejected"

            actual_outcome = "RECOVERING"
            action_type = "SEND_RECOVERY_LINK" if "Abandoned" in str(failure_reason) else "ALT_METHOD"
            rec_prob = round(random.uniform(0.48, 0.82), 2)

        # Stage 2: Outcome Event
        outcome_event = {
            "timestamp": datetime.now().strftime("%H:%M:%S.%f")[:-3],
            "event_type": f"PAYMENT_{status}",
            "transaction_id": txn_id,
            "stage": "OUTCOME",
            "details": f"{bank_name} responded: {status} ({effective_latency}ms)"
        }
        self.recent_events.append(outcome_event)

        # Check duplicate payment collision barrier
        is_barrier_engaged = False
        if status == "PENDING" and random.random() < 0.15:
            is_barrier_engaged = True
            self.stats["duplicate_barrier_blocked"] += 1
            barrier_event = {
                "timestamp": datetime.now().strftime("%H:%M:%S.%f")[:-3],
                "event_type": "BARRIER_INTERCEPTED",
                "transaction_id": txn_id,
                "stage": "GUARDIAN",
                "details": f"Blocked rapid duplicate retry on {customer_id} (₹{amount})"
            }
            self.recent_events.append(barrier_event)

        # Create record dict
        record = {
            "transaction_id": txn_id,
            "created_at": now.isoformat(),
            "merchant_id": merchant["id"],
            "merchant_name": merchant["name"],
            "customer_id": customer_id,
            "customer_name": customer_name,
            "customer_loyalty": customer_loyalty,
            "amount": amount,
            "currency": "INR",
            "payment_method": rail,
            "bank": bank_name,
            "status": status,
            "checkout_status": checkout_status,
            "failure_reason": failure_reason,
            "latency_ms": effective_latency,
            "recovery_probability": rec_prob,
            "recommended_action": action_type,
            "actual_outcome": actual_outcome,
            "barrier_active": is_barrier_engaged
        }

        # Update in-memory stats
        self.recent_transactions.append(record)
        self.stats["total_transactions"] += 1
        self.stats["total_gmv_inr"] += amount

        if status == "SUCCESS":
            self.stats["success_count"] += 1
        elif status == "PENDING":
            self.stats["pending_count"] += 1
            self.stats["revenue_at_risk_inr"] += amount
            if random.random() < 0.70:
                self.stats["recovered_count"] += 1
                self.stats["recovered_revenue_inr"] += amount
                self.stats["revenue_at_risk_inr"] -= amount
                self.stats["interventions_executed"] += 1
        else:
            self.stats["failed_count"] += 1
            self.stats["revenue_at_risk_inr"] += amount
            if random.random() < 0.60:
                self.stats["recovered_count"] += 1
                self.stats["recovered_revenue_inr"] += amount
                self.stats["revenue_at_risk_inr"] -= amount
                self.stats["interventions_executed"] += 1
            else:
                self.stats["interventions_stopped"] += 1

        # Broadcast via WebSockets
        await ws_manager.broadcast({
            "type": "PAYMENT_EVENT",
            "event": outcome_event,
            "transaction": record,
            "kpis": self.get_live_kpis()
        })

        return record

    def get_live_kpis(self) -> Dict[str, Any]:
        """
        Dynamically calculates non-hardcoded KPI metrics from simulated live records.
        """
        total = self.stats["total_transactions"]
        success = self.stats["success_count"] + self.stats["recovered_count"]
        succ_rate = round((success / max(1, total)) * 100, 1)
        fail_rate = round((self.stats["failed_count"] / max(1, total)) * 100, 1)

        # Dynamic rolling bank latencies
        bank_latencies = {}
        for b_name, b_data in self.BANK_PROFILES.items():
            base = self.latency_override_ms if (self.targeted_outage_bank == b_name and self.latency_override_ms) else b_data["base_latency_ms"]
            bank_latencies[b_name] = base + random.randint(-40, 60)

        # Failure distribution
        failure_dist = {
            "BANK_TIMEOUT": 0,
            "INSUFFICIENT_FUNDS": 0,
            "USER_ABANDONED": 0,
            "OTP_FAILED": 0,
            "NETWORK_ERROR": 0,
            "MANDATE_FAILED": 0
        }
        for tx in self.recent_transactions:
            f = str(tx.get("failure_reason") or "")
            if "Timeout" in f or "latency" in f:
                failure_dist["BANK_TIMEOUT"] += 1
            elif "Insufficient" in f:
                failure_dist["INSUFFICIENT_FUNDS"] += 1
            elif "OTP" in f or "Abandoned" in f:
                failure_dist["OTP_FAILED"] += 1
            elif "Mandate" in f:
                failure_dist["MANDATE_FAILED"] += 1
            elif "Redirect" in f or "Session" in f:
                failure_dist["USER_ABANDONED"] += 1
            elif f:
                failure_dist["NETWORK_ERROR"] += 1

        # Status distribution
        status_dist = {
            "SUCCESS": self.stats["success_count"],
            "PENDING": self.stats["pending_count"],
            "FAILED": self.stats["failed_count"],
            "RECOVERED": self.stats["recovered_count"]
        }

        return {
            "total_transactions": total,
            "total_gmv_inr": round(self.stats["total_gmv_inr"], 2),
            "success_rate_pct": succ_rate,
            "failure_rate_pct": fail_rate,
            "revenue_at_risk_inr": round(self.stats["revenue_at_risk_inr"], 2),
            "recovered_revenue_inr": round(self.stats["recovered_revenue_inr"], 2),
            "recovery_rate_pct": round((self.stats["recovered_count"] / max(1, self.stats["pending_count"] + self.stats["failed_count"])) * 100, 1),
            "active_interventions": self.stats["interventions_executed"],
            "stopped_interventions": self.stats["interventions_stopped"],
            "duplicates_blocked": self.stats["duplicate_barrier_blocked"],
            "traffic_pattern": self.traffic_pattern,
            "traffic_multiplier": self.traffic_multiplier,
            "bank_latencies": bank_latencies,
            "failure_distribution": failure_dist,
            "status_distribution": status_dist,
            "throughput_series": list(self.throughput_history),
            "recent_events": list(self.recent_events)[-15:]
        }

    async def run_loop(self):
        """
        Background loop generating continuous stream of payment transactions.
        """
        self.is_running = True
        print("[SAFRA] Payment Simulation Engine Loop Started...")
        while self.is_running:
            try:
                base_delay = 1.0 / max(0.2, self.traffic_multiplier)
                jitter = random.uniform(0.7, 1.3)
                await asyncio.sleep(base_delay * jitter)
                await self.generate_single_transaction_lifecycle()
            except Exception as e:
                print(f"[SAFRA Simulator Error]: {e}")
                await asyncio.sleep(2)

simulation_engine = PaymentSimulationEngine()
