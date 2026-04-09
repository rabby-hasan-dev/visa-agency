"use client";

import { SectionHeading, FieldRow, YesNo } from "@/components/ui";
import { LEGAL_STATUS } from "@/constants/formOptions";
import type { StepProps } from "@/types/application";
import { useGetActiveTransitCountriesQuery } from "@/redux/api/transitCountryApi";
import { TTransitCountry } from "@/types/transitCountry";
import { AlertTriangle, Loader2 } from "lucide-react";

export const StepStudentContext = ({ data, onChange }: StepProps) => {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });

  const { data: transitData, isLoading: isLoadingTransit } =
    useGetActiveTransitCountriesQuery(undefined);

  const transitCountries = (transitData?.data ?? []) as TTransitCountry[];

  return (
    <div>
      <SectionHeading>Application context</SectionHeading>
      <SectionHeading>Current location</SectionHeading>

      <FieldRow label="Current location">
        {isLoadingTransit ? (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Loader2 size={14} className="animate-spin" />
            Loading permitted countries...
          </div>
        ) : transitCountries.length === 0 ? (
          <div className="flex items-start gap-2 bg-orange-50 border border-orange-200 rounded p-2 text-xs text-orange-700 max-w-[340px]">
            <AlertTriangle size={13} className="mt-0.5 shrink-0" />
            <span>No permitted countries available.</span>
          </div>
        ) : (
          <select
            className="border border-gray-400 rounded px-2 py-1 text-sm w-[280px] bg-white"
            value={(data.currentLocation as string) || ""}
            onChange={(e) => set("currentLocation", e.target.value)}
          >
            <option value="">Select country...</option>
            {transitCountries.map((c) => (
              <option key={c._id} value={c.name}>
                {c.flagEmoji ? `${c.flagEmoji} ` : ""}
                {c.name}
              </option>
            ))}
          </select>
        )}
      </FieldRow>

      <FieldRow label="Legal status">
        <select
          className="border border-gray-400 rounded px-2 py-1 text-sm w-[200px] bg-white"
          value={(data.legalStatus as string) || ""}
          onChange={(e) => set("legalStatus", e.target.value)}
        >
          <option value="">Select...</option>
          {LEGAL_STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </FieldRow>

      <SectionHeading>Study details</SectionHeading>
      <FieldRow label="Sector of education">
        <select
          className="border border-gray-400 rounded px-2 py-1 text-sm w-[280px] bg-white"
          value={(data.educationSector as string) || ""}
          onChange={(e) => set("educationSector", e.target.value)}
        >
          <option value="">Select sector...</option>
          <option value="higher">Higher Education</option>
          <option value="vet">VET Sector</option>
          <option value="schools">Schools Sector</option>
          <option value="elticos">ELICOS Sector</option>
        </select>
      </FieldRow>

      <div className="mb-2.5 text-[13px]">
        <p className="mb-1.5">
          Does the applicant have a Confirmation of Enrolment (CoE)?
        </p>
        <YesNo
          name="hasCoE"
          value={(data.hasCoE as boolean | null) ?? null}
          onChange={(v) => set("hasCoE", v)}
        />
      </div>
    </div>
  );
};
