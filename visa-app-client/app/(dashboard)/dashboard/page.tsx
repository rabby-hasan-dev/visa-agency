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
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
    green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
    rose: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
  };
  const c = colorMap[color];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4">
      <div className={`w-10 h-10 ${c.bg} ${c.border} border rounded-lg flex items-center justify-center shrink-0`}>
        <Icon size={20} className={c.text} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
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
  const iconMap = {
    info: <Clock size={14} className="text-blue-500" />,
    warning: <ShieldAlert size={14} className="text-amber-500" />,
    success: <CheckCircle2 size={14} className="text-green-500" />,
  };
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="mt-0.5">{iconMap[status]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700">{text}</p>
        <p className="text-xs text-gray-400 mt-0.5">{type}</p>
      </div>
      <span className="text-xs text-gray-400 shrink-0">{time}</span>
    </div>
  );
};

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user) as TUser | null;
  const { data, isLoading } = useGetDashboardStatsQuery(undefined, {
    skip: user?.role === "agent" || !user,
  });

  // Agents see the applications list directly
  if (user?.role === "agent") {
    return <ApplicationsPage />;
  }

  const userDisplayName = user?.email?.split("@")[0] || "User";
  const isSuper = user?.role === "superAdmin";

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          {isSuper ? "Super Admin Panel" : "Admin Dashboard"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, <span className="font-medium text-gray-700 capitalize">{userDisplayName}</span>. Here is your overview.
        </p>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 h-24 animate-pulse">
              <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
              <div className="h-6 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Registered Agents"
            value={data?.data?.totalAgents?.toString() || "0"}
            subtitle="Active agent accounts"
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Pending Applications"
            value={data?.data?.pendingApplications?.toString() || "0"}
            subtitle="Needs review"
            icon={FileCheck}
            color="amber"
          />
          <StatsCard
            title="Total Applications"
            value={data?.data?.totalApplications?.toString() || "0"}
            subtitle="All submissions"
            icon={LayoutDashboard}
            color="green"
          />
          <StatsCard
            title="Total Revenue"
            value={`$${(data?.data?.totalRevenue || 0).toLocaleString()}`}
            subtitle="Processed payments"
            icon={DollarSign}
            color="rose"
          />
        </div>
      )}

      {/* Bottom Grid: Activity + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Recent Activity</h2>
          <p className="text-xs text-gray-400 mb-4">Latest system events</p>
          <ActivityItem
            type="Admin"
            text="New agent account registered: rahman@agent.com"
            time="2 mins ago"
            status="success"
          />
          <ActivityItem
            type="System"
            text="Daily backup completed successfully."
            time="1 hour ago"
            status="info"
          />
          <ActivityItem
            type="Security"
            text="Multiple failed login attempts from IP 103.44.x.x"
            time="3 hours ago"
            status="warning"
          />
          <ActivityItem
            type="Admin"
            text="Application #APP-2024-841 approved and submitted."
            time="5 hours ago"
            status="success"
          />
        </div>

        {/* Quick Links */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Quick Actions</h2>
          <p className="text-xs text-gray-400 mb-4">Common tasks</p>
          <div className="flex flex-col gap-1">
            {[
              { label: "Manage Agents", href: "/manage-agents" },
              { label: "View Applications", href: "/applications" },
              { label: "Manage Fees", href: "/manage-fees" },
              { label: "Payment Reports", href: "/reports" },
              { label: "System Settings", href: "/settings" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
              >
                <span>{link.label}</span>
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
