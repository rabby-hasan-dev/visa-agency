"use client";

import { useRef } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Types ──────────────────────────────────────────────────────────────────

interface ApplicationPdfViewProps {
  application: any;
  onClose: () => void;
}

// ─── Helper Components ──────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#00264d] text-white font-bold text-[13px] px-3 py-1.5 mt-5 mb-0">
    {children}
  </div>
);

const FieldBlock = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) => (
  <div className="grid grid-cols-[240px_1fr] border-b border-gray-200 text-[12px]">
    <div className="px-3 py-1.5 text-gray-600 bg-gray-50 border-r border-gray-200">
      {label}
    </div>
    <div className="px-3 py-1.5 text-gray-900 font-medium">{value || "—"}</div>
  </div>
);

const YesNoField = ({
  label,
  value,
}: {
  label: string;
  value: boolean | null | undefined;
}) => (
  <FieldBlock
    label={label}
    value={value === true ? "Yes" : value === false ? "No" : "—"}
  />
);

const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#e8f0fe] text-[#00264d] font-bold text-[12px] px-3 py-1 border-b border-gray-200">
    {children}
  </div>
);

// ─── Main Component ─────────────────────────────────────────────────────────

export const ApplicationPdfView = ({
  application,
  onClose,
}: ApplicationPdfViewProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  // ─── Real-time Data Merging ───────────────────────────────────────────────
  // Combine original formData with any subsequent updateRequests
  const mergedFd = { ...application?.formData };
  
  if (application?.updateRequests && Array.isArray(application.updateRequests)) {
    application.updateRequests.forEach((update: any) => {
        const { type, data } = update;
        if (!data) return;
        
        if (type === 'passport') {
            Object.assign(mergedFd, data);
        } else if (type === 'address') {
            if (data.address) mergedFd.address1 = data.address;
            if (data.city) mergedFd.suburb = data.city;
            if (data.zip) mergedFd.postcode = data.zip;
            if (data.state) mergedFd.state = data.state;
            if (data.country) mergedFd.country = data.country;
            if (data.countryOfResidence) mergedFd.countryOfResidence = data.countryOfResidence;
        } else if (type === 'contact') {
            if (data.mobilePhone) mergedFd.mobilePhone = data.mobilePhone;
            if (data.businessPhone || data.homePhone) mergedFd.phone = data.businessPhone || data.homePhone;
        } else if (type === 'email') {
            if (data.email) mergedFd.email = data.email;
        }
    });
  }

  // ─── Dynamic Value Resolver ───────────────────────────────────────────────
  const getVal = (key: string, stepNum?: number) => {
    // Check merged data first (prioritizing updates)
    if (mergedFd[key] !== undefined) return mergedFd[key];
    
    // Check nested step structure (legacy/draft support)
    if (stepNum && mergedFd[`step${stepNum}`]?.[key] !== undefined) return mergedFd[`step${stepNum}`][key];
    
    // Global fallback search
    for (let i = 1; i <= 15; i++) {
        const val = mergedFd[`step${i}`]?.[key];
        if (val !== undefined) return val;
    }
    return undefined;
  };

  // Maps for legacy field compatibility during the transition
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

  const trn = application?.trn || application?._id?.slice(-10).toUpperCase() || "—";
  const visaCategory = application?.visaCategory || (application?.visaTypeId as any)?.name || "Visa Application";
  
  // Collect all keys currently used in specific segments to find "unmapped" ones
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
    "consentCollection", "consentLawEnforcement", "readHealthInformation", "consentHealthService"
  ]);

  const additionalFields = Object.entries(mergedFd)
    .filter(([key, value]) => !mappedKeys.has(key) && typeof value !== "object" && key !== "currentStep")
    .map(([key, value]) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase()),
      value: String(value)
    }));
  const submittedDate = application?.updatedAt
    ? new Date(application.updatedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

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
                .section-title { background: #00264d; color: white; font-weight: bold; font-size: 13px; padding: 6px 12px; margin-top: 20px; page-break-after: avoid; }
                .sub-heading { background: #e8f0fe; color: #00264d; font-weight: bold; font-size: 12px; padding: 4px 12px; border-bottom: 1px solid #ddd; }
                .field-row { display: grid; grid-template-columns: 240px 1fr; border-bottom: 1px solid #eee; }
                .field-label { padding: 6px 12px; color: #555; background: #f9f9f9; border-right: 1px solid #eee; }
                .field-value { padding: 6px 12px; font-weight: 500; }
                .footer { margin-top: 30px; border-top: 2px solid #00264d; padding-top: 10px; text-align: center; font-size: 10px; color: #666; }
                .coat-of-arms { text-align: center; margin-bottom: 4px; }
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
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-start justify-center overflow-y-auto py-8">
      <div className="w-full max-w-[850px] bg-white shadow-2xl border border-gray-300">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 bg-gray-100 border-b border-gray-300 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3 py-1 bg-white border border-gray-400 rounded text-sm text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
            >
              ← Back to Application
            </button>
            <span className="text-sm text-gray-500">
              Application Summary — TRN: {trn}
            </span>
          </div>
          <button
            onClick={handlePrint}
            className="px-4 py-1 bg-[#00264d] text-white border-none rounded text-sm cursor-pointer hover:bg-[#003366] transition-colors flex items-center gap-1.5"
          >
            🖨 Print / Save PDF
          </button>
        </div>

        {/* PDF Content */}
        <div ref={printRef} className="p-0">
          {/* Document Header */}
          <div className="bg-[#00264d] text-white px-6 py-4">
            <div className="text-center mb-2">
              <div className="text-[11px] tracking-wider uppercase opacity-80">
                Australian Government — Department of Home Affairs
              </div>
            </div>
            <h1 className="text-xl font-bold text-center m-0">
              {visaCategory}
            </h1>
            <p className="text-center text-[12px] mt-1 opacity-80">
              Transaction Reference Number: {trn} | Submitted: {submittedDate}
            </p>
          </div>

          {/* Status Bar */}
          <div className="bg-[#e8f0fe] px-4 py-2 flex justify-between text-[12px] border-b border-gray-300">
            <span>
              <strong>Status:</strong>{" "}
              {application?.status?.charAt(0).toUpperCase() +
                application?.status?.slice(1) || "—"}
            </span>
            <span>
              <strong>Application ID:</strong> {application?._id || "—"}
            </span>
          </div>

          {/* ─── SECTION 1: Terms & Conditions ─────────────────────── */}
          <SectionTitle>1. Terms &amp; Conditions</SectionTitle>
          <YesNoField label="Terms accepted" value={s1.accepted} />

          {/* ─── SECTION 2: Application Context ────────────────────── */}
          <SectionTitle>2. Application Context</SectionTitle>
          <FieldBlock label="Current location" value={s2.currentLocation} />
          <FieldBlock label="Legal status" value={s2.legalStatus} />
          <FieldBlock label="Proposed arrival date" value={s2.arrivalDate} />
          <FieldBlock label="Purpose of transit" value={s2.transitPurpose} />
          <YesNoField label="Transit under 72 hours?" value={s2.transit72hrs} />
          {/* Visitor/Student context fields */}
          <FieldBlock label="Purpose of visit" value={s2.purposeOfVisit} />
          <FieldBlock label="Intended stay duration" value={s2.intendedStay} />
          <FieldBlock label="Course/Institution" value={s2.courseInstitution} />
          <FieldBlock label="CoE number" value={s2.coeNumber} />

          {/* ─── SECTION 3: Applicant Details ──────────────────────── */}
          <SectionTitle>3. Applicant Details</SectionTitle>

          <SubHeading>Passport Details</SubHeading>
          <FieldBlock label="Family name" value={s3.familyName} />
          <FieldBlock label="Given names" value={s3.givenNames} />
          <FieldBlock label="Sex" value={s3.sex} />
          <FieldBlock label="Date of birth" value={s3.dateOfBirth} />
          <FieldBlock label="Passport number" value={s3.passportNumber} />
          <FieldBlock
            label="Country of passport"
            value={s3.countryOfPassport}
          />
          <FieldBlock label="Nationality" value={s3.nationality} />
          <FieldBlock label="Date of issue" value={s3.dateOfIssue} />
          <FieldBlock label="Date of expiry" value={s3.dateOfExpiry} />
          <FieldBlock
            label="Place of issue / Issuing authority"
            value={s3.placeOfIssue}
          />

          <SubHeading>Place of Birth</SubHeading>
          <FieldBlock label="Town / City" value={s3.birthTown} />
          <FieldBlock label="State / Province" value={s3.birthState} />
          <FieldBlock label="Country of birth" value={s3.countryOfBirth} />

          <SubHeading>Personal Information</SubHeading>
          <FieldBlock
            label="Relationship status"
            value={s3.relationshipStatus}
          />
          <YesNoField
            label="Australian visa grant number?"
            value={s3.hasAusGrantNum}
          />
          {s3.hasAusGrantNum && (
            <FieldBlock label="Grant number" value={s3.ausGrantNumber} />
          )}
          <YesNoField
            label="National identity card?"
            value={s3.hasNationalId}
          />
          <YesNoField label="Other names?" value={s3.hasOtherNames} />
          <YesNoField
            label="Citizen of passport country?"
            value={s3.citizenOfPassportCountry}
          />
          <YesNoField
            label="Citizen of other country?"
            value={s3.citizenOtherCountry}
          />
          <YesNoField label="Other passports?" value={s3.otherPassports} />
          <YesNoField
            label="Other identity documents?"
            value={s3.otherIdentityDocs}
          />
          <YesNoField
            label="Health examination (last 12 months)?"
            value={s3.healthExam}
          />

          {/* ─── SECTION 4: Contact Details ────────────────────────── */}
          <SectionTitle>4. Contact Details</SectionTitle>
          <FieldBlock
            label="Country of residence"
            value={s5.countryOfResidence}
          />

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

          {/* ─── SECTION 5: Authorised Recipient ───────────────────── */}
          <SectionTitle>5. Authorised Recipient</SectionTitle>
          <YesNoField
            label="Authorised another person?"
            value={s6.hasAuthorisedRecipient}
          />
          {s6.hasAuthorisedRecipient && (
            <>
              <FieldBlock
                label="Recipient family name"
                value={s6.recipientFamilyName}
              />
              <FieldBlock
                label="Recipient given names"
                value={s6.recipientGivenNames}
              />
              <FieldBlock label="Recipient phone" value={s6.recipientPhone} />
              <FieldBlock label="Recipient email" value={s6.recipientEmail} />
            </>
          )}

          {/* ─── SECTION 6: Health Declarations ────────────────────── */}
          <SectionTitle>6. Health Declarations</SectionTitle>
          <YesNoField
            label="Intend to enter hospital/health care?"
            value={s8.enterHospital}
          />
          <YesNoField
            label="Intend to work as health practitioner?"
            value={s8.healthPractitioner}
          />
          <YesNoField
            label="Intend to work/study in childcare?"
            value={s8.childcareWork}
          />
          <YesNoField
            label="Pregnant or planning pregnancy?"
            value={s8.pregnant}
          />
          <YesNoField label="Tuberculosis?" value={s8.tuberculosis} />

          {/* ─── SECTION 7: Character Declarations ─────────────────── */}
          <SectionTitle>7. Character Declarations</SectionTitle>
          <YesNoField
            label="Criminal offence conviction?"
            value={s9.criminalOffence}
          />
          <YesNoField
            label="Charged with offence awaiting action?"
            value={s9.chargedWithOffence}
          />
          <YesNoField
            label="Acquitted on grounds of mental illness?"
            value={s9.acquittedOffence}
          />
          <YesNoField
            label="Removed/deported from any country?"
            value={s9.removedDeported}
          />
          <YesNoField label="Visa cancelled/refused?" value={s9.visaRefused} />
          <YesNoField label="Overstayed a visa?" value={s9.overstayed} />

          {/* ─── SECTION 8: Declarations ───────────────────────────── */}
          <SectionTitle>8. Final Declarations</SectionTitle>
          <YesNoField
            label="Read and understood information?"
            value={s12.readUnderstood}
          />
          <YesNoField
            label="Understand false info is serious offence?"
            value={s12.truthfulComplete}
          />
          <YesNoField
            label="Authorise enquiries to verify?"
            value={s12.authoriseDisclosure}
          />
          <YesNoField
            label="Consent to personal info collection?"
            value={s12.consentCollection}
          />
          <YesNoField
            label="Consent to law enforcement disclosure?"
            value={s12.consentLawEnforcement}
          />
          <YesNoField
            label="Read health requirements?"
            value={s12.readHealthInformation}
          />
          <YesNoField
            label="Consent to health info collection?"
            value={s12.consentHealthService}
          />

          {/* ─── SECTION 9: Additional Information ────────────────── */}
          {additionalFields.length > 0 && (
            <>
              <SectionTitle>9. Additional Information</SectionTitle>
              {additionalFields.map((field, idx) => (
                <FieldBlock key={idx} label={field.label} value={field.value} />
              ))}
            </>
          )}

          {/* ─── Footer ────────────────────────────────────────────── */}
          <div className="mt-8 border-t-2 border-[#00264d] px-6 py-4 text-center">
            <p className="text-[10px] text-gray-500 mb-1">
              This document is a summary of the visa application submitted
              through ImmiAccount.
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
              | TRN: {trn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
