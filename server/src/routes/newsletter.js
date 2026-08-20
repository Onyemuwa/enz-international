import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { db } from '../db/index.js';

const schema = z.object({ email: z.string().trim().email().max(320) });

export const newsletterRouter = Router();

newsletterRouter.post('/', (req, res, next) => {
  try {
    const { email } = schema.parse(req.body);
    db.prepare('INSERT OR IGNORE INTO newsletter_subscribers (id, email) VALUES (?, ?)').run(
      randomUUID(),
      email.toLowerCase()
    );
    // Always report success, even if already subscribed — don't leak list membership.
    res.status(201).json({ status: 'subscribed' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    next(err);
  }
});

export default newsletterRouter;
