import { UseFormReturn } from "react-hook-form";
import * as schemas from "@/schemas/profile.schema";
import { InputRow } from "./InputRow";
import { useState } from "react";

interface PasswordTabProps {
  passwordForm: UseFormReturn<schemas.PasswordUpdateValues>;
  onSubmit: (data: schemas.PasswordUpdateValues) => Promise<void>;
}

export const PasswordTab = ({ passwordForm, onSubmit }: PasswordTabProps) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form
      onSubmit={passwordForm.handleSubmit(onSubmit)}
      className="bg-white border border-gray-300 shadow-sm min-h-[500px] flex flex-col"
    >
      <div className="bg-[#1b3564] text-white font-bold text-[13px] px-3 py-1.5">
        Change Password
      </div>
      <div className="p-5 flex-1">
        <p className="mb-3 text-[13px] text-black">
          Enter the following details to update your password and select
          &apos;Save&apos; to apply your changes:
        </p>
        <p className="mb-6 text-[13px] text-black">
          Fields marked <span className="text-[#c41a1f]">*</span> must be
          completed.
        </p>

        <div className="mb-6">
          <InputRow
            label="Current password"
            isRequired
            type="password"
            registerProps={passwordForm.register("oldPassword")}
            error={passwordForm.formState.errors.oldPassword?.message}
            onTogglePassword={() => setShowOldPassword(!showOldPassword)}
            showPassword={showOldPassword}
          />
          <InputRow
            label="New password"
            isRequired
            type="password"
            registerProps={passwordForm.register("newPassword")}
            error={passwordForm.formState.errors.newPassword?.message}
            onTogglePassword={() => setShowNewPassword(!showNewPassword)}
            showPassword={showNewPassword}
          />
          <InputRow
            label="Confirm new password"
            isRequired
            type="password"
            registerProps={passwordForm.register("confirmPassword")}
            error={passwordForm.formState.errors.confirmPassword?.message}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            showPassword={showConfirmPassword}
          />
        </div>
        <p className="mb-4 text-[13px] text-black">
          Password must be a minimum of fourteen (14) characters{" "}
          <strong>and</strong> include at least one (1) character from three (3)
          of the four (4) groups below:
        </p>
        <ul className="list-disc pl-8 mb-4 text-[13px]">
          <li>lower-case characters (a-z)</li>
          <li>upper-case characters (A-Z)</li>
          <li>digits (0-9)</li>
          <li>
            punctuation and special characters {"(-`!@#$%^&*()_+=-\\{}\\.,?/)"}
          </li>
        </ul>
        <p className="mb-6 text-[13px] font-bold">
          Note:{" "}
          <span className="font-normal">
            You cannot reuse any of your eight (8) previous passwords.
          </span>
        </p>
      </div>

      <div className="bg-[#e5e5e5] px-4 py-3 border-t border-gray-300 flex justify-between mt-auto">
        <button
          type="button"
          className="bg-[#eeeeee] border border-gray-400 px-4 py-1 text-[12px] text-black hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-[#eeeeee] border border-gray-400 px-6 py-1 text-[12px] text-black hover:bg-gray-200 transition-colors shadow-sm"
        >
          Save
        </button>
      </div>
    </form>
  );
};
