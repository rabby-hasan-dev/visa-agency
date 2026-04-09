"use client";

import Link from "next/link";

interface ApplicationSidebarProps {
  sidebarLinks?: string[];
  visaCategory?: string | null;
}

export const ApplicationSidebar = ({
  sidebarLinks,
  visaCategory,
}: ApplicationSidebarProps) => {
  const getVisaLandingRoute = (cat?: string | null) => {
    if (!cat) return "/visas";
    const lower = cat.toLowerCase();
    if (lower.includes("study") || lower.includes("student"))
      return "/visas/study";
    if (lower.includes("work")) return "/visas/work";
    if (lower.includes("visit") || lower.includes("tourist"))
      return "/visas/visitor";
    if (lower.includes("permanent") || lower.includes("resident"))
      return "/visas/permanent";
    return "/visas";
  };

  const route = getVisaLandingRoute(visaCategory);
  const baseName = visaCategory || "Visa";

  const dynamicLinks = [
    { label: `${baseName} information`, hash: "#information" },
    { label: `Visa details for ${baseName}`, hash: "#details" },
    { label: `Health requirements`, hash: "#health" },
    { label: `Visa Pricing Estimator`, hash: "#pricing" },
    { label: `Processing times`, hash: "#processing" },
  ];

  const linksToRender =
    sidebarLinks && sidebarLinks.length > 0
      ? sidebarLinks.map((l) => ({ label: l, hash: "" }))
      : dynamicLinks;

  return (
    <div className="w-full lg:w-[240px] shrink-0 order-2 lg:order-1">
      <div className="bg-[#1a2b4a] text-white text-[13px] font-semibold px-3 py-2 mb-0.5">
        Related Links
      </div>
      <div className="bg-white border border-gray-300 p-3 mb-4 text-xs">
        {linksToRender.map((l) => (
          <div key={l.label}>
            <Link
              href={`${route}${l.hash}`}
              target="_blank"
              className="text-[#2150a0] underline block mb-1 hover:text-[#1a408a] transition-colors"
            >
              {l.label}
            </Link>
          </div>
        ))}
      </div>
      <div className="bg-[#1a2b4a] text-white text-[13px] font-semibold px-3 py-2 mb-0.5">
        Online Resources
      </div>
      <div className="bg-white border border-gray-300 p-3 text-xs">
        <Link
          href="/"
          className="text-[#2150a0] underline block mb-1 hover:text-[#1a408a]"
        >
          Immigration homesite
        </Link>
        <Link
          href="/entering-and-leaving-australia"
          className="text-[#2150a0] underline block mb-1 hover:text-[#1a408a]"
        >
          Entering and leaving Australia
        </Link>
        <Link
          href="/citizenship"
          className="text-[#2150a0] underline block mb-1 hover:text-[#1a408a]"
        >
          Citizenship
        </Link>
        <Link
          href="/settlement"
          className="text-[#2150a0] underline block mb-1 hover:text-[#1a408a]"
        >
          Settlement
        </Link>
        <Link
          href="/support"
          className="text-[#2150a0] underline block mb-1 hover:text-[#1a408a]"
        >
          Help and support
        </Link>
        <Link
          href="/faqs"
          className="text-[#2150a0] underline block mb-1 hover:text-[#1a408a]"
        >
          FAQs
        </Link>
        <Link
          href="/contact"
          className="text-[#2150a0] underline block hover:text-[#1a408a]"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
};
