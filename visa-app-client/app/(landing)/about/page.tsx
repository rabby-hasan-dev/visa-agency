"use client";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  MapPin,
  CheckCircle2
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="bg-[#040d1a] min-h-screen font-sans text-gray-200 overflow-x-hidden">
      <Header />

      {/* ─── Hero Section ───────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#040d1a]/50 via-[#040d1a] to-[#040d1a] z-10" />
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
            alt="Modern Office" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            Our Story & Mission
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-8">
            Helping You Achieve Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Global Goals
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            Elite Visa Hub is a leading immigration agency in Bangladesh. We help people 
            find global opportunities through expert advice and straightforward 
            visa solutions.
          </p>
        </div>
      </section>

      {/* ─── Core Values ────────────────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "Transparency",
              desc: "We believe in honest and clear communication. With us, there are no hidden fees or unrealistic promises—only reliable guidance based on facts.",
              icon: Target
            },
            {
              title: "Expertise",
              desc: "Our team consists of experienced professionals with specialized knowledge in Australian and international migration laws.",
              icon: Award
            },
            {
              title: "Client-Focused",
              desc: "Every journey is unique. We tailor our services to help you reach your specific goals and handle your individual situation.",
              icon: Users
            }
          ].map((value, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/[0.08] transition duration-300">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 mb-8">
                <value.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
              <p className="text-gray-400 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Our Journey ────────────────────────────────────────────── */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-4">
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" className="rounded-3xl h-64 w-full object-cover" alt="Team Work" />
                  <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" className="rounded-3xl h-48 w-full object-cover" alt="Office Culture" />
               </div>
               <div className="space-y-4 pt-12">
                  <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop" className="rounded-3xl h-48 w-full object-cover" alt="Consultation" />
                  <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop" className="rounded-3xl h-64 w-full object-cover" alt="Meeting" />
               </div>
            </div>
            <div className="absolute inset-0 bg-blue-600/10 blur-[100px] -z-10" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em] mb-4">Our History</h2>
            <h3 className="text-4xl lg:text-5xl font-bold text-white mb-8">Decades of Combined Experience</h3>
            <div className="space-y-6 text-gray-400 leading-relaxed">
              <p>
                Founded in Dhaka, Elite Visa Hub started with a simple goal: to make moving abroad 
                easier and safer for everyone. Over the years, we have grown from a small consultancy 
                into a trusted licensed partner for Australian immigration.
              </p>
              <p>
                Our team has helped thousands of families, students, and professionals achieve 
                their dreams of living and working abroad. We focus on every detail and stay 
                up-to-date with changing immigration rules.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Licensed Australian Migration Partner",
                  "Based in Maghbazar, HEART of Dhaka",
                  "Multilingual support (Bangla, English)",
                  "Official SSLCommerz Payment Partner"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white font-medium">
                    <CheckCircle2 size={18} className="text-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Global Presence ────────────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-white mb-4">Our Global Network</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            While our headquarters is in Dhaka, we have a global reach. We work with strong 
            networks across Australia, the UK, and Canada to provide our clients with the best 
            support abroad.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { city: "Dhaka", role: "Headquarters", icon: MapPin },
             { city: "Sydney", role: "Liaison Office", icon: Globe },
             { city: "Melbourne", role: "Consultancy Point", icon: Globe },
             { city: "London", role: "Partner Network", icon: Globe }
           ].map((loc, i) => (
             <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-3xl text-center group hover:bg-blue-600/10 hover:border-blue-500/30 transition duration-300">
               <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                 <loc.icon size={24} className="text-blue-400" />
               </div>
               <h4 className="text-xl font-bold text-white mb-2">{loc.city}</h4>
               <p className="text-gray-500 text-sm font-mono uppercase tracking-widest">{loc.role}</p>
             </div>
           ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
