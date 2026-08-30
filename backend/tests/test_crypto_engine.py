import pytest
import time
from app.core.crypto_engine import CryptoEngine

def test_idempotency_hash_generation_and_collision():
    token1 = CryptoEngine.generate_idempotency_hash("m_zenith", "cust_aryan", 4999.0, "INR", 30)
    assert len(token1) == 64
    # Same window produces same hash
    token2 = CryptoEngine.generate_idempotency_hash("m_zenith", "cust_aryan", 4999.0, "INR", 30)
    assert token1 == token2

    # Verification passes
    assert CryptoEngine.verify_collision(token1, "m_zenith", "cust_aryan", 4999.0, "INR", 30) is True
    # Different amount fails verification
    assert CryptoEngine.verify_collision(token1, "m_zenith", "cust_aryan", 9999.0, "INR", 30) is False

def test_tamper_evident_audit_chain_validity():
    t0 = time.time()
    b0_hash = CryptoEngine.build_audit_block_hash("0" * 64, "TXN-101", "PAYMENT_INIT", {"amt": 4999}, t0)
    b1_hash = CryptoEngine.build_audit_block_hash(b0_hash, "TXN-101", "BANK_TIMEOUT", {"latency": 1420}, t0 + 1)
    b2_hash = CryptoEngine.build_audit_block_hash(b1_hash, "TXN-101", "SAFRA_WAIT", {"action": "WAIT"}, t0 + 2)

    chain = [
        {"prev_hash": "0" * 64, "transaction_id": "TXN-101", "event_type": "PAYMENT_INIT", "payload": {"amt": 4999}, "timestamp": t0, "block_hash": b0_hash},
        {"prev_hash": b0_hash, "transaction_id": "TXN-101", "event_type": "BANK_TIMEOUT", "payload": {"latency": 1420}, "timestamp": t0 + 1, "block_hash": b1_hash},
        {"prev_hash": b1_hash, "transaction_id": "TXN-101", "event_type": "SAFRA_WAIT", "payload": {"action": "WAIT"}, "timestamp": t0 + 2, "block_hash": b2_hash}
    ]

    is_valid, corrupted_idx = CryptoEngine.verify_audit_chain(chain)
    assert is_valid is True
    assert corrupted_idx is None

def test_tamper_evident_audit_chain_tamper_detection():
    t0 = time.time()
    b0_hash = CryptoEngine.build_audit_block_hash("0" * 64, "TXN-102", "PAYMENT_INIT", {"amt": 4999}, t0)
    b1_hash = CryptoEngine.build_audit_block_hash(b0_hash, "TXN-102", "BANK_TIMEOUT", {"latency": 1420}, t0 + 1)

    # Corrupt block 1 payload post-hoc
    corrupted_chain = [
        {"prev_hash": "0" * 64, "transaction_id": "TXN-102", "event_type": "PAYMENT_INIT", "payload": {"amt": 4999}, "timestamp": t0, "block_hash": b0_hash},
        {"prev_hash": b0_hash, "transaction_id": "TXN-102", "event_type": "BANK_TIMEOUT", "payload": {"latency": 999999}, "timestamp": t0 + 1, "block_hash": b1_hash}
    ]

    is_valid, corrupted_idx = CryptoEngine.verify_audit_chain(corrupted_chain)
    assert is_valid is False
    assert corrupted_idx == 1

def test_signed_action_token_issue_and_verification():
    tok = CryptoEngine.generate_signed_action_token("TXN-103", "SEND_RECOVERY_LINK", 4999.0, ttl_seconds=300)
    assert tok["signature"] is not None
    assert tok["token"].startswith("safra_tok_")

    is_valid = CryptoEngine.verify_signed_action_token(
        transaction_id="TXN-103",
        action="SEND_RECOVERY_LINK",
        amount=4999.0,
        issued_at=tok["issued_at"],
        expires_at=tok["expires_at"],
        signature=tok["signature"]
    )
    assert is_valid is True

def test_signed_action_token_expiration():
    tok = CryptoEngine.generate_signed_action_token("TXN-104", "WAIT", 4999.0, ttl_seconds=-10)
    is_valid = CryptoEngine.verify_signed_action_token(
        transaction_id="TXN-104",
        action="WAIT",
        amount=4999.0,
        issued_at=tok["issued_at"],
        expires_at=tok["expires_at"],
        signature=tok["signature"]
    )
    assert is_valid is False

def test_merkle_tree_root_calculation():
    hashes = ["h1", "h2", "h3", "h4"]
    root = CryptoEngine.compute_merkle_root(hashes)
    assert len(root) == 64

    # Identical hashes yield identical root
    root2 = CryptoEngine.compute_merkle_root(hashes)
    assert root == root2
