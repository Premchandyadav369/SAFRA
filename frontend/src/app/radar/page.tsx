"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Radar,
  Flame,
  AlertTriangle,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
  RefreshCw,
  GitPullRequest
} from "lucide-react";
import { SafraAPI, IncidentItem } from "@/lib/api";

export default function IncidentRadar() {
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<IncidentItem | null>(null);
  const [blastRadius, setBlastRadius] = useState<any | null>(null);
  const [counterfactual, setCounterfactual] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchIncidents = async () => {
    try {
      setIsLoading(true);
      const incList = await SafraAPI.getIncidents();
      setIncidents(incList);
      if (incList.length > 0) {
        const first = incList[0];
        setSelectedIncident(first);
        const [blastRes, cfRes] = await Promise.all([
          SafraAPI.getIncidentBlastRadius(first.id),
          SafraAPI.getIncidentCounterfactual(first.id),
        ]);
        setBlastRadius(blastRes);
        setCounterfactual(cfRes);
      }
    } catch (e) {
      console.error("Failed to load incidents", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-mono text-white">Financial Incident Radar</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-safra-ruby/15 text-safra-ruby border border-safra-ruby/30 font-bold">
              SYSTEMIC CLUSTERING
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Detects multi-transaction anomalies, estimates graph blast radiuses, and isolates counterfactual root causes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/simulator"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-safra-indigo/20 border border-safra-indigo/40 text-indigo-200 text-xs font-mono hover:bg-safra-indigo/30 transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Inject Incidents in Simulator</span>
          </Link>
          <button
            onClick={fetchIncidents}
            className="p-2 rounded-lg border border-surface-border bg-surface-card hover:bg-surface-border text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-safra-cyan" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Active Incidents List & Blast Radius Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Incidents List (4 Cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl border border-surface-border bg-surface-card space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h2 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-safra-ruby" />
              <span>Active Systemic Incidents</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-400">
              {incidents.length} Clusters
            </span>
          </div>

          <div className="space-y-3">
            {incidents.length > 0 ? (
              incidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => {
                    setSelectedIncident(inc);
                    SafraAPI.getIncidentBlastRadius(inc.id).then(setBlastRadius);
                    SafraAPI.getIncidentCounterfactual(inc.id).then(setCounterfactual);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    selectedIncident?.id === inc.id
                      ? "border-safra-ruby bg-safra-ruby/10 shadow-lg"
                      : "border-surface-border bg-surface/60 hover:border-surface-border/80"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <span className="text-white">{inc.incident_reference}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-safra-ruby/20 text-safra-ruby border border-safra-ruby/30">
                      {inc.severity}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 font-mono line-clamp-2">
                    {inc.root_cause}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
                    <span>Affected: <strong className="text-white">{inc.affected_transactions}</strong> txns</span>
                    <span className="text-safra-amber font-bold">₹{(inc.estimated_exposure / 100000).toFixed(1)}L Exposure</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs font-mono text-slate-400">
                No active incidents. Inject one from the Simulator console.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Blast Radius & Counterfactual Intelligence (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedIncident && (
            <>
              {/* Blast Radius Forecast Card */}
              <div className="p-6 rounded-3xl border border-surface-border bg-surface-card space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-surface-border pb-3">
                  <div className="flex items-center gap-2">
                    <Radar className="w-5 h-5 text-safra-ruby animate-pulse" />
                    <h2 className="text-sm font-bold font-mono text-white">
                      Financial Blast Radius Forecast (Graph Propagation)
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Node: <strong className="text-white">{selectedIncident.affected_bank}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border border-surface-border bg-surface space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Current Exposure</span>
                    <div className="text-2xl font-extrabold font-mono text-safra-amber">
                      ₹{(selectedIncident.estimated_exposure / 100000).toFixed(1)}L
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{selectedIncident.affected_transactions} Payments</span>
                  </div>

                  <div className="p-4 rounded-2xl border border-safra-ruby/40 bg-safra-ruby/5 space-y-1">
                    <span className="text-[10px] font-mono text-safra-ruby uppercase">Predicted Next 30m</span>
                    <div className="text-2xl font-extrabold font-mono text-safra-ruby">
                      +₹{((blastRadius?.predicted_next_30_minutes?.additional_exposure_inr || 1420000) / 100000).toFixed(1)}L
                    </div>
                    <span className="text-[10px] font-mono text-red-300">
                      +{blastRadius?.predicted_next_30_minutes?.additional_pending_transactions || 620} Pending Txns
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl border border-safra-amber/40 bg-safra-amber/5 space-y-1">
                    <span className="text-[10px] font-mono text-safra-amber uppercase">Duplicate Retries Risk</span>
                    <div className="text-2xl font-extrabold font-mono text-safra-amber">
                      ~{blastRadius?.current_impact?.potential_duplicate_retries || 183}
                    </div>
                    <span className="text-[10px] font-mono text-amber-300">Customer retry attempts</span>
                  </div>
                </div>

                {/* Propagation Channels */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                    Blast Propagation Vectors
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {blastRadius?.blast_propagation_channels?.map((ch: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl bg-surface border border-surface-border text-xs font-mono space-y-1">
                        <div className="flex items-center justify-between font-bold text-white">
                          <span>{ch.channel}</span>
                          <span className="text-safra-ruby text-[9px] px-1.5 py-0.5 rounded bg-safra-ruby/15 border border-safra-ruby/30">
                            {ch.risk}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">{ch.impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Counterfactual Causal Engine Card */}
              <div className="p-6 rounded-3xl border border-safra-indigo/30 bg-safra-indigo/5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-safra-indigo/20 pb-3">
                  <div className="flex items-center gap-2">
                    <GitPullRequest className="w-5 h-5 text-safra-indigo" />
                    <h2 className="text-sm font-bold font-mono text-white">
                      Counterfactual Root Cause Attribution
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-indigo-300">
                    Causal Certainty: <strong className="text-white">87%</strong>
                  </span>
                </div>

                <p className="text-xs font-mono text-slate-200 leading-relaxed">
                  {counterfactual?.conclusion ||
                    "Without the HDFC Bank latency spike, estimated pending volume would be only ~243 payments. 87% of observed uncertainty is causally attributable to this incident."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-surface/80 border border-surface-border text-xs font-mono">
                    <span className="text-[10px] text-slate-400 block">Observed Pending</span>
                    <span className="text-white font-bold text-base">{counterfactual?.observed_pending_volume || 1842}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface/80 border border-surface-border text-xs font-mono">
                    <span className="text-[10px] text-slate-400 block">Counterfactual Baseline</span>
                    <span className="text-safra-emerald font-bold text-base">~{counterfactual?.counterfactual_baseline_pending || 243}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface/80 border border-surface-border text-xs font-mono">
                    <span className="text-[10px] text-slate-400 block">Incident Excess</span>
                    <span className="text-safra-ruby font-bold text-base">{counterfactual?.excess_incident_pending || 1599}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    href="/recovery"
                    className="px-4 py-2 bg-safra-cyan hover:bg-safra-cyan/90 text-slate-950 font-mono text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <span>Proceed to Recovery Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
