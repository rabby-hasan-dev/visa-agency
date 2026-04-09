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
              Access and Support
            </div>
          </div>
          <Link href="/" className="hover:underline text-sm font-light">
            Back to Home
          </Link>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-[#00264d] mb-12 text-center border-b pb-4">Access and Support</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 text-left">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
            <h2 className="text-xl font-bold text-[#2150a0] mb-4">Accessibility</h2>
            <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
              We are committed to providing a website that is accessible to the widest possible audience, regardless of technology or ability. Find out about our accessibility standards and tools.
            </p>
            <Link href="/legal#accessibility" className="text-[#2150a0] font-semibold hover:underline">Accessibility statement →</Link>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
            <h2 className="text-xl font-bold text-[#2150a0] mb-4">Language assistance</h2>
            <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
              If you need an interpreter, call the Translating and Interpreting Service (TIS National) or browse our translated resources library.
            </p>
            <Link href="/" className="text-[#2150a0] font-semibold hover:underline">Find translated information →</Link>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
            <h2 className="text-xl font-bold text-[#2150a0] mb-4">National Relay Service</h2>
            <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
              If you are deaf, or have a hearing or speech impairment, contact us through the National Relay Service. Check how to use the different relay methods.
            </p>
            <Link href="/" className="text-[#2150a0] font-semibold hover:underline">Relay services →</Link>
          </div>
        </div>

        <div className="bg-[#e6f0fa] p-8 rounded-lg border border-[#b3d4f5] text-center">
            <h3 className="text-xl font-bold text-[#00264d] mb-2">Technical Help</h3>
            <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
              Having trouble logging in or using our online services? Check our technical support section for guides, system requirements, and troubleshooting advice.
            </p>
            <Link href="/support" className="bg-[#2150a0] text-white px-6 py-2 rounded font-bold hover:bg-[#153468] transition inline-block">Go to Technical Support</Link>
        </div>
      </div>
    </div>
  );
}
