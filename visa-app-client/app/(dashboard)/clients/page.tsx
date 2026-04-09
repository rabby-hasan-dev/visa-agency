"use client";

import { useGetClientsQuery } from "@/redux/api/clientApi";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Client {
  _id: string;
  fullName: string;
  passportNumber?: string;
  nationality?: string;
  email?: string;
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ClientsPage() {
  const { data, isLoading } = useGetClientsQuery({});
  const clients = (data?.data?.result || []) as Client[];

  return (
    <div className="px-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
        <Link
          href="/clients/new"
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition-colors text-sm no-underline"
        >
          <Plus className="w-4 h-4" />
          New Client
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Passport No</th>
                <th className="px-6 py-3">Nationality</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading clients...
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No clients found.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr
                    key={client._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {client.fullName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {client.passportNumber}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {client.nationality}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{client.email}</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/applications/new?clientId=${client._id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium no-underline"
                      >
                        Start App
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
