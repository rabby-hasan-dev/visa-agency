import { Types } from 'mongoose';

export interface TUserPassword {
    userId: string | Types.ObjectId;
    email: string;
    password: string;
}
