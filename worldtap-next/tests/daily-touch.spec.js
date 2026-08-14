const { test, expect } = require('@playwright/test');

test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true
});

test('Play Today enters round one on a phone-sized browser', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('http://127.0.0.1:8000/worldtap-next/daily-touch.html?smoke=1', {
    waitUntil: 'domcontentloaded'
  });

  const play = page.locator('#playBtn');
  await expect(play).toBeVisible();
  await play.click();

  // The click may be queued while MapLibre/Three finish loading, but it must
  // eventually transition into the playable first round.
  await expect(page.locator('#intro')).toHaveClass(/hidden/, { timeout: 30000 });
  await expect(page.locator('#topbar')).toHaveClass(/show/);
  await expect(page.locator('#roundLabel')).toHaveText('ROUND 1 / 5');
  await expect(page.locator('#question')).toContainText('Nairobi');
  await expect(page.locator('#zoompad')).toHaveClass(/show/);

  if (pageErrors.length) {
    throw new Error(`Browser page errors:\n${pageErrors.join('\n')}`);
  }
});
