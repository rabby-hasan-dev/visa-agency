"use client";

import { useGetVisaTypesQuery, useUpdateVisaTypeMutation } from "@/redux/api/visaTypeApi";
import { useGetTransitCountriesQuery, useUpdateTransitCountryMutation } from "@/redux/api/transitCountryApi";
import { useGetFeeSettingsQuery, useUpdateFeeSettingMutation, useAddFeeSettingMutation, useDeleteFeeSettingMutation } from "@/redux/api/feeApi";
import { DollarSign, Globe, ScrollText, Info, Plus, Trash2, X, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ManageFeesPage() {
  const [activeTab, setActiveTab] = useState("visa-types");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newFee, setNewFee] = useState({ name: "", key: "", amount: 0, description: "" });

  // API Queries
  const { data: visaTypesData, isLoading: vtLoading } = useGetVisaTypesQuery({});
  const { data: countriesData, isLoading: tcLoading } = useGetTransitCountriesQuery({});
  const { data: globalFeesData, isLoading: gfLoading } = useGetFeeSettingsQuery({});

  // Mutations
  const [updateVisaType] = useUpdateVisaTypeMutation();
  const [updateCountry] = useUpdateTransitCountryMutation();
  const [updateGlobalFee] = useUpdateFeeSettingMutation();
  const [addGlobalFee] = useAddFeeSettingMutation();
  const [deleteGlobalFee] = useDeleteFeeSettingMutation();

  const handleUpdateVisaFee = async (id: string, field: string, value: string) => {
    try {
      await updateVisaType({ id, [field]: Number(value) }).unwrap();
      toast.success("Visa fee updated");
    } catch {
      toast.error("Failed to update visa fee");
    }
  };

  const handleUpdateCountryConfig = async (id: string, field: string, value: string | number) => {
    try {
      await updateCountry({ id, [field]: value }).unwrap();
      toast.success(`Country ${field} updated`);
    } catch {
      toast.error(`Failed to update country ${field}`);
    }
  };

  const handleUpdateGlobalFee = async (key: string, value: string) => {
    try {
      await updateGlobalFee({ key, amount: Number(value) }).unwrap();
      toast.success("Global fee updated");
    } catch {
      toast.error("Failed to update global fee");
    }
  };

  const handleAddNewGlobalFee = async () => {
    if (!newFee.name || !newFee.key) {
      toast.error("Name and key are required");
      return;
    }
    try {
      await addGlobalFee(newFee).unwrap();
      toast.success("New global fee rule added");
      setIsAddingNew(false);
      setNewFee({ name: "", key: "", amount: 0, description: "" });
    } catch (err: unknown) {
      const errorResponse = err as { data?: { message?: string } };
      toast.error(errorResponse?.data?.message || "Failed to add global fee");
    }
  };

  const handleDeleteGlobalFee = async (key: string) => {
    if (!confirm("Are you sure you want to delete this global fee rule?")) return;
    try {
      await deleteGlobalFee(key).unwrap();
      toast.success("Global fee rule deleted");
    } catch {
      toast.error("Failed to delete global fee");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <DollarSign className="text-blue-600" />
          Fee Management System
        </h1>
        <p className="text-gray-500 mt-1">Configure visa fees, biometric charges, and country-specific surcharges.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-8">
        {[
          { id: "visa-types", label: "Visa Type Fees", icon: ScrollText },
          { id: "countries", label: "Country Surcharges", icon: Globe },
          { id: "global", label: "Global Fees", icon: Info },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 text-sm font-medium transition-colors relative ${
              activeTab === tab.id ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {activeTab === "visa-types" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Visa Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase text-center">Base Fee (AUD)</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase text-center">Biometric Fee (AUD)</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase text-center">Service Fee (AUD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vtLoading ? (
                  <tr><td colSpan={4} className="p-10 text-center text-gray-400">Loading visa types...</td></tr>
                ) : visaTypesData?.data?.result?.map((vt: { _id: string; name: string; code: string; category: string; baseFee: number; biometricFee: number; serviceFee: number }) => (
                  <tr key={vt._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{vt.name}</div>
                      <div className="text-xs text-gray-500">{vt.code} | {vt.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        defaultValue={vt.baseFee}
                        onBlur={(e) => handleUpdateVisaFee(vt._id, "baseFee", e.target.value)}
                        className="w-24 mx-auto block text-center border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 border p-1"
                      />
                    </td>
                    <td className="px-6 py-4">
                       <input
                        type="number"
                        defaultValue={vt.biometricFee}
                        onBlur={(e) => handleUpdateVisaFee(vt._id, "biometricFee", e.target.value)}
                        className="w-24 mx-auto block text-center border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 border p-1"
                      />
                    </td>
                    <td className="px-6 py-4">
                       <input
                        type="number"
                        defaultValue={vt.serviceFee}
                        onBlur={(e) => handleUpdateVisaFee(vt._id, "serviceFee", e.target.value)}
                        className="w-24 mx-auto block text-center border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 border p-1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "countries" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Country</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase text-center">Surcharge (AUD)</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase text-center">Currency</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase text-center">Exchange Rate (vs AUD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tcLoading ? (
                  <tr><td colSpan={4} className="p-10 text-center text-gray-400">Loading countries...</td></tr>
                ) : countriesData?.data?.result?.map((tc: { _id: string; flagEmoji: string; name: string; surcharge: number; currency?: string; exchangeRate?: number; }) => (
                  <tr key={tc._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <span className="text-xl">{tc.flagEmoji}</span>
                      <span className="font-medium text-gray-900">{tc.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        defaultValue={tc.surcharge}
                        onBlur={(e) => handleUpdateCountryConfig(tc._id, "surcharge", Number(e.target.value))}
                        className="w-24 mx-auto block text-center border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 border p-1"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        defaultValue={tc.currency || 'AUD'}
                        onBlur={(e) => handleUpdateCountryConfig(tc._id, "currency", e.target.value.toUpperCase())}
                        className="w-20 mx-auto block text-center border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 border p-1 uppercase font-mono"
                        placeholder="e.g. INR"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        defaultValue={tc.exchangeRate || 1}
                        onBlur={(e) => handleUpdateCountryConfig(tc._id, "exchangeRate", Number(e.target.value))}
                        className="w-24 mx-auto block text-center border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 border p-1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "global" && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {gfLoading ? (
                <div className="col-span-3 text-center text-gray-400 py-10">Loading global settings...</div>
             ) : (
                <>
                  {globalFeesData?.data?.result?.map((fee: { key: string; name: string; amount: number; description: string }) => (
                    <div key={fee.key} className="p-4 border border-gray-200 rounded-lg group relative bg-white hover:border-blue-200 hover:shadow-sm transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <label className="block text-sm font-medium text-gray-700 font-bold uppercase tracking-wider text-[10px]">{fee.name}</label>
                        <button 
                          onClick={() => handleDeleteGlobalFee(fee.key)}
                          className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          defaultValue={fee.amount}
                          onBlur={(e) => handleUpdateGlobalFee(fee.key, e.target.value)}
                          className="flex-1 border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
                        />
                        <div className="bg-gray-100 flex items-center px-3 rounded-md text-gray-500 font-medium">AUD</div>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-2">{fee.description}</p>
                      <div className="text-[8px] text-gray-300 mt-1 font-mono uppercase">Key: {fee.key}</div>
                    </div>
                  ))}
                
                  {isAddingNew ? (
                    <div className="p-4 border border-blue-300 rounded-lg bg-blue-50 shadow-inner">
                       <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xs font-bold text-blue-800 uppercase">New Global Fee Rule</h3>
                         <button onClick={() => setIsAddingNew(false)} className="text-blue-400 hover:text-blue-600">
                           <X size={16} />
                         </button>
                       </div>
                       <div className="space-y-3">
                         <input 
                           placeholder="Fee Name (e.g. Courier Fee)"
                           className="w-full text-xs border-blue-200 rounded p-2 focus:ring-blue-500 border"
                           value={newFee.name}
                           onChange={(e) => setNewFee({...newFee, name: e.target.value})}
                         />
                         <input 
                           placeholder="Key (e.g. COURIER_FEE)"
                           className="w-full text-xs border-blue-200 rounded p-2 focus:ring-blue-500 border font-mono uppercase"
                           value={newFee.key}
                           onChange={(e) => setNewFee({...newFee, key: e.target.value.toUpperCase().replace(/\s+/g, '_')})}
                         />
                         <div className="flex gap-2">
                           <input 
                             type="number"
                             placeholder="Amount"
                             className="flex-1 text-xs border-blue-200 rounded p-2 focus:ring-blue-500 border"
                             value={newFee.amount}
                             onChange={(e) => setNewFee({...newFee, amount: Number(e.target.value)})}
                           />
                           <div className="bg-blue-100 flex items-center px-2 rounded text-[10px] text-blue-700 font-bold underline decoration-blue-300 underline-offset-2">AUD</div>
                         </div>
                         <textarea 
                           placeholder="Short description..."
                           className="w-full text-xs border-blue-200 rounded p-2 focus:ring-blue-500 border h-16"
                           value={newFee.description}
                           onChange={(e) => setNewFee({...newFee, description: e.target.value})}
                         />
                         <button 
                           onClick={handleAddNewGlobalFee}
                           className="w-full bg-blue-600 text-white rounded py-2 text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                         >
                           <Check size={14} />
                           Save Fee Rule
                         </button>
                       </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsAddingNew(true)}
                      className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center p-6 text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all min-h-[120px]"
                    >
                       <Plus size={24} className="mb-2 opacity-50" />
                       <span className="text-xs font-semibold">Add New Global Fee Rule</span>
                    </button>
                  )}
                </>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
