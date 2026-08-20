// Uses Node's built-in sqlite module (stable since Node 22.5, no native/node-gyp
// build step required) rather than better-sqlite3, which needs a Python/C++
// toolchain to compile on install — this keeps `npm install` working out of
// the box on a bare machine. Requires Node >= 22.5 (see package.json engines).
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { mkdirSync } from 'node:fs';

const dataDir =
  process.env.SQLITE_DIR || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../data');
mkdirSync(dataDir, { recursive: true });

export const db = new DatabaseSync(path.join(dataDir, 'enz.sqlite3'));
db.exec('PRAGMA journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    date TEXT NOT NULL,
    service TEXT,
    message TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS career_applications (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT,
    cv_filename TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export default db;
