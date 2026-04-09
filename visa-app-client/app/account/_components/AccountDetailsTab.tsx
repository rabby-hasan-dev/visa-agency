import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import * as schemas from "@/schemas/profile.schema";
import { InputRow } from "./InputRow";

import { TUser } from "@/types/user";

interface AccountDetailsTabProps {
  user: TUser;
  accountForm: UseFormReturn<schemas.AccountDetailsValues>;
  onSubmit: (data: schemas.AccountDetailsValues) => Promise<void>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string | null;
  isUploadingImage: boolean;
  isUpdatingProfile: boolean;
}

export const AccountDetailsTab = ({
  user,
  accountForm,
  onSubmit,
  handleImageUpload,
  imagePreview,
  isUploadingImage,
  isUpdatingProfile,
}: AccountDetailsTabProps) => {
  return (
    <form
      onSubmit={accountForm.handleSubmit(onSubmit)}
      className="bg-white border border-gray-300 shadow-sm min-h-[500px] flex flex-col"
    >
      <div className="bg-[#1b3564] text-white font-bold text-[13px] px-3 py-1.5">
        Update account details
      </div>
      <div className="p-5 flex-1">
        <p className="mb-4 text-[13px] text-black">
          To update your account details enter your given names, family name
          and/or email address and select &apos;Save&apos; to apply your
          changes.
        </p>
        <p className="mb-6 text-[13px] text-black">
          Fields marked <span className="text-[#c41a1f]">*</span> must be
          completed.
        </p>

        <div className="space-y-1 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center mb-6">
            <div className="w-full sm:w-[180px] text-[13px] text-gray-800 font-sans mb-1.5 sm:mb-0">
              Username
            </div>
            <div className="font-bold">
              {user?.email || "ghave763@gmail.com"}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start mb-6">
            <div className="w-full sm:w-[180px] text-[13px] text-gray-800 font-sans mb-2 sm:mb-0">
              Profile Image
            </div>
            <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {imagePreview || user?.profileImg ? (
                <Image
                  src={
                    imagePreview ||
                    (user?.profileImg?.startsWith("http")
                      ? user.profileImg
                      : `${process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000"}${user?.profileImg}`)
                  }
                  alt="Avatar"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover border border-gray-300 shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#1b3564] flex items-center justify-center text-white text-xl font-bold shadow-sm">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <label className="cursor-pointer bg-[#eeeeee] border border-gray-400 px-4 py-1.5 text-[12px] text-black hover:bg-gray-200 transition-colors shadow-sm font-medium w-fit">
                {isUploadingImage ? "Uploading..." : "Upload Image"}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                />
              </label>
            </div>
          </div>

          <InputRow
            label="Title"
            type="select"
            registerProps={accountForm.register("title")}
            error={accountForm.formState.errors.title?.message}
          />
          <InputRow
            label="Given names"
            isRequired
            registerProps={accountForm.register("givenName")}
            error={accountForm.formState.errors.givenName?.message}
          />
          <InputRow
            label="Family name"
            isRequired
            registerProps={accountForm.register("familyName")}
            error={accountForm.formState.errors.familyName?.message}
          />
          <InputRow
            label="Phone"
            isRequired
            registerProps={accountForm.register("phone")}
            error={accountForm.formState.errors.phone?.message}
          />
          <InputRow
            label="Mobile phone"
            registerProps={accountForm.register("mobilePhone")}
            error={accountForm.formState.errors.mobilePhone?.message}
          />

          {user?.role === "agent" && (
            <>
              <InputRow
                label="Organisation"
                isRequired
                registerProps={accountForm.register("companyName")}
                error={accountForm.formState.errors.companyName?.message}
              />
              <InputRow
                label="MARN"
                registerProps={accountForm.register("marn")}
                error={accountForm.formState.errors.marn?.message}
              />
              <InputRow
                label="License Number"
                isRequired
                registerProps={accountForm.register("licenseNumber")}
                error={accountForm.formState.errors.licenseNumber?.message}
              />
            </>
          )}
        </div>

        <div className="font-bold text-[13px] mb-1">Address details</div>
        <div className="space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-start mb-4 sm:mb-1">
            <label className="w-full sm:w-[180px] text-[13px] text-gray-800 font-sans mb-1.5 sm:mb-0">
              {user?.role === "agent" ? "Business address" : "Street address"}
            </label>
            <div className="flex-1 w-full sm:w-auto">
              <input
                type="text"
                {...accountForm.register("address")}
                className={`border ${accountForm.formState.errors.address ? "border-[#c41a1f]" : "border-gray-400"} px-2 py-1 w-full sm:w-[350px] text-[13px] focus:outline-none`}
              />
            </div>
          </div>
          <InputRow
            label="Suburb/Town"
            isRequired
            registerProps={accountForm.register("city")}
            error={accountForm.formState.errors.city?.message}
          />

          <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-1">
            <label className="w-full sm:w-[180px] text-[13px] text-gray-800 font-sans mb-1.5 sm:mb-0">
              Country
            </label>
            <div className="flex-1 w-full sm:w-auto">
              <select
                {...accountForm.register("country")}
                className={`border ${accountForm.formState.errors.country ? "border-[#c41a1f]" : "border-gray-400"} px-1 py-1 text-[13px] focus:outline-none w-full sm:w-[280px]`}
              >
                <option value=""></option>
                <option value="Australia">Australia</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Bangladesh">Bangladesh</option>
              </select>
            </div>
          </div>

          <InputRow
            label="State"
            isRequired
            registerProps={accountForm.register("state")}
            error={accountForm.formState.errors.state?.message}
          />
          <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-1">
            <label className="w-full sm:w-[180px] text-[13px] text-gray-800 font-sans mb-1.5 sm:mb-0">
              Postcode/Zip
            </label>
            <div className="flex-1 w-full sm:w-auto">
              <input
                type="text"
                {...accountForm.register("zip")}
                className={`border ${accountForm.formState.errors.zip ? "border-[#c41a1f]" : "border-gray-400"} px-2 py-1 w-full sm:w-[120px] text-[13px] focus:outline-none block`}
              />
            </div>
          </div>
        </div>
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
          disabled={isUpdatingProfile}
          className="bg-[#eeeeee] border border-gray-400 px-6 py-1 text-[12px] text-black hover:bg-gray-200 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdatingProfile ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};
