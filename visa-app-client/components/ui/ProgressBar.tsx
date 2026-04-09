import React from "react";

interface ProgressBarProps {
  step: number;
  total: number;
  trn?: string;
}

export const ProgressBar = ({ step, total, trn }: ProgressBarProps) => {
  const pct = Math.round((step / total) * 100);

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
        <span>
          Step {step} of {total}
        </span>
        {trn && <span>TRN: {trn}</span>}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-[#2150a0] h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
