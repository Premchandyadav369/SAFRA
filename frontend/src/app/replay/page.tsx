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
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

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
    description: "SAFRA Agent traverses graph, compares similar transactions (81% success), and generates counterfactual proof attributing 87% excess to HDFC switch.",
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
    <div className="min-h-screen bg-paper text-ink font-body antialiased">
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-6 sm:px-10 py-12 sm:py-16 space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-display tracking-tight text-ink">
                Incident Temporal Replay
              </h1>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-sm bg-signal/15 text-signal border border-signal/30 font-bold">
                STEP-BY-STEP SCRUBBER
              </span>
            </div>
            <p className="text-xs text-ink-soft font-mono mt-1">
              Replay the evolution of a systemic financial incident from initial latency surge to autonomous recovery.
            </p>
          </div>
        </div>

        {/* Main Scrubber Control Card */}
        <div className="p-6 sm:p-8 rounded-sm border border-line bg-surface space-y-6 shadow-sm">
          {/* Timeline Progress Bar */}
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-ink-soft">
              <span>Timestamp: <strong className="text-ink">{currentStep.time}</strong></span>
              <span>{currentStep.stage} ({currentStepIndex + 1} of {replayMilestones.length})</span>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {replayMilestones.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`h-2.5 rounded-none transition-all ${
                    idx === currentStepIndex
                      ? "bg-signal shadow-sm"
                      : idx < currentStepIndex
                      ? "bg-ink"
                      : "bg-paper-dark"
                  }`}
                  title={`${m.time}: ${m.title}`}
                />
              ))}
            </div>
          </div>

          {/* Step Detail Card */}
          <div className="p-6 rounded-sm border border-line bg-paper space-y-4 font-mono">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-signal uppercase font-bold tracking-wider">
                  {currentStep.stage} • {currentStep.time}
                </span>
                <h2 className="text-xl font-bold font-display text-ink">{currentStep.title}</h2>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-sm ${
                  currentStep.status === "HEALTHY"
                    ? "bg-safe/15 text-safe"
                    : currentStep.status === "WARNING"
                    ? "bg-warning/15 text-warning"
                    : currentStep.status === "CRITICAL"
                    ? "bg-danger/15 text-danger"
                    : "bg-signal/15 text-signal"
                }`}
              >
                {currentStep.status}
              </span>
            </div>

            <p className="text-xs text-ink-soft leading-relaxed font-body">{currentStep.description}</p>

            {/* Metric Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-line text-xs">
              <div className="p-3 rounded-sm bg-surface border border-line">
                <span className="text-[10px] text-muted uppercase block">Reality Score</span>
                <span className="text-ink font-bold text-base">{currentStep.realityScore}%</span>
              </div>

              <div className="p-3 rounded-sm bg-surface border border-line">
                <span className="text-[10px] text-muted uppercase block">Pending Payments</span>
                <span className="text-warning font-bold text-base">{currentStep.pendingCount}</span>
              </div>

              <div className="p-3 rounded-sm bg-surface border border-line">
                <span className="text-[10px] text-muted uppercase block">Ecosystem Exposure</span>
                <span className="text-danger font-bold text-base">{currentStep.exposureINR}</span>
              </div>

              <div className="p-3 rounded-sm bg-surface border border-line">
                <span className="text-[10px] text-muted uppercase block">Graph Topology Focus</span>
                <span className="text-signal font-bold text-xs truncate block">{currentStep.nodeHighlight}</span>
              </div>
            </div>
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className="px-4 py-2.5 rounded-sm bg-paper border border-line hover:bg-paper-dark disabled:opacity-40 text-xs font-mono transition-all flex items-center gap-1.5"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span>Previous Step</span>
            </button>

            <span className="text-xs font-mono text-ink-soft">
              Step {currentStepIndex + 1} of {replayMilestones.length}
            </span>

            <button
              onClick={() => setCurrentStepIndex(Math.min(replayMilestones.length - 1, currentStepIndex + 1))}
              disabled={currentStepIndex === replayMilestones.length - 1}
              className="px-5 py-2.5 rounded-sm bg-ink text-paper font-display text-xs font-bold uppercase hover:bg-ink-soft disabled:opacity-40 transition-all flex items-center gap-1.5"
            >
              <span>Next Step</span>
              <SkipForward className="w-3.5 h-3.5 text-signal" />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
