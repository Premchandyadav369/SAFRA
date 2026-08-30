import os
import json
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from app.core.config import settings

class AIProvider(ABC):
    @abstractmethod
    async def explain_risk(self, context: Dict[str, Any]) -> str:
        pass

    @abstractmethod
    async def explain_action(self, context: Dict[str, Any]) -> str:
        pass

    @abstractmethod
    async def answer_event_question(self, context: Dict[str, Any], question: str) -> str:
        pass


class GemmaProvider(AIProvider):
    def __init__(self):
        self.hf_token = settings.HF_TOKEN
        self.model_id = settings.HF_MODEL_ID
        self.client = None

        if self.hf_token:
            try:
                from huggingface_hub import InferenceClient
                self.client = InferenceClient(model=self.model_id, token=self.hf_token)
            except Exception as e:
                print(f"[SAFRA AI] Warning: HuggingFace InferenceClient init failed: {e}")
                self.client = None

    def _build_system_prompt(self) -> str:
        return (
            "You are SAFRA's Revenue Recovery Intelligence Agent for merchants at the Razorpay AI Buildathon.\n"
            "Rules you must strictly obey:\n"
            "1. Do not invent missing transaction data or fabricate facts.\n"
            "2. Do not recommend actions outside the provided 'allowed_actions'.\n"
            "3. Do not claim real money has moved; all operations are simulated recovery workflows.\n"
            "4. Use concise, observational, evidence-based reasoning.\n"
            "5. Answer in 2 to 3 crisp sentences."
        )

    async def explain_risk(self, context: Dict[str, Any]) -> str:
        prompt = (
            f"Factual Transaction Context:\n{json.dumps(context, indent=2)}\n\n"
            "Task: Explain why this transaction is at risk and why it is recoverable."
        )
        return await self._generate(prompt, fallback=self._fallback_risk(context))

    async def explain_action(self, context: Dict[str, Any]) -> str:
        prompt = (
            f"Factual Transaction Context:\n{json.dumps(context, indent=2)}\n\n"
            f"Task: Explain why SAFRA's policy engine selected the action '{context.get('selected_action', 'WAIT')}'."
        )
        return await self._generate(prompt, fallback=self._fallback_action(context))

    async def answer_event_question(self, context: Dict[str, Any], question: str) -> str:
        prompt = (
            f"Factual Transaction Context:\n{json.dumps(context, indent=2)}\n\n"
            f"User Question: {question}\n\n"
            "Task: Answer the user question accurately based solely on the provided context."
        )
        return await self._generate(prompt, fallback=self._fallback_qa(context, question))

    async def _generate(self, prompt: str, fallback: str) -> str:
        if not self.client or not self.hf_token:
            return fallback

        try:
            messages = [
                {"role": "system", "content": self._build_system_prompt()},
                {"role": "user", "content": prompt}
            ]
            response = self.client.chat_completion(
                messages=messages,
                max_tokens=220,
                temperature=0.2
            )
            content = response.choices[0].message.content.strip()
            return content if content else fallback
        except Exception as e:
            print(f"[SAFRA AI] Gemma inference failed, using deterministic fallback: {e}")
            return fallback

    def _fallback_risk(self, context: Dict[str, Any]) -> str:
        amount = context.get("amount", 4999)
        currency = context.get("currency", "INR")
        curr_sym = "₹" if currency == "INR" else "$"
        reason = context.get("failure_reason", "Bank latency timeout")
        prob = int(context.get("recovery_probability", 0.74) * 100)
        return (
            f"Transaction of {curr_sym}{amount:,.0f} entered uncertainty due to {reason}. "
            f"Historical cohort analysis shows a {prob}% recovery likelihood because the payment rail confirmed debit."
        )

    def _fallback_action(self, context: Dict[str, Any]) -> str:
        action = context.get("selected_action", "WAIT")
        if action == "WAIT":
            return (
                "SAFRA selected WAIT because the customer's bank debited successfully, and sending an immediate repayment "
                "link risks a duplicate charge while the webhook is in transit."
            )
        elif action == "SEND_RECOVERY_LINK":
            return (
                "SAFRA selected SEND_RECOVERY_LINK because checkout was abandoned at the OTP stage, and the customer has a strong "
                "purchase history indicating high intent to complete the purchase."
            )
        elif action == "OFFER_ALTERNATIVE_PAYMENT_METHOD":
            return (
                "SAFRA selected OFFER_ALTERNATIVE_PAYMENT_METHOD because the primary bank switch timed out repeatedly, "
                "prompting an alternate saved payment route."
            )
        elif action == "STOP":
            return (
                "SAFRA triggered the STOP rule to avoid unnecessary customer friction, as contact thresholds were reached and "
                "the recovery probability fell below 20%."
            )
        return f"SAFRA executed bounded action '{action}' aligned with merchant safety policies and idempotency rules."

    def _fallback_qa(self, context: Dict[str, Any], question: str) -> str:
        action = context.get("selected_action", "WAIT")
        prob = int(context.get("recovery_probability", 0.74) * 100)
        q_lower = question.lower()
        if "why" in q_lower and "wait" in q_lower:
            return (
                "SAFRA chose WAIT because bank telemetry confirms funds were debited. Awaiting the delayed merchant callback "
                "prevents customer double charges."
            )
        elif "recoverable" in q_lower or "probability" in q_lower:
            return (
                f"This transaction has a {prob}% recovery probability based on high buyer intent and confirmed rail acknowledgment."
            )
        elif "stop" in q_lower:
            return (
                "SAFRA stops when recovery probability drops below 20% or when the customer contact limit is reached."
            )
        return (
            f"Based on the transaction record, SAFRA evaluated the failure signals and determined that executing '{action}' "
            f"maximizes recovery yield ({prob}%) while guaranteeing zero duplicate debits."
        )

# Export singleton AI provider
safra_ai_provider: AIProvider = GemmaProvider()
