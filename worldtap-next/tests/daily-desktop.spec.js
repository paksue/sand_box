const {test,expect}=require('@playwright/test');

test.use({viewport:{width:1285,height:890},hasTouch:false,isMobile:false});

async function openFresh(page,url='http://127.0.0.1:8000/worldtap-next/daily-touch.html?desktop=1'){
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

async function expectDesktopFlagReadable(page){
  const card=await page.locator('.question-card.flag-round').boundingBox();
  const img=await page.locator('#flagHero img').boundingBox();
  const metrics=await page.locator('.metrics').boundingBox();
  expect(card.width).toBeGreaterThanOrEqual(600);
  expect(img.height).toBeGreaterThanOrEqual(170);
  expect(img.width).toBeGreaterThanOrEqual(140);
  expect(card.x+card.width).toBeLessThan(metrics.x);
  const fontSize=await page.locator('#question').evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
  expect(fontSize).toBeGreaterThanOrEqual(30);
}

test('desktop flag round scales the visual clue instead of keeping phone dimensions',async({page})=>{
  await openFresh(page);
  await reachFlagRound(page);
  await expectDesktopFlagReadable(page);
});

test('deployed desktop flag round is readable',async({page})=>{
  await openFresh(page,'https://paksue.github.io/sand_box/worldtap-next/daily-touch.html?desktop=1');
  await reachFlagRound(page);
  await expectDesktopFlagReadable(page);
});
