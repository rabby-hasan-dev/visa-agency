"use client";

import { useSearchParams } from "next/navigation";
import { Ban, ArrowLeft, RotateCcw, Info, Hash, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function PaymentCancelledContent() {
  const searchParams = useSearchParams();
  const tx = searchParams.get("tx") || "N/A";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-in fade-in duration-700">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200 overflow-hidden border border-gray-100">
        {/* Warning Header */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10" />
          <div className="relative z-10 flex flex-col items-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md mb-6 shadow-xl animate-in zoom-in duration-500">
              <Ban className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">Payment Stopped</h1>
            <p className="text-amber-100 mt-2 text-sm font-medium opacity-80 uppercase tracking-widest text-[10px]">
              Transaction Discontinued by User
            </p>
          </div>
        </div>

        <div className="p-10 space-y-8">
          {/* Informational Message */}
          <div className="flex bg-blue-50/50 border border-blue-100 rounded-[1.5rem] p-6 gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm shadow-blue-200/50">
              <Info size={18} />
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest leading-none">Status Update</p>
               <p className="text-xs text-blue-800 leading-relaxed font-medium">
                 No charges have been applied to your settlement account. Your application stage remains preserved in its current state.
               </p>
            </div>
          </div>

          {/* Reference Card */}
          {tx !== "N/A" && (
            <div className="bg-gray-50 border border-gray-100 rounded-[1.5rem] p-6 flex flex-col items-center justify-center text-center gap-1.5 group">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-amber-500 transition-colors">Session Reference</p>
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-gray-500">
                <Hash size={12} className="text-gray-300" /> {tx}
              </div>
            </div>
          )}

          {/* Action Stack */}
          <div className="flex flex-col gap-4">
            <Link
              href="/applications"
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95 group"
            >
              <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Return to Applications
            </Link>
            
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
          </div>
        </div>
        
        {/* Support Banner */}
        <div className="px-8 py-5 border-t border-gray-50 text-center flex items-center justify-center gap-2">
          <ShieldAlert size={12} className="text-gray-300" />
          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">Transaction Logged per Security Audit</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelledPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400"><RotateCcw size={32} className="animate-spin" /></div>}>
      <PaymentCancelledContent />
    </Suspense>
  );
}
