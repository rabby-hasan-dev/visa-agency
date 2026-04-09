"use client";

import { FileLock, UserCheck, ShieldCheck, DownloadCloud } from "lucide-react";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { TSiteSettings } from "@/types/settings";

export default function CopyrightPage() {
  const currentYear = new Date().getFullYear();
  const { data: siteResponse } = useGetSiteSettingsQuery({});
  const siteSettings = (siteResponse?.data || {}) as TSiteSettings;

  return (
    <div className="bg-[#020617] min-h-screen text-white pb-24">
      {/* ── Hero Section ── */}
      <div className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-600/10 to-transparent -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">
            <ProtectIcon /> Intellectual Property
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
            Copyright <span className="text-blue-500">Notice</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-medium max-w-xl mx-auto uppercase tracking-widest px-4">
            Protecting the assets and digital content of our Bangladeshi-Australian partnership.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* ── Main Information ── */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl space-y-12">
          
          {/* Ownership Status */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0 border border-blue-500/20 shadow-lg shadow-blue-500/5">
              <ShieldCheck size={28} />
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight text-white uppercase">Ownership of Content</h2>
                <div className="text-blue-500 font-mono text-xs font-bold">&copy; {currentYear} {siteSettings.brandName || "Visa Central Partner"}.</div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Everything you see on this website belongs to us or our Australian partners. This includes the text, the buttons, the cool graphics, and even the way the pages are laid out. These things are protected by law in Bangladesh, Australia, and all around the world.
              </p>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* Permitted Use */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
              <DownloadCloud size={28} />
            </div>
            <div className="space-y-4">
               <h2 className="text-xl font-bold tracking-tight text-white uppercase">What You Can Do</h2>
               <p className="text-gray-400 text-sm leading-relaxed">
                 You are allowed to save, print, or download bits of this website <strong>only for your own personal use</strong> (like sharing a visa fact with your family). You can show it to your friends to help them learn about Australia.
               </p>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* Prohibited Use */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0 border border-rose-500/20 shadow-lg shadow-rose-500/5">
              <FileLock size={28} />
            </div>
            <div className="space-y-4">
               <h2 className="text-xl font-bold tracking-tight text-white uppercase">What You Cannot Do</h2>
               <p className="text-gray-400 text-sm leading-relaxed">
                 You are <strong>not allowed</strong> to take our information and use it to make money or build your own website. You cannot change our words, copy our designs for business, or pretend that you own this content. If you want to use our work for something big, you must ask us for permission in writing first.
              </p>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* Partner Acknowledgement */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
              <UserCheck size={28} />
            </div>
            <div className="space-y-4">
               <h2 className="text-xl font-bold tracking-tight text-white uppercase">Our Trusted Partners</h2>
               <p className="text-gray-400 text-sm leading-relaxed">
                 Some of the images or specialized information we use might belong to our official Australian migration partners. Even if it's theirs, the same rules apply—it's still protected property.
               </p>
            </div>
          </div>
        </div>

        {/* ── Footer Quote ── */}
        <div className="text-center space-y-2">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Protection of Digital Assets</p>
          <p className="text-[10px] text-gray-600 italic">Global Rights Reserved · {siteSettings.address || "Bangladesh Operations"}</p>
        </div>
      </div>
    </div>
  );
}

function ProtectIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copyright"><circle cx="12" cy="12" r="10"/><path d="M14.83 14.83a4 4 0 1 1 0-5.66"/></svg>
  );
}
