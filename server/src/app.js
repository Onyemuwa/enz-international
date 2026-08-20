import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { bookingsRouter } from './routes/bookings.js';
import { newsletterRouter } from './routes/newsletter.js';
import { authRouter } from './routes/auth.js';
import { careersRouter } from './routes/careers.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
  app.use(express.json({ limit: '100kb' }));

  // General API rate limit; /api/auth/login has its own tighter limiter (see routes/auth.js).
  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/bookings', bookingsRouter);
  app.use('/api/newsletter', newsletterRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/careers', careersRouter);

  app.use((_req, res) => res.status(404).json({ message: 'Not found' }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  });

  return app;
}

export default createApp;
