// The public API: the three forms on the site, plus a health check.
//
// Response shapes are what assets/js/api.js already expects from a backend:
// JSON, and a non-2xx status carrying { message } on failure.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import multer from 'multer';
import { rateLimit } from 'express-rate-limit';
import {
  detectCvType,
  parseApplication,
  parseBooking,
  parseSubscriber,
  safeDisplayName,
} from './validate.js';
import { applicationEmail, inquiryEmail } from './notify.js';

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function createApiRouter({ config, store, notifier, adminRouter, track }) {
  const router = express.Router();
  const adminUrl = `${config.siteUrl}/admin/`;

  // ---- CORS (only when the site is hosted somewhere else) -------------------
  if (config.allowedOrigins.length) {
    router.use((req, res, next) => {
      const origin = req.get('origin');
      if (origin && config.allowedOrigins.includes(origin)) {
        res.set('Access-Control-Allow-Origin', origin);
        res.set('Vary', 'Origin');
        res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '86400');
      }
      if (req.method === 'OPTIONS') return res.sendStatus(204);
      next();
    });
  }

  router.get('/health', (req, res) => {
    let ok = false;
    try {
      ok = store.ping();
    } catch {
      /* falls through to 503 */
    }
    res.status(ok ? 200 : 503).json({ status: ok ? 'ok' : 'unavailable' });
  });

  // The admin router owns /api/admin and does its own auth, so it is mounted
  // before the JSON body parser and the public rate limits below.
  router.use('/admin', adminRouter);

  const limiter = (opts) =>
    rateLimit({
      ...opts,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      message: { message: 'Too many requests — please try again later.' },
    });

  const json = express.json({ limit: '32kb' });

  // ---- Consultation and quote requests --------------------------------------
  router.post('/bookings', limiter(config.rateLimits.bookings), json, (req, res) => {
    const { errors, value } = parseBooking(req.body);
    if (errors.length) throw new HttpError(400, errors.join(' '));

    const { id, duplicate } = store.createInquiry(value);
    res.status(201).json({ id, status: 'received' });

    if (!duplicate) {
      const row = store.getInquiry(id);
      track(
        notifier.send(inquiryEmail(row, adminUrl)).then((r) => store.setInquiryNotify(id, r.status, r.error))
      );
    }
  });

  // ---- Newsletter ------------------------------------------------------------
  router.post('/newsletter', limiter(config.rateLimits.newsletter), json, (req, res) => {
    const { errors, value } = parseSubscriber(req.body);
    if (errors.length) throw new HttpError(400, errors.join(' '));
    // Same answer whether the address is new or already subscribed, so the
    // endpoint cannot be used to find out who is on the list.
    store.addSubscriber(value);
    res.status(201).json({ status: 'subscribed' });
  });

  // ---- Career applications (multipart, optional CV) -------------------------
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: config.maxCvBytes, files: 1, fields: 10, fieldSize: 20 * 1024 },
  }).single('cv');

  router.post('/careers/applications', limiter(config.rateLimits.careers), (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return next(
          new HttpError(
            err.code === 'LIMIT_FILE_SIZE' ? 413 : 400,
            err.code === 'LIMIT_FILE_SIZE'
              ? `The CV is larger than ${Math.round(config.maxCvBytes / 1024 / 1024)} MB.`
              : 'The upload could not be read.'
          )
        );
      }
      if (err) return next(err);

      const { errors, value } = parseApplication(req.body);
      if (errors.length) return next(new HttpError(400, errors.join(' ')));

      let stored = '';
      let original = '';
      let size = 0;
      const file = req.file;
      if (file && file.size > 0) {
        const ext = detectCvType(file.buffer);
        if (!ext) return next(new HttpError(400, 'The CV must be a PDF or Word document.'));
        // The name on disk is random and chosen here; the sender's file name is
        // kept only as a label for the admin page.
        stored = `${crypto.randomUUID()}${ext}`;
        original = safeDisplayName(file.originalname);
        size = file.size;
        fs.mkdirSync(config.uploadDir, { recursive: true });
        fs.writeFileSync(path.join(config.uploadDir, stored), file.buffer, { flag: 'wx', mode: 0o600 });
      }

      const { id } = store.createApplication({
        ...value,
        cv_original_name: original,
        cv_stored_name: stored,
        cv_size: size,
      });
      res.status(201).json({ id, status: 'received' });

      const row = store.getApplication(id);
      track(
        notifier
          .send(applicationEmail(row, adminUrl))
          .then((r) => store.setApplicationNotify(id, r.status, r.error))
      );
    });
  });

  router.use((req, res) => res.status(404).json({ message: 'Not found.' }));

  // eslint-disable-next-line no-unused-vars
  router.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Malformed request.' });
    if (err.type === 'entity.too.large') return res.status(413).json({ message: 'Request too large.' });
    if (err instanceof HttpError) return res.status(err.status).json({ message: err.message });
    console.error('[api] unhandled error:', err);
    res.status(500).json({ message: 'Something went wrong on our side. Please try again.' });
  });

  return router;
}
