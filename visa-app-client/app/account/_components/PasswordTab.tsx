import { UseFormReturn } from "react-hook-form";
import * as schemas from "@/schemas/profile.schema";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PasswordTabProps {
  passwordForm: UseFormReturn<schemas.PasswordUpdateValues>;
  onSubmit: (data: schemas.PasswordUpdateValues) => Promise<void>;
}

const PasswordField = ({
  label,
  reg,
  error,
  show,
  onToggle,
}: {
  label: string;
  reg: ReturnType<UseFormReturn<schemas.PasswordUpdateValues>["register"]>;
  error?: string;
  show: boolean;
  onToggle: () => void;
}) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
      <input
        {...reg}
        type={show ? "text" : "password"}
        placeholder="••••••••••••••"
        className={`w-full pl-9 pr-10 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
          error ? "border-rose-400 bg-rose-50" : "border-gray-200 focus:border-blue-400 bg-white"
        }`}
      />
      <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
    {error && <p className="text-xs text-rose-500">{error}</p>}
  </div>
);

export const PasswordTab = ({ passwordForm, onSubmit }: PasswordTabProps) => {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="max-w-xl">
      <form onSubmit={passwordForm.handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800">Change Password</h2>
            <p className="text-xs text-gray-400 mt-0.5">Enter your current password then choose a new one</p>
          </div>
          <div className="px-5 py-5 space-y-4">
            <PasswordField
              label="Current Password"
              reg={passwordForm.register("oldPassword")}
              error={passwordForm.formState.errors.oldPassword?.message}
              show={showOld}
              onToggle={() => setShowOld(!showOld)}
            />
            <PasswordField
              label="New Password"
              reg={passwordForm.register("newPassword")}
              error={passwordForm.formState.errors.newPassword?.message}
              show={showNew}
              onToggle={() => setShowNew(!showNew)}
            />
            <PasswordField
              label="Confirm New Password"
              reg={passwordForm.register("confirmPassword")}
              error={passwordForm.formState.errors.confirmPassword?.message}
              show={showConfirm}
              onToggle={() => setShowConfirm(!showConfirm)}
            />
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-700 mb-2">Password requirements</p>
          <ul className="space-y-1">
            {[
              "At least 14 characters long",
              "At least one lowercase letter (a-z)",
              "At least one uppercase letter (A-Z)",
              "At least one number (0-9)",
              "Cannot reuse your last 8 passwords",
            ].map((req) => (
              <li key={req} className="text-xs text-blue-600 flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-400 rounded-full shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => passwordForm.reset()}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Save Password
          </button>
        </div>
      </form>
    </div>
  );
};
