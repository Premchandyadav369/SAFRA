import datetime
import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON, Integer, Text, Boolean
from sqlalchemy.orm import relationship
from app.database.session import Base

class RecoveryAction(Base):
    __tablename__ = "recovery_actions"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    investigation_id = Column(String(36), ForeignKey("investigations.id"), nullable=True, index=True)
    incident_id = Column(String(36), ForeignKey("financial_incidents.id"), nullable=True, index=True)
    
    # Playbook: RETRY_MERCHANT_CALLBACK, MONITOR_AND_WAIT, ESCALATE_TO_OPERATIONS, BLOCK_DUPLICATE_RETRY, INITIATE_PROACTIVE_REFUND
    playbook_name = Column(String(100), nullable=False)
    action_description = Column(Text, nullable=False)
    risk_level = Column(String(50), default="LOW") # LOW, MEDIUM, HIGH
    
    # Status: PENDING_APPROVAL, APPROVED, REJECTED, EXECUTED, FAILED
    status = Column(String(50), default="PENDING_APPROVAL", index=True)
    requires_approval = Column(Boolean, default=True)
    
    confidence = Column(Float, default=0.92)
    expected_resolution_minutes = Column(Float, default=15.0)
    exposure_mitigated = Column(Float, default=0.0)
    
    approved_by = Column(String(100), nullable=True)
    execution_result_json = Column(JSON, default=dict)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    executed_at = Column(DateTime, nullable=True)
    
    investigation = relationship("Investigation", back_populates="recovery_actions")
    incident = relationship("FinancialIncident", back_populates="recovery_actions")
