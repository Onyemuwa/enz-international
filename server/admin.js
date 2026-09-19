// The admin: a page to read what came in, plus the JSON API behind it.
//
// Auth is HTTP Basic against ADMIN_USER / ADMIN_PASSWORD. It is deliberately
// plain: no sessions, no cookies to steal, nothing to store. Basic auth is only
// as safe as the connection under it, which is why production redirects to
// HTTPS before this code runs.
//
// If ADMIN_PASSWORD is not set the admin is OFF (503), never open. There is no
// default password to forget to change.
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { STATUSES } from './db.js';
import { text } from './validate.js';

// SHA-256 first so timingSafeEqual always compares equal-length buffers and
// the comparison time does not depend on how much of a guess was right.
const digest = (s) => crypto.createHash('sha256').update(String(s)).digest();
const same = (a, b) => crypto.timingSafeEqual(digest(a), digest(b));

// Spreadsheet formula injection: a cell that starts with = + - @ is executed
// by Excel/Sheets when the export is opened. Visitors control these cells.
function csvCell(value) {
  let s = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(columns, rows) {
  const lines = [columns.map((c) => csvCell(c.header)).join(',')];
  for (const row of rows) lines.push(columns.map((c) => csvCell(row[c.key])).join(','));
  // The BOM makes Excel read the file as UTF-8, which matters for names with
  // accents or non-Latin scripts.
  return '﻿' + lines.join('\r\n') + '\r\n';
}

const INQUIRY_COLUMNS = [
  { header: 'ID', key: 'id' },
  { header: 'Received (UTC)', key: 'created_at' },
  { header: 'Type', key: 'kind' },
  { header: 'Status', key: 'status' },
  { header: 'Name', key: 'name' },
  { header: 'Email', key: 'email' },
  { header: 'Phone', key: 'phone' },
  { header: 'Company', key: 'company' },
  { header: 'Product', key: 'product' },
  { header: 'Service', key: 'service' },
  { header: 'Preferred date', key: 'preferred_date' },
  { header: 'Message', key: 'message' },
  { header: 'Internal notes', key: 'notes' },
];

const parseId = (req) => {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// Pages through a list helper (which caps each page) to collect every row.
function collectAll(list, filter = {}) {
  const all = [];
  for (let offset = 0; ; ) {
    const { rows } = list({ ...filter, limit: 200, offset });
    if (!rows.length) return all;
    all.push(...rows);
    offset += rows.length;
  }
}

/**
 * Returns the admin page and its API as two routers sharing ONE sign-in check
 * and ONE failed-attempt counter, so guessing the password is throttled the
 * same way wherever it is attempted.
 */
export function createAdmin({ config, store, notifier, adminDir }) {
  const noStore = (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    res.set('X-Robots-Tag', 'noindex, nofollow');
    next();
  };

  // Counts failed attempts only (skipSuccessfulRequests), so normal use is
  // never throttled but password guessing is.
  const failureLimiter = rateLimit({
    ...config.rateLimits.adminFailures,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many failed sign-in attempts. Try again later.' },
  });

  const authenticate = (req, res, next) => {
    if (!config.adminPassword) {
      return res
        .status(503)
        .type('text/plain')
        .send('The admin is disabled. Set the ADMIN_PASSWORD environment variable to enable it.');
    }
    const header = req.get('authorization') || '';
    if (header.startsWith('Basic ')) {
      const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
      const split = decoded.indexOf(':');
      if (split > -1) {
        // Both comparisons always run (bitwise &, not &&) so a wrong username
        // and a wrong password take the same time.
        const userOk = same(decoded.slice(0, split), config.adminUser);
        const passOk = same(decoded.slice(split + 1), config.adminPassword);
        if (userOk & passOk) return next();
      }
    }
    res.set('WWW-Authenticate', 'Basic realm="ENZ admin", charset="UTF-8"');
    res.status(401).type('text/plain').send('Authentication required.');
  };

  const guard = [noStore, failureLimiter, authenticate];
  const json = express.json({ limit: '16kb' });

  // ==========================================================================
  // JSON API — mounted at /api/admin
  // ==========================================================================
  const api = express.Router();

  api.get('/summary', guard, (req, res) => {
    let dbBytes = 0;
    try {
      dbBytes = fs.statSync(config.dbPath).size;
    } catch {
      /* in-memory database */
    }
    res.json({
      ...store.summary(),
      notificationsConfigured: notifier.configured,
      storageIsEphemeral: config.storageIsEphemeral,
      dbBytes,
      statuses: STATUSES,
    });
  });

  api.get('/inquiries', guard, (req, res) => res.json(store.listInquiries(req.query)));

  api.get('/inquiries.csv', guard, (req, res) => {
    const rows = collectAll(store.listInquiries, { status: req.query.status, q: req.query.q });
    res.type('text/csv; charset=utf-8').attachment('enz-inquiries.csv').send(toCsv(INQUIRY_COLUMNS, rows));
  });

  const patchHandler = (getRow, update) => (req, res) => {
    const id = parseId(req);
    if (!id || !getRow(id)) return res.status(404).json({ message: 'Not found.' });
    const patch = {};
    if (req.body?.status !== undefined) {
      if (!STATUSES.includes(req.body.status)) return res.status(400).json({ message: 'Unknown status.' });
      patch.status = req.body.status;
    }
    if (req.body?.notes !== undefined) patch.notes = text(req.body.notes, 5000);
    res.json(update(id, patch));
  };

  api.patch('/inquiries/:id', guard, json, patchHandler(store.getInquiry, store.updateInquiry));

  api.delete('/inquiries/:id', guard, (req, res) => {
    const id = parseId(req);
    if (!id || !store.deleteInquiry(id)) return res.status(404).json({ message: 'Not found.' });
    res.status(204).end();
  });

  api.get('/applications', guard, (req, res) => res.json(store.listApplications(req.query)));

  api.patch('/applications/:id', guard, json, patchHandler(store.getApplication, store.updateApplication));

  // The one place a database value becomes a filesystem path. The stored name
  // is generated server-side (uuid + extension), but resolve and check
  // containment anyway.
  const cvPath = (row) => {
    if (!row?.cv_stored_name) return null;
    const dir = path.resolve(config.uploadDir);
    const file = path.resolve(dir, row.cv_stored_name);
    return file.startsWith(dir + path.sep) ? file : null;
  };

  api.get('/applications/:id/cv', guard, (req, res) => {
    const id = parseId(req);
    const file = cvPath(id && store.getApplication(id));
    if (!file || !fs.existsSync(file)) return res.status(404).json({ message: 'No CV on file.' });
    res.set('X-Content-Type-Options', 'nosniff');
    res.download(file, store.getApplication(id).cv_original_name || path.basename(file));
  });

  api.delete('/applications/:id', guard, (req, res) => {
    const id = parseId(req);
    const row = id && store.getApplication(id);
    if (!row) return res.status(404).json({ message: 'Not found.' });
    const file = cvPath(row);
    if (file) fs.rmSync(file, { force: true });
    store.deleteApplication(id);
    res.status(204).end();
  });

  api.get('/subscribers', guard, (req, res) => res.json(store.listSubscribers(req.query)));

  api.get('/subscribers.csv', guard, (req, res) => {
    const rows = collectAll(store.listSubscribers);
    res
      .type('text/csv; charset=utf-8')
      .attachment('enz-subscribers.csv')
      .send(
        toCsv(
          [
            { header: 'Email', key: 'email' },
            { header: 'Subscribed (UTC)', key: 'created_at' },
          ],
          rows
        )
      );
  });

  api.delete('/subscribers/:id', guard, (req, res) => {
    const id = parseId(req);
    if (!id || !store.deleteSubscriber(id)) return res.status(404).json({ message: 'Not found.' });
    res.status(204).end();
  });

  // A consistent copy of the whole database. Railway volumes are not backed up
  // on every plan, so this is the reliable way to keep a copy off the server.
  api.get('/backup', guard, async (req, res, next) => {
    const tmp = path.join(os.tmpdir(), `enz-backup-${crypto.randomUUID()}.db`);
    try {
      await store.backupTo(tmp);
      const stamp = new Date().toISOString().slice(0, 10);
      res.download(tmp, `enz-backup-${stamp}.db`, (err) => {
        fs.rm(tmp, { force: true }, () => {});
        if (err && !res.headersSent) next(err);
      });
    } catch (err) {
      fs.rm(tmp, { force: true }, () => {});
      next(err);
    }
  });

  api.use((req, res) => res.status(404).json({ message: 'Not found.' }));

  // ==========================================================================
  // The page itself — mounted at /admin
  // ==========================================================================
  // A strict CSP: the page loads only its own script and stylesheet, which is
  // what stops a malicious enquiry from ever becoming script execution in the
  // admin's browser.
  const ui = express.Router();
  ui.use(guard);
  ui.use((req, res, next) => {
    res.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; " +
        "frame-ancestors 'none'; base-uri 'none'; form-action 'self'"
    );
    next();
  });
  ui.use(express.static(adminDir, { index: 'index.html', dotfiles: 'ignore', redirect: true }));

  return { api, ui };
}
