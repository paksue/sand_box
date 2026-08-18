import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: /(?:playtest|round2)\.spec\.mjs/,
  timeout: 35_000,
  expect: { timeout: 6_000 },
  use: {
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'python3 -m http.server 4173',
    cwd: '.',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 20_000
  }
});
