"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Building,
  RefreshCw,
  Search,
  ArrowUpRight,
  Radio,
  SlidersHorizontal,
  Flame
} from "lucide-react";
import { SafraAPI, FinancialRealityScore, PaymentItem } from "@/lib/api";

export default function CommandCenter() {
  const [scoreData, setScoreData] = useState<FinancialRealityScore | null>(null);
  const [recentPayments, setRecentPayments] = useState<PaymentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [scoreRes, paymentsRes] = await Promise.all([
        SafraAPI.getRealityScore(),
        SafraAPI.getPayments(),
      ]);
      setScoreData(scoreRes);
      setRecentPayments(paymentsRes);
    } catch (e) {
      console.error("Error loading dashboard data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const realityScore = scoreData?.overall_reality_score || 94.2;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-mono text-white">Financial Reality Command Center</h1>
            <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-safra-emerald/15 text-safra-emerald border border-safra-emerald/30">
              <span className="w-1.5 h-1.5 rounded-full bg-safra-emerald animate-ping" />
              LIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time topology validation, graph anomaly detection, and exposure tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2 rounded-lg border border-surface-border bg-surface-card hover:bg-surface-border text-slate-300 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-safra-cyan" : ""}`} />
          </button>
          <Link
            href="/simulator"
            className="flex items-center gap-2 px-3 py-1.5 bg-safra-indigo/20 border border-safra-indigo/40 hover:bg-safra-indigo/30 text-indigo-200 text-xs font-mono rounded-lg transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Incident Simulator</span>
          </Link>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Financial Reality Score Card */}
        <div className="p-5 rounded-2xl border border-surface-border bg-surface-card relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Reality Score</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-safra-emerald/10 text-safra-emerald border border-safra-emerald/20">
              {scoreData?.score_status || "HEALTHY"}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">{realityScore.toFixed(1)}</span>
            <span className="text-sm font-mono text-slate-500">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Integrity: {scoreData?.sub_scores.payment_integrity || 97}% • Consistency: {scoreData?.sub_scores.financial_consistency || 92}%
          </p>
          <div className="w-full bg-surface h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-safra-cyan to-safra-emerald h-full rounded-full transition-all duration-700"
              style={{ width: `${realityScore}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Pending Financial Exposure */}
        <div className="p-5 rounded-2xl border border-surface-border bg-surface-card relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Pending Exposure</span>
            <AlertTriangle className="w-4 h-4 text-safra-amber" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-safra-amber">
              ₹{((scoreData?.kpi_metrics.total_pending_exposure_inr || 4270000) / 100000).toFixed(1)}L
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            {scoreData?.kpi_metrics.pending_transactions_count || 18} payments under uncertainty
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-safra-amber">
            <span className="w-1.5 h-1.5 rounded-full bg-safra-amber animate-pulse" />
            <span>Active monitoring in progress</span>
          </div>
        </div>

        {/* Metric 3: Unexplained Merchant Drift */}
        <div className="p-5 rounded-2xl border border-surface-border bg-surface-card relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Unexplained Drift</span>
            <Building className="w-4 h-4 text-safra-ruby" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-safra-ruby">
              ₹{((scoreData?.kpi_metrics.unexplained_financial_drift_inr || 73000)).toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Expected vs Observed discrepancy
          </p>
          <Link
            href="/merchant"
            className="mt-3 text-[11px] font-mono text-safra-cyan hover:underline flex items-center gap-1"
          >
            <span>Reconcile in Digital Twin</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Metric 4: Duplicate Retries Prevented */}
        <div className="p-5 rounded-2xl border border-surface-border bg-surface-card relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Duplicates Prevented</span>
            <ShieldCheck className="w-4 h-4 text-safra-emerald" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-safra-emerald">
              {scoreData?.kpi_metrics.duplicate_retries_prevented || 183}
            </span>
            <span className="text-xs font-mono text-slate-500">attempts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Duplicate Guardian barrier active
          </p>
          <div className="mt-3 flex items-center gap-1 text-[10px] font-mono text-safra-emerald">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>₹9.1L customer charges saved</span>
          </div>
        </div>
      </div>

      {/* Grid: Component Health Matrix + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Ecosystem Component Health Matrix */}
        <div className="p-5 rounded-2xl border border-surface-border bg-surface-card space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-safra-cyan" />
              <h2 className="text-sm font-bold font-mono text-white">Ecosystem Health Matrix</h2>
            </div>
            <Link href="/radar" className="text-[11px] font-mono text-safra-cyan hover:underline">
              Radar →
            </Link>
          </div>

          <div className="space-y-2.5">
            {scoreData?.component_health_matrix?.map((comp, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-surface-border bg-surface/60 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-mono font-medium text-white">{comp.component}</div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Latency: {comp.latency_ms}ms • Pending Rate: {comp.pending_rate}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    comp.status === "WARNING"
                      ? "bg-safra-amber/15 text-safra-amber border border-safra-amber/30"
                      : "bg-safra-emerald/15 text-safra-emerald border border-safra-emerald/30"
                  }`}
                >
                  {comp.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 & 3: Live Transactions Feed */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-surface-border bg-surface-card space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-safra-cyan" />
              <h2 className="text-sm font-bold font-mono text-white">Monitored Transaction Stream</h2>
            </div>
            <Link href="/trace" className="text-[11px] font-mono text-safra-cyan hover:underline flex items-center gap-1">
              <span>Hero ₹4,999 Trace</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-surface-border text-slate-400">
                  <th className="pb-2.5">Reference</th>
                  <th className="pb-2.5">Amount</th>
                  <th className="pb-2.5">Bank / Rail</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5">Reality</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {recentPayments.slice(0, 8).map((pay) => (
                  <tr key={pay.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-2.5 text-white font-medium flex items-center gap-1.5">
                      {pay.payment_reference === "PAY-4999-HERO" && (
                        <Flame className="w-3.5 h-3.5 text-safra-amber animate-pulse" />
                      )}
                      <span>{pay.payment_reference}</span>
                    </td>
                    <td className="py-2.5 text-slate-200">₹{pay.amount.toLocaleString("en-IN")}</td>
                    <td className="py-2.5 text-slate-400">
                      {pay.bank} <span className="text-[10px] text-slate-500">({pay.payment_rail})</span>
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          pay.status === "PENDING"
                            ? "bg-safra-amber/15 text-safra-amber border border-safra-amber/30"
                            : "bg-safra-emerald/15 text-safra-emerald border border-safra-emerald/30"
                        }`}
                      >
                        {pay.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-300">{pay.reality_score?.toFixed(0) || 90}%</td>
                    <td className="py-2.5 text-right">
                      <Link
                        href={`/investigate/${pay.payment_reference}`}
                        className="px-2.5 py-1 rounded bg-surface border border-surface-border text-safra-cyan hover:border-safra-cyan/50 text-[11px] transition-all"
                      >
                        Investigate →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
