"use client";

import { TTransitCountry } from "@/types/transitCountry";
import {
  useGetTransitCountriesQuery,
  useCreateTransitCountryMutation,
  useUpdateTransitCountryMutation,
  useToggleTransitCountryActiveMutation,
  useBulkToggleTransitCountriesMutation,
  useDeleteTransitCountryMutation,
} from "@/redux/api/transitCountryApi";
import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Globe2,
  CheckCircle,
  XCircle,
  Search,
  ShieldCheck,
  AlertTriangle,
  LayoutList,
} from "lucide-react";
import { useAlert, Button } from "@/components/ui";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const inputCls =
  "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2150a0] focus:ring-1 focus:ring-[#2150a0]";

const Field = ({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-[11px] text-gray-400 mt-0.5">{hint}</p>}
  </div>
);

const EMPTY_FORM = {
  name: "",
  code: "",
  flagEmoji: "",
  isActive: true,
  sortOrder: 0,
  notes: "",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ManageTransitCountriesPage() {
  const { data, isLoading } = useGetTransitCountriesQuery({});
  const [createCountry, { isLoading: isCreating }] =
    useCreateTransitCountryMutation();
  const [updateCountry, { isLoading: isUpdating }] =
    useUpdateTransitCountryMutation();
  const [toggleActive] = useToggleTransitCountryActiveMutation();
  const [bulkToggle] = useBulkToggleTransitCountriesMutation();
  const [deleteCountry] = useDeleteTransitCountryMutation();
  const { showAlert, showConfirm } = useAlert();

  const countries = (
    data?.data?.result ?? data?.data ?? []
  ) as TTransitCountry[];

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // ── Filtered list ──────────────────────────────────────────────────────────

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeCount = countries.filter((c) => c.isActive).length;
  const inactiveCount = countries.length - activeCount;

  // ── Modal Helpers ──────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (c: TTransitCountry) => {
    setEditingId(c._id);
    setForm({
      name: c.name,
      code: c.code,
      flagEmoji: c.flagEmoji ?? "",
      isActive: c.isActive,
      sortOrder: c.sortOrder,
      notes: c.notes ?? "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const set = (k: keyof typeof EMPTY_FORM, v: unknown) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      flagEmoji: form.flagEmoji.trim() || undefined,
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder),
      notes: form.notes.trim() || undefined,
    };

    try {
      if (editingId) {
        await updateCountry({ id: editingId, ...payload }).unwrap();
        showAlert({
          type: "success",
          title: "Updated",
          message: `"${payload.name}" has been updated.`,
        });
      } else {
        await createCountry(payload).unwrap();
        showAlert({
          type: "success",
          title: "Created",
          message: `"${payload.name}" added to transit countries.`,
        });
      }
      closeModal();
    } catch (err) {
      showAlert({
        type: "error",
        title: editingId ? "Update Failed" : "Creation Failed",
        message:
          (err as { data?: { message?: string } })?.data?.message ||
          "Something went wrong",
      });
    }
  };

  // ── Toggle single ──────────────────────────────────────────────────────────

  const handleToggle = async (c: TTransitCountry) => {
    const confirmed = await showConfirm({
      title: c.isActive
        ? "Disable Transit for this Country"
        : "Enable Transit for this Country",
      message: c.isActive
        ? `Disabling "${c.name}" means applicants from this country will NOT see Australia as a transit option.`
        : `Enabling "${c.name}" will allow applicants from this country to transit through Australia.`,
      confirmLabel: c.isActive ? "Disable" : "Enable",
      cancelLabel: "Cancel",
      type: c.isActive ? "danger" : "info",
    });
    if (!confirmed) return;

    try {
      await toggleActive(c._id).unwrap();
      showAlert({
        type: "success",
        title: "Status Updated",
        message: `"${c.name}" transit is now ${c.isActive ? "disabled" : "enabled"}.`,
      });
    } catch {
      showAlert({
        type: "error",
        title: "Failed",
        message: "Could not update transit status.",
      });
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async (c: TTransitCountry) => {
    const confirmed = await showConfirm({
      title: "Delete Transit Country",
      message: `Are you sure you want to delete "${c.name}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      type: "danger",
    });
    if (!confirmed) return;

    try {
      await deleteCountry(c._id).unwrap();
      showAlert({
        type: "success",
        title: "Deleted",
        message: `"${c.name}" has been removed.`,
      });
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(c._id);
        return next;
      });
    } catch {
      showAlert({
        type: "error",
        title: "Delete Failed",
        message: "Could not delete transit country.",
      });
    }
  };

  // ── Bulk select ────────────────────────────────────────────────────────────

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length && filtered.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((c) => c._id)));
    }
  };

  const handleBulkEnable = async () => {
    if (selectedIds.size === 0) return;
    const confirmed = await showConfirm({
      title: "Enable Transit for Selected Countries",
      message: `Enable transit through Australia for ${selectedIds.size} selected country(ies)?`,
      confirmLabel: "Enable All",
      cancelLabel: "Cancel",
      type: "info",
    });
    if (!confirmed) return;
    try {
      await bulkToggle({ ids: Array.from(selectedIds), isActive: true }).unwrap();
      showAlert({
        type: "success",
        title: "Bulk Enabled",
        message: `${selectedIds.size} countries enabled for Australia transit.`,
      });
      setSelectedIds(new Set());
    } catch {
      showAlert({ type: "error", title: "Failed", message: "Bulk enable failed." });
    }
  };

  const handleBulkDisable = async () => {
    if (selectedIds.size === 0) return;
    const confirmed = await showConfirm({
      title: "Disable Transit for Selected Countries",
      message: `Disable transit through Australia for ${selectedIds.size} selected country(ies)?`,
      confirmLabel: "Disable All",
      cancelLabel: "Cancel",
      type: "danger",
    });
    if (!confirmed) return;
    try {
      await bulkToggle({ ids: Array.from(selectedIds), isActive: false }).unwrap();
      showAlert({
        type: "success",
        title: "Bulk Disabled",
        message: `${selectedIds.size} countries disabled for Australia transit.`,
      });
      setSelectedIds(new Set());
    } catch {
      showAlert({ type: "error", title: "Failed", message: "Bulk disable failed." });
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="font-sans px-5 pb-10">

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl text-[#00264d] m-0 flex items-center gap-2">
            <Globe2 size={22} className="text-[#2150a0]" />
            Transit Country Manager
          </h1>
          <p className="text-gray-500 text-[13px] mt-1.5">
            Control which countries can transit through Australia. Only{" "}
            <strong>active</strong> countries appear in the visa application form.
          </p>
        </div>
        <button
          id="create-transit-country-btn"
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#2150a0] text-white px-4 py-2 hover:bg-[#153468] transition-colors rounded text-sm shadow-sm cursor-pointer"
        >
          <Plus size={16} /> Add Country
        </button>
      </div>

      {/* ── Summary Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white border border-gray-300 p-4 border-l-4 border-l-[#2150a0] flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-gray-700">
              Total Countries
            </div>
            <div className="text-2xl font-bold text-[#00264d] mt-1">
              {countries.length}
            </div>
          </div>
          <LayoutList size={28} className="text-gray-300" />
        </div>
        <div className="bg-white border border-gray-300 p-4 border-l-4 border-l-green-600 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-gray-700">
              Transit Enabled
            </div>
            <div className="text-2xl font-bold text-green-700 mt-1">
              {activeCount}
            </div>
          </div>
          <ShieldCheck size={28} className="text-gray-300" />
        </div>
        <div className="bg-white border border-gray-300 p-4 border-l-4 border-l-[#ffcc00] flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-gray-700">
              Transit Disabled
            </div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              {inactiveCount}
            </div>
          </div>
          <AlertTriangle size={28} className="text-gray-300" />
        </div>
      </div>

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-300 shadow-sm">
        <div className="bg-[#00264d] text-white px-4 py-2 text-sm font-bold flex justify-between items-center flex-wrap gap-2">
          <span className="flex items-center gap-2">
            <Globe2 size={14} /> Transit Countries
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Bulk action buttons */}
            {selectedIds.size > 0 && (
              <span className="text-yellow-300 text-xs font-semibold mr-2">
                {selectedIds.size} selected
              </span>
            )}
            <button
              onClick={handleBulkEnable}
              disabled={selectedIds.size === 0}
              className="flex items-center gap-1 bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <CheckCircle size={12} /> Enable Selected
            </button>
            <button
              onClick={handleBulkDisable}
              disabled={selectedIds.size === 0}
              className="flex items-center gap-1 bg-[#ffcc00] text-black font-bold text-xs px-3 py-1 rounded hover:bg-[#e6b800] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <XCircle size={12} /> Disable Selected
            </button>
            {/* Search */}
            <div className="relative">
              <Search
                size={12}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search name or code..."
                className="text-black text-xs pl-6 pr-2 py-1 w-[200px] rounded focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── Table ───────────────────────────────────────────────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs text-left">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 accent-[#2150a0]"
                    checked={
                      filtered.length > 0 &&
                      selectedIds.size === filtered.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-3 font-bold text-gray-700">Flag</th>
                <th className="p-3 font-bold text-gray-700">Country Name</th>
                <th className="p-3 font-bold text-gray-700">Code</th>
                <th className="p-3 font-bold text-gray-700 text-center">
                  Transit Status
                </th>
                <th className="p-3 font-bold text-gray-700">Notes</th>
                <th className="p-3 font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2150a0]" />
                      Loading transit countries...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-gray-500">
                    {searchTerm
                      ? `No countries found matching "${searchTerm}"`
                      : 'No transit countries yet. Click "Add Country" to get started.'}
                  </td>
                </tr>
              ) : (
                filtered.map((c, index) => (
                  <tr
                    key={c._id}
                    className={`border-b border-gray-200 hover:bg-blue-50/40 transition-colors ${
                      selectedIds.has(c._id)
                        ? "bg-blue-50"
                        : index % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50/50"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-3">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 accent-[#2150a0]"
                        checked={selectedIds.has(c._id)}
                        onChange={() => toggleSelect(c._id)}
                      />
                    </td>

                    {/* Flag */}
                    <td className="p-3 text-xl">
                      {c.flagEmoji || <span className="text-gray-300 text-sm">—</span>}
                    </td>

                    {/* Name */}
                    <td className="p-3 font-bold text-gray-800">{c.name}</td>

                    {/* Code */}
                    <td className="p-3">
                      <span className="bg-blue-50 text-[#2150a0] border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        {c.code}
                      </span>
                    </td>

                    {/* Transit Status */}
                    <td className="p-3 text-center">
                      {c.isActive ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <CheckCircle size={10} /> Allowed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <XCircle size={10} /> Restricted
                        </span>
                      )}
                    </td>

                    {/* Notes */}
                    <td className="p-3 text-gray-500 max-w-[200px] truncate">
                      {c.notes || <span className="text-gray-300">—</span>}
                    </td>

                    {/* Actions */}
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {/* Edit */}
                        <button
                          onClick={() => openEdit(c)}
                          className="flex items-center gap-1 text-gray-500 hover:text-[#2150a0] bg-transparent border-none p-0 cursor-pointer text-xs font-medium transition-colors"
                          title="Edit"
                        >
                          <Pencil size={12} /> Edit
                        </button>

                        {/* Toggle Active */}
                        <button
                          onClick={() => handleToggle(c)}
                          className={`flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer text-xs font-medium transition-colors ${
                            c.isActive
                              ? "text-gray-500 hover:text-red-500"
                              : "text-green-600 hover:text-green-800"
                          }`}
                          title={c.isActive ? "Disable Transit" : "Enable Transit"}
                        >
                          {c.isActive ? (
                            <>
                              <ToggleRight size={13} /> Disable
                            </>
                          ) : (
                            <>
                              <ToggleLeft size={13} /> Enable
                            </>
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(c)}
                          className="flex items-center gap-1 text-red-500 hover:text-red-700 bg-transparent border-none p-0 cursor-pointer text-xs font-medium transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer hint ─────────────────────────────────────────────────── */}
        {countries.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-[11px] text-gray-500 flex items-center gap-1.5">
            <ShieldCheck size={11} className="text-green-600" />
            Only <strong>{activeCount}</strong> of {countries.length} countries
            are currently permitted to transit through Australia.
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ───────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-[#00264d] flex items-center gap-2 m-0">
                <Globe2 size={18} />
                {editingId ? "Edit Transit Country" : "Add Transit Country"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1">
              <div className="space-y-4">

                <Field label="Country Name" required>
                  <input
                    id="transit-country-name-input"
                    type="text"
                    className={inputCls}
                    placeholder='e.g. "India"'
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Country Code"
                    required
                    hint="ISO-2 or ISO-3 code e.g. IN, IND"
                  >
                    <input
                      id="transit-country-code-input"
                      type="text"
                      className={inputCls}
                      placeholder='e.g. "IN"'
                      required
                      maxLength={3}
                      value={form.code}
                      onChange={(e) =>
                        set("code", e.target.value.toUpperCase())
                      }
                    />
                  </Field>

                  <Field label="Flag Emoji" hint="Optional — paste the flag emoji">
                    <input
                      id="transit-country-flag-input"
                      type="text"
                      className={inputCls}
                      placeholder="🇮🇳"
                      value={form.flagEmoji}
                      onChange={(e) => set("flagEmoji", e.target.value)}
                    />
                  </Field>
                </div>

                <Field label="Sort Order" hint="Lower numbers appear first">
                  <input
                    id="transit-country-sort-input"
                    type="number"
                    className={inputCls}
                    min={0}
                    value={form.sortOrder}
                    onChange={(e) => set("sortOrder", e.target.value)}
                  />
                </Field>

                <Field label="Admin Notes" hint="Internal only — not shown to applicants">
                  <textarea
                    id="transit-country-notes-input"
                    className={`${inputCls} resize-none`}
                    rows={2}
                    placeholder="Reason for restricting / enabling transit..."
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                  />
                </Field>

                <div className="flex items-center gap-3">
                  <input
                    id="transit-country-active-checkbox"
                    type="checkbox"
                    className="w-4 h-4 accent-[#2150a0]"
                    checked={form.isActive}
                    onChange={(e) => set("isActive", e.target.checked)}
                  />
                  <label
                    htmlFor="transit-country-active-checkbox"
                    className="text-sm font-semibold text-gray-700 cursor-pointer select-none"
                  >
                    Allow transit through Australia for this country
                  </label>
                </div>

                {!form.isActive && (
                  <div className="flex items-start gap-2 bg-[#fff9e6] border border-[#ffcc00] rounded p-3 text-xs text-gray-800">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    <span>
                      This country will be <strong>restricted</strong> — applicants
                      from this country will not see Australia as a transit option.
                    </span>
                  </div>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  id="transit-country-submit-btn"
                  type="submit"
                  isLoading={isCreating || isUpdating}
                >
                  {editingId ? "Save Changes" : "Add Country"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
