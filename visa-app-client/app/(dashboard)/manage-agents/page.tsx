"use client";

import {
  useGetAgentPerformanceQuery,
  useCreateAgentMutation,
  useUpdateUserMutation,
} from "@/redux/api/adminApi";
import { 
  UserPlus, 
  ShieldAlert, 
  Award, 
  X, 
  Search, 
  RotateCw, 
  Users, 
  Eye, 
  Ban, 
  CheckCircle2,
  Phone,
  Mail,
  Building2,
  MapPin,
  Calendar,
  Lock,
  Loader2,
  Clock,
  User
} from "lucide-react";
import { useState, useMemo } from "react";
import NextLink from "next/link";
import { useAlert, Button } from "@/components/ui";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────────────────────────

interface AgentPerformance {
  _id: string;
  name: string;
  email: string;
  status: string;
  totalApplications: number;
  submittedApplications: number;
  approvedApplications: number;
  createdAt: string;
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ManageAgentsPage() {
  const { data, isLoading, refetch, isFetching } = useGetAgentPerformanceQuery({});
  const [createAgent, { isLoading: isCreating }] = useCreateAgentMutation();
  const [updateUser] = useUpdateUserMutation();
  const { showConfirm } = useAlert();
  
  const agents = useMemo(() => (data?.data || []) as AgentPerformance[], [data]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    companyName: "",
    marn: "",
    streetAddress: "",
    city: "",
    stateProvince: "",
    zipPostalCode: "",
    country: "",
  });

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAgent(formData).unwrap();
      setShowAddModal(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        dateOfBirth: "",
        companyName: "",
        marn: "",
        streetAddress: "",
        city: "",
        stateProvince: "",
        zipPostalCode: "",
        country: "",
      });
      toast.success("Agent account created successfully");
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string } };
      toast.error(errorData?.data?.message || "Failed to create agent");
    }
  };

  const handleToggleAgentStatus = async (
    agentId: string,
    agentName: string,
    currentStatus: string,
  ) => {
    const isBlocking = currentStatus !== "blocked";
    const confirmed = await showConfirm({
      title: isBlocking ? "Deactivate Agent" : "Reactivate Agent",
      message: isBlocking
        ? `Are you sure you want to deactivate ${agentName}? This agent will no longer be able to log in or manage applications.`
        : `Are you sure you want to reactivate ${agentName}? They will regain access to their account.`,
      confirmLabel: isBlocking ? "Deactivate" : "Reactivate",
      cancelLabel: "Cancel",
      type: isBlocking ? "danger" : "info",
    });

    if (confirmed) {
      try {
        await updateUser({
          id: agentId,
          data: { status: isBlocking ? "blocked" : "active" },
        }).unwrap();
        toast.success(`${agentName} has been ${isBlocking ? "deactivated" : "reactivated"}`);
      } catch (err) {
        toast.error("Failed to update status");
        console.error("Failed to update agent status:", err);
      }
    }
  };

  const filteredAgents = useMemo(() => {
    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [agents, searchTerm]);

  const topPerformer = useMemo(() => {
    if (agents.length === 0) return null;
    return agents.reduce(
        (max, obj) => obj.submittedApplications > max.submittedApplications ? obj : max,
        agents[0]
    );
  }, [agents]);

  const stats = [
    { 
        label: "Total Registered Agents", 
        value: agents.length, 
        icon: Users, 
        color: "blue",
        borderColor: "border-l-[#2150a0]"
    },
    { 
        label: "Market Leader (Highest Subs)", 
        value: topPerformer?.name || "N/A", 
        icon: Award, 
        color: "green",
        borderColor: "border-l-green-600",
        subValue: topPerformer ? `${topPerformer.submittedApplications} Submissions` : ""
    },
    { 
        label: "Compliance Action Required", 
        value: agents.filter((a) => a.status === "blocked").length, 
        icon: ShieldAlert, 
        color: "red",
        borderColor: "border-l-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fbff] px-4 md:px-6 py-6 md:py-8 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#00264d] tracking-tight uppercase flex items-center gap-2">
            Agent Ecosystem Management
            <span className="bg-[#2150a0] text-white text-[10px] px-2 py-0.5 rounded-sm font-bold tracking-widest ml-2">ADMIN</span>
          </h1>
          <p className="text-gray-500 text-[13px] font-medium mt-1">
            Oversee professional agent performance, manage compliance, and scale the application pipeline.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-gray-600 rounded-sm hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50"
              title="Refresh Data"
            >
              <RotateCw size={18} className={isFetching ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#cc3300] text-white px-5 h-10 hover:bg-[#b02c00] transition-all rounded-sm text-xs font-bold shadow-md uppercase tracking-wider active:scale-95 whitespace-nowrap"
            >
              <UserPlus size={16} /> Onboard New Agent
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
            <div key={i} className={`bg-white border border-gray-200 p-5 border-l-4 ${stat.borderColor} shadow-sm flex items-start justify-between hover:shadow-md transition-shadow`}>
                <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
                    <div className="text-2xl font-black text-[#00264d] mt-2 tracking-tight">
                        {stat.value}
                    </div>
                    {stat.subValue && <div className="text-[10px] font-bold text-green-600 mt-1 uppercase tracking-tighter">{stat.subValue}</div>}
                </div>
                <div className={`p-2 bg-gray-50 rounded-sm border border-gray-100`}>
                    <stat.icon size={24} className="text-gray-400" />
                </div>
            </div>
        ))}
      </div>

      {/* Main Table Section */}
      <div className="bg-white border border-gray-200 shadow-xl rounded-sm overflow-hidden">
        <div className="bg-[#00264d] text-white px-5 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-[#ff9933]"></div>
              <h3 className="text-sm font-bold uppercase tracking-widest">Global Agent Performance Directory</h3>
          </div>
          <div className="relative w-full sm:w-[320px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by agent name, email or MARN..."
              className="w-full text-black text-[11px] font-medium pl-9 pr-4 py-2 bg-white/95 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#ff9933] shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#f0f4f8] border-b border-gray-200">
                <th className="px-5 py-3.5 text-left text-[10px] font-black text-[#00264d] uppercase tracking-widest">Professional Identity</th>
                <th className="px-5 py-3.5 text-center text-[10px] font-black text-[#00264d] uppercase tracking-widest">Pipeline Health</th>
                <th className="px-5 py-3.5 text-center text-[10px] font-black text-[#00264d] uppercase tracking-widest">Conversion</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-black text-[#00264d] uppercase tracking-widest">Status & Tenure</th>
                <th className="px-5 py-3.5 text-center text-[10px] font-black text-[#00264d] uppercase tracking-widest">Commands</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 italic-last-row">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-24">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="animate-spin mb-3" size={32} />
                        <span className="text-[11px] font-bold uppercase tracking-widest">Syncing Global Directory...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAgents.length > 0 ? (
                filteredAgents.map((agent, index) => {
                  const drafts = agent.totalApplications - agent.submittedApplications;
                  const convertRate = agent.submittedApplications > 0
                      ? Math.round((agent.approvedApplications / agent.submittedApplications) * 100)
                      : 0;
                  const isBlocked = agent.status === "blocked";

                  return (
                    <tr
                      key={agent._id}
                      className={`group hover:bg-[#f8fbff] transition-all ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                            <NextLink href={`/manage-agents/${agent._id}`}>
                                <span className="text-[13px] font-black text-[#2150a0] hover:underline cursor-pointer">{agent.name}</span>
                            </NextLink>
                            <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5 mt-1">
                                <Mail size={10} /> {agent.email}
                            </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-6">
                            <div className="text-center">
                                <span className="block text-[14px] font-black text-gray-700">{drafts}</span>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Drafts</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-[14px] font-black text-[#2150a0]">{agent.submittedApplications}</span>
                                <span className="text-[9px] font-bold text-[#2150a0] opacity-50 uppercase tracking-tighter">Subs</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-[14px] font-black text-green-600">{agent.approvedApplications}</span>
                                <span className="text-[9px] font-bold text-green-600 opacity-50 uppercase tracking-tighter">Apps</span>
                            </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="relative pt-1">
                            <div className="flex mb-1 items-center justify-between">
                                <div><span className="text-[9px] font-black inline-block text-[#2150a0] uppercase tracking-tighter">{convertRate}% Success</span></div>
                            </div>
                            <div className="overflow-hidden h-1.5 text-xs flex rounded bg-gray-100 shadow-inner w-24 mx-auto">
                                <div style={{ width: `${convertRate}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${convertRate > 70 ? 'bg-green-500' : convertRate > 40 ? 'bg-[#ff9933]' : 'bg-red-500'}`}></div>
                            </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                            <span className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest w-fit shadow-sm border ${
                                !isBlocked 
                                    ? "bg-green-50 text-green-700 border-green-200" 
                                    : "bg-red-50 text-red-700 border-red-200"
                            }`}>
                                {!isBlocked ? <CheckCircle2 size={10} /> : <Ban size={10} />}
                                {agent.status || 'Active'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5">
                                <Clock size={10} />
                                Joined {new Date(agent.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <NextLink
                            href={`/applications?agentId=${agent._id}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-[#2150a0] hover:bg-[#2150a0] hover:text-white transition-all rounded-sm text-[11px] font-bold shadow-sm uppercase italic no-underline active:scale-95"
                          >
                            <Eye size={12} />
                            View Assets
                          </NextLink>
                          <button
                            onClick={() => handleToggleAgentStatus(agent._id, agent.name, agent.status)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 bg-white border transition-all rounded-sm text-[11px] font-bold shadow-sm uppercase active:scale-95 ${
                                isBlocked 
                                    ? "border-green-300 text-green-600 hover:bg-green-600 hover:text-white" 
                                    : "border-red-300 text-red-600 hover:bg-red-600 hover:text-white"
                            }`}
                          >
                            {isBlocked ? <CheckCircle2 size={12} /> : <Ban size={12} />}
                            {isBlocked ? "Reactivate" : "Deactivate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-20">
                     <div className="flex flex-col items-center text-gray-400 opacity-60">
                        <Search size={40} className="mb-3" />
                        <p className="text-xs font-bold uppercase tracking-widest">No matching agents identified for &quot;{searchTerm}&quot;</p>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Add Agent Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 bg-[#00264d] text-white">
              <div className="flex items-center gap-3">
                 <div className="bg-[#cc3300] p-1.5 sm:p-2 rounded-sm shadow-lg">
                    <UserPlus size={18} className="sm:w-5 sm:h-5 text-white" />
                 </div>
                 <div>
                    <h2 className="text-sm sm:text-lg font-black uppercase tracking-widest m-0 leading-tight">Security Provisioning</h2>
                    <p className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-300 mt-0.5 sm:mt-1 tracking-tighter opacity-70">Register new agent credentials into global system</p>
                 </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/70 hover:text-white transition-colors cursor-pointer bg-white/10 p-1.5 sm:p-2 rounded-sm"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAgent} className="p-0">
              <div className="max-h-[75vh] overflow-y-auto px-5 sm:px-8 py-5 sm:py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Identity Section */}
                  <div className="col-span-2 flex items-center gap-2 mb-1 border-b border-gray-100 pb-2">
                     <User size={14} className="text-[#2150a0]" />
                     <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Personal Identification</span>
                  </div>

                  <div className="space-y-1.5 focus-within:z-10 relative">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-tight flex items-center gap-1">
                      Full Legal Name <span className="text-[#cc3300]">*</span>
                    </label>
                    <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          required
                          className="w-full border border-gray-300 rounded-sm pl-9 pr-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#2150a0] focus:ring-1 focus:ring-[#2150a0] transition-all bg-gray-50/50"
                          placeholder="e.g. John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-tight flex items-center gap-1">
                      Professional Email <span className="text-[#cc3300]">*</span>
                    </label>
                    <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          required
                          className="w-full border border-gray-300 rounded-sm pl-9 pr-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#2150a0] focus:ring-1 focus:ring-[#2150a0] transition-all bg-gray-50/50"
                          placeholder="agent@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-tight flex items-center gap-1">
                      Contact Number <span className="text-[#cc3300]">*</span>
                    </label>
                    <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          required
                          className="w-full border border-gray-300 rounded-sm pl-9 pr-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#2150a0] focus:ring-1 focus:ring-[#2150a0] transition-all bg-gray-50/50"
                          placeholder="+61 400 000 000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-tight flex items-center gap-1">
                      Date of Birth <span className="text-[#cc3300]">*</span>
                    </label>
                    <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          required
                          className="w-full border border-gray-300 rounded-sm pl-9 pr-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#2150a0] focus:ring-1 focus:ring-[#2150a0] transition-all bg-gray-50/50"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        />
                    </div>
                  </div>

                  {/* Organisation Section */}
                  <div className="col-span-2 flex items-center gap-2 mb-1 mt-4 border-b border-gray-100 pb-2">
                     <Building2 size={14} className="text-[#2150a0]" />
                     <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Business Information</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-tight flex items-center gap-1">
                      Organisation <span className="text-[#cc3300]">*</span>
                    </label>
                    <div className="relative">
                        <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          required
                          className="w-full border border-gray-300 rounded-sm pl-9 pr-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#2150a0] focus:ring-1 focus:ring-[#2150a0] transition-all bg-gray-50/50"
                          placeholder="Registered Agency Name"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-tight">
                      MARN Registration
                      <span className="text-[9px] text-[#2150a0] font-bold ml-2 lowercase tracking-normal">(Leave blank if non-MARA)</span>
                    </label>
                    <div className="relative">
                        <Award size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-sm pl-9 pr-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#2150a0] focus:ring-1 focus:ring-[#2150a0] transition-all bg-gray-50/50"
                          placeholder="7-digit MARN identifier"
                          value={formData.marn}
                          onChange={(e) => setFormData({ ...formData, marn: e.target.value })}
                        />
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="col-span-2 flex items-center gap-2 mb-1 mt-4 border-b border-gray-100 pb-2">
                     <MapPin size={14} className="text-[#2150a0]" />
                     <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Office Address</span>
                  </div>

                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-tight flex items-center gap-1">
                      Street Address <span className="text-[#cc3300]">*</span>
                    </label>
                    <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          required
                          className="w-full border border-gray-300 rounded-sm pl-9 pr-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#2150a0] focus:ring-1 focus:ring-[#2150a0] transition-all bg-gray-50/50"
                          placeholder="HQ Street & Building"
                          value={formData.streetAddress}
                          onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                        />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 col-span-2">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-tight flex items-center gap-1">City <span className="text-[#cc3300]">*</span></label>
                        <input
                          type="text"
                          required
                          className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#2150a0] focus:ring-1 focus:ring-[#2150a0] transition-all bg-gray-50/50"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-tight flex items-center gap-1">State / Prov <span className="text-[#cc3300]">*</span></label>
                        <input
                          type="text"
                          required
                          className="w-full border border-gray-300 rounded-sm px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#2150a0] focus:ring-1 focus:ring-[#2150a0] transition-all bg-gray-50/50"
                          value={formData.stateProvince}
                          onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
                        />
                    </div>
                  </div>

                  {/* Security Section */}
                  <div className="col-span-2 flex items-center gap-2 mb-1 mt-4 border-b border-gray-100 pb-2">
                     <Lock size={14} className="text-[#cc3300]" />
                     <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Access Provisioning</span>
                  </div>

                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-tight flex items-center gap-1">
                      System Access Password <span className="text-[#cc3300]">*</span>
                    </label>
                    <div className="relative">
                        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          className="w-full border border-gray-300 rounded-sm pl-9 pr-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#2150a0] focus:ring-1 focus:ring-[#2150a0] transition-all bg-gray-50/50"
                          placeholder="Temporary Provisioning Password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <p className="text-[9px] font-bold text-gray-400 italic">Provisioned password must be changed by the agent during initial secure login.</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-5 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 border-t border-gray-100 shadow-inner">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-sm font-bold uppercase tracking-widest text-[10px] px-6 w-full sm:w-auto"
                >
                  Terminate
                </Button>
                <Button 
                    type="submit" 
                    isLoading={isCreating}
                    className="bg-[#2150a0] hover:bg-[#1a3d7a] rounded-sm font-bold uppercase tracking-widest text-[10px] px-8 shadow-md w-full sm:w-auto"
                >
                  Activate Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
