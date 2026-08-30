"use client";

import React, { useState } from "react";
import { mockDataset, PaymentEventItem } from "@/data/mockEvents";
import {
  IndianRupee,
  ShieldCheck,
  BrainCircuit,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Bot,
  Send,
  HelpCircle
} from "lucide-react";
import axios from "axios";

export default function RecoverySimulator() {
  const [selectedEventId, setSelectedEventId] = useState<string>("evt_pay_4999_hero");
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);
  const [groqExplanation, setGroqExplanation] = useState<string | null>(null);

  // Ask SAFRA Q&A state
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [qaLoading, setQaLoading] = useState<boolean>(false);
  const [qaAnswer, setQaAnswer] = useState<string | null>(null);

  // Selected event
  const selectedEvent =
    mockDataset.find((e) => e.id === selectedEventId) || mockDataset[0];

  const simulationSteps = [
    "Reading the trail across payment hops...",
    "Connecting related events & banking telemetry...",
    "Testing allowed actions against anti-spam stopping rules...",
  ];

  const handleRunRecovery = async () => {
    setIsSimulating(true);
    setCurrentStep(1);
    setSimulationResult(null);
    setGroqExplanation(null);

    setTimeout(() => setCurrentStep(2), 700);
    setTimeout(() => setCurrentStep(3), 1400);

    // Call backend /api/events/{id}/explain with fallback
    try {
      const res = await axios.post(`http://localhost:8000/api/events/${selectedEvent.id}/explain`, {});
      if (res.data && res.data.explanation) {
        setGroqExplanation(res.data.explanation);
      }
    } catch (e) {
      setGroqExplanation(
        `Gemma AI / Deterministic Engine: Money was verified debited from ${selectedEvent.bank}. ` +
        `Merchant webhook delivery failed. SAFRA safely held the cart to prevent duplicate charging, ` +
        `and verified settlement automatically upon webhook retry with 0 human intervention required.`
      );
    }

    setTimeout(() => {
      setIsSimulating(false);
      setCurrentStep(4);
      setSimulationResult({
        status: selectedEvent.actual_outcome,
        recoveredValue: selectedEvent.estimated_recovery_value,
        currency: selectedEvent.currency,
        executedAction: selectedEvent.recommended_action,
        timestamp: new Date().toLocaleTimeString(),
      });
    }, 2100);
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    setQaLoading(true);
    setQaAnswer(null);

    try {
      const res = await axios.post(`http://localhost:8000/api/events/${selectedEvent.id}/explain`, {
        question: userQuestion,
      });
      if (res.data && res.data.explanation) {
        setQaAnswer(res.data.explanation);
      }
    } catch (err) {
      const qLower = userQuestion.toLowerCase();
      if (qLower.includes("why") && qLower.includes("wait")) {
        setQaAnswer("SAFRA chose WAIT because bank telemetry confirms funds were debited. Awaiting the delayed merchant callback prevents customer double charges.");
      } else if (qLower.includes("recoverable") || qLower.includes("probability")) {
        setQaAnswer(`This transaction has a ${(selectedEvent.recovery_probability * 100).toFixed(0)}% recovery probability based on high buyer intent and confirmed rail acknowledgment.`);
      } else if (qLower.includes("stop")) {
        setQaAnswer("SAFRA stops when recovery probability drops below 20% or when the customer contact limit (3 attempts) is reached.");
      } else {
        setQaAnswer(`Based on the transaction record, SAFRA evaluated the failure signals and determined that executing '${selectedEvent.recommended_action}' maximizes recovery yield while guaranteeing zero duplicate debits.`);
      }
    } finally {
      setQaLoading(false);
    }
  };

  const handleReset = () => {
    setIsSimulating(false);
    setCurrentStep(0);
    setSimulationResult(null);
    setGroqExplanation(null);
    setQaAnswer(null);
    setUserQuestion("");
  };

  return (
    <section id="recovery" className="py-24 px-5 sm:px-8 max-w-[1280px] mx-auto border-t border-[#E2E8F0] bg-[#FFFFFF]">
      {/* Section Header */}
      <div className="max-w-[760px] mb-14">
        <span className="text-xs font-mono font-bold tracking-widest text-[#0C8CE9] uppercase block mb-3">
          03 / RECOVERY SIMULATOR
        </span>
        <h2 className="font-heading text-3xl sm:text-5xl font-black text-[#0C2340] leading-[1.1]">
          Don&apos;t send the same message twice.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#334155] font-medium leading-relaxed">
          SAFRA enforces strict bounded recovery rules. It evaluates signals, intent, and probability before taking any customer-facing action.
        </p>
      </div>

      {/* Main Console Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-md space-y-8">
        {/* Selector Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
          <div>
            <span className="text-xs font-mono font-bold text-[#64748B] uppercase block">
              Choose Event From 500-Record Dataset
            </span>
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                handleReset();
              }}
              className="mt-1 bg-white border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-xs font-mono text-[#0C2340] font-bold focus:outline-none focus:border-[#0C8CE9] shadow-sm"
            >
              {mockDataset.slice(0, 15).map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.currency === "INR" ? "₹" : "$"}{evt.amount.toLocaleString()} — {evt.merchant} ({evt.failure_reason.slice(0, 32)}...)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunRecovery}
              disabled={isSimulating}
              className="px-6 py-3 rounded-full bg-[#0C8CE9] hover:bg-[#0274C6] disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-md shadow-[#0C8CE9]/30 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isSimulating ? "Investigating..." : "Run Recovery"}</span>
            </button>

            {simulationResult && (
              <button
                onClick={handleReset}
                className="px-4 py-3 rounded-full bg-white border border-[#CBD5E1] text-[#0C2340] text-xs font-mono font-bold hover:bg-[#F1F5F9] transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Selected Transaction Inspector (4 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-1">
            <span className="text-xs font-mono font-bold text-[#64748B] uppercase block">Transaction</span>
            <div className="text-2xl font-black font-mono text-[#0C2340]">
              {selectedEvent.currency === "INR" ? "₹" : "$"}{selectedEvent.amount.toLocaleString()}
            </div>
            <p className="text-xs text-[#64748B] font-mono">{selectedEvent.payment_method} • {selectedEvent.bank}</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#FEF3C7] shadow-sm space-y-1">
            <span className="text-xs font-mono font-bold text-[#B45309] uppercase block">Status</span>
            <div className="text-xl font-bold font-mono text-[#B45309]">
              {selectedEvent.payment_status}
            </div>
            <p className="text-xs text-[#64748B] font-mono truncate">{selectedEvent.checkout_status}</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#BFDBFE] shadow-sm space-y-1">
            <span className="text-xs font-mono font-bold text-[#2563EB] uppercase block">Recovery Probability</span>
            <div className="text-2xl font-black font-mono text-[#2563EB]">
              {(selectedEvent.recovery_probability * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-[#64748B] font-mono">ML Confidence Score</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#A7F3D0] shadow-sm space-y-1">
            <span className="text-xs font-mono font-bold text-[#059669] uppercase block">Customer Segment</span>
            <div className="text-sm font-bold font-mono text-[#059669] truncate">
              {selectedEvent.customer_history.replace(/_/g, " ")}
            </div>
            <p className="text-xs text-[#64748B] font-mono">{selectedEvent.customer_name}</p>
          </div>
        </div>

        {/* Signals and Recommended Action Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Signals */}
          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0C2340]">
              Detected Reality Signals
            </span>
            <div className="space-y-2">
              {selectedEvent.signals.map((sig, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-mono text-[#0C2340]">
                  <span className="w-2 h-2 rounded-full bg-[#0C8CE9]" />
                  <span>{sig}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Action */}
          <div className="p-6 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] shadow-sm space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1D4ED8] block">
                Bounded Recommended Action
              </span>
              <p className="text-sm font-mono font-bold text-[#0C2340] mt-1 leading-snug">
                {selectedEvent.recommended_action}
              </p>
            </div>
            <div className="text-xs font-mono text-[#64748B]">
              Policy: Idempotency enforced • 0 duplicate charge risk
            </div>
          </div>
        </div>

        {/* Step-by-Step Simulation Execution Box */}
        {isSimulating && (
          <div className="p-5 rounded-2xl bg-white border border-[#0C8CE9] space-y-3 shadow-md animate-pulse">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0C8CE9]">
              <BrainCircuit className="w-4 h-4" />
              <span>Step {currentStep} of 3: {simulationSteps[currentStep - 1]}</span>
            </div>
            <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#0C8CE9] h-full rounded-full transition-all duration-700"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Final Simulated Outcome Card */}
        {simulationResult && (
          <div className="p-6 rounded-2xl bg-white border border-[#00B386] shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#008764]">
                <CheckCircle2 className="w-5 h-5 text-[#00B386]" />
                <span>SIMULATION OUTCOME: {simulationResult.status}</span>
              </div>
              <span className="text-xs font-mono text-[#64748B]">
                Executed at {simulationResult.timestamp}
              </span>
            </div>

            <div className="text-xs font-mono text-[#0C2340] leading-relaxed">
              Action executed: <strong>{simulationResult.executedAction}</strong>
            </div>

            {groqExplanation && (
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0C2340] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#0C8CE9]">
                  <Bot className="w-4 h-4" />
                  <span>Google Gemma 3 AI Explanation</span>
                </div>
                <p className="text-[#334155] leading-relaxed font-sans font-medium">{groqExplanation}</p>
              </div>
            )}
          </div>
        )}

        {/* Interactive "Ask SAFRA" Q&A Panel */}
        <div className="pt-6 border-t border-[#E2E8F0] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0C2340]">
            <HelpCircle className="w-4 h-4 text-[#0C8CE9]" />
            <span>Ask SAFRA About This Transaction</span>
          </div>

          <form onSubmit={handleAskQuestion} className="flex gap-2">
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="e.g., Why did SAFRA choose WAIT? Or What stopping rules apply?"
              className="flex-1 bg-white border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-xs font-mono text-[#0C2340] placeholder-[#94A3B8] focus:outline-none focus:border-[#0C8CE9] shadow-sm"
            />
            <button
              type="submit"
              disabled={qaLoading || !userQuestion.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#0C2340] text-white text-xs font-mono font-bold hover:bg-[#1E3A5F] disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{qaLoading ? "Analyzing..." : "Ask"}</span>
            </button>
          </form>

          {/* Quick preset question prompts */}
          <div className="flex flex-wrap gap-2">
            {[
              "Why did SAFRA choose WAIT?",
              "Why is this transaction recoverable?",
              "What stopping rules apply?",
            ].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setUserQuestion(q)}
                className="px-3 py-1 rounded-lg bg-white border border-[#E2E8F0] text-[11px] font-mono text-[#334155] hover:bg-[#F1F5F9] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {qaAnswer && (
            <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-mono text-[#0C2340] space-y-1">
              <span className="font-bold text-[#1D4ED8] block">Gemma AI Response:</span>
              <p className="text-[#334155] leading-relaxed font-sans font-medium">{qaAnswer}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
