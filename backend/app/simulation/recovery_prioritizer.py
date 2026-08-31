from typing import List, Dict, Any

class RecoveryQueuePrioritizer:
    """
    Constrained Recovery Prioritization Engine optimizing expected net recovery yield
    under operational intervention caps and financial budget limits.
    """

    @staticmethod
    def calculate_priority_score(item: Dict[str, Any]) -> float:
        """
        Priority = Amount * P(Recovery) * Urgency * CustomerValue * Feasibility
        """
        amount = float(item.get("amount", 0.0))
        prob = float(item.get("recovery_probability", 0.5))
        urgency = float(item.get("urgency_multiplier", 1.0))
        cust_val = float(item.get("customer_loyalty", 0.8))
        feasibility = float(item.get("action_feasibility", 0.9))

        score = amount * prob * urgency * cust_val * feasibility
        return round(score, 2)

    @classmethod
    def prioritize_and_allocate(
        cls,
        queue: List[Dict[str, Any]],
        max_interventions_per_min: int = 500,
        recovery_budget_inr: float = 50000.0,
        intervention_unit_cost_inr: float = 42.0
    ) -> Dict[str, Any]:
        """
        Ranks failed/pending payments and selects the optimal subset under constraints.
        """
        # Annotate and score all items
        scored_items = []
        for item in queue:
            score = cls.calculate_priority_score(item)
            exp_gross = round(float(item.get("amount", 0.0)) * float(item.get("recovery_probability", 0.5)), 2)
            scored_items.append({
                **item,
                "priority_score": score,
                "expected_recovery_inr": exp_gross,
                "intervention_cost_inr": intervention_unit_cost_inr
            })

        # Sort descending by priority score (Greedy knapsack heuristic)
        scored_items.sort(key=lambda x: x["priority_score"], reverse=True)

        allocated_actions = []
        wait_cooldown = []
        stopped_fatigue = []
        unviable_dropped = []

        current_cost = 0.0
        actions_count = 0

        for rank, item in enumerate(scored_items, start=1):
            fatigue = float(item.get("customer_fatigue", 0.0))
            prob = float(item.get("recovery_probability", 0.0))

            # Stopping Rule 1: High Customer Fatigue
            if fatigue >= 80:
                stopped_fatigue.append({**item, "rank": rank, "decision": "STOP_FATIGUE_LIMIT"})
                continue

            # Stopping Rule 2: Non-viable low probability
            if prob < 0.20 or item["expected_recovery_inr"] < intervention_unit_cost_inr:
                unviable_dropped.append({**item, "rank": rank, "decision": "DROP_NEGATIVE_ROI"})
                continue

            # Check capacity & budget constraints
            if (actions_count < max_interventions_per_min) and ((current_cost + intervention_unit_cost_inr) <= recovery_budget_inr):
                allocated_actions.append({
                    **item,
                    "rank": rank,
                    "decision": "EXECUTE_OPTIMAL_INTERVENTION",
                    "expected_net_value": round(item["expected_recovery_inr"] - intervention_unit_cost_inr, 2)
                })
                actions_count += 1
                current_cost += intervention_unit_cost_inr
            else:
                wait_cooldown.append({**item, "rank": rank, "decision": "DEFERRED_WAIT_NEXT_WINDOW"})

        total_allocated_gmv = sum(x.get("amount", 0.0) for x in allocated_actions)
        total_expected_recovery = sum(x["expected_recovery_inr"] for x in allocated_actions)

        return {
            "total_candidates": len(queue),
            "allocated_count": len(allocated_actions),
            "wait_count": len(wait_cooldown),
            "stopped_fatigue_count": len(stopped_fatigue),
            "unviable_count": len(unviable_dropped),
            "total_intervention_cost_inr": round(current_cost, 2),
            "budget_utilization_pct": round((current_cost / max(1.0, recovery_budget_inr)) * 100, 1),
            "total_expected_recovery_inr": round(total_expected_recovery, 2),
            "expected_net_roi_multiple": round(total_expected_recovery / max(1.0, current_cost), 1),
            "top_allocated_actions": allocated_actions[:15],
            "sample_stopped": stopped_fatigue[:5]
        }
