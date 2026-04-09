import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { TUser } from "@/redux/features/auth/authSlice";
import { ApplicationData } from "./types";
import { Edit3, Save, X, Loader2 } from "lucide-react";
import { useUpdateTRNMutation } from "@/redux/api/applicationApi";
import { toast } from "sonner";
import { ApplicationPdfView } from "@/components/application/ApplicationPdfView";
import { ReceiptPdfView } from "@/components/application/ReceiptPdfView";
import { useGetInvoicesQuery, useCreateInvoiceMutation } from "@/redux/api/invoiceApi";
import { DollarSign, FilePlus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { TSiteSettings } from "@/types/settings";

interface HomeTabProps {
  application: ApplicationData;
  user: TUser | null;
  handleStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isStatusUpdating: boolean;
}

export const HomeTab = ({
  application,
  user,
  handleStatusChange,
  isStatusUpdating,
}: HomeTabProps) => {
  const [showImportantInfo, setShowImportantInfo] = useState(true);
  const [showProcessingInfo, setShowProcessingInfo] = useState(false);
  const [isEditingTrn, setIsEditingTrn] = useState(false);
  const [newTrn, setNewTrn] = useState(application.trn || "");
  const [showPdfView, setShowPdfView] = useState(false);
  const [showReceiptView, setShowReceiptView] = useState(false);

  const [updateTrn, { isLoading: isTrnUpdating }] = useUpdateTRNMutation();
  const [createInvoice, { isLoading: isCreatingInvoice }] = useCreateInvoiceMutation();
  const { data: invoicesData } = useGetInvoicesQuery({ applicationId: application._id });

  const { data: siteResponse } = useGetSiteSettingsQuery({});
  const siteSettings = (siteResponse?.data ?? {
    siteName: "ImmiAccount",
    brandName: "Australian Government",
    departmentName: "Department of Home Affairs",
  }) as TSiteSettings;

  const handleCreateInvoice = async () => {
    try {
      await createInvoice({
        applicationId: application._id,
        agentId: application.createdByAgentId,
        amount: application.totalAmount || 145.00,
        description: `Visa Application Fee - ${application.visaCategory || 'Visa'}`
      }).unwrap();
      toast.success("Invoice generated successfully");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to generate invoice");
    }
  };

  const handleUpdateTrn = async () => {
    try {
      await updateTrn({ id: application._id, trn: newTrn }).unwrap();
      toast.success("TRN updated successfully");
      setIsEditingTrn(false);
    } catch {
      toast.error("Failed to update TRN");
    }
  };

  const isAdmin = user?.role === "admin" || user?.role === "superAdmin";

  return (
    <div className="text-gray-800">
      {/* TRN Editor (admin only) */}
      {isAdmin && (
        <div className="flex items-center gap-2 mb-5 p-3 bg-gray-50 border border-gray-100 rounded-lg">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">TRN Ref:</span>
          {isEditingTrn ? (
            <div className="flex items-center gap-1.5">
              <input
                value={newTrn}
                onChange={(e) => setNewTrn(e.target.value)}
                className="text-sm px-2 py-1 border border-blue-300 rounded-lg outline-none text-gray-900 bg-white w-32"
                placeholder="Enter TRN"
              />
              <button onClick={handleUpdateTrn} disabled={isTrnUpdating} className="text-green-600 hover:text-green-700 p-1">
                {isTrnUpdating ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              </button>
              <button onClick={() => setIsEditingTrn(false)} className="text-rose-500 hover:text-rose-700 p-1">
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-700">{application.trn || "PENDING"}</span>
              <button onClick={() => setIsEditingTrn(true)} className="text-gray-400 hover:text-blue-600 transition-colors">
                <Edit3 size={13} />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mb-[15px]">
        <h3 className="text-[12px] font-bold mb-1.5">Applicants</h3>
        <ul className="list-none ml-[15px] text-[12px] p-0">
          <li className="flex items-center gap-[5px]">
            <span className="text-[10px]">•</span>
            {application.clientId?.name} (
            {application.clientId?.dateOfBirth ? (
              new Date(application.clientId.dateOfBirth).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            ) : "N/A"}
            ) -{" "}
            {application.status.charAt(0).toUpperCase() +
              application.status.slice(1).toLowerCase().replace(/_/g, " ")}
          </li>
        </ul>
      </div>

      {application.totalAmount && (
        <div className="mb-5 p-2.5 bg-[#f8f9fa] border border-[#dee2e6] rounded">
          <h4 className="text-[12px] font-bold m-0 mb-2 border-b border-[#eee] pb-1">Fee Breakdown</h4>
          <div className="flex flex-col gap-1">
             {application.feeBreakdown?.map((item: { label: string; amount: number }, idx: number) => (
                <div key={idx} className="flex justify-between text-[11px] text-[#666]">
                   <span>{item.label}</span>
                   <span>{item.amount.toFixed(2)} AUD</span>
                </div>
             ))}
             <div className="flex justify-between text-[12px] font-bold text-[#333] border-t border-[#ddd] mt-1 pt-1">
                <span>Total Amount</span>
                <span>{application.totalAmount.toFixed(2)} AUD</span>
             </div>
          </div>
        </div>
      )}

      <div className="mb-5 flex gap-2 items-start">
        <div className="bg-[#cc3300] text-white rounded-full w-[14px] h-[14px] text-[10px] flex items-center justify-center font-bold mt-[2px]">
          !
        </div>

        <div className="flex-1">
          <div 
            onClick={() => setShowImportantInfo(!showImportantInfo)}
            className="flex items-center justify-between cursor-pointer"
          >
            <h4 className="m-0 text-[12px] font-bold text-[#2150a0] hover:underline">
              Important information
            </h4>
            {showImportantInfo ? <ChevronDown size={14} color="#2150a0" /> : <ChevronRight size={14} color="#2150a0" />}
          </div>
          
          {showImportantInfo && (
            <div className="mt-[5px]">
              <p className="text-[12px] m-0.5 mt-0">
                This application status is {application.status.toLowerCase().replace(/_/g, " ")}. {application.status === 'DRAFT' ? 'You can continue editing this application by clicking the button below.' : 'Please refer to messages.'}
              </p>
              {application.status === 'DRAFT' && (
                <button
                  onClick={() => (window.location.href = `/applications/new?id=${application._id}`)}
                  className="mt-2 py-[4px] px-3 bg-[#2150a0] color-white border-none rounded-[3px] text-[11px] font-bold cursor-pointer transition-colors"
                  style={{ color: 'white' }}
                >
                  Continue Editing Application →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6 border-b border-[#eee] pb-2.5">
        <div 
          onClick={() => setShowProcessingInfo(!showProcessingInfo)}
          className={`flex items-center justify-between cursor-pointer ${showProcessingInfo ? 'mb-2' : 'mb-0'}`}
        >
          <h4 className="text-[14px] font-bold text-[#2150a0] hover:underline m-0">
            How long will processing take?
          </h4>
          {showProcessingInfo ? <ChevronDown size={18} color="#2150a0" /> : <ChevronRight size={18} color="#2150a0" />}
        </div>

        {showProcessingInfo && (
          <div className="mt-[5px]">
            <p className="text-[13px] text-[#333] m-0 mb-2.5">
              Processing times vary based on volume, complexity and completeness of
              applications. To minimise processing times, submit a complete
              application with all supporting documents and respond promptly to
              requests for information.
            </p>
            <p className="text-[13px] m-0">
              Check updated processing times at the {siteSettings.departmentName}&apos;s{" "}
              <a 
                href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times/global-visa-processing-times" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#2150a0] underline"
              >
                Global processing times portal
              </a>
              .
            </p>
          </div>
        )}
      </div>

      {/* Application History */}
      <div className="mb-5 overflow-x-auto">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Application history
        </h3>
        <table className="w-full border-collapse text-sm min-w-[500px]">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="text-left py-2 px-3 font-medium text-xs">Type</th>
              <th className="text-left py-2 px-3 font-medium text-xs">Date</th>
              <th className="text-left py-2 px-3 font-medium text-xs">Updated By</th>
              <th className="text-left py-2 px-3 font-medium text-xs">Action</th>
            </tr>
          </thead>
          <tbody>
            {((): React.ReactNode[] => {
              interface HistoryEntry {
                type: string;
                date?: string;
                action: string | null;
                onClick: (() => void) | null;
                remarks?: string;
                updatedBy?: { name: string; role: string };
              }
              const entries: HistoryEntry[] = [];

              // 1. Initial Submission
              if (application.status !== "DRAFT") {
                const subEntry = application.statusHistory?.find(h => h.status === "SUBMITTED");
                const subDate = subEntry?.updatedAt || application.createdAt;
                entries.push({
                  type: "Application submitted",
                  date: subDate,
                  action: "View application",
                  onClick: () => setShowPdfView(true),
                  updatedBy: subEntry?.updatedBy,
                });
              }

              // 2. Fee Paid
              if (application.paymentId) {
                // Use updatedAt or createdAt as fallback for payment date
                const paidEntry = application.statusHistory?.find(h => h.status === "PAID");
                entries.push({
                  type: "Application fee paid",
                  date: paidEntry?.updatedAt || application.updatedAt || application.createdAt,
                  action: "View receipt",
                  onClick: () => setShowReceiptView(true),
                  updatedBy: paidEntry?.updatedBy,
                });
              }

              // 3. Other status history entries
              if (application.statusHistory) {
                application.statusHistory.forEach((h) => {
                  if (h.status !== "SUBMITTED" && h.status !== "DRAFT" && h.status !== "PAID") {
                    entries.push({
                      type: `Status updated to ${h.status.replace("_", " ").toLowerCase()}`,
                      remarks: h.remarks,
                      date: h.updatedAt,
                      action: null,
                      onClick: null,
                      updatedBy: h.updatedBy,
                    });
                  }
                });
              }

              // Sort entries by date (chronological)
              entries.sort((a, b) => {
                const dateA = a.date ? new Date(a.date).getTime() : 0;
                const dateB = b.date ? new Date(b.date).getTime() : 0;
                return dateA - dateB;
              });

              return entries.map((entry, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-[#f4f7f9]" : "bg-white"}>
                  <td className="py-2 px-2.5 border-b border-[#eee] text-[#333]">
                    <div>{entry.type}</div>
                    {entry.remarks && (
                      <div className="text-[10px] text-[#666] italic mt-0.5">
                        Reason: {entry.remarks}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-2.5 border-b border-[#eee] text-[#333]">
                    {entry.date ? new Date(entry.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }) + " " + new Date(entry.date).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit"
                    }) : "-"}
                  </td>
                  <td className="py-2 px-2.5 border-b border-[#eee] text-[#333]">
                    {entry.updatedBy ? (
                      <div>
                        {entry.updatedBy.name}
                        <div className="text-[9px] text-[#888]">{entry.updatedBy.role}</div>
                      </div>
                    ) : "-"}
                  </td>
                  <td className="py-2 px-2.5 border-b border-[#eee]">
                    {entry.action && (
                      <button
                        onClick={entry.onClick || undefined}
                        className="text-[#2150a0] no-underline bg-transparent border-none cursor-pointer text-[12px] p-0 hover:underline"
                      >
                        {entry.action}
                      </button>
                    )}
                  </td>
                </tr>
              ));
            })()}
            {/* If no history, show placeholder or nothing */}
            {application.status === "DRAFT" && !application.paymentId && (
              <tr>
                <td colSpan={4} className="p-5 text-center text-[#999] border-b border-[#eee]">
                  No history available for this draft application.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Admin Billing Management */}
      {isAdmin && (
        <div className="mt-[30px] p-[15px] bg-[#f8fafc] border border-[#e2e8f0] rounded">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
            <h3 className="text-[13px] font-bold text-[#00264d] flex items-center gap-2 m-0">
               <DollarSign size={16} />
               Invoices & Billing
            </h3>
            <Button 
               onClick={handleCreateInvoice} 
               isLoading={isCreatingInvoice}
               className="h-8 px-3 text-[11px] bg-green-600 hover:bg-green-700 font-bold w-full sm:w-auto"
            >
               <FilePlus size={14} className="mr-1.5" />
               Generate New Invoice
            </Button>
          </div>

          <div className="space-y-2">
            {/* Main Payment Record for Admin */}
            {application.paymentId && (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-sm mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Online Payment Record</p>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#00264d]">{application.paymentId}</span>
                      <span className="px-2 py-0.5 bg-green-600 text-white rounded text-[9px] font-black uppercase">PAID</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gateway</p>
                    <span className="text-xs font-bold text-gray-700 uppercase">{invoicesData?.data?.result?.find((i: { status: string; paymentMethod?: string }) => i.status === 'paid')?.paymentMethod || "Direct / Online"}</span>
                  </div>
                </div>
              </div>
            )}

            {invoicesData?.data?.result?.length > 0 ? (
              invoicesData.data.result.map((inv: { _id: string; invoiceNumber: string; amount: number; status: string }) => (
                <div key={inv._id} className="bg-white border border-gray-200 p-2.5 flex flex-col sm:flex-row justify-between sm:items-center rounded-sm gap-2">
                  <div className="flex flex-wrap gap-4 items-center">
                    <span className="font-mono text-[11px] font-bold text-[#2150a0]">{inv.invoiceNumber}</span>
                    <span className="text-[11px] font-bold text-gray-700">${inv.amount.toFixed(2)} AUD</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {inv.status}
                    </span>
                  </div>
                  <div className="flex gap-2 self-end sm:self-center">
                    <button 
                      onClick={() => setShowReceiptView(true)} 
                      className="text-[10px] flex items-center gap-1 text-gray-500 hover:text-blue-600 font-bold bg-transparent border-none cursor-pointer"
                    >
                      <ExternalLink size={12} /> View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-gray-400 italic text-center py-4 bg-white border border-dashed border-gray-200">
                No invoices have been generated for this application yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 
        Removed Admin Requests Display and Form logic 
        as this is now handled in other specific tabs 
      */}

      {showPdfView && (
        <ApplicationPdfView application={application} onClose={() => setShowPdfView(false)} />
      )}

      {showReceiptView && (
        <ReceiptPdfView application={application} onClose={() => setShowReceiptView(false)} />
      )}
    </div>
  );
};
