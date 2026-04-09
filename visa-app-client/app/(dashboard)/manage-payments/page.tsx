"use client";

import { useGetPaymentsQuery, useGetAccountingReportQuery } from "@/redux/api/paymentApi";
import { useGetInvoicesQuery } from "@/redux/api/invoiceApi";
import { useGetAgentsQuery } from "@/redux/api/adminApi";
import { useGetApplicationsQuery } from "@/redux/api/applicationApi";
import { 
  ChevronDown, 
  FileText, 
  CreditCard, 
  PieChart, 
  Activity, 
  DollarSign, 
  Table, 
  User, 
  Search, 
  X,
  Download,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  TrendingUp
} from "lucide-react";
import { useState } from "react";

// ─── Interfaces ─────────────────────────────────────────────────────────────

interface IAgent {
  _id: string;
  name: string;
  email: string;
}

interface IApplication {
  _id: string;
  trn?: string;
}

interface IInvoice {
  _id: string;
  invoiceNumber: string;
  createdAt: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  applicationId?: {
    _id: string;
    trn?: string;
  };
  clientId?: {
    _id: string;
    name?: string;
  };
  agentId?: {
    name?: string;
    email?: string;
  };
}

interface IPayment {
  _id: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  createdAt: string;
  clientId?: {
    _id: string;
    name?: string;
    email?: string;
  };
  agentId?: {
    name?: string;
    email?: string;
  };
}

// ─── Sub-components ─────────────────────────────────────────────────────────

const StatCard = ({ label, value, subtext, icon: Icon, color }: { label: string; value: string | number; subtext?: string; icon: any; color: string }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${color} bg-opacity-10`}>
            <Icon size={20} className={color.replace('bg-', 'text-')} />
        </div>
        <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
            <ArrowUpRight size={10} /> Live
        </span>
    </div>
    <div>
      <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-gray-800">{value}</p>
      {subtext && <p className="text-[10px] text-gray-400 mt-1 font-medium">{subtext}</p>}
    </div>
  </div>
);

const TableHeader = ({ columns }: { columns: string[] }) => (
  <thead>
    <tr className="bg-[#00264d] text-white">
      {columns.map((col) => (
        <th
          key={col}
          className="text-left px-4 py-3 font-bold border-r border-white/5 last:border-r-0 uppercase tracking-tighter text-[11px]"
        >
          {col}
        </th>
      ))}
    </tr>
  </thead>
);

export default function ManagePaymentsPage() {
  const [activeTab, setActiveTab] = useState<"invoices" | "payments" | "stats">("stats");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");

  const { data: agentsData } = useGetAgentsQuery({});
  
  const commonParams = {
    searchTerm,
    agentId: selectedAgent || undefined,
  };

  const { data: invoicesData, isLoading: invLoading } = useGetInvoicesQuery(commonParams);
  const { data: paymentsData, isLoading: payLoading } = useGetPaymentsQuery(commonParams);
  const { data: accountingResponse } = useGetAccountingReportQuery({});
  
  const reports = accountingResponse?.data;
  const invoices = (invoicesData?.data?.result || []) as IInvoice[];
  const payments = (paymentsData?.data?.result || paymentsData?.data || []) as IPayment[];
  const agents = (agentsData?.data || []) as IAgent[];
  
  const handleExportCSV = (type: 'invoices' | 'payments') => {
    const data = type === 'invoices' ? invoices : payments;
    if (!data.length) return;
    
    const headers = type === 'invoices' 
        ? ["Inv#", "Source", "Client", "Amount", "Status", "Date"]
        : ["TxnID", "Agent", "Client", "Gateway", "Amount", "Status", "Date"];
        
    const rows = data.map((item: any) => type === 'invoices' 
        ? [item.invoiceNumber, item.agentId?.name || 'Direct', item.clientId?.name, item.amount, item.status, new Date(item.createdAt).toLocaleDateString()]
        : [item.transactionId, item.agentId?.name || 'Direct', item.clientId?.name, item.gateway, item.amount, item.status, new Date(item.createdAt).toLocaleDateString()]
    );
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `${type}_export_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="px-6 pb-20 font-sans min-h-screen bg-gray-50/30">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#00264d] tracking-tighter m-0 uppercase italic">Financial Operations</h1>
          <p className="text-gray-400 text-xs mt-1 font-medium">Monitoring and auditing end-to-end financial transaction cycles.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-lg border border-green-100">
                <ShieldCheck size={14} className="text-green-600" />
                <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">PCI Compliant Log</span>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-xl border border-gray-200 mb-8 w-fit shadow-sm">
        {[
          { id: "stats", label: "Executive Summary", icon: PieChart },
          { id: "invoices", label: "Financial Invoices", icon: FileText },
          { id: "payments", label: "Gateway Ledger", icon: CreditCard },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "invoices" | "payments" | "stats")}
            className={`flex items-center gap-2 px-6 py-2 text-[11px] font-black uppercase tracking-tight transition-all rounded-lg cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#00264d] text-white shadow-md"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "stats" && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              label="Total Revenue Flows" 
              value={`$${reports?.revenueBySource?.reduce((a: number,b: any) => a + b.revenue, 0).toLocaleString() || 0}`} 
              subtext="Aggregated across all gateways"
              icon={DollarSign} 
              color="bg-blue-600" 
            />
            <StatCard 
              label="Successful Settlements" 
              value={reports?.moneyFlow?.reduce((a: number,b: any) => a + b.count, 0) || 0} 
              subtext="Verified cleared payments"
              icon={Activity} 
              color="bg-green-600" 
            />
            <StatCard 
              label="Active Invoices" 
              value={invoices.length} 
              subtext="Generated system-wide"
              icon={FileText} 
              color="bg-purple-600" 
            />
            <StatCard 
              label="Processing Inquiries" 
              value={reports?.applicationStats?.reduce((a: number,b: any) => a + b.count, 0) || 0} 
              subtext="Total items auditable"
              icon={Table} 
              color="bg-orange-600" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.1em]">Revenue Performance (30D)</h3>
                    <TrendingUp size={16} className="text-blue-500" />
                </div>
                <div className="h-48 border-b border-gray-50 flex items-end gap-1 px-4">
                {reports?.dailyTrend?.map((t: any, i: number) => (
                    <div key={i} className="flex-1 bg-blue-500/20 hover:bg-[#00264d] transition-all rounded-t-sm cursor-help group relative" style={{ height: `${(t.revenue / Math.max(...reports.dailyTrend.map((x: any) => x.revenue))) * 100}%` }}>
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-[9px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
                            {t._id}: ${t.revenue.toLocaleString()}
                        </div>
                    </div>
                ))}
                </div>
                <div className="flex justify-between mt-3 text-[9px] text-gray-400 font-black tracking-widest">
                    <span>TIMELINE ANALYSIS</span>
                    <span>DAILY SETTLEMENTS</span>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.1em] mb-6">Gateway Distribution Health</h3>
                <div className="space-y-6">
                    {reports?.paymentMethods?.map((pm: any, idx: number) => (
                        <div key={idx}>
                            <div className="flex justify-between text-[11px] font-bold mb-2">
                                <span className="uppercase text-gray-400 tracking-wider font-medium">{pm._id} Service Flow</span>
                                <span className="text-[#00264d] font-black">${pm.revenue.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden border border-gray-100">
                                <div 
                                    className="bg-[#00264d] h-full rounded-full transition-all duration-1000" 
                                    style={{ width: `${(pm.revenue / reports.paymentMethods.reduce((a: number, b: any) => a + b.revenue, 0)) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                    {(!reports || reports.paymentMethods.length === 0) && (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-300 italic text-[11px]">
                            <CreditCard size={32} className="mb-2 opacity-20" />
                            Gateway data pending reconciliation.
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>
      )}

      {/* List Tabs */}
      {(activeTab === "invoices" || activeTab === "payments") && (
        <div className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          {/* Filter Bar */}
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-6 items-end">
             <div className="flex flex-col gap-2">
               <label className="text-[9px] uppercase font-black text-gray-400 flex items-center gap-1.5 tracking-widest">
                 <User size={10} className="text-blue-500" /> Channel Agent
               </label>
               <select 
                 value={selectedAgent} 
                 onChange={(e) => setSelectedAgent(e.target.value)}
                 className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none w-48 bg-white font-medium"
               >
                 <option value="">All Revenue Nodes</option>
                 {agents.map(agent => (
                   <option key={agent._id} value={agent._id}>{agent.name}</option>
                 ))}
               </select>
             </div>

             <div className="flex flex-col gap-2">
               <label className="text-[9px] uppercase font-black text-gray-400 flex items-center gap-1.5 tracking-widest">
                 <Search size={10} className="text-blue-500" /> Audit Lookup
               </label>
               <input
                 type="text"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Search TRN, TxId, Name..."
                 className="border border-gray-200 px-4 py-2 text-xs rounded-lg focus:ring-1 focus:ring-blue-500 outline-none w-72 bg-white font-medium"
               />
             </div>
             
             <div className="flex items-center gap-2">
                <button 
                    onClick={() => { setSelectedAgent(""); setSearchTerm(""); }}
                    className="h-[34px] px-4 text-[10px] font-black uppercase text-gray-500 hover:text-red-600 flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg transition-colors"
                >
                    <RefreshCw size={12} /> Reset
                </button>
                <button 
                    onClick={() => handleExportCSV(activeTab)}
                    className="h-[34px] px-4 text-[10px] font-black uppercase text-[#00264d] hover:bg-gray-50 flex items-center gap-1.5 bg-white border border-[#00264d]/20 rounded-lg transition-colors shadow-sm"
                >
                    <Download size={12} /> Export CSV
                </button>
             </div>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full border-collapse text-xs">
              <TableHeader columns={activeTab === "invoices" ? ["Inv No", "Source", "Client Profile", "Issued Date", "Application Node", "Settlement", "State"] : ["Gateway TRN", "Network Agent", "Payer Profile", "Execution Date", "Portal", "Amount", "State"]} />
              <tbody className="font-medium text-gray-700">
                {activeTab === "invoices" ? (
                  invLoading ? (
                    <tr><td colSpan={7} className="p-20 text-center text-gray-300 italic animate-pulse tracking-widest h-20">Analyzing Invoice Ledger...</td></tr>
                  ) : invoices.length === 0 ? (
                    <tr><td colSpan={7} className="p-20 text-center text-gray-300 italic flex flex-col items-center"><Search size={40} className="mb-2 opacity-10" />No matching invoices found in current index.</td></tr>
                  ) : (
                    invoices.map((inv) => (
                      <tr key={inv._id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                        <td className="px-5 py-4 font-black text-[#2150a0] text-[11px]">{inv.invoiceNumber}</td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-gray-800">{inv.agentId?.name || "Global Direct"}</div>
                          <div className="text-[9px] text-gray-400 uppercase tracking-tighter italic">Network Internal</div>
                        </td>
                        <td className="px-5 py-4">
                           <div className="font-bold">{inv.clientId?.name || "Unidentified"}</div>
                           <div className="text-[10px] text-gray-400">ID: {inv.clientId?._id?.slice(0,8)}</div>
                        </td>
                        <td className="px-5 py-4 text-gray-500 font-bold">{new Date(inv.createdAt).toLocaleDateString('en-GB')}</td>
                        <td className="px-5 py-4 font-mono text-[10px] text-gray-400 uppercase">#{inv.applicationId?.trn || inv.applicationId?._id?.slice(-8)}</td>
                        <td className="px-5 py-4 font-black text-gray-900 text-[12px]">${inv.amount.toLocaleString()}</td>
                        <td className="px-5 py-4 text-right">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase inline-block ${
                            inv.status === 'paid' ? 'bg-green-100 text-green-700 shadow-sm border border-green-200' : 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )
                ) : (
                  payLoading ? (
                    <tr><td colSpan={7} className="p-20 text-center text-gray-300 italic animate-pulse tracking-widest">Auditing Transaction Database...</td></tr>
                  ) : payments.length === 0 ? (
                    <tr><td colSpan={7} className="p-20 text-center text-gray-300 italic">Financial ledger empty.</td></tr>
                  ) : (
                    payments.map((pay) => (
                      <tr key={pay._id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                        <td className="px-5 py-4 font-black text-[#2150a0] text-[10px] uppercase tracking-tighter">#{pay.transactionId?.slice(-12)}</td>
                        <td className="px-5 py-4 font-bold text-gray-600">{pay.agentId?.name || "Portal Direct"}</td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-gray-800">{pay.clientId?.name || "Registered User"}</div>
                          <div className="text-[10px] text-gray-400 font-medium truncate max-w-[120px]">{pay.clientId?.email}</div>
                        </td>
                        <td className="px-5 py-4 text-gray-500 font-bold">{new Date(pay.createdAt).toLocaleDateString('en-GB')}</td>
                        <td className="px-5 py-4">
                          <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded-md text-[9px] font-black uppercase text-gray-600 tracking-widest shadow-sm">
                            {pay.gateway}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-black text-gray-900 text-[12px]">{pay.currency} {pay.amount.toLocaleString()}</td>
                        <td className="px-5 py-4 text-right">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase inline-block ${
                            pay.status === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 
                            pay.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' : 'bg-red-50 text-red-600 border border-red-100'
                          }`}>
                            {pay.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-50 flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/20">
             <span>Audit Entries: {activeTab === 'invoices' ? invoices.length : payments.length} synchronized</span>
             <div className="flex gap-2">
               <button className="px-3 py-1 text-gray-500 font-black hover:text-[#00264d] transition-colors cursor-not-allowed opacity-40">Previous Ledger</button>
               <button className="px-3 py-1 text-gray-500 font-black hover:text-[#00264d] transition-colors cursor-not-allowed opacity-40">Next Ledger</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
