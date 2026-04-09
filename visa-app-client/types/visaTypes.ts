// ─── Field Types ──────────────────────────────────────────────────────────────

export type TFieldType =
    | 'text'
    | 'textarea'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'date'
    | 'file'
    | 'boolean'
    | 'section-header'
    | 'number'
    | 'email'
    | 'phone'
    | 'transit-country'
    | 'country';

// ─── Question ─────────────────────────────────────────────────────────────────

export interface TFieldOption {
    label: string;
    value: string;
}

export interface TShowIf {
    field: string;
    value: string;
}

export interface TQuestion {
    _id: string;
    visaTypeId: string;
    stepNumber: number;
    stepLabel: string;
    fieldKey: string;
    label: string;
    fieldType: TFieldType;
    options?: TFieldOption[];
    optionsKey?: string;
    isRequired: boolean;
    placeholder?: string;
    helpText?: string;
    showIf?: TShowIf;
    sortOrder: number;
    isDeleted: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// ─── Steps Config (returned by GET /questions/steps-config/:visaTypeId) ───────

export interface TStepConfig {
    label: string;
    questions: TQuestion[];
}

export interface TVisaStepsConfig {
    totalSteps: number;
    sidebarLinks: string[];
    steps: Record<number, TStepConfig>;
}

// ─── Visa Type ────────────────────────────────────────────────────────────────

export interface TVisaType {
    _id: string;
    name: string;
    code: string;
    category: string;
    description?: string;
    isActive: boolean;
    sortOrder: number;
    totalSteps: number;
    sidebarLinks: string[];
    isDeleted: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// ─── API Response wrappers ────────────────────────────────────────────────────

export interface TApiMeta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export interface TApiListResponse<T> {
    success: boolean;
    message: string;
    data: {
        meta: TApiMeta;
        result: T[];
    };
}

export interface TApiSingleResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
