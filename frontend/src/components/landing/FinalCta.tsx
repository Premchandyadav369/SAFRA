"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export default function FinalCta() {
  const scrollToSection = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 sm:py-32 bg-ink text-paper border-t border-line">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        <div className="max-w-[960px] space-y-6">
          <div className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-signal">
            ● CONCLUSION
          </div>

          <h2 className="font-display text-4xl sm:text-7xl font-bold tracking-[-0.04em] leading-[0.96]">
            Some money is gone. <br />
            Some is still waiting.
          </h2>

          <p className="font-display text-2xl sm:text-4xl text-paper/70 font-medium tracking-tight">
            SAFRA exists to know the difference.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={() => scrollToSection("flow")}
              className="px-8 py-4 bg-signal hover:bg-signal-dark text-paper text-xs font-display font-bold uppercase tracking-wider rounded-sm flex items-center justify-between gap-6 transition-colors cursor-pointer"
            >
              <span>OPEN THE INVESTIGATION</span>
              <ArrowRight className="w-4 h-4 text-paper" />
            </button>

            <button
              onClick={() => scrollToSection("recovery")}
              className="px-6 py-4 border border-paper/20 hover:border-paper/60 text-paper text-xs font-mono font-semibold uppercase tracking-wider rounded-sm transition-colors"
            >
              TRY RECOVERY SIMULATOR
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
