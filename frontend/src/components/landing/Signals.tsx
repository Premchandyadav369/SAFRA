"use client";

import React, { useState, useMemo } from "react";
import { mockDataset, PaymentEventItem } from "@/data/mockEvents";
import { Search, ArrowUpRight, Filter } from "lucide-react";

export default function Signals() {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTxnId, setSelectedTxnId] = useState<string>("PAY-4999-HERO");

  // Dynamic filter
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

  // Aggregate metrics
  const totalEvents = filteredEvents.length;
  const atRiskEvents = filteredEvents.filter(
    (e) => e.payment_status === "PENDING" || e.payment_status === "FAILED" || e.payment_status === "ABANDONED"
  );
  const revenueAtRiskINR = atRiskEvents.reduce(
    (acc, curr) => acc + (curr.currency === "INR" ? curr.amount : curr.amount * 84),
    0
  );
  const recoverableINR = filteredEvents
    .filter((e) => e.payment_status === "PENDING" || e.actual_outcome === "RECOVERED")
    .reduce((acc, curr) => acc + (curr.currency === "INR" ? curr.amount : curr.amount * 84), 0);

  return (
    <section id="signals" className="py-20 sm:py-28 border-b border-line bg-paper">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        {/* Section Label & Statement */}
        <div className="max-w-[800px] mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-bold tracking-widest text-signal uppercase">
              FINANCIAL SIGNALS & LEDGER
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-ink leading-tight tracking-tight">
            Not every failed payment deserves a chase.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ink-soft font-body leading-relaxed max-w-[620px]">
            SAFRA distinguishes between money that is gone and money that is merely delayed.
          </p>
        </div>

        {/* Large Numerical Composition (No generic cards) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-10 border-y border-line mb-14">
          <div className="md:col-span-4 space-y-1">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
              Revenue Currently At Risk
            </div>
            <div className="font-display text-4xl sm:text-6xl font-bold text-ink tracking-tight">
              ₹{(revenueAtRiskINR / 100000).toFixed(1)}L
            </div>
            <p className="text-xs font-mono text-signal font-semibold pt-1">
              {atRiskEvents.length} transactions requiring signal analysis
            </p>
          </div>

          <div className="md:col-span-4 space-y-1 md:border-l md:border-line md:pl-8">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
              Likely Recoverable
            </div>
            <div className="font-display text-4xl sm:text-6xl font-bold text-safe tracking-tight">
              82.4%
            </div>
            <p className="text-xs font-mono text-safe font-semibold pt-1">
              ₹{(recoverableINR / 100000).toFixed(1)}L recoverable without customer friction
            </p>
          </div>

          <div className="md:col-span-4 space-y-1 md:border-l md:border-line md:pl-8">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
              Duplicate Retries Blocked
            </div>
            <div className="font-display text-4xl sm:text-6xl font-bold text-ink tracking-tight">
              100%
            </div>
            <p className="text-xs font-mono text-ink-soft font-semibold pt-1">
              0 duplicate debits permitted across 500 events
            </p>
          </div>
        </div>

        {/* Editorial Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 mb-6 border-b border-line">
          <div className="flex items-center gap-6 sm:gap-8 text-xs font-mono font-bold uppercase tracking-wider">
            {["ALL", "PENDING", "FAILED", "ABANDONED", "RECOVERED"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`pb-2 transition-all relative ${
                  activeFilter === tab
                    ? "text-ink border-b-2 border-signal"
                    : "text-muted hover:text-ink"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-80 relative">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search merchant, failure reason, ID..."
              className="w-full bg-surface border border-line rounded-sm pl-9 pr-4 py-2 text-xs font-mono text-ink placeholder-muted focus:outline-none focus:border-signal"
            />
          </div>
        </div>

        {/* Investigation Ledger Table (Investigation Rows) */}
        <div className="w-full border border-line bg-surface rounded-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line text-[11px] font-mono uppercase tracking-wider text-muted bg-paper-dark/40">
                <th className="py-3 px-4 font-semibold">Event ID</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Merchant / Buyer</th>
                <th className="py-3 px-4 font-semibold">Method / Bank</th>
                <th className="py-3 px-4 font-semibold">Reason / Signal</th>
                <th className="py-3 px-4 font-semibold text-right">P(Recovery)</th>
                <th className="py-3 px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-xs font-mono">
              {filteredEvents.slice(0, 12).map((evt) => {
                const isSelected = evt.id === selectedTxnId;

                return (
                  <tr
                    key={evt.id}
                    onClick={() => setSelectedTxnId(evt.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-paper border-l-2 border-signal"
                        : "hover:bg-paper/70"
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-ink">
                      {evt.id}
                    </td>
                    <td className="py-3 px-4 font-display font-bold text-sm text-ink">
                      {evt.currency === "INR" ? "₹" : "$"}{evt.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-ink-soft">
                      <span className="font-semibold text-ink">{evt.merchant}</span> • {evt.customer_name}
                    </td>
                    <td className="py-3 px-4 text-ink-soft">
                      {evt.payment_method} ({evt.bank})
                    </td>
                    <td className="py-3 px-4 text-ink-soft max-w-[280px] truncate font-medium">
                      {evt.failure_reason}
                    </td>
                    <td className="py-3 px-4 font-bold text-right text-ink">
                      {(evt.recovery_probability * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                          evt.payment_status === "PENDING"
                            ? "bg-warning/15 text-warning"
                            : evt.payment_status === "RECOVERED"
                            ? "bg-safe/15 text-safe"
                            : "bg-danger/15 text-danger"
                        }`}
                      >
                        {evt.payment_status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
