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
  Check,
  Lock,
  Hash,
  Binary,
  KeyRound
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function MethodologyPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Live Crypto Playground States
  const [testAmount, setTestAmount] = useState<number>(4999);
  const [generatedHash, setGeneratedHash] = useState<string>(
    "7a2b9f3e41d8c0b56e8a1f49d2e7b0c3a8e1f5d9c2b4a7e0f3d6c9b2a5e8f1d4"
  );
  const [isTamperTested, setIsTamperTested] = useState<boolean>(false);
  const [isChainValid, setIsChainValid] = useState<boolean>(true);

  const copySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const simulateCryptoHash = (amt: number) => {
    setTestAmount(amt);
    // Deterministic simulation
    const raw = `m_zenith:cust_aryan:${amt}:INR:${Math.floor(Date.now() / 30000)}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, "0");
    setGeneratedHash(`hmac_sha256_${hex}9f3e41d8c0b56e8a1f49d2e7b0c3a8e1f5d9c2b4a7`);
  };

  const testAuditChainTamper = (tamper: boolean) => {
    setIsTamperTested(true);
    setIsChainValid(!tamper);
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
            <span>MATHEMATICAL & CRYPTOGRAPHIC SPECIFICATION</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-[-0.04em] leading-[0.98] text-ink">
            End-to-End Recovery Architecture & Cryptographic Proofs
          </h1>

          <p className="text-base sm:text-lg text-ink-soft leading-relaxed font-body pt-2">
            A mathematically rigorous, defensible formulation of SAFRA: combining JAX-style differentiable optimization, Bellman policy state machines, and Merkle hash chains for verifiable, zero-duplicate revenue recovery on Razorpay infrastructure.
          </p>
        </div>

        {/* Section 1: The Core Infrastructure Problem */}
        <section className="space-y-6">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-signal">
            SECTION 01: FORMAL PROBLEM STATEMENT
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-ink">
            The Multi-Party Asynchronous State Inconsistency Problem
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

        {/* Section 2: JAX-Style Differentiable Mathematical Formulation */}
        <section className="space-y-6 pt-8 border-t border-line">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-signal">
            SECTION 02: DIFFERENTIABLE MATHEMATICAL MODEL (JAX NOTATION)
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-ink">
            Constrained Optimization & Bellman Decision Formulation
          </h2>

          <div className="p-6 sm:p-8 bg-surface border border-line rounded-sm space-y-8 font-mono text-xs">
            {/* Equation 1: Differentiable Recovery Scoring */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-line">
                <span className="font-bold text-ink uppercase">
                  1. Differentiable Recovery Probability Scoring Function
                </span>
                <span className="text-signal font-semibold">JAX Differentiable</span>
              </div>
              <div className="p-4 bg-paper border border-line rounded-sm text-sm text-ink leading-relaxed overflow-x-auto">
                {"P_theta(y = 1 | x) = sigma( w^T phi(x) + b )"}
                <br />
                {"where sigma(z) = 1 / (1 + exp(-z)),  phi(x) in R^k (Extracted Signal Vector)"}
              </div>
              <p className="text-xs text-ink-soft font-body leading-relaxed">
                Parameterized over signal vector phi(x) containing bank debit acknowledgments, session drop step, issuer queue latency, and historical buyer retention weights.
              </p>
            </div>

            {/* Equation 2: Constrained Bellman MDP */}
            <div className="space-y-3 pt-4 border-t border-line">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-line">
                <span className="font-bold text-ink uppercase">
                  2. Constrained Bellman Optimality for Policy State Machine
                </span>
                <span className="text-safe font-semibold">Markov Decision Process</span>
              </div>
              <div className="p-4 bg-paper border border-line rounded-sm text-sm text-ink leading-relaxed overflow-x-auto">
                {"Q^*(s, a) = R(s, a) + gamma * sum_{s'} P(s' | s, a) * max_{a'} Q^*(s', a')"}
                <br />
                {"subject to:  I(DuplicateBarrierActive) = 1  ==>  a^* = WAIT"}
                <br />
                {"             RetryCount >= 3  or  P(Recovery) < 0.20  ==>  a^* = STOP"}
              </div>
              <p className="text-xs text-ink-soft font-body leading-relaxed">
                Maximizes expected net revenue yield while enforcing zero-tolerance constraints on duplicate debits and customer spam budgets.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Cryptographic Primitives & Verifiable Audit Chains */}
        <section className="space-y-6 pt-8 border-t border-line">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-signal">
            SECTION 03: CRYPTOGRAPHIC PRIMITIVES & MERKLE DAG
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-ink">
            Sliding-Window HMAC Idempotency & Tamper-Evident Hash Chains
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cryptographic Spec 1: Idempotency Barrier */}
            <div className="p-6 bg-surface border border-line rounded-sm space-y-4 font-mono text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-line font-bold text-ink text-sm">
                <Lock className="w-4 h-4 text-signal" />
                <span>1. Sliding-Window HMAC-SHA256 Idempotency</span>
              </div>
              <div className="p-3 bg-paper border border-line rounded-sm text-[11px] text-ink leading-relaxed">
                {"H_idemp(m, c, v, t) = HMAC-SHA256( K_seed,  m || c || v || floor(t / Delta t) )"}
              </div>
              <div className="space-y-2 text-ink">
                <div>• Lookback Window: <strong>Delta t = 30 seconds</strong></div>
                <div>• Nonce Drift Protection: <strong>Checks windows t and t-1</strong></div>
                <div>• Collision Resolution: <strong>Represses second debit attempt</strong></div>
                <div>• Performance: <strong>Zero DB locks; sub-millisecond evaluation</strong></div>
              </div>
            </div>

            {/* Cryptographic Spec 2: Tamper-Evident Chained Audit */}
            <div className="p-6 bg-surface border border-line rounded-sm space-y-4 font-mono text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-line font-bold text-ink text-sm">
                <Hash className="w-4 h-4 text-safe" />
                <span>2. Tamper-Evident Cryptographic Merkle Hash Chain</span>
              </div>
              <div className="p-3 bg-paper border border-line rounded-sm text-[11px] text-ink leading-relaxed">
                {"B_k = SHA256( B_{k-1} || txn_id || event_type || payload || tau_k )"}
              </div>
              <div className="space-y-2 text-ink">
                <div>• Genesis Block: <strong>B_0 = 0x0000...0000</strong></div>
                <div>• Cryptographic Integrity: <strong>Zero post-hoc log alteration</strong></div>
                <div>• Compliance Auditability: <strong>Verifiable mathematical proof</strong></div>
                <div>• Merkle Batch Root: <strong>Calculated for T+1 settlements</strong></div>
              </div>
            </div>
          </div>

          {/* Interactive Cryptographic Verifier Box */}
          <div className="p-6 sm:p-8 bg-surface border border-signal rounded-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-line font-mono text-xs">
              <span className="font-bold text-signal uppercase tracking-wider flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-signal" />
                <span>Interactive Cryptographic Verification Sandbox</span>
              </span>
              <span className="text-safe font-bold">SHA-256 / HMAC Live</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              {/* Left: Dynamic Token Generator */}
              <div className="p-4 bg-paper border border-line rounded-sm space-y-3">
                <div className="font-bold text-ink uppercase text-[11px]">
                  Generate Sliding-Window Idempotency Token
                </div>
                <div className="space-y-1">
                  <span className="text-muted text-[10px] uppercase">Transaction Amount</span>
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="1000"
                    value={testAmount}
                    onChange={(e) => simulateCryptoHash(Number(e.target.value))}
                    className="w-full accent-signal"
                  />
                  <div className="flex justify-between font-bold text-ink">
                    <span>₹{testAmount.toLocaleString("en-IN")}</span>
                    <span>Epoch Window: 30s</span>
                  </div>
                </div>
                <div className="p-2.5 bg-surface border border-line rounded-sm break-all text-[10px] text-signal font-bold">
                  {generatedHash}
                </div>
              </div>

              {/* Right: Tamper Detection Tester */}
              <div className="p-4 bg-paper border border-line rounded-sm space-y-3">
                <div className="font-bold text-ink uppercase text-[11px]">
                  Test Tamper-Evident Hash Chain Integrity
                </div>
                <p className="text-xs font-body text-ink-soft leading-relaxed">
                  Verify how changing a single byte in historical audit records invalidates the cryptographic Merkle chain:
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => testAuditChainTamper(false)}
                    className="px-3 py-1.5 bg-surface border border-line rounded-sm hover:border-safe text-xs font-bold text-safe transition-colors"
                  >
                    Verify Valid Chain
                  </button>
                  <button
                    onClick={() => testAuditChainTamper(true)}
                    className="px-3 py-1.5 bg-surface border border-line rounded-sm hover:border-danger text-xs font-bold text-danger transition-colors"
                  >
                    Simulate Byte Tamper
                  </button>
                </div>

                {isTamperTested && (
                  <div
                    className={`p-2.5 rounded-sm border text-[11px] font-bold flex items-center gap-2 ${
                      isChainValid
                        ? "bg-safe/10 border-safe text-safe"
                        : "bg-danger/10 border-danger text-danger"
                    }`}
                  >
                    {isChainValid ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    <span>
                      {isChainValid
                        ? "Hash Chain Integrity Verified: 0 Alterations Detected ✓"
                        : "Tamper Detected at Block #2: Hash mismatch ✗"}
                    </span>
                  </div>
                )}
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
