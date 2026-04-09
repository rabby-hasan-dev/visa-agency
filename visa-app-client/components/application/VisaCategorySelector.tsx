"use client";

import { useState } from "react";
import { useGetVisaTypesQuery } from "@/redux/api/visaTypeApi";
import { TVisaType } from "@/types/visaTypes";

interface VisaCategorySelectorProps {
  // Returns the selected visaType _id (from DB)
  onSelect: (visaTypeId: string, visaName: string) => void;
  isLoading: boolean;
}

// Group visa types by their category field
const groupByCategory = (
  visaTypes: TVisaType[],
): Record<string, TVisaType[]> => {
  return visaTypes.reduce(
    (acc, vt) => {
      const cat = vt.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(vt);
      return acc;
    },
    {} as Record<string, TVisaType[]>,
  );
};

export const VisaCategorySelector = ({
  onSelect,
  isLoading,
}: VisaCategorySelectorProps) => {
  const { data, isLoading: isFetching } = useGetVisaTypesQuery({});
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Support both { data: { result: [] } } and { data: [] } shapes
  const visaTypes = (
    (data?.data?.result ?? data?.data ?? []) as TVisaType[]
  ).filter((vt) => vt.isActive);

  const grouped = groupByCategory(visaTypes);
  const categories = Object.keys(grouped).sort();

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  };

  return (
    <div className="bg-white border border-gray-200 mt-2 py-2.5">
      <div className="px-5 pb-2.5 border-b border-gray-300 mb-2.5">
        <h1 className="text-[16px] font-bold text-[#1a2b4a]">
          Please select the visa subclass you wish to apply for:
        </h1>
      </div>

      {isFetching || isLoading ? (
        <div className="p-10 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">
            {isLoading
              ? "Initializing your application..."
              : "Loading visa types..."}
          </p>
        </div>
      ) : categories.length === 0 ? (
        <div className="px-5 py-6 text-gray-500 text-sm">
          No active visa types available. Please contact support.
        </div>
      ) : (
        <div className="px-2.5">
          {categories.map((cat) => (
            <div key={cat} className="border-b border-gray-100">
              <div
                onClick={() => toggleCategory(cat)}
                className={`flex items-center gap-2 cursor-pointer text-xs sm:text-[11.5px] font-bold text-[#00264d] py-3 sm:py-1.5 px-3 sm:px-2 ${
                  expandedCategories.includes(cat)
                    ? "bg-blue-50"
                    : "hover:bg-gray-100"
                } transition-colors border-b border-gray-100 sm:border-0`}
              >
                <span
                  className={`text-[9px] text-gray-400 w-4 transition-transform ${
                    expandedCategories.includes(cat) ? "rotate-90" : ""
                  }`}
                >
                  ▶
                </span>
                {cat}
              </div>

              {expandedCategories.includes(cat) && (
                <div className="pl-[26px] pb-2.5">
                  {grouped[cat].map((vt) => (
                    <div
                      key={vt._id}
                      onClick={() => onSelect(vt._id, vt.name)}
                      className="py-4 px-2 cursor-pointer transition-colors text-[#2150a0] hover:bg-blue-50 rounded-md flex flex-col"
                    >
                      <span className="text-[14px] font-medium">{vt.name}</span>
                      {vt.description && (
                        <span className="text-gray-500 text-[12px] mt-0.5">
                          {vt.description}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
