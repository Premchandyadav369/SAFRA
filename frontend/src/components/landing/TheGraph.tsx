"use client";

import React, { useState } from "react";
import {
  User,
  Store,
  ShoppingBag,
  CreditCard,
  Building,
  Layers,
  Cpu,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Info,
  ArrowRight,
  Zap,
  Activity,
  Maximize2
} from "lucide-react";

interface NetworkNode {
  id: string;
  name: string;
  type: string;
  category: "CUSTOMER" | "MERCHANT" | "CHECKOUT" | "PAYMENT" | "RAIL" | "BANK" | "GATEWAY" | "BARRIER" | "SAFRA" | "SETTLEMENT";
  state: "NORMAL" | "RISK" | "RECOVERED" | "INTERCEPTED";
  icon: React.ElementType;
  x: number;
  y: number;
  properties: {
    primary: string;
    details: string;
    metrics: string;
    causal_weight?: string;
  };
}

interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  relationship: string;
  latency_ms: number;
  status: "NORMAL" | "RISK" | "RECOVERED" | "INTERCEPTED";
}

const networkNodes: NetworkNode[] = [
  {
    id: "n_cust",
    name: "CUSTOMER (Aryan Sharma)",
    type: "CUSTOMER",
    category: "CUSTOMER",
    state: "NORMAL",
    icon: User,
    x: 40,
    y: 80,
    properties: {
      primary: "Authenticated Buyer",
      details: "4 previous successful purchases on Zenith Store. Low chargeback risk (0.01%).",
      metrics: "LTV: ₹24,800 • High Intent Score (0.92)",
      causal_weight: "0.80 Loyalty Weight"
    }
  },
  {
    id: "n_merch",
    name: "MERCHANT (Zenith Store)",
    type: "MERCHANT",
    category: "MERCHANT",
    state: "NORMAL",
    icon: Store,
    x: 40,
    y: 260,
    properties: {
      primary: "Merchant Inventory Node",
      details: "Goods reserved in cart; order awaiting payment confirmation receipt.",
      metrics: "Reconciliation Health: 98.4% • Settlement T+1",
      causal_weight: "Cart Locked 10m"
    }
  },
  {
    id: "n_checkout",
    name: "CHECKOUT SESSION",
    type: "CHECKOUT",
    category: "CHECKOUT",
    state: "NORMAL",
    icon: ShoppingBag,
    x: 280,
    y: 170,
    properties: {
      primary: "Cart Value: ₹4,999",
      details: "Wireless Headphones reserved. Customer completed OTP input step.",
      metrics: "Session ID: #ORD-98214 • Device Fingerprint Match",
      causal_weight: "High Purchase Intent"
    }
  },
  {
    id: "n_pay",
    name: "PAYMENT ATTEMPT (UPI)",
    type: "PAYMENT",
    category: "PAYMENT",
    state: "RISK",
    icon: CreditCard,
    x: 520,
    y: 170,
    properties: {
      primary: "Payment State: PENDING",
      details: "Account debited by issuing bank; merchant callback awaiting arrival.",
      metrics: "P(Recovery): 81% • Transaction Ref: #PAY-4999-HERO",
      causal_weight: "Elevated Risk Horizon"
    }
  },
  {
    id: "n_rail",
    name: "NPCI UPI RAIL",
    type: "PAYMENT_RAIL",
    category: "RAIL",
    state: "NORMAL",
    icon: Layers,
    x: 740,
    y: 90,
    properties: {
      primary: "Payment Network Transit",
      details: "Debit acknowledgment successfully generated and routed.",
      metrics: "Ack Received ✓ • Transit Latency: 120ms",
      causal_weight: "Debit Confirmed on Rail"
    }
  },
  {
    id: "n_bank",
    name: "HDFC CORE SWITCH",
    type: "BANK",
    category: "BANK",
    state: "RISK",
    icon: Building,
    x: 740,
    y: 250,
    properties: {
      primary: "Core Banking System (CBS)",
      details: "Temporary CBS switch queuing delay causing callback webhook timeout.",
      metrics: "Latency: 1,420ms (Spike) • 1,842 Concurrent Txns",
      causal_weight: "87% Causal Attribution"
    }
  },
  {
    id: "n_gw",
    name: "GATEWAY WEBHOOK",
    type: "GATEWAY",
    category: "GATEWAY",
    state: "RISK",
    icon: Cpu,
    x: 960,
    y: 170,
    properties: {
      primary: "Webhook Ingestion Point",
      details: "504 Gateway response on initial attempt; exponential retry active.",
      metrics: "Retry Backoff: 30s / 120s / 300s",
      causal_weight: "Resolution in 4-6 mins"
    }
  },
  {
    id: "n_barrier",
    name: "DUPLICATE BARRIER",
    type: "RETRY_BARRIER",
    category: "BARRIER",
    state: "INTERCEPTED",
    icon: RotateCcw,
    x: 280,
    y: 340,
    properties: {
      primary: "Duplicate Payment Guardian",
      details: "Buyer attempt to re-purchase held safely to eliminate double charging.",
      metrics: "Collision Proximity: 97.4% • Protected: ₹4,999",
      causal_weight: "100% Barrier Guard"
    }
  },
  {
    id: "n_safra",
    name: "SAFRA ACTION: WAIT",
    type: "SAFRA_AGENT",
    category: "SAFRA",
    state: "RECOVERED",
    icon: ShieldCheck,
    x: 1180,
    y: 170,
    properties: {
      primary: "Autonomous Bounded Action",
      details: "Policy Rule 04 matched: Prohibit customer repayment when bank debited.",
      metrics: "Action: WAIT (5 mins) • Net Yield: ₹4,999 Won Back",
      causal_weight: "Zero Duplicate Debits"
    }
  },
  {
    id: "n_settle",
    name: "SETTLEMENT LEDGER",
    type: "SETTLEMENT",
    category: "SETTLEMENT",
    state: "RECOVERED",
    icon: CheckCircle2,
    x: 1180,
    y: 340,
    properties: {
      primary: "Reconciliation Ledger",
      details: "Order marked paid and reconciled in merchant financial books.",
      metrics: "T+1 Payout Scheduled • Zero Dispute Tickets",
      causal_weight: "Ledger Consistency 100%"
    }
  }
];

const networkEdges: NetworkEdge[] = [
  { id: "e1", source: "n_cust", target: "n_checkout", label: "Initiates Cart", relationship: "INITIATES", latency_ms: 42, status: "NORMAL" },
  { id: "e2", source: "n_merch", target: "n_checkout", label: "Locks Inventory", relationship: "RESERVES", latency_ms: 15, status: "NORMAL" },
  { id: "e3", source: "n_checkout", target: "n_pay", label: "Submits UPI", relationship: "ATTEMPTS", latency_ms: 85, status: "NORMAL" },
  { id: "e4", source: "n_pay", target: "n_rail", label: "Rail Transit", relationship: "ROUTES", latency_ms: 120, status: "NORMAL" },
  { id: "e5", source: "n_rail", target: "n_bank", label: "Account Debit", relationship: "DEBITS", latency_ms: 280, status: "NORMAL" },
  { id: "e6", source: "n_bank", target: "n_gw", label: "Callback Timeout", relationship: "DELAYED", latency_ms: 1420, status: "RISK" },
  { id: "e7", source: "n_cust", target: "n_barrier", label: "Panic Retry", relationship: "INTERCEPTED", latency_ms: 10, status: "INTERCEPTED" },
  { id: "e8", source: "n_gw", target: "n_safra", label: "Policy Governed", relationship: "GOVERNS", latency_ms: 5, status: "RECOVERED" },
  { id: "e9", source: "n_safra", target: "n_settle", label: "Auto Reconciles", relationship: "RECONCILES", latency_ms: 12, status: "RECOVERED" }
];

export default function TheGraph() {
  const [selectedNode, setSelectedNode] = useState<NetworkNode>(networkNodes[3]); // Default on Payment Attempt
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [activeSimulationMode, setActiveSimulationMode] = useState<"DEFAULT" | "TRACE_RISK" | "BARRIER_ACTIVE" | "RECONCILED">("DEFAULT");

  const filteredNodes = networkNodes.filter((node) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "CUSTOMER" && (node.category === "CUSTOMER" || node.category === "CHECKOUT")) return true;
    if (activeFilter === "BANK" && (node.category === "BANK" || node.category === "RAIL")) return true;
    if (activeFilter === "PAYMENT" && node.category === "PAYMENT") return true;
    if (activeFilter === "BARRIER" && node.category === "BARRIER") return true;
    if (activeFilter === "SAFRA" && (node.category === "SAFRA" || node.category === "SETTLEMENT")) return true;
    return false;
  });

  return (
    <section id="graph" className="py-20 sm:py-28 border-b border-line bg-paper">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        {/* Section Label & Statement */}
        <div className="max-w-[840px] mb-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-bold tracking-widest text-signal uppercase">
              RELATIONAL TOPOLOGY GRAPH
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-ink leading-tight tracking-tight">
            One payment is never just one payment.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ink-soft font-body leading-relaxed max-w-[660px]">
            SAFRA maps the complete multi-hop financial graph across customers, checkouts, payment rails, banking switches, duplicate barriers, and settlement ledgers.
          </p>
        </div>

        {/* Interactive Topology Controls Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-line">
          {/* Node Category Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-muted uppercase text-[10px] mr-2">Filter Entities:</span>
            {["ALL", "CUSTOMER", "BANK", "PAYMENT", "BARRIER", "SAFRA"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-sm border transition-all ${
                  activeFilter === f
                    ? "bg-ink text-paper border-ink font-bold"
                    : "bg-surface border-line text-ink-soft hover:border-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Interactive Simulation Modes */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-muted uppercase text-[10px] mr-1">Simulation Triggers:</span>
            <button
              onClick={() => setActiveSimulationMode(activeSimulationMode === "TRACE_RISK" ? "DEFAULT" : "TRACE_RISK")}
              className={`px-3 py-1.5 rounded-sm border transition-all flex items-center gap-1.5 ${
                activeSimulationMode === "TRACE_RISK"
                  ? "bg-signal text-paper border-signal font-bold"
                  : "bg-surface border-line text-ink hover:border-signal"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Trace Risk Path</span>
            </button>

            <button
              onClick={() => setActiveSimulationMode(activeSimulationMode === "BARRIER_ACTIVE" ? "DEFAULT" : "BARRIER_ACTIVE")}
              className={`px-3 py-1.5 rounded-sm border transition-all flex items-center gap-1.5 ${
                activeSimulationMode === "BARRIER_ACTIVE"
                  ? "bg-signal-dark text-paper border-signal-dark font-bold"
                  : "bg-surface border-line text-ink hover:border-signal-dark"
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Engage Barrier</span>
            </button>

            <button
              onClick={() => setActiveSimulationMode(activeSimulationMode === "RECONCILED" ? "DEFAULT" : "RECONCILED")}
              className={`px-3 py-1.5 rounded-sm border transition-all flex items-center gap-1.5 ${
                activeSimulationMode === "RECONCILED"
                  ? "bg-safe text-paper border-safe font-bold"
                  : "bg-surface border-line text-ink hover:border-safe"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Auto Reconcile</span>
            </button>
          </div>
        </div>

        {/* Relational Graph Canvas & Live Property Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Network Graph Canvas */}
          <div className="lg:col-span-8 p-6 sm:p-8 bg-surface border border-line rounded-sm space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-ink-soft pb-3 border-b border-line">
              <div className="flex items-center gap-4">
                <span className="font-bold text-ink uppercase tracking-wider">
                  Relational Financial Graph (10 Connected Nodes)
                </span>
                {activeSimulationMode !== "DEFAULT" && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-signal/15 text-signal">
                    MODE: {activeSimulationMode}
                  </span>
                )}
              </div>
              <span>Click any node to inspect properties</span>
            </div>

            {/* Visual Node Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {filteredNodes.map((node) => {
                const Icon = node.icon;
                const isSelected = selectedNode.id === node.id;
                const isRiskNode = node.state === "RISK" || activeSimulationMode === "TRACE_RISK" && (node.category === "PAYMENT" || node.category === "BANK" || node.category === "GATEWAY");
                const isRecoveredNode = node.state === "RECOVERED" || activeSimulationMode === "RECONCILED" && (node.category === "SAFRA" || node.category === "SETTLEMENT");
                const isBarrierNode = node.category === "BARRIER" && activeSimulationMode === "BARRIER_ACTIVE";

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-sm border transition-all cursor-pointer space-y-2 relative ${
                      isSelected
                        ? "bg-paper border-signal ring-1 ring-signal shadow-sm"
                        : isRiskNode
                        ? "bg-surface border-signal/60 hover:border-signal"
                        : isRecoveredNode
                        ? "bg-surface border-safe/60 hover:border-safe"
                        : isBarrierNode
                        ? "bg-surface border-signal-dark hover:border-signal-dark"
                        : "bg-surface border-line hover:border-ink-soft"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-sm ${isRiskNode ? "bg-signal/15 text-signal" : isRecoveredNode ? "bg-safe/15 text-safe" : "bg-paper-dark text-ink"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono uppercase font-bold text-muted">
                          {node.category}
                        </span>
                      </div>

                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm ${
                          isRiskNode
                            ? "bg-signal/15 text-signal"
                            : isRecoveredNode
                            ? "bg-safe/15 text-safe"
                            : isBarrierNode
                            ? "bg-signal-dark/15 text-signal-dark"
                            : "bg-paper-dark text-ink-soft"
                        }`}
                      >
                        {node.state}
                      </span>
                    </div>

                    <div className="font-display font-bold text-sm text-ink truncate pt-1">
                      {node.name}
                    </div>
                    <p className="text-[11px] font-mono text-ink-soft truncate font-medium">
                      {node.properties.primary}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Edge Relational Stream (Live Latency & Relationship status) */}
            <div className="pt-4 border-t border-line space-y-2">
              <div className="text-[10px] font-mono uppercase font-bold text-muted tracking-wider">
                Active Edge Relationships & Hop Latency
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 font-mono text-[11px]">
                {networkEdges.slice(0, 6).map((edge) => (
                  <div
                    key={edge.id}
                    className="p-2.5 bg-paper/60 border border-line rounded-sm flex items-center justify-between"
                  >
                    <div className="truncate">
                      <span className="font-bold text-ink">{edge.label}</span>
                      <span className="text-muted block text-[10px]">{edge.relationship}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm shrink-0 ${
                        edge.latency_ms > 500
                          ? "bg-signal/15 text-signal"
                          : "bg-safe/15 text-safe"
                      }`}
                    >
                      {edge.latency_ms}ms
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Live Property & Telemetry Inspector */}
          <div className="lg:col-span-4 p-6 bg-surface border border-line rounded-sm space-y-4 sticky top-24">
            <div className="flex items-center gap-2 pb-3 border-b border-line text-xs font-mono font-bold text-ink uppercase">
              <Info className="w-4 h-4 text-signal" />
              <span>Entity Property Inspector</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 bg-paper border border-line rounded-sm space-y-1">
                <span className="text-[10px] text-muted uppercase block font-semibold">Entity Node</span>
                <div className="font-bold text-sm text-ink">{selectedNode.name}</div>
                <span className="text-[10px] text-signal font-semibold uppercase">{selectedNode.type}</span>
              </div>

              <div className="p-3.5 bg-paper border border-line rounded-sm space-y-1">
                <span className="text-[10px] text-muted uppercase block font-semibold">Primary Observation</span>
                <div className="text-xs font-bold text-ink">{selectedNode.properties.primary}</div>
                <p className="text-xs text-ink-soft font-body leading-relaxed pt-1">
                  {selectedNode.properties.details}
                </p>
              </div>

              <div className="p-3.5 bg-paper border border-line rounded-sm space-y-1">
                <span className="text-[10px] text-muted uppercase block font-semibold">Telemetry Metrics</span>
                <div className="text-xs font-bold text-safe">{selectedNode.properties.metrics}</div>
              </div>

              {selectedNode.properties.causal_weight && (
                <div className="p-3.5 bg-paper border border-line rounded-sm space-y-1">
                  <span className="text-[10px] text-muted uppercase block font-semibold">Causal Attribution</span>
                  <div className="text-xs font-bold text-signal">{selectedNode.properties.causal_weight}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
