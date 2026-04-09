"use client";

import { useGetAgentDetailsQuery, useGetAgentApplicationsQuery, useUpdateUserMutation } from "@/redux/api/adminApi";
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  ShieldCheck, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Ban, 
  ChevronLeft,
  User,
  Globe,
  Briefcase,
  ExternalLink,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import NextLink from "next/link";
import { Button, useAlert } from "@/components/ui";
import { toast } from "sonner";
import { useMemo } from "react";

interface TVisaApplication {
  _id: string;
  trn: string;
  visaCategory: string;
  status: string;
  updatedAt: string;
}

export default function AgentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showConfirm } = useAlert();
  const { data: detailsData, isLoading: detailsLoading, refetch: refetchDetails } = useGetAgentDetailsQuery(id);
  const { data: appsData, isLoading: appsLoading } = useGetAgentApplicationsQuery(id);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const agent = detailsData?.data?.user;
  const profile = detailsData?.data?.profile;
  const applications = useMemo(() => (appsData?.data?.result || []) as TVisaApplication[], [appsData]);

  const handleToggleStatus = async () => {
    if (!agent) return;
    const isBlocking = agent.status !== "blocked";
    
    const confirmed = await showConfirm({
      title: isBlocking ? "Deactivate Agent" : "Reactivate Agent",
      message: isBlocking
        ? `Are you sure you want to deactivate ${agent.name}? This agent will no longer be able to access the system.`
        : `Are you sure you want to reactivate ${agent.name}? they will regain full access.`,
      confirmLabel: isBlocking ? "Deactivate" : "Reactivate",
      cancelLabel: "Cancel",
      type: isBlocking ? "danger" : "info",
    });

    if (confirmed) {
      try {
        await updateUser({
          id: agent._id,
          data: { status: isBlocking ? "blocked" : "active" },
        }).unwrap();
        toast.success(`Agent ${isBlocking ? "deactivated" : "reactivated"}`);
        refetchDetails();
      } catch {
        toast.error("Failed to update status");
      }
    }
  };

  const performanceStats = useMemo(() => {
    const total = applications.length;
    const submitted = applications.filter((a) => a.status !== 'DRAFT').length;
    const approved = applications.filter((a) => a.status === 'APPROVED').length;
    return { total, submitted, approved };
  }, [applications]);

  if (detailsLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#2150a0]" size={48} />
        <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-gray-500">Retrieving Secure Agent Dossier...</p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-black text-[#00264d] uppercase mb-2">Agent Not Found</h2>
        <p className="text-gray-500 mb-6">The requested agent profile could not be located in the global directory.</p>
        <Button onClick={() => router.back()}>Return to Directory</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fbff] px-6 py-8 animate-in fade-in duration-500">
      {/* Header / Breadcrumb */}
      <div className="mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#2150a0] mb-4 hover:translate-x-[-4px] transition-transform"
        >
          <ChevronLeft size={14} /> Back to Ecosystem Management
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-start gap-5">
             <div className="w-20 h-20 bg-[#00264d] rounded-sm flex items-center justify-center text-white shadow-xl border-4 border-white">
                <User size={40} />
             </div>
             <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black text-[#00264d] uppercase tracking-tight leading-none">{agent.name}</h1>
                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-black uppercase tracking-widest border ${
                        agent.status !== 'blocked' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                        {agent.status || 'Active'}
                    </span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-[11px] font-bold text-gray-500 uppercase tracking-tighter">
                    <span className="flex items-center gap-1.5"><Mail size={12} className="text-[#2150a0]" /> {agent.email}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#2150a0]" /> Member since {new Date(agent.createdAt).toLocaleDateString()}</span>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
              <button 
                onClick={handleToggleStatus}
                disabled={isUpdating}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-sm text-[11px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 ${
                  agent.status !== 'blocked' 
                    ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white' 
                    : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-600 hover:text-white'
                }`}
              >
                  {agent.status !== 'blocked' ? <Ban size={14} /> : <CheckCircle2 size={14} />}
                  {agent.status !== 'blocked' ? 'Deactivate Access' : 'Restore Access'}
              </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Dossier Details */}
        <div className="lg:col-span-2 space-y-8">
            {/* Identity & Contact Card */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                <div className="bg-[#f0f4f8] px-6 py-3 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-[#2150a0]" />
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-[#00264d]">Professional Identification</h3>
                    </div>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <DetailItem icon={User} label="Legal Name" value={agent.name} />
                    <DetailItem icon={Award} label="MARN Identifier" value={profile?.marn || "Non-MARA Registered"} />
                    <DetailItem icon={Mail} label="Official Email" value={agent.email} />
                    <DetailItem icon={Phone} label="Primary Contact" value={agent.phone || agent.mobilePhone || "Not Provided"} />
                    <DetailItem icon={Calendar} label="Date of Birth" value={profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "Not Provided"} />
                    <DetailItem icon={Briefcase} label="Designation" value={profile?.title || "Professional Agent"} />
                </div>
            </div>

            {/* Business & Address Card */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                <div className="bg-[#f0f4f8] px-6 py-3 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-[#2150a0]" />
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-[#00264d]">Organisation & Presence</h3>
                    </div>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <DetailItem icon={Building2} label="Agency Name" value={profile?.companyName || "Independent Practice"} />
                    <DetailItem icon={Globe} label="Region of Operation" value={profile?.country || "Not Specified"} />
                    <div className="md:col-span-2">
                        <DetailItem 
                            icon={MapPin} 
                            label="Headquarters Address" 
                            value={`${profile?.businessAddress || profile?.streetAddress || ''} ${profile?.city || ''}, ${profile?.stateProvince || ''} ${profile?.zipPostalCode || ''}`.trim() || "No address data on file"} 
                        />
                    </div>
                </div>
            </div>

            {/* Applications Activity Table */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                <div className="bg-[#00264d] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText size={16} className="text-[#ff9933]" />
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Recent Pipeline Assets</h3>
                    </div>
                    <span className="text-[10px] font-bold text-white/60 uppercase">{applications.length} TOTAL RECORDS</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-[9px] font-black uppercase text-gray-400 tracking-widest">Asset TRN</th>
                                <th className="px-6 py-3 text-left text-[9px] font-black uppercase text-gray-400 tracking-widest">Visa Class</th>
                                <th className="px-6 py-3 text-center text-[9px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                                <th className="px-6 py-3 text-right text-[9px] font-black uppercase text-gray-400 tracking-widest">Updated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {appsLoading ? (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-[10px] font-bold text-gray-400 uppercase italic">Retrieving pipeline data...</td>
                                </tr>
                            ) : applications.length > 0 ? (
                                applications.slice(0, 5).map((app) => (
                                    <tr key={app._id} className="hover:bg-[#f8fbff] transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-[12px] font-black text-[#2150a0] group-hover:underline cursor-pointer">{app.trn}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[11px] font-bold text-gray-600">{app.visaCategory}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-0.5 rounded-[2px] text-[9px] font-black uppercase tracking-tighter ${
                                                app.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-[#2150a0]'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-[10px] font-bold text-gray-400">{new Date(app.updatedAt).toLocaleDateString()}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-[10px] font-bold text-gray-400 uppercase italic">No active application assets found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {applications.length > 5 && (
                        <div className="p-4 border-t border-gray-50 text-center">
                            <NextLink href={`/applications?agentId=${id}`} className="text-[10px] font-black text-[#2150a0] uppercase hover:underline inline-flex items-center gap-1">
                                View Entire {applications.length} Asset Pipeline <ExternalLink size={12} />
                            </NextLink>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Right Column: Performance Analytics */}
        <div className="space-y-8">
            <div className="bg-[#00264d] text-white rounded-sm p-8 shadow-xl">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ff9933] mb-6">Aggregate Performance</h3>
                
                <div className="space-y-10">
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] font-bold uppercase text-white/50">Submission Efficiency</span>
                            <span className="text-xl font-black">{performanceStats.total > 0 ? Math.round((performanceStats.submitted / performanceStats.total) * 100) : 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-[#ff9933]" 
                                style={{ width: `${performanceStats.total > 0 ? (performanceStats.submitted / performanceStats.total) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <span className="block text-[10px] font-bold uppercase text-white/50 mb-1">Total Assets</span>
                            <span className="text-3xl font-black">{performanceStats.total}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold uppercase text-white/50 mb-1">Submissions</span>
                            <span className="text-3xl font-black text-[#ff9933]">{performanceStats.submitted}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold uppercase text-white/50 mb-1">Approved</span>
                            <span className="text-3xl font-black text-green-400">{performanceStats.approved}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold uppercase text-white/50 mb-1">Success Rate</span>
                            <span className="text-3xl font-black text-blue-400">
                                {performanceStats.submitted > 0 ? Math.round((performanceStats.approved / performanceStats.submitted) * 100) : 0}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions / Compliance */}
            <div className="bg-white border border-[#cc3300]/20 rounded-sm p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <AlertCircle size={16} className="text-[#cc3300]" />
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-[#00264d]">Compliance Status</h3>
                </div>
                <div className="space-y-4">
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic border-l-2 border-gray-100 pl-4">
                        Agent is currently in <span className="text-green-600 font-bold uppercase underline decoration-2 underline-offset-4">{agent.status === 'blocked' ? 'Suspension' : 'Good Standing'}</span>. Last system access recorded on {new Date(agent.updatedAt).toLocaleDateString()}.
                    </p>
                    <div className="pt-2">
                        <Button 
                            variant="secondary" 
                            className="w-full rounded-sm text-[10px] font-black uppercase tracking-widest border-gray-200"
                            onClick={() => toast.info("Audit log compilation in progress...")}
                        >
                            Generate Audit Dossier
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) {
    return (
        <div className="space-y-1.5 group">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 group-hover:text-[#2150a0] transition-colors">
                <Icon size={12} /> {label}
            </span>
            <p className="text-[13px] font-bold text-[#00264d] tracking-tight truncate border-b border-gray-50 pb-1" title={value}>
                {value}
            </p>
        </div>
    );
}
