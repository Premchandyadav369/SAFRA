import type { Metadata } from "next";
import "./globals.css";
import "@xyflow/react/dist/style.css";

export const metadata: Metadata = {
  title: "SAFRA — Autonomous Revenue Recovery Intelligence | Razorpay AI Buildathon",
  description: "Signal-Aware Financial Revenue Agent. Find revenue that's slipping away, diagnose root causes, and execute bounded recovery workflows with Gemma AI.",
  keywords: [
    "SAFRA",
    "Razorpay AI Buildathon",
    "Track 03",
    "AI Revenue Recovery",
    "Fintech AI",
    "Gemma 3",
    "Autonomous Payment Recovery",
    "UPI Pending Resolution"
  ],
  authors: [{ name: "Premchand Yadav" }],
  openGraph: {
    title: "SAFRA — Autonomous Revenue Recovery Intelligence",
    description: "Catch the ₹ slipping before it disappears. Autonomous revenue recovery engine for merchants.",
    siteName: "SAFRA",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAFRA — AI Revenue Recovery Intelligence",
    description: "Find revenue that's slipping away and win it back with bounded AI workflows.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8FAFC] text-[#0C2340] antialiased selection:bg-[#0C8CE9] selection:text-white">
        {children}
      </body>
    </html>
  );
}
