"use client";

import { useGetSingleInvoiceQuery } from "@/redux/api/invoiceApi";
import { useInitiatePaymentMutation } from "@/redux/api/paymentApi";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCard, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useAlert } from "@/components/ui";

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

  const [initiatePayment, { isLoading: isPaying }] =
    useInitiatePaymentMutation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { showAlert, showConfirm } = useAlert();

  const handlePay = async () => {
    if (!invoice) return;

    const isConfirmed = await showConfirm({
      title: "Confirm Payment",
      message: `Are you sure you want to process a payment of ${invoice.amount.toFixed(2)} ${invoice.currency}?`,
      confirmLabel: "Yes, Pay Now",
      cancelLabel: "Cancel",
      type: "info",
    });

    if (!isConfirmed) return;

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
        // Redirect to Gateway
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
      <div className="p-16 flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-sm">Loading invoice details...</p>
      </div>
    );
  }

  if (fetchError || !invoice) {
    return (
      <div className="p-16 text-center text-red-600 bg-red-50 m-5 rounded-lg border border-red-100">
        <AlertCircle className="w-10 h-10 mx-auto mb-4 opacity-50" />
        <h2 className="font-bold mb-1">Invoice Not Found</h2>
        <p className="text-sm">The invoice you are looking for does not exist or has been deleted.</p>
        <button onClick={() => router.push('/payments')} className="mt-4 text-sm underline font-bold">Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen pb-16">
      <div className="bg-[#1a2b4a] min-h-[44px] py-1 flex items-center px-5 text-white text-sm font-bold gap-3 flex-wrap">
        <CreditCard size={16} />
        <span>Payment Gateway — Invoice: {invoice.invoiceNumber}</span>
      </div>

      <div className="max-w-2xl mx-auto mt-10 px-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-[#00264d] text-white px-6 py-3 font-bold flex justify-between items-center">
            <span className="text-sm">Ready to Pay</span>
            <span className="bg-yellow-400 text-[#00264d] text-[10px] px-2 py-0.5 rounded uppercase font-black">
              {invoice.status}
            </span>
          </div>

          <div className="p-8">
            {success ? (
              <div className="text-center py-10">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Payment Successful!
                </h2>
                <p className="text-gray-600">
                  Your invoice has been paid. Redirecting you...
                </p>
              </div>
            ) : invoice.status === "paid" ? (
              <div className="text-center py-10">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Invoice Already Paid
                </h2>
                <p className="text-gray-600 mb-8 border-b pb-8">
                  This transaction was finalized on{" "}
                  <strong>{invoice.paidAt ? new Date(invoice.paidAt).toLocaleString() : "N/A"}</strong>
                </p>
                <button
                  onClick={() => router.push("/payments")}
                  className="px-8 py-3 bg-[#00264d] text-white rounded-lg font-bold hover:bg-[#001a33] transition-all shadow-md"
                >
                  Return to My Payments
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-xs border-b pb-6 border-gray-100 italic">
                  <div className="text-gray-500 font-medium tracking-tight">Invoice #</div>
                  <div className="sm:text-right text-gray-800 font-bold">{invoice.invoiceNumber}</div>

                  <div className="text-gray-500 font-medium tracking-tight">Applicant</div>
                  <div className="sm:font-bold sm:text-right text-gray-800 uppercase">
                    {invoice.clientId?.name || invoice.clientId?.fullName || "N/A"}
                  </div>

                  <div className="text-gray-500 font-medium tracking-tight">Package</div>
                  <div className="font-bold sm:text-right text-gray-800">
                    {invoice.description || "Visa Fee"}
                  </div>
                </div>

                {/* ─── FEE BREAKDOWN ─────────────────────────────────────────────────── */}
                {invoice.applicationId?.feeBreakdown && invoice.applicationId.feeBreakdown.length > 0 && (
                  <div className="mb-8 rounded-xl bg-gray-50/50 border border-gray-100 p-5">
                    <h3 className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] mb-4 text-center">
                      Payment Breakdown
                    </h3>
                    <div className="space-y-3">
                      {invoice.applicationId.feeBreakdown.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[11px]">
                          <span className="text-gray-500 font-medium">{item.label}</span>
                          <span className="font-bold text-gray-700">
                            {invoice.currency} {item.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="pt-3 border-t border-dashed border-gray-200 mt-3 flex justify-between items-center bg-white -mx-3 px-3 py-2 rounded-lg shadow-sm border border-gray-100">
                        <span className="text-[#00264d] font-black uppercase text-[10px] tracking-wider">
                          Grand Total Due
                        </span>
                        <span className="font-black text-base text-[#00264d]">
                          {invoice.currency} {invoice.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-lg flex items-start gap-3">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="mb-10 flex justify-center">
                  <div className="w-full max-w-sm">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-4">
                      Payment Method
                    </label>
                    <div
                      className="relative cursor-default transition-all duration-300 rounded-xl border-2 p-5 flex flex-col items-center justify-center gap-2 border-[#E11A38] bg-[#fff5f6] ring-4 ring-[#E11A38]/5 shadow-inner"
                    >
                      <div className="absolute top-2 right-2">
                        <CheckCircle
                          size={16}
                          className="text-[#E11A38]"
                          fill="currentColor"
                        />
                      </div>
                      <div className="font-bold text-lg flex items-center text-[#00264d]">
                        Cards & Net Banking
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter text-center">
                        Secure Payment Gateway
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => router.back()}
                    disabled={isPaying}
                    className="w-full sm:flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePay}
                    disabled={isPaying}
                    className="w-full sm:flex-[2] py-3 bg-[#00264d] text-white rounded-xl hover:bg-[#001a33] transition-all flex items-center justify-center gap-2 text-sm font-bold shadow-lg disabled:opacity-50"
                  >
                    {isPaying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CreditCard size={16} />
                    )}
                    {isPaying
                      ? "Initializing..."
                      : `Pay Total: ${invoice.currency} ${invoice.amount.toFixed(2)}`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-6 leading-relaxed">
          SECURE ENCRYPTED TRANSACTION <br />
          Payments are processed securely via encrypted gateways. Your payment data is never stored on our servers.
        </p>
      </div>
    </div>
  );
}
