"use client";

import { useFormContext, Path, PathValue } from "react-hook-form";
import { ApplicationValues } from "@/schemas/application.schema";
import { SectionHeading, FieldRow, YesNo } from "@/components/ui";
import { COUNTRIES } from "@/constants/countries";
import { RELATIONSHIP_STATUS } from "@/constants/formOptions";
import type { StepProps } from "@/types/application";

const inputCls =
  "border border-gray-400 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600";
const selectCls =
  "border border-gray-400 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-600";

export const StepApplicantDetails = ({ data, onChange }: StepProps) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext<ApplicationValues>();

  const set = <T extends Path<ApplicationValues>>(
    k: T,
    v: PathValue<ApplicationValues, T>,
  ) => {
    setValue(k, v);
    onChange({ ...data, [k as string]: v });
  };

  return (
    <div>
      <p className="text-xs text-gray-500 mb-2 bg-yellow-50 p-2 border border-gray-300 rounded">
        <strong>Information:</strong> Entering names incorrectly may result in
        denial of permission to board an aircraft to Australia, or delays in
        border processing, even if a visa has been granted.
      </p>

      <SectionHeading>
        Passport details{" "}
        <span
          title="As shown in your passport"
          className="bg-[#2150a0] text-white rounded-full w-4 h-4 inline-block text-center text-[11px] leading-4 cursor-help"
        >
          ?
        </span>
      </SectionHeading>
      <p className="text-xs text-gray-500 mb-2">
        Enter the following details as they appear in the applicant&apos;s
        passport.
      </p>

      <FieldRow label="Family name">
        <div className="flex flex-col gap-1">
          <input
            className={`${inputCls} w-[260px] ${errors.familyName ? "border-red-500" : ""}`}
            {...register("familyName")}
          />
          {errors.familyName && (
            <span className="text-red-500 text-[11px]">
              {errors.familyName.message as string}
            </span>
          )}
        </div>
      </FieldRow>
      <FieldRow label="Given names">
        <div className="flex flex-col gap-1">
          <input
            className={`${inputCls} w-[260px] ${errors.givenNames ? "border-red-500" : ""}`}
            {...register("givenNames")}
          />
          {errors.givenNames && (
            <span className="text-red-500 text-[11px]">
              {errors.givenNames.message as string}
            </span>
          )}
        </div>
      </FieldRow>
      <FieldRow label="Sex">
        <div className="flex flex-col gap-1">
          <div className="flex gap-4 text-[13px]">
            {["Female", "Male", "Other"].map((s) => (
              <label key={s} className="flex gap-1 cursor-pointer items-center">
                <input
                  type="radio"
                  {...register("sex")}
                  value={s}
                  className="accent-[#2150a0]"
                />
                {s}
              </label>
            ))}
          </div>
          {errors.sex && (
            <span className="text-red-500 text-[11px]">
              {errors.sex.message}
            </span>
          )}
        </div>
      </FieldRow>
      <FieldRow label="Date of birth">
        <div className="flex flex-col gap-1">
          <input
            type="date"
            className={`${inputCls} ${errors.dateOfBirth ? "border-red-500" : ""}`}
            {...register("dateOfBirth")}
          />
          {errors.dateOfBirth && (
            <span className="text-red-500 text-[11px]">
              {errors.dateOfBirth.message}
            </span>
          )}
        </div>
      </FieldRow>
      <FieldRow label="Passport number">
        <div className="flex flex-col gap-1">
          <input
            className={`${inputCls} w-[160px] ${errors.passportNumber ? "border-red-500" : ""}`}
            {...register("passportNumber")}
          />
          {errors.passportNumber && (
            <span className="text-red-500 text-[11px]">
              {errors.passportNumber.message}
            </span>
          )}
        </div>
      </FieldRow>
      <FieldRow label="Country of passport">
        <div className="flex flex-col gap-1">
          <select
            className={`${selectCls} w-[280px] ${errors.countryOfPassport ? "border-red-500" : ""}`}
            {...register("countryOfPassport")}
          >
            <option value="">Select country...</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.countryOfPassport && (
            <span className="text-red-500 text-[11px]">
              {errors.countryOfPassport.message}
            </span>
          )}
        </div>
      </FieldRow>
      <FieldRow label="Nationality of passport holder">
        <div className="flex flex-col gap-1">
          <select
            className={`${selectCls} w-[280px] ${errors.nationality ? "border-red-500" : ""}`}
            {...register("nationality")}
          >
            <option value="">Select...</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.nationality && (
            <span className="text-red-500 text-[11px]">
              {errors.nationality.message}
            </span>
          )}
        </div>
      </FieldRow>
      <FieldRow label="Date of issue">
        <div className="flex flex-col gap-1">
          <input
            type="date"
            className={`${inputCls} ${errors.dateOfIssue ? "border-red-500" : ""}`}
            {...register("dateOfIssue")}
          />
          {errors.dateOfIssue && (
            <span className="text-red-500 text-[11px]">
              {errors.dateOfIssue.message}
            </span>
          )}
        </div>
      </FieldRow>
      <FieldRow label="Date of expiry">
        <div className="flex flex-col gap-1">
          <input
            type="date"
            className={`${inputCls} ${errors.dateOfExpiry ? "border-red-500" : ""}`}
            {...register("dateOfExpiry")}
          />
          {errors.dateOfExpiry && (
            <span className="text-red-500 text-[11px]">
              {errors.dateOfExpiry.message}
            </span>
          )}
        </div>
      </FieldRow>
      <FieldRow label="Place of issue / issuing authority">
        <div className="flex flex-col gap-1">
          <input
            className={`${inputCls} w-[260px] ${errors.placeOfIssue ? "border-red-500" : ""}`}
            {...register("placeOfIssue")}
          />
          {errors.placeOfIssue && (
            <span className="text-red-500 text-[11px]">
              {errors.placeOfIssue.message}
            </span>
          )}
        </div>
      </FieldRow>
      <p className="text-xs text-gray-500 mb-3">
        It is strongly recommended that the passport be valid for at least six
        months.
      </p>

      <SectionHeading>Australian visa grant number</SectionHeading>
      <div className="mb-2.5 text-[13px]">
        <p className="mb-1.5">
          Does this applicant have an Australian visa grant number from a
          previous visa application?
        </p>
        <YesNo
          name="hasAusGrantNum"
          value={(data.hasAusGrantNum as boolean | null) ?? null}
          onChange={(v) => set("hasAusGrantNum", v)}
        />
      </div>

      <SectionHeading>National identity card</SectionHeading>
      <div className="mb-2.5 text-[13px]">
        <p className="mb-1.5">
          Does this applicant have a national identity card?
        </p>
        <YesNo
          name="hasNationalId"
          value={(data.hasNationalId as boolean | null) ?? null}
          onChange={(v) => set("hasNationalId", v)}
        />
      </div>

      <SectionHeading>
        Place of birth{" "}
        <span
          title="Town/City and country"
          className="bg-[#2150a0] text-white rounded-full w-4 h-4 inline-block text-center text-[11px] leading-4 cursor-help"
        >
          ?
        </span>
      </SectionHeading>
      <FieldRow label="Town / City">
        <div className="flex flex-col gap-1">
          <input
            className={`${inputCls} w-[260px] ${errors.birthTown ? "border-red-500" : ""}`}
            {...register("birthTown")}
          />
          {errors.birthTown && (
            <span className="text-red-500 text-[11px]">
              {errors.birthTown.message}
            </span>
          )}
        </div>
      </FieldRow>
      <FieldRow label="State / Province">
        <div className="flex flex-col gap-1">
          <input
            className={`${inputCls} w-[260px] ${errors.birthState ? "border-red-500" : ""}`}
            {...register("birthState")}
          />
          {errors.birthState && (
            <span className="text-red-500 text-[11px]">
              {errors.birthState.message}
            </span>
          )}
        </div>
      </FieldRow>
      <FieldRow label="Country of birth">
        <div className="flex flex-col gap-1">
          <select
            className={`${selectCls} w-[280px] ${errors.countryOfBirth ? "border-red-500" : ""}`}
            {...register("countryOfBirth")}
          >
            <option value="">Select country...</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.countryOfBirth && (
            <span className="text-red-500 text-[11px]">
              {errors.countryOfBirth.message}
            </span>
          )}
        </div>
      </FieldRow>

      <SectionHeading>Relationship status</SectionHeading>
      <FieldRow label="Relationship status">
        <div className="flex flex-col gap-1">
          <select
            className={`${selectCls} w-[200px] ${errors.relationshipStatus ? "border-red-500" : ""}`}
            {...register("relationshipStatus")}
          >
            <option value="">Select...</option>
            {RELATIONSHIP_STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.relationshipStatus && (
            <span className="text-red-500 text-[11px]">
              {errors.relationshipStatus.message}
            </span>
          )}
        </div>
      </FieldRow>

      <SectionHeading>Other names / spellings</SectionHeading>
      <div className="mb-2.5 text-[13px]">
        <p className="mb-1.5">
          Is this applicant currently, or have they ever been known by any other
          names?
        </p>
        <YesNo
          name="hasOtherNames"
          value={(data.hasOtherNames as boolean | null) ?? null}
          onChange={(v) => set("hasOtherNames", v)}
        />
      </div>

      <SectionHeading>Citizenship</SectionHeading>
      <div className="mb-2.5 text-[13px]">
        <p className="mb-1.5">
          Is this applicant a citizen of the selected country of passport (
          {(data.countryOfPassport as string) || "—"})?
        </p>
        <YesNo
          name="citizenOfPassportCountry"
          value={(data.citizenOfPassportCountry as boolean | null) ?? null}
          onChange={(v) => set("citizenOfPassportCountry", v)}
        />
      </div>
      <div className="mb-2.5 text-[13px]">
        <p className="mb-1.5">
          Is this applicant a citizen of any other country?
        </p>
        <YesNo
          name="citizenOtherCountry"
          value={(data.citizenOtherCountry as boolean | null) ?? null}
          onChange={(v) => set("citizenOtherCountry", v)}
        />
      </div>

      <SectionHeading>Health examination</SectionHeading>
      <div className="mb-2.5 text-[13px]">
        <p className="mb-1.5">
          Has this applicant undertaken a health examination for an Australian
          visa in the last 12 months?
        </p>
        <YesNo
          name="healthExam"
          value={(data.healthExam as boolean | null) ?? null}
          onChange={(v) => set("healthExam", v)}
        />
      </div>
    </div>
  );
};
