"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  User,
  CreditCard,
  Building,
  Cpu,
  Store,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Flame,
  HelpCircle
} from "lucide-react";

const nodeIcons: Record<string, React.ElementType> = {
  CUSTOMER: User,
  PAYMENT: CreditCard,
  BANK: Building,
  PAYMENT_RAIL: Layers,
  GATEWAY: Cpu,
  MERCHANT: Store,
  SETTLEMENT: CheckCircle2,
  INCIDENT: Flame,
};

const nodeBorderColors: Record<string, string> = {
  CUSTOMER: "border-slate-600 bg-slate-900/90 text-slate-300",
  PAYMENT: "border-safra-cyan/60 bg-safra-cyan/10 text-cyan-200",
  BANK: "border-safra-indigo/60 bg-safra-indigo/10 text-indigo-200",
  PAYMENT_RAIL: "border-safra-purple/60 bg-safra-purple/10 text-purple-200",
  GATEWAY: "border-slate-500 bg-slate-900/90 text-slate-200",
  MERCHANT: "border-safra-emerald/60 bg-safra-emerald/10 text-emerald-200",
  SETTLEMENT: "border-safra-emerald/60 bg-safra-emerald/10 text-emerald-300",
  INCIDENT: "border-safra-ruby bg-safra-ruby/15 text-red-200 animate-pulse",
};

export const CustomSafraNode = memo(({ data }: { data: any }) => {
  const { label, nodeType, status, isFocal, realityScore, amount, health } = data;
  const Icon = nodeIcons[nodeType] || HelpCircle;
  const styleClass = nodeBorderColors[nodeType] || "border-slate-700 bg-slate-900 text-slate-300";

  const isWarning = status === "WARNING" || health === "WARNING" || status === "PENDING";
  const isCritical = status === "CRITICAL" || health === "CRITICAL" || status === "FAILED";

  return (
    <div
      className={`px-3.5 py-2.5 rounded-xl border-2 shadow-xl backdrop-blur-md min-w-[190px] transition-all relative ${styleClass} ${
        isFocal ? "ring-2 ring-safra-cyan ring-offset-2 ring-offset-background scale-105" : ""
      }`}
    >
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-safra-cyan" />

      {/* Top row: Type and Status */}
      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-white/10 mb-2">
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider">
          <Icon className="w-3.5 h-3.5" />
          <span>{nodeType.replace("_", " ")}</span>
        </div>

        {realityScore !== undefined && realityScore !== null && (
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 border border-white/10">
            {realityScore.toFixed(0)}%
          </span>
        )}
      </div>

      {/* Main label */}
      <div className="text-xs font-semibold font-mono text-white tracking-wide truncate">
        {label}
      </div>

      {/* Amount or status tag */}
      <div className="mt-1.5 flex items-center justify-between text-[11px]">
        {amount ? (
          <span className="font-mono text-safra-cyan font-bold">₹{amount.toLocaleString("en-IN")}</span>
        ) : (
          <span className="text-[10px] text-slate-400 font-mono">{health || "ONLINE"}</span>
        )}

        <span
          className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
            isCritical
              ? "bg-safra-ruby/20 text-safra-ruby border border-safra-ruby/40"
              : isWarning
              ? "bg-safra-amber/20 text-safra-amber border border-safra-amber/40"
              : "bg-safra-emerald/20 text-safra-emerald border border-safra-emerald/40"
          }`}
        >
          {status}
        </span>
      </div>

      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-safra-cyan" />
    </div>
  );
});

CustomSafraNode.displayName = "CustomSafraNode";
