import os
import joblib
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier, RandomForestRegressor, IsolationForest
from app.core.config import settings

def generate_synthetic_training_data(n_samples: int = 5000):
    """
    Generates realistic synthetic financial transaction features and ground-truth outcomes:
    Features: [amount_log, method, bank, hour, bank_pending_rate, callback_latency, gateway_lat, similar_rate, pending_mins, missing_edges]
    """
    np.random.seed(42)

    # 1. Feature sampling
    amounts = np.random.exponential(scale=3000, size=n_samples) + 100
    amount_log = np.log1p(amounts) / 10.0
    
    methods = np.random.choice([0, 1, 2, 3], size=n_samples, p=[0.75, 0.15, 0.05, 0.05]) # UPI dominates
    banks = np.random.choice([0, 1, 2, 3, 4], size=n_samples, p=[0.40, 0.30, 0.15, 0.10, 0.05])
    hours = np.random.randint(0, 24, size=n_samples) / 24.0
    
    bank_pending_rates = np.random.beta(a=2, b=40, size=n_samples) # Most banks ~4% pending rate
    callback_latencies = np.random.exponential(scale=20, size=n_samples) / 300.0
    gateway_lats = np.random.normal(loc=0.15, scale=0.05, size=n_samples)
    similar_success_rates = np.random.beta(a=30, b=4, size=n_samples) # Mostly high success
    pending_mins = np.random.exponential(scale=8.0, size=n_samples) / 60.0
    missing_edges = np.random.choice([0, 1, 2, 3], size=n_samples, p=[0.60, 0.30, 0.08, 0.02]) / 5.0

    X = np.column_stack([
        amount_log,
        methods,
        banks,
        hours,
        bank_pending_rates,
        callback_latencies,
        gateway_lats,
        similar_success_rates,
        pending_mins,
        missing_edges
    ])

    # 2. Outcome labels (0: SUCCESS, 1: REVERSAL, 2: INTERVENTION)
    # Payments with high similar success rates and low missing edges usually SUCCEED (80%+)
    # High bank pending rates and large pending mins lean towards REVERSAL or INTERVENTION
    y_outcome = np.zeros(n_samples, dtype=int)
    for i in range(n_samples):
        score_success = similar_success_rates[i] * 3.0 - missing_edges[i] * 2.0 - bank_pending_rates[i] * 4.0
        score_reversal = bank_pending_rates[i] * 3.0 + (pending_mins[i] > 0.5) * 1.5
        score_interv = (missing_edges[i] > 0.4) * 2.0 + (amounts[i] > 10000) * 0.5
        
        scores = np.array([score_success, score_reversal, score_interv])
        exp_s = np.exp(scores - np.max(scores))
        probs = exp_s / exp_s.sum()
        y_outcome[i] = np.random.choice([0, 1, 2], p=probs)

    # 3. Resolution time target (in minutes)
    y_resolution = 4.0 + (pending_mins * 20.0) + (callback_latencies * 15.0) + np.random.normal(0, 1.5, size=n_samples)
    y_resolution = np.clip(y_resolution, 1.0, 60.0)

    return X, y_outcome, y_resolution

def train_baseline_models():
    """Trains real Gradient Boosting Classifier, Random Forest Regressor, and Isolation Forest models."""
    os.makedirs(settings.MODEL_DIR, exist_ok=True)
    X, y_outcome, y_resolution = generate_synthetic_training_data(n_samples=6000)

    print("Training Outcome Classifier (GradientBoosting)...")
    outcome_clf = GradientBoostingClassifier(n_estimators=100, max_depth=4, random_state=42)
    outcome_clf.fit(X, y_outcome)

    print("Training Resolution Time Regressor (RandomForest)...")
    res_reg = RandomForestRegressor(n_estimators=100, max_depth=5, random_state=42)
    res_reg.fit(X, y_resolution)

    print("Training Anomaly Detector (IsolationForest)...")
    anomaly_detector = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
    anomaly_detector.fit(X)

    # Save artifacts
    joblib.dump(outcome_clf, os.path.join(settings.MODEL_DIR, "outcome_classifier.joblib"))
    joblib.dump(res_reg, os.path.join(settings.MODEL_DIR, "resolution_regressor.joblib"))
    joblib.dump(anomaly_detector, os.path.join(settings.MODEL_DIR, "anomaly_detector.joblib"))
    print("All ML models trained and persisted successfully.")

    return outcome_clf, res_reg, anomaly_detector

if __name__ == "__main__":
    train_baseline_models()
