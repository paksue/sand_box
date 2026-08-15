const {test,expect}=require('@playwright/test');

test.use({viewport:{width:390,height:844},hasTouch:true,isMobile:true});

async function openFresh(page,url='http://127.0.0.1:8000/worldtap-next/daily-touch.html?integration=6'){
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

async function expectLandRendered(page){
  await page.waitForFunction(()=>{
    const map=window.__WORLDTAP_TEST__?.map;
    if(!map||!map.getLayer('land')) return false;
    try{return map.queryRenderedFeatures({layers:['land']}).length>0}catch{return false}
  },null,{timeout:15000});
  const count=await page.evaluate(()=>window.__WORLDTAP_TEST__.map.queryRenderedFeatures({layers:['land']}).length);
  expect(count).toBeGreaterThan(0);
}

async function answerRound(page){
  const canvas=page.locator('.maplibregl-canvas');
  const box=await canvas.boundingBox();
  await canvas.click({position:{x:box.width/2,y:box.height/2}});
  await expect(page.locator('#result')).toHaveClass(/show/,{timeout:15000});
}

async function expectFlagHero(page){
  await expect(page.locator('#category')).toHaveText('FLAG');
  await expect(page.locator('#question')).toHaveText('Which country is this?');
  await expect(page.locator('.question-card')).toHaveClass(/flag-round/);
  const hero=page.locator('#flagHero');
  await expect(hero).toHaveClass(/show/);
  const img=hero.locator('img');
  await expect(img).toHaveCount(1);
  await page.waitForFunction(()=>document.querySelector('#flagHero img')?.complete&&document.querySelector('#flagHero img')?.naturalWidth>0);
  const box=await img.boundingBox();
  expect(box.height).toBeGreaterThanOrEqual(80);
  expect(box.width).toBeGreaterThanOrEqual(70); // Nepal is intentionally narrower than rectangular flags.
  expect(box.width*box.height).toBeGreaterThanOrEqual(6000);
  const text=await page.locator('#question').textContent();
  const regionalIndicators=[...text].filter(ch=>{const n=ch.codePointAt(0);return n>=0x1F1E6&&n<=0x1F1FF});
  expect(regionalIndicators).toHaveLength(0);
}

test('Daily game renders land, large flag hero, saves two rounds, and resumes on round three',async({page})=>{
  await openFresh(page);
  await expectLandRendered(page);
  await answerRound(page);
  await page.locator('#nextBtn').click();
  await expect(page.locator('#roundLabel')).toHaveText('ROUND 2 / 5');
  await expectFlagHero(page);
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
  expect(state?.results||[]).toHaveLength(0);

  await page.waitForTimeout(300);
  await canvas.click({position:{x:box.width/2,y:box.height/2}});
  await expect(page.locator('#result')).toHaveClass(/show/,{timeout:15000});
  state=await page.evaluate(()=>window.__WORLDTAP_TEST__.state);
  expect(state.results).toHaveLength(1);
});

test('deployed page renders countries and a phone-sized SVG flag hero',async({page})=>{
  await openFresh(page,'https://paksue.github.io/sand_box/worldtap-next/daily-touch.html?integration=6');
  await expectLandRendered(page);
  await answerRound(page);
  await page.locator('#nextBtn').click();
  await expect(page.locator('#roundLabel')).toHaveText('ROUND 2 / 5');
  await expectFlagHero(page);
});
