# SAFRA: Signal-Aware Financial Revenue Agent
### **Autonomous Revenue Recovery Intelligence & Large-Scale Payment Ecosystem (Razorpay AI Buildathon: Track 03)**

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

**SAFRA (Signal-Aware Financial Revenue Agent)** operates as an **investigative state machine, large-scale payment simulation ecosystem, and bounded workflow engine**. It continuously ingests payment stream telemetry, reconstructs transaction graph trails, computes deterministic recovery probabilities, and executes mathematically bounded actions with anti-spam stopping rules and cryptographic idempotency barriers.

---

## 🧪 2. Large-Scale Payment Simulation Engine (`/lab`)

> **Label:** `SIMULATED PAYMENT INTELLIGENCE ENVIRONMENT`  
> *Notice: Never imply that simulated provider statistics represent real Razorpay, NPCI, bank, Google Pay, PhonePe, Paytm, or other production data.*

SAFRA combines:
```
Payment Gateway Simulator + Payment Operations Control Room + Revenue Recovery Engine + Incident Response Lab + AI Decision Intelligence
```

### Complete Event-Driven Payment Lifecycle:
```
PAYMENT_CREATED ──► CHECKOUT_STARTED ──► PAYMENT_METHOD_SELECTED ──► PAYMENT_ATTEMPTED
                                                                             │
┌───────────────────────────────┬────────────────────────────────────────────┘
│                               │
▼                               ▼
AUTHORIZATION ──► PROCESSING ──► OUTCOME:
                                 ├── SUCCESS ──► COMPLETED SETTLEMENT
                                 ├── PENDING ──► SAFRA ANALYSIS ──► WAIT (5m) / IDEMPOTENCY BARRIER
                                 └── FAILED  ──► SAFRA ANALYSIS ──► BOUNDED RECOVERY POLICY
```

---

## ⚙️ 3. Core Large-Scale Simulation Capabilities

### A. 5 Simulation Scale Levels:
1. **LEVEL 1 — DEMO:** 100 to 1,000 payments (2 to 5 minutes) for pitch demonstrations.
2. **LEVEL 2 — MERCHANT DAY:** 10,000 to 50,000 payments modeling a busy merchant day.
3. **LEVEL 3 — HIGH VOLUME:** 100,000 to 500,000 payments for throughput benchmarking.
4. **LEVEL 4 — STRESS TEST:** 1,000,000+ simulated payment events using event batching (`EVENT_BATCH`).
5. **LEVEL 5 — INCIDENT MODE:** 50,000 payments/min under cascading shocks.

### B. Virtual Time Engine ($1\times$ to $1000\times$):
- Decouples simulation time ($t_{\text{sim}}$) from wall-clock time (`▶ PLAY`, `Ⅱ PAUSE`, `■ RESET`, `↻ STEP`).
- 24 hours of simulated traffic can run in 2 to 10 minutes.
- Virtual clock drives timestamps, retry schedules, provider incidents, customer responses, and due dates.

### C. Deterministic PRNG Seeds & Bit-for-Bit Reproducibility:
- Every simulation runs on a reproducible random seed (e.g. `SEED: SAFRA-2026-DEMO`).
- Identical `(seed, scenario, config)` produces bit-for-bit identical event streams and recovery outcomes (`COPY SEED`, `REPLAY WITH SAME SEED`).

### D. 6 Merchant Business Profiles:
1. `DIGITAL_COMMERCE`: High volume, UPI heavy (65%), AOV ₹1,499, checkout abandonment.
2. `SUBSCRIPTION_SAAS`: Recurring mandate billing (70%), AOV ₹4,999, token degradation.
3. `B2B_SAAS`: Large invoices (65%), AOV ₹85,000, Net-30 overdue terms, promise-to-pay tracking.
4. `MARKETPLACE`: High traffic, multiple sub-sellers, variable cart sizes (AOV ₹2,450).
5. `EDUCATION_PLATFORM`: Periodic admission spikes, high-ticket installments (AOV ₹28,000).
6. `TRAVEL_PLATFORM`: Booking urgency, seat expiry, multi-rail failovers (AOV ₹12,500).

### E. 5 Customer Behavioral Populations:
- `NEW_CUSTOMER`, `RETURNING_CUSTOMER`, `HIGH_VALUE_CUSTOMER`, `SUBSCRIPTION_CUSTOMER`, `AT_RISK_CUSTOMER`.
- Stateful agents with memory: `payment_success_history`, `retry_response_rate`, `intervention_fatigue`, and `fatigue_tolerance`.

---

## 💥 4. 10 Incident Library & Flagship Scenario

### 10 Predefined Major Incidents + Black Swan Mode:
1. `PAYDAY_SURGE`: 3.8x traffic spike across UPI rails.
2. `FLASH_SALE`: 5.2x checkout rush causing queue congestion.
3. `BANK_LATENCY_DEGRADATION`: HDFC switch latency jumps to 2,400ms.
4. `UPI_TIMEOUT_WAVE`: NPCI 504 gateway timeout cluster.
5. `CARD_ISSUER_FAILURE`: 3DS2 card authorization server rejects 52% of attempts.
6. `NETWORK_PARTITION`: Out-of-order webhook delivery requiring state machine reconciliation.
7. `RECOVERY_QUEUE_OVERLOAD`: 10k+ failed payments requiring knapsack prioritization.
8. `MULTI_PROVIDER_INCIDENT`: Simultaneous HDFC + SBI degradation.
9. `CHECKOUT_ABANDONMENT_SPIKE`: SMS OTP delivery delays trigger 48% cart dropoff.
10. `SILENT_REVENUE_LEAK`: Subtle 8.5% mandate degradation slowly leaking ₹12L/day.
11. `★ BLACK SWAN MODE`: Payday Surge + Bank Latency + Network Delay + Retry Explosion.

### Flagship Scenario: THE ₹10 CRORE PAYMENT DAY
- 24-Hour simulated timeline across 250,000+ payments:
  - **Total GMV:** ₹10,00,00,000
  - **Peak Revenue at Risk:** ₹1,42,50,000
  - **Baseline Recovery:** ₹48,20,000
  - **SAFRA Adaptive Recovery:** ₹1,18,60,000
  - **Net Incremental Value Created:** **+₹70,40,000**
  - **Spam Interventions Avoided:** 42,180

---

## 📐 5. Mathematical & Statistical Formulations

### A. Statistical Payment Distributions:
- **Log-Normal Amount:** $\ln(X) \sim \mathcal{N}(\mu, \sigma^2)$ where $\mu = \ln(\text{Median AOV})$.
- **Poisson Arrival Process:** Non-homogeneous Poisson timing with diurnal curve $\lambda(t) = \lambda_0 \cdot \text{diurnal}(t)$.
- **Pareto Latency:** $P(X > x) = (x_m / x)^\alpha$ modeling long-tail banking spikes.

### B. Prioritized Recovery Knapsack under Budget Constraints:
$$\text{Priority} = \text{Amount} \times \hat{P}_{\text{recovery}} \times \text{Urgency} \times \text{CustomerLoyalty} \times \text{Feasibility}$$
Subject to:
$$\sum \text{Interventions} \le C_{\text{max\_rate}} \quad \text{and} \quad \sum \text{Cost} \le \text{Budget}_{\text{cap}}$$

### C. Monte Carlo Research Engine:
Executes $N \in [10, 50, 100]$ simulation trials across randomized seeds, computing 95% Confidence Intervals:
$$\text{CI}_{95\%} = \bar{X} \pm 1.96 \cdot \frac{s}{\sqrt{N}}$$

---

## 📊 6. Benchmark Multi-Strategy Comparison

| Performance Dimension | Strategy A (Retry All) | Strategy B (Top 30% Value) | Strategy C (Prob Threshold) | Strategy D (SAFRA Adaptive) |
| :--- | :--- | :--- | :--- | :--- |
| **Interventions Count** | 500 (100% spam) | 150 actions | 185 actions | **142 bounded actions** |
| **Intervention Cost** | ₹21,000 | ₹6,300 | ₹7,770 | **₹3,578 (Smart WAIT)** |
| **Customer Fatigue** | 78.5 (Critical) | 42.0 (Elevated) | 32.0 (Moderate) | **14.5 (Healthy)** |
| **Duplicate Debits** | 14.2% rate | 8.4% rate | 3.2% rate | **0.0% (HMAC Barrier)** |
| **Net Value Created** | ₹14.38L | ₹23.42L | ₹29.15L | **₹39.71L (+₹25.33L)** |

---

## 🛠️ 7. Local Development & Testing

```bash
# Clone the repository
git clone https://github.com/Premchandyadav369/SAFRA.git
cd SAFRA

# Backend Setup
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

# Run All 32 Pytest Unit, Crypto, Recovery, Simulation & Monte Carlo Tests
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
