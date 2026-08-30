"use client";

import React, { useState } from "react";
import { ArrowDown, Check, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

interface TrailStep {
  id: string;
  stage: string;
  title: string;
  status: "NORMAL" | "RISK" | "RECOVERED" | "BRANCH";
  signal: string;
  details: string;
}

const trailSteps: TrailStep[] = [
  {
    id: "step_1",
    stage: "01",
    title: "Customer checks out",
    status: "NORMAL",
    signal: "CART_LOCKED • ₹4,999",
    details: "Aryan Sharma proceeds to final payment on Zenith Store. High customer intent score (0.92).",
  },
  {
    id: "step_2",
    stage: "02",
    title: "Payment state fragments",
    status: "RISK",
    signal: "BANK_DEBITED_AWAITING_WEBHOOK • LATENCY_1420MS",
    details: "HDFC bank accounts funds debited, but merchant confirmation callback timed out. Traditional systems log 'Pending'.",
  },
  {
    id: "step_3",
    stage: "03",
    title: "Second intent intercepted",
    status: "RISK",
    signal: "DUPLICATE_BARRIER_ENGAGED • PROXIMITY_97%",
    details: "Uncertain buyer re-attempts checkout. SAFRA activates the duplicate payment barrier to prevent double charges.",
  },
  {
    id: "step_4",
    stage: "04",
    title: "Signal correlation & diagnosis",
    status: "BRANCH",
    signal: "P(RECOVERY) = 81% • CLUSTER_SURGE",
    details: "ML engine analyzes 1,842 similar bank switch timeouts, predicting webhook resolution in 5 minutes.",
  },
  {
    id: "step_5",
    stage: "05",
    title: "Bounded action & auto-reconcile",
    status: "RECOVERED",
    signal: "RECOVERED • ₹4,999 WON BACK",
    details: "SAFRA locks inventory safely and reconciles order state immediately upon webhook delivery without support overhead.",
  },
];

export default function TheFlow() {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(1); // Default on risk stage

  return (
    <section id="flow" className="py-20 sm:py-28 border-b border-line bg-paper">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        {/* Section Label & Statement */}
        <div className="max-w-[800px] mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-bold tracking-widest text-signal uppercase">
              TRANSACTION TRAIL
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-ink leading-tight tracking-tight">
            Money rarely disappears in one event.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ink-soft font-body leading-relaxed max-w-[620px]">
            It leaks across disconnected checkout hops, banking switch latencies, and panic retries. Follow the transaction path below:
          </p>
        </div>

        {/* Structural Pipeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Step Cards */}
          <div className="lg:col-span-7 space-y-3">
            {trailSteps.map((step, idx) => {
              const isSelected = idx === activeStepIndex;
              const isRisk = step.status === "RISK";
              const isRecovered = step.status === "RECOVERED";

              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-5 rounded-sm border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-surface border-signal shadow-sm ring-1 ring-signal"
                      : "bg-surface/50 border-line hover:border-ink-soft"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono font-bold ${isSelected ? "text-signal" : "text-muted"}`}>
                        {step.stage}
                      </span>
                      <h3 className="font-display text-base sm:text-lg font-bold text-ink">
                        {step.title}
                      </h3>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-sm ${
                        isRisk
                          ? "bg-signal/10 text-signal"
                          : isRecovered
                          ? "bg-safe/10 text-safe"
                          : "bg-paper-dark text-ink-soft"
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-ink-soft mb-1.5 font-medium">
                    {step.signal}
                  </p>
                  <p className="text-xs sm:text-sm text-ink-soft font-body leading-relaxed">
                    {step.details}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: Structural Trail Diagram */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-sm bg-surface border border-line space-y-6 sticky top-24">
            <div className="flex items-center justify-between text-xs font-mono pb-3 border-b border-line text-ink-soft">
              <span className="font-bold text-ink uppercase tracking-wider">Topological Pipeline</span>
              <span>Stage {activeStepIndex + 1} of 5</span>
            </div>

            <div className="font-mono text-xs space-y-3">
              {/* Node 1 */}
              <div className="p-3 bg-paper border border-line rounded-sm flex items-center justify-between">
                <span className="font-bold text-ink">CUSTOMER (Aryan Sharma)</span>
                <span className="text-[10px] text-safe font-bold">INITIATED ✓</span>
              </div>
              <div className="flex justify-center">
                <ArrowDown className="w-3.5 h-3.5 text-ink-soft" />
              </div>

              {/* Node 2 */}
              <div className="p-3 bg-paper border border-line rounded-sm flex items-center justify-between">
                <span className="font-bold text-ink">CHECKOUT (Zenith Electronics)</span>
                <span className="text-[10px] text-ink font-bold">₹4,999 RESERVED</span>
              </div>
              <div className="flex justify-center">
                <ArrowDown className="w-3.5 h-3.5 text-ink-soft" />
              </div>

              {/* Node 3 */}
              <div className="p-3 bg-paper border border-line rounded-sm flex items-center justify-between">
                <span className="font-bold text-ink">PAYMENT ATTEMPT (UPI Rail)</span>
                <span className="text-[10px] text-safe font-bold">DEBIT CONFIRMED</span>
              </div>
              <div className="flex justify-center">
                <ArrowDown className="w-3.5 h-3.5 text-signal" />
              </div>

              {/* Node 4 (Branch) */}
              <div className="p-3 bg-surface border border-signal rounded-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-signal">BANK SWITCH DELAY</span>
                  <span className="text-[10px] bg-signal/15 text-signal font-bold px-1.5 py-0.5 rounded-sm">
                    CALLBACK TIMEOUT
                  </span>
                </div>
                <p className="text-[11px] text-ink-soft font-body leading-snug">
                  Customer account debited; webhook response held in bank queue.
                </p>
              </div>
              <div className="flex justify-center">
                <ArrowDown className="w-3.5 h-3.5 text-safe" />
              </div>

              {/* Node 5 (SAFRA Action) */}
              <div className="p-3 bg-paper border border-safe rounded-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-safe">SAFRA BOUNDED ACTION</span>
                  <span className="text-[10px] bg-safe/15 text-safe font-bold px-1.5 py-0.5 rounded-sm">
                    WAIT (0 DUPES)
                  </span>
                </div>
                <p className="text-[11px] text-ink-soft font-body leading-snug">
                  Automatic resolution confirmed upon webhook retry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
