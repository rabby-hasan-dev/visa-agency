import React, { useState } from "react";
import { ApplicationData } from "./types";

export const HealthAssessmentTab = ({
  application,
}: {
  application: ApplicationData;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="font-sans animate-in fade-in duration-500 text-[#333]">
      <div className="flex justify-between items-center mb-[10px]">
        <h2 className="text-[#2150a0] font-bold text-[15px] flex items-center gap-[5px]">
          Health assessment
          <div className="bg-[#00264d] text-white rounded-full w-[14px] h-[14px] text-[10px] flex items-center justify-center font-bold">?</div>
        </h2>
      </div>

      <div 
        className={`border-t-2 border-[#ff9933] bg-white mb-[15px] ${
          isExpanded ? "border-b border-l border-r border-[#ccc]" : "border-none"
        }`}
      >
        <div 
          className={`p-2 px-2.5 flex items-start gap-2.5 bg-[#f8f8f8] ${
            isExpanded ? "border-b border-[#ccc]" : "border-none"
          }`}
        >
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-[14px] font-bold text-[#333] bg-transparent border-none cursor-pointer px-[5px]">
            {isExpanded ? "-" : "+"}
          </button>
          <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="text-[#2150a0] text-[13px] flex gap-[5px] uppercase">
              <span>{application.clientId?.name || "APPLICANT"}</span>
              <span className="normal-case">{application.clientId?.dateOfBirth ? `(${new Date(application.clientId.dateOfBirth).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })})` : ""}</span>
            </div>
            <div className={`text-[12px] text-[#333] mt-0.5 ${isExpanded ? "mb-0" : "mb-2"}`}>
              No examinations required
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="p-[15px] text-[12px] text-[#333] leading-[1.4]">
            Health has been finalised for this person for this visa subclass based on the information provided to the department. If this person needs to do anything further to meet the health requirement, they will be contacted by the department. There is no need to contact the department at this time concerning this matter.
          </div>
        )}
      </div>
    </div>
  );
};
