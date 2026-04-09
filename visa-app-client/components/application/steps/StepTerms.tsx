"use client";

import { SectionHeading } from "@/components/ui";
import type { StepProps } from "@/types/application";

export const StepTerms = ({ data, onChange }: StepProps) => {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });

  return (
    <div>
      <SectionHeading>Terms and Conditions</SectionHeading>
      <p className="text-[13px] mb-2">
        <a href="#" className="text-[#2150a0] underline">
          View Terms and Conditions
        </a>
      </p>
      <p className="text-[13px] mb-4">
        <a href="#" className="text-[#2150a0] underline">
          View Privacy statement
        </a>
      </p>
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-gradient-to-r from-[#5588cc] to-[#aabbdd] p-4 rounded text-white text-[13px] font-medium min-h-[80px] flex items-center justify-center text-center w-[200px] shrink-0">
          🏛️ Australian Government
          <br />
          Department of Home Affairs
        </div>
        <label className="flex gap-2 text-[13px] items-start cursor-pointer">
          <input
            type="checkbox"
            checked={!!data.agreed}
            onChange={(e) => set("agreed", e.target.checked)}
            className="mt-0.5 accent-[#2150a0] w-4 h-4"
          />
          I have read and agree to the terms and conditions
        </label>
      </div>
    </div>
  );
};
