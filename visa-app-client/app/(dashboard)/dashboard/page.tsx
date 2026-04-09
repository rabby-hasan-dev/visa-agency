"use client";

import { useAppSelector } from "@/redux/hooks";
import { TUser } from "@/redux/features/auth/authSlice";
import { useGetDashboardStatsQuery } from "@/redux/api/adminApi";
import ApplicationsPage from "../applications/page";
import {
  Users,
  FileCheck,
  DollarSign,
  LayoutDashboard,
  Clock,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Activity,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  color?: "blue" | "green" | "amber" | "rose";
}) => {
  const colorMap = {
    blue: { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-100", gradient: "from-blue-600 to-indigo-600" },
    green: { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-100", gradient: "from-emerald-600 to-teal-600" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-100", gradient: "from-amber-600 to-orange-600" },
    rose: { bg: "bg-rose-500/10", text: "text-rose-600", border: "border-rose-100", gradient: "from-rose-600 to-pink-600" },
  };
  const c = colorMap[color];

  return (
    <div className="bg-white border border-gray-100 rounded-[1.5rem] p-6 flex flex-col gap-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white shadow-lg shadow-${color}-200 transition-transform group-hover:scale-110 duration-500`}>
          <Icon size={24} />
        </div>
        <div className="bg-gray-50 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-400">
           {title.split(' ')[0]}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{title}</p>
        <p className="text-3xl font-black text-gray-900 tracking-tighter leading-none pt-1">{value}</p>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">{subtitle}</p>
      </div>
    </div>
  );
};

const ActivityItem = ({
  type,
  text,
  time,
  status = "info",
}: {
  type: string;
  text: string;
  time: string;
  status?: "info" | "warning" | "success";
}) => {
  const bulletColor = {
    info: "bg-blue-500 shadow-blue-200",
    warning: "bg-amber-500 shadow-amber-200",
    success: "bg-emerald-500 shadow-emerald-200",
  }[status];

  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className={`w-2 h-2 rounded-full ${bulletColor} shadow-lg relative z-10 mt-2`} />
        <div className="w-px flex-1 bg-gray-100 group-last:hidden" />
      </div>
      <div className="flex-1 pb-6 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <p className="text-xs font-bold text-gray-800 leading-relaxed">{text}</p>
          <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest whitespace-nowrap">{time}</span>
        </div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-1">{type}</p>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user) as TUser | null;
  const { data, isLoading } = useGetDashboardStatsQuery(undefined, {
    skip: user?.role === "agent" || !user,
  });

  if (user?.role === "agent") {
    return <ApplicationsPage />;
  }

  const userDisplayName = user?.email?.split("@")[0] || "Administrator";
  const isSuper = user?.role === "superAdmin";

  return (
    <div className="space-y-8 text-gray-900 animate-in fade-in duration-700">
      {/* ── Page Header ── */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-[2rem] p-8 sm:p-10 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full translate-x-20 -translate-y-20 blur-3xl" />
         <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-600/10 rounded-full -translate-x-10 translate-y-10 blur-2xl" />
         
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
               <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck size={14} className="text-blue-400" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{isSuper ? "Super Access" : "Admin Panel"}</span>
               </div>
               <h1 className="text-3xl font-black tracking-tighter">Welcome back, {userDisplayName}!</h1>
               <p className="text-gray-400 text-sm font-medium">Real-time intelligence report for the Department operations.</p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
               <div className="flex flex-col items-end">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">System Status</p>
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-tighter">Operational</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-400">
                  <Activity size={20} className="animate-pulse" />
               </div>
            </div>
         </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-[1.5rem] p-6 h-32 animate-pulse flex flex-col justify-between">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl" />
              <div className="h-4 bg-gray-50 rounded w-1/2" />
            </div>
          ))
        ) : (
          <>
            <StatsCard
              title="Registered Agents"
              value={data?.data?.totalAgents?.toString() || "0"}
              subtitle="Verified partners"
              icon={Users}
              color="blue"
            />
            <StatsCard
              title="Pending Reviews"
              value={data?.data?.pendingApplications?.toString() || "0"}
              subtitle="Urgent action needed"
              icon={Clock}
              color="amber"
            />
            <StatsCard
              title="Total Submissions"
              value={data?.data?.totalApplications?.toString() || "0"}
              subtitle="All-time volume"
              icon={LayoutDashboard}
              color="green"
            />
            <StatsCard
              title="Gross Revenue"
              value={`$${(data?.data?.totalRevenue || 0).toLocaleString()}`}
              subtitle="Processed settlements"
              icon={DollarSign}
              color="rose"
            />
          </>
        )}
      </div>

      {/* ── Bottom Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Timeline */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-5 text-gray-900">
            <div className="space-y-0.5">
               <h2 className="text-lg font-black tracking-tight uppercase">Recent Intelligence</h2>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Event Stream</p>
            </div>
            <TrendingUp size={20} className="text-blue-500 opacity-20" />
          </div>
          
          <div className="space-y-1">
            <ActivityItem
              type="Admin Operations"
              text="New agent account successfully registered: Rahman Global Consult"
              time="2m ago"
              status="success"
            />
            <ActivityItem
              type="Infrastructure"
              text="Primary database backup successfully verified and stored."
              time="1h ago"
              status="info"
            />
            <ActivityItem
              type="Security Protocol"
              text="Potential intrusion attempt thwarted: Multiple failed logins detected."
              time="3h ago"
              status="warning"
            />
            <ActivityItem
              type="Application Flow"
              text="Electronic Application #APP-921-X granted following final review."
              time="5h ago"
              status="success"
            />
          </div>
        </div>

        {/* Quick Commands */}
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm h-fit">
          <div className="space-y-0.5 mb-8 border-b border-gray-50 pb-5">
             <h2 className="text-lg font-black tracking-tight uppercase">Quick Commands</h2>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Efficiency Actions</p>
          </div>
          
          <div className="flex flex-col gap-2">
            {[
              { label: "Manage Partner Agents", href: "/manage-agents" },
              { label: "View Applications", href: "/applications" },
              { label: "Financial Reporting", href: "/reports" },
              { label: "Merchant Settings", href: "/settings" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:bg-blue-600 hover:text-white transition-all group shadow-sm hover:shadow-lg hover:shadow-blue-200"
              >
                <span>{link.label}</span>
                <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <ChevronRight size={14} />
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-blue-500" />
             <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Global Server Time: {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
