"use client";

import {
  useCreateApplicationMutation,
  useUpdateApplicationStepMutation,
  useGetSingleApplicationQuery,
} from "@/redux/api/applicationApi";
import { useGetStepsConfigQuery } from "@/redux/api/questionApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ProgressBar, NavBar, useAlert } from "@/components/ui";
import { ApplicationSidebar } from "@/components/application/ApplicationSidebar";
import { VisaCategorySelector } from "@/components/application/VisaCategorySelector";
import { DynamicStepRenderer } from "@/components/application/DynamicStepRenderer";
import { ApplicationPdfView } from "@/components/application/ApplicationPdfView";
import { useAppSelector } from "@/redux/hooks";
import { TVisaStepsConfig, TQuestion } from "@/types/visaTypes";
import NextLink from "next/link";
import { Loader2, X, ChevronLeft } from "lucide-react";

// ─── Main Page Component ───────────────────────────────────────────────────────

export default function NewApplicationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const existingId = searchParams.get("id");

  const [createApp, { isLoading: isCreating }] = useCreateApplicationMutation();
  const [updateStep, { isLoading: isUpdating }] = useUpdateApplicationStepMutation();

  const { data: existingAppData } = useGetSingleApplicationQuery(
    existingId || "",
    { skip: !existingId },
  );

  const user = useAppSelector((state) => state.auth.user);
  const [email, setEmail] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isResuming, setIsResuming] = useState(!!existingId);
  const [showPdfView, setShowPdfView] = useState(false);
  const { showAlert } = useAlert();

  const [selectedVisaTypeId, setSelectedVisaTypeId] = useState<string | null>(null);
  const [selectedVisaName, setSelectedVisaName] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const visaTypeId =
    selectedVisaTypeId ??
    (existingAppData?.data?.visaTypeId as string | undefined) ??
    null;

  const visaName =
    selectedVisaName ??
    existingAppData?.data?.visaCategory ??
    null;

  const { data: stepsConfigData, isLoading: isLoadingConfig } =
    useGetStepsConfigQuery(visaTypeId!, { skip: !visaTypeId });

  const stepsConfig = stepsConfigData?.data as TVisaStepsConfig | undefined;
  const totalSteps = stepsConfig?.totalSteps ?? 1;
  const currentStepConfig = stepsConfig?.steps?.[currentStep];
  const currentStepQuestions = currentStepConfig?.questions ?? [];
  const currentStepLabel = currentStepConfig?.label ?? `Step ${currentStep}`;

  const initializedRef = useRef<string | null>(null);

  useEffect(() => {
    const existing = existingAppData?.data;
    if (existing && initializedRef.current !== existing._id) {
      initializedRef.current = existing._id;
      queueMicrotask(() => {
        if (existing.visaTypeId) setSelectedVisaTypeId(existing.visaTypeId as string);
        setSelectedVisaName(existing.visaCategory);
        setApplicationId(existing._id);
        setCurrentStep(existing.currentStep || 1);
        setFormData((existing.formData as Record<string, unknown>) || {});
      });
    }
  }, [existingAppData?.data]);

  useEffect(() => {
    if (existingId && stepsConfig && !isLoadingConfig) {
      queueMicrotask(() => setIsResuming(false));
    } else if (!existingId) {
      queueMicrotask(() => setIsResuming(false));
    }
  }, [existingId, stepsConfig, isLoadingConfig]);

  const handleStart = async (vtId: string, vtName: string) => {
    if (user?.role === "agent") {
      if (!email.trim()) { setError("Client Contact Email is required."); return; }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) { setError("Please enter a valid email address."); return; }
    }
    setError(null);
    try {
      setSelectedVisaTypeId(vtId);
      setSelectedVisaName(vtName);
      const res = await createApp({ visaCategory: vtName, visaTypeId: vtId, email }).unwrap();
      setApplicationId(res.data._id);
      setCurrentStep(1);
      setFormData({});
    } catch (err: unknown) {
      setError((err as { data?: { message?: string } })?.data?.message || "Failed to start application");
    }
  };

  const handleSave = async () => {
    if (!applicationId) return;
    try {
      await updateStep({ id: applicationId, step: currentStep, data: formData }).unwrap();
      setError(null);
      showAlert({
        title: "Saved as Draft",
        message: "Your application progress has been saved. You can resume anytime.",
        type: "success",
      });
      router.push("/applications");
    } catch (err: unknown) {
      setError((err as { data?: { message?: string } })?.data?.message || "Failed to save");
    }
  };

  const validateStep = (questions: TQuestion[], data: Record<string, unknown>) => {
    const errors: Record<string, string> = {};
    const isQuestionVisible = (q: TQuestion) => {
      if (!q.showIf) return true;
      const val = data[q.showIf.field];
      return String(val) === q.showIf.value;
    };
    questions.forEach((q) => {
      if (q.isRequired && isQuestionVisible(q)) {
        const val = data[q.fieldKey];
        const isEmpty = val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0);
        if (isEmpty) errors[q.fieldKey] = `${q.label} is required`;
      }
    });
    return errors;
  };

  const handleNext = async () => {
    if (!applicationId) return;
    const validationErrors = validateStep(currentStepQuestions, formData);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setError("Please fill in all required fields before proceeding.");
      return;
    }
    setFormErrors({});
    setError(null);
    try {
      await updateStep({ id: applicationId, step: currentStep, data: formData }).unwrap();
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      } else {
        router.push(`/applications/${applicationId}/submit`);
      }
    } catch (err: unknown) {
      setError((err as { data?: { message?: string } })?.data?.message || "Failed to save step");
    }
  };

  const applicationDataForPdf = {
    ...existingAppData?.data,
    formData,
    trn: existingAppData?.data?.trn || "PENDING",
    visaCategory: visaName || "Visa Application",
    status: existingAppData?.data?.status || "draft",
  };

  // ─── Loading / Resuming ───────────────────────────────────────────────────

  if (isResuming) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-800">
        <Loader2 size={28} className="animate-spin text-blue-500" />
        <p className="text-sm font-medium text-gray-600">Resuming your application...</p>
        <p className="text-xs text-gray-400">Retrieving your saved progress and form configuration.</p>
      </div>
    );
  }

  // ─── Visa Category Selector (no application started yet) ─────────────────

  if (!applicationId) {
    return (
      <div className="space-y-5 text-gray-800">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <NextLink href="/applications" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 transition-colors mb-2 w-fit">
              <ChevronLeft size={14} /> Back to Applications
            </NextLink>
            <h1 className="text-xl font-bold text-gray-900">New Application</h1>
            <p className="text-sm text-gray-500 mt-0.5">Select a visa category to begin your application.</p>
          </div>
          <button
            onClick={() => router.push("/applications")}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <X size={14} /> Cancel
          </button>
        </div>

        {/* Agent email input */}
        {user?.role === "agent" && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Client Information</p>
            <div className="max-w-md space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Client Contact Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error === "Client Contact Email is required." || error === "Please enter a valid email address.") {
                    setError(null);
                  }
                }}
                placeholder="applicant@example.com"
                className="w-full px-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors placeholder-gray-400"
              />
              <p className="text-xs text-gray-400">
                Notifications and documents will be sent to this address.
              </p>
            </div>
          </div>
        )}

        {/* Visa Category Selector */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Select Visa Category</p>
          </div>
          <div className="p-5">
            <VisaCategorySelector onSelect={handleStart} isLoading={isCreating} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2.5 p-4 bg-rose-50 border border-rose-100 rounded-xl text-sm text-rose-600">
            <span className="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">!</span>
            {error}
          </div>
        )}
      </div>
    );
  }

  // ─── Application Wizard ────────────────────────────────────────────────────

  return (
    <>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <NextLink href="/applications" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 transition-colors mb-1.5 w-fit">
            <ChevronLeft size={14} /> Back to Applications
          </NextLink>
          <h1 className="text-lg font-bold text-gray-900">
            {visaName || "Visa Application"}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Step {currentStep} of {totalSteps} — {currentStepLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full transition-colors ${
                  i + 1 < currentStep ? "bg-blue-600" :
                  i + 1 === currentStep ? "bg-blue-400" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-5 text-gray-800">
        {/* Sidebar */}
        <div className="w-full lg:w-[220px] shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <ApplicationSidebar sidebarLinks={stepsConfig?.sidebarLinks} visaCategory={visaName} />
          </div>
        </div>

        {/* Form card */}
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
            {/* Step Title + Progress */}
            <div className="mb-5">
              <h2 className="text-base font-semibold text-gray-900 mb-3">{currentStepLabel}</h2>
              <ProgressBar step={currentStep} total={totalSteps} trn="EGPBHB0G2R" />
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-start gap-2.5 mb-5 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-sm text-rose-600">
                <span className="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">!</span>
                {error}
              </div>
            )}

            {/* Step Content */}
            <div className="min-h-[300px]">
              {isLoadingConfig ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 size={22} className="animate-spin text-blue-400" />
                  <p className="text-sm text-gray-400">Loading step configuration...</p>
                </div>
              ) : (
                <DynamicStepRenderer
                  questions={currentStepQuestions}
                  data={formData}
                  onChange={(newData) => {
                    setFormData(newData);
                    const newFormErrors = { ...formErrors };
                    Object.keys(newFormErrors).forEach(key => {
                      if (newData[key]) delete newFormErrors[key];
                    });
                    setFormErrors(newFormErrors);
                  }}
                  errors={formErrors}
                />
              )}
            </div>

            {/* Navigation Bar */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <NavBar
                onPrev={() => currentStep > 1 && setCurrentStep((prev) => prev - 1)}
                onSave={handleSave}
                onPrint={() => setShowPdfView(true)}
                onNext={handleNext}
                isFirst={currentStep === 1}
                isLast={currentStep === totalSteps}
                isLoading={isUpdating}
              />
            </div>
          </div>

          {/* Footer links */}
          <div className="mt-3 flex flex-wrap gap-4 text-xs px-1">
            {["Accessibility", "Online Security", "Privacy", "Copyright & Disclaimer"].map((link) => (
              <a key={link} href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>

      {showPdfView && (
        <ApplicationPdfView
          application={applicationDataForPdf}
          onClose={() => setShowPdfView(false)}
        />
      )}
    </>
  );
}
