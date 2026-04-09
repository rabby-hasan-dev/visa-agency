export const VISA_APPLICATION_STATUS = {
    DRAFT: 'DRAFT',
    SUBMITTED: 'SUBMITTED',
    UNDER_REVIEW: 'UNDER_REVIEW',
    PAYMENT_PENDING: 'PAYMENT_PENDING',
    PAID: 'PAID',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    GRANTED: 'GRANTED',
    REFUSED: 'REFUSED',
} as const;

export type TVisaApplicationStatus = keyof typeof VISA_APPLICATION_STATUS;

export type TSteps = {
    step1?: Record<string, unknown>;
    step2?: Record<string, unknown>;
    step3?: Record<string, unknown>;
    step4?: Record<string, unknown>;
    step5?: Record<string, unknown>;
    step6?: Record<string, unknown>;
    step7?: Record<string, unknown>;
    step8?: Record<string, unknown>;
    step9?: Record<string, unknown>;
    step10?: Record<string, unknown>;
    step11?: Record<string, unknown>;
    step12?: Record<string, unknown>;
    [key: string]: unknown;
};
