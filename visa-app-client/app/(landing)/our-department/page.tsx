"use client";
import Link from "next/link";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { TSiteSettings } from "@/types/settings";
import { Globe, ShieldCheck, Milestone, Target, Users, ArrowLeft } from "lucide-react";

export default function Page() {
  const { data: siteResponse } = useGetSiteSettingsQuery({});

  const siteSettings = (siteResponse?.data ?? {
    siteName: "Elite Visa Hub",
    brandName: "Global Passports & Visas",
    departmentName: "Advanced Immigration Consultants",
  }) as TSiteSettings;

  return (
    <div className="bg-[#040d1a] min-h-screen font-sans text-gray-200">
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

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6">About Us</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Bridging the gap between Bangladeshi aspirations and global opportunities. 
            We are more than just an agency; we are your partners in migration.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-colors" />
            <Milestone className="text-blue-500 mb-6" size={40} />
            <h2 className="text-2xl font-bold text-white mb-4">Our Dhaka Roots</h2>
            <p className="text-gray-400 leading-relaxed">
              Founded in the heart of Dhaka, {siteSettings.siteName} was established to address the 
              complexities and lack of transparency in the visa processing industry. We understand 
              the local context and the dreams of our fellow countrymen.
            </p>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] relative overflow-hidden group border-blue-500/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/30 transition-colors" />
            <ShieldCheck className="text-blue-400 mb-6" size={40} />
            <h2 className="text-2xl font-bold text-white mb-4">Australian Immigration Specialists</h2>
            <p className="text-gray-400 leading-relaxed">
              A major milestone in our journey: We have successfully secured our Australian Immigration Agency 
              license. This allows us to provide legal, certified expertise for skilled migration, 
              partner visas, and residency pathways with direct accountability.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 text-left">
          <div className="p-8 bg-white/5 border border-white/5 rounded-3xl">
            <Target className="text-indigo-400 mb-4" size={32} />
            <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              To empower individuals and businesses in Bangladesh through world-class visa advisory and 
              seamless immigration solutions built on trust and technology.
            </p>
          </div>
          
          <div className="p-8 bg-white/5 border border-white/5 rounded-3xl">
            <Globe className="text-emerald-400 mb-4" size={32} />
            <h3 className="text-xl font-bold text-white mb-3">Global Reach</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              While we specialize in Australia, our network spans the USA, UK, Canada, and Europe, 
              ensuring our clients have access to the best opportunities worldwide.
            </p>
          </div>

          <div className="p-8 bg-white/5 border border-white/5 rounded-3xl">
            <Users className="text-rose-400 mb-4" size={32} />
            <h3 className="text-xl font-bold text-white mb-3">Client Focused</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Our advanced digital portal and multi-currency fee management system are designed to 
              give you full control and clarity over your application journey.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-12 rounded-[3rem] text-center shadow-2xl shadow-blue-600/20">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to start your journey?</h3>
            <p className="text-blue-100 mb-10 max-w-2xl mx-auto text-lg">
              Combine local support with international expertise. Join thousands of successful 
              applicants who trusted {siteSettings.siteName}.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Link href="/register" className="bg-white text-blue-700 px-8 py-3 rounded-2xl font-bold hover:bg-gray-100 transition shadow-lg">Create Application Account</Link>
               <Link href="/contact" className="bg-blue-800/30 text-white border border-white/20 backdrop-blur-sm px-8 py-3 rounded-2xl font-bold hover:bg-blue-800/50 transition">Contact Our Experts</Link>
            </div>
        </div>
      </div>
    </div>
  );
}
