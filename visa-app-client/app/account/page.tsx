"use client";

import NextLink from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as schemas from "@/schemas/profile.schema";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import {
  useChangePasswordMutation,
  useRequestEmailChangeMutation,
  useVerifyEmailChangeMutation,
} from "@/redux/api/authApi";
import { useGetMeQuery, useUpdateMyProfileMutation } from "@/redux/api/userApi";
import { useUploadDocumentMutation } from "@/redux/api/documentApi";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { TSiteSettings } from "@/types/settings";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAlert } from "@/components/ui";
import {
  useCreateAccessRequestMutation,
  useGetMyAccessRequestsQuery,
  useDeleteAccessRequestMutation,
} from "@/redux/api/accessRequestApi";

// Sub-components
import { SummaryTab } from "./_components/SummaryTab";
import { AccountDetailsTab } from "./_components/AccountDetailsTab";
import { EmailAddressTab } from "./_components/EmailAddressTab";
import { PasswordTab } from "./_components/PasswordTab";
import { SecretQuestionsTab } from "./_components/SecretQuestionsTab";
import { AlertPreferencesTab } from "./_components/AlertPreferencesTab";
import { RequestAccessTab } from "./_components/RequestAccessTab";

// Define the tabs
const TABS = [
  "Summary",
  "Account details",
  "Email address",
  "Password",
  "Secret questions",
  "Alert preferences",
  "Request access",
];

export default function ManageAccountPage() {
  const [activeTab, setActiveTab] = useState("Summary");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showAlert } = useAlert();

  const { data: siteResponse } = useGetSiteSettingsQuery({});

  const siteSettings = (siteResponse?.data ?? {
    siteName: "ImmiAccount",
    brandName: "Australian Government",
    departmentName: "Department of Home Affairs",
  }) as TSiteSettings;

  const { data: profileResponse, isLoading: isProfileLoading } = useGetMeQuery(
    {},
  );
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateMyProfileMutation();
  const [changePassword] = useChangePasswordMutation();
  const [requestEmailChange] = useRequestEmailChangeMutation();
  const [verifyEmailChange] = useVerifyEmailChangeMutation();
  const [, { isLoading: isUploadingImage }] = useUploadDocumentMutation();
  const [isEmailVerifying, setIsEmailVerifying] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const user = profileResponse?.data?.user;
  const profile = profileResponse?.data?.profile;

  const { data: myRequestsResponse } = useGetMyAccessRequestsQuery({});
  const [createAccessRequest, { isLoading: isCreatingRequest }] =
    useCreateAccessRequestMutation();
  const [deleteAccessRequest] = useDeleteAccessRequestMutation();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const myRequests = myRequestsResponse?.data || [];

  // Account Details Form
  const accountForm = useForm<schemas.AccountDetailsValues>({
    resolver: zodResolver(schemas.accountDetailsSchema),
  });

  // Email Update Form
  const emailForm = useForm<schemas.EmailUpdateValues>({
    resolver: zodResolver(schemas.emailUpdateSchema),
  });

  // Password Update Form
  const passwordForm = useForm<schemas.PasswordUpdateValues>({
    resolver: zodResolver(schemas.passwordUpdateSchema),
  });

  // Secret Questions Form
  const secretQuestionsForm = useForm<schemas.SecretQuestionsUpdateValues>({
    resolver: zodResolver(schemas.secretQuestionsUpdateSchema),
  });

  useEffect(() => {
    if (profile) {
      accountForm.reset({
        title: profile.title || "",
        givenName: profile.givenNames || user?.name?.split(" ")[0] || "",
        familyName:
          profile.familyName || user?.name?.split(" ").slice(1).join(" ") || "",
        phone: user?.phone || "",
        mobilePhone: user?.mobilePhone || "",
        address:
          profile.streetAddress ||
          profile.businessAddress ||
          profile.address?.street ||
          "",
        city: profile.city || profile.address?.city || "",
        state:
          profile.stateProvince ||
          profile.state ||
          profile.address?.state ||
          "",
        zip: profile.zipPostalCode || profile.address?.zipCode || "",
        country: profile.country || profile.address?.country || "",
        companyName: profile.companyName || "",
        marn: profile.marn || "",
        licenseNumber: profile.licenseNumber || "",
      });
      emailForm.reset({
        email: user?.email || "",
      });
      if (user?.secretQuestions && user?.secretQuestions.length >= 3) {
        secretQuestionsForm.reset({
          q1: user?.secretQuestions[0]?.question || "",
          a1: user?.secretQuestions[0]?.answer || "",
          q2: user?.secretQuestions[1]?.question || "",
          a2: user?.secretQuestions[1]?.answer || "",
          q3: user?.secretQuestions[2]?.question || "",
          a3: user?.secretQuestions[2]?.answer || "",
          q4: user?.secretQuestions[3]?.question || "",
          a4: user?.secretQuestions[3]?.answer || "",
          q5: user?.secretQuestions[4]?.question || "",
          a5: user?.secretQuestions[4]?.answer || "",
        });
      }
    }
  }, [profile, user, accountForm, emailForm, secretQuestionsForm]);

  const onAccountDetailsSubmit = async (data: schemas.AccountDetailsValues) => {
    try {
      const formData = new FormData();

      // Basic info
      formData.append("name", `${data.givenName} ${data.familyName}`.trim());
      formData.append("phone", data.phone);
      if (data.mobilePhone) formData.append("mobilePhone", data.mobilePhone);

      // Profile/Agent info
      if (data.title) formData.append("title", data.title);
      formData.append("givenNames", data.givenName);
      formData.append("familyName", data.familyName);
      formData.append("streetAddress", data.address);
      formData.append("city", data.city);
      formData.append("stateProvince", data.state);
      formData.append("state", data.state);
      formData.append("zipPostalCode", data.zip);
      formData.append("zipCode", data.zip);
      formData.append("country", data.country);

      if (data.companyName) formData.append("companyName", data.companyName);
      if (data.marn) formData.append("marn", data.marn);
      if (data.licenseNumber)
        formData.append("licenseNumber", data.licenseNumber);

      // Add profile image file if selected
      if (selectedFile) {
        formData.append("profileImg", selectedFile);
      } else if (user?.profileImg) {
        formData.append("profileImg", user.profileImg);
      }

      await updateProfile(formData).unwrap();

      setSelectedFile(null);
      setImagePreview(null);

      showAlert({
        type: "success",
        title: "Success",
        message: "Account details updated successfully!",
      });
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; message?: string };
      showAlert({
        type: "error",
        title: "Update Failed",
        message:
          "Failed to update account details: " +
          (error.data?.message || error.message),
      });
    }
  };

  const onEmailSubmit = async (data: schemas.EmailUpdateValues) => {
    try {
      await requestEmailChange({ newEmail: data.email }).unwrap();
      setPendingEmail(data.email);
      setIsEmailVerifying(true);
      showAlert({
        type: "success",
        title: "Verification Sent",
        message: "A verification code has been sent to your new email address.",
      });
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; message?: string };
      showAlert({
        type: "error",
        title: "Request Failed",
        message:
          "Failed to request email change: " +
          (error.data?.message || error.message),
      });
    }
  };

  const onVerifyEmail = async () => {
    if (!otp || otp.length !== 6) {
      showAlert({
        type: "error",
        title: "Invalid Code",
        message: "Please enter a valid 6-digit verification code.",
      });
      return;
    }

    try {
      await verifyEmailChange({ newEmail: pendingEmail, otp }).unwrap();
      showAlert({
        type: "success",
        title: "Email Updated",
        message: "Your email address has been updated successfully!",
      });
      setIsEmailVerifying(false);
      setOtp("");
      // Force refresh data
      router.refresh();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; message?: string };
      showAlert({
        type: "error",
        title: "Verification Failed",
        message:
          "Failed to verify email change: " +
          (error.data?.message || error.message),
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    showAlert({
      type: "success",
      title: "Image Selected",
      message: "Image selected. Click Save below to apply the change.",
    });
  };

  const onPasswordSubmit = async (data: schemas.PasswordUpdateValues) => {
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }).unwrap();

      showAlert({
        type: "success",
        title: "Success",
        message: "Password updated successfully!",
      });
      passwordForm.reset();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; message?: string };
      showAlert({
        type: "error",
        title: "Update Failed",
        message:
          "Failed to update password: " +
          (error.data?.message || error.message),
      });
    }
  };

  const onSecretQuestionsSubmit = async (
    data: schemas.SecretQuestionsUpdateValues,
  ) => {
    const secretQuestions = [
      { question: data.q1, answer: data.a1 },
      { question: data.q2, answer: data.a2 },
      { question: data.q3, answer: data.a3 },
      ...(data.q4 && data.a4 ? [{ question: data.q4, answer: data.a4 }] : []),
      ...(data.q5 && data.a5 ? [{ question: data.q5, answer: data.a5 }] : []),
    ];

    try {
      await updateProfile({ secretQuestions }).unwrap();
      showAlert({
        type: "success",
        title: "Success",
        message: "Secret questions updated successfully!",
      });
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; message?: string };
      showAlert({
        type: "error",
        title: "Update Failed",
        message:
          "Failed to update secret questions: " +
          (error.data?.message || error.message),
      });
    }
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );
  };

  const onAccessRequestSubmit = async () => {
    if (selectedServices.length === 0) {
      showAlert({
        type: "error",
        title: "Selection Required",
        message: "Please select at least one service to request.",
      });
      return;
    }

    try {
      for (const serviceName of selectedServices) {
        await createAccessRequest({
          serviceName,
          organisationRegisteredName: profile?.companyName || "-",
        }).unwrap();
      }
      showAlert({
        type: "success",
        title: "Request Submitted",
        message: "Your access requests have been submitted successfully!",
      });
      setSelectedServices([]);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; message?: string };
      showAlert({
        type: "error",
        title: "Request Failed",
        message:
          "Failed to submit access requests: " +
          (error.data?.message || error.message),
      });
    }
  };

  const handleRemoveRequest = async (id: string) => {
    try {
      await deleteAccessRequest(id).unwrap();
      showAlert({
        type: "success",
        title: "Request Removed",
        message: "Your access request has been removed successfully.",
      });
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; message?: string };
      showAlert({
        type: "error",
        title: "Removal Failed",
        message:
          "Failed to remove access request: " +
          (error.data?.message || error.message),
      });
    }
  };

  const handleAlertPreferencesSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const alertPassword = formData.get("alertPassword") === "on";
    const alertUserDetails = formData.get("alertUserDetails") === "on";

    try {
      await updateProfile({ alertPassword, alertUserDetails }).unwrap();
      showAlert({
        type: "success",
        title: "Success",
        message: "Alert preferences updated successfully!",
      });
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; message?: string };
      showAlert({
        type: "error",
        title: "Update Failed",
        message:
          "Failed to update alert preferences: " +
          (error.data?.message || error.message),
      });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center font-sans">
        <div className="text-[#1b3564] text-lg font-bold">
          Loading account details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] font-sans text-[13px] text-gray-800">
      {/* ─── Top Utility Bar ────────────────────────────────────────────── */}
      <div className="bg-[#1b3564] text-white flex flex-wrap justify-center sm:justify-end px-4 sm:px-5 py-1.5 sm:py-1 text-[10px] sm:text-[11px] gap-x-4 gap-y-1 tracking-wide font-light border-b border-[#2150a0]">
        <span className="opacity-80">
          {(user?.name || "User").toLowerCase()}
        </span>
        <NextLink href="/dashboard" className="text-white hover:underline">
          Return to Dashboard
        </NextLink>
        <button
          onClick={handleLogout}
          className="text-white hover:underline bg-transparent border-none cursor-pointer p-0 font-light"
        >
          Logout
        </button>
      </div>

      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div className="bg-[#1b3564] min-h-[75px] py-4 sm:py-0 flex flex-col sm:flex-row items-center justify-between px-5 text-white shadow-sm gap-4">
        <div className="flex items-center gap-2">
          <div className="flex flex-col text-center sm:text-left">
            <span className="font-bold text-[14px] sm:text-[15px] tracking-wide leading-tight">
              {siteSettings.brandName}
            </span>
            <span className="text-[11px] sm:text-[12px] font-normal leading-tight opacity-90">
              {siteSettings.departmentName}
            </span>
          </div>
        </div>
        <div className="text-[20px] sm:text-[26px] font-normal tracking-wide text-white text-center">
          Manage my {siteSettings.siteName}
        </div>
      </div>

      {/* ─── Tabs Navigation ──────────────────────────────────────────────── */}
      <div className="bg-[#eeeeee] flex border-b border-gray-300 shadow-sm px-1 pt-1 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 border-t-[3px] border-x border-x-transparent text-[11px] sm:text-[13px] hover:bg-[#e0e0e0] cursor-pointer transition-colors mt-0.5 whitespace-nowrap ${
                activeTab === tab
                  ? "bg-white border-t-[#d35400] border-l-gray-300 border-r-gray-300 font-bold border-b-transparent relative z-10 bottom-[-1px]"
                  : "bg-transparent border-t-transparent text-gray-700 border-b-transparent hover:border-t-transparent"
              }`}
              style={{
                borderBottomColor: activeTab === tab ? "white" : "transparent",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Content Area ─────────────────────────────────────────────────── */}
      <div className="p-4 bg-[#f4f4f4]">
        {activeTab === "Summary" && (
          <SummaryTab
            user={user}
            profile={profile}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "Account details" && (
          <AccountDetailsTab
            user={user}
            accountForm={accountForm}
            onSubmit={onAccountDetailsSubmit}
            handleImageUpload={handleImageUpload}
            imagePreview={imagePreview}
            isUploadingImage={isUploadingImage}
            isUpdatingProfile={isUpdatingProfile}
          />
        )}

        {activeTab === "Email address" && (
          <EmailAddressTab
            user={user}
            emailForm={emailForm}
            onSubmit={onEmailSubmit}
            isEmailVerifying={isEmailVerifying}
            setIsEmailVerifying={setIsEmailVerifying}
            pendingEmail={pendingEmail}
            otp={otp}
            setOtp={setOtp}
            onVerifyEmail={onVerifyEmail}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "Password" && (
          <PasswordTab
            passwordForm={passwordForm}
            onSubmit={onPasswordSubmit}
          />
        )}

        {activeTab === "Secret questions" && (
          <SecretQuestionsTab
            secretQuestionsForm={secretQuestionsForm}
            onSubmit={onSecretQuestionsSubmit}
          />
        )}

        {activeTab === "Alert preferences" && (
          <AlertPreferencesTab
            onSubmit={handleAlertPreferencesSubmit}
            profile={profile}
          />
        )}

        {activeTab === "Request access" && (
          <RequestAccessTab
            user={user}
            profile={profile}
            myRequests={myRequests}
            selectedServices={selectedServices}
            handleServiceToggle={handleServiceToggle}
            onAccessRequestSubmit={onAccessRequestSubmit}
            handleRemoveRequest={handleRemoveRequest}
            isCreatingRequest={isCreatingRequest}
          />
        )}
      </div>
    </div>
  );
}
