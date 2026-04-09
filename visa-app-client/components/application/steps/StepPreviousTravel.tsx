"use client";

import { SectionHeading, YesNo } from "@/components/ui";
import type { StepProps } from "@/types/application";

export const StepPreviousTravel = ({ data, onChange }: StepProps) => {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });

  return (
    <div>
      <SectionHeading>Previous travel</SectionHeading>
      <p className="text-[13px] mb-4">
        Has the applicant travelled to Australia or any other country in the
        last 10 years?
      </p>
      <YesNo
        name="hasPreviousTravel"
        value={(data.hasPreviousTravel as boolean | null) ?? null}
        onChange={(v) => set("hasPreviousTravel", v)}
      />
      {(data.hasPreviousTravel as boolean) && (
        <div className="mt-5">
          <p className="text-[13px] mb-2">
            Please provide details of the most recent travel:
          </p>
          <textarea
            className="w-full h-[100px] border border-gray-400 rounded px-3 py-2 text-sm"
            value={(data.travelDetails as string) || ""}
            onChange={(e) => set("travelDetails", e.target.value)}
            placeholder="Country, Dates, Purpose..."
          />
        </div>
      )}
    </div>
  );
};
