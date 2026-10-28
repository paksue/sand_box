import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 testDir:'tests',timeout:30000,retries:1,reporter:'line',
 use:{baseURL:'http://127.0.0.1:5173',trace:'retain-on-failure',...devices['Desktop Chrome'],launchOptions:{args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}},
 webServer:{command:'npm run dev -- --host 127.0.0.1',url:'http://127.0.0.1:5173',reuseExistingServer:!process.env.CI,timeout:120000}
});