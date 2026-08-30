from typing import List, Dict, Any, Optional
from pydantic import BaseModel, ConfigDict
import datetime

class RootCauseHypothesisOut(BaseModel):
    cause: str
    probability: float
    evidence: str

class InvestigationResponse(BaseModel):
    payment_id: str
    summary: str
    root_cause: str
    confidence: float
    hypotheses: List[RootCauseHypothesisOut]
    recommendation: str
    duplicate_risk: float
    reasoning_steps: List[Dict[str, Any]]
    requires_human_review: bool
    reality_validation: Optional[Dict[str, Any]] = None

class IncidentOut(BaseModel):
    id: str
    incident_reference: str
    incident_type: str
    severity: str
    status: str
    affected_bank: Optional[str]
    affected_rail: Optional[str]
    root_cause: Optional[str]
    confidence: float
    affected_transactions: int
    affected_merchants: int
    estimated_exposure: float
    predicted_pending_30m: int
    predicted_exposure_30m: float
    counterfactual_baseline: int
    counterfactual_excess: int
    counterfactual_attribution_pct: float
    created_at: Optional[datetime.datetime]

    model_config = ConfigDict(from_attributes=True)

class BlastRadiusResponse(BaseModel):
    bank_node: str
    current_impact: Dict[str, Any]
    predicted_next_30_minutes: Dict[str, Any]
    predicted_next_60_minutes: Dict[str, Any]
    blast_propagation_channels: List[Dict[str, Any]]
