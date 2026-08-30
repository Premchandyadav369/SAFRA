"use client";

import React, { useState } from "react";
import {
  SlidersHorizontal,
  Flame,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Zap,
  Activity,
  Layers,
  Building,
  RotateCcw
} from "lucide-react";
import { SafraAPI } from "@/lib/api";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function SimulatorConsole() {
  const [isInjecting, setIsInjecting] = useState(false);
  const [logs, setLogs] = useState<Array<{ time: string; msg: string; type: string }>>([
    { time: new Date().toLocaleTimeString(), msg: "Simulation engine connected and ready for scenario injection.", type: "INFO" },
  ]);

  const addLog = (msg: string, type: "INFO" | "SUCCESS" | "WARN" | "ERROR") => {
    setLogs((prev) => [{ time: new Date().toLocaleTimeString(), msg, type }, ...prev]);
  };

  const handleInjectUPIIncident = async () => {
    try {
      setIsInjecting(true);
      addLog("Injecting systemic UPI & HDFC Bank latency surge (1,842 pending payments, ₹42.7L exposure)...", "WARN");
      const res = await SafraAPI.injectIncident("HDFC Bank", 1842, 4270000);
      addLog(`✓ ${res.message}`, "SUCCESS");
    } catch (e: any) {
      addLog(`Injection failed: ${e.message}`, "ERROR");
    } finally {
      setIsInjecting(false);
    }
  };

  const handleInjectCallbackFailure = async () => {
    try {
      setIsInjecting(true);
      addLog("Injecting 24 merchant callback drops into webhook dispatch queues...", "WARN");
      const res = await SafraAPI.injectCallbackFailure();
      addLog(`✓ ${res.message}`, "SUCCESS");
    } catch (e: any) {
      addLog(`Injection failed: ${e.message}`, "ERROR");
    } finally {
      setIsInjecting(false);
    }
  };

  const handleResetTopology = async () => {
    try {
      setIsInjecting(true);
      addLog("Wiping database and resetting to canonical pristine topology...", "INFO");
      const res = await SafraAPI.resetTopology();
      addLog(`✓ ${res.message}`, "SUCCESS");
    } catch (e: any) {
      addLog(`Reset failed: ${e.message}`, "ERROR");
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-body antialiased">
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-6 sm:px-10 py-12 sm:py-16 space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-display tracking-tight text-ink">
                Mission Traffic Simulator
              </h1>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-sm bg-safe/15 text-safe border border-safe/30 font-bold">
                CONTROL ROOM
              </span>
            </div>
            <p className="text-xs text-ink-soft font-mono mt-1">
              Simulate realistic financial traffic, inject edge failures, and test autonomous system responses live.
            </p>
          </div>
        </div>

        {/* Preset Injection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Scenario 1: Systemic UPI Incident */}
          <div className="p-6 sm:p-8 rounded-sm border border-signal bg-surface space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-signal text-xs font-mono font-bold">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  <span>SYSTEMIC INCIDENT</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-signal/15 font-bold">P1 CRITICAL</span>
              </div>
              <h2 className="text-lg font-bold font-display text-ink">Bank Switch & UPI Latency Spike</h2>
              <p className="text-xs text-ink-soft font-mono leading-relaxed">
                Injects 1,842 pending transactions across 47 merchants on HDFC Bank (NPCI UPI rail) with ₹42.7L exposure.
              </p>
            </div>

            <button
              onClick={handleInjectUPIIncident}
              disabled={isInjecting}
              className="w-full py-3 rounded-sm bg-signal hover:bg-signal-dark text-paper font-display text-xs font-bold uppercase transition-all disabled:opacity-40"
            >
              {isInjecting ? "Injecting..." : "Inject 1,842 UPI Incident →"}
            </button>
          </div>

          {/* Scenario 2: Merchant Callback Dropout */}
          <div className="p-6 sm:p-8 rounded-sm border border-warning bg-surface space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-warning text-xs font-mono font-bold">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>FINANCIAL DRIFT</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-warning/15 font-bold">DRIFT INJECTION</span>
              </div>
              <h2 className="text-lg font-bold font-display text-ink">Merchant Callback Drops</h2>
              <p className="text-xs text-ink-soft font-mono leading-relaxed">
                Simulates 24 webhook dropouts on merchant endpoint, inducing ₹25,000 additional financial drift.
              </p>
            </div>

            <button
              onClick={handleInjectCallbackFailure}
              disabled={isInjecting}
              className="w-full py-3 rounded-sm bg-warning hover:bg-warning/90 text-paper font-display text-xs font-bold uppercase transition-all disabled:opacity-40"
            >
              {isInjecting ? "Injecting..." : "Inject Webhook Drops →"}
            </button>
          </div>

          {/* Scenario 3: Pristine Reset */}
          <div className="p-6 sm:p-8 rounded-sm border border-line bg-surface space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-muted text-xs font-mono font-bold">
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4" />
                  <span>RESTORE BASELINE</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-paper border border-line">PRISTINE</span>
              </div>
              <h2 className="text-lg font-bold font-display text-ink">Reset Canonical Topology</h2>
              <p className="text-xs text-ink-soft font-mono leading-relaxed">
                Wipes active incidents, clears database, and re-seeds canonical ₹4,999 hero demo topology.
              </p>
            </div>

            <button
              onClick={handleResetTopology}
              disabled={isInjecting}
              className="w-full py-3 rounded-sm bg-paper border border-line hover:bg-paper-dark text-ink font-display text-xs font-bold uppercase transition-all disabled:opacity-40"
            >
              {isInjecting ? "Resetting..." : "Reset Topology to Pristine"}
            </button>
          </div>
        </div>

        {/* Simulator Real-Time Event Console */}
        <div className="p-6 sm:p-8 rounded-sm border border-line bg-surface space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-signal" />
              <h2 className="text-xs font-bold font-mono text-ink uppercase tracking-wider">
                Simulator Telemetry Console
              </h2>
            </div>
            <span className="text-[10px] font-mono text-muted">
              {logs.length} Log Entries
            </span>
          </div>

          <div className="p-4 rounded-sm bg-paper border border-line font-mono text-xs space-y-2 max-h-60 overflow-y-auto">
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-muted text-[10px]">{log.time}</span>
                <span
                  className={`font-bold text-[10px] px-1.5 py-0.2 rounded-sm ${
                    log.type === "SUCCESS"
                      ? "text-safe bg-safe/10"
                      : log.type === "WARN"
                      ? "text-warning bg-warning/10"
                      : log.type === "ERROR"
                      ? "text-danger bg-danger/10"
                      : "text-signal bg-signal/10"
                  }`}
                >
                  [{log.type}]
                </span>
                <span className="text-ink flex-1">{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
