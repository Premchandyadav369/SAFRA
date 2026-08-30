"use client";

import React, { useState, useEffect } from "react";
import {
  Share2,
  Filter,
  Search,
  RefreshCw,
  Layers,
  Info,
  ShieldCheck,
  Building,
  CreditCard,
  Flame
} from "lucide-react";
import { SafraAPI } from "@/lib/api";
import RealityGraphCanvas from "@/components/graph/RealityGraphCanvas";

export default function GraphExplorer() {
  const [graphData, setGraphData] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
  const [filterType, setFilterType] = useState<string>("ALL");
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGraph = async () => {
    try {
      setIsLoading(true);
      const res = await SafraAPI.getGraph();
      setGraphData({ nodes: res.nodes, edges: res.edges });
    } catch (e) {
      console.error("Failed to load graph", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  const filteredNodes = graphData.nodes.filter((n) => {
    if (filterType === "ALL") return true;
    return n.data?.nodeType === filterType;
  });

  const activeNodeIds = new Set(filteredNodes.map((n) => n.id));
  const filteredEdges = graphData.edges.filter(
    (e) => activeNodeIds.has(e.source) && activeNodeIds.has(e.target)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-mono text-white">Financial Reality Graph</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-safra-indigo/15 text-safra-indigo border border-safra-indigo/30">
              NETWORKX TOPOLOGY
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Dynamic relational graph connecting customers, payments, banks, rails, gateways, and settlements.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "PAYMENT", "BANK", "MERCHANT", "INCIDENT"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                filterType === type
                  ? "bg-safra-cyan text-slate-950 font-bold"
                  : "bg-surface-card border border-surface-border text-slate-400 hover:text-white"
              }`}
            >
              {type}
            </button>
          ))}

          <button
            onClick={fetchGraph}
            className="p-2 rounded-lg border border-surface-border bg-surface-card hover:bg-surface-border text-slate-300 transition-colors ml-2"
            title="Refresh Graph"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-safra-cyan" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Canvas & Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-3">
          <RealityGraphCanvas
            nodes={filteredNodes}
            edges={filteredEdges}
            onNodeClick={(node) => setSelectedNode(node)}
            height="620px"
          />
        </div>

        {/* Node Property Inspector */}
        <div className="p-5 rounded-2xl border border-surface-border bg-surface-card space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <Info className="w-4 h-4 text-safra-cyan" />
            <h2 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
              Node Inspector
            </h2>
          </div>

          {selectedNode ? (
            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Entity ID</span>
                <div className="text-white font-bold truncate">{selectedNode.id}</div>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Node Type</span>
                <div className="text-safra-cyan font-bold">{selectedNode.data?.nodeType}</div>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Status & Health</span>
                <div className="text-white font-bold">{selectedNode.data?.status}</div>
              </div>

              {selectedNode.data?.amount && (
                <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase">Amount</span>
                  <div className="text-safra-emerald font-bold">₹{selectedNode.data?.amount.toLocaleString("en-IN")}</div>
                </div>
              )}

              {selectedNode.data?.realityScore !== undefined && (
                <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase">Reality Consistency</span>
                  <div className="text-safra-amber font-bold">{selectedNode.data?.realityScore}%</div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-xs font-mono text-slate-500 space-y-2">
              <Layers className="w-6 h-6 mx-auto text-slate-600" />
              <p>Click any node in the graph to inspect its live relational properties and connected edges.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
