// Builds the Express app. A factory, not a module-level singleton, so the tests
// can start a fresh app on a throwaway database.
import fs from 'node:fs';
import path from 'node:path';
import compression from 'compression';
import express from 'express';
import { createAdmin } from './admin.js';
import { createApiRouter } from './api.js';
import { createStore, openDb } from './db.js';
import { createNotifier } from './notify.js';
import { canonicalRedirects, createSiteRouter, legacyRedirects, securityHeaders } from './site.js';

export function createApp(config, { notifier, log = console } = {}) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
  const db = openDb(config.dbPath);
  const store = createStore(db);
  notifier = notifier || createNotifier(config, log);

  // Notifications run after the response is sent. They are tracked so a
  // shutdown can wait for them instead of dropping an enquiry's email.
  const pending = new Set();
  const track = (promise) => {
    pending.add(promise);
    promise.finally(() => pending.delete(promise));
  };

  const adminDir = path.join(config.root, 'server', 'admin');
  const admin = createAdmin({ config, store, notifier, adminDir });

  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', config.trustProxy);

  app.use(canonicalRedirects(config));
  app.use(securityHeaders(config));
  app.use(compression());

  app.use('/api', createApiRouter({ config, store, notifier, adminRouter: admin.api, track }));
  app.use('/admin', admin.ui);

  app.use(legacyRedirects());
  app.use(createSiteRouter({ root: config.root }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    log.error('[server] unhandled error:', err);
    if (res.headersSent) return;
    res.status(500).type('text/plain').send('Something went wrong.');
  });

  return {
    app,
    store,
    async close() {
      await Promise.allSettled([...pending]);
      store.close();
    },
  };
}
