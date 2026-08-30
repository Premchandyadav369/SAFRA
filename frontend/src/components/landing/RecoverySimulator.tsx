"use client";

import React, { useState } from "react";
import { mockDataset } from "@/data/mockEvents";
import { Play, RotateCcw, ArrowRight, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";

export default function RecoverySimulator() {
  const [selectedTxnId, setSelectedTxnId] = useState<string>("PAY-4999-HERO");
  const [isSimulating, setIsSimulating] = useState(false);
  const [revealedStepsCount, setRevealedStepsCount] = useState<number>(0);
  const [isNoteExpanded, setIsNoteExpanded] = useState<boolean>(false);
  const [aiNote, setAiNote] = useState<string | null>(null);

  const selectedEvent =
    mockDataset.find((e) => e.id === selectedTxnId) || mockDataset[0];

  const timelineSteps = [
    {
      num: "01",
      title: "PAYMENT STALLED",
      detail: `Bank response exceeded threshold (${selectedEvent.bank} latency callback delay).`,
    },
    {
      num: "02",
      title: "SIGNAL EXTRACTED",
      detail: `Customer profile: ${selectedEvent.customer_history.replace(/_/g, ' ')}. Buyer intent validated.`,
    },
    {
      num: "03",
      title: "HISTORICAL MATCH",
      detail: `Cohort analysis predicts ${(selectedEvent.recovery_probability * 100).toFixed(0)}% recovery likelihood.`,
    },
    {
      num: "04",
      title: "POLICY & STOPPING CHECK",
      detail: `Action '${selectedEvent.recommended_action}' allowed under merchant idempotency guardrails.`,
    },
    {
      num: "05",
      title: "BOUNDED ACTION",
      detail: `Executing ${selectedEvent.recommended_action} with 0 duplicate charge risk.`,
    },
  ];

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setRevealedStepsCount(1);
    setAiNote(null);

    setTimeout(() => setRevealedStepsCount(2), 400);
    setTimeout(() => setRevealedStepsCount(3), 800);
    setTimeout(() => setRevealedStepsCount(4), 1200);
    setTimeout(() => {
      setRevealedStepsCount(5);
      setIsSimulating(false);
      setAiNote(
        `Based on the payment trail, the strongest signal is a temporary bank timeout. The customer has previously completed similar purchases, so retry pressure is low and waiting is currently safer than prompting another payment.`
      );
    }, 1600);

    // Call backend explain endpoint
    try {
      const res = await axios.post(`http://localhost:8000/api/events/${selectedEvent.id}/explain`, {});
      if (res.data && res.data.explanation) {
        setAiNote(res.data.explanation);
      }
    } catch (e) {
      // Graceful fallback
    }
  };

  const handleReset = () => {
    setIsSimulating(false);
    setRevealedStepsCount(0);
    setAiNote(null);
    setIsNoteExpanded(false);
  };

  return (
    <section id="recovery" className="py-20 sm:py-28 border-b border-line bg-paper">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        {/* Section Label & Statement */}
        <div className="max-w-[800px] mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-bold tracking-widest text-signal uppercase">
              03 / RECOVERY SIMULATOR
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-ink leading-tight tracking-tight">
            Don&apos;t send the same message twice.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ink-soft font-body leading-relaxed max-w-[620px]">
            SAFRA evaluates causal signals before executing bounded recovery. Test any transaction in the active investigation canvas:
          </p>
        </div>

        {/* Active Investigation Canvas */}
        <div className="border border-line bg-surface rounded-sm p-6 sm:p-10 space-y-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-line">
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
                SELECT CASE FILE
              </div>
              <select
                value={selectedTxnId}
                onChange={(e) => {
                  setSelectedTxnId(e.target.value);
                  handleReset();
                }}
                className="mt-1 bg-paper border border-line rounded-sm px-3.5 py-2 text-xs font-mono font-bold text-ink focus:outline-none focus:border-signal"
              >
                {mockDataset.slice(0, 15).map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    CASE / {evt.id} — {evt.currency === "INR" ? "₹" : "$"}{evt.amount.toLocaleString()} ({evt.merchant})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="px-6 py-3 bg-ink hover:bg-ink-soft disabled:opacity-50 text-paper text-xs font-display font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current text-signal" />
                <span>{isSimulating ? "Investigating Trail..." : "Run Investigation"}</span>
              </button>

              {revealedStepsCount > 0 && (
                <button
                  onClick={handleReset}
                  className="px-4 py-3 bg-paper border border-line text-ink text-xs font-mono hover:bg-paper-dark rounded-sm transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Case Metadata Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pb-6 border-b border-line">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-muted">Case ID</span>
              <div className="font-mono text-sm font-bold text-ink">{selectedEvent.id}</div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-muted">Transaction Value</span>
              <div className="font-display text-2xl font-bold text-ink">
                {selectedEvent.currency === "INR" ? "₹" : "$"}{selectedEvent.amount.toLocaleString()}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-muted">Current State</span>
              <div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm ${
                    selectedEvent.payment_status === "PENDING"
                      ? "bg-warning/15 text-warning"
                      : selectedEvent.payment_status === "RECOVERED"
                      ? "bg-safe/15 text-safe"
                      : "bg-danger/15 text-danger"
                  }`}
                >
                  {selectedEvent.payment_status}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-muted">P(Recovery)</span>
              <div className="font-mono text-sm font-bold text-safe">
                {(selectedEvent.recovery_probability * 100).toFixed(0)}% Likelihood
              </div>
            </div>
          </div>

          {/* Vertical Sequential Investigation Timeline */}
          <div className="space-y-4">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
              Decision Sequence & Stopping Rules
            </div>

            <div className="space-y-3">
              {timelineSteps.map((step, idx) => {
                const isRevealed = idx < revealedStepsCount;
                const isCurrent = idx === revealedStepsCount - 1 && isSimulating;

                return (
                  <div
                    key={step.num}
                    className={`p-4 rounded-sm border transition-all ${
                      isRevealed
                        ? isCurrent
                          ? "bg-surface border-signal"
                          : "bg-paper/70 border-line"
                        : "opacity-35 bg-paper/20 border-line/40"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${isRevealed ? "text-signal" : "text-muted"}`}>
                          {step.num}
                        </span>
                        <span className="font-bold text-ink">{step.title}</span>
                      </div>

                      {isRevealed && (
                        <span className="text-[10px] text-safe font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-safe" />
                          <span>EVALUATED</span>
                        </span>
                      )}
                    </div>

                    {isRevealed && (
                      <p className="mt-1 text-xs text-ink-soft font-body pl-7">
                        {step.detail}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SAFRA NOTE (Analyst Memo format, no chat bubbles) */}
          {aiNote && (
            <div className="p-5 sm:p-6 bg-paper border-l-4 border-signal border border-line rounded-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-signal">
                  ● SAFRA ANALYST NOTE (GEMMA 3 REASONING)
                </span>
                <button
                  onClick={() => setIsNoteExpanded(!isNoteExpanded)}
                  className="text-xs font-mono font-semibold text-ink-soft hover:text-ink flex items-center gap-1"
                >
                  <span>{isNoteExpanded ? "COLLAPSE" : "WHY THIS ACTION?"}</span>
                  {isNoteExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-ink font-body leading-relaxed">
                {aiNote}
              </p>

              {isNoteExpanded && (
                <div className="pt-3 border-t border-line text-xs font-mono text-ink-soft space-y-1.5">
                  <div>• Bounded Policy Rule: <strong>Rule 04 (Bank Callback Delay)</strong></div>
                  <div>• Idempotency Check: <strong>Pass (0 duplicate charges possible)</strong></div>
                  <div>• Recommended Action: <strong>{selectedEvent.recommended_action}</strong></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
