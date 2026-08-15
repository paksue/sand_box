const {test,expect}=require('@playwright/test');

test.use({viewport:{width:1285,height:890},hasTouch:false,isMobile:false});

async function openFresh(page,url='http://127.0.0.1:8000/worldtap-next/daily-touch.html?desktop=2'){
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('#playBtn')).toBeVisible();
  await page.locator('#playBtn').click();
  await expect(page.locator('#intro')).toHaveClass(/hidden/,{timeout:30000});
  await page.waitForFunction(()=>window.__WORLDTAP_TEST__?.map);
  await page.waitForTimeout(700);
}

async function answerRound(page){
  const canvas=page.locator('.maplibregl-canvas');
  const box=await canvas.boundingBox();
  await canvas.click({position:{x:box.width/2,y:box.height/2}});
  await expect(page.locator('#result')).toHaveClass(/show/,{timeout:15000});
}

async function reachFlagRound(page){
  await answerRound(page);
  await page.locator('#nextBtn').click();
  await expect(page.locator('#roundLabel')).toHaveText('ROUND 2 / 5');
  await expect(page.locator('#category')).toHaveText('FLAG');
  await expect(page.locator('#question')).toHaveText('Which country is this?');
  await page.waitForFunction(()=>document.querySelector('#flagHero img')?.complete&&document.querySelector('#flagHero img')?.naturalWidth>0);
}

async function expectDesktopHomeGlobe(page){
  const zoom=await page.evaluate(()=>window.__WORLDTAP_TEST__.map.getZoom());
  expect(zoom).toBeGreaterThanOrEqual(1.25);
}

async function expectDesktopFlagReadable(page){
  const card=await page.locator('.question-card.flag-round').boundingBox();
  const stage=await page.locator('#flagHero').boundingBox();
  const img=await page.locator('#flagHero img').boundingBox();
  const metrics=await page.locator('.metrics').boundingBox();
  expect(card.width).toBeGreaterThanOrEqual(600);
  expect(stage.width).toBeGreaterThanOrEqual(380);
  expect(stage.height).toBeGreaterThanOrEqual(225);
  expect(img.height).toBeGreaterThanOrEqual(170);
  expect(img.width).toBeGreaterThanOrEqual(130);
  expect(card.x+card.width).toBeLessThan(metrics.x);
  const fontSize=await page.locator('#question').evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
  expect(fontSize).toBeGreaterThanOrEqual(30);
  const bg=await page.locator('#flagHero').evaluate(el=>getComputedStyle(el).backgroundImage+' '+getComputedStyle(el).backgroundColor);
  expect(bg).not.toContain('rgba(0, 0, 0, 0)');
}

test('desktop starts with a larger globe and uses a high-contrast flag display card',async({page})=>{
  await openFresh(page);
  await expectDesktopHomeGlobe(page);
  await reachFlagRound(page);
  await expectDesktopFlagReadable(page);
});

test('deployed desktop keeps the larger globe and readable flag card',async({page})=>{
  await openFresh(page,'https://paksue.github.io/sand_box/worldtap-next/daily-touch.html?desktop=2');
  await expectDesktopHomeGlobe(page);
  await reachFlagRound(page);
  await expectDesktopFlagReadable(page);
});
