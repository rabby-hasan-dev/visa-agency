"use client";

import { useGetSingleInvoiceQuery } from "@/redux/api/invoiceApi";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { useParams, useRouter } from "next/navigation";
import { FileText, Download, Printer, ArrowLeft, CheckCircle, AlertCircle, Loader2, CreditCard } from "lucide-react";
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
    fullName: string;
    email: string;
    phone: string;
    passportNumber: string;
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

  if (isInvoiceLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#00264d] mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-xl font-bold text-gray-800 mb-2">Invoice Not Found</h1>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          The requested invoice could not be found or you don't have permission to view it.
        </p>
        <Link 
            href="/payments" 
            className="px-6 py-2 bg-[#00264d] text-white rounded-lg font-bold hover:bg-[#001a33] transition-all"
        >
            Back to Payments
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20 print:bg-white print:pb-0">
      {/* Navigation & Actions */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 print:hidden">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FileText size={18} className="text-[#00264d]" />
            Invoice {invoice.invoiceNumber}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
          >
            <Printer size={16} />
            Print
          </button>
          {invoice.status === 'pending' && (
            <Link
              href={`/payments/invoice/${invoice._id}/pay`}
              className="flex items-center gap-2 px-6 py-2 text-sm font-extrabold text-white bg-[#00264d] rounded-lg hover:bg-[#001a33] transition-all shadow-md"
            >
              <CreditCard size={16} />
              Pay Now
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-8 px-4 print:mt-0 print:px-0">
        {/* Invoice Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden print:border-0 print:shadow-none">
          {/* Top Branding / Status Bar */}
          <div className={`h-2 w-full ${
            invoice.status === 'paid' ? 'bg-green-500' : 
            invoice.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
          }`} />

          <div className="p-8 md:p-12">
            {/* Header: Logo and Site Info */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
              <div className="flex items-center gap-3">
                {siteSettings?.logoUrl && (
                  <img src={siteSettings.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
                )}
                <div>
                   <h2 className="text-2xl font-black text-[#00264d] tracking-tight uppercase leading-none">
                    {siteSettings?.siteName || "VISA SERVICE"}
                  </h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                    Official Visa Application Processing
                  </p>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-1">INVOICE</h1>
                <p className="text-gray-500 font-medium">{invoice.invoiceNumber}</p>
                <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 
                  invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {invoice.status === 'paid' && <CheckCircle size={12} />}
                  {invoice.status}
                </div>
              </div>
            </div>

            {/* Billing Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                  Billed To
                </h3>
                <div className="flex flex-col gap-1">
                  <span className="text-xl font-bold text-gray-800 uppercase">{invoice.clientId?.fullName || invoice.clientId?.name}</span>
                  <span className="text-gray-600 text-sm">{invoice.clientId?.email}</span>
                  <span className="text-gray-600 text-sm">{invoice.clientId?.phone}</span>
                  <span className="text-gray-500 text-xs mt-2">Passport: {invoice.clientId?.passportNumber || 'N/A'}</span>
                </div>
              </div>
              <div className="md:text-right">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2 md:border-none md:pb-0">
                  Invoice Details
                </h3>
                <div className="grid grid-cols-2 md:block gap-4">
                  <div className="mb-4">
                    <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Date Issued</p>
                    <p className="text-gray-800 font-bold">
                      {new Date(invoice.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  {invoice.status === 'paid' && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Date Paid</p>
                      <p className="text-green-600 font-bold">
                        {invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A'}
                      </p>
                    </div>
                  )}
                  {invoice.paymentMethod && (
                     <div className="mb-4">
                      <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Payment Method</p>
                      <p className="text-gray-800 font-bold uppercase">{invoice.paymentMethod}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mb-12">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-900 border-opacity-10">
                    <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                    <th className="py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoice.applicationId?.feeBreakdown && invoice.applicationId.feeBreakdown.length > 0 ? (
                    invoice.applicationId.feeBreakdown.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-4">
                          <p className="font-bold text-gray-800">{item.label}</p>
                          {idx === 0 && (
                             <p className="text-gray-400 text-[10px] mt-0.5 uppercase tracking-tighter italic">Application Ref: {invoice.applicationId?._id?.toUpperCase()}</p>
                          )}
                        </td>
                        <td className="py-4 text-right font-bold text-gray-900">
                          {invoice.currency} {item.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-6">
                        <p className="font-bold text-gray-800 text-lg">{invoice.description || "Visa Fee"}</p>
                        <p className="text-gray-400 text-xs mt-1">Application ID: {invoice.applicationId?._id?.toUpperCase() || 'N/A'}</p>
                      </td>
                      <td className="py-6 text-right font-black text-xl text-gray-900">
                        {invoice.currency} {invoice.amount.toFixed(2)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="flex justify-end">
              <div className="w-full md:w-80 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="text-gray-800 font-bold">{invoice.currency} {invoice.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Tax / VAT (0%)</span>
                  <span className="text-gray-800 font-bold">$0.00</span>
                </div>
                <div className="pt-4 border-t-2 border-gray-900 border-opacity-10 flex justify-between items-center">
                  <span className="text-lg font-black text-[#00264d] uppercase tracking-tighter">Total Due</span>
                  <span className="text-3xl font-black text-[#00264d]">
                    {invoice.currency} {invoice.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes / Footer */}
            <div className="mt-20 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Terms & Notes</p>
                  <p className="text-gray-500 text-xs leading-relaxed italic">
                    This is a computer generated document. All visa fees are non-refundable once processed. 
                    If you have any questions regarding this invoice, please contact support.
                  </p>
               </div>
               <div className="md:text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Need help?</p>
                  <p className="text-[#00264d] font-bold text-sm">support@visaservice.com</p>
               </div>
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="bg-gray-50 px-8 py-6 flex justify-between items-center print:hidden">
             <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                <Download size={14} />
                Download PDF (Optional feature)
             </div>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                E-INVOICE SECURELY TRANSMITTED
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
