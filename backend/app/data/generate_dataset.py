import random
from datetime import datetime, timedelta
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.models import Transaction, AuditEvent

MERCHANTS = [
  {"id": "m_zenith_01", "name": "Zenith Electronics"},
  {"id": "m_hypermart_02", "name": "HyperMart Groceries"},
  {"id": "m_aerowings_03", "name": "AeroWings Flight Bookings"},
  {"id": "m_cloudscale_04", "name": "CloudScale Enterprise SaaS"},
  {"id": "m_urbancrafters_05", "name": "UrbanCrafters Fashion"},
  {"id": "m_quickdine_06", "name": "QuickDine Food Orders"},
  {"id": "m_fitpulse_07", "name": "FitPulse Subscriptions"},
  {"id": "m_edusprint_08", "name": "EduSprint Learning"},
  {"id": "m_omnicore_09", "name": "OmniCore B2B Invoices"},
  {"id": "m_razorstore_10", "name": "RazorStore Merchant Hub"},
]

CUSTOMERS = [
  ("cust_aryan_01", "Aryan Sharma", "HIGH_VALUE"),
  ("cust_priya_02", "Priya Deshmukh", "REPEAT_BUYER"),
  ("cust_rohan_03", "Rohan Mehta", "NEW_USER"),
  ("cust_ananya_04", "Ananya Iyer", "HIGH_VALUE"),
  ("cust_devendra_05", "Devendra Singh", "REPEAT_BUYER"),
  ("cust_kavita_06", "Kavita Patel", "LAPSED"),
  ("cust_vikram_07", "Vikram Malhotra", "HIGH_VALUE"),
  ("cust_ayesha_08", "Ayesha Khan", "REPEAT_BUYER"),
  ("cust_rahul_09", "Rahul Nair", "STANDARD"),
  ("cust_sneha_10", "Sneha Sen", "STANDARD"),
  ("cust_david_11", "David Miller", "GLOBAL_ENTERPRISE"),
  ("cust_elena_12", "Elena Rostova", "GLOBAL_ENTERPRISE"),
]

BANKS = [
  "HDFC Bank",
  "State Bank of India",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra",
  "Citibank Global",
  "JPMorgan Chase",
]

FAILURE_TEMPLATES = [
  {
    "reason": "UPI Pending - Bank Callback Delayed",
    "status": "PENDING",
    "checkout": "BANK_DEBITED_AWAITING_WEBHOOK",
    "method": "UPI",
    "base_prob": 0.81,
    "rec_action": "WAIT",
    "sub_flag": False,
    "overdue": 0
  },
  {
    "reason": "Card Authentication Failed (OTP Timeout)",
    "status": "FAILED",
    "checkout": "DROPPED_AT_OTP",
    "method": "Credit Card",
    "base_prob": 0.72,
    "rec_action": "SEND_RECOVERY_LINK",
    "sub_flag": False,
    "overdue": 0
  },
  {
    "reason": "Temporary Bank CBS Switch Latency",
    "status": "PENDING",
    "checkout": "CBS_SWITCH_TIMEOUT",
    "method": "NetBanking",
    "base_prob": 0.78,
    "rec_action": "WAIT",
    "sub_flag": False,
    "overdue": 0
  },
  {
    "reason": "Insufficient Account Balance",
    "status": "FAILED",
    "checkout": "INSUFFICIENT_FUNDS",
    "method": "Debit Card",
    "base_prob": 0.38,
    "rec_action": "OFFER_ALTERNATIVE_PAYMENT_METHOD",
    "sub_flag": False,
    "overdue": 0
  },
  {
    "reason": "Checkout Abandoned at Final Step",
    "status": "ABANDONED",
    "checkout": "CART_ABANDONED_STEP_3",
    "method": "UPI",
    "base_prob": 0.58,
    "rec_action": "SEND_RECOVERY_LINK",
    "sub_flag": False,
    "overdue": 0
  },
  {
    "reason": "Duplicate Payment Attempt Prevented",
    "status": "PENDING",
    "checkout": "RETRY_INTENT_INTERCEPTED",
    "method": "UPI",
    "base_prob": 0.89,
    "rec_action": "WAIT",
    "sub_flag": False,
    "overdue": 0
  },
  {
    "reason": "SaaS Recurring Subscription Auth Failed",
    "status": "FAILED",
    "checkout": "MANDATE_RENEWAL_FAILED",
    "method": "Card Token",
    "base_prob": 0.74,
    "rec_action": "SEND_PAYMENT_REMINDER",
    "sub_flag": True,
    "overdue": 0
  },
  {
    "reason": "B2B Invoice Overdue Past Net-30",
    "status": "FAILED",
    "checkout": "INVOICE_UNPAID",
    "method": "NetBanking",
    "base_prob": 0.42,
    "rec_action": "ESCALATE",
    "sub_flag": False,
    "overdue": 21
  },
  {
    "reason": "Payment Gateway 504 Ingestion Timeout",
    "status": "PENDING",
    "checkout": "GATEWAY_TIMEOUT",
    "method": "UPI",
    "base_prob": 0.84,
    "rec_action": "WAIT",
    "sub_flag": False,
    "overdue": 0
  },
  {
    "reason": "Mandate Recurring Sequence Degraded",
    "status": "FAILED",
    "checkout": "MANDATE_DECLINED",
    "method": "Card Token",
    "base_prob": 0.62,
    "rec_action": "SEND_PAYMENT_REMINDER",
    "sub_flag": True,
    "overdue": 0
  }
]

def generate_500_transactions() -> List[Transaction]:
    random.seed(42)  # Fixed deterministic seed
    txns = []
    base_time = datetime.utcnow()

    # Hero Transaction 1: Aryan Sharma ₹4,999 UPI Pending
    hero_1 = Transaction(
        id="PAY-4999-HERO",
        timestamp=base_time - timedelta(minutes=4),
        merchant_id="m_zenith_01",
        merchant_name="Zenith Electronics",
        customer_id="cust_aryan_01",
        customer_name="Aryan Sharma",
        customer_segment="HIGH_VALUE",
        amount=4999.0,
        currency="INR",
        payment_method="UPI",
        payment_status="PENDING",
        checkout_status="BANK_DEBITED_AWAITING_WEBHOOK",
        failure_reason="UPI Pending - Bank Callback Delayed",
        bank="HDFC Bank",
        retry_count=1,
        customer_history_score=0.92,
        time_since_last_attempt=240,
        subscription_flag=False,
        invoice_days_overdue=0,
        historical_success_rate=0.95,
        risk_score=0.26,
        recovery_probability=0.81,
        estimated_recovery_value=4049.19,
        recommended_action="WAIT",
        actual_outcome="RECOVERED",
        signals=[
            {"signal_name": "TEMPORARY_BANK_FAILURE", "weight": 0.85, "evidence": "HDFC Bank debited; webhook delivery delayed."},
            {"signal_name": "HIGH_PURCHASE_HISTORY", "weight": 0.80, "evidence": "Repeat customer with 4 prior successful checkouts."}
        ]
    )
    txns.append(hero_1)

    # Hero Transaction 2: Global Enterprise USD SaaS Transaction
    hero_2 = Transaction(
        id="TXN-USD-GLOBAL-02",
        timestamp=base_time - timedelta(minutes=15),
        merchant_id="m_cloudscale_04",
        merchant_name="CloudScale Enterprise SaaS",
        customer_id="cust_david_11",
        customer_name="David Miller",
        customer_segment="GLOBAL_ENTERPRISE",
        amount=120.0,
        currency="USD",
        payment_method="Credit Card",
        payment_status="PENDING",
        checkout_status="CROSS_BORDER_FRAUD_HOLD",
        failure_reason="Cross-Border 3DS Verification Latency",
        bank="Citibank Global",
        retry_count=0,
        customer_history_score=0.88,
        time_since_last_attempt=90,
        subscription_flag=True,
        invoice_days_overdue=0,
        historical_success_rate=0.91,
        risk_score=0.22,
        recovery_probability=0.89,
        estimated_recovery_value=106.8,
        recommended_action="WAIT",
        actual_outcome="RECOVERED",
        signals=[
            {"signal_name": "SUBSCRIPTION_VALUE_HIGH", "weight": 0.82, "evidence": "Annual enterprise contract auto-renewal."},
            {"signal_name": "TEMPORARY_BANK_FAILURE", "weight": 0.75, "evidence": "Cross-border 3DS2 clearing in transit."}
        ]
    )
    txns.append(hero_2)

    # Generate 498 more realistic records
    for i in range(3, 501):
        tmpl = FAILURE_TEMPLATES[i % len(FAILURE_TEMPLATES)]
        merchant = MERCHANTS[i % len(MERCHANTS)]
        cust_id, cust_name, cust_seg = CUSTOMERS[i % len(CUSTOMERS)]
        bank = BANKS[i % len(BANKS)]

        is_usd = (i % 7 == 0)
        currency = "USD" if is_usd else "INR"
        amount = random.choice([24, 48, 120, 240, 480]) if is_usd else random.choice([299, 499, 899, 1499, 2499, 4999, 8990, 14999, 28000])

        retry_count = random.choice([0, 1, 2, 3])
        history_score = round(random.uniform(0.4, 0.98), 2)
        time_offset = i * 3 + random.randint(1, 10)
        timestamp = base_time - timedelta(minutes=time_offset)

        prob = tmpl["base_prob"] + (history_score - 0.5) * 0.2
        if retry_count >= 3:
            prob -= 0.25
        prob = round(max(0.12, min(0.96, prob)), 2)

        risk = round(1.0 - prob + 0.1, 2)
        rec_val = round(amount * prob, 2)

        rec_action = tmpl["rec_action"]
        if retry_count >= 3:
            rec_action = "STOP"

        outcome = "RECOVERED" if prob >= 0.40 else "CUSTOMER_DECLINED"
        if rec_action == "STOP":
            outcome = "STOPPED_SAFELY"
        elif rec_action == "ESCALATE":
            outcome = "ESCALATED"

        t = Transaction(
            id=f"TXN-{10000 + i}",
            timestamp=timestamp,
            merchant_id=merchant["id"],
            merchant_name=merchant["name"],
            customer_id=cust_id,
            customer_name=cust_name,
            customer_segment=cust_seg,
            amount=float(amount),
            currency=currency,
            payment_method=tmpl["method"],
            payment_status=tmpl["status"],
            checkout_status=tmpl["checkout"],
            failure_reason=tmpl["reason"],
            bank=bank,
            retry_count=retry_count,
            customer_history_score=history_score,
            time_since_last_attempt=random.randint(30, 400),
            subscription_flag=tmpl["sub_flag"],
            invoice_days_overdue=tmpl["overdue"],
            historical_success_rate=round(random.uniform(0.75, 0.98), 2),
            risk_score=risk,
            recovery_probability=prob,
            estimated_recovery_value=rec_val,
            recommended_action=rec_action,
            actual_outcome=outcome,
            signals=[
                {"signal_name": "TEMPORARY_BANK_FAILURE" if "timeout" in tmpl["reason"].lower() else "CUSTOMER_HIGH_INTENT", "weight": 0.80, "evidence": tmpl["reason"]}
            ]
        )
        txns.append(t)

    return txns

async def seed_dataset_if_empty(session: AsyncSession):
    res = await session.execute(select(Transaction).limit(1))
    if not res.scalar_one_or_none():
        print("[SAFRA] Generating and seeding 500 synthetic realistic transactions...")
        txns = generate_500_transactions()
        session.add_all(txns)
        await session.commit()
        print(f"[SAFRA] Successfully seeded {len(txns)} transactions.")
