import { Schema, model } from 'mongoose';
import { TFieldType, TQuestion } from './question.interface';

const FIELD_TYPES: TFieldType[] = [
    'text',
    'textarea',
    'select',
    'radio',
    'checkbox',
    'date',
    'file',
    'boolean',
    'section-header',
    'number',
    'email',
    'phone',
];

const questionSchema = new Schema<TQuestion>(
    {
        visaTypeId: {
            type: Schema.Types.ObjectId,
            ref: 'VisaType',
            required: true,
            index: true,
        },
        stepNumber: {
            type: Number,
            required: true,
            min: 1,
            max: 20,
        },
        stepLabel: {
            type: String,
            required: true,
            trim: true,
        },
        fieldKey: {
            type: String,
            required: true,
            trim: true,
        },
        label: {
            type: String,
            required: true,
            trim: true,
        },
        fieldType: {
            type: String,
            enum: FIELD_TYPES,
            required: true,
        },
        options: {
            type: [
                {
                    _id: false,
                    label: { type: String, required: true },
                    value: { type: String, required: true },
                },
            ],
            default: [],
        },
        optionsKey: {
            type: String,
            trim: true,
        },
        isRequired: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
        },
        helpText: {
            type: String,
        },
        showIf: {
            type: {
                _id: false,
                field: { type: String, required: true },
                value: { type: String, required: true },
            },
            default: undefined,
        },
        sortOrder: {
            type: Number,
            default: 0,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// Compound index: fast lookup of all questions for a visa type + step
questionSchema.index({ visaTypeId: 1, stepNumber: 1, sortOrder: 1 });

// Soft-delete filter
questionSchema.pre('find', function (next) {
    this.where({ isDeleted: { $ne: true } });
    next();
});

questionSchema.pre('findOne', function (next) {
    this.where({ isDeleted: { $ne: true } });
    next();
});

export const Question = model<TQuestion>('Question', questionSchema);
