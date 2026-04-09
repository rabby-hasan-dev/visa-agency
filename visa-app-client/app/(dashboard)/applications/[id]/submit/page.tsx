"use client";

import { useGetSingleApplicationQuery, useSubmitApplicationMutation } from "@/redux/api/applicationApi";
import { useInitiatePaymentMutation } from "@/redux/api/paymentApi";
import { useCalculateApplicationFeeQuery } from "@/redux/api/feeApi";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCard, FileText, AlertCircle, Loader2 } from "lucide-react";
import { useAlert } from "@/components/ui";
import Link from "next/link";

/**
 * ─── Loading Overlay ──────────────────────────────────────────────────────────
 * Provides full-screen feedback during multi-step submission/payment processes.
 */
function LoadingOverlay({ step }: { step: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-10 flex flex-col items-center gap-6 shadow-2xl max-w-xs w-full">
        <div className="relative">
          <div className="absolute inset-0 bg-[#00264d]/10 rounded-full animate-ping scale-150"></div>
          <div className="bg-[#00264d] rounded-full p-5 shadow-lg relative">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="font-black text-[#00264d] text-lg tracking-tight">Processing</p>
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
      <div className="p-16 flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-sm">Loading application data...</p>
      </div>
    );
  }

  return (
    <>
      {loadingStep && <LoadingOverlay step={loadingStep} />}

      <div className="bg-gray-100 min-h-screen pb-16">
        <div className="bg-[#1a2b4a] min-h-[44px] py-1 md:py-0 flex flex-wrap items-center px-5 text-white text-sm font-bold gap-3">
          <CreditCard size={16} />
          <span className="shrink-0">Finalize & Submit Application — Reference:</span>
          <span className="font-mono bg-white/20 px-2 py-0.5 rounded tracking-widest">{trn}</span>
        </div>

        <div className="max-w-2xl mx-auto mt-8 px-4 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-[#00264d] text-white px-5 py-3 text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <FileText size={14} />
              Application Identity
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-xs">
              <div className="text-gray-400 font-bold uppercase">Reference No.</div>
              <div className="font-mono font-black text-[#2150a0] sm:text-right">{trn}</div>

              <div className="text-gray-400 font-bold uppercase">Visa Type</div>
              <div className="font-black text-gray-800 sm:text-right">
                {application?.visaCategory || "—"}
              </div>

              <div className="text-gray-400 font-bold uppercase">Applicant Email</div>
              <div className="text-gray-600 truncate sm:text-right font-medium">
                {application?.clientId?.email || application?.email || "—"}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#00264d] to-[#1a4a7a] text-white px-5 py-3 text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <CreditCard size={14} />
              Fee Statement & Breakdown
            </div>
            
            {feeBreakdown.length > 0 ? (
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  {feeBreakdown.map((item: { label: string; amount: number }, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-medium">{item.label}</span>
                      <span className="font-black text-gray-800">{currency} {item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-dashed border-gray-200 mt-4 flex justify-between items-center bg-blue-50/50 -mx-6 px-6 py-4">
                    <span className="text-[#00264d] font-black uppercase text-[10px] tracking-[0.2em]">
                      Total Payable Amount
                    </span>
                    <span className="font-black text-xl text-[#00264d]">
                      {currency} {totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-yellow-800 leading-relaxed font-medium">
                    Please review the fee breakdown above before proceeding. By clicking <strong>Submit &amp; Pay Now</strong>, you will be redirected to our secure payment gateway to finalize this payment.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-gray-400 bg-gray-50">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                <p className="text-[11px] font-bold uppercase tracking-widest">Calculating Final Fees...</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/applications/new?id=${id}`}
                className="w-full sm:flex-1 bg-white border border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-bold text-sm text-center hover:bg-gray-50 uppercase tracking-tight transition-all"
              >
                Back to Edit
              </Link>
              <button
                onClick={handleSubmitAndPay}
                disabled={!!loadingStep || !feeInfo}
                className="w-full sm:flex-[2] bg-[#E11A38] text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-[#c41630] transition-all shadow-xl flex items-center justify-center gap-3 disabled:bg-gray-400 transform active:scale-[0.98]"
              >
                {loadingStep ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CreditCard size={18} />
                )}
                {loadingStep ? "Processing Transaction…" : `Pay Total: ${currency} ${totalAmount.toFixed(2)}`}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center italic mt-2">
              Payment is processed securely. Refunds are subject to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
