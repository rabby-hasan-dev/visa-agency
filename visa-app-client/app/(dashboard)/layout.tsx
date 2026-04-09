"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, TUser } from "@/redux/features/auth/authSlice";
import { useRouter, usePathname } from "next/navigation";
import NextLink from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X, Globe, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { useGetNavigationQuery, useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { useGetMeQuery } from "@/redux/api/userApi";
import { TNavigationItem, TSiteSettings } from "@/types/settings";
import { useEffect, useRef } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user) as TUser | null;
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { data: profileResponse } = useGetMeQuery({}, { skip: !user });
  const profileImg = profileResponse?.data?.user?.profileImg;

  const { data: navResponse } = useGetNavigationQuery(user?.role, { skip: !user?.role });
  const { data: siteResponse } = useGetSiteSettingsQuery({});

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const rawNavItems = (navResponse?.data ?? []) as TNavigationItem[];
  const navItems = rawNavItems.map(item => ({
    ...item,
    active: item.href === pathname || (item.href !== "/dashboard" && pathname.startsWith(item.href))
  }));

  const siteSettings = (siteResponse?.data ?? {
    siteName: "Elite Visa Hub",
    brandName: "Global Passports & Visas",
    departmentName: "Advanced Immigration Consultants",
    footerLinks: [
      { label: "Privacy", href: "/privacy" },
      { label: "Legal", href: "/legal" },
      { label: "Security", href: "/security" },
    ]
  }) as TSiteSettings;

  useEffect(() => {
    if (siteSettings.siteName) {
      document.title = `${siteSettings.siteName} - Dashboard`;
    }
  }, [siteSettings.siteName]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";
  const userDisplayName = user?.email?.split("@")[0] || "User";
  const profileSrc = profileImg
    ? (profileImg.startsWith("http") ? profileImg : `${process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000"}${profileImg}`)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <header className="bg-[#0f172a] text-white h-14 flex items-center px-4 sm:px-6 border-b border-white/5 sticky top-0 z-50">
        {/* Logo */}
        <NextLink href="/dashboard" className="flex items-center gap-2.5 mr-6 shrink-0">
          <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
            <Globe size={15} className="text-white" />
          </div>
          <span className="font-bold text-sm text-white hidden sm:block">{siteSettings.siteName}</span>
        </NextLink>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative shrink-0"
              onMouseEnter={() => item.submenu && setOpenMenu(item.name)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <NextLink
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  item.active
                    ? "bg-white/10 text-white font-medium"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.name}
                {item.submenu && <ChevronDown size={12} className={`transition-transform ${openMenu === item.name ? "rotate-180" : ""}`} />}
              </NextLink>

              {/* Dropdown */}
              {item.submenu && openMenu === item.name && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-xl min-w-[200px] z-[100] py-1">
                  {item.submenu.map((sub) => (
                    <NextLink
                      key={sub.name}
                      href={sub.href}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        pathname === sub.href ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                    >
                      {sub.name}
                    </NextLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right: User Menu */}
        <div className="flex items-center gap-2 ml-auto">
          {/* User dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              {profileSrc ? (
                <Image src={profileSrc} alt="Profile" width={28} height={28}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/30" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                  {userInitial}
                </div>
              )}
              <span className="hidden sm:block text-xs text-gray-300 capitalize">{userDisplayName}</span>
              <ChevronDown size={13} className={`text-gray-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-1 top-full bg-white border border-gray-200 shadow-lg rounded-xl min-w-[180px] z-[200] py-1">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-800 capitalize">{userDisplayName}</p>
                  <p className="text-[10px] text-gray-400 uppercase">{user?.role}</p>
                </div>
                <NextLink
                  href="/account"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={14} /> Account Settings
                </NextLink>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-gray-400 hover:text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ── Mobile Menu ─────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0f172a] border-b border-white/5 px-4 py-3 space-y-0.5">
          {navItems.map((item) => (
            <div key={item.name}>
              <NextLink
                href={item.href}
                onClick={() => !item.submenu && setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm ${
                  item.active ? "bg-white/10 text-white font-medium" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.name}
                {item.submenu && (
                  <ChevronDown
                    size={14}
                    onClick={(e) => { e.preventDefault(); setOpenMenu(openMenu === item.name ? null : item.name); }}
                    className={`transition-transform ${openMenu === item.name ? "rotate-180" : ""}`}
                  />
                )}
              </NextLink>
              {item.submenu && openMenu === item.name && (
                <div className="ml-4 pl-3 border-l border-white/10 space-y-0.5 mt-0.5">
                  {item.submenu.map((sub) => (
                    <NextLink
                      key={sub.name}
                      href={sub.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2 text-xs text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      {sub.name}
                    </NextLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-grow p-4 sm:p-6 max-w-screen-xl w-full mx-auto">
        {children}
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 bg-white py-5 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex gap-5">
            {siteSettings.footerLinks?.map((item) => (
              <NextLink key={item.label} href={item.href} className="text-xs text-gray-400 hover:text-blue-600 transition-colors">
                {item.label}
              </NextLink>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} {siteSettings.brandName}
          </p>
        </div>
      </footer>
    </div>
  );
}
