"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginValues } from "@/schemas/auth.schema";
import { useLoginMutation } from "@/redux/api/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useAlert } from "@/components/ui";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { TSiteSettings } from "@/types/settings";

interface CustomJwtPayload extends JwtPayload {
  role: string;
  userId: string;
}

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showAlert } = useAlert();
  const { data: siteResponse } = useGetSiteSettingsQuery({});

  const siteSettings = (siteResponse?.data ?? {
    siteName: "ImmiAccount",
    brandName: "Australian Government",
    departmentName: "Department of Home Affairs",
  }) as TSiteSettings;

  const onSubmit = async (data: LoginValues) => {
    try {
      const res = await login(data).unwrap();
      const token = res.data.accessToken;
      const decoded = jwtDecode<CustomJwtPayload>(token);

      dispatch(
        setUser({
          user: {
            email: data.email,
            role: decoded.role,
            userId: decoded.userId,
          },
          token: token,
        }),
      );

      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };

      showAlert({
        title: "Login Failed",
        message:
          error?.data?.message ||
          "Login failed. Please check your credentials.",
        type: "error",
      });
    }
  };

  return (
    <div className="bg-[#ccc] min-h-screen font-sans text-[12px] text-[#333] pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1b3564] to-[#0b6e9d] min-h-[45px] py-2 md:py-0 flex flex-col md:flex-row items-center justify-between px-5 text-white gap-2">
        <div className="flex items-center gap-[10px]">
          <div className="font-bold text-sm text-center md:text-left">{siteSettings.brandName}</div>
          <div className="w-px h-5 bg-white/30 hidden sm:block" />
          <div className="text-[13px] hidden sm:block">{siteSettings.departmentName}</div>
        </div>
        <div className="text-base font-light">{siteSettings.siteName}</div>
      </div>

      <div className="max-w-[800px] mx-auto mt-5 px-[15px]">
        <h2 className="text-[#1b3564] text-lg font-normal mb-[15px]">
          Login to {siteSettings.siteName}
        </h2>

        {/* Login Panel */}
        <div className="border border-[#ccc] bg-white">
          <div className="bg-[#1b3564] text-white py-[10px] px-[15px] font-bold text-sm">
            Login
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-5">
              <p className="mb-5">
                Enter your {siteSettings.siteName} username and password to login.
              </p>

              {/* Email / Username Field */}
              <div className="flex flex-col md:flex-row mb-[15px] md:items-center">
                <label
                  id="email"
                  className="md:w-1/5 font-bold md:text-right pr-[15px] mb-1 md:mb-0"
                >
                  Username <span className="text-[#c41a1f]">*</span>
                </label>
                <div className="flex-1">
                  <input
                    {...register("email")}
                    type="email"
                    className={`w-full md:w-3/5 py-[6px] px-2 border ${errors.email ? "border-[#c41a1f]" : "border-[#aaa]"} text-[13px] rounded-sm text-[#333] bg-white`}
                  />
                  {errors.email && (
                    <div className="flex items-center text-[#c41a1f] mt-1">
                      <span className="text-[10px] mr-[5px]">●</span>
                      {errors.email.message as string}
                    </div>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col md:flex-row mb-[15px] md:items-center">
                <label className="md:w-1/5 font-bold md:text-right pr-[15px] mb-1 md:mb-0">
                  Password <span className="text-[#c41a1f]">*</span>
                </label>
                <div className="flex-1">
                  <input
                    {...register("password")}
                    type="password"
                    className={`w-full md:w-3/5 py-[6px] px-2 border ${errors.password ? "border-[#c41a1f]" : "border-[#aaa]"} text-[13px] rounded-sm text-[#333] bg-white`}
                  />
                  {errors.password && (
                    <div className="flex items-center text-[#c41a1f] mt-1">
                      <span className="text-[10px] mr-[5px]">●</span>
                      {errors.password.message as string}
                    </div>
                  )}
                </div>
              </div>

              <p className="md:ml-[20%] text-[11px] text-[#555]">
                <Link
                  href="/forgot-password"
                  className="text-[#1b3564] underline hover:no-underline"
                >
                  Forgotten your username or password?
                </Link>
              </p>
            </div>

            {/* Button Bar */}
            <div className="bg-[#e5e5e5] border-t border-[#ccc] py-[10px] px-5 flex justify-between">
              <button
                type="button"
                className="py-1 px-[15px] border border-[#777] bg-[#eee] cursor-pointer text-[12px] text-[#333] hover:bg-[#e0e0e0]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`py-1 px-[25px] border border-[#1b3564] ${isLoading ? "bg-[#aaa] cursor-not-allowed" : "bg-[#1b3564] cursor-pointer"} font-bold text-[12px] text-white hover:opacity-90`}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>

        {/* Account Creation Section */}
        <div className="border border-[#ccc] bg-white mt-5">
          <div className="bg-[#1b3564] text-white py-[10px] px-[15px] font-bold text-sm">
            Create {siteSettings.siteName}
          </div>
          <div className="p-5">
            <p className="mb-[15px]">
              If you do not have an {siteSettings.siteName}, you will need to create one.
            </p>
            <div className="bg-[#e5e5e5] border-t border-[#ccc] m-[-20px] mt-5 p-[10px] px-5 text-right">
              <Link href="/register">
                <button className="py-1 px-5 border border-[#1b3564] bg-[#1b3564] text-white font-bold cursor-pointer text-[12px] hover:opacity-90">
                  Create {siteSettings.siteName}
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-10 text-center">
          <hr className="border-none border-t border-dotted border-[#777] mb-[15px]" />
          <div className="text-[11px] text-[#555] flex flex-wrap justify-center gap-[10px] px-4">
            <Link
              href="/legal#accessibility"
              className="text-[#1b3564] hover:underline"
            >
              Accessibility
            </Link>
            <span className="hidden sm:inline">|</span>
            <Link
              href="/legal#copyright"
              className="text-[#1b3564] hover:underline"
            >
              Copyright
            </Link>
            <span className="hidden sm:inline">|</span>
            <Link
              href="/legal#disclaimer"
              className="text-[#1b3564] hover:underline"
            >
              Disclaimer
            </Link>
            <span className="hidden sm:inline">|</span>
            <Link
              href="/legal#privacy"
              className="text-[#1b3564] hover:underline"
            >
              Privacy
            </Link>
            <span className="hidden sm:inline">|</span>
            <Link
              href="/legal#security"
              className="text-[#1b3564] hover:underline"
            >
              Security
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
