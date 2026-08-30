import networkx as nx
from typing import Dict, Any, List

def serialize_subgraph_to_react_flow(subgraph: nx.MultiDiGraph, highlight_payment_id: str = None) -> Dict[str, Any]:
    """
    Transforms a NetworkX MultiDiGraph into React Flow / XYFlow nodes and edges with
    automatic visual positioning, node categorization, badges, and edge highlighting.
    """
    nodes = []
    edges = []
    
    # Layer definitions for clean hierarchical positioning
    layer_map = {
        "CUSTOMER": 0,
        "PAYMENT": 1,
        "BANK": 2,
        "PAYMENT_RAIL": 2,
        "GATEWAY": 2,
        "MERCHANT": 3,
        "SETTLEMENT": 4,
        "INCIDENT": 1
    }
    
    layer_counts = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0}

    for node_id, data in subgraph.nodes(data=True):
        node_type = data.get("node_type", "PAYMENT")
        layer = layer_map.get(node_type, 2)
        idx_in_layer = layer_counts[layer]
        layer_counts[layer] += 1
        
        # Calculate auto layout coords
        x_pos = 150 + layer * 280
        y_pos = 100 + idx_in_layer * 140

        is_focal = highlight_payment_id and node_id == f"PAYMENT_{highlight_payment_id}"
        
        # Color coding based on status
        status = data.get("status", "HEALTHY")
        health = data.get("health", "HEALTHY")
        
        nodes.append({
            "id": node_id,
            "type": "safraNode",
            "position": {"x": x_pos, "y": y_pos},
            "data": {
                "label": data.get("label", node_id),
                "nodeType": node_type,
                "status": status,
                "health": health,
                "isFocal": is_focal,
                "realityScore": data.get("reality_score"),
                "amount": data.get("amount"),
                "reference": data.get("reference"),
                "metadata": {k: v for k, v in data.items() if k not in ["label", "node_type", "status", "health"]}
            }
        })

    edge_counter = 0
    for u, v, key, data in subgraph.edges(keys=True, data=True):
        edge_counter += 1
        missing = data.get("missing", False)
        status = data.get("status", "CONFIRMED")
        relation = data.get("relation", key)
        latency = data.get("latency_ms", 0)

        # Style edges
        edge_style = {
            "strokeWidth": 2,
        }
        if missing or status == "MISSING":
            edge_style["stroke"] = "#EF4444"
            edge_style["strokeDasharray"] = "5 5"
            animated = True
        elif status in ["PENDING", "DELAYED"]:
            edge_style["stroke"] = "#F59E0B"
            edge_style["strokeDasharray"] = "4 4"
            animated = True
        else:
            edge_style["stroke"] = "#10B981"
            animated = False

        edges.append({
            "id": f"e_{u}_{v}_{edge_counter}",
            "source": u,
            "target": v,
            "label": f"{relation} ({latency}ms)" if latency > 0 else relation,
            "animated": animated,
            "style": edge_style,
            "data": {
                "relation": relation,
                "status": status,
                "missing": missing,
                "latency_ms": latency
            }
        })

    return {
        "nodes": nodes,
        "edges": edges,
        "node_count": len(nodes),
        "edge_count": len(edges)
    }
