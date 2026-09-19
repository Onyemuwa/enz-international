// Entry point: `npm start`.
import { createApp } from './app.js';
import { loadConfig } from './config.js';

const config = loadConfig();
const { app, close } = createApp(config);

// Railway routes to the container on $PORT and needs the process to listen on
// all interfaces, not just localhost.
const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`[server] listening on :${config.port} (${config.isProd ? 'production' : 'development'})`);
  console.log(`[server] database: ${config.dbPath}`);
  console.log(`[server] admin: ${config.adminPassword ? 'enabled at /admin/' : 'DISABLED — set ADMIN_PASSWORD'}`);
  console.log(
    `[server] email notifications: ${
      config.resendApiKey ? `on -> ${config.notifyTo.join(', ')}` : 'off — set RESEND_API_KEY (enquiries are still saved)'
    }`
  );
  if (config.storageIsEphemeral) {
    console.warn(
      '\n[server] WARNING: no persistent storage is attached. The database lives on the container\'s own\n' +
        '[server] filesystem, which Railway erases on every deploy — every enquiry would be lost.\n' +
        '[server] Attach a Volume (mount path /data) to this service and redeploy.\n'
    );
  }
});

// Railway sends SIGTERM on every deploy. Stop taking connections, let
// in-flight notification emails finish, close the database cleanly.
let closing = false;
async function shutdown(signal) {
  if (closing) return;
  closing = true;
  console.log(`[server] ${signal} received, shutting down`);
  server.close(async () => {
    await close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
