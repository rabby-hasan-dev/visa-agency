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
              Find a Visa
            </div>
          </div>
          <Link href="/" className="hover:underline text-sm font-light">
            Back to Home
          </Link>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-[#00264d] mb-12 text-center border-b pb-4">Find a Visa</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-left">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
            <h2 className="text-xl font-bold text-[#2150a0] mb-4">Visa Finder online tool</h2>
            <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
              Not sure which visa you need? Use our Visa Finder tool to explore your options based on your reasons for traveling, your passport, and how long you intend to stay.
            </p>
            <Link href="/" className="text-[#2150a0] font-semibold hover:underline">Launch Visa Finder →</Link>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
            <h2 className="text-xl font-bold text-[#2150a0] mb-4">Browse all visas</h2>
            <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
              View a complete list of all our visa sub-classes, categorized by purpose including Visiting, Studying, Working, and Living permanently.
            </p>
            <Link href="/visas" className="text-[#2150a0] font-semibold hover:underline">View all visas →</Link>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
            <h2 className="text-xl font-bold text-[#2150a0] mb-4">Check recent changes</h2>
            <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
              Stay up to date with the latest changes to our immigration programs, including updates to skills lists, processing times, and new visa conditions.
            </p>
            <Link href="/" className="text-[#2150a0] font-semibold hover:underline">Read the latest news →</Link>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
            <h2 className="text-xl font-bold text-[#2150a0] mb-4">Get professional help</h2>
            <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
              If your situation is complex, you might want to use a registered migration agent to help you navigate the process and choose the correct visa.
            </p>
            <Link href="/agents-sponsors" className="text-[#2150a0] font-semibold hover:underline">Find a registered agent →</Link>
          </div>
        </div>

        <div className="bg-[#e6f0fa] p-8 rounded-lg border border-[#b3d4f5] text-center">
            <h3 className="text-xl font-bold text-[#00264d] mb-2">Ready to apply?</h3>
            <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
              If you already know which visa you need, you can start an application immediately through ImmiAccount. Note that not all visas can be applied for online.
            </p>
            <Link href="/login" className="bg-[#2150a0] text-white px-6 py-2 rounded font-bold hover:bg-[#153468] transition inline-block">Login to ImmiAccount</Link>
        </div>
      </div>
    </div>
  );
}
