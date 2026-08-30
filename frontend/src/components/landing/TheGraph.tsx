"use client";

import React, { useState } from "react";
import {
  User,
  ShoppingBag,
  CreditCard,
  Building,
  RotateCcw,
  Headphones,
  ShieldCheck,
  Info,
  Network
} from "lucide-react";

interface GraphNode {
  id: string;
  label: string;
  type: string;
  status: "NORMAL" | "WARNING" | "RESOLVED" | "POLICY";
  icon: React.ElementType;
  x: number;
  y: number;
  properties: {
    primary: string;
    details: string;
    metrics: string;
  };
}

const nodes: GraphNode[] = [
  {
    id: "node_customer",
    label: "Customer: Aryan Sharma",
    type: "CUSTOMER",
    status: "NORMAL",
    icon: User,
    x: 60,
    y: 80,
    properties: {
      primary: "High-intent repeat buyer",
      details: "4 previous successful purchases on Zenith Store. Low chargeback risk.",
      metrics: "LTV: ₹24,800 • Device Verified",
    },
  },
  {
    id: "node_checkout",
    label: "Zenith Electronics Checkout",
    type: "CHECKOUT",
    status: "NORMAL",
    icon: ShoppingBag,
    x: 280,
    y: 80,
    properties: {
      primary: "Cart Value: ₹4,999",
      details: "Items: Wireless Noise-Cancelling Headphones. Cart held safely in inventory.",
      metrics: "Checkout Time: 10:14:22Z",
    },
  },
  {
    id: "node_payment",
    label: "Payment Attempt: ₹4,999",
    type: "PAYMENT",
    status: "WARNING",
    icon: CreditCard,
    x: 500,
    y: 80,
    properties: {
      primary: "UPI Pending for 4m 32s",
      details: "Debited by bank, webhook callback delayed by merchant endpoint.",
      metrics: "P(Recovery): 81% • Duplicate Risk: 88%",
    },
  },
  {
    id: "node_bank",
    label: "HDFC Core Banking Switch",
    type: "BANK",
    status: "WARNING",
    icon: Building,
    x: 720,
    y: 80,
    properties: {
      primary: "Latency: 1,420ms (Spike)",
      details: "Temporary CBS queuing delay causing delayed delivery receipts.",
      metrics: "Pending Rate: 14.8% (vs 2.1% baseline)",
    },
  },
  {
    id: "node_retry",
    label: "Retry Intercepted",
    type: "RETRY",
    status: "POLICY",
    icon: RotateCcw,
    x: 280,
    y: 240,
    properties: {
      primary: "Duplicate Payment Barrier Active",
      details: "Customer attempt to repay held safely to avoid double-debiting.",
      metrics: "Barrier Confidence: 97.4%",
    },
  },
  {
    id: "node_recovery",
    label: "Recovery Action: Auto-Reconcile",
    type: "RECOVERY_ACTION",
    status: "RESOLVED",
    icon: ShieldCheck,
    x: 500,
    y: 240,
    properties: {
      primary: "Idempotent Webhook Retry",
      details: "Auto-synced with merchant database after 5 minutes.",
      metrics: "Outcome: Verified Recovered ✓",
    },
  },
  {
    id: "node_support",
    label: "Support Backlog: 0 Tickets",
    type: "SUPPORT",
    status: "RESOLVED",
    icon: Headphones,
    x: 720,
    y: 240,
    properties: {
      primary: "Proactive Resolution",
      details: "Customer was not asked to pay again; no refund dispute created.",
      metrics: "Dispute Saved: ₹4,999",
    },
  },
];

export default function TheGraph() {
  const [selectedNode, setSelectedNode] = useState<GraphNode>(nodes[2]); // Default to Payment

  return (
    <section id="graph" className="py-24 px-5 sm:px-8 max-w-[1280px] mx-auto border-t border-[#E2E8F0] bg-[#F8FAFC]">
      {/* Section Header */}
      <div className="max-w-[760px] mb-14">
        <span className="text-xs font-mono font-bold tracking-widest text-[#0C8CE9] uppercase block mb-3">
          04 / THE GRAPH
        </span>
        <h2 className="font-heading text-3xl sm:text-5xl font-black text-[#0C2340] leading-[1.1]">
          One payment is rarely just one payment.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#334155] font-medium leading-relaxed">
          A transaction becomes clearer when you see what happened around it across checkouts, banking switches, retries, and recovery policies.
        </p>
      </div>

      {/* Graph Visual Canvas & Node Property Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Relational Topology Canvas */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
            <span>Click any node to inspect context</span>
            <span className="text-[#0C8CE9] font-bold">7 Connected Nodes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {nodes.map((node) => {
              const Icon = node.icon;
              const isSelected = selectedNode.id === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? "bg-[#FFFFFF] border-[#0C8CE9] shadow-md ring-2 ring-[#0C8CE9]/30"
                      : "bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#FFFFFF] hover:border-[#CBD5E1]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-[#F1F5F9] flex items-center justify-center text-[#0C2340]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${
                        node.status === "WARNING"
                          ? "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]"
                          : node.status === "RESOLVED"
                          ? "bg-[#E6F9F4] text-[#008764] border-[#A7F3D0]"
                          : "bg-[#F1F5F9] text-[#0C2340] border-[#CBD5E1]"
                      }`}
                    >
                      {node.status}
                    </span>
                  </div>

                  <div className="text-xs font-mono font-bold text-[#0C2340] truncate">
                    {node.label}
                  </div>
                  <p className="text-[11px] font-mono text-[#64748B] truncate">
                    {node.properties.primary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Node Context Inspector */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0] text-xs font-mono font-bold text-[#0C2340]">
            <Info className="w-4 h-4 text-[#0C8CE9]" />
            <span>Node Relational Context</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <span className="text-xs font-mono font-bold text-[#64748B] uppercase block">Selected Entity</span>
              <div className="text-sm font-bold font-mono text-[#0C2340]">{selectedNode.label}</div>
              <span className="text-xs font-mono text-[#0C8CE9] font-semibold block">{selectedNode.type}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <span className="text-xs font-mono font-bold text-[#64748B] uppercase block">Primary Insight</span>
              <div className="text-xs font-mono font-semibold text-[#0C2340]">{selectedNode.properties.primary}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <span className="text-xs font-mono font-bold text-[#64748B] uppercase block">Ecosystem Details</span>
              <p className="text-xs text-[#334155] leading-relaxed font-sans font-medium">{selectedNode.properties.details}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <span className="text-xs font-mono font-bold text-[#64748B] uppercase block">Live Metric</span>
              <div className="text-xs font-mono font-bold text-[#008764]">{selectedNode.properties.metrics}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
