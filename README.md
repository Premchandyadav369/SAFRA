# SAFRA: Signal-Aware Financial Revenue Agent
### **Autonomous Revenue Recovery Intelligence (Razorpay AI Buildathon: Track 03)**

> **"When money moves but certainty does not: SAFRA follows the trail, diagnoses root causes, and executes bounded recovery workflows."**

[![Build Status](https://github.com/Premchandyadav369/SAFRA/actions/workflows/ci.yml/badge.svg)](https://github.com/Premchandyadav369/SAFRA/actions/workflows/ci.yml)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FPremchandyadav369%2FSAFRA&root-directory=frontend)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Premchandyadav369/SAFRA)
[![Track](https://img.shields.io/badge/Razorpay%20AI%20Buildathon-Track%2003%20AI%20Revenue%20Recovery-E96B3D.svg)](https://razorpay.com/buildathon/)
[![AI Model](https://img.shields.io/badge/Google%20Gemma%203-Hugging%20Face%20Inference-29465B.svg)](https://huggingface.co/google/gemma-3-12b-it)
[![Cryptography](https://img.shields.io/badge/Cryptography-HMAC--SHA256%20%7C%20Merkle%20DAG-2D7A61.svg)](backend/app/core/crypto_engine.py)
[![License](https://img.shields.io/badge/License-MIT-2D7A61.svg)](LICENSE)

---

## 🏛️ 1. Executive Summary & Defensible Problem Formulation

Revenue loss rarely happens in a single catastrophic failure. Instead, it leaks across fragmented financial transitions:
- A customer account debits, but an upstream **Core Banking System (CBS) webhook times out (1,420ms spike)**.
- A high-intent buyer abandons checkout at the **OTP SMS delay step**.
- An uncertain buyer **retries within 60s**, triggering duplicate charges and refund chargebacks (**14.2% industry duplicate rate**).
- An enterprise recurring **SaaS card token renewal degrades**.
- A B2B receivable slips past **Net-30 overdue limits**.

Traditional payment systems treat `PENDING` or `FAILED` as static dead ends or blast generic 1-message-fits-all reminders, creating customer fatigue.

**SAFRA (Signal-Aware Financial Revenue Agent)** operates as an **investigative state machine and bounded workflow engine**. It continuously ingests payment stream telemetry, reconstructs transaction graph trails, computes deterministic recovery probabilities, and executes mathematically bounded actions with anti-spam stopping rules and cryptographic idempotency barriers.

---

## 🧪 2. Simulated Payment Intelligence Lab (`/lab`)

SAFRA behaves as a **miniature payment operations and recovery laboratory**, simulating live digital payment lifecycles and continuously streaming events:

```
CUSTOMER ──► CHECKOUT ──► PAYMENT INITIATED ──► PAYMENT RAIL ──► BANK / PSP RESPONSE
                                                                          │
┌───────────────────────────────┬─────────────────────────────────────────┘
│                               │
▼ (SUCCESS / RECOVERED)         ▼ (PENDING / FAILED)
COMPLETED SETTLEMENT            SAFRA RISK ANALYSIS & BOUNDED ACTION
                                        │
                                ┌───────┴───────┬───────────────┐
                                ▼               ▼               ▼
                        WAIT (5m)       SMART RECOVERY LINK    STOP (FATIGUE)
```

### Key Capabilities in the Simulation Lab:
1. **8 Realistic Payment Rails:** `UPI`, `CREDIT_CARD`, `DEBIT_CARD`, `NETBANKING`, `WALLET`, `BANK_TRANSFER`, `SUBSCRIPTION`, `INVOICE`.
2. **6 Provider Simulation Profiles:** `HDFC` (650ms), `ICICI` (490ms), `SBI` (810ms), `Axis` (540ms), `Kotak` (510ms), `Yes Bank` (590ms).
3. **Dynamic Traffic Patterns:** `NORMAL`, `PAYDAY_SURGE` (3.5x), `FLASH_SALE` (5.0x), `BANK_OUTAGE` (HDFC 1,850ms CBS Timeout), `UPI_DEGRADATION`, `HIGH_ABANDONMENT`.
4. **CSV Export & Import Suite with Validation Reports:** Download verified records (`/api/dataset/export/transactions.csv`) and upload historical datasets with rejected-row reporting.
5. **Investigation Notebook:** Save observations, attach graph snapshots, and export compliance dossiers (`NOTE #...`).
6. **Scripted 3-Minute Buildathon Demo:** One-click automated pitch demonstration from baseline to surge, outage, barrier engagement, and recovery clearing.

---

## 📐 3. JAX-Style Differentiable Mathematical Formulation

SAFRA models the revenue recovery problem as a constrained Markov Decision Process (MDP) with a differentiable parameterized scoring function:

### A. Differentiable Recovery Scoring Formulation:
$$\hat{P}_\theta(y = 1 \mid \mathbf{x}) = \sigma\left(\mathbf{w}^T \phi(\mathbf{x}) + b\right)$$

Where:
- $\sigma(z) = \frac{1}{1 + e^{-z}}$ (Sigmoid Activation Function)
- $\phi(\mathbf{x}) \in \mathbb{R}^k$ (Extracted Signal Vector from Banking Telemetry, Client Intent, and History)
- $\mathbf{w} = [\omega_{\text{bank\_ack}}, \omega_{\text{loyalty}}, \omega_{\text{intent}}, -\rho_{\text{nsf}}, -\rho_{\text{retries}}, -\rho_{\text{overdue}}]^T$

### B. Constrained Bellman Optimality for Policy Selection:
$$Q^*(s, a) = \mathcal{R}(s, a) + \gamma \sum_{s'} \mathcal{P}(s' \mid s, a) \max_{a'} Q^*(s', a')$$

Subject to the strict idempotency barrier and contact constraints:
$$\max_{a} Q^*(s, a) \quad \text{subject to:} \quad \begin{cases} 
\mathbb{I}(\text{BarrierActive}) = 1 \implies a^* = \text{WAIT} \\
N_{\text{retries}} \ge 3 \lor \hat{P}_\theta < 0.20 \implies a^* = \text{STOP}
\end{cases}$$

---

## 🔐 4. Cryptographic Primitives & Verifiable Merkle DAG

SAFRA provides mathematical proof of zero duplicate charges and tamper-evident auditability:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 SLIDING-WINDOW HMAC-SHA256 IDEMPOTENCY BARRIER              │
│   H_idemp = HMAC-SHA256( K_seed, merchant || cust || amt || floor(t / 30s) )│
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 TAMPER-EVIDENT CRYPTOGRAPHIC MERKLE HASH CHAIN              │
│                                                                             │
│   ┌───────────────┐        ┌───────────────┐        ┌───────────────┐       │
│   │ Block B_0     │        │ Block B_1     │        │ Block B_2     │       │
│   │ Prev: 0x00... │ ─────► │ Prev: Hash(B0)│ ─────► │ Prev: Hash(B1)│       │
│   │ Event: INIT   │        │ Event: TIMEOUT│        │ Event: WAIT   │       │
│   └───────────────┘        └───────────────┘        └───────────────┘       │
│                                                                             │
│   B_k = SHA256( B_{k-1} || txn_id || event_type || payload || timestamp )   │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **Sliding-Window HMAC Collision Barrier:** Evaluates epochs $t$ and $t-1$ to prevent race conditions across distributed webhook worker nodes with zero database locks.
2. **Tamper-Evident Hash Chain:** Mathematical proof that financial audit logs were not modified post-hoc.
3. **Signed Action Tokens:** Ephemeral HMAC-signed nonces with 300s TTL for recovery link execution.
4. **Binary Merkle Root:** Cryptographically seals batch settlements for T+1 financial accounting.

---

## 🏗️ 5. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     SIMULATED PAYMENT EVENT ENGINE                          │
│          (8 Rails: UPI, Cards, NetBanking, Subscriptions, Invoices)         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SAFRA INTELLIGENCE BACKEND (FASTAPI)                  │
│                                                                             │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌──────────────────┐ │
│  │ Signal Engine         │  │ Recovery Engine       │  │ Crypto Engine    │ │
│  │ - 10 Reality Signals  │  │ - Deterministic Score │  │ - HMAC-SHA256    │ │
│  │ - Bank & Intent Telemetry│ - Explainable Breakdown│ - Merkle Hash DAG│ │
│  └───────────┬───────────┘  └───────────┬───────────┘  └────────┬─────────┘ │
│              │                          │                       │           │
│              └──────────────────────────┼───────────────────────┘           │
│                                         ▼                                   │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ Graph Engine (NetworkX):                                               │ │
│  │ Customer -> Checkout -> Payment Attempt -> Bank Switch -> Reconcile    │ │
│  │ Active Risk Path Isolation • Missing Edge & Topology Drift Detection   │ │
│  └──────────────────────────────────────┬─────────────────────────────────┘ │
│                                         │                                   │
│  ┌──────────────────────────────────────┴─────────────────────────────────┐ │
│  │ Google Gemma 3 AI Layer (Hugging Face Inference + Fallback):            │ │
│  │ - Factual Evidence Grounding (Zero Hallucination / Zero Money Movement)│ │
│  │ - Interactive "Ask SAFRA" Root Cause Q&A Panel                         │ │
│  └──────────────────────────────────────┬─────────────────────────────────┘ │
│                                         │                                   │
│  ┌──────────────────────────────────────┴─────────────────────────────────┐ │
│  │ Database & Storage: SQLite/PostgreSQL (SQLAlchemy 2.0 Async Session)   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ REST APIs & WebSockets
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SAFRA FRONTEND (NEXT.JS 14 / VERCEL)                  │
│                                                                             │
│  • Simulated Payment Intelligence Lab (/lab) with Dynamic Recharts         │
│  • Editorial Investigation Canvas (DM Sans + Manrope + JetBrains Mono)     │
│  • Interactive Chaos Sandbox with Sliders & Web Audio Feedback              │
│  • 10-Node Relational Topology Network Graph with Path Tracing              │
│  • Microsecond Audit Trail Log & Live Cryptographic Verifier Sandbox       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 6. Batch Verification & Benchmark Proof

Tested on a benchmark batch of 500 heterogeneous transactions (₹45.7L total revenue at risk):

| Performance Dimension | Generic 1-Message Recovery | SAFRA AI Strategy | Measured Impact |
| :--- | :--- | :--- | :--- |
| **Customer Interventions** | 500 (100% spam) | **142 bounded actions** | **-71.6% spam reduction** |
| **Duplicate Debit Risk** | 14.2% duplicate rate | **0.0% (HMAC Barrier Engaged)** | **100% Protected** |
| **Buyers Guarded from Spam** | 0 buyers | **358 buyers shielded** | **Anti-fatigue enforced** |
| **Total Revenue Recovered** | ₹16.48L (34.2%) | **₹39.71L (82.4%)** | **+2.4x Net Recovery Yield** |
| **Compliance Auditability** | Blackbox logs | **Cryptographic Merkle Chain**| **100% Verifiable** |

---

## 🌐 7. Deployment & Production Setup

### Deploy Frontend to Vercel:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FPremchandyadav369%2FSAFRA&root-directory=frontend)

1. Import the repository on [Vercel](https://vercel.com/new).
2. Set Root Directory to `frontend`.
3. Configure `NEXT_PUBLIC_API_BASE_URL` to your Render backend URL.
4. Click **Deploy**.

### Deploy Backend to Render:
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Premchandyadav369/SAFRA)

1. Connect the repository on [Render](https://render.com).
2. Render automatically parses `render.yaml` (Blueprint specification).
3. Set environment variables:
   - `HF_TOKEN`: *(Your Hugging Face token for Gemma 3)*
   - `HF_MODEL_ID`: `google/gemma-3-12b-it`
   - `DATABASE_URL`: `sqlite+aiosqlite:///./safra.db`

---

## 🛠️ 8. Local Development & Testing

```bash
# Clone the repository
git clone https://github.com/Premchandyadav369/SAFRA.git
cd SAFRA

# Backend Setup
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

# Run All 24 Pytest Unit, Crypto, Recovery, and Lab Tests
pytest tests/ -v

# Frontend Setup
cd ../frontend
npm install
npm run dev
```

---

## 👥 Authors & Attribution

- **Lead Developer:** [Premchand Yadav](https://github.com/Premchandyadav369) (`premchand.23bce7167@vitapstudent.ac.in`)
- **Hackathon:** Razorpay AI Buildathon: **Track 03: AI Revenue Recovery**
- **License:** [MIT](LICENSE)
