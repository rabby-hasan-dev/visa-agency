"use client";

import { useSearchParams } from "next/navigation";
import { XCircle, AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const tx = searchParams.get("tx") || "";

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-red-500 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
            <XCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Payment Failed</h1>
          <p className="text-red-100 mt-2 text-sm">
            Unfortunately, your transaction could not be processed.
          </p>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800">Possible Reasons:</p>
                <ul className="text-xs text-red-700 mt-1 list-disc list-inside space-y-1">
                  <li>Insufficient funds in your account</li>
                  <li>Transaction was declined by your bank</li>
                  <li>Incorrect card details were entered</li>
                  <li>Network connectivity issues</li>
                </ul>
              </div>
            </div>

            {tx && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Transaction Reference
                </p>
                <p className="font-mono text-sm text-gray-700 break-all">{tx}</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Link
                href="/applications"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#00264d] text-white rounded-xl font-bold hover:bg-[#001a33] transition-colors shadow-lg"
              >
                <RefreshCcw className="w-4 h-4" />
                Try Payment Again
              </Link>
              
              <Link
                href="/support"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Get Support
              </Link>
            </div>
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

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
      <PaymentFailedContent />
    </Suspense>
  );
}

function Loader2({ className }: { className?: string }) {
  return <RefreshCcw className={`${className} animate-spin`} />;
}
