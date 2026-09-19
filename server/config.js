// Everything the server reads from the environment, in one place.
//
// Nothing here has a secret default. ADMIN_PASSWORD and RESEND_API_KEY are
// simply empty until set, and the features that need them switch themselves
// off rather than falling back to something guessable — see admin.js and
// notify.js.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Repo root. The generated site IS the repo, so static files are served from here. */
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const list = (value) =>
  String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

export function loadConfig(env = process.env, overrides = {}) {
  const siteUrl = (env.SITE_URL || 'https://enzinternational.co').replace(/\/+$/, '');
  const onRailway = Boolean(env.RAILWAY_ENVIRONMENT || env.RAILWAY_PROJECT_ID);

  // ---- Where the data lives -------------------------------------------------
  // SQLite is a file, and a Railway container's own filesystem is wiped on every
  // deploy. Persistence therefore depends on a Railway Volume being attached,
  // which sets RAILWAY_VOLUME_MOUNT_PATH automatically. That variable (or an
  // explicit DATA_DIR / DATABASE_PATH) is what puts the database somewhere
  // that survives a redeploy.
  const baseDir = path.resolve(
    env.DATA_DIR ||
      env.RAILWAY_VOLUME_MOUNT_PATH ||
      (env.DATABASE_PATH ? path.dirname(env.DATABASE_PATH) : path.join(ROOT, 'data'))
  );
  const storageIsExplicit = Boolean(env.DATA_DIR || env.DATABASE_PATH || env.RAILWAY_VOLUME_MOUNT_PATH);

  const config = {
    root: ROOT,
    port: Number(env.PORT) || 3000,
    isProd: env.NODE_ENV === 'production' || onRailway,

    dbPath: path.resolve(env.DATABASE_PATH || path.join(baseDir, 'enz.db')),
    uploadDir: path.resolve(env.UPLOAD_DIR || path.join(baseDir, 'uploads')),
    // True when we are on Railway with nothing persistent attached: the site
    // works, but every redeploy silently erases every enquiry. The admin page
    // shows a banner for this and the server logs it loudly at start-up.
    storageIsEphemeral: onRailway && !storageIsExplicit,

    siteUrl,
    canonicalHost: new URL(siteUrl).host,
    // Vercel used to redirect www -> apex; on Railway the app has to.
    redirectWww: env.REDIRECT_WWW !== 'false',
    forceHttps: env.FORCE_HTTPS ? env.FORCE_HTTPS !== 'false' : onRailway,
    // Railway sits behind exactly one proxy hop.
    trustProxy: env.TRUST_PROXY === undefined ? 1 : Number(env.TRUST_PROXY),

    // Empty by default: the site and the API share an origin, so no CORS is
    // needed. Set this only if the static site stays somewhere else (e.g.
    // Vercel) and calls this server cross-origin.
    allowedOrigins: list(env.ALLOWED_ORIGINS),

    adminUser: env.ADMIN_USER || 'admin',
    adminPassword: env.ADMIN_PASSWORD || '',

    // Email notification through Resend's HTTPS API. Railway blocks outbound
    // SMTP on its lower plans, so an HTTP API is the dependable choice.
    resendApiKey: env.RESEND_API_KEY || '',
    notifyTo: list(env.NOTIFY_TO || env.CONTACT_EMAIL || 'info@enzinternational.co'),
    notifyFrom: env.NOTIFY_FROM || 'ENZ Website <onboarding@resend.dev>',

    maxCvBytes: 5 * 1024 * 1024,
    // Per-IP limits. Overridable so tests are not throttled by their own traffic.
    rateLimits: {
      bookings: { windowMs: 15 * 60 * 1000, limit: 8 },
      newsletter: { windowMs: 60 * 60 * 1000, limit: 10 },
      careers: { windowMs: 60 * 60 * 1000, limit: 5 },
      adminFailures: { windowMs: 15 * 60 * 1000, limit: 10 },
    },
  };

  return { ...config, ...overrides };
}
