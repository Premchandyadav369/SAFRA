"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IndianRupee,
  DollarSign,
  TrendingDown,
  TrendingUp,
  BrainCircuit,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function RevenueFlow() {
  const [simulationState, setSimulationState] = useState<"IDLE" | "PENDING_INJECTED" | "INVESTIGATING" | "RECOVERED">("IDLE");
  const [activeStepText, setActiveStepText] = useState<string>("Autonomous Graph Monitoring Active");
  const [recoveredAmount, setRecoveredAmount] = useState<number>(36420);
  const [atRiskAmount, setAtRiskAmount] = useState<number>(48.2);

  // Investigation step text rotation
  const investigationSteps = [
    "Tracing payment graph across 4 banking hops...",
    "Detected missing merchant confirmation callback (504)",
    "Clustered 1,842 similar cohort transactions (81% success)",
    "Selecting bounded recovery playbook: Retry Webhook",
  ];

  const handleInjectFailure = () => {
    setSimulationState("PENDING_INJECTED");
    setAtRiskAmount(54.6);
    setActiveStepText("Payment ₹4,999 Entered Uncertainty. Anomaly Flagged.");

    setTimeout(() => {
      setSimulationState("INVESTIGATING");
      let stepIdx = 0;
      setActiveStepText(investigationSteps[0]);

      const interval = setInterval(() => {
        stepIdx++;
        if (stepIdx < investigationSteps.length) {
          setActiveStepText(investigationSteps[stepIdx]);
        } else {
          clearInterval(interval);
          setSimulationState("RECOVERED");
          setRecoveredAmount((prev) => prev + 4999);
          setAtRiskAmount(48.2);
          setActiveStepText("₹4,999 Recovered via Idempotent Webhook Retry (0 Manual Tickets).");
        }
      }, 1200);
    }, 1000);
  };

  const handleReset = () => {
    setSimulationState("IDLE");
    setActiveStepText("Autonomous Graph Monitoring Active");
    setRecoveredAmount(36420);
    setAtRiskAmount(48.2);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto my-8 p-4 sm:p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-[#172A3A]/10 shadow-[0_24px_80px_rgba(23,42,58,0.08)] overflow-hidden">
      {/* Interactive Trigger Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 mb-6 border-b border-[#172A3A]/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#16856B] animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#172A3A]">
            Interactive Revenue Flow Engine
          </span>
        </div>

        <div className="flex items-center gap-3">
          {simulationState === "IDLE" ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleInjectFailure}
              className="px-4 py-2 rounded-full bg-[#635BFF] text-white text-xs font-mono font-semibold flex items-center gap-2 shadow-md shadow-[#635BFF]/20 hover:brightness-105 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Payment Failure Flow</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleReset}
              className="px-4 py-2 rounded-full bg-[#EEF0EC] text-[#172A3A] text-xs font-mono font-semibold flex items-center gap-2 hover:bg-[#E2E5DF] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Scenario</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Main Graph Flow Visualization */}
      <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 items-center z-10 py-4">
        {/* Node 1: Incoming Payment */}
        <motion.div
          animate={{
            scale: simulationState === "PENDING_INJECTED" ? [1, 1.04, 1] : 1,
          }}
          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            simulationState === "PENDING_INJECTED" || simulationState === "INVESTIGATING"
              ? "bg-[#FFF3CF] border-[#E5A000] shadow-lg shadow-[#E5A000]/15"
              : simulationState === "RECOVERED"
              ? "bg-[#DDF5EC] border-[#16856B]"
              : "bg-[#F6F6F2] border-[#172A3A]/10"
          }`}
        >
          <div className="flex items-center justify-between pb-2">
            <span className="text-[10px] font-mono font-bold text-[#53616D] uppercase">
              PAYMENT INTENT
            </span>
            <span
              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                simulationState === "PENDING_INJECTED" || simulationState === "INVESTIGATING"
                  ? "bg-[#E5A000]/20 text-[#996B00]"
                  : simulationState === "RECOVERED"
                  ? "bg-[#16856B]/20 text-[#16856B]"
                  : "bg-black/5 text-[#53616D]"
              }`}
            >
              {simulationState === "PENDING_INJECTED" || simulationState === "INVESTIGATING"
                ? "PENDING"
                : simulationState === "RECOVERED"
                ? "VERIFIED"
                : "COMPLETED"}
            </span>
          </div>

          <div className="text-xl sm:text-2xl font-bold font-mono text-[#172A3A] flex items-center">
            <IndianRupee className="w-5 h-5 text-[#635BFF] mr-0.5" />
            <span>4,999</span>
          </div>

          <p className="text-[11px] text-[#53616D] font-mono mt-1">
            {simulationState === "PENDING_INJECTED" || simulationState === "INVESTIGATING"
              ? "Bank debited • Missing Webhook"
              : "Customer HDFC UPI Transit"}
          </p>
        </motion.div>

        {/* Arrow 1 */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="w-full h-0.5 bg-gradient-to-r from-[#172A3A]/20 via-[#635BFF] to-[#172A3A]/20 relative">
            <motion.div
              animate={{ x: [0, 48, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-2 h-2 rounded-full bg-[#635BFF] absolute -top-[3px]"
            />
          </div>
        </div>

        {/* Node 2: Center SAFRA Intelligence Hub (Largest Node) */}
        <motion.div
          animate={{
            boxShadow:
              simulationState === "INVESTIGATING"
                ? "0 0 40px rgba(99,91,255,0.35)"
                : "0 10px 30px rgba(23,42,58,0.06)",
          }}
          className="p-6 rounded-3xl bg-[#172A3A] text-white border border-[#635BFF]/40 relative overflow-hidden text-center space-y-3"
        >
          {/* Animated background glow ring */}
          {simulationState === "INVESTIGATING" && (
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-3xl bg-[#635BFF]/30 blur-xl pointer-events-none"
            />
          )}

          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#635BFF] to-[#16856B] p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-[#172A3A] rounded-2xl flex items-center justify-center">
              <BrainCircuit
                className={`w-6 h-6 text-[#635BFF] ${
                  simulationState === "INVESTIGATING" ? "animate-pulse text-[#16856B]" : ""
                }`}
              />
            </div>
          </div>

          <div>
            <div className="text-xs font-mono font-bold tracking-wider text-[#635BFF] uppercase">
              SAFRA ENGINE
            </div>
            <div className="text-base font-bold font-heading text-white">
              {simulationState === "INVESTIGATING"
                ? "AI INVESTIGATING"
                : simulationState === "RECOVERED"
                ? "RECOVERY COMPLETE"
                : "REVENUE GUARD"}
            </div>
          </div>

          <p className="text-[11px] text-slate-300 font-mono line-clamp-2 min-h-[32px]">
            {activeStepText}
          </p>
        </motion.div>

        {/* Arrow 2 */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="w-full h-0.5 bg-gradient-to-r from-[#635BFF] via-[#16856B] to-[#16856B]/20 relative">
            <motion.div
              animate={{ x: [0, 48, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: 0.5 }}
              className="w-2 h-2 rounded-full bg-[#16856B] absolute -top-[3px]"
            />
          </div>
        </div>

        {/* Node 3: Recovered Revenue */}
        <motion.div
          animate={{
            scale: simulationState === "RECOVERED" ? [1, 1.05, 1] : 1,
          }}
          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            simulationState === "RECOVERED"
              ? "bg-[#DDF5EC] border-[#16856B] shadow-lg shadow-[#16856B]/20"
              : "bg-[#F6F6F2] border-[#172A3A]/10"
          }`}
        >
          <div className="flex items-center justify-between pb-2">
            <span className="text-[10px] font-mono font-bold text-[#53616D] uppercase">
              REVENUE RECOVERED
            </span>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#16856B]/15 text-[#16856B]">
              SAFE ACTION
            </span>
          </div>

          <div className="text-xl sm:text-2xl font-bold font-mono text-[#16856B] flex items-center">
            <IndianRupee className="w-5 h-5 mr-0.5" />
            <span>{recoveredAmount.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#16856B] font-mono mt-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+42.8% Recovery Velocity</span>
          </div>
        </motion.div>
      </div>

      {/* Floating Metric Badges Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-[#172A3A]/10">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="p-3 rounded-xl bg-[#EEF0EC] border border-[#172A3A]/5 text-center"
        >
          <span className="text-[10px] font-mono text-[#53616D] uppercase block">REVENUE AT RISK</span>
          <span className="text-sm sm:text-base font-bold font-mono text-[#D84A4A] flex items-center justify-center gap-1 mt-0.5">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>₹{atRiskAmount.toFixed(1)}L</span>
          </span>
        </motion.div>

        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.3 }}
          className="p-3 rounded-xl bg-[#EEF0EC] border border-[#172A3A]/5 text-center"
        >
          <span className="text-[10px] font-mono text-[#53616D] uppercase block">SAFE ACTIONS</span>
          <span className="text-sm sm:text-base font-bold font-mono text-[#16856B] flex items-center justify-center gap-1 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>97.4%</span>
          </span>
        </motion.div>

        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.6 }}
          className="p-3 rounded-xl bg-[#EEF0EC] border border-[#172A3A]/5 text-center"
        >
          <span className="text-[10px] font-mono text-[#53616D] uppercase block">AVG. RESOLUTION</span>
          <span className="text-sm sm:text-base font-bold font-mono text-[#635BFF] mt-0.5 block">
            ↓ 63% Latency
          </span>
        </motion.div>

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 0.9 }}
          className="p-3 rounded-xl bg-[#EEF0EC] border border-[#172A3A]/5 text-center"
        >
          <span className="text-[10px] font-mono text-[#53616D] uppercase block">GLOBAL SIGNAL</span>
          <span className="text-sm sm:text-base font-bold font-mono text-[#172A3A] flex items-center justify-center gap-0.5 mt-0.5">
            <DollarSign className="w-3.5 h-3.5 text-[#635BFF]" />
            <span>18.4K Restored</span>
          </span>
        </motion.div>
      </div>
    </div>
  );
}
