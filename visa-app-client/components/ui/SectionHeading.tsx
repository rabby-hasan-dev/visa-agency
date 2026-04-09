import React from "react";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionHeading = ({
  children,
  className = "",
}: SectionHeadingProps) => (
  <h3 className={`text-[#2150a0] font-bold text-[15px] mb-2 mt-5 ${className}`}>
    {children}
  </h3>
);
