from typing import Dict, Any, List

ALLOWED_RECOVERY_ACTIONS = [
    "WAIT",
    "SEND_RECOVERY_LINK",
    "OFFER_ALTERNATIVE_PAYMENT_METHOD",
    "SEND_PAYMENT_REMINDER",
    "ESCALATE",
    "STOP",
]

class PolicyEngine:
    @staticmethod
    def evaluate(txn: Any, signals: List[Dict[str, Any]], recovery_score: Dict[str, Any]) -> Dict[str, Any]:
        failure_reason = (getattr(txn, "failure_reason", "") or "").lower()
        retry_count = getattr(txn, "retry_count", 0)
        customer_history_score = getattr(txn, "customer_history_score", 0.5)
        invoice_days_overdue = getattr(txn, "invoice_days_overdue", 0)
        recovery_probability = recovery_score.get("recovery_probability", 0.5)

        signal_names = [s.get("signal_name") for s in signals]

        allowed_actions = list(ALLOWED_RECOVERY_ACTIONS)
        decision = "WAIT"
        reason = "Default safe observation window."
        stopping_rule = None

        # Rule 1: Customer contact limit reached -> STOP
        if retry_count >= 3 or "CUSTOMER_CONTACT_LIMIT_REACHED" in signal_names:
            decision = "STOP"
            reason = "Customer contact limit reached (3 messages). Anti-fatigue stopping rule triggered."
            stopping_rule = "CUSTOMER_CONTACT_LIMIT"
            allowed_actions = ["STOP", "ESCALATE"]
            return {
                "decision": decision,
                "reason": reason,
                "allowed_actions": allowed_actions,
                "stopping_rule_triggered": stopping_rule
            }

        # Rule 2: Extremely low recovery probability -> STOP
        if recovery_probability < 0.20:
            decision = "STOP"
            reason = "Recovery probability fell below 20% economic intervention threshold."
            stopping_rule = "LOW_PROBABILITY_THRESHOLD"
            allowed_actions = ["STOP", "WAIT"]
            return {
                "decision": decision,
                "reason": reason,
                "allowed_actions": allowed_actions,
                "stopping_rule_triggered": stopping_rule
            }

        # Rule 3: Invoice significantly overdue -> ESCALATE
        if invoice_days_overdue > 14 or "INVOICE_OVERDUE" in signal_names:
            decision = "ESCALATE"
            reason = f"B2B invoice is {invoice_days_overdue} days overdue. Escalated to merchant finance team."
            stopping_rule = "OVERDUE_ESCALATION"
            allowed_actions = ["ESCALATE", "SEND_PAYMENT_REMINDER", "STOP"]
            return {
                "decision": decision,
                "reason": reason,
                "allowed_actions": allowed_actions,
                "stopping_rule_triggered": stopping_rule
            }

        # Rule 4: Temporary Bank Timeout with High Probability -> WAIT
        if ("TEMPORARY_BANK_FAILURE" in signal_names or "timeout" in failure_reason or "delayed" in failure_reason) and recovery_probability > 0.65:
            decision = "WAIT"
            reason = "Bank debited or switch latency detected. Waiting 5 minutes prevents double-debiting customer."
            stopping_rule = None
            allowed_actions = ["WAIT", "OFFER_ALTERNATIVE_PAYMENT_METHOD", "STOP"]
            return {
                "decision": decision,
                "reason": reason,
                "allowed_actions": allowed_actions,
                "stopping_rule_triggered": stopping_rule
            }

        # Rule 5: Checkout Abandonment / OTP Timeout with Good Intent -> SEND_RECOVERY_LINK
        if ("CUSTOMER_HIGH_INTENT" in signal_names or "abandoned" in failure_reason or "otp" in failure_reason) and recovery_probability > 0.50:
            decision = "SEND_RECOVERY_LINK"
            reason = "Checkout dropped at final confirmation. Sending 1-click idempotent recovery link."
            stopping_rule = None
            allowed_actions = ["SEND_RECOVERY_LINK", "WAIT", "STOP"]
            return {
                "decision": decision,
                "reason": reason,
                "allowed_actions": allowed_actions,
                "stopping_rule_triggered": stopping_rule
            }

        # Rule 6: Insufficient balance or repeated payment failure with high customer score -> OFFER_ALTERNATIVE_PAYMENT_METHOD
        if ("REPEATED_INSUFFICIENT_BALANCE" in signal_names or "insufficient" in failure_reason) and customer_history_score >= 0.60:
            decision = "OFFER_ALTERNATIVE_PAYMENT_METHOD"
            reason = "Card/account balance insufficient. Offering alternative saved payment method without restarting cart."
            stopping_rule = None
            allowed_actions = ["OFFER_ALTERNATIVE_PAYMENT_METHOD", "SEND_RECOVERY_LINK", "STOP"]
            return {
                "decision": decision,
                "reason": reason,
                "allowed_actions": allowed_actions,
                "stopping_rule_triggered": stopping_rule
            }

        return {
            "decision": decision,
            "reason": reason,
            "allowed_actions": allowed_actions,
            "stopping_rule_triggered": stopping_rule
        }
