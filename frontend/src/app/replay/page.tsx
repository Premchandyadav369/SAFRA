"use client";

import React, { useState } from "react";
import {
  History,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck
} from "lucide-react";

interface ReplayStep {
  time: string;
  stage: string;
  title: string;
  description: string;
  realityScore: number;
  pendingCount: number;
  exposureINR: string;
  status: "HEALTHY" | "WARNING" | "CRITICAL" | "MITIGATED";
  nodeHighlight: string;
}

const replayMilestones: ReplayStep[] = [
  {
    time: "14:00:00",
    stage: "STAGE 1",
    title: "Nominal System Baseline",
    description: "All bank switches, payment rails, and merchant webhook endpoints operating under standard SLAs (180ms average latency).",
    realityScore: 97.4,
    pendingCount: 14,
    exposureINR: "₹0.8L",
    status: "HEALTHY",
    nodeHighlight: "All Nodes Green"
  },
  {
    time: "14:12:30",
    stage: "STAGE 2",
    title: "Bank Core Switch Latency Surge",
    description: "HDFC Core Banking Switch latency spikes from 180ms to 1,420ms. Ingestion queue begins accumulating unacknowledged debits.",
    realityScore: 84.1,
    pendingCount: 312,
    exposureINR: "₹8.4L",
    status: "WARNING",
    nodeHighlight: "BANK_HDFC_Bank [WARNING]"
  },
  {
    time: "14:17:15",
    stage: "STAGE 3",
    title: "Pending Volume Explosion",
    description: "1,842 consumer payments enter pending uncertainty. Merchant webhook callback delivery queues experience 504 gateway timeouts.",
    realityScore: 54.2,
    pendingCount: 1842,
    exposureINR: "₹42.7L",
    status: "CRITICAL",
    nodeHighlight: "RAIL_NPCI_UPI + MERCHANT [MISSING EDGES]"
  },
  {
    time: "14:20:00",
    stage: "STAGE 4",
    title: "SAFRA Graph Anomaly Triggered",
    description: "Dynamic graph validation flags high-density missing edges (CONFIRMED_BY missing). Systemic clustering isolates single incident #482.",
    realityScore: 56.0,
    pendingCount: 1842,
    exposureINR: "₹42.7L",
    status: "CRITICAL",
    nodeHighlight: "INCIDENT_CLUSTER #482 Created"
  },
  {
    time: "14:24:45",
    stage: "STAGE 5",
    title: "AI Agent Diagnoses Root Cause",
    description: "Groq Agent traverses graph, compares similar transactions (81% success), and generates counterfactual proof attributing 87% excess to HDFC switch.",
    realityScore: 68.5,
    pendingCount: 1842,
    exposureINR: "₹42.7L",
    status: "WARNING",
    nodeHighlight: "Root Cause: 91% Confidence"
  },
  {
    time: "14:31:00",
    stage: "STAGE 6",
    title: "Human Approval & Playbook Execution",
    description: "Lead Engineer approves 'RETRY_MERCHANT_CALLBACK'. Duplicate Guardian blocks retries. 1,842 transactions resolve cleanly.",
    realityScore: 95.8,
    pendingCount: 28,
    exposureINR: "₹1.2L",
    status: "MITIGATED",
    nodeHighlight: "Incident Mitigated & Stored in Memory"
  }
];

export default function IncidentReplay() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const currentStep = replayMilestones[currentStepIndex];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-mono text-white">Incident Temporal Replay</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-safra-purple/15 text-safra-purple border border-safra-purple/30 font-bold">
              STEP-BY-STEP SCRUBBER
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Replay the evolution of a systemic financial incident from initial latency surge to autonomous recovery.
          </p>
        </div>
      </div>

      {/* Main Scrubber Control Card */}
      <div className="p-6 rounded-3xl border border-surface-border bg-surface-card space-y-6 shadow-2xl">
        {/* Timeline Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Timestamp: <strong className="text-white">{currentStep.time}</strong></span>
            <span>{currentStep.stage} ({currentStepIndex + 1} of {replayMilestones.length})</span>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {replayMilestones.map((m, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-3 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? "bg-safra-cyan shadow-[0_0_12px_#06B6D4]"
                    : idx < currentStepIndex
                    ? "bg-safra-indigo"
                    : "bg-surface-border"
                }`}
                title={`${m.time} - ${m.title}`}
              />
            ))}
          </div>
        </div>

        {/* Step Detail Card */}
        <div className="p-6 rounded-2xl border border-surface-border bg-surface space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-safra-cyan uppercase font-bold tracking-wider">
                {currentStep.stage} • {currentStep.time}
              </span>
              <h2 className="text-xl font-bold font-mono text-white">{currentStep.title}</h2>
            </div>

            <span
              className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                currentStep.status === "HEALTHY"
                  ? "bg-safra-emerald/15 text-safra-emerald border border-safra-emerald/30"
                  : currentStep.status === "WARNING"
                  ? "bg-safra-amber/15 text-safra-amber border border-safra-amber/30"
                  : currentStep.status === "CRITICAL"
                  ? "bg-safra-ruby/15 text-safra-ruby border border-safra-ruby/30"
                  : "bg-safra-cyan/15 text-safra-cyan border border-safra-cyan/30"
              }`}
            >
              {currentStep.status}
            </span>
          </div>

          <p className="text-xs font-mono text-slate-300 leading-relaxed">{currentStep.description}</p>

          {/* Metric Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-surface-border text-xs font-mono">
            <div className="p-3 rounded-xl bg-surface-card border border-surface-border">
              <span className="text-[10px] text-slate-400 block">Reality Score</span>
              <span className="text-white font-bold text-base">{currentStep.realityScore}%</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-card border border-surface-border">
              <span className="text-[10px] text-slate-400 block">Pending Payments</span>
              <span className="text-safra-amber font-bold text-base">{currentStep.pendingCount}</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-card border border-surface-border">
              <span className="text-[10px] text-slate-400 block">Ecosystem Exposure</span>
              <span className="text-safra-ruby font-bold text-base">{currentStep.exposureINR}</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-card border border-surface-border">
              <span className="text-[10px] text-slate-400 block">Graph Topology Focus</span>
              <span className="text-safra-cyan font-bold text-xs truncate block">{currentStep.nodeHighlight}</span>
            </div>
          </div>
        </div>

        {/* Stepper Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 rounded-xl bg-surface border border-surface-border hover:bg-surface-border disabled:opacity-40 text-xs font-mono transition-all flex items-center gap-1.5"
          >
            <SkipBack className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs font-mono text-slate-400">
            Step {currentStepIndex + 1} of {replayMilestones.length}
          </span>

          <button
            onClick={() => setCurrentStepIndex(Math.min(replayMilestones.length - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === replayMilestones.length - 1}
            className="px-4 py-2 rounded-xl bg-safra-cyan text-slate-950 font-bold hover:bg-safra-cyan/90 disabled:opacity-40 text-xs font-mono transition-all flex items-center gap-1.5"
          >
            <span>Next Step</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
