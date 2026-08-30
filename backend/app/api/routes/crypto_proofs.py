from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import time

from app.core.crypto_engine import CryptoEngine

router = APIRouter(prefix="/crypto", tags=["Cryptographic Proofs & Verifiable Auditing"])

class IdempotencyCheckRequest(BaseModel):
    merchant_id: str
    customer_id: str
    amount: float
    currency: str = "INR"
    window_seconds: int = 30

class VerifyAuditChainRequest(BaseModel):
    chain: List[Dict[str, Any]]

class IssueTokenRequest(BaseModel):
    transaction_id: str
    action: str
    amount: float
    ttl_seconds: int = 300

class VerifyTokenRequest(BaseModel):
    transaction_id: str
    action: str
    amount: float
    issued_at: int
    expires_at: int
    signature: str

class MerkleRootRequest(BaseModel):
    transaction_hashes: List[str]

@router.post("/idempotency/token")
async def generate_idempotency_token(body: IdempotencyCheckRequest):
    token = CryptoEngine.generate_idempotency_hash(
        merchant_id=body.merchant_id,
        customer_id=body.customer_id,
        amount=body.amount,
        currency=body.currency,
        window_seconds=body.window_seconds
    )
    return {
        "idempotency_token": token,
        "algorithm": "HMAC-SHA256-SlidingWindow",
        "window_seconds": body.window_seconds,
        "collision_barrier": "ACTIVE"
    }

@router.post("/audit/verify-chain")
async def verify_audit_chain_proof(body: VerifyAuditChainRequest):
    is_valid, corrupted_idx = CryptoEngine.verify_audit_chain(body.chain)
    return {
        "chain_length": len(body.chain),
        "is_tamper_free": is_valid,
        "corrupted_block_index": corrupted_idx,
        "verification_status": "CRYPTOGRAPHICALLY_VERIFIED" if is_valid else "TAMPER_DETECTED"
    }

@router.post("/token/issue")
async def issue_signed_action_token(body: IssueTokenRequest):
    token_data = CryptoEngine.generate_signed_action_token(
        transaction_id=body.transaction_id,
        action=body.action,
        amount=body.amount,
        ttl_seconds=body.ttl_seconds
    )
    return {
        "status": "ISSUED",
        "token_data": token_data,
        "replay_prevention": "NONCE_BOUNDED"
    }

@router.post("/token/verify")
async def verify_signed_action_token(body: VerifyTokenRequest):
    is_valid = CryptoEngine.verify_signed_action_token(
        transaction_id=body.transaction_id,
        action=body.action,
        amount=body.amount,
        issued_at=body.issued_at,
        expires_at=body.expires_at,
        signature=body.signature
    )
    return {
        "is_valid": is_valid,
        "is_expired": int(time.time()) > body.expires_at,
        "status": "VERIFIED_VALID" if is_valid else "INVALID_OR_EXPIRED"
    }

@router.post("/merkle/root")
async def compute_batch_merkle_root(body: MerkleRootRequest):
    root = CryptoEngine.compute_merkle_root(body.transaction_hashes)
    return {
        "merkle_root": root,
        "leaves_count": len(body.transaction_hashes),
        "algorithm": "Binary-Merkle-SHA256",
        "batch_reconciliation": "CRYPTOGRAPHICALLY_SEALED"
    }
