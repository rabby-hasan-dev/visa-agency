"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, TUser } from "@/redux/features/auth/authSlice";
import { useRouter, usePathname } from "next/navigation";
import NextLink from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { useGetNavigationQuery, useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { useGetMeQuery } from "@/redux/api/userApi";
import { TNavigationItem, TSiteSettings } from "@/types/settings";
import { useEffect } from "react";

// ─── Layout Component ─────────────────────────────────────────────────────

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user) as TUser | null;
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { data: profileResponse } = useGetMeQuery({}, { skip: !user });
  const profileImg = profileResponse?.data?.user?.profileImg;

  // ── Fetch Dynamic Settings ─────────────────────────────────────────────────
  const { data: navResponse } = useGetNavigationQuery(user?.role, { skip: !user?.role });
  const { data: siteResponse } = useGetSiteSettingsQuery({});

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  // Process dynamic navigation items
  const rawNavItems = (navResponse?.data ?? []) as TNavigationItem[];
  const navItems = rawNavItems.map(item => ({
    ...item,
    active: item.href === pathname || (item.href !== "/dashboard" && pathname.startsWith(item.href))
  }));

  const siteSettings = (siteResponse?.data ?? {
    siteName: "ImmiAccount",
    brandName: "Australian Government",
    departmentName: "Department of Home Affairs",
    footerLinks: [
        { label: "Accessibility", href: "/legal#accessibility" },
        { label: "Copyright", href: "/legal#copyright" },
        { label: "Disclaimer", href: "/legal#disclaimer" },
        { label: "Privacy", href: "/legal#privacy" },
        { label: "Security", href: "/legal#security" },
    ]
  }) as TSiteSettings;

  useEffect(() => {
    if (siteSettings.siteName) {
      document.title = `${siteSettings.siteName} - Dashboard`;
    }
  }, [siteSettings.siteName]);


  return (
    <div className="dashboard-root bg-white min-h-screen font-sans text-xs text-gray-700">
      {/* ─── Top Header ─────────────────────────────────────────────── */}
      <header className="bg-[#00264d] min-h-[55px] py-1.5 lg:py-0 flex flex-col lg:flex-row items-center justify-between px-5 text-white border-b border-white/10 gap-3 lg:gap-5 flex-wrap">
        <div className="flex items-center gap-2.5 self-start lg:self-center">
          <span className="font-bold text-[13px] whitespace-nowrap">{siteSettings.brandName}</span>
          <span className="w-px h-5 bg-white/30 hidden sm:block" />
          <span className="text-xs hidden sm:block opacity-80">{siteSettings.departmentName}</span>
        </div>

        <div className="flex flex-wrap items-center justify-between w-full lg:w-auto gap-3 lg:gap-5">
          <div className="flex items-center gap-2 lg:gap-2.5">
            {profileImg ? (
              <Image
                src={profileImg?.startsWith("http") ? profileImg : `${process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000"}${profileImg}`}
                alt="Profile"
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-cover border border-white/50"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-blue-900 border border-white/50 flex items-center justify-center text-[10px] font-bold">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-[10px] md:text-[11px] font-light text-gray-300">
                {user?.email?.split("@")[0].toUpperCase()},{" "}
                {user?.role?.toUpperCase() || "GUEST"}
              </span>
              <div className="flex gap-2">
                <NextLink
                  href="/account"
                  className="text-white underline text-[10px] lg:text-[11px]"
                >
                  Account
                </NextLink>
                <button
                  onClick={handleLogout}
                  className="text-white underline text-[10px] lg:text-[11px] bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg lg:text-2xl font-light">
              {pathname.startsWith("/payments")
                ? "Payments"
                : siteSettings.siteName}
            </span>
            <button 
              className="lg:hidden p-1 text-white hover:bg-white/10 rounded"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Navigation Bar ─────────────────────────────────────────── */}
      <nav className={`bg-white px-4 border-b border-gray-300 lg:flex relative min-h-[40px] transition-all duration-300 ${isMobileMenuOpen ? 'flex flex-col h-auto' : 'hidden lg:flex'}`}>
        {navItems.map((item) => (
          <div
            key={item.name}
            onMouseEnter={() => !isMobileMenuOpen && item.submenu && setOpenMenu(item.name)}
            onMouseLeave={() => !isMobileMenuOpen && setOpenMenu(null)}
            className="relative"
          >
            <div className="flex items-center justify-between w-full">
              <NextLink
                href={item.href}
                onClick={() => !item.submenu && setIsMobileMenuOpen(false)}
                className={`px-4 py-2.5 lg:py-2 text-[#2150a0] no-underline text-xs flex items-center gap-1.5 font-normal transition-colors border-b-[3px] w-full ${
                  item.active
                    ? "border-[#2150a0] bg-[#f4f7f9] font-bold"
                    : openMenu === item.name
                      ? "border-transparent bg-[#f4f7f9]"
                      : "border-transparent hover:bg-gray-50"
                }`}
              >
                {item.name}
                {!isMobileMenuOpen && item.submenu && <ChevronDown size={12} className="opacity-50" />}
              </NextLink>
              {isMobileMenuOpen && item.submenu && (
                <button 
                  onClick={() => setOpenMenu(openMenu === item.name ? null : item.name)}
                  className="p-2 text-[#2150a0] lg:hidden"
                >
                  <ChevronDown size={16} className={`transition-transform ${openMenu === item.name ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>

            {item.submenu && (openMenu === item.name || (!isMobileMenuOpen && openMenu === item.name)) && (
              <div className={`${isMobileMenuOpen ? 'block bg-gray-50 pl-4 border-l-2 border-[#2150a0]/10' : 'absolute top-full left-0 bg-white border border-gray-300 min-w-[180px] z-[1000] shadow-lg'} py-1 animate-in fade-in slide-in-from-top-1 duration-200`}>
                {item.submenu.map((sub) => (
                  <NextLink
                    key={sub.name}
                    href={sub.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 lg:py-1.5 text-[#2150a0] no-underline text-[11px] whitespace-nowrap hover:bg-[#e8f1f8] transition-colors"
                  >
                    {sub.name}
                  </NextLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* ─── Main Content ───────────────────────────────────────────── */}
      <main className="py-5">
        <div className="w-full">{children}</div>
      </main>

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <footer className="mt-10 py-8 border-t border-gray-300 text-center text-[11px] text-gray-700 px-5">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4">
          {siteSettings.footerLinks.map((item, i) => (
            <div key={item.label} className="flex items-center gap-4">
              {i > 0 && <span className="text-gray-300 hidden sm:inline">|</span>}
              <NextLink href={item.href} className="text-[#2150a0] font-bold hover:underline transition-colors">
                {item.label}
              </NextLink>
            </div>
          ))}
        </div>
        <p className="text-gray-500 max-w-md mx-auto">
          &copy; {new Date().getFullYear()} {siteSettings.departmentName}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

