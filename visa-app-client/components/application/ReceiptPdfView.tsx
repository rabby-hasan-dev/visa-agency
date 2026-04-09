"use client";

import { useRef } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */

interface ReceiptPdfViewProps {
  application: any;
  onClose: () => void;
}

export const ReceiptPdfView = ({ application, onClose }: ReceiptPdfViewProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const trn = application?.trn || application?._id?.slice(-10).toUpperCase() || "—";
  const visaCategory = application?.visaCategory || "Visa Application";
  
  // Find latest updates from updateRequests if any
  let applicantEmail = application?.email || application?.clientId?.email || "—";
  let applicantName = application?.clientId?.name || "—";

  if (application?.updateRequests && Array.isArray(application.updateRequests)) {
    // Iterate through updates to find latest email/passport(name) changes
    application.updateRequests.forEach((update: any) => {
        if (update.type === 'email' && update.data?.email) {
            applicantEmail = update.data.email;
        }
        if (update.type === 'passport') {
            const { familyName, givenNames } = update.data || {};
            if (familyName || givenNames) {
                applicantName = `${familyName || ''} ${givenNames || ''}`.trim();
            }
        }
    });
  }

  const submittedDate = application?.createdAt
    ? new Date(application.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
  const paidDate = application?.createdAt
    ? new Date(application.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  const receiptNo = `RCP-${(application?._id || "000000").slice(-8).toUpperCase()}`;

  const handlePrint = () => {
    if (printRef.current) {
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>Receipt - ${receiptNo}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; font-size: 12px; }
                @media print { body { padding: 0; } button { display: none !important; } }
              </style>
            </head>
            <body>${printRef.current.innerHTML}</body>
          </html>
        `);
        win.document.close();
        win.print();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-start justify-center overflow-y-auto py-8">
      <div className="w-full max-w-[750px] bg-white shadow-2xl border border-gray-300">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 bg-gray-100 border-b border-gray-300 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3 py-1 bg-white border border-gray-400 rounded text-sm text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
            >
              ← Back to Application
            </button>
            <span className="text-sm text-gray-500">Payment Receipt — {receiptNo}</span>
          </div>
          <button
            onClick={handlePrint}
            className="px-4 py-1 bg-[#00264d] text-white border-none rounded text-sm cursor-pointer hover:bg-[#003366] transition-colors flex items-center gap-1.5"
          >
            🖨 Print / Save PDF
          </button>
        </div>

        {/* Receipt Content */}
        <div ref={printRef} className="p-0">
          {/* Header */}
          <div className="bg-[#00264d] text-white px-6 py-5">
            <div className="text-center text-[11px] tracking-wider uppercase opacity-80 mb-1">
              Australian Government — Department of Home Affairs
            </div>
            <h1 className="text-xl font-bold text-center m-0">Payment Receipt</h1>
            <p className="text-center text-[12px] mt-1 opacity-80">
              Receipt No: {receiptNo} | Date Paid: {paidDate}
            </p>
          </div>

          {/* Status bar */}
          <div className="bg-[#e8f5e9] px-4 py-2 flex justify-between text-[12px] border-b border-gray-300">
            <span>
              <strong>Status:</strong> Payment Received
            </span>
            <span>
              <strong>Application ID:</strong> {application?._id || "—"}
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Transaction Details */}
            <div>
              <div className="bg-[#00264d] text-white font-bold text-[13px] px-3 py-1.5 mb-0">
                Transaction Details
              </div>
              <div className="border border-gray-200">
                {[
                  ["Receipt Number", receiptNo],
                  ["Transaction Reference Number (TRN)", trn],
                  ["Visa Category", visaCategory],
                  ["Application Submitted", submittedDate],
                  ["Payment Date", paidDate],
                  ["Payment Method", "Online Payment"],
                  ["Payment Status", "Paid"],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[240px_1fr] border-b border-gray-100 text-[12px]">
                    <div className="px-3 py-2 text-gray-600 bg-gray-50 border-r border-gray-200">{label}</div>
                    <div className="px-3 py-2 font-medium text-gray-900">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Applicant Details */}
            <div>
              <div className="bg-[#00264d] text-white font-bold text-[13px] px-3 py-1.5 mb-0">
                Applicant Details
              </div>
              <div className="border border-gray-200">
                {[
                  ["Full Name", applicantName],
                  ["Email Address", applicantEmail],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[240px_1fr] border-b border-gray-100 text-[12px]">
                    <div className="px-3 py-2 text-gray-600 bg-gray-50 border-r border-gray-200">{label}</div>
                    <div className="px-3 py-2 font-medium text-gray-900">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fee Breakdown */}
            <div>
              <div className="bg-[#00264d] text-white font-bold text-[13px] px-3 py-1.5 mb-0">
                Fee Breakdown
              </div>
              <div className="border border-gray-200">
                <div className="grid grid-cols-[1fr_140px] border-b border-gray-200 text-[12px] bg-gray-50">
                  <div className="px-3 py-2 font-semibold text-gray-700">Description</div>
                  <div className="px-3 py-2 font-semibold text-gray-700 text-right">Amount ({application?.currency || 'AUD'})</div>
                </div>
                <div className="grid grid-cols-[1fr_140px] border-b border-gray-100 text-[12px]">
                  <div className="px-3 py-2 text-gray-800">Visa Application Charge (VAC) — {visaCategory}</div>
                  <div className="px-3 py-2 text-gray-900 font-medium text-right">{application?.currency || 'AUD'} ${(application?.totalAmount || 145.00).toFixed(2)}</div>
                </div>
                <div className="grid grid-cols-[1fr_140px] border-b border-gray-100 text-[12px]">
                  <div className="px-3 py-2 text-gray-800">Processing Fee</div>
                  <div className="px-3 py-2 text-gray-900 font-medium text-right">$0.00</div>
                </div>
                <div className="grid grid-cols-[1fr_140px] text-[13px] font-bold border-t-2 border-[#00264d]">
                  <div className="px-3 py-2 text-[#00264d]">Total Paid</div>
                  <div className="px-3 py-2 text-[#00264d] text-right">{application?.currency || 'AUD'} ${(application?.totalAmount || 145.00).toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-2 border-t-2 border-[#00264d] px-6 py-4 text-center">
            <p className="text-[10px] text-gray-500 mb-1">
              This is an official payment receipt for the visa application submitted through the system.
            </p>
            <p className="text-[10px] text-gray-500 mb-1">
              Australian Government — Department of Home Affairs
            </p>
            <p className="text-[10px] text-gray-400">
              Generated on{" "}
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              | Receipt No: {receiptNo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
