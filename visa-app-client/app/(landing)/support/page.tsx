"use client";

import { HelpCircle, BookOpen, MessageCircle, FileText, Search, ChevronRight, PlayCircle, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { TSiteSettings } from "@/types/settings";

export default function SupportPage() {
  const { data: siteResponse } = useGetSiteSettingsQuery({});
  const siteSettings = (siteResponse?.data || {}) as TSiteSettings;

  return (
    <div className="bg-[#020617] min-h-screen text-white pb-24 font-sans">
      {/* ── Search Hero ── */}
      <div className="relative pt-32 pb-40 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-600/10 to-transparent -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">
            <HelpCircle size={12} /> Resource Center
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
            How can we <span className="text-blue-500">Help?</span>
          </h1>
          <div className="max-w-xl mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search for visa types, health checks, or document guides..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm placeholder:text-gray-500 outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all backdrop-blur-md"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
            <span>Popular:</span>
            <button className="hover:text-blue-500 transition-colors underline decoration-blue-500/30">Student Visa</button>
            <span className="opacity-20">|</span>
            <button className="hover:text-blue-500 transition-colors underline decoration-blue-500/30">Work Rights</button>
            <span className="opacity-20">|</span>
            <button className="hover:text-blue-500 transition-colors underline decoration-blue-500/30">Health Exams</button>
          </div>
        </div>
      </div>

      {/* ── Help Categories ── */}
      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SupportCategory 
            icon={BookOpen} 
            title="Knowledge Base" 
            desc="Detailed guides on every Australian visa category."
            link="/visas"
            color="blue"
          />
          <SupportCategory 
            icon={MessageCircle} 
            title="Direct Contact" 
            desc="Talk to our specialists in Dhaka or Sydney."
            link="/contact"
            color="emerald"
          />
          <SupportCategory 
            icon={HelpCircle} 
            title="Common FAQs" 
            desc="Quick answers for frequently asked questions."
            link="/faqs"
            color="amber"
          />
          <SupportCategory 
            icon={PlayCircle} 
            title="Video Guides" 
            desc="Visual walkthroughs for our application portal."
            link="#"
            color="rose"
          />
        </div>

        {/* ── Content Sections ── */}
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                <FileText className="text-blue-500" /> Essential Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Understanding VEVO Checks",
                  "Australian Health Requirements 2024",
                  "Document Translation Guide (Bengali)",
                  "Bank Statement Certification Protocol",
                  "Standard Processing Times Overview",
                  "Refund and Cancellation Policies"
                ].map((item, i) => (
                  <Link key={i} href="#" className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group">
                    <span className="text-sm font-bold text-gray-300 group-hover:text-white">{item}</span>
                    <ChevronRight size={16} className="text-gray-600 group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </section>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-32 -translate-y-32 blur-3xl" />
               <div className="relative z-10 space-y-6">
                 <h2 className="text-3xl font-black uppercase tracking-tighter">Facing Technical Issues?</h2>
                 <p className="text-blue-100 max-w-xl text-sm leading-relaxed">
                   If you are having trouble logging into your account, uploading large biometric files, or seeing your application status, our technical team is active 24/7.
                 </p>
                 <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95 shadow-xl shadow-blue-900/20">
                    Fix Technical Problem
                 </Link>
               </div>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl space-y-6">
              <div className="flex items-center gap-3">
                 <ShieldAlert className="text-amber-500" size={24} />
                 <h3 className="text-sm font-black uppercase tracking-widest">Support Policy</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Our base support is free for all registered users. For case-specific legal migration advice, our licensed consultants provide premium consultation sessions. 
              </p>
              <Link href="/pricing-estimator" className="block text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">
                View Consultation Pricing →
              </Link>
            </div>

            <div className="p-8 border border-white/5 rounded-[2.5rem] space-y-6">
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Emergency Assistance</p>
               <div className="space-y-4">
                  <div className="space-y-1">
                     <p className="text-xs font-bold text-gray-300">Global Service Center</p>
                     <p className="text-lg font-black text-white">{siteSettings.sydneyOffice ? siteSettings.supportPhone : "+61 2 XXXXXXXX"}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-xs font-bold text-gray-300">Dhaka Priority Line</p>
                     <p className="text-lg font-black text-white">{siteSettings.contactPhone || "+880 XXXXXXXX"}</p>
                  </div>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function SupportCategory({ icon: Icon, title, desc, link, color }: any) {
  const colorMap = {
    blue: "text-blue-500 border-blue-500/20 shadow-blue-500/10",
    emerald: "text-emerald-500 border-emerald-500/20 shadow-emerald-500/10",
    amber: "text-amber-500 border-amber-500/20 shadow-amber-500/10",
    rose: "text-rose-500 border-rose-500/20 shadow-rose-500/10",
  };
  const c = colorMap[color as keyof typeof colorMap];

  return (
    <Link href={link} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-4 hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 group backdrop-blur-xl">
      <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${c} border shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-black text-white uppercase tracking-tight">{title}</h3>
        <p className="text-gray-500 text-[11px] leading-relaxed font-medium">{desc}</p>
      </div>
    </Link>
  );
}
