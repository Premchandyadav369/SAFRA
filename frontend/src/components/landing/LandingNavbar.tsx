"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import SafraLogo from "./SafraLogo";
import MobileMenu from "./MobileMenu";

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="relative z-30 w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
        {/* Left Side Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <SafraLogo width={34} height={34} className="group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-[#172A3A]">
              SAFRA
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#53616D] uppercase hidden sm:block">
              Autonomous Revenue Intelligence
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Product", href: "#product" },
            { label: "Intelligence", href: "#intelligence" },
            { label: "Recovery", href: "/recovery" },
            { label: "Simulator", href: "/simulator" },
            { label: "How It Works", href: "#how-it-works" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-[#172A3A] hover:opacity-70 transition-opacity"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/trace"
            className="px-5 py-2.5 rounded-full bg-[#EEF0EC] hover:bg-[#E2E5DF] text-[#172A3A] text-sm font-semibold transition-all"
          >
            Where Is My Money?
          </Link>

          <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-full bg-[#635BFF] hover:brightness-105 text-white text-sm font-semibold shadow-lg shadow-[#635BFF]/25 transition-all inline-flex items-center gap-2"
            >
              <span>Launch SAFRA</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-[#EEF0EC] text-[#172A3A] hover:bg-[#E2E5DF] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Over Sheet */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
