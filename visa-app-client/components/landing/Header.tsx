"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Globe, Menu, X } from "lucide-react";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { TSiteSettings } from "@/types/settings";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: siteResponse } = useGetSiteSettingsQuery({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const siteSettings = (siteResponse?.data ?? {
    siteName: "Elite Visa Hub",
    brandName: "Global Passports & Visas",
    departmentName: "Advanced Immigration Consultants",
  }) as TSiteSettings;

  const navItems = [
    { name: "Services", href: "/#services" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Immigration", href: "/immigration" },
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faqs" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? "bg-[#040d1a]/80 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Globe className="text-white" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-white leading-none">
              {siteSettings.siteName}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold mt-1">
              {siteSettings.departmentName}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="text-sm font-medium hover:text-blue-400 transition-colors text-gray-200"
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition shadow-lg shadow-blue-600/20"
          >
            Client Login
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-white hover:bg-white/10 rounded-full transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`lg:hidden absolute top-full left-0 right-0 bg-[#040d1a] border-b border-white/10 overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-6 py-8 flex flex-col gap-6">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="text-lg font-medium text-gray-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-center font-bold"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Client Login
          </Link>
        </div>
      </div>
    </header>
  );
}
