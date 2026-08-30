import React from "react";
import { ShieldCheck, Activity, Network } from "lucide-react";

export default function TrustSignals() {
  const signals = [
    {
      icon: ShieldCheck,
      title: "Bounded AI Actions",
      description: "Human-in-the-loop governance for all high-risk recovery actions.",
      color: "text-[#16856B]",
    },
    {
      icon: Activity,
      title: "Real-Time Revenue Signals",
      description: "Sub-second anomaly detection across UPI, Cards, and NetBanking.",
      color: "text-[#635BFF]",
    },
    {
      icon: Network,
      title: "Graph-Based Investigation",
      description: "Dynamic topology traces money movement across fragmented rails.",
      color: "text-[#172A3A]",
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 py-8 max-w-4xl mx-auto border-t border-[#172A3A]/10">
      {signals.map((sig, idx) => {
        const Icon = sig.icon;
        return (
          <div key={idx} className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-[#EEF0EC] flex items-center justify-center shrink-0">
              <Icon className={`w-5 h-5 ${sig.color}`} />
            </div>
            <div>
              <div className="text-xs font-bold font-heading text-[#172A3A]">
                {sig.title}
              </div>
              <div className="text-[11px] text-[#53616D] font-mono leading-tight">
                {sig.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
