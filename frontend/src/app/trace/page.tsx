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
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header & Search */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-safra-cyan/10 border border-safra-cyan/20 text-safra-cyan text-xs font-mono">
          <Search className="w-3.5 h-3.5" />
          <span>Consumer & Merchant Investigation Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
          Where Is My Money?
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto font-mono">
          When money moves but confirmation doesn&apos;t arrive, SAFRA reconstructs the complete financial trace.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto flex items-center gap-2 p-1.5 bg-surface-card border border-surface-border rounded-2xl shadow-xl">
          <input
            type="text"
            value={searchRef}
            onChange={(e) => setSearchRef(e.target.value)}
            placeholder="Enter Payment Reference (e.g. PAY-4999-HERO)"
            className="flex-1 bg-transparent px-4 py-2 text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => loadPayment(searchRef)}
            className="px-4 py-2.5 bg-safra-cyan hover:bg-safra-cyan/90 text-slate-950 font-mono font-bold text-xs rounded-xl transition-all"
          >
            Trace Money
          </button>
        </div>

        {/* Quick Demo Selector */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
          <span>Preset Demo:</span>
          <button
            onClick={() => {
              setSearchRef("PAY-4999-HERO");
              loadPayment("PAY-4999-HERO");
            }}
            className="px-2.5 py-1 rounded bg-safra-indigo/15 text-indigo-300 border border-safra-indigo/30 hover:border-safra-indigo/60 transition-colors flex items-center gap-1"
          >
            <Flame className="w-3 h-3 text-safra-amber" />
            <span>PAY-4999-HERO (₹4,999 Pending)</span>
          </button>
        </div>
      </div>

      {payment && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Main Transaction Header Card */}
          <div className="p-6 rounded-3xl border border-surface-border bg-gradient-to-b from-surface-card to-surface shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                Monitored Transaction
              </span>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-extrabold font-mono text-white">
                  ₹{payment.amount.toLocaleString("en-IN")}
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-safra-amber/15 text-safra-amber border border-safra-amber/30 font-bold">
                  {payment.status}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">
                Ref: <strong className="text-slate-200">{payment.payment_reference}</strong> • Method: {payment.payment_method} • Bank: {payment.bank}
              </p>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleDuplicateTest}
                className="px-4 py-2.5 rounded-xl bg-safra-ruby/15 border border-safra-ruby/30 hover:border-safra-ruby/60 text-red-200 font-mono text-xs font-semibold transition-all flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-safra-ruby" />
                <span>Simulate Retry Payment</span>
              </button>

              <Link
                href={`/investigate/${payment.payment_reference}`}
                className="px-4 py-2.5 rounded-xl bg-safra-cyan hover:bg-safra-cyan/90 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-safra-cyan/15"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>AI Agent Investigation Room</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 5-Step Payment Trace Timeline */}
          <div className="p-6 rounded-3xl border border-surface-border bg-surface-card space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-safra-cyan" />
                <span>End-to-End Financial Reality Trace</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                Reality Consistency: <strong className="text-safra-amber">{payment.reality_score?.toFixed(0) || 72}%</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {/* Step 1: Customer Bank */}
              <div className="p-4 rounded-2xl border border-safra-emerald/40 bg-safra-emerald/5 space-y-2">
                <div className="flex items-center justify-between">
                  <Building className="w-4 h-4 text-safra-emerald" />
                  <CheckCircle2 className="w-4 h-4 text-safra-emerald" />
                </div>
                <div className="text-xs font-mono font-bold text-white">{payment.bank}</div>
                <div className="text-[10px] font-mono text-safra-emerald font-semibold">
                  Debited (✓)
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Funds deducted from customer savings account.
                </p>
              </div>

              {/* Step 2: Payment Rail (UPI) */}
              <div className="p-4 rounded-2xl border border-safra-emerald/40 bg-safra-emerald/5 space-y-2">
                <div className="flex items-center justify-between">
                  <Layers className="w-4 h-4 text-safra-emerald" />
                  <CheckCircle2 className="w-4 h-4 text-safra-emerald" />
                </div>
                <div className="text-xs font-mono font-bold text-white">{payment.payment_rail}</div>
                <div className="text-[10px] font-mono text-safra-emerald font-semibold">
                  Acknowledged (✓)
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  NPCI UPI switch confirmed transit authorization.
                </p>
              </div>

              {/* Step 3: Gateway */}
              <div className="p-4 rounded-2xl border border-safra-amber/40 bg-safra-amber/5 space-y-2">
                <div className="flex items-center justify-between">
                  <Cpu className="w-4 h-4 text-safra-amber" />
                  <Clock className="w-4 h-4 text-safra-amber animate-spin" />
                </div>
                <div className="text-xs font-mono font-bold text-white">{payment.gateway}</div>
                <div className="text-[10px] font-mono text-safra-amber font-semibold">
                  Processing (⟳)
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Gateway received debit token, awaiting merchant ack.
                </p>
              </div>

              {/* Step 4: Merchant */}
              <div className="p-4 rounded-2xl border border-safra-ruby/40 bg-safra-ruby/5 space-y-2">
                <div className="flex items-center justify-between">
                  <Store className="w-4 h-4 text-safra-ruby" />
                  <XCircle className="w-4 h-4 text-safra-ruby" />
                </div>
                <div className="text-xs font-mono font-bold text-white">Merchant Store</div>
                <div className="text-[10px] font-mono text-safra-ruby font-semibold">
                  Missing Confirmation (✗)
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Merchant endpoint webhook callback timed out.
                </p>
              </div>

              {/* Step 5: Settlement */}
              <div className="p-4 rounded-2xl border border-slate-700 bg-surface/60 space-y-2 opacity-75">
                <div className="flex items-center justify-between">
                  <CheckCircle2 className="w-4 h-4 text-slate-400" />
                  <Clock className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-xs font-mono font-bold text-white">Settlement Engine</div>
                <div className="text-[10px] font-mono text-slate-400 font-semibold">
                  Awaiting T+1 (⏳)
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Batch settlement queued pending resolution.
                </p>
              </div>
            </div>
          </div>

          {/* AI Payment State Machine Intelligence */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Outcome Probabilities Gauge */}
            <div className="p-6 rounded-3xl border border-surface-border bg-surface-card space-y-4 shadow-xl">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                ML Predicted Outcome
              </span>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-mono pb-1">
                    <span className="text-safra-emerald font-bold">Probable Success</span>
                    <span className="text-safra-emerald font-bold">
                      {((payment.success_probability || 0.81) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-safra-emerald h-full rounded-full"
                      style={{ width: `${(payment.success_probability || 0.81) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono pb-1">
                    <span className="text-safra-amber font-bold">Auto-Reversal to Bank</span>
                    <span className="text-safra-amber font-bold">
                      {((payment.reversal_probability || 0.14) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-safra-amber h-full rounded-full"
                      style={{ width: `${(payment.reversal_probability || 0.14) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono pb-1">
                    <span className="text-safra-ruby font-bold">Manual Intervention</span>
                    <span className="text-safra-ruby font-bold">
                      {((payment.intervention_probability || 0.05) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-safra-ruby h-full rounded-full"
                      style={{ width: `${(payment.intervention_probability || 0.05) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-surface-border pt-3 text-[11px] font-mono text-slate-400">
                Resolution Estimate: <strong className="text-white">{payment.estimated_resolution_minutes || 6.5} minutes</strong>
              </div>
            </div>

            {/* Crucial Recommendation Card */}
            <div className="md:col-span-2 p-6 rounded-3xl border border-safra-ruby/30 bg-safra-ruby/5 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-safra-ruby font-mono font-bold text-xs uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Duplicate Payment Guardian Warning</span>
                </div>
                <h3 className="text-xl font-bold font-mono text-white">
                  RECOMMENDATION: DO NOT PAY AGAIN
                </h3>
                <p className="text-xs font-mono text-slate-300 leading-relaxed">
                  Your money has already been successfully debited by {payment.bank} and acknowledged by NPCI UPI.
                  There is an <strong>81% probability</strong> that this payment will settle automatically within 6 minutes.
                  Retrying now carries a <strong>HIGH RISK ({((payment.duplicate_risk || 0.88) * 100).toFixed(0)}%)</strong> of double-charging your account.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-safra-ruby/20">
                <div className="text-[11px] font-mono text-slate-400">
                  Duplicate Risk: <strong className="text-safra-ruby font-bold">{((payment.duplicate_risk || 0.88) * 100).toFixed(0)}% (HIGH)</strong>
                </div>
                <Link
                  href={`/investigate/${payment.payment_reference}`}
                  className="px-4 py-2 bg-surface-card border border-surface-border hover:border-safra-cyan/40 text-safra-cyan text-xs font-mono rounded-xl transition-all flex items-center gap-1.5"
                >
                  <span>Inspect Evidence Trail</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Retry Guardian Modal */}
      {duplicateModalOpen && duplicateResult && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-card border border-safra-ruby/50 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2 text-safra-ruby font-mono font-bold text-sm">
                <ShieldAlert className="w-5 h-5" />
                <span>DUPLICATE PAYMENT PREVENTED</span>
              </div>
              <button
                onClick={() => setDuplicateModalOpen(false)}
                className="text-slate-400 hover:text-white font-mono text-xs p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-safra-ruby/10 border border-safra-ruby/30 text-xs font-mono text-red-200 leading-relaxed">
                {duplicateResult.message}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-surface border border-surface-border">
                  <span className="text-slate-400 block text-[10px]">Retry Similarity</span>
                  <span className="text-white font-bold text-base">{duplicateResult.similarity_percentage}%</span>
                </div>
                <div className="p-3 rounded-xl bg-surface border border-surface-border">
                  <span className="text-slate-400 block text-[10px]">Previous P(Success)</span>
                  <span className="text-safra-emerald font-bold text-base">81%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDuplicateModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-safra-ruby text-slate-950 font-mono text-xs font-bold hover:bg-safra-ruby/90 transition-all"
              >
                Acknowledge & Wait (Recommended)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
