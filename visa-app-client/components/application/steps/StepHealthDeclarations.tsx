"use client";

import { SectionHeading, YesNo } from "@/components/ui";
import type { StepProps } from "@/types/application";

export const StepHealthDeclarations = ({ data, onChange }: StepProps) => {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });

  const questions = [
    {
      key: "visitedOutsidePassport",
      label:
        "In the last five years, has any applicant visited, or lived, outside their country of passport, for more than 3 consecutive months? Do not include time spent in Australia.",
    },
    {
      key: "intendHospital",
      label:
        "Does any applicant intend to enter a hospital or a health care facility (including nursing homes) while in Australia?",
    },
    {
      key: "hasTB",
      label:
        "Has any applicant: ever had, or currently have, tuberculosis? been in close contact with a family member that has active tuberculosis? ever had a chest x-ray which showed an abnormality?",
    },
    {
      key: "expectMedicalCosts",
      label:
        "During their proposed visit to Australia, does any applicant expect to incur medical costs, or require treatment or medical follow up for: blood disorder, cancer, heart disease, hepatitis B or C and/or liver disease, HIV infection including AIDS, kidney disease including dialysis, mental illness, pregnancy, respiratory disease that has required hospital admission or oxygen therapy, other?",
    },
  ];

  return (
    <div>
      <SectionHeading>Health declarations</SectionHeading>
      {questions.map((q) => (
        <div key={q.key} className="mb-4 text-[13px]">
          <p className="mb-1.5">{q.label}</p>
          <YesNo
            name={q.key}
            value={(data[q.key] as boolean | null) ?? null}
            onChange={(v) => set(q.key, v)}
          />
        </div>
      ))}
    </div>
  );
};
