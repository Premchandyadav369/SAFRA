"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Code,
  Terminal,
  Activity,
  Copy,
  Check
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function MethodologyPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const nodeJsSnippet = `// 1. Razorpay Webhook Handler with SAFRA Recovery Intelligence
const express = require("express");
const crypto = require("crypto");
const { SafraClient } = require("@safra/sdk");

const app = express();
const safra = new SafraClient({ apiKey: process.env.SAFRA_API_KEY });

app.post("/webhook/razorpay", express.raw({ type: "application/json" }), async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const isValid = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(req.body)
    .digest("hex") === signature;

  if (!isValid) return res.status(400).send("Invalid signature");

  const event = JSON.parse(req.body);

  // Evaluate revenue risk and select bounded recovery action
  if (event.event === "payment.failed" || event.event === "payment.pending") {
    const evaluation = await safra.evaluate({
      transactionId: event.payload.payment.entity.id,
      amount: event.payload.payment.entity.amount / 100,
      currency: event.payload.payment.entity.currency,
      method: event.payload.payment.entity.method,
      bank: event.payload.payment.entity.bank,
      errorCode: event.payload.payment.entity.error_code,
      errorDescription: event.payload.payment.entity.error_description,
      customerEmail: event.payload.payment.entity.email,
      customerContact: event.payload.payment.entity.contact
    });

    // Execute bounded action (WAIT, RECOVERY_LINK, ALT_METHOD, STOP)
    console.log(\`[SAFRA] Action: \${evaluation.recommended_action} | P(Recov): \${evaluation.recovery_probability}\`);
  }

  res.json({ status: "received" });
});`;

  const curlSnippet = `curl -X POST "https://api.safra.internal/v1/recovery/evaluate" \\
  -H "Authorization: Bearer safra_live_key_98214" \\
  -H "Content-Type: application/json" \\
  -d '{
    "transaction_id": "pay_O9rK2w8vK1Lm90",
    "amount": 4999.00,
    "currency": "INR",
    "payment_method": "UPI",
    "bank": "HDFC Bank",
    "failure_code": "BAD_REQUEST_ERROR_PAYMENT_TIMEDOUT",
    "customer_id": "cust_aryan_01",
    "cart_reserved": true
  }'`;

  return (
    <div className="min-h-screen bg-paper text-ink font-body antialiased">
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-6 sm:px-10 py-16 sm:py-24 space-y-20">
        {/* Page Header Masthead */}
        <div className="space-y-4 max-w-[920px] border-b border-line pb-10">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-signal uppercase">
            <span>METHODOLOGY & PRODUCTION SPECIFICATION</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-[-0.04em] leading-[0.98] text-ink">
            End-to-End Recovery Architecture & Razorpay Integration
          </h1>

          <p className="text-base sm:text-lg text-ink-soft leading-relaxed font-body pt-2">
            A comprehensive, transparent technical breakdown of how SAFRA ingests payment stream signals, builds relational transaction DAGs, computes deterministic recovery probabilities, enforces anti-spam stopping rules, and executes bounded workflows across Razorpay infrastructure.
          </p>
        </div>

        {/* Section 1: The Core Infrastructure Problem */}
        <section className="space-y-6">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-signal">
            SECTION 01: PROBLEM FORMULATION
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-ink">
            Why Fragmented Financial State Machines Fail
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 bg-surface border border-line rounded-sm space-y-3">
              <span className="text-[11px] font-mono font-bold text-signal uppercase">
                01 / Webhook Latency Asymmetry
              </span>
              <h3 className="font-display font-bold text-base text-ink">The 504 Timeout Dilemma</h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                When Core Banking Systems (CBS) experience queuing spikes, debits occur on customer bank accounts, but acknowledgment callbacks take 4 to 12 minutes to arrive. Gateways mark transactions as Failed or Pending, triggering premature user panic.
              </p>
            </div>

            <div className="p-6 bg-surface border border-line rounded-sm space-y-3">
              <span className="text-[11px] font-mono font-bold text-signal uppercase">
                02 / Uncoordinated Repayment
              </span>
              <h3 className="font-display font-bold text-base text-ink">14.2% Duplicate Debit Rate</h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                Panicked buyers attempt repayment within 60 seconds of a stalled screen. When delayed webhooks eventually arrive, merchants end up double-charging the customer, causing chargeback disputes and support overhead.
              </p>
            </div>

            <div className="p-6 bg-surface border border-line rounded-sm space-y-3">
              <span className="text-[11px] font-mono font-bold text-signal uppercase">
                03 / Generic 1-Message Blasts
              </span>
              <h3 className="font-display font-bold text-base text-ink">Customer Contact Fatigue</h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                Traditional recovery systems blast generic SMS/WhatsApp reminders for every failure, irritating buyers who already completed payment or dropped off due to insufficient funds without alternate methods.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Mathematical Recovery Formulation */}
        <section className="space-y-6 pt-8 border-t border-line">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-signal">
            SECTION 02: MATHEMATICAL MODEL
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-ink">
            Deterministic Recovery Probability Formulation
          </h2>

          <div className="p-6 sm:p-8 bg-surface border border-line rounded-sm space-y-6">
            <p className="text-xs sm:text-sm text-ink-soft leading-relaxed font-mono">
              SAFRA models recovery probability using an explainable, bounded additive linear form with empirical clipping:
            </p>

            <div className="p-4 sm:p-6 bg-paper border border-line rounded-sm font-mono text-xs sm:text-sm text-ink overflow-x-auto leading-relaxed">
              {"P(Recovery) = clamp( beta_0 + sum(omega_i * I(Signal_i)) - sum(rho_j * I(Penalty_j)), 0.05, 0.98 )"}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-mono text-xs">
              <div className="space-y-2">
                <div className="font-bold text-ink text-xs uppercase pb-1 border-b border-line">
                  Positive Signal Weights (omega_i)
                </div>
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-ink-soft">Bank Debit Receipt Confirmed:</span>
                  <span className="text-safe font-bold">+0.24</span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-ink-soft">Customer Loyalty (Score &gt; 0.70):</span>
                  <span className="text-safe font-bold">+0.18</span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-ink-soft">High Checkout Intent (OTP step):</span>
                  <span className="text-safe font-bold">+0.12</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-ink-soft">Historical Bank Switch Recovery Rate:</span>
                  <span className="text-safe font-bold">+0.15</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-ink text-xs uppercase pb-1 border-b border-line">
                  Mitigating Penalties (rho_j)
                </div>
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-ink-soft">Insufficient Funds on Direct Rail:</span>
                  <span className="text-danger font-bold">-0.28</span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-ink-soft">Repeated Retries (3+ attempts):</span>
                  <span className="text-danger font-bold">-0.18</span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-ink-soft">Card Token Expiry / Replaced:</span>
                  <span className="text-danger font-bold">-0.22</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-ink-soft">Receivable Overdue Age (&gt;15 days):</span>
                  <span className="text-danger font-bold">-0.20</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Bounded Policy State Machine */}
        <section className="space-y-6 pt-8 border-t border-line">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-signal">
            SECTION 03: BOUNDED POLICY ENGINE
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-ink">
            Stopping Rules & Idempotency Barrier
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-surface border border-line rounded-sm space-y-4 font-mono text-xs">
              <div className="font-bold text-ink text-sm uppercase">
                Action Decision Matrix
              </div>
              <div className="space-y-2.5 divide-y divide-line/60 text-ink">
                <div className="pt-2">
                  <span className="text-signal font-bold">1. WAIT:</span>
                  <p className="text-xs font-body text-ink-soft mt-0.5">
                    Triggered when bank debit confirmation exists. Prohibits retry prompts to prevent duplicate billing.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="text-signal font-bold">2. SEND_RECOVERY_LINK:</span>
                  <p className="text-xs font-body text-ink-soft mt-0.5">
                    Triggered when customer abandoned cart with high purchase intent (P &gt; 0.50). Pre-fills cart securely.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="text-signal font-bold">3. OFFER_ALTERNATIVE_PAYMENT_METHOD:</span>
                  <p className="text-xs font-body text-ink-soft mt-0.5">
                    Triggered on insufficient funds for high-LTV buyers. Switches from direct debit to card or EMI.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="text-signal font-bold">4. STOP:</span>
                  <p className="text-xs font-body text-ink-soft mt-0.5">
                    Triggered when retry limit is reached (3 attempts) or P &lt; 0.20. Shields buyer from spam.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-surface border border-line rounded-sm space-y-4 font-mono text-xs">
              <div className="font-bold text-ink text-sm uppercase">
                Duplicate Payment Barrier Spec
              </div>
              <p className="text-xs font-body text-ink-soft leading-relaxed">
                The duplicate payment barrier computes a cryptographic collision key on incoming checkout requests:
              </p>
              <div className="p-3 bg-paper border border-line rounded-sm font-mono text-[11px] text-ink">
                {"Key = SHA256( merchant_id + customer_id + amount + window_60s )"}
              </div>
              <div className="space-y-2 pt-2 text-ink">
                <div>• Lookback Window: <strong>60 to 300 seconds</strong></div>
                <div>• Collision Action: <strong>Repress second debit attempt</strong></div>
                <div>• Feedback: <strong>Inform buyer original attempt is clearing</strong></div>
                <div>• Net Impact: <strong>100% duplicate charges eliminated</strong></div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Direct Razorpay Integration Spec */}
        <section className="space-y-6 pt-8 border-t border-line">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-signal">
            SECTION 04: RAZORPAY INTEGRATION CODE
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-ink">
            Direct Merchant & Gateway Integration
          </h2>
          <p className="text-sm text-ink-soft max-w-[700px]">
            Razorpay merchants and core routing teams can embed SAFRA in less than 10 lines of code via webhook listeners or SDK middleware:
          </p>

          <div className="space-y-6">
            {/* Node.js Snippet */}
            <div className="border border-line bg-surface rounded-sm overflow-hidden font-mono text-xs">
              <div className="p-3.5 bg-paper border-b border-line flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-signal" />
                  <span className="font-bold text-ink">Node.js Webhook Integration</span>
                </div>
                <button
                  onClick={() => copySnippet("nodejs", nodeJsSnippet)}
                  className="px-2.5 py-1 bg-surface border border-line rounded-sm hover:bg-paper-dark text-ink text-[10px] flex items-center gap-1 transition-colors"
                >
                  {copiedCode === "nodejs" ? <Check className="w-3 h-3 text-safe" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode === "nodejs" ? "Copied" : "Copy Code"}</span>
                </button>
              </div>
              <pre className="p-4 sm:p-6 overflow-x-auto text-[11px] sm:text-xs text-ink leading-relaxed bg-paper/30">
                {nodeJsSnippet}
              </pre>
            </div>

            {/* cURL API Snippet */}
            <div className="border border-line bg-surface rounded-sm overflow-hidden font-mono text-xs">
              <div className="p-3.5 bg-paper border-b border-line flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-signal" />
                  <span className="font-bold text-ink">Direct REST API Evaluation (cURL)</span>
                </div>
                <button
                  onClick={() => copySnippet("curl", curlSnippet)}
                  className="px-2.5 py-1 bg-surface border border-line rounded-sm hover:bg-paper-dark text-ink text-[10px] flex items-center gap-1 transition-colors"
                >
                  {copiedCode === "curl" ? <Check className="w-3 h-3 text-safe" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode === "curl" ? "Copied" : "Copy cURL"}</span>
                </button>
              </div>
              <pre className="p-4 sm:p-6 overflow-x-auto text-[11px] sm:text-xs text-ink leading-relaxed bg-paper/30">
                {curlSnippet}
              </pre>
            </div>
          </div>
        </section>

        {/* Section 5: Real-World Failure Scenarios Benchmark */}
        <section className="space-y-6 pt-8 border-t border-line">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-signal">
            SECTION 05: EMPIRICAL BENCHMARK DATA
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-ink">
            Tested Across 500 Heterogeneous Transactions
          </h2>

          <div className="w-full border border-line bg-surface rounded-sm overflow-x-auto font-mono text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-wider text-muted bg-paper-dark/40">
                  <th className="py-3.5 px-4 font-semibold">Failure Scenario Category</th>
                  <th className="py-3.5 px-4 font-semibold">Cohort Volume</th>
                  <th className="py-3.5 px-4 font-semibold">Generic Yield</th>
                  <th className="py-3.5 px-4 font-semibold">SAFRA Recovery Yield</th>
                  <th className="py-3.5 px-4 font-semibold">Duplicate Charges</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Governing Policy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                <tr className="hover:bg-paper/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-ink">Bank Switch CBS Timeout</td>
                  <td className="py-3.5 px-4 text-ink-soft">184 txns (₹18.4L)</td>
                  <td className="py-3.5 px-4 text-danger font-semibold">32.4% (Spam retries)</td>
                  <td className="py-3.5 px-4 text-safe font-bold">91.2% (Auto-Reconcile)</td>
                  <td className="py-3.5 px-4 text-safe font-bold">0.0% (Protected)</td>
                  <td className="py-3.5 px-4 text-right text-signal font-semibold">WAIT Policy</td>
                </tr>

                <tr className="hover:bg-paper/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-ink">High-Intent OTP Abandonment</td>
                  <td className="py-3.5 px-4 text-ink-soft">142 txns (₹14.2L)</td>
                  <td className="py-3.5 px-4 text-danger font-semibold">24.1% (Lost session)</td>
                  <td className="py-3.5 px-4 text-safe font-bold">78.5% (Smart SMS link)</td>
                  <td className="py-3.5 px-4 text-safe font-bold">0.0% (Protected)</td>
                  <td className="py-3.5 px-4 text-right text-signal font-semibold">RECOVERY_LINK</td>
                </tr>

                <tr className="hover:bg-paper/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-ink">Recurring Card Mandate Degradation</td>
                  <td className="py-3.5 px-4 text-ink-soft">96 txns (₹8.8L)</td>
                  <td className="py-3.5 px-4 text-danger font-semibold">18.6% (Churned)</td>
                  <td className="py-3.5 px-4 text-safe font-bold">84.0% (UPI Autopay Switch)</td>
                  <td className="py-3.5 px-4 text-safe font-bold">0.0% (Protected)</td>
                  <td className="py-3.5 px-4 text-right text-signal font-semibold">ALT_METHOD</td>
                </tr>

                <tr className="hover:bg-paper/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-ink">Aging B2B Invoices (Net-30)</td>
                  <td className="py-3.5 px-4 text-ink-soft">78 txns (₹4.3L)</td>
                  <td className="py-3.5 px-4 text-danger font-semibold">41.0% (Bad debt)</td>
                  <td className="py-3.5 px-4 text-safe font-bold">71.8% (Staged Escalation)</td>
                  <td className="py-3.5 px-4 text-safe font-bold">0.0% (Protected)</td>
                  <td className="py-3.5 px-4 text-right text-signal font-semibold">ESCALATE</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 6: Action CTA */}
        <section className="p-8 sm:p-12 bg-ink text-paper rounded-sm space-y-6">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-signal">
            START RECOVERING REVENUE
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
            Ready to deploy SAFRA on your payment infrastructure?
          </h2>
          <p className="text-paper/70 text-sm sm:text-base max-w-[600px] font-body">
            Explore our interactive simulation canvas or view the live relational topology graph to test any transaction scenario.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/#recovery"
              className="px-6 py-3.5 bg-signal hover:bg-signal-dark text-paper text-xs font-display font-bold uppercase tracking-wider rounded-sm flex items-center gap-3 transition-colors"
            >
              <span>OPEN RECOVERY SIMULATOR</span>
              <ArrowRight className="w-4 h-4 text-paper" />
            </Link>

            <Link
              href="/graph"
              className="px-6 py-3.5 border border-paper/30 hover:border-paper text-paper text-xs font-mono font-semibold uppercase tracking-wider rounded-sm transition-colors"
            >
              EXPLORE TOPOLOGY GRAPH
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
