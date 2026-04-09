"use client";

import { useGetInvoicesQuery } from "@/redux/api/invoiceApi";
import { HelpCircle, ChevronDown, FileText, CreditCard, Search, Filter, Printer, MoreVertical, X, ArrowUpRight, CheckCircle2, AlertCircle, Clock, ChevronLeft, ChevronRight, Hash } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAlert } from "@/components/ui";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Invoice {
  _id: string;
  invoiceNumber: string;
  createdAt: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  applicationId?: {
    _id: string;
  };
  clientId?: {
    name?: string;
  };
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    currency: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const cleanedFilters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== "")
  );

  const { data, isLoading } = useGetInvoicesQuery({
    page,
    limit,
    searchTerm: debouncedSearch,
    ...cleanedFilters,
  });

  const invoices = (data?.data?.result || []) as Invoice[];
  const meta = data?.data?.meta || { total: 0, totalPage: 1 };

  const searchParams = useSearchParams();
  const router = useRouter();
  const { showAlert } = useAlert();

  useEffect(() => {
    const status = searchParams.get("payment_status");
    if (status) {
      if (status === "success") {
        showAlert({ title: "Payment Successful", message: "Transaction processed successfully.", type: "success" });
      } else if (status === "failed") {
        showAlert({ title: "Payment Failed", message: "The transaction was rejected.", type: "error" });
      } else if (status === "error") {
        showAlert({ title: "Payment Error", message: "An error occurred with the gateway.", type: "warning" });
      }
      router.replace("/payments", { scroll: false });
    }
  }, [searchParams, router, showAlert]);

  const handlePrint = () => window.print();

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ status: "", currency: "" });
    setSearchTerm("");
    setShowFilters(false);
  };

  return (
    <div className="space-y-6 text-gray-800">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Payments & Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your application service fees.</p>
        </div>
        <div className="flex items-center gap-2 no-print">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <Printer size={14} /> Print Table
          </button>
        </div>
      </div>

      {/* ── Search & Filters ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden no-print">
        <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by invoice number, name or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                showFilters || Object.values(filters).some(v => v !== "")
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Filter size={16} />
              {Object.values(filters).some(v => v !== "") ? "Filters Active" : "Filters"}
            </button>
            {(Object.values(filters).some(v => v !== "") || searchTerm) && (
              <button
                onClick={clearFilters}
                className="p-2.5 text-gray-400 hover:text-rose-500 transition-colors"
                title="Clear all"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="px-4 pb-4 border-t border-gray-100 pt-4 bg-gray-50/50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Payment Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-400"
                >
                  <option value="">All Transactions</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Success / Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Currency</label>
                <select
                  value={filters.currency}
                  onChange={(e) => handleFilterChange("currency", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-400"
                >
                  <option value="">All Currencies</option>
                  {["AUD", "USD", "BDT", "AED", "QAR", "SGD", "INR", "MYR", "TRY", "THB"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end pb-0.5">
                <button
                  onClick={clearFilters}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4 px-1"
                >
                  Reset all filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Invoices List ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-5 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Invoice / Date</th>
                <th className="px-5 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client</th>
                <th className="px-5 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-5 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Amount</th>
                <th className="px-5 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-5 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right no-print">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-5 py-6">
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : invoices.length > 0 ? (
                invoices.map((inv) => (
                  <tr key={inv._id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          <Hash size={12} className="text-blue-600 opacity-50" />
                          {inv.invoiceNumber}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium whitespace-nowrap">
                          <Clock size={10} />
                          {new Date(inv.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-gray-700 uppercase tracking-tight">
                      {inv.clientId?.name || "System Record"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs text-gray-600 font-medium">Application Fee</div>
                      <div className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">
                        REF: {inv.applicationId?._id?.slice(-8) || "N/A"}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="text-sm font-black text-gray-900 tabular-nums">
                        {inv.currency} {inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          inv.status === "paid" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                          inv.status === "pending" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                          "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}>
                          {inv.status === "paid" ? <CheckCircle2 size={10} /> : 
                           inv.status === "pending" ? <Clock size={10} /> : <AlertCircle size={10} />}
                          {inv.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right no-print">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/payments/invoice/${inv._id}`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Invoice"
                        >
                          <FileText size={16} />
                        </Link>
                        {inv.status === "pending" ? (
                          <Link
                            href={`/payments/invoice/${inv._id}/pay`}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
                          >
                            <CreditCard size={12} /> Pay Now
                          </Link>
                        ) : (
                          <div className="w-10 flex justify-center text-emerald-500" title="Settled">
                            <CheckCircle2 size={16} />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
                        <AlertCircle size={24} />
                      </div>
                      <p className="text-sm text-gray-400 font-medium tracking-tight">No invoices matched your criteria.</p>
                      <button onClick={clearFilters} className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline">Clear all filters</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
          <div className="text-[11px] font-medium text-gray-400 tracking-tight">
            Showing <span className="text-gray-900 font-bold">{(page - 1) * limit + 1}</span> to{" "}
            <span className="text-gray-900 font-bold">{Math.min(page * limit, meta.total)}</span> of{" "}
            <span className="text-gray-900 font-bold">{meta.total}</span> invoices
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Lines:</span>
              <select
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                className="bg-white border border-gray-200 rounded-lg text-[10px] font-bold px-2 py-1 outline-none focus:border-blue-400"
              >
                {[10, 20, 50].map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(meta.totalPage, 5) }).map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        page === p ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <button
                disabled={page === meta.totalPage}
                onClick={() => setPage(p => Math.min(meta.totalPage, p + 1))}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
