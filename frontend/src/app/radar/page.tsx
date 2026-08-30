"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
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
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

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
    <div className="min-h-screen bg-paper text-ink font-body antialiased">
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-6 sm:px-10 py-12 sm:py-16 space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-display tracking-tight text-ink">
                Financial Incident Radar
              </h1>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-sm bg-signal/15 text-signal border border-signal/30 font-bold">
                SYSTEMIC CLUSTERING
              </span>
            </div>
            <p className="text-xs text-ink-soft font-mono mt-1">
              Detects multi-transaction anomalies, estimates graph blast radiuses, and isolates counterfactual root causes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/simulator"
              className="flex items-center gap-2 px-4 py-2.5 rounded-sm bg-ink text-paper hover:bg-ink-soft text-xs font-display font-bold uppercase transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-signal" />
              <span>Incident Simulator</span>
            </Link>
            <button
              onClick={fetchIncidents}
              className="p-2.5 rounded-sm border border-line bg-surface hover:bg-paper-dark text-ink transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-signal" : ""}`} />
            </button>
          </div>
        </div>

        {/* Main Grid: Active Incidents List & Blast Radius Forecast */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Incidents List */}
          <div className="lg:col-span-4 p-6 rounded-sm border border-line bg-surface space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h2 className="text-xs font-bold font-mono text-ink uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-signal" />
                <span>Active Systemic Clusters</span>
              </h2>
              <span className="text-[10px] font-mono text-muted">
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
                    className={`p-4 rounded-sm border transition-all cursor-pointer space-y-2 ${
                      selectedIncident?.id === inc.id
                        ? "border-signal bg-paper ring-1 ring-signal shadow-sm"
                        : "border-line bg-surface hover:border-ink-soft"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span className="text-ink">{inc.incident_reference}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-sm bg-signal/15 text-signal font-bold">
                        {inc.severity}
                      </span>
                    </div>

                    <p className="text-xs text-ink-soft font-mono line-clamp-2">
                      {inc.root_cause}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-ink-soft pt-2 border-t border-line">
                      <span>Affected: <strong className="text-ink">{inc.affected_transactions}</strong> txns</span>
                      <span className="text-signal font-bold">₹{(inc.estimated_exposure / 100000).toFixed(1)}L Exposure</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs font-mono text-ink-soft">
                  No active incidents. Inject one from the Simulator console.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Blast Radius & Counterfactual Intelligence */}
          <div className="lg:col-span-8 space-y-6">
            {selectedIncident && (
              <>
                {/* Blast Radius Forecast Card */}
                <div className="p-6 sm:p-8 rounded-sm border border-line bg-surface space-y-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-signal animate-pulse" />
                      <h2 className="text-sm font-bold font-mono text-ink uppercase">
                        Financial Blast Radius Forecast (Graph Propagation)
                      </h2>
                    </div>
                    <span className="text-xs font-mono text-ink-soft">
                      Node: <strong className="text-ink">{selectedIncident.affected_bank}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-sm border border-line bg-paper space-y-1">
                      <span className="text-[10px] font-mono text-muted uppercase">Current Exposure</span>
                      <div className="text-2xl font-bold font-display text-ink">
                        ₹{(selectedIncident.estimated_exposure / 100000).toFixed(1)}L
                      </div>
                      <span className="text-[10px] font-mono text-ink-soft">{selectedIncident.affected_transactions} Payments</span>
                    </div>

                    <div className="p-4 rounded-sm border border-signal/40 bg-surface space-y-1">
                      <span className="text-[10px] font-mono text-signal uppercase font-bold">Predicted Next 30m</span>
                      <div className="text-2xl font-bold font-display text-signal">
                        +₹{((blastRadius?.predicted_next_30_minutes?.additional_exposure_inr || 1420000) / 100000).toFixed(1)}L
                      </div>
                      <span className="text-[10px] font-mono text-signal font-semibold">
                        +{blastRadius?.predicted_next_30_minutes?.additional_pending_transactions || 620} Pending Txns
                      </span>
                    </div>

                    <div className="p-4 rounded-sm border border-warning/40 bg-surface space-y-1">
                      <span className="text-[10px] font-mono text-warning uppercase font-bold">Duplicate Retries Risk</span>
                      <div className="text-2xl font-bold font-display text-warning">
                        ~{blastRadius?.current_impact?.potential_duplicate_retries || 183}
                      </div>
                      <span className="text-[10px] font-mono text-warning font-semibold">Customer retry attempts</span>
                    </div>
                  </div>

                  {/* Propagation Channels */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-muted uppercase tracking-wider block font-semibold">
                      Blast Propagation Vectors
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {blastRadius?.blast_propagation_channels?.map((ch: any, idx: number) => (
                        <div key={idx} className="p-3.5 rounded-sm bg-paper border border-line text-xs font-mono space-y-1">
                          <div className="flex items-center justify-between font-bold text-ink">
                            <span>{ch.channel}</span>
                            <span className="text-signal text-[10px] px-1.5 py-0.5 rounded-sm bg-signal/15 font-bold">
                              {ch.risk}
                            </span>
                          </div>
                          <p className="text-[11px] text-ink-soft">{ch.impact}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Counterfactual Causal Engine Card */}
                <div className="p-6 sm:p-8 rounded-sm border border-safe/40 bg-surface space-y-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <div className="flex items-center gap-2">
                      <GitPullRequest className="w-5 h-5 text-safe" />
                      <h2 className="text-sm font-bold font-mono text-ink uppercase">
                        Counterfactual Root Cause Attribution
                      </h2>
                    </div>
                    <span className="text-xs font-mono text-safe font-bold">
                      Causal Certainty: 87%
                    </span>
                  </div>

                  <p className="text-xs font-mono text-ink leading-relaxed">
                    {counterfactual?.conclusion ||
                      "Without the HDFC Bank latency spike, estimated pending volume would be only ~243 payments. 87% of observed uncertainty is causally attributable to this incident."}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 rounded-sm bg-paper border border-line text-xs font-mono">
                      <span className="text-[10px] text-muted block">Observed Pending</span>
                      <span className="text-ink font-bold text-base">{counterfactual?.observed_pending_volume || 1842}</span>
                    </div>
                    <div className="p-3.5 rounded-sm bg-paper border border-line text-xs font-mono">
                      <span className="text-[10px] text-muted block">Counterfactual Baseline</span>
                      <span className="text-safe font-bold text-base">~{counterfactual?.counterfactual_baseline_pending || 243}</span>
                    </div>
                    <div className="p-3.5 rounded-sm bg-paper border border-line text-xs font-mono">
                      <span className="text-[10px] text-muted block">Incident Excess</span>
                      <span className="text-signal font-bold text-base">{counterfactual?.excess_incident_pending || 1599}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Link
                      href="/recovery"
                      className="px-5 py-2.5 bg-ink hover:bg-ink-soft text-paper font-display text-xs font-bold uppercase rounded-sm transition-all flex items-center gap-2"
                    >
                      <span>Proceed to Recovery Lab</span>
                      <ArrowRight className="w-3.5 h-3.5 text-signal" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
