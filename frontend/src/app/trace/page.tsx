"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  BrainCircuit,
  Building,
  Layers,
  Cpu,
  Store,
  Flame,
  XCircle,
  HelpCircle
} from "lucide-react";
import { SafraAPI, PaymentItem } from "@/lib/api";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function WhereIsMyMoney() {
  const [searchRef, setSearchRef] = useState("PAY-4999-HERO");
  const [payment, setPayment] = useState<PaymentItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [duplicateResult, setDuplicateResult] = useState<any>(null);

  const loadPayment = async (ref: string) => {
    try {
      setIsLoading(true);
      const res = await SafraAPI.getPaymentById(ref);
      setPayment(res);
    } catch (e) {
      console.error("Error loading payment", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayment(searchRef);
  }, []);

  const handleDuplicateTest = async () => {
    if (!payment) return;
    try {
      const res = await SafraAPI.checkDuplicate({
        customer_id: payment.customer_id,
        merchant_id: payment.merchant_id,
        amount: payment.amount,
        payment_method: payment.payment_method,
      });
      setDuplicateResult(res);
      setDuplicateModalOpen(true);
    } catch (e) {
      console.error("Duplicate test failed", e);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-body antialiased">
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-6 sm:px-10 py-12 sm:py-16 space-y-12">
        {/* Header & Search */}
        <div className="space-y-4 text-center max-w-[800px] mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-signal/10 border border-signal/30 text-signal text-xs font-mono font-bold">
            <Search className="w-3.5 h-3.5" />
            <span>CONSUMER & MERCHANT INVESTIGATION PORTAL</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-ink tracking-tight">
            Where Is My Money?
          </h1>
          <p className="text-sm sm:text-base text-ink-soft font-body leading-relaxed">
            When money moves but confirmation does not arrive, SAFRA reconstructs the complete financial trail across bank debits, switch latencies, and gateway timeouts.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto flex items-center gap-2 p-1.5 bg-surface border border-line rounded-sm shadow-sm">
            <input
              type="text"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              placeholder="Enter Payment Reference (e.g. PAY-4999-HERO)"
              className="flex-1 bg-transparent px-4 py-2 text-xs sm:text-sm font-mono text-ink placeholder-muted focus:outline-none"
            />
            <button
              onClick={() => loadPayment(searchRef)}
              className="px-5 py-2.5 bg-signal hover:bg-signal-dark text-paper font-display font-bold text-xs uppercase rounded-sm transition-all"
            >
              Trace Money
            </button>
          </div>

          {/* Quick Demo Selector */}
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-ink-soft pt-2">
            <span>Preset Demo:</span>
            <button
              onClick={() => {
                setSearchRef("PAY-4999-HERO");
                loadPayment("PAY-4999-HERO");
              }}
              className="px-2.5 py-1 rounded-sm bg-paper border border-line hover:border-signal transition-colors flex items-center gap-1.5 text-ink font-semibold"
            >
              <Flame className="w-3 h-3 text-signal" />
              <span>PAY-4999-HERO (₹4,999 Pending)</span>
            </button>
          </div>
        </div>

        {payment && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Main Transaction Header Card */}
            <div className="p-6 sm:p-8 rounded-sm border border-line bg-surface shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-mono text-muted uppercase font-semibold">
                  Monitored Transaction
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl font-bold font-display text-ink">
                    ₹{payment.amount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-sm bg-warning/15 text-warning font-bold">
                    {payment.status}
                  </span>
                </div>
                <p className="text-xs font-mono text-ink-soft">
                  Ref: <strong className="text-ink">{payment.payment_reference}</strong> • Method: {payment.payment_method} • Bank: {payment.bank}
                </p>
              </div>

              {/* Quick Action CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleDuplicateTest}
                  className="px-4 py-2.5 rounded-sm bg-paper border border-danger hover:bg-danger/10 text-danger font-display text-xs font-bold uppercase transition-all flex items-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4 text-danger" />
                  <span>Simulate Repayment</span>
                </button>

                <Link
                  href={`/investigate/${payment.payment_reference}`}
                  className="px-5 py-2.5 rounded-sm bg-ink hover:bg-ink-soft text-paper font-display text-xs font-bold uppercase transition-all flex items-center gap-2"
                >
                  <BrainCircuit className="w-4 h-4 text-signal" />
                  <span>AI Investigation Room</span>
                  <ArrowRight className="w-3.5 h-3.5 text-signal" />
                </Link>
              </div>
            </div>

            {/* 5-Step Payment Trace Timeline */}
            <div className="p-6 sm:p-8 rounded-sm border border-line bg-surface space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h2 className="text-xs font-bold font-mono text-ink uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-signal" />
                  <span>End-to-End Financial Reality Trace</span>
                </h2>
                <span className="text-xs font-mono text-ink-soft">
                  Reality Consistency: <strong className="text-warning">{payment.reality_score?.toFixed(0) || 72}%</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                {/* Step 1: Customer Bank */}
                <div className="p-4 rounded-sm border border-safe/40 bg-safe/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <Building className="w-4 h-4 text-safe" />
                    <CheckCircle2 className="w-4 h-4 text-safe" />
                  </div>
                  <div className="text-xs font-mono font-bold text-ink">{payment.bank}</div>
                  <div className="text-[10px] font-mono text-safe font-bold">
                    Debited (✓)
                  </div>
                  <p className="text-[10px] text-ink-soft font-mono">
                    Funds deducted from customer savings account.
                  </p>
                </div>

                {/* Step 2: Payment Rail (UPI) */}
                <div className="p-4 rounded-sm border border-safe/40 bg-safe/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <Layers className="w-4 h-4 text-safe" />
                    <CheckCircle2 className="w-4 h-4 text-safe" />
                  </div>
                  <div className="text-xs font-mono font-bold text-ink">{payment.payment_rail}</div>
                  <div className="text-[10px] font-mono text-safe font-bold">
                    Acknowledged (✓)
                  </div>
                  <p className="text-[10px] text-ink-soft font-mono">
                    NPCI UPI switch confirmed transit authorization.
                  </p>
                </div>

                {/* Step 3: Gateway */}
                <div className="p-4 rounded-sm border border-warning/40 bg-warning/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <Cpu className="w-4 h-4 text-warning" />
                    <Clock className="w-4 h-4 text-warning animate-spin" />
                  </div>
                  <div className="text-xs font-mono font-bold text-ink">{payment.gateway}</div>
                  <div className="text-[10px] font-mono text-warning font-bold">
                    Processing (⟳)
                  </div>
                  <p className="text-[10px] text-ink-soft font-mono">
                    Gateway received debit token, awaiting merchant ack.
                  </p>
                </div>

                {/* Step 4: Merchant */}
                <div className="p-4 rounded-sm border border-danger/40 bg-danger/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <Store className="w-4 h-4 text-danger" />
                    <XCircle className="w-4 h-4 text-danger" />
                  </div>
                  <div className="text-xs font-mono font-bold text-ink">Merchant Store</div>
                  <div className="text-[10px] font-mono text-danger font-bold">
                    Missing Confirmation (✗)
                  </div>
                  <p className="text-[10px] text-ink-soft font-mono">
                    Merchant endpoint webhook callback timed out.
                  </p>
                </div>

                {/* Step 5: Settlement */}
                <div className="p-4 rounded-sm border border-line bg-paper space-y-2 opacity-80">
                  <div className="flex items-center justify-between">
                    <CheckCircle2 className="w-4 h-4 text-muted" />
                    <Clock className="w-4 h-4 text-muted" />
                  </div>
                  <div className="text-xs font-mono font-bold text-ink">Settlement Engine</div>
                  <div className="text-[10px] font-mono text-muted font-bold">
                    Awaiting T+1 (⏳)
                  </div>
                  <p className="text-[10px] text-muted font-mono">
                    Batch settlement queued pending resolution.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Payment State Machine Intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Outcome Probabilities Gauge */}
              <div className="p-6 sm:p-8 rounded-sm border border-line bg-surface space-y-4 shadow-sm">
                <span className="text-xs font-mono text-muted uppercase font-semibold block">
                  ML Predicted Outcome
                </span>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-mono pb-1">
                      <span className="text-safe font-bold">Probable Clearing</span>
                      <span className="text-safe font-bold">
                        {((payment.success_probability || 0.81) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-paper-dark h-2 rounded-none overflow-hidden">
                      <div
                        className="bg-safe h-full"
                        style={{ width: `${(payment.success_probability || 0.81) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono pb-1">
                      <span className="text-warning font-bold">Auto-Reversal</span>
                      <span className="text-warning font-bold">
                        {((payment.reversal_probability || 0.14) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-paper-dark h-2 rounded-none overflow-hidden">
                      <div
                        className="bg-warning h-full"
                        style={{ width: `${(payment.reversal_probability || 0.14) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono pb-1">
                      <span className="text-danger font-bold">Manual Intervention</span>
                      <span className="text-danger font-bold">
                        {((payment.intervention_probability || 0.05) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-paper-dark h-2 rounded-none overflow-hidden">
                      <div
                        className="bg-danger h-full"
                        style={{ width: `${(payment.intervention_probability || 0.05) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-line pt-3 text-xs font-mono text-ink-soft">
                  Resolution Estimate: <strong className="text-ink">{payment.estimated_resolution_minutes || 6.5} minutes</strong>
                </div>
              </div>

              {/* Crucial Recommendation Card */}
              <div className="md:col-span-2 p-6 sm:p-8 rounded-sm border border-danger/40 bg-surface space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-danger font-mono font-bold text-xs uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Duplicate Payment Guardian Barrier Active</span>
                  </div>
                  <h3 className="text-2xl font-bold font-display text-ink">
                    RECOMMENDATION: DO NOT PAY AGAIN
                  </h3>
                  <p className="text-xs font-mono text-ink-soft leading-relaxed">
                    Your money has already been successfully debited by {payment.bank} and acknowledged by NPCI UPI.
                    There is an <strong>81% probability</strong> that this payment will settle automatically within 6 minutes.
                    Retrying now carries a <strong>HIGH RISK ({((payment.duplicate_risk || 0.88) * 100).toFixed(0)}%)</strong> of double-charging your account.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-line">
                  <div className="text-xs font-mono text-danger font-bold">
                    Duplicate Risk: {((payment.duplicate_risk || 0.88) * 100).toFixed(0)}% (HIGH)
                  </div>
                  <Link
                    href={`/investigate/${payment.payment_reference}`}
                    className="px-4 py-2 bg-paper border border-line hover:border-signal text-ink text-xs font-mono rounded-sm transition-all flex items-center gap-1.5 font-semibold"
                  >
                    <span>Inspect Evidence Trail</span>
                    <ArrowRight className="w-3 h-3 text-signal" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Duplicate Retry Guardian Modal */}
        {duplicateModalOpen && duplicateResult && (
          <div className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface border border-danger rounded-sm max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div className="flex items-center gap-2 text-danger font-bold text-sm">
                  <ShieldAlert className="w-5 h-5" />
                  <span>DUPLICATE REPAYMENT BLOCKED</span>
                </div>
                <button
                  onClick={() => setDuplicateModalOpen(false)}
                  className="text-muted hover:text-ink font-mono text-xs p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-sm bg-danger/10 border border-danger/30 text-xs text-danger font-medium leading-relaxed">
                  {duplicateResult.message}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-sm bg-paper border border-line">
                    <span className="text-muted block text-[10px] uppercase">Retry Similarity</span>
                    <span className="text-ink font-bold text-base">{duplicateResult.similarity_percentage}%</span>
                  </div>
                  <div className="p-3 rounded-sm bg-paper border border-line">
                    <span className="text-muted block text-[10px] uppercase">Auto-Clearing P(Success)</span>
                    <span className="text-safe font-bold text-base">81%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDuplicateModalOpen(false)}
                  className="w-full py-2.5 rounded-sm bg-ink text-paper font-display text-xs font-bold uppercase hover:bg-ink-soft transition-all"
                >
                  Acknowledge & Wait (Recommended)
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
