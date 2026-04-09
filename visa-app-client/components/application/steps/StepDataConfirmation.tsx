"use client";

import { SectionHeading, YesNo } from "@/components/ui";
import type { StepProps } from "@/types/application";

export const StepDataConfirmation = ({
  data,
  onChange,
  step3Data,
}: StepProps & { step3Data: Record<string, unknown> }) => {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });

  return (
    <div>
      <SectionHeading>Critical data confirmation</SectionHeading>
      <p className="text-[13px] mb-2">
        All information provided is important to the processing of this
        application.
      </p>
      <p className="text-[13px] mb-2">
        If the information included on this page is incorrect, it may lead to
        denial of permission to board an aircraft to Australia, even if a visa
        has been granted.
      </p>
      <p className="text-[13px] font-semibold mb-4">
        Confirm that the following information is correct and that it is in the
        correct fields.
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-4">
        {[
          ["Family name", step3Data?.familyName],
          ["Given names", step3Data?.givenNames],
          ["Sex", step3Data?.sex],
          ["Date of birth", step3Data?.dateOfBirth],
          ["Country of birth", step3Data?.countryOfBirth],
          ["Passport number", step3Data?.passportNumber],
          ["Country of passport", step3Data?.countryOfPassport],
        ].map(([label, val]) => (
          <div
            key={label as string}
            className="grid grid-cols-[200px_1fr] gap-2 mb-2 text-[13px]"
          >
            <span className="text-gray-500">{label as string}</span>
            <span className="font-medium">{(val as string) || "—"}</span>
          </div>
        ))}
      </div>

      <div className="text-[13px] mt-2">
        <p className="mb-1.5">Is the above information correct?</p>
        <YesNo
          name="criticalDataCorrect"
          value={(data.criticalDataCorrect as boolean | null) ?? null}
          onChange={(v) => set("criticalDataCorrect", v)}
        />
      </div>
    </div>
  );
};
