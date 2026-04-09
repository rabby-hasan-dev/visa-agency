import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import router from './app/routes';
import apiNotFound from './app/middlewares/notFound';
import config from './app/config';
import path from 'path';

import mongoose from 'mongoose';

const app: Application = express();

// Cache the connection promise to reuse it across serverless invocations
let cachedConnection: Promise<typeof mongoose> | null = null;

// Database connection middleware for Vercel/Serverless
app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      if (!config.database_url) {
        throw new Error('DATABASE_URL is not defined in environment variables');
      }

      if (!cachedConnection) {
        console.log('Initiating new database connection...');
        cachedConnection = mongoose.connect(config.database_url as string, {
          serverSelectionTimeoutMS: 10000,
        });
      }
      
      await cachedConnection;
      console.log('Database connected successfully');
    }
    next();
  } catch (error) {
    console.error('Database connection failed in middleware:', error);
    cachedConnection = null; // Reset cache on failure so next request can retry
    next(error);
  }
});

// Serve static files (CSS, images, etc.) from the 'src/public' folder
app.use(express.static(path.join(process.cwd(), 'src', 'public')));

//parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  // console.log(`${req.method} ${req.url}`);
  if (req.method !== 'GET') {
    // console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

app.use(cors({ origin: [`${config.client_site_url}`, 'http://localhost:3000'], credentials: true }));

// application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  // res.send('Welcome to ERP Sass Backend World');

  res.sendFile(path.join(process.cwd(), 'src', 'public', 'index.html'))
});

app.use(globalErrorHandler);

//Not Found
app.use(apiNotFound);

export default app;
