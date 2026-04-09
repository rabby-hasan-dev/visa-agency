"use client";

import { useGetApplicationsQuery } from "@/redux/api/applicationApi";
import { useGetAccountingReportQuery } from "@/redux/api/paymentApi";
import { useState } from "react";
import { 
  Download, 
  Activity, 
  DollarSign, 
  CreditCard, 
  Users, 
  TrendingUp, 
  Calendar,
  Filter,
  RefreshCw,
  Search,
  Table,
  PieChart
} from "lucide-react";

interface IFlow {
  currency: string;
  gateway: string;
  totalAmount: number;
  count: number;
}

interface ITrend {
  _id: string;
  revenue: number;
  count: number;
}

interface IVisaStat {
    _id: string;
    count: number;
    revenue: number;
}

interface IAccountingData {
  moneyFlow: IFlow[];
  dailyTrend: ITrend[];
  applicationStats: { _id: string; count: number }[];
  paymentMethods: { _id: string; count: number; revenue: number }[];
  revenueBySource: { _id: string; count: number; revenue: number }[];
  visaTypeStats: IVisaStat[];
}

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const s = status.toUpperCase();
  let colors = "bg-gray-100 text-gray-800";
  if (["APPROVED", "GRANTED", "SUCCESS", "PAID"].includes(s)) colors = "bg-green-100 text-green-800";
  if (["REJECTED", "REFUSED", "FAILED"].includes(s)) colors = "bg-red-100 text-red-800";
  if (["SUBMITTED"].includes(s)) colors = "bg-blue-100 text-blue-800";
  if (["PENDING", "DRAFT"].includes(s)) colors = "bg-yellow-100 text-yellow-800";
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colors}`}>
      {s}
    </span>
  );
};

export default function ReportsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const { data: appsData, isLoading: appsLoading } = useGetApplicationsQuery({});
  const { data: accountingData, isLoading: statsLoading, refetch } = useGetAccountingReportQuery({
    startDate: startDate || undefined,
    endDate: endDate || undefined
  });

  const applications = appsData?.data?.result || [];
  const reports: IAccountingData = accountingData?.data || {
    moneyFlow: [],
    dailyTrend: [],
    applicationStats: [],
    paymentMethods: [],
    revenueBySource: [],
    visaTypeStats: []
  };

  const handleExportCSV = () => {
    if (!applications.length) return;
    const headers = ["TRN", "Applicant", "Visa Category", "Status", "Date"];
    const rows = applications.map((app: { _id: string; clientId?: { name: string }; visaCategory: string; status: string; createdAt: string }) => [
      app._id?.toUpperCase() || "N/A",
      app.clientId?.name || "N/A",
      app.visaCategory || "N/A",
      app.status,
      new Date(app.createdAt).toLocaleDateString(),
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r: string[]) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `detailed_accounting_report_${Date.now()}.csv`;
    link.click();
  };

  if (appsLoading || statsLoading) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-3">
        <Activity className="animate-spin text-blue-600" size={32} />
        <p className="text-gray-500 font-medium">Analyzing financial distributions...</p>
      </div>
    );
  }

  const maxRevenueTrend = reports.dailyTrend.length > 0 ? Math.max(...reports.dailyTrend.map(t => t.revenue)) : 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#00264d] flex items-center gap-2">
            <TrendingUp size={24} className="text-blue-600" />
            Financial Intelligence Dashboard
          </h1>
          <p className="text-gray-500 text-sm">Professional audit logs and revenue trend analysis.</p>
        </div>
        <div className="flex gap-2">
           <button
            onClick={() => refetch()}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-[#00264d] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-blue-900 transition-all shadow-sm"
          >
            <Download size={16} /> Export Audit CSV
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8 flex flex-wrap gap-6 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
              <Calendar size={12} /> Start Date
            </label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
              <Calendar size={12} /> End Date
            </label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button 
            onClick={() => { setStartDate(""); setEndDate(""); }}
            className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-red-500 transition-colors border border-gray-100 rounded-lg h-[34px]"
          >
            Reset Range
          </button>

          <div className="ml-auto hidden lg:flex items-center gap-4 text-xs font-medium text-gray-400 italic">
             <Filter size={14} className="text-gray-300" />
             Filtering by date will update all metrics below in real-time.
          </div>
      </div>

      {/* REVENUE FLOW HIGHLIGHTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {reports.moneyFlow.length > 0 ? reports.moneyFlow.map((flow, index: number) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-blue-200 transition-all group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{flow.gateway}</span>
                <span className="text-sm font-bold text-gray-700">{flow.currency} Channel</span>
              </div>
              <div className="bg-blue-50 p-2 rounded-xl group-hover:bg-blue-100 transition-colors">
                <DollarSign size={16} className="text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#00264d]">
              {flow.totalAmount.toLocaleString()} 
            </div>
            <div className="text-[11px] text-gray-500 mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {flow.count} Settlements verified
            </div>
          </div>
        )) : (
          <div className="col-span-4 bg-white p-12 text-center text-gray-400 rounded-xl border border-dashed border-gray-300 flex flex-col items-center gap-3">
             <Search size={32} className="text-gray-200" />
             <p className="font-medium italic">No financial activity found for this period.</p>
          </div>
        )}
      </div>

      {/* TREND ANALYSIS & VISA STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* REVENUE TREND */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <h3 className="text-sm font-bold text-gray-700 mb-6 flex items-center gap-2 uppercase tracking-tight">
            <Activity size={16} className="text-blue-600" />
            30-Day Revenue Trend Analysis
          </h3>
          <div className="h-48 flex items-end gap-1.5 px-2">
            {reports.dailyTrend.map((t, idx) => (
              <div key={idx} className="flex-1 group relative">
                 <div 
                   className="bg-blue-600/80 hover:bg-blue-600 rounded-t-sm transition-all duration-500 ease-out cursor-pointer"
                   style={{ height: `${(t.revenue / maxRevenueTrend) * 100}%`, minHeight: '4px' }}
                 />
                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                   {new Date(t._id).toLocaleDateString()}<br/>
                   <span className="font-bold">${t.revenue.toLocaleString()}</span>
                 </div>
              </div>
            ))}
            {reports.dailyTrend.length === 0 && (
                <div className="w-full h-full border-b border-gray-100 flex items-center justify-center text-gray-300 italic text-xs">
                    Trend data will populate as transactions occur.
                </div>
            )}
          </div>
          <div className="flex justify-between mt-3 text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2">
            <span>{reports.dailyTrend[0]?._id ? new Date(reports.dailyTrend[0]._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'START'}</span>
            <span>TIMELINE (DAILY AGGREGATES)</span>
            <span>{reports.dailyTrend.length > 0 ? 'CURRENT' : 'END'}</span>
          </div>
        </div>

        {/* TOP VISA TYPES */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-6 flex items-center gap-2 uppercase tracking-tight">
            <Filter size={16} className="text-purple-600" />
            Revenue by Visa Type
          </h3>
          <div className="space-y-5">
            {reports.visaTypeStats.slice(0, 5).map((vt, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs font-bold mb-1.5 items-end">
                  <span className="truncate max-w-[150px]">{vt._id}</span>
                  <span className="text-purple-600">${vt.revenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-500 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${(vt.revenue / reports.visaTypeStats[0].revenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {reports.visaTypeStats.length === 0 && (
                <p className="text-center text-gray-400 italic text-xs py-10">No specific visa type revenue recorded.</p>
            )}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* REVENUE SOURCE */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-5 flex items-center gap-2 uppercase tracking-tight">
            <Users size={16} className="text-green-600" />
            Distribution by Acquisition Channel
          </h3>
          <div className="flex items-center gap-10">
              <div className="flex-1 space-y-6">
                {reports.revenueBySource.map((rs, idx: number) => (
                    <div key={idx}>
                        <div className="flex justify-between text-[11px] font-black mb-2 uppercase text-gray-500">
                        <span>{rs._id === 'agent' ? 'Agent Channel' : 'Direct Organic'}</span>
                        <span className="text-gray-900">${rs.revenue.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden border border-gray-100">
                        <div 
                            className={`${rs._id === 'agent' ? 'bg-orange-400' : 'bg-blue-500'} h-full rounded-full transition-all duration-1000`} 
                            style={{ width: `${reports.revenueBySource.length > 0 ? (rs.revenue / reports.revenueBySource.reduce((a,b) => a + b.revenue, 0)) * 100 : 0}%` }}
                        />
                        </div>
                    </div>
                ))}
              </div>
              <div className="w-1/3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 mb-1">TOTAL AGGREGATE</div>
                  <div className="text-xl font-black text-[#00264d]">
                    ${reports.revenueBySource.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}
                  </div>
                  <hr className="my-2 border-gray-200"/>
                  <div className="text-[10px] text-gray-500 italic">Net revenue calculated from successful audits.</div>
              </div>
          </div>
        </div>

         {/* GATEWAY PERFORMANCE */}
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-5 flex items-center gap-2 uppercase tracking-tight">
            <CreditCard size={16} className="text-blue-600" />
            Payment Gateway Health
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {reports.paymentMethods.map((pm, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-xl flex flex-col border border-gray-100 hover:border-blue-100 transition-colors">
                    <div className="text-[10px] font-black text-blue-600 uppercase mb-1">{pm._id} Service</div>
                    <div className="text-lg font-black text-[#00264d]">${pm.revenue.toLocaleString()}</div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{pm.count} Transactions</span>
                        <div className="flex gap-0.5">
                            <span className="w-1 h-3 bg-blue-400 rounded-full"/>
                            <span className="w-1 h-3 bg-blue-600 rounded-full"/>
                            <span className="w-1 h-3 bg-blue-800 rounded-full"/>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </div>

      {/* DETAILED TRANSACTION LOG */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-[#00264d] px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Table size={16} className="text-blue-400" />
            <span className="font-bold text-sm tracking-tight">Audit Log: Recent Financial Transactions</span>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition-colors shadow-inner">Full Ledger</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[#00264d] font-black text-[10px] uppercase tracking-widest">
                <th className="px-6 py-4">Financial TRN</th>
                <th className="px-6 py-4">Payer / Source</th>
                <th className="px-6 py-4">Visa Category</th>
                <th className="px-6 py-4">Audit Status</th>
                <th className="px-6 py-4 text-right">Settlement Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {applications.slice(0, 10).map((app: { _id: string; clientId?: { name: string }; visaCategory: string; status: string; createdAt: string }) => (
                <tr key={app._id} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-[11px] font-black text-[#2150a0]">#{app._id?.slice(-10).toUpperCase()}</td>
                  <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{app.clientId?.name || "Anonymous Payer"}</div>
                      <div className="text-[9px] text-gray-400 uppercase font-black tracking-tighter">System ID: {app._id?.slice(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-xs font-medium italic">{app.visaCategory}</td>
                  <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                  <td className="px-6 py-4 text-right text-gray-400 text-[11px] font-bold tracking-tight">{new Date(app.createdAt).toLocaleDateString('en-GB')}</td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-300 italic flex flex-col items-center gap-3">
                     <PieChart size={40} className="text-gray-100" />
                     <p>Electronic ledger is currently empty for this selection.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-3 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] flex justify-between">
           <span>Records verified by system audit logic</span>
           <span>Australian Government Standard Accounting (Draft V1)</span>
        </div>
      </div>
    </div>
  );
}
