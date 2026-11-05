// Shared test harness: boots the real app on a throwaway SQLite file.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createApp } from '../app.js';
import { loadConfig } from '../config.js';

export const PASSWORD = 's3cret-test-password';
export const basic = (user, pass) => 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
export const AUTH = { Authorization: basic('admin', PASSWORD) };

const HIGH = { windowMs: 60_000, limit: 10_000 };
export const NO_LIMITS = { bookings: HIGH, newsletter: HIGH, careers: HIGH, testimonials: HIGH, adminFailures: HIGH };

export function fakeNotifier() {
  return {
    configured: true,
    calls: [],
    async send(message) {
      this.calls.push(message);
      return { status: 'sent' };
    },
  };
}

export async function waitFor(check, ms = 2000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (check()) return;
    await new Promise((r) => setTimeout(r, 10));
  }
  throw new Error('timed out waiting for condition');
}

export async function boot(overrides = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'enz-test-'));
  const config = loadConfig(
    {},
    {
      dbPath: path.join(dir, 'test.db'),
      uploadDir: path.join(dir, 'uploads'),
      adminPassword: PASSWORD,
      rateLimits: NO_LIMITS,
      ...overrides,
    }
  );
  const notifier = fakeNotifier();
  const quiet = { log() {}, error() {}, warn() {} };
  const built = createApp(config, { notifier, log: quiet });
  const server = await new Promise((resolve) => {
    const s = built.app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const json = (method) => (p, body, headers = {}) =>
    fetch(base + p, { method, headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
  return {
    base,
    config,
    notifier,
    store: built.store,
    get: (p, init = {}) => fetch(base + p, { redirect: 'manual', ...init }),
    post: json('POST'),
    patch: json('PATCH'),
    del: (p, headers = {}) => fetch(base + p, { method: 'DELETE', headers }),
    async stop() {
      await new Promise((r) => server.close(r));
      await built.close();
      fs.rmSync(dir, { recursive: true, force: true });
    },
  };
}
