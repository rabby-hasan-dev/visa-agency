export type VisaStep = {
    label: string;
    component: string; // Key to identify which component to render
};

export type VisaConfiguration = {
    totalSteps: number;
    sidebarLinks?: string[];
    steps: Record<number, VisaStep>;
};

export const VISA_CONFIGS: Record<string, VisaConfiguration> = {
    "Transit Visa (771)": {
        totalSteps: 12,
        steps: {
            1: { label: "Terms & Conditions", component: "Step1" },
            2: { label: "Application Context", component: "Step2" },
            3: { label: "Applicant Details", component: "Step3" },
            4: { label: "Data Confirmation", component: "Step4" },
            5: { label: "Contact Details", component: "Step5" },
            6: { label: "Authorised Recipient", component: "Step6" },
            7: { label: "Transit Details", component: "Step7" },
            8: { label: "Health Declarations", component: "Step8" },
            9: { label: "Character Declarations", component: "Step9" },
            10: { label: "Visa History", component: "Step10" },
            11: { label: "Transit Declarations", component: "Step11" },
            12: { label: "Final Declarations", component: "Step12" },
        },
    },
    "Visitor Visa (600)": {
        totalSteps: 10,
        sidebarLinks: [
            "Subclass 600 information",
            "Visitor visa (subclass 600)",
            "Health requirements",
            "Visa Pricing Estimator",
        ],
        steps: {
            1: { label: "Terms & Conditions", component: "Step1" },
            2: { label: "Application Context", component: "StepVisitorContext" },
            3: { label: "Applicant Details", component: "Step3" },
            4: { label: "Contact Details", component: "Step5" }, // Reuse Step5
            5: { label: "Authorised Recipient", component: "Step6" }, // Reuse Step6
            6: { label: "Non-accompanying Family", component: "StepNonAccompanyingFamily" },
            7: { label: "Previous Travel", component: "StepPreviousTravel" },
            8: { label: "Health Declarations", component: "Step8" },
            9: { label: "Character Declarations", component: "Step9" },
            10: { label: "Final Declarations", component: "Step12" },
        },
    },
    "Student Visa (500)": {
        totalSteps: 11,
        sidebarLinks: [
            "Subclass 500 information",
            "Checklist for Student visa",
            "GTE requirements",
            "Financial requirements",
        ],
        steps: {
            1: { label: "Terms & Conditions", component: "Step1" },
            2: { label: "Application Context", component: "StepStudentContext" },
            3: { label: "Applicant Details", component: "Step3" },
            4: { label: "Contact Details", component: "Step5" },
            5: { label: "Authorised Recipient", component: "Step6" },
            6: { label: "Educational Background", component: "StepGeneric" },
            7: { label: "English Proficiency", component: "StepGeneric" },
            8: { label: "Health Insurance (OSHC)", component: "StepGeneric" },
            9: { label: "Health Declarations", component: "Step8" },
            10: { label: "Character Declarations", component: "Step9" },
            11: { label: "Final Declarations", component: "Step12" },
        },
    },
    default: {
        totalSteps: 5,
        steps: {
            1: { label: "Terms & Conditions", component: "Step1" },
            2: { label: "Application Context", component: "Step2" },
            3: { label: "Applicant Details", component: "Step3" },
            4: { label: "Declarations", component: "Step12" },
            5: { label: "Supporting Documents", component: "StepGeneric" },
        },
    },
};
