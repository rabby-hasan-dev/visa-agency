"use client";

import { useParams } from "next/navigation";
import NextLink from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  X,
  HelpCircle,
} from "lucide-react";
import { useGetSingleVisaTypeQuery } from "@/redux/api/visaTypeApi";
import {
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from "@/redux/api/questionApi";
import { useGetGlobalOptionsQuery } from "@/redux/api/settingsApi";
import { TQuestion, TFieldType } from "@/types/visaTypes";
import { useAlert, Button } from "@/components/ui";

// ─── Constants ────────────────────────────────────────────────────────────────

const FIELD_TYPES: { value: TFieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Textarea" },
  { value: "select", label: "Select (dropdown)" },
  { value: "radio", label: "Radio (single choice)" },
  { value: "checkbox", label: "Checkbox (multi-choice)" },
  { value: "date", label: "Date" },
  { value: "file", label: "File upload" },
  { value: "boolean", label: "Yes / No" },
  { value: "section-header", label: "Section Header (display only)" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
];

const EMPTY_FORM = {
  stepNumber: 1,
  stepLabel: "",
  fieldKey: "",
  label: "",
  fieldType: "text" as TFieldType,
  isRequired: false,
  placeholder: "",
  helpText: "",
  sortOrder: 0,
  optionsRaw: "", // "Label:value, Label2:value2"
  optionsKey: "", // Link to Global Options
  showIfField: "",
  showIfValue: "",
};

const inputCls =
  "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2150a0] focus:ring-1 focus:ring-[#2150a0]";

const Field = ({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-[11px] text-gray-400 mt-0.5">{hint}</p>}
  </div>
);

// ─── Badge for field type ─────────────────────────────────────────────────────

const FieldTypeBadge = ({ type }: { type: TFieldType }) => {
  const colors: Record<string, string> = {
    "section-header": "bg-purple-100 text-purple-700",
    boolean: "bg-green-100 text-green-700",
    select: "bg-blue-100 text-blue-700",
    radio: "bg-indigo-100 text-indigo-700",
    file: "bg-yellow-100 text-yellow-700",
    date: "bg-orange-100 text-orange-700",
  };
  const cls = colors[type] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cls}`}>
      {type}
    </span>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function QuestionManagerPage() {
  const params = useParams();
  const visaTypeId = params.id as string;

  const { data: vtData } = useGetSingleVisaTypeQuery(visaTypeId);
  const { data: qData, isLoading } = useGetQuestionsQuery({ visaTypeId });
  const { data: globalOptionsData } = useGetGlobalOptionsQuery({});
  const [createQuestion, { isLoading: isCreating }] = useCreateQuestionMutation();
  const [updateQuestion, { isLoading: isUpdating }] = useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();
  const { showAlert, showConfirm } = useAlert();

  const visaType = vtData?.data;
  const allQuestions = (qData?.data ?? []) as TQuestion[];

  // Group by step
  const steps: Record<number, TQuestion[]> = {};
  for (const q of allQuestions) {
    if (!steps[q.stepNumber]) steps[q.stepNumber] = [];
    steps[q.stepNumber].push(q);
  }
  const stepNumbers = Object.keys(steps)
    .map(Number)
    .sort((a, b) => a - b);

  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const set = (k: keyof typeof EMPTY_FORM, v: unknown) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  // ── Modal Helpers ────────────────────────────────────────────────────────────

  const openCreate = (stepNumber?: number) => {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      stepNumber: stepNumber ?? activeStep ?? 1,
      stepLabel:
        stepNumber && steps[stepNumber]?.[0]?.stepLabel
          ? steps[stepNumber][0].stepLabel
          : "",
    });
    setShowModal(true);
  };

  const openEdit = (q: TQuestion) => {
    setEditingId(q._id);
    setForm({
      stepNumber: q.stepNumber,
      stepLabel: q.stepLabel,
      fieldKey: q.fieldKey,
      label: q.label,
      fieldType: q.fieldType,
      isRequired: q.isRequired,
      placeholder: q.placeholder ?? "",
      helpText: q.helpText ?? "",
      sortOrder: q.sortOrder,
      optionsRaw: q.options
        ? q.options.map((o) => `${o.label}:${o.value}`).join(", ")
        : "",
      optionsKey: q.optionsKey ?? "",
      showIfField: q.showIf?.field ?? "",
      showIfValue: q.showIf?.value ?? "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  // ── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const options = form.optionsRaw
      ? form.optionsRaw
          .split(",")
          .map((s) => {
            const [label, value] = s.split(":").map((x) => x.trim());
            return { label: label || value, value: value || label };
          })
          .filter((o) => o.label && o.value)
      : undefined;

    const showIf =
      form.showIfField && form.showIfValue
        ? { field: form.showIfField.trim(), value: form.showIfValue.trim() }
        : undefined;

    const payload = {
      visaTypeId,
      stepNumber: Number(form.stepNumber),
      stepLabel: form.stepLabel.trim(),
      fieldKey: form.fieldKey.trim(),
      label: form.label.trim(),
      fieldType: form.fieldType,
      isRequired: form.isRequired,
      placeholder: form.placeholder.trim() || undefined,
      helpText: form.helpText.trim() || undefined,
      sortOrder: Number(form.sortOrder),
      options,
      optionsKey: form.optionsKey.trim() || undefined,
      showIf,
    };

    try {
      if (editingId) {
        await updateQuestion({ id: editingId, ...payload }).unwrap();
        showAlert({ type: "success", title: "Updated", message: "Question updated." });
      } else {
        await createQuestion(payload).unwrap();
        showAlert({ type: "success", title: "Created", message: "Question created." });
      }
      closeModal();
    } catch (err) {
      showAlert({
        type: "error",
        title: "Failed",
        message:
          (err as { data?: { message?: string } })?.data?.message ||
          "Something went wrong",
      });
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────

  const handleDelete = async (q: TQuestion) => {
    const confirmed = await showConfirm({
      title: "Delete Question",
      message: `Delete question "${q.label}"? This cannot be undone.`,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      type: "danger",
    });
    if (!confirmed) return;

    try {
      await deleteQuestion(q._id).unwrap();
      showAlert({ type: "success", title: "Deleted", message: "Question deleted." });
    } catch {
      showAlert({ type: "error", title: "Failed", message: "Could not delete question." });
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="font-sans px-5 pb-10">

      {/* ── Breadcrumb / Header ─────────────────────────────────────────────── */}
      <div className="mb-6">
        <NextLink
          href="/manage-visa-types"
          className="flex items-center gap-1 text-[#2150a0] text-xs hover:underline mb-3 no-underline"
        >
          <ArrowLeft size={13} /> Back to Visa Types
        </NextLink>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl text-[#00264d] m-0">
              {visaType ? `${visaType.name} — Questions` : "Question Manager"}
            </h1>
            <p className="text-gray-500 text-[13px] mt-1.5">
              {visaType
                ? `${visaType.totalSteps} steps · ${allQuestions.length} questions total · Category: ${visaType.category}`
                : "Loading..."}
            </p>
          </div>
          <button
            id="add-question-btn"
            onClick={() => openCreate()}
            className="flex items-center gap-2 bg-[#2150a0] text-white px-4 py-2 hover:bg-[#153468] transition-colors rounded text-sm shadow-sm cursor-pointer"
          >
            <Plus size={16} /> Add Question
          </button>
        </div>
      </div>

      {/* ── Step Tabs ───────────────────────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button
          onClick={() => setActiveStep(null)}
          className={`px-3 py-1.5 text-xs rounded border transition-colors cursor-pointer ${activeStep === null ? "bg-[#2150a0] text-white border-[#2150a0]" : "bg-white text-gray-600 border-gray-300 hover:border-[#2150a0] hover:text-[#2150a0]"}`}
        >
          All Steps
        </button>
        {stepNumbers.map((sn) => (
          <button
            key={sn}
            onClick={() => setActiveStep(sn)}
            className={`px-3 py-1.5 text-xs rounded border transition-colors cursor-pointer ${activeStep === sn ? "bg-[#2150a0] text-white border-[#2150a0]" : "bg-white text-gray-600 border-gray-300 hover:border-[#2150a0] hover:text-[#2150a0]"}`}
          >
            Step {sn}
            {steps[sn]?.[0]?.stepLabel ? ` — ${steps[sn][0].stepLabel}` : ""}
          </button>
        ))}
      </div>

      {/* ── Questions ───────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-500 text-sm">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2150a0]" />
          Loading questions...
        </div>
      ) : allQuestions.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-300 rounded bg-gray-50">
          <HelpCircle size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm mb-4">No questions yet for this visa type.</p>
          <button
            onClick={() => openCreate()}
            className="inline-flex items-center gap-1 bg-[#2150a0] text-white px-4 py-2 rounded text-sm hover:bg-[#153468] transition-colors cursor-pointer"
          >
            <Plus size={14} /> Add First Question
          </button>
        </div>
      ) : (
        (activeStep !== null ? [activeStep] : stepNumbers).map((sn) => (
          <div key={sn} className="mb-6 bg-white border border-gray-300 shadow-sm">
            {/* Step Header */}
            <div className="bg-[#00264d] text-white px-4 py-2 text-sm font-bold flex justify-between items-center">
              <span>
                Step {sn}
                {steps[sn]?.[0]?.stepLabel
                  ? ` — ${steps[sn][0].stepLabel}`
                  : ""}
                <span className="ml-2 text-xs font-normal opacity-70">
                  ({steps[sn]?.length ?? 0} questions)
                </span>
              </span>
              <button
                onClick={() => openCreate(sn)}
                className="flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded transition-colors cursor-pointer border-none text-white"
              >
                <Plus size={11} /> Add to step
              </button>
            </div>

            {/* Questions Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs text-left">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="p-3 w-6 text-gray-400" />
                    <th className="p-3 font-bold text-gray-700">Field Key</th>
                    <th className="p-3 font-bold text-gray-700">Label</th>
                    <th className="p-3 font-bold text-gray-700">Type</th>
                    <th className="p-3 font-bold text-gray-700 text-center">Required</th>
                    <th className="p-3 font-bold text-gray-700 text-center">Order</th>
                    <th className="p-3 font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...(steps[sn] ?? [])]
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((q, idx) => (
                      <tr
                        key={q._id}
                        className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                      >
                        <td className="p-3 text-gray-300">
                          <GripVertical size={12} />
                        </td>
                        <td className="p-3 font-mono text-[11px] text-gray-600">
                          {q.fieldKey}
                        </td>
                        <td className="p-3 text-gray-800 max-w-[240px] truncate">
                          {q.label}
                          {q.showIf && (
                            <span className="ml-1 text-[10px] text-purple-500">
                              (if {q.showIf.field}={q.showIf.value})
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <FieldTypeBadge type={q.fieldType} />
                        </td>
                        <td className="p-3 text-center">
                          {q.isRequired ? (
                            <span className="text-red-500 font-bold">Yes</span>
                          ) : (
                            <span className="text-gray-400">No</span>
                          )}
                        </td>
                        <td className="p-3 text-center text-gray-500">
                          {q.sortOrder}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openEdit(q)}
                              className="flex items-center gap-1 text-gray-500 hover:text-[#2150a0] bg-transparent border-none p-0 cursor-pointer text-xs font-medium transition-colors"
                            >
                              <Pencil size={11} /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(q)}
                              className="flex items-center gap-1 text-red-500 hover:text-red-700 bg-transparent border-none p-0 cursor-pointer text-xs font-medium transition-colors"
                            >
                              <Trash2 size={11} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {/* ── Create / Edit Modal ────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-[#00264d] flex items-center gap-2 m-0">
                <HelpCircle size={18} />
                {editingId ? "Edit Question" : "Add New Question"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1">
              <div className="space-y-4">

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Step Number" required>
                    <input
                      type="number"
                      className={inputCls}
                      min={1}
                      max={20}
                      required
                      value={form.stepNumber}
                      onChange={(e) => set("stepNumber", e.target.value)}
                    />
                  </Field>
                  <Field label="Step Label" required hint='e.g. "Applicant Details"'>
                    <input
                      type="text"
                      className={inputCls}
                      required
                      value={form.stepLabel}
                      onChange={(e) => set("stepLabel", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Field Key"
                    required
                    hint='Unique key, camelCase. e.g. "familyName"'
                  >
                    <input
                      type="text"
                      className={inputCls}
                      required
                      value={form.fieldKey}
                      onChange={(e) => set("fieldKey", e.target.value)}
                      placeholder="e.g. familyName"
                    />
                  </Field>
                  <Field label="Field Type" required>
                    <select
                      className={inputCls}
                      value={form.fieldType}
                      onChange={(e) => set("fieldType", e.target.value)}
                    >
                      {FIELD_TYPES.map((ft) => (
                        <option key={ft.value} value={ft.value}>
                          {ft.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Label (displayed to user)" required>
                  <input
                    type="text"
                    className={inputCls}
                    required
                    value={form.label}
                    onChange={(e) => set("label", e.target.value)}
                    placeholder='e.g. "Family name"'
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Placeholder">
                    <input
                      type="text"
                      className={inputCls}
                      value={form.placeholder}
                      onChange={(e) => set("placeholder", e.target.value)}
                    />
                  </Field>
                  <Field label="Sort Order">
                    <input
                      type="number"
                      className={inputCls}
                      min={0}
                      value={form.sortOrder}
                      onChange={(e) => set("sortOrder", e.target.value)}
                    />
                  </Field>
                </div>

                <Field label="Help Text">
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={2}
                    value={form.helpText}
                    onChange={(e) => set("helpText", e.target.value)}
                    placeholder="Optional hint shown below the field..."
                  />
                </Field>

                {(form.fieldType === "select" ||
                  form.fieldType === "radio" ||
                  form.fieldType === "checkbox") && (
                  <div className="space-y-4">
                    <Field 
                      label="Link to Global Options (Optional)" 
                      hint="Select a central data set managed in System Settings."
                    >
                      <select
                        className={`${inputCls} font-mono text-[11px]`}
                        value={form.optionsKey}
                        onChange={(e) => set("optionsKey", e.target.value)}
                      >
                        <option value="">-- No Link (Use Custom Options) --</option>
                        {globalOptionsData?.data?.map((opt: { key: string; label: string }) => (
                          <option key={opt.key} value={opt.key}>
                            {opt.label} ({opt.key})
                          </option>
                        ))}
                      </select>
                    </Field>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">OR define custom options below</span>
                      </div>
                    </div>

                    <Field
                      label="Custom Options"
                      hint='Format: "Label:value, Label2:value2"'
                    >
                      <textarea
                        className={`${inputCls} resize-none font-mono text-xs`}
                        rows={3}
                        value={form.optionsRaw}
                        disabled={!!form.optionsKey}
                        onChange={(e) => set("optionsRaw", e.target.value)}
                        placeholder="Male:Male, Female:Female, Other:Other"
                      />
                      {form.optionsKey && (
                        <p className="text-[10px] text-blue-600 mt-1 font-medium italic">
                          Global options key is set. Custom options above will be ignored by the system.
                        </p>
                      )}
                    </Field>
                  </div>
                )}

                <div className="p-3 bg-gray-50 border border-gray-200 rounded space-y-3">
                  <p className="text-xs font-semibold text-gray-600 m-0">
                    Conditional Display (Show If)
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="When field key equals..." hint='e.g. "hasAuthorisedRecipient"'>
                      <input
                        type="text"
                        className={inputCls}
                        value={form.showIfField}
                        onChange={(e) => set("showIfField", e.target.value)}
                        placeholder="fieldKey"
                      />
                    </Field>
                    <Field label="...this value" hint='e.g. "true"'>
                      <input
                        type="text"
                        className={inputCls}
                        value={form.showIfValue}
                        onChange={(e) => set("showIfValue", e.target.value)}
                        placeholder="true"
                      />
                    </Field>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="q-required-checkbox"
                    type="checkbox"
                    className="w-4 h-4 accent-[#2150a0]"
                    checked={form.isRequired}
                    onChange={(e) => set("isRequired", e.target.checked)}
                  />
                  <label
                    htmlFor="q-required-checkbox"
                    className="text-sm font-semibold text-gray-700 cursor-pointer select-none"
                  >
                    Required field — user must fill this to proceed
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  id="question-submit-btn"
                  type="submit"
                  isLoading={isCreating || isUpdating}
                >
                  {editingId ? "Save Changes" : "Add Question"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
