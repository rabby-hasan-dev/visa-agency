/** Shared props for all step form components */
export type StepProps = {
    data: Record<string, unknown>;
    onChange: (d: Record<string, unknown>) => void;
};

/** Application data shape from the API */
export interface ApplicationData {
    _id: string;
    status: string;
    visaCategory: string;
    currentStep: number;
    formData: Record<string, unknown>;
    clientId?: {
        fullName?: string;
        dateOfBirth?: string;
    };
    trn?: string;
    updatedAt?: string;
    createdAt?: string;
}
