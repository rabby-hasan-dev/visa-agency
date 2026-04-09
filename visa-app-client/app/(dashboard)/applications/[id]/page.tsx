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

// Modular Components
import { SidebarMenu } from "./components/SidebarMenu";
import { HomeTab } from "./components/HomeTab";
import { MessagesTab } from "./components/MessagesTab";
import { UpdateDetailsTab } from "./components/UpdateDetailsTab";
import { AttachmentsTab } from "./components/AttachmentsTab";
import { BiometricsTab } from "./components/BiometricsTab";
import { HealthAssessmentTab } from "./components/HealthAssessmentTab";

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
  const [updateStatus, { isLoading: isStatusUpdating }] =
    useUpdateApplicationStatusMutation();
  const { showAlert, showPrompt } = useAlert();

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newStatus = e.target.value;
    let remarks = "";

    if (["REJECTED", "GRANTED", "REFUSED"].includes(newStatus)) {
      const reason = await showPrompt({
        title: "Reason Required",
        message: `Please provide a reason for marking this application as ${newStatus.replace("_", " ")}.`,
        placeholder: "Enter details here...",
        confirmLabel: "Apply Status",
      });
      
      if (reason === null) return; // User cancelled
      remarks = reason;
    }

    try {
      await updateStatus({ id, status: newStatus, remarks }).unwrap();
      showAlert({
        title: "Status Updated",
        message: `Application status updated to ${newStatus} successfully`,
        type: "success",
      });
    } catch (err: unknown) {
      showAlert({
        title: "Update Failed",
        message: "Failed to update status",
        type: "error",
      });
      console.error(err);
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setActiveUpdateForm(null);
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!application) return <div className="p-8">Application not found.</div>;

  const mainContent = (
    <div className="bg-[#f0f2f5] min-h-screen pb-10">
      <div className="bg-[#00264d] min-h-[32px] py-1.5 md:py-0 flex flex-wrap items-center justify-between px-2.5 text-white text-[11px] sm:text-[13px] font-bold gap-2">
        <div className="flex-1 min-w-0 truncate">
          Application for a {application.visaCategory || "visa"} Reference Number:{" "}
          <span className="font-bold">{application.trn || "PENDING"}</span>
        </div>
        <div className="flex gap-2.5 items-center shrink-0">
          <span className="cursor-pointer text-base">⎙</span>
          <span className="cursor-pointer text-base">?</span>
        </div>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-6 p-4 sm:p-5">
        <SidebarMenu activeTab={activeTab} setActiveTab={handleTabChange} application={application} />

        <div className="flex-1">
          <div className="bg-white border border-[#ddd] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
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

            {activeTab === "attachments" && (
              <AttachmentsTab application={application} />
            )}

            {activeTab === "biometrics" && (
              <BiometricsTab application={application} />
            )}

            {activeTab === "health" && (
              <HealthAssessmentTab application={application} />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {mainContent}
      {showPdfView && (
        <ApplicationPdfView
          application={application}
          onClose={() => setShowPdfView(false)}
        />
      )}
    </>
  );
}
