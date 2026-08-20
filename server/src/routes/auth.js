import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { db } from '../db/index.js';

const schema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(1).max(200),
});

// Tighter limit than the general API limiter — this endpoint checks real password hashes.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRouter = Router();

authRouter.post('/login', loginLimiter, (req, res, next) => {
  try {
    const { email, password } = schema.parse(req.body);
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());

    // Constant-shape response whether or not the user exists, to avoid
    // leaking account existence via timing/response differences.
    const valid = user ? bcrypt.compareSync(password, user.password_hash) : bcrypt.compareSync(password, '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva');

    if (!user || !valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid credentials payload' });
    }
    next(err);
  }
});

export default authRouter;
