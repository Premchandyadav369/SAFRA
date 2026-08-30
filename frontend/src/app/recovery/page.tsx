"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingDown,
  RefreshCw,
  Sparkles,
  Lock
} from "lucide-react";
import { SafraAPI } from "@/lib/api";

export default function RecoveryLab() {
  const [simulation, setSimulation] = useState<any | null>(null);
  const [recoveryActions, setRecoveryActions] = useState<any[]>([]);
  const [isApproving, setIsApproving] = useState(false);
  const [approvalResult, setApprovalResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecoveryData = async () => {
    try {
      setIsLoading(true);
      const [simRes, actRes] = await Promise.all([
        SafraAPI.getRecoveryScenarios(4270000, 1842),
        SafraAPI.getRecoveryActions(),
      ]);
      setSimulation(simRes);
      setRecoveryActions(actRes);
    } catch (e) {
      console.error("Failed to load recovery scenarios", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecoveryData();
  }, []);

  const handleApprove = async (actionId: string) => {
    try {
      setIsApproving(true);
      const res = await SafraAPI.approveRecoveryAction(actionId, "Lead Finance Engineer");
      setApprovalResult(res);
      fetchRecoveryData();
    } catch (e) {
      console.error("Approval execution failed", e);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-mono text-white">Recovery Simulation Lab & Governance</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-safra-cyan/15 text-safra-cyan border border-safra-cyan/30 font-bold">
              HUMAN-IN-THE-LOOP
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Simulates recovery outcomes before execution; enforces strict human review for financial actions.
          </p>
        </div>

        <button
          onClick={fetchRecoveryData}
          className="p-2 rounded-lg border border-surface-border bg-surface-card hover:bg-surface-border text-slate-300 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-safra-cyan" : ""}`} />
        </button>
      </div>

      {/* 3-Scenario Comparison Matrix */}
      <div className="space-y-4">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
          Simulated Recovery Outcomes (3 Scenarios)
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {simulation?.scenarios?.map((sc: any, idx: number) => {
            const isRec = sc.recommended;
            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-xl relative ${
                  isRec
                    ? "border-safra-cyan bg-safra-cyan/5 shadow-safra-cyan/10 ring-1 ring-safra-cyan/30"
                    : "border-surface-border bg-surface-card"
                }`}
              >
                {isRec && (
                  <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-safra-cyan text-slate-950 text-[10px] font-mono font-bold flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" />
                    <span>SAFRA RECOMMENDED (93% CONFIDENCE)</span>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="text-sm font-bold font-mono text-white">{sc.title}</h3>
                  <p className="text-xs text-slate-400 font-mono leading-relaxed">{sc.action}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-surface-border text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Resolution Time:</span>
                    <span className="text-white font-bold">{sc.expected_resolution_time}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Residual Exposure:</span>
                    <span className={`font-bold ${isRec ? "text-safra-emerald" : "text-safra-ruby"}`}>
                      ₹{(sc.merchant_residual_exposure / 100000).toFixed(1)}L
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Complaint Velocity:</span>
                    <span className="text-slate-200 font-mono">{sc.customer_complaint_multiplier}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Operational Risk:</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        sc.operational_risk === "HIGH"
                          ? "bg-safra-ruby/15 text-safra-ruby"
                          : sc.operational_risk === "MEDIUM"
                          ? "bg-safra-amber/15 text-safra-amber"
                          : "bg-safra-emerald/15 text-safra-emerald"
                      }`}
                    >
                      {sc.operational_risk}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Human-in-the-Loop Proposal Gate */}
      <div className="p-6 rounded-3xl border border-surface-border bg-surface-card space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-safra-cyan" />
            <h2 className="text-sm font-bold font-mono text-white">
              SAFRA Action Proposal & Approval Gate
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Safety Standard: <strong className="text-safra-emerald">Human Approval Required</strong>
          </span>
        </div>

        {recoveryActions.length > 0 ? (
          recoveryActions.map((act) => (
            <div
              key={act.id}
              className="p-5 rounded-2xl border border-surface-border bg-surface flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-mono text-white">{act.playbook_name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-safra-cyan/15 text-safra-cyan border border-safra-cyan/30">
                    Risk: {act.risk_level}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      act.status === "EXECUTED"
                        ? "bg-safra-emerald/20 text-safra-emerald border border-safra-emerald/40"
                        : "bg-safra-amber/20 text-safra-amber border border-safra-amber/40"
                    }`}
                  >
                    {act.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono">{act.action_description}</p>
                <div className="text-[11px] text-slate-400 font-mono pt-1">
                  Expected Resolution: <strong className="text-white">{act.expected_resolution_minutes} mins</strong> • Mitigated Exposure: <strong className="text-safra-emerald">₹{(act.exposure_mitigated / 100000).toFixed(1)}L</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {act.status === "PENDING_APPROVAL" ? (
                  <>
                    <button
                      onClick={() => handleApprove(act.id)}
                      disabled={isApproving}
                      className="px-5 py-2.5 rounded-xl bg-safra-cyan hover:bg-safra-cyan/90 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg shadow-safra-cyan/20 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isApproving ? "Executing..." : "Approve & Execute Playbook"}</span>
                    </button>
                  </>
                ) : (
                  <div className="px-4 py-2 rounded-xl bg-safra-emerald/15 border border-safra-emerald/30 text-safra-emerald font-mono text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Playbook Executed by {act.approved_by || "Lead Engineer"}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-xs text-slate-400 font-mono">No pending action proposals.</div>
        )}

        {approvalResult && (
          <div className="p-4 rounded-xl border border-safra-emerald/40 bg-safra-emerald/10 text-xs font-mono text-emerald-200 space-y-1 animate-in fade-in duration-300">
            <div className="font-bold flex items-center gap-1.5 text-safra-emerald">
              <CheckCircle2 className="w-4 h-4" />
              <span>EXECUTION CONFIRMATION</span>
            </div>
            <p>{approvalResult.result?.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
