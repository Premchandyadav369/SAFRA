"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { IndianRupee, TrendingDown, ArrowRightCircle, Sparkles, ShieldCheck, Zap } from "lucide-react";

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function Hero() {
  const scrollToFlow = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const elem = document.getElementById("flow");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full min-h-[85vh] flex flex-col justify-center items-center overflow-hidden px-5 sm:px-8 bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#EEF2F6]">
      {/* Subtle Atmospheric Video Layer */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover opacity-20 pointer-events-none"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_131516_eca35265-ea66-4fbd-8d52-22aae6e1a503.mp4"
          type="video/mp4"
        />
      </video>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-[720px] mx-auto text-center pt-10 sm:pt-14 pb-16">
        {/* Track 03 Tag Badge */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F9F4] border border-[#00B386]/30 text-[#008764] text-xs font-mono font-bold uppercase tracking-wider mb-6 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#00B386] animate-pulse" />
          <span>Razorpay Buildathon • Track 03: AI Revenue Recovery</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeUp}
          className="font-heading text-4xl sm:text-6xl lg:text-[4.2rem] font-black text-[#0C2340] leading-[1.04] tracking-tight"
        >
          Catch the{" "}
          <span className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-[#E6F9F4] text-[#00B386] border border-[#00B386]/30 align-middle -translate-y-1 mx-1 shadow-sm">
            <IndianRupee className="w-6 h-6 sm:w-8 sm:h-8" />
          </span>{" "}
          slipping <br className="hidden sm:block" />
          before it disappears{" "}
          <span className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-[#FEE2E2] text-[#EF4444] border border-[#EF4444]/30 align-middle -translate-y-1 mx-1 shadow-sm">
            <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8" />
          </span>
          .
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial="hidden"
          animate="visible"
          custom={2}
          variants={fadeUp}
          className="mt-6 text-base sm:text-lg text-[#334155] max-w-[620px] mx-auto leading-relaxed font-sans font-medium"
        >
          Some revenue doesn&apos;t fail. It hesitates, retries, gets forgotten, or quietly walks out of checkout. SAFRA follows the trail, diagnoses root causes, and chooses the safest bounded action to win it back.
        </motion.p>

        {/* Primary CTA Buttons */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={3}
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="#flow"
            onClick={scrollToFlow}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="min-w-[230px] px-7 py-4 rounded-full bg-[#0C8CE9] hover:bg-[#0274C6] text-white font-bold text-sm sm:text-base flex items-center justify-between gap-6 shadow-[0_10px_25px_rgba(12,140,233,0.3)] transition-all cursor-pointer"
          >
            <span>See what SAFRA finds</span>
            <ArrowRightCircle className="w-5 h-5" />
          </motion.a>

          <a
            href="#recovery"
            className="px-6 py-4 rounded-full bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#0C2340] font-bold text-sm border border-[#CBD5E1] shadow-sm transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-[#525CEB]" />
            <span>Interactive Simulator</span>
          </a>
        </motion.div>

        {/* Quick Micro Trust Badges */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={4}
          variants={fadeUp}
          className="mt-12 pt-8 border-t border-[#E2E8F0] grid grid-cols-3 gap-2 text-center text-xs font-mono font-bold text-[#475569]"
        >
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00B386]" />
            <span>Bounded Actions Only</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0C8CE9]" />
            <span>Gemma 3 AI Reasoning</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span>Anti-Spam Stopping Rules</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
