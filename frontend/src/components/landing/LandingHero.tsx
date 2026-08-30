"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  IndianRupee,
  Network,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Activity
} from "lucide-react";
import RevenueFlow from "./RevenueFlow";
import TrustSignals from "./TrustSignals";

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function LandingHero() {
  return (
    <div className="relative min-h-[100svh] w-full overflow-hidden bg-[#F6F6F2]">
      {/* Looping Atmospheric Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover opacity-35 pointer-events-none"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_131516_eca35265-ea66-4fbd-8d52-22aae6e1a503.mp4"
          type="video/mp4"
        />
      </video>

      {/* Atmospheric Soft Gradient Overlays (Warm White to Subtle Blue-Gray) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#F6F6F2]/80 to-[#EEF0EC] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(99,91,255,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 pt-8 sm:pt-14 pb-12 text-center">
        {/* Eyebrow Badge */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-[#172A3A]/8 shadow-sm mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-[#16856B] animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-widest text-[#172A3A] uppercase">
            LIVE REVENUE INTELLIGENCE
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeUp}
          className="font-heading text-4xl sm:text-6xl lg:text-[5.3rem] font-extrabold tracking-tight text-[#172A3A] leading-[1.02] max-w-4xl mx-auto"
        >
          Find the{" "}
          <span className="inline-flex items-center justify-center w-9 h-9 sm:w-14 sm:h-14 rounded-2xl bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20 align-middle -translate-y-1 mx-1">
            <IndianRupee className="w-5 h-5 sm:w-8 sm:h-8" />
          </span>{" "}
          money slipping away. <br className="hidden sm:block" />
          Understand why{" "}
          <span className="inline-flex items-center justify-center w-9 h-9 sm:w-14 sm:h-14 rounded-2xl bg-[#172A3A]/10 text-[#172A3A] border border-[#172A3A]/20 align-middle -translate-y-1 mx-1">
            <Network className="w-5 h-5 sm:w-8 sm:h-8" />
          </span>
          . <br className="hidden sm:block" />
          Recover it safely{" "}
          <span className="inline-flex items-center justify-center w-9 h-9 sm:w-14 sm:h-14 rounded-2xl bg-[#16856B]/15 text-[#16856B] border border-[#16856B]/25 align-middle -translate-y-1 mx-1">
            <TrendingUp className="w-5 h-5 sm:w-8 sm:h-8" />
          </span>
          .
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial="hidden"
          animate="visible"
          custom={2}
          variants={fadeUp}
          className="mt-6 text-base sm:text-lg text-[#53616D] max-w-2xl mx-auto leading-relaxed font-sans"
        >
          SAFRA maps where revenue leaks across payments and checkout journeys, investigates what went wrong, and chooses the safest action to win it back.
        </motion.p>

        {/* Primary CTA & Secondary Action */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={3}
          variants={fadeUp}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/trace"
              className="min-w-[240px] px-6 py-4 rounded-full bg-[#635BFF] hover:brightness-105 text-white font-semibold text-base shadow-[0_8px_28px_rgba(99,91,255,0.28)] flex items-center justify-between gap-6 transition-all"
            >
              <span>See Revenue Recovery</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <Link
            href="/investigate/PAY-4999-HERO"
            className="text-sm font-semibold text-[#172A3A] hover:text-[#635BFF] flex items-center gap-1 transition-colors px-4 py-2"
          >
            <span>Watch the Recovery Flow</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Signature Animated Revenue Leakage Flow Component */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={4}
          variants={fadeUp}
          className="mt-10"
        >
          <RevenueFlow />
        </motion.div>

        {/* Safety & AI Trust Signals */}
        <TrustSignals />
      </div>
    </div>
  );
}
