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

  const brandPrefix = siteSettings.brandName.split(" ")[0];
  const countryName = brandPrefix.endsWith("ian") ? brandPrefix.slice(0, -3) + "ia" : brandPrefix;

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
              Entering and Leaving {countryName}
            </div>
          </div>
          <Link href="/" className="hover:underline text-sm font-light">
            Back to Home
          </Link>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-[#00264d] mb-12 text-center border-b pb-4">Entering and Leaving {countryName}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-[#2150a0] mb-4">Entering {countryName}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All travellers, except {countryName} citizens, must hold a valid visa or electronic travel authority to enter the country.
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Check your visa details and conditions before you travel</li>
              <li>Ensure your passport is valid for at least six months</li>
              <li>Complete the Incoming Passenger Card upon arrival</li>
              <li>Declare goods subject to biosecurity control</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-[#2150a0] mb-4">Leaving {countryName}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you hold a temporary or provisional visa, make sure you know when your visa expires before leaving, and whether you have a multiple entry facility.
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Check your visa expiry and conditions if you plan to return</li>
              <li>Plan your departure to avoid overstaying your visa</li>
              <li>Claim the Tourist Refund Scheme (TRS) if eligible</li>
            </ul>
          </div>
        </div>

        <div className="bg-[#e6f0fa] p-8 rounded-lg border border-[#b3d4f5] text-center">
            <h3 className="text-xl font-bold text-[#00264d] mb-2">Border clearance and security</h3>
            <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
              Our border screening processes ensure the safety and security of {countryName}. Please be prepared to present your passport, completed passenger cards, and any required documentation to Border Force officers.
            </p>
            <Link href="/" className="bg-[#2150a0] text-white px-6 py-2 rounded font-bold hover:bg-[#153468] transition inline-block">Return to Homepage</Link>
        </div>
      </div>
    </div>
  );
}
