"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, MessageSquare, Clock, Globe, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { useCreateEnquiryMutation } from "@/redux/api/enquiryApi";
import { TSiteSettings } from "@/types/settings";
import { toast } from "sonner";

export default function ContactPage() {
  const { data: siteResponse } = useGetSiteSettingsQuery({});
  const siteSettings = (siteResponse?.data || {}) as TSiteSettings;
  const [createEnquiry, { isLoading }] = useCreateEnquiryMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createEnquiry(formData).unwrap();
      toast.success("Enquiry sent successfully! We will get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send enquiry. Please try again.");
    }
  };

  return (
    <div className="bg-[#020617] min-h-screen text-white pb-24 font-sans">
      {/* ── Hero Section ── */}
      <div className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-600/10 to-transparent -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">
            <Globe size={12} /> Global Support Network
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
            Get In <span className="text-blue-500">Touch</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Have questions about your Australian visa? Our expert team in Bangladesh and Australia is ready to help you navigate the process.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Contact Cards ── */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContactCard 
              icon={MessageSquare}
              title="Online Enquiry"
              description="Best for non-urgent questions about visa types or document requirements."
              actionText={siteSettings?.supportEmail || "Start a Chat"}
              actionLink="/support"
              color="blue"
            />
            <ContactCard 
              icon={Phone}
              title="Call Our Experts"
              description="Direct support for technical issues or urgent application updates."
              actionText={siteSettings?.supportPhone || "+880-XXXX-XXXXXX"}
              actionLink={`tel:${siteSettings?.supportPhone}`}
              color="emerald"
            />
          </div>

          {/* ── Office Locations ── */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full translate-x-32 -translate-y-32 blur-3xl group-hover:bg-blue-600/10 transition-colors" />
            <h2 className="text-2xl font-black tracking-tighter uppercase mb-8 flex items-center gap-3">
              <MapPin className="text-blue-500" /> Regional Hubs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Bangladesh Operations</p>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Dhaka Head Office</h3>
                  <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                    {siteSettings?.dhakaOffice || "Gulshan-2, Road 90, House 12/A\nDhaka 1212, Bangladesh"}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-2 mt-4 font-bold uppercase tracking-widest">
                    <Clock size={12} /> {siteSettings?.officeHours || "Sun - Thu: 9:00 AM - 5:00 PM"}
                  </p>
                </div>
              </div>
              <div className="space-y-4 border-l border-white/5 pl-0 md:pl-12">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Australian Support</p>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Sydney Liaison</h3>
                  <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                    {siteSettings?.sydneyOffice || "Level 45, 680 George Street\nSydney, NSW 2000, Australia"}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-2 mt-4 font-bold uppercase tracking-widest">
                    <Clock size={12} /> {siteSettings?.officeHours || "Mon - Fri: 9:00 AM - 5:00 PM (AEST)"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sidebar Actions (Form) ── */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10 blur-2xl" />
            <h3 className="text-xl font-black tracking-tight uppercase mb-4">Send us a message</h3>
            <p className="text-blue-100 text-sm mb-8 leading-relaxed">
              We usually respond within 24 hours. Your details are safe with us.
            </p>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Your Name" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm placeholder:text-blue-200 outline-none focus:bg-white/20 transition-all font-medium" 
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm placeholder:text-blue-200 outline-none focus:bg-white/20 transition-all font-medium" 
              />
              <textarea 
                placeholder="How can we help?" 
                rows={4} 
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm placeholder:text-blue-200 outline-none focus:bg-white/20 transition-all font-medium" 
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-blue-600 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Send Message"}
              </button>
            </div>
          </form>

          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md">
             <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="text-emerald-500" size={24} />
                <h4 className="text-sm font-black uppercase tracking-widest">Privacy First</h4>
             </div>
             <p className="text-gray-400 text-xs leading-relaxed">
               Your communication is protected by AES-256 encryption. We never share your migration details with third parties without your consent.
             </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20 text-center">
         <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em]">
           {siteSettings?.siteName || "Global Migration Partners"} · {siteSettings?.address || "Dhaka · Sydney"}
         </p>
      </div>
    </div>
  );
}

function ContactCard({ icon: Icon, title, description, actionText, actionLink, color }: any) {
  const colorMap = {
    blue: "from-blue-600/20 to-indigo-600/5 text-blue-500 border-blue-500/20",
    emerald: "from-emerald-600/20 to-teal-600/5 text-emerald-500 border-emerald-500/20",
  };
  const c = colorMap[color as keyof typeof colorMap];

  return (
    <div className={`bg-gradient-to-br ${c} border rounded-[2rem] p-8 space-y-4 hover:scale-[1.02] transition-all duration-300 group`}>
      <Icon size={32} />
      <div className="space-y-2">
        <h3 className="text-xl font-black tracking-tight text-white uppercase">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
      <Link href={actionLink} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all pt-2 truncate overflow-hidden">
        {actionText} <ArrowRight size={14} className="shrink-0" />
      </Link>
    </div>
  );
}
