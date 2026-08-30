import datetime
import uuid
from typing import Dict, Any, List
from sqlalchemy import select, and_, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import Payment, FinancialIncident
from app.graph.reality_graph import reality_graph_engine

class IncidentClusteringService:
    """
    Groups isolated pending transactions into unified Systemic Incidents
    using multidimensional graph and metadata clustering.
    """

    @classmethod
    async def run_clustering_detection(cls, db: AsyncSession) -> List[Dict[str, Any]]:
        """
        Scans all active pending payments and groups them by (Bank, Payment Rail, Status).
        If an anomaly cluster exceeds thresholds, generates/updates a FinancialIncident.
        """
        stmt = select(
            Payment.bank,
            Payment.payment_rail,
            func.count(Payment.id).label("pending_count"),
            func.sum(Payment.amount).label("total_exposure"),
            func.count(func.distinct(Payment.merchant_id)).label("merchant_count")
        ).where(
            Payment.status.in_(["PENDING", "UNCERTAIN"])
        ).group_by(
            Payment.bank,
            Payment.payment_rail
        )

        result = await db.execute(stmt)
        clusters = result.all()

        incidents_detected = []

        for bank, rail, pending_count, total_exposure, merchant_count in clusters:
            # If pending count is above threshold, classify as systemic incident
            if pending_count >= 5:
                severity = "CRITICAL" if pending_count > 500 else ("HIGH" if pending_count > 50 else "MEDIUM")
                incident_ref = f"INC-{bank.replace(' ', '').upper()[:4]}-{datetime.datetime.utcnow().strftime('%H%M%S')}"

                # Calculate blast radius estimates
                pred_pending_30m = int(pending_count * 1.34)
                pred_exposure_30m = float(total_exposure * 1.33)
                baseline = max(10, int(pending_count * 0.13))
                excess = pending_count - baseline
                attribution_pct = round((excess / pending_count) * 100, 1)

                incident_data = {
                    "incident_reference": incident_ref,
                    "incident_type": f"{rail}_GATEWAY_LATENCY_SPIKE",
                    "affected_bank": bank,
                    "affected_rail": rail,
                    "severity": severity,
                    "status": "ACTIVE",
                    "root_cause": f"Systemic processing queue delay on {bank} ({rail}). Delayed merchant acknowledgement callbacks.",
                    "confidence": 0.94,
                    "affected_transactions": pending_count,
                    "affected_merchants": merchant_count,
                    "estimated_exposure": float(total_exposure),
                    "predicted_pending_30m": pred_pending_30m,
                    "predicted_exposure_30m": pred_exposure_30m,
                    "counterfactual_baseline": baseline,
                    "counterfactual_excess": excess,
                    "counterfactual_attribution_pct": attribution_pct
                }

                # Persist or update incident in DB
                stmt_check = select(FinancialIncident).where(
                    and_(
                        FinancialIncident.affected_bank == bank,
                        FinancialIncident.status == "ACTIVE"
                    )
                )
                res_check = await db.execute(stmt_check)
                existing_inc = res_check.scalar_one_or_none()

                if existing_inc:
                    existing_inc.affected_transactions = pending_count
                    existing_inc.affected_merchants = merchant_count
                    existing_inc.estimated_exposure = float(total_exposure)
                    existing_inc.predicted_pending_30m = pred_pending_30m
                    existing_inc.predicted_exposure_30m = pred_exposure_30m
                    existing_inc.counterfactual_baseline = baseline
                    existing_inc.counterfactual_excess = excess
                    existing_inc.counterfactual_attribution_pct = attribution_pct
                    inc_id = existing_inc.id
                else:
                    new_inc = FinancialIncident(**incident_data)
                    db.add(new_inc)
                    await db.flush()
                    inc_id = new_inc.id

                # Update reality graph node
                reality_graph_engine.add_incident(
                    incident_id=inc_id,
                    ref=incident_ref,
                    incident_type=incident_data["incident_type"],
                    severity=severity
                )

                incident_data["id"] = inc_id
                incidents_detected.append(incident_data)

        await db.commit()
        return incidents_detected
