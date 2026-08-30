import hmac
import hashlib
import json
import time
from typing import Dict, Any, List, Optional, Tuple

class CryptoEngine:
    SECRET_KEY = b"safra_razorpay_buildathon_secret_seed_2026"

    @classmethod
    def generate_idempotency_hash(
        cls,
        merchant_id: str,
        customer_id: str,
        amount: float,
        currency: str = "INR",
        window_seconds: int = 30
    ) -> str:
        """
        Generates a deterministic sliding-window HMAC-SHA256 idempotency collision token.
        Transactions within the same time epoch window share identical hashes to detect rapid duplicate retries.
        """
        epoch_window = int(time.time() // window_seconds)
        message = f"{merchant_id}:{customer_id}:{amount:.2f}:{currency.upper()}:{epoch_window}".encode("utf-8")
        return hmac.new(cls.SECRET_KEY, message, hashlib.sha256).hexdigest()

    @classmethod
    def verify_collision(
        cls,
        incoming_hash: str,
        merchant_id: str,
        customer_id: str,
        amount: float,
        currency: str = "INR",
        window_seconds: int = 30
    ) -> bool:
        """
        Verifies if incoming payment attempt matches current or immediately preceding epoch window.
        Provides zero-drift protection against race conditions in distributed webhook nodes.
        """
        current_window = int(time.time() // window_seconds)
        for epoch in [current_window, current_window - 1]:
            msg = f"{merchant_id}:{customer_id}:{amount:.2f}:{currency.upper()}:{epoch}".encode("utf-8")
            expected_hash = hmac.new(cls.SECRET_KEY, msg, hashlib.sha256).hexdigest()
            if hmac.compare_digest(incoming_hash, expected_hash):
                return True
        return False

    @classmethod
    def build_audit_block_hash(
        cls,
        prev_hash: str,
        transaction_id: str,
        event_type: str,
        payload: Dict[str, Any],
        timestamp: float
    ) -> str:
        """
        Chains financial audit events into a tamper-evident cryptographic hash chain.
        Similar to Git commit DAGs and distributed ledger validation blocks.
        """
        serialized_payload = json.dumps(payload, sort_keys=True)
        raw_string = f"{prev_hash}|{transaction_id}|{event_type}|{serialized_payload}|{timestamp:.4f}".encode("utf-8")
        return hashlib.sha256(raw_string).hexdigest()

    @classmethod
    def verify_audit_chain(cls, chain: List[Dict[str, Any]]) -> Tuple[bool, Optional[int]]:
        """
        Verifies mathematical integrity of the entire audit chain.
        Returns (True, None) if valid, or (False, invalid_index) if tampering is detected.
        """
        if not chain:
            return True, None

        for idx in range(len(chain)):
            entry = chain[idx]
            expected_prev = "0" * 64 if idx == 0 else chain[idx - 1]["block_hash"]
            if entry.get("prev_hash") != expected_prev:
                return False, idx

            calculated_hash = cls.build_audit_block_hash(
                prev_hash=expected_prev,
                transaction_id=entry["transaction_id"],
                event_type=entry["event_type"],
                payload=entry.get("payload", {}),
                timestamp=entry["timestamp"]
            )
            if not hmac.compare_digest(entry["block_hash"], calculated_hash):
                return False, idx

        return True, None

    @classmethod
    def generate_signed_action_token(
        cls,
        transaction_id: str,
        action: str,
        amount: float,
        ttl_seconds: int = 300
    ) -> Dict[str, Any]:
        """
        Issues an ephemeral cryptographically signed token for bounded recovery executions.
        Prevents replay attacks, link forgery, and stale webhook processing.
        """
        issued_at = int(time.time())
        expires_at = issued_at + ttl_seconds
        payload = f"{transaction_id}:{action}:{amount:.2f}:{issued_at}:{expires_at}".encode("utf-8")
        signature = hmac.new(cls.SECRET_KEY, payload, hashlib.sha256).hexdigest()

        return {
            "transaction_id": transaction_id,
            "action": action,
            "amount": amount,
            "issued_at": issued_at,
            "expires_at": expires_at,
            "signature": signature,
            "token": f"safra_tok_{signature[:32]}"
        }

    @classmethod
    def verify_signed_action_token(
        cls,
        transaction_id: str,
        action: str,
        amount: float,
        issued_at: int,
        expires_at: int,
        signature: str
    ) -> bool:
        """
        Validates cryptographic signature and non-expired TTL for recovery action execution.
        """
        current_time = int(time.time())
        if current_time > expires_at:
            return False

        payload = f"{transaction_id}:{action}:{amount:.2f}:{issued_at}:{expires_at}".encode("utf-8")
        expected_sig = hmac.new(cls.SECRET_KEY, payload, hashlib.sha256).hexdigest()
        return hmac.compare_digest(signature, expected_sig)

    @classmethod
    def compute_merkle_root(cls, hashes: List[str]) -> str:
        """
        Computes binary Merkle Tree Root over transaction batch hashes.
        Enables verifiable cryptographic batch reconciliation for T+1 financial settlements.
        """
        if not hashes:
            return hashlib.sha256(b"empty_batch").hexdigest()

        current_level = [h if len(h) == 64 else hashlib.sha256(h.encode("utf-8")).hexdigest() for h in hashes]

        while len(current_level) > 1:
            if len(current_level) % 2 != 0:
                current_level.append(current_level[-1])

            next_level = []
            for i in range(0, len(current_level), 2):
                combined = (current_level[i] + current_level[i + 1]).encode("utf-8")
                next_level.append(hashlib.sha256(combined).hexdigest())
            current_level = next_level

        return current_level[0]
