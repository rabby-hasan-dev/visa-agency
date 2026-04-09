import { Types } from 'mongoose';

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
    | 'phone';

export type TFieldOption = {
    label: string;
    value: string;
};

export type TShowIf = {
    field: string;   // fieldKey of the controlling field
    value: string;   // the value that triggers this field to show
};

export type TQuestion = {
    visaTypeId: Types.ObjectId;     // FK → VisaType
    stepNumber: number;             // Which step (1-based)
    stepLabel: string;              // Step title shown in sidebar/progress bar
    fieldKey: string;               // Key used in formData (e.g. "givenNames")
    label: string;                  // Human-readable field label
    fieldType: TFieldType;
    options?: TFieldOption[];       // For select / radio / checkbox
    optionsKey?: string;            // Link to Global Options key (system settings)
    isRequired: boolean;
    placeholder?: string;
    helpText?: string;
    showIf?: TShowIf;               // Conditional rendering rule
    sortOrder: number;              // Display order within the step
    isDeleted: boolean;
};
