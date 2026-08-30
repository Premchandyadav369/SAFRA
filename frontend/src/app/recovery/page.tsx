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
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

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
    <div className="min-h-screen bg-paper text-ink font-body antialiased">
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-6 sm:px-10 py-12 sm:py-16 space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-display tracking-tight text-ink">
                Recovery Simulation Lab & Governance
              </h1>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-sm bg-safe/15 text-safe border border-safe/30 font-bold">
                HUMAN-IN-THE-LOOP
              </span>
            </div>
            <p className="text-xs text-ink-soft font-mono mt-1">
              Simulates recovery outcomes before execution; enforces strict human review for financial actions.
            </p>
          </div>

          <button
            onClick={fetchRecoveryData}
            className="p-2.5 rounded-sm border border-line bg-surface hover:bg-paper-dark text-ink transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-signal" : ""}`} />
          </button>
        </div>

        {/* 3-Scenario Comparison Matrix */}
        <div className="space-y-4">
          <span className="text-xs font-mono text-muted uppercase tracking-wider block font-semibold">
            Simulated Recovery Outcomes (3 Scenarios)
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {simulation?.scenarios?.map((sc: any, idx: number) => {
              const isRec = sc.recommended;
              return (
                <div
                  key={idx}
                  className={`p-6 sm:p-8 rounded-sm border transition-all flex flex-col justify-between space-y-5 shadow-sm relative ${
                    isRec
                      ? "border-signal bg-surface ring-1 ring-signal"
                      : "border-line bg-surface"
                  }`}
                >
                  {isRec && (
                    <div className="absolute -top-3 right-6 px-3 py-1 rounded-sm bg-signal text-paper text-[10px] font-mono font-bold flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3" />
                      <span>SAFRA RECOMMENDED (93% CONFIDENCE)</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="text-base font-bold font-display text-ink">{sc.title}</h3>
                    <p className="text-xs text-ink-soft font-mono leading-relaxed">{sc.action}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-line text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-muted">Resolution Time:</span>
                      <span className="text-ink font-bold">{sc.expected_resolution_time}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted">Residual Exposure:</span>
                      <span className={`font-bold ${isRec ? "text-safe" : "text-danger"}`}>
                        ₹{(sc.merchant_residual_exposure / 100000).toFixed(1)}L
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted">Complaint Velocity:</span>
                      <span className="text-ink-soft font-mono">{sc.customer_complaint_multiplier}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted">Operational Risk:</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                          sc.operational_risk === "HIGH"
                            ? "bg-danger/15 text-danger"
                            : sc.operational_risk === "MEDIUM"
                            ? "bg-warning/15 text-warning"
                            : "bg-safe/15 text-safe"
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
        <div className="p-6 sm:p-8 rounded-sm border border-line bg-surface space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-signal" />
              <h2 className="text-xs font-bold font-mono text-ink uppercase tracking-wider">
                SAFRA Action Proposal & Approval Gate
              </h2>
            </div>
            <span className="text-xs font-mono text-ink-soft">
              Safety Standard: <strong className="text-safe">Human Approval Required</strong>
            </span>
          </div>

          {recoveryActions.length > 0 ? (
            recoveryActions.map((act) => (
              <div
                key={act.id}
                className="p-5 rounded-sm border border-line bg-paper flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-display text-ink">{act.playbook_name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-signal/15 text-signal font-bold">
                      Risk: {act.risk_level}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm ${
                        act.status === "EXECUTED"
                          ? "bg-safe/15 text-safe"
                          : "bg-warning/15 text-warning"
                      }`}
                    >
                      {act.status}
                    </span>
                  </div>
                  <p className="text-xs text-ink-soft font-mono">{act.action_description}</p>
                  <div className="text-[11px] text-muted font-mono pt-1">
                    Expected Resolution: <strong className="text-ink">{act.expected_resolution_minutes} mins</strong> • Mitigated: <strong className="text-safe">₹{(act.exposure_mitigated / 100000).toFixed(1)}L</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {act.status === "PENDING_APPROVAL" ? (
                    <button
                      onClick={() => handleApprove(act.id)}
                      disabled={isApproving}
                      className="px-5 py-2.5 rounded-sm bg-ink hover:bg-ink-soft text-paper font-display text-xs font-bold uppercase transition-all flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-signal" />
                      <span>{isApproving ? "Executing..." : "Approve & Execute Playbook"}</span>
                    </button>
                  ) : (
                    <div className="px-4 py-2 rounded-sm bg-safe/15 border border-safe/30 text-safe font-mono text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Playbook Executed by {act.approved_by || "Lead Engineer"}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-ink-soft font-mono">No pending action proposals.</div>
          )}

          {approvalResult && (
            <div className="p-4 rounded-sm border border-safe/40 bg-safe/10 text-xs font-mono text-safe space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-safe">
                <CheckCircle2 className="w-4 h-4" />
                <span>EXECUTION CONFIRMATION</span>
              </div>
              <p>{approvalResult.result?.message}</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
