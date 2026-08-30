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
  height = "560px",
}: RealityGraphCanvasProps) {
  const nodeTypes = useMemo(() => ({ safraNode: CustomSafraNode }), []);

  return (
    <div
      style={{ height }}
      className="w-full rounded-sm border border-line bg-surface relative overflow-hidden shadow-sm"
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
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#D7D2C8" />
        <Controls position="bottom-right" />
        <MiniMap
          nodeColor={(n) => {
            const type = (n.data?.nodeType as string) || "";
            if (type === "PAYMENT" || type === "PAYMENT_ATTEMPT") return "#E96B3D";
            if (type === "BANK") return "#29465B";
            if (type === "MERCHANT" || type === "SETTLEMENT") return "#2D7A61";
            if (type === "INCIDENT") return "#B94343";
            return "#121816";
          }}
          maskColor="rgba(244, 241, 234, 0.7)"
          style={{ background: "#FFFCF5", border: "1px solid #D7D2C8", borderRadius: "4px" }}
          position="bottom-left"
        />
      </ReactFlow>

      {/* Canvas Top Legend */}
      <div className="absolute top-4 left-4 bg-surface/95 border border-line px-3.5 py-2 rounded-sm flex items-center gap-4 text-[11px] font-mono pointer-events-none z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-safe" />
          <span className="text-ink">Confirmed ✓</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-signal" />
          <span className="text-ink">Risk / Stalled ⏳</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-danger" />
          <span className="text-ink">Missing Edge ✗</span>
        </div>
      </div>
    </div>
  );
}
