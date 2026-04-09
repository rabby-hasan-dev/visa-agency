import React from "react";

interface YesNoProps {
  name: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
  hint?: string;
}

export const YesNo = ({ name, value, onChange, hint }: YesNoProps) => (
  <span className="inline-flex items-center gap-4 text-[13px]">
    <label className="flex items-center gap-1 cursor-pointer">
      <input
        type="radio"
        name={name}
        checked={value === true}
        onChange={() => onChange(true)}
        className="accent-[#2150a0] w-3.5 h-3.5"
      />
      Yes
    </label>
    <label className="flex items-center gap-1 cursor-pointer">
      <input
        type="radio"
        name={name}
        checked={value === false}
        onChange={() => onChange(false)}
        className="accent-[#2150a0] w-3.5 h-3.5"
      />
      No
    </label>
    {hint && (
      <span
        title={hint}
        className="bg-[#2150a0] text-white rounded-full w-4 h-4 text-center text-[11px] leading-4 cursor-help shrink-0"
      >
        ?
      </span>
    )}
  </span>
);
