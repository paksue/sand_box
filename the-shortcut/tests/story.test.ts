import { test } from "node:test";
import assert from "node:assert/strict";
import { actions, beats, type Place } from "../src/content/story.ts";
import {
  act,
  advanceStory,
  available,
  initialStory,
  reconstruction,
  has,
} from "../src/simulation/story.ts";
import {
  deserialize,
  initialState,
  serialize,
} from "../src/simulation/game.ts";
const runner = () => {
  let s = initialStory(),
    m = 527;
  return {
    get s() {
      return s;
    },
    get m() {
      return m;
    },
    time(t: number) {
      m = t;
      s = advanceStory(s, m);
    },
    do(id: string) {
      const a = actions.find((a) => a.id === id)!;
      assert.ok(a, id);
      assert.ok(available(a, s, m), `unavailable ${id} at ${m}`);
      const r = act(s, id, m, a.place);
      s = r.story;
      m = r.minute;
    },
    reload() {
      const state = {
        ...initialState(),
        ticks: Math.round(m * 1200),
        story: s,
      };
      s = deserialize(serialize(state)).story;
      assert.deepEqual(s, state.story);
    },
  };
};
function morning(r: ReturnType<typeof runner>, route = "ask-matcher") {
  for (const id of ["requirements", "source", "yesterday", "tests", "samples"])
    r.do(`read-${id}`);
  r.do("assess");
  r.time(540);
  r.do("stand-done");
  r.time(route === "copy" ? 580 : 560);
  if (route === "copy") r.do("read-sarahCode");
  r.do(route);
  r.do("credit");
  r.do("submit");
  r.time(Math.max(r.m, 630));
  for (const id of ["qaOutput", "config", "qaCode"]) r.do(`read-${id}`);
  r.do("qa-blame");
  r.do("qa-fix");
  r.do("qa-correct");
  r.reload();
}
function investigate(r: ReturnType<typeof runner>) {
  r.time(860);
  r.do("read-prodLog");
  r.do("access");
  for (const id of ["contract", "wrapper", "coverage"]) r.do(`read-${id}`);
  r.do("diagnose");
}
test("P1–P6 full route, all beats, correction and state-derived ending", () => {
  const r = runner();
  morning(r);
  r.time(720);
  r.do("read-private");
  assert.ok(!r.s.knowledge.mark.includes("private"));
  r.reload();
  r.time(810);
  for (const id of ["git", "tracker", "upload", "chat"]) r.do(`read-${id}`);
  r.do("compare");
  r.do("edit-task");
  r.do("correct-record");
  investigate(r);
  r.do("incident-tell");
  r.do("fix-wrapper");
  r.time(970);
  r.do("mark-full");
  r.reload();
  r.time(1035);
  r.do("finish");
  assert.equal(r.s.finished, true);
  assert.equal(r.s.beats.length, beats.length);
  for (const flag of [
    "assessed",
    "matching",
    "qaFixed",
    "private",
    "compared",
    "diagnosed",
    "recovered",
  ])
    assert.ok(has(r.s, flag), flag);
  assert.ok(
    reconstruction(r.s).some((t) => t.includes("before starting recovery")),
  );
  assert.equal(r.s.beliefs.maya.qa, "Daniel empty-result branch");
});
test("matching routes have different cost, provenance and knowledge", () => {
  const runs = ["ask-matcher", "derive", "copy"].map((route) => {
    const r = runner();
    morning(r, route);
    return r.s;
  });
  assert.equal(new Set(runs.map((s) => s.facts.matching)).size, 3);
  assert.equal(new Set(runs.map((s) => s.facts.matchTime)).size, 3);
  assert.ok(runs[0].knowledge.sarah.includes("helpedDaniel"));
  assert.ok(!runs[1].knowledge.sarah.includes("helpedDaniel"));
  assert.ok(runs[2].evidence.some((e) => e.id === "provenance"));
});
test("patch, rollback and temporary hold materially change production and evidence", () => {
  const outcomes = ["fix-wrapper", "rollback", "safe-hold"].map((id) => {
    const r = runner();
    investigate(r);
    r.do(id);
    r.reload();
    return r.s;
  });
  assert.equal(new Set(outcomes.map((s) => s.facts.production)).size, 3);
  for (const s of outcomes) {
    assert.ok(s.knowledge.luis.includes("deploymentChanged"));
    assert.ok(!s.knowledge.mark.includes("wrapperFault"));
  }
});
test("admit before, after, quiet repair and blame preserve different beliefs and reconstruction", () => {
  const outcomes = ["before", "after", "quiet", "blame"].map((mode) => {
    const r = runner();
    investigate(r);
    if (mode === "before") r.do("incident-tell");
    if (mode === "blame") r.do("incident-blame");
    r.do("fix-wrapper");
    if (mode === "after") r.do("incident-admit");
    r.time(970);
    return r.s;
  });
  assert.equal(
    new Set(outcomes.map((s) => reconstruction(s).join("\n"))).size,
    4,
  );
  assert.ok(outcomes[0].knowledge.mark.includes("wrapperFault"));
  assert.ok(!outcomes[2].knowledge.mark.includes("wrapperFault"));
  assert.match(outcomes[3].beliefs.mark.incident, /Sarah/);
});
test("four stand-up responses, silence, missed private window and idle recovery all finish", () => {
  for (const choice of [
    "stand-plain",
    "stand-shade",
    "stand-redirect",
    "stand-done",
    "silence",
  ]) {
    const r = runner();
    r.time(540);
    if (choice !== "silence") r.do(choice);
    r.time(1035);
    r.do("finish");
    assert.ok(r.s.finished);
    assert.equal(r.s.claims.length, 1);
    assert.match(r.s.facts.production, /isolated/);
    assert.ok(!has(r.s, "private"));
  }
});
test("action guards reject wrong location, missing clues, repeated recovery and closed windows", () => {
  const s = initialStory();
  assert.equal(act(s, "derive", 560, "daniel-desk").story, s);
  assert.equal(act(s, "read-source", 527, "server").story, s);
  const r = runner();
  r.time(590);
  assert.equal(
    available(
      actions.find((a) => a.id === "copy")!,
      r.s,
      r.m,
    ),
    false,
  );
  investigate(r);
  r.do("rollback");
  assert.equal(
    available(
      actions.find((a) => a.id === "fix-wrapper")!,
      r.s,
      r.m,
    ),
    false,
  );
});
test("legacy M01 saves migrate, malformed narrative saves reject", () => {
  const legacy: any = initialState();
  delete legacy.story;
  assert.equal(deserialize(JSON.stringify(legacy)).story.schema, 1);
  for (const story of [
    {},
    { ...initialStory(), knowledge: {} },
    { ...initialStory(), evidence: [{}] },
    { ...initialStory(), relationships: {} },
  ])
    assert.throws(() =>
      deserialize(JSON.stringify({ ...initialState(), story })),
    );
});
test("schedule crossing during copying creates a witness, private reading does not create omniscience", () => {
  const r = runner();
  r.time(584);
  r.do("read-sarahCode");
  r.do("copy");
  assert.ok(r.s.knowledge.sarah.includes("deskAccess"));
  r.time(720);
  r.do("read-private");
  assert.ok(!r.s.knowledge.kevin.includes("private"));
  assert.ok(!r.s.knowledge.sarah.includes("private"));
});

test("authorized recovery is witnessed repair, not covert low-detection behavior", () => {
  for (const recovery of ["fix-wrapper", "rollback", "safe-hold"]) {
    for (const disclose of [false, true]) {
      const r = runner();
      investigate(r);
      if (disclose) r.do("incident-tell");
      r.do(recovery);
      r.reload();
      const observation = r.s.observations.find((o) => o.action === recovery)!;
      assert.equal(observation.category, "repair");
      assert.equal(observation.context, "public");
      assert.equal(observation.detection, "high");
      assert.ok(r.s.knowledge.luis.includes("deploymentChanged"));
      const audit = r.s.evidence.find((e) => e.id === "recovery")!;
      assert.equal(audit.editable, false);
      assert.ok(audit.access.includes("luis") && audit.access.includes("maya"));
      assert.ok(
        !reconstruction(r.s).some((line) =>
          line.startsWith("When oversight was limited"),
        ),
      );
      if (!disclose)
        assert.ok(
          reconstruction(r.s).some((line) =>
            line.includes("without explaining your role"),
          ),
        );
    }
  }
});

test("QA clarification corrects only a player-caused QA belief, not unrelated claims", () => {
  for (const blame of [false, true]) {
    const r = runner();
    // Even an unrelated false stand-up claim must not make QA clarification a correction.
    for (const id of ["requirements", "samples"]) r.do(`read-${id}`);
    r.time(540);
    r.do("stand-done");
    r.time(560);
    r.do("ask-matcher");
    r.do("credit");
    r.do("submit");
    r.time(630);
    for (const id of ["qaOutput", "config", "qaCode"]) r.do(`read-${id}`);
    if (blame) r.do("qa-blame");
    r.do("qa-fix");
    r.do("qa-correct");
    r.reload();
    const clarification = r.s.observations.find(
      (o) => o.action === "qa-correct",
    )!;
    assert.equal(clarification.correction, blame);
    assert.equal(
      clarification.category,
      blame ? "correction" : "clarification",
    );
    assert.equal(clarification.corrects, blame ? "qa-blame" : undefined);
    assert.equal(
      reconstruction(r.s).some((line) => line.startsWith("Later corrections")),
      blame,
    );
    assert.equal(r.s.beliefs.maya.qa, "Daniel empty-result branch");
    assert.ok(r.s.knowledge.maya.includes("wrapperEmptyFault"));
  }
});

test("incident disclosure is a correction only when it retracts earlier library blame", () => {
  for (const blamed of [false, true]) {
    const r = runner();
    investigate(r);
    if (blamed) r.do("incident-blame");
    r.do("fix-wrapper");
    r.do("incident-admit");
    const admission = r.s.observations.find(
      (o) => o.action === "incident-admit",
    )!;
    assert.equal(admission.correction, blamed);
    assert.equal(admission.corrects, blamed ? "incident-blame" : undefined);
    assert.equal(
      reconstruction(r.s).some((line) => line.startsWith("Later corrections")),
      blamed,
    );
  }
});
