import 'dotenv/config';
import { createApp } from './app.js';

const isDev = process.env.NODE_ENV !== 'production';

if (!process.env.JWT_SECRET || (process.env.JWT_SECRET === 'dev-only-insecure-secret-change-me' && !isDev)) {
  console.error('JWT_SECRET must be set to a real secret in production (see .env.example). Refusing to start.');
  process.exit(1);
}

const app = createApp();
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`ENZ INTERNATIONAL API listening on http://localhost:${port}`);
});
