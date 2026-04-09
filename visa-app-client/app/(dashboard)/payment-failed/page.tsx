"use client";

import { useSearchParams } from "next/navigation";
import { XCircle, AlertCircle, ArrowLeft, RefreshCcw, ShieldCheck, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const tx = searchParams.get("tx") || "N/A";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-in fade-in duration-700">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200 overflow-hidden border border-gray-100">
        {/* Error Header */}
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md mb-6 shadow-xl animate-in zoom-in duration-500">
              <XCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Transaction Failed</h1>
            <p className="text-rose-100 mt-2 text-sm font-medium opacity-80 uppercase tracking-widest text-[10px]">
              Payment Reconciliation Error
            </p>
          </div>
        </div>

        <div className="p-10 space-y-8">
          {/* Reason Card */}
          <div className="bg-rose-50/50 border border-rose-100 rounded-[1.5rem] p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle size={16} className="text-rose-500" />
              <p className="text-[10px] font-black text-rose-900 uppercase tracking-widest">Analysis Report</p>
            </div>
            <ul className="space-y-3 text-xs font-medium text-rose-800/80">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-rose-400" /> Insufficient transactional liquidity
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-rose-400" /> Authentication parameters rejected by issuer
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-rose-400" /> Gateway timeout during settlement
              </li>
            </ul>
          </div>

          {/* Reference Card */}
          <div className="bg-gray-50 border border-gray-100 rounded-[1.5rem] p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Transaction ID</p>
              <p className="font-mono text-[11px] font-bold text-gray-700">{tx}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-300">
               <ShieldCheck size={18} />
            </div>
          </div>

          {/* Action Stack */}
          <div className="flex flex-col gap-4">
            <Link
              href="/payments"
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95 group"
            >
              <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Retry Transaction
            </Link>
            
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/support"
                className="flex items-center justify-center gap-2 px-4 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
              >
                <Mail size={14} /> Contact Billing
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 px-4 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
              >
                <ArrowLeft size={14} /> Dashboard
              </Link>
            </div>
          </div>
        </div>
        
        {/* Trust Footer */}
        <div className="px-8 py-5 border-t border-gray-50 text-center">
          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">Secure Recovery Protocol Active</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><RefreshCcw className="w-10 h-10 animate-spin text-blue-600" /></div>}>
      <PaymentFailedContent />
    </Suspense>
  );
}
