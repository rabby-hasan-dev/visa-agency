"use client";
import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { TSiteSettings } from "@/types/settings";

export default function Footer() {
  const { data: siteResponse } = useGetSiteSettingsQuery({});
  const siteSettings = (siteResponse?.data ?? {
    siteName: "Elite Visa Hub",
    brandName: "Global Passports & Visas",
    departmentName: "Advanced Immigration Consultants",
  }) as TSiteSettings;

  return (
    <footer className="bg-[#020610] text-gray-400 pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div className="lg:col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Globe className="text-white" size={18} />
            </div>
            <span className="font-bold text-lg text-white">
              {siteSettings.siteName}
            </span>
          </Link>
          <p className="text-sm leading-relaxed mb-8">
            Bangladesh&#39;s leading immigration agency specializing in Australian visa pathways and international 
            migration solutions.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 text-white text-sm uppercase tracking-widest">Resources</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/visas" className="hover:text-blue-400 transition">Visa Categories</Link></li>
            <li><Link href="/pricing-estimator" className="hover:text-blue-400 transition">Fee Estimator</Link></li>
            <li><Link href="/processing-times" className="hover:text-blue-400 transition">Processing Times</Link></li>
            <li><Link href="/vevo" className="hover:text-blue-400 transition">VEVO Check</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-white text-sm uppercase tracking-widest">Company</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/about" className="hover:text-blue-400 transition">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-blue-400 transition">Contact Us</Link></li>
            <li><Link href="/support" className="hover:text-blue-400 transition">Client Support</Link></li>
            <li><Link href="/faqs" className="hover:text-blue-400 transition">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-white text-sm uppercase tracking-widest">Newsletter</h4>
          <p className="text-sm mb-6">Stay updated with the latest immigration news and policy changes.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500 w-full" 
            />
            <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs gap-8">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 order-2 md:order-1">
          <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          <Link href="/legal" className="hover:text-white transition">Terms of Service</Link>
          <Link href="/copyright" className="hover:text-white transition">Copyright</Link>
          <Link href="/disclaimer" className="hover:text-white transition">Disclaimer</Link>
        </div>
        <div className="order-1 md:order-2 opacity-50">
          &copy; {new Date().getFullYear()} {siteSettings.brandName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
