"use client";

import {
  useGetSingleApplicationQuery,
  useUpdateApplicationStatusMutation,
} from "@/redux/api/applicationApi";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ApplicationPdfView } from "@/components/application/ApplicationPdfView";
import { useAppSelector } from "@/redux/hooks";
import { TUser } from "@/redux/features/auth/authSlice";
import { useAlert } from "@/components/ui";
import NextLink from "next/link";

// Modular Components
import { HomeTab } from "./components/HomeTab";
import { MessagesTab } from "./components/MessagesTab";
import { UpdateDetailsTab } from "./components/UpdateDetailsTab";
import { AttachmentsTab } from "./components/AttachmentsTab";
import { BiometricsTab } from "./components/BiometricsTab";
import { HealthAssessmentTab } from "./components/HealthAssessmentTab";

import {
  Home,
  MessageSquare,
  Edit3,
  Paperclip,
  Fingerprint,
  Activity,
  AlertCircle,
  ChevronLeft,
  Loader2,
} from "lucide-react";

export default function ApplicationDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const { data, isLoading } = useGetSingleApplicationQuery(id);
  const application = data?.data;
  const user = useAppSelector((state) => state.auth.user) as TUser | null;
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "home");
  const [activeUpdateForm, setActiveUpdateForm] = useState<string | null>(null);
  const [showPdfView, setShowPdfView] = useState(false);
  const [updateStatus, { isLoading: isStatusUpdating }] = useUpdateApplicationStatusMutation();
  const { showAlert, showPrompt } = useAlert();

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    let remarks = "";
    if (["REJECTED", "GRANTED", "REFUSED"].includes(newStatus)) {
      const reason = await showPrompt({
        title: "Reason Required",
        message: `Please provide a reason for marking this application as ${newStatus.replace("_", " ")}.`,
        placeholder: "Enter details here...",
        confirmLabel: "Apply Status",
      });
      if (reason === null) return;
      remarks = reason;
    }
    try {
      await updateStatus({ id, status: newStatus, remarks }).unwrap();
      showAlert({ title: "Status Updated", message: `Status updated to ${newStatus}`, type: "success" });
    } catch (err: unknown) {
      showAlert({ title: "Update Failed", message: "Failed to update status", type: "error" });
      console.error(err);
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setActiveUpdateForm(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin text-blue-500" />
          <p className="text-sm text-gray-400">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-gray-500">Application not found.</p>
        <NextLink href="/applications" className="mt-3 text-sm text-blue-600 hover:underline">
          ← Back to Applications
        </NextLink>
      </div>
    );
  }

  const hasPendingRequests = (type: string) =>
    application.adminRequests?.some((r: { type: string; status: string }) => r.type === type && r.status === "PENDING");

  const TABS = [
    { id: "home", label: "Overview", icon: Home, showBadge: application.adminRequests?.some((r: { status: string }) => r.status === "PENDING") },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "update", label: "Update Details", icon: Edit3 },
    { id: "attachments", label: "Attachments", icon: Paperclip, showBadge: hasPendingRequests("ATTACH_DOCUMENT") },
    ...(application.adminRequests?.some((r: { type: string }) => r.type === "BIOMETRIC")
      ? [{ id: "biometrics", label: "Biometrics", icon: Fingerprint, showBadge: hasPendingRequests("BIOMETRIC") }]
      : []),
    { id: "health", label: "Health", icon: Activity },
  ];

  const statusColorMap: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-600 border-gray-200",
    SUBMITTED: "bg-blue-50 text-blue-600 border-blue-100",
    UNDER_REVIEW: "bg-indigo-50 text-indigo-600 border-indigo-100",
    PROCESSING: "bg-purple-50 text-purple-600 border-purple-100",
    PAYMENT_PENDING: "bg-amber-50 text-amber-600 border-amber-100",
    PAID: "bg-emerald-50 text-emerald-600 border-emerald-100",
    APPROVED: "bg-green-50 text-green-600 border-green-100",
    GRANTED: "bg-green-50 text-green-600 border-green-100",
    REJECTED: "bg-rose-50 text-rose-600 border-rose-100",
    REFUSED: "bg-rose-50 text-rose-600 border-rose-100",
  };
  const statusCls = statusColorMap[application.status] ?? "bg-gray-100 text-gray-500 border-gray-200";

  return (
    <>
      <div className="space-y-4">
        {/* Breadcrumb + Page Header */}
        <div>
          <NextLink href="/applications" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 transition-colors mb-3 w-fit">
            <ChevronLeft size={14} /> Back to Applications
          </NextLink>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {application.clientId?.name || application.email || "Application Detail"}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusCls}`}>
                  {application.status?.replace(/_/g, " ")}
                </span>
                <span className="text-xs text-gray-400">{application.visaCategory || "Visa Application"}</span>
                {application.trn && (
                  <span className="text-xs text-gray-400">· Ref: <span className="font-medium text-gray-600">{application.trn}</span></span>
                )}
              </div>
            </div>

            {/* Admin: status selector */}
            {(user?.role === "admin" || user?.role === "superAdmin") && (
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 shrink-0">Update Status:</label>
                <select
                  value={application.status}
                  onChange={handleStatusChange}
                  disabled={isStatusUpdating}
                  className="px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg outline-none focus:border-blue-400 bg-white disabled:opacity-60"
                >
                  {["DRAFT","SUBMITTED","PAYMENT_PENDING","PAID","UNDER_REVIEW","PROCESSING","APPROVED","REJECTED","GRANTED","REFUSED"].map(s => (
                    <option key={s} value={s}>{s.replace(/_/g," ")}</option>
                  ))}
                </select>
                {isStatusUpdating && <Loader2 size={15} className="animate-spin text-blue-500" />}
              </div>
            )}
          </div>
        </div>

        {/* Horizontal Tab Bar */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex min-w-max px-4">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`relative flex items-center gap-2 px-4 py-3.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
                      isActive
                        ? "border-blue-600 text-blue-600 font-semibold"
                        : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                    }`}
                  >
                    <Icon size={15} className="shrink-0" />
                    {tab.label}
                    {tab.showBadge && (
                      <span className="absolute top-2 right-1 w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-5 sm:p-6">
            {activeTab === "home" && (
              <HomeTab
                application={application}
                user={user}
                handleStatusChange={handleStatusChange}
                isStatusUpdating={isStatusUpdating}
              />
            )}
            {activeTab === "messages" && <MessagesTab applicationId={id} />}
            {activeTab === "update" && (
              <UpdateDetailsTab
                activeUpdateForm={activeUpdateForm}
                setActiveUpdateForm={setActiveUpdateForm}
                application={application}
                id={id}
              />
            )}
            {activeTab === "attachments" && <AttachmentsTab application={application} />}
            {activeTab === "biometrics" && <BiometricsTab application={application} />}
            {activeTab === "health" && <HealthAssessmentTab application={application} />}
          </div>
        </div>
      </div>

      {showPdfView && (
        <ApplicationPdfView application={application} onClose={() => setShowPdfView(false)} />
      )}
    </>
  );
}
