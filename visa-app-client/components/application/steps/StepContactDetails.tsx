"use client";

import { SectionHeading, FieldRow } from "@/components/ui";
import { COUNTRIES } from "@/constants/countries";
import type { StepProps } from "@/types/application";

const inputCls =
  "border border-gray-400 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600";
const selectCls =
  "border border-gray-400 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-600";

export const StepContactDetails = ({ data, onChange }: StepProps) => {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });

  return (
    <div>
      <SectionHeading>Contact details</SectionHeading>
      <SectionHeading>Country of residence</SectionHeading>
      <FieldRow label="Usual country of residence">
        <select
          className={`${selectCls} w-[280px]`}
          value={(data.countryOfResidence as string) || ""}
          onChange={(e) => set("countryOfResidence", e.target.value)}
        >
          <option value="">Select country...</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </FieldRow>

      <SectionHeading>Residential address</SectionHeading>
      <FieldRow label="Address line 1" required>
        <input
          className={`${inputCls} w-[300px]`}
          value={(data.address1 as string) || ""}
          onChange={(e) => set("address1", e.target.value)}
        />
      </FieldRow>
      <FieldRow label="Address line 2">
        <input
          className={`${inputCls} w-[300px]`}
          value={(data.address2 as string) || ""}
          onChange={(e) => set("address2", e.target.value)}
        />
      </FieldRow>
      <FieldRow label="Suburb / Town">
        <input
          className={`${inputCls} w-[200px]`}
          value={(data.suburb as string) || ""}
          onChange={(e) => set("suburb", e.target.value)}
        />
      </FieldRow>
      <FieldRow label="State / Province">
        <input
          className={`${inputCls} w-[200px]`}
          value={(data.state as string) || ""}
          onChange={(e) => set("state", e.target.value)}
        />
      </FieldRow>
      <FieldRow label="Postal code">
        <input
          className={`${inputCls} w-[120px]`}
          value={(data.postcode as string) || ""}
          onChange={(e) => set("postcode", e.target.value)}
        />
      </FieldRow>
      <FieldRow label="Country">
        <select
          className={`${selectCls} w-[280px]`}
          value={(data.country as string) || ""}
          onChange={(e) => set("country", e.target.value)}
        >
          <option value="">Select country...</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </FieldRow>

      <SectionHeading>Phone</SectionHeading>
      <FieldRow label="Phone number" required>
        <input
          className={`${inputCls} w-[200px]`}
          value={(data.phone as string) || ""}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="+880 1XXXXXX"
        />
      </FieldRow>

      <SectionHeading>Email</SectionHeading>
      <FieldRow label="Email address" required>
        <input
          type="email"
          className={`${inputCls} w-[280px]`}
          value={(data.email as string) || ""}
          onChange={(e) => set("email", e.target.value)}
        />
      </FieldRow>
    </div>
  );
};
