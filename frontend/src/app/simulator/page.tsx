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
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-mono text-white">Mission Traffic Simulator</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-safra-emerald/15 text-safra-emerald border border-safra-emerald/30 font-bold">
              CONTROL ROOM
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Simulate realistic financial traffic, inject edge failures, and test autonomous system responses live.
          </p>
        </div>
      </div>

      {/* Preset Injection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scenario 1: Systemic UPI Incident */}
        <div className="p-6 rounded-3xl border border-safra-ruby/40 bg-safra-ruby/5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-safra-ruby text-xs font-mono font-bold">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                <span>SYSTEMIC INCIDENT</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-safra-ruby/20 border border-safra-ruby/40">P1 CRITICAL</span>
            </div>
            <h2 className="text-base font-bold font-mono text-white">Bank Switch & UPI Latency Spike</h2>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              Injects 1,842 pending transactions across 47 merchants on HDFC Bank (NPCI UPI rail) with ₹42.7L exposure.
            </p>
          </div>

          <button
            onClick={handleInjectUPIIncident}
            disabled={isInjecting}
            className="w-full py-2.5 rounded-xl bg-safra-ruby hover:bg-safra-ruby/90 text-slate-950 font-mono text-xs font-bold transition-all disabled:opacity-40 shadow-lg shadow-safra-ruby/20"
          >
            {isInjecting ? "Injecting..." : "Inject 1,842 UPI Incident →"}
          </button>
        </div>

        {/* Scenario 2: Merchant Callback Dropout */}
        <div className="p-6 rounded-3xl border border-safra-amber/40 bg-safra-amber/5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-safra-amber text-xs font-mono font-bold">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>FINANCIAL DRIFT</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-safra-amber/20 border border-safra-amber/40">DRIFT INJECTION</span>
            </div>
            <h2 className="text-base font-bold font-mono text-white">Merchant Callback Drops</h2>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              Simulates 24 webhook dropouts on merchant endpoint, inducing ₹25,000 additional financial drift.
            </p>
          </div>

          <button
            onClick={handleInjectCallbackFailure}
            disabled={isInjecting}
            className="w-full py-2.5 rounded-xl bg-safra-amber hover:bg-safra-amber/90 text-slate-950 font-mono text-xs font-bold transition-all disabled:opacity-40 shadow-lg shadow-safra-amber/20"
          >
            {isInjecting ? "Injecting..." : "Inject Webhook Drops →"}
          </button>
        </div>

        {/* Scenario 3: Pristine Reset */}
        <div className="p-6 rounded-3xl border border-surface-border bg-surface-card space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold">
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4" />
                <span>RESTORE BASELINE</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-surface-border">PRISTINE</span>
            </div>
            <h2 className="text-base font-bold font-mono text-white">Reset Canonical Topology</h2>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Wipes active incidents, clears database, and re-seeds canonical ₹4,999 hero demo topology.
            </p>
          </div>

          <button
            onClick={handleResetTopology}
            disabled={isInjecting}
            className="w-full py-2.5 rounded-xl bg-surface border border-surface-border hover:bg-surface-border text-white font-mono text-xs font-bold transition-all disabled:opacity-40"
          >
            {isInjecting ? "Resetting..." : "Reset Topology to Pristine"}
          </button>
        </div>
      </div>

      {/* Simulator Real-Time Event Console */}
      <div className="p-6 rounded-3xl border border-surface-border bg-surface-card space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-safra-cyan" />
            <h2 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
              Simulator Telemetry Console
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {logs.length} Log Entries
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-surface-border font-mono text-xs space-y-2 max-h-60 overflow-y-auto">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="text-slate-500 text-[10px]">{log.time}</span>
              <span
                className={`font-bold text-[10px] px-1.5 py-0.2 rounded ${
                  log.type === "SUCCESS"
                    ? "text-safra-emerald bg-safra-emerald/10"
                    : log.type === "WARN"
                    ? "text-safra-amber bg-safra-amber/10"
                    : log.type === "ERROR"
                    ? "text-safra-ruby bg-safra-ruby/10"
                    : "text-safra-cyan bg-safra-cyan/10"
                }`}
              >
                [{log.type}]
              </span>
              <span className="text-slate-300 flex-1">{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
