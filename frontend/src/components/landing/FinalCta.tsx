"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRightCircle } from "lucide-react";

export default function FinalCta() {
  const scrollToFlow = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const elem = document.getElementById("flow");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-28 px-5 sm:px-8 max-w-[1280px] mx-auto text-center border-t border-[#E2E8F0] bg-[#FFFFFF]">
      <div className="max-w-[660px] mx-auto space-y-6">
        <h2 className="font-heading text-3xl sm:text-5xl font-black text-[#0C2340] leading-[1.1]">
          Some money is gone. <br />
          Some is waiting to be found.
        </h2>

        <p className="text-base sm:text-lg text-[#334155] font-medium font-sans max-w-[520px] mx-auto">
          Explore the simulated revenue recovery environment built for the Razorpay AI Buildathon.
        </p>

        <div className="pt-4 flex justify-center">
          <motion.a
            href="#flow"
            onClick={scrollToFlow}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="min-w-[220px] px-7 py-4 rounded-full bg-[#0C8CE9] hover:bg-[#0274C6] text-white font-bold text-sm sm:text-base flex items-center justify-between gap-8 shadow-lg shadow-[#0C8CE9]/25 transition-all cursor-pointer inline-flex"
          >
            <span>Open SAFRA</span>
            <ArrowRightCircle className="w-5 h-5" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
