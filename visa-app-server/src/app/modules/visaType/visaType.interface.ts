export type TVisaType = {
    name: string;           // e.g. "Visitor Visa (600)"
    code: string;           // e.g. "600"
    category: string;       // e.g. "Visitor" — groups the visa in the selector UI
    description?: string;
    isActive: boolean;
    sortOrder: number;
    totalSteps: number;
    sidebarLinks?: string[];
    baseFee: number;
    biometricFee: number;
    serviceFee: number;
    currency?: string;
    isDeleted: boolean;
};
