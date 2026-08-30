import datetime
import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON, Integer, Text
from app.database.session import Base

class IncidentMemory(Base):
    __tablename__ = "incident_memory"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_reference = Column(String(100), index=True, nullable=False)
    
    pattern_signature = Column(String(255), nullable=False, index=True) # e.g. "UPI_HDFC_CALLBACK_LATENCY"
    root_cause = Column(Text, nullable=False)
    successful_playbook = Column(String(100), nullable=False)
    
    resolution_time_minutes = Column(Float, default=30.0)
    financial_recovery_rate = Column(Float, default=0.98) # 0.0 to 1.0
    
    features_json = Column(JSON, default=dict)
    embedding_vector_json = Column(JSON, default=list) # Fallback vector representation
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
