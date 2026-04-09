import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import seedSuperAdmin from './app/DB';
import seedVisaTypesAndQuestions from './app/DB/seedVisaTypes';
import seedFees from './app/DB/seedFees';
import seedTransitCountries from './app/DB/seedTransitCountries';
let server: Server;

async function main() {
  try {
    if (!config.database_url) {
      throw new Error('DATABASE_URL is not defined in .env file');
    }

    console.log('Connecting to database...');
    await mongoose.connect(config.database_url as string, {
      serverSelectionTimeoutMS: 10000, 
    });
    console.log('Successfully connected to database');

    console.log('Running seeds...');
    await seedSuperAdmin();
    await seedFees();
    await seedTransitCountries();
    await seedVisaTypesAndQuestions();
    console.log('Seeds completed');

    server = app.listen(config.port, () => {
      console.log(`app is listening on port ${config.port}`);
    });
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
}

main();


// MANDATORY FOR VERCEL: 
// This tells Vercel's serverless runtime to use your Express app
export default app;


process.on('unhandledRejection', (err) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
