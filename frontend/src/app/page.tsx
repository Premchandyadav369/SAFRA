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
    <div className="w-full bg-paper text-ink min-h-screen font-body antialiased">
      {/* 1. Publication Masthead Navbar */}
      <Navbar />

      {/* 2. Opening Hero & Live Transaction Tape */}
      <Hero />

      {/* 3. 01 / The Trail Pipeline (#flow) */}
      <TheFlow />

      {/* 4. 02 / Signals & Investigation Ledger (#signals) */}
      <Signals />

      {/* 5. 03 / Recovery Simulator & SAFRA Note (#recovery) */}
      <RecoverySimulator />

      {/* 6. 04 / Transaction Trail Graph (#graph) */}
      <TheGraph />

      {/* 7. 05 / Audit Trail Terminal Report (#about) */}
      <AuditTrail />

      {/* 8. 06 / Batch Proof & Baseline Comparison (#batch) */}
      <BatchSimulation />

      {/* 9. Conclusion Statement */}
      <FinalCta />

      {/* 10. Publication Footer */}
      <Footer />
    </div>
  );
}
