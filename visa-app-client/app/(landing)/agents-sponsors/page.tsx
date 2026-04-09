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
              Agents and Sponsors
            </div>
          </div>
          <Link href="/" className="hover:underline text-sm font-light">
            Back to Home
          </Link>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-[#00264d] mb-12 text-center border-b pb-4">Agents and Sponsors</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 text-left">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
            <h2 className="text-xl font-bold text-[#2150a0] mb-4">Registered Migration Agents</h2>
            <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
              Information for registered migration agents on how to lodge applications, manage client accounts, and comply with the code of conduct. Find out how to become a registered agent.
            </p>
            <Link href="/" className="text-[#2150a0] font-semibold hover:underline">Information for agents →</Link>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
            <h2 className="text-xl font-bold text-[#2150a0] mb-4">Employing overseas workers</h2>
            <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
              Learn about your obligations as a sponsor, how to become an approved sponsor, and the different visa subclasses available to bring skilled workers to your business.
            </p>
            <Link href="/" className="text-[#2150a0] font-semibold hover:underline">Information for sponsors →</Link>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
            <h2 className="text-xl font-bold text-[#2150a0] mb-4">VEVO for Organisations</h2>
            <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
              Use the Visa Entitlement Verification Online (VEVO) system to check the visa details and conditions of workers, students, and other temporary residents.
            </p>
            <Link href="/vevo" className="text-[#2150a0] font-semibold hover:underline">Access VEVO →</Link>
          </div>
        </div>

        <div className="bg-[#e6f0fa] p-8 rounded-lg border border-[#b3d4f5] text-center">
            <h3 className="text-xl font-bold text-[#00264d] mb-2">ImmiAccount for Organisations</h3>
            <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
              Register for an organisational ImmiAccount to manage multiple applications, link your business systems, and access bulk online lodgement services. It is designed to streamline processes for high-volume users.
            </p>
            <Link href="/register" className="bg-[#2150a0] text-white px-6 py-2 rounded font-bold hover:bg-[#153468] transition inline-block">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
