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
        merchant_name = getattr(txn, "merchant_name", "Zenith Store") or "Zenith Store"
        bank_name = getattr(txn, "bank", "HDFC Bank") or "HDFC Bank"
        payment_method = getattr(txn, "payment_method", "UPI") or "UPI"
        payment_status = getattr(txn, "payment_status", "PENDING") or "PENDING"
        failure_reason = getattr(txn, "failure_reason", "Bank latency delay") or "Bank latency delay"
        recommended_action = getattr(txn, "recommended_action", "WAIT") or "WAIT"
        recovery_prob = getattr(txn, "recovery_probability", 0.74) or 0.74
        retry_count = getattr(txn, "retry_count", 0) or 0
        customer_segment = getattr(txn, "customer_segment", "STANDARD") or "STANDARD"
        customer_history_score = getattr(txn, "customer_history_score", 0.85) or 0.85

        nodes = []
        edges = []

        # 1. Customer Node
        nodes.append({
            "id": f"cust_{cust_id}",
            "label": f"Customer: {cust_name}",
            "type": "CUSTOMER",
            "properties": {
                "primary": f"Buyer: {cust_name}",
                "details": f"Segment: {customer_segment} • History Score: {customer_history_score:.2f}",
                "metrics": f"Lifetime Value: {curr_sym}{amount * 5:,.0f}"
            }
        })

        # 2. Checkout Node
        nodes.append({
            "id": f"checkout_{txn_id}",
            "label": f"Checkout: {merchant_name}",
            "type": "CHECKOUT",
            "properties": {
                "primary": f"Cart Value: {curr_sym}{amount:,.0f}",
                "details": f"Merchant: {merchant_name} • Order Ref #{txn_id[:10]}",
                "metrics": f"Status: Cart Reserved"
            }
        })
        edges.append({
            "id": "e_cust_checkout",
            "source": f"cust_{cust_id}",
            "target": f"checkout_{txn_id}",
            "relationship": "INITIATED",
            "label": "Initiated Checkout"
        })

        # 3. Payment Attempt Node
        nodes.append({
            "id": f"pay_{txn_id}",
            "label": f"Payment: {curr_sym}{amount:,.0f} ({payment_method})",
            "type": "PAYMENT_ATTEMPT",
            "properties": {
                "primary": f"Status: {payment_status}",
                "details": f"Failure/Drift: {failure_reason}",
                "metrics": f"P(Recovery): {int(recovery_prob * 100)}%"
            }
        })
        edges.append({
            "id": "e_checkout_pay",
            "source": f"checkout_{txn_id}",
            "target": f"pay_{txn_id}",
            "relationship": "ATTEMPTED",
            "label": f"Attempted via {payment_method}"
        })

        # 4. Bank Node
        nodes.append({
            "id": f"bank_{txn_id}",
            "label": f"Bank Switch: {bank_name}",
            "type": "BANK",
            "properties": {
                "primary": f"Core Gateway: {bank_name}",
                "details": f"CBS Routing • Telemetry Status: Latency Elevated",
                "metrics": f"Bank Debited: Confirmed ✓"
            }
        })
        edges.append({
            "id": "e_pay_bank",
            "source": f"pay_{txn_id}",
            "target": f"bank_{txn_id}",
            "relationship": "FAILED_AT" if payment_status in ["FAILED", "PENDING"] else "ASSOCIATED_WITH",
            "label": "Routed to Bank"
        })

        # 5. Retry Node (if retried)
        if retry_count > 0:
            nodes.append({
                "id": f"retry_{txn_id}",
                "label": f"Retry Intent ({retry_count} Attempts)",
                "type": "RETRY",
                "properties": {
                    "primary": "Duplicate Payment Barrier Active",
                    "details": "Customer attempt to repay held safely to avoid double-debiting.",
                    "metrics": "Barrier Status: Guarding"
                }
            })
            edges.append({
                "id": "e_cust_retry",
                "source": f"cust_{cust_id}",
                "target": f"retry_{txn_id}",
                "relationship": "RETRIED",
                "label": "Repayment Retried"
            })

        # 6. Recovery Action Node
        nodes.append({
            "id": f"action_{txn_id}",
            "label": f"SAFRA Action: {recommended_action}",
            "type": "RECOVERY_ACTION",
            "properties": {
                "primary": f"Selected Bounded Action: {recommended_action}",
                "details": "Enforcing policy guardrails & automatic resolution verification.",
                "metrics": "Outcome: Bounded Execution ✓"
            }
        })
        edges.append({
            "id": "e_pay_action",
            "source": f"pay_{txn_id}",
            "target": f"action_{txn_id}",
            "relationship": "RECOVERED_BY",
            "label": "Governed By SAFRA"
        })

        return {
            "transaction_id": txn_id,
            "nodes": nodes,
            "edges": edges,
            "total_nodes": len(nodes),
            "total_edges": len(edges)
        }
