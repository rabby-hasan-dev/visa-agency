import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import * as schemas from "@/schemas/profile.schema";
import { TUser } from "@/types/user";
import { User, Phone, Building2, MapPin, Camera, Loader2 } from "lucide-react";

interface AccountDetailsTabProps {
  user: TUser;
  accountForm: UseFormReturn<schemas.AccountDetailsValues>;
  onSubmit: (data: schemas.AccountDetailsValues) => Promise<void>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string | null;
  isUploadingImage: boolean;
  isUpdatingProfile: boolean;
}

const Field = ({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-blue-500">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-rose-500">{error}</p>}
  </div>
);

const inputCls = (hasError?: string) =>
  `w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
    hasError ? "border-rose-400 bg-rose-50" : "border-gray-200 focus:border-blue-400 bg-white"
  }`;

export const AccountDetailsTab = ({
  user,
  accountForm,
  onSubmit,
  handleImageUpload,
  imagePreview,
  isUploadingImage,
  isUpdatingProfile,
}: AccountDetailsTabProps) => {
  const { register, handleSubmit, formState: { errors } } = accountForm;
  const profileSrc = imagePreview || (
    user?.profileImg
      ? (user.profileImg.startsWith("http") ? user.profileImg : `${process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000"}${user.profileImg}`)
      : null
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
      {/* Personal Info */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <User size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-800">Personal Details</h2>
        </div>
        <div className="px-5 py-5 space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            {profileSrc ? (
              <Image src={profileSrc} alt="Avatar" width={56} height={56}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-200" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold ring-2 ring-blue-200">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 mb-1.5">Profile Photo</p>
              <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 w-fit">
                {isUploadingImage ? <Loader2 size={13} className="animate-spin" /> : <Camera size={13} />}
                {isUploadingImage ? "Uploading..." : "Change Photo"}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploadingImage} />
              </label>
            </div>
          </div>

          {/* Username (read-only) */}
          <div>
            <p className="text-xs text-gray-400 mb-1">Username</p>
            <p className="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
              {user?.email || "—"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Title">
              <select {...register("title")} className={inputCls(errors.title?.message)}>
                <option value="">— Select —</option>
                {["Mr", "Mrs", "Ms", "Miss", "Dr"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Given Name" required error={errors.givenName?.message}>
              <input {...register("givenName")} placeholder="First name" className={inputCls(errors.givenName?.message)} />
            </Field>
            <Field label="Family Name" required error={errors.familyName?.message}>
              <input {...register("familyName")} placeholder="Last name" className={inputCls(errors.familyName?.message)} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Phone" required error={errors.phone?.message}>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input {...register("phone")} placeholder="+880..." className={`pl-8 ${inputCls(errors.phone?.message)}`} />
              </div>
            </Field>
            <Field label="Mobile Phone" error={errors.mobilePhone?.message}>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input {...register("mobilePhone")} placeholder="Optional" className={`pl-8 ${inputCls(errors.mobilePhone?.message)}`} />
              </div>
            </Field>
          </div>

          {/* Agent-only fields */}
          {user?.role === "agent" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-gray-100">
              <Field label="Organisation" required error={errors.companyName?.message}>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input {...register("companyName")} placeholder="Company name" className={`pl-8 ${inputCls(errors.companyName?.message)}`} />
                </div>
              </Field>
              <Field label="License Number" required error={errors.licenseNumber?.message}>
                <input {...register("licenseNumber")} placeholder="Agent license" className={inputCls(errors.licenseNumber?.message)} />
              </Field>
              <Field label="MARN" error={errors.marn?.message}>
                <input {...register("marn")} placeholder="Optional" className={inputCls(errors.marn?.message)} />
              </Field>
            </div>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <MapPin size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-800">Address Details</h2>
        </div>
        <div className="px-5 py-5 space-y-4">
          <Field label={user?.role === "agent" ? "Business Address" : "Street Address"} error={errors.address?.message}>
            <input {...register("address")} placeholder="Street address" className={inputCls(errors.address?.message)} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="City / Town" required error={errors.city?.message}>
              <input {...register("city")} placeholder="City" className={inputCls(errors.city?.message)} />
            </Field>
            <Field label="State / Province" required error={errors.state?.message}>
              <input {...register("state")} placeholder="State" className={inputCls(errors.state?.message)} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Postcode / Zip" error={errors.zip?.message}>
              <input {...register("zip")} placeholder="Postcode" className={inputCls(errors.zip?.message)} />
            </Field>
            <Field label="Country" error={errors.country?.message}>
              <select {...register("country")} className={inputCls(errors.country?.message)}>
                <option value="">— Select country —</option>
                {["Australia", "Bangladesh", "United Kingdom", "United States", "Canada", "India"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => accountForm.reset()} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isUpdatingProfile}
          className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isUpdatingProfile && <Loader2 size={14} className="animate-spin" />}
          {isUpdatingProfile ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};
