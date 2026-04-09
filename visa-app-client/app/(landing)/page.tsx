"use client";
import Link from "next/link";
import {
  Globe,
  ShieldCheck,
  CreditCard,
  Briefcase,
  Users,
  MapPin,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { TSiteSettings } from "@/types/settings";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default function Home() {
  const { data: siteResponse } = useGetSiteSettingsQuery({});

  const siteSettings = (siteResponse?.data ?? {
    siteName: "Elite Visa Hub",
    brandName: "Global Passports & Visas",
    departmentName: "Advanced Immigration Consultants",
  }) as TSiteSettings;

  return (
    <main className="bg-[#040d1a] min-h-screen font-sans text-gray-200 overflow-x-hidden">
      <Header />

      {/* ─── Hero Section ───────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#040d1a] via-[#040d1a]/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040d1a] to-transparent z-10" />
          <img 
            src="/hero-bg.png" 
            alt="Premium Visa Services" 
            className="w-full h-full object-cover opacity-50 contrast-125"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Australian Immigration Licensed Partner
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-8">
              Navigate Your Global <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Migration Journey
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl">
              From Dhaka to the world. We specialize in comprehensive visa processing, 
              expert Australian immigration services, and transparent international fee management 
              for individuals and businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                href="/register"
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 group"
              >
                Start Application <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/immigration"
                className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-white/10 transition flex items-center justify-center gap-2"
              >
                Explore Pathways
              </Link>
            </div>

            <div className="mt-16 flex flex-wrap gap-8 items-center text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-blue-500" />
                <span className="text-sm">Licensed Experts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-blue-500" />
                <span className="text-sm">Transparent Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-blue-500" />
                <span className="text-sm">24/7 Digital Portal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats / Trust Bar ──────────────────────────────────────── */}
      <section className="py-12 bg-white/5 border-y border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Successful Visas", val: "15k+" },
              { label: "Countries Served", val: "25+" },
              { label: "Expert Consultants", val: "50+" },
              { label: "Client Satisfaction", val: "99%" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-white mb-1">{stat.val}</div>
                <div className="text-xs uppercase tracking-widest text-blue-400 font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Services Section ────────────────────────────────────────── */}
      <section id="services" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em] mb-4">Our Expertise</h2>
          <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6">Comprehensive Visa Solutions</h3>
          <p className="text-gray-400 text-lg">
            We provide end-to-end support for international migration, ensuring a smooth transition 
            from eligibility assessment to final approval.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "International Visa Processing",
              desc: "Complete documentation and application support for USA, UK, Canada, and Schengen visas with a high success rate.",
              icon: Globe,
              color: "blue",
            },
            {
              title: "Australian Immigration Specialist",
              desc: "Expert guidance on skilled migration, partner visas, and residency pathways as a licensed agency partner.",
              icon: ShieldCheck,
              color: "indigo",
            },
            {
              title: "Fee & Currency Management",
              desc: "Dynamic fee calculation with multi-currency support. Secure international payments and transparent deductions.",
              icon: CreditCard,
              color: "cyan",
            },
            {
              title: "Corporate Migration",
              desc: "Helping Bangladeshi businesses scale globally with dedicated visa solutions for employees and executives.",
              icon: Briefcase,
              color: "purple",
            },
            {
              title: "Student Consultancy",
              desc: "Unlock educational opportunities in top universities worldwide with our specialized student visa division.",
              icon: Users,
              color: "rose",
            },
            {
              title: "Digital Tracking & Portal",
              desc: "Monitor your application status in real-time through our secure, modernized digital ImmiAccount platform.",
              icon: TrendingUp,
              color: "emerald",
            },
          ].map((item, idx) => (
            <div 
              key={idx}
              className="group p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/[0.08] hover:border-blue-500/30 transition duration-300"
            >
              <div className={`w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon size={28} className="text-blue-400" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">{item.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {item.desc}
              </p>
              <Link href="/immigration" className="inline-flex items-center gap-2 text-blue-400 font-bold text-sm hover:gap-3 transition-all">
                Learn More <ChevronRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Feature Focus: Fee Management ─────────────────────────── */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-transparent to-blue-900/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl" />
             <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl relative z-10 overflow-hidden">
                <div className="flex justify-between items-center mb-10">
                  <div className="font-bold text-white">Fee Summary</div>
                  <div className="px-3 py-1 bg-white/10 rounded-lg text-xs font-mono">APP-2024-8832</div>
                </div>
                <div className="space-y-6">
                  {[
                    { label: "Application Fee (AUD)", val: "$2,450.00" },
                    { label: "Exchange Rate (AUD/BDT)", val: "76.42" },
                    { label: "Net Payable (BDT)", val: "৳187,229.00" },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-white/5">
                      <div className="text-gray-400 text-sm">{row.label}</div>
                      <div className="text-white font-mono font-bold">{row.val}</div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-6">
                    <div className="text-blue-400 font-bold">Total Deduction</div>
                    <div className="text-2xl font-black text-white">৳187,229.00</div>
                  </div>
                </div>
                <div className="mt-8 bg-blue-600 p-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-white">
                   <ShieldCheck size={20} /> Payment Secured by SSLCommerz
                </div>
             </div>
          </div>
          <div>
             <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em] mb-4">Pricing & Transparency</h2>
             <h3 className="text-4xl lg:text-5xl font-bold text-white mb-8">Advanced International Fee Management</h3>
             <p className="text-gray-400 text-lg mb-8 leading-relaxed">
               No more manual currency conversions or hidden charges. Our system automatically handles real-time 
               currency exchange rates for visa fees across AUD, USD, and BDT.
             </p>
             <ul className="space-y-5">
               {[
                 "Real-time exchange rate synchronization",
                 "Transparent fee deduction summaries",
                 "Secure payment processing via SSLCommerz",
                 "Downloadable tax-compliant invoices",
               ].map((feat, i) => (
                 <li key={i} className="flex items-center gap-3 text-white font-medium">
                   <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                     <CheckCircle2 size={14} className="text-blue-400" />
                   </div>
                   {feat}
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </section>

      {/* ─── Global Presence Section ────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
             <Globe size={400} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6">Expertise Rooted in Bangladesh, Reaching Worldwide</h3>
            <p className="text-blue-100 text-lg mb-10 leading-relaxed">
              Based in Dhaka, we bridge the gap between local aspirations and international opportunities. 
              Our team understands the unique challenges of Bangladeshi applicants and provides tailored solutions 
              that meet global standards.
            </p>
            <div className="flex flex-wrap gap-8">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold">Dhaka Office</div>
                    <div className="text-blue-100 text-sm opacity-80">Gulfesha Plaza, Maghbazar</div>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Globe size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold">Global Network</div>
                    <div className="text-blue-100 text-sm opacity-80">AU, UK, USA, CA</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Alert Section ──────────────────────────────────────────── */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex gap-6 items-start">
          <div className="bg-amber-500 text-black w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 animate-pulse">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-amber-500 text-lg mb-2 flex items-center gap-2">
              Important: Stay Protected
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              We never ask for fees via personal bank accounts or cash. All payments must be processed 
              online through our official {siteSettings.siteName} portal using secure bank channels. 
              Only authorized {siteSettings.departmentName} staff will contact you via official channels.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
