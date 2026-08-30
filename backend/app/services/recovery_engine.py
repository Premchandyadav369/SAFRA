from typing import Dict, Any, List

class RecoveryEngine:
    @staticmethod
    def calculate_score(txn: Any, signals: List[Dict[str, Any]]) -> Dict[str, Any]:
        amount = getattr(txn, "amount", 0.0) or 0.0
        failure_reason = (getattr(txn, "failure_reason", "") or "").lower()
        customer_history_score = getattr(txn, "customer_history_score", 0.5) or 0.5
        retry_count = getattr(txn, "retry_count", 0) or 0
        invoice_days_overdue = getattr(txn, "invoice_days_overdue", 0) or 0

        # Baseline
        base_probability = 0.45

        # Bonuses
        temporary_failure_bonus = 0.24 if ("timeout" in failure_reason or "delayed" in failure_reason or "504" in failure_reason) else 0.0
        customer_history_bonus = round((customer_history_score - 0.5) * 0.35, 3) if customer_history_score > 0.5 else 0.0
        high_intent_bonus = 0.12 if ("otp" in failure_reason or "abandoned" in failure_reason) else 0.0

        # Penalties
        retry_penalty = round(-0.06 * min(retry_count, 3), 3) if retry_count > 1 else 0.0
        insufficient_balance_penalty = -0.28 if ("insufficient" in failure_reason or "balance" in failure_reason) else 0.0
        overdue_penalty = round(-0.02 * min(invoice_days_overdue, 15), 3) if invoice_days_overdue > 0 else 0.0

        # Summation
        raw_prob = (
            base_probability
            + temporary_failure_bonus
            + customer_history_bonus
            + high_intent_bonus
            + retry_penalty
            + insufficient_balance_penalty
            + overdue_penalty
        )

        # Clamp between 0.05 and 0.98
        final_probability = round(max(0.05, min(0.98, raw_prob)), 2)

        # Risk Score (Inverse of recovery probability weighted with amount)
        risk_score = round(max(0.1, min(0.95, 1.0 - final_probability + 0.1)), 2)

        # Estimated Recoverable Value
        estimated_recovery_value = round(amount * final_probability, 2)

        score_breakdown = {
            "base_probability": base_probability,
            "temporary_failure_bonus": temporary_failure_bonus,
            "customer_history_bonus": customer_history_bonus,
            "high_intent_bonus": high_intent_bonus,
            "retry_penalty": retry_penalty,
            "insufficient_balance_penalty": insufficient_balance_penalty,
            "overdue_penalty": overdue_penalty,
            "final_probability": final_probability,
        }

        return {
            "risk_score": risk_score,
            "recovery_probability": final_probability,
            "estimated_recovery_value": estimated_recovery_value,
            "score_breakdown": score_breakdown,
        }
