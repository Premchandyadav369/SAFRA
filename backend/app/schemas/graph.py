from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class ReactFlowNode(BaseModel):
    id: str
    type: str = "safraNode"
    position: Dict[str, float]
    data: Dict[str, Any]

class ReactFlowEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None
    animated: bool = False
    style: Dict[str, Any]
    data: Dict[str, Any]

class GraphResponse(BaseModel):
    nodes: List[ReactFlowNode]
    edges: List[ReactFlowEdge]
    node_count: int
    edge_count: int
    validation: Optional[Dict[str, Any]] = None
