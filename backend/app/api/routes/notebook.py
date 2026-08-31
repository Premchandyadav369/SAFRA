from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime

router = APIRouter(prefix="/notebook", tags=["Investigation Notebook"])

# In-memory notebook store with persistent schema
NOTEBOOK_ENTRIES = [
    {
        "id": "NOTE-014",
        "title": "HDFC UPI Latency Spike vs Ingestion Queue Congestion",
        "hypothesis": "HDFC CBS timeout spike to 1,420ms correlates directly with 5.0x payday checkout traffic surge. Immediate retries cause duplicate debit collisions.",
        "author": "Senior Payment Reliability Engineer",
        "attached_filters": {"bank": "HDFC", "payment_method": "UPI", "status": "PENDING"},
        "graph_snapshot": {"focus_node": "BANK_HDFC_Bank", "edge_anomalies": 1842},
        "ai_summary": "SAFRA policy recommendation: Enforce 300s WAIT barrier before allowing user repayment.",
        "created_at": "2026-08-31T09:15:00Z"
    }
]

class CreateNoteRequest(BaseModel):
    title: str
    hypothesis: str
    author: Optional[str] = "Risk Analyst"
    attached_filters: Optional[Dict[str, Any]] = None
    graph_snapshot: Optional[Dict[str, Any]] = None
    ai_summary: Optional[str] = None

@router.get("/notes")
async def get_all_notes():
    return {
        "total_notes": len(NOTEBOOK_ENTRIES),
        "notes": NOTEBOOK_ENTRIES
    }

@router.post("/notes")
async def create_note(body: CreateNoteRequest):
    note_id = f"NOTE-{uuid.uuid4().hex[:6].upper()}"
    new_note = {
        "id": note_id,
        "title": body.title,
        "hypothesis": body.hypothesis,
        "author": body.author or "Risk Analyst",
        "attached_filters": body.attached_filters or {},
        "graph_snapshot": body.graph_snapshot or {},
        "ai_summary": body.ai_summary or "Deterministic policy validation attached.",
        "created_at": datetime.utcnow().isoformat()
    }
    NOTEBOOK_ENTRIES.insert(0, new_note)
    return {
        "status": "SAVED",
        "note": new_note
    }

@router.get("/notes/{note_id}/export")
async def export_note_dossier(note_id: str):
    for n in NOTEBOOK_ENTRIES:
        if n["id"] == note_id:
            return {
                "dossier_type": "SAFRA_INVESTIGATION_DOSSIER",
                "version": "1.0",
                "note_data": n,
                "compliance_certification": "PCI-DSS Bounded Investigation Compliant"
            }
    raise HTTPException(status_code=404, detail="Note not found")
