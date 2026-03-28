import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { resumeRoutes } from './routes/resume.routes';

export const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://vagora-eight.vercel.app',
      
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
  })
);
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/resume', resumeRoutes);
