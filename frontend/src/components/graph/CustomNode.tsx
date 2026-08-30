"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  User,
  Store,
  CreditCard,
  Building,
  Layers,
  Cpu,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  HelpCircle
} from "lucide-react";

const nodeIcons: Record<string, React.ElementType> = {
  CUSTOMER: User,
  MERCHANT: Store,
  CHECKOUT: Store,
  PAYMENT: CreditCard,
  PAYMENT_ATTEMPT: CreditCard,
  BANK: Building,
  PAYMENT_RAIL: Layers,
  GATEWAY: Cpu,
  RETRY_BARRIER: RotateCcw,
  RETRY: RotateCcw,
  SETTLEMENT: CheckCircle2,
  SAFRA_AGENT: ShieldCheck,
  INCIDENT: HelpCircle,
};

export const CustomSafraNode = memo(({ data }: { data: any }) => {
  const { label, nodeType, status, isFocal, realityScore, amount, health, latency_ms } = data;
  const Icon = nodeIcons[nodeType] || HelpCircle;

  const isRisk = status === "RISK" || status === "CRITICAL" || status === "FAILED" || status === "PENDING";
  const isRecovered = status === "RECOVERED" || status === "RESOLVED" || status === "COMPLETED";

  return (
    <div
      className={`px-4 py-3 rounded-sm border shadow-sm min-w-[200px] transition-all relative ${
        isRisk
          ? "bg-surface border-signal text-ink"
          : isRecovered
          ? "bg-surface border-safe text-ink"
          : "bg-surface border-line text-ink"
      } ${isFocal ? "ring-2 ring-signal ring-offset-2 ring-offset-paper scale-105" : ""}`}
    >
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-ink !border-paper" />

      {/* Top Header: Category & Score */}
      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-line mb-2">
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-muted">
          <Icon className={`w-3.5 h-3.5 ${isRisk ? "text-signal" : isRecovered ? "text-safe" : "text-ink"}`} />
          <span>{(nodeType || "ENTITY").replace("_", " ")}</span>
        </div>

        {realityScore !== undefined && realityScore !== null && (
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-paper border border-line font-bold text-ink">
            {realityScore.toFixed(0)}%
          </span>
        )}
      </div>

      {/* Main Label */}
      <div className="text-xs font-display font-bold text-ink truncate tracking-tight">
        {label}
      </div>

      {/* Footer info: Amount / Latency / Status */}
      <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
        {amount ? (
          <span className="font-bold text-ink">₹{amount.toLocaleString("en-IN")}</span>
        ) : latency_ms ? (
          <span className="text-ink-soft">{latency_ms}ms</span>
        ) : (
          <span className="text-muted">{health || "ONLINE"}</span>
        )}

        <span
          className={`px-1.5 py-0.5 rounded-sm font-bold uppercase ${
            isRisk
              ? "bg-signal/15 text-signal"
              : isRecovered
              ? "bg-safe/15 text-safe"
              : "bg-paper-dark text-ink-soft"
          }`}
        >
          {status}
        </span>
      </div>

      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-ink !border-paper" />
    </div>
  );
});

CustomSafraNode.displayName = "CustomSafraNode";
