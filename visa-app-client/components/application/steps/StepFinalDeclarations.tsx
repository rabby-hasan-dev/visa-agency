"use client";

import { SectionHeading, YesNo } from "@/components/ui";
import type { StepProps } from "@/types/application";

export const StepFinalDeclarations = ({ data, onChange }: StepProps) => {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });

  const declarations = [
    {
      key: "readUnderstood",
      label:
        "Have read and understood the information provided to them in this application.",
    },
    {
      key: "truthfulComplete",
      label:
        "Understand that the giving of false or misleading information is a serious offence.",
    },
    {
      key: "authoriseDisclosure",
      label:
        "Authorise the Department to make enquiries to verify the information provided in this application.",
    },
    {
      key: "consentCollection",
      label:
        "Give consent for the collection, use and disclosure of the applicant's personal information as described in the Department's privacy notice.",
    },
    {
      key: "consentLawEnforcement",
      label:
        "Give consent to Australian law enforcement agencies disclosing the applicant's biometric, biographical and criminal record information to the Department.",
    },
    {
      key: "readHealthInformation",
      label:
        "Have read and understood the health requirements for a visa to Australia.",
    },
    {
      key: "consentHealthService",
      label:
        "Give consent to the Department and its health service providers to collect and use health information for the purpose of assessing the applicant's health.",
    },
  ];

  return (
    <div>
      <SectionHeading>Declarations</SectionHeading>
      <p className="text-[13px] mb-3">The applicant declares that they:</p>
      {declarations.map((q) => (
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
