"use client";

import { useSearchParams } from "next/navigation";
import { useGetPaymentByTransactionQuery } from "@/redux/api/paymentApi";
import {
  CheckCircle2,
  Printer,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Building2,
  CreditCard,
  FileText,
  Calendar,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeeBreakdownItem {
  label: string;
  amount: number;
}

interface PaymentData {
  payment: {
    _id: string;
    transactionId: string;
    amount: number;
    currency: string;
    status: string;
    gateway: string;
    createdAt: string;
    applicationId?: {
      _id: string;
      trn?: string;
      visaCategory?: string;
      totalAmount?: number;
      feeBreakdown?: FeeBreakdownItem[];
      currency?: string;
      clientId?: { name?: string; email?: string };
    };
    clientId?: { name?: string; email?: string };
  };
  invoice: {
    _id: string;
    invoiceNumber: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod?: string;
    description?: string;
    createdAt: string;
    paidAt?: string;
  } | null;
}

// ─── Print Styles ──────────────────────────────────────────────────────────

const printReceipt = () => {
  window.print();
};

// ─── Invoice Receipt ──────────────────────────────────────────────────────────

function InvoiceReceipt({ data }: { data: PaymentData }) {
  const { payment, invoice } = data;
  const application = payment.applicationId;
  const client =
    payment.clientId || application?.clientId;
  const feeBreakdown = application?.feeBreakdown || [];
  const currency = invoice?.currency || application?.currency || payment.currency || "BDT";
  const paidAt = invoice?.paidAt
    ? new Date(invoice.paidAt)
    : new Date(payment.createdAt);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden print:shadow-none print:border-0">

      {/* ── Invoice Header ── */}
      <div className="bg-[#00264d] text-white px-5 sm:px-7 py-5">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 opacity-80" />
              <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase opacity-80">
                Department of Home Affairs
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Payment Receipt
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm mt-0.5">
              {invoice?.invoiceNumber || `TXN-${payment.transactionId?.slice(-8)}`}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <div className="inline-flex items-center gap-1.5 bg-green-400/20 border border-green-400/30 text-green-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
              <CheckCircle2 className="w-3.5 h-3.5" />
              PAID
            </div>
            <p className="text-blue-200 text-[10px] sm:text-xs mt-2">
              Paid on{" "}
              {paidAt.toLocaleDateString("en-AU", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-blue-300 text-[10px] sm:text-xs">
              {paidAt.toLocaleTimeString("en-AU", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* ── Billing Info ── */}
      <div className="px-5 sm:px-7 py-5 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 border-b border-gray-200 text-left">
        <div>
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            Billed To
          </p>
          <p className="font-bold text-gray-800 text-sm">
            {client?.name?.toUpperCase() || "APPLICANT"}
          </p>
          <p className="text-gray-500 text-xs mt-0.5">{client?.email || "—"}</p>
        </div>

        <div>
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            Application Reference
          </p>
          <p className="font-mono font-bold text-[#2150a0] text-sm">
            {application?.trn || "—"}
          </p>
          <p className="text-gray-500 text-xs mt-0.5">
            {application?.visaCategory || "Visa Application"}
          </p>
        </div>
      </div>

      {/* ── Fee Breakdown Table ── */}
      <div className="px-7 py-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
          Fee Breakdown
        </p>

        {feeBreakdown.length > 0 ? (
          <div className="space-y-0">
            {/* Table header */}
            <div className="grid grid-cols-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 pb-2 border-b border-gray-200">
              <span>Description</span>
              <span className="text-right">Amount</span>
            </div>

            {/* Fee rows */}
            {feeBreakdown.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-2 py-2.5 text-sm border-b border-gray-100 last:border-b-0"
              >
                <span className="text-gray-600">{item.label}</span>
                <span className="text-right font-medium text-gray-800">
                  {currency}{" "}
                  {item.amount.toFixed(2)}
                </span>
              </div>
            ))}

            {/* Total row */}
            <div className="grid grid-cols-2 pt-3 mt-1 border-t-2 border-gray-800">
              <span className="font-bold text-gray-900 text-base">
                Total Paid
              </span>
              <span className="text-right font-bold text-[#00264d] text-base">
                {currency}{" "}
                {(invoice?.amount || payment.amount || 0).toFixed(2)}
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 py-3 border-b border-gray-100">
            <span className="text-gray-600 text-sm">
              {invoice?.description || "Visa Application Fee"}
            </span>
            <span className="text-right font-bold text-[#00264d] text-sm">
              {currency}{" "}
              {(invoice?.amount || payment.amount || 0).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* ── Payment Details ── */}
      <div className="px-5 sm:px-7 py-4 bg-gray-50 border-t border-gray-200 text-left">
        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
          Payment Details
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 sm:gap-y-2 text-xs">
          <div className="flex sm:flex-col gap-2 sm:gap-0.5">
            <div className="flex items-center gap-2 text-gray-500 min-w-0 sm:min-w-0">
               <CreditCard className="w-3.5 h-3.5 text-gray-400 shrink-0" />
               <span className="font-medium text-[10px] uppercase">Payment Method</span>
            </div>
            <div className="text-gray-700 font-semibold uppercase">Online Payment</div>
          </div>

          <div className="flex sm:flex-col gap-2 sm:gap-0.5">
            <div className="flex items-center gap-2 text-gray-500 min-w-0 sm:min-w-0">
               <Hash className="w-3.5 h-3.5 text-gray-400 shrink-0" />
               <span className="font-medium text-[10px] uppercase">Transaction ID</span>
            </div>
            <div className="font-mono text-gray-700 text-[11px] break-all">{payment.transactionId}</div>
          </div>

          <div className="flex sm:flex-col gap-2 sm:gap-0.5">
            <div className="flex items-center gap-2 text-gray-500 min-w-0 sm:min-w-0">
               <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
               <span className="font-medium text-[10px] uppercase">Invoice No.</span>
            </div>
            <div className="text-gray-700 font-semibold">{invoice?.invoiceNumber || "—"}</div>
          </div>

          <div className="flex sm:flex-col gap-2 sm:gap-0.5">
             <div className="flex items-center gap-2 text-gray-500 min-w-0 sm:min-w-0">
               <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
               <span className="font-medium text-[10px] uppercase">Payment Date</span>
            </div>
            <div className="text-gray-700">
               {paidAt.toLocaleDateString("en-AU", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
               })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-7 py-4 border-t border-dashed border-gray-200 text-center">
        <p className="text-[11px] text-gray-400 leading-relaxed">
          This is an automatically generated receipt. Please retain it for your
          records. Your application is now being processed by the Department of
          Home Affairs.
        </p>
      </div>
    </div>
  );
}

// ─── Content Component (uses searchParams) ────────────────────────────────────

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const tx = searchParams.get("tx") || "";

  const { data, isLoading, error } = useGetPaymentByTransactionQuery(tx, {
    skip: !tx,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paymentData = (data as any)?.data as PaymentData | undefined;

  return (
    <div className="bg-gray-100 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-[#1a2b4a] min-h-[44px] py-1 flex items-center px-5 text-white text-sm font-bold gap-3">
        <CheckCircle2 size={16} />
        Payment Successful — Receipt
      </div>

      <div className="max-w-2xl mx-auto mt-8 px-4 space-y-4">

        {/* ── Success Banner ── */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl px-6 py-5 text-white shadow-md flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Payment Successful!</h2>
            <p className="text-green-100 text-sm mt-0.5">
              Your application has been submitted and payment received. A
              confirmation email has been sent to you.
            </p>
          </div>
        </div>

        {/* ── Receipt ── */}
        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500 text-sm">Loading your receipt…</p>
          </div>
        ) : error || !paymentData ? (
          <div className="bg-white rounded-xl border border-red-200 p-10 flex flex-col items-center text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
            <h3 className="text-gray-800 font-bold mb-1">
              Could not load receipt
            </h3>
            <p className="text-gray-500 text-sm mb-1">
              Your payment was processed, but the receipt is temporarily
              unavailable.
            </p>
            {tx && (
              <p className="text-xs font-mono text-gray-400 mt-2 bg-gray-50 px-3 py-1 rounded">
                Transaction ID: {tx}
              </p>
            )}
          </div>
        ) : (
          <InvoiceReceipt data={paymentData} />
        )}

        {/* ── Action Buttons ── */}
        <div className="flex flex-wrap gap-3 print:hidden">
          <button
            onClick={printReceipt}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>

          <Link
            href="/applications"
            className="flex items-center gap-2 px-4 py-2 bg-[#00264d] text-white rounded-lg text-sm font-semibold hover:bg-[#001a33] transition-colors shadow-sm ml-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Applications
          </Link>
        </div>

        {/* ─── What Happens Next ── */}
        {!isLoading && paymentData && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-3">
              What happens next?
            </h3>
            <ol className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                  1
                </span>
                Your application is now under review by the Department of Home
                Affairs.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                  2
                </span>
                A confirmation email with your receipt has been sent to your
                registered email address.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                  3
                </span>
                You can track the status of your application from the
                Applications dashboard.
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Default Export (wrapped in Suspense for useSearchParams) ─────────────────

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
