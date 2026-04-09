"use client";

import {
  useGetApplicationsQuery,
  useDeleteApplicationMutation,
  useImportApplicationsMutation,
} from "@/redux/api/applicationApi";
import { useGetVisaTypesQuery } from "@/redux/api/visaTypeApi";
import { useGetAgentsQuery } from "@/redux/api/adminApi";
import { useGetMeQuery } from "@/redux/api/userApi";
import NextLink from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Download,
  RefreshCw,
  Plus,
  Search as SearchIcon,
  Trash2,
  User as UserIcon,
  Filter,
  X as CloseIcon,
  ChevronDown,
  ChevronRight,
  FileText,
  Loader2,
  Eye,
  Pencil,
  Copy,
  Share2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Application {
  _id: string;
  status: string;
  visaCategory: string;
  clientId?: { name?: string; dateOfBirth?: string };
  createdByAgentId?: { _id: string; name: string; email: string };
  email?: string;
  trn?: string;
  updatedAt?: string;
  createdAt?: string;
}

// ─── Status Badge ────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-600 border-gray-200",
    SUBMITTED: "bg-blue-50 text-blue-600 border-blue-100",
    UNDER_REVIEW: "bg-indigo-50 text-indigo-600 border-indigo-100",
    PROCESSING: "bg-purple-50 text-purple-600 border-purple-100",
    PAYMENT_PENDING: "bg-amber-50 text-amber-600 border-amber-100",
    PAID: "bg-emerald-50 text-emerald-600 border-emerald-100",
    APPROVED: "bg-green-50 text-green-600 border-green-100",
    GRANTED: "bg-green-50 text-green-600 border-green-100",
    REJECTED: "bg-rose-50 text-rose-600 border-rose-100",
    REFUSED: "bg-rose-50 text-rose-600 border-rose-100",
  };
  const cls = map[status] ?? "bg-gray-100 text-gray-500 border-gray-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cls}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
};

// ─── Application Row ─────────────────────────────────────────────────────────

const ApplicationRow = ({
  app,
  isExpanded,
  onToggle,
}: {
  app: Application;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const [deleteApp, { isLoading: isDeleting }] = useDeleteApplicationMutation();

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to remove this application? This cannot be undone.")) return;
    try {
      await deleteApp(app._id).unwrap();
      toast.success("Application removed");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to remove application");
    }
  };

  const actionsRequired = () => {
    switch (app.status) {
      case "DRAFT": return ["Complete application details", "Attach supporting documents"];
      case "SUBMITTED":
      case "UNDER_REVIEW":
      case "PROCESSING": return ["Check current status", "Arrange biometrics if required", "Keep contact details updated"];
      case "PAYMENT_PENDING": return ["Complete visa application payment", "Provide payment receipt if requested"];
      case "REJECTED":
      case "REFUSED": return ["Review refusal notice", "Check eligibility for appeal", "Contact support for guidance"];
      case "APPROVED":
      case "GRANTED":
      case "PAID": return ["View grant notice", "Download visa grant letter", "Review conditions of stay"];
      default: return ["Keep application data up to date"];
    }
  };

  const clientName = app.clientId?.name?.toUpperCase() || app.email || "NEW APPLICANT";
  const dob = app.clientId?.dateOfBirth
    ? new Date(app.clientId.dateOfBirth).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : null;

  const fmtDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden transition-all ${isExpanded ? "shadow-md" : "shadow-sm hover:shadow-md"}`}>
      {/* Row Header */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 cursor-pointer"
        onClick={onToggle}
      >
        {/* Expand toggle */}
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${isExpanded ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 text-gray-400"}`}>
          {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </div>

        {/* Applicant info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-gray-900 truncate">{clientName}</span>
            {dob && <span className="text-xs text-gray-400">({dob})</span>}
            <StatusBadge status={app.status} />
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <span className="text-xs text-gray-500">{app.visaCategory || "Visa Application"}</span>
            {app.trn && <span className="text-xs text-gray-400">Ref: {app.trn}</span>}
            {app.createdByAgentId && (
              <span className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                <UserIcon size={9} /> {app.createdByAgentId.name}
              </span>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="hidden sm:block text-right shrink-0">
          <p className="text-[10px] text-gray-400">Updated</p>
          <p className="text-xs text-gray-600">{fmtDate(app.updatedAt)}</p>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-100 px-4 py-4 bg-gray-50 space-y-4">
          {/* Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Reference No", value: app.trn || "Pending" },
              { label: "Visa Type", value: app.visaCategory || "—" },
              { label: "Created", value: fmtDate(app.createdAt) },
              { label: "Last Updated", value: fmtDate(app.updatedAt) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-lg px-3 py-2.5">
                <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
                <p className="text-xs font-semibold text-gray-700">{value}</p>
              </div>
            ))}
            {app.createdByAgentId && (
              <div className="bg-white border border-gray-100 rounded-lg px-3 py-2.5 sm:col-span-4">
                <p className="text-[10px] text-gray-400 mb-0.5">Agent</p>
                <p className="text-xs font-semibold text-gray-700">
                  {app.createdByAgentId.name}{" "}
                  <span className="font-normal text-gray-400">({app.createdByAgentId.email})</span>
                </p>
              </div>
            )}
          </div>

          {/* Actions Required */}
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Actions Required</p>
            <ul className="space-y-1">
              {actionsRequired().map((action, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="w-1 h-1 bg-amber-400 rounded-full mt-1.5 shrink-0" />
                  {action}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              <NextLink href={`/applications/${app._id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                <Eye size={13} /> View Details
              </NextLink>
              {app.status === "DRAFT" && (
                <NextLink href={`/applications/new?id=${app._id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Pencil size={13} /> Edit Application
                </NextLink>
              )}
              {app.status !== "DRAFT" && (
                <NextLink href={`/applications/${app._id}?tab=update`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                  <Pencil size={13} /> Update Details
                </NextLink>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => toast.info("Copy coming soon")}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors">
                <Copy size={12} /> Copy
              </button>
              <button onClick={() => toast.info("Share coming soon")}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors">
                <Share2 size={12} /> Share
              </button>
              {app.status === "DRAFT" && (
                <button
                  onClick={handleRemove}
                  disabled={isDeleting}
                  className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ApplicationsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const agentId = searchParams.get("agentId");

  const [importApplications, { isLoading: isImporting }] = useImportApplicationsMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [queryTerm, setQueryTerm] = useState("");
  const [sortBy, setSortBy] = useState("-updatedAt");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: "", visaCategory: "" });

  const limit = 10;
  const cleanedFilters = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ""));

  const { data, isLoading, refetch, isFetching } = useGetApplicationsQuery({
    searchTerm: queryTerm, sort: sortBy, page, limit,
    ...cleanedFilters,
    ...(agentId ? { createdByAgentId: agentId } : {}),
  });

  const applications = (data?.data?.result || []) as Application[];
  const meta = data?.data?.meta || { total: 0, totalPage: 1, limit: 10, page: 1 };
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const { data: meData } = useGetMeQuery({});
  const isAdmin = meData?.data?.user?.role === "admin" || meData?.data?.user?.role === "superAdmin";

  const { data: agentsData } = useGetAgentsQuery(undefined, { skip: !isAdmin });
  const { data: visaTypesData } = useGetVisaTypesQuery({});

  const visaCategories = Array.from(new Set(
    visaTypesData?.data?.result?.map((vt: { category: string }) => vt.category) || []
  )) as string[];

  const agents = (agentsData?.data || []) as { _id: string; name: string }[];
  const selectedAgent = agents.find((a) => a._id === agentId);

  useEffect(() => {
    const handler = setTimeout(() => { setQueryTerm(searchTerm); setPage(1); }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleRefresh = () => { refetch(); toast.success("Refreshed"); };
  const toggleExpand = (id: string) => setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) { toast.error("Please upload a CSV file"); return; }
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n");
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      const apps = lines.slice(1).filter(l => l.trim()).map(line => {
        const values = line.split(",").map(v => v.trim());
        const app: Record<string, string> = {};
        headers.forEach((h, i) => { app[h] = values[i]; });
        return app;
      });
      if (!apps.length) { toast.error("No data found in CSV"); return; }
      try {
        const result = await importApplications({ applications: apps }).unwrap();
        toast.success(`Imported ${result?.data?.importedCount} applications`);
        if (result?.data?.failedCount > 0) toast.warning(`${result?.data?.failedCount} failed`);
      } catch (err: unknown) {
        const error = err as { data?: { message?: string } };
        toast.error(error?.data?.message || "Import failed");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const hasActiveFilters = filters.status || filters.visaCategory || agentId;

  return (
    <div className="space-y-5">
      <input type="file" id="import-csv" className="hidden" accept=".csv" onChange={handleImport} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Applications</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {meta.total > 0 ? `${meta.total} total application${meta.total !== 1 ? "s" : ""}` : "No applications"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => document.getElementById("import-csv")?.click()}
            disabled={isImporting}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-600 transition-colors"
          >
            {isImporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            Import CSV
          </button>
          <NextLink href="/applications/new"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Plus size={16} /> New Application
          </NextLink>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <form onSubmit={(e) => { e.preventDefault(); setQueryTerm(searchTerm); setPage(1); }} className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, reference..."
                className="w-full pl-9 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors bg-white"
              />
            </div>
          </form>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="px-3 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-lg outline-none focus:border-blue-400 bg-white"
          >
            <option value="-updatedAt">Last updated</option>
            <option value="clientId.name">Name (A–Z)</option>
            <option value="-clientId.name">Name (Z–A)</option>
            <option value="-createdAt">Date created</option>
          </select>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2.5 text-sm border rounded-lg transition-colors ${showFilters || hasActiveFilters ? "bg-blue-50 border-blue-200 text-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            <Filter size={15} />
            Filters
            {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
          </button>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="flex items-center gap-2 px-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-100">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Status</label>
              <select value={filters.status}
                onChange={(e) => { setFilters(p => ({ ...p, status: e.target.value })); setPage(1); }}
                className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg outline-none focus:border-blue-400 bg-white">
                <option value="">All Statuses</option>
                {["DRAFT","SUBMITTED","UNDER_REVIEW","PAYMENT_PENDING","PAID","APPROVED","REJECTED"].map(s => (
                  <option key={s} value={s}>{s.replace(/_/g," ")}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Visa Category</label>
              <select value={filters.visaCategory}
                onChange={(e) => { setFilters(p => ({ ...p, visaCategory: e.target.value })); setPage(1); }}
                className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg outline-none focus:border-blue-400 bg-white">
                <option value="">All Categories</option>
                {visaCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {isAdmin && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Agent</label>
                <select value={agentId || ""}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams.toString());
                    e.target.value ? params.set("agentId", e.target.value) : params.delete("agentId");
                    router.push(`/applications?${params.toString()}`); setPage(1);
                  }}
                  className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg outline-none focus:border-blue-400 bg-white">
                  <option value="">All Agents</option>
                  {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              </div>
            )}
            <div className="flex items-end">
              <button
                onClick={() => { setFilters({ status: "", visaCategory: "" }); setSearchTerm(""); setPage(1); }}
                className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* Active agent badge */}
        {selectedAgent && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg w-fit text-xs text-amber-700 font-medium">
            Filtered by agent: {selectedAgent.name}
            <button onClick={() => { const p = new URLSearchParams(searchParams.toString()); p.delete("agentId"); router.push(`/applications?${p.toString()}`); }}
              className="text-amber-500 hover:text-amber-700">
              <CloseIcon size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 bg-white border border-gray-200 rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={24} className="animate-spin text-blue-500" />
            <p className="text-sm text-gray-400">Loading applications...</p>
          </div>
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-xl">
          <FileText size={36} className="text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-500">No applications found</p>
          <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
          <NextLink href="/applications/new"
            className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Plus size={14} /> Create First Application
          </NextLink>
        </div>
      ) : (
        <div className="space-y-2.5">
          {applications.map((app) => (
            <ApplicationRow
              key={app._id}
              app={app}
              isExpanded={expandedIds.includes(app._id)}
              onToggle={() => toggleExpand(app._id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPage > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Showing {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
          </p>
          <div className="flex items-center gap-1">
            {[
              { label: "«", action: () => setPage(1), disabled: page === 1 },
              { label: "‹", action: () => setPage(p => Math.max(1, p - 1)), disabled: page === 1 },
              { label: "›", action: () => setPage(p => Math.min(meta.totalPage, p + 1)), disabled: page === meta.totalPage },
              { label: "»", action: () => setPage(meta.totalPage), disabled: page === meta.totalPage },
            ].map(({ label, action, disabled }, i) => (
              <button key={i} onClick={action} disabled={disabled}
                className="w-8 h-8 flex items-center justify-center text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white text-gray-600">
                {label}
              </button>
            ))}
            <span className="px-3 h-8 flex items-center text-xs font-semibold bg-blue-600 text-white rounded-lg">
              {page} / {meta.totalPage}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
