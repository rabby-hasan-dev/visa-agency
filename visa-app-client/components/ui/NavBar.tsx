import React from "react";
import Link from "next/link";

interface NavBarProps {
  onPrev?: () => void;
  onSave?: () => void;
  onNext: () => void;
  onPrint?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  isLoading?: boolean;
}

export const NavBar = ({
  onPrev,
  onSave,
  onPrint,
  onNext,
  isFirst,
  isLast,
  isLoading,
}: NavBarProps) => (
  <div className="flex flex-col sm:flex-row sm:justify-between mt-8 pt-5 border-t border-gray-200 gap-4 sm:gap-2">
    <div className="flex flex-wrap gap-2 order-2 sm:order-1">
      {!isFirst && (
        <button
          onClick={onPrev}
          className="flex-1 sm:flex-none text-xs px-4 py-2 border border-gray-400 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors whitespace-nowrap"
        >
          ⇦ Previous
        </button>
      )}
      {isLast && onSave && (
        <button
          onClick={onSave}
          className="flex-1 sm:flex-none text-xs px-4 py-2 border border-gray-400 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors whitespace-nowrap"
        >
          💾 Save
        </button>
      )}
      {isLast && (
        <button
          onClick={onPrint || (() => window.print())}
          className="flex-1 sm:flex-none text-xs px-4 py-2 border border-gray-400 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors whitespace-nowrap"
        >
          🖨 Print
        </button>
      )}
      <Link
        href="/applications"
        className="flex-1 sm:flex-none flex items-center justify-center text-xs px-4 py-2 border border-gray-400 bg-gray-100 rounded cursor-pointer no-underline text-gray-700 hover:bg-gray-200 transition-colors whitespace-nowrap"
      >
        &gt; My Account
      </Link>
    </div>
    <button
      onClick={onNext}
      disabled={isLoading}
      className={`order-1 sm:order-2 text-sm px-6 py-2.5 rounded font-bold transition-all active:scale-[0.98] w-full sm:w-auto ${
        isLast
          ? "bg-green-700 text-white hover:bg-green-800 border border-green-800"
          : "bg-[#2150a0] text-white hover:bg-[#1a408a] border border-[#1a408a]"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {isLoading ? "Saving..." : isLast ? "Submit ⇨" : "Next ⇨"}
    </button>
  </div>
);
