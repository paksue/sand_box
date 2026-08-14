const { test, expect } = require('@playwright/test');

test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true
});

async function verifyPlayFlow(page, url) {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const play = page.locator('#playBtn');
  await expect(play).toBeVisible();
  await expect(page.locator('#summary')).toBeHidden();
  await play.click();

  await expect(page.locator('#intro')).toHaveClass(/hidden/, { timeout: 30000 });
  await expect(page.locator('#topbar')).toHaveClass(/show/);
  await expect(page.locator('#roundLabel')).toHaveText('ROUND 1 / 5');
  await expect(page.locator('#question')).toContainText('Nairobi');
  await expect(page.locator('#zoompad')).toHaveClass(/show/);

  if (pageErrors.length) {
    throw new Error(`Browser page errors:\n${pageErrors.join('\n')}`);
  }
}

test('Play Today works in local repository build', async ({ page }) => {
  await verifyPlayFlow(page, 'http://127.0.0.1:8000/worldtap-next/daily-touch.html?smoke=3');
});

test('Play Today works on deployed GitHub Pages build', async ({ page }) => {
  await verifyPlayFlow(page, 'https://paksue.github.io/sand_box/worldtap-next/daily-touch.html?smoke=3');
});
