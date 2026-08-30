import pytest
import numpy as np
from app.ml.models import SafraMLIntelligence
from app.ml.features import extract_payment_features

def test_ml_predictions():
    ml_engine = SafraMLIntelligence()
    ml_engine.load_or_train_models()
    assert ml_engine.is_loaded is True

    feat = extract_payment_features({
        "amount": 4999.0,
        "payment_method": "UPI",
        "bank": "HDFC Bank",
        "missing_edges_count": 1,
        "pending_duration_minutes": 5.0
    })

    outcomes = ml_engine.predict_outcome(feat)
    assert "success_probability" in outcomes
    assert "reversal_probability" in outcomes
    assert 0.0 <= outcomes["success_probability"] <= 1.0

    res_time = ml_engine.predict_resolution_time(feat)
    assert res_time >= 1.0

    is_anomaly, score = ml_engine.detect_anomaly(feat)
    assert isinstance(is_anomaly, (bool, np.bool_))
    assert 0.0 <= score <= 1.0
