"use client";

export default function DisclaimerPage() {
  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <div className="bg-[#1a2b4a] h-11 flex items-center px-5 text-white text-lg font-bold">
        Disclaimer
      </div>
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="bg-white border border-gray-300 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-[#2150a0] mb-6">
            Website Disclaimer
          </h1>

          <h2 className="text-lg font-bold text-[#1a2b4a] mt-6 mb-3">
            No Legal Advice
          </h2>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            The information contained on this website is for general
            informational purposes only and does not constitute legal or
            migration advice. While we endeavor to keep the information up to
            date and correct, we make no representations or warranties of any
            kind regarding the completeness, accuracy, reliability, or
            suitability of the website or the information contained herein.
          </p>

          <h2 className="text-lg font-bold text-[#1a2b4a] mt-6 mb-3">
            External Links
          </h2>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            Through this website you may be able to link to other websites which
            are not under the control of the Department. We have no control over
            the nature, content and availability of those sites. The inclusion
            of any links does not necessarily imply a recommendation or endorse
            the views expressed within them.
          </p>

          <h2 className="text-lg font-bold text-[#1a2b4a] mt-6 mb-3">
            Liability
          </h2>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            In no event will we be liable for any loss or damage including
            without limitation, indirect or consequential loss or damage,
            arising out of, or in connection with, the use of this website.
          </p>
        </div>
      </div>
    </div>
  );
}

