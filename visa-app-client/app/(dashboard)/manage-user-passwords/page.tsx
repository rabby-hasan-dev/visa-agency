"use client";

import { useGetUserPasswordsQuery } from "@/redux/api/adminApi";
import { 
  Search, 
  RotateCw, 
  Users, 
  Eye, 
  EyeOff,
  Mail,
  Lock,
  Loader2,
  ShieldCheck,
  User,
  Key
} from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui";

// ─── Types ──────────────────────────────────────────────────────────────────

interface UserPassword {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ManageUserPasswordsPage() {
  const { data, isLoading, refetch, isFetching } = useGetUserPasswordsQuery({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const userPasswords = useMemo(() => (data?.data || []) as UserPassword[], [data]);

  const togglePasswordVisibility = (id: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredPasswords = useMemo(() => {
    return userPasswords.filter(
      (up) =>
        up.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        up.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        up.userId?.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [userPasswords, searchTerm]);

  const stats = [
    { 
        label: "Total Credentials Tracked", 
        value: userPasswords.length, 
        icon: Users, 
        color: "blue",
        borderColor: "border-l-[#2150a0]"
    },
    { 
        label: "Super Admin Accounts", 
        value: userPasswords.filter(up => up.userId?.role === 'superAdmin').length, 
        icon: ShieldCheck, 
        color: "red",
        borderColor: "border-l-red-600"
    },
    { 
        label: "Recent System Updates", 
        value: userPasswords.filter(up => {
            const lastUpdate = new Date(up.updatedAt);
            const today = new Date();
            return lastUpdate.toDateString() === today.toDateString();
        }).length, 
        icon: RotateCw, 
        color: "green",
        borderColor: "border-l-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fbff] px-6 py-8 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#00264d] tracking-tight uppercase flex items-center gap-2">
            Credential Vault Management
            <span className="bg-[#cc3300] text-white text-[10px] px-2 py-0.5 rounded-sm font-bold tracking-widest ml-2">CONFIDENTIAL</span>
          </h1>
          <p className="text-gray-500 text-[13px] font-medium mt-1">
            Maintain oversight of all system access credentials. All passwords shown are non-encrypted for administrative reference.
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
              <h3 className="text-sm font-bold uppercase tracking-widest">System Access Registry</h3>
          </div>
          <div className="relative w-full sm:w-[320px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by name, email or role..."
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
                <th className="px-5 py-3.5 text-left text-[10px] font-black text-[#00264d] uppercase tracking-widest">User Identity</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-black text-[#00264d] uppercase tracking-widest">Access Credentials</th>
                <th className="px-5 py-3.5 text-center text-[10px] font-black text-[#00264d] uppercase tracking-widest">System Role</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-black text-[#00264d] uppercase tracking-widest">Last Modified</th>
                <th className="px-5 py-3.5 text-center text-[10px] font-black text-[#00264d] uppercase tracking-widest">Visibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 italic-last-row">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-24">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="animate-spin mb-3" size={32} />
                        <span className="text-[11px] font-bold uppercase tracking-widest">Decrypting Vault Access...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPasswords.length > 0 ? (
                filteredPasswords.map((up, index) => {
                  const isVisible = showPassword[up._id];

                  return (
                    <tr
                      key={up._id}
                      className={`group hover:bg-[#f8fbff] transition-all ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                            <span className="text-[13px] font-black text-[#2150a0] capitalize">{up.userId?.name || 'Unknown'}</span>
                            <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5 mt-1">
                                <Mail size={10} /> {up.email}
                            </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-sm min-w-[200px] flex items-center justify-between">
                                <span className={`text-[12px] font-mono ${isVisible ? 'text-gray-800' : 'text-gray-300'}`}>
                                    {isVisible ? up.password : '••••••••••••'}
                                </span>
                                <Key size={12} className="text-gray-300 ml-2" />
                            </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-tighter shadow-sm border ${
                            up.userId?.role === 'superAdmin' 
                                ? "bg-red-50 text-red-700 border-red-200" 
                                : up.userId?.role === 'admin'
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                        }`}>
                            {up.userId?.role || 'N/A'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                         <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5">
                            <RotateCw size={10} />
                            {new Date(up.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => togglePasswordVisibility(up._id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 border transition-all rounded-sm text-[10px] font-bold shadow-sm uppercase active:scale-95 ${
                                isVisible 
                                    ? "bg-gray-700 border-gray-800 text-white hover:bg-black" 
                                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {isVisible ? <EyeOff size={12} /> : <Eye size={12} />}
                            {isVisible ? "Secure" : "Reveal"}
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
                        <p className="text-xs font-bold uppercase tracking-widest">No matching credentials found for &quot;{searchTerm}&quot;</p>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-red-50 border border-red-100 p-4 rounded-sm flex items-start gap-4">
          <div className="bg-red-600 p-2 rounded-sm shadow-sm text-white">
             <ShieldCheck size={20} />
          </div>
          <div>
             <h4 className="text-[11px] font-black text-red-900 uppercase tracking-widest">Administrative Protocol</h4>
             <p className="text-[11px] text-red-700/80 font-medium mt-1 leading-relaxed">
                This area contains highly sensitive information. Unauthorized access or disclosure of these credentials is a security violation. 
                Passwords should only be used for recovery and troubleshooting purposes by authorized personnel.
             </p>
          </div>
      </div>
    </div>
  );
}
