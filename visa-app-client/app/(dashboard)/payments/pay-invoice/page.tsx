"use client";

import { useGetInvoicesQuery } from "@/redux/api/invoiceApi";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { CreditCard, Search, FileText } from "lucide-react";
import { useAlert } from "@/components/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  paymentSearchSchema,
  PaymentSearchValues,
} from "@/schemas/payment.schema";

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
    fullName?: string;
  };
}

export default function PayInvoiceSearchPage() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { data, isLoading } = useGetInvoicesQuery({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentSearchValues>({
    resolver: zodResolver(paymentSearchSchema),
    defaultValues: {
      searchTerm: "",
    },
  });

  const invoices = useMemo(() => {
    return (data?.data?.result || []) as Invoice[];
  }, [data]);

  const pendingInvoices = useMemo(() => {
    return invoices.filter((inv) => inv.status === "pending");
  }, [invoices]);

  const onSearch = (data: PaymentSearchValues) => {
    const term = data.searchTerm.trim();
    if (!term) return;

    // Search for an invoice that matches the ID or invoice Number
    const found = invoices.find(
      (inv) =>
        inv.invoiceNumber === term ||
        inv._id === term ||
        inv.applicationId?._id === term,
    );

    if (found) {
      router.push(`/payments/invoice/${found._id}/pay`);
    } else {
      showAlert({
        title: "Not Found",
        message: "No invoice found matching that reference or invoice number.",
        type: "error",
      });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <div className="bg-[#00264d] min-h-[44px] py-1 flex items-center px-5 text-white text-base md:text-lg font-bold">
        Pay an Invoice
      </div>

      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="bg-white border border-gray-300 shadow-sm mb-8">
          <div className="bg-[#00264d] text-white px-4 py-2 font-bold">
            Search for Invoice
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-700 mb-4">
              Enter your Invoice Number, Transaction Reference Number (TRN), or
              Application ID to find and pay an existing invoice.
            </p>
            <form
              onSubmit={handleSubmit(onSearch)}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                <div className="flex-1 w-full sm:max-w-sm text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    {...register("searchTerm")}
                    placeholder="e.g. INV-123456 or AUE-..."
                    className={`w-full border ${errors.searchTerm ? "border-red-500" : "border-gray-400"} p-2 text-sm rounded outline-none focus:border-[#2150a0]`}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#2150a0] text-white px-6 py-2 text-sm font-bold rounded hover:bg-[#153468] transition-colors flex items-center justify-center gap-2 h-[38px] w-full sm:w-auto"
                >
                  <Search size={16} />
                  Search
                </button>
              </div>
              {errors.searchTerm && (
                <span className="text-red-500 text-xs">
                  {errors.searchTerm.message}
                </span>
              )}
            </form>
          </div>
        </div>

        <div className="bg-white border border-gray-300 shadow-sm">
          <div className="bg-[#00264d] text-white px-4 py-2 font-bold flex justify-between items-center">
            <span>Pending Invoices</span>
            <span className="text-[10px] bg-[#ffcc00] px-2 py-0.5 rounded text-black font-bold uppercase tracking-wide inline-block">
              {pendingInvoices.length} Awaiting Payment
            </span>
          </div>

          <div className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Invoice No.</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Applicant</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Loading invoices...
                    </td>
                  </tr>
                ) : pendingInvoices.length > 0 ? (
                  pendingInvoices.map((inv) => (
                    <tr
                      key={inv._id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-[#2150a0]">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-gray-400" />
                          {inv.invoiceNumber}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {inv.clientId?.fullName || "N/A"}
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-800">
                        {inv.amount.toFixed(2)} {inv.currency}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() =>
                            router.push(`/payments/invoice/${inv._id}/pay`)
                          }
                          className="bg-green-600 text-white px-4 py-1.5 text-xs font-bold rounded flex items-center gap-2 hover:bg-green-700 transition-colors ml-auto"
                        >
                          <CreditCard size={14} />
                          Pay Now
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-gray-500"
                    >
                      You have no pending invoices to pay at this time.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
