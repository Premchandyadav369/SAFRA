import React from "react";
import Link from "next/link";
import SafraLogo from "./SafraLogo";

export default function Footer() {
  return (
    <footer className="py-12 bg-paper border-t border-line font-mono text-xs text-ink-soft">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <SafraLogo dotSize={7} />
          <span className="text-muted">•</span>
          <span className="text-ink font-semibold">Track 03 — AI Revenue Recovery</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 sm:gap-8">
          <Link href="#flow" className="hover:text-ink transition-colors uppercase">
            01 / Trail
          </Link>
          <Link href="#signals" className="hover:text-ink transition-colors uppercase">
            02 / Signals
          </Link>
          <Link href="#recovery" className="hover:text-ink transition-colors uppercase">
            03 / Recovery
          </Link>
          <Link href="#graph" className="hover:text-ink transition-colors uppercase">
            04 / Graph
          </Link>
          <Link href="#batch" className="hover:text-ink transition-colors uppercase">
            05 / Proof
          </Link>
        </div>

        <div className="text-[11px] text-muted">
          Razorpay AI Buildathon • 2026
        </div>
      </div>
    </footer>
  );
}
