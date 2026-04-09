"use client";

import { useGetSingleInvoiceQuery } from "@/redux/api/invoiceApi";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { useParams, useRouter } from "next/navigation";
import { FileText, Printer, ArrowLeft, CheckCircle2, AlertCircle, Loader2, CreditCard, ShieldCheck, Mail, Phone, Calendar, Hash, Globe } from "lucide-react";
import Link from "next/link";

interface InvoiceData {
  _id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  paidAt?: string;
  createdAt: string;
  paymentMethod?: string;
  applicationId?: {
    _id: string;
    feeBreakdown?: { label: string; amount: number }[];
  };
  clientId?: {
    _id: string;
    fullName?: string;
    email: string;
    phone: string;
    passportNumber?: string;
    name?: string;
  };
}

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: invoiceData, isLoading: isInvoiceLoading } = useGetSingleInvoiceQuery(id);
  const { data: settingsData } = useGetSiteSettingsQuery({});

  const invoice = invoiceData?.data as InvoiceData;
  const siteSettings = settingsData?.data;

  const handlePrint = () => window.print();

  if (isInvoiceLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-sm font-medium ml-3">Authenticating Invoice...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-6">
          <AlertCircle size={32} className="text-rose-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h1>
        <p className="text-sm text-gray-500 mb-8 max-w-sm">The requested invoice could not be located or has been archived.</p>
        <Link href="/payments" className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200">
          Back to Payments
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* ── Navigation Actions ── */}
      <div className="flex items-center justify-between no-print">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
          <ArrowLeft size={14} /> Back to History
        </button>
        <div className="flex items-center gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all active:scale-95">
            <Printer size={16} /> Print Receipt
          </button>
          {invoice.status === 'pending' && (
            <Link href={`/payments/invoice/${invoice._id}/pay`} className="flex items-center gap-2 px-6 py-2 text-xs font-black text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95">
              <CreditCard size={16} /> PAY NOW
            </Link>
          )}
        </div>
      </div>

      {/* ── Main Invoice Container ── */}
      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-2xl shadow-gray-200/50 overflow-hidden print:border-0 print:shadow-none">
        {/* Status Indicator Bar */}
        <div className={`h-2.5 w-full ${
          invoice.status === 'paid' ? 'bg-emerald-500' : 
          invoice.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
        }`} />

        <div className="p-8 md:p-16">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16 px-2">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {siteSettings?.logoUrl ? (
                  <img src={siteSettings.logoUrl} alt="Logo" className="h-12 w-auto" />
                ) : (
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                    <ShieldCheck size={28} />
                  </div>
                )}
                <div className="space-y-0.5">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                    {siteSettings?.siteName || "Global Visa HQ"}
                  </h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Official Service Provider</p>
                </div>
              </div>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 text-gray-500">
                  <Globe size={14} className="text-gray-400" />
                  <span className="text-xs font-medium">www.visaagency.com.au</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <Mail size={14} className="text-gray-400" />
                  <span className="text-xs font-medium">billing@visaagency.com.au</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 px-2">
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter">INVOICE</h1>
              <div className="flex flex-col md:items-end space-y-0.5">
                <p className="text-sm font-mono font-bold text-blue-600 tracking-tight">{invoice.invoiceNumber}</p>
                <div className={`mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  invoice.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                  invoice.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}>
                  {invoice.status === 'paid' && <CheckCircle2 size={12} />}
                  {invoice.status}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20 px-2">
            <div className="space-y-6">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.25em] border-b border-gray-100 pb-2">Client Details</p>
              <div className="space-y-3">
                <p className="text-2xl font-bold text-gray-900 uppercase leading-none">{invoice.clientId?.fullName || invoice.clientId?.name || "Verified Applicant"}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                    <Mail size={12} className="text-gray-400" /> {invoice.clientId?.email}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                    <Phone size={12} className="text-gray-400" /> {invoice.clientId?.phone || "—"}
                  </div>
                </div>
                {invoice.clientId?.passportNumber && (
                   <div className="pt-2">
                     <span className="px-2 py-1 bg-gray-100 rounded text-[9px] font-bold text-gray-500 uppercase tracking-widest">Passport: {invoice.clientId.passportNumber}</span>
                   </div>
                )}
              </div>
            </div>

            <div className="md:text-right space-y-6">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.25em] border-b border-gray-100 pb-2 md:border-none md:pb-0">Chronological Info</p>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1.5 flex md:justify-end items-center gap-1.5">
                    <Calendar size={12} /> Issued Date
                  </p>
                  <p className="text-gray-900 font-bold text-sm">
                    {new Date(invoice.createdAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                {invoice.status === 'paid' && (
                  <div className="animate-in slide-in-from-top-2 duration-500">
                    <p className="text-emerald-500 text-[9px] font-black uppercase tracking-widest mb-1.5 flex md:justify-end items-center gap-1.5">
                      <CheckCircle2 size={12} /> Reconciliation Date
                    </p>
                    <p className="text-emerald-600 font-bold text-sm">
                      {invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-16">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-900/5">
                  <th className="py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Transactional Description</th>
                  <th className="py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Settlement Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invoice.applicationId?.feeBreakdown && invoice.applicationId.feeBreakdown.length > 0 ? (
                  invoice.applicationId.feeBreakdown.map((item, idx) => (
                    <tr key={idx} className="group">
                      <td className="py-6 transition-colors group-hover:bg-gray-50/50 rounded-l-xl">
                        <div className="font-bold text-gray-800">{item.label}</div>
                        {idx === 0 && (
                           <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-1 font-mono">
                             <Hash size={10} /> {invoice.applicationId?._id?.toUpperCase()}
                           </div>
                        )}
                      </td>
                      <td className="py-6 text-right font-black text-gray-900 rounded-r-xl tabular-nums">
                        {invoice.currency} {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-8">
                      <p className="font-bold text-gray-900 text-lg">{invoice.description || "Visa Processing Fee"}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-1 font-mono uppercase tracking-widest">
                         Service ID: {invoice.applicationId?._id?.slice(-12).toUpperCase() || 'N/A'}
                      </div>
                    </td>
                    <td className="py-8 text-right font-black text-2xl text-gray-900 tabular-nums">
                      {invoice.currency} {invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end px-2">
            <div className="w-full md:w-96 p-8 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-gray-400 uppercase tracking-widest">Subtotal</span>
                  <span className="text-gray-900 font-bold tabular-nums">{invoice.currency} {invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-gray-400 uppercase tracking-widest">Digital Surcharge</span>
                  <span className="text-emerald-500 font-bold">INCLUDED</span>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Grand Total Due</span>
                  <div className="flex flex-col items-end">
                    <span className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">
                      {invoice.currency} {invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Currency: {invoice.currency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-24 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-end gap-12 px-2">
             <div className="max-w-xs space-y-3">
                <div className="flex items-center gap-2 text-gray-900 font-black text-[10px] uppercase tracking-widest">
                   <ShieldCheck size={14} className="text-blue-600" /> Legal Notes
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed font-medium italic">
                  This transaction is processed by Department Gateway. Fees are non-refundable after standard review initiates. All amounts are inclusive of statutory regulatory duties where applicable.
                </p>
             </div>
             <div className="md:text-right space-y-1">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Support Authorization</p>
                <p className="text-blue-600 font-bold text-sm tracking-tight">{siteSettings?.supportEmail || "billing@visacentral.gov.au"}</p>
             </div>
          </div>
        </div>

        {/* Bottom Decorative Banner */}
        <div className="bg-gray-900 p-8 flex flex-col sm:flex-row justify-between items-center gap-6 no-print">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/50">
                 <ShieldCheck size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-white uppercase tracking-widest">Secure E-Receipt</p>
                 <p className="text-[10px] text-white/40 font-medium">Verified by Department Security Infrastructure</p>
              </div>
           </div>
           <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.5em] hidden md:block">
              GENUINE DOCUMENT · DO NOT REPLICATE
           </p>
        </div>
      </div>
    </div>
  );
}
