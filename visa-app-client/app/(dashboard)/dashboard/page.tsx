"use client";

import { useAppSelector } from "@/redux/hooks";
import { TUser } from "@/redux/features/auth/authSlice";
import { useGetDashboardStatsQuery } from "@/redux/api/adminApi";
import ApplicationsPage from "../applications/page";
import { LayoutDashboard, Users, FileCheck, DollarSign } from "lucide-react";

const StatsCard = ({
  title,
  value,
  subtitle,
  subtitleColor = "text-gray-500",
  icon: Icon,
  iconColor = "#00264d",
}: {
  title: string;
  value: string;
  subtitle: string;
  subtitleColor?: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  iconColor?: string;
}) => (
  <div className="bg-white border border-gray-300 p-5">
    <div className="flex justify-between items-center mb-4">
      <span className="text-sm font-bold text-[#00264d]">{title}</span>
      <Icon size={20} color={iconColor} />
    </div>
    <div className="text-3xl font-bold text-gray-800">{value}</div>
    <div className={`text-[11px] mt-1.5 ${subtitleColor}`}>{subtitle}</div>
  </div>
);

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user) as TUser | null;
  const { data, isLoading } = useGetDashboardStatsQuery(undefined, {
    skip: user?.role === "agent" || !user,
  });

  if (user?.role === "agent") {
    return <ApplicationsPage />;
  }

  return (
    <div className="font-sans px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl text-[#00264d] m-0">
          {user?.role === "superAdmin"
            ? "Super Admin Control Panel"
            : "System Administration Dashboard"}
        </h1>
        <p className="text-gray-500 text-[13px] mt-1.5">
          Welcome back, {user?.email}
        </p>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-gray-500">
          Loading dashboard metrics...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total Agents"
            value={data?.data?.totalAgents?.toString() || "0"}
            subtitle="Registered agents"
            subtitleColor="text-green-600"
            icon={Users}
          />
          <StatsCard
            title="Pending Applications"
            value={data?.data?.pendingApplications?.toString() || "0"}
            subtitle="Requires attention"
            subtitleColor="text-red-600"
            icon={FileCheck}
          />
          <StatsCard
            title="Total Submissions"
            value={data?.data?.totalApplications?.toString() || "0"}
            subtitle="All subclasses"
            icon={LayoutDashboard}
          />
          <StatsCard
            title="Total Revenue"
            value={`$${(data?.data?.totalRevenue || 0).toLocaleString()}`}
            subtitle="Processed fees"
            icon={DollarSign}
            iconColor="#2150a0"
          />
        </div>
      )}

      <div className="mt-8 bg-gray-50 border border-gray-300 p-5">
        <h3 className="text-base text-[#00264d] mb-4">
          Recent System Activity
        </h3>
        <div className="text-xs flex flex-col gap-3">
          {/* ... activity list mapping ... */}
          {[
            {
              tag: "[Admin]",
              text: "User rahman@agent.com registered as a new Agent.",
              time: "2 mins ago",
              color: "",
            },
            {
              tag: "[System]",
              text: "Daily backup completed successfully.",
              time: "1 hour ago",
              color: "",
            },
            {
              tag: "[Security]",
              text: "Multiple failed login attempts detected for IP 103.44...",
              time: "3 hours ago",
              color: "text-red-600",
            },
          ].map((item, idx) => (
            <div key={idx} className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
              <div className="flex-1">
                <span className="font-bold text-[#00264d]">{item.tag}</span> {item.text}
              </div>
              <span className={`text-[10px] sm:text-xs font-medium shrink-0 ${item.color || "text-gray-400"}`}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
