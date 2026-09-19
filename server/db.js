// SQLite storage. One file, opened once, all SQL in this module.
//
// better-sqlite3 is synchronous by design: a call returns when the row is on
// disk, which for a low-traffic enquiry form is exactly the property wanted —
// when the API says an enquiry was received, it was written.
import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

export const STATUSES = ['new', 'contacted', 'closed'];

// Schema changes go here as new entries, never as edits to old ones: a
// migration that has already run on the live database must not change.
const MIGRATIONS = [
  {
    version: 1,
    sql: `
      CREATE TABLE inquiries (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        kind           TEXT NOT NULL CHECK (kind IN ('consultation', 'quote')),
        name           TEXT NOT NULL,
        email          TEXT NOT NULL,
        phone          TEXT NOT NULL DEFAULT '',
        company        TEXT NOT NULL DEFAULT '',
        preferred_date TEXT NOT NULL DEFAULT '',
        service        TEXT NOT NULL DEFAULT '',
        product        TEXT NOT NULL DEFAULT '',
        message        TEXT NOT NULL DEFAULT '',
        status         TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
        notes          TEXT NOT NULL DEFAULT '',
        notify_status  TEXT NOT NULL DEFAULT 'pending',
        notify_error   TEXT NOT NULL DEFAULT '',
        created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );
      CREATE INDEX idx_inquiries_status_created ON inquiries (status, created_at DESC);
      CREATE INDEX idx_inquiries_email ON inquiries (email);

      CREATE TABLE subscribers (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        email      TEXT NOT NULL UNIQUE COLLATE NOCASE,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );

      CREATE TABLE applications (
        id               INTEGER PRIMARY KEY AUTOINCREMENT,
        name             TEXT NOT NULL,
        email            TEXT NOT NULL,
        message          TEXT NOT NULL DEFAULT '',
        cv_original_name TEXT NOT NULL DEFAULT '',
        cv_stored_name   TEXT NOT NULL DEFAULT '',
        cv_size          INTEGER NOT NULL DEFAULT 0,
        status           TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
        notes            TEXT NOT NULL DEFAULT '',
        notify_status    TEXT NOT NULL DEFAULT 'pending',
        notify_error     TEXT NOT NULL DEFAULT '',
        created_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );
      CREATE INDEX idx_applications_created ON applications (created_at DESC);
    `,
  },
];

function migrate(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version    INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  )`);
  const done = new Set(db.prepare('SELECT version FROM schema_migrations').all().map((r) => r.version));
  for (const m of MIGRATIONS) {
    if (done.has(m.version)) continue;
    db.transaction(() => {
      db.exec(m.sql);
      db.prepare('INSERT INTO schema_migrations (version) VALUES (?)').run(m.version);
    })();
  }
}

export function openDb(dbPath) {
  if (dbPath !== ':memory:') fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000');
  migrate(db);
  return db;
}

// LIKE treats % and _ as wildcards; a search for "50%" should find "50%".
const likeEscape = (s) => s.replace(/[\\%_]/g, (c) => '\\' + c);

const clampLimit = (n, fallback = 50) => Math.min(Math.max(parseInt(n, 10) || fallback, 1), 200);
const clampOffset = (n) => Math.max(parseInt(n, 10) || 0, 0);

export function createStore(db) {
  const s = {
    insertInquiry: db.prepare(`
      INSERT INTO inquiries (kind, name, email, phone, company, preferred_date, service, product, message)
      VALUES (@kind, @name, @email, @phone, @company, @preferred_date, @service, @product, @message)`),
    // The same person sending the same message twice within minutes is a
    // double-click or a retry after a dropped connection, not two enquiries.
    findRecentDuplicate: db.prepare(`
      SELECT id FROM inquiries
      WHERE email = ? AND message = ? AND product = ? AND name = ?
        AND created_at > strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-10 minutes')
      ORDER BY id DESC LIMIT 1`),
    setInquiryNotify: db.prepare('UPDATE inquiries SET notify_status = ?, notify_error = ? WHERE id = ?'),
    getInquiry: db.prepare('SELECT * FROM inquiries WHERE id = ?'),
    deleteInquiry: db.prepare('DELETE FROM inquiries WHERE id = ?'),

    insertApplication: db.prepare(`
      INSERT INTO applications (name, email, message, cv_original_name, cv_stored_name, cv_size)
      VALUES (@name, @email, @message, @cv_original_name, @cv_stored_name, @cv_size)`),
    setApplicationNotify: db.prepare('UPDATE applications SET notify_status = ?, notify_error = ? WHERE id = ?'),
    getApplication: db.prepare('SELECT * FROM applications WHERE id = ?'),
    deleteApplication: db.prepare('DELETE FROM applications WHERE id = ?'),

    upsertSubscriber: db.prepare('INSERT OR IGNORE INTO subscribers (email) VALUES (?)'),
    deleteSubscriber: db.prepare('DELETE FROM subscribers WHERE id = ?'),
  };

  // Builds "WHERE ..." for the list endpoints from an optional status and search.
  function where({ status, q }, searchColumns) {
    const clauses = [];
    const params = {};
    if (status && STATUSES.includes(status)) {
      clauses.push('status = @status');
      params.status = status;
    }
    const term = String(q || '').trim();
    if (term) {
      params.q = `%${likeEscape(term)}%`;
      clauses.push('(' + searchColumns.map((c) => `${c} LIKE @q ESCAPE '\\'`).join(' OR ') + ')');
    }
    return { sql: clauses.length ? 'WHERE ' + clauses.join(' AND ') : '', params };
  }

  return {
    // -- inquiries -----------------------------------------------------------
    createInquiry(data) {
      const dup = s.findRecentDuplicate.get(data.email, data.message, data.product, data.name);
      if (dup) return { id: dup.id, duplicate: true };
      const info = s.insertInquiry.run(data);
      return { id: Number(info.lastInsertRowid), duplicate: false };
    },
    getInquiry: (id) => s.getInquiry.get(id),
    setInquiryNotify: (id, status, error = '') => s.setInquiryNotify.run(status, String(error).slice(0, 500), id),
    listInquiries(filter = {}) {
      const cols = ['name', 'email', 'phone', 'company', 'product', 'message', 'service'];
      const w = where(filter, cols);
      const rows = db
        .prepare(`SELECT * FROM inquiries ${w.sql} ORDER BY created_at DESC, id DESC LIMIT @limit OFFSET @offset`)
        .all({ ...w.params, limit: clampLimit(filter.limit), offset: clampOffset(filter.offset) });
      const total = db.prepare(`SELECT COUNT(*) AS n FROM inquiries ${w.sql}`).get(w.params).n;
      return { rows, total };
    },
    updateInquiry(id, { status, notes }) {
      const sets = [];
      const params = { id };
      if (status !== undefined) {
        sets.push('status = @status');
        params.status = status;
      }
      if (notes !== undefined) {
        sets.push('notes = @notes');
        params.notes = notes;
      }
      if (!sets.length) return s.getInquiry.get(id);
      sets.push("updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')");
      db.prepare(`UPDATE inquiries SET ${sets.join(', ')} WHERE id = @id`).run(params);
      return s.getInquiry.get(id);
    },
    deleteInquiry: (id) => s.deleteInquiry.run(id).changes > 0,

    // -- subscribers ---------------------------------------------------------
    addSubscriber: (email) => s.upsertSubscriber.run(email).changes > 0,
    listSubscribers(filter = {}) {
      const w = where({ q: filter.q }, ['email']);
      const rows = db
        .prepare(`SELECT * FROM subscribers ${w.sql} ORDER BY created_at DESC, id DESC LIMIT @limit OFFSET @offset`)
        .all({ ...w.params, limit: clampLimit(filter.limit, 100), offset: clampOffset(filter.offset) });
      const total = db.prepare(`SELECT COUNT(*) AS n FROM subscribers ${w.sql}`).get(w.params).n;
      return { rows, total };
    },
    deleteSubscriber: (id) => s.deleteSubscriber.run(id).changes > 0,

    // -- applications --------------------------------------------------------
    createApplication(data) {
      const info = s.insertApplication.run(data);
      return { id: Number(info.lastInsertRowid) };
    },
    getApplication: (id) => s.getApplication.get(id),
    setApplicationNotify: (id, status, error = '') => s.setApplicationNotify.run(status, String(error).slice(0, 500), id),
    listApplications(filter = {}) {
      const w = where(filter, ['name', 'email', 'message']);
      const rows = db
        .prepare(`SELECT * FROM applications ${w.sql} ORDER BY created_at DESC, id DESC LIMIT @limit OFFSET @offset`)
        .all({ ...w.params, limit: clampLimit(filter.limit), offset: clampOffset(filter.offset) });
      const total = db.prepare(`SELECT COUNT(*) AS n FROM applications ${w.sql}`).get(w.params).n;
      return { rows, total };
    },
    updateApplication(id, { status, notes }) {
      const sets = [];
      const params = { id };
      if (status !== undefined) {
        sets.push('status = @status');
        params.status = status;
      }
      if (notes !== undefined) {
        sets.push('notes = @notes');
        params.notes = notes;
      }
      if (!sets.length) return s.getApplication.get(id);
      sets.push("updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')");
      db.prepare(`UPDATE applications SET ${sets.join(', ')} WHERE id = @id`).run(params);
      return s.getApplication.get(id);
    },
    deleteApplication: (id) => s.deleteApplication.run(id).changes > 0,

    // -- dashboard -----------------------------------------------------------
    summary() {
      const byStatus = (table) =>
        Object.fromEntries(
          db.prepare(`SELECT status, COUNT(*) AS n FROM ${table} GROUP BY status`).all().map((r) => [r.status, r.n])
        );
      return {
        inquiries: byStatus('inquiries'),
        applications: byStatus('applications'),
        subscribers: db.prepare('SELECT COUNT(*) AS n FROM subscribers').get().n,
        notifyFailures: db
          .prepare(
            `SELECT
               (SELECT COUNT(*) FROM inquiries WHERE notify_status = 'failed') +
               (SELECT COUNT(*) FROM applications WHERE notify_status = 'failed') AS n`
          )
          .get().n,
      };
    },

    // A consistent snapshot even while the database is in use (a plain file
    // copy of a WAL-mode database can be torn).
    backupTo: (destPath) => db.backup(destPath),
    ping: () => db.prepare('SELECT 1 AS ok').get().ok === 1,
    close: () => db.close(),
  };
}
