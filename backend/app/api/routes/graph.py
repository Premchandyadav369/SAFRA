from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any
from app.database.session import get_db
from app.graph.reality_graph import reality_graph_engine
from app.graph.serializers import serialize_subgraph_to_react_flow
from app.graph.validation import GraphRealityValidator
from app.schemas.graph import GraphResponse

router = APIRouter(prefix="/graph", tags=["Reality Graph"])

@router.get("", response_model=GraphResponse)
async def get_full_reality_graph():
    """Returns the full dynamic Financial Reality Graph in React Flow compatible format."""
    serialized = serialize_subgraph_to_react_flow(reality_graph_engine.graph)
    return GraphResponse(
        nodes=serialized["nodes"],
        edges=serialized["edges"],
        node_count=serialized["node_count"],
        edge_count=serialized["edge_count"],
        validation=None
    )

@router.get("/payment/{payment_id}", response_model=GraphResponse)
async def get_payment_subgraph(payment_id: str):
    """Returns localized 2-hop neighborhood subgraph for a given payment with validation."""
    subgraph = reality_graph_engine.get_payment_subgraph(payment_id, depth=2)
    if subgraph.number_of_nodes() == 0:
        raise HTTPException(status_code=404, detail="Payment node not found in graph")

    serialized = serialize_subgraph_to_react_flow(subgraph, highlight_payment_id=payment_id)
    val = GraphRealityValidator.validate_payment_graph(subgraph, payment_id)

    return GraphResponse(
        nodes=serialized["nodes"],
        edges=serialized["edges"],
        node_count=serialized["node_count"],
        edge_count=serialized["edge_count"],
        validation=val.to_dict()
    )

@router.get("/stats")
async def get_graph_stats():
    return reality_graph_engine.get_statistics()
