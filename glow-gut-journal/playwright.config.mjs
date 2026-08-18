import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: /playtest\.spec\.mjs/,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true
  },
  webServer: {
    command: 'python3 -m http.server 4173',
    cwd: '.',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 20_000
  }
});
