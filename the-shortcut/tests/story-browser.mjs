import { chromium } from "@playwright/test";
import { preview } from "vite";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const out = "evidence/milestone-02";
await fs.mkdir(out, { recursive: true });
const server = await preview({
  preview: { host: "127.0.0.1", port: 4175, strictPort: true },
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
const results = [];
const errors = [];
const root = "http://127.0.0.1:4175/sand_box/the-shortcut/";
async function route(name, matching, recovery, social, privateRead) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  console.log(`Starting ${name}`);
  page.on("pageerror", (e) => errors.push(`${name}: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`${name}: ${m.text()}`);
  });
  const button = (n) => page.getByRole("button", { name: n, exact: true });
  const close = async () => {
    if (await button("Close inspection").count())
      await button("Close inspection").click();
  };
  const inspect = async (n) => {
    await close();
    await button("Interact").click();
    await page
      .getByRole("region", { name: "Nearby interactions" })
      .getByRole("button", { name: n, exact: true })
      .click();
    await page.getByRole("dialog", { name: n, exact: true }).waitFor();
  };
  const click = async (id) => {
    const tab =
      id.startsWith("stand-") ||
      id.startsWith("mark-") ||
      id.startsWith("incident-")
        ? "Messages"
        : [
              "read-git",
              "read-tracker",
              "read-upload",
              "read-chat",
              "compare",
              "edit-task",
              "correct-record",
            ].includes(id)
          ? "Records"
          : [
                "read-contract",
                "read-wrapper",
                "read-coverage",
                "diagnose",
              ].includes(id)
            ? "Incident"
            : "Work";
    const tabs = page.getByRole("tab", { name: tab, exact: true });
    if (await tabs.count()) await tabs.click();
    const b = page.locator(`[data-action="${id}"]`);
    await b.waitFor();
    assert.equal(await b.isEnabled(), true, `${id} enabled`);
    await b.click();
  };
  const minute = async () => {
    const [h, m] = (await page.locator("time").innerText())
      .split(":")
      .map(Number);
    return h * 60 + m;
  };
  const waitUntil = async (target) => {
    await close();
    let loops = 0;
    while ((await minute()) < target) {
      assert.ok(loops++ < 20);
      await button("Wait to next moment").click();
    }
  };
  const state = async () =>
    page.evaluate(() => JSON.parse(localStorage.getItem("the-shortcut:save")));
  const checkpoint = async (label) => {
    await button("Save").click();
    const before = await state();
    await page.reload();
    await page.locator("canvas").waitFor();
    const after = await state();
    assert.deepEqual(after.story, before.story, `save story ${label}`);
    assert.equal(after.inspection, before.inspection);
    if (await page.getByRole("region", { name: "Debug tools" }).count())
      await button("Debug").click();
  };
  const shot = async (label) =>
    page.screenshot({ path: `${out}/${name}-${label}.png` });
  try {
    await page.goto(root);
    await page.locator("canvas").waitFor();
    await page.waitForTimeout(500);
    if (name === "full") await shot("arrival");
    await inspect("Daniel’s workstation");
    for (const id of [
      "requirements",
      "source",
      "yesterday",
      "tests",
      "samples",
    ])
      await click(`read-${id}`);
    await click("assess");
    await waitUntil(540);
    await inspect("Team noticeboard");
    await click(
      name === "full"
        ? "stand-shade"
        : name === "independent"
          ? "stand-plain"
          : "stand-done",
    );
    if (name === "full") await shot("standup");
    await waitUntil(matching === "copy" ? 580 : 560);
    if (matching === "copy") {
      await inspect("Sarah’s workstation");
      await click("read-sarahCode");
      await click("copy");
    } else if (matching === "derive") {
      await inspect("Daniel’s workstation");
      await click("derive");
    } else {
      await inspect("Sarah Chen");
      await click("ask-matcher");
    }
    await inspect("Daniel’s workstation");
    await click(name === "quiet" ? "commit" : "credit");
    await click("submit");
    await waitUntil(630);
    await inspect("Maya Patel");
    await click("read-qaOutput");
    await click("read-config");
    if (name === "full") await click("qa-blame");
    await inspect("Daniel’s workstation");
    await click("read-qaCode");
    await click("qa-fix");
    await inspect("Maya Patel");
    await click("qa-correct");
    await checkpoint("qa");
    if (name === "full") await shot("qa");
    await waitUntil(690);
    await inspect("Kevin Brooks");
    await click("help-kevin");
    await waitUntil(720);
    if (privateRead) {
      await inspect("Kevin’s workstation");
      await click("read-private");
      if (name === "full") await shot("private");
      await checkpoint("private");
    }
    await waitUntil(810);
    await inspect("Daniel’s workstation");
    for (const id of ["git", "tracker", "upload", "chat"])
      await click(`read-${id}`);
    await click("compare");
    if (name === "full") {
      await click("edit-task");
      await click("correct-record");
      await shot("timeline");
    }
    await waitUntil(860);
    await inspect("Infrastructure desk");
    await click("read-prodLog");
    await inspect("Luis Romero");
    await click("access");
    await inspect("Daniel’s workstation");
    for (const id of ["contract", "wrapper", "coverage"])
      await click(`read-${id}`);
    await click("diagnose");
    if (social === "before") await click("incident-tell");
    if (social === "blame") await click("incident-blame");
    await inspect("Infrastructure desk");
    await click(recovery);
    if (name === "full") await shot("recovery");
    await checkpoint("recovery");
    if (social === "after") {
      await inspect("Daniel’s workstation");
      await click("incident-admit");
    }
    await waitUntil(970);
    await inspect("Daniel’s workstation");
    await click(
      social === "quiet" || social === "blame" ? "mark-short" : "mark-full",
    );
    if (name === "full") await shot("mark");
    await waitUntil(1035);
    await inspect("Elevator");
    await click("finish");
    await page
      .getByRole("dialog", { name: "Behavioral reconstruction" })
      .waitFor();
    await page.waitForTimeout(200);
    await shot("ending");
    await button("Save").click();
    const final = await state();
    assert.ok(final.story.finished);
    assert.equal(final.story.beats.length, 9);
    assert.equal(final.story.facts.recovery, recovery);
    await checkpoint("ending");
    assert.ok(
      await page
        .getByRole("dialog", { name: "Behavioral reconstruction" })
        .isVisible(),
    );
    if (name === "full") {
      await page.setViewportSize({ width: 390, height: 844 });
      await shot("mobile-ending");
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth),
        390,
      );
    }
    await fs.writeFile(
      `${out}/${name}-state.json`,
      JSON.stringify(final, null, 2),
    );
    results.push({
      name,
      matching,
      recovery,
      social,
      privateRead,
      completed: true,
      saveReload: [
        "qa",
        ...(privateRead ? ["private"] : []),
        "recovery",
        "ending",
      ],
    });
  } catch (e) {
    await shot("FAILED");
    throw e;
  } finally {
    await context.close();
  }
}
try {
  await route("full", "ask-matcher", "fix-wrapper", "before", true);
  await route("independent", "derive", "rollback", "after", false);
  await route("quiet", "copy", "safe-hold", "quiet", false);
  await route("blame", "copy", "fix-wrapper", "blame", true);
  assert.deepEqual(errors, []);
  await fs.writeFile(
    `${out}/browser-results.json`,
    JSON.stringify(
      {
        passed: true,
        errors,
        routes: results,
        debugTimeUsed: false,
        stateInjectionUsed: false,
      },
      null,
      2,
    ),
  );
  console.log("Milestone 02 browser routes passed", results);
} finally {
  await browser.close();
  await new Promise((r) => server.httpServer.close(r));
}
