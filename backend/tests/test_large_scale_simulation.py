import pytest
import random
from app.simulation import (
    StatisticalDistributions,
    MerchantProfiles,
    CustomerPopulation,
    IncidentLibrary,
    DeterministicAnomalyDetector,
    RecoveryQueuePrioritizer,
    ExperimentEngine,
    FlagshipTenCroreDay,
    LargeScalePaymentSimulationEngine
)

def test_statistical_distributions():
    prng = random.Random("TEST-SEED")
    # Test log-normal amount
    amt = StatisticalDistributions.generate_log_normal_amount(prng, median=1500.0)
    assert amt >= 10.0
    assert isinstance(amt, float)

    # Test Pareto latency
    lat = StatisticalDistributions.generate_pareto_latency(prng, base_ms=650.0)
    assert lat >= 650
    assert lat <= 8000

    # Test diurnal multiplier
    d_morning = StatisticalDistributions.compute_diurnal_multiplier(12.0)
    d_night = StatisticalDistributions.compute_diurnal_multiplier(3.0)
    assert d_morning > d_night

def test_seeded_determinism_and_reproducibility():
    sim1 = LargeScalePaymentSimulationEngine(seed="REPRODUCIBLE-SEED-999")
    sim2 = LargeScalePaymentSimulationEngine(seed="REPRODUCIBLE-SEED-999")

    # Generate amounts using both seeded PRNGs
    amts1 = [StatisticalDistributions.generate_log_normal_amount(sim1.prng, 2000.0) for _ in range(20)]
    amts2 = [StatisticalDistributions.generate_log_normal_amount(sim2.prng, 2000.0) for _ in range(20)]
    assert amts1 == amts2

def test_incident_library_and_black_swan():
    scenarios = IncidentLibrary.SCENARIOS
    assert len(scenarios) >= 11
    assert "PAYDAY_SURGE" in scenarios
    assert "BANK_LATENCY_DEGRADATION" in scenarios
    assert "SILENT_REVENUE_LEAK" in scenarios
    assert "BLACK_SWAN_MODE" in scenarios

    bs = IncidentLibrary.get_incident_config("BLACK_SWAN_MODE")
    assert bs["traffic_multiplier"] > 3.0
    assert bs["latency_multiplier"] > 3.0

def test_deterministic_anomaly_detector():
    detector = DeterministicAnomalyDetector()
    # Nominal baseline feed
    for _ in range(10):
        res = detector.update_and_detect(
            current_latency=550.0,
            current_timeout_rate=0.02,
            current_failure_rate=0.04,
            bank_stats={"HDFC": {"latency_ms": 550}}
        )
    assert not res["anomaly_detected"]

    # Sudden severe outage spike
    spike_res = detector.update_and_detect(
        current_latency=2600.0,
        current_timeout_rate=0.45,
        current_failure_rate=0.28,
        bank_stats={"HDFC": {"latency_ms": 2600}}
    )
    assert spike_res["anomaly_detected"]
    assert len(spike_res["ranked_hypotheses"]) >= 1
    assert "HDFC" in spike_res["ranked_hypotheses"][0]["title"]

def test_constrained_recovery_prioritizer():
    queue = [
        {"transaction_id": "tx1", "amount": 95000.0, "recovery_probability": 0.88, "customer_fatigue": 10, "customer_loyalty": 0.95},
        {"transaction_id": "tx2", "amount": 45000.0, "recovery_probability": 0.75, "customer_fatigue": 20, "customer_loyalty": 0.85},
        {"transaction_id": "tx3", "amount": 1200.0, "recovery_probability": 0.65, "customer_fatigue": 88, "customer_loyalty": 0.50},  # high fatigue
        {"transaction_id": "tx4", "amount": 250.0, "recovery_probability": 0.10, "customer_fatigue": 15, "customer_loyalty": 0.40}     # low prob
    ]

    res = RecoveryQueuePrioritizer.prioritize_and_allocate(
        queue=queue,
        max_interventions_per_min=10,
        recovery_budget_inr=1000.0,
        intervention_unit_cost_inr=42.0
    )

    assert res["allocated_count"] >= 2
    assert res["stopped_fatigue_count"] >= 1
    assert res["unviable_count"] >= 1
    assert res["total_expected_recovery_inr"] > 50000.0

def test_multi_strategy_comparison():
    failed = [
        {"transaction_id": f"t_{i}", "amount": float(1000 * i), "recovery_probability": 0.78, "customer_fatigue": 15}
        for i in range(1, 15)
    ]
    res = ExperimentEngine.evaluate_multi_strategy_comparison(failed)
    assert "strategies" in res
    strats = res["strategies"]
    assert "STRATEGY_A_RETRY_ALL" in strats
    assert "STRATEGY_D_SAFRA_ADAPTIVE" in strats
    # SAFRA net value should beat blind retries due to anti-fatigue & zero-cost wait barriers
    assert strats["STRATEGY_D_SAFRA_ADAPTIVE"]["net_value_created_inr"] > strats["STRATEGY_A_RETRY_ALL"]["net_value_created_inr"]

def test_monte_carlo_experiments():
    res = ExperimentEngine.run_monte_carlo_experiment("PAYDAY_SURGE", num_runs=15)
    assert res["total_runs"] == 15
    assert "baseline_stats" in res
    assert "safra_stats" in res
    assert res["safra_stats"]["mean_inr"] > res["baseline_stats"]["mean_inr"]
    assert res["safra_stats"]["ci95_low_inr"] < res["safra_stats"]["mean_inr"] < res["safra_stats"]["ci95_high_inr"]

def test_flagship_ten_crore_day_report():
    report = FlagshipTenCroreDay.get_summary_report()
    assert report["total_gmv_processed_inr"] == 100000000.0
    assert len(report["timeline_stages"]) == 9
    assert report["incremental_value_created_inr"] > 0
