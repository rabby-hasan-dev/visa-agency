"use client";

import { useForm } from "react-hook-form";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAlert } from "@/components/ui";
import { Suspense } from "react";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { TSiteSettings } from "@/types/settings";
import { Globe, Mail, Lock, ShieldCheck, ArrowRight, ChevronLeft } from "lucide-react";

interface ResetPasswordValues {
  email: string;
  otp: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const router = useRouter();
  const { showAlert } = useAlert();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    if (data.newPassword !== data.confirmPassword) {
      showAlert({
        title: "Error",
        message: "Passwords don't match",
        type: "error",
      });
      return;
    }
    try {
      await resetPassword({
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      }).unwrap();
      showAlert({
        title: "Success",
        message: "Password reset successfully. You can now login.",
        type: "success",
      });
      router.push("/login");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      showAlert({
        title: "Reset Failed",
        message:
          error?.data?.message ||
          "Failed to reset password. Please check your verification code.",
        type: "error",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-center mb-8">
        <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex items-center justify-center">
          <ShieldCheck size={36} className="text-blue-400" />
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-white mb-3">Reset Password</h1>
        <p className="text-gray-400 leading-relaxed max-w-xs mx-auto">
          Enter the verification code sent to your email and choose a new password.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
          {/* Email (read-only) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
              <input
                {...register("email")}
                readOnly
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-gray-500 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* OTP */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 ml-1">
              Verification Code <span className="text-blue-500">*</span>
            </label>
            <input
              {...register("otp", { required: "Code is required" })}
              type="text"
              placeholder="• • • • • •"
              maxLength={6}
              className={`w-full bg-white/5 border ${
                errors.otp ? "border-rose-500/50" : "border-white/10"
              } rounded-2xl py-4 px-4 text-white text-center text-2xl tracking-[1rem] font-mono outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all`}
            />
            {errors.otp && (
              <p className="text-rose-400 text-xs mt-1 ml-1">{errors.otp.message as string}</p>
            )}
          </div>

          <div className="pt-2 border-t border-white/5 space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 ml-1">
                New Password <span className="text-blue-500">*</span>
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors"
                  size={20}
                />
                <input
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: { value: 14, message: "Minimum 14 characters required" },
                  })}
                  type="password"
                  placeholder="••••••••••••••"
                  className={`w-full bg-white/5 border ${
                    errors.newPassword ? "border-rose-500/50" : "border-white/10"
                  } rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all`}
                />
              </div>
              {errors.newPassword && (
                <p className="text-rose-400 text-xs mt-1 ml-1">{errors.newPassword.message as string}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 ml-1">
                Confirm Password <span className="text-blue-500">*</span>
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors"
                  size={20}
                />
                <input
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                  })}
                  type="password"
                  placeholder="••••••••••••••"
                  className={`w-full bg-white/5 border ${
                    errors.confirmPassword ? "border-rose-500/50" : "border-white/10"
                  } rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-rose-400 text-xs mt-1 ml-1">
                  {errors.confirmPassword.message as string}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              "Resetting Password..."
            ) : (
              <>
                Reset Password{" "}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-gray-400 text-sm">
            Back to{" "}
            <Link href="/login" className="text-white font-bold hover:text-blue-400 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const ResetPasswordPage = () => {
  const { data: siteResponse } = useGetSiteSettingsQuery({});

  const siteSettings = (siteResponse?.data ?? {
    siteName: "Elite Visa Hub",
    brandName: "Global Passports & Visas",
    departmentName: "Advanced Immigration Consultants",
  }) as TSiteSettings;

  return (
    <div className="bg-[#040d1a] min-h-screen font-sans text-gray-200 flex flex-col relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-20 px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <Globe className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white leading-none">
                {siteSettings.siteName}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold mt-1">
                {siteSettings.departmentName}
              </span>
            </div>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={18} /> Back to Login
          </Link>
        </div>
      </header>

      <div className="flex-grow flex items-center justify-center px-6 relative z-20 pb-20">
        <Suspense
          fallback={
            <div className="text-center text-gray-400">
              <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
              Loading...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/legal" className="hover:text-white transition-colors">Legal</Link>
            <Link href="/security" className="hover:text-white transition-colors">Security</Link>
          </div>
          <div>&copy; {new Date().getFullYear()} {siteSettings.brandName}</div>
        </div>
      </footer>
    </div>
  );
};

export default ResetPasswordPage;
