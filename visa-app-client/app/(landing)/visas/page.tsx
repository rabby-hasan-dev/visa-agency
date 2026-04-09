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
              Visas
            </div>
          </div>
          <Link href="/" className="hover:underline text-sm font-light">
            Back to Home
          </Link>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#00264d] mb-8 text-center border-b pb-4">Visas</h1>
        
        <div className="flex flex-col gap-12 text-left">
          <section id="information" className="scroll-mt-6">
            <h2 className="text-2xl font-bold text-[#2150a0] mb-4">Visa Information</h2>
            <p className="text-gray-700 leading-relaxed">
              Explore the different visa options available to visit, work, study or live. You can find the right visa for your needs based on your circumstances and intentions.
            </p>
          </section>

          <section id="details" className="scroll-mt-6">
            <h2 className="text-2xl font-bold text-[#2150a0] mb-4">Visa Details</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li><strong>Stay:</strong> Varies from a few days to indefinitely, depending on the visa.</li>
              <li><strong>Cost:</strong> Varies depending on the visa subclass.</li>
              <li><strong>With this visa you can:</strong> Do specific activities allowed under the visa granted. Make sure to check the conditions of your specific visa subclass.</li>
            </ul>
          </section>

          <section id="health" className="scroll-mt-6">
            <h2 className="text-2xl font-bold text-[#2150a0] mb-4">Health Requirements</h2>
            <p className="text-gray-700 leading-relaxed">
              To travel or migrate, you might need to meet our health requirements depending on the visa you apply for. We might ask you to attend health examinations before we can grant your visa.
            </p>
          </section>

          <section id="pricing" className="scroll-mt-6">
            <h2 className="text-2xl font-bold text-[#2150a0] mb-4">Visa Pricing Estimator</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To find out the cost of your specific visa, please check the specific category or use the Pricing Estimator tool online. Costs are subject to change.
            </p>
            <div className="bg-gray-100 p-4 border border-gray-300 rounded">
              <p className="text-[#00264d] font-semibold">Base application charge: Refer to individual visa pages for exact fees.</p>
            </div>
          </section>

          <section id="processing" className="scroll-mt-6">
            <h2 className="text-2xl font-bold text-[#2150a0] mb-4">Processing Times</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your application might take longer to process if:
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>you do not fill it in correctly</li>
              <li>you do not include all the documents we need or we need more information from you</li>
              <li>it takes us time to verify your information</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 text-center border-t pt-8">
            <Link href="/" className="bg-[#2150a0] text-white px-6 py-2 rounded font-bold hover:bg-[#153468] transition shadow-md">Return to Homepage</Link>
        </div>
      </div>
    </div>
  );
}
