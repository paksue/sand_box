import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 30_000,
  workers: 1,
  reporter: 'line',
  use: {
    baseURL: process.env.TAG_ARENA_URL ?? 'http://127.0.0.1:4178',
    viewport: { width: 1100, height: 760 },
  },
});
