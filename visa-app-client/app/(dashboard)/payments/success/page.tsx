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

// ─── Invoice Receipt Component ───────────────────────────────────────────────

function InvoiceReceipt({ data }: { data: PaymentData }) {
  const { payment, invoice } = data;
  const application = payment.applicationId;
  const client = payment.clientId || application?.clientId;
  const feeBreakdown = application?.feeBreakdown || [];
  const currency = invoice?.currency || application?.currency || payment.currency || "BDT";
  const paidAt = invoice?.paidAt ? new Date(invoice.paidAt) : new Date(payment.createdAt);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden print:shadow-none print:border-0 transition-all hover:shadow-2xl hover:-translate-y-1">
      {/* Receipt Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-8">
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
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/10">
              <CheckCircle2 size={14} />
              Payment Verified
            </div>
            <p className="text-gray-400 text-[11px] font-medium">
              Completed on {paidAt.toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter">
              {paidAt.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit", hour12: true })}
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
              <div key={i} className="flex justify-between items-center text-sm py-1 group transition-colors hover:bg-gray-50 -mx-4 px-4 rounded-lg">
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
          <div className="pt-6 mt-4 border-t-2 border-dashed border-gray-200">
            <div className="bg-blue-600 rounded-xl p-6 flex justify-between items-center text-white shadow-xl shadow-blue-100 transition-transform hover:scale-[1.01]">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">Final Amount Paid</p>
                <p className="text-3xl font-black tabular-nums">
                  {currency} {(invoice?.amount || payment.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <ShieldCheck size={36} className="opacity-20 hidden md:block" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Meta Info */}
      <div className="bg-gray-50 px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-gray-100">
        <div className="space-y-1">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
            <CreditCard size={10} /> Method
          </p>
          <p className="text-[11px] font-bold text-gray-700 uppercase">Gateway Payment</p>
        </div>
        <div className="space-y-1 overflow-hidden">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
            <Hash size={10} /> Txn ID
          </p>
          <p className="text-[10px] font-mono font-bold text-gray-700 truncate">{payment.transactionId}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
            <FileText size={10} /> Invoice
          </p>
          <p className="text-[11px] font-bold text-gray-700">{invoice?.invoiceNumber || "—"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
            <Calendar size={10} /> Settled
          </p>
          <p className="text-[11px] font-bold text-gray-700">
            {paidAt.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Security Disclaimer */}
      <div className="px-8 py-5 border-t border-gray-100 text-center bg-white">
        <p className="text-[10px] text-gray-400 leading-relaxed font-semibold italic">
          This is a system-generated electronic receipt valid for all official purposes. Securely encrypted and processed by Department Payment Gateway.
        </p>
      </div>
    </div>
  );
}

// ─── Main Content Wrapper ─────────────────────────────────────────────────────

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const tx = searchParams.get("tx") || "";

  const { data, isLoading, error } = useGetPaymentByTransactionQuery(tx, {
    skip: !tx,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paymentData = (data as any)?.data as PaymentData | undefined;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 text-gray-900">
      {/* Visual background elements */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-blue-600/5 to-transparent -z-10" />

      <div className="max-w-3xl mx-auto pt-10 px-4 space-y-8">
        {/* Success Announcement Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-emerald-100 shadow-xl shadow-emerald-500/5 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left relative overflow-hidden group transition-all hover:border-emerald-200">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full translate-x-16 -translate-y-16 group-hover:bg-emerald-100 transition-colors" />
          
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20 animate-in zoom-in duration-500">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          
          <div className="space-y-1 relative z-10 flex-1">
            <h2 className="text-2xl font-black tracking-tight text-gray-900">Payment Confirmed!</h2>
            <p className="text-sm text-gray-500 font-medium max-w-md leading-relaxed">
              Fantastic! Your application fee has been processed securely. Your application is now officially submitted and has moved into the review queue.
            </p>
          </div>
        </div>

        {/* Dynamic State Rendering (Receipt Loading/Error/Success) */}
        <div className="animate-in slide-in-from-bottom-4 duration-700">
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-24 flex flex-col items-center justify-center text-center shadow-sm">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Authenticating Receipt...</p>
            </div>
          ) : error || !paymentData ? (
            <div className="bg-white rounded-2xl border border-rose-100 p-12 flex flex-col items-center text-center shadow-xl shadow-rose-500/5">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-6">
                 <AlertCircle className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Receipt Synchronization Issue</h3>
              <p className="text-sm text-gray-500 max-w-sm font-medium leading-relaxed">
                Your payment was successful, but we couldn't fetch the detailed receipt right now. Don't worry, your transaction is safe.
              </p>
              {tx && (
                <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                   <span className="text-[10px] font-black text-gray-400 uppercase">TXN REFERENCE:</span>
                   <span className="text-[11px] font-mono font-bold text-gray-700">{tx}</span>
                </div>
              )}
              <Link href="/applications" className="mt-8 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all">
                 Return to Applications
              </Link>
            </div>
          ) : (
            <InvoiceReceipt data={paymentData} />
          )}
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 print:hidden px-2">
          {!isLoading && !error && paymentData && (
            <button
              onClick={printReceipt}
              className="flex items-center justify-center gap-2.5 px-8 py-4 bg-white border border-gray-200 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-lg shadow-gray-200/50 active:scale-95"
            >
              <Printer size={16} />
              Save As Document
            </button>
          )}

          <Link
            href="/applications"
            className="flex-1 flex items-center justify-center gap-2.5 px-8 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Track Application Status
          </Link>
        </div>

        {/* Timeline / Next Steps Section */}
        {!isLoading && paymentData && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-5">
               <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                  <CheckCircle2 size={18} />
               </div>
               <h3 className="text-lg font-black tracking-tight text-gray-900 uppercase">Post-Payment Roadmap</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative px-2">
              {[
                {
                  title: "Review Protocol",
                  desc: "Your application is submitted to the case officer queue for detailed verification.",
                  icon: "01",
                },
                {
                  title: "Digital Confirmation",
                  desc: "Check your inbox. A copy of this receipt and next steps have been dispatched.",
                  icon: "02",
                },
                {
                  title: "Dashboard Tracking",
                  desc: "Monitor status updates, requests for info, and final grant notices in real-time.",
                  icon: "03",
                },
              ].map((step, idx) => (
                <div key={idx} className="space-y-4 relative group">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-black text-blue-600/10 group-hover:text-blue-600/20 transition-colors tabular-nums">{step.icon}</span>
                    <div className="w-px h-6 bg-gray-100 hidden md:block" />
                    <h4 className="text-sm font-bold text-gray-800 tracking-tight">{step.title}</h4>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                  {idx < 2 && (
                    <div className="hidden md:block absolute -right-4 top-4 text-gray-200">
                       <ChevronRight size={16} />
                    </div>
                  )}
                </div>
              ))}
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
