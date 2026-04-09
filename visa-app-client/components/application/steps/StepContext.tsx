"use client";

import { SectionHeading, FieldRow, YesNo } from "@/components/ui";
import { LEGAL_STATUS } from "@/constants/formOptions";
import type { StepProps } from "@/types/application";
import { useGetActiveTransitCountriesQuery } from "@/redux/api/transitCountryApi";
import { TTransitCountry } from "@/types/transitCountry";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useGetGlobalOptionsQuery } from "@/redux/api/settingsApi";
import { TGlobalOption } from "@/types/settings";

export const StepContext = ({ data, onChange }: StepProps) => {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });

  // ── Fetch live settings ──────────────────
  const { data: transitData, isLoading: isLoadingTransit } =
    useGetActiveTransitCountriesQuery(undefined);
  const { data: optionsData } = useGetGlobalOptionsQuery({});

  const transitCountries = (transitData?.data ?? []) as TTransitCountry[];
  const globalOptions = (optionsData?.data ?? []) as TGlobalOption[];
  const legalStatusOptions = globalOptions.find(opt => opt.key === "legal_status")?.options ?? LEGAL_STATUS;

  return (
    <div>
      <SectionHeading>Application context</SectionHeading>
      <SectionHeading>
        Current location{" "}
        <span
          title="Your current country"
          className="bg-[#2150a0] text-white rounded-full w-4 h-4 inline-block text-center text-[11px] leading-4 cursor-help"
        >
          ?
        </span>
      </SectionHeading>
      <p className="text-xs text-gray-500 mb-2">
        Give details of the applicant&apos;s current location.
      </p>

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
          {legalStatusOptions.map((s: string) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </FieldRow>

      <SectionHeading>Transit details</SectionHeading>

      {/* ── Destination country (dynamic — admin-controlled) ─────────────── */}
      <FieldRow label="Destination country (via Australia)">
        {isLoadingTransit ? (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Loader2 size={14} className="animate-spin" />
            Loading permitted transit countries...
          </div>
        ) : transitCountries.length === 0 ? (
          <div className="flex items-start gap-2 bg-orange-50 border border-orange-200 rounded p-2 text-xs text-orange-700 max-w-[340px]">
            <AlertTriangle size={13} className="mt-0.5 shrink-0" />
            <span>
              No transit countries are currently available. Please contact
              support or check back later.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <select
              className="border border-gray-400 rounded px-2 py-1 text-sm w-[280px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={(data.destinationCountry as string) || ""}
              onChange={(e) => set("destinationCountry", e.target.value)}
            >
              <option value="">Select destination country...</option>
              {transitCountries.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.flagEmoji ? `${c.flagEmoji} ` : ""}
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-500">
              Only countries permitted to transit through Australia are shown.
            </p>
          </div>
        )}
      </FieldRow>

      <FieldRow label="Proposed arrival date">
        <input
          type="date"
          className="border border-gray-400 rounded px-2 py-1 text-sm"
          value={(data.arrivalDate as string) || ""}
          onChange={(e) => set("arrivalDate", e.target.value)}
        />
      </FieldRow>

      <FieldRow label="Purpose of transit">
        <div className="flex flex-col gap-1.5 text-[13px]">
          {[
            ["passenger", "Depart as passenger on a flight"],
            ["crew", "Depart as crew on a non-military ship"],
          ].map(([val, label]) => (
            <label
              key={val}
              className="flex gap-1.5 cursor-pointer items-center"
            >
              <input
                type="radio"
                name="transitPurpose"
                value={val}
                checked={data.transitPurpose === val}
                onChange={() => set("transitPurpose", val)}
                className="accent-[#2150a0]"
              />
              {label}
            </label>
          ))}
        </div>
      </FieldRow>

      <div className="mb-2.5 text-[13px]">
        <p className="mb-1.5">
          Will the applicant transit or enter and depart Australia in less than
          72 hours?
        </p>
        <YesNo
          name="transit72hrs"
          value={(data.transit72hrs as boolean | null) ?? null}
          onChange={(v) => set("transit72hrs", v)}
        />
      </div>
    </div>
  );
};
