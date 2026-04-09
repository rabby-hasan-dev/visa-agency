import { Schema, model } from 'mongoose';

const staffProfileSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        employeeId: { type: String, unique: true },
        department: { type: String },
        designation: { type: String },
        title: { type: String },
        givenNames: { type: String },
        familyName: { type: String },
        streetAddress: { type: String },
        city: { type: String },
        stateProvince: { type: String },
        zipPostalCode: { type: String },
        country: { type: String },
    },
    { timestamps: true }
);

export const StaffProfile = model('StaffProfile', staffProfileSchema);
