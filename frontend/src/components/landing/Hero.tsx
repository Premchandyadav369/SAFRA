"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { mockDataset } from "@/data/mockEvents";

export default function Hero() {
  const tickerEvents = mockDataset.slice(0, 18);

  const scrollToSection = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full pt-16 sm:pt-24 pb-14 border-b border-line overflow-hidden bg-paper">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        {/* Label Above Heading */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2 h-2 rounded-full bg-signal inline-block" />
          <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-ink-soft">
            Track 03 • Revenue Recovery Intelligence
          </span>
        </div>

        {/* Large Editorial Headline */}
        <div className="max-w-[1100px] mb-8">
          <h1 className="font-display text-[clamp(2.8rem,7.5vw,6.8rem)] font-bold text-ink leading-[0.96] tracking-[-0.04em]">
            Some money fails. <br />
            Some money waits.
          </h1>
          <p className="mt-4 font-display text-[clamp(1.5rem,3.2vw,2.8rem)] font-medium text-ink-soft tracking-tight">
            SAFRA knows the difference.
          </p>
        </div>

        {/* Investigative Context */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 pb-10 border-t border-line/70 max-w-[1100px]">
          <div className="md:col-span-8">
            <p className="text-base sm:text-lg text-ink font-body leading-relaxed max-w-[680px]">
              Revenue does not disappear in one clean moment. A payment hesitates, a checkout is abandoned, or a bank webhook is delayed. SAFRA follows the transaction trail, isolates root causes, and executes bounded recovery with zero duplicate charges.
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col justify-end gap-3 sm:items-end">
            <button
              onClick={() => scrollToSection("flow")}
              className="px-6 py-3.5 bg-ink hover:bg-ink-soft text-paper text-xs font-display font-bold tracking-wider uppercase rounded-sm flex items-center justify-between gap-4 transition-colors w-full sm:w-auto"
            >
              <span>FOLLOW THE TRAIL</span>
              <ArrowRight className="w-4 h-4 text-signal" />
            </button>

            <button
              onClick={() => scrollToSection("signals")}
              className="text-xs font-mono font-semibold text-ink-soft hover:text-ink tracking-wider uppercase underline underline-offset-4 decoration-line transition-colors sm:self-end"
            >
              SEE 500 EVENTS ↓
            </button>
          </div>
        </div>
      </div>

      {/* Live Transaction Tape Ticker */}
      <div className="w-full mt-4 pt-4 border-t border-line bg-surface/50 overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10 mb-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-muted">
          <span>Live Transaction Stream</span>
          <span>Click any event to investigate</span>
        </div>

        <div className="relative w-full overflow-hidden whitespace-nowrap py-2.5">
          <div className="animate-ticker flex items-center gap-6">
            {tickerEvents.concat(tickerEvents).map((evt, idx) => (
              <button
                key={`${evt.id}-${idx}`}
                onClick={() => scrollToSection("recovery")}
                className="inline-flex items-center gap-3 px-3 py-1.5 rounded-sm bg-paper border border-line hover:border-signal text-xs font-mono transition-colors text-left group"
              >
                <span className="font-bold text-ink">
                  {evt.currency === "INR" ? "₹" : "$"}{evt.amount.toLocaleString()}
                </span>
                <span className="text-ink-soft">{evt.payment_method}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-sm ${
                    evt.payment_status === "PENDING"
                      ? "bg-warning/15 text-warning"
                      : evt.payment_status === "RECOVERED"
                      ? "bg-safe/15 text-safe"
                      : "bg-danger/15 text-danger"
                  }`}
                >
                  {evt.payment_status}
                </span>
                <ArrowUpRight className="w-3 h-3 text-muted group-hover:text-signal transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
