import React, { useState } from "react";

import Barcode from "react-barcode";
import { ApplicationData } from "./types";
import { useResolveAdminRequestMutation } from "@/redux/api/applicationApi";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { TUser } from "@/redux/features/auth/authSlice";
import { useAlert } from "@/components/ui";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { TSiteSettings } from "@/types/settings";

export const BiometricsTab = ({
  application,
}: {
  application: ApplicationData;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const { data: siteResponse } = useGetSiteSettingsQuery({});
  const siteSettings = (siteResponse?.data ?? {
    siteName: "ImmiAccount",
    brandName: "Australian Government",
    departmentName: "Department of Home Affairs",
  }) as TSiteSettings;

  const brandPrefix = siteSettings.brandName.split(" ")[0];

  const [resolveRequest, { isLoading: isResolving }] = useResolveAdminRequestMutation();
  const { showConfirm } = useAlert();
  const user = useAppSelector((state) => state.auth.user) as TUser | null;
  const isAdmin = user?.role === "admin" || user?.role === "superAdmin";
  
  const activeBiometricRequest = application.adminRequests?.find(
    r => r.type === 'BIOMETRIC' && r.status === 'PENDING'
  ) || (application.adminRequests || [])
    .filter(r => r.type === 'BIOMETRIC')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const handleResolve = async () => {
    if (!activeBiometricRequest || activeBiometricRequest.status === 'RESOLVED') return;

    const confirmed = await showConfirm({
      title: "Confirm Biometrics",
      message: "Are you sure you want to mark biometrics as completed for this applicant?",
      confirmLabel: "Yes, Confirm",
      cancelLabel: "Cancel",
      type: "info"
    });

    if (!confirmed) return;

    try {
      await resolveRequest({ 
        id: application._id, 
        requestId: (activeBiometricRequest as unknown as { _id: string })._id 
      }).unwrap();
      toast.success("Biometric requirement marked as completed");
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="font-sans animate-in fade-in duration-500 text-[#333]">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-[#2150a0] text-[18px] font-normal flex items-center gap-1.5">
          Biometrics collection
          <div className="bg-[#00264d] text-white rounded-full w-[14px] h-[14px] text-[10px] flex items-center justify-center font-bold">?</div>
        </h2>
      </div>

      <div className="text-[12px] mb-4 space-y-3">
        <p>Applicants may be required to provide personal identifiers, or biometrics, in support of their application.</p>
        <p>These can include:</p>
        <ul className="list-disc pl-5 my-[5px]">
          <li>A photograph of the applicant&apos;s head and shoulders</li>
          <li>Fingerprints collected at a {brandPrefix} Biometrics Collection Centre</li>
        </ul>
        <p>
          For further information on <a href="#" className="text-[#cc33cc] underline">Biometrics collection</a> review the details on the {siteSettings.departmentName}&apos;s website.
        </p>
      </div>

      <div 
        className={`border-t-2 border-[#ff9933] bg-white mb-[15px] ${
          isExpanded ? "border-b border-l border-r border-[#ccc]" : "border-none"
        }`}
      >
        <div 
          className={`p-2 px-2.5 flex items-start gap-2.5 bg-[#f8f8f8] ${
            isExpanded ? "border-b border-[#ccc]" : "border-none"
          }`}
        >
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-[14px] font-bold text-[#333] bg-transparent border-none cursor-pointer px-[5px]">
            {isExpanded ? "-" : "+"}
          </button>
          <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="text-[#2150a0] text-[13px]">
              <span className="uppercase">{application.clientId?.name || "APPLICANT"}</span>
              <span>{application.clientId?.dateOfBirth ? ` (${new Date(application.clientId.dateOfBirth).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })})` : ""}</span>
            </div>
            <div className={`text-[12px] mt-0.5 text-[#333] ${isExpanded ? "mb-0" : "mb-2"}`}>
              Attend {brandPrefix === "Australian" ? "an" : "a"} {brandPrefix} Biometrics Collection Centre
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-[15px] text-[12px] text-[#333] leading-normal">
            <p className="m-0 mb-[5px]">The applicant is required to attend {brandPrefix === "Australian" ? "an" : "a"} {brandPrefix} Biometrics Collection Centre.</p>
            <p className="m-0 mb-[5px]">The applicant will need to make an appointment to attend {brandPrefix === "Australian" ? "an" : "a"} {brandPrefix} Biometrics Collection Centre in person to provide personal identifiers.</p>
            <p className="m-0 mb-2.5">Information about the nearest Biometrics Collection Centre is available on our website <a href="#" className="text-[#cc33cc] underline">Biometrics collection</a>.</p>
            
            <p className="m-0 mb-[5px]">When attending {brandPrefix === "Australian" ? "an" : "a"} {brandPrefix} Biometrics Collection Centre in person, applicants need to bring:</p>
            <ul className="list-disc pl-5 m-0 mb-[15px]">
              <li>Visa Lodgement Number (see below)</li>
              <li>Passport</li>
              <li>An electronic or paper copy of the letter: s257A Requirement to Provide Biometrics. See the Messages tab.</li>
            </ul>

            {/* Table */}
            <div className="border border-[#999] mt-2.5">
              <div className="bg-[#666] text-white flex text-[13px] font-bold">
                <div className="flex-1 p-[5px] px-2.5 border-r border-[#999]">
                  Visa Lodgement Number (VLN)
                </div>
                <div className="flex-1 p-[5px] px-2.5 text-center">
                  VLN barcode
                </div>
              </div>
              <div className="flex bg-white items-center">
                <div className="flex-1 p-2.5 text-[#2150a0] text-[12px] self-start">
                  {application.vln ? application.vln : "PENDING"}
                </div>
                <div className="flex-1 p-2.5 flex flex-col items-center justify-center">
                  {application.vln ? (
                    <Barcode 
                      value={application.vln} 
                      format="CODE128"
                      width={1.5}
                      height={40}
                      fontSize={14}
                      margin={0}
                      background="transparent"
                    />
                  ) : (
                    <span className="text-gray-400 italic text-sm">Waiting for TRN...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {activeBiometricRequest?.status === 'PENDING' && isAdmin && (
        <div className="text-right mt-5">
          <button 
           onClick={handleResolve}
           disabled={isResolving}
           className="bg-[#2150a0] text-white border-none py-1.5 px-[15px] text-[12px] cursor-pointer"
          >
            {isResolving ? "Confirming..." : "Confirm Biometrics Completion"}
          </button>
        </div>
      )}
    </div>
  );
};
