from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String(64), primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    merchant_id = Column(String(64), index=True)
    merchant_name = Column(String(128))
    customer_id = Column(String(64), index=True)
    customer_name = Column(String(128))
    customer_segment = Column(String(64), default="STANDARD")
    amount = Column(Float, nullable=False)
    currency = Column(String(8), default="INR")
    payment_method = Column(String(64), default="UPI")
    payment_status = Column(String(32), default="PENDING", index=True)
    checkout_status = Column(String(64), default="BANK_DEBITED_AWAITING_WEBHOOK")
    failure_reason = Column(String(256))
    bank = Column(String(64), default="HDFC Bank")
    retry_count = Column(Integer, default=0)
    customer_history_score = Column(Float, default=0.85)
    time_since_last_attempt = Column(Integer, default=120)  # seconds
    subscription_flag = Column(Boolean, default=False)
    invoice_days_overdue = Column(Integer, default=0)
    historical_success_rate = Column(Float, default=0.92)
    risk_score = Column(Float, default=0.45)
    recovery_probability = Column(Float, default=0.74)
    estimated_recovery_value = Column(Float, default=0.0)
    recommended_action = Column(String(128), default="WAIT")
    actual_outcome = Column(String(64), default="RECOVERED")
    latency_ms = Column(Integer, default=180)
    signals = Column(JSON, default=list)

    # Relationships
    recovery_actions = relationship("Track03RecoveryAction", back_populates="transaction", cascade="all, delete-orphan")
    audit_events = relationship("AuditEvent", back_populates="transaction", cascade="all, delete-orphan")
    ai_explanations = relationship("AIExplanation", back_populates="transaction", cascade="all, delete-orphan")


class RecoveryCase(Base):
    __tablename__ = "recovery_cases"

    id = Column(String(64), primary_key=True, index=True)
    transaction_id = Column(String(64), ForeignKey("transactions.id"), index=True)
    status = Column(String(32), default="OPEN")
    assigned_action = Column(String(64), default="WAIT")
    recovered_amount = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)


class Track03RecoveryAction(Base):
    __tablename__ = "track03_recovery_actions"

    id = Column(String(64), primary_key=True, index=True)
    case_id = Column(String(64), nullable=True)
    transaction_id = Column(String(64), ForeignKey("transactions.id"), index=True)
    action_type = Column(String(64), nullable=False)
    status = Column(String(32), default="EXECUTED")
    policy_reason = Column(Text, nullable=True)
    stopping_rule = Column(String(128), nullable=True)
    simulated_outcome = Column(String(64), default="RECOVERED")
    created_at = Column(DateTime, default=datetime.utcnow)

    transaction = relationship("Transaction", back_populates="recovery_actions")


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(String(64), primary_key=True, index=True)
    transaction_id = Column(String(64), ForeignKey("transactions.id"), index=True)
    event_type = Column(String(64), default="SYSTEM_DECISION")
    message = Column(String(256), nullable=False)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    transaction = relationship("Transaction", back_populates="audit_events")


class BarrierInterception(Base):
    __tablename__ = "barrier_interceptions"

    id = Column(String(64), primary_key=True, index=True)
    transaction_id = Column(String(64), index=True)
    collision_hash = Column(String(64), nullable=False)
    prevented_amount = Column(Float, nullable=False)
    currency = Column(String(8), default="INR")
    customer_id = Column(String(64), index=True)
    merchant_id = Column(String(64), index=True)
    interception_reason = Column(String(256), default="Rapid duplicate repayment attempt during pending bank settlement")
    created_at = Column(DateTime, default=datetime.utcnow)


class BatchRun(Base):
    __tablename__ = "batch_runs"

    id = Column(String(64), primary_key=True, index=True)
    total_events = Column(Integer, default=0)
    events_at_risk = Column(Integer, default=0)
    total_revenue_at_risk = Column(Float, default=0.0)
    estimated_recoverable = Column(Float, default=0.0)
    recovered_revenue = Column(Float, default=0.0)
    recovery_rate = Column(Float, default=0.0)
    interventions_used = Column(Integer, default=0)
    cases_stopped_safely = Column(Integer, default=0)
    cases_escalated = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class AIExplanation(Base):
    __tablename__ = "ai_explanations"

    id = Column(String(64), primary_key=True, index=True)
    transaction_id = Column(String(64), ForeignKey("transactions.id"), index=True)
    model_name = Column(String(64), default="google/gemma-3-12b-it")
    prompt_context = Column(JSON, nullable=True)
    explanation = Column(Text, nullable=False)
    question = Column(String(256), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    transaction = relationship("Transaction", back_populates="ai_explanations")


class SimulationSession(Base):
    __tablename__ = "simulation_sessions"

    id = Column(String(64), primary_key=True, index=True)
    session_name = Column(String(128), default="SESSION_DEFAULT")
    scenario_type = Column(String(64), default="NORMAL")
    event_count = Column(Integer, default=0)
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    configuration = Column(JSON, default=dict)
    event_log = Column(JSON, default=list)


class InvestigationNote(Base):
    __tablename__ = "investigation_notes"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(256), nullable=False)
    hypothesis = Column(Text, nullable=False)
    author = Column(String(128), default="Risk Analyst")
    attached_filters = Column(JSON, default=dict)
    graph_snapshot = Column(JSON, default=dict)
    ai_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class DatasetImportLog(Base):
    __tablename__ = "dataset_import_logs"

    id = Column(String(64), primary_key=True, index=True)
    filename = Column(String(256), nullable=False)
    records_received = Column(Integer, default=0)
    valid_records = Column(Integer, default=0)
    rejected_records = Column(Integer, default=0)
    rejection_reasons = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
