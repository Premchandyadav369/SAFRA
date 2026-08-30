"use client";

import React, { useState } from "react";
import { ArrowRight, Info, CheckCircle2 } from "lucide-react";

interface TrailNode {
  id: string;
  name: string;
  category: "CUSTOMER" | "CHECKOUT" | "PAYMENT" | "BANK" | "RETRY" | "ACTION";
  state: "NORMAL" | "RISK" | "RECOVERED" | "STOPPED";
  description: string;
  metadata: string;
}

const trailNodes: TrailNode[] = [
  {
    id: "n_customer",
    name: "CUSTOMER",
    category: "CUSTOMER",
    state: "NORMAL",
    description: "Aryan Sharma (LTV: ₹24,800). 4 previous successful checkouts on Zenith Store.",
    metadata: "Device Authenticated • Zero Chargeback Risk",
  },
  {
    id: "n_checkout",
    name: "CHECKOUT",
    category: "CHECKOUT",
    state: "NORMAL",
    description: "Cart value ₹4,999 locked in inventory. Active session step 3.",
    metadata: "Order Ref #ORD-98214 • Goods Reserved",
  },
  {
    id: "n_payment",
    name: "PAYMENT",
    category: "PAYMENT",
    state: "RISK",
    description: "UPI transit initiated. Debited by issuing bank; pending confirmation callback.",
    metadata: "Rail Latency: 1,420ms • Pending Duration: 4m",
  },
  {
    id: "n_bank",
    name: "HDFC CORE SWITCH",
    category: "BANK",
    state: "RISK",
    description: "Upstream Core Banking System timeout spike across 1,842 concurrent transactions.",
    metadata: "Queue Delay: High • Settlement Expected: 5m",
  },
  {
    id: "n_retry",
    name: "RETRY BARRIER",
    category: "RETRY",
    state: "RISK",
    description: "Customer retry intercepted. Cart held safely to protect from double-charging.",
    metadata: "Duplicate Barrier: Active • Confidence: 97.4%",
  },
  {
    id: "n_action",
    name: "SAFRA RECONCILE",
    category: "ACTION",
    state: "RECOVERED",
    description: "Automated webhook retry reconciles ledger state. ₹4,999 recovered with zero support tickets.",
    metadata: "Outcome: Verified Recovered ✓",
  },
];

export default function TheGraph() {
  const [selectedNode, setSelectedNode] = useState<TrailNode>(trailNodes[2]); // Default on Payment

  return (
    <section id="graph" className="py-20 sm:py-28 border-b border-line bg-paper">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        {/* Section Label & Statement */}
        <div className="max-w-[800px] mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-bold tracking-widest text-signal uppercase">
              04 / THE GRAPH
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-ink leading-tight tracking-tight">
            One payment is rarely just one payment.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ink-soft font-body leading-relaxed max-w-[620px]">
            A transaction becomes clear when you inspect what happened around it across banks, customer retries, and recovery policies.
          </p>
        </div>

        {/* Transaction Trail Canvas & Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Connected Transaction Trail Nodes */}
          <div className="lg:col-span-8 p-6 sm:p-8 bg-surface border border-line rounded-sm space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-ink-soft pb-3 border-b border-line">
              <span className="font-bold text-ink uppercase tracking-wider">Transaction Trail Nodes</span>
              <span>Click node to reveal context</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {trailNodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                const isRisk = node.state === "RISK";
                const isRecovered = node.state === "RECOVERED";

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-sm border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? "bg-paper border-signal shadow-sm ring-1 ring-signal"
                        : "bg-surface border-line hover:border-ink-soft"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`w-2.5 h-2.5 rounded-full inline-block ${
                          isRisk
                            ? "bg-signal"
                            : isRecovered
                            ? "bg-safe"
                            : "bg-ink"
                        }`}
                      />
                      <span className="text-[9px] font-mono text-muted uppercase">
                        {node.category}
                      </span>
                    </div>

                    <div className="font-display font-bold text-sm text-ink truncate">
                      {node.name}
                    </div>
                    <p className="text-[11px] font-mono text-ink-soft truncate font-medium">
                      {node.metadata}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Node Context Panel */}
          <div className="lg:col-span-4 p-6 bg-surface border border-line rounded-sm space-y-4 sticky top-24">
            <div className="flex items-center gap-2 pb-3 border-b border-line text-xs font-mono font-bold text-ink uppercase">
              <Info className="w-4 h-4 text-signal" />
              <span>Node Investigation Details</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 bg-paper border border-line rounded-sm space-y-1">
                <span className="text-[10px] text-muted uppercase block">Entity</span>
                <div className="font-bold text-sm text-ink">{selectedNode.name}</div>
                <span className="text-[10px] text-signal font-semibold">{selectedNode.category}</span>
              </div>

              <div className="p-3.5 bg-paper border border-line rounded-sm space-y-1">
                <span className="text-[10px] text-muted uppercase block">Observation</span>
                <p className="text-xs text-ink font-body leading-relaxed">{selectedNode.description}</p>
              </div>

              <div className="p-3.5 bg-paper border border-line rounded-sm space-y-1">
                <span className="text-[10px] text-muted uppercase block">Signal Telemetry</span>
                <div className="text-xs font-bold text-safe">{selectedNode.metadata}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
