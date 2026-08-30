import os
import joblib
import numpy as np
from typing import Dict, Any, Tuple
from app.core.config import settings

class SafraMLIntelligence:
    def __init__(self):
        self.outcome_model = None
        self.resolution_model = None
        self.anomaly_detector = None
        self.is_loaded = False

    def load_or_train_models(self):
        """Loads pre-trained models from disk or generates fresh ones on boot."""
        os.makedirs(settings.MODEL_DIR, exist_ok=True)
        outcome_path = os.path.join(settings.MODEL_DIR, "outcome_classifier.joblib")
        resolution_path = os.path.join(settings.MODEL_DIR, "resolution_regressor.joblib")
        anomaly_path = os.path.join(settings.MODEL_DIR, "anomaly_detector.joblib")

        if os.path.exists(outcome_path) and os.path.exists(resolution_path) and os.path.exists(anomaly_path):
            try:
                self.outcome_model = joblib.load(outcome_path)
                self.resolution_model = joblib.load(resolution_path)
                self.anomaly_detector = joblib.load(anomaly_path)
                self.is_loaded = True
                return
            except Exception as e:
                print(f"Error loading models: {e}. Retraining...")

        from app.ml.trainer import train_baseline_models
        self.outcome_model, self.resolution_model, self.anomaly_detector = train_baseline_models()
        self.is_loaded = True

    def predict_outcome(self, feature_vector: np.ndarray) -> Dict[str, float]:
        """
        Returns probabilities for SUCCESS, REVERSAL, INTERVENTION.
        """
        if not self.is_loaded or self.outcome_model is None:
            self.load_or_train_models()

        probs = self.outcome_model.predict_proba(feature_vector)[0]
        # Classes: 0: SUCCESS, 1: REVERSAL, 2: INTERVENTION
        classes = self.outcome_model.classes_
        class_map = {c: p for c, p in zip(classes, probs)}
        
        return {
            "success_probability": round(float(class_map.get(0, 0.81)), 3),
            "reversal_probability": round(float(class_map.get(1, 0.14)), 3),
            "intervention_probability": round(float(class_map.get(2, 0.05)), 3)
        }

    def predict_resolution_time(self, feature_vector: np.ndarray) -> float:
        """
        Returns estimated minutes until payment state settles.
        """
        if not self.is_loaded or self.resolution_model is None:
            self.load_or_train_models()

        pred_mins = float(self.resolution_model.predict(feature_vector)[0])
        return max(1.0, round(pred_mins, 1))

    def detect_anomaly(self, feature_vector: np.ndarray) -> Tuple[bool, float]:
        """
        Returns (is_anomaly, anomaly_score)
        """
        if not self.is_loaded or self.anomaly_detector is None:
            self.load_or_train_models()

        # Isolation forest score: lower means more anomalous
        score = float(self.anomaly_detector.decision_function(feature_vector)[0])
        is_anomaly = score < 0.0
        # Normalize to 0-1 scale anomaly probability
        anomaly_prob = 1.0 / (1.0 + np.exp(score * 5.0))
        return is_anomaly, round(anomaly_prob, 3)

# Singleton ML service
safra_ml_engine = SafraMLIntelligence()
