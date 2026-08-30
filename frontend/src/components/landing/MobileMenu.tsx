"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import SafraLogo from "./SafraLogo";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: "Flow", href: "#flow" },
  { label: "Signals", href: "#signals" },
  { label: "Recovery", href: "#recovery" },
  { label: "Simulator", href: "#recovery" },
  { label: "About", href: "#about" },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#192837]/35 backdrop-blur-[4px]"
          />

          {/* Right Sheet */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            }}
            className="fixed top-0 right-0 z-50 h-[100dvh] w-[min(88vw,360px)] bg-[#CFC8C5] p-6 shadow-2xl flex flex-col justify-between"
            style={{
              boxShadow: "-12px 0 48px rgba(25,40,55,0.18)",
            }}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#192837]/15">
                <div className="flex items-center gap-2.5">
                  <SafraLogo width={28} height={28} />
                  <span className="font-bold text-base tracking-tight text-[#192837] font-heading">
                    SAFRA
                  </span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-[#192837]/10 flex items-center justify-center text-[#192837] hover:bg-[#192837]/20 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-8 space-y-2">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.label}
                    initial={{ x: 24, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      delay: 0.18 + idx * 0.07,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="block px-4 py-3 rounded-xl text-[1.1rem] font-semibold text-[#192837] hover:bg-black/5 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-6 border-t border-[#192837]/15">
              <Link
                href="#flow"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-full bg-[#7342E2] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#7342E2]/25 hover:brightness-105 transition-all"
              >
                <span>Open SAFRA</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#recovery"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-full bg-[#F2F2EE] text-[#192837] text-sm font-semibold flex items-center justify-center hover:bg-[#E7E7E2] transition-colors"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
