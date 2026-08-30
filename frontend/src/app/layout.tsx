import type { Metadata } from "next";
import "./globals.css";
import "@xyflow/react/dist/style.css";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "SAFRA — AI Financial Reality, Uncertainty & Recovery Engine",
  description: "When money moves but certainty doesn't. We don't tell you a payment is pending. We tell you what is happening to your money.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-slate-100 flex flex-col font-sans">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
