import React from "react";
import Link from "next/link";
import SafraLogo from "./SafraLogo";

export default function Footer() {
  return (
    <footer className="py-12 px-5 sm:px-8 max-w-[1280px] mx-auto border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono text-[#475569] bg-[#FFFFFF]">
      <div className="flex items-center gap-2.5">
        <SafraLogo width={22} height={22} fill="#0C2340" />
        <span className="font-heading font-bold text-sm text-[#0C2340]">SAFRA</span>
        <span className="text-[#94A3B8]">•</span>
        <span className="text-[#0C8CE9] font-semibold">Track 03 — AI Revenue Recovery</span>
      </div>

      <div className="flex items-center gap-8">
        <Link href="#flow" className="hover:text-[#0C8CE9] transition-colors">
          GitHub
        </Link>
        <Link href="#signals" className="hover:text-[#0C8CE9] transition-colors">
          Buildathon Track 03
        </Link>
        <Link href="#recovery" className="hover:text-[#0C8CE9] transition-colors">
          Demo Sandbox
        </Link>
      </div>

      <div className="text-[11px] font-semibold text-[#0C2340]">
        Built for Razorpay AI Buildathon
      </div>
    </footer>
  );
}
