from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
import datetime

class PaymentBase(BaseModel):
    payment_reference: str
    merchant_id: str
    customer_id: str
    amount: float
    currency: str = "INR"
    payment_method: str = "UPI"
    bank: str = "HDFC Bank"
    payment_rail: str = "NPCI_UPI"
    gateway: str = "Razorpay Core"

class PaymentCreate(PaymentBase):
    pass

class PaymentEventOut(BaseModel):
    id: str
    event_type: str
    source: str
    status: str
    latency_ms: int
    event_timestamp: Optional[datetime.datetime]

    model_config = ConfigDict(from_attributes=True)

class PaymentOut(PaymentBase):
    id: str
    status: str
    reality_score: float
    bank_debited: str
    rail_acknowledged: str
    gateway_status: str
    merchant_confirmed: str
    settlement_status: str
    success_probability: Optional[float] = None
    reversal_probability: Optional[float] = None
    intervention_probability: Optional[float] = None
    estimated_resolution_minutes: Optional[float] = None
    duplicate_risk: float = 0.0
    recommendation: str = "MONITOR"
    created_at: Optional[datetime.datetime]
    events: List[PaymentEventOut] = []

    model_config = ConfigDict(from_attributes=True)

class DuplicateCheckRequest(BaseModel):
    customer_id: str
    merchant_id: str
    amount: float
    payment_method: str = "UPI"

class DuplicateCheckResponse(BaseModel):
    is_duplicate_risk: bool
    similarity_score: float
    similarity_percentage: float
    risk_level: str
    previous_payment: Optional[Dict[str, Any]] = None
    recommendation: str
    message: str
