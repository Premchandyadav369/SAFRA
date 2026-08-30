import datetime
import random
import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import (
    Customer, Merchant, Payment, PaymentEvent, Settlement, FinancialIncident,
    Investigation, InvestigationEvidence, RecoveryAction, IncidentMemory
)
from app.graph.reality_graph import reality_graph_engine
from app.services.incident_clustering import IncidentClusteringService

class SimulationService:
    """
    High-fidelity Synthetic Transaction Generator and Failure Injector.
    Seeds realistic financial topologies and powers interactive incident simulations.
    """

    HERO_PAYMENT_REF = "PAY-4999-HERO"

    @classmethod
    async def initialize_seed_data(cls, db: AsyncSession):
        """Initializes canonical merchants, customers, historical memories, and hero payments."""
        # Check if already seeded
        stmt = select(Customer).limit(1)
        res = await db.execute(stmt)
        if res.scalar_one_or_none():
            # Already initialized, refresh graph
            await cls.sync_graph_from_db(db)
            return

        print("Seeding initial SAFRA financial topology...")

        # 1. Seed Merchants
        merchants_data = [
            {"name": "Zenith E-Commerce Retail", "category": "E-Commerce", "expected_vol": 1245000.0, "observed_vol": 1172000.0, "drift": 73000.0},
            {"name": "CloudScale SaaS Platform", "category": "SaaS", "expected_vol": 850000.0, "observed_vol": 845000.0, "drift": 5000.0},
            {"name": "HyperMart Groceries", "category": "QuickCommerce", "expected_vol": 620000.0, "observed_vol": 618000.0, "drift": 2000.0},
            {"name": "AeroWings Airline Booking", "category": "Travel", "expected_vol": 2400000.0, "observed_vol": 2350000.0, "drift": 50000.0}
        ]
        created_merchants = []
        for m in merchants_data:
            merchant = Merchant(
                name=m["name"],
                merchant_category=m["category"],
                expected_daily_volume=m["expected_vol"],
                observed_daily_volume=m["observed_vol"],
                unexplained_drift=m["drift"],
                callback_url=f"https://api.{m['name'].lower().replace(' ', '')}.com/webhooks/razorpay"
            )
            db.add(merchant)
            created_merchants.append(merchant)
        await db.flush()

        # 2. Seed Customers
        customers_data = [
            {"name": "Aryan Sharma", "email": "aryan.sharma@example.com", "phone": "+91 98765 43210"},
            {"name": "Priya Deshmukh", "email": "priya.d@example.com", "phone": "+91 98123 45678"},
            {"name": "Rohan Mehta", "email": "rohan.m@example.com", "phone": "+91 97234 56789"},
            {"name": "Ananya Iyer", "email": "ananya.i@example.com", "phone": "+91 96345 67890"}
        ]
        created_customers = []
        for c in customers_data:
            customer = Customer(
                external_customer_id=f"CUST-{uuid.uuid4().hex[:8].upper()}",
                name=c["name"],
                email=c["email"],
                phone=c["phone"]
            )
            db.add(customer)
            created_customers.append(customer)
        await db.flush()

        # 3. Seed Incident Memories
        memories = [
            IncidentMemory(
                incident_reference="INC-HDFC-UPI-884",
                pattern_signature="UPI_HDFC_CALLBACK_LATENCY",
                root_cause="HDFC CBS latency surge causing merchant webhook response timeouts.",
                successful_playbook="RETRY_MERCHANT_CALLBACK",
                resolution_time_minutes=37.0,
                financial_recovery_rate=0.99
            ),
            IncidentMemory(
                incident_reference="INC-NPCI-DEGRADE-412",
                pattern_signature="NPCI_UPI_RAIL_DEGRADATION",
                root_cause="NPCI UPI switch degradation under peak evening traffic.",
                successful_playbook="MONITOR_AND_WAIT",
                resolution_time_minutes=48.0,
                financial_recovery_rate=0.96
            )
        ]
        db.add_all(memories)

        # 4. Seed Hero Payment: ₹4,999 (Aryan Sharma -> Zenith Retail)
        hero_pay = Payment(
            payment_reference=cls.HERO_PAYMENT_REF,
            merchant_id=created_merchants[0].id,
            customer_id=created_customers[0].id,
            amount=4999.0,
            currency="INR",
            payment_method="UPI",
            bank="HDFC Bank",
            payment_rail="NPCI_UPI",
            gateway="Razorpay Core",
            status="PENDING",
            reality_score=72.5,
            bank_debited="YES",
            rail_acknowledged="YES",
            gateway_status="PROCESSING",
            merchant_confirmed="NO",
            settlement_status="AWAITING",
            success_probability=0.81,
            reversal_probability=0.14,
            intervention_probability=0.05,
            estimated_resolution_minutes=6.5,
            duplicate_risk=0.88,
            recommendation="DO_NOT_PAY_AGAIN"
        )
        db.add(hero_pay)
        await db.flush()

        # Events for Hero Payment
        now = datetime.datetime.utcnow()
        hero_events = [
            PaymentEvent(payment_id=hero_pay.id, event_type="PAYMENT_INITIATED", source="CustomerApp", status="SUCCESS", latency_ms=45, event_timestamp=now - datetime.timedelta(minutes=7)),
            PaymentEvent(payment_id=hero_pay.id, event_type="BANK_DEBITED", source="HDFC_Bank_CBS", status="SUCCESS", latency_ms=180, event_timestamp=now - datetime.timedelta(minutes=6, seconds=45)),
            PaymentEvent(payment_id=hero_pay.id, event_type="NETWORK_ACKNOWLEDGED", source="NPCI_UPI_Rail", status="SUCCESS", latency_ms=95, event_timestamp=now - datetime.timedelta(minutes=6, seconds=30)),
            PaymentEvent(payment_id=hero_pay.id, event_type="GATEWAY_PROCESSING", source="RazorpayGateway", status="PROCESSING", latency_ms=110, event_timestamp=now - datetime.timedelta(minutes=6, seconds=15))
        ]
        db.add_all(hero_events)

        # 5. Seed 30 Background Realistic Payments (mix of Success, Pending, Reconciled)
        banks = ["HDFC Bank", "SBI", "ICICI Bank", "Axis Bank"]
        methods = ["UPI", "CREDIT_CARD", "NETBANKING"]
        
        for i in range(1, 31):
            is_pending = i % 5 == 0
            amt = random.choice([299.0, 799.0, 1499.0, 2499.0, 5999.0, 12000.0])
            b = random.choice(banks)
            m_obj = random.choice(created_merchants)
            c_obj = random.choice(created_customers)

            bg_pay = Payment(
                payment_reference=f"PAY-2026-{1000 + i}",
                merchant_id=m_obj.id,
                customer_id=c_obj.id,
                amount=amt,
                currency="INR",
                payment_method="UPI" if random.random() > 0.3 else "CREDIT_CARD",
                bank=b,
                payment_rail="NPCI_UPI" if b != "Axis Bank" else "VISA",
                gateway="Razorpay Core",
                status="PENDING" if is_pending else "SUCCESS",
                reality_score=70.0 if is_pending else 98.0,
                bank_debited="YES",
                rail_acknowledged="YES",
                gateway_status="PROCESSING" if is_pending else "CAPTURED",
                merchant_confirmed="NO" if is_pending else "YES",
                settlement_status="AWAITING" if is_pending else "SETTLED",
                success_probability=0.82 if is_pending else 1.0,
                reversal_probability=0.13 if is_pending else 0.0,
                intervention_probability=0.05 if is_pending else 0.0,
                estimated_resolution_minutes=5.0 if is_pending else 0.0,
                duplicate_risk=0.10,
                recommendation="DO_NOT_PAY_AGAIN" if is_pending else "SETTLED",
                created_at=now - datetime.timedelta(minutes=random.randint(2, 60))
            )
            db.add(bg_pay)
            await db.flush()

            # Add basic event
            ev1 = PaymentEvent(payment_id=bg_pay.id, event_type="PAYMENT_INITIATED", source="CustomerApp", status="SUCCESS", latency_ms=40, event_timestamp=bg_pay.created_at)
            ev2 = PaymentEvent(payment_id=bg_pay.id, event_type="BANK_DEBITED", source=f"{b}_Core", status="SUCCESS", latency_ms=160, event_timestamp=bg_pay.created_at + datetime.timedelta(seconds=1))
            db.add_all([ev1, ev2])
            if not is_pending:
                ev3 = PaymentEvent(payment_id=bg_pay.id, event_type="MERCHANT_CONFIRMED", source="MerchantWebhook", status="SUCCESS", latency_ms=210, event_timestamp=bg_pay.created_at + datetime.timedelta(seconds=2))
                db.add(ev3)

        await db.commit()
        await cls.sync_graph_from_db(db)
        await IncidentClusteringService.run_clustering_detection(db)
        print("Topology seeded and graph synchronized.")

    @classmethod
    async def sync_graph_from_db(cls, db: AsyncSession):
        """Builds / refreshes the NetworkX FinancialRealityGraph from database records."""
        reality_graph_engine.clear()

        # Load Merchants
        merchants = (await db.execute(select(Merchant))).scalars().all()
        for m in merchants:
            reality_graph_engine.add_merchant(m.id, m.name, m.merchant_category, m.risk_level)

        # Load Customers
        customers = (await db.execute(select(Customer))).scalars().all()
        for c in customers:
            reality_graph_engine.add_customer(c.id, c.name, c.email)

        # Static Bank / Rail / Gateway nodes
        for bank in ["HDFC Bank", "SBI", "ICICI Bank", "Axis Bank"]:
            reality_graph_engine.add_bank(bank, "HEALTHY", 180)
        for rail in ["NPCI_UPI", "VISA", "MASTERCARD", "IMPS"]:
            reality_graph_engine.add_rail(rail, "HEALTHY")
        reality_graph_engine.add_gateway("Razorpay Core", "HEALTHY")

        # Load Payments
        payments = (await db.execute(select(Payment))).scalars().all()
        for p in payments:
            reality_graph_engine.add_payment(p.id, p.payment_reference, p.amount, p.status, p.reality_score or 90.0)
            # Add relationships
            reality_graph_engine.add_edge(f"CUSTOMER_{p.customer_id}", f"PAYMENT_{p.id}", "INITIATED", status="CONFIRMED")
            reality_graph_engine.add_edge(f"PAYMENT_{p.id}", f"BANK_{p.bank}", "DEBITED_BY", status="CONFIRMED" if p.bank_debited == "YES" else "MISSING")
            reality_graph_engine.add_edge(f"PAYMENT_{p.id}", f"RAIL_{p.payment_rail}", "ROUTED_THROUGH", status="CONFIRMED" if p.rail_acknowledged == "YES" else "MISSING")
            reality_graph_engine.add_edge(f"PAYMENT_{p.id}", f"GATEWAY_{p.gateway}", "PROCESSED_BY", status="CONFIRMED" if p.gateway_status == "CAPTURED" else "PENDING")
            
            # Merchant confirmation edge
            is_confirmed = p.merchant_confirmed == "YES"
            reality_graph_engine.add_edge(
                f"PAYMENT_{p.id}",
                f"MERCHANT_{p.merchant_id}",
                "CONFIRMED_BY",
                status="CONFIRMED" if is_confirmed else "MISSING",
                missing=not is_confirmed
            )

        # Load Incidents
        incidents = (await db.execute(select(FinancialIncident).where(FinancialIncident.status == "ACTIVE"))).scalars().all()
        for inc in incidents:
            reality_graph_engine.add_incident(inc.id, inc.incident_reference, inc.incident_type, inc.severity)

    @classmethod
    async def inject_systemic_upi_incident(cls, db: AsyncSession, affected_bank: str = "HDFC Bank", count: int = 1842, exposure: float = 4270000.0) -> Dict[str, Any]:
        """
        Injects a massive systemic bank/rail latency incident, simulating 1,842 pending payments,
        generating graph anomalies, updating active incident clusters, and triggering blast radius models.
        """
        # Fetch or fallback merchant and customer
        merchants = (await db.execute(select(Merchant))).scalars().all()
        customers = (await db.execute(select(Customer))).scalars().all()
        if not merchants or not customers:
            await cls.initialize_seed_data(db)
            merchants = (await db.execute(select(Merchant))).scalars().all()
            customers = (await db.execute(select(Customer))).scalars().all()

        m_obj = merchants[0]
        c_obj = customers[0]

        # Insert a cohort of pending payments in DB to represent the incident
        now = datetime.datetime.utcnow()
        for i in range(1, 16): # 15 representative records for DB speed + aggregate metrics
            ref = f"INC-TXN-{affected_bank[:3].upper()}-{1000 + i}"
            stmt_chk = select(Payment).where(Payment.payment_reference == ref)
            if (await db.execute(stmt_chk)).scalar_one_or_none():
                continue
            
            pay = Payment(
                payment_reference=ref,
                merchant_id=m_obj.id,
                customer_id=c_obj.id,
                amount=round(exposure / count, 2),
                currency="INR",
                payment_method="UPI",
                bank=affected_bank,
                payment_rail="NPCI_UPI",
                gateway="Razorpay Core",
                status="PENDING",
                reality_score=54.0,
                bank_debited="YES",
                rail_acknowledged="YES",
                gateway_status="PROCESSING",
                merchant_confirmed="NO",
                settlement_status="AWAITING",
                success_probability=0.76,
                reversal_probability=0.19,
                intervention_probability=0.05,
                estimated_resolution_minutes=14.0,
                duplicate_risk=0.84,
                recommendation="DO_NOT_PAY_AGAIN",
                created_at=now - datetime.timedelta(minutes=random.randint(1, 20))
            )
            db.add(pay)

        await db.commit()

        # Update Bank node in graph to WARNING/HIGH LATENCY
        reality_graph_engine.add_bank(affected_bank, "WARNING", 1680)

        # Trigger Clustering Service to construct the incident
        incidents = await IncidentClusteringService.run_clustering_detection(db)
        await cls.sync_graph_from_db(db)

        return {
            "status": "INJECTED",
            "incident_type": "SYSTEMIC_UPI_BANK_LATENCY",
            "affected_bank": affected_bank,
            "affected_transactions": count,
            "estimated_exposure_inr": exposure,
            "message": f"Successfully injected {count:,} pending payments on {affected_bank} (NPCI UPI Rail). Graph updated to WARNING state.",
            "incidents_created": incidents
        }

    @classmethod
    async def inject_merchant_callback_failure(cls, db: AsyncSession, merchant_id: Optional[str] = None) -> Dict[str, Any]:
        """Simulates 24 webhook dropouts on merchant endpoint, inducing financial drift."""
        merchants = (await db.execute(select(Merchant))).scalars().all()
        if not merchants:
            await cls.initialize_seed_data(db)
            merchants = (await db.execute(select(Merchant))).scalars().all()

        target_m = merchants[0]
        target_m.unexplained_drift += 25000.0
        target_m.observed_daily_volume = max(0.0, target_m.expected_daily_volume - target_m.unexplained_drift)
        await db.commit()
        await cls.sync_graph_from_db(db)

        return {
            "status": "INJECTED",
            "merchant_name": target_m.name,
            "new_unexplained_drift": target_m.unexplained_drift,
            "message": f"Simulated 24 merchant callback drops. Financial drift increased to ₹{target_m.unexplained_drift:,.0f}."
        }
