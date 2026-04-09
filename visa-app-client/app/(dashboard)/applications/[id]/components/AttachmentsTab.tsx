import React, { useState } from "react";
import { ApplicationData } from "./types";
import { useGetQuestionsQuery } from "@/redux/api/questionApi";
import { useUploadDocumentMutation } from "@/redux/api/documentApi";
import { useAddDocumentsMutation, useRemoveDocumentMutation } from "@/redux/api/applicationApi";
import { TQuestion } from "@/types/visaTypes";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export const AttachmentsTab = ({
  application,
}: {
  application: ApplicationData;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [customDocumentTypes, setCustomDocumentTypes] = useState<Record<string, string>>({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [documentUrlToRemove, setDocumentUrlToRemove] = useState<string | null>(null);

  const handleDocumentTypeChange = (id: string, value: string) => {
    setCustomDocumentTypes(prev => ({ ...prev, [id]: value }));
  };

  const handleDescriptionChange = (id: string, value: string) => {
    setDescriptions(prev => ({ ...prev, [id]: value }));
  };

  const getIsExpanded = (id: string) => expandedSections[id] !== false;

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !getIsExpanded(id) }));
  };

  const { data: questionsData, isLoading: isQuestionsLoading } = useGetQuestionsQuery(
    { visaTypeId: application.visaTypeId },
    { skip: !application.visaTypeId }
  );

  const [uploadDocument] = useUploadDocumentMutation();
  const [addDocuments] = useAddDocumentsMutation();
  const [removeDocument] = useRemoveDocumentMutation();

  const questions = (questionsData?.data?.result || []) as TQuestion[];
  let fileQuestions = questions.filter((q) => q.fieldType === "file");

  // MOCK required documents for Visa checklist visual parity
  const mockRequiredDocs = [
    { _id: "mock-1", label: "Evidence of current employment or self-employment" },
    { _id: "mock-2", label: "Visa for country of residence (and right to return)" },
    { _id: "mock-3", label: "Travel history, Evidence of" },
    { _id: "mock-4", label: "Travel Document" },
    { _id: "mock-5", label: "Photograph - Passport" },
    { _id: "mock-6", label: "Onward Booking from Australia, Evidence of" },
    { _id: "mock-7", label: "Documentation to Enter Destination Country, Evidence of" }
  ];

  // If no dynamic file questions came back, use the static mock array for presentation.
  // Otherwise we merge them if necessary, but here we just replace them for the view.
  if (fileQuestions.length === 0) {
    fileQuestions = mockRequiredDocs as TQuestion[];
  }

  // Label-specific document type options for the dropdown
  const DOCUMENT_TYPE_OPTIONS: Record<string, string[]> = {
    "Evidence of current employment or self-employment": [
      "Employment Letter",
      "Payslips (last 3 months)",
      "Tax Return / NOA",
      "Business Registration Certificate",
      "ABN/ACN Documentation",
      "Contract of Employment",
      "Employer Statutory Declaration",
    ],
    "Visa for country of residence (and right to return)": [
      "Current Residence Visa",
      "Permanent Residence Permit",
      "Re-Entry Permit",
      "Temporary Visa with Re-Entry Rights",
      "Green Card / Settlement Document",
    ],
    "Travel history, Evidence of": [
      "Previous Passport with Stamps",
      "Previous Visa Labels",
      "Travel Itinerary",
      "Boarding Passes",
      "Hotel / Accommodation Records",
    ],
    "Travel Document": [
      "International Passport",
      "Emergency Travel Document",
      "Certificate of Identity",
      "Titre de Voyage",
      "Convention Travel Document",
    ],
    "Photograph - Passport": [
      "Passport Photo (Physical)",
      "Digital Passport Photo",
    ],
    "Onward Booking from Australia, Evidence of": [
      "Return Flight Ticket",
      "Onward Flight Booking Confirmation",
      "Cruise / Ship Booking",
      "Travel Itinerary",
    ],
    "Documentation to Enter Destination Country, Evidence of": [
      "Destination Country Visa",
      "Entry Permit",
      "Invitation Letter",
      "Electronic Travel Authority (ETA)",
      "Visa on Arrival Confirmation",
    ],
  };

  const getDocumentTypeOptions = (q: TQuestion): string[] => {
    if (q.options && q.options.length > 0) {
      return q.options.map(o => o.label);
    }
    return DOCUMENT_TYPE_OPTIONS[q.label] || [q.label, "Other (specify)"];
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionId: string, documentType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    setIsUploading(true);
    const toastId = toast.loading("Uploading document...");

    try {
      const uploadResult = await uploadDocument(uploadFormData).unwrap();
      
      if (uploadResult?.success) {
        const newDoc = {
          url: uploadResult.data.url,
          originalName: file.name,
          documentType: customDocumentTypes[sectionId] || documentType || "Other",
          description: descriptions[sectionId] || "",
        };

        await addDocuments({
          id: application._id,
          documents: [newDoc]
        }).unwrap();

        toast.success("Document uploaded and attached successfully", { id: toastId });
        setDescriptions(prev => ({ ...prev, [sectionId]: "" }));
        setCustomDocumentTypes(prev => {
          const next = { ...prev };
          delete next[sectionId];
          return next;
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload document", { id: toastId });
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleRemoveButtonClick = (documentUrl: string) => {
    setDocumentUrlToRemove(documentUrl);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!documentUrlToRemove) return;

    setIsRemoving(documentUrlToRemove);
    const toastId = toast.loading("Removing document...");

    try {
      await removeDocument({
        id: application._id,
        documentUrl: documentUrlToRemove
      }).unwrap();
      toast.success("Document removed successfully", { id: toastId });
    } catch (error) {
      console.error("Remove error:", error);
      toast.error("Failed to remove document", { id: toastId });
    } finally {
      setIsRemoving(null);
      setIsConfirmModalOpen(false);
      setDocumentUrlToRemove(null);
    }
  };

  const expandAll = () => setExpandedSections({});

  const collapseAll = () => {
    const allIds: string[] = [];
    fileQuestions.forEach(q => allIds.push(q._id));
    allIds.push("additional");

    const newState: Record<string, boolean> = {};
    allIds.forEach(id => (newState[id] = false));
    setExpandedSections(newState);
  };

  if (isQuestionsLoading) return <div className="p-10 text-center text-sm text-gray-500">Loading document checklist...</div>;

  return (
    <div className="animate-in fade-in duration-500 font-sans text-[#333]">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[#2150a0] text-[18px] font-normal flex items-center gap-1.5">
          Attach documents
        </h2>
      </div>

      <div className="text-[12px] mb-4 space-y-1">
        <p>
          Refer to the{" "}
          <a
            href="#"
            className="text-[#2150a0] underline"
          >
            checklist of documents
          </a>{" "}
          for more information about what to attach.
        </p>
        <p>
          There are specific{" "}
          <a
            href="#"
            className="text-[#2150a0] underline"
          >
            quality and formatting
          </a>{" "}
          requirements when scanning documents.
        </p>
        <div className="mt-3 flex gap-3 text-[#2150a0] text-[11px] font-bold">
          <button onClick={expandAll} className="flex items-center gap-1 focus:outline-none"><span className="text-sm shadow-sm border border-gray-400 px-1 bg-gray-100 mt-[-2px]">+</span> Expand all</button>
          <button onClick={collapseAll} className="flex items-center gap-1 focus:outline-none"><span className="text-sm shadow-sm border border-gray-400 px-1.5 bg-gray-100 mt-[-2px]">-</span> Collapse all</button>
        </div>
      </div>

      {/* Applicant Header */}
      <div className="border-t-2 border-[#ff9933] border-b border-[#ddd] mb-[15px]">
        <div className="py-2 flex items-start gap-2.5">
          <span className="text-[14px] font-bold">-</span>
          <div>
            <div className="text-[#2150a0] text-[13px]">
              <span className="uppercase">{application.clientId?.name || "APPLICANT"}</span>
              <span>{application.clientId?.dateOfBirth ? ` (${new Date(application.clientId.dateOfBirth).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })})` : ""}</span>
            </div>
            <div className="text-[11px] mt-1 font-bold">
              {application.documents?.length || 0} attachments received of 60 maximum.
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      {fileQuestions.length > 0 && (
        <div className="mb-6">
          <div className="text-[#2150a0] text-[13px] font-normal mb-1">Required</div>
          
          {fileQuestions.map((q) => {
            const options = getDocumentTypeOptions(q);
            const receivedDocs = (application.documents || []).filter(doc => 
              doc.documentType === q.label || options.includes(doc.documentType || "")
            );
            const isReceived = receivedDocs.length > 0;
            const isExpanded = getIsExpanded(q._id);

            return (
              <div key={q._id} className="border-t-2 border-[#ff9933] border-b border-[#ddd] py-2 mb-[15px]">
                <div className="flex items-start gap-2.5">
                  <button onClick={() => toggleSection(q._id)} className="text-[14px] font-bold text-[#333] bg-transparent border-none cursor-pointer px-[5px]">
                    {isExpanded ? "-" : "+"}
                  </button>
                  <div className="w-full">
                    <div className="flex items-center gap-[5px] cursor-pointer" onClick={() => toggleSection(q._id)}>
                      <span className="text-[#2150a0] text-[12px] font-bold">{q.label}</span>
                      <div className="bg-[#2150a0] text-white rounded-full w-3.5 h-3.5 text-[10px] flex items-center justify-center font-bold">?</div>
                    </div>
                    
                    <div className={`text-[11px] font-bold mt-1.5 ${isExpanded ? 'mb-3' : 'mb-0'}`}>
                      {receivedDocs.length} Received
                    </div>
                    
                    {isExpanded && (
                      <>
                        <div className="text-[11px] font-bold mb-2.5">
                          Add documents
                        </div>
                    
                    <div className="grid grid-cols-[150px_1fr] gap-2.5 items-center text-[11px] mb-2">
                      <div className="text-[#333]">Document Type</div>
                      <div>
                        <select 
                          value={customDocumentTypes[q._id] !== undefined ? customDocumentTypes[q._id] : ""} 
                          onChange={(e) => handleDocumentTypeChange(q._id, e.target.value)} 
                          className="border border-[#ccc] py-[3px] px-[5px] w-[250px] text-[11px]" 
                        >
                          <option value="">Please select a value ...</option>
                          {getDocumentTypeOptions(q).map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[150px_1fr] gap-2.5 items-center text-[11px] mb-2">
                       <div className="text-[#333]">Description</div>
                      <div>
                        <input type="text" value={descriptions[q._id] || ""} onChange={(e) => handleDescriptionChange(q._id, e.target.value)} className="border border-[#ccc] py-[3px] px-[5px] w-[250px] text-[11px]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-[150px_1fr] gap-2.5 items-center text-[11px]">
                      <div className="text-[#333]">File names</div>
                      <div className="flex items-center gap-2">
                        <label className="bg-[#e0e0e0] border border-[#999] py-[2px] px-2 text-[11px] text-[#333] cursor-pointer">
                          Choose Files
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, q._id, q.label)}
                            disabled={isUploading}
                          />
                        </label>
                        <span className="text-[#666]">
                          {isUploading ? "Uploading..." : receivedDocs.length > 0 ? `${receivedDocs.length} file(s) attached` : "No file chosen"}
                        </span>
                      </div>
                    </div>

                    {isReceived && (
                          <div className="mt-[15px] text-[11px]">
                            <div className="font-bold mb-1.5">Attached Files:</div>
                            <table className="w-full border-collapse border border-[#ddd]">
                              <thead className="bg-[#f2f2f2]">
                                <tr>
                                  <th className="p-1.5 text-left border-b border-[#ddd] font-normal text-[#666]">Document Type</th>
                                  <th className="p-1.5 text-left border-b border-[#ddd] font-normal text-[#666]">Description</th>
                                  <th className="p-1.5 text-left border-b border-[#ddd] font-normal text-[#666]">File Name</th>
                                  <th className="p-1.5 text-left border-b border-[#ddd] font-normal text-[#666]">Uploaded At</th>
                                  <th className="p-1.5 text-center border-b border-[#ddd] font-normal text-[#666]">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {receivedDocs.map((doc, idx) => (
                                  <tr key={idx}>
                                    <td className="p-1.5 border-b border-[#eee]">{doc.documentType}</td>
                                    <td className="p-1.5 border-b border-[#eee]">{doc.description || "-"}</td>
                                    <td className="p-1.5 border-b border-[#eee]">
                                      <a href={doc.url.startsWith('http') ? doc.url : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'}${doc.url}`} target="_blank" rel="noreferrer" className="text-[#2150a0] underline">
                                        {doc.originalName}
                                      </a>
                                    </td>
                                    <td className="p-1.5 border-b border-[#eee]">{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString("en-GB", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "-"}</td>
                                    <td className="p-1.5 border-b border-[#eee] text-center">
                                      <button 
                                        onClick={() => handleRemoveButtonClick(doc.url)}
                                        disabled={isRemoving === doc.url}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Other Documents Section */}
      <div className="mb-6">
        <div className="text-[#2150a0] text-[13px] font-normal mb-1">Additional documents</div>
        
        {(() => {
          const allCategorizedOptions = Object.values(DOCUMENT_TYPE_OPTIONS).flat();
          const additionalDocs = (application.documents || []).filter(doc => 
            doc.documentType === "Other (specify)" || 
            (!fileQuestions.some(q => q.label === doc.documentType) && 
             !allCategorizedOptions.includes(doc.documentType || ""))
          );
          return (
            <div className="border-t-2 border-[#ff9933] border-b border-[#ddd] py-2 mb-[15px]">
              <div className="flex items-start gap-2.5">
                <button onClick={() => toggleSection("additional")} className="text-[14px] font-bold text-[#333] bg-transparent border-none cursor-pointer px-[5px]">
                  {getIsExpanded("additional") ? "-" : "+"}
                </button>
                <div className="w-full">
                  <div className="flex items-center gap-[5px] cursor-pointer" onClick={() => toggleSection("additional")}>
                    <span className="text-[#2150a0] text-[12px] font-bold">Other Documents</span>
                    <div className="bg-[#2150a0] text-white rounded-full w-3.5 h-3.5 text-[10px] flex items-center justify-center font-bold">?</div>
                  </div>
                  
                  <div className={`text-[11px] font-bold mt-1.5 ${getIsExpanded("additional") ? 'mb-3' : 'mb-0'}`}>
                    {additionalDocs.length > 0 ? `${additionalDocs.length} Received` : "0 Received"}
                  </div>
              
              {getIsExpanded("additional") && (
                <>
                  <div className="text-[11px] font-bold mb-2.5">
                    Add documents
                  </div>
              
              <div className="grid grid-cols-[150px_1fr] gap-2.5 items-center text-[11px] mb-2">
                <div className="text-[#333]">Document Type</div>
                <div>
                  <select 
                    value={customDocumentTypes["additional"] !== undefined ? customDocumentTypes["additional"] : ""} 
                    onChange={(e) => handleDocumentTypeChange("additional", e.target.value)} 
                    className="border border-[#ccc] py-[3px] px-[5px] w-[250px] text-[11px]" 
                  >
                    <option value="">Please select a value ...</option>
                    {fileQuestions.map(mq => (
                      <option key={mq._id} value={mq.label}>{mq.label}</option>
                    ))}
                    <option value="Other (specify)">Other (specify)</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-[150px_1fr] gap-2.5 items-center text-[11px] mb-2">
                <div className="text-[#333]">Description</div>
                <div>
                  <input type="text" value={descriptions["additional"] || ""} onChange={(e) => handleDescriptionChange("additional", e.target.value)} className="border border-[#ccc] py-[3px] px-[5px] w-[250px] text-[11px]" />
                </div>
              </div>

              <div className="grid grid-cols-[150px_1fr] gap-2.5 items-center text-[11px] mb-2.5">
                <div className="text-[#333]">File names</div>
                <div className="flex items-center gap-2">
                  <label className="bg-[#e0e0e0] border border-[#999] py-[2px] px-2 text-[11px] text-[#333] cursor-pointer">
                    {isUploading ? "Uploading..." : "Choose Files"}
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => handleFileUpload(e, "additional", "Other (specify)")}
                      disabled={isUploading}
                    />
                  </label>
                  <span className="text-[#666]">
                    {isUploading ? "Uploading..." : additionalDocs.length > 0 ? `${additionalDocs.length} file(s) attached` : "No file chosen"}
                  </span>
                </div>
              </div>

              {additionalDocs.length > 0 && (
                <div className="mt-[15px]">
                  <div className="font-bold mb-1.5">Attached Files:</div>
                  <table className="w-full border-collapse border border-[#ddd]">
                    <thead className="bg-[#f2f2f2]">
                      <tr>
                        <th className="p-1.5 text-left border-b border-[#ddd] font-normal text-[#666]">Document Type</th>
                        <th className="p-1.5 text-left border-b border-[#ddd] font-normal text-[#666]">Description</th>
                        <th className="p-1.5 text-left border-b border-[#ddd] font-normal text-[#666]">File Name</th>
                        <th className="p-1.5 text-left border-b border-[#ddd] font-normal text-[#666]">Uploaded At</th>
                        <th className="p-1.5 text-center border-b border-[#ddd] font-normal text-[#666]">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {additionalDocs.map((doc, idx) => (
                        <tr key={idx}>
                          <td className="p-1.5 border-b border-[#eee]">{doc.documentType || "Other (specify)"}</td>
                          <td className="p-1.5 border-b border-[#eee]">{doc.description || "-"}</td>
                          <td className="p-1.5 border-b border-[#eee]">
                            <a href={doc.url.startsWith('http') ? doc.url : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'}${doc.url}`} target="_blank" rel="noreferrer" className="text-[#2150a0] underline">
                              {doc.originalName}
                            </a>
                          </td>
                          <td className="p-1.5 border-b border-[#eee]">{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString("en-GB", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "-"}</td>
                          <td className="p-1.5 border-b border-[#eee] text-center">
                            <button 
                              onClick={() => handleRemoveButtonClick(doc.url)}
                              disabled={isRemoving === doc.url}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
                </>
              )}
            </div>
          </div>
        </div>
          );
        })()}
      </div>
      
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setDocumentUrlToRemove(null);
        }}
        onConfirm={handleConfirmRemove}
        title="Remove Document"
        message="Are you sure you want to remove this document? This action cannot be undone."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        type="danger"
        isLoading={isRemoving !== null}
      />
    </div>
  );
};
