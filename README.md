# SAFRA
### **AI Financial Reality, Uncertainty & Recovery Engine**

> **"When money moves but certainty doesn't."**  
> *We don't tell you a payment is pending. We tell you what is happening to your money.*

---

## 1. The Core Problem SAFRA Solves

Today's payment ecosystems (Banks, Payment Rails, Gateways, Merchants, and Settlement Engines) are exceptional at recording local events, but fragmented at understanding **overall financial reality**.

When an inconsistency occurs, a single transaction has conflicting versions of truth:

```text
CUSTOMER BANK       →  Money Debited ✓
PAYMENT RAIL (UPI)  →  Acknowledged ✓
PAYMENT GATEWAY     →  Processing ⟳
MERCHANT STORE      →  Payment Not Received ✗
SETTLEMENT SYSTEM   →  No Settlement Yet ⏳
```

Every system is technically correct according to its own logs, but the **overall financial reality is uncertain**.

This creates three critical industry problems:
1. **Individual Consumer Uncertainty**: *"Where is my money? Why is my ₹4,999 pending? Should I pay again?"*
2. **Merchant Financial Drift**: Expected revenue (₹12,45,000) vs Observed revenue (₹11,72,000) = **₹73,000 in unexplained financial drift**.
3. **Systemic Payment Incidents**: 1,842 payments suddenly become pending due to an upstream bank latency spike, flooding support channels before operations even detects the root cause.

---

## 2. The SAFRA Solution: Financial Reality Graph & State Machine

SAFRA treats `PENDING` not as a dead-end status, but as an **active investigation state**.

```text
                             PAYMENT INITIATED
                                     │
                                     ▼
                      ┌─────────────────────────────┐
                      │    FINANCIAL UNCERTAINTY    │
                      └──────────────┬──────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
  LIKELY SUCCESS              LIKELY REVERSAL           REQUIRES INTERVENTION
   (e.g., 81%)                  (e.g., 14%)                  (e.g., 5%)
         │                           │                           │
  Predict Time                Predict Time              Autonomous AI Agent
   (4–9 mins)                 (12–24 hrs)                 Investigation
```

### The 4 Core Questions SAFRA Answers:
1. **Where is the money?** — Reconstructs full financial trace across Customer, Bank, Rail, Gateway, Merchant, Settlement.
2. **What most likely happened?** — Evaluates graph topological drift, missing edges, and latency anomalies.
3. **What will happen next?** — Real ML classifiers predict outcome probability ($P(\text{Success}) = 81\%$, $P(\text{Reversal}) = 14\%$) and estimated resolution time (6.5 mins).
4. **What should we do?** — Proactively warns against duplicate retries, clusters systemic incidents, simulates recovery scenarios, and executes playbooks with human approval.

---

## 3. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             FINANCIAL EVENT STREAM                          │
│        (Payments, Bank Debits, Rails, Gateways, Callbacks, Settlements)     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SAFRA BACKEND (FASTAPI)                            │
│                                                                             │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌──────────────────┐ │
│  │ Financial Reality     │  │ ML Intelligence      │  │ Groq Agentic     │ │
│  │ Graph (NetworkX)      │  │ (Isolation Forest,    │  │ Investigator     │ │
│  │ - Dynamic Node/Edges  │  │  XGBoost, Regressors) │  │ - Tool Calling   │ │
│  │ - Drift & Edge Rules  │  │ - Outcome Probability │  │ - Evidence Trail │ │
│  └───────────┬───────────┘  └───────────┬───────────┘  └────────┬─────────┘ │
│              │                          │                       │           │
│              └──────────────────────────┼───────────────────────┘           │
│                                         ▼                                   │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ Core Engines:                                                          │ │
│  │ • Incident Clustering (Multi-feature Graph Density)                   │ │
│  │ • Duplicate Payment Guardian (97% Proximity Collision Barrier)        │ │
│  │ • Merchant Digital Twin (Expected vs Observed Reconciliation)          │ │
│  │ • Blast Radius & Counterfactual Causal Simulator                       │ │
│  │ • Recovery Scenario Lab & Playbook Orchestrator (Human-in-the-loop)   │ │
│  │ • Incident Memory (Semantic Vector & Pattern Lookup)                   │ │
│  └──────────────────────────────────────┬─────────────────────────────────┘ │
│                                         │                                   │
│  ┌──────────────────────────────────────┴─────────────────────────────────┐ │
│  │ Database & Storage: SQLite/PostgreSQL (SQLAlchemy 2.0) + WebSockets    │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Real-time WebSockets & REST APIs
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SAFRA FRONTEND (NEXT.JS)                           │
│                                                                             │
│  • Command Center Dashboard (Financial Reality Score 0-100, Live KPIs)     │
│  • "Where Is My Money?" Consumer Trace & Duplicate Guardian Warning         │
│  • 3-Column AI Investigation Room (Timeline | React Flow Graph | Agent)     │
│  • Dynamic Financial Reality Graph Canvas (Interactive Node Exploration)    │
│  • Financial Incident Radar & Blast Radius Visualizer                       │
│  • Merchant Digital Twin (Drift Breakdown & Missing Edge Attribution)       │
│  • Recovery Simulation Lab (Scenario A/B/C Comparison & Approval Gate)      │
│  • Incident Replay Scrubber (Step-by-step Temporal Playback)                │
│  • Live Traffic & Failure Injection Simulator                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Key Features

| Feature | Description |
| :--- | :--- |
| **Financial Reality Graph** | Dynamic NetworkX directed multigraph modeling Customers, Payments, Banks, Rails, Gateways, Merchants, Settlements, and Incidents. |
| **Where Is My Money?** | Hero consumer portal for tracing transaction lifecycles, viewing outcome probabilities (81% Success), and receiving instant advice. |
| **Duplicate Payment Guardian** | Detects customer retry attempts within proximity windows for identical amounts/merchants and blocks duplicate debits. |
| **Groq Agentic Investigator** | Tool-calling AI agent that traverses the graph, queries similar cohorts, checks bank telemetry, and synthesizes root causes with deterministic fallback. |
| **Incident Clustering** | Automatically groups 1,842 individual pending payments sharing bank and rail anomalies into 1 actionable systemic incident. |
| **Blast Radius Forecast** | Forward graph propagation predicting downstream pending volume (+620 txns) and rupee exposure (+₹14.2L) over next 30 minutes. |
| **Counterfactual Causal Engine** | Evaluates baseline vs. excess pending volume to prove that 87% of observed uncertainty is causally attributable to a specific bank node. |
| **Merchant Digital Twin** | Reconciles Expected Revenue (₹12.45L) vs Observed Revenue (₹11.72L), attributing ₹73,000 drift to missing graph edges. |
| **Recovery Simulation Lab** | Compares Scenario A (Do Nothing), Scenario B (Notify Merchant), and Scenario C (SAFRA Playbook) with resolution time and residual exposure metrics. |
| **Human-in-the-Loop Gate** | Strictly enforces human review before executing recovery playbooks (Retry Callbacks, Activate Guardian, Escalate to Ops). |
| **Incident Temporal Replay** | Interactive scrubber to replay the exact timeline of an incident from latency surge to automated mitigation. |
| **Mission Control Simulator** | One-click failure injection for systemic UPI outages, merchant webhook drops, and topology resets. |

---

## 5. Technology Stack

- **Backend**: Python 3.11, FastAPI, SQLAlchemy 2.0, Pydantic v2, NetworkX, Scikit-Learn, Uvicorn, WebSockets.
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, `@xyflow/react` (React Flow), Recharts, Framer Motion, Lucide Icons, Axios.
- **Database**: SQLite (default, zero-configuration local execution) / PostgreSQL (with asyncpg & pgvector compatibility).
- **AI / LLM**: Groq API (`llama-3.3-70b-versatile`) with full deterministic fallback engine.

---

## 6. Getting Started & Running Locally

### Prerequisites
- Node.js (v18+) & npm
- Python (v3.10+) & pip

### Step 1: Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
*The backend automatically creates the database, trains ML models on boot, and seeds the canonical financial topology.*
- API Documentation: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/api/health`

### Step 2: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:3000` in your browser.

---

## 7. Running with Docker Compose
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

---

## 8. Running Automated Tests
```bash
python -m pytest backend/tests/ -v
```
*Runs complete unit and integration tests for Graph validation, ML model inference, Duplicate Guardian, and REST API endpoints.*

---

## 9. Primary Demo Flow (For Judges & Pitch)

1. **Step 1 — Where Is My Money?**:
   - Go to `/trace` and inspect the ₹4,999 pending payment (`PAY-4999-HERO`).
   - Notice that Customer Bank debited (✓) and NPCI UPI acknowledged (✓), but Merchant confirmation is missing (✗).
   - See the 81% Success Probability and resolution estimate (6.5 mins).
2. **Step 2 — Duplicate Guardian**:
   - Click "Simulate Retry Payment" on `/trace`.
   - The Duplicate Payment Guardian detects 97% similarity and advises: *"DO NOT PAY AGAIN"*.
3. **Step 3 — 3-Column AI Investigation Room**:
   - Click "AI Agent Investigation Room" (`/investigate/PAY-4999-HERO`).
   - Watch the Groq Agent execute real backend tools: graph traversal, cohort comparison, bank health queries, and structured root-cause synthesis.
4. **Step 4 — Systemic Incident Clustering & Blast Radius**:
   - In `/simulator`, click *"Inject 1,842 UPI Incident"*.
   - Navigate to `/radar` to see 1,842 transactions clustered into 1 incident with +620 txns 30m blast radius forecast and 87% counterfactual attribution.
5. **Step 5 — Merchant Digital Twin & Recovery Lab**:
   - Navigate to `/merchant` to view ₹12.45L vs ₹11.72L = ₹73,000 unexplained drift broken down by missing edges.
   - Navigate to `/recovery`, compare Scenarios A/B/C, and click *"Approve & Execute Playbook"*.
6. **Step 6 — Incident Replay**:
   - Navigate to `/replay` and scrub through the temporal evolution from 14:00 baseline to 14:31 mitigation.

---

## 10. License
Apache 2.0 — Built for the Razorpay Buildathon.
