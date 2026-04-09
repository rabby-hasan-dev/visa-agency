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
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useRef, forwardRef } from "react";

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

// ─── Invoice Receipt Component (ForwardRef) ───────────────────────────────────

const InvoiceReceipt = forwardRef<HTMLDivElement, { data: PaymentData }>(
  ({ data }, ref) => {
    const { payment, invoice } = data;
    const application = payment.applicationId;
    const client = payment.clientId || application?.clientId;
    const feeBreakdown = application?.feeBreakdown || [];
    const currency = invoice?.currency || application?.currency || payment.currency || "BDT";
    const paidAt = invoice?.paidAt ? new Date(invoice.paidAt) : new Date(payment.createdAt);

    return (
      <div 
        ref={ref}
        className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden print:shadow-none print:border-0 transition-all hover:shadow-2xl hover:-translate-y-1"
      >
        {/* Receipt Header */}
        <div className="bg-gray-900 text-white px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2.5 mb-1">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 size={16} className="text-white" />
                </div>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">
                  Official Payment Receipt
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight">Department Services</h1>
              <p className="text-gray-400 text-xs font-mono uppercase tracking-widest">
                {invoice?.invoiceNumber || `TXN-${payment.transactionId?.slice(-8)}`}
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest">
                PAID
              </div>
              <p className="text-gray-400 text-[11px] font-medium">
                {paidAt.toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>

        {/* Bill To & Reference Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 bg-gray-50/50 border-b border-gray-100">
          <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Payee Information</p>
            <div className="space-y-1">
              <p className="text-lg font-bold text-gray-900 leading-tight">
                {client?.name || "Verified Applicant"}
              </p>
              <p className="text-sm font-medium text-gray-500">{client?.email || "—"}</p>
            </div>
          </div>
          <div className="p-8 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Application Reference</p>
            <div className="space-y-1">
              <p className="text-lg font-bold text-blue-600 font-mono tracking-tight">
                {application?.trn || "PENDING"}
              </p>
              <p className="text-sm font-medium text-gray-500">
                {application?.visaCategory || "Standard Application"}
              </p>
            </div>
          </div>
        </div>

        {/* Fee Breakdown Table */}
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3">
            <p className="text-xs font-black uppercase tracking-widest text-gray-800">Transactional Breakdown</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Amounts in {currency}</p>
          </div>

          <div className="space-y-3.5">
            {feeBreakdown.length > 0 ? (
              feeBreakdown.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm py-1">
                  <span className="text-gray-600 font-medium">{item.label}</span>
                  <span className="font-bold text-gray-900 tabular-nums">
                    {currency} {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex justify-between items-center text-sm py-1">
                <span className="text-gray-600 font-medium">{invoice?.description || "Processing Fee"}</span>
                <span className="font-bold text-gray-900 tabular-nums">
                  {currency} {(invoice?.amount || payment.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}

            {/* Grand Total Bar */}
            <div className="pt-6 mt-4 border-t border-gray-200">
              <div className="bg-blue-600 rounded-xl p-6 flex justify-between items-center text-white">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">Final Amount Paid</p>
                  <p className="text-3xl font-black tabular-nums">
                    {currency} {(invoice?.amount || payment.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Meta Info */}
        <div className="bg-gray-50 px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-gray-100">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Method</p>
            <p className="text-[11px] font-bold text-gray-700 uppercase">Gateway Payment</p>
          </div>
          <div className="space-y-1 overflow-hidden">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Txn ID</p>
            <p className="text-[10px] font-mono font-bold text-gray-700 truncate">{payment.transactionId}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Invoice</p>
            <p className="text-[11px] font-bold text-gray-700">{invoice?.invoiceNumber || "—"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Settled</p>
            <p className="text-[11px] font-bold text-gray-700">
              {paidAt.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Security Disclaimer */}
        <div className="px-8 py-5 border-t border-gray-100 text-center bg-white">
          <p className="text-[10px] text-gray-400 font-semibold italic">
            This is a system-generated electronic receipt valid for all official purposes.
          </p>
        </div>
      </div>
    );
  }
);

InvoiceReceipt.displayName = "InvoiceReceipt";

// ─── Main Content Wrapper ─────────────────────────────────────────────────────

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const tx = searchParams.get("tx") || "";
  const receiptRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useGetPaymentByTransactionQuery(tx, {
    skip: !tx,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paymentData = (data as any)?.data as PaymentData | undefined;

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Payment Receipt - ${tx}</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px; color: #111; font-size: 12px; background: #fff; }
                .bg-white { background: #fff; }
                .bg-gray-50 { background: #f9fafb; }
                .bg-gray-900 { background: #111827; }
                .bg-blue-600 { background: #2563eb; }
                .text-white { color: #fff; }
                .text-gray-900 { color: #111827; }
                .text-gray-800 { color: #1f2937; }
                .text-gray-700 { color: #374151; }
                .text-gray-600 { color: #4b5563; }
                .text-gray-500 { color: #6b7280; }
                .text-gray-400 { color: #9ca3af; }
                .text-blue-600 { color: #2563eb; }
                .text-blue-100 { color: #dbeafe; }
                .text-emerald-400 { color: #34d399; }
                .font-bold { font-weight: 700; }
                .font-black { font-weight: 900; }
                .font-medium { font-weight: 500; }
                .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
                .uppercase { text-transform: uppercase; }
                .tracking-tight { letter-spacing: -0.025em; }
                .tracking-widest { letter-spacing: 0.1em; }
                .text-xs { font-size: 0.75rem; }
                .text-sm { font-size: 0.875rem; }
                .text-lg { font-size: 1.125rem; }
                .text-2xl { font-size: 1.5rem; }
                .text-3xl { font-size: 1.875rem; }
                .flex { display: flex; }
                .flex-col { flex-direction: column; }
                .items-center { align-items: center; }
                .justify-between { justify-content: space-between; }
                .gap-1 { gap: 0.25rem; }
                .gap-2 { gap: 0.5rem; }
                .gap-3 { gap: 0.75rem; }
                .gap-4 { gap: 1rem; }
                .gap-6 { gap: 1.5rem; }
                .grid { display: grid; }
                .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                .p-8 { padding: 2rem; }
                .p-6 { padding: 1.5rem; }
                .px-8 { padding-left: 2rem; padding-right: 2rem; }
                .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
                .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
                .py-5 { padding-top: 1.25rem; padding-bottom: 1.25rem; }
                .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
                .pt-6 { padding-top: 1.5rem; }
                .mt-4 { margin-top: 1rem; }
                .border { border: 1px solid #e5e7eb; }
                .border-b { border-bottom: 1px solid #e5e7eb; }
                .border-b-2 { border-bottom: 2px solid #e5e7eb; }
                .border-t { border-top: 1px solid #e5e7eb; }
                .border-r { border-right: 1px solid #e5e7eb; }
                .rounded-lg { border-radius: 0.5rem; }
                .rounded-xl { border-radius: 0.75rem; }
                .rounded-2xl { border-radius: 1rem; }
                .overflow-hidden { overflow: hidden; }
                .italic { font-style: italic; }
                .text-center { text-align: center; }
                .w-8 { width: 2rem; }
                .h-8 { height: 2rem; }
                @media md {
                  .md\\:flex-row { flex-direction: row; }
                  .md\\:text-left { text-align: left; }
                  .md\\:items-end { align-items: flex-end; }
                  .md\\:border-b-0 { border-bottom-width: 0px; }
                  .md\\:border-r { border-right-width: 1px; }
                }
                .lucide { display: none; }
              </style>
            </head>
            <body>
              ${receiptRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 text-gray-900">
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-blue-600/5 to-transparent -z-10" />

      <div className="max-w-3xl mx-auto pt-10 px-4 space-y-8">
        <div className="bg-white rounded-2xl p-8 border border-emerald-100 shadow-xl flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left relative overflow-hidden group">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <div className="space-y-1 flex-1">
            <h2 className="text-2xl font-black tracking-tight text-gray-900">Payment Confirmed!</h2>
            <p className="text-sm text-gray-500 font-medium max-w-md leading-relaxed">
              Your application fee has been processed securely and your application is now submitted.
            </p>
          </div>
        </div>

        <div className="animate-in slide-in-from-bottom-4 duration-700">
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-24 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Authenticating Receipt...</p>
            </div>
          ) : error || !paymentData ? (
            <div className="bg-white rounded-2xl border border-rose-100 p-12 flex flex-col items-center text-center shadow-xl">
              <AlertCircle className="w-10 h-10 text-rose-500 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Receipt Synchronization Issue</h3>
              <p className="text-sm text-gray-500 max-w-sm">We couldn't fetch the detailed receipt right now.</p>
            </div>
          ) : (
            <InvoiceReceipt ref={receiptRef} data={paymentData} />
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 print:hidden px-2">
          {!isLoading && !error && paymentData && (
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2.5 px-8 py-4 bg-white border border-gray-200 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50 shadow-lg active:scale-95"
            >
              <Printer size={16} />
              Save As Document
            </button>
          )}

          <Link
            href="/applications"
            className="flex-1 flex items-center justify-center gap-2.5 px-8 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl active:scale-95 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Track Application Status
          </Link>
        </div>

        {!isLoading && paymentData && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-5">
               <h3 className="text-lg font-black text-gray-900 uppercase">Post-Payment Roadmap</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative px-2 text-xs">
              <div>
                <h4 className="font-bold mb-2">Review Protocol</h4>
                <p className="text-gray-500">Your application is in the review queue for verification.</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Digital Confirmation</h4>
                <p className="text-gray-500">Check your inbox for a copy of this receipt and next steps.</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Dashboard Tracking</h4>
                <p className="text-gray-500">Monitor status updates and notices in real-time.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Default Export ──────────────────────────────────────────────────────

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
