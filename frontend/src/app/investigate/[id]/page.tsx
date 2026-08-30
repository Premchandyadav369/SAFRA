"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  BrainCircuit,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  Search,
  Bot,
  Terminal,
  Share2,
  RefreshCw
} from "lucide-react";
import { SafraAPI, InvestigationData, PaymentItem } from "@/lib/api";
import RealityGraphCanvas from "@/components/graph/RealityGraphCanvas";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function InvestigationRoom() {
  const params = useParams();
  const paymentId = (params?.id as string) || "PAY-4999-HERO";

  const [payment, setPayment] = useState<PaymentItem | null>(null);
  const [investigation, setInvestigation] = useState<InvestigationData | null>(null);
  const [graphData, setGraphData] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
  const [isInvestigating, setIsInvestigating] = useState(false);

  const runInvestigation = async () => {
    try {
      setIsInvestigating(true);
      const [payRes, invRes, graphRes] = await Promise.all([
        SafraAPI.getPaymentById(paymentId),
        SafraAPI.runInvestigation(paymentId),
        SafraAPI.getPaymentGraph(paymentId),
      ]);
      setPayment(payRes);
      setInvestigation(invRes);
      setGraphData({ nodes: graphRes.nodes, edges: graphRes.edges });
    } catch (e) {
      console.error("Investigation failed", e);
    } finally {
      setIsInvestigating(false);
    }
  };

  useEffect(() => {
    runInvestigation();
  }, [paymentId]);

  return (
    <div className="min-h-screen bg-paper text-ink font-body antialiased">
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-6 sm:px-10 py-12 sm:py-16 space-y-12">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/trace"
              className="p-2.5 rounded-sm bg-surface border border-line hover:border-signal text-ink transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold font-display tracking-tight text-ink">
                  Agentic Investigation Room
                </h1>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-sm bg-signal/15 text-signal border border-signal/30 font-bold">
                  TOOL-CALLING AI
                </span>
              </div>
              <p className="text-xs text-ink-soft font-mono mt-1">
                Autonomous multi-tool graph exploration, telemetry aggregation, and evidence synthesis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={runInvestigation}
              disabled={isInvestigating}
              className="px-4 py-2.5 rounded-sm bg-ink hover:bg-ink-soft text-paper font-display text-xs font-bold uppercase transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-signal ${isInvestigating ? "animate-spin" : ""}`} />
              <span>{isInvestigating ? "Investigating..." : "Re-Run Investigation"}</span>
            </button>
          </div>
        </div>

        {/* 3-Column Mission Control Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: Left - Event Timeline & Latency */}
          <div className="lg:col-span-3 p-6 rounded-sm border border-line bg-surface space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-signal" />
                <h2 className="text-xs font-bold font-mono text-ink uppercase tracking-wider">
                  Event Chronology
                </h2>
              </div>
              <span className="text-[10px] font-mono text-muted">
                {payment?.events?.length || 4} Events
              </span>
            </div>

            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-line">
              {payment?.events && payment.events.length > 0 ? (
                payment.events.map((ev, idx) => (
                  <div key={idx} className="relative flex items-start gap-3 pl-1">
                    <div className="w-6 h-6 rounded-full bg-paper border border-safe flex items-center justify-center text-safe z-10">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 p-2.5 rounded-sm border border-line bg-paper space-y-1">
                      <div className="text-[11px] font-mono font-bold text-ink truncate">
                        {ev.event_type.replace(/_/g, " ")}
                      </div>
                      <div className="text-[10px] font-mono text-ink-soft flex items-center justify-between">
                        <span>{ev.source}</span>
                        <span className="text-safe font-bold">{ev.latency_ms}ms</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-ink-soft font-mono">Loading events...</div>
              )}

              {/* Missing Step Alert */}
              <div className="relative flex items-start gap-3 pl-1">
                <div className="w-6 h-6 rounded-full bg-paper border border-danger flex items-center justify-center text-danger z-10 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 p-2.5 rounded-sm border border-danger/40 bg-danger/10 space-y-1">
                  <div className="text-[11px] font-mono font-bold text-danger truncate">
                    MERCHANT CONFIRMATION
                  </div>
                  <div className="text-[10px] font-mono text-danger">
                    Missing Callback (504 Timeout)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Center - Interactive Financial Reality Subgraph */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-sm border border-line bg-surface space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-signal" />
                  <h2 className="text-xs font-bold font-mono text-ink uppercase tracking-wider">
                    Neighborhood Reality Graph
                  </h2>
                </div>
                <span className="text-xs font-mono text-warning font-bold">
                  Reality Score: {investigation?.reality_validation?.reality_score || 72.5}%
                </span>
              </div>

              <RealityGraphCanvas
                nodes={graphData.nodes}
                edges={graphData.edges}
                height="420px"
              />
            </div>

            {/* Root Cause Hypotheses Box */}
            <div className="p-6 rounded-sm border border-line bg-surface space-y-4 shadow-sm">
              <span className="text-xs font-mono text-muted uppercase tracking-wider block font-semibold">
                Root-Cause Hypotheses Breakdown
              </span>
              <div className="space-y-2.5">
                {investigation?.hypotheses?.map((hypo, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-sm border border-line bg-paper space-y-1 font-mono"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-ink">
                      <span>{hypo.cause}</span>
                      <span className="text-signal">{(hypo.probability * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-[11px] text-ink-soft leading-relaxed">{hypo.evidence}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Right - AI Agent Reasoning Stream & Recommendation */}
          <div className="lg:col-span-4 p-6 rounded-sm border border-line bg-surface space-y-5 shadow-sm font-mono text-xs">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-signal" />
                <h2 className="text-xs font-bold text-ink uppercase tracking-wider">
                  SAFRA Agent Reasoning Log
                </h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-sm bg-safe/15 text-safe font-bold">
                Confidence: {((investigation?.confidence || 0.91) * 100).toFixed(0)}%
              </span>
            </div>

            {/* Tool Execution Steps Stream */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {investigation?.reasoning_steps?.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-sm border border-line bg-paper space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-ink">
                    <span className="flex items-center gap-1.5 text-signal">
                      <Terminal className="w-3 h-3" />
                      <span>{step.title}</span>
                    </span>
                    <span className="text-[9px] text-safe uppercase">✓ DONE</span>
                  </div>
                  {step.detail && (
                    <p className="text-[10px] text-ink-soft leading-relaxed font-body">{step.detail}</p>
                  )}
                </div>
              ))}
            </div>

            {/* AI Synthesis Box */}
            <div className="p-4 rounded-sm border border-signal/40 bg-surface space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-signal">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Agent Synthesis</span>
              </div>
              <p className="text-xs text-ink leading-relaxed">
                {investigation?.summary || "Analyzing transaction..."}
              </p>
            </div>

            {/* Recommendation & Duplicate Alert */}
            <div className="p-4 rounded-sm border border-danger/40 bg-danger/10 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-danger">
                <ShieldAlert className="w-4 h-4" />
                <span>Guardian Action</span>
              </div>
              <p className="text-xs font-bold text-danger">
                {investigation?.recommendation || "DO NOT PAY AGAIN"}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
