import { test, expect } from '@playwright/test';

test('boots, exposes deterministic debug API, drives and renders', async ({page})=>{
  const errors=[];page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/?manual=1');await expect(page.locator('#loading')).toHaveClass(/hidden/,{timeout:5000});
  expect(await page.evaluate(()=>window.__RC_EXPLORER__?.ready)).toBe(true);

  const before=await page.evaluate(()=>window.__RC_EXPLORER__.snapshot().car.position);
  const after=await page.evaluate(()=>window.__RC_EXPLORER__.step(120,{throttle:.8,brake:0,steer:.15}));
  expect(Math.hypot(after.position.x-before.x,after.position.z-before.z)).toBeGreaterThan(2);
  expect(after.battery).toBeLessThan(1);

  await page.evaluate(()=>{window.__RC_EXPLORER__.reset();window.__RC_EXPLORER__.step(1,{throttle:0,brake:0,steer:0})});
  await page.waitForTimeout(200);
  expect(errors).toEqual([]);
  await page.screenshot({path:'test-results/rc-explorer.png',fullPage:true});
});

test('discovery can be reached deterministically',async({page})=>{
  await page.goto('/?manual=1');await page.waitForFunction(()=>window.__RC_EXPLORER__?.ready);
  await page.evaluate(()=>{window.__RC_EXPLORER__.teleport(-14,8.5);window.__RC_EXPLORER__.step(1,{throttle:0,brake:0,steer:0})});
  expect(await page.evaluate(()=>window.__RC_EXPLORER__.snapshot().discoveries)).toContain('Drain Run');
});
