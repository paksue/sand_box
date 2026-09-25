import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./tests',timeout:30000,use:{baseURL:process.env.RC_EXPLORER_URL||'http://127.0.0.1:4182',viewport:{width:1440,height:900}}});
