import datetime
import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON, Integer, Enum, Text
from sqlalchemy.orm import relationship
from app.database.session import Base

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    external_customer_id = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=True)
    phone = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    payments = relationship("Payment", back_populates="customer")

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    payment_reference = Column(String(100), unique=True, index=True, nullable=False)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    customer_id = Column(String(36), ForeignKey("customers.id"), nullable=False, index=True)
    
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    
    payment_method = Column(String(50), default="UPI") # UPI, CREDIT_CARD, DEBIT_CARD, NETBANKING
    bank = Column(String(100), default="HDFC Bank") # HDFC Bank, SBI, ICICI Bank, Axis Bank
    payment_rail = Column(String(50), default="NPCI_UPI") # NPCI_UPI, VISA, MASTERCARD, IMPS
    gateway = Column(String(100), default="Razorpay Core")
    
    # Financial Reality State:
    # SUCCESS, PENDING, UNCERTAIN, FAILED, REVERSED
    status = Column(String(50), default="PENDING", index=True)
    reality_score = Column(Float, default=100.0) # 0 to 100 Financial Reality Score
    
    # Observed flags across ecosystem
    bank_debited = Column(String(20), default="YES") # YES, NO, UNKNOWN
    rail_acknowledged = Column(String(20), default="YES") # YES, NO, UNKNOWN
    gateway_status = Column(String(50), default="PROCESSING") # PROCESSING, CAPTURED, FAILED
    merchant_confirmed = Column(String(20), default="NO") # YES, NO, UNKNOWN
    settlement_status = Column(String(50), default="AWAITING") # SETTLED, AWAITING, FAILED
    
    # Uncertainty analysis fields
    success_probability = Column(Float, nullable=True)
    reversal_probability = Column(Float, nullable=True)
    intervention_probability = Column(Float, nullable=True)
    estimated_resolution_minutes = Column(Float, nullable=True)
    duplicate_risk = Column(Float, default=0.0)
    recommendation = Column(String(100), default="MONITOR") # DO_NOT_PAY_AGAIN, PROCEED, REVERT, RETRY
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    # Relationships
    customer = relationship("Customer", back_populates="payments")
    merchant = relationship("Merchant", back_populates="payments")
    events = relationship("PaymentEvent", back_populates="payment", cascade="all, delete-orphan", order_by="PaymentEvent.event_timestamp")
    investigations = relationship("Investigation", back_populates="payment")

class PaymentEvent(Base):
    __tablename__ = "payment_events"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    payment_id = Column(String(36), ForeignKey("payments.id"), nullable=False, index=True)
    
    # Event Types:
    # PAYMENT_INITIATED, BANK_DEBITED, NETWORK_ACKNOWLEDGED, GATEWAY_PROCESSING,
    # MERCHANT_CONFIRMED, PAYMENT_FAILED, PAYMENT_REVERSED, SETTLEMENT_CREATED, SETTLEMENT_COMPLETED
    event_type = Column(String(100), nullable=False, index=True)
    source = Column(String(100), nullable=False) # CustomerApp, BankCore, UPI_Rail, RazorpayGateway, MerchantWebhook
    latency_ms = Column(Integer, default=50)
    
    status = Column(String(50), default="SUCCESS") # SUCCESS, DELAYED, FAILED, TIMEOUT
    payload_json = Column(JSON, default=dict)
    event_timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    payment = relationship("Payment", back_populates="events")
