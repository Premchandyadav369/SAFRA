from typing import Dict, Any, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import Transaction, RecoveryAction, AuditEvent
from app.services.signal_engine import SignalEngine
from app.services.recovery_engine import RecoveryEngine
from app.services.policy_engine import PolicyEngine, ALLOWED_RECOVERY_ACTIONS

class WorkflowExecutor:
    @staticmethod
    async def execute_recovery(
        txn: Transaction,
        requested_action: Optional[str] = None,
        db: Optional[AsyncSession] = None
    ) -> Dict[str, Any]:
        # 1. Extract Signals
        signals = SignalEngine.extract_signals(txn)

        # 2. Calculate Recovery Score
        recovery_score = RecoveryEngine.calculate_score(txn, signals)

        # 3. Policy Evaluation
        policy_eval = PolicyEngine.evaluate(txn, signals, recovery_score)
        allowed_actions = policy_eval["allowed_actions"]
        selected_action = requested_action if (requested_action and requested_action != "AUTO") else policy_eval["decision"]

        # Validate action
        if selected_action not in allowed_actions:
            raise ValueError(f"Action '{selected_action}' is not in allowed actions: {allowed_actions}")

        # 4. Simulate Outcome
        prob = recovery_score["recovery_probability"]
        if selected_action == "STOP":
            outcome = "STOPPED_SAFELY"
            recovered_amount = 0.0
        elif selected_action == "ESCALATE":
            outcome = "ESCALATED"
            recovered_amount = 0.0
        elif prob >= 0.40:
            outcome = "RECOVERED"
            recovered_amount = txn.amount
        else:
            outcome = "CUSTOMER_DECLINED"
            recovered_amount = 0.0

        now = datetime.utcnow()
        now_str = now.strftime("%H:%M:%S")

        # 5. Persist DB Records if session provided
        if db:
            action_record = RecoveryAction(
                id=f"act_{txn.id}_{int(now.timestamp())}",
                transaction_id=txn.id,
                action_type=selected_action,
                status="EXECUTED",
                policy_reason=policy_eval["reason"],
                stopping_rule=policy_eval["stopping_rule_triggered"],
                simulated_outcome=outcome,
                created_at=now
            )
            db.add(action_record)

            audit_1 = AuditEvent(
                id=f"aud_{txn.id}_1_{int(now.timestamp())}",
                transaction_id=txn.id,
                event_type="POLICY_EVALUATION",
                message=f"Action '{selected_action}' selected by SAFRA policy engine.",
                details=policy_eval["reason"],
                timestamp=now
            )
            audit_2 = AuditEvent(
                id=f"aud_{txn.id}_2_{int(now.timestamp())}",
                transaction_id=txn.id,
                event_type="RECOVERY_SIMULATION",
                message=f"Simulated execution outcome: {outcome}",
                details=f"Recovered {txn.currency} {recovered_amount:,.2f} via bounded workflow.",
                timestamp=now
            )
            db.add(audit_1)
            db.add(audit_2)

            # Update Transaction
            txn.actual_outcome = outcome
            if outcome == "RECOVERED":
                txn.payment_status = "RECOVERED"
            await db.commit()

        return {
            "transaction_id": txn.id,
            "action_executed": selected_action,
            "simulated_outcome": outcome,
            "recovered_amount": recovered_amount,
            "currency": txn.currency,
            "recovery_probability": prob,
            "policy_reason": policy_eval["reason"],
            "stopping_rule": policy_eval["stopping_rule_triggered"],
            "timestamp": now_str
        }
