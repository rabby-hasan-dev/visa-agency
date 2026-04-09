"use client";

import { HelpCircle, AlertCircle, ChevronLeft, CreditCard, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PrePayPaperServicePage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 text-gray-900 animate-in fade-in duration-700">
      {/* ── Page Header ── */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest mb-3">
            <ChevronLeft size={14} /> Back
          </button>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Pre-pay Service</h1>
          <p className="text-sm text-gray-500 mt-1">Initialize payment for paper-based service requests.</p>
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
          <CreditCard size={24} />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-2xl shadow-gray-200/50 overflow-hidden">
        {/* Warning Section */}
        <div className="bg-amber-50 border-b border-amber-100 p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
             <AlertCircle size={20} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-black text-amber-900 uppercase tracking-widest">Expiration Protocol</p>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Application must be officially lodged within <strong>30 calendar days</strong> of making this payment. Failue to lodge may result in fee forfeiture.
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-12 space-y-10">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
               <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.25em]">Service Selection</p>
               <HelpCircle size={14} className="text-gray-300 hover:text-blue-500 transition-colors cursor-help" />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-tight px-1">
                Transaction Type
              </label>
              <div className="relative group">
                <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer">
                  <option value="">-- Select Transaction Category --</option>
                  <option value="visa">Visa Application Charge (VAC)</option>
                  <option value="sponsorship">Sponsorship Fee</option>
                  <option value="nomination">Nomination Fee</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
                   <HelpCircle size={16} />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-medium px-1 italic">Please ensure you select the correct category as defined in your migration plan.</p>
            </div>
          </div>

          <div className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.back()}
                className="w-full sm:flex-1 px-8 py-4 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all text-xs uppercase tracking-widest active:scale-95 shadow-sm"
              >
                Cancel
              </button>
              <button
                className="w-full sm:flex-[2] px-8 py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                onClick={() => {
                  // This is a placeholder for logic 
                  alert("Please select a service type first.");
                }}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Footer Banner */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gateway Online</span>
           </div>
           <div className="flex items-center gap-1.5 grayscale opacity-40">
              <ShieldCheck size={14} className="text-gray-400" />
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter tracking-widest">Verified Merchant</span>
           </div>
        </div>
      </div>

      <div className="mt-8 text-center text-[10px] text-gray-400 font-medium uppercase tracking-tight">
        Secure processing by Department Infrastructure
      </div>
    </div>
  );
}
