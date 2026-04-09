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


// ─── Main Page Component ───────────────────────────────────────────────────────

export default function NewApplicationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const existingId = searchParams.get("id");

  const [createApp, { isLoading: isCreating }] = useCreateApplicationMutation();
  const [updateStep, { isLoading: isUpdating }] =
    useUpdateApplicationStepMutation();

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



  // visaTypeId from DB (_id of VisaType), visaName for display
  const [selectedVisaTypeId, setSelectedVisaTypeId] = useState<string | null>(null);
  const [selectedVisaName, setSelectedVisaName] = useState<string | null>(null);

  // formData — flat key-value store for all step answers
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  // ── Fetch dynamic steps config from DB ──────────────────────────────────────
  const visaTypeId =
    selectedVisaTypeId ??
    (existingAppData?.data?.visaTypeId as string | undefined) ??
    null;

  // visaCategory (name) stored in existing app — for display
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
  const currentStepLabel =
    currentStepConfig?.label ?? `Step ${currentStep}`;

  // ── Restore existing application state ─────────────────────────────────────
  const initializedRef = useRef<string | null>(null);

  useEffect(() => {
    const existing = existingAppData?.data;
    if (existing && initializedRef.current !== existing._id) {
      initializedRef.current = existing._id;
      
      // Sync form state
      queueMicrotask(() => {
        if (existing.visaTypeId) {
          setSelectedVisaTypeId(existing.visaTypeId as string);
        }
        setSelectedVisaName(existing.visaCategory);
        setApplicationId(existing._id);
        setCurrentStep(existing.currentStep || 1);
        setFormData((existing.formData as Record<string, unknown>) || {});
      });
    }
  }, [existingAppData?.data]);

  // Once stepsConfig is also loaded, stop the 'resuming' spinner
  useEffect(() => {
    if (existingId && stepsConfig && !isLoadingConfig) {
      queueMicrotask(() => setIsResuming(false));
    } else if (!existingId) {
      queueMicrotask(() => setIsResuming(false));
    }
  }, [existingId, stepsConfig, isLoadingConfig]);



  // ── Start a new application ─────────────────────────────────────────────────
  const handleStart = async (vtId: string, vtName: string) => {
    if (user?.role === "agent") {
      if (!email.trim()) {
        setError("Client Contact Email is required.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address.");
        return;
      }
    }
    setError(null);
    
    try {
      setSelectedVisaTypeId(vtId);
      setSelectedVisaName(vtName);
      const res = await createApp({
        visaCategory: vtName,
        visaTypeId: vtId,
        email,
      }).unwrap();
      setApplicationId(res.data._id);
      setCurrentStep(1);
      setFormData({});
    } catch (err: unknown) {
      setError(
        (err as { data?: { message?: string } })?.data?.message ||
          "Failed to start application",
      );
    }
  };

  // ── Save current step (no navigation) ─────────────────────────────────────
  const handleSave = async () => {
    if (!applicationId) return;
    try {
      await updateStep({
        id: applicationId,
        step: currentStep,
        data: formData,
      }).unwrap();
      setError(null);
      showAlert({
        title: "Saved as Draft",
        message: "Your application progress has been saved as a draft. You can resume it anytime from your dashboard.",
        type: "success",
      });
      router.push("/applications");
    } catch (err: unknown) {
      setError(
        (err as { data?: { message?: string } })?.data?.message ||
          "Failed to save",
      );
    }
  };

  // ── Save + advance to next step ────────────────────────────────────────────
  const validateStep = (questions: TQuestion[], data: Record<string, unknown>) => {
    const errors: Record<string, string> = {};
    
    // Helper for visibility check (matches DynamicStepRenderer)
    const isQuestionVisible = (q: TQuestion) => {
      if (!q.showIf) return true;
      const val = data[q.showIf.field];
      return String(val) === q.showIf.value;
    };

    questions.forEach((q) => {
      if (q.isRequired && isQuestionVisible(q)) {
        // Check if value exists and is not empty string/array
        const val = data[q.fieldKey];
        const isEmpty =
          val === undefined ||
          val === null ||
          val === "" ||
          (Array.isArray(val) && val.length === 0);

        if (isEmpty) {
          errors[q.fieldKey] = `${q.label} is required`;
        }
      }
    });
    return errors;
  };

  const handleNext = async () => {
    if (!applicationId) return;

    // Validate current step questions
    const validationErrors = validateStep(currentStepQuestions, formData);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setError("Please fill in all required fields before proceeding.");
      return;
    }

    setFormErrors({});
    setError(null);

    try {
      await updateStep({
        id: applicationId,
        step: currentStep,
        data: formData,
      }).unwrap();
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      } else {
        router.push(`/applications/${applicationId}/submit`);
      }
    } catch (err: unknown) {
      setError(
        (err as { data?: { message?: string } })?.data?.message ||
          "Failed to save step",
      );
    }
  };

  const applicationDataForPdf = {
    ...existingAppData?.data,
    formData: formData,
    trn: existingAppData?.data?.trn || "PENDING",
    visaCategory: visaName || "Visa Application",
    status: existingAppData?.data?.status || "draft",
  };

  // ─── Content Area ──────────────────────────────────────────────────────────

  if (isResuming) {
    return (
      <div className="max-w-[1000px] mx-auto py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2150a0] mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Resuming your application...</p>
        <p className="text-xs text-gray-400 mt-1">Retrieving your saved progress and form configuration.</p>
      </div>
    );
  }

  if (!applicationId) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-[#1a2b4a] text-white px-4 py-2 flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-white">
            New Application
          </h2>
          <span className="text-[13px] cursor-pointer" title="Cancel" onClick={() => router.push("/applications")}>✕</span>
        </div>


        {user?.role === "agent" && (
          <div className="bg-white border border-gray-300 border-t-0 p-5 pb-0">
            <div className="mb-4">
              <label className="block text-[#00264d] font-bold text-xs mb-1.5">
                Client Contact Email (Notification & Document transmission) <span className="text-red-500">*</span>
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
                placeholder="Enter applicant's email address"
                className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-[#2150a0]"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Important notifications and documents will be sent to this email
                address.
              </p>
            </div>
          </div>
        )}

        <VisaCategorySelector onSelect={handleStart} isLoading={isCreating} />

        {error && (
          <div className="mt-3 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
            {error}
          </div>
        )}

        <div className="mt-5">
          <button
            onClick={() => router.push("/applications")}
            className="text-xs px-3 py-1 border border-gray-400 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ─── Application form ──────────────────────────────────────────────────────

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      {/* Dark Header */}
      <div className="bg-[#1a2b4a] min-h-[44px] py-2 md:py-0 flex items-center px-5 text-white text-base md:text-lg font-bold">
        Application for: {visaName || "Visa"}
      </div>

      <div className="max-w-[1000px] mx-auto flex flex-col lg:flex-row gap-6 p-4 md:py-5">
        {/* Sidebar */}
        <ApplicationSidebar sidebarLinks={stepsConfig?.sidebarLinks} visaCategory={visaName} />

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white border border-gray-300 p-6 shadow-sm">
            <h2 className="text-[#2150a0] font-bold text-lg mb-4">
              {currentStepLabel}
            </h2>

            <ProgressBar step={currentStep} total={totalSteps} trn="EGPBHB0G2R" />

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
                {error}
              </div>
            )}

            <div className="min-h-[400px]">
              {isLoadingConfig ? (
                <div className="flex items-center justify-center gap-2 py-16 text-gray-500 text-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2150a0]" />
                  Loading step configuration...
                </div>
              ) : (
                <DynamicStepRenderer
                  questions={currentStepQuestions}
                  data={formData}
                  onChange={(newData) => {
                    setFormData(newData);
                    // Clear error for fields that now have values
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

            <NavBar
              onPrev={() =>
                currentStep > 1 && setCurrentStep((prev) => prev - 1)
              }
              onSave={handleSave}
              onPrint={() => setShowPdfView(true)}
              onNext={handleNext}
              isFirst={currentStep === 1}
              isLast={currentStep === totalSteps}
              isLoading={isUpdating}
            />
          </div>

          <div className="mt-3 flex gap-6 text-xs">
            <a href="#" className="text-[#2150a0] underline">
              Accessibility
            </a>
            <a href="#" className="text-[#2150a0] underline">
              Online Security
            </a>
            <a href="#" className="text-[#2150a0] underline">
              Privacy
            </a>
            <a href="#" className="text-[#2150a0] underline">
              Copyright &amp; Disclaimer
            </a>
          </div>
        </div>
      </div>
      {showPdfView && (
        <ApplicationPdfView
          application={applicationDataForPdf}
          onClose={() => setShowPdfView(false)}
        />
      )}
    </div>
  );
}
