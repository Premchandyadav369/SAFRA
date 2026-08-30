import datetime
import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON, Integer, Text, Boolean
from sqlalchemy.orm import relationship
from app.database.session import Base

class Investigation(Base):
    __tablename__ = "investigations"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    payment_id = Column(String(36), ForeignKey("payments.id"), nullable=False, index=True)
    incident_id = Column(String(36), ForeignKey("financial_incidents.id"), nullable=True, index=True)
    
    # Status: RUNNING, COMPLETED, FAILED
    status = Column(String(50), default="COMPLETED", index=True)
    
    root_cause = Column(String(255), nullable=True)
    confidence = Column(Float, default=0.0) # 0.0 to 1.0
    summary = Column(Text, nullable=True)
    
    # Hypotheses list: [{"cause": "Merchant callback delay", "probability": 0.71}, ...]
    root_cause_hypotheses_json = Column(JSON, default=list)
    
    # Agent execution steps: [{"tool": "trace_payment_graph", "status": "done", "output": "..."}, ...]
    reasoning_steps_json = Column(JSON, default=list)
    
    recommendation = Column(String(255), default="DO_NOT_PAY_AGAIN")
    duplicate_risk = Column(Float, default=0.0)
    requires_human_review = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    completed_at = Column(DateTime, nullable=True)
    
    payment = relationship("Payment", back_populates="investigations")
    incident = relationship("FinancialIncident", back_populates="investigations")
    evidence = relationship("InvestigationEvidence", back_populates="investigation", cascade="all, delete-orphan")
    recovery_actions = relationship("RecoveryAction", back_populates="investigation")

class InvestigationEvidence(Base):
    __tablename__ = "investigation_evidence"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    investigation_id = Column(String(36), ForeignKey("investigations.id"), nullable=False, index=True)
    
    evidence_type = Column(String(100), nullable=False) # GRAPH_TRACE, BANK_TELEMETRY, SIMILAR_TX_SUCCESS_RATE, CALLBACK_LATENCY
    source = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    confidence_weight = Column(Float, default=1.0)
    metadata_json = Column(JSON, default=dict)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    investigation = relationship("Investigation", back_populates="evidence")
