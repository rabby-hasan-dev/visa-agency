import { UseFormReturn } from "react-hook-form";
import * as schemas from "@/schemas/profile.schema";
import { Mail, ArrowRight } from "lucide-react";
import { TUser } from "@/types/user";

interface EmailAddressTabProps {
  user: TUser;
  emailForm: UseFormReturn<schemas.EmailUpdateValues>;
  onSubmit: (data: schemas.EmailUpdateValues) => Promise<void>;
  isEmailVerifying: boolean;
  setIsEmailVerifying: (value: boolean) => void;
  pendingEmail: string;
  otp: string;
  setOtp: (value: string) => void;
  onVerifyEmail: () => Promise<void>;
  setActiveTab: (tab: string) => void;
}

export const EmailAddressTab = ({
  user,
  emailForm,
  onSubmit,
  isEmailVerifying,
  setIsEmailVerifying,
  pendingEmail,
  otp,
  setOtp,
  onVerifyEmail,
  setActiveTab,
}: EmailAddressTabProps) => {
  return (
    <div className="max-w-xl space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">
            {isEmailVerifying ? "Verify New Email" : "Change Email Address"}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {isEmailVerifying
              ? `Enter the 6-digit code sent to ${pendingEmail}`
              : "This email is used for account notifications and password resets"}
          </p>
        </div>

        <div className="px-5 py-5">
          {!isEmailVerifying ? (
            <form onSubmit={emailForm.handleSubmit(onSubmit)} className="space-y-4">
              {/* Current Email */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Current email</p>
                <p className="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                  {user?.email || "—"}
                </p>
              </div>

              {/* New Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  New Email Address <span className="text-blue-500">*</span>
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={15} />
                  <input
                    {...emailForm.register("email")}
                    type="email"
                    placeholder="new@example.com"
                    className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
                      emailForm.formState.errors.email
                        ? "border-rose-400 bg-rose-50"
                        : "border-gray-200 focus:border-blue-400"
                    }`}
                  />
                </div>
                {emailForm.formState.errors.email && (
                  <p className="text-xs text-rose-500">{emailForm.formState.errors.email.message}</p>
                )}
              </div>

              <p className="text-xs text-gray-500">
                A 6-digit verification code will be sent to the new address.
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("Summary")}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  Send Code <ArrowRight size={14} />
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  Code sent to <span className="font-semibold">{pendingEmail}</span>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Verification Code <span className="text-blue-500">*</span>
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  placeholder="000000"
                  className="w-full py-3 text-center text-2xl font-mono tracking-[0.8rem] border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsEmailVerifying(false)}
                className="text-xs text-blue-600 hover:underline"
              >
                Wrong email? Go back and change it
              </button>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEmailVerifying(false)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={onVerifyEmail}
                  className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Verify & Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
