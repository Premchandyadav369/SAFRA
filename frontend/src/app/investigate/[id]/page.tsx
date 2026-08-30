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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/trace"
            className="p-2 rounded-xl bg-surface-card border border-surface-border hover:bg-surface-border text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-mono text-white">
                Agentic Investigation Room
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-safra-cyan/15 text-safra-cyan border border-safra-cyan/30">
                TOOL-CALLING AI
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Autonomous multi-tool graph exploration, telemetry aggregation, and evidence synthesis.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={runInvestigation}
            disabled={isInvestigating}
            className="px-3.5 py-1.5 rounded-xl bg-safra-cyan hover:bg-safra-cyan/90 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isInvestigating ? "animate-spin" : ""}`} />
            <span>{isInvestigating ? "Investigating..." : "Re-Run Investigation"}</span>
          </button>
        </div>
      </div>

      {/* 3-Column Mission Control Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Column 1: Left - Event Timeline & Latency (3 Cols) */}
        <div className="lg:col-span-3 p-5 rounded-2xl border border-surface-border bg-surface-card space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-safra-cyan" />
              <h2 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                Event Chronology
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {payment?.events?.length || 4} Events
            </span>
          </div>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-surface-border">
            {payment?.events && payment.events.length > 0 ? (
              payment.events.map((ev, idx) => (
                <div key={idx} className="relative flex items-start gap-3 pl-1">
                  <div className="w-6 h-6 rounded-full bg-surface border border-safra-cyan/40 flex items-center justify-center text-safra-cyan z-10">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 p-2.5 rounded-xl border border-surface-border bg-surface/60 space-y-1">
                    <div className="text-[11px] font-mono font-bold text-white truncate">
                      {ev.event_type.replace(/_/g, " ")}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                      <span>{ev.source}</span>
                      <span className="text-safra-cyan font-bold">{ev.latency_ms}ms</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 font-mono">Loading events...</div>
            )}

            {/* Missing Step Alert */}
            <div className="relative flex items-start gap-3 pl-1">
              <div className="w-6 h-6 rounded-full bg-surface border border-safra-ruby flex items-center justify-center text-safra-ruby z-10 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 p-2.5 rounded-xl border border-safra-ruby/40 bg-safra-ruby/10 space-y-1">
                <div className="text-[11px] font-mono font-bold text-safra-ruby truncate">
                  MERCHANT CONFIRMATION
                </div>
                <div className="text-[10px] font-mono text-red-300">
                  Missing Callback (504 Timeout)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Center - Interactive Financial Reality Subgraph (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl border border-surface-border bg-surface-card space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-safra-indigo" />
                <h2 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                  Neighborhood Reality Graph
                </h2>
              </div>
              <span className="text-[10px] font-mono text-safra-amber">
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
          <div className="p-5 rounded-2xl border border-surface-border bg-surface-card space-y-3 shadow-xl">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Root-Cause Hypotheses Breakdown
            </span>
            <div className="space-y-2">
              {investigation?.hypotheses?.map((hypo, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-surface-border bg-surface/60 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-white">
                    <span>{hypo.cause}</span>
                    <span className="text-safra-cyan">{(hypo.probability * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono leading-relaxed">{hypo.evidence}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Right - AI Agent Reasoning Stream & Recommendation (4 Cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl border border-surface-border bg-surface-card space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-safra-cyan" />
              <h2 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                Groq Agent Reasoning Log
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-safra-emerald/10 text-safra-emerald border border-safra-emerald/20 font-bold">
              Confidence: {((investigation?.confidence || 0.91) * 100).toFixed(0)}%
            </span>
          </div>

          {/* Tool Execution Steps Stream */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {investigation?.reasoning_steps?.map((step, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl border border-surface-border bg-surface text-xs font-mono space-y-1"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-200">
                  <span className="flex items-center gap-1.5 text-safra-cyan">
                    <Terminal className="w-3 h-3" />
                    <span>{step.title}</span>
                  </span>
                  <span className="text-[9px] text-safra-emerald uppercase">✓ DONE</span>
                </div>
                {step.detail && (
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{step.detail}</p>
                )}
              </div>
            ))}
          </div>

          {/* AI Synthesis Box */}
          <div className="p-4 rounded-xl border border-safra-cyan/30 bg-safra-cyan/5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-safra-cyan">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Agent Synthesis</span>
            </div>
            <p className="text-xs text-slate-200 font-mono leading-relaxed">
              {investigation?.summary || "Analyzing transaction..."}
            </p>
          </div>

          {/* Recommendation & Duplicate Alert */}
          <div className="p-4 rounded-xl border border-safra-ruby/30 bg-safra-ruby/10 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-safra-ruby">
              <ShieldAlert className="w-4 h-4" />
              <span>Guardian Action</span>
            </div>
            <p className="text-xs font-mono font-bold text-white">
              {investigation?.recommendation || "DO NOT PAY AGAIN"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
