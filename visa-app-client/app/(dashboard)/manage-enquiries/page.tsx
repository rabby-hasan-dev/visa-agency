"use client";

import { useState } from "react";
import {
  useGetAllEnquiriesQuery,
  useUpdateEnquiryStatusMutation,
  useDeleteEnquiryMutation,
} from "@/redux/api/enquiryApi";
import {
  Mail,
  MessageSquare,
  Trash2,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  X,
  User,
  Calendar,
} from "lucide-react";
import { useAlert, Button } from "@/components/ui";
import { toast } from "sonner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function ManageEnquiriesPage() {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    searchTerm: "",
    status: "",
  });

  const queryParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
  );

  const { data, isLoading } = useGetAllEnquiriesQuery(queryParams);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateEnquiryStatusMutation();
  const [deleteEnquiry] = useDeleteEnquiryMutation();
  const { showConfirm } = useAlert();

  const enquiries = data?.data || [];
  const meta = data?.meta;

  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(`Enquiry marked as ${newStatus}`);
      if (selectedEnquiry && selectedEnquiry._id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm({
      title: "Delete Enquiry",
      message: "Are you sure you want to delete this enquiry? This action cannot be undone.",
      confirmLabel: "Delete",
      type: "danger",
    });

    if (confirmed) {
      try {
        await deleteEnquiry(id).unwrap();
        toast.success("Enquiry deleted successfully");
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry(null);
        }
      } catch (err) {
        toast.error("Failed to delete enquiry");
      }
    }
  };

  return (
    <div className="font-sans px-5 pb-10">
      {/* ── Page Header ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#00264d] m-0 uppercase tracking-tight">Public Enquiries</h1>
        <p className="text-gray-500 text-[13px] mt-1.5 font-medium">
          Manage and respond to messages sent through the public contact form.
        </p>
      </div>

      {/* ── Filters & Search ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, email or message..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={params.searchTerm}
              onChange={(e) => setParams({ ...params, searchTerm: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={params.status}
              onChange={(e) => setParams({ ...params, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="responded">Responded</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Enquiries Table ── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Sender</th>
              <th className="p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Message Preview</th>
              <th className="p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Date</th>
              <th className="p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="p-4 bg-gray-50/50 h-16" />
                </tr>
              ))
            ) : enquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                  {params.searchTerm ? "No enquiries match your search." : "No enquiries found."}
                </td>
              </tr>
            ) : (
              enquiries.map((enquiry: any) => (
                <tr key={enquiry._id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                        {enquiry.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-gray-900">{enquiry.name}</p>
                        <p className="text-[11px] text-gray-500 font-medium">{enquiry.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-xs text-gray-600 line-clamp-1 max-w-sm font-medium">
                      {enquiry.message}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 font-bold">
                       <Calendar size={12} />
                       {dayjs(enquiry.createdAt).format("MMM D, YYYY")}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      enquiry.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      enquiry.status === 'responded' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      'bg-gray-50 text-gray-500 border-gray-100'
                    }`}>
                       {enquiry.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setSelectedEnquiry(enquiry)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(enquiry._id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Enquiry Detail Modal ── */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedEnquiry(null)} />
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl relative shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                  <MessageSquare size={24} />
                </div>
                <div>
                   <h2 className="text-xl font-black text-[#00264d] uppercase tracking-tight">Message Details</h2>
                   <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Received via Contact Form</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8">
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sender Name</p>
                     <p className="font-bold text-gray-900 flex items-center gap-2"><User size={14} className="text-blue-500" /> {selectedEnquiry.name}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                     <p className="font-bold text-gray-900 flex items-center gap-2 underline decoration-blue-500/20"><Mail size={14} className="text-blue-500" /> {selectedEnquiry.email}</p>
                  </div>
               </div>

               <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message Content</p>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 scrollbar-hide max-h-[300px] overflow-y-auto">
                     <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                        {selectedEnquiry.message}
                     </p>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-4">
                     {selectedEnquiry.status === 'pending' && (
                        <Button
                          onClick={() => handleStatusChange(selectedEnquiry._id, 'responded')}
                          isLoading={isUpdating}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-widest"
                        >
                           <CheckCircle size={16} className="mr-2" /> Mark as Responded
                        </Button>
                     )}
                     <button
                        onClick={() => handleDelete(selectedEnquiry._id)}
                        className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                     >
                        <Trash2 size={20} />
                     </button>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     <Clock size={12} />
                     Received {dayjs(selectedEnquiry.createdAt).fromNow()}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
