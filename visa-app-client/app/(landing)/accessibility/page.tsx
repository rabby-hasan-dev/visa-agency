"use client";

export default function AccessibilityPage() {
  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <div className="bg-[#1a2b4a] h-11 flex items-center px-5 text-white text-lg font-bold">
        Accessibility
      </div>
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="bg-white border border-gray-300 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-[#2150a0] mb-6">
            Accessibility Statement
          </h1>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            The Department of Home Affairs is committed to ensuring digital
            accessibility for people with disabilities. We are continually
            improving the user experience for everyone, and applying the
            relevant accessibility standards.
          </p>
          <h2 className="text-lg font-bold text-[#1a2b4a] mt-6 mb-3">
            Measures to support accessibility
          </h2>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            We take the following measures to ensure accessibility of our
            services:
          </p>
          <ul className="list-disc ml-6 text-sm text-gray-700 space-y-2 mb-6">
            <li>Include accessibility throughout our internal policies.</li>
            <li>Assign clear accessibility goals and responsibilities.</li>
            <li>Employ formal accessibility quality assurance methods.</li>
          </ul>
          <h2 className="text-lg font-bold text-[#1a2b4a] mt-6 mb-3">
            Conformance status
          </h2>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            The Web Content Accessibility Guidelines (WCAC) defines requirements
            for designers and developers to improve accessibility for people
            with disabilities. It defines three levels of conformance: Level A,
            Level AA, and Level AAA. This portal is partially conformant with
            WCAG 2.1 level AA.
          </p>
        </div>
      </div>
    </div>
  );
}

