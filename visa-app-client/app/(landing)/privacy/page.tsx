"use client";
import Link from "next/link";
import { Globe, ArrowLeft, ShieldCheck, Eye, Database, FileLock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="bg-[#040d1a] min-h-screen text-gray-200 font-sans">
      {/* ─── Header ───────────────────────────────────────────────── */}
      <header className="bg-[#040d1a]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Globe className="text-white" size={18} />
            </div>
            <span className="font-bold text-lg text-white">Elite Visa Hub</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-20 px-6">
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="text-blue-400" size={28} />
            </div>
            <h1 className="text-4xl font-black text-white">Privacy Policy</h1>
          </div>

          <p className="text-gray-400 mb-10 leading-relaxed text-lg">
            At Elite Visa Hub, your privacy is our highest priority. This policy outlines how we collect, 
            process, and safeguard your personal information during your international visa application journey.
          </p>

          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Database className="text-blue-500" size={20} /> Data Collection
              </h2>
              <p className="text-gray-400 mb-4 leading-relaxed">
                To facilitate your visa application, we collect the following categories of information:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Personal Identifiers (Name, DOB, Nationality)",
                  "Travel History & Passport Records",
                  "Financial Data & Bank Statements",
                  "Educational & Professional Background",
                  "Biometric Data (where required)",
                  "Digital Records (Login IDs, Activity Logs)"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-500 bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" /> {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Eye className="text-indigo-500" size={20} /> Use of Information
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Your data is used strictly for visa processing, communication regarding application status, 
                  and ensuring compliance with international immigration laws.
                </p>
                <p>
                  <strong>Payment Security:</strong> All financial transactions are handled via 
                  SSLCommerz. We do not store your credit card or bank login credentials on our servers.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FileLock className="text-emerald-500" size={20} /> Information Security
              </h2>
              <div className="p-6 bg-blue-600/5 border border-blue-600/20 rounded-2xl">
                <p className="text-gray-400 leading-relaxed">
                  We implement end-to-end encryption for all document uploads. Our servers are protected 
                  by state-of-the-art firewalls and regular security audits. Access to your personal 
                  data is restricted to authorized consultants specifically assigned to your case.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-6">Your Rights</h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                You have the right to access, correct, or request the deletion of your personal data 
                held by our agency, subject to legal requirements for visa record keeping.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 text-blue-400 font-bold hover:underline">
                Contact our Data Protection Officer <ArrowLeft size={16} className="rotate-180" />
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

