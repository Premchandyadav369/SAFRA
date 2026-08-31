"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Activity,
  Radio,
  SlidersHorizontal,
  Flame,
  Download,
  Upload,
  BookOpen,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Search,
  Check,
  Copy,
  BarChart3,
  HelpCircle,
  Zap,
  Crosshair,
  GitBranch,
  X
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function LargeScaleSimulationControlRoom() {
  // Virtual Time & PRNG Engine States
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [virtualSpeed, setVirtualSpeed] = useState<number>(1.0);
  const [simTime, setSimTime] = useState<string>("09:15:32");
  const [simulationSeed, setSimulationSeed] = useState<string>("SAFRA-2026-DEMO");
  const [seedCopied, setSeedCopied] = useState<boolean>(false);
  const [scaleLevel, setScaleLevel] = useState<string>("LEVEL_1_DEMO");
  const [merchantProfile, setMerchantProfile] = useState<string>("DIGITAL_COMMERCE");
  const [activeScenario, setActiveScenario] = useState<string>("NORMAL");

  // Dynamic Telemetry State
  const [telemetry, setTelemetry] = useState<any>({
    total_events_processed: 84218,
    total_gmv_inr: 49820000.0,
    success_rate_pct: 88.6,
    revenue_at_risk_inr: 1420500.0,
    recovered_revenue_inr: 1198400.0,
    recovery_rate_pct: 84.3,
    duplicates_prevented: 1248,
    interventions_executed: 894,
    failed_queue_length: 42,
    recent_events: [
      { sim_time: "09:15:28", transaction_id: "txn_842194", status: "SUCCESS", amount: 4999, payment_method: "UPI", bank: "HDFC" },
      { sim_time: "09:15:29", transaction_id: "txn_842195", status: "PENDING", amount: 14500, payment_method: "CREDIT_CARD", bank: "ICICI" },
      { sim_time: "09:15:31", transaction_id: "txn_842196", status: "FAILED", amount: 2800, payment_method: "UPI", bank: "SBI" }
    ]
  });

  // Anomaly Detection & Root Cause State
  const [anomalyData, setAnomalyData] = useState<any>({
    anomaly_detected: false,
    z_latency: 0.84,
    current_ewma_latency: 560.0,
    ranked_hypotheses: [
      {
        rank: 1,
        title: "Nominal Baseline Payment Operation",
        confidence_score: 0.98,
        evidence: [
          "All provider switches responding within SLA boundaries (< 800ms)",
          "Timeout and failure rates within standard 95% confidence intervals"
        ],
        recommended_action: "STANDARD_MONITORING"
      }
    ]
  });

  // Recovery Queue Prioritizer State
  const [maxInterventions, setMaxInterventions] = useState<number>(500);
  const [recoveryBudget, setRecoveryBudget] = useState<number>(50000);
  const [prioritizedQueue, setPrioritizedQueue] = useState<any>({
    allocated_count: 38,
    wait_count: 14,
    stopped_fatigue_count: 6,
    unviable_count: 4,
    total_intervention_cost_inr: 1596.0,
    total_expected_recovery_inr: 184200.0,
    expected_net_roi_multiple: 115.4,
    top_allocated_actions: [
      { rank: 1, transaction_id: "txn_84210", amount: 84200, recovery_probability: 0.88, priority_score: 65200, decision: "EXECUTE_OPTIMAL_INTERVENTION" },
      { rank: 2, transaction_id: "txn_84211", amount: 62500, recovery_probability: 0.74, priority_score: 41600, decision: "EXECUTE_OPTIMAL_INTERVENTION" },
      { rank: 3, transaction_id: "txn_84212", amount: 28000, recovery_probability: 0.82, priority_score: 21800, decision: "EXECUTE_OPTIMAL_INTERVENTION" }
    ]
  });

  // Multi-Strategy Comparison State
  const [strategyReport, setStrategyReport] = useState<any>(null);

  // Monte Carlo Experiment State
  const [monteCarloReport, setMonteCarloReport] = useState<any>(null);
  const [isMonteCarloRunning, setIsMonteCarloRunning] = useState<boolean>(false);

  // Flagship ₹10 Crore Day State
  const [flagshipActive, setFlagshipActive] = useState<boolean>(false);
  const [flagshipStageIndex, setFlagshipStageIndex] = useState<number>(0);
  const [flagshipData, setFlagshipData] = useState<any>(null);

  // Modals
  const [incidentModalOpen, setIncidentModalOpen] = useState<boolean>(false);
  const [assumptionsModalOpen, setAssumptionsModalOpen] = useState<boolean>(false);
  const [incidentType, setIncidentType] = useState<string>("BANK_LATENCY_DEGRADATION");
  const [incidentSeverity, setIncidentSeverity] = useState<number>(0.65);
  const [incidentDuration, setIncidentDuration] = useState<number>(10);
  const [incidentTargetProvider, setIncidentTargetProvider] = useState<string>("HDFC");

  // Fetch telemetry continuously every 2 seconds
  useEffect(() => {
    let timer: any;
    const fetchStatus = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/simulation/status");
        if (res.ok) {
          const data = await res.json();
          setTelemetry(data);
          setSimTime(data.sim_time);
          setIsPlaying(data.is_playing);
        }
      } catch {
        // Fallback simulation tick in UI
        setSimTime((prev) => {
          const parts = prev.split(":").map(Number);
          let s = parts[2] + Math.round(virtualSpeed);
          let m = parts[1];
          let h = parts[0];
          if (s >= 60) {
            m += Math.floor(s / 60);
            s %= 60;
          }
          if (m >= 60) {
            h += Math.floor(m / 60);
            m %= 60;
          }
          return `${String(h % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
        });
      }
    };

    fetchStatus();
    timer = setInterval(fetchStatus, 2000);
    return () => clearInterval(timer);
  }, [virtualSpeed]);

  // Handle Simulation Controls
  const handleControlAction = async (action: string) => {
    try {
      await fetch("http://localhost:8000/api/simulation/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      if (action === "PLAY") setIsPlaying(true);
      if (action === "PAUSE") setIsPlaying(false);
      if (action === "RESET") {
        setTelemetry((prev: any) => ({ ...prev, total_events_processed: 0, total_gmv_inr: 0 }));
      }
    } catch {
      if (action === "PLAY") setIsPlaying(true);
      if (action === "PAUSE") setIsPlaying(false);
    }
  };

  const handleSpeedChange = async (speed: number) => {
    setVirtualSpeed(speed);
    try {
      await fetch("http://localhost:8000/api/simulation/speed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speed })
      });
    } catch {}
  };

  const handleScaleChange = async (scale: string) => {
    setScaleLevel(scale);
    try {
      await fetch("http://localhost:8000/api/simulation/scale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scale })
      });
    } catch {}
  };

  const handleMerchantChange = async (profile: string) => {
    setMerchantProfile(profile);
    try {
      await fetch("http://localhost:8000/api/simulation/merchant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchant_profile: profile })
      });
    } catch {}
  };

  const handleScenarioSelect = async (scKey: string) => {
    setActiveScenario(scKey);
    try {
      await fetch(`http://localhost:8000/api/simulation/scenario/select?scenario_key=${scKey}`, {
        method: "POST"
      });
    } catch {}
  };

  const handleSeedReplay = async () => {
    try {
      await fetch("http://localhost:8000/api/simulation/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed: simulationSeed })
      });
    } catch {}
  };

  const handleCopySeed = () => {
    navigator.clipboard.writeText(simulationSeed);
    setSeedCopied(true);
    setTimeout(() => setSeedCopied(false), 2000);
  };

  const handleInjectIncident = async () => {
    try {
      await fetch("http://localhost:8000/api/simulation/incident/inject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incident_type: incidentType,
          severity: incidentSeverity,
          duration_minutes: incidentDuration,
          target_provider: incidentTargetProvider
        })
      });
    } catch {}
    setIncidentModalOpen(false);
  };

  const handlePrioritizeQueue = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/simulation/prioritize-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_interventions_per_min: maxInterventions,
          recovery_budget_inr: recoveryBudget
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPrioritizedQueue(data);
      }
    } catch {}
  };

  const handleRunMultiStrategy = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/simulation/experiments/multi-strategy", {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        setStrategyReport(data);
      }
    } catch {}
  };

  const handleRunMonteCarlo = async () => {
    setIsMonteCarloRunning(true);
    try {
      const res = await fetch("http://localhost:8000/api/simulation/experiments/monte-carlo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: activeScenario, num_runs: 50 })
      });
      if (res.ok) {
        const data = await res.json();
        setMonteCarloReport(data);
      }
    } catch {} finally {
      setIsMonteCarloRunning(false);
    }
  };

  const handleStartFlagship = async () => {
    setFlagshipActive(true);
    try {
      const res = await fetch("http://localhost:8000/api/simulation/flagship/10crore-day");
      if (res.ok) {
        const data = await res.json();
        setFlagshipData(data);
      }
    } catch {
      setFlagshipData({
        scenario_name: "THE ₹10 CRORE PAYMENT DAY",
        total_gmv_processed_inr: 100000000.0,
        peak_revenue_at_risk_inr: 14250000.0,
        baseline_recovery_yield_inr: 4820000.0,
        safra_recovery_yield_inr: 11860000.0,
        incremental_value_created_inr: 7040000.0,
        duplicate_debits_prevented: 18420,
        customer_spam_interventions_avoided: 42180,
        timeline_stages: [
          { sim_time: "09:00", title: "Morning Baseline Operation", status: "NORMAL", gmv_processed_inr: 8500000, revenue_at_risk_inr: 120000, hdfc_latency_ms: 620 },
          { sim_time: "12:00", title: "Midday Traffic Surge", status: "SURGE", gmv_processed_inr: 28400000, revenue_at_risk_inr: 450000, hdfc_latency_ms: 780 },
          { sim_time: "14:30", title: "HDFC Core Banking Switch Latency Degradation", status: "INCIDENT_START", gmv_processed_inr: 48200000, revenue_at_risk_inr: 3400000, hdfc_latency_ms: 1950 },
          { sim_time: "15:00", title: "Revenue at Risk Escalation & Duplicate Retries", status: "CRITICAL_RISK", gmv_processed_inr: 54100000, revenue_at_risk_inr: 8900000, hdfc_latency_ms: 2450 },
          { sim_time: "15:10", title: "SAFRA Deterministic Anomaly Detection Triggered", status: "SAFRA_DETECTED", gmv_processed_inr: 58600000, revenue_at_risk_inr: 10800000, hdfc_latency_ms: 2420 },
          { sim_time: "15:15", title: "SAFRA Queue Reprioritization & WAIT Policy", status: "POLICY_ENGAGED", gmv_processed_inr: 62400000, revenue_at_risk_inr: 11500000, hdfc_latency_ms: 2380 },
          { sim_time: "15:30", title: "Automated Revenue Recovery Acceleration", status: "RECOVERY_ACTIVE", gmv_processed_inr: 69800000, revenue_at_risk_inr: 7200000, hdfc_latency_ms: 2100 },
          { sim_time: "17:00", title: "Bank Switch Recovery & System Stabilization", status: "STABILIZING", gmv_processed_inr: 81200000, revenue_at_risk_inr: 2100000, hdfc_latency_ms: 680 },
          { sim_time: "23:59", title: "Day Complete — Comprehensive Impact Accounting", status: "COMPLETED", gmv_processed_inr: 100000000, revenue_at_risk_inr: 0, hdfc_latency_ms: 590 }
        ]
      });
    }
  };

  // 10 Predefined Incident Keys
  const incidentList = [
    { key: "PAYDAY_SURGE", label: "01. Payday Surge", desc: "3.8x Traffic Spike" },
    { key: "FLASH_SALE", label: "02. Flash Sale", desc: "5.2x Checkout Rush" },
    { key: "BANK_LATENCY_DEGRADATION", label: "03. Bank Latency", desc: "HDFC 2,400ms Spike" },
    { key: "UPI_TIMEOUT_WAVE", label: "04. UPI Timeout", desc: "NPCI 504 Cluster" },
    { key: "CARD_ISSUER_FAILURE", label: "05. Card Issuer Drop", desc: "3DS2 52% Rejection" },
    { key: "NETWORK_PARTITION", label: "06. Partition", desc: "Out-of-Order Webhooks" },
    { key: "RECOVERY_QUEUE_OVERLOAD", label: "07. Queue Overload", desc: "10k+ At-Risk Payments" },
    { key: "MULTI_PROVIDER_INCIDENT", label: "08. Multi-Bank Outage", desc: "HDFC + SBI Correlated" },
    { key: "CHECKOUT_ABANDONMENT_SPIKE", label: "09. 3DS2 Dropoff", desc: "48% Cart Abandonment" },
    { key: "SILENT_REVENUE_LEAK", label: "10. Silent Leak", desc: "Subtle 8.5% Mandate Drop" },
    { key: "BLACK_SWAN_MODE", label: "★ BLACK SWAN", desc: "Cascading Multi-Shock" }
  ];

  return (
    <div className="min-h-screen bg-paper text-ink font-body antialiased">
      <Navbar />

      <main className="max-w-[1380px] mx-auto px-6 sm:px-10 py-12 sm:py-16 space-y-12">
        {/* Environment Disclaimer Header */}
        <div className="p-4 rounded-sm bg-signal/10 border border-signal/30 text-ink font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-sm bg-signal text-paper font-bold text-[10px] tracking-widest uppercase">
              SIMULATED PAYMENT INTELLIGENCE ENVIRONMENT
            </span>
            <span className="text-[11px] text-ink-soft">
              Deterministic, event-driven discrete simulation engine. Simulated statistics do not represent production bank data.
            </span>
          </div>
          <button
            onClick={() => setAssumptionsModalOpen(true)}
            className="text-signal hover:underline font-bold flex items-center gap-1.5 shrink-0"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Simulation Assumptions</span>
          </button>
        </div>

        {/* Master Control Room Header & Virtual Clock */}
        <div className="p-6 sm:p-8 rounded-sm border border-line bg-surface space-y-6 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-line">
            <div className="space-y-1">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-signal flex items-center gap-2">
                <Radio className="w-4 h-4 text-signal animate-pulse" />
                <span>LARGE-SCALE PAYMENT OPERATIONS CONTROL ROOM</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-ink tracking-tight">
                Discrete Event Simulation & Recovery Orchestrator
              </h1>
              <p className="text-xs font-mono text-ink-soft">
                Stress-test revenue recovery policies across thousands to millions of simulated payments.
              </p>
            </div>

            {/* Virtual Clock Display */}
            <div className="p-4 rounded-sm bg-paper border border-line flex items-center gap-6 font-mono">
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted uppercase block">Virtual Simulation Time</span>
                <span className="text-3xl font-bold font-display text-ink tracking-widest">{simTime}</span>
              </div>
              <div className="space-y-0.5 border-l border-line pl-4">
                <span className="text-[10px] text-muted uppercase block">Engine Speed</span>
                <span className="text-lg font-bold text-signal">{virtualSpeed}x Speed</span>
              </div>
            </div>
          </div>

          {/* Virtual Time Controls & Speed Selectors */}
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            {/* Play / Pause / Reset Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleControlAction(isPlaying ? "PAUSE" : "PLAY")}
                className={`px-4 py-2 rounded-sm font-bold uppercase flex items-center gap-2 transition-all ${
                  isPlaying
                    ? "bg-signal text-paper hover:bg-signal-dark"
                    : "bg-safe text-paper hover:bg-safe-dark"
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
              </button>

              <button
                onClick={() => handleControlAction("STEP")}
                className="px-3 py-2 bg-paper border border-line hover:border-ink text-ink font-semibold rounded-sm flex items-center gap-1.5"
              >
                <FastForward className="w-4 h-4 text-signal" />
                <span>STEP TICK</span>
              </button>

              <button
                onClick={() => handleControlAction("RESET")}
                className="px-3 py-2 bg-paper border border-line hover:border-danger text-ink font-semibold rounded-sm flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4 text-muted" />
                <span>RESET</span>
              </button>
            </div>

            {/* Speed Multipliers */}
            <div className="flex items-center gap-1 bg-paper p-1 rounded-sm border border-line">
              <span className="text-[10px] text-muted px-2 uppercase">Speed:</span>
              {[1, 5, 10, 50, 100, 1000].map((spd) => (
                <button
                  key={spd}
                  onClick={() => handleSpeedChange(spd)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-sm transition-all ${
                    virtualSpeed === spd
                      ? "bg-ink text-paper"
                      : "text-ink-soft hover:text-ink hover:bg-surface"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Seed & Reproducibility Bar */}
            <div className="flex items-center gap-2 bg-paper px-3 py-1.5 rounded-sm border border-line">
              <span className="text-[10px] text-muted uppercase">SEED:</span>
              <input
                type="text"
                value={simulationSeed}
                onChange={(e) => setSimulationSeed(e.target.value)}
                className="w-36 bg-transparent text-xs font-bold text-ink focus:outline-none border-b border-line"
              />
              <button
                onClick={handleCopySeed}
                title="Copy Simulation Seed"
                className="p-1 text-ink-soft hover:text-signal"
              >
                {seedCopied ? <Check className="w-4 h-4 text-safe" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleSeedReplay}
                className="px-2.5 py-1 bg-surface border border-line hover:border-signal text-[11px] font-bold rounded-sm"
              >
                REPLAY
              </button>
            </div>
          </div>
        </div>

        {/* Simulation Scale & Merchant Profile Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
          {/* Scale Selector (6 Cols) */}
          <div className="lg:col-span-6 p-6 rounded-sm border border-line bg-surface space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                <Layers className="w-4 h-4 text-signal" />
                <span>Simulation Scale Level</span>
              </span>
              <span className="text-[11px] text-signal font-bold">{scaleLevel}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { key: "LEVEL_1_DEMO", label: "L1: DEMO", desc: "100 - 1k events" },
                { key: "LEVEL_2_MERCHANT_DAY", label: "L2: MERCHANT DAY", desc: "10k - 50k events" },
                { key: "LEVEL_3_HIGH_VOLUME", label: "L3: HIGH VOLUME", desc: "100k - 500k events" },
                { key: "LEVEL_4_STRESS_TEST", label: "L4: STRESS TEST", desc: "1,000,000+ events" },
                { key: "LEVEL_5_INCIDENT_MODE", label: "L5: INCIDENT MODE", desc: "Cascading Shocks" }
              ].map((lvl) => (
                <button
                  key={lvl.key}
                  onClick={() => handleScaleChange(lvl.key)}
                  className={`p-2.5 rounded-sm border text-left space-y-0.5 transition-all ${
                    scaleLevel === lvl.key
                      ? "border-signal bg-signal/10 text-signal font-bold"
                      : "border-line bg-paper text-ink hover:border-ink-soft"
                  }`}
                >
                  <div className="text-[11px]">{lvl.label}</div>
                  <div className="text-[9px] text-muted">{lvl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Merchant Profile Selector (6 Cols) */}
          <div className="lg:col-span-6 p-6 rounded-sm border border-line bg-surface space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                <Cpu className="w-4 h-4 text-signal" />
                <span>Merchant Business Profile</span>
              </span>
              <span className="text-[11px] text-safe font-bold">{merchantProfile}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { key: "DIGITAL_COMMERCE", label: "E-Commerce", desc: "UPI heavy, AOV ₹1.5k" },
                { key: "SUBSCRIPTION_SAAS", label: "Subscription SaaS", desc: "Recurring tokens ₹5k" },
                { key: "B2B_SAAS", label: "B2B Enterprise", desc: "Invoices Net-30 ₹85k" },
                { key: "MARKETPLACE", label: "Marketplace", desc: "Multi-vendor ₹2.5k" },
                { key: "EDUCATION_PLATFORM", label: "EdTech Platform", desc: "High ticket ₹28k" },
                { key: "TRAVEL_PLATFORM", label: "Travel & Flights", desc: "Booking urgency ₹12k" }
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => handleMerchantChange(m.key)}
                  className={`p-2.5 rounded-sm border text-left space-y-0.5 transition-all ${
                    merchantProfile === m.key
                      ? "border-safe bg-safe/10 text-safe font-bold"
                      : "border-line bg-paper text-ink hover:border-ink-soft"
                  }`}
                >
                  <div className="text-[11px]">{m.label}</div>
                  <div className="text-[9px] text-muted">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Flagship Feature: THE ₹10 CRORE PAYMENT DAY */}
        <div className="p-6 sm:p-8 rounded-sm border-2 border-signal bg-paper space-y-6 shadow-md font-mono">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-line">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 bg-signal text-paper text-[10px] font-bold tracking-widest uppercase">
                FLAGSHIP 24-HOUR SIMULATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink">
                THE ₹10 CRORE PAYMENT DAY
              </h2>
              <p className="text-xs text-ink-soft">
                Full 24-hour simulation across 250,000+ payments demonstrating peak incident recovery and zero duplicate charges.
              </p>
            </div>

            <button
              onClick={handleStartFlagship}
              className="px-5 py-2.5 bg-signal hover:bg-signal-dark text-paper font-display text-xs font-bold uppercase tracking-wider rounded-sm transition-all shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-paper" />
              <span>{flagshipActive ? "Active Scenario" : "Run ₹10 Crore Scenario"}</span>
            </button>
          </div>

          {flagshipData && (
            <div className="space-y-6">
              {/* Financial Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 bg-surface border border-line">
                  <span className="text-[10px] text-muted uppercase block">Total Processed GMV</span>
                  <span className="text-2xl font-bold font-display text-ink">₹10.00 Cr</span>
                </div>
                <div className="p-3.5 bg-surface border border-danger">
                  <span className="text-[10px] text-danger uppercase block font-bold">Peak Revenue At Risk</span>
                  <span className="text-2xl font-bold font-display text-danger">₹1.42 Cr</span>
                </div>
                <div className="p-3.5 bg-surface border border-safe">
                  <span className="text-[10px] text-safe uppercase block font-bold">SAFRA Revenue Recovered</span>
                  <span className="text-2xl font-bold font-display text-safe">₹1.18 Cr</span>
                </div>
                <div className="p-3.5 bg-surface border border-signal">
                  <span className="text-[10px] text-signal uppercase block font-bold">Net Incremental Value</span>
                  <span className="text-2xl font-bold font-display text-signal">+₹70.40L</span>
                </div>
              </div>

              {/* 24-Hour Timeline Stepper */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-ink uppercase block">
                  24-Hour Incident & Recovery Progression:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {flagshipData.timeline_stages?.map((st: any, idx: number) => (
                    <div key={idx} className="p-3 bg-surface border border-line space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-signal">{st.sim_time}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-paper border border-line rounded-sm">
                          {st.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-ink text-xs font-display">{st.title}</h4>
                      <p className="text-[11px] text-ink-soft">{st.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 10 Incident Library Buttons + Black Swan Mode */}
        <div className="p-6 sm:p-8 rounded-sm border border-line bg-surface space-y-6 shadow-sm font-mono text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-line">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-signal">
                INCIDENT SIMULATION LIBRARY (10 SCENARIOS + BLACK SWAN)
              </span>
              <h3 className="text-xl font-bold font-display text-ink">
                Simulate Cascading Failures, Switch Outages & Silent Leaks
              </h3>
            </div>

            <button
              onClick={() => setIncidentModalOpen(true)}
              className="px-4 py-2 bg-paper border border-line hover:border-signal text-ink font-bold rounded-sm flex items-center gap-1.5"
            >
              <Crosshair className="w-4 h-4 text-signal" />
              <span>+ Custom Incident Injector</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {incidentList.map((inc) => (
              <button
                key={inc.key}
                onClick={() => handleScenarioSelect(inc.key)}
                className={`p-3.5 rounded-sm border text-left space-y-1 transition-all ${
                  activeScenario === inc.key
                    ? inc.key === "BLACK_SWAN_MODE"
                      ? "border-danger bg-danger/15 text-danger font-bold"
                      : "border-signal bg-signal/10 text-signal font-bold"
                    : "border-line bg-paper text-ink hover:border-ink-soft"
                }`}
              >
                <div className="font-bold text-[11px]">{inc.label}</div>
                <div className="text-[10px] text-muted">{inc.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Incident Causal Dependency Graph & Anomaly Root Cause */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-mono text-xs">
          {/* Causal Chain Visualization (6 Cols) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-sm border border-line bg-surface space-y-5 shadow-sm">
            <div className="border-b border-line pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-signal" />
                <span>Incident Causal Dependency Chain</span>
              </span>
              <p className="text-[11px] text-ink-soft mt-0.5">
                Upstream provider bottleneck propagation to checkout & recovery queue.
              </p>
            </div>

            <div className="p-4 bg-paper border border-line space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-surface border border-line">
                <span className="font-bold">1. BANK SWITCH LATENCY</span>
                <span className="text-danger font-bold">+240% Degradation</span>
              </div>
              <div className="flex justify-center text-signal font-bold text-sm">↓</div>
              <div className="flex items-center justify-between p-2.5 bg-surface border border-line">
                <span className="font-bold">2. CALLBACK TIME OUT ACCUMULATION</span>
                <span className="text-danger font-bold">42% Ingestion Delay</span>
              </div>
              <div className="flex justify-center text-signal font-bold text-sm">↓</div>
              <div className="flex items-center justify-between p-2.5 bg-surface border border-line">
                <span className="font-bold">3. CUSTOMER RAPID RETRY PRESSURE</span>
                <span className="text-warning font-bold">14.2% Duplicate Risk</span>
              </div>
              <div className="flex justify-center text-signal font-bold text-sm">↓</div>
              <div className="flex items-center justify-between p-2.5 bg-surface border border-safe">
                <span className="font-bold text-safe">4. SAFRA 300s WAIT BARRIER ENGAGED</span>
                <span className="text-safe font-bold">0 Duplicates Permitted</span>
              </div>
            </div>
          </div>

          {/* Anomaly Detection & Hypotheses (6 Cols) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-sm border border-line bg-surface space-y-5 shadow-sm">
            <div className="border-b border-line pb-3 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                <Zap className="w-4 h-4 text-signal" />
                <span>Deterministic Anomaly Detector (EWMA / Z-Score)</span>
              </span>
              <span className="text-[11px] text-safe font-bold">
                Z-Latency: {anomalyData.z_latency} (Threshold: 2.5)
              </span>
            </div>

            <div className="space-y-3">
              {anomalyData.ranked_hypotheses?.map((h: any, idx: number) => (
                <div key={idx} className="p-4 rounded-sm bg-paper border border-line space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-ink">
                      #{h.rank} {h.title}
                    </span>
                    <span className="text-safe font-bold">
                      Confidence: {(h.confidence_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px] text-ink-soft">
                    {h.evidence?.map((ev: string, evIdx: number) => (
                      <div key={evIdx} className="flex items-center gap-1.5">
                        <span className="text-signal font-bold">•</span>
                        <span>{ev}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-line text-[11px] text-safe font-bold flex justify-between">
                    <span>Action: {h.recommended_action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prioritized Recovery Queue with Knapsack Budget Constraints */}
        <div className="p-6 sm:p-8 rounded-sm border border-line bg-surface space-y-6 shadow-sm font-mono text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-line">
            <div className="space-y-0.5">
              <span className="text-xs font-bold uppercase tracking-widest text-signal">
                CONSTRAINED RECOVERY QUEUE PRIORITIZER
              </span>
              <h3 className="text-xl font-bold font-display text-ink">
                Knapsack Optimization under Intervention & Budget Constraints
              </h3>
            </div>

            <button
              onClick={handlePrioritizeQueue}
              className="px-4 py-2 bg-ink text-paper font-bold uppercase rounded-sm hover:bg-ink-soft transition-colors"
            >
              Re-Calculate Priority Queue
            </button>
          </div>

          {/* Constraint Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-paper border border-line">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>Max Interventions / Min:</span>
                <strong className="text-signal">{maxInterventions} actions</strong>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="50"
                value={maxInterventions}
                onChange={(e) => setMaxInterventions(Number(e.target.value))}
                className="w-full accent-signal"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>Max Recovery Budget (INR):</span>
                <strong className="text-safe">₹{recoveryBudget.toLocaleString("en-IN")}</strong>
              </div>
              <input
                type="range"
                min="5000"
                max="200000"
                step="5000"
                value={recoveryBudget}
                onChange={(e) => setRecoveryBudget(Number(e.target.value))}
                className="w-full accent-safe"
              />
            </div>
          </div>

          {/* Allocation Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-paper border border-safe">
              <span className="text-[10px] text-safe uppercase font-bold block">Allocated Actions</span>
              <span className="text-lg font-bold text-safe">{prioritizedQueue.allocated_count}</span>
            </div>
            <div className="p-3 bg-paper border border-line">
              <span className="text-[10px] text-muted uppercase block">Deferred in Cooldown</span>
              <span className="text-lg font-bold text-ink">{prioritizedQueue.wait_count}</span>
            </div>
            <div className="p-3 bg-paper border border-danger">
              <span className="text-[10px] text-danger uppercase font-bold block">Stopped (Fatigue)</span>
              <span className="text-lg font-bold text-danger">{prioritizedQueue.stopped_fatigue_count}</span>
            </div>
            <div className="p-3 bg-paper border border-signal">
              <span className="text-[10px] text-signal uppercase font-bold block">Expected Recovery</span>
              <span className="text-lg font-bold text-signal">
                ₹{prioritizedQueue.total_expected_recovery_inr?.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Prioritized Action Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-line text-[10px] text-muted uppercase">
                  <th className="py-2">Rank</th>
                  <th className="py-2">Transaction ID</th>
                  <th className="py-2">Amount (INR)</th>
                  <th className="py-2">P(Recovery)</th>
                  <th className="py-2">Priority Score</th>
                  <th className="py-2">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-[11px]">
                {prioritizedQueue.top_allocated_actions?.map((act: any, idx: number) => (
                  <tr key={idx} className="hover:bg-paper">
                    <td className="py-2.5 font-bold text-signal">#{act.rank}</td>
                    <td className="py-2.5 text-ink">{act.transaction_id}</td>
                    <td className="py-2.5 font-bold">₹{act.amount?.toLocaleString("en-IN")}</td>
                    <td className="py-2.5 font-bold text-safe">{(act.recovery_probability * 100).toFixed(0)}%</td>
                    <td className="py-2.5 font-mono text-ink">{act.priority_score}</td>
                    <td className="py-2.5 text-safe font-bold">{act.decision}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Multi-Strategy Comparison & Monte Carlo Experiment Runner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-mono text-xs">
          {/* 4-Strategy Comparison (6 Cols) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-sm border border-line bg-surface space-y-5 shadow-sm">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-signal" />
                <span>Multi-Strategy Recovery Comparison</span>
              </span>
              <button
                onClick={handleRunMultiStrategy}
                className="px-3 py-1.5 bg-paper border border-line text-signal font-bold rounded-sm hover:border-signal"
              >
                Evaluate Strategies
              </button>
            </div>

            {strategyReport ? (
              <div className="space-y-3">
                {Object.values(strategyReport.strategies || {}).map((st: any, idx: number) => (
                  <div key={idx} className="p-3.5 bg-paper border border-line space-y-1.5">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-ink">{st.name}</span>
                      <span className={idx === 3 ? "text-safe" : "text-ink"}>
                        ₹{st.net_value_created_inr?.toLocaleString("en-IN")} Net
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-muted">
                      <span>Interventions: {st.interventions_count}</span>
                      <span>Fatigue Index: {st.customer_fatigue_index}</span>
                      <span>Recovery Eff: {st.recovery_efficiency_pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-soft py-4 text-center">
                Click Evaluate Strategies to compare Blind Retry, High-Value, Probability Threshold, and SAFRA Adaptive Policy.
              </p>
            )}
          </div>

          {/* Monte Carlo Experiment Runner (6 Cols) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-sm border border-line bg-surface space-y-5 shadow-sm">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-signal" />
                <span>Monte Carlo Research Runner (N=50 Runs)</span>
              </span>
              <button
                onClick={handleRunMonteCarlo}
                disabled={isMonteCarloRunning}
                className="px-3 py-1.5 bg-signal text-paper font-bold uppercase rounded-sm hover:bg-signal-dark"
              >
                {isMonteCarloRunning ? "Simulating..." : "Run 50 Simulations"}
              </button>
            </div>

            {monteCarloReport ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-paper border border-line">
                    <span className="text-[10px] text-muted uppercase block">Baseline Policy</span>
                    <span className="text-sm font-bold text-ink">
                      ₹{(monteCarloReport.baseline_stats?.mean_inr / 100000).toFixed(2)}L ± ₹
                      {(monteCarloReport.baseline_stats?.std_dev_inr / 100000).toFixed(2)}L
                    </span>
                  </div>
                  <div className="p-3 bg-paper border border-safe">
                    <span className="text-[10px] text-safe uppercase font-bold block">SAFRA Adaptive Policy</span>
                    <span className="text-sm font-bold text-safe">
                      ₹{(monteCarloReport.safra_stats?.mean_inr / 100000).toFixed(2)}L ± ₹
                      {(monteCarloReport.safra_stats?.std_dev_inr / 100000).toFixed(2)}L
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-safe/10 border border-safe text-safe text-xs font-bold text-center">
                  Mean Incremental Gain: +₹
                  {(monteCarloReport.mean_incremental_gain_inr / 100000).toFixed(2)}L (
                  {monteCarloReport.statistical_significance})
                </div>
              </div>
            ) : (
              <p className="text-xs text-ink-soft py-4 text-center">
                Execute 50 Monte Carlo trials across randomized seeds to compute 95% Confidence Intervals.
              </p>
            )}
          </div>
        </div>

        {/* Custom Incident Injector Modal */}
        {incidentModalOpen && (
          <div className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono text-xs">
            <div className="bg-surface border border-line rounded-sm max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center pb-3 border-b border-line">
                <h3 className="font-bold text-ink text-sm uppercase">Inject Custom Incident</h3>
                <button onClick={() => setIncidentModalOpen(false)} className="text-muted hover:text-ink">
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] text-muted uppercase block">Incident Type</span>
                  <select
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                    className="w-full p-2 bg-paper border border-line text-ink rounded-sm"
                  >
                    <option value="BANK_LATENCY_DEGRADATION">Bank Core Latency Degradation</option>
                    <option value="UPI_TIMEOUT_WAVE">UPI Gateway 504 Timeout Wave</option>
                    <option value="CARD_ISSUER_FAILURE">Card Issuer Auth Server Failure</option>
                    <option value="CHECKOUT_ABANDONMENT_SPIKE">SMS OTP Dropoff Spike</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-muted uppercase block">
                    Severity: {(incidentSeverity * 100).toFixed(0)}%
                  </span>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={incidentSeverity}
                    onChange={(e) => setIncidentSeverity(Number(e.target.value))}
                    className="w-full accent-signal"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-muted uppercase block">Target Provider</span>
                  <select
                    value={incidentTargetProvider}
                    onChange={(e) => setIncidentTargetProvider(e.target.value)}
                    className="w-full p-2 bg-paper border border-line text-ink rounded-sm"
                  >
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="SBI">State Bank of India</option>
                    <option value="Axis">Axis Bank</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleInjectIncident}
                  className="w-full py-2.5 bg-signal hover:bg-signal-dark text-paper font-display text-xs font-bold uppercase rounded-sm transition-colors"
                >
                  Inject Incident Shock
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Simulation Assumptions Modal */}
        {assumptionsModalOpen && (
          <div className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono text-xs">
            <div className="bg-surface border border-line rounded-sm max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-3 border-b border-line">
                <h3 className="font-bold text-ink text-sm uppercase">Statistical Simulation Assumptions</h3>
                <button onClick={() => setAssumptionsModalOpen(false)} className="text-muted hover:text-ink">
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-ink-soft leading-relaxed">
                <div>
                  <strong className="text-ink block">1. Log-Normal Transaction Amounts:</strong>
                  <span>Amounts follow ln(X) ~ Normal(mu, sigma^2) parameterized per merchant profile to replicate heavy right-tail order values.</span>
                </div>

                <div>
                  <strong className="text-ink block">2. Non-Homogeneous Poisson Arrival Process:</strong>
                  <span>Payment arrival timing models diurnal diurnal(t) double-peak traffic with Poisson inter-arrival intervals.</span>
                </div>

                <div>
                  <strong className="text-ink block">3. Pareto Provider Latency Distribution:</strong>
                  <span>Bank CBS switch delays follow a Pareto long-tail distribution P(X &gt; x) = (x_m / x)^alpha capturing sudden 2,000ms+ spikes.</span>
                </div>

                <div>
                  <strong className="text-ink block">4. Constrained Knapsack Prioritization:</strong>
                  <span>SAFRA selects recovery interventions by maximizing expected gross recovery minus unit costs subject to bounded capacity limits.</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setAssumptionsModalOpen(false)}
                  className="px-4 py-2 bg-ink text-paper font-bold uppercase rounded-sm"
                >
                  Close Assumptions
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
