import React, { useState, useRef } from "react";
import { useSubmitUpdateRequestMutation } from "@/redux/api/applicationApi";
import { useAlert } from "@/components/ui";
import { ApplicationData } from "./types";
import { COUNTRIES } from "@/constants/countries";

export const UpdateForm = ({
  type,
  onCancel,
  application,
  trn,
  applicationId,
}: {
  type: string;
  onCancel: () => void;
  application: ApplicationData;
  trn: string;
  applicationId: string;
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1); // 1 = form, 2 = review (passport only)
  const [submitUpdate, { isLoading }] = useSubmitUpdateRequestMutation();
  const { showAlert } = useAlert();
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type: inputType } = e.target;
    if (inputType === "radio") {
      if ((e.target as HTMLInputElement).checked) {
        setFormData((prev: Record<string, string>) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setFormData((prev: Record<string, string>) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Pre-fill formData with existing values for relevant fields
  React.useEffect(() => {
    if (application) {
      const initialData: Record<string, string> = {};
      
      if (type === "address") {
        initialData.country = application.profile?.address?.country || "";
        initialData.address1 = application.profile?.address?.street || "";
        initialData.address2 = (application.profile?.address as { address2?: string })?.address2 || "";
        initialData.city = application.profile?.address?.city || "";
        initialData.state = application.profile?.address?.state || "";
        initialData.zip = application.profile?.address?.zipCode || "";
      } else if (type === "passport") {
        initialData.familyName = application.clientId?.name?.split(" ")[0] || "";
        initialData.givenNames = application.clientId?.name?.split(" ").slice(1).join(" ") || "";
        initialData.documentType = "Passport";
        initialData.passportNumber = application.profile?.passportNumber || "";
        initialData.countryOfPassport = application.profile?.nationality || "";
        initialData.nationality = application.profile?.nationality || "";
        initialData.placeOfIssue = application.profile?.placeOfIssue || "";
        if (application.profile?.dateOfIssue) {
          initialData.dateOfIssue = new Date(application.profile.dateOfIssue).toISOString().split('T')[0];
        }
        if (application.profile?.dateOfExpiry) {
          initialData.dateOfExpiry = new Date(application.profile.dateOfExpiry).toISOString().split('T')[0];
        }
      } else if (type === "email") {
        initialData.email = application.clientId?.email || application.email || "";
      }
      
      setFormData(initialData);
    }
  }, [application, type]);

  const handleSave = async () => {
    try {
      await submitUpdate({
        id: applicationId,
        type,
        data: formData,
      }).unwrap();
      showAlert({ title: "Saved", message: "Details saved successfully.", type: "success" });
    } catch {
      showAlert({ title: "Error", message: "Failed to save.", type: "error" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitUpdate({
        id: applicationId,
        type,
        data: formData,
      }).unwrap();
      showAlert({
        title: "Success",
        message: "Update request submitted successfully.",
        type: "success",
      });
      onCancel();
    } catch (err: unknown) {
      console.error(err);
      showAlert({
        title: "Error",
        message: "Failed to submit update request.",
        type: "error",
      });
    }
  };

  const handlePrint = () => {
    if (formRef.current) {
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(`<html><head><title>Update - ${getHeader()}</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12px; padding: 0; margin: 0; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 15px; }
            td, th { border: 1px solid #ddd; padding: 6px; }
            @media print { 
              [data-no-print] { display: none !important; } 
              .force-print { display: block !important; }
              .print-page-break { break-before: page; page-break-before: always; margin-top: 0; }
              body { padding: 20px; }
            }
          </style></head>
          <body>${formRef.current.innerHTML}</body></html>`);
        win.document.close();
        win.print();
      }
    }
  };


  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent any form submission
    setStep(2);
  };

  const getHeader = () => {
    switch (type) {
      case "address":
        return "Change of address details";
      case "contact":
        return "Change of contact telephone numbers";
      case "email":
        return "Change of email address details";
      case "passport":
        return "Change of passport details";
      default:
        return "";
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="border border-[#ddd] bg-[#f9f9f9]"
    >
      {/* Form Header */}
      <div className="bg-[#00264d] text-white py-1 px-2.5 text-[13px] font-bold">
        {getHeader()}{type === "passport" && ` — Step ${step} of 2`}
      </div>

      <div className={`p-[15px] bg-white force-print ${step === 2 ? "hidden" : "block"}`}>
        <div className="text-[13px] mb-[15px]">
          Transaction Reference Number (TRN): <strong>{trn}</strong>
        </div>

        {/* Applicant Section */}
        <div className="mb-5">
          <div className="text-[#2150a0] font-bold text-[13px] mb-[5px]">
            Applicant
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2.5 text-[13px]">
            <div className="w-full sm:w-[140px] font-bold">Required applicant</div>
            <div className="flex items-center gap-[5px] w-full sm:w-auto">
              <div className="border border-[#ccc] py-[2px] px-2 bg-[#f8f9fa] text-[12px] font-bold text-[#333] flex-1 sm:min-w-[200px]">
                {application.clientId?.name || application.email || "Applicant"} (
                {(application.clientId?.dateOfBirth || application.profile?.dateOfBirth) ? (
                  new Date(application.clientId?.dateOfBirth || application.profile?.dateOfBirth as string).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                ) : "N/A"}
                )
              </div>
              <span className="bg-[#00264d] text-white rounded-full w-3.5 h-3.5 text-[10px] flex items-center justify-center cursor-help shrink-0">
                ?
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Form Content */}
        {type === "address" && (
          <div className="text-[13px]">
            <p className="mb-2.5">
              Is this a change of residential address?
            </p>
            <div className="flex gap-[15px]">
              <label className="flex items-center gap-[5px]">
                <input
                  type="radio"
                  name="address_change"
                  value="yes"
                  onChange={handleInputChange}
                />{" "}
                Yes
              </label>
              <label className="flex items-center gap-[5px]">
                <input
                  type="radio"
                  name="address_change"
                  value="no"
                  onChange={handleInputChange}
                />{" "}
                No
              </label>
            </div>
            {formData.address_change === "yes" && (
              <div className="mt-5">
                <div className="font-bold mb-2.5">
                  New residential address
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                    <div className="w-full sm:w-[250px]">Country</div>
                      <select
                        name="country"
                        onChange={handleInputChange}
                        defaultValue={application.profile?.address?.country || ""}
                        className="border border-[#ccc] w-full sm:w-[200px] p-[2px]"
                      >
                        <option value=""></option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                    <div className="w-full sm:w-[250px]">Address 1</div>
                    <input
                      type="text"
                      name="address1"
                      onChange={handleInputChange}
                      defaultValue={application.profile?.address?.street || ""}
                      className="border border-[#ccc] w-full sm:w-[200px] p-[2px]"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                    <div className="w-full sm:w-[250px]">Address 2</div>
                    <input
                      type="text"
                      name="address2"
                      onChange={handleInputChange}
                      defaultValue={(application.profile?.address as { address2?: string })?.address2 || ""}
                      className="border border-[#ccc] w-full sm:w-[200px] p-[2px]"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                    <div className="w-full sm:w-[250px]">Suburb / Town</div>
                    <input
                      type="text"
                      name="city"
                      onChange={handleInputChange}
                      defaultValue={application.profile?.address?.city || ""}
                      className="border border-[#ccc] w-full sm:w-[200px] p-[2px]"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                    <div className="w-full sm:w-[250px]">State or Province</div>
                    <input
                      type="text"
                      name="state"
                      onChange={handleInputChange}
                      defaultValue={application.profile?.address?.state || ""}
                      className="border border-[#ccc] w-full sm:w-[200px] p-[2px]"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                    <div className="w-full sm:w-[250px]">Postal code</div>
                    <input
                      type="text"
                      name="zip"
                      onChange={handleInputChange}
                      defaultValue={application.profile?.address?.zipCode || ""}
                      className="border border-[#ccc] w-full sm:w-[100px] p-[2px]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {type === "contact" && (
          <div className="text-[13px]">
            <div className="flex gap-2.5 mb-[15px]">
              <div className="text-[#2150a0] font-bold flex items-center gap-[5px]">
                Contact telephone numbers
                <span className="bg-[#00264d] text-white rounded-full w-3.5 h-3.5 text-[10px] flex items-center justify-center">
                  ?
                </span>
              </div>
            </div>
            <p className="text-[12px] mb-2">
              Enter numbers only with no spaces
            </p>
            <p className="text-[12px] mb-[15px]">
              Provide a mobile / cell phone number, if possible. This will
              ensure that we can readily contact you.
            </p>
            <p className="mb-2.5">
              Is the applicant able to provide a mobile / cell phone number?
            </p>
            <div className="flex gap-[15px]">
              <label className="flex items-center gap-[5px]">
                <input
                  type="radio"
                  name="phone_available"
                  value="yes"
                  onChange={handleInputChange}
                />{" "}
                Yes
              </label>
              <label className="flex items-center gap-[5px]">
                <input
                  type="radio"
                  name="phone_available"
                  value="no"
                  onChange={handleInputChange}
                />{" "}
                No
              </label>
            </div>
            {formData.phone_available === "yes" && (
              <div className="mt-5 flex flex-col gap-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <div className="w-full sm:w-[250px]">Business phone</div>
                  <input
                    type="text"
                    name="businessPhone"
                    onChange={handleInputChange}
                    className="border border-[#ccc] w-full sm:w-[200px] p-[2px]"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <div className="w-full sm:w-[250px]">Home phone</div>
                  <input
                    type="text"
                    name="homePhone"
                    onChange={handleInputChange}
                    className="border border-[#ccc] w-full sm:w-[200px] p-[2px]"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <div className="w-full sm:w-[250px]">Mobile / Cell phone</div>
                  <input
                    type="text"
                    name="mobilePhone"
                    onChange={handleInputChange}
                    className="border border-[#ccc] w-full sm:w-[200px] p-[2px]"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {type === "email" && (
          <div className="text-[13px]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2.5 mb-[10px]">
              <div className="w-full sm:w-[100px]">Email address</div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="border border-[#ccc] py-[2px] px-[5px] w-full sm:w-[300px]"
                />
                <span className="bg-[#00264d] text-white rounded-full w-3.5 h-3.5 text-[10px] flex items-center justify-center shrink-0">
                  ?
                </span>
              </div>
            </div>
            <p className="text-[12px] text-[#333] mb-[15px]">
              All communication relating to this application will be sent to the
              email address provided above.
            </p>
            <div className="bg-white border border-[#ddd] p-2.5 text-[12px]">
              <strong>Note:</strong> The holder of this email address may
              receive a verification email from the Department if the address
              has not already been verified. If the address holder receives a
              verification email, they should click on the link to verify their
              address before this application is submitted.
            </div>
          </div>
        )}

        {type === "passport" && (
          <div className="text-[13px]">
            <p className="mb-[15px]">
              Select the applicant whose passport or travel document details are
              being updated.
            </p>

            <div className="mb-5">
              <div className="text-[#2150a0] font-bold text-[13px] mb-[10px]">
                Current passport or travel document details
              </div>
              <p className="mb-2.5">
                The following passport or travel document details are currently
                available for the selected applicant.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse gap-2.5 min-w-[400px]">
                  <tbody>
                    {[
                      [
                        "Family name",
                        application.clientId?.name?.split(" ")[0],
                      ],
                      [
                        "Given names",
                        application.clientId?.name
                          ?.split(" ")
                          .slice(1)
                          .join(" "),
                      ],
                      ["Type of document", "Passport"],
                      [
                        "Passport number",
                        application.profile?.passportNumber || "N/A",
                      ],
                      [
                        "Country of passport",
                        application.profile?.nationality || "N/A",
                      ],
                      [
                        "Nationality of passport holder",
                        application.profile?.nationality || "N/A",
                      ],
                      ["Date of issue", application.profile?.dateOfIssue ? new Date(application.profile.dateOfIssue).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"],
                      ["Date of expiry", application.profile?.dateOfExpiry ? new Date(application.profile.dateOfExpiry).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"],
                      ["Place of issue / issuing authority", application.profile?.placeOfIssue || "N/A"],
                    ].map(([label, value], idx) => (
                      <tr key={idx}>
                        <td className="py-[2px] px-0 w-[200px] sm:w-[250px]">{label}</td>
                        <td className="py-[2px] px-0">
                          <strong>{value}</strong>
                          {idx < 3 && (
                            <span className="ml-[5px] bg-[#00264d] text-white rounded-full w-3.5 h-3.5 text-[10px] inline-flex items-center justify-center">
                              ?
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-5">
              <div className="text-[#2150a0] font-bold text-[13px] mb-[10px]">
                New passport or travel document details
              </div>
              <p className="mb-2.5">
                Give details of the new passport or travel document for the
                selected applicant.
              </p>
              <div className="flex flex-col gap-[5px]">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <div className="w-full sm:w-[250px]">Family name</div>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      name="familyName"
                      defaultValue={application.clientId?.name?.split(" ")[0] || ""}
                      onChange={handleInputChange}
                      className="border border-[#ccc] w-full sm:w-[200px]"
                    />
                    <span className="bg-[#00264d] text-white rounded-full w-3.5 h-3.5 text-[10px] inline-flex items-center justify-center shrink-0">
                      ?
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <div className="w-full sm:w-[250px]">Given names</div>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      name="givenNames"
                      defaultValue={application.clientId?.name?.split(" ").slice(1).join(" ") || ""}
                      onChange={handleInputChange}
                      className="border border-[#ccc] w-full sm:w-[200px]"
                    />
                    <span className="bg-[#00264d] text-white rounded-full w-3.5 h-3.5 text-[10px] inline-flex items-center justify-center shrink-0">
                      ?
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <div className="w-full sm:w-[250px]">Type of document</div>
                  <div className="flex items-center gap-1">
                    <select
                      name="documentType"
                      defaultValue="Passport"
                      onChange={handleInputChange}
                      className="border border-[#ccc] w-full sm:w-[100px]"
                    >
                      <option value="Passport">Passport</option>
                    </select>
                    <span className="bg-[#00264d] text-white rounded-full w-3.5 h-3.5 text-[10px] inline-flex items-center justify-center shrink-0">
                      ?
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <div className="w-full sm:w-[250px]">Passport number</div>
                  <input
                    type="text"
                    name="passportNumber"
                    defaultValue={application.profile?.passportNumber || ""}
                    onChange={handleInputChange}
                    className="border border-[#ccc] w-full sm:w-[200px]"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <div className="w-full sm:w-[250px]">Country of passport</div>
                  <select
                    name="countryOfPassport"
                    defaultValue={application.profile?.nationality || ""}
                    onChange={handleInputChange}
                    className="border border-[#ccc] w-full sm:w-[200px]"
                  >
                    <option></option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <div className="w-full sm:w-[250px]">
                    Nationality of passport holder
                  </div>
                  <select
                    name="nationality"
                    defaultValue={application.profile?.nationality || ""}
                    onChange={handleInputChange}
                    className="border border-[#ccc] w-full sm:w-[200px]"
                  >
                    <option></option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <div className="w-full sm:w-[250px]">Date of issue</div>
                  <input
                    type="date"
                    name="dateOfIssue"
                    defaultValue={application.profile?.dateOfIssue ? new Date(application.profile.dateOfIssue).toISOString().split('T')[0] : ""}
                    onChange={handleInputChange}
                    className="border border-[#ccc] w-full sm:w-[200px]"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <div className="w-full sm:w-[250px]">Date of expiry</div>
                  <input
                    type="date"
                    name="dateOfExpiry"
                    defaultValue={application.profile?.dateOfExpiry ? new Date(application.profile.dateOfExpiry).toISOString().split('T')[0] : ""}
                    onChange={handleInputChange}
                    className="border border-[#ccc] w-full sm:w-[200px]"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <div className="w-full sm:w-[250px]">
                    Place of issue / issuing authority
                  </div>
                  <input
                    type="text"
                    name="placeOfIssue"
                    defaultValue={application.profile?.placeOfIssue || ""}
                    onChange={handleInputChange}
                    className="border border-[#ccc] w-full sm:w-[200px]"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="text-[#2150a0] font-bold text-[13px] mb-[5px]">
                Reason for update
              </div>
              <p className="mb-2.5">
                Select a reason why the passport or travel document details are
                being updated.
              </p>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2.5">
                <div className="w-full sm:w-[245px]">Reason</div>
                <div className="flex flex-col">
                  {[
                    "Expired / New",
                    "Cancelled",
                    "Stolen",
                    "Incorrectly recorded",
                    "Lost",
                  ].map((reason, idx) => (
                    <label key={idx} className="flex items-center gap-[5px] text-[13px] py-0.5">
                      <input
                        type="radio"
                        name="reason"
                        value={reason}
                        onChange={handleInputChange}
                      />{" "}
                      {reason}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Review (passport only) */}
      {type === "passport" && (
        <div className={`p-[15px] bg-white force-print ${step === 1 ? "hidden" : "block"} print-page-break`}>
          <div className="text-[#2150a0] font-bold text-[13px] mb-2.5">Review your changes</div>
          <p className="text-[12px] mb-3">Please review the passport details below before confirming the update.</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px] min-w-[300px]">
              <thead>
                <tr className="bg-[#00264d] text-white">
                  <th className="py-1.5 px-2.5 text-left font-normal">Field</th>
                  <th className="py-1.5 px-2.5 text-left font-normal">New Value</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Family Name", formData.familyName || application.clientId?.name?.split(" ")[0]],
                  ["Given Names", formData.givenNames || application.clientId?.name?.split(" ").slice(1).join(" ")],
                  ["Type of Document", formData.documentType || "Passport"],
                  ["Passport Number", formData.passportNumber || application.profile?.passportNumber],
                  ["Country of Passport", formData.countryOfPassport || application.profile?.nationality],
                  ["Nationality", formData.nationality || application.profile?.nationality],
                  ["Date of Issue", formData.dateOfIssue],
                  ["Date of Expiry", formData.dateOfExpiry],
                  ["Place of Issue", formData.placeOfIssue || application.profile?.placeOfIssue],
                  ["Reason for Update", formData.reason],
                ].map(([label, value], idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-[#f9f9f9]" : "bg-white"}>
                    <td className="py-1.5 px-2.5 border-b border-[#eee] text-[#555]">{label}</td>
                    <td className="py-1.5 px-2.5 border-b border-[#eee] font-semibold">{value || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Footer Buttons */}
      <div data-no-print="true" className="bg-[#f5f5f5] p-2.5 flex flex-col sm:flex-row justify-between border-t border-[#ddd] gap-3">
        <div className="flex flex-wrap gap-2">
          {/* Cancel */}
          <button type="button" onClick={onCancel} className="bg-white border border-[#ccc] py-1 px-2.5 text-[12px] flex items-center gap-1.5 hover:bg-gray-50">
            <span className="text-red-600">✘</span> Cancel
          </button>
 
          {/* Save / Submit (only on step 1) */}
          {step === 1 && (
            <button
              type={["address", "contact", "email"].includes(type) ? "submit" : "button"}
              disabled={isLoading}
              onClick={["address", "contact", "email"].includes(type) ? undefined : handleSave}
              className={`bg-white border border-[#ccc] py-1 px-2.5 text-[12px] flex items-center gap-1.5 hover:bg-gray-50 ${isLoading ? "opacity-70" : "opacity-100"}`}
            >
              <span className="text-blue-600">💾</span> {isLoading ? "Saving..." : "Save"}
            </button>
          )}
 
          {/* Print */}
          <button type="button" onClick={handlePrint} className="bg-white border border-[#ccc] py-1 px-2.5 text-[12px] flex items-center gap-1.5 hover:bg-gray-50">
            <span>⎙</span> Print
          </button>
 
          {/* Go to account */}
          <button type="button" onClick={onCancel} className="bg-white border border-[#ccc] py-1 px-2.5 text-[12px] flex items-center gap-1.5 hover:bg-gray-50">
            <span>›</span> Go to account
          </button>
        </div>
 
        <div className="flex flex-wrap gap-2 justify-end sm:justify-start">
          {/* Back button on step 2 */}
          {step === 2 && (
            <button type="button" onClick={() => setStep(1)} className="bg-white border border-[#ccc] py-1 px-2.5 text-[12px] flex items-center gap-1.5 hover:bg-gray-50">
              <span>⇦</span> Back
            </button>
          )}
 
          {/* Next (step 1, passport only) */}
          {type === "passport" && step === 1 && (
            <button type="button" onClick={handleNext} className="bg-white border border-[#ccc] py-1 px-2.5 text-[12px] flex items-center gap-1.5 hover:bg-gray-50">
              Next <span>⇨</span>
            </button>
          )}
 
          {/* Confirm & Submit on passport step 2 */}
          {type === "passport" && step === 2 && (
            <button type="submit" disabled={isLoading} className={`bg-[#00264d] text-white border border-[#ccc] py-1 px-3 text-[12px] flex items-center gap-1.5 hover:bg-[#001a33] ${isLoading ? "opacity-70" : "opacity-100"}`}>
              {isLoading ? "Please wait..." : <>✔ Confirm & Submit</>}
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
