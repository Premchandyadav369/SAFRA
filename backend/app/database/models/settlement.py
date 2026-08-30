import datetime
import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.session import Base

class Settlement(Base):
    __tablename__ = "settlements"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    settlement_reference = Column(String(100), unique=True, index=True, nullable=False)
    
    expected_amount = Column(Float, nullable=False)
    actual_amount = Column(Float, default=0.0)
    fee_deducted = Column(Float, default=0.0)
    tax_deducted = Column(Float, default=0.0)
    
    # Status: PENDING, PROCESSED, DELAYED, DISCREPANCY, RECONCILED
    status = Column(String(50), default="PENDING", index=True)
    discrepancy_reason = Column(String(255), nullable=True)
    
    expected_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    merchant = relationship("Merchant", back_populates="settlements")
