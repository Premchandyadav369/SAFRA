import random
from typing import Dict, Any, List

class MerchantProfiles:
    """
    6 distinct merchant types with realistic payment rail affinities and amount distributions.
    """
    PROFILES = {
        "DIGITAL_COMMERCE": {
            "name": "Digital Commerce Retail",
            "median_order_value": 1499.0,
            "order_sigma": 0.60,
            "rail_weights": {"UPI": 0.65, "CREDIT_CARD": 0.15, "DEBIT_CARD": 0.10, "WALLET": 0.08, "NETBANKING": 0.02},
            "checkout_abandonment_base": 0.14,
            "description": "High transaction volume, UPI heavy, rapid checkout abandonment."
        },
        "SUBSCRIPTION_SAAS": {
            "name": "Subscription SaaS Cloud",
            "median_order_value": 4999.0,
            "order_sigma": 0.45,
            "rail_weights": {"SUBSCRIPTION": 0.70, "CREDIT_CARD": 0.20, "NETBANKING": 0.10},
            "checkout_abandonment_base": 0.05,
            "description": "Recurring mandate billing, token degradation, automated renewal retries."
        },
        "B2B_SAAS": {
            "name": "Enterprise B2B SaaS",
            "median_order_value": 85000.0,
            "order_sigma": 0.85,
            "rail_weights": {"INVOICE": 0.65, "BANK_TRANSFER": 0.25, "NETBANKING": 0.10},
            "checkout_abandonment_base": 0.02,
            "description": "Large invoice amounts, Net-30 overdue terms, promise-to-pay tracking."
        },
        "MARKETPLACE": {
            "name": "Multi-Vendor Marketplace",
            "median_order_value": 2450.0,
            "order_sigma": 0.75,
            "rail_weights": {"UPI": 0.55, "CREDIT_CARD": 0.20, "DEBIT_CARD": 0.15, "WALLET": 0.10},
            "checkout_abandonment_base": 0.18,
            "description": "High traffic volume, multiple sub-sellers, variable cart sizes."
        },
        "EDUCATION_PLATFORM": {
            "name": "EdTech & Upskilling Platform",
            "median_order_value": 28000.0,
            "order_sigma": 0.60,
            "rail_weights": {"NETBANKING": 0.35, "CREDIT_CARD": 0.30, "UPI": 0.25, "BANK_TRANSFER": 0.10},
            "checkout_abandonment_base": 0.22,
            "description": "Periodic admission spikes, high-ticket transactions, installment plans."
        },
        "TRAVEL_PLATFORM": {
            "name": "Online Travel & Flight Booking",
            "median_order_value": 12500.0,
            "order_sigma": 0.70,
            "rail_weights": {"CREDIT_CARD": 0.45, "UPI": 0.30, "NETBANKING": 0.20, "WALLET": 0.05},
            "checkout_abandonment_base": 0.28,
            "description": "High urgency, seat reservation expiry, multi-rail failover requirements."
        }
    }

class CustomerPopulation:
    """
    Synthetic customer population generator and stateful behavioral tracker.
    """
    SEGMENTS = {
        "NEW_CUSTOMER": {"ratio": 0.35, "base_loyalty": 0.45, "retry_responsiveness": 0.55, "fatigue_tolerance": 40},
        "RETURNING_CUSTOMER": {"ratio": 0.40, "base_loyalty": 0.85, "retry_responsiveness": 0.78, "fatigue_tolerance": 60},
        "HIGH_VALUE_CUSTOMER": {"ratio": 0.10, "base_loyalty": 0.94, "retry_responsiveness": 0.88, "fatigue_tolerance": 80},
        "SUBSCRIPTION_CUSTOMER": {"ratio": 0.10, "base_loyalty": 0.90, "retry_responsiveness": 0.82, "fatigue_tolerance": 50},
        "AT_RISK_CUSTOMER": {"ratio": 0.05, "base_loyalty": 0.25, "retry_responsiveness": 0.30, "fatigue_tolerance": 25}
    }

    def __init__(self, prng: random.Random, population_size: int = 2500):
        self.prng = prng
        self.customers: Dict[str, Dict[str, Any]] = {}
        self._init_population(population_size)

    def _init_population(self, size: int):
        segments = list(self.SEGMENTS.keys())
        weights = [self.SEGMENTS[s]["ratio"] for s in segments]

        for i in range(1, size + 1):
            cid = f"cus_sim_{i:04d}"
            seg = self.prng.choices(segments, weights=weights)[0]
            cfg = self.SEGMENTS[seg]
            self.customers[cid] = {
                "customer_id": cid,
                "segment": seg,
                "payment_success_history": round(cfg["base_loyalty"] + self.prng.uniform(-0.1, 0.05), 2),
                "retry_response_rate": round(cfg["retry_responsiveness"] + self.prng.uniform(-0.08, 0.08), 2),
                "average_order_value": 0.0,
                "total_transactions": 0,
                "successful_transactions": 0,
                "preferred_payment_method": self.prng.choice(["UPI", "CREDIT_CARD", "NETBANKING", "WALLET"]),
                "intervention_fatigue": self.prng.randint(0, 15),
                "fatigue_tolerance": cfg["fatigue_tolerance"]
            }

    def get_or_sample_customer(self) -> Dict[str, Any]:
        cid = self.prng.choice(list(self.customers.keys()))
        return self.customers[cid]

    def record_outcome(self, cid: str, amount: float, success: bool, had_intervention: bool):
        if cid not in self.customers:
            return
        c = self.customers[cid]
        c["total_transactions"] += 1
        if success:
            c["successful_transactions"] += 1
            # Decrease fatigue slightly on successful resolution
            c["intervention_fatigue"] = max(0, c["intervention_fatigue"] - 8)
        else:
            if had_intervention:
                c["intervention_fatigue"] = min(100, c["intervention_fatigue"] + 22)
            else:
                c["intervention_fatigue"] = min(100, c["intervention_fatigue"] + 6)

        c["payment_success_history"] = round(c["successful_transactions"] / max(1, c["total_transactions"]), 2)
