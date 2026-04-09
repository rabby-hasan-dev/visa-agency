"use client";

import { SectionHeading, FieldRow, YesNo } from "@/components/ui";
import type { StepProps } from "@/types/application";

const inputCls =
  "border border-gray-400 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600";

export const StepAuthorisedRecipient = ({ data, onChange }: StepProps) => {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });

  return (
    <div>
      <SectionHeading>
        Authorised recipient of written correspondence
      </SectionHeading>
      <p className="text-[13px] mb-4">
        An authorised recipient is a person authorised by the applicant to
        receive written correspondence on their behalf. This person does not
        have to be a registered migration agent.
      </p>

      <div className="mb-2.5 text-[13px]">
        <p className="mb-1.5">
          Does the applicant authorise another person to receive written
          correspondence on their behalf?
        </p>
        <YesNo
          name="hasAuthorisedRecipient"
          value={(data.hasAuthorisedRecipient as boolean | null) ?? null}
          onChange={(v) => set("hasAuthorisedRecipient", v)}
        />
      </div>

      {(data.hasAuthorisedRecipient as boolean) && (
        <div className="mt-4">
          <FieldRow label="Family name">
            <input
              className={`${inputCls} w-[260px]`}
              value={(data.recipientFamilyName as string) || ""}
              onChange={(e) => set("recipientFamilyName", e.target.value)}
            />
          </FieldRow>
          <FieldRow label="Given names">
            <input
              className={`${inputCls} w-[260px]`}
              value={(data.recipientGivenNames as string) || ""}
              onChange={(e) => set("recipientGivenNames", e.target.value)}
            />
          </FieldRow>
          <FieldRow label="Phone number">
            <input
              className={`${inputCls} w-[200px]`}
              value={(data.recipientPhone as string) || ""}
              onChange={(e) => set("recipientPhone", e.target.value)}
            />
          </FieldRow>
          <FieldRow label="Email">
            <input
              type="email"
              className={`${inputCls} w-[280px]`}
              value={(data.recipientEmail as string) || ""}
              onChange={(e) => set("recipientEmail", e.target.value)}
            />
          </FieldRow>
        </div>
      )}
    </div>
  );
};
