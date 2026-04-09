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
              VEVO
            </div>
          </div>
          <Link href="/" className="hover:underline text-sm font-light">
            Back to Home
          </Link>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-[#00264d] mb-12 text-center border-b pb-4">Visa Entitlement Verification Online (VEVO)</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-left">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
            <h2 className="text-xl font-bold text-[#2150a0] mb-4">VEVO for Visa Holders</h2>
            <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
              Check your own visa details, including conditions, expiry dates, and work rights. You can also send your visa details to any email address to prove your entitlement to employers or institutions.
            </p>
            <Link href="/" className="text-[#2150a0] font-semibold hover:underline">Check your own visa details →</Link>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
            <h2 className="text-xl font-bold text-[#2150a0] mb-4">VEVO for Organisations</h2>
            <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
              Registered organisations can use VEVO to check the visa details of a non-citizen. Essential for employers, education providers, and other registered entities fulfilling compliance obligations.
            </p>
            <Link href="/" className="text-[#2150a0] font-semibold hover:underline">Check someone else&apos;s details →</Link>
          </div>
        </div>

        <div className="bg-[#e6f0fa] p-8 rounded-lg border border-[#b3d4f5] text-center">
            <h3 className="text-xl font-bold text-[#00264d] mb-2">Need to register?</h3>
            <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
              If you are an organisation checking the visa status of an employee or student for the first time, you must register an account to access VEVO. Visa holders do not need to register.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register" className="bg-[#2150a0] text-white px-6 py-2 rounded font-bold hover:bg-[#153468] transition inline-block">Register your organisation</Link>
            </div>
        </div>
      </div>
    </div>
  );
}
