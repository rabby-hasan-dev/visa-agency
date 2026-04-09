"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterValues } from "@/schemas/auth.schema";
import { useRegisterMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAlert } from "@/components/ui";
import Link from "next/link";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { TSiteSettings } from "@/types/settings";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });
  const [registerAgent, { isLoading }] = useRegisterMutation();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { showAlert } = useAlert();
  const { data: siteResponse } = useGetSiteSettingsQuery({});

  const siteSettings = (siteResponse?.data ?? {
    siteName: "ImmiAccount",
    brandName: "Australian Government",
    departmentName: "Department of Home Affairs",
  }) as TSiteSettings;

  const onSubmit = async (data: RegisterValues) => {
    // Combine givenNames and familyName into name for backend compatibility if needed
    const secretQuestions = [
      { question: data.q1, answer: data.a1 },
      { question: data.q2, answer: data.a2 },
      { question: data.q3, answer: data.a3 },
    ].filter((q) => q.question && q.answer);

    const submissionData = {
      ...data,
      name: `${data.givenNames} ${data.familyName}`.trim(),
      secretQuestions,
    };

    try {
      await registerAgent(submissionData).unwrap();

      showAlert({
        title: "Registration Successful",
        message: "Your agent account has been created. You can now log in.",
        type: "success",
      });

      router.push("/login");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };

      showAlert({
        title: "Registration Failed",
        message:
          error?.data?.message || "Registration failed. Please try again.",
        type: "error",
      });
    }
  };

  const validateStep = async () => {
    let fields: (keyof RegisterValues)[] = [];
    if (step === 1) {
      fields = ["givenNames", "familyName", "dateOfBirth", "phone"];
    } else if (step === 2) {
      fields = [
        "companyName",
        "streetAddress",
        "city",
        "stateProvince",
        "zipPostalCode",
        "country",
        "licenseNumber",
      ];
    }

    if (fields.length > 0) {
      const isValid = await trigger(fields);
      return isValid;
    }
    return true;
  };

  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="bg-[#f4f4f4] min-h-screen font-sans text-[13px] text-[#333] pb-10">
      {/* Header */}
      <div className="bg-[#1b3564] min-h-[60px] py-2 md:py-0 flex flex-col md:flex-row items-center justify-between px-5 text-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] gap-2">
        <div className="flex items-center gap-[10px]">
          <div className="font-bold text-base text-center md:text-left">{siteSettings.brandName}</div>
          <div className="w-px h-[25px] bg-white/30 hidden sm:block" />
          <div className="text-sm hidden sm:block">{siteSettings.departmentName}</div>
        </div>
        <div className="text-xl font-light">{siteSettings.siteName}</div>
      </div>

      <div className="max-w-[850px] mx-auto mt-[30px] px-[15px]">
        <h2 className="text-[#1b3564] text-2xl font-normal mb-5">
          Create {siteSettings.siteName} - Agent Registration
        </h2>

        {/* Progress Indicator */}
        <div className="flex mb-[25px] gap-[10px]">
          <div
            className={`flex-1 h-1 ${step >= 1 ? "bg-[#d35400]" : "bg-[#ccc]"}`}
          />
          <div
            className={`flex-1 h-1 ${step >= 2 ? "bg-[#d35400]" : "bg-[#ccc]"}`}
          />
          <div
            className={`flex-1 h-1 ${step >= 3 ? "bg-[#d35400]" : "bg-[#ccc]"}`}
          />
        </div>

        {/* Register Panel */}
        <div className="border border-[#ccc] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="bg-[#1b3564] text-white py-3 px-5 font-bold text-[15px]">
            {step === 1 && "Step 1: Personal Details"}
            {step === 2 && "Step 2: Organisation Details"}
            {step === 3 && "Step 3: Account Security & Secret Questions"}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-[25px] px-[30px]">
              {step === 1 && (
                <div className="flex flex-col gap-[15px]">
                  <p className="mb-5 text-[#555]">
                    Fields marked <span className="text-[#c41a1f]">*</span> must
                    be completed.
                  </p>

                  {/* Title */}
                  <div className="flex flex-col sm:flex-row sm:items-center mb-[15px] gap-2 md:gap-0">
                    <label className="sm:w-[200px] font-semibold">Title</label>
                    <select
                      {...register("title")}
                      className="w-full sm:w-[300px] p-2 border border-[#aaa] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#1b3564]"
                    >
                      <option value=""></option>
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Ms">Ms</option>
                      <option value="Miss">Miss</option>
                      <option value="Dr">Dr</option>
                    </select>
                  </div>

                  {/* Given Names */}
                  <div className="flex flex-col sm:flex-row mb-[15px] sm:items-center gap-2 md:gap-0">
                    <label className="sm:w-[200px] font-semibold">
                      Given names <span className="text-[#c41a1f]">*</span>
                    </label>
                    <div className="flex-1">
                      <input
                        {...register("givenNames")}
                        type="text"
                        className={`w-full sm:w-[300px] p-2 border ${errors.givenNames ? "border-[#c41a1f]" : "border-[#aaa]"} rounded-sm focus:outline-none focus:ring-1 focus:ring-[#1b3564]`}
                      />
                      {errors.givenNames && (
                        <div className="text-[#c41a1f] text-[11px] mt-1">
                          {errors.givenNames.message as string}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Family Name */}
                  <div className="flex flex-col sm:flex-row mb-[15px] sm:items-center gap-2 md:gap-0">
                    <label className="sm:w-[200px] font-semibold">
                      Family name <span className="text-[#c41a1f]">*</span>
                    </label>
                    <div className="flex-1">
                      <input
                        {...register("familyName")}
                        type="text"
                        className={`w-full sm:w-[300px] p-2 border ${errors.familyName ? "border-[#c41a1f]" : "border-[#aaa]"} rounded-sm focus:outline-none focus:ring-1 focus:ring-[#1b3564]`}
                      />
                      {errors.familyName && (
                        <div className="text-[#c41a1f] text-[11px] mt-1">
                          {errors.familyName.message as string}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="flex flex-col sm:flex-row mb-[15px] sm:items-center gap-2 md:gap-0">
                    <label className="sm:w-[200px] font-semibold">
                      Date of birth <span className="text-[#c41a1f]">*</span>
                    </label>
                    <div className="flex-1">
                      <input
                        {...register("dateOfBirth")}
                        type="date"
                        className={`w-full sm:w-[300px] p-2 border ${errors.dateOfBirth ? "border-[#c41a1f]" : "border-[#aaa]"} rounded-sm focus:outline-none focus:ring-1 focus:ring-[#1b3564]`}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col sm:flex-row mb-[15px] sm:items-center gap-2 md:gap-0">
                    <label className="sm:w-[200px] font-semibold">
                      Phone <span className="text-[#c41a1f]">*</span>
                    </label>
                    <div className="flex-1">
                      <input
                        {...register("phone")}
                        type="text"
                        className={`w-full sm:w-[300px] p-2 border ${errors.phone ? "border-[#c41a1f]" : "border-[#aaa]"} rounded-sm focus:outline-none focus:ring-1 focus:ring-[#1b3564]`}
                      />
                    </div>
                  </div>

                  {/* Mobile Phone */}
                  <div className="flex flex-col sm:flex-row mb-[15px] sm:items-center gap-2 md:gap-0">
                    <label className="sm:w-[200px] font-semibold">
                      Mobile phone
                    </label>
                    <div className="flex-1">
                      <input
                        {...register("mobilePhone")}
                        type="text"
                        className="w-full sm:w-[300px] p-2 border border-[#aaa] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#1b3564]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-[15px]">
                  <p className="mb-5 text-[#555]">
                    Provide your organisation details.
                  </p>

                  {/* Organisation */}
                  <div className="flex mb-[15px] items-center">
                    <label className="w-[200px] font-semibold">
                      Organisation <span className="text-[#c41a1f]">*</span>
                    </label>
                    <div className="flex-1">
                      <input
                        {...register("companyName")}
                        type="text"
                        className={`w-[300px] p-2 border ${errors.companyName ? "border-[#c41a1f]" : "border-[#aaa]"} rounded-sm focus:outline-none focus:ring-1 focus:ring-[#1b3564]`}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex flex-col sm:flex-row mb-[15px] items-start gap-2 sm:gap-0">
                    <label className="sm:w-[200px] font-semibold sm:mt-2">
                      Address <span className="text-[#c41a1f]">*</span>
                    </label>
                    <div className="flex-1 w-full flex flex-col gap-[10px]">
                      <input
                        {...register("streetAddress")}
                        placeholder="Street Address"
                        className={`w-full sm:w-[350px] p-2 border ${errors.streetAddress ? "border-[#c41a1f]" : "border-[#aaa]"} rounded-sm focus:outline-none focus:ring-1 focus:ring-[#1b3564]`}
                      />
                      <div className="flex flex-col sm:flex-row gap-[10px]">
                        <input
                          {...register("city")}
                          placeholder="Suburb/Town"
                          className={`w-full sm:w-[170px] p-2 border ${errors.city ? "border-[#c41a1f]" : "border-[#aaa]"} rounded-sm focus:outline-none focus:ring-1 focus:ring-[#1b3564]`}
                        />
                        <input
                          {...register("stateProvince")}
                          placeholder="State"
                          className={`w-full sm:w-[170px] p-2 border ${errors.stateProvince ? "border-[#c41a1f]" : "border-[#aaa]"} rounded-sm focus:outline-none focus:ring-1 focus:ring-[#1b3564]`}
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-[10px]">
                        <input
                          {...register("zipPostalCode")}
                          placeholder="Postcode/Zip"
                          className={`w-full sm:w-[170px] p-2 border ${errors.zipPostalCode ? "border-[#c41a1f]" : "border-[#aaa]"} rounded-sm focus:outline-none focus:ring-1 focus:ring-[#1b3564]`}
                        />
                        <input
                          {...register("country")}
                          placeholder="Country"
                          className={`w-full sm:w-[170px] p-2 border ${errors.country ? "border-[#c41a1f]" : "border-[#aaa]"} rounded-sm focus:outline-none focus:ring-1 focus:ring-[#1b3564]`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* License Number */}
                  <div className="flex mb-[15px] items-center">
                    <label className="w-[200px] font-semibold">
                      License Number <span className="text-[#c41a1f]">*</span>
                    </label>
                    <div className="flex-1">
                      <input
                        {...register("licenseNumber")}
                        type="text"
                        className={`w-[300px] p-2 border ${errors.licenseNumber ? "border-[#c41a1f]" : "border-[#aaa]"} rounded-sm focus:outline-none focus:ring-1 focus:ring-[#1b3564]`}
                        placeholder="Agent License Number"
                      />
                    </div>
                  </div>

                  {/* MARN */}
                  <div className="flex mb-[15px] items-center">
                    <label className="w-[200px] font-semibold">MARN</label>
                    <div className="flex-1">
                      <input
                        {...register("marn")}
                        type="text"
                        className="w-[300px] p-2 border border-[#aaa] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#1b3564]"
                        placeholder="Registration Number (Optional)"
                      />
                    </div>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="flex flex-col gap-[15px]">
                  <p className="mb-5 text-[#555]">
                    Provide account security and secret questions.
                  </p>

                  {/* Email */}
                  <div className="flex mb-[15px] items-center">
                    <label className="w-[200px] font-semibold">
                      Email address <span className="text-[#c41a1f]">*</span>
                    </label>
                    <div className="flex-1">
                      <input
                        {...register("email")}
                        type="email"
                        className={`w-[300px] p-2 border ${errors.email ? "border-[#c41a1f]" : "border-[#aaa]"} rounded-sm focus:outline-none focus:ring-1 focus:ring-[#1b3564]`}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex mb-[15px] items-center">
                    <label className="w-[200px] font-semibold">
                      Password <span className="text-[#c41a1f]">*</span>
                    </label>
                    <div className="flex-1">
                      <input
                        {...register("password")}
                        type="password"
                        className={`w-[300px] p-2 border ${errors.password ? "border-[#c41a1f]" : "border-[#aaa]"} rounded-sm focus:outline-none focus:ring-1 focus:ring-[#1b3564]`}
                      />
                    </div>
                  </div>

                  {/* Secret Questions */}
                  <div className="mt-[10px] border-t border-[#eee] pt-5">
                    <p className="font-bold mb-[15px]">Secret Questions</p>

                    {/* Q1 */}
                    <div className="mb-5">
                      <div className="flex mb-2 items-center">
                        <label className="w-[200px] font-semibold">
                          Question 1 *
                        </label>
                        <select
                          {...register("q1")}
                          className={`w-[300px] p-2 border ${errors.q1 ? "border-[#c41a1f]" : "border-[#aaa]"} focus:outline-none focus:ring-1 focus:ring-[#1b3564]`}
                        >
                          <option value="What is your favourite movie?">
                            What is your favourite movie?
                          </option>
                          <option value="What was your first pet's name?">
                            What was your first pet&apos;s name?
                          </option>
                          <option value="In what city were you born?">
                            In what city were you born?
                          </option>
                        </select>
                      </div>
                      <div className="flex items-center">
                        <label className="w-[200px] font-semibold">
                          Answer 1 *
                        </label>
                        <input
                          {...register("a1")}
                          type="text"
                          className={`w-[300px] p-2 border ${errors.a1 ? "border-[#c41a1f]" : "border-[#aaa]"} focus:outline-none focus:ring-1 focus:ring-[#1b3564]`}
                        />
                      </div>
                    </div>

                    {/* Q2 */}
                    <div className="mb-5">
                      <div className="flex mb-2 items-center">
                        <label className="w-[200px] font-semibold">
                          Question 2 *
                        </label>
                        <select
                          {...register("q2")}
                          className={`w-[300px] p-2 border ${errors.q2 ? "border-[#c41a1f]" : "border-[#aaa]"} focus:outline-none focus:ring-1 focus:ring-[#1b3564]`}
                        >
                          <option value="What is the name of your favourite teacher?">
                            What is the name of your favourite teacher?
                          </option>
                          <option value="What is your mother's maiden name?">
                            What is your mother&apos;s maiden name?
                          </option>
                        </select>
                      </div>
                      <div className="flex items-center">
                        <label className="w-[200px] font-semibold">
                          Answer 2 *
                        </label>
                        <input
                          {...register("a2")}
                          type="text"
                          className={`w-[300px] p-2 border ${errors.a2 ? "border-[#c41a1f]" : "border-[#aaa]"} focus:outline-none focus:ring-1 focus:ring-[#1b3564]`}
                        />
                      </div>
                    </div>

                    {/* Q3 */}
                    <div className="mb-5">
                      <div className="flex mb-2 items-center">
                        <label className="w-[200px] font-semibold">
                          Question 3 *
                        </label>
                        <select
                          {...register("q3")}
                          className={`w-[300px] p-2 border ${errors.q3 ? "border-[#c41a1f]" : "border-[#aaa]"} focus:outline-none focus:ring-1 focus:ring-[#1b3564]`}
                        >
                          <option value="Name your favourite holiday destination.">
                            Name your favourite holiday destination.
                          </option>
                          <option value="What is your favourite food?">
                            What is your favourite food?
                          </option>
                        </select>
                      </div>
                      <div className="flex items-center">
                        <label className="w-[200px] font-semibold">
                          Answer 3 *
                        </label>
                        <input
                          {...register("a3")}
                          type="text"
                          className={`w-[300px] p-2 border ${errors.a3 ? "border-[#c41a1f]" : "border-[#aaa]"} focus:outline-none focus:ring-1 focus:ring-[#1b3564]`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Button Bar */}
            <div className="bg-[#e5e5e5] border-t border-[#ccc] p-[15px] px-[30px] flex justify-between">
              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="py-[6px] px-5 border border-[#777] bg-[#eee] cursor-pointer text-[13px] hover:bg-[#e0e0e0]"
                >
                  Cancel
                </button>
              ) : (
                <button
                  type="button"
                  onClick={prevStep}
                  className="py-[6px] px-5 border border-[#777] bg-[#eee] cursor-pointer text-[13px] hover:bg-[#e0e0e0]"
                >
                  Previous
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="py-[6px] px-[25px] border border-[#1b3564] bg-[#1b3564] text-white font-bold cursor-pointer text-[13px] hover:opacity-90"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`py-[6px] px-[30px] border border-[#1b3564] ${isLoading ? "bg-[#aaa] cursor-not-allowed" : "bg-[#1b3564] cursor-pointer"} text-white font-bold text-[13px] hover:opacity-90`}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer Section */}
        <div className="mt-10 text-center">
          <hr className="border-none border-t border-dotted border-[#777] mb-[15px]" />
          <div className="text-[11px] text-[#555] flex justify-center gap-[10px]">
            <Link
              href="/legal#accessibility"
              className="text-[#1b3564] hover:underline"
            >
              Accessibility
            </Link>
            <span>|</span>
            <Link
              href="/legal#copyright"
              className="text-[#1b3564] hover:underline"
            >
              Copyright
            </Link>
            <span>|</span>
            <Link
              href="/legal#disclaimer"
              className="text-[#1b3564] hover:underline"
            >
              Disclaimer
            </Link>
            <span>|</span>
            <Link
              href="/legal#privacy"
              className="text-[#1b3564] hover:underline"
            >
              Privacy
            </Link>
            <span>|</span>
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

export default RegisterPage;
