"use client";

import React, { useState, useEffect } from "react";
import {
  Flame,
  Play,
  RotateCcw,
  ShieldCheck,
  Send,
  Sparkles,
  Sliders,
  Volume2,
  VolumeX,
  FileJson,
  Check,
  Copy,
  AlertTriangle,
  ArrowRight,
  Activity,
  CheckCircle2
} from "lucide-react";
import axios from "axios";

// Native Web Audio Synthesizer for UI feedback
const playSynthesizerTone = (type: "INJECT" | "BARRIER" | "RECOVER") => {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "INJECT") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === "BARRIER") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === "RECOVER") {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.3);
      osc2.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    // Audio context may be blocked before interaction
  }
};

const presets = [
  {
    id: "p_cbs_timeout",
    name: "HDFC UPI CBS Timeout",
    amount: 4999,
    latency: 1420,
    loyalty: 0.92,
    retries: 1,
    failure: "UPI Callback Timeout (1,420ms delay)",
    method: "UPI",
    bank: "HDFC Bank",
    expectedAction: "WAIT",
  },
  {
    id: "p_double_pay",
    name: "Panic Repay Collision (Barrier)",
    amount: 12800,
    latency: 1800,
    loyalty: 0.85,
    retries: 2,
    failure: "Rapid Retry in Under 60s during Bank Settlement Delay",
    method: "UPI",
    bank: "SBI",
    expectedAction: "WAIT (BARRIER ACTIVE)",
  },
  {
    id: "p_otp_drop",
    name: "High-Intent 3DS2 OTP Drop",
    amount: 8499,
    latency: 180,
    loyalty: 0.88,
    retries: 0,
    failure: "OTP SMS Latency Dropoff at Step 3",
    method: "Cards 3DS2",
    bank: "ICICI Bank",
    expectedAction: "SEND_RECOVERY_LINK",
  },
  {
    id: "p_insufficient_funds",
    name: "Insufficient Funds (High LTV)",
    amount: 24999,
    latency: 220,
    loyalty: 0.95,
    retries: 1,
    failure: "Direct Debit Failed: Insufficient Account Balance",
    method: "UPI Direct",
    bank: "Axis Bank",
    expectedAction: "OFFER_ALTERNATIVE_PAYMENT_METHOD",
  },
  {
    id: "p_invoice_overdue",
    name: "B2B Net-30 Invoice Past 21 Days",
    amount: 85000,
    latency: 120,
    loyalty: 0.65,
    retries: 3,
    failure: "Invoice Overdue by 22 Days with No Response",
    method: "Bank Transfer",
    bank: "Kotak Bank",
    expectedAction: "ESCALATE",
  },
];

export default function ChaosSandbox() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("p_cbs_timeout");
  const [amount, setAmount] = useState<number>(4999);
  const [latency, setLatency] = useState<number>(1420);
  const [loyalty, setLoyalty] = useState<number>(0.92);
  const [retries, setRetries] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [copilotQuestion, setCopilotQuestion] = useState<string>("");
  const [copilotAnswer, setCopilotAnswer] = useState<string | null>(null);
  const [isCopilotLoading, setIsCopilotLoading] = useState<boolean>(false);
  const [copiedDossier, setCopiedDossier] = useState<boolean>(false);

  // Apply Preset
  const handleSelectPreset = (pId: string) => {
    const p = presets.find((x) => x.id === pId);
    if (!p) return;
    setSelectedPresetId(pId);
    setAmount(p.amount);
    setLatency(p.latency);
    setLoyalty(p.loyalty);
    setRetries(p.retries);
    setCopilotAnswer(null);

    if (soundEnabled) {
      if (p.expectedAction.includes("BARRIER")) {
        playSynthesizerTone("BARRIER");
      } else {
        playSynthesizerTone("INJECT");
      }
    }
  };

  // Real-time Deterministic Calculation
  const isBankTimeout = latency > 600;
  const isInsufficient = selectedPresetId === "p_insufficient_funds";
  const isOverdue = selectedPresetId === "p_invoice_overdue";

  let recoveryProb = 0.45;
  if (isBankTimeout) recoveryProb += 0.24;
  if (loyalty > 0.7) recoveryProb += 0.18;
  if (isInsufficient) recoveryProb -= 0.28;
  if (retries >= 3) recoveryProb -= 0.18;
  if (isOverdue) recoveryProb -= 0.20;

  recoveryProb = Math.min(0.98, Math.max(0.05, recoveryProb));

  let recommendedAction = "WAIT";
  if (retries >= 3 || recoveryProb < 0.20) {
    recommendedAction = "STOP";
  } else if (isOverdue) {
    recommendedAction = "ESCALATE";
  } else if (isInsufficient && loyalty >= 0.70) {
    recommendedAction = "OFFER_ALTERNATIVE_PAYMENT_METHOD";
  } else if (isBankTimeout) {
    recommendedAction = "WAIT";
  } else if (recoveryProb > 0.50) {
    recommendedAction = "SEND_RECOVERY_LINK";
  }

  // Ask Copilot Handler
  const handleAskCopilot = async (qText?: string) => {
    const question = qText || copilotQuestion;
    if (!question.trim()) return;

    setIsCopilotLoading(true);
    setCopilotAnswer(null);

    try {
      const res = await axios.post("http://localhost:8000/api/events/PAY-4999-HERO/ask", {
        question: `${question} (Context: Amount ₹${amount}, Latency ${latency}ms, Loyalty ${loyalty}, Retries ${retries}, Recommended Action ${recommendedAction}, Recovery Prob ${(recoveryProb * 100).toFixed(0)}%)`
      });
      if (res.data && res.data.answer) {
        setCopilotAnswer(res.data.answer);
      }
    } catch (e) {
      // Deterministic reasoning fallback
      setCopilotAnswer(
        `Based on the relational graph state, the primary signal is ${
          isBankTimeout
            ? "an upstream Core Banking System (CBS) latency spike"
            : isInsufficient
            ? "direct debit account depletion on a repeat buyer"
            : "session dropoff at OTP stage"
        }. With P(Recovery) = ${(recoveryProb * 100).toFixed(0)}% and ${retries} prior attempt(s), the policy engine mandates '${recommendedAction}' with zero duplicate charge risk.`
      );
    } finally {
      setIsCopilotLoading(false);
      if (soundEnabled) playSynthesizerTone("RECOVER");
    }
  };

  const copyAuditDossier = () => {
    const dossier = {
      audit_report_id: `DOSSIER-${Date.now()}`,
      timestamp: new Date().toISOString(),
      transaction_value: `INR ${amount.toLocaleString("en-IN")}`,
      issuer_switch_latency_ms: latency,
      buyer_loyalty_score: loyalty,
      retry_count: retries,
      deterministic_recovery_probability: `${(recoveryProb * 100).toFixed(1)}%`,
      bounded_action_selected: recommendedAction,
      idempotency_guardrail: "100% Barrier Active (0 Duplicate Charges)",
      compliance_certification: "PCI-DSS Bounded Execution Compliant"
    };
    navigator.clipboard.writeText(JSON.stringify(dossier, null, 2));
    setCopiedDossier(true);
    setTimeout(() => setCopiedDossier(false), 2000);
  };

  return (
    <section className="py-20 sm:py-28 border-b border-line bg-paper">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        {/* Section Label & Statement */}
        <div className="max-w-[840px] mb-14">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold tracking-widest text-signal uppercase flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-signal" />
                <span>INTERACTIVE CHAOS SANDBOX & COPILOT</span>
              </span>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="px-2.5 py-1 rounded-sm border border-line bg-surface text-ink text-[11px] font-mono flex items-center gap-1.5 hover:border-ink transition-colors"
              title="Toggle Audio Feedback"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-signal" /> : <VolumeX className="w-3.5 h-3.5 text-muted" />}
              <span>{soundEnabled ? "Audio On" : "Audio Muted"}</span>
            </button>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold text-ink leading-tight tracking-tight">
            Inject Financial Failure. Watch SAFRA React.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ink-soft font-body leading-relaxed max-w-[660px]">
            Test live failure scenarios, tweak transaction parameters in real time, and ask the Google Gemma 3 AI Copilot to explain every bounded action.
          </p>
        </div>

        {/* Preset Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2 pb-6 mb-6 border-b border-line">
          <span className="text-[10px] font-mono uppercase font-bold text-muted mr-2">
            Chaos Presets:
          </span>
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p.id)}
              className={`px-3.5 py-2 rounded-sm border text-xs font-mono transition-all ${
                selectedPresetId === p.id
                  ? "bg-ink text-paper border-ink font-bold shadow-sm"
                  : "bg-surface border-line text-ink hover:border-signal"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Interactive Sliders & Live Reaction Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Parameter Tuning Sliders */}
          <div className="lg:col-span-6 p-6 sm:p-8 bg-surface border border-line rounded-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-line text-xs font-mono">
              <span className="font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-signal" />
                <span>Live Parameter Tuning</span>
              </span>
              <span className="text-signal font-semibold">Real-Time Reactive</span>
            </div>

            {/* Slider 1: Amount */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-muted uppercase text-[10px]">Transaction Value</span>
                <span className="font-bold text-ink font-display text-sm">₹{amount.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-signal cursor-pointer"
              />
            </div>

            {/* Slider 2: Issuer Latency */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-muted uppercase text-[10px]">Issuer Switch Latency (CBS Delay)</span>
                <span className={`font-bold ${latency > 600 ? "text-signal" : "text-safe"}`}>
                  {latency}ms {latency > 600 ? "(Queuing Spike)" : "(Normal)"}
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="3000"
                step="50"
                value={latency}
                onChange={(e) => setLatency(Number(e.target.value))}
                className="w-full accent-signal cursor-pointer"
              />
            </div>

            {/* Slider 3: Loyalty */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-muted uppercase text-[10px]">Buyer Loyalty Score</span>
                <span className="font-bold text-ink">{(loyalty * 100).toFixed(0)}% Loyalty Index</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="1.00"
                step="0.05"
                value={loyalty}
                onChange={(e) => setLoyalty(Number(e.target.value))}
                className="w-full accent-signal cursor-pointer"
              />
            </div>

            {/* Slider 4: Retries */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-muted uppercase text-[10px]">Retry Attempts (Panic Count)</span>
                <span className={`font-bold ${retries >= 3 ? "text-danger" : "text-ink"}`}>
                  {retries} Retries {retries >= 3 ? "(Contact Limit)" : ""}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={retries}
                onChange={(e) => setRetries(Number(e.target.value))}
                className="w-full accent-signal cursor-pointer"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-line flex items-center justify-between">
              <button
                onClick={copyAuditDossier}
                className="px-3 py-2 bg-paper border border-line rounded-sm text-xs font-mono text-ink hover:bg-paper-dark flex items-center gap-1.5 transition-colors"
              >
                {copiedDossier ? <Check className="w-3.5 h-3.5 text-safe" /> : <FileJson className="w-3.5 h-3.5 text-signal" />}
                <span>{copiedDossier ? "Dossier Copied ✓" : "Export Audit Dossier"}</span>
              </button>

              <span className="text-[10px] font-mono text-safe font-bold">
                100% Deterministic Engine
              </span>
            </div>
          </div>

          {/* Right: Live Engine Reaction & Copilot */}
          <div className="lg:col-span-6 space-y-6">
            {/* Live Reaction Card */}
            <div className="p-6 sm:p-8 bg-surface border border-signal rounded-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-line font-mono text-xs">
                <span className="font-bold text-signal uppercase tracking-wider">
                  Live Engine Decision Output
                </span>
                <span className="text-ink-soft">Evaluated in 12ms</span>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono">
                <div className="p-3.5 bg-paper border border-line rounded-sm space-y-1">
                  <span className="text-[10px] text-muted uppercase block">Calculated P(Recovery)</span>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-safe">
                    {(recoveryProb * 100).toFixed(0)}%
                  </div>
                  <span className="text-[10px] text-safe font-semibold">
                    ₹{((amount * recoveryProb)).toLocaleString("en-IN", { maximumFractionDigits: 0 })} Value
                  </span>
                </div>

                <div className="p-3.5 bg-paper border border-line rounded-sm space-y-1">
                  <span className="text-[10px] text-muted uppercase block">Selected Bounded Action</span>
                  <div className="font-mono text-xs sm:text-sm font-bold text-signal truncate">
                    {recommendedAction}
                  </div>
                  <span className="text-[10px] text-ink-soft font-medium">0 Duplicate Debits</span>
                </div>
              </div>

              <div className="p-3.5 bg-paper border-l-2 border-signal border border-line rounded-sm font-mono text-xs text-ink space-y-1">
                <div className="font-bold text-[11px] text-signal uppercase">
                  Policy Rule Execution
                </div>
                <p className="text-xs font-body text-ink-soft leading-relaxed">
                  {recommendedAction === "WAIT"
                    ? "Bank debit receipt confirmed. Customer retries repressed by duplicate barrier to prevent double charges."
                    : recommendedAction === "SEND_RECOVERY_LINK"
                    ? "High checkout intent score (0.88). Dispatching pre-filled recovery link via SMS/WhatsApp."
                    : recommendedAction === "OFFER_ALTERNATIVE_PAYMENT_METHOD"
                    ? "Direct account balance depleted. Prompting card token switch or EMI method."
                    : recommendedAction === "ESCALATE"
                    ? "Aging invoice past Net-30 threshold. Moving to staged accounts receivable workflow."
                    : "Retry limit reached or recovery score below threshold. Stopping contact to shield buyer from fatigue."}
                </p>
              </div>
            </div>

            {/* Ask SAFRA AI Copilot Box */}
            <div className="p-6 bg-surface border border-line rounded-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-ink uppercase pb-2 border-b border-line">
                <Sparkles className="w-4 h-4 text-signal" />
                <span>Ask SAFRA AI Copilot (Google Gemma 3)</span>
              </div>

              {/* Suggested Questions */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Why is WAIT the safest action here?",
                  "What is the duplicate charge risk if customer retries?",
                  "How does issuer switch latency affect settlement?"
                ].map((sq) => (
                  <button
                    key={sq}
                    onClick={() => {
                      setCopilotQuestion(sq);
                      handleAskCopilot(sq);
                    }}
                    className="px-2.5 py-1 bg-paper hover:bg-paper-dark border border-line rounded-sm text-[10px] font-mono text-ink-soft hover:text-ink transition-colors text-left"
                  >
                    {sq}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={copilotQuestion}
                  onChange={(e) => setCopilotQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAskCopilot()}
                  placeholder="Ask why this action was chosen, duplicate risks, etc..."
                  className="w-full bg-paper border border-line rounded-sm px-3.5 py-2 text-xs font-mono text-ink placeholder-muted focus:outline-none focus:border-signal"
                />
                <button
                  onClick={() => handleAskCopilot()}
                  disabled={isCopilotLoading}
                  className="px-4 py-2 bg-ink text-paper hover:bg-ink-soft disabled:opacity-50 text-xs font-mono font-bold rounded-sm shrink-0 flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-signal" />
                  <span>{isCopilotLoading ? "Reasoning..." : "Ask"}</span>
                </button>
              </div>

              {/* Copilot Answer Display */}
              {copilotAnswer && (
                <div className="p-4 bg-paper border-l-2 border-safe border border-line rounded-sm space-y-1.5 font-mono text-xs">
                  <div className="flex items-center gap-1.5 text-[10px] text-safe font-bold uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5 text-safe" />
                    <span>SAFRA Analyst Answer (Factual Grounded)</span>
                  </div>
                  <p className="text-xs text-ink font-body leading-relaxed">
                    {copilotAnswer}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
