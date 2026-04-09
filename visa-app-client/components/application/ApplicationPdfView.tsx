"use client";

import { useRef } from "react";
import { X, Printer, FileText, CheckCircle, XCircle } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Types ──────────────────────────────────────────────────────────────────

interface ApplicationPdfViewProps {
  application: any;
  onClose: () => void;
}

// ─── Helper Components ───────────────────────────────────────────────────────

const SectionTitle = ({ number, children }: { number: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mt-6 mb-0">
    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
      {number}
    </div>
    <div className="flex-1 bg-gray-800 text-white font-semibold text-xs px-3 py-2 rounded-lg uppercase tracking-wide">
      {children}
    </div>
  </div>
);

const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest px-1 pt-3 pb-1 border-b border-gray-100">
    {children}
  </div>
);

const FieldBlock = ({ label, value }: { label: string; value: string | undefined | null }) => (
  <div className="grid grid-cols-[200px_1fr] border-b border-gray-100 text-xs hover:bg-gray-50 transition-colors">
    <div className="px-3 py-2 text-gray-500 bg-gray-50/60">{label}</div>
    <div className="px-3 py-2 text-gray-900 font-medium">{value || <span className="text-gray-300">—</span>}</div>
  </div>
);

const YesNoField = ({ label, value }: { label: string; value: boolean | null | undefined }) => (
  <div className="grid grid-cols-[200px_1fr] border-b border-gray-100 text-xs hover:bg-gray-50 transition-colors">
    <div className="px-3 py-2 text-gray-500 bg-gray-50/60">{label}</div>
    <div className="px-3 py-2 font-medium">
      {value === true ? (
        <span className="flex items-center gap-1 text-emerald-600"><CheckCircle size={11} /> Yes</span>
      ) : value === false ? (
        <span className="flex items-center gap-1 text-rose-500"><XCircle size={11} /> No</span>
      ) : (
        <span className="text-gray-300">—</span>
      )}
    </div>
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────

const statusMap: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  SUBMITTED: "bg-blue-50 text-blue-600",
  UNDER_REVIEW: "bg-indigo-50 text-indigo-600",
  PAYMENT_PENDING: "bg-amber-50 text-amber-600",
  PAID: "bg-emerald-50 text-emerald-600",
  APPROVED: "bg-green-50 text-green-600",
  GRANTED: "bg-green-50 text-green-700",
  REJECTED: "bg-rose-50 text-rose-600",
  REFUSED: "bg-rose-50 text-rose-600",
};

// ─── Main Component ──────────────────────────────────────────────────────────

export const ApplicationPdfView = ({ application, onClose }: ApplicationPdfViewProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  // ─── Real-time Data Merging ───────────────────────────────────────────────
  const mergedFd = { ...application?.formData };

  if (application?.updateRequests && Array.isArray(application.updateRequests)) {
    application.updateRequests.forEach((update: any) => {
      const { type, data } = update;
      if (!data) return;
      if (type === "passport") {
        Object.assign(mergedFd, data);
      } else if (type === "address") {
        if (data.address) mergedFd.address1 = data.address;
        if (data.city) mergedFd.suburb = data.city;
        if (data.zip) mergedFd.postcode = data.zip;
        if (data.state) mergedFd.state = data.state;
        if (data.country) mergedFd.country = data.country;
        if (data.countryOfResidence) mergedFd.countryOfResidence = data.countryOfResidence;
      } else if (type === "contact") {
        if (data.mobilePhone) mergedFd.mobilePhone = data.mobilePhone;
        if (data.businessPhone || data.homePhone) mergedFd.phone = data.businessPhone || data.homePhone;
      } else if (type === "email") {
        if (data.email) mergedFd.email = data.email;
      }
    });
  }

  // ─── Dynamic Value Resolver ───────────────────────────────────────────────
  const getVal = (key: string, stepNum?: number) => {
    if (mergedFd[key] !== undefined) return mergedFd[key];
    if (stepNum && mergedFd[`step${stepNum}`]?.[key] !== undefined) return mergedFd[`step${stepNum}`][key];
    for (let i = 1; i <= 15; i++) {
      const val = mergedFd[`step${i}`]?.[key];
      if (val !== undefined) return val;
    }
    return undefined;
  };

  const s1 = { accepted: getVal("accepted", 1) };
  const s2 = {
    currentLocation: getVal("currentLocation", 2),
    legalStatus: getVal("legalStatus", 2),
    arrivalDate: getVal("arrivalDate", 2),
    transitPurpose: getVal("transitPurpose", 2),
    transit72hrs: getVal("transit72hrs", 2),
    purposeOfVisit: getVal("purposeOfVisit", 2),
    intendedStay: getVal("intendedStay", 2),
    courseInstitution: getVal("courseInstitution", 2),
    coeNumber: getVal("coeNumber", 2),
  };
  const s3 = {
    familyName: getVal("familyName", 3),
    givenNames: getVal("givenNames", 3),
    sex: getVal("sex", 3),
    dateOfBirth: getVal("dateOfBirth", 3),
    passportNumber: getVal("passportNumber", 3),
    countryOfPassport: getVal("countryOfPassport", 3),
    nationality: getVal("nationality", 3),
    dateOfIssue: getVal("dateOfIssue", 3),
    dateOfExpiry: getVal("dateOfExpiry", 3),
    placeOfIssue: getVal("placeOfIssue", 3),
    birthTown: getVal("birthTown", 3),
    birthState: getVal("birthState", 3),
    countryOfBirth: getVal("countryOfBirth", 3),
    relationshipStatus: getVal("relationshipStatus", 3),
    hasAusGrantNum: getVal("hasAusGrantNum", 3),
    ausGrantNumber: getVal("ausGrantNumber", 3),
    hasNationalId: getVal("hasNationalId", 3),
    hasOtherNames: getVal("hasOtherNames", 3),
    citizenOfPassportCountry: getVal("citizenOfPassportCountry", 3),
    citizenOtherCountry: getVal("citizenOtherCountry", 3),
    otherPassports: getVal("otherPassports", 3),
    otherIdentityDocs: getVal("otherIdentityDocs", 3),
    healthExam: getVal("healthExam", 3),
  };
  const s5 = {
    countryOfResidence: getVal("countryOfResidence", 4) || getVal("countryOfResidence", 5),
    address1: getVal("address1", 4) || getVal("address1", 5),
    address2: getVal("address2", 4) || getVal("address2", 5),
    suburb: getVal("suburb", 4) || getVal("suburb", 5),
    state: getVal("state", 4) || getVal("state", 5),
    postcode: getVal("postcode", 4) || getVal("postcode", 5),
    country: getVal("country", 4) || getVal("country", 5),
    phone: getVal("phone", 4) || getVal("phone", 5),
    mobilePhone: getVal("mobilePhone", 4) || getVal("mobilePhone", 5),
    email: getVal("email", 4) || getVal("email", 5),
  };
  const s6 = {
    hasAuthorisedRecipient: getVal("hasAuthorisedRecipient", 5) || getVal("hasAuthorisedRecipient", 6),
    recipientFamilyName: getVal("recipientFamilyName", 5) || getVal("recipientGivenNames", 6),
    recipientGivenNames: getVal("recipientGivenNames", 5) || getVal("recipientGivenNames", 6),
    recipientPhone: getVal("recipientPhone", 5) || getVal("recipientPhone", 6),
    recipientEmail: getVal("recipientEmail", 5) || getVal("recipientEmail", 6),
  };
  const s8 = {
    enterHospital: getVal("enterHospital", 8),
    healthPractitioner: getVal("healthPractitioner", 8),
    childcareWork: getVal("childcareWork", 8),
    pregnant: getVal("pregnant", 8),
    tuberculosis: getVal("tuberculosis", 8),
  };
  const s9 = {
    criminalOffence: getVal("criminalOffence", 9),
    chargedWithOffence: getVal("chargedWithOffence", 9),
    acquittedOffence: getVal("acquittedOffence", 9),
    removedDeported: getVal("removedDeported", 9),
    visaRefused: getVal("visaRefused", 9),
    overstayed: getVal("overstayed", 9),
  };
  const s12 = {
    readUnderstood: getVal("readUnderstood", 12),
    truthfulComplete: getVal("truthfulComplete", 12),
    authoriseDisclosure: getVal("authoriseDisclosure", 12),
    consentCollection: getVal("consentCollection", 12),
    consentLawEnforcement: getVal("consentLawEnforcement", 12),
    readHealthInformation: getVal("readHealthInformation", 12),
    consentHealthService: getVal("consentHealthService", 12),
  };

  const mappedKeys = new Set([
    "accepted", "currentLocation", "legalStatus", "arrivalDate", "transitPurpose", "transit72hrs",
    "purposeOfVisit", "intendedStay", "courseInstitution", "coeNumber", "familyName", "givenNames",
    "sex", "dateOfBirth", "passportNumber", "countryOfPassport", "nationality", "dateOfIssue",
    "dateOfExpiry", "placeOfIssue", "birthTown", "birthState", "countryOfBirth", "relationshipStatus",
    "hasAusGrantNum", "ausGrantNumber", "hasNationalId", "hasOtherNames", "citizenOfPassportCountry",
    "citizenOtherCountry", "otherPassports", "otherIdentityDocs", "healthExam", "countryOfResidence",
    "address1", "address2", "suburb", "state", "postcode", "country", "phone", "mobilePhone", "email",
    "hasAuthorisedRecipient", "recipientFamilyName", "recipientGivenNames", "recipientPhone",
    "recipientEmail", "enterHospital", "healthPractitioner", "childcareWork", "pregnant",
    "tuberculosis", "criminalOffence", "chargedWithOffence", "acquittedOffence", "removedDeported",
    "visaRefused", "overstayed", "readUnderstood", "truthfulComplete", "authoriseDisclosure",
    "consentCollection", "consentLawEnforcement", "readHealthInformation", "consentHealthService",
  ]);

  const additionalFields = Object.entries(mergedFd)
    .filter(([key, value]) => !mappedKeys.has(key) && typeof value !== "object" && key !== "currentStep")
    .map(([key, value]) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
      value: String(value),
    }));

  const trn = application?.trn || application?._id?.slice(-10).toUpperCase() || "—";
  const visaCategory = application?.visaCategory || (application?.visaTypeId as any)?.name || "Visa Application";

  const submittedDate = application?.updatedAt
    ? new Date(application.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  const statusKey = application?.status?.toUpperCase() || "";
  const statusLabel = statusKey.replace(/_/g, " ");
  const statusCls = statusMap[statusKey] ?? "bg-gray-100 text-gray-500";

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Application - ${trn}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; font-size: 12px; }
                .header { background: #00264d; color: white; padding: 12px 16px; margin-bottom: 0; }
                .header h1 { margin: 0; font-size: 16px; }
                .header p { margin: 4px 0 0; font-size: 11px; opacity: 0.8; }
                .section-title { background: #1e293b; color: white; font-weight: bold; font-size: 11px; padding: 6px 12px; margin-top: 20px; }
                .sub-heading { color: #2563eb; font-weight: bold; font-size: 10px; padding: 4px 12px; border-bottom: 1px solid #eee; text-transform: uppercase; letter-spacing: 0.05em; }
                .field-row { display: grid; grid-template-columns: 200px 1fr; border-bottom: 1px solid #f0f0f0; }
                .field-label { padding: 5px 12px; color: #666; background: #f9fafb; }
                .field-value { padding: 5px 12px; font-weight: 500; }
                .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; text-align: center; font-size: 10px; color: #999; }
                @media print { body { padding: 0; } button { display: none !important; } }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-6 px-4">
      <div className="w-full max-w-[860px] bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* ── Sticky Toolbar ─────────────────────────────────────── */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Application Summary</p>
              <p className="text-[10px] text-gray-400">TRN: {trn}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Printer size={13} /> Print / PDF
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors"
            >
              <X size={13} /> Close
            </button>
          </div>
        </div>

        {/* ── PDF Content ─────────────────────────────────────────── */}
        <div ref={printRef} className="p-6 space-y-0">

          {/* Document Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-5 rounded-xl mb-5">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Visa Application</p>
            <h1 className="text-lg font-bold text-white">{visaCategory}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-300">
              <span>TRN: <span className="font-semibold text-white">{trn}</span></span>
              <span>Submitted: <span className="font-semibold text-white">{submittedDate}</span></span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusCls}`}>{statusLabel || "—"}</span>
            </div>
          </div>

          {/* ─── SECTION 1: Terms & Conditions ─────────────────── */}
          <SectionTitle number="1">Terms &amp; Conditions</SectionTitle>
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mt-2">
            <YesNoField label="Terms accepted" value={s1.accepted} />
          </div>

          {/* ─── SECTION 2: Application Context ─────────────────── */}
          <SectionTitle number="2">Application Context</SectionTitle>
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mt-2">
            <FieldBlock label="Current location" value={s2.currentLocation} />
            <FieldBlock label="Legal status" value={s2.legalStatus} />
            <FieldBlock label="Proposed arrival date" value={s2.arrivalDate} />
            <FieldBlock label="Purpose of transit" value={s2.transitPurpose} />
            <YesNoField label="Transit under 72 hours?" value={s2.transit72hrs} />
            <FieldBlock label="Purpose of visit" value={s2.purposeOfVisit} />
            <FieldBlock label="Intended stay duration" value={s2.intendedStay} />
            <FieldBlock label="Course / Institution" value={s2.courseInstitution} />
            <FieldBlock label="CoE number" value={s2.coeNumber} />
          </div>

          {/* ─── SECTION 3: Applicant Details ─────────────────── */}
          <SectionTitle number="3">Applicant Details</SectionTitle>
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mt-2">
            <SubHeading>Passport Details</SubHeading>
            <FieldBlock label="Family name" value={s3.familyName} />
            <FieldBlock label="Given names" value={s3.givenNames} />
            <FieldBlock label="Sex" value={s3.sex} />
            <FieldBlock label="Date of birth" value={s3.dateOfBirth} />
            <FieldBlock label="Passport number" value={s3.passportNumber} />
            <FieldBlock label="Country of passport" value={s3.countryOfPassport} />
            <FieldBlock label="Nationality" value={s3.nationality} />
            <FieldBlock label="Date of issue" value={s3.dateOfIssue} />
            <FieldBlock label="Date of expiry" value={s3.dateOfExpiry} />
            <FieldBlock label="Place of issue / Issuing authority" value={s3.placeOfIssue} />

            <SubHeading>Place of Birth</SubHeading>
            <FieldBlock label="Town / City" value={s3.birthTown} />
            <FieldBlock label="State / Province" value={s3.birthState} />
            <FieldBlock label="Country of birth" value={s3.countryOfBirth} />

            <SubHeading>Personal Information</SubHeading>
            <FieldBlock label="Relationship status" value={s3.relationshipStatus} />
            <YesNoField label="Australian visa grant number?" value={s3.hasAusGrantNum} />
            {s3.hasAusGrantNum && <FieldBlock label="Grant number" value={s3.ausGrantNumber} />}
            <YesNoField label="National identity card?" value={s3.hasNationalId} />
            <YesNoField label="Other names?" value={s3.hasOtherNames} />
            <YesNoField label="Citizen of passport country?" value={s3.citizenOfPassportCountry} />
            <YesNoField label="Citizen of other country?" value={s3.citizenOtherCountry} />
            <YesNoField label="Other passports?" value={s3.otherPassports} />
            <YesNoField label="Other identity documents?" value={s3.otherIdentityDocs} />
            <YesNoField label="Health examination (last 12 months)?" value={s3.healthExam} />
          </div>

          {/* ─── SECTION 4: Contact Details ─────────────────────── */}
          <SectionTitle number="4">Contact Details</SectionTitle>
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mt-2">
            <FieldBlock label="Country of residence" value={s5.countryOfResidence} />
            <SubHeading>Residential Address</SubHeading>
            <FieldBlock label="Address line 1" value={s5.address1} />
            <FieldBlock label="Address line 2" value={s5.address2} />
            <FieldBlock label="Suburb / Town" value={s5.suburb} />
            <FieldBlock label="State / Province" value={s5.state} />
            <FieldBlock label="Postal code" value={s5.postcode} />
            <FieldBlock label="Country" value={s5.country} />
            <SubHeading>Contact Information</SubHeading>
            <FieldBlock label="Phone" value={s5.phone || s5.mobilePhone} />
            <FieldBlock label="Email" value={s5.email} />
          </div>

          {/* ─── SECTION 5: Authorised Recipient ────────────────── */}
          <SectionTitle number="5">Authorised Recipient</SectionTitle>
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mt-2">
            <YesNoField label="Authorised another person?" value={s6.hasAuthorisedRecipient} />
            {s6.hasAuthorisedRecipient && (
              <>
                <FieldBlock label="Recipient family name" value={s6.recipientFamilyName} />
                <FieldBlock label="Recipient given names" value={s6.recipientGivenNames} />
                <FieldBlock label="Recipient phone" value={s6.recipientPhone} />
                <FieldBlock label="Recipient email" value={s6.recipientEmail} />
              </>
            )}
          </div>

          {/* ─── SECTION 6: Health Declarations ─────────────────── */}
          <SectionTitle number="6">Health Declarations</SectionTitle>
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mt-2">
            <YesNoField label="Intend to enter hospital / health care?" value={s8.enterHospital} />
            <YesNoField label="Intend to work as health practitioner?" value={s8.healthPractitioner} />
            <YesNoField label="Intend to work / study in childcare?" value={s8.childcareWork} />
            <YesNoField label="Pregnant or planning pregnancy?" value={s8.pregnant} />
            <YesNoField label="Tuberculosis?" value={s8.tuberculosis} />
          </div>

          {/* ─── SECTION 7: Character Declarations ──────────────── */}
          <SectionTitle number="7">Character Declarations</SectionTitle>
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mt-2">
            <YesNoField label="Criminal offence conviction?" value={s9.criminalOffence} />
            <YesNoField label="Charged with offence awaiting action?" value={s9.chargedWithOffence} />
            <YesNoField label="Acquitted on grounds of mental illness?" value={s9.acquittedOffence} />
            <YesNoField label="Removed / deported from any country?" value={s9.removedDeported} />
            <YesNoField label="Visa cancelled / refused?" value={s9.visaRefused} />
            <YesNoField label="Overstayed a visa?" value={s9.overstayed} />
          </div>

          {/* ─── SECTION 8: Final Declarations ──────────────────── */}
          <SectionTitle number="8">Final Declarations</SectionTitle>
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mt-2">
            <YesNoField label="Read and understood information?" value={s12.readUnderstood} />
            <YesNoField label="Understand false info is serious offence?" value={s12.truthfulComplete} />
            <YesNoField label="Authorise enquiries to verify?" value={s12.authoriseDisclosure} />
            <YesNoField label="Consent to personal info collection?" value={s12.consentCollection} />
            <YesNoField label="Consent to law enforcement disclosure?" value={s12.consentLawEnforcement} />
            <YesNoField label="Read health requirements?" value={s12.readHealthInformation} />
            <YesNoField label="Consent to health info collection?" value={s12.consentHealthService} />
          </div>

          {/* ─── SECTION 9: Additional Information ──────────────── */}
          {additionalFields.length > 0 && (
            <>
              <SectionTitle number="9">Additional Information</SectionTitle>
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mt-2">
                {additionalFields.map((field, idx) => (
                  <FieldBlock key={idx} label={field.label} value={field.value} />
                ))}
              </div>
            </>
          )}

          {/* ─── Footer ──────────────────────────────────────────── */}
          <div className="mt-8 p-4 bg-gray-50 border border-gray-100 rounded-xl text-center space-y-1">
            <p className="text-[10px] text-gray-400">
              This document is an official summary of the visa application.
            </p>
            <p className="text-[10px] text-gray-400">
              Generated on{" "}
              {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}{" "}
              · TRN: {trn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
