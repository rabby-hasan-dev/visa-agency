"use client";

import { useForm } from "react-hook-form";
import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAlert } from "@/components/ui";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { TSiteSettings } from "@/types/settings";

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const router = useRouter();
  const { showAlert } = useAlert();
  const { data: siteResponse } = useGetSiteSettingsQuery({});

  const siteSettings = (siteResponse?.data ?? {
    siteName: "ImmiAccount",
    brandName: "Australian Government",
    departmentName: "Department of Home Affairs",
  }) as TSiteSettings;

  const onSubmit = async (data: { email: string }) => {
    try {
      await forgotPassword(data).unwrap();
      showAlert({
        title: "Code Sent",
        message: "A verification code has been sent to your email address.",
        type: "success",
      });
      // Redirect to reset password page with email as query param
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      showAlert({
        title: "Request Failed",
        message: error?.data?.message || "Failed to send verification code.",
        type: "error",
      });
    }
  };

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

      <div className="max-w-[800px] mx-auto mt-5 px-[15px]">
        <h2 className="text-[#1b3564] text-lg font-normal mb-[15px]">
          Forgotten your username or password?
        </h2>

        <div className="border border-[#ccc] bg-white">
          <div className="bg-[#1b3564] text-white py-[10px] px-[15px] font-bold text-sm">
            Identify your account
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-5">
              <p className="mb-5">
                To reset your password, please enter your email address. We will
                send you a verification code.
              </p>

              <div className="flex mb-[15px] items-center">
                <label className="w-1/5 font-bold text-right pr-[15px]">
                  Email address <span className="text-[#c41a1f]">*</span>
                </label>
                <div className="flex-1">
                  <input
                    {...register("email", { required: "Email is required" })}
                    type="email"
                    className={`w-3/5 py-[6px] px-2 border ${errors.email ? "border-[#c41a1f]" : "border-[#aaa]"} text-[13px] rounded-sm text-[#333] bg-white`}
                  />
                  {errors.email && (
                    <div className="text-[#c41a1f] mt-1">
                      {errors.email.message}
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
                {isLoading ? "Sending..." : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
