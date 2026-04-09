"use client";

import { AlertTriangle, ShieldCheck, Scale, ExternalLink } from "lucide-react";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { TSiteSettings } from "@/types/settings";

export default function DisclaimerPage() {
  const { data: siteResponse } = useGetSiteSettingsQuery({});
  const siteSettings = (siteResponse?.data || {}) as TSiteSettings;

  return (
    <div className="bg-[#020617] min-h-screen text-white pb-24">
      {/* ── Hero Section ── */}
      <div className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-600/10 to-transparent -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
            Legal <span className="text-blue-500">Disclaimer</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-medium max-w-xl mx-auto uppercase tracking-widest px-4">
            Essential transparency regarding our services and immigration representation.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* ── Main Information ── */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl space-y-12">
          
          {/* Private Agency Notice */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 border border-amber-500/20">
              <AlertTriangle size={28} />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-white group flex items-center gap-2">
                Independent Representation
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                {siteSettings.brandName || "Advanced Visa Agency"} is a <strong>private immigration consultancy</strong> and an independent agency. We are not affiliated with any government body. While we are licensed partners, our services are independent representations provided to clients globally.
              </p>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* No Legal Advice */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/20">
              <Scale size={28} />
            </div>
            <div className="space-y-3">
               <h2 className="text-xl font-bold tracking-tight text-white">General Information Only</h2>
               <p className="text-gray-400 text-sm leading-relaxed">
                 The content on this website is for general information and your curiosity. It is <strong>not</strong> specific legal or migration advice. Immigration laws change very often. We try our best to keep things updated, but you should always talk to one of our licensed experts before making big decisions.
               </p>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* External Links */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20">
              <ExternalLink size={28} />
            </div>
            <div className="space-y-3">
               <h2 className="text-xl font-bold tracking-tight text-white">External Connections</h2>
               <p className="text-gray-400 text-sm leading-relaxed">
                 Our website might show links to other websites. We don't own those websites and we don't control what's on them. If you click a link and go to another site, please be careful—we are not responsible for what you find there or how they handle your data.
               </p>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* No Guarantees */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0 border border-rose-500/20">
              <ShieldCheck size={28} />
            </div>
            <div className="space-y-3">
               <h2 className="text-xl font-bold tracking-tight text-white">No Result Guarantees</h2>
               <p className="text-gray-400 text-sm leading-relaxed">
                 We are experts at preparing visa applications, but we do <strong>not</strong> guarantee that your visa will be granted. The final decision always rests with the government authorities. Any mention of past successes on this site does not promise future results.
               </p>
            </div>
          </div>
        </div>

        {/* ── Footer Quote ── */}
        <div className="text-center space-y-2">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Official Transparency Notice</p>
          <p className="text-[10px] text-gray-600 italic">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} · {siteSettings.address || "International Support Center"}</p>
        </div>
      </div>
    </div>
  );
}
