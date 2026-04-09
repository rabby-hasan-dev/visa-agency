"use client";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { useState } from "react";
import { 
  ChevronDown, 
  HelpCircle, 
  MessageCircle, 
  Search,
  FileText,
  CreditCard
} from "lucide-react";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { TSiteSettings } from "@/types/settings";

export default function FAQPage() {
  const { data: siteResponse } = useGetSiteSettingsQuery({});
  const siteSettings = (siteResponse?.data || {}) as TSiteSettings;

  const [activeTab, setActiveTab] = useState("general");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const faqData = {
    general: [
      {
        q: "How do I start my visa application?",
        a: "To start your application, click on the 'Start Application' button on the home page or go to the registration page. Once you create an account, you can select your visa category and follow the step-by-step instructions."
      },
      {
        q: "Which countries do you provide visa services for?",
        a: "While we specialize in Australian migration, we also provide comprehensive visa processing services for the USA, UK, Canada, and various Schengen countries."
      },
      {
        q: "Do I need to visit your office in person?",
        a: `While we love meeting our clients at our ${siteSettings.address || "Dhaka"} office, many of our services can be handled completely online through our secure digital portal for your convenience.`
      }
    ],
    payments: [
      {
        q: "How are the visa fees calculated?",
        a: "Visa fees are calculated based on the official embassy rates. For Australian visas, we use a real-time exchange rate to convert AUD to BDT, ensuring transparency in your payment."
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards, mobile banking (bKash, Nagad), and net banking through our secure SSLCommerz payment gateway."
      },
      {
        q: "Are the payments secure?",
        a: "Yes, all payments are processed through SSLCommerz/Stripe, which are world-class secure payment gateways. We never store your card details."
      }
    ],
    process: [
      {
        q: "How long does the visa processing take?",
        a: "Processing times vary significantly depending on the visa subclass and the embassy's current workload. We provide estimated timelines during your initial consultation."
      },
      {
        q: "Can I track my application status?",
        a: "Absolutely! Once you login to your dashboard, you can see the real-time status of your application, uploaded documents, and any pending requirements."
      },
      {
        q: "What documents are required?",
        a: "Document requirements depend on the visa type. Generally, you'll need a valid passport, digital photos, academic records, and financial proofs. A detailed list will be provided once you start your application."
      }
    ]
  };

  const tabs = [
    { id: "general", label: "General", icon: HelpCircle },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "process", label: "Process", icon: FileText }
  ];

  return (
    <main className="bg-[#040d1a] min-h-screen font-sans text-gray-200">
      <Header />

      {/* ─── Hero Section ───────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-blue-600/10 to-transparent">
        <div className="max-w-7xl mx-auto px-6 relative z-20 text-center">
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-8">
            Frequently Asked <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Questions
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Find quick answers to common questions about our services, 
            application process, and payment security.
          </p>
          
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search for answers..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
            />
          </div>
        </div>
      </section>

      {/* ─── FAQ Content ────────────────────────────────────────────── */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 justify-center mb-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                activeTab === tab.id 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" 
                : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {(faqData[activeTab as keyof typeof faqData] || []).map((item, index) => {
            const itemId = index + (activeTab === 'payments' ? 10 : activeTab === 'process' ? 20 : 0);
            const isOpen = openItems.includes(itemId);
            
            return (
              <div 
                key={itemId}
                className={`group border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 ${
                  isOpen ? "bg-white/10 border-blue-500/30 shadow-2xl" : "bg-white/5 hover:bg-white/[0.08]"
                }`}
              >
                <button 
                  onClick={() => toggleItem(itemId)}
                  className="w-full p-6 text-left flex justify-between items-center gap-6"
                >
                  <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {item.q}
                  </span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-180 bg-blue-600/20" : ""}`}>
                    <ChevronDown size={18} className={isOpen ? "text-blue-400" : "text-gray-500"} />
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5 mt-2">
                    {item.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions? */}
        <div className="mt-24 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border border-blue-500/20 p-12 rounded-[3rem] text-center">
            <div className="inline-flex w-16 h-16 bg-blue-600 rounded-3xl items-center justify-center text-white mb-6">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Still have questions?</h3>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Our support team is here to help you. Reach out to us via call, 
              email or visit our office in {siteSettings.address || "Dhaka"}.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition">
                 Contact Support
               </Link>
               <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold transition">
                 Visit Help Center
               </button>
            </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
