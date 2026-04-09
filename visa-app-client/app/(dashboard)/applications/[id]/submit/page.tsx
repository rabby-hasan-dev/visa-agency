"use client";

import { useGetSingleApplicationQuery, useSubmitApplicationMutation } from "@/redux/api/applicationApi";
import { useInitiatePaymentMutation } from "@/redux/api/paymentApi";
import { useCalculateApplicationFeeQuery } from "@/redux/api/feeApi";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCard, FileText, AlertCircle, Loader2, ChevronLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useAlert } from "@/components/ui";
import Link from "next/link";

/**
 * ─── Loading Overlay ──────────────────────────────────────────────────────────
 * Provides full-screen feedback during multi-step submission/payment processes.
 */
function LoadingOverlay({ step }: { step: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-md transition-all">
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-6 shadow-2xl max-w-xs w-full border border-white/20">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-600/10 rounded-full animate-ping scale-150"></div>
          <div className="bg-blue-600 rounded-full p-5 shadow-lg relative">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="font-bold text-gray-900 text-lg">Secure Processing</p>
          <p className="text-gray-500 text-sm font-medium animate-pulse">{step}</p>
        </div>
      </div>
    </div>
  );
}

export default function SubmitApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: appData, isLoading: isAppLoading } = useGetSingleApplicationQuery(id);
  const { data: feeData, isLoading: isFeeLoading } = useCalculateApplicationFeeQuery(id);
  const [submitApplication] = useSubmitApplicationMutation();
  const [initiatePayment] = useInitiatePaymentMutation();
  const { showAlert } = useAlert();

  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const application = appData?.data;
  const trn = application?.trn || "N/A";
  const feeInfo = feeData?.data;

  const totalAmount = feeInfo?.total || application?.totalAmount || 0;
  const currency = feeInfo?.currency || application?.currency || "AUD";
  const feeBreakdown = feeInfo?.breakdown || [];

  const handleSubmitAndPay = async () => {
    try {
      setError(null);

      // Step 1: Submit Application
      setLoadingStep("Submitting application details…");
      const submittedAppResponse = await submitApplication(id).unwrap();

      const submittedApp = submittedAppResponse?.data || application;

      // Resolve client info
      const clientId =
        (submittedApp?.clientId as { _id?: string })?._id ||
        (submittedApp?.clientId as unknown as string) ||
        "";
      const clientName = submittedApp?.clientId?.name || "Applicant";
      const clientEmail =
        submittedApp?.clientId?.email ||
        submittedApp?.email ||
        "applicant@example.com";

      // Step 2: Initiate Payment
      setLoadingStep("Initializing secure payment session…");
      const paymentResult = await initiatePayment({
        applicationId: id,
        clientId,
        amount: totalAmount,
        currency,
        gateway: "sslcommerz",
        clientName,
        clientEmail,
      }).unwrap() as { data?: { paymentUrl?: string } };

      const paymentUrl = paymentResult?.data?.paymentUrl;

      if (!paymentUrl) {
        throw new Error("Payment gateway failed to provide a redirection URL.");
      }

      // Step 3: Redirect to Secure Gateway
      setLoadingStep("Redirecting to payment gateway…");
      window.location.href = paymentUrl;

    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        (err as Error)?.message ||
        "Failed to finalise application or redirect to gateway";
      
      setError(errorMsg);
      setLoadingStep(null);

      showAlert({ 
        title: "Submission Status", 
        message: "Your application may have been saved, but the payment gateway failed. Please check the Payments section of your dashboard to complete the transaction.", 
        type: "warning" 
      });

      setTimeout(() => router.push('/payments'), 4000);
    }
  };

  if (isAppLoading || isFeeLoading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-gray-400 min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
        <p className="text-sm font-medium">Preparing application summary...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-2 px-4 sm:px-6 lg:px-8 text-gray-900">
      {loadingStep && <LoadingOverlay step={loadingStep} />}

      {/* Breadcrumbs / Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Link href={`/applications/new?id=${id}`} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 transition-colors mb-2 w-fit">
            <ChevronLeft size={14} /> Back to Edit
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Finalize & Submit</h1>
          <p className="text-sm text-gray-500 mt-1">Review your application details and proceed to payment.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reference</span>
          <span className="text-xs font-mono font-bold text-blue-600 tracking-wider uppercase">{trn}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Application Identity Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <FileText size={16} />
              </div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Application Summary</h2>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100 uppercase">
              <CheckCircle2 size={12} /> Ready to Submit
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reference No.</p>
                <p className="text-sm font-mono font-bold text-blue-600 tracking-tight">{trn}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Visa Category</p>
                <p className="text-sm font-bold text-gray-800">{application?.visaCategory || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Email</p>
                <p className="text-sm font-medium text-gray-600 truncate">{application?.clientId?.email || application?.email || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Fees Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden relative">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2.5 bg-gray-50/50">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              <CreditCard size={16} />
            </div>
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Fee Statement</h2>
          </div>

          <div className="p-6">
            {feeBreakdown.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  {feeBreakdown.map((item: { label: string; amount: number }, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm py-1">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-semibold text-gray-900">{currency} {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-5 bg-blue-600 rounded-xl flex items-center justify-between text-white shadow-lg shadow-blue-200">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100">Total Payable Amount</p>
                    <p className="text-2xl font-black">{currency} {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                  <ShieldCheck size={32} className="opacity-20" />
                </div>

                <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl mt-6">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                    <AlertCircle size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">Final Confirmation</p>
                    <p className="text-xs text-amber-800 leading-relaxed font-medium">
                      By proceeding, you will be redirected to our secure SSL payment gateway. Ensure all application details are correct as they cannot be modified after submission.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Calculating Final Fees...</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-4">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-rose-700">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/applications/new?id=${id}`}
              className="px-8 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm text-center hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98] shrink-0"
            >
              Modify Application
            </Link>
            <button
              onClick={handleSubmitAndPay}
              disabled={!!loadingStep || !feeInfo}
              className="flex-1 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-50 transform active:scale-[0.98]"
            >
              {loadingStep ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CreditCard size={18} />
              )}
              <span className="uppercase tracking-wider">
                {loadingStep ? "Securing Session..." : `Submit & Pay Now`}
              </span>
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-1.5 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
              <ShieldCheck size={14} className="text-blue-600" />
              <span className="text-[10px] font-bold uppercase tracking-tight text-gray-600">SSL Secured Payment</span>
            </div>
            <div className="flex items-center gap-1.5 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default text-gray-600">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span className="text-[10px] font-bold uppercase tracking-tight">Verified Merchant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
