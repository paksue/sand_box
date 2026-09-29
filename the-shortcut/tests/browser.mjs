import { chromium } from "@playwright/test";
import { PerspectiveCamera, Vector3 } from "three";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { preview } from "vite";
const server = await preview({
  preview: { host: "127.0.0.1", port: 4174, strictPort: true },
});
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: [
    "--no-sandbox",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
const root = "http://127.0.0.1:4174/sand_box/the-shortcut/";
const project = (x, y, z) => {
  const c = new PerspectiveCamera(36, 1440 / 900, 0.1, 1000);
  c.position.set(11, 12, 17);
  c.lookAt(0, 0, 0.1);
  c.updateMatrixWorld();
  const p = new Vector3(x, y, z).project(c);
  return { x: (p.x + 1) * 720, y: (1 - p.y) * 450 };
};
const clickWorld = async (x, y, z) => {
  const p = project(x, y, z);
  await page.mouse.click(p.x, p.y);
};
const saved = () =>
  page.evaluate(() => JSON.parse(localStorage.getItem("the-shortcut:save")));
try {
  await page.goto(root);
  await page.locator("canvas").waitFor();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "evidence/01-boot.png" });
  await clickWorld(2, 0, 2.8);
  await page.waitForTimeout(2500);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  let s = await saved();
  assert.ok(
    Math.abs(s.player.x - 2) < 0.2 && Math.abs(s.player.z - 2.8) < 0.2,
    "canvas floor click moves Daniel",
  );
  await page.getByRole("button", { name: "Debug", exact: true }).click();
  for (const [id, name, x, y, z] of [
    ["daniel-desk", "Daniel’s workstation", -3, 0.8, -1.7],
    ["sarah-desk", "Sarah’s workstation", 1, 0.8, -1.7],
    ["noticeboard", "Team noticeboard", 4.4, 1.2, -2.8],
  ]) {
    await clickWorld(x, y, z);
    await page.getByRole("dialog", { name }).waitFor({ timeout: 10000 });
    await page.getByRole("button", { name: "Close inspection" }).click();
  }
  await page.getByRole("button", { name: "Save", exact: true }).click();
  s = await saved();
  assert.equal(s.inspected.length, 3);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const setTime = async (time) => {
    await page.getByLabel("Set time", { exact: true }).fill(time);
    await page.getByRole("button", { name: "Set", exact: true }).click();
  };
  await setTime("09:00");
  assert.match(
    await page.getByTestId("npc-state").innerText(),
    /Sarah: standupSarah/,
  );
  await page.screenshot({ path: "evidence/02-standup-debug.png" });
  await setTime("09:40");
  assert.match(
    await page.getByTestId("npc-state").innerText(),
    /Sarah: coffee/,
  );
  assert.match(await page.getByTestId("npc-state").innerText(), /Mark: exit/);
  await page.screenshot({ path: "evidence/03-coffee-debug.png" });
  await page.getByRole("button", { name: "Save", exact: true }).click();
  const before = await saved();
  await page.reload();
  await page.getByRole("button", { name: "Debug", exact: true }).click();
  assert.deepEqual(await saved(), before);
  assert.match(
    await page.getByTestId("npc-state").innerText(),
    /Sarah: coffee/,
  );
  assert.match(await page.getByTestId("inspected").innerText(), /3\/3/);
  await page.getByRole("button", { name: "+10 min", exact: true }).click();
  assert.match(
    await page.getByTestId("npc-state").innerText(),
    /Sarah: sarahDesk/,
  );
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page
    .getByRole("button", { name: "Daniel’s workstation", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await page.getByRole("dialog", { name: "Daniel’s workstation" }).waitFor();
  await page.getByRole("button", { name: "Debug", exact: true }).click();
  await page.screenshot({ path: "evidence/04-inspection.png" });
  await page.getByRole("button", { name: "Close inspection" }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: "evidence/05-mobile.png" });
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth),
    390,
  );
  await page.addInitScript(() =>
    localStorage.setItem("the-shortcut:save", "{broken"),
  );
  await page.reload();
  await page.getByRole("button", { name: "Debug", exact: true }).click();
  assert.match(await page.locator("output").innerText(), /invalid/i);
  assert.deepEqual(errors, []);
  await fs.writeFile(
    "evidence/browser-results.json",
    JSON.stringify(
      {
        passed: true,
        errors,
        checks: [
          "production base-path boot",
          "floor click movement",
          "three mesh inspections",
          "09:00 stand-up",
          "09:40 coffee and Mark departure",
          "paused save/reload exact equality",
          "09:50 Sarah return",
          "keyboard inspection",
          "mobile viewport",
          "corrupt-save recovery",
        ],
      },
      null,
      2,
    ),
  );
  console.log("Browser acceptance passed");
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
