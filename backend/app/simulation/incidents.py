from typing import Dict, Any, Optional

class IncidentLibrary:
    """
    10 Predefined Major Incident Scenarios and Black Swan Mode for Buildathon-Grade Stress Testing.
    """

    SCENARIOS = {
        "PAYDAY_SURGE": {
            "name": "Scenario 01: Payday Traffic Surge",
            "traffic_multiplier": 3.8,
            "latency_multiplier": 1.4,
            "timeout_boost": 0.04,
            "failure_boost": 0.02,
            "target_provider": None,
            "target_rail": "UPI",
            "description": "Salary disbursement day: 3.8x traffic spike across UPI rails, queuing bank core switches."
        },
        "FLASH_SALE": {
            "name": "Scenario 02: Flash Sale Spike",
            "traffic_multiplier": 5.2,
            "latency_multiplier": 1.9,
            "timeout_boost": 0.08,
            "failure_boost": 0.06,
            "target_provider": None,
            "target_rail": None,
            "description": "Extreme 5.2x checkout surge on specific merchant endpoints causing queue congestion."
        },
        "BANK_LATENCY_DEGRADATION": {
            "name": "Scenario 03: Bank Latency Degradation",
            "traffic_multiplier": 1.2,
            "latency_multiplier": 3.6,
            "timeout_boost": 0.32,
            "failure_boost": 0.12,
            "target_provider": "HDFC",
            "target_rail": None,
            "description": "HDFC core banking switch latency increases to 2,400ms, triggering callback timeouts."
        },
        "UPI_TIMEOUT_WAVE": {
            "name": "Scenario 04: UPI Timeout Wave",
            "traffic_multiplier": 2.0,
            "latency_multiplier": 2.2,
            "timeout_boost": 0.45,
            "failure_boost": 0.15,
            "target_provider": None,
            "target_rail": "UPI",
            "description": "NPCI switch transit delay causing widespread 504 Gateway Timeouts across UPI collect requests."
        },
        "CARD_ISSUER_FAILURE": {
            "name": "Scenario 05: Card Issuer Authorization Failure",
            "traffic_multiplier": 1.0,
            "latency_multiplier": 1.3,
            "timeout_boost": 0.05,
            "failure_boost": 0.52,
            "target_provider": "ICICI",
            "target_rail": "CREDIT_CARD",
            "description": "Major issuer auth server degradation; 52% of 3DS2 card authorization requests rejected."
        },
        "NETWORK_PARTITION": {
            "name": "Scenario 06: Network Partition (Out-of-Order Events)",
            "traffic_multiplier": 1.5,
            "latency_multiplier": 4.0,
            "timeout_boost": 0.40,
            "failure_boost": 0.18,
            "target_provider": "SBI",
            "target_rail": "NETBANKING",
            "description": "Webhook callbacks arrive out of order or delayed by 15 minutes; state machine reconciliation required."
        },
        "RECOVERY_QUEUE_OVERLOAD": {
            "name": "Scenario 07: Recovery Queue Overload",
            "traffic_multiplier": 2.8,
            "latency_multiplier": 1.8,
            "timeout_boost": 0.25,
            "failure_boost": 0.28,
            "target_provider": None,
            "target_rail": None,
            "description": "10,000+ failed checkouts queue for recovery actions; prioritizer must enforce strict knapsack constraints."
        },
        "MULTI_PROVIDER_INCIDENT": {
            "name": "Scenario 08: Multi-Provider Correlated Outage",
            "traffic_multiplier": 2.2,
            "latency_multiplier": 3.2,
            "timeout_boost": 0.42,
            "failure_boost": 0.35,
            "target_provider": None,
            "target_rail": None,
            "description": "Simultaneous degradation across HDFC and SBI switches; SAFRA must separate correlated root causes."
        },
        "CHECKOUT_ABANDONMENT_SPIKE": {
            "name": "Scenario 09: Checkout Abandonment Spike",
            "traffic_multiplier": 1.4,
            "latency_multiplier": 1.2,
            "timeout_boost": 0.02,
            "failure_boost": 0.48,
            "target_provider": None,
            "target_rail": "CREDIT_CARD",
            "description": "SMS OTP delivery delay from telecom aggregator leads to 48% checkout abandonment rate."
        },
        "SILENT_REVENUE_LEAK": {
            "name": "Scenario 10: Silent Revenue Leak",
            "traffic_multiplier": 1.0,
            "latency_multiplier": 1.15,
            "timeout_boost": 0.035,
            "failure_boost": 0.085,
            "target_provider": "Axis",
            "target_rail": "SUBSCRIPTION",
            "description": "No dramatic crash: recurring subscription success rate silently slips by 8.5%, slowly leaking ₹12L/day."
        },
        "BLACK_SWAN_MODE": {
            "name": "BLACK SWAN: Cascading Multi-Failure Shock",
            "traffic_multiplier": 4.5,
            "latency_multiplier": 4.2,
            "timeout_boost": 0.55,
            "failure_boost": 0.45,
            "target_provider": "HDFC",
            "target_rail": "UPI",
            "description": "Simultaneous payday traffic surge + HDFC bank latency + NPCI network timeout + customer retry explosion."
        }
    }

    @classmethod
    def get_incident_config(cls, scenario_key: str) -> Dict[str, Any]:
        return cls.SCENARIOS.get(scenario_key.upper(), {
            "name": "Nominal Baseline",
            "traffic_multiplier": 1.0,
            "latency_multiplier": 1.0,
            "timeout_boost": 0.0,
            "failure_boost": 0.0,
            "target_provider": None,
            "target_rail": None,
            "description": "Nominal baseline operation."
        })
