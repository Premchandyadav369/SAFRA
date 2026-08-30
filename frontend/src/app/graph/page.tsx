"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { SafraAPI } from "@/lib/api";
import RealityGraphCanvas from "@/components/graph/RealityGraphCanvas";
import SafraLogo from "@/components/landing/SafraLogo";

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
    <div className="min-h-screen bg-paper text-ink p-6 sm:p-10 space-y-8 font-body">
      {/* Top Header Masthead */}
      <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-line">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 bg-surface border border-line rounded-sm hover:border-ink transition-colors text-ink"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <SafraLogo dotSize={7} />
              <span className="text-[10px] font-mono font-bold tracking-widest text-signal uppercase pl-2 border-l border-line">
                NetworkX Topology Explorer
              </span>
            </div>
            <p className="text-xs text-ink-soft font-mono mt-1">
              Dynamic relational graph connecting customers, checkouts, banks, rails, gateways, and settlements.
            </p>
          </div>
        </div>

        {/* Filter Tabs & Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "PAYMENT", "BANK", "MERCHANT", "INCIDENT"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono transition-all border ${
                filterType === type
                  ? "bg-ink text-paper border-ink font-bold"
                  : "bg-surface border-line text-ink-soft hover:text-ink hover:border-ink"
              }`}
            >
              {type}
            </button>
          ))}

          <button
            onClick={fetchGraph}
            className="p-2 rounded-sm border border-line bg-surface hover:bg-paper-dark text-ink transition-colors ml-2"
            title="Refresh Graph"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-signal" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Canvas & Details Drawer */}
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className="lg:col-span-3">
          <RealityGraphCanvas
            nodes={filteredNodes}
            edges={filteredEdges}
            onNodeClick={(node) => setSelectedNode(node)}
            height="640px"
          />
        </div>

        {/* Node Property Inspector */}
        <div className="p-6 rounded-sm border border-line bg-surface space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-line pb-3">
            <Info className="w-4 h-4 text-signal" />
            <h2 className="text-xs font-bold font-mono text-ink uppercase tracking-wider">
              Node Inspector
            </h2>
          </div>

          {selectedNode ? (
            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-paper border border-line rounded-sm space-y-1">
                <span className="text-[10px] text-muted uppercase block">Entity ID</span>
                <div className="text-ink font-bold truncate">{selectedNode.id}</div>
              </div>

              <div className="p-3 bg-paper border border-line rounded-sm space-y-1">
                <span className="text-[10px] text-muted uppercase block">Node Type</span>
                <div className="text-signal font-bold">{selectedNode.data?.nodeType}</div>
              </div>

              <div className="p-3 bg-paper border border-line rounded-sm space-y-1">
                <span className="text-[10px] text-muted uppercase block">Status & Health</span>
                <div className="text-ink font-bold">{selectedNode.data?.status}</div>
              </div>

              {selectedNode.data?.amount && (
                <div className="p-3 bg-paper border border-line rounded-sm space-y-1">
                  <span className="text-[10px] text-muted uppercase block">Amount</span>
                  <div className="text-safe font-bold">₹{selectedNode.data?.amount.toLocaleString("en-IN")}</div>
                </div>
              )}

              {selectedNode.data?.realityScore !== undefined && (
                <div className="p-3 bg-paper border border-line rounded-sm space-y-1">
                  <span className="text-[10px] text-muted uppercase block">Reality Consistency</span>
                  <div className="text-ink font-bold">{selectedNode.data?.realityScore}%</div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-16 text-center text-xs font-mono text-ink-soft space-y-2">
              <Layers className="w-6 h-6 mx-auto text-muted" />
              <p>Click any node in the graph to inspect its live relational properties and connected edges.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
