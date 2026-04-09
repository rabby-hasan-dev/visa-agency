import React from "react";

interface FieldRowProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export const FieldRow = ({
  label,
  required,
  hint,
  children,
  className = "",
}: FieldRowProps) => (
  <div
    className={`grid grid-cols-[280px_1fr] items-start gap-3 mb-2.5 ${className}`}
  >
    <label className="text-[13px] text-gray-800 pt-1.5">
      {label}
      {required && <span className="text-red-600"> *</span>}
      {hint && (
        <span
          title={hint}
          className="inline-block ml-1 bg-[#2150a0] text-white rounded-full w-4 h-4 text-center text-[11px] leading-4 cursor-help"
        >
          ?
        </span>
      )}
    </label>
    <div>{children}</div>
  </div>
);
