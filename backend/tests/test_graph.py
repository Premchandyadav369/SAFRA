import pytest
import networkx as nx
from app.graph.reality_graph import FinancialRealityGraph
from app.graph.validation import GraphRealityValidator
from app.graph.serializers import serialize_subgraph_to_react_flow

def test_graph_creation_and_edges():
    graph_engine = FinancialRealityGraph()
    graph_engine.add_customer("CUST1", "Test Customer")
    graph_engine.add_merchant("MCH1", "Test Merchant", "E-Commerce")
    graph_engine.add_bank("HDFC Bank")
    graph_engine.add_rail("NPCI_UPI")
    graph_engine.add_payment("PAY1", "REF100", 4999.0, "PENDING", 70.0)

    graph_engine.add_edge("CUSTOMER_CUST1", "PAYMENT_PAY1", "INITIATED")
    graph_engine.add_edge("PAYMENT_PAY1", "BANK_HDFC Bank", "DEBITED_BY")
    graph_engine.add_edge("PAYMENT_PAY1", "RAIL_NPCI_UPI", "ROUTED_THROUGH")
    # Merchant edge intentionally missing to test drift validation

    subgraph = graph_engine.get_payment_subgraph("PAY1")
    assert subgraph.number_of_nodes() >= 4

    val = GraphRealityValidator.validate_payment_graph(subgraph, "PAY1")
    assert val.is_drift_detected is True
    assert val.reality_score < 90.0
    assert any(e["relation"] == "CONFIRMED_BY" for e in val.missing_edges)

def test_react_flow_serialization():
    graph_engine = FinancialRealityGraph()
    graph_engine.add_customer("C1", "Cust 1")
    graph_engine.add_payment("P1", "REF1", 1000.0, "SUCCESS")
    graph_engine.add_edge("CUSTOMER_C1", "PAYMENT_P1", "INITIATED")

    serialized = serialize_subgraph_to_react_flow(graph_engine.graph)
    assert len(serialized["nodes"]) == 2
    assert len(serialized["edges"]) == 1
    assert serialized["nodes"][0]["data"]["label"] is not None
