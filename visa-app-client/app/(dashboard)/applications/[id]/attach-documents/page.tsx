"use client";

import {
  useGetSingleApplicationQuery,
  useAddDocumentsMutation,
} from "@/redux/api/applicationApi";
import { useUploadDocumentMutation } from "@/redux/api/documentApi";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  UploadCloud,
  File,
  Loader,
} from "lucide-react";
import { useAlert } from "@/components/ui";

export default function AttachDocumentsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data, isLoading } = useGetSingleApplicationQuery(id);
  const [uploadDoc, { isLoading: isUploading }] = useUploadDocumentMutation();
  const [addDocuments] = useAddDocumentsMutation();
  const [expanded, setExpanded] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { showAlert } = useAlert();

  const documentsList = data?.data?.documents || [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadDoc(formData).unwrap();
      if (res?.data?.url) {
        const newDoc = {
          originalName: res.data.originalName || file.name,
          url: res.data.url,
        };

        // Save to DB immediately
        await addDocuments({ id, documents: [newDoc] }).unwrap();

        showAlert({
          title: "Upload Successful",
          message: "File attached to your application successfully.",
          type: "success",
        });
      }
    } catch (err: unknown) {
      showAlert({
        title: "Upload Failed",
        message: "Failed to upload the file.",
        type: "error",
      });
      console.error(err);
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  const applicantName = data?.data?.clientId?.fullName || "Applicant";

  return (
    <div className="bg-[#f0f2f5] min-h-screen pb-10">
      <div className="bg-[#1a2b4a] h-11 flex items-center px-5 text-white text-lg font-bold">
        Attach documents Reference Number: EGPBHB0G2R
      </div>

      <div className="max-w-[1000px] mx-auto py-5">
        <div className="bg-white border border-[#ddd] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <h2 className="text-[#2150a0] font-bold text-lg mb-4">
            Attach documents
          </h2>

          <div className="text-[13px] text-[#333] mb-5">
            <p className="mb-2.5">
              This page must be used to attach documents to the application. It
              is recommended that you check for mandatory and recommended
              documents before submitting your application.
            </p>
            <p className="mb-2.5">
              Attachments may take up to several minutes to process. Do not
              refresh your browser during this time.
            </p>
            <p className="font-semibold">
              Providing supporting evidence can help the Department process your
              application faster.
            </p>
          </div>

          <div className="flex justify-end gap-3 mb-3">
            <button className="text-xs text-[#2150a0] bg-transparent border-none underline cursor-pointer">
              Expand all
            </button>
            <button className="text-xs text-[#2150a0] bg-transparent border-none underline cursor-pointer">
              Collapse all
            </button>
          </div>

          <div className="border border-[#ddd] rounded overflow-hidden">
            <div
              onClick={() => setExpanded(!expanded)}
              className={`bg-[#f5f5f5] py-2.5 px-4 flex items-center gap-2 cursor-pointer ${
                expanded ? "border-b border-[#ddd]" : ""
              }`}
            >
              {expanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
              <span className="text-sm font-bold text-[#2150a0]">
                {applicantName} (0 of 60 maximum)
              </span>
            </div>

            {expanded && (
              <div className="p-4">
                <p className="text-[13px] mb-3">
                  Attach documents related to the identity, health and character
                  declarations of this applicant.
                </p>
                <div className="border border-dashed border-[#999] p-[30px] text-center rounded bg-[#fafafa]">
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2.5">
                      <Loader
                        className="animate-spin text-[#2150a0]"
                        size={30}
                      />
                      <span className="text-[13px] text-[#666]">
                        Uploading document, please wait...
                      </span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud
                        size={40}
                        className="text-[#2150a0] mb-3 mx-auto"
                      />
                      <p className="text-[13px] text-[#666] mb-3.5">
                        Drag and drop files here or click to browse.
                      </p>
                      <input
                        type="file"
                        id="fileUpload"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <label
                        htmlFor="fileUpload"
                        className="bg-[#2150a0] text-white py-2 px-5 rounded-[3px] text-[13px] cursor-pointer font-bold inline-block"
                      >
                        Browse Files
                      </label>
                    </>
                  )}
                </div>

                {documentsList?.length > 0 && (
                  <div className="mt-5">
                    <h4 className="text-[13px] font-bold text-[#2150a0] mb-2.5">
                      Uploaded Documents
                    </h4>
                    <div className="flex flex-col gap-2">
                      {documentsList.map(
                        (
                          f: { url: string; originalName: string },
                          i: number,
                        ) => (
                          <div
                            key={i}
                            className="flex items-center gap-2.5 py-2 px-3 bg-[#e6f2ff] border border-[#cce0ff] rounded"
                          >
                            <File size={16} className="text-[#2150a0]" />
                            <a
                              href={
                                f.url?.startsWith("http")
                                  ? f.url
                                  : `${process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000"}${f.url}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="text-[13px] text-[#2150a0] underline"
                            >
                              {f.originalName}
                            </a>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between mt-6 pt-4 border-t border-[#ddd]">
            <div className="flex gap-2">
              <button
                onClick={() => router.back()}
                className="text-xs py-1 px-3 border border-[#999] bg-[#eee] rounded-[3px]"
              >
                ⇦ Previous
              </button>
              <button
                onClick={() => router.push(`/applications/${id}/submit`)}
                className="text-xs py-1 px-3 border border-[#999] bg-[#eee] rounded-[3px]"
              >
                💾 Save
              </button>
              <button className="text-xs py-1 px-3 border border-[#999] bg-[#eee] rounded-[3px]">
                🖨 Print
              </button>
              <button
                onClick={() => router.push("/applications")}
                className="text-xs py-1 px-3 border border-[#999] bg-[#eee] rounded-[3px]"
              >
                &gt; Go to my account
              </button>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="text-xs py-1 px-5 border border-[#555] bg-[#eee] rounded-[3px] font-semibold"
            >
              Next ⇨
            </button>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
            <div className="bg-white border-2 border-[#aaa] rounded w-[500px] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <div className="bg-white py-2.5 px-4 border-b border-[#ddd] flex justify-between items-center">
                <h4 className="text-[#2150a0] font-bold text-base m-0">
                  Providing supporting evidence
                </h4>
                <button
                  onClick={() => setShowModal(false)}
                  className="border-none bg-transparent cursor-pointer text-lg"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <p className="text-[13px] mb-3">
                  You have not attached all of the recommended documents for
                  this application. Providing all recommended documents will
                  help the Department process your application faster.
                </p>
                <p className="text-[13px] mb-2">
                  If you are unable to provide a recommended document at this
                  time, please state why below:
                </p>
                <textarea
                  className="w-full h-20 border border-[#ccc] rounded-[3px] p-2 text-[13px] mb-4"
                  placeholder="Reason for not providing documents..."
                ></textarea>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-xs py-1.5 px-4 border border-[#999] bg-[#eee] rounded-[3px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      router.push(`/applications/${id}/submit`);
                    }}
                    className="text-xs py-1.5 px-4 border border-[#555] bg-[#ddd] rounded-[3px] font-semibold"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
