"use client";

import React, { useState, useMemo } from "react";
import { mockDataset, PaymentEventItem } from "@/data/mockEvents";
import {
  IndianRupee,
  Filter,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Search
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function Signals() {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter dataset dynamically
  const filteredEvents = useMemo(() => {
    return mockDataset.filter((evt) => {
      const matchesFilter =
        activeFilter === "ALL" || evt.payment_status === activeFilter;
      const matchesSearch =
        searchQuery === "" ||
        evt.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.failure_reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  // Aggregate computed metrics
  const totalEventsCount = filteredEvents.length;
  const atRiskCount = filteredEvents.filter(
    (e) => e.payment_status === "PENDING" || e.payment_status === "FAILED"
  ).length;
  const recoverableINR = filteredEvents
    .filter((e) => e.payment_status === "PENDING" || e.actual_outcome === "RECOVERED")
    .reduce((acc, curr) => acc + (curr.currency === "INR" ? curr.amount : curr.amount * 84), 0);
  const stoppedSafelyCount = filteredEvents.filter(
    (e) => e.actual_outcome === "STOPPED_SAFELY" || e.payment_status === "COMPLETED"
  ).length;

  // Chart data: Failure Reasons Breakdown
  const chartData = useMemo(() => {
    const reasonMap: Record<string, { count: number; totalValue: number }> = {};
    filteredEvents.forEach((evt) => {
      const key = evt.failure_reason.split(" - ")[0].slice(0, 22);
      if (!reasonMap[key]) reasonMap[key] = { count: 0, totalValue: 0 };
      reasonMap[key].count += 1;
      reasonMap[key].totalValue += evt.amount;
    });
    return Object.entries(reasonMap).map(([reason, data]) => ({
      name: reason,
      count: data.count,
      value: Math.round(data.totalValue),
    })).slice(0, 5);
  }, [filteredEvents]);

  const barColors = ["#0C8CE9", "#525CEB", "#00B386", "#F59E0B", "#EF4444"];

  return (
    <section id="signals" className="py-24 px-5 sm:px-8 max-w-[1280px] mx-auto border-t border-[#E2E8F0] bg-[#F8FAFC]">
      {/* Section Header */}
      <div className="max-w-[760px] mb-14">
        <span className="text-xs font-mono font-bold tracking-widest text-[#0C8CE9] uppercase block mb-3">
          02 / SIGNALS & FILTERS
        </span>
        <h2 className="font-heading text-3xl sm:text-5xl font-black text-[#0C2340] leading-[1.1]">
          Not every failed payment deserves a chase.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#334155] font-medium leading-relaxed">
          SAFRA looks for signals that tell the difference between money that is gone and money that is merely delayed.
        </p>
      </div>

      {/* Multi-Color Razorpay Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {/* Card 1: Total Events */}
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm space-y-1">
          <span className="text-xs font-mono font-bold text-[#64748B] uppercase block">
            Total Analyzed Events
          </span>
          <div className="text-3xl font-black font-mono text-[#0C2340]">
            {totalEventsCount}
          </div>
          <p className="text-xs text-[#64748B] font-mono">Dataset Stream Active</p>
        </div>

        {/* Card 2: Events At Risk (Coral Red) */}
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#FECACA] shadow-sm space-y-1">
          <span className="text-xs font-mono font-bold text-[#DC2626] uppercase block">
            Events At Risk
          </span>
          <div className="text-3xl font-black font-mono text-[#DC2626]">
            {atRiskCount}
          </div>
          <p className="text-xs text-[#64748B] font-mono">Pending / Auth Drops</p>
        </div>

        {/* Card 3: Recoverable Value (Emerald Green) */}
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#A7F3D0] shadow-sm space-y-1">
          <span className="text-xs font-mono font-bold text-[#059669] uppercase block">
            Recoverable Value
          </span>
          <div className="text-3xl font-black font-mono text-[#059669] flex items-center">
            <span className="text-xl mr-0.5 font-bold">₹</span>
            <span>{(recoverableINR / 100000).toFixed(1)}L</span>
          </div>
          <p className="text-xs text-[#059669] font-mono font-semibold">+82.4% Net Yield</p>
        </div>

        {/* Card 4: Stopped Safely (Razorpay Blue) */}
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#BFDBFE] shadow-sm space-y-1">
          <span className="text-xs font-mono font-bold text-[#2563EB] uppercase block">
            Stopped / Protected
          </span>
          <div className="text-3xl font-black font-mono text-[#2563EB]">
            {stoppedSafelyCount}
          </div>
          <p className="text-xs text-[#64748B] font-mono">0 Duplicate Charges</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E2E8F0]">
        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "PENDING", "FAILED", "ABANDONED", "RECOVERED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all border ${
                activeFilter === tab
                  ? "bg-[#0C2340] text-white border-[#0C2340] shadow-sm"
                  : "bg-[#FFFFFF] text-[#334155] border-[#CBD5E1] hover:bg-[#F1F5F9]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search merchant, failure, ID..."
            className="w-full bg-[#FFFFFF] border border-[#CBD5E1] rounded-full pl-9 pr-4 py-2 text-xs font-mono text-[#0C2340] placeholder-[#94A3B8] focus:outline-none focus:border-[#0C8CE9] shadow-sm"
          />
        </div>
      </div>

      {/* Working Charts & Live Dataset Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multi-Color Failure Breakdown Chart */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#0C2340]">
            Failure Signals Breakdown
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: "#0C2340", fontFamily: "Inter", fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{ background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "12px", color: "#0C2340", fontWeight: "bold" }}
                  formatter={(val: any) => [`${val} Events`, "Volume"]}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {chartData.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={barColors[idx % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Live Event Stream */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[#0C2340]">
            <span>Live Signal Feed</span>
            <span className="text-[#0C8CE9]">{filteredEvents.length} Matching Events</span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredEvents.slice(0, 10).map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#0C8CE9] transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#0C2340]">
                    {evt.currency === "INR" ? "₹" : "$"}{evt.amount.toLocaleString()} • {evt.merchant}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      evt.payment_status === "PENDING"
                        ? "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]"
                        : evt.payment_status === "RECOVERED"
                        ? "bg-[#E6F9F4] text-[#008764] border-[#A7F3D0]"
                        : "bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]"
                    }`}
                  >
                    {evt.payment_status}
                  </span>
                </div>

                <p className="text-xs font-mono text-[#334155] truncate font-medium">
                  {evt.failure_reason}
                </p>

                <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] pt-1.5 border-t border-[#E2E8F0]">
                  <span>{evt.customer_name} ({evt.bank})</span>
                  <span className="font-bold text-[#0C8CE9]">
                    Recovery Probability: {(evt.recovery_probability * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
