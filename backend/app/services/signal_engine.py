from typing import List, Dict, Any
from datetime import datetime

class SignalEngine:
    @staticmethod
    def extract_signals(txn: Any) -> List[Dict[str, Any]]:
        signals = []
        now_str = datetime.utcnow().isoformat() + "Z"

        failure_reason = getattr(txn, "failure_reason", "") or ""
        payment_status = getattr(txn, "payment_status", "PENDING") or "PENDING"
        customer_history_score = getattr(txn, "customer_history_score", 0.5) or 0.5
        retry_count = getattr(txn, "retry_count", 0) or 0
        time_since_last_attempt = getattr(txn, "time_since_last_attempt", 60) or 60
        subscription_flag = getattr(txn, "subscription_flag", False) or False
        invoice_days_overdue = getattr(txn, "invoice_days_overdue", 0) or 0

        # 1. Temporary Bank Failure Signal
        if "timeout" in failure_reason.lower() or "delayed" in failure_reason.lower() or "504" in failure_reason:
            signals.append({
                "signal_name": "TEMPORARY_BANK_FAILURE",
                "weight": 0.85,
                "evidence": f"Bank/Gateway latency or timeout detected in '{failure_reason}'. High probability of eventual settlement.",
                "timestamp": now_str
            })

        # 2. High Purchase History / Loyal Customer
        if customer_history_score >= 0.75:
            signals.append({
                "signal_name": "HIGH_PURCHASE_HISTORY",
                "weight": 0.80,
                "evidence": f"Customer history score is {customer_history_score:.2f} (Top Tier). Repeat buyer with low chargeback rate.",
                "timestamp": now_str
            })

        # 3. Multiple Retries Signal
        if retry_count >= 2:
            signals.append({
                "signal_name": "MULTIPLE_RETRIES",
                "weight": 0.65,
                "evidence": f"Customer attempted {retry_count} retries in short succession. Duplicate charge risk elevated.",
                "timestamp": now_str
            })

        # 4. Long Pending Duration
        if payment_status == "PENDING" and time_since_last_attempt > 180:
            signals.append({
                "signal_name": "LONG_PENDING_DURATION",
                "weight": 0.70,
                "evidence": f"Payment has been in pending state for {time_since_last_attempt}s without resolution callback.",
                "timestamp": now_str
            })

        # 5. Checkout Abandoned / High Intent
        if "abandoned" in failure_reason.lower() or "otp" in failure_reason.lower():
            signals.append({
                "signal_name": "CUSTOMER_HIGH_INTENT",
                "weight": 0.60,
                "evidence": "Customer proceeded to final OTP/payment screen before session dropped.",
                "timestamp": now_str
            })

        # 6. Insufficient Balance
        if "insufficient" in failure_reason.lower() or "balance" in failure_reason.lower():
            signals.append({
                "signal_name": "REPEATED_INSUFFICIENT_BALANCE",
                "weight": 0.75,
                "evidence": "Bank rejected transaction with Code 51 (Insufficient Funds). Direct retries will fail.",
                "timestamp": now_str
            })

        # 7. Subscription Value High
        if subscription_flag:
            signals.append({
                "signal_name": "SUBSCRIPTION_VALUE_HIGH",
                "weight": 0.82,
                "evidence": "Recurring revenue mandate at risk. Automated graceful retry window active.",
                "timestamp": now_str
            })

        # 8. Invoice Overdue
        if invoice_days_overdue > 14:
            signals.append({
                "signal_name": "INVOICE_OVERDUE",
                "weight": 0.90,
                "evidence": f"B2B Receivable is {invoice_days_overdue} days past due date. Requires structured chaser workflow.",
                "timestamp": now_str
            })

        # 9. Contact Limit Reached
        if retry_count >= 3:
            signals.append({
                "signal_name": "CUSTOMER_CONTACT_LIMIT_REACHED",
                "weight": 0.95,
                "evidence": "Customer contact threshold (3 messages) reached. Enforcing anti-spam policy.",
                "timestamp": now_str
            })

        return signals
