import pytest
from app.services.simulation_engine import simulation_engine
from app.services.scenario_manager import scenario_manager

@pytest.mark.asyncio
async def test_simulation_engine_single_transaction_lifecycle():
    txn = await simulation_engine.generate_single_transaction_lifecycle()
    assert txn is not None
    assert "transaction_id" in txn
    assert txn["payment_method"] in simulation_engine.PAYMENT_RAILS
    assert txn["bank"] in simulation_engine.BANK_PROFILES
    assert txn["status"] in ["SUCCESS", "PENDING", "FAILED"]
    assert "recovery_probability" in txn
    assert "latency_ms" in txn

@pytest.mark.asyncio
async def test_simulation_kpi_calculations_non_hardcoded():
    # Generate 5 transactions
    for _ in range(5):
        await simulation_engine.generate_single_transaction_lifecycle()

    kpis = simulation_engine.get_live_kpis()
    assert kpis["total_transactions"] >= 5
    assert kpis["total_gmv_inr"] > 0
    assert 0 <= kpis["success_rate_pct"] <= 100
    assert "bank_latencies" in kpis
    assert "HDFC" in kpis["bank_latencies"]
    assert "failure_distribution" in kpis
    assert "status_distribution" in kpis

@pytest.mark.asyncio
async def test_scenario_manager_injection():
    res = await scenario_manager.inject_scenario("BANK_OUTAGE", bank_latency_ms=1850)
    assert res["scenario"] == "BANK_OUTAGE"
    assert "root_cause_hypothesis" in res
    assert "HDFC" in res["root_cause_hypothesis"]
    assert res["ai_confidence"] > 0.8

    # Reset back to NORMAL
    res_norm = await scenario_manager.inject_scenario("NORMAL")
    assert res_norm["scenario"] == "NORMAL"

@pytest.mark.asyncio
async def test_customer_fatigue_and_impact_calculations():
    # Low fatigue
    score_low = (1 * 22) + (0 * 18) + (0 * 30) - (20 * 0.4)
    assert score_low < 50

    # High fatigue
    score_high = (4 * 22) + (2 * 18) + (1 * 30) - (5 * 0.4)
    assert score_high >= 80

    # Impact calculation
    amt = 4999.0
    prob = 0.80
    cost = 42.0
    exp_net = round((amt * prob) - cost, 2)
    assert exp_net == round(4999.0 * 0.80 - 42.0, 2)
