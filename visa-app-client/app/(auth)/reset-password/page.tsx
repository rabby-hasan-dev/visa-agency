"use client";

import { useForm } from "react-hook-form";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAlert } from "@/components/ui";
import { Suspense } from "react";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { TSiteSettings } from "@/types/settings";

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
    <div className="max-w-[800px] mx-auto mt-5 px-[15px]">
      <h2 className="text-[#1b3564] text-lg font-normal mb-[15px]">
        Reset your password
      </h2>

      <div className="border border-[#ccc] bg-white">
        <div className="bg-[#1b3564] text-white py-[10px] px-[15px] font-bold text-sm">
          Verify code and reset password
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-5">
            <p className="mb-5">
              A verification code has been sent to your email. Please enter the
              code along with your new password.
            </p>

            <div className="flex mb-[15px] items-center">
              <label className="w-1/4 font-bold text-right pr-[15px]">
                Email
              </label>
              <div className="flex-1">
                <input
                  {...register("email")}
                  readOnly
                  className="w-3/5 py-[6px] px-2 border border-[#aaa] bg-[#f9f9f9] text-[13px] rounded-sm text-[#333]"
                />
              </div>
            </div>

            <div className="flex mb-[15px] items-center">
              <label className="w-1/4 font-bold text-right pr-[15px]">
                Verification Code <span className="text-[#c41a1f]">*</span>
              </label>
              <div className="flex-1">
                <input
                  {...register("otp", { required: "Code is required" })}
                  type="text"
                  className={`w-3/5 py-[6px] px-2 border ${errors.otp ? "border-[#c41a1f]" : "border-[#aaa]"} tracking-[4px] text-center text-[13px] rounded-sm text-[#333]`}
                  maxLength={6}
                />
                {errors.otp && (
                  <div className="text-[#c41a1f] mt-1">
                    {errors.otp.message as string}
                  </div>
                )}
              </div>
            </div>

            <div className="flex mb-[15px] items-center">
              <label className="w-1/4 font-bold text-right pr-[15px]">
                New Password <span className="text-[#c41a1f]">*</span>
              </label>
              <div className="flex-1">
                <input
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: { value: 14, message: "Min 14 chars" },
                  })}
                  type="password"
                  className={`w-3/5 py-[6px] px-2 border ${errors.newPassword ? "border-[#c41a1f]" : "border-[#aaa]"} text-[13px] rounded-sm text-[#333]`}
                />
                {errors.newPassword && (
                  <div className="text-[#c41a1f] mt-1">
                    {errors.newPassword.message as string}
                  </div>
                )}
              </div>
            </div>

            <div className="flex mb-[15px] items-center">
              <label className="w-1/4 font-bold text-right pr-[15px]">
                Confirm Password <span className="text-[#c41a1f]">*</span>
              </label>
              <div className="flex-1">
                <input
                  {...register("confirmPassword", {
                    required: "Confirmation is required",
                  })}
                  type="password"
                  className={`w-3/5 py-[6px] px-2 border ${errors.confirmPassword ? "border-[#c41a1f]" : "border-[#aaa]"} text-[13px] rounded-sm text-[#333]`}
                />
                {errors.confirmPassword && (
                  <div className="text-[#c41a1f] mt-1">
                    {errors.confirmPassword.message as string}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#e5e5e5] border-t border-[#ccc] py-[10px] px-5 flex justify-between">
            <Link href="/login">
              <button
                type="button"
                className="py-1 px-[15px] border border-[#777] bg-[#eee] cursor-pointer text-[12px] text-[#333] hover:bg-[#e0e0e0]"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className={`py-1 px-[25px] border border-[#1b3564] ${isLoading ? "bg-[#aaa] cursor-not-allowed" : "bg-[#1b3564] cursor-pointer"} font-bold text-[12px] text-white hover:opacity-90`}
            >
              {isLoading ? "Saving..." : "Change password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ResetPasswordPage = () => {
  const { data: siteResponse } = useGetSiteSettingsQuery({});

  const siteSettings = (siteResponse?.data ?? {
    siteName: "ImmiAccount",
    brandName: "Australian Government",
    departmentName: "Department of Home Affairs",
  }) as TSiteSettings;

  return (
    <div className="bg-[#ccc] min-h-screen font-sans text-[12px] text-[#333] pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1b3564] to-[#0b6e9d] h-[45px] flex items-center justify-between px-5 text-white">
        <div className="flex items-center gap-[10px]">
          <div className="font-bold text-sm">{siteSettings.brandName}</div>
          <div className="w-px h-5 bg-white/30" />
          <div className="text-[13px]">{siteSettings.departmentName}</div>
        </div>
        <div className="text-base font-light">{siteSettings.siteName}</div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default ResetPasswordPage;
