"use client";

import { useState } from "react";
import {
  useGetSiteSettingsQuery,
  useUpdateSiteSettingsMutation,
  useGetNavigationQuery,
  useUpdateNavigationMutation,
  useGetGlobalOptionsQuery,
  useUpdateGlobalOptionsMutation,
  useGetPaymentConfigQuery,
  useUpdatePaymentConfigMutation,
  useGetCloudinaryConfigQuery,
  useUpdateCloudinaryConfigMutation,
  useGetAppConfigQuery,
  useUpdateAppConfigMutation,
} from "@/redux/api/settingsApi";
import { useGetMeQuery } from "@/redux/api/userApi";
import {
  Settings as SettingsIcon,
  Globe,
  Menu,
  ListFilter,
  Save,
  Plus,
  Trash2,
  Info,
  CreditCard,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Cloud,
  Settings2,
} from "lucide-react";
import { Button, useAlert } from "@/components/ui";
import { TSiteSettings, TNavigationItem, TGlobalOption, TPaymentConfig, TCloudinaryConfig, TAppConfig } from "@/types/settings";


const inputCls =
  "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2150a0] focus:ring-1 focus:ring-[#2150a0]";

// ── Branding Form Component ──────────────────────────────────────────────────
const BrandingForm = ({ initialData }: { initialData: TSiteSettings }) => {
  const { showAlert } = useAlert();
  const [updateSite, { isLoading: isUpdatingSite }] = useUpdateSiteSettingsMutation();
  const [siteForm, setSiteForm] = useState<TSiteSettings>(initialData);

  const handleSiteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSite(siteForm).unwrap();
      showAlert({ type: "success", title: "Success", message: "Site branding updated successfully." });
    } catch {
      showAlert({ type: "error", title: "Error", message: "Failed to update site branding." });
    }
  };

  return (
    <form onSubmit={handleSiteSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Site Name</label>
          <input
            type="text"
            className={inputCls}
            value={siteForm.siteName}
            onChange={(e) => setSiteForm({ ...siteForm, siteName: e.target.value })}
          />
          <p className="text-[11px] text-gray-400 mt-1">Displayed in browser title and headers.</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Brand Name</label>
          <input
            type="text"
            className={inputCls}
            value={siteForm.brandName}
            onChange={(e) => setSiteForm({ ...siteForm, brandName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Department Name</label>
          <input
            type="text"
            className={inputCls}
            value={siteForm.departmentName}
            onChange={(e) => setSiteForm({ ...siteForm, departmentName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Contact Email</label>
          <input
            type="email"
            className={inputCls}
            value={siteForm.contactEmail}
            onChange={(e) => setSiteForm({ ...siteForm, contactEmail: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Contact Phone</label>
          <input
            type="text"
            className={inputCls}
            value={siteForm.contactPhone || ""}
            onChange={(e) => setSiteForm({ ...siteForm, contactPhone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Address</label>
          <input
            type="text"
            className={inputCls}
            value={siteForm.address || ""}
            onChange={(e) => setSiteForm({ ...siteForm, address: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Logo URL</label>
          <input
            type="text"
            className={inputCls}
            value={siteForm.logoUrl || ""}
            onChange={(e) => setSiteForm({ ...siteForm, logoUrl: e.target.value })}
          />
          <p className="text-[11px] text-gray-400 mt-1">Full URL to a PNG/SVG logo.</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Theme Color</label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              className={`${inputCls} h-10 w-20 p-1`}
              value={siteForm.themeColor || "#2150a0"}
              onChange={(e) => setSiteForm({ ...siteForm, themeColor: e.target.value })}
            />
            <input
              type="text"
              className={inputCls}
              value={siteForm.themeColor || "#2150a0"}
              onChange={(e) => setSiteForm({ ...siteForm, themeColor: e.target.value })}
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Primary accent color for the UI.</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Footer Links</label>
        <div className="space-y-3">
          {siteForm.footerLinks.map((link, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Label"
                className={`${inputCls} flex-1`}
                value={link.label}
                onChange={(e) => {
                  const next = [...siteForm.footerLinks];
                  next[i] = { ...next[i], label: e.target.value };
                  setSiteForm({ ...siteForm, footerLinks: next });
                }}
              />
              <input
                type="text"
                placeholder="URL (e.g. /privacy)"
                className={`${inputCls} flex-1`}
                value={link.href}
                onChange={(e) => {
                  const next = [...siteForm.footerLinks];
                  next[i] = { ...next[i], href: e.target.value };
                  setSiteForm({ ...siteForm, footerLinks: next });
                }}
              />
              <label className="flex items-center gap-1.5 text-[11px] text-gray-500 whitespace-nowrap cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!link.isExternal}
                  onChange={(e) => {
                    const next = [...siteForm.footerLinks];
                    next[i] = { ...next[i], isExternal: e.target.checked };
                    setSiteForm({ ...siteForm, footerLinks: next });
                  }}
                />
                External
              </label>
              <button
                type="button"
                onClick={() => {
                  const next = siteForm.footerLinks.filter((_, idx) => idx !== i);
                  setSiteForm({ ...siteForm, footerLinks: next });
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSiteForm({
              ...siteForm,
              footerLinks: [...siteForm.footerLinks, { label: "", href: "" }]
            })}
            className="text-xs text-[#2150a0] flex items-center gap-1 hover:underline font-semibold"
          >
            <Plus size={14} /> Add Footer Link
          </button>
        </div>
      </div>

      <div className="pt-4 border-t flex justify-end">
        <Button type="submit" isLoading={isUpdatingSite} className="flex gap-2 items-center">
          <Save size={16} /> Save Branding
        </Button>
      </div>
    </form>
  );
};

// ── Navigation Form Component ────────────────────────────────────────────────
const NavigationForm = ({ initialData }: { initialData: TNavigationItem[] }) => {
  const { showAlert } = useAlert();
  const [updateNav, { isLoading: isUpdatingNav }] = useUpdateNavigationMutation();
  const [navItems, setNavItems] = useState<TNavigationItem[]>(initialData);

  const addNavItem = () => {
    setNavItems([
      ...navItems,
      { name: "New Menu", href: "/", role: "superAdmin", sortOrder: navItems.length + 1 },
    ]);
  };

  const removeNavItem = (index: number) => {
    setNavItems(navItems.filter((_, i) => i !== index));
  };

  const updateNavItem = (index: number, field: keyof TNavigationItem, value: string | number) => {
    const next = [...navItems];
    next[index] = { ...next[index], [field]: value };
    setNavItems(next);
  };

  const handleNavSubmit = async () => {
    try {
      await updateNav(navItems).unwrap();
      showAlert({ type: "success", title: "Success", message: "Navigation updated successfully." });
    } catch {
      showAlert({ type: "error", title: "Error", message: "Failed to update navigation." });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-start gap-2 text-blue-700 bg-blue-50 p-3 rounded text-xs border border-blue-100 flex-1 mr-6">
          <Info size={14} className="shrink-0 mt-0.5" />
          <p>Configure role-specific menus. Changes reflect immediately across all sessions.</p>
        </div>
        <button
          onClick={addNavItem}
          className="bg-[#2150a0] text-white px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 hover:bg-[#1a4080]"
        >
          <Plus size={16} /> Add Menu Item
        </button>
      </div>

      <div className="grid grid-cols-12 gap-4 px-3 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        <div className="col-span-3">Menu Label</div>
        <div className="col-span-3">Target Path</div>
        <div className="col-span-3">Visible To</div>
        <div className="col-span-2">Order</div>
        <div className="col-span-1"></div>
      </div>

      {navItems.map((item, i) => (
        <div key={i} className="bg-gray-50 p-4 rounded border border-gray-200 space-y-4">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-3">
              <input
                type="text"
                className={inputCls}
                placeholder="Label"
                value={item.name}
                onChange={(e) => updateNavItem(i, "name", e.target.value)}
              />
            </div>
            <div className="col-span-3">
              <input
                type="text"
                className={inputCls}
                placeholder="Path"
                value={item.href}
                onChange={(e) => updateNavItem(i, "href", e.target.value)}
              />
            </div>
            <div className="col-span-3">
              <select
                className={inputCls}
                value={item.role}
                onChange={(e) => updateNavItem(i, "role", e.target.value as TNavigationItem["role"])}
              >
                <option value="superAdmin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
                <option value="applicant">Applicant</option>
              </select>
            </div>
            <div className="col-span-2">
              <input
                type="number"
                className={inputCls}
                value={item.sortOrder}
                onChange={(e) => updateNavItem(i, "sortOrder", Number(e.target.value))}
              />
            </div>
            <div className="col-span-1 text-right">
              <button
                onClick={() => removeNavItem(i)}
                className="text-red-500 p-2 hover:bg-red-50 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="pl-8 border-l-2 border-gray-200 space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Submenus</p>
            {item.submenu?.map((sub, j) => (
              <div key={j} className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Sub Label"
                  className={`${inputCls} flex-1 bg-white`}
                  value={sub.name}
                  onChange={(e) => {
                    const next = [...navItems];
                    const nextSub = [...(next[i].submenu || [])];
                    nextSub[j] = { ...nextSub[j], name: e.target.value };
                    next[i] = { ...next[i], submenu: nextSub };
                    setNavItems(next);
                  }}
                />
                <input
                  type="text"
                  placeholder="Sub Path"
                  className={`${inputCls} flex-1 bg-white`}
                  value={sub.href}
                  onChange={(e) => {
                    const next = [...navItems];
                    const nextSub = [...(next[i].submenu || [])];
                    nextSub[j] = { ...nextSub[j], href: e.target.value };
                    next[i] = { ...next[i], submenu: nextSub };
                    setNavItems(next);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = [...navItems];
                    const nextSub = next[i].submenu?.filter((_, idx) => idx !== j);
                    next[i] = { ...next[i], submenu: nextSub };
                    setNavItems(next);
                  }}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const next = [...navItems];
                next[i] = {
                  ...next[i],
                  submenu: [...(next[i].submenu || []), { name: "", href: "" }]
                };
                setNavItems(next);
              }}
              className="text-[11px] text-[#2150a0] flex items-center gap-1 hover:underline font-semibold"
            >
              <Plus size={12} /> Add Submenu
            </button>
          </div>
        </div>
      ))}

      {navItems.length === 0 && (
        <div className="py-10 text-center border-2 border-dashed border-gray-200 text-gray-400 rounded">
          No navigation items configured.
        </div>
      )}

      <div className="pt-6 border-t flex justify-end">
        <Button onClick={handleNavSubmit} isLoading={isUpdatingNav} className="flex gap-2 items-center">
          <Save size={16} /> Save Navigation
        </Button>
      </div>
    </div>
  );
};

// ── Options Form Component ───────────────────────────────────────────────────
const OptionsForm = ({ initialData }: { initialData: TGlobalOption[] }) => {
  const { showAlert } = useAlert();
  const [updateOptions, { isLoading: isUpdatingOptions }] = useUpdateGlobalOptionsMutation();
  const [options, setOptions] = useState<TGlobalOption[]>(initialData);

  const handleOptionsSubmit = async () => {
    try {
      await updateOptions(options).unwrap();
      showAlert({ type: "success", title: "Success", message: "Global options updated successfully." });
    } catch {
      showAlert({ type: "error", title: "Error", message: "Failed to update global options." });
    }
  };

  const addCategory = () => {
    setOptions([
      ...options,
      { key: `key_${Date.now()}`, label: "New Category", options: ["Option 1"] },
    ]);
  };

  const removeCategory = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateCategory = (index: number, field: "key" | "label", value: string) => {
    const next = [...options];
    next[index] = { ...next[index], [field]: value };
    setOptions(next);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-start gap-2 text-[#2150a0] bg-blue-50 p-3 rounded text-xs border border-blue-100 flex-1 mr-6">
          <Info size={14} className="shrink-0 mt-0.5" />
          <p>Define global dropdown options used across different visa application forms. These are reusable data sets.</p>
        </div>
        <button
          onClick={addCategory}
          className="bg-[#2150a0] text-white px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 hover:bg-[#1a4080] transition-colors"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {options.map((opt, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden group hover:border-[#2150a0] transition-all">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <div className="flex gap-4 flex-1">
                <div className="flex-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Display Label</label>
                  <input
                    type="text"
                    className={`${inputCls} bg-white`}
                    value={opt.label}
                    onChange={(e) => updateCategory(i, "label", e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Internal Key</label>
                  <input
                    type="text"
                    className={`${inputCls} bg-white font-mono text-[11px]`}
                    value={opt.key}
                    onChange={(e) => updateCategory(i, "key", e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={() => removeCategory(i)}
                className="ml-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                title="Delete Category"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="p-4">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Options List</label>
              <div className="flex flex-wrap gap-2">
                {opt.options.map((option, j) => (
                  <div key={j} className="flex items-center gap-1 bg-white px-2 py-1.5 rounded border border-gray-200 text-[11px] group/item hover:border-[#2150a0]">
                    <input
                      type="text"
                      className="bg-transparent outline-none w-[140px] font-medium"
                      value={option}
                      onChange={(e) => {
                        const next = [...options];
                        const newOptList = [...next[i].options];
                        newOptList[j] = e.target.value;
                        next[i] = { ...next[i], options: newOptList };
                        setOptions(next);
                      }}
                    />
                    <button
                      onClick={() => {
                        const next = [...options];
                        const newOptList = next[i].options.filter((_, idx) => idx !== j);
                        next[i] = { ...next[i], options: newOptList };
                        setOptions(next);
                      }}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const next = [...options];
                    const newOptList = [...next[i].options, `Option ${next[i].options.length + 1}`];
                    next[i] = { ...next[i], options: newOptList };
                    setOptions(next);
                  }}
                  className="text-[11px] text-[#2150a0] font-bold px-3 py-1.5 border border-dashed border-blue-200 rounded bg-blue-50/30 hover:bg-blue-50 transition-colors"
                >
                  + Add Value
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {options.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-gray-200 text-gray-400 rounded-sm">
          <ListFilter size={48} className="mx-auto mb-4 opacity-20" />
          <p className="font-bold uppercase tracking-widest text-xs">No form options configured.</p>
        </div>
      )}

      <div className="pt-6 border-t flex justify-end">
        <Button onClick={handleOptionsSubmit} isLoading={isUpdatingOptions} className="flex gap-2 items-center bg-[#2150a0] hover:bg-[#1a4080] font-bold uppercase tracking-widest text-xs px-8">
          <Save size={16} /> Update Global Form Options
        </Button>
      </div>
    </div>
  );
};

// ── Payment Gateway Form ─────────────────────────────────────────────────────


const MaskedKeyInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          className={`${inputCls} pr-10 font-mono text-xs`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Enter key…"}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
          title={show ? "Hide" : "Reveal"}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
};

const ModeToggle = ({
  mode,
  onChange,
  testLabel = "Test Mode",
  liveLabel = "Live Mode",
}: {
  mode: "test" | "live";
  onChange: (m: "test" | "live") => void;
  testLabel?: string;
  liveLabel?: string;
}) => (
  <div className="flex items-center gap-0 rounded overflow-hidden border border-gray-300 w-fit text-xs font-bold">
    <button
      type="button"
      onClick={() => onChange("test")}
      className={`px-4 py-1.5 transition-colors ${
        mode === "test"
          ? "bg-amber-500 text-white"
          : "bg-white text-gray-500 hover:bg-gray-50"
      }`}
    >
      {testLabel}
    </button>
    <button
      type="button"
      onClick={() => onChange("live")}
      className={`px-4 py-1.5 transition-colors ${
        mode === "live"
          ? "bg-emerald-600 text-white"
          : "bg-white text-gray-500 hover:bg-gray-50"
      }`}
    >
      {liveLabel}
    </button>
  </div>
);

const PaymentGatewayForm = ({ initialData }: { initialData: TPaymentConfig }) => {
  const { showAlert } = useAlert();
  const [updatePaymentConfig, { isLoading }] = useUpdatePaymentConfigMutation();
  const [form, setForm] = useState<TPaymentConfig>(initialData);


  const patchStripe = (patch: Partial<TPaymentConfig["stripe"]>) =>
    setForm((f) => ({ ...f, stripe: { ...f.stripe, ...patch } }));

  const patchSSL = (patch: Partial<TPaymentConfig["sslcommerz"]>) =>
    setForm((f) => ({ ...f, sslcommerz: { ...f.sslcommerz, ...patch } }));

  const handleSave = async () => {
    try {
      await updatePaymentConfig(form).unwrap();
      showAlert({ type: "success", title: "Saved", message: "Payment gateway configuration updated." });
    } catch {
      showAlert({ type: "error", title: "Error", message: "Failed to save payment configuration." });
    }
  };

  const activeGateway = form.activeGateway;

  return (
    <div className="space-y-8">
      {/* ── Info Banner ───────────────────────────────────── */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-700">
        <Info size={14} className="shrink-0 mt-0.5" />
        <span>
          Secret keys are <strong>encrypted in the database</strong>. Masked values (e.g. <code className="font-mono bg-blue-100 px-1 rounded">sk_test_****ab12</code>) mean a key is already saved — leave them as-is to keep the existing key, or type a new value to replace it.
        </span>
      </div>

      {/* ── Active Gateway Selector ───────────────────────── */}
      <div>
        <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest text-[11px]">Active Payment Gateway</p>
        <div className="grid grid-cols-2 gap-4">
          {(["stripe", "sslcommerz"] as const).map((gw) => (
            <button
              key={gw}
              type="button"
              onClick={() => setForm((f) => ({ ...f, activeGateway: gw }))}
              className={`relative flex flex-col items-center gap-3 p-5 rounded border-2 transition-all text-left ${
                activeGateway === gw
                  ? "border-[#2150a0] bg-blue-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {activeGateway === gw && (
                <CheckCircle size={16} className="absolute top-3 right-3 text-[#2150a0]" />
              )}
              <div className={`text-xl font-black tracking-tight ${activeGateway === gw ? "text-[#2150a0]" : "text-gray-600"}`}>
                {gw === "stripe" ? "Stripe" : "SSLCommerz"}
              </div>
              <p className="text-[11px] text-gray-500 text-center leading-relaxed">
                {gw === "stripe"
                  ? "International card payments via Stripe Checkout"
                  : "Bangladesh-based multi-payment gateway"}
              </p>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                (gw === "stripe" ? form.stripe.isEnabled : form.sslcommerz.isEnabled)
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-600"
              }`}>
                {(gw === "stripe" ? form.stripe.isEnabled : form.sslcommerz.isEnabled) ? "Enabled" : "Disabled"}
              </span>
            </button>
          ))}
        </div>
        {activeGateway && (
          <div className="flex items-center gap-2 mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
            <AlertCircle size={13} className="shrink-0" />
            <span>
              All new payments will be processed via <strong>{activeGateway === "stripe" ? "Stripe" : "SSLCommerz"}</strong>. Switch takes effect immediately.
            </span>
          </div>
        )}
      </div>

      {/* ── Stripe Configuration ──────────────────────────── */}
      <div className="border border-gray-200 rounded overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard size={16} className="text-indigo-200" />
            <span className="font-bold text-white text-sm">Stripe</span>
            <ModeToggle mode={form.stripe.mode} onChange={(m) => patchStripe({ mode: m })} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-indigo-200 select-none">
            <div
              onClick={() => patchStripe({ isEnabled: !form.stripe.isEnabled })}
              className={`relative w-9 h-5 rounded-full transition-colors ${form.stripe.isEnabled ? "bg-emerald-400" : "bg-gray-500"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.stripe.isEnabled ? "translate-x-4" : ""}`} />
            </div>
            {form.stripe.isEnabled ? "Enabled" : "Disabled"}
          </label>
        </div>

        <div className="p-5 space-y-5">
          {form.stripe.mode === "test" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <MaskedKeyInput
                id="stripe-test-secret"
                label="Test Secret Key"
                value={form.stripe.testSecretKey || ""}
                onChange={(v) => patchStripe({ testSecretKey: v })}
                placeholder="sk_test_…"
                hint="Used for test payments. Never share this key."
              />
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Test Publishable Key</label>
                <input
                  type="text"
                  className={`${inputCls} font-mono text-xs`}
                  value={form.stripe.testPublishableKey || ""}
                  onChange={(e) => patchStripe({ testPublishableKey: e.target.value })}
                  placeholder="pk_test_…"
                />
                <p className="text-[11px] text-gray-400 mt-1">Safe to expose in frontend (if needed).</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <MaskedKeyInput
                id="stripe-live-secret"
                label="Live Secret Key"
                value={form.stripe.liveSecretKey || ""}
                onChange={(v) => patchStripe({ liveSecretKey: v })}
                placeholder="sk_live_…"
                hint="⚠ Live mode — real charges will be made."
              />
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Live Publishable Key</label>
                <input
                  type="text"
                  className={`${inputCls} font-mono text-xs`}
                  value={form.stripe.livePublishableKey || ""}
                  onChange={(e) => patchStripe({ livePublishableKey: e.target.value })}
                  placeholder="pk_live_…"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
            <RefreshCw size={11} />
            <span>Toggle between Test and Live above to configure the other set of keys.</span>
          </div>
        </div>
      </div>

      {/* ── SSLCommerz Configuration ──────────────────────── */}
      <div className="border border-gray-200 rounded overflow-hidden">
        <div className="bg-gradient-to-r from-green-900 to-green-700 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard size={16} className="text-green-200" />
            <span className="font-bold text-white text-sm">SSLCommerz</span>
            <ModeToggle mode={form.sslcommerz.mode} onChange={(m) => patchSSL({ mode: m })} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-green-200 select-none">
            <div
              onClick={() => patchSSL({ isEnabled: !form.sslcommerz.isEnabled })}
              className={`relative w-9 h-5 rounded-full transition-colors ${form.sslcommerz.isEnabled ? "bg-emerald-400" : "bg-gray-500"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.sslcommerz.isEnabled ? "translate-x-4" : ""}`} />
            </div>
            {form.sslcommerz.isEnabled ? "Enabled" : "Disabled"}
          </label>
        </div>

        <div className="p-5 space-y-5">
          {form.sslcommerz.mode === "test" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Test Store ID</label>
                <input
                  type="text"
                  className={`${inputCls} font-mono text-xs`}
                  value={form.sslcommerz.testStoreId || ""}
                  onChange={(e) => patchSSL({ testStoreId: e.target.value })}
                  placeholder="e.g. testbox"
                />
                <p className="text-[11px] text-gray-400 mt-1">Sandbox Store ID from SSLCommerz dashboard.</p>
              </div>
              <MaskedKeyInput
                id="ssl-test-password"
                label="Test Store Password"
                value={form.sslcommerz.testStorePassword || ""}
                onChange={(v) => patchSSL({ testStorePassword: v })}
                placeholder="testbox@ssl"
                hint="Sandbox store password."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Live Store ID</label>
                <input
                  type="text"
                  className={`${inputCls} font-mono text-xs`}
                  value={form.sslcommerz.liveStoreId || ""}
                  onChange={(e) => patchSSL({ liveStoreId: e.target.value })}
                  placeholder="your_live_store_id"
                />
              </div>
              <MaskedKeyInput
                id="ssl-live-password"
                label="Live Store Password"
                value={form.sslcommerz.liveStorePassword || ""}
                onChange={(v) => patchSSL({ liveStorePassword: v })}
                placeholder="your_live_password"
                hint="⚠ Live mode — real transactions will occur."
              />
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
            <RefreshCw size={11} />
            <span>Toggle between Test and Live above to configure the other set of credentials.</span>
          </div>
        </div>
      </div>

      {/* ── Save Button ───────────────────────────────────── */}
      <div className="pt-4 border-t flex justify-end">
        <Button onClick={handleSave} isLoading={isLoading} className="flex gap-2 items-center px-8">
          <Save size={16} /> Save Gateway Configuration
        </Button>
      </div>
    </div>
  );
};

// ── Cloudinary Form ─────────────────────────────────────────────────────────
const CloudinaryForm = ({ initialData }: { initialData: TCloudinaryConfig }) => {
  const { showAlert } = useAlert();
  const [updateCloudinary, { isLoading }] = useUpdateCloudinaryConfigMutation();
  const [form, setForm] = useState<TCloudinaryConfig>(initialData);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCloudinary(form).unwrap();
      showAlert({ type: "success", title: "Success", message: "Cloudinary configuration updated." });
    } catch {
      showAlert({ type: "error", title: "Error", message: "Failed to update Cloudinary configuration." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-700 mb-4">
        <Info size={14} className="shrink-0 mt-0.5" />
        <span>
          Secret keys are <strong>encrypted in the database</strong>. Masked values mean a key is already saved — leave them as-is to keep the existing key.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Cloud Name</label>
          <input
            type="text"
            className={inputCls}
            value={form.cloudName}
            onChange={(e) => setForm({ ...form, cloudName: e.target.value })}
            placeholder="Enter cloud name"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">API Key</label>
          <input
            type="text"
            className={inputCls}
            value={form.apiKey}
            onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
            placeholder="Enter API key"
          />
        </div>
        <div className="md:col-span-2">
          <MaskedKeyInput
            id="cloudinary-api-secret"
            label="API Secret"
            value={form.apiSecret}
            onChange={(v) => setForm({ ...form, apiSecret: v })}
            placeholder="Enter API secret"
          />
        </div>
      </div>

      <div className="pt-4 border-t flex justify-end">
        <Button type="submit" isLoading={isLoading} className="flex gap-2 items-center px-8">
          <Save size={16} /> Save Cloudinary Config
        </Button>
      </div>
    </form>
  );
};

// ── App Config Form ─────────────────────────────────────────────────────────
const AppConfigForm = ({ initialData }: { initialData: TAppConfig }) => {
  const { showAlert } = useAlert();
  const [updateApp, { isLoading }] = useUpdateAppConfigMutation();
  const [form, setForm] = useState<TAppConfig>(initialData);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateApp(form).unwrap();
      showAlert({ type: "success", title: "Success", message: "Application configuration updated." });
    } catch {
      showAlert({ type: "error", title: "Error", message: "Failed to update configuration." });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Client Site URL</label>
          <input
            type="text"
            className={inputCls}
            value={form.clientSiteUrl}
            onChange={(e) => setForm({ ...form, clientSiteUrl: e.target.value })}
            placeholder="https://example.com"
          />
          <p className="text-[11px] text-gray-400 mt-1">Base URL of the frontend application.</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Backend Base URL</label>
          <input
            type="text"
            className={inputCls}
            value={form.backendBaseUrl}
            onChange={(e) => setForm({ ...form, backendBaseUrl: e.target.value })}
            placeholder="https://api.example.com"
          />
          <p className="text-[11px] text-gray-400 mt-1">Base URL of the API server.</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Reset Password UI Link</label>
          <input
            type="text"
            className={inputCls}
            value={form.resetPassUiLink}
            onChange={(e) => setForm({ ...form, resetPassUiLink: e.target.value })}
            placeholder="https://example.com/reset-password"
          />
          <p className="text-[11px] text-gray-400 mt-1">Link template for password reset emails.</p>
        </div>
      </div>

      <div className="pt-4 border-t flex justify-end">
        <Button type="submit" isLoading={isLoading} className="flex gap-2 items-center px-8">
          <Save size={16} /> Save App Config
        </Button>
      </div>
    </form>
  );
};

// ── Main Page Component ──────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"branding" | "navigation" | "options" | "payment" | "cloudinary" | "app">("branding");
  const { data: userData, isLoading: isLoadingUser } = useGetMeQuery(undefined);
  const userRole = userData?.data?.user?.role;
  const isSuperAdmin = userRole === "superAdmin";

  const { data: siteData, isLoading: isLoadingSite } = useGetSiteSettingsQuery({});
  const { data: navData, isLoading: isLoadingNav } = useGetNavigationQuery(undefined);
  const { data: optionsData, isLoading: isLoadingOptions } = useGetGlobalOptionsQuery({});
  const { data: paymentData, isLoading: isLoadingPayment } = useGetPaymentConfigQuery(undefined, { skip: !isSuperAdmin });
  const { data: cloudinaryData, isLoading: isLoadingCloudinary } = useGetCloudinaryConfigQuery(undefined, { skip: !isSuperAdmin });
  const { data: appData, isLoading: isLoadingApp } = useGetAppConfigQuery(undefined, { skip: !isSuperAdmin });

  const tabs = [
    { id: "branding", label: "Branding", icon: Globe },
    { id: "navigation", label: "Navigation", icon: Menu, superOnly: true },
    { id: "options", label: "Form Options", icon: ListFilter },
    { id: "payment", label: "Payment Gateway", icon: CreditCard, superOnly: true },
    { id: "cloudinary", label: "Cloudinary", icon: Cloud, superOnly: true },
    { id: "app", label: "App Config", icon: Settings2, superOnly: true },
  ].filter(tab => !tab.superOnly || isSuperAdmin);

  if (isLoadingUser) {
    return <div className="p-10 text-center text-gray-400">Loading access control...</div>;
  }

  return (
    <div className="px-5 pb-10 max-w-6xl mx-auto text-gray-800 font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#00264d] flex items-center gap-2">
          <SettingsIcon className="text-[#2150a0]" />
          System Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Global configuration for site branding, navigation menus, form options, and payment gateways.
        </p>
      </div>

      <div className="flex border-b border-gray-300 mb-6 gap-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-semibold transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "border-[#2150a0] text-[#2150a0]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.superOnly && (
              <span className="ml-1 text-[9px] font-black bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded uppercase tracking-wide">
                Super Admin
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-300 p-6 shadow-sm min-h-[400px]">
        {activeTab === "branding" && (
          isLoadingSite ? <p className="text-center text-gray-400">Loading branding...</p> :
          siteData?.data ? <BrandingForm initialData={siteData.data} /> : <p>No data</p>
        )}

        {activeTab === "navigation" && isSuperAdmin && (
          isLoadingNav ? <p className="text-center text-gray-400">Loading navigation...</p> :
          navData?.data ? <NavigationForm initialData={navData.data} /> : <p>No data</p>
        )}

        {activeTab === "options" && (
          isLoadingOptions ? <p className="text-center text-gray-400">Loading options...</p> :
          optionsData?.data ? <OptionsForm initialData={optionsData.data} /> : <p>No data</p>
        )}

        {activeTab === "payment" && isSuperAdmin && (
          isLoadingPayment ? (
            <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
              <RefreshCw size={18} className="animate-spin" />
              <span className="text-sm">Loading payment configuration...</span>
            </div>
          ) : paymentData?.data ? (
            <PaymentGatewayForm initialData={paymentData.data} />
          ) : (
            <PaymentGatewayForm initialData={{
              activeGateway: "stripe",
              stripe: { mode: "test", testSecretKey: "", testPublishableKey: "", liveSecretKey: "", livePublishableKey: "", isEnabled: true },
              sslcommerz: { mode: "test", testStoreId: "", testStorePassword: "", liveStoreId: "", liveStorePassword: "", isEnabled: true },
            }} />
          )
        )}

        {activeTab === "cloudinary" && isSuperAdmin && (
          isLoadingCloudinary ? <p className="text-center text-gray-400">Loading cloudinary...</p> :
          cloudinaryData?.data ? <CloudinaryForm initialData={cloudinaryData.data} /> : (
            <CloudinaryForm initialData={{ cloudName: "", apiKey: "", apiSecret: "" }} />
          )
        )}

        {activeTab === "app" && isSuperAdmin && (
          isLoadingApp ? <p className="text-center text-gray-400">Loading app config...</p> :
          appData?.data ? <AppConfigForm initialData={appData.data} /> : (
            <AppConfigForm initialData={{ clientSiteUrl: "", backendBaseUrl: "", resetPassUiLink: "" }} />
          )
        )}
      </div>
    </div>
  );
}

