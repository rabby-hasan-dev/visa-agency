"use client";

import {
  useGetVisaTypesQuery,
  useCreateVisaTypeMutation,
  useUpdateVisaTypeMutation,
  useToggleVisaTypeActiveMutation,
  useDeleteVisaTypeMutation,
} from "@/redux/api/visaTypeApi";
import { TVisaType } from "@/types/visaTypes";
import { useState } from "react";
import NextLink from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Globe,
  Layers,
  CheckCircle,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { useAlert, Button } from "@/components/ui";

// ─── Reusable field component ──────────────────────────────────────────────────

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2150a0] focus:ring-1 focus:ring-[#2150a0]";

// ─── Empty default form state ──────────────────────────────────────────────────

const EMPTY_FORM = {
  name: "",
  code: "",
  category: "",
  description: "",
  totalSteps: 5,
  isActive: true,
  sortOrder: 0,
  sidebarLinksRaw: "", // comma-separated string → converted to array on submit
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ManageVisaTypesPage() {
  const { data, isLoading } = useGetVisaTypesQuery({});
  const [createVisaType, { isLoading: isCreating }] =
    useCreateVisaTypeMutation();
  const [updateVisaType, { isLoading: isUpdating }] =
    useUpdateVisaTypeMutation();
  const [toggleActive] = useToggleVisaTypeActiveMutation();
  const [deleteVisaType] = useDeleteVisaTypeMutation();
  const { showAlert, showConfirm } = useAlert();

  const visaTypes = (data?.data?.result ?? data?.data ?? []) as TVisaType[];

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // ── Computed ────────────────────────────────────────────────────────────────

  const filtered = visaTypes.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeCount = visaTypes.filter((v) => v.isActive).length;

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (vt: TVisaType) => {
    setEditingId(vt._id);
    setForm({
      name: vt.name,
      code: vt.code,
      category: vt.category,
      description: vt.description ?? "",
      totalSteps: vt.totalSteps,
      isActive: vt.isActive,
      sortOrder: vt.sortOrder,
      sidebarLinksRaw: (vt.sidebarLinks ?? []).join(", "),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const set = (k: keyof typeof EMPTY_FORM, v: unknown) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  // ── Submit (create / update) ─────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      code: form.code.trim(),
      category: form.category.trim(),
      description: form.description.trim() || undefined,
      totalSteps: Number(form.totalSteps),
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder),
      sidebarLinks: form.sidebarLinksRaw
        ? form.sidebarLinksRaw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    };

    try {
      if (editingId) {
        await updateVisaType({ id: editingId, ...payload }).unwrap();
        showAlert({
          type: "success",
          title: "Updated",
          message: `"${payload.name}" has been updated.`,
        });
      } else {
        await createVisaType(payload).unwrap();
        showAlert({
          type: "success",
          title: "Created",
          message: `"${payload.name}" has been created successfully.`,
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

  // ── Toggle Active ────────────────────────────────────────────────────────────

  const handleToggle = async (vt: TVisaType) => {
    const confirmed = await showConfirm({
      title: vt.isActive ? "Deactivate Visa Type" : "Activate Visa Type",
      message: vt.isActive
        ? `Deactivating "${vt.name}" will hide it from the application form. No existing applications are affected.`
        : `Activating "${vt.name}" will make it available for new applications.`,
      confirmLabel: vt.isActive ? "Deactivate" : "Activate",
      cancelLabel: "Cancel",
      type: vt.isActive ? "danger" : "info",
    });
    if (!confirmed) return;

    try {
      await toggleActive(vt._id).unwrap();
      showAlert({
        type: "success",
        title: "Status Updated",
        message: `"${vt.name}" is now ${vt.isActive ? "inactive" : "active"}.`,
      });
    } catch {
      showAlert({ type: "error", title: "Failed", message: "Could not update status." });
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────

  const handleDelete = async (vt: TVisaType) => {
    const confirmed = await showConfirm({
      title: "Delete Visa Type",
      message: `Are you sure you want to delete "${vt.name}"? This will also delete all questions associated with it. This action cannot be undone.`,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      type: "danger",
    });
    if (!confirmed) return;

    try {
      await deleteVisaType(vt._id).unwrap();
      showAlert({
        type: "success",
        title: "Deleted",
        message: `"${vt.name}" and all its questions have been deleted.`,
      });
    } catch {
      showAlert({ type: "error", title: "Delete Failed", message: "Could not delete visa type." });
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="font-sans px-5 pb-10">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl text-[#00264d] m-0">Visa Type Manager</h1>
          <p className="text-gray-500 text-[13px] mt-1.5">
            Create and manage visa types, categories, and step configurations.
          </p>
        </div>
        <button
          id="create-visa-type-btn"
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#2150a0] text-white px-4 py-2 hover:bg-[#153468] transition-colors rounded text-sm shadow-sm cursor-pointer"
        >
          <Plus size={16} /> Add Visa Type
        </button>
      </div>

      {/* ── Summary Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white border border-gray-300 p-4 border-l-4 border-l-[#2150a0] flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-gray-700">Total Visa Types</div>
            <div className="text-2xl font-bold text-[#00264d] mt-1">
              {visaTypes.length}
            </div>
          </div>
          <Globe size={28} className="text-gray-300" />
        </div>
        <div className="bg-white border border-gray-300 p-4 border-l-4 border-l-green-600 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-gray-700">Active</div>
            <div className="text-2xl font-bold text-green-700 mt-1">
              {activeCount}
            </div>
          </div>
          <CheckCircle size={28} className="text-gray-300" />
        </div>
        <div className="bg-white border border-gray-300 p-4 border-l-4 border-l-[#ffcc00] flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-gray-700">Inactive</div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              {visaTypes.length - activeCount}
            </div>
          </div>
          <XCircle size={28} className="text-gray-300" />
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-300 shadow-sm">
        <div className="bg-[#00264d] text-white px-4 py-2 text-sm font-bold flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Layers size={14} /> Registered Visa Types
          </span>
          <input
            type="text"
            placeholder="Search name, category, code..."
            className="text-black text-xs px-2 py-1 w-[240px] rounded focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs text-left">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-3 font-bold text-gray-700">Name</th>
                <th className="p-3 font-bold text-gray-700">Code</th>
                <th className="p-3 font-bold text-gray-700">Category</th>
                <th className="p-3 font-bold text-gray-700 text-center">Steps</th>
                <th className="p-3 font-bold text-gray-700 text-center">Status</th>
                <th className="p-3 font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2150a0]" />
                      Loading visa types...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-500">
                    {searchTerm
                      ? `No visa types found matching "${searchTerm}"`
                      : "No visa types yet. Click \"Add Visa Type\" to create the first one."}
                  </td>
                </tr>
              ) : (
                filtered.map((vt, index) => (
                  <tr
                    key={vt._id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <td className="p-3 font-bold text-gray-800">{vt.name}</td>
                    <td className="p-3">
                      <span className="bg-blue-50 text-[#2150a0] border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        {vt.code}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{vt.category}</td>
                    <td className="p-3 text-center">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {vt.totalSteps} steps
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {vt.isActive ? (
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          Active
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {/* Manage Questions */}
                        <NextLink
                          href={`/manage-visa-types/${vt._id}`}
                          className="flex items-center gap-1 text-[#2150a0] hover:text-[#1a3d7a] hover:underline font-medium no-underline text-xs"
                        >
                          Questions <ChevronRight size={11} />
                        </NextLink>

                        {/* Edit */}
                        <button
                          onClick={() => openEdit(vt)}
                          className="flex items-center gap-1 text-gray-500 hover:text-[#2150a0] bg-transparent border-none p-0 cursor-pointer text-xs font-medium transition-colors"
                          title="Edit"
                        >
                          <Pencil size={12} /> Edit
                        </button>

                        {/* Toggle Active */}
                        <button
                          onClick={() => handleToggle(vt)}
                          className={`flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer text-xs font-medium transition-colors ${vt.isActive ? "text-gray-500 hover:text-red-500" : "text-green-600 hover:text-green-800"}`}
                          title={vt.isActive ? "Deactivate" : "Activate"}
                        >
                          {vt.isActive ? (
                            <><ToggleRight size={13} /> Deactivate</>
                          ) : (
                            <><ToggleLeft size={13} /> Activate</>
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(vt)}
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
      </div>

      {/* ── Create / Edit Modal ───────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-[#00264d] flex items-center gap-2 m-0">
                <Globe size={18} />
                {editingId ? "Edit Visa Type" : "Add New Visa Type"}
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

                <Field label="Visa Name" required>
                  <input
                    id="visa-name-input"
                    type="text"
                    className={inputCls}
                    placeholder='e.g. "Visitor Visa (600)"'
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Must be unique. This is displayed in the selector.
                  </p>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Visa Code" required>
                    <input
                      id="visa-code-input"
                      type="text"
                      className={inputCls}
                      placeholder='e.g. "600"'
                      required
                      value={form.code}
                      onChange={(e) => set("code", e.target.value)}
                    />
                  </Field>

                  <Field label="Category" required>
                    <input
                      id="visa-category-input"
                      type="text"
                      className={inputCls}
                      placeholder='e.g. "Visitor"'
                      required
                      value={form.category}
                      onChange={(e) => set("category", e.target.value)}
                    />
                  </Field>
                </div>

                <Field label="Description">
                  <textarea
                    id="visa-description-input"
                    className={`${inputCls} resize-none`}
                    rows={2}
                    placeholder="Short description shown on hover..."
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Total Steps" required>
                    <input
                      id="visa-total-steps-input"
                      type="number"
                      className={inputCls}
                      min={1}
                      max={20}
                      required
                      value={form.totalSteps}
                      onChange={(e) => set("totalSteps", e.target.value)}
                    />
                  </Field>

                  <Field label="Sort Order">
                    <input
                      id="visa-sort-order-input"
                      type="number"
                      className={inputCls}
                      min={0}
                      value={form.sortOrder}
                      onChange={(e) => set("sortOrder", e.target.value)}
                    />
                  </Field>
                </div>

                <Field label="Sidebar Links (comma-separated)">
                  <input
                    id="visa-sidebar-links-input"
                    type="text"
                    className={inputCls}
                    placeholder='e.g. "Health requirements, Visa Pricing Estimator"'
                    value={form.sidebarLinksRaw}
                    onChange={(e) => set("sidebarLinksRaw", e.target.value)}
                  />
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    These appear in the sidebar during the application.
                  </p>
                </Field>

                <div className="flex items-center gap-3">
                  <input
                    id="visa-active-checkbox"
                    type="checkbox"
                    className="w-4 h-4 accent-[#2150a0]"
                    checked={form.isActive}
                    onChange={(e) => set("isActive", e.target.checked)}
                  />
                  <label
                    htmlFor="visa-active-checkbox"
                    className="text-sm font-semibold text-gray-700 cursor-pointer select-none"
                  >
                    Active — visible in the application form
                  </label>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  id="visa-type-submit-btn"
                  type="submit"
                  isLoading={isCreating || isUpdating}
                >
                  {editingId ? "Save Changes" : "Create Visa Type"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
