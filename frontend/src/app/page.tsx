"use client";

import React from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TheFlow from "@/components/landing/TheFlow";
import Signals from "@/components/landing/Signals";
import RecoverySimulator from "@/components/landing/RecoverySimulator";
import TheGraph from "@/components/landing/TheGraph";
import RealWorldAnalytics from "@/components/landing/RealWorldAnalytics";
import AuditTrail from "@/components/landing/AuditTrail";
import BatchSimulation from "@/components/landing/BatchSimulation";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="w-full bg-paper text-ink min-h-screen font-body antialiased">
      {/* 1. Publication Masthead Navbar without numbers */}
      <Navbar />

      {/* 2. Opening Hero & Live Transaction Tape */}
      <Hero />

      {/* 3. Transaction Trail Pipeline (#flow) */}
      <TheFlow />

      {/* 4. Financial Signals & Investigation Ledger (#signals) */}
      <Signals />

      {/* 5. Real-World Graphs & Telemetry Analysis */}
      <RealWorldAnalytics />

      {/* 6. Autonomous Recovery Simulator & SAFRA Note (#recovery) */}
      <RecoverySimulator />

      {/* 7. Relational Topology Network Graph (#graph) */}
      <TheGraph />

      {/* 8. Deterministic Audit Trail (#about) */}
      <AuditTrail />

      {/* 9. Batch Proof & Baseline Benchmark (#batch) */}
      <BatchSimulation />

      {/* 10. Conclusion Statement */}
      <FinalCta />

      {/* 11. Publication Footer */}
      <Footer />
    </div>
  );
}
