import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';
import { USER_ROLE } from './user.constant';

const userSchema = new Schema<TUser, UserModel>(
    {
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: 0,
        },
        role: {
            type: String,
            enum: Object.values(USER_ROLE),
            required: true,
        },
        phone: {
            type: String,
        },
        mobilePhone: {
            type: String,
        },
        secretQuestions: [
            {
                question: { type: String, required: true },
                answer: { type: String, required: true },
            },
        ],
        profileImg: {
            type: String,
        },
        status: {
            type: String,
            enum: ['active', 'blocked'],
            default: 'active',
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

userSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = this as any;
    // hashing password and save into DB
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(
            user.password as string,
            Number(config.bcrypt_salt_rounds),
        );
    }
    next();
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
    return await this.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
    plainTextPassword,
    hashedPassword,
) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>('User', userSchema);
