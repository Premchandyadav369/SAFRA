from typing import Dict, Any, List, Optional
import networkx as nx

class RealityValidationResult:
    def __init__(
        self,
        reality_score: float,
        is_drift_detected: bool,
        missing_edges: List[Dict[str, Any]],
        observed_edges: List[Dict[str, Any]],
        conflicting_states: List[Dict[str, Any]],
        risk_level: str,
        lifecycle_stage: str,
        diagnosis: str
    ):
        self.reality_score = reality_score
        self.is_drift_detected = is_drift_detected
        self.missing_edges = missing_edges
        self.observed_edges = observed_edges
        self.conflicting_states = conflicting_states
        self.risk_level = risk_level
        self.lifecycle_stage = lifecycle_stage
        self.diagnosis = diagnosis

    def to_dict(self) -> Dict[str, Any]:
        return {
            "reality_score": round(self.reality_score, 1),
            "is_drift_detected": self.is_drift_detected,
            "missing_edges": self.missing_edges,
            "observed_edges": self.observed_edges,
            "conflicting_states": self.conflicting_states,
            "risk_level": self.risk_level,
            "lifecycle_stage": self.lifecycle_stage,
            "diagnosis": self.diagnosis
        }

class GraphRealityValidator:
    """
    Compares Expected Financial Lifecycle vs Observed Graph Edges.
    Detects financial drift, missing confirmations, and assigns Reality Score (0-100).
    """

    EXPECTED_EDGES = [
        {"from": "CUSTOMER", "to": "PAYMENT", "relation": "INITIATED", "weight": 15},
        {"from": "PAYMENT", "to": "BANK", "relation": "DEBITED_BY", "weight": 25},
        {"from": "PAYMENT", "to": "PAYMENT_RAIL", "relation": "ROUTED_THROUGH", "weight": 20},
        {"from": "PAYMENT", "to": "GATEWAY", "relation": "PROCESSED_BY", "weight": 15},
        {"from": "PAYMENT", "to": "MERCHANT", "relation": "CONFIRMED_BY", "weight": 15},
        {"from": "PAYMENT", "to": "SETTLEMENT", "relation": "SETTLED_IN", "weight": 10},
    ]

    @classmethod
    def validate_payment_graph(cls, graph: nx.MultiDiGraph, payment_id: str) -> RealityValidationResult:
        payment_node_key = f"PAYMENT_{payment_id}"
        
        if payment_node_key not in graph:
            return RealityValidationResult(
                reality_score=0.0,
                is_drift_detected=True,
                missing_edges=[{"relation": "ALL", "description": "Payment node absent in reality graph"}],
                observed_edges=[],
                conflicting_states=[],
                risk_level="CRITICAL",
                lifecycle_stage="UNTRACKED",
                diagnosis="Payment node does not exist in graph."
            )

        # Collect outgoing and incoming edges
        edges = list(graph.edges(payment_node_key, data=True))
        in_edges = list(graph.in_edges(payment_node_key, data=True))
        all_edges = edges + in_edges

        observed_relations = set()
        observed_list = []
        for u, v, data in all_edges:
            relation = data.get("relation")
            status = data.get("status", "CONFIRMED")
            missing = data.get("missing", False)
            if not missing and status in ["CONFIRMED", "SUCCESS", "ACKNOWLEDGED", "DEBITED"]:
                observed_relations.add(relation)
                observed_list.append({
                    "from": u,
                    "to": v,
                    "relation": relation,
                    "status": status,
                    "latency_ms": data.get("latency_ms", 0)
                })

        # Calculate Reality Score based on presence of expected edges
        total_score = 100.0
        missing_edges = []
        conflicting_states = []

        # Check Bank Debit
        if "DEBITED_BY" not in observed_relations:
            total_score -= 25.0
            missing_edges.append({
                "relation": "DEBITED_BY",
                "expected_target": "BANK",
                "reason": "Bank debit confirmation missing"
            })

        # Check Rail Ack
        if "ROUTED_THROUGH" not in observed_relations:
            total_score -= 20.0
            missing_edges.append({
                "relation": "ROUTED_THROUGH",
                "expected_target": "PAYMENT_RAIL",
                "reason": "Network / NPCI UPI routing not acknowledged"
            })

        # Check Merchant Confirmation
        if "CONFIRMED_BY" not in observed_relations:
            total_score -= 25.0
            missing_edges.append({
                "relation": "CONFIRMED_BY",
                "expected_target": "MERCHANT",
                "reason": "Merchant webhook confirmation missing or delayed"
            })

        # Check Settlement
        if "SETTLED_IN" not in observed_relations:
            # Settlement is normal to be pending in T+1 cycle; minor penalty if payment is pending
            total_score -= 10.0

        # Conflicting state check: Bank Debited YES, Merchant Confirmed NO
        if "DEBITED_BY" in observed_relations and "CONFIRMED_BY" not in observed_relations:
            conflicting_states.append({
                "type": "FINANCIAL_UNCERTAINTY_SPLIT",
                "detail": "Customer bank debited money, but merchant has not acknowledged receipt. High customer uncertainty."
            })

        # Ensure score bounds
        reality_score = max(0.0, min(100.0, total_score))
        is_drift = len(missing_edges) > 0 or reality_score < 90.0

        if reality_score >= 90.0:
            risk_level = "LOW"
            lifecycle_stage = "SETTLED_OR_HEALTHY"
            diagnosis = "All observed financial edges match expected reality."
        elif reality_score >= 70.0:
            risk_level = "MEDIUM"
            lifecycle_stage = "GATEWAY_OR_MERCHANT_DELAY"
            diagnosis = "Minor drift: Bank debited and acknowledged, but merchant confirmation is pending."
        elif reality_score >= 45.0:
            risk_level = "HIGH"
            lifecycle_stage = "FINANCIAL_UNCERTAINTY"
            diagnosis = "Critical drift: Conflicting states across payment ecosystem."
        else:
            risk_level = "CRITICAL"
            lifecycle_stage = "SYSTEMIC_DESYNC"
            diagnosis = "Severe financial reality desynchronization across multiple nodes."

        return RealityValidationResult(
            reality_score=reality_score,
            is_drift_detected=is_drift,
            missing_edges=missing_edges,
            observed_edges=observed_list,
            conflicting_states=conflicting_states,
            risk_level=risk_level,
            lifecycle_stage=lifecycle_stage,
            diagnosis=diagnosis
        )
