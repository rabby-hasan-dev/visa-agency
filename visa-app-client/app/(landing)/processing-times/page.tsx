"use client";

import { Clock, AlertCircle, CheckCircle2, Info, ChevronRight, TrendingUp, Calendar, Zap } from "lucide-react";
import Link from "next/link";

export default function ProcessingTimesPage() {
  const visaTimes = [
    { category: "Visitor Visa (600)", class: "Tourist", time75: "14 Days", time90: "28 Days", status: "stable" },
    { category: "Student Visa (500)", class: "Higher Education", time75: "21 Days", time90: "45 Days", status: "peak" },
    { category: "Temporary Work (482)", class: "Short-term", time75: "12 Days", time90: "24 Days", status: "stable" },
    { category: "Partner Visa (820)", class: "Onshore", time75: "12 Months", time90: "18 Months", status: "delayed" },
    { category: "Skilled Independent (189)", class: "Points-tested", time75: "6 Months", time90: "12 Months", status: "stable" },
  ];

  return (
    <div className="bg-[#020617] min-h-screen text-white pb-24 font-sans focus:outline-none">
      {/* ── Hero Section ── */}
      <div className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-600/10 to-transparent -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">
            <Clock size={12} className="animate-pulse" /> Live Performance Monitor
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
            Processing <span className="text-blue-500">Times</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Updated monthly data on how long Australian visa applications are taking to process.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-16">
        {/* ── Dynamic Table ── */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="space-y-1">
                <h2 className="text-xl font-black uppercase tracking-tight">Global Averages</h2>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Dataset: April 2024 Release</p>
             </div>
             <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                   <TrendingUp size={12} /> Stable Performance
                </div>
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  <th className="px-8 py-5 text-left">Visa Subclass</th>
                  <th className="px-8 py-5 text-left">Stream</th>
                  <th className="px-8 py-5 text-center">75% of Apps</th>
                  <th className="px-8 py-5 text-center">90% of Apps</th>
                  <th className="px-8 py-5 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {visaTimes.map((visa, i) => (
                  <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        <span className="text-sm font-bold text-gray-200">{visa.category}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs text-gray-400 font-medium">{visa.class}</td>
                    <td className="px-8 py-6 text-center">
                       <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-black text-blue-400 border border-white/5">{visa.time75}</span>
                    </td>
                    <td className="px-8 py-6 text-center text-sm font-black text-white tabular-nums">{visa.time90}</td>
                    <td className="px-8 py-6 text-right">
                       <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                         visa.status === 'stable' ? 'bg-emerald-500/10 text-emerald-500' :
                         visa.status === 'peak' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                       }`}>
                         {visa.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Why times vary ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
               <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                 <Info className="text-blue-500" /> Why wait times differ?
               </h2>
               <p className="text-gray-400 text-sm leading-relaxed">
                 Australian visa processing is not a "first-in, first-out" system. Several factors can speed up or slow down your application. Here is what you need to know in simple terms:
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FactorCard 
                    title="Missing Documents" 
                    desc="If you forget a form or a medical check, your app stops while we wait for it."
                    icon={AlertCircle}
                  />
                  <FactorCard 
                    title="Security Checks" 
                    desc="Verifying documents in Bangladesh or offshore can take extra time."
                    icon={Zap}
                  />
                  <FactorCard 
                    title="Application Volume" 
                    desc="During high seasons (like before school starts), times naturally increase."
                    icon={TrendingUp}
                  />
                  <FactorCard 
                    title="External Agencies" 
                    desc="Waiting for police checks or medical provider updates is outside our control."
                    icon={Calendar}
                  />
               </div>
            </div>

            <div className="bg-blue-600 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-32 -translate-y-32 blur-3xl group-hover:scale-110 transition-transform" />
               <div className="space-y-4 relative z-10">
                  <h3 className="text-3xl font-black tracking-tight uppercase">Ready to Start?</h3>
                  <p className="text-blue-100 text-sm max-w-md leading-relaxed">
                    Most delays can be avoided by submitting a Decision Ready application. Our experts ensure every document is perfect before submission.
                  </p>
               </div>
               <Link href="/visas" className="flex items-center gap-2 bg-white text-blue-600 px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:translate-x-1 transition-all shadow-xl active:scale-95 whitespace-nowrap">
                  View Visa Types <ChevronRight size={16} />
               </Link>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
               <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                 <CheckCircle2 size={16} className="text-emerald-500" /> How to be faster
               </h3>
               <ul className="space-y-6">
                 {[
                   { t: "Decision Ready", d: "Attach all supporting evidence immediately." },
                   { t: "Fast Responses", d: "Reply to help requests within 48 hours." },
                   { t: "Biometrics", d: "Book your VFS appointment as soon as requested." }
                 ].map((tip, i) => (
                   <li key={i} className="space-y-1">
                     <p className="text-xs font-black text-gray-200 uppercase tracking-tight">{tip.t}</p>
                     <p className="text-xs text-gray-500 font-medium leading-relaxed">{tip.d}</p>
                   </li>
                 ))}
               </ul>
            </div>
            
            <div className="p-8 border border-white/5 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent">
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Note on Times</p>
               <p className="text-[10px] text-gray-400 leading-relaxed italic">
                 Processing times are global averages and should only be used as a guide. Individual circumstances may vary significantly.
               </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function FactorCard({ title, desc, icon: Icon }: any) {
  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3 hover:bg-white/10 transition-all group">
      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
        <Icon size={20} />
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-black text-white uppercase tracking-tight">{title}</h4>
        <p className="text-[11px] text-gray-500 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}
