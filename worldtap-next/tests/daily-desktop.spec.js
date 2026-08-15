const {test,expect}=require('@playwright/test');

test.use({viewport:{width:1285,height:890},hasTouch:false,isMobile:false});

async function openFresh(page,url='http://127.0.0.1:8000/worldtap-next/daily-touch.html?desktop=4'){
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

async function expectDesktopPlayArea(page){
  const zoom=await page.evaluate(()=>window.__WORLDTAP_TEST__.map.getZoom());
  expect(zoom).toBeGreaterThanOrEqual(1.45);

  const mapBox=await page.locator('#map').boundingBox();
  const card=await page.locator('.question-card').boundingBox();
  const hint=await page.locator('#hintBtn').boundingBox();

  expect(mapBox.x).toBeGreaterThanOrEqual(450);
  expect(card.x+card.width+40).toBeLessThanOrEqual(mapBox.x);

  const mapCenter=mapBox.x+mapBox.width/2;
  const hintCenter=hint.x+hint.width/2;
  expect(Math.abs(mapCenter-hintCenter)).toBeLessThanOrEqual(8);
}

async function expectDesktopFlagReadable(page){
  const card=await page.locator('.question-card.flag-round').boundingBox();
  const stage=await page.locator('#flagHero').boundingBox();
  const img=await page.locator('#flagHero img').boundingBox();
  const mapBox=await page.locator('#map').boundingBox();
  const metrics=await page.locator('.metrics').boundingBox();

  expect(card.width).toBeGreaterThanOrEqual(380);
  expect(card.width).toBeLessThanOrEqual(480);
  expect(stage.width).toBeGreaterThanOrEqual(300);
  expect(stage.width).toBeLessThanOrEqual(370);
  expect(stage.height).toBeGreaterThanOrEqual(180);
  expect(stage.height).toBeLessThanOrEqual(220);
  expect(img.height).toBeGreaterThanOrEqual(150);
  expect(img.width).toBeGreaterThanOrEqual(115);

  expect(card.x+card.width+40).toBeLessThanOrEqual(mapBox.x);
  expect(card.x+card.width).toBeLessThan(metrics.x);

  const fontSize=await page.locator('#question').evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
  expect(fontSize).toBeGreaterThanOrEqual(27);
  const bgImage=await page.locator('#flagHero').evaluate(el=>getComputedStyle(el).backgroundImage);
  expect(bgImage).toContain('linear-gradient');
}

test('desktop reserves a safe play area for the globe',async({page})=>{
  await openFresh(page);
  await expectDesktopPlayArea(page);
  await reachFlagRound(page);
  await expectDesktopFlagReadable(page);
});

test('deployed desktop keeps the safe area and readable flag card',async({page})=>{
  await openFresh(page,'https://paksue.github.io/sand_box/worldtap-next/daily-touch.html?desktop=4');
  await expectDesktopPlayArea(page);
  await reachFlagRound(page);
  await expectDesktopFlagReadable(page);
});
