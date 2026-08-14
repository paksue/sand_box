const {test,expect}=require('@playwright/test');

test.use({viewport:{width:390,height:844},hasTouch:true,isMobile:true});

async function openFresh(page,url='http://127.0.0.1:8000/worldtap-next/daily-touch.html?integration=1'){
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('#playBtn')).toBeVisible();
  await page.locator('#playBtn').click();
  await expect(page.locator('#intro')).toHaveClass(/hidden/,{timeout:30000});
  await expect(page.locator('#roundLabel')).toHaveText('ROUND 1 / 5');
  await page.waitForFunction(()=>window.__WORLDTAP_TEST__?.map);
  await page.waitForTimeout(700);
}

async function answerRound(page){
  const canvas=page.locator('.maplibregl-canvas');
  const box=await canvas.boundingBox();
  await canvas.click({position:{x:box.width/2,y:box.height/2}});
  await expect(page.locator('#result')).toHaveClass(/show/,{timeout:15000});
}

test('Daily game saves two real rounds and resumes on round three',async({page})=>{
  await openFresh(page);
  await answerRound(page);
  await page.locator('#nextBtn').click();
  await expect(page.locator('#roundLabel')).toHaveText('ROUND 2 / 5');
  await page.waitForTimeout(700);
  await answerRound(page);

  const before=await page.evaluate(()=>window.__WORLDTAP_TEST__.state);
  expect(before.results).toHaveLength(2);
  expect(before.index).toBe(2);
  expect(before.total).toBeGreaterThanOrEqual(0);

  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('#playBtn')).toContainText('RESUME · ROUND 3/5');
  await page.locator('#playBtn').click();
  await expect(page.locator('#roundLabel')).toHaveText('ROUND 3 / 5',{timeout:30000});
  const after=await page.evaluate(()=>window.__WORLDTAP_TEST__.state);
  expect(after.results).toHaveLength(2);
  expect(after.total).toBe(before.total);
  await expect(page.locator('#runningTotal')).toHaveText(String(before.total));
});

test('tap immediately after globe movement is rejected, settled tap is accepted',async({page})=>{
  await openFresh(page);
  await page.evaluate(()=>{const m=window.__WORLDTAP_TEST__.map;m.fire('dragstart');m.fire('dragend')});
  const canvas=page.locator('.maplibregl-canvas');
  const box=await canvas.boundingBox();
  await canvas.click({position:{x:box.width/2,y:box.height/2}});
  await page.waitForTimeout(200);
  let state=await page.evaluate(()=>window.__WORLDTAP_TEST__.state);
  expect(state.results).toHaveLength(0);
  await expect(page.locator('#subtext')).toContainText('still moving');

  await page.waitForTimeout(300);
  await canvas.click({position:{x:box.width/2,y:box.height/2}});
  await expect(page.locator('#result')).toHaveClass(/show/,{timeout:15000});
  state=await page.evaluate(()=>window.__WORLDTAP_TEST__.state);
  expect(state.results).toHaveLength(1);
});

test('deployed page boots and Play Today enters a daily round',async({page})=>{
  await page.goto('https://paksue.github.io/sand_box/worldtap-next/daily-touch.html?integration=1',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('#playBtn')).toBeVisible();
  await page.locator('#playBtn').click();
  await expect(page.locator('#intro')).toHaveClass(/hidden/,{timeout:30000});
  await expect(page.locator('#roundLabel')).toHaveText('ROUND 1 / 5');
});
