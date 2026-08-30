from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.agents.groq_investigator import GroqAgenticInvestigator
from app.schemas.investigation import InvestigationResponse
from app.graph.reality_graph import reality_graph_engine
from app.graph.validation import GraphRealityValidator

router = APIRouter(prefix="/investigations", tags=["Investigations"])

@router.post("/{payment_id}", response_model=InvestigationResponse)
async def run_payment_investigation(payment_id: str, db: AsyncSession = Depends(get_db)):
    """
    Triggers an autonomous Agentic AI Investigation for a payment.
    The agent calls real backend tools: graph traversal, similarity matching,
    bank telemetry, ML outcome regressors, and past incident memory.
    """
    result = await GroqAgenticInvestigator.investigate_payment(db, payment_id)
    
    # Also fetch graph validation details
    subgraph = reality_graph_engine.get_payment_subgraph(payment_id)
    val = GraphRealityValidator.validate_payment_graph(subgraph, payment_id)

    return InvestigationResponse(
        payment_id=payment_id,
        summary=result.summary,
        root_cause=result.root_cause,
        confidence=result.confidence,
        hypotheses=[
            {
                "cause": h.cause,
                "probability": h.probability,
                "evidence": h.evidence
            }
            for h in result.hypotheses
        ],
        recommendation=result.recommendation,
        duplicate_risk=result.duplicate_risk,
        reasoning_steps=result.reasoning_steps,
        requires_human_review=result.requires_human_review,
        reality_validation=val.to_dict()
    )

@router.get("/payment/{payment_id}", response_model=InvestigationResponse)
async def get_payment_investigation(payment_id: str, db: AsyncSession = Depends(get_db)):
    return await run_payment_investigation(payment_id, db)
