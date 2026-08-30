"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  BrainCircuit,
  Share2,
  Radar,
  Building2,
  ShieldAlert,
  History,
  SlidersHorizontal,
  Flame
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Command Center", href: "/dashboard", icon: LayoutDashboard, tag: "CORE" },
    { label: "Where Is My Money?", href: "/trace", icon: Search, badge: "Hero Demo", badgeColor: "bg-safra-cyan/15 text-safra-cyan border-safra-cyan/30" },
    { label: "Investigation Room", href: "/investigate/PAY-4999-HERO", icon: BrainCircuit, tag: "AI AGENT" },
    { label: "Financial Reality Graph", href: "/graph", icon: Share2 },
    { label: "Incident Radar", href: "/radar", icon: Radar, badge: "Blast Radius", badgeColor: "bg-safra-ruby/15 text-safra-ruby border-safra-ruby/30" },
    { label: "Merchant Digital Twin", href: "/merchant", icon: Building2, tag: "DRIFT" },
    { label: "Recovery Lab", href: "/recovery", icon: ShieldAlert, tag: "HUMAN-IN-LOOP" },
    { label: "Incident Replay", href: "/replay", icon: History },
    { label: "Mission Simulator", href: "/simulator", icon: SlidersHorizontal, badge: "LIVE", badgeColor: "bg-safra-emerald/15 text-safra-emerald border-safra-emerald/30" },
  ];

  return (
    <aside className="w-64 border-r border-surface-border bg-surface flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)] hidden md:flex">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-3">
            Intelligence Engines
          </span>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href) && item.href !== "/dashboard");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? "bg-safra-indigo/15 text-white border border-safra-indigo/30 shadow-sm shadow-safra-indigo/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-surface-card"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? "text-safra-cyan" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  ) : item.tag ? (
                    <span className="text-[9px] font-mono text-slate-500 uppercase">
                      {item.tag}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Hero Demo Quick-Launcher Card */}
        <div className="bg-gradient-to-br from-surface-card to-safra-indigo/10 border border-safra-indigo/20 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-safra-cyan">
            <Flame className="w-3.5 h-3.5 text-safra-amber animate-pulse" />
            <span>Hero Demo Story</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Aryan pays ₹4,999. Money debited, merchant unconfirmed. SAFRA investigates, predicts 81% success, and blocks duplicate retry.
          </p>
          <Link
            href="/trace"
            className="block text-center w-full py-1.5 px-2 bg-safra-cyan/15 hover:bg-safra-cyan/25 border border-safra-cyan/30 text-safra-cyan rounded-lg text-xs font-mono font-medium transition-all"
          >
            Launch ₹4,999 Trace →
          </Link>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="border-t border-surface-border pt-4 px-2 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Engine Status</span>
          <span className="text-safra-emerald flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-safra-emerald animate-ping" />
            Nominal
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-600">
          NetworkX Graph + Groq AI + ML Regressors
        </div>
      </div>
    </aside>
  );
}
