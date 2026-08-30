"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, ShieldCheck, Zap, Radio, RefreshCw } from "lucide-react";
import { SafraAPI } from "@/lib/api";

export default function Navbar() {
  const [realityScore, setRealityScore] = useState<number>(94.2);
  const [scoreStatus, setScoreStatus] = useState<string>("HEALTHY");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchScore = async () => {
    try {
      setIsRefreshing(true);
      const res = await SafraAPI.getRealityScore();
      setRealityScore(res.overall_reality_score);
      setScoreStatus(res.score_status);
    } catch (e) {
      console.warn("Using offline fallback score");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchScore();
    const interval = setInterval(fetchScore, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-surface-border bg-surface/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-safra-cyan to-safra-indigo p-[1px] flex items-center justify-center shadow-lg shadow-safra-cyan/10 group-hover:shadow-safra-cyan/25 transition-all">
            <div className="w-full h-full bg-surface rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-safra-cyan group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-wider text-white">SAFRA</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-safra-cyan/10 text-safra-cyan border border-safra-cyan/20">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden md:block">Financial Reality & Uncertainty Engine</p>
          </div>
        </Link>
      </div>

      {/* Global Telemetry & Reality Score Bar */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 bg-surface-card border border-surface-border px-3 py-1.5 rounded-full">
          <Radio className="w-3.5 h-3.5 text-safra-emerald animate-pulse" />
          <span className="text-xs text-slate-300 font-mono">Telemetry: <strong className="text-safra-emerald font-semibold">LIVE STREAM</strong></span>
        </div>

        {/* Financial Reality Gauge Badge */}
        <div className="flex items-center gap-3 bg-surface-card border border-surface-border px-4 py-1.5 rounded-lg shadow-inner">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Financial Reality</span>
            <span className="text-sm font-bold font-mono text-white flex items-center gap-1.5 justify-end">
              <span className={realityScore >= 90 ? "text-safra-emerald" : realityScore >= 75 ? "text-safra-amber" : "text-safra-ruby"}>
                {realityScore.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </span>
          </div>
          <div className={`w-3 h-3 rounded-full ${realityScore >= 90 ? "bg-safra-emerald shadow-[0_0_10px_#10B981]" : realityScore >= 75 ? "bg-safra-amber shadow-[0_0_10px_#F59E0B]" : "bg-safra-ruby shadow-[0_0_10px_#EF4444]"}`} />
        </div>

        {/* Quick Simulator CTA */}
        <Link
          href="/simulator"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-gradient-to-r from-safra-indigo/20 to-safra-purple/20 text-indigo-300 border border-safra-indigo/30 hover:border-safra-indigo/60 transition-colors"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Simulate Incidents</span>
        </Link>
      </div>
    </header>
  );
}
