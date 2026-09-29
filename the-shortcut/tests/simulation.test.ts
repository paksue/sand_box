import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  reduce,
  serialize,
  deserialize,
  npcState,
} from "../src/simulation/game.ts";
import { objects } from "../src/content/world.ts";
test("fixed steps produce deterministic movement and clock; pause freezes both", () => {
  const run = () => {
    let s = reduce(initialState(), { type: "move", point: { x: 3, z: 2 } });
    for (let i = 0; i < 100; i++) s = reduce(s, { type: "tick" });
    return s;
  };
  assert.deepEqual(run(), run());
  assert.deepEqual(run().player, { x: 3, z: 2 });
  assert.equal(run().ticks, initialState().ticks + 600);
  const paused = reduce(run(), { type: "pause" });
  assert.deepEqual(reduce(paused, { type: "tick" }), paused);
});
test("schedule boundaries work forward and backward", () => {
  let s = initialState();
  for (const [minute, sarah, mark] of [
    [539, "sarahDesk", "markDesk"],
    [540, "standupSarah", "standupMark"],
    [551, "sarahDesk", "exit"],
    [580, "coffee", "exit"],
    [590, "sarahDesk", "exit"],
    [527, "sarahDesk", "markDesk"],
  ] as const) {
    s = reduce(s, { type: "time", minute });
    assert.deepEqual(npcState(s), { sarah, mark });
  }
});
test("three inspections require arrival; move cancels inspection; invalid moves rejected", () => {
  let s = initialState();
  for (const o of objects) {
    s = reduce(s, { type: "inspect", id: o.id });
    assert.equal(s.inspection, null);
    for (let i = 0; i < 100; i++) s = reduce(s, { type: "tick" });
    assert.equal(s.inspection, o.id);
    assert.deepEqual(deserialize(serialize(s)), s);
  }
  assert.equal(s.inspected.length, 3);
  assert.equal(reduce(s, { type: "move", point: { x: 0, z: -2 } }), s);
  s = reduce(s, { type: "inspect", id: objects[0].id });
  s = reduce(s, { type: "move", point: { x: 0, z: 2 } });
  assert.equal(s.pending, null);
});
test("save round-trips midwalk, time and inspections; malformed and future versions rejected", () => {
  let s = reduce(initialState(), { type: "inspect", id: objects[0].id });
  s = reduce(s, { type: "tick" });
  assert.deepEqual(deserialize(serialize(s)), s);
  for (const raw of [
    "{",
    "{}",
    JSON.stringify({ ...s, version: 2 }),
    JSON.stringify({ ...s, player: { x: NaN, z: 2 } }),
    JSON.stringify({ ...s, inspected: ["unknown"] }),
  ])
    assert.throws(() => deserialize(raw));
});
