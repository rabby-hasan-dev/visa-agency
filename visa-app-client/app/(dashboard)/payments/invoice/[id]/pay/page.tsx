"use client";

import { useGetSingleInvoiceQuery } from "@/redux/api/invoiceApi";
import { useInitiatePaymentMutation } from "@/redux/api/paymentApi";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCard, CheckCircle, AlertCircle, Loader2, ChevronLeft, ShieldCheck, CheckCircle2, Lock, ArrowRight, Hash } from "lucide-react";
import { useAlert } from "@/components/ui";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface InvoiceData {
  _id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  paidAt?: string;
  createdAt: string;
  applicationId?: {
    _id: string;
    feeBreakdown?: Array<{ label: string; amount: number }>;
  };
  clientId?: {
    _id: string;
    name?: string;
    fullName?: string;
    email?: string;
  };
}

export default function PayInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    data,
    isLoading: isFetching,
    error: fetchError,
  } = useGetSingleInvoiceQuery(id);
  const invoice = data?.data as InvoiceData | undefined;

  const [initiatePayment, { isLoading: isPaying }] = useInitiatePaymentMutation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { showAlert } = useAlert();

  const handlePay = async () => {
    if (!invoice) return;

    try {
      setError(null);
      const response = await initiatePayment({
        applicationId: invoice.applicationId?._id || "",
        clientId: invoice.clientId?._id || "",
        amount: invoice.amount,
        currency: invoice.currency,
        gateway: "sslcommerz",
        clientName: invoice.clientId?.name || invoice.clientId?.fullName || "Applicant",
        clientEmail: invoice.clientId?.email || "applicant@example.com",
      }).unwrap();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paymentUrl = (response as any)?.data?.paymentUrl;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        setSuccess(true);
        showAlert({
          title: "Payment Successful",
          message: "The payment has been processed successfully.",
          type: "success",
        });
        setTimeout(() => router.push("/payments"), 2000);
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to redirect to payment gateway";
      setError(errorMsg);

      showAlert({
        title: "Gateway Error",
        message: errorMsg,
        type: "error",
      });
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-sm font-medium">Authenticating invoice...</p>
      </div>
    );
  }

  if (fetchError || !invoice) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 text-center bg-white border border-rose-100 rounded-2xl shadow-xl">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h2>
        <p className="text-sm text-gray-500 mb-8">The invoice you are looking for does not exist or has been archived.</p>
        <button onClick={() => router.push('/payments')} className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 text-gray-900">
      {/* ── Page Header ── */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest mb-3">
            <ChevronLeft size={14} /> Back
          </button>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Secure Checkout</h1>
          <p className="text-sm text-gray-500 mt-1">Finalize your application service fee settlement.</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="px-3 py-1 bg-gray-100 rounded-lg border border-gray-200 text-[10px] font-mono font-black text-blue-600 tracking-widest uppercase">
            {invoice.invoiceNumber}
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Identification</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-2xl shadow-gray-200/50 overflow-hidden relative group">
        {/* Status Tab */}
        <div className={`absolute top-0 right-10 px-4 py-1.5 rounded-b-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
           invoice.status === 'paid' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white animate-pulse'
        }`}>
           {invoice.status}
        </div>

        <div className="p-8 sm:p-12">
          {success ? (
            <div className="text-center py-10 animate-in zoom-in duration-500">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                <CheckCircle2 size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Transaction Success!</h2>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">Your payment has been reconciled. Redirecting to your dashboard...</p>
            </div>
          ) : invoice.status === "paid" ? (
            <div className="text-center py-10 animate-in fade-in duration-500">
              <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-emerald-500" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Invoice Settled</h2>
              <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">
                This invoice was finalized on <br />
                <span className="font-bold text-gray-900">{invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'long', year: 'numeric' }) : "—"}</span>
              </p>
              <button
                onClick={() => router.push("/payments")}
                className="px-8 py-3.5 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
              >
                Return to Payments
              </button>
            </div>
          ) : (
            <>
              {/* Summary Header */}
              <div className="space-y-6 mb-10 pb-8 border-b border-gray-100">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.25em]">Summary of Services</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-900 uppercase leading-none">{invoice.clientId?.name || invoice.clientId?.fullName || "Verified User"}</p>
                    <p className="text-xs text-gray-500 truncate">{invoice.clientId?.email}</p>
                  </div>
                  <div className="md:text-right space-y-1">
                    <p className="text-xs font-bold text-gray-900 uppercase leading-none">{invoice.description || "Application Service Fee"}</p>
                    <div className="flex items-center md:justify-end gap-1.5 text-[10px] text-gray-400 font-mono tracking-tighter">
                       <Hash size={10} /> {invoice.applicationId?._id?.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee Breakdown */}
              {invoice.applicationId?.feeBreakdown && invoice.applicationId.feeBreakdown.length > 0 && (
                <div className="mb-10 space-y-4">
                  <div className="space-y-4">
                    {invoice.applicationId.feeBreakdown.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center group">
                        <span className="text-xs font-medium text-gray-500 group-hover:text-gray-900 transition-colors">{item.label}</span>
                        <span className="text-xs font-bold text-gray-900 tabular-nums">
                          {invoice.currency} {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-blue-600 rounded-2xl flex items-center justify-between text-white shadow-xl shadow-blue-500/20 transform transition-transform hover:scale-[1.01]">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">Grand Total Due</p>
                      <p className="text-3xl font-black tabular-nums">
                        {invoice.currency} {invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <ShieldCheck size={36} className="opacity-20 translate-x-1" />
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-rose-700 leading-relaxed">{error}</p>
                </div>
              )}

              {/* Secure Payment Option */}
              <div className="mb-12">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 transition-all hover:border-blue-300 group/card">
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-blue-100 rounded-full opacity-50 group-hover/card:scale-150 transition-transform duration-700" />
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-blue-600 shadow-sm">
                       <ShieldCheck size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 uppercase tracking-tight">SSL Secured Gateway</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Cards & Net Banking Enabled</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                     <Lock size={12} /> Secure
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handlePay}
                  disabled={isPaying}
                  className="w-full py-4.5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                >
                  {isPaying ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CreditCard size={18} />
                  )}
                  {isPaying ? "SECURELY INITIALIZING..." : `SUBMIT & PAY ${invoice.currency} ${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  {!isPaying && <ArrowRight size={16} className="opacity-40" />}
                </button>
                <div className="flex justify-center pt-4">
                  <Link href="/payments" className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-rose-500 transition-colors">
                    I want to settle this later
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-12 space-y-6 text-center">
        <div className="flex items-center justify-center gap-8 grayscale opacity-30">
           <div className="flex items-center gap-1.5 font-black text-[10px] uppercase tracking-widest text-gray-400">
             <ShieldCheck size={14} /> Encrypted
           </div>
           <div className="flex items-center gap-1.5 font-black text-[10px] uppercase tracking-widest text-gray-400">
             <Lock size={14} /> PCI Compliant
           </div>
        </div>
        <p className="text-[10px] text-gray-400 max-w-sm mx-auto leading-relaxed font-medium uppercase tracking-tight">
          By clicking pay, you agree to the electronic transaction terms. Your payment information is strictly handled by the banking gateway and never stored locally.
        </p>
      </div>
    </div>
  );
}
