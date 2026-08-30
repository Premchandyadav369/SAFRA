import datetime
import uuid
from sqlalchemy import Column, String, Float, DateTime, Integer, JSON, Text
from sqlalchemy.orm import relationship
from app.database.session import Base

class FinancialIncident(Base):
    __tablename__ = "financial_incidents"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_reference = Column(String(100), unique=True, index=True, nullable=False)
    
    # Incident Type: BANK_LATENCY_SPIKE, GATEWAY_CALLBACK_TIMEOUT, NPCI_UPI_DEGRADATION, SETTLEMENT_LATENCY
    incident_type = Column(String(100), nullable=False, index=True)
    severity = Column(String(50), default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String(50), default="ACTIVE", index=True) # ACTIVE, INVESTIGATING, MITIGATED, RESOLVED
    
    affected_bank = Column(String(100), nullable=True)
    affected_rail = Column(String(100), nullable=True)
    affected_gateway = Column(String(100), nullable=True)
    
    root_cause = Column(Text, nullable=True)
    confidence = Column(Float, default=0.0) # 0.0 to 1.0
    
    affected_transactions = Column(Integer, default=1)
    affected_merchants = Column(Integer, default=1)
    estimated_exposure = Column(Float, default=0.0) # In INR
    
    # Blast radius and counterfactual estimates
    predicted_pending_30m = Column(Integer, default=0)
    predicted_exposure_30m = Column(Float, default=0.0)
    counterfactual_baseline = Column(Integer, default=0)
    counterfactual_excess = Column(Integer, default=0)
    counterfactual_attribution_pct = Column(Float, default=0.0)
    
    graph_cluster_json = Column(JSON, default=dict)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    resolved_at = Column(DateTime, nullable=True)
    
    investigations = relationship("Investigation", back_populates="incident")
    recovery_actions = relationship("RecoveryAction", back_populates="incident")
