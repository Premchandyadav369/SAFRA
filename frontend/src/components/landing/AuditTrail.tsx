"use client";

import React from "react";
import { Terminal, ShieldCheck } from "lucide-react";

interface AuditLog {
  time: string;
  type: string;
  code: string;
  explanation: string;
}

const auditLogs: AuditLog[] = [
  {
    time: "12:04:22.104",
    type: "EVENT",
    code: "PAYMENT_PENDING",
    explanation: "HDFC UPI debit acknowledged by payment rail; merchant confirmation callback timed out after 15s.",
  },
  {
    time: "12:04:23.441",
    type: "SIGNAL",
    code: "TEMPORARY_BANK_FAILURE",
    explanation: "Core banking switch latency exceeds normal 180ms baseline (1,420ms observed).",
  },
  {
    time: "12:04:24.018",
    type: "INTERCEPT",
    code: "DUPLICATE_BARRIER_ENGAGED",
    explanation: "Customer attempted cart repayment within 60s; barrier held to avoid double debiting.",
  },
  {
    time: "12:04:25.190",
    type: "SCORE",
    code: "RECOVERY_PROBABILITY = 0.81",
    explanation: "ML scoring assigns 81% confidence of successful settlement based on 1,842 cohort events.",
  },
  {
    time: "12:04:26.002",
    type: "POLICY",
    code: "WAIT_ALLOWED",
    explanation: "Policy Rule 04 verified: Prohibit customer retry prompts when rail debit confirmation exists.",
  },
  {
    time: "12:09:28.712",
    type: "ACTION",
    code: "AUTO_RECONCILE_CONFIRMED",
    explanation: "Delayed webhook ingested. Order dispatched without customer ticket or duplicate charge.",
  },
];

export default function AuditTrail() {
  return (
    <section id="about" className="py-20 sm:py-28 border-b border-line bg-paper">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        {/* Section Label & Statement */}
        <div className="max-w-[800px] mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-bold tracking-widest text-signal uppercase">
              05 / AUDIT TRAIL
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-ink leading-tight tracking-tight">
            Every action needs a reason.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ink-soft font-body leading-relaxed max-w-[620px]">
            SAFRA logs every causal signal and stopping rule, providing full compliance explainability for every automated intervention.
          </p>
        </div>

        {/* Terminal Log Mixed with Investigative Report (No bulky cards, thin dividers) */}
        <div className="border border-line bg-surface rounded-sm p-6 sm:p-8 font-mono text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-line text-ink-soft">
            <span className="font-bold text-ink uppercase tracking-wider">
              Chronological Audit Trail • CASE #PAY-4999-HERO
            </span>
            <span className="text-signal font-semibold">100% Deterministic</span>
          </div>

          <div className="divide-y divide-line">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-paper/50 transition-colors px-2">
                <div className="flex items-start sm:items-center gap-4">
                  <span className="text-muted text-[11px] shrink-0 font-medium">
                    {log.time}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-paper border border-line text-ink shrink-0">
                    {log.type}
                  </span>
                  <span className="font-bold text-ink shrink-0">
                    {log.code}
                  </span>
                </div>

                <p className="text-xs text-ink-soft font-body max-w-[500px] sm:text-right">
                  {log.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
