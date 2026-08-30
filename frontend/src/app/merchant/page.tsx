"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  GitBranch,
  Layers
} from "lucide-react";
import { SafraAPI, MerchantTwinData } from "@/lib/api";

export default function MerchantDigitalTwin() {
  const [twinData, setTwinData] = useState<MerchantTwinData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTwin = async () => {
    try {
      setIsLoading(true);
      const res = await SafraAPI.getMerchantTwin();
      setTwinData(res);
    } catch (e) {
      console.error("Failed to load merchant twin", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTwin();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-mono text-white">Merchant Financial Digital Twin</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-safra-emerald/15 text-safra-emerald border border-safra-emerald/30 font-bold">
              DRIFT RECONCILIATION
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Reconciles Expected Financial Reality against Observed Reality, identifying missing graph relationships behind revenue drift.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTwin}
            className="p-2 rounded-lg border border-surface-border bg-surface-card hover:bg-surface-border text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-safra-cyan" : ""}`} />
          </button>
        </div>
      </div>

      {twinData && (
        <div className="space-y-6">
          {/* Top 3 Comparative Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Expected Financial Reality */}
            <div className="p-6 rounded-3xl border border-surface-border bg-surface-card space-y-2 shadow-xl">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Expected Financial Reality
              </span>
              <div className="text-3xl font-extrabold font-mono text-white">
                ₹{twinData.expected_financial_reality.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Order intents, expected settlements & captures
              </p>
            </div>

            {/* 2. Observed Financial Reality */}
            <div className="p-6 rounded-3xl border border-safra-emerald/30 bg-safra-emerald/5 space-y-2 shadow-xl">
              <span className="text-[11px] font-mono text-safra-emerald uppercase tracking-wider">
                Observed Financial Reality
              </span>
              <div className="text-3xl font-extrabold font-mono text-safra-emerald">
                ₹{twinData.observed_financial_reality.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Verified settled cash & confirmed gateway receipts
              </p>
            </div>

            {/* 3. Unexplained Financial Drift */}
            <div className="p-6 rounded-3xl border border-safra-ruby/40 bg-safra-ruby/10 space-y-2 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-safra-ruby uppercase tracking-wider">
                  Unexplained Financial Drift
                </span>
                <AlertTriangle className="w-4 h-4 text-safra-ruby" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-safra-ruby">
                ₹{twinData.unexplained_drift.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-red-300 font-mono">
                {twinData.drift_percentage}% revenue in uncertainty
              </p>
            </div>
          </div>

          {/* Missing Graph Relationship Attribution Table */}
          <div className="p-6 rounded-3xl border border-surface-border bg-surface-card space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-safra-cyan" />
                <h2 className="text-sm font-bold font-mono text-white">
                  Missing Graph Edge Attribution Breakdown
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Merchant: <strong className="text-white">{twinData.merchant_name}</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-surface-border text-slate-400">
                    <th className="pb-3">Discrepancy Category</th>
                    <th className="pb-3">Missing Reality Edge</th>
                    <th className="pb-3">Amount (INR)</th>
                    <th className="pb-3">Affected Txns</th>
                    <th className="pb-3">Status / Recovery Path</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/50">
                  {twinData.drift_breakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-surface/50 transition-colors">
                      <td className="py-3 text-white font-bold">{item.category}</td>
                      <td className="py-3 text-safra-cyan">{item.missing_edge}</td>
                      <td className="py-3 text-safra-ruby font-bold">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 text-slate-300">{item.affected_transactions}</td>
                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded bg-surface border border-surface-border text-slate-300 text-[10px]">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs font-mono text-slate-400">
                Settlement Health Index: <strong className="text-safra-emerald">{twinData.settlement_health_score}%</strong> • Financial Consistency: <strong className="text-safra-cyan">{twinData.financial_consistency_score}%</strong>
              </div>
              <Link
                href="/recovery"
                className="px-4 py-2 bg-safra-cyan hover:bg-safra-cyan/90 text-slate-950 font-mono text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
              >
                <span>Trigger Autonomous Recovery Playbook</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
