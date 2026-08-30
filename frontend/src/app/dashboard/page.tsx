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
  ArrowRight,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Lock
} from "lucide-react";
import { SafraAPI, FinancialRealityScore, PaymentItem } from "@/lib/api";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

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
    <div className="min-h-screen bg-paper text-ink font-body antialiased">
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-6 sm:px-10 py-12 sm:py-16 space-y-12">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-display tracking-tight text-ink">
                Merchant Operations Command Center
              </h1>
              <span className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-sm bg-safe/15 text-safe font-bold border border-safe/30">
                <span className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
                LIVE
              </span>
            </div>
            <p className="text-xs text-ink-soft font-mono mt-1">
              Continuous topology validation, duplicate barrier enforcement, and revenue exposure tracking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-2.5 rounded-sm border border-line bg-surface hover:bg-paper-dark text-ink transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-signal" : ""}`} />
            </button>
            <Link
              href="/simulator"
              className="flex items-center gap-2 px-4 py-2.5 bg-ink hover:bg-ink-soft text-paper text-xs font-display font-bold uppercase rounded-sm transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-signal" />
              <span>Incident Simulator</span>
            </Link>
          </div>
        </div>

        {/* Main KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Metric 1: Financial Reality Score Card */}
          <div className="p-6 rounded-sm border border-line bg-surface space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted uppercase font-semibold">Reality Score</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-safe/15 text-safe font-bold">
                {scoreData?.score_status || "HEALTHY"}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-display text-ink">{realityScore.toFixed(1)}</span>
              <span className="text-sm font-mono text-muted">/ 100</span>
            </div>
            <p className="text-xs text-ink-soft font-mono">
              Integrity: {scoreData?.sub_scores.payment_integrity || 97}% • Consistency: {scoreData?.sub_scores.financial_consistency || 92}%
            </p>
            <div className="w-full bg-paper-dark h-1 rounded-none overflow-hidden">
              <div
                className="bg-safe h-full transition-all duration-700"
                style={{ width: `${realityScore}%` }}
              />
            </div>
          </div>

          {/* Metric 2: Pending Financial Exposure */}
          <div className="p-6 rounded-sm border border-line bg-surface space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted uppercase font-semibold">Pending Exposure</span>
              <AlertTriangle className="w-4 h-4 text-warning" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-display text-warning">
                ₹{((scoreData?.kpi_metrics.total_pending_exposure_inr || 4270000) / 100000).toFixed(1)}L
              </span>
            </div>
            <p className="text-xs text-ink-soft font-mono">
              {scoreData?.kpi_metrics.pending_transactions_count || 18} payments awaiting clearing
            </p>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-warning font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
              <span>Monitoring in progress</span>
            </div>
          </div>

          {/* Metric 3: Unexplained Merchant Drift */}
          <div className="p-6 rounded-sm border border-line bg-surface space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted uppercase font-semibold">Unexplained Drift</span>
              <Building className="w-4 h-4 text-danger" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-display text-danger">
                ₹{((scoreData?.kpi_metrics.unexplained_financial_drift_inr || 73000)).toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-xs text-ink-soft font-mono">
              Expected vs Observed discrepancy
            </p>
            <Link
              href="/merchant"
              className="text-xs font-mono text-signal hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Reconcile in Digital Twin</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Metric 4: Duplicate Retries Prevented */}
          <div className="p-6 rounded-sm border border-line bg-surface space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted uppercase font-semibold">Duplicates Blocked</span>
              <ShieldCheck className="w-4 h-4 text-safe" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-display text-safe">
                {scoreData?.kpi_metrics.duplicate_retries_prevented || 183}
              </span>
              <span className="text-xs font-mono text-muted">attempts</span>
            </div>
            <p className="text-xs text-ink-soft font-mono">
              Duplicate Guardian barrier active
            </p>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-safe font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>₹9.1L customer charges saved</span>
            </div>
          </div>
        </div>

        {/* Grid: Component Health Matrix + Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Ecosystem Component Health Matrix */}
          <div className="p-6 rounded-sm border border-line bg-surface space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-signal" />
                <h2 className="text-xs font-bold font-mono text-ink uppercase tracking-wider">
                  Ecosystem Health Matrix
                </h2>
              </div>
              <Link href="/radar" className="text-xs font-mono text-signal hover:underline font-semibold">
                Radar →
              </Link>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {scoreData?.component_health_matrix?.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-sm border border-line bg-paper flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-ink">{comp.component}</div>
                    <div className="text-[10px] text-ink-soft mt-0.5">
                      Latency: {comp.latency_ms}ms • Pending: {comp.pending_rate}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                      comp.status === "WARNING"
                        ? "bg-warning/15 text-warning"
                        : "bg-safe/15 text-safe"
                    }`}
                  >
                    {comp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 & 3: Live Transactions Feed */}
          <div className="lg:col-span-2 p-6 rounded-sm border border-line bg-surface space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-signal" />
                <h2 className="text-xs font-bold font-mono text-ink uppercase tracking-wider">
                  Monitored Transaction Stream
                </h2>
              </div>
              <Link href="/trace" className="text-xs font-mono text-signal hover:underline flex items-center gap-1 font-semibold">
                <span>Hero ₹4,999 Trace</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-line text-muted uppercase text-[11px] bg-paper-dark/30">
                    <th className="py-2.5 px-3 font-semibold">Reference</th>
                    <th className="py-2.5 px-3 font-semibold">Amount</th>
                    <th className="py-2.5 px-3 font-semibold">Bank / Rail</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                    <th className="py-2.5 px-3 font-semibold">Reality</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {recentPayments.slice(0, 8).map((pay) => (
                    <tr key={pay.id} className="hover:bg-paper/50 transition-colors">
                      <td className="py-3 px-3 text-ink font-bold flex items-center gap-1.5">
                        {pay.payment_reference === "PAY-4999-HERO" && (
                          <Flame className="w-3.5 h-3.5 text-signal animate-pulse" />
                        )}
                        <span>{pay.payment_reference}</span>
                      </td>
                      <td className="py-3 px-3 text-ink font-bold">₹{pay.amount.toLocaleString("en-IN")}</td>
                      <td className="py-3 px-3 text-ink-soft">
                        {pay.bank} <span className="text-[10px] text-muted">({pay.payment_rail})</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                            pay.status === "PENDING"
                              ? "bg-warning/15 text-warning"
                              : "bg-safe/15 text-safe"
                          }`}
                        >
                          {pay.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-safe font-bold">{pay.reality_score?.toFixed(0) || 90}%</td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/investigate/${pay.payment_reference}`}
                          className="px-2.5 py-1 rounded-sm bg-paper border border-line hover:border-signal text-ink text-[11px] transition-colors"
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
      </main>

      <Footer />
    </div>
  );
}
