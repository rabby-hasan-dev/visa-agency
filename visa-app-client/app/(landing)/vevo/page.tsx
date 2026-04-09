"use client";

import { ShieldCheck, UserCheck, Building2, HelpCircle, ArrowRight, Download, FileSearch, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function VevoPage() {
  return (
    <div className="bg-[#020617] min-h-screen text-white pb-24 font-sans">
      {/* ── Hero Section ── */}
      <div className="relative pt-32 pb-40 px-4 overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-600/10 to-transparent -z-10" />
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">
            <ShieldCheck size={12} /> Verification System
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
            What is <span className="text-blue-500">VEVO?</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-lg font-medium max-w-2xl mx-auto leading-relaxed uppercase tracking-wide px-4">
            Visa Entitlement Verification Online (VEVO) is a free tool to check your visa status and rights in Australia.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Person Path ── */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl space-y-8 group hover:bg-white/[0.07] transition-all">
             <div className="w-16 h-16 rounded-2xl bg-blue-600 shadow-xl shadow-blue-500/20 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <UserCheck size={32} />
             </div>
             <div className="space-y-4">
                <h2 className="text-3xl font-black uppercase tracking-tighter">For Visa Holders</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Are you currently in Australia or holding a valid visa? You can check your own details for free. Find out:
                </p>
                <ul className="space-y-3">
                   {["Your visa expiry date", "Your work and study rights", "Official visa conditions", "Travel entitlements"].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {item}
                     </li>
                   ))}
                </ul>
             </div>
             <a href="https://immi.homeaffairs.gov.au/visas/already-have-a-visa/check-visa-details-and-conditions/vevo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/10">
                Check My Visa Now <ExternalLink size={14} className="opacity-50" />
             </a>
          </div>

          {/* ── Organisation Path ── */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl flex flex-col justify-between group hover:bg-white/[0.07] transition-all">
             <div className="space-y-8 text-center md:text-left">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 shadow-xl shadow-emerald-500/20 flex items-center justify-center text-white mb-6 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                   <Building2 size={32} />
                </div>
                <div className="space-y-4">
                   <h2 className="text-3xl font-black uppercase tracking-tighter">For Business & School</h2>
                   <p className="text-gray-400 text-sm leading-relaxed">
                     Employers and education providers use VEVO to verify that their students or staff have the legal right to work or study in Australia.
                   </p>
                   <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1.5">Registration Required</p>
                      <p className="text-xs text-emerald-100/70 font-medium">Companies must register with the Department of Home Affairs before checking someone else's visa status.</p>
                   </div>
                </div>
             </div>
             <div className="pt-10">
                <Link href="/contact" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-500 group-hover:gap-4 transition-all">
                   Corporate Partnerships <ArrowRight size={14} />
                </Link>
             </div>
          </div>
        </div>

        {/* ── FAQ Section ── */}
        <div className="mt-24 space-y-12 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">How VEVO Works</h2>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">A simple guide for applicants</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VevoStep 
              icon={FileSearch} 
              title="What I need?" 
              desc="You only need your Passport and your Visa Grant Number or Transaction Reference (TRN)." 
            />
            <VevoStep 
              icon={Download} 
              title="Proof of Rights" 
              desc="VEVO is a 100% digital system. You can download a PDF to show your employer or school." 
            />
            <VevoStep 
              icon={ShieldCheck} 
              title="Is it safe?" 
              desc="Yes. VEVO uses the Australian government's secure servers to protect your private info." 
            />
            <VevoStep 
              icon={HelpCircle} 
              title="Need Help?" 
              desc="If your VEVO check fails, it might be due to a technical error. Our team can help you fix it." 
            />
          </div>
        </div>

        {/* ── Help Callout ── */}
        <div className="mt-24 bg-gradient-to-br from-indigo-700 to-blue-900 rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-32 -translate-y-32 blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
           <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">Can't see your visa?</h2>
              <p className="text-blue-100 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                Sometimes VEVO doesn't show your status if your passport has expired or if there's a back-end system error. Don't worry, we can help you update your credentials.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <Link href="/contact" className="px-10 py-4 bg-white text-blue-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95 shadow-xl">
                    Get Expert Assistance
                 </Link>
                 <Link href="/faqs" className="px-10 py-4 border border-white/20 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
                    View Common Issues
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function VevoStep({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex gap-6 p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:border-blue-500/30 transition-all">
       <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
          <Icon size={24} />
       </div>
       <div className="space-y-2">
          <h4 className="text-sm font-black text-white uppercase tracking-tight">{title}</h4>
          <p className="text-gray-400 text-xs font-medium leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}
