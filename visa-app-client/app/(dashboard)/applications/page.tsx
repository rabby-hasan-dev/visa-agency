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
  HelpCircle,
  RefreshCw,
  PlusSquare,
  ChevronRight,
  Search as SearchIcon,
  Trash2,
  User as UserIcon,
  Tag,
  Filter,
  X as CloseIcon,
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

// ─── Sub-components ─────────────────────────────────────────────────────────

const QuickAction = ({
  icon: Icon,
  label,
  href,
  onClick,
}: {
  icon: React.ComponentType<{ size: number }>;
  label: string;
  href?: string;
  onClick?: () => void;
}) => {
  const content = (
    <div className="flex flex-col items-center gap-1.5 text-[#00264d] cursor-pointer">
      <Icon size={24} />
      <span className="text-[11px] hover:underline">{label}</span>
    </div>
  );
  return href ? (
    <NextLink href={href} className="no-underline text-[#00264d]">
      {content}
    </NextLink>
  ) : (
    <div onClick={onClick}>{content}</div>
  );
};

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
    if (
      !confirm(
        "Are you sure you want to remove this application? This action cannot be undone.",
      )
    )
      return;

    try {
      await deleteApp(app._id).unwrap();
      toast.success("Application removed successfully");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to remove application");
    }
  };

  const actionsRequired = () => {
    switch (app.status) {
      case "DRAFT":
        return [
          "Complete application details",
          "Provide supporting documents",
          "Contact agent for assistance if needed",
        ];
      case "SUBMITTED":
      case "UNDER_REVIEW":
      case "PROCESSING":
        return [
          "View current application status",
          "Arrange biometrics collection",
          "Keep contact details updated",
        ];
      case "PAYMENT_PENDING":
        return [
          "Complete visa application charge",
          "Provide payment receipt if requested",
        ];
      case "REJECTED":
      case "REFUSED":
        return [
          "View refusal notice for details",
          "Check eligibility for appeal",
          "Contact support for further guidance",
        ];
      case "APPROVED":
      case "GRANTED":
      case "PAID":
        return [
          "View grant notice",
          "Download visa grant letter",
          "Review conditions of stay",
        ];
      default:
        return ["Maintain updated application data"];
    }
  };

  const bottomActions = () => {
    const actions: {
      label: string;
      href?: string;
      onClick?: (e: React.MouseEvent) => void;
      color?: string;
    }[] = [];

    // Order per screenshot: Copy, Update details, Remove, Share

    // 1. Copy - Always show
    actions.push({
      label: "Copy",
      onClick: () =>
        toast.info("Application copy functionality is coming soon."),
    });

    // 2. Update details - Professional logic: Hide for DRAFT (which uses 'Edit'), show for others
    if (app.status !== "DRAFT") {
      actions.push({
        label: "Update details",
        href: `/applications/${app._id}?tab=update`,
      });
    }

    // 3. Remove - Strictly for DRAFT per user requirement
    if (app.status === "DRAFT") {
      actions.push({
        label: "Remove",
        onClick: handleRemove,
        color: "text-red-600 hover:text-red-700",
      });
    }

    // 4. Share - Always show
    actions.push({
      label: "Share",
      onClick: () => toast.info("Sharing functionality is coming soon."),
    });

    return actions;
  };

  return (
    <div className="border-b border-gray-300">
      <div
        className={`px-4 py-3 flex gap-4 items-start transition-colors duration-200 ${
          isExpanded
            ? "bg-[#f4f7f9] border-t-2 border-t-[#2150a0]"
            : "bg-white hover:bg-gray-50"
        }`}
      >
        <div
          onClick={onToggle}
          className="text-[#00264d] font-bold cursor-pointer text-base w-3.5 text-center select-none pt-0.5"
        >
          {isExpanded ? "-" : "+"}
        </div>
        <div className="flex-1">
          <NextLink
            href={`/applications/${app._id}`}
            className="text-[#2150a0] no-underline font-bold text-[13px] hover:underline"
          >
            {app.clientId?.name?.toUpperCase() || app.email || "NEW APPLICANT"}
            {app.clientId?.dateOfBirth &&
              ` (${new Date(app.clientId.dateOfBirth).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                },
              )})`}
          </NextLink>
          <div className="text-[11px] text-gray-700 mt-0.5">
            {app.visaCategory || "Transit"}{" "}
            {app.trn && (
              <span className="text-gray-400 font-normal ml-1">
                ({app.trn})
              </span>
            )}
          </div>
          <div className="text-[11px] text-gray-700 font-bold mt-0.5 flex items-center gap-1.5 uppercase tracking-wider">
            <span
              className={`w-2 h-2 rounded-full ${
                app.status === "DRAFT"
                  ? "bg-gray-400"
                  : app.status === "APPROVED" ||
                      app.status === "GRANTED" ||
                      app.status === "PAID"
                    ? "bg-green-600"
                    : app.status === "REJECTED" || app.status === "REFUSED"
                      ? "bg-red-600"
                      : app.status === "PAYMENT_PENDING"
                        ? "bg-orange-500"
                        : "bg-blue-600"
              }`}
            ></span>
            {app.status.replace(/_/g, " ")}
          </div>

          {app.createdByAgentId && (
            <div className="flex items-center gap-1.5 mt-1.5 px-2 py-0.5 bg-blue-50 border border-blue-100/50 rounded-full w-fit">
              <UserIcon size={10} className="text-[#2150a0]" />
              <span className="text-[9px] font-black text-[#2150a0] uppercase tracking-tighter">
                Representative: {app.createdByAgentId.name}
              </span>
            </div>
          )}

          {isExpanded && (
            <div className="mt-5 text-[11px] animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[120px_200px_120px_1fr] gap-x-10 gap-y-2.5 mb-5 p-3 bg-white border border-gray-200 rounded-sm shadow-sm">
                <div className="flex flex-col md:block">
                  <span className="text-gray-500 md:mr-2">Reference No</span>
                  <span className="font-bold">{app.trn || "PENDING"}</span>
                </div>
                <div className="flex flex-col md:block">
                  <span className="text-gray-500 md:mr-2">Last updated</span>
                  <span className="font-bold">
                    {app.updatedAt
                      ? new Date(app.updatedAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </span>
                </div>
                <div className="flex flex-col md:block">
                  <span className="text-gray-500 md:mr-2">Type</span>
                  <span className="font-bold">
                    {app.visaCategory || "Visa"}
                  </span>
                </div>
                <div className="flex flex-col md:block">
                  <span className="text-gray-500 md:mr-2">Date created</span>
                  <span className="font-bold">
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </span>
                </div>
                {app.createdByAgentId && (
                  <div className="flex flex-col md:block sm:col-span-2 lg:col-span-4">
                    <span className="text-gray-500 md:mr-2">Agent Details</span>
                    <div className="font-bold flex flex-wrap items-center gap-1.5 inline-flex">
                      <NextLink
                        href={`/manage-agents/${app.createdByAgentId._id}`}
                        className="text-[#2150a0] hover:underline"
                      >
                        {app.createdByAgentId.name}
                      </NextLink>
                      <span className="text-gray-400 font-normal">
                        ({app.createdByAgentId.email})
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions required */}
              <div className="mb-5">
                <div className="font-bold mb-1.5 text-gray-700 uppercase tracking-tight text-[10px]">
                  Actions required
                </div>
                <ul className="pl-4 m-0 list-disc text-red-700 space-y-0.5">
                  {actionsRequired().map((action, idx) => (
                    <li key={idx} className="hover:underline cursor-pointer">
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-t border-gray-200 pt-4 mt-2.5 gap-4">
                <div className="flex flex-wrap gap-2">
                  <NextLink
                    href={`/applications/${app._id}`}
                    className="bg-gray-100 border border-gray-400 px-3 py-1 rounded-sm text-[11px] text-gray-700 no-underline font-semibold hover:bg-gray-200 transition-colors shadow-sm"
                  >
                    View details
                  </NextLink>
                  {app.status === "DRAFT" && (
                    <NextLink
                      href={`/applications/new?id=${app._id}`}
                      className="bg-[#2150a0] border border-[#1a408a] px-3 py-1 rounded-sm text-[11px] text-white no-underline font-semibold hover:bg-[#1a408a] transition-colors shadow-sm"
                    >
                      Edit application
                    </NextLink>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-[#2150a0] items-center">
                  {bottomActions().map((action) =>
                    action.href ? (
                      <NextLink
                        key={action.label}
                        href={action.href}
                        className="cursor-pointer hover:underline text-[11px] font-medium no-underline text-[#2150a0]"
                      >
                        {action.label}
                      </NextLink>
                    ) : (
                      <span
                        key={action.label}
                        onClick={action.onClick}
                        className={`cursor-pointer hover:underline text-[11px] font-medium flex items-center gap-1 ${
                          action.color || ""
                        } ${isDeleting && action.label === "Remove" ? "opacity-50 pointer-events-none" : ""}`}
                      >
                        {action.label === "Remove" && <Trash2 size={12} />}
                        {action.label}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ApplicationsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const agentId = searchParams.get("agentId");

  const [importApplications, { isLoading: isImporting }] = useImportApplicationsMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [queryTerm, setQueryTerm] = useState("");
  const [sortBy, setSortBy] = useState("-updatedAt");
  const [page, setPage] = useState(1);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    visaCategory: "",
  });

  const limit = 10;

  const cleanedFilters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== ""),
  );

  const { data, isLoading, refetch, isFetching } = useGetApplicationsQuery({
    searchTerm: queryTerm,
    sort: sortBy,
    page,
    limit,
    ...cleanedFilters,
    ...(agentId ? { createdByAgentId: agentId } : {}),
  });

  const applications = (data?.data?.result || []) as Application[];
  const meta = data?.data?.meta || {
    total: 0,
    totalPage: 1,
    limit: 10,
    page: 1,
  };
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const { data: meData } = useGetMeQuery({});
  const { data: agentsData } = useGetAgentsQuery(undefined, {
    skip:
      meData?.data?.user?.role !== "admin" &&
      meData?.data?.user?.role !== "superAdmin",
  });

  const { data: visaTypesData } = useGetVisaTypesQuery({});

  // Extract unique categories from visa types
  const visaCategories = Array.from(
    new Set(
      visaTypesData?.data?.result?.map(
        (vt: { category: string }) => vt.category,
      ) || [],
    ),
  ) as string[];

  const agents = (agentsData?.data || []) as { _id: string; name: string }[];
  const selectedAgent = agents.find((a) => a._id === agentId);
  const isAdmin =
    meData?.data?.user?.role === "admin" ||
    meData?.data?.user?.role === "superAdmin";

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setQueryTerm(searchTerm);
      setPage(1);
    }, 500); // 500ms delay

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQueryTerm(searchTerm);
    setPage(1);
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Applications list refreshed");
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const applications = lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',').map(v => v.trim());
        const app: Record<string, string> = {};
        headers.forEach((header, index) => {
          app[header] = values[index];
        });
        return app;
      });

      if (applications.length === 0) {
        toast.error("No data found in CSV");
        return;
      }

      try {
        const result = await importApplications({ applications }).unwrap();
        toast.success(`Successfully imported ${result?.data?.importedCount} applications`);
        if (result?.data?.failedCount > 0) {
          toast.warning(`${result?.data?.failedCount} applications failed to import. Check console for details.`);
          console.error("Import errors:", result?.data?.errors);
        }
      } catch (err: unknown) {
        console.error("Import failed:", err);
        const error = err as { data?: { message?: string } };
        toast.error(error?.data?.message || "Bulk import failed");
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="font-sans px-5">
      <input 
        type="file" 
        id="import-csv" 
        className="hidden" 
        accept=".csv" 
        onChange={handleImport}
      />
      {/* Summary Header */}
      <div className="bg-[#00264d] text-white px-3 py-1.5 flex items-center justify-between rounded-t-sm">
        <span className="font-bold text-[13px]">My applications summary</span>
        <HelpCircle size={16} />
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white border border-gray-300 border-t-0 px-4 md:px-8 py-4 flex flex-wrap justify-between md:justify-start md:gap-12 mb-5">
        <QuickAction
          icon={PlusSquare}
          label="New application"
          href="/applications/new"
        />
        <QuickAction 
          icon={Download} 
          label={isImporting ? "Importing..." : "Import application"} 
          onClick={() => document.getElementById('import-csv')?.click()}
        />
        {/* <QuickAction icon={ArrowUpCircle} label="Submit applications" /> */}
      </div>

      {/* Search and Filters */}
      <div className="mb-5">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
        >
          <div className="flex border border-gray-500 bg-white w-full sm:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-2 py-1 border-none outline-none flex-1 sm:w-[250px] text-xs"
              placeholder="Search applications..."
            />
            <button
              type="submit"
              className="bg-gray-100 border-l border-gray-500 px-3 py-1 cursor-pointer hover:bg-gray-200"
            >
              <SearchIcon size={14} />
            </button>
          </div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsAdvancedSearchOpen(!isAdvancedSearchOpen);
            }}
            className="text-[#00264d] underline text-[11px] font-bold"
          >
            {isAdvancedSearchOpen ? "Basic Search" : "Advanced search"}
          </a>
        </form>

        {isAdvancedSearchOpen && (
          <div className="mt-4 bg-gray-50 border border-gray-300 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-700 uppercase">
                Application Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, status: e.target.value }));
                  setPage(1);
                }}
                className="bg-white border border-gray-300 text-xs px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#2150a0]"
              >
                <option value="">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="PAYMENT_PENDING">Payment Pending</option>
                <option value="PAID">Paid</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-700 uppercase">
                Visa Category
              </label>
              <select
                value={filters.visaCategory}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    visaCategory: e.target.value,
                  }));
                  setPage(1);
                }}
                className="bg-white border border-gray-300 text-xs px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#2150a0]"
              >
                <option value="">All Categories</option>
                {visaCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setFilters({ status: "", visaCategory: "" });
                  setSearchTerm("");
                  setIsAdvancedSearchOpen(false);
                  setPage(1);
                }}
                className="text-[11px] font-bold text-red-600 hover:underline transition-colors uppercase tracking-tight"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f0f4f8] border border-gray-300 rounded-sm">
              <Filter size={12} className="text-[#00264d]" />
              <span className="text-[11px] font-bold text-[#00264d] uppercase tracking-tighter">
                Filter by Global Agent
              </span>
              <select
                value={agentId || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const params = new URLSearchParams(searchParams.toString());
                  if (val) params.set("agentId", val);
                  else params.delete("agentId");
                  router.push(`/applications?${params.toString()}`);
                  setPage(1);
                }}
                className="bg-white border border-gray-300 text-[11px] rounded-sm px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-[#2150a0]"
              >
                <option value="">All Registered Agents</option>
                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedAgent && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#cc3300]/10 border border-[#cc3300]/20 rounded-sm animate-in fade-in slide-in-from-left-2 duration-300">
                <Tag size={12} className="text-[#cc3300]" />
                <span className="text-[11px] font-bold text-[#cc3300] uppercase tracking-tighter italic">
                  Isolated View: {selectedAgent.name}
                </span>
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("agentId");
                    router.push(`/applications?${params.toString()}`);
                  }}
                  className="ml-1 text-[#cc3300] hover:bg-[#cc3300]/10 p-0.5 rounded-full transition-colors"
                >
                  <CloseIcon size={12} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* List Header */}
      <div className="text-base text-[#00264d] mb-2.5">
        List of applications
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2.5 text-[11px] gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span>Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="px-1.5 py-0.5 border border-gray-300 text-[11px] outline-none cursor-pointer bg-white"
            >
              <option value="-updatedAt">Last updated</option>
              <option value="clientId.name">Name (A-Z)</option>
              <option value="-clientId.name">Name (Z-A)</option>
              <option value="-createdAt">Date created</option>
            </select>
            <button className="bg-gray-100 border border-gray-300 px-1.5 py-0.5 hover:bg-gray-200">
              <ChevronRight size={12} style={{ transform: "rotate(90deg)" }} />
            </button>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-transparent border-none flex items-center gap-1 text-[#00264d] cursor-pointer hover:underline disabled:opacity-50"
            disabled={isFetching}
          >
            <RefreshCw size={12} className={isFetching ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
        <div className="text-gray-500">
          {meta.total > 0 ? (
            <>
              {(meta.page - 1) * meta.limit + 1} -{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
              results &nbsp; Page {meta.page}
            </>
          ) : (
            "0 results"
          )}
        </div>
      </div>

      {/* Applications List */}
      <div className="border border-gray-300 border-b-0">
        {isLoading ? (
          <div className="p-5 text-center bg-white border-b border-gray-300">
            Loading...
          </div>
        ) : applications.length === 0 ? (
          <div className="p-5 text-center bg-white border-b border-gray-300">
            No applications found.
          </div>
        ) : (
          applications.map((app) => (
            <ApplicationRow
              key={app._id}
              app={app}
              isExpanded={expandedIds.includes(app._id)}
              onToggle={() => toggleExpand(app._id)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {meta.totalPage > 1 && (
        <div className="flex justify-end mt-2.5">
          <div className="flex border border-gray-300 bg-gray-100 shadow-sm">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-2 py-1 text-xs border-r border-gray-300 hover:bg-white disabled:text-gray-400 disabled:hover:bg-gray-100 transition-colors"
              title="First page"
            >
              «
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2 py-1 text-xs border-r border-gray-300 hover:bg-white disabled:text-gray-400 disabled:hover:bg-gray-100 transition-colors"
              title="Previous page"
            >
              ‹
            </button>
            <div className="px-3 py-1 text-xs border-r border-gray-300 bg-white font-medium flex items-center">
              {page}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
              disabled={page === meta.totalPage}
              className="px-2 py-1 text-xs border-r border-gray-300 hover:bg-white disabled:text-gray-400 disabled:hover:bg-gray-100 transition-colors"
              title="Next page"
            >
              ›
            </button>
            <button
              onClick={() => setPage(meta.totalPage)}
              disabled={page === meta.totalPage}
              className="px-2 py-1 text-xs hover:bg-white disabled:text-gray-400 disabled:hover:bg-gray-100 transition-colors"
              title="Last page"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
