"use client";

import { DollarSign, PieChart, CreditCard, Info, Calculator, ShieldCheck, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PricingEstimatorPage() {
  const fees = [
    { name: "Visitor Visa (600)", base: "AUD 190", family: "AUD 190", total: "AUD 190" },
    { name: "Student Visa (500)", base: "AUD 710", family: "AUD 530", total: "AUD 1,240+" },
    { name: "Temporary Work (482)", base: "AUD 1,455", family: "AUD 1,455", total: "AUD 2,910+" },
    { name: "Partner Visa (309/100)", base: "AUD 8,850", family: "AUD 2,215", total: "AUD 11,065+" },
    { name: "Child Visa (101)", base: "AUD 3,055", family: "N/A", total: "AUD 3,055" },
  ];

  return (
    <div className="bg-[#020617] min-h-screen text-white pb-24 font-sans">
      {/* ── Hero Section ── */}
      <div className="relative pt-32 pb-24 px-4 overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-600/10 to-transparent -z-10" />
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">
            <Calculator size={12} /> Financial Planning
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
            Pricing <span className="text-blue-500">Estimator</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Understand the costs involved in your Australian migration journey. No hidden fees, just clear transparency.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-16">
        {/* ── Pricing Table ── */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
           <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                 <h2 className="text-xl font-black uppercase tracking-tight">Main Visa Charges</h2>
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Base Application Charges (VAC)</p>
              </div>
              <div className="hidden md:flex gap-4">
                 <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                    <PieChart size={12} /> Standard Rates 2024
                 </div>
              </div>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                   <th className="px-8 py-5">Visa Category</th>
                   <th className="px-8 py-5">Primary Applicant</th>
                   <th className="px-8 py-5">Secondary Applicant</th>
                   <th className="px-8 py-5 text-right">Estimate Total</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {fees.map((fee, i) => (
                   <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                     <td className="px-8 py-6">
                        <span className="text-sm font-bold text-gray-200">{fee.name}</span>
                     </td>
                     <td className="px-8 py-6 text-sm font-medium text-gray-400">{fee.base}</td>
                     <td className="px-8 py-6 text-sm font-medium text-gray-400">{fee.family}</td>
                     <td className="px-8 py-6 text-right font-black text-blue-500 tabular-nums">{fee.total}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* ── Fee Components ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
           <PricingCard 
              icon={DollarSign}
              title="Base Charge"
              desc="This is the standard fee for the main person applying. It covers the processing work by the department."
              color="blue"
           />
           <PricingCard 
              icon={PieChart}
              title="Secondary Fees"
              desc="Additional costs for family members. Children and spouses have different lower rates depending on their age."
              color="emerald"
           />
           <PricingCard 
              icon={CreditCard}
              title="Payment Surcharge"
              desc="Bank fees (1.4% to 1.9%) apply if you pay by credit card. We help monitor these exchange rates for you."
              color="amber"
           />
        </div>

        {/* ── Important Notice ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
           <div className="lg:col-span-3 space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 md:p-12 backdrop-blur-xl space-y-8">
                 <h2 className="text-2xl font-black tracking-tight uppercase flex items-center gap-3 leading-none">
                   <Info className="text-amber-500" /> What's NOT included?
                 </h2>
                 <p className="text-gray-400 text-sm leading-relaxed">
                   The estimator calculated the <strong>Department Visa Fees</strong>. There are other "lifestyle" costs you should budget for in Bangladesh or Australia:
                 </p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-1">
                       <h3 className="text-sm font-black text-white uppercase tracking-tight">Health Exams</h3>
                       <p className="text-xs text-gray-500 font-medium">Billed by approved panel clinics in Dhaka/Chittagong.</p>
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-sm font-black text-white uppercase tracking-tight">Biometrics</h3>
                       <p className="text-xs text-gray-500 font-medium">Standard VFS service fees for fingerprint and photo collection.</p>
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-sm font-black text-white uppercase tracking-tight">English Testing</h3>
                       <p className="text-xs text-gray-500 font-medium">Fees for IELTS, PTE, or TOEFL exams if required.</p>
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-sm font-black text-white uppercase tracking-tight">Translations</h3>
                       <p className="text-xs text-gray-500 font-medium">Professional costs for converting Bengali documents to English.</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10 blur-2xl" />
                 <h3 className="text-xl font-black uppercase tracking-tight mb-4">Get a final quote</h3>
                 <p className="text-blue-100 text-sm mb-8 leading-relaxed">
                   Fees change on July 1st every year. Contact us for a precise calculation based on today's exchange rates.
                 </p>
                 <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95">
                    Consult Consultant <ArrowRight size={14} />
                 </Link>
              </div>

              <div className="p-8 border border-white/5 rounded-[2.5rem] bg-gray-50/[0.02]">
                 <div className="flex items-center gap-3 mb-3">
                    <ShieldCheck className="text-emerald-500" size={18} />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Safe Payments</p>
                 </div>
                 <p className="text-[10px] text-gray-500 leading-relaxed italic">
                   All payments for visa charges are processed via our secure Australian Gateway. We do not store your credit card info.
                 </p>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-24 text-center">
         <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
            <HelpCircle size={14} className="text-blue-500" />
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Questions about fees? <Link href="/contact" className="text-blue-500 hover:underline">Contact Billing</Link></p>
         </div>
      </div>
    </div>
  );
}

function PricingCard({ icon: Icon, title, desc, color }: any) {
  const colorMap = {
    blue: "text-blue-500 shadow-blue-500/10",
    emerald: "text-emerald-500 shadow-emerald-500/10",
    amber: "text-amber-500 shadow-amber-500/10",
  };
  const c = colorMap[color as keyof typeof colorMap];

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-4 backdrop-blur-md">
      <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${c} border border-white/10`}>
        <Icon size={24} />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-black uppercase tracking-tight text-white">{title}</h3>
        <p className="text-gray-400 text-xs leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}
