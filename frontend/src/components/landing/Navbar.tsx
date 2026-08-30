"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import SafraLogo from "./SafraLogo";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-3.5 sm:py-4 flex justify-between items-center">
          {/* Left: Logo + Wordmark */}
          <Link href="/" className="flex items-center gap-3 group">
            <SafraLogo width={30} height={30} fill="#0C2340" />
            <div className="flex flex-col">
              <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-[#0C2340]">
                SAFRA
              </span>
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#0C8CE9] uppercase hidden sm:block">
                Track 03 • AI Revenue Recovery
              </span>
            </div>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Flow", href: "#flow" },
              { label: "Signals", href: "#signals" },
              { label: "Recovery", href: "#recovery" },
              { label: "Graph", href: "#graph" },
              { label: "Audit", href: "#about" },
              { label: "Batch Proof", href: "#batch" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-semibold text-[#334155] hover:text-[#0C8CE9] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="#recovery"
              className="text-xs font-mono font-bold px-4 py-2 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0C2340] transition-colors border border-[#CBD5E1]"
            >
              Demo Sandbox
            </Link>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="#flow"
                className="text-xs font-mono font-bold px-5 py-2.5 rounded-full bg-[#0C8CE9] hover:bg-[#0274C6] text-white shadow-md shadow-[#0C8CE9]/25 transition-all inline-flex items-center gap-1.5"
              >
                <span>Open SAFRA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg bg-[#F1F5F9] text-[#0C2340] hover:bg-[#E2E8F0] transition-colors border border-[#E2E8F0]"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
