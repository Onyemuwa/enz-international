// Creates or updates a client-portal login from SEED_ADMIN_* env vars.
// Run with: npm run seed:admin
// There is no self-serve signup by design — portal accounts are provisioned by ENZ staff.

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { db } from './index.js';

const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;
const name = process.env.SEED_ADMIN_NAME || 'Client';

if (!email || !password) {
  console.error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set (see .env.example).');
  process.exit(1);
}
if (password.length < 8) {
  console.error('SEED_ADMIN_PASSWORD must be at least 8 characters.');
  process.exit(1);
}

const passwordHash = bcrypt.hashSync(password, 12);
const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

if (existing) {
  db.prepare('UPDATE users SET password_hash = ?, name = ? WHERE email = ?').run(passwordHash, name, email);
  console.log(`Updated existing user: ${email}`);
} else {
  db.prepare('INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)').run(
    randomUUID(),
    email,
    passwordHash,
    name
  );
  console.log(`Created user: ${email}`);
}
