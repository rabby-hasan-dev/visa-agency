"use client";

import { Briefcase, GraduationCap, Map, Users, Plane, ShieldCheck, ArrowRight, Heart, Globe, Search } from "lucide-react";
import Link from "next/link";

export default function VisasPage() {
  const categories = [
    {
      title: "Visitor Visas",
      icon: Map,
      color: "blue",
      desc: "For holidays, visiting family, or short business trips to Australia.",
      types: ["Tourist Stream", "Business Visitor", "Sponsored Family"]
    },
    {
      title: "Student Visas",
      icon: GraduationCap,
      color: "emerald",
      desc: "For international students wanting to study at Australian schools or universities.",
      types: ["Student (Subclass 500)", "Student Guardian", "Training Visa"]
    },
    {
      title: "Skilled & Work",
      icon: Briefcase,
      color: "indigo",
      desc: "For professionals and skilled workers with employer sponsorship or points-testing.",
      types: ["Skilled Independent", "Employer Sponsored", "Temporary Short-stay"]
    },
    {
      title: "Family & Partner",
      icon: Heart,
      color: "rose",
      desc: "For people wanting to join their partners, parents, or children in Australia.",
      types: ["Partner Visa", "Parent Visa", "Child Visa"]
    }
  ];

  return (
    <div className="bg-[#020617] min-h-screen text-white pb-24 font-sans">
      {/* ── Hero Section ── */}
      <div className="relative pt-32 pb-40 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-600/10 to-transparent -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">
            <Globe size={12} /> Migration Directory
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
            Explore <span className="text-blue-500">Visas</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Find the right pathway for your Australian journey. We cover over 100 subclasses for every situation.
          </p>
          
          <div className="max-w-xl mx-auto relative group pt-8">
            <Search className="absolute left-4 top-[calc(50%+16px)] -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by subclass (e.g. 500, 600, 189)..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm placeholder:text-gray-500 outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all backdrop-blur-md"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10 space-y-24">
        {/* ── Category Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, i) => (
            <CategoryCard key={i} {...cat} />
          ))}
        </div>

        {/* ── Common Requirements ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
           <div className="lg:col-span-2 space-y-10">
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 md:p-16 backdrop-blur-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full translate-x-32 -translate-y-32 blur-3xl group-hover:bg-blue-600/10 transition-colors" />
                 <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                   <ShieldCheck className="text-blue-500" /> High-Level Requirements
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <RequirementItem 
                      title="Health Checks" 
                      desc="Most visas require you to meet the Australian health standard. This usually means a medical exam in Dhaka." 
                    />
                    <RequirementItem 
                      title="Character Test" 
                      desc="You must provide police certificates from every country you've lived in for 12 months or more." 
                    />
                    <RequirementItem 
                      title="Financial Support" 
                      desc="You must prove you have enough money to support yourself (and family) during your stay." 
                    />
                    <RequirementItem 
                      title="English Skills" 
                      desc="For work or study, you might need to show your IELTS or PTE scores to meet the visa conditions." 
                    />
                 </div>
              </div>

              {/* Special Interest Callout */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 md:p-12 text-white shadow-2xl shadow-blue-500/20">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4">
                       <h3 className="text-2xl font-black uppercase tracking-tight">Can't Find Your Subclass?</h3>
                       <p className="text-blue-100 text-sm max-w-md">There are many niche visas for business talent, humanitarian relief, or bridge-timing. Talk to us for a custom assessment.</p>
                    </div>
                    <Link href="/contact" className="px-10 py-4 bg-white text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all shadow-xl active:scale-95 whitespace-nowrap">
                       Get Custom Assessment
                    </Link>
                 </div>
              </div>
           </div>

           <aside className="space-y-8">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-6">
                 <h3 className="text-sm font-black uppercase tracking-widest text-blue-500">Quick Links</h3>
                 <div className="space-y-2">
                    {[
                      { l: "Check Processing Times", h: "/processing-times" },
                      { l: "Use Pricing Estimator", h: "/pricing-estimator" },
                      { l: "Support & FAQs", h: "/support" },
                      { l: "About Our Agency", h: "/about" }
                    ].map((link, i) => (
                      <Link key={i} href={link.h} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all group">
                         <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{link.l}</span>
                         <ArrowRight size={14} className="text-gray-700 group-hover:text-blue-500 transition-all" />
                      </Link>
                    ))}
                 </div>
              </div>

              <div className="p-8 border border-white/5 rounded-[2.5rem] bg-indigo-600/10 block overflow-hidden relative">
                 <Plane className="absolute -bottom-4 -right-4 text-indigo-500/10 w-24 h-24" />
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Did you know?</p>
                 <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                   Visa rules in Australia change twice a year (January and July). We monitor these changes to keep your application compliant.
                 </p>
              </div>
           </aside>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ title, desc, icon: Icon, color, types }: any) {
  const colorMap = {
    blue: "text-blue-500 border-blue-500/20 shadow-blue-500/10",
    emerald: "text-emerald-500 border-emerald-500/20 shadow-emerald-500/10",
    indigo: "text-indigo-500 border-indigo-500/20 shadow-indigo-500/10",
    rose: "text-rose-500 border-rose-500/20 shadow-rose-500/10",
  };
  const c = colorMap[color as keyof typeof colorMap];

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 space-y-8 hover:bg-white/10 transition-all duration-300 group backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className={`w-16 h-16 rounded-2xl bg-white/5 border flex items-center justify-center ${c} shadow-xl group-hover:scale-110 transition-transform`}>
          <Icon size={32} />
        </div>
        <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{types.length} Streams</div>
      </div>
      <div className="space-y-3">
        <h3 className="text-3xl font-black uppercase tracking-tighter text-white">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed font-medium">{desc}</p>
      </div>
      <div className="pt-4 flex flex-wrap gap-2">
        {types.map((type: string, i: number) => (
          <span key={i} className="px-3 py-1.5 bg-white/5 rounded-lg text-[10px] font-bold text-gray-400 border border-white/5 group-hover:border-white/10 transition-colors uppercase tracking-widest">
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}

function RequirementItem({ title, desc }: any) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-black text-white uppercase tracking-tight">{title}</h4>
      <p className="text-xs text-gray-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
