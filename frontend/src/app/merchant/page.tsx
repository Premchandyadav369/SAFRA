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
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

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
    <div className="min-h-screen bg-paper text-ink font-body antialiased">
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-6 sm:px-10 py-12 sm:py-16 space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-display tracking-tight text-ink">
                Merchant Financial Digital Twin
              </h1>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-sm bg-safe/15 text-safe border border-safe/30 font-bold">
                DRIFT RECONCILIATION
              </span>
            </div>
            <p className="text-xs text-ink-soft font-mono mt-1">
              Reconciles Expected Financial Reality against Observed Reality, identifying missing graph relationships behind revenue drift.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchTwin}
              className="p-2.5 rounded-sm border border-line bg-surface hover:bg-paper-dark text-ink transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-signal" : ""}`} />
            </button>
          </div>
        </div>

        {twinData && (
          <div className="space-y-8">
            {/* Top 3 Comparative Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Expected Financial Reality */}
              <div className="p-6 sm:p-8 rounded-sm border border-line bg-surface space-y-2 shadow-sm">
                <span className="text-xs font-mono text-muted uppercase font-semibold">
                  Expected Financial Reality
                </span>
                <div className="text-3xl sm:text-4xl font-bold font-display text-ink">
                  ₹{twinData.expected_financial_reality.toLocaleString("en-IN")}
                </div>
                <p className="text-xs text-ink-soft font-mono">
                  Order intents, expected settlements & captures
                </p>
              </div>

              {/* 2. Observed Financial Reality */}
              <div className="p-6 sm:p-8 rounded-sm border border-safe/40 bg-surface space-y-2 shadow-sm">
                <span className="text-xs font-mono text-safe uppercase font-bold">
                  Observed Financial Reality
                </span>
                <div className="text-3xl sm:text-4xl font-bold font-display text-safe">
                  ₹{twinData.observed_financial_reality.toLocaleString("en-IN")}
                </div>
                <p className="text-xs text-ink-soft font-mono">
                  Verified settled cash & confirmed gateway receipts
                </p>
              </div>

              {/* 3. Unexplained Financial Drift */}
              <div className="p-6 sm:p-8 rounded-sm border border-danger/40 bg-surface space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-danger uppercase font-bold">
                    Unexplained Financial Drift
                  </span>
                  <AlertTriangle className="w-4 h-4 text-danger" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold font-display text-danger">
                  ₹{twinData.unexplained_drift.toLocaleString("en-IN")}
                </div>
                <p className="text-xs text-danger font-mono font-medium">
                  {twinData.drift_percentage}% revenue in uncertainty
                </p>
              </div>
            </div>

            {/* Missing Graph Relationship Attribution Table */}
            <div className="p-6 sm:p-8 rounded-sm border border-line bg-surface space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-signal" />
                  <h2 className="text-xs font-bold font-mono text-ink uppercase tracking-wider">
                    Missing Graph Edge Attribution Breakdown
                  </h2>
                </div>
                <span className="text-xs font-mono text-ink-soft">
                  Merchant: <strong className="text-ink">{twinData.merchant_name}</strong>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-line text-muted uppercase text-[11px] bg-paper-dark/30">
                      <th className="py-3 px-3 font-semibold">Discrepancy Category</th>
                      <th className="py-3 px-3 font-semibold">Missing Reality Edge</th>
                      <th className="py-3 px-3 font-semibold">Amount (INR)</th>
                      <th className="py-3 px-3 font-semibold">Affected Txns</th>
                      <th className="py-3 px-3 font-semibold">Status / Recovery Path</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {twinData.drift_breakdown.map((item, idx) => (
                      <tr key={idx} className="hover:bg-paper/50 transition-colors">
                        <td className="py-3.5 px-3 text-ink font-bold">{item.category}</td>
                        <td className="py-3.5 px-3 text-signal font-semibold">{item.missing_edge}</td>
                        <td className="py-3.5 px-3 text-danger font-bold">
                          ₹{item.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-3 text-ink-soft">{item.affected_transactions}</td>
                        <td className="py-3.5 px-3">
                          <span className="px-2.5 py-1 rounded-sm bg-paper border border-line text-ink-soft text-[10px]">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-xs font-mono text-ink-soft">
                  Settlement Health Index: <strong className="text-safe">{twinData.settlement_health_score}%</strong> • Consistency: <strong className="text-ink">{twinData.financial_consistency_score}%</strong>
                </div>
                <Link
                  href="/recovery"
                  className="px-5 py-2.5 bg-ink hover:bg-ink-soft text-paper font-display text-xs font-bold uppercase rounded-sm transition-all flex items-center gap-2"
                >
                  <span>Trigger Autonomous Recovery Playbook</span>
                  <ArrowRight className="w-3.5 h-3.5 text-signal" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
