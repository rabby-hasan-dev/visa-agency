import { UseFormReturn } from "react-hook-form";
import * as schemas from "@/schemas/profile.schema";
import { InputRow } from "./InputRow";

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
    <form
      onSubmit={emailForm.handleSubmit(onSubmit)}
      className="bg-white border border-gray-300 shadow-sm min-h-[500px] flex flex-col"
    >
      <div className="bg-[#1b3564] text-white font-bold text-[13px] px-3 py-1.5">
        Update Email Address
      </div>
      <div className="p-5 flex-1">
        <h2 className="text-[#1b3564] text-[20px] font-normal mb-3 mt-0">
          Update email address for account notifications
        </h2>
        {!isEmailVerifying ? (
          <>
            <p className="mb-4 text-[13px] text-black">
              This email address is used for notifications about your account,
              such as password resets. To change the email address used to
              communicate about a visa or citizenship application, select
              &apos;Update us&apos; on the application details page.
            </p>

            <div className="flex flex-col sm:flex-row mb-8 mt-2">
              <div className="w-full sm:w-[250px] text-[13px] font-bold mb-1 sm:mb-0">
                Current email address
              </div>
              <div className="text-[13px]">
                {user?.email || "ghave763@gmail.com"}
              </div>
            </div>

            <p className="mb-6 text-[13px] text-black">
              Enter the new email address to be used for account notifications -
              such as password resets.
            </p>

            <p className="mb-2 text-[13px] text-black">
              Fields marked <span className="text-[#c41a1f]">*</span> must be
              completed.
            </p>

            <InputRow
              label="New email address"
              isRequired
              type="email"
              registerProps={emailForm.register("email")}
              error={emailForm.formState.errors.email?.message}
            />

            <p className="mt-8 mb-4 text-[13px] text-black">
              A verification code will be emailed to this new address.
            </p>
            <p className="text-[13px] text-black">
              Select &apos;Send verification code&apos; and enter the
              verification code on the next screen.
            </p>
          </>
        ) : (
          <>
            <p className="mb-4 text-[13px] text-black font-bold">
              A verification code has been sent to:{" "}
              <span className="text-[#1b3564]">{pendingEmail}</span>
            </p>
            <p className="mb-8 text-[13px] text-black">
              Please enter the 6-digit verification code below to confirm your
              new email address.
            </p>

            <div className="flex flex-col mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="w-full sm:w-[180px] text-[13px] text-gray-800 font-sans mb-1.5 sm:mb-0">
                  Verification code <span className="text-[#c41a1f]">*</span>
                </label>
                <div className="flex-1 flex items-center w-full sm:w-auto">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    placeholder="000000"
                    className="border border-gray-400 px-2 py-1 w-full sm:w-[280px] text-[13px] rounded-none focus:outline-none tracking-[1em] text-center font-bold"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEmailVerifying(false)}
              className="text-[#1b3564] underline text-[12px]"
            >
              Entered wrong email? Change it.
            </button>
          </>
        )}
      </div>

      <div className="bg-[#e5e5e5] px-4 py-3 border-t border-gray-300 flex justify-between mt-auto">
        <button
          type="button"
          onClick={() =>
            isEmailVerifying
              ? setIsEmailVerifying(false)
              : setActiveTab("Summary")
          }
          className="bg-[#eeeeee] border border-gray-400 px-4 py-1 text-[12px] text-black hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={
            isEmailVerifying
              ? onVerifyEmail
              : emailForm.handleSubmit(onSubmit)
          }
          className="bg-[#eeeeee] border border-gray-400 px-4 py-1 text-[12px] text-black hover:bg-gray-200 transition-colors shadow-sm"
        >
          {isEmailVerifying ? "Verify and save" : "Send verification code"}
        </button>
      </div>
    </form>
  );
};
