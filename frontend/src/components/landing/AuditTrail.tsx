"use client";

import React from "react";
import { Clock, ShieldCheck, CheckCircle2, AlertCircle, FileText } from "lucide-react";

interface AuditEntry {
  time: string;
  event: string;
  details: string;
  type: "INCOMING" | "ANOMALY" | "DECISION" | "OUTCOME";
}

const auditLogs: AuditEntry[] = [
  {
    time: "12:04:22.104",
    event: "Payment entered pending state",
    details: "HDFC UPI debit response acknowledged by rail; merchant confirmation callback timed out after 15s.",
    type: "INCOMING",
  },
  {
    time: "12:04:23.441",
    event: "Customer reopened checkout cart",
    details: "Duplicate checkout intent detected for same customer and identical amount (₹4,999).",
    type: "ANOMALY",
  },
  {
    time: "12:04:24.018",
    event: "Bank timeout & cluster surge detected",
    details: "1,842 pending events grouped on HDFC CBS switch; baseline failure probability 81% recoverable.",
    type: "ANOMALY",
  },
  {
    time: "12:04:25.190",
    event: "Action evaluated against bounded safety policies",
    details: "Policy Rule 04 matched: Prohibit customer retry prompt when rail debit is confirmed.",
    type: "DECISION",
  },
  {
    time: "12:04:26.002",
    event: "Wait recommended (Duplicate Barrier Active)",
    details: "Cart inventory locked for 5 minutes. Customer displayed friendly pending verification banner.",
    type: "DECISION",
  },
  {
    time: "12:09:28.712",
    event: "Payment confirmed & auto-reconciled",
    details: "Delayed webhook delivered. Order dispatched without customer ticket or duplicate charge.",
    type: "OUTCOME",
  },
];

export default function AuditTrail() {
  return (
    <section id="about" className="py-24 px-5 sm:px-8 max-w-[1280px] mx-auto border-t border-[#E2E8F0] bg-[#FFFFFF]">
      {/* Section Header */}
      <div className="max-w-[760px] mb-14">
        <span className="text-xs font-mono font-bold tracking-widest text-[#0C8CE9] uppercase block mb-3">
          05 / AUDIT TRAIL
        </span>
        <h2 className="font-heading text-3xl sm:text-5xl font-black text-[#0C2340] leading-[1.1]">
          Every action needs a reason.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#334155] font-medium leading-relaxed">
          SAFRA logs every causal signal and stopping rule, providing full explainability for every automated intervention.
        </p>
      </div>

      {/* Audit Waterfall Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm space-y-6">
        <div className="flex items-center justify-between text-xs font-mono text-[#64748B] pb-4 border-b border-[#E2E8F0]">
          <span className="font-bold text-[#0C2340]">Chronological Decision Log • Event #PAY-4999-HERO</span>
          <span className="text-[#0C8CE9] font-bold">Deterministic Audit Trace</span>
        </div>

        <div className="space-y-3.5">
          {auditLogs.map((log, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#0C8CE9] transition-all shadow-sm"
            >
              <div className="flex items-start sm:items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#0C8CE9] bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 rounded-lg shrink-0">
                  {log.time}
                </span>
                <div>
                  <div className="text-xs font-mono font-bold text-[#0C2340]">
                    {log.event}
                  </div>
                  <p className="text-xs text-[#334155] font-sans mt-0.5 font-medium">
                    {log.details}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                  log.type === "OUTCOME"
                    ? "bg-[#E6F9F4] text-[#008764] border-[#A7F3D0]"
                    : log.type === "DECISION"
                    ? "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]"
                    : log.type === "ANOMALY"
                    ? "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]"
                    : "bg-[#F1F5F9] text-[#0C2340] border-[#CBD5E1]"
                }`}
              >
                {log.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
