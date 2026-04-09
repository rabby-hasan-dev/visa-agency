import mongoose from 'mongoose';
import { VisaApplication } from './src/app/modules/visaApplication/visaApplication.model';
import { User } from './src/app/modules/user/user.model';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

async function backfillNames() {
    try {
        await mongoose.connect(process.env.DATABASE_URL as string);
        console.log('Connected to DB');

        const applications = await VisaApplication.find({ applicantName: { $exists: false } }).populate('clientId');
        console.log(`Found ${applications.length} applications to backfill`);

        for (const app of applications) {
            if (app.clientId && (app.clientId as any).name) {
                await VisaApplication.findByIdAndUpdate(app._id, { applicantName: (app.clientId as any).name });
                console.log(`Updated ${app._id} with name ${(app.clientId as any).name}`);
            } else if (app.email) {
                await VisaApplication.findByIdAndUpdate(app._id, { applicantName: app.email });
                console.log(`Updated ${app._id} with email ${app.email}`);
            }
        }

        console.log('Backfill complete');
        process.exit(0);
    } catch (error) {
        console.error('Error during backfill:', error);
        process.exit(1);
    }
}

backfillNames();
