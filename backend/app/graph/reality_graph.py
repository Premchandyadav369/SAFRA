import networkx as nx
from typing import Dict, Any, List, Optional
import datetime

class FinancialRealityGraph:
    """
    In-memory dynamic multi-directed Financial Reality Graph.
    Constructs and maintains live relational topological models of transactions,
    banks, rails, gateways, merchants, settlements, and incidents.
    """
    def __init__(self):
        self.graph = nx.MultiDiGraph()
        self.last_updated = datetime.datetime.utcnow()

    def clear(self):
        self.graph.clear()
        self.last_updated = datetime.datetime.utcnow()

    def add_customer(self, customer_id: str, name: str, email: Optional[str] = None):
        self.graph.add_node(
            f"CUSTOMER_{customer_id}",
            node_type="CUSTOMER",
            label=name,
            entity_id=customer_id,
            email=email,
            status="ACTIVE"
        )

    def add_merchant(self, merchant_id: str, name: str, category: str, risk_level: str = "LOW"):
        self.graph.add_node(
            f"MERCHANT_{merchant_id}",
            node_type="MERCHANT",
            label=name,
            entity_id=merchant_id,
            category=category,
            risk_level=risk_level,
            status="HEALTHY"
        )

    def add_bank(self, bank_name: str, health: str = "HEALTHY", latency_ms: int = 120):
        self.graph.add_node(
            f"BANK_{bank_name}",
            node_type="BANK",
            label=bank_name,
            entity_id=bank_name,
            health=health,
            latency_ms=latency_ms,
            status=health
        )

    def add_rail(self, rail_name: str, health: str = "HEALTHY"):
        self.graph.add_node(
            f"RAIL_{rail_name}",
            node_type="PAYMENT_RAIL",
            label=rail_name,
            entity_id=rail_name,
            health=health,
            status=health
        )

    def add_gateway(self, gateway_name: str, health: str = "HEALTHY"):
        self.graph.add_node(
            f"GATEWAY_{gateway_name}",
            node_type="GATEWAY",
            label=gateway_name,
            entity_id=gateway_name,
            health=health,
            status=health
        )

    def add_payment(self, payment_id: str, ref: str, amount: float, status: str, reality_score: float = 100.0):
        self.graph.add_node(
            f"PAYMENT_{payment_id}",
            node_type="PAYMENT",
            label=f"{ref} (₹{amount:,.0f})",
            entity_id=payment_id,
            reference=ref,
            amount=amount,
            status=status,
            reality_score=reality_score
        )

    def add_settlement(self, settlement_id: str, ref: str, amount: float, status: str):
        self.graph.add_node(
            f"SETTLEMENT_{settlement_id}",
            node_type="SETTLEMENT",
            label=f"Settlement {ref} (₹{amount:,.0f})",
            entity_id=settlement_id,
            reference=ref,
            amount=amount,
            status=status
        )

    def add_incident(self, incident_id: str, ref: str, incident_type: str, severity: str):
        self.graph.add_node(
            f"INCIDENT_{incident_id}",
            node_type="INCIDENT",
            label=f"Incident {ref}",
            entity_id=incident_id,
            incident_type=incident_type,
            severity=severity,
            status="ACTIVE"
        )

    def add_edge(self, source_id: str, target_id: str, relation: str, status: str = "CONFIRMED", latency_ms: int = 0, missing: bool = False):
        self.graph.add_edge(
            source_id,
            target_id,
            key=relation,
            relation=relation,
            status=status,
            latency_ms=latency_ms,
            missing=missing,
            timestamp=datetime.datetime.utcnow().isoformat()
        )
        self.last_updated = datetime.datetime.utcnow()

    def get_payment_subgraph(self, payment_id: str, depth: int = 2) -> nx.MultiDiGraph:
        """Extract localized neighborhood subgraph for a given payment."""
        node_key = f"PAYMENT_{payment_id}"
        if node_key not in self.graph:
            return nx.MultiDiGraph()
        
        nodes = set([node_key])
        current_layer = set([node_key])
        for _ in range(depth):
            next_layer = set()
            for n in current_layer:
                neighbors = set(self.graph.predecessors(n)).union(set(self.graph.successors(n)))
                next_layer.update(neighbors)
            nodes.update(next_layer)
            current_layer = next_layer
        
        return self.graph.subgraph(nodes).copy()

    def get_statistics(self) -> Dict[str, Any]:
        return {
            "total_nodes": self.graph.number_of_nodes(),
            "total_edges": self.graph.number_of_edges(),
            "node_types": {
                "payments": len([n for n, d in self.graph.nodes(data=True) if d.get("node_type") == "PAYMENT"]),
                "merchants": len([n for n, d in self.graph.nodes(data=True) if d.get("node_type") == "MERCHANT"]),
                "banks": len([n for n, d in self.graph.nodes(data=True) if d.get("node_type") == "BANK"]),
                "incidents": len([n for n, d in self.graph.nodes(data=True) if d.get("node_type") == "INCIDENT"]),
            },
            "last_updated": self.last_updated.isoformat()
        }

# Global singleton reality graph
reality_graph_engine = FinancialRealityGraph()
