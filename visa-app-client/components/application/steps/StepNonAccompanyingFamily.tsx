"use client";

import { SectionHeading, YesNo } from "@/components/ui";
import type { StepProps } from "@/types/application";

export const StepNonAccompanyingFamily = ({ data, onChange }: StepProps) => {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });

  return (
    <div>
      <SectionHeading>Non-accompanying family members</SectionHeading>
      <p className="text-[13px] mb-4">
        Does the applicant have any family members who are not travelling to
        Australia with them?
      </p>
      <YesNo
        name="hasNonAccompanyingFamily"
        value={(data.hasNonAccompanyingFamily as boolean | null) ?? null}
        onChange={(v) => set("hasNonAccompanyingFamily", v)}
      />
      {(data.hasNonAccompanyingFamily as boolean) && (
        <div className="mt-5">
          <p className="text-[13px] mb-2">
            Please provide details of these family members:
          </p>
          <textarea
            className="w-full h-[100px] border border-gray-400 rounded px-3 py-2 text-sm"
            value={(data.familyDetails as string) || ""}
            onChange={(e) => set("familyDetails", e.target.value)}
            placeholder="Name, Relationship, Date of Birth..."
          />
        </div>
      )}
    </div>
  );
};
