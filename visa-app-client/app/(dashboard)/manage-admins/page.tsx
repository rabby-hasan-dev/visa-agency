"use client";

import {
  useGetAdminsQuery,
  useUpdateAdminStatusMutation,
  useDeleteAdminMutation,
} from "@/redux/api/adminApi";
import { useRegisterMutation } from "@/redux/api/authApi";
import { 
  UserPlus, 
  ShieldAlert, 
  Award, 
  X, 
  Search, 
  RotateCw, 
  Users, 
  Ban, 
  CheckCircle2,
  Mail,
  Lock,
  Loader2,
  Clock,
  User,
  Trash2
} from "lucide-react";
import { useState, useMemo } from "react";
import { useAlert, Button } from "@/components/ui";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────────────────────────

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  profile?: {
    employeeId?: string;
    department?: string;
    designation?: string;
  };
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ManageAdminsPage() {
  const { data, isLoading, refetch, isFetching } = useGetAdminsQuery({});
  const [registerAdmin, { isLoading: isCreating }] = useRegisterMutation();
  const [updateAdminStatus] = useUpdateAdminStatusMutation();
  const [deleteAdmin] = useDeleteAdminMutation();
  const { showConfirm } = useAlert();
  
  const admins = useMemo(() => (data?.data || []) as AdminUser[], [data]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    employeeId: "",
    department: "",
    designation: "",
  });

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerAdmin(formData).unwrap();
      setShowAddModal(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "admin",
        employeeId: "",
        department: "",
        designation: "",
      });
      toast.success("Admin account created successfully");
      refetch();
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string } };
      toast.error(errorData?.data?.message || "Failed to create admin");
    }
  };

  const handleToggleAdminStatus = async (
    adminId: string,
    adminName: string,
    currentStatus: string,
  ) => {
    const isBlocking = currentStatus !== "blocked";
    const confirmed = await showConfirm({
      title: isBlocking ? "Deactivate Admin" : "Reactivate Admin",
      message: isBlocking
        ? `Are you sure you want to deactivate ${adminName}? This admin will no longer be able to log in.`
        : `Are you sure you want to reactivate ${adminName}? They will regain access to their account.`,
      confirmLabel: isBlocking ? "Deactivate" : "Reactivate",
      cancelLabel: "Cancel",
      type: isBlocking ? "danger" : "info",
    });

    if (confirmed) {
      try {
        await updateAdminStatus({
          id: adminId,
          status: isBlocking ? "blocked" : "active",
        }).unwrap();
        toast.success(`${adminName} has been ${isBlocking ? "deactivated" : "reactivated"}`);
      } catch (err) {
        toast.error("Failed to update status");
        console.error(err);
      }
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminName: string) => {
    const confirmed = await showConfirm({
      title: "Delete Admin Account",
      message: `Are you sure you want to PERMANENTLY delete ${adminName}? This action cannot be undone.`,
      confirmLabel: "Delete permanently",
      cancelLabel: "Cancel",
      type: "danger",
    });

    if (confirmed) {
      try {
        await deleteAdmin(adminId).unwrap();
        toast.success(`${adminName} has been deleted successfully`);
      } catch (err) {
        toast.error("Failed to delete admin");
        console.error(err);
      }
    }
  };

  const filteredAdmins = useMemo(() => {
    return admins.filter(
      (a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.profile?.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [admins, searchTerm]);

  const stats = [
    { 
        label: "Total Administrators", 
        value: admins.length, 
        icon: Users, 
        color: "blue",
        borderColor: "border-l-[#2150a0]"
    },
    { 
        label: "Active Controllers", 
        value: admins.filter(a => a.status !== 'blocked').length, 
        icon: Award, 
        color: "green",
        borderColor: "border-l-green-600",
    },
    { 
        label: "Blocked Access", 
        value: admins.filter((a) => a.status === "blocked").length, 
        icon: ShieldAlert, 
        color: "red",
        borderColor: "border-l-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fbff] px-6 py-8 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#00264d] tracking-tight uppercase flex items-center gap-2">
            Administrator Control Panel
            <span className="bg-[#cc3300] text-white text-[10px] px-2 py-0.5 rounded-sm font-bold tracking-widest ml-2">SUPER ADMIN</span>
          </h1>
          <p className="text-gray-500 text-[13px] font-medium mt-1">
            Manage system administrators, control access levels, and monitor management staff.
          </p>
        </div>
        <div className="flex items-center gap-3">
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
              className="flex items-center gap-2 bg-[#2150a0] text-white px-5 h-10 hover:bg-[#1a3d7a] transition-all rounded-sm text-xs font-bold shadow-md uppercase tracking-wider active:scale-95"
            >
              <UserPlus size={16} /> Create New Admin
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
              <h3 className="text-sm font-bold uppercase tracking-widest">Admin Personnel Directory</h3>
          </div>
          <div className="relative w-full sm:w-[320px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by name, email or Employee ID..."
              className="w-full text-black text-[11px] font-medium pl-9 pr-4 py-2 bg-white/95 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#ff9933] shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f0f4f8] border-b border-gray-200">
                <th className="px-5 py-3.5 text-left text-[10px] font-black text-[#00264d] uppercase tracking-widest">Administrator</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-black text-[#00264d] uppercase tracking-widest">Role Info</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-black text-[#00264d] uppercase tracking-widest">Status</th>
                <th className="px-5 py-3.5 text-center text-[10px] font-black text-[#00264d] uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 italic-last-row">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-24">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="animate-spin mb-3" size={32} />
                        <span className="text-[11px] font-bold uppercase tracking-widest">Syncing Personnel Data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin, index) => {
                  const isBlocked = admin.status === "blocked";

                  return (
                    <tr
                      key={admin._id}
                      className={`group hover:bg-[#f8fbff] transition-all ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                            <span className="text-[13px] font-black text-[#2150a0] uppercase">{admin.name}</span>
                            <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5 mt-1">
                                <Mail size={10} /> {admin.email}
                            </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-bold text-gray-700">{admin.profile?.designation || 'Administrator'}</span>
                            <span className="text-[10px] text-gray-400 font-medium italic">{admin.profile?.department || 'Operations'}</span>
                            {admin.profile?.employeeId && (
                                <span className="text-[9px] bg-gray-100 text-gray-600 px-1 py-0.5 rounded-sm w-fit mt-1 font-bold">ID: {admin.profile.employeeId}</span>
                            )}
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
                                {admin.status || 'Active'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5">
                                <Clock size={10} />
                                Joined {new Date(admin.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleToggleAdminStatus(admin._id, admin.name, admin.status)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 bg-white border transition-all rounded-sm text-[11px] font-bold shadow-sm uppercase active:scale-95 ${
                                isBlocked 
                                    ? "border-green-300 text-green-600 hover:bg-green-600 hover:text-white" 
                                    : "border-red-300 text-red-600 hover:bg-red-600 hover:text-white"
                            }`}
                          >
                            {isBlocked ? <CheckCircle2 size={12} /> : <Ban size={12} />}
                            {isBlocked ? "Reactivate" : "Deactivate"}
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin._id, admin.name)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all rounded-sm text-[11px] font-bold shadow-sm uppercase active:scale-95"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-20">
                     <div className="flex flex-col items-center text-gray-400 opacity-60">
                        <Search size={40} className="mb-3" />
                        <p className="text-xs font-bold uppercase tracking-widest">No matching admins identified</p>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-xl overflow-hidden border border-gray-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-[#00264d] text-white">
              <div className="flex items-center gap-3">
                 <div className="bg-[#2150a0] p-2 rounded-sm shadow-lg">
                    <UserPlus size={20} className="text-white" />
                 </div>
                 <div>
                    <h2 className="text-lg font-black uppercase tracking-widest m-0 leading-none">Security Provisioning</h2>
                    <p className="text-[10px] uppercase font-bold text-gray-300 mt-1 tracking-tighter opacity-70">Create new administrator credentials</p>
                 </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/70 hover:text-white transition-colors cursor-pointer bg-white/10 p-2 rounded-sm"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin}>
              <div className="p-8 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-tight flex items-center gap-1">
                      Full Name <span className="text-[#cc3300]">*</span>
                    </label>
                    <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          required
                          className="w-full border border-gray-300 rounded-sm pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-[#2150a0]"
                          placeholder="e.g. Jane Smith"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-tight flex items-center gap-1">
                      Work Email <span className="text-[#cc3300]">*</span>
                    </label>
                    <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-tight flex items-center gap-1">
                      Temporary Password <span className="text-[#cc3300]">*</span>
                    </label>
                    <div className="relative">
                        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          className="w-full border border-gray-300 rounded-sm pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-[#2150a0]"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-tight">Employee ID</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#2150a0]"
                      placeholder="e.g. EMP-101"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-tight">Department</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#2150a0]"
                      placeholder="e.g. Visa Processing"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-tight">Designation</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#2150a0]"
                      placeholder="e.g. Senior Officer"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-8 py-5 flex justify-end gap-3 border-t border-gray-100">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-sm font-bold uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </Button>
                <Button 
                    type="submit" 
                    isLoading={isCreating}
                    className="bg-[#2150a0] hover:bg-[#1a3d7a] rounded-sm font-bold uppercase tracking-widest text-[10px] px-8"
                >
                  Provision Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
