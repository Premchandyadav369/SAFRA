"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import SafraLogo from "./SafraLogo";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-paper/95 backdrop-blur-sm border-b border-line">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10 py-4 flex justify-between items-center">
          {/* Left: Publication Masthead Logo */}
          <Link href="/" className="flex items-center gap-3">
            <SafraLogo dotSize={7} />
            <span className="text-[10px] font-mono text-ink-soft tracking-wider uppercase pl-3 border-l border-line hidden md:inline-block">
              Revenue Recovery Intelligence
            </span>
          </Link>

          {/* Center Navigation without numbers */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-mono font-semibold tracking-wider text-ink-soft">
            <Link href="/#flow" className="hover:text-ink transition-colors uppercase">
              Trail
            </Link>
            <Link href="/#signals" className="hover:text-ink transition-colors uppercase">
              Signals
            </Link>
            <Link href="/#recovery" className="hover:text-ink transition-colors uppercase">
              Recovery
            </Link>
            <Link href="/#graph" className="hover:text-ink transition-colors uppercase">
              Graph
            </Link>
            <Link href="/#batch" className="hover:text-ink transition-colors uppercase">
              Proof
            </Link>
            <Link href="/methodology" className="hover:text-signal transition-colors uppercase font-bold text-ink">
              Methodology
            </Link>
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/graph"
              className="text-xs font-mono font-semibold text-ink hover:text-signal transition-colors flex items-center gap-1.5"
            >
              <span>GRAPH EXPLORER</span>
            </Link>

            <Link
              href="/methodology"
              className="text-xs font-display font-bold px-4 py-2 bg-ink text-paper hover:bg-ink-soft transition-colors rounded-sm flex items-center gap-2"
            >
              <span>RAZORPAY INTEGRATION</span>
              <ArrowRight className="w-3.5 h-3.5 text-signal" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-ink hover:text-signal transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Editorial Fullscreen Mobile Menu without numbers */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-paper p-8 flex flex-col justify-between md:hidden">
          <div className="flex justify-between items-center pb-6 border-b border-line">
            <SafraLogo dotSize={8} />
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-ink hover:text-signal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-6 my-auto font-display text-2xl font-bold text-ink">
            <Link
              href="/#flow"
              onClick={() => setMobileOpen(false)}
              className="hover:text-signal transition-colors flex items-center justify-between border-b border-line/60 pb-3"
            >
              <span>Transaction Trail</span>
              <ArrowRight className="w-5 h-5 text-signal" />
            </Link>
            <Link
              href="/#signals"
              onClick={() => setMobileOpen(false)}
              className="hover:text-signal transition-colors flex items-center justify-between border-b border-line/60 pb-3"
            >
              <span>Financial Signals</span>
              <ArrowRight className="w-5 h-5 text-signal" />
            </Link>
            <Link
              href="/#recovery"
              onClick={() => setMobileOpen(false)}
              className="hover:text-signal transition-colors flex items-center justify-between border-b border-line/60 pb-3"
            >
              <span>Recovery Simulator</span>
              <ArrowRight className="w-5 h-5 text-signal" />
            </Link>
            <Link
              href="/#graph"
              onClick={() => setMobileOpen(false)}
              className="hover:text-signal transition-colors flex items-center justify-between border-b border-line/60 pb-3"
            >
              <span>Topology Graph</span>
              <ArrowRight className="w-5 h-5 text-signal" />
            </Link>
            <Link
              href="/#batch"
              onClick={() => setMobileOpen(false)}
              className="hover:text-signal transition-colors flex items-center justify-between border-b border-line/60 pb-3"
            >
              <span>Batch Proof</span>
              <ArrowRight className="w-5 h-5 text-signal" />
            </Link>
            <Link
              href="/methodology"
              onClick={() => setMobileOpen(false)}
              className="hover:text-signal transition-colors flex items-center justify-between border-b border-line/60 pb-3 text-signal"
            >
              <span>End-to-End Methodology</span>
              <ArrowRight className="w-5 h-5 text-signal" />
            </Link>
          </div>

          <div className="pt-6 border-t border-line">
            <Link
              href="/methodology"
              onClick={() => setMobileOpen(false)}
              className="w-full py-3.5 bg-ink text-paper text-sm font-display font-bold flex items-center justify-center gap-2 rounded-sm"
            >
              <span>VIEW RAZORPAY INTEGRATION</span>
              <ArrowRight className="w-4 h-4 text-signal" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
