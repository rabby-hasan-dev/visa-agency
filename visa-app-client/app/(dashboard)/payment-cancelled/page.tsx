"use client";

import { useSearchParams } from "next/navigation";
import { Ban, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function PaymentCancelledContent() {
  const searchParams = useSearchParams();
  const tx = searchParams.get("tx") || "";

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gray-400 p-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
            <Ban className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Payment Cancelled</h1>
          <p className="text-gray-100 mt-2 text-sm">
            You have cancelled the payment process.
          </p>
        </div>

        <div className="p-8">
          <p className="text-sm text-gray-600 text-center mb-8 leading-relaxed">
            No charges were applied to your account. You can return to your application and try again at your convenience.
          </p>

          {tx && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Reference ID
              </p>
              <p className="font-mono text-sm text-gray-500">{tx}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link
              href="/applications"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#00264d] text-white rounded-xl font-bold hover:bg-[#001a33] transition-colors shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              Return to Applications
            </Link>
          </div>
        </div>
        
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
          <Link href="/dashboard" className="text-xs text-blue-600 hover:underline flex items-center justify-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelledPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-400">Loading...</div>}>
      <PaymentCancelledContent />
    </Suspense>
  );
}
