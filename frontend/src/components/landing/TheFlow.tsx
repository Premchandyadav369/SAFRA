"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, ArrowRight, ShieldCheck, IndianRupee, Sparkles, Layers } from "lucide-react";

interface FlowStep {
  step: string;
  title: string;
  subtitle: string;
  eventSnippet: string;
  details: string;
  badge: string;
  badgeColor: string;
}

const flowStages: FlowStep[] = [
  {
    step: "1",
    title: "Customer checks out",
    subtitle: "Cart Locked & Initiated",
    eventSnippet: "₹4,999 • UPI • HDFC Transit",
    details: "Aryan Sharma initiates payment for consumer electronics on Zenith Store. Intent is high.",
    badge: "INITIATED",
    badgeColor: "bg-[#F1F5F9] text-[#0C2340] border-[#CBD5E1]",
  },
  {
    step: "2",
    title: "Payment hesitates",
    subtitle: "Bank response delayed",
    eventSnippet: "Bank Debited ✓ • Callback 504 Timeout",
    details: "Money leaves customer account, but merchant callback times out after 15s. Traditional apps show 'Pending'.",
    badge: "UNCERTAIN",
    badgeColor: "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]",
  },
  {
    step: "3",
    title: "The trail fragments",
    subtitle: "Customer retries checkout",
    eventSnippet: "Second Intent Created • Duplicate Risk 88%",
    details: "Unaware of the bank debit, customer re-opens checkout to repay. Unchecked systems double-charge here.",
    badge: "AT RISK",
    badgeColor: "bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]",
  },
  {
    step: "4",
    title: "SAFRA connects it",
    subtitle: "Graph correlation active",
    eventSnippet: "81% Recovery Probability • Cluster #482",
    details: "SAFRA correlates the bank telemetry and 1,842 cohort transactions, identifying that settlement will complete in 5m.",
    badge: "DIAGNOSED",
    badgeColor: "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]",
  },
  {
    step: "5",
    title: "The right move is made",
    subtitle: "Bounded action executed",
    eventSnippet: "Duplicate Barrier Shown • ₹4,999 Won Back",
    details: "SAFRA displays the Duplicate Barrier, locks the order safely, and auto-confirms upon webhook delivery.",
    badge: "RECOVERED",
    badgeColor: "bg-[#E6F9F4] text-[#008764] border-[#A7F3D0]",
  },
];

export default function TheFlow() {
  const [activeStage, setActiveStage] = useState<number>(0);

  return (
    <section id="flow" className="py-24 px-5 sm:px-8 max-w-[1280px] mx-auto border-t border-[#E2E8F0] bg-[#FFFFFF]">
      {/* Section Header */}
      <div className="max-w-[760px] mb-16">
        <span className="text-xs font-mono font-bold tracking-widest text-[#0C8CE9] uppercase block mb-3">
          01 / THE FLOW
        </span>
        <h2 className="font-heading text-3xl sm:text-5xl font-black text-[#0C2340] leading-[1.1]">
          Money rarely disappears all at once.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#334155] font-medium leading-relaxed">
          It leaks through a sequence of small, fragmented events across checkouts, network rails, and bank switches.
        </p>
      </div>

      {/* 5-Stage Interactive Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 relative">
        {flowStages.map((stage, idx) => {
          const isActive = idx === activeStage;
          const isPassed = idx < activeStage;

          return (
            <div
              key={stage.step}
              onClick={() => setActiveStage(idx)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isActive
                  ? "bg-[#FFFFFF] border-[#0C8CE9] shadow-lg ring-2 ring-[#0C8CE9]/30"
                  : isPassed
                  ? "bg-[#F8FAFC] border-[#CBD5E1]"
                  : "bg-[#FFFFFF] border-[#E2E8F0] hover:border-[#94A3B8]"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-[#0C8CE9]">
                    0{stage.step}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${stage.badgeColor}`}
                  >
                    {stage.badge}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-[#0C2340] leading-snug">
                  {stage.title}
                </h3>
                <p className="text-xs font-mono font-semibold text-[#64748B]">
                  {stage.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] text-xs font-mono text-[#0C2340]">
                <div className="font-bold text-[#0C8CE9] pb-1">{stage.eventSnippet}</div>
                <p className="text-[#334155] text-xs leading-relaxed font-sans">{stage.details}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stepper Controls */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm">
        <div className="text-xs font-mono text-[#0C2340] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0C8CE9]" />
          <span>Stage {activeStage + 1} of 5: <strong>{flowStages[activeStage].title}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveStage((prev) => Math.max(0, prev - 1))}
            disabled={activeStage === 0}
            className="px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-bold text-[#0C2340] disabled:opacity-40 hover:bg-[#F1F5F9] transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={() => setActiveStage((prev) => Math.min(flowStages.length - 1, prev + 1))}
            disabled={activeStage === flowStages.length - 1}
            className="px-5 py-2 rounded-full bg-[#0C8CE9] text-white text-xs font-bold disabled:opacity-40 hover:bg-[#0274C6] transition-colors flex items-center gap-1 shadow-sm"
          >
            <span>Next Stage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
