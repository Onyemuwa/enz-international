import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { db } from '../db/index.js';
import { sendMail } from '../lib/mailer.js';

const bookingSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(50).optional().default(''),
  company: z.string().trim().max(200).optional().default(''),
  date: z.string().trim().min(1).max(20),
  service: z.string().trim().max(50).optional().default(''),
  message: z.string().trim().max(4000).optional().default(''),
});

export const bookingsRouter = Router();

bookingsRouter.post('/', async (req, res, next) => {
  try {
    const data = bookingSchema.parse(req.body);
    const id = randomUUID();

    db.prepare(
      `INSERT INTO bookings (id, name, email, phone, company, date, service, message)
       VALUES (@id, @name, @email, @phone, @company, @date, @service, @message)`
    ).run({ id, ...data });

    await sendMail({
      subject: `New consultation request — ${data.name}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nCompany: ${data.company}\nPreferred date: ${data.date}\nService: ${data.service}\nMessage: ${data.message}`,
    });

    res.status(201).json({ id, status: 'received' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid booking data', issues: err.issues });
    }
    next(err);
  }
});

export default bookingsRouter;
