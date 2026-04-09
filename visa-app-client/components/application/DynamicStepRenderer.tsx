"use client";

// ─── DynamicStepRenderer ──────────────────────────────────────────────────────
// Renders questions for a single step from the DB-driven config.
// Replaces the old STEP_COMPONENT_MAP + hardcoded step components.
//
// Supports all TFieldType values:
//   text | textarea | select | radio | checkbox | date | file |
//   boolean | section-header | number | email | phone

import { TQuestion, TFieldType } from "@/types/visaTypes";
import { SectionHeading } from "@/components/ui";
import { Upload, CheckCircle, XCircle, FileText, Loader2, AlertTriangle } from "lucide-react";
import { useUploadDocumentMutation } from "@/redux/api/documentApi";
import { useState } from "react";
import { useGetActiveTransitCountriesQuery } from "@/redux/api/transitCountryApi";
import { useGetGlobalOptionsQuery } from "@/redux/api/settingsApi";
import { TTransitCountry } from "@/types/transitCountry";
import { TGlobalOption } from "@/types/settings";
import { COUNTRIES } from "@/constants/countries";


// ─── Props ────────────────────────────────────────────────────────────────────

interface DynamicStepRendererProps {
  questions: TQuestion[];
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  errors?: Record<string, string>; // New: fieldKey -> error message
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const inputCls =
  "border border-gray-400 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 w-full md:max-w-[350px]";
const selectCls =
  "border border-gray-400 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 w-full md:max-w-[350px]";

// ─── Conditional visibility helper ────────────────────────────────────────────

const isVisible = (
  q: TQuestion,
  data: Record<string, unknown>,
): boolean => {
  if (!q.showIf) return true;
  const val = data[q.showIf.field];
  // compare as string to handle boolean "true"/"false" stored as string or actual bool
  return String(val) === q.showIf.value;
};

// ─── Individual Field Renderer ────────────────────────────────────────────────

const DynamicField = ({
  q,
  value,
  error,
  onChange,
}: {
  q: TQuestion;
  value: unknown;
  error?: string;
  onChange: (key: string, val: unknown) => void;
}) => {
  let type = q.fieldType as TFieldType;

  // ── Auto-upgrade legacy fields to modern dynamic types ────────────────────
  const adminControlledKeys = ["currentLocation", "transitCountry", "destinationCountry"];
  const fullWorldKeys = [
    "countryOfPassport",
    "nationality",
    "countryOfBirth",
    "countryOfResidence",
    "country",
    "qualificationCountry",
  ];

  if (adminControlledKeys.includes(q.fieldKey)) {
    type = "transit-country";
  } else if (fullWorldKeys.includes(q.fieldKey)) {
    type = "country";
  }

  const strVal = value !== undefined && value !== null ? String(value) : "";
  const hasError = !!error;

  const labelCls = `block text-[13px] font-medium mb-1 ${hasError ? "text-red-600" : "text-gray-700"}`;
  const inputErrorCls = hasError ? "border-red-500 bg-red-50" : "border-gray-400";

  // ── Fetch transit countries unconditionally (Hooks rule) ──
  const { data: transitData, isLoading: isLoadingTransit } =
    useGetActiveTransitCountriesQuery(undefined, {
      skip: type !== "transit-country",
    });

  // ── Fetch global options from admin panel ──
  const { data: optionsData } = useGetGlobalOptionsQuery({});
  const globalOptions = (optionsData?.data ?? []) as TGlobalOption[];
  const matchedGlobal = globalOptions.find(opt => opt.key === q.fieldKey);

  let finalOptions = q.options ?? [];
  if (matchedGlobal) {
    finalOptions = matchedGlobal.options.map(opt => ({ label: opt, value: opt }));
  }

  // ── Section Header ──────────────────────────────────────────────────────────
  if (type === "section-header") {
    return <SectionHeading>{q.label}</SectionHeading>;
  }

  // ── Yes / No (boolean) ──────────────────────────────────────────────────────
  if (type === "boolean") {
    const boolVal =
      value === true || value === "true"
        ? true
        : value === false || value === "false"
          ? false
          : null;
    return (
      <div className="mb-3 text-[13px]">
        <p className={`mb-1.5 ${hasError ? "text-red-600 font-medium" : "text-gray-700"}`}>{q.label}</p>
        <div className="flex gap-4">
          {[
            { label: "Yes", v: true },
            { label: "No", v: false },
          ].map(({ label, v }) => (
            <label key={label} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name={q.fieldKey}
                checked={boolVal === v}
                onChange={() => onChange(q.fieldKey, v)}
                className="accent-[#2150a0]"
              />
              {label}
            </label>
          ))}
        </div>
        {error && <p className="text-[10px] text-red-600 font-medium mt-1">{error}</p>}
        {q.helpText && !error && (
          <p className="text-[11px] text-gray-500 mt-1">{q.helpText}</p>
        )}
      </div>
    );
  }

  // ── Radio ───────────────────────────────────────────────────────────────────
  if (type === "radio") {
    return (
      <div className="mb-3">
        <div className={`block text-[13px] mb-1.5 ${hasError ? "text-red-600 font-medium" : "text-gray-700"}`}>
          {q.label}
          {q.isRequired && <span className="text-red-500 ml-0.5">*</span>}
        </div>
        <div className="flex flex-col gap-1.5 text-[13px]">
          {finalOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name={q.fieldKey}
                value={opt.value}
                checked={strVal === opt.value}
                onChange={() => onChange(q.fieldKey, opt.value)}
                className="accent-[#2150a0]"
              />
              {opt.label}
            </label>
          ))}
        </div>
        {error && <p className="text-[10px] text-red-600 font-medium mt-1">{error}</p>}
        {q.helpText && !error && (
          <p className="text-[11px] text-gray-500 mt-1">{q.helpText}</p>
        )}
      </div>
    );
  }

  // ── Checkbox (multi-select) ─────────────────────────────────────────────────
  if (type === "checkbox") {
    const current: string[] = Array.isArray(value) ? (value as string[]) : [];
    const toggle = (v: string) => {
      const next = current.includes(v)
        ? current.filter((x) => x !== v)
        : [...current, v];
      onChange(q.fieldKey, next);
    };
    return (
      <div className="mb-3">
        <div className={`block text-[13px] mb-1.5 ${hasError ? "text-red-600 font-medium" : "text-gray-700"}`}>
          {q.label}
          {q.isRequired && <span className="text-red-500 ml-0.5">*</span>}
        </div>
        <div className="flex flex-col gap-1.5 text-[13px]">
          {(finalOptions).map((opt) => (
            <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={current.includes(opt.value)}
                onChange={() => toggle(opt.value)}
                className="accent-[#2150a0]"
              />
              {opt.label}
            </label>
          ))}
        </div>
        {error && <p className="text-[10px] text-red-600 font-medium mt-1">{error}</p>}
        {q.helpText && !error && (
          <p className="text-[11px] text-gray-500 mt-1">{q.helpText}</p>
        )}
      </div>
    );
  }

  // ── Select ──────────────────────────────────────────────────────────────────
  if (type === "select") {
    return (
      <div className="mb-3 flex flex-col gap-1">
        <label className={labelCls}>
          {q.label}
          {q.isRequired && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <select
          className={`${selectCls} ${inputErrorCls}`}
          value={strVal}
          onChange={(e) => onChange(q.fieldKey, e.target.value)}
          required={q.isRequired}
        >
          <option value="">{q.placeholder || "Select..."}</option>
          {(finalOptions).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-[10px] text-red-600 font-medium">{error}</p>}
        {q.helpText && !error && (
          <p className="text-[11px] text-gray-500">{q.helpText}</p>
        )}
      </div>
    );
  }

  // ── Textarea ────────────────────────────────────────────────────────────────
  if (type === "textarea") {
    return (
      <div className="mb-3 flex flex-col gap-1">
        <label className={labelCls}>
          {q.label}
          {q.isRequired && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <textarea
          className={`border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 w-full md:max-w-[550px] resize-y ${inputErrorCls}`}
          rows={4}
          value={strVal}
          placeholder={q.placeholder}
          required={q.isRequired}
          onChange={(e) => onChange(q.fieldKey, e.target.value)}
        />
        {error && <p className="text-[10px] text-red-600 font-medium">{error}</p>}
        {q.helpText && !error && (
          <p className="text-[11px] text-gray-500">{q.helpText}</p>
        )}
      </div>
    );
  }

  // ── File Upload ─────────────────────────────────────────────────────────────
  if (type === "file") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [uploadFile, { isLoading: isUploading }] = useUploadDocumentMutation();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        setUploadError(null);
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadFile(formData).unwrap();
        const url = res?.data?.url || res?.data?.path || res?.data;
        onChange(q.fieldKey, url);
      } catch (err: unknown) {
        setUploadError("Failed to upload file");
        console.error(err);
      }
    };

    return (
      <div className="mb-4 flex flex-col gap-1.5">
        <label className={labelCls}>
          {q.label}
          {q.isRequired && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        
        <div className={`relative border-2 border-dashed rounded-lg p-4 transition-all ${
          strVal ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-[#2150a0]"
        } ${hasError || uploadError ? "border-red-400 bg-red-50" : ""}`}>
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${strVal ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {isUploading ? <Loader2 className="animate-spin" size={20} /> : (strVal ? <CheckCircle size={20} /> : <Upload size={20} />)}
            </div>
            <div className="flex-1 text-left">
              <p className="text-[13px] font-semibold text-gray-700">
                {isUploading ? "Uploading document..." : (strVal ? "Document Uploaded" : "Click or drag to upload")}
              </p>
              <div className="text-[11px] text-gray-500">
                {strVal ? (
                  <a href={strVal} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline z-20 relative flex items-center gap-1">
                    <FileText size={12} /> View uploaded file
                  </a>
                ) : (q.placeholder || "Maximum size 5MB (PDF, JPG, PNG)")}
              </div>
            </div>
            {strVal && !isUploading && (
              <button 
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(q.fieldKey, ""); }}
                className="p-1 hover:bg-red-100 text-red-600 rounded-full z-20 relative"
              >
                <XCircle size={18} />
              </button>
            )}
          </div>
        </div>

        {(error || uploadError) && <p className="text-[10px] text-red-600 font-medium">{error || uploadError}</p>}
        {q.helpText && !error && !uploadError && <p className="text-[11px] text-gray-500">{q.helpText}</p>}
      </div>
    );
  }

  // ── Transit Country (dynamic — admin-controlled) ─────────────────────────
  if (type === "transit-country") {
    const transitCountries = (transitData?.data ?? []) as TTransitCountry[];

    return (
      <div className="mb-3 flex flex-col gap-1">
        <label className={labelCls}>
          {q.label}
          {q.isRequired && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {isLoadingTransit ? (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Loader2 size={14} className="animate-spin" />
            Loading transit countries...
          </div>
        ) : (transitCountries?.length ?? 0) === 0 ? (
          <div className="bg-orange-50 border border-orange-200 rounded p-4 text-xs text-orange-700 w-full max-w-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>No transit countries available. Please contact support.</span>
            </div>
          </div>
        ) : (
          <select
            className={`${selectCls} ${inputErrorCls}`}
            value={strVal}
            onChange={(e) => onChange(q.fieldKey, e.target.value)}
            required={q.isRequired}
          >
            <option value="">{q.placeholder || "Select transit country..."}</option>
            {transitCountries.map((c) => (
              <option key={c._id} value={c.name}>
                {c.flagEmoji ? `${c.flagEmoji} ` : ""}{c.name} ({c.code})
              </option>
            ))}
          </select>
        )}
        {error && <p className="text-[10px] text-red-600 font-medium">{error}</p>}
        {q.helpText && !error && (
          <p className="text-[11px] text-gray-500">
            {q.helpText || "Only countries permitted to transit through Australia are shown."}
          </p>
        )}
      </div>
    );
  }

  // ── Full Country List (static constant) ──────────────────────────────────
  if (type === "country") {
    return (
      <div className="mb-3 flex flex-col gap-1">
        <label className={labelCls}>
          {q.label}
          {q.isRequired && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <select
          className={`${selectCls} ${inputErrorCls}`}
          value={strVal}
          onChange={(e) => onChange(q.fieldKey, e.target.value)}
          required={q.isRequired}
        >
          <option value="">{q.placeholder || "Select country..."}</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {error && <p className="text-[10px] text-red-600 font-medium">{error}</p>}
        {q.helpText && !error && (
          <p className="text-[11px] text-gray-500">{q.helpText}</p>
        )}
      </div>
    );
  }

  // ── Default: text | date | number | email | phone ───────────────────────────
  const htmlType: Record<TFieldType, string> = {
    text: "text",
    date: "date",
    number: "number",
    email: "email",
    phone: "tel",
    textarea: "text",
    select: "text",
    radio: "text",
    checkbox: "text",
    file: "file",
    boolean: "text",
    "section-header": "text",
    "transit-country": "text",
    country: "text",
  };

  return (
    <div className="mb-3 flex flex-col gap-1">
      <label className={labelCls}>
        {q.label}
        {q.isRequired && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={htmlType[type] ?? "text"}
        className={`${inputCls} ${inputErrorCls}`}
        value={strVal}
        placeholder={q.placeholder}
        required={q.isRequired}
        onChange={(e) => onChange(q.fieldKey, e.target.value)}
      />
      {error && <p className="text-[10px] text-red-600 font-medium">{error}</p>}
      {q.helpText && !error && (
        <p className="text-[11px] text-gray-500">{q.helpText}</p>
      )}
    </div>
  );
};


// ─── Main Component ───────────────────────────────────────────────────────────

export const DynamicStepRenderer = ({
  questions,
  data,
  onChange,
  errors = {},
}: DynamicStepRendererProps) => {
  const set = (key: string, val: unknown) =>
    onChange({ ...data, [key]: val });

  const visible = questions.filter((q) => isVisible(q, data));

  if (visible.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4">
        No questions configured for this step.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {visible.map((q) => (
        <DynamicField
          key={q._id}
          q={q}
          value={data[q.fieldKey]}
          error={errors[q.fieldKey]}
          onChange={set}
        />
      ))}
    </div>
  );
};
