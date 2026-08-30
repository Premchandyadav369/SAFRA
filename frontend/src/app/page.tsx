"use client";

import React from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TheFlow from "@/components/landing/TheFlow";
import Signals from "@/components/landing/Signals";
import RecoverySimulator from "@/components/landing/RecoverySimulator";
import TheGraph from "@/components/landing/TheGraph";
import AuditTrail from "@/components/landing/AuditTrail";
import BatchSimulation from "@/components/landing/BatchSimulation";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="w-full bg-[#E9E8E2] text-[#192837] min-h-screen">
      {/* 1. Header Navbar */}
      <Navbar />

      {/* 2. Editorial Hero with Atmospheric Background Video */}
      <Hero />

      {/* 3. Section 1 — The Flow (#flow) */}
      <TheFlow />

      {/* 4. Section 2 — Signals & Working Dynamic Filters (#signals) */}
      <Signals />

      {/* 5. Section 3 — Recovery Simulator with Real Execution & Groq Reasoning (#recovery) */}
      <RecoverySimulator />

      {/* 6. Section 4 — The Graph (#graph) */}
      <TheGraph />

      {/* 7. Section 5 — Audit Trail: Why SAFRA Acted (#about) */}
      <AuditTrail />

      {/* 8. Section 6 — Batch Verification & Baseline Comparison */}
      <BatchSimulation />

      {/* 9. Final Typographic CTA */}
      <FinalCta />

      {/* 10. Minimal Footer */}
      <Footer />
    </div>
  );
}
