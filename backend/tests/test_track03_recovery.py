import pytest
from app.database.models import Transaction
from app.services.signal_engine import SignalEngine
from app.services.recovery_engine import RecoveryEngine
from app.services.policy_engine import PolicyEngine
from app.services.graph_engine import GraphEngine
from app.services.workflow_executor import WorkflowExecutor
from app.ai.gemma_client import safra_ai_provider

@pytest.mark.asyncio
async def test_signal_extraction_and_recovery_scoring():
    txn = Transaction(
        id="TEST-TXN-01",
        amount=4999.0,
        currency="INR",
        failure_reason="UPI Pending - Bank Callback Delayed",
        customer_history_score=0.90,
        retry_count=1,
        payment_status="PENDING",
        invoice_days_overdue=0
    )
    signals = SignalEngine.extract_signals(txn)
    assert len(signals) >= 1
    signal_names = [s["signal_name"] for s in signals]
    assert "TEMPORARY_BANK_FAILURE" in signal_names

    score = RecoveryEngine.calculate_score(txn, signals)
    assert score["recovery_probability"] > 0.65
    assert score["estimated_recovery_value"] > 3000
    assert "score_breakdown" in score

@pytest.mark.asyncio
async def test_policy_decisions_and_stopping_rules():
    # Test Normal Wait Rule
    txn_wait = Transaction(
        id="TEST-TXN-02",
        amount=4999.0,
        failure_reason="Temporary Bank CBS Switch Latency",
        customer_history_score=0.85,
        retry_count=1,
        payment_status="PENDING",
        invoice_days_overdue=0
    )
    signals_wait = SignalEngine.extract_signals(txn_wait)
    score_wait = RecoveryEngine.calculate_score(txn_wait, signals_wait)
    policy_wait = PolicyEngine.evaluate(txn_wait, signals_wait, score_wait)
    assert policy_wait["decision"] == "WAIT"

    # Test Stopping Rule: Contact Limit Reached
    txn_stop = Transaction(
        id="TEST-TXN-03",
        amount=4999.0,
        failure_reason="Card Authentication Failed",
        customer_history_score=0.50,
        retry_count=3,
        payment_status="FAILED",
        invoice_days_overdue=0
    )
    signals_stop = SignalEngine.extract_signals(txn_stop)
    score_stop = RecoveryEngine.calculate_score(txn_stop, signals_stop)
    policy_stop = PolicyEngine.evaluate(txn_stop, signals_stop, score_stop)
    assert policy_stop["decision"] == "STOP"
    assert policy_stop["stopping_rule_triggered"] == "CUSTOMER_CONTACT_LIMIT"

@pytest.mark.asyncio
async def test_invalid_action_rejection():
    txn = Transaction(
        id="TEST-TXN-04",
        amount=4999.0,
        currency="INR",
        failure_reason="Card Authentication Failed",
        customer_history_score=0.50,
        retry_count=3,
        payment_status="FAILED"
    )
    with pytest.raises(ValueError):
        await WorkflowExecutor.execute_recovery(txn, requested_action="INVALID_UNBOUNDED_ACTION")

@pytest.mark.asyncio
async def test_graph_generation():
    txn = Transaction(
        id="TEST-TXN-05",
        amount=4999.0,
        currency="INR",
        customer_id="cust_aryan",
        customer_name="Aryan Sharma",
        merchant_name="Zenith Store",
        bank="HDFC Bank",
        payment_method="UPI",
        payment_status="PENDING",
        failure_reason="UPI Callback Timeout",
        retry_count=1,
        recovery_probability=0.81
    )
    graph = GraphEngine.build_graph(txn)
    assert graph["total_nodes"] >= 5
    assert graph["total_edges"] >= 4
    node_types = [n["type"] for n in graph["nodes"]]
    assert "CUSTOMER" in node_types
    assert "CHECKOUT" in node_types
    assert "BANK" in node_types
    assert "SAFRA_AGENT" in node_types or "RECOVERY_ACTION" in node_types

@pytest.mark.asyncio
async def test_gemma_ai_fallback_explanation():
    context = {
        "transaction_id": "TEST-TXN-06",
        "amount": 4999,
        "currency": "INR",
        "status": "PENDING",
        "failure_reason": "Bank timeout",
        "selected_action": "WAIT",
        "recovery_probability": 0.81
    }
    explanation = await safra_ai_provider.explain_action(context)
    assert len(explanation) > 20
    assert "SAFRA" in explanation or "WAIT" in explanation
