"use client";
import Link from "next/link";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { TSiteSettings } from "@/types/settings";


export default function Page() {
  const { data: siteResponse } = useGetSiteSettingsQuery({});

  const siteSettings = (siteResponse?.data ?? {
    siteName: "ImmiAccount",
    brandName: "Australian Government",
    departmentName: "Department of Home Affairs",
  }) as TSiteSettings;

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      <header className="bg-[#00264d] text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex flex-col border-r border-white/30 pr-4">
              <span className="font-bold text-lg leading-tight tracking-wide">
                {siteSettings.brandName}
              </span>
              <span className="text-sm font-light">
                {siteSettings.departmentName}
              </span>
            </div>
            <div className="pl-2 font-light text-xl tracking-wide hidden sm:block">
              Citizenship
            </div>
          </div>
          <Link href="/" className="hover:underline text-sm font-light">
            Back to Home
          </Link>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-[#00264d] mb-12 text-center border-b pb-4">Citizenship</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 text-left">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
            <h2 className="text-xl font-bold text-[#2150a0] mb-4">Become a citizen</h2>
            <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
              Learn about the different ways to become a citizen, the eligibility criteria, and the application process. Check if you are eligible to apply today.
            </p>
            <Link href="/" className="text-[#2150a0] font-semibold hover:underline">Read more →</Link>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
            <h2 className="text-xl font-bold text-[#2150a0] mb-4">Citizenship test and interview</h2>
            <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
              Information to help you prepare for the citizenship test, including practice materials, test rules, and what to expect during your interview.
            </p>
            <Link href="/" className="text-[#2150a0] font-semibold hover:underline">Read more →</Link>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
            <h2 className="text-xl font-bold text-[#2150a0] mb-4">Your citizenship certificate</h2>
            <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
              Find out how to get a certificate, replace a lost or stolen certificate, or update the details on your certificate.
            </p>
            <Link href="/" className="text-[#2150a0] font-semibold hover:underline">Read more →</Link>
          </div>
        </div>

        <div className="bg-[#e6f0fa] p-8 rounded-lg border border-[#b3d4f5] text-center">
            <h3 className="text-xl font-bold text-[#00264d] mb-2">Pledge of commitment</h3>
            <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
              The final step in becoming a citizen is making the Pledge of commitment at a citizenship ceremony. This represents your commitment to our nation and its values.
            </p>
            <Link href="/" className="bg-[#2150a0] text-white px-6 py-2 rounded font-bold hover:bg-[#153468] transition inline-block">Return to Homepage</Link>
        </div>
      </div>
    </div>
  );
}
