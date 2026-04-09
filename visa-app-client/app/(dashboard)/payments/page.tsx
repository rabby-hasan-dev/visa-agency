"use client";

import { useGetInvoicesQuery } from "@/redux/api/invoiceApi";
import { HelpCircle, ChevronDown, FileText, CreditCard } from "lucide-react";
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

const PrintStyles = () => (
  <style jsx global>{`
    @media print {
      nav,
      aside,
      .no-print,
      button,
      .flex-col.gap-4 {
        display: none !important;
      }
      .bg-gray-100 {
        background-color: white !important;
      }
      .p-5 {
        padding: 0 !important;
      }
      table {
        font-size: 10pt !important;
      }
    }
  `}</style>
);

// ─── Sub-components ─────────────────────────────────────────────────────────

const ActionButton = ({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ComponentType<{ size: number }>;
  label: string;
  href?: string;
}) => {
  const btn = (
    <button className="flex items-center gap-2 px-2.5 py-1 text-[11px] bg-gray-100 border border-gray-300 cursor-pointer text-gray-700 hover:bg-gray-200 transition-colors">
      <Icon size={14} />
      {label}
    </button>
  );
  return href ? <Link href={href}>{btn}</Link> : btn;
};

const TableHeader = ({ columns }: { columns: string[] }) => (
  <thead>
    <tr className="bg-gray-600 text-white">
      {columns.map((col) => (
        <th
          key={col}
          className="text-left px-2 py-1.5 font-bold border-r border-gray-500 last:border-r-0"
        >
          <div className="flex justify-between items-center">
            {col}
            <span className="text-[8px]">▲▼</span>
          </div>
        </th>
      ))}
    </tr>
  </thead>
);

// ─── Main Component ─────────────────────────────────────────────────────────

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    currency: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on search
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
        showAlert({
          title: "Payment Successful",
          message: "The payment gateway processed your transaction.",
          type: "success",
        });
      } else if (status === "failed") {
        showAlert({
          title: "Payment Failed",
          message: "The payment gateway rejected the payment transaction.",
          type: "error",
        });
      } else if (status === "error") {
        showAlert({
          title: "Payment Error",
          message:
            "An error occurred while communicating with the payment gateway.",
          type: "warning",
        });
      }

      // Clean up URL parameters after alerting
      router.replace("/payments", { scroll: false });
    }
  }, [searchParams, router, showAlert]);

  const handlePrint = () => {
    window.print();
  };

  const toggleAdvancedSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdvancedSearchOpen(!isAdvancedSearchOpen);
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const columns = [
    "Type",
    "Reference No.",
    "Name",
    "Transaction Date",
    "Issuing Office",
    "Internal Ref.",
    "Currency",
    "Amount",
    "Status",
    "Select Action",
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <PrintStyles />
      {/* Tab Bar */}
      <div className="bg-gray-300 px-5 flex border-b border-gray-400 h-7 items-end no-print">
        <div className="bg-white px-4 text-xs font-bold border border-gray-400 border-b-0 rounded-t h-full flex items-center text-gray-700">
          My applications
        </div>
      </div>

      <div className="p-5">
        {/* Manage Payments Section */}
        <div className="bg-white border border-[#00264d] shadow-sm">
          {/* Section Header */}
          <div className="bg-[#00264d] text-white px-4 py-1.5 text-sm font-bold">
            Manage Payments
          </div>

          <div className="p-4">
            {/* Action Buttons */}
            <div className="flex gap-2.5 mb-5 no-print">
              {/* <ActionButton
                icon={FileText}
                label="Prepay Paper Service"
                href="/payments/pre-pay"
              /> */}
              {/* <ActionButton icon={CreditCard} label="Pay an Invoice" /> */}
            </div>

            {/* Filter and Search */}
            <div className="flex flex-col gap-4 mb-2.5">
              <div className="flex justify-end items-center gap-4 text-[11px]">
                <div className="flex gap-2.5">
                  <a
                    href="#"
                    onClick={toggleAdvancedSearch}
                    className="text-[#2150a0] underline"
                  >
                    {isAdvancedSearchOpen ? "Basic Search" : "Advanced Search"}
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePrint();
                    }}
                    className="text-[#2150a0] underline"
                  >
                    Print Summary
                  </a>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>Filter/Search:</span>
                  <input
                    type="text"
                    className="border border-gray-300 px-1.5 py-0.5 w-[150px]"
                    value={searchTerm}
                    placeholder="Invoice No, Status..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <HelpCircle size={18} className="text-[#00264d] cursor-help" />
              </div>

              {/* Advanced Search Panel */}
              {isAdvancedSearchOpen && (
                <div className="bg-gray-50 border border-gray-200 p-3 grid grid-cols-4 gap-4 text-[11px]">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-gray-600">Status</label>
                    <select
                      className="border border-gray-300 px-1.5 py-1 bg-white"
                      value={filters.status}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-gray-600">Currency</label>
                    <select
                      className="border border-gray-300 px-1.5 py-1 bg-white"
                      value={filters.currency}
                      onChange={(e) =>
                        handleFilterChange("currency", e.target.value)
                      }
                    >
                      <option value="">All Currencies</option>
                      <option value="AUD">AUD</option>
                      <option value="USD">USD</option>
                      <option value="BDT">BDT</option>
                      <option value="AED">AED</option>
                      <option value="QAR">QAR</option>
                      <option value="SGD">SGD</option>
                      <option value="INR">INR</option>
                      <option value="MYR">MYR</option>
                      <option value="TRY">TRY</option>
                      <option value="THB">THB</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFilters({ status: "", currency: "" });
                        setSearchTerm("");
                        setIsAdvancedSearchOpen(false);
                      }}
                      className="text-red-600 underline"
                    >
                      Reset All
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Payments Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[11px]">
                <TableHeader columns={columns} />
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="p-5 text-center text-gray-500"
                      >
                        Loading invoices...
                      </td>
                    </tr>
                  ) : invoices.length > 0 ? (
                    invoices.map((inv, idx) => (
                      <tr
                        key={inv._id}
                        className={`border-b border-gray-100 ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="p-2">Application Fee</td>
                        <td className="p-2 text-[#2150a0] font-bold">
                          {inv.invoiceNumber}
                        </td>
                        <td className="p-2">
                          {inv.clientId?.name?.toUpperCase()}
                        </td>
                        <td className="p-2">
                          {new Date(inv.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="p-2">Online</td>
                        <td className="p-2">
                          {inv.applicationId?._id?.slice(-10).toUpperCase() ||
                            "—"}
                        </td>
                        <td className="p-2">{inv.currency}</td>
                        <td className="p-2 font-medium">
                          {inv.amount.toFixed(2)}
                        </td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              inv.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : inv.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Link
                              href={`/payments/invoice/${inv._id}`}
                              className="bg-white border border-gray-300 text-gray-700 px-2 py-1 text-[10px] rounded hover:bg-gray-50 hover:border-gray-400 transition-colors"
                            >
                              Details
                            </Link>
                            {inv.status === "pending" ? (
                              <Link
                                href={`/payments/invoice/${inv._id}/pay`}
                                className="bg-[#2150a0] text-white px-3 py-1 text-[10px] rounded hover:bg-[#153468] transition-colors"
                              >
                                Pay Now
                              </Link>
                            ) : (
                              <button className="bg-gray-100 border border-gray-300 px-2 py-0.5 text-[10px] flex items-center gap-1 text-gray-600 cursor-not-allowed">
                                Paid <ChevronDown size={10} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={10}
                        className="p-5 text-center text-gray-500"
                      >
                        No invoices found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-[11px]">
              <div>
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, meta.total)} of {meta.total} entries
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1 mr-4">
                  <span>Show:</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="border border-gray-300 px-1 py-0.5 bg-white"
                  >
                    {[10, 20, 50, 100].map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex border border-gray-300 bg-gray-100 no-print">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(1)}
                    className="px-1.5 py-0.5 border-r border-gray-300 disabled:text-gray-400"
                  >
                    «
                  </button>
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-1.5 py-0.5 border-r border-gray-300 disabled:text-gray-400"
                  >
                    ‹
                  </button>
                  <span className="px-3 py-0.5 border-r border-gray-300 bg-white font-bold">
                    {page}
                  </span>
                  <button
                    disabled={page === meta.totalPage}
                    onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
                    className="px-1.5 py-0.5 border-r border-gray-300 disabled:text-gray-400"
                  >
                    ›
                  </button>
                  <button
                    disabled={page === meta.totalPage}
                    onClick={() => setPage(meta.totalPage)}
                    className="px-1.5 py-0.5 border-r border-gray-300 last:border-r-0 disabled:text-gray-400"
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
