import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { createApp } from '../app.js';
import { db } from '../db/index.js';

const app = createApp();

describe('POST /api/bookings', () => {
  it('accepts a valid booking and persists it', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({ name: 'Jane Doe', email: 'jane@example.com', date: '2026-09-01', service: 'sourcing' });

    assert.equal(res.status, 201);
    assert.equal(res.body.status, 'received');

    const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(res.body.id);
    assert.equal(row.email, 'jane@example.com');
  });

  it('rejects a booking missing required fields', async () => {
    const res = await request(app).post('/api/bookings').send({ name: 'No Email' });
    assert.equal(res.status, 400);
  });
});

describe('POST /api/newsletter', () => {
  it('subscribes a new email', async () => {
    const res = await request(app).post('/api/newsletter').send({ email: 'sub@example.com' });
    assert.equal(res.status, 201);
    assert.equal(res.body.status, 'subscribed');
  });

  it('is idempotent for an already-subscribed email', async () => {
    await request(app).post('/api/newsletter').send({ email: 'dup@example.com' });
    const res = await request(app).post('/api/newsletter').send({ email: 'dup@example.com' });
    assert.equal(res.status, 201);
  });

  it('rejects an invalid email', async () => {
    const res = await request(app).post('/api/newsletter').send({ email: 'not-an-email' });
    assert.equal(res.status, 400);
  });
});

describe('POST /api/auth/login', () => {
  const email = 'portal-user@example.com';
  const password = 'correct-horse-battery-staple';

  it('rejects credentials for a user that does not exist', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nobody@example.com', password: 'whatever' });
    assert.equal(res.status, 401);
  });

  it('rejects a wrong password for a real user', async () => {
    db.prepare('INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)').run(
      randomUUID(),
      email,
      bcrypt.hashSync(password, 4),
      'Portal User'
    );
    const res = await request(app).post('/api/auth/login').send({ email, password: 'wrong-password' });
    assert.equal(res.status, 401);
  });

  it('issues a token for correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password });
    assert.equal(res.status, 200);
    assert.ok(res.body.token);
    assert.equal(res.body.user.email, email);
  });
});

describe('POST /api/careers/applications', () => {
  it('accepts an application without a CV attached', async () => {
    const res = await request(app)
      .post('/api/careers/applications')
      .field('name', 'Applicant Name')
      .field('email', 'applicant@example.com')
      .field('message', 'Interested in sourcing roles.');
    assert.equal(res.status, 201);
    assert.equal(res.body.status, 'received');
  });

  it('rejects a non-PDF file', async () => {
    const res = await request(app)
      .post('/api/careers/applications')
      .field('name', 'Applicant Name')
      .field('email', 'applicant@example.com')
      .attach('cv', Buffer.from('not a pdf'), { filename: 'resume.txt', contentType: 'text/plain' });
    assert.equal(res.status, 400);
  });
});
