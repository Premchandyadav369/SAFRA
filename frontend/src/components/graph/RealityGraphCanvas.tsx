"use client";

import React, { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  BackgroundVariant
} from "@xyflow/react";
import { CustomSafraNode } from "./CustomNode";

interface RealityGraphCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick?: (node: Node) => void;
  height?: string;
}

export default function RealityGraphCanvas({
  nodes,
  edges,
  onNodeClick,
  height = "550px",
}: RealityGraphCanvasProps) {
  const nodeTypes = useMemo(() => ({ safraNode: CustomSafraNode }), []);

  return (
    <div
      style={{ height }}
      className="w-full rounded-2xl border border-surface-border bg-surface-card/60 backdrop-blur-xl relative overflow-hidden shadow-2xl"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeClick && onNodeClick(node)}
        fitView
        minZoom={0.2}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color="#1E2A42" />
        <Controls position="bottom-right" />
        <MiniMap
          nodeColor={(n) => {
            const type = (n.data?.nodeType as string) || "";
            if (type === "PAYMENT") return "#06B6D4";
            if (type === "BANK") return "#6366F1";
            if (type === "MERCHANT") return "#10B981";
            if (type === "INCIDENT") return "#EF4444";
            return "#64748B";
          }}
          maskColor="rgba(8, 11, 17, 0.7)"
          style={{ background: "#0F1623", border: "1px solid #1E2A42", borderRadius: "8px" }}
          position="bottom-left"
        />
      </ReactFlow>

      {/* Canvas Top Legend */}
      <div className="absolute top-4 left-4 bg-surface/90 border border-surface-border px-3 py-2 rounded-xl backdrop-blur-md flex items-center gap-4 text-[11px] font-mono pointer-events-none z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-safra-emerald" />
          <span className="text-slate-300">Observed (✓)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-safra-amber" />
          <span className="text-slate-300">Uncertain (⏳)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-safra-ruby" />
          <span className="text-slate-300">Missing / Drift (✗)</span>
        </div>
      </div>
    </div>
  );
}
