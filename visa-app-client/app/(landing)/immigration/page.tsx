"use client";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { 
  ShieldCheck, 
  MapPin, 
  Globe, 
  CheckCircle2, 
  ArrowRight,
  Briefcase,
  Users,
  Search,
  FileText
} from "lucide-react";
import Link from "next/link";

export default function ImmigrationPage() {
  return (
    <main className="bg-[#040d1a] min-h-screen font-sans text-gray-200 overflow-x-hidden">
      <Header />

      {/* ─── Hero Section ───────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#040d1a] via-[#040d1a]/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040d1a] to-transparent z-10" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
              Australian Migration Specialist
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-8">
              Expert Guidance for your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Immigration Journey
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl">
              We provide professional immigration services tailored to your needs. 
              Our licensed experts in Dhaka specialize in Australian visas, 
              skilled migration, and corporate solutions.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Visa Categories ────────────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Skilled Migration",
              desc: "Points-based migration pathways for professionals seeking permanent residency in Australia.",
              icon: Briefcase,
              items: ["Subclass 189", "Subclass 190", "Subclass 491"]
            },
            {
              title: "Family & Partner",
              desc: "Reunite with your loved ones through partner, parent, and child visa subclasses.",
              icon: Users,
              items: ["Partner Visas", "Parent Visas", "Child Visas"]
            },
            {
              title: "Business & Investment",
              desc: "Pathways for entrepreneurs and investors to establish or grow businesses in Australia.",
              icon: Globe,
              items: ["Subclass 188", "Subclass 888", "Subclass 132"]
            },
            {
              title: "Student Visas",
              desc: "Unlock educational opportunities in top-tier Australian universities and colleges.",
              icon: Search,
              items: ["Subclass 500", "Guardian Visa", "English Courses"]
            },
            {
              title: "Work & Employment",
              desc: "Employer-sponsored visas for skilled workers with job offers from Australian companies.",
              icon: FileText,
              items: ["Subclass 482", "Subclass 186", "Subclass 494"]
            },
            {
              title: "Visitor & Tourist",
              desc: "Short-term visas for leisure, business visits, or visiting family and friends.",
              icon: MapPin,
              items: ["Subclass 600", "ETA", "eVisitor"]
            }
          ].map((cat, idx) => (
            <div 
              key={idx}
              className="group p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/[0.08] hover:border-blue-500/30 transition duration-300"
            >
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                <cat.icon size={28} className="text-blue-400" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">{cat.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {cat.desc}
              </p>
              <ul className="space-y-3 mb-8">
                {cat.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 size={14} className="text-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="inline-flex items-center gap-2 text-blue-400 font-bold text-sm hover:gap-3 transition-all">
                Check Eligibility <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Why Choose Us ─────────────────────────────────────────── */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em] mb-4">Our Expertise</h2>
            <h3 className="text-4xl lg:text-5xl font-bold text-white mb-8">Why Navigate with Us?</h3>
            <div className="space-y-8">
              {[
                {
                  title: "Licensed Professionals",
                  desc: "Our team consists of experts with deep knowledge of Australian migration law and procedures."
                },
                {
                  title: "Dhaka-Based Support",
                  desc: "We provide local accessibility with global standards, understanding the specific needs of Bangladeshi applicants."
                },
                {
                  title: "End-to-End Assistance",
                  desc: "From initial assessment to visa grant and post-arrival support, we are with you at every step."
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] overflow-hidden border border-white/10 relative">
              <div className="absolute inset-0 bg-blue-600/20 mix-blend-overlay" />
              <img 
                src="https://images.unsplash.com/photo-1436491865332-7a61a109c055?q=80&w=2070&auto=format&fit=crop" 
                alt="Australian House of Parliament" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-[#040d1a] border border-white/10 p-8 rounded-[2rem] shadow-2xl z-20">
              <div className="text-4xl font-black text-blue-500 mb-1">98%</div>
              <div className="text-xs uppercase tracking-widest text-white font-bold font-mono">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ───────────────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Start Your Australian Chapter?</h3>
            <p className="text-blue-100 text-lg mb-10 leading-relaxed">
              Book a comprehensive consultation with our licensed experts today and discover your best pathway to Australia.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link
                href="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-gray-100 transition shadow-xl"
              >
                Start Assessment
              </Link>
              <Link
                href="/contact"
                className="bg-blue-500/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-blue-500/30 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
