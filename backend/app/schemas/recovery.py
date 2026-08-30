from typing import List, Dict, Any, Optional
from pydantic import BaseModel, ConfigDict
import datetime

class RecoveryScenarioOut(BaseModel):
    id: str
    title: str
    action: str
    expected_resolution_time: str
    resolution_minutes: int
    merchant_residual_exposure: float
    customer_complaint_multiplier: str
    operational_risk: str
    recommended: bool
    confidence: Optional[float] = None
    approval_required: Optional[bool] = None

class SimulationScenariosResponse(BaseModel):
    scenarios: List[RecoveryScenarioOut]
    safra_recommendation: RecoveryScenarioOut
    summary: str

class RecoveryActionOut(BaseModel):
    id: str
    playbook_name: str
    action_description: str
    risk_level: str
    status: str
    requires_approval: bool
    confidence: float
    expected_resolution_minutes: float
    exposure_mitigated: float
    approved_by: Optional[str] = None
    execution_result_json: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime.datetime]

    model_config = ConfigDict(from_attributes=True)

class ApproveActionRequest(BaseModel):
    approver_name: str = "Lead Finance Engineer"

class MerchantTwinResponse(BaseModel):
    merchant_id: str
    merchant_name: str
    merchant_category: str
    expected_financial_reality: float
    observed_financial_reality: float
    unexplained_drift: float
    drift_percentage: float
    settlement_health_score: float
    financial_consistency_score: float
    drift_breakdown: List[Dict[str, Any]]
    reconciliation_status: str
