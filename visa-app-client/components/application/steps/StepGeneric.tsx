"use client";

import { SectionHeading } from "@/components/ui";
import type { StepProps } from "@/types/application";

export const StepGeneric = ({
  data,
  onChange,
  label,
}: StepProps & { label: string }) => {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });

  return (
    <div>
      <SectionHeading>{label}</SectionHeading>
      <div className="p-5 bg-amber-50 border border-amber-200 rounded mb-5">
        <p className="text-[13px] text-amber-800">
          <strong>Note:</strong> This step is currently a placeholder for
          additional information required for this visa category.
        </p>
      </div>
      <p className="text-sm mb-4">
        Please provide any additional details relevant to &quot;{label}&quot;:
      </p>
      <textarea
        className="w-full h-[150px] border border-gray-400 rounded px-3 py-2.5 text-sm resize-y"
        value={(data.notes as string) || ""}
        onChange={(e) => set("notes", e.target.value)}
        placeholder="Enter details here..."
      />
    </div>
  );
};
