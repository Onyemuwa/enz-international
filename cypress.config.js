import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // 127.0.0.1 rather than 'localhost' — avoids IPv4/IPv6 resolution mismatches
    // between Cypress and the preview server on some Windows setups.
    baseUrl: 'http://127.0.0.1:4173',
    // Above Tailwind's `lg:` breakpoint (1024px) — the header's desktop nav
    // (`hidden lg:flex`) only renders at this width; the mobile menu is a
    // separate component with its own markup, not covered by these specs.
    viewportWidth: 1280,
    viewportHeight: 800,
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on) {
      // GPU access is unavailable in sandboxed/headless CI environments —
      // force software rendering so Chromium doesn't crash on launch.
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium') {
          launchOptions.args.push('--disable-gpu', '--disable-software-rasterizer', '--no-sandbox');
        }
        return launchOptions;
      });
    },
  },
});
