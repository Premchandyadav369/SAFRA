import numpy as np
from typing import Dict, Any, List

def extract_payment_features(payment_dict: Dict[str, Any], bank_pending_rate: float = 0.04, similar_success_rate: float = 0.85) -> np.ndarray:
    """
    Extracts a numeric feature vector for ML outcome and resolution time prediction.
    Features:
    0: amount (normalized log scale)
    1: payment_method_encoded (UPI=0, CC=1, DC=2, NETBANKING=3)
    2: bank_encoded (HDFC=0, SBI=1, ICICI=2, AXIS=3, OTHER=4)
    3: hour_of_day (0 to 23)
    4: bank_pending_rate (0.0 to 1.0)
    5: merchant_confirmation_latency_sec (e.g. 0 to 600)
    6: gateway_latency_sec (e.g. 0.05 to 5.0)
    7: similar_transaction_success_rate (0.0 to 1.0)
    8: pending_duration_minutes (0 to 120)
    9: missing_edges_count (0 to 5)
    """
    amount = float(payment_dict.get("amount", 1000.0))
    amount_log = np.log1p(amount) / 10.0 # Normalized
    
    method = payment_dict.get("payment_method", "UPI").upper()
    method_map = {"UPI": 0, "CREDIT_CARD": 1, "DEBIT_CARD": 2, "NETBANKING": 3}
    method_code = method_map.get(method, 0)
    
    bank = payment_dict.get("bank", "HDFC Bank").upper()
    bank_map = {"HDFC BANK": 0, "SBI": 1, "ICICI BANK": 2, "AXIS BANK": 3}
    bank_code = bank_map.get(bank, 4)
    
    hour = payment_dict.get("hour_of_day", 14)
    latency_sec = payment_dict.get("latency_sec", 15.0)
    gateway_lat = payment_dict.get("gateway_latency_sec", 0.12)
    pending_mins = payment_dict.get("pending_duration_minutes", 4.0)
    missing_edges = payment_dict.get("missing_edges_count", 1)

    return np.array([
        amount_log,
        method_code,
        bank_code,
        hour / 24.0,
        bank_pending_rate,
        min(latency_sec / 300.0, 2.0),
        min(gateway_lat / 2.0, 2.0),
        similar_success_rate,
        min(pending_mins / 60.0, 2.0),
        missing_edges / 5.0
    ], dtype=np.float32).reshape(1, -1)
