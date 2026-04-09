"use client";

import { SectionHeading, YesNo } from "@/components/ui";
import type { StepProps } from "@/types/application";

export const StepCharacterDeclarations = ({ data, onChange }: StepProps) => {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });

  const questions = [
    {
      key: "criminalOffence",
      label:
        "Has any applicant ever been convicted of a criminal offence in any country (including any conviction which is now removed from official records)?",
    },
    {
      key: "chargedWithOffence",
      label:
        "Has any applicant ever been charged with a criminal offence that is currently awaiting legal action?",
    },
    {
      key: "acquittedOffence",
      label:
        "Has any applicant ever been acquitted of a criminal offence on the grounds of mental illness, insanity or unsoundness of mind?",
    },
    {
      key: "removedDeported",
      label:
        "Has any applicant ever been removed, deported or excluded from any country (including Australia)?",
    },
    {
      key: "visaRefused",
      label:
        "Has any applicant ever had a visa for any country (including Australia) cancelled or refused?",
    },
    {
      key: "overstayed",
      label:
        "Has any applicant ever overstayed a visa in any country (including Australia)?",
    },
  ];

  return (
    <div>
      <SectionHeading>Character declarations</SectionHeading>
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
