"use client";

import Link from "next/link";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { TSiteSettings } from "@/types/settings";
import { Globe, ArrowLeft, ShieldCheck, Lock, Info, ScrollText, AlertCircle } from "lucide-react";

export default function LegalLandingPage() {
  const { data: siteResponse } = useGetSiteSettingsQuery({});

  const siteSettings = (siteResponse?.data ?? {
    siteName: "Elite Visa Hub",
    brandName: "Global Passports & Visas",
    departmentName: "Advanced Immigration Consultants",
  }) as TSiteSettings;

  return (
    <main className="bg-[#040d1a] min-h-screen font-sans text-gray-200 overflow-x-hidden">
      {/* ─── Header ───────────────────────────────────────────────── */}
      <header className="bg-[#040d1a]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Globe className="text-white" size={18} />
            </div>
            <span className="font-bold text-lg text-white">
              {siteSettings.siteName}
            </span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </header>

      {/* Navigation Sub-header */}
      <nav className="bg-white/5 border-b border-white/10 backdrop-blur-sm sticky top-[65px] z-40">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap gap-6 py-4">
          {[
            "Disclaimer",
            "Terms",
            "Privacy",
            "Security",
          ].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* Content wrapper */}
      <div className="max-w-4xl mx-auto px-6 py-20 space-y-24">
        {/* Disclaimer Section */}
        <section id="disclaimer" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <Info className="text-blue-400" size={24} />
            </div>
            <h2 className="text-3xl font-black text-white">Agency Disclaimer</h2>
          </div>
          <div className="space-y-6 text-gray-400 leading-relaxed bg-white/5 p-8 rounded-3xl border border-white/10">
            <p className="text-white font-bold text-lg mb-4">Important Notice</p>
            <p>
              {siteSettings.siteName} is a private immigration consultancy firm. We are NOT a government agency 
              and we are NOT affiliated with the {siteSettings.brandName} or any government immigration department.
            </p>
            <p>
              While we are a licensed partner for Australian Immigration services, our role is to provide 
              expert advisory and facilitation. The final decision on any visa application rests solely 
              with the respective government authorities (e.g., Department of Home Affairs, US Department of State, etc.).
            </p>
            <p>
              The information provided on this platform is for general guidance and does not constitute 
              legal advice. We strive for 100% accuracy, but immigration policies are subject to rapid 
              changes.
            </p>
          </div>
        </section>

        {/* Terms Section */}
        <section id="terms" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
              <ScrollText className="text-indigo-400" size={24} />
            </div>
            <h2 className="text-3xl font-black text-white">Terms of Service</h2>
          </div>
          <div className="space-y-6 text-gray-400 leading-relaxed">
            <h3 className="text-xl font-bold text-white">1. Service Agreement</h3>
            <p>
              By using our portal, you agree to provide truthful and accurate information for your visa 
              applications. Misrepresentation of facts can lead to application refusal and permanent 
              bans by government authorities. {siteSettings.siteName} is not responsible for 
              refusals resulting from inaccurate client data.
            </p>
            <h3 className="text-xl font-bold text-white">2. Fee Management & Refunds</h3>
            <p>
              Visa application fees are non-refundable once processed through government portals. 
              Our agency service fees are also non-refundable after the consultation or documentation 
              phase has commenced. All payments are processed securely via SSLCommerz.
            </p>
            <h3 className="text-xl font-bold text-white">3. Processing Times</h3>
            <p>
              Processing times mentioned on this site are estimates based on current trends and government 
              service standards. We do not guarantee specific turnaround times.
            </p>
          </div>
        </section>

        {/* Privacy Section */}
        <section id="privacy" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="text-emerald-400" size={24} />
            </div>
            <h2 className="text-3xl font-black text-white">Privacy Policy</h2>
          </div>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Your privacy is paramount. We handle sensitive documents including passports, bank statements, 
            and personal records with the highest level of confidentiality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
              <h4 className="font-bold text-white mb-3">Data Collection</h4>
              <p className="text-sm text-gray-500">
                We collect biometric data, travel history, and financial records exclusively for the purpose 
                of your visa application.
              </p>
            </div>
            <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
              <h4 className="font-bold text-white mb-3">Third-Party Sharing</h4>
              <p className="text-sm text-gray-500">
                Data is only shared with official government immigration portals and secure payment gateways 
                (SSLCommerz). We NEVER sell your data.
              </p>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center">
              <Lock className="text-rose-400" size={24} />
            </div>
            <h2 className="text-3xl font-black text-white">Data Security</h2>
          </div>
          <div className="space-y-6 text-gray-400 leading-relaxed">
            <p>
              Our infrastructure utilizes enterprise-grade encryption for all data at rest and in transit. 
              We use 256-bit SSL encryption to protect your personal and financial information.
            </p>
            <div className="flex items-start gap-4 p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
              <AlertCircle size={24} className="text-amber-500 flex-shrink-0" />
              <div>
                <p className="font-bold text-amber-500 mb-1">User Responsibility</p>
                <p className="text-sm text-gray-500">
                  Always ensure you are logged out of your {siteSettings.siteName} account on public computers. 
                  Use a strong, unique password and enable two-factor authentication if available.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[#020610] text-gray-500 py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs gap-6">
          <div className="flex gap-8">
            <span>&copy; {new Date().getFullYear()} {siteSettings.brandName}</span>
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-blue-500" />
            Licensed Immigration Agency
          </div>
        </div>
      </footer>
    </main>
  );
}
