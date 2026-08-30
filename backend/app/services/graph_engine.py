from typing import Dict, Any, List

class GraphEngine:
    @staticmethod
    def build_graph(txn: Any) -> Dict[str, Any]:
        txn_id = getattr(txn, "id", "TXN-1001") or "TXN-1001"
        amount = getattr(txn, "amount", 4999.0) or 4999.0
        currency = getattr(txn, "currency", "INR") or "INR"
        curr_sym = "₹" if currency == "INR" else "$"
        cust_id = getattr(txn, "customer_id", "cust_01") or "cust_01"
        cust_name = getattr(txn, "customer_name", "Aryan Sharma") or "Aryan Sharma"
        merchant_id = getattr(txn, "merchant_id", "m_zenith_01") or "m_zenith_01"
        merchant_name = getattr(txn, "merchant_name", "Zenith Electronics") or "Zenith Electronics"
        bank_name = getattr(txn, "bank", "HDFC Bank") or "HDFC Bank"
        payment_method = getattr(txn, "payment_method", "UPI") or "UPI"
        payment_status = getattr(txn, "payment_status", "PENDING") or "PENDING"
        checkout_status = getattr(txn, "checkout_status", "BANK_DEBITED_AWAITING_WEBHOOK") or "BANK_DEBITED_AWAITING_WEBHOOK"
        failure_reason = getattr(txn, "failure_reason", "UPI Pending - Bank Callback Delayed") or "UPI Pending - Bank Callback Delayed"
        recommended_action = getattr(txn, "recommended_action", "WAIT") or "WAIT"
        recovery_prob = getattr(txn, "recovery_probability", 0.81) or 0.81
        retry_count = getattr(txn, "retry_count", 1) or 1
        customer_segment = getattr(txn, "customer_segment", "HIGH_VALUE") or "HIGH_VALUE"
        customer_history_score = getattr(txn, "customer_history_score", 0.92) or 0.92

        nodes = []
        edges = []

        # 1. Customer Node
        nodes.append({
            "id": f"cust_{cust_id}",
            "label": f"Customer: {cust_name}",
            "type": "CUSTOMER",
            "state": "NORMAL",
            "properties": {
                "entity": "Authenticated Buyer",
                "name": cust_name,
                "segment": customer_segment,
                "history_score": f"{customer_history_score:.2f}",
                "lifetime_value": f"{curr_sym}{amount * 5:,.0f}",
                "chargeback_risk": "0.01% (Low Risk)"
            }
        })

        # 2. Merchant Store Node
        nodes.append({
            "id": f"merch_{merchant_id}",
            "label": f"Merchant: {merchant_name}",
            "type": "MERCHANT",
            "state": "NORMAL",
            "properties": {
                "entity": "Merchant Inventory Store",
                "name": merchant_name,
                "settlement_cycle": "T+1 Daily Cycle",
                "reconciliation_health": "98.4%",
                "expected_amount": f"{curr_sym}{amount:,.0f}"
            }
        })

        # 3. Checkout Node
        nodes.append({
            "id": f"checkout_{txn_id}",
            "label": f"Checkout Session #{txn_id[:10]}",
            "type": "CHECKOUT",
            "state": "NORMAL",
            "properties": {
                "entity": "Active Cart Session",
                "cart_value": f"{curr_sym}{amount:,.0f}",
                "session_state": checkout_status,
                "inventory_status": "Stock Reserved (Locked 10m)",
                "device_fingerprint": "Verified Mobile Browser"
            }
        })
        edges.append({
            "id": "e_cust_checkout",
            "source": f"cust_{cust_id}",
            "target": f"checkout_{txn_id}",
            "relationship": "INITIATED",
            "label": "Initiated Checkout",
            "status": "CONFIRMED",
            "latency_ms": 42
        })
        edges.append({
            "id": "e_merch_checkout",
            "source": f"merch_{merchant_id}",
            "target": f"checkout_{txn_id}",
            "relationship": "SERVES_ORDER",
            "label": "Order Created",
            "status": "CONFIRMED",
            "latency_ms": 15
        })

        # 4. Payment Attempt Node
        nodes.append({
            "id": f"pay_{txn_id}",
            "label": f"Payment: {curr_sym}{amount:,.0f} ({payment_method})",
            "type": "PAYMENT_ATTEMPT",
            "state": "RISK" if payment_status in ["PENDING", "FAILED"] else "NORMAL",
            "properties": {
                "entity": "Payment Attempt",
                "amount": f"{curr_sym}{amount:,.0f}",
                "method": payment_method,
                "status": payment_status,
                "failure_reason": failure_reason,
                "recovery_probability": f"{int(recovery_prob * 100)}%"
            }
        })
        edges.append({
            "id": "e_checkout_pay",
            "source": f"checkout_{txn_id}",
            "target": f"pay_{txn_id}",
            "relationship": "ATTEMPTED",
            "label": f"Attempted via {payment_method}",
            "status": "CONFIRMED",
            "latency_ms": 85
        })

        # 5. Payment Rail Node (UPI Network / Card Switch)
        rail_name = "NPCI UPI Rail" if payment_method == "UPI" else "Visa / Mastercard Rail"
        nodes.append({
            "id": f"rail_{txn_id}",
            "label": rail_name,
            "type": "PAYMENT_RAIL",
            "state": "NORMAL",
            "properties": {
                "entity": "Payment Network Switch",
                "rail_protocol": rail_name,
                "switch_status": "Operational",
                "acknowledgment": "Debit Ack Received ✓",
                "settlement_window": "Batch Real-Time"
            }
        })
        edges.append({
            "id": "e_pay_rail",
            "source": f"pay_{txn_id}",
            "target": f"rail_{txn_id}",
            "relationship": "ROUTED_VIA",
            "label": "Network Transit",
            "status": "CONFIRMED",
            "latency_ms": 120
        })

        # 6. Core Bank Switch (CBS)
        nodes.append({
            "id": f"bank_{txn_id}",
            "label": f"Bank: {bank_name}",
            "type": "BANK",
            "state": "RISK" if ("timeout" in failure_reason.lower() or "latency" in failure_reason.lower() or payment_status == "PENDING") else "NORMAL",
            "properties": {
                "entity": "Core Banking Switch (CBS)",
                "bank_name": bank_name,
                "core_status": "Elevated Queuing Delay (1,420ms)",
                "bank_debit_status": "Customer Debited ✓",
                "webhook_status": "Pending Retry Window (5m)",
                "affected_cohort": "1,842 concurrent txns"
            }
        })
        edges.append({
            "id": "e_rail_bank",
            "source": f"rail_{txn_id}",
            "target": f"bank_{txn_id}",
            "relationship": "DEBITS_ACCOUNT",
            "label": "Account Debit",
            "status": "CONFIRMED",
            "latency_ms": 280
        })

        # 7. Gateway Webhook Ingestion Node
        nodes.append({
            "id": f"gw_{txn_id}",
            "label": "Gateway Ingestion",
            "type": "GATEWAY",
            "state": "RISK" if "timeout" in failure_reason.lower() else "NORMAL",
            "properties": {
                "entity": "Merchant Webhook Endpoint",
                "callback_status": "504 Gateway Timeout (Delayed Response)",
                "retry_backoff": "Exponential 30s / 120s / 300s",
                "expected_resolution": "Automated Reconcile in 4-6 mins"
            }
        })
        edges.append({
            "id": "e_bank_gw",
            "source": f"bank_{txn_id}",
            "target": f"gw_{txn_id}",
            "relationship": "TIMEOUT_CALLBACK",
            "label": "Delayed Webhook Receipt",
            "status": "LATENCY_SPIKE",
            "latency_ms": 1420
        })

        # 8. Duplicate Retry Barrier (if retried)
        if retry_count > 0:
            nodes.append({
                "id": f"barrier_{txn_id}",
                "label": "Duplicate Payment Guardian",
                "type": "RETRY_BARRIER",
                "state": "RISK",
                "properties": {
                    "entity": "Duplicate Charge Interceptor",
                    "collision_proximity": "97.4% Proximity Match",
                    "interception_status": "Customer Repayment Held Safely",
                    "barrier_policy": "Prevent Double Debit",
                    "dispute_prevented": f"{curr_sym}{amount:,.0f}"
                }
            })
            edges.append({
                "id": "e_cust_barrier",
                "source": f"cust_{cust_id}",
                "target": f"barrier_{txn_id}",
                "relationship": "RETRY_INTERCEPTED",
                "label": "Repayment Repressed",
                "status": "INTERCEPTED",
                "latency_ms": 10
            })

        # 9. SAFRA Autonomous Recovery Agent Node
        nodes.append({
            "id": f"safra_{txn_id}",
            "label": f"SAFRA Action: {recommended_action}",
            "type": "SAFRA_AGENT",
            "state": "RECOVERED",
            "properties": {
                "entity": "Autonomous Recovery Engine",
                "selected_action": recommended_action,
                "policy_reason": "Rail confirmed debit; hold customer cart to avoid double charge",
                "recovery_probability": f"{int(recovery_prob * 100)}%",
                "stopping_rule": "Customer Contact Limit Protected",
                "outcome": "Auto-Reconciled upon Webhook Receipt ✓"
            }
        })
        edges.append({
            "id": "e_gw_safra",
            "source": f"gw_{txn_id}",
            "target": f"safra_{txn_id}",
            "relationship": "BOUNDED_ACTION",
            "label": "Policy Governed",
            "status": "RECOVERED",
            "latency_ms": 5
        })

        # 10. Settlement Ledger Node
        nodes.append({
            "id": f"settle_{txn_id}",
            "label": "Settlement Ledger",
            "type": "SETTLEMENT",
            "state": "RECOVERED",
            "properties": {
                "entity": "Merchant Settlement Ledger",
                "reconciliation_state": "Reconciled & Balanced",
                "net_amount": f"{curr_sym}{amount:,.0f}",
                "settlement_payout": "T+1 Bank Transfer Scheduled"
            }
        })
        edges.append({
            "id": "e_safra_settle",
            "source": f"safra_{txn_id}",
            "target": f"settle_{txn_id}",
            "relationship": "RECONCILES_TO",
            "label": "Ledger Reconciled",
            "status": "RECOVERED",
            "latency_ms": 12
        })

        return {
            "transaction_id": txn_id,
            "nodes": nodes,
            "edges": edges,
            "total_nodes": len(nodes),
            "total_edges": len(edges)
        }
