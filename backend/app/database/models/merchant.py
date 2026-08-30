import datetime
import uuid
from sqlalchemy import Column, String, Float, DateTime, Integer, JSON
from sqlalchemy.orm import relationship
from app.database.session import Base

class Merchant(Base):
    __tablename__ = "merchants"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(200), nullable=False)
    merchant_category = Column(String(100), default="E-Commerce") # E-Commerce, SaaS, Retail, Travel, FoodDelivery
    risk_level = Column(String(50), default="LOW") # LOW, MEDIUM, HIGH
    callback_url = Column(String(500), nullable=True)
    
    # Financial Digital Twin Metrics
    expected_daily_volume = Column(Float, default=1500000.0) # In INR
    observed_daily_volume = Column(Float, default=1427000.0)
    unexplained_drift = Column(Float, default=73000.0)
    
    settlement_cycle = Column(String(50), default="T+1")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    payments = relationship("Payment", back_populates="merchant")
    settlements = relationship("Settlement", back_populates="merchant")
