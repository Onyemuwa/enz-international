import { Router } from 'express';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
import { z } from 'zod';
import { db } from '../db/index.js';
import { sendMail } from '../lib/mailer.js';

const uploadsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../uploads');
mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, cb) => cb(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are accepted'));
    }
    cb(null, true);
  },
});

const schema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  message: z.string().trim().max(4000).optional().default(''),
});

export const careersRouter = Router();

careersRouter.post('/applications', (req, res, next) => {
  upload.single('cv')(req, res, async (uploadErr) => {
    if (uploadErr) {
      return res.status(400).json({ message: uploadErr.message });
    }
    try {
      const data = schema.parse(req.body);
      const id = randomUUID();

      db.prepare(
        `INSERT INTO career_applications (id, name, email, message, cv_filename)
         VALUES (?, ?, ?, ?, ?)`
      ).run(id, data.name, data.email, data.message, req.file?.filename || null);

      await sendMail({
        subject: `New CV submission — ${data.name}`,
        text: `Name: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}\nCV file: ${req.file?.filename || '(none attached)'}`,
      });

      res.status(201).json({ id, status: 'received' });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid application data' });
      }
      next(err);
    }
  });
});

export default careersRouter;
