import { initialStory, advanceStory, act, hint, type Story } from "./story";
import { beats, characters, type Place } from "../content/story";
import {
  allObjects,
  npcLocations,
  locations,
  scheduledLocation,
  walkable,
  type Point,
} from "../content/world";
export const SAVE_KEY = "the-shortcut:save";
export type State = {
  version: 1;
  story: Story;
  ticks: number;
  paused: boolean;
  player: Point;
  target: Point | null;
  pending: string | null;
  inspected: string[];
  inspection: string | null;
};
export type Action =
  | { type: "tick" }
  | { type: "story"; id: string }
  | { type: "wait" }
  | { type: "hint" }
  | { type: "move"; point: Point }
  | { type: "inspect"; id: string }
  | { type: "time"; minute: number }
  | { type: "pause" }
  | { type: "dismiss" };
export const initialState = (): State => ({
  version: 1,
  story: initialStory(),
  ticks: 527 * 60 * 20,
  paused: false,
  player: { x: -2, z: 2 },
  target: null,
  pending: null,
  inspected: [],
  inspection: null,
});
// Fixed 50ms simulation steps; one real second advances six game seconds.
export const gameSeconds = (s: State) => s.ticks / 20;
export const npcState = (s: State) => ({
  sarah: scheduledLocation("sarah", gameSeconds(s)),
  mark: scheduledLocation("mark", gameSeconds(s)),
});
export const timeLabel = (s: State) => {
  const m = Math.floor(gameSeconds(s) / 60);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};
export function reduce(s: State, a: Action): State {
  const minute = s.ticks / 1200;
  if (a.type === "story") {
    if (!s.inspection) return s;
    const result = act(s.story, a.id, minute, s.inspection as Place);
    return result.story === s.story
      ? s
      : { ...s, story: result.story, ticks: Math.round(result.minute * 1200) };
  }
  if (a.type === "hint")
    return {
      ...s,
      story: {
        ...s.story,
        hints: s.story.hints + 1,
        message: hint(s.story, minute),
      },
    };
  if (a.type === "wait") {
    if (s.story.finished || minute >= 1035) return s;
    const targets = [...beats.map((b) => b.at), 580, 590, 690, 750, 840];
    const next = Math.min(...targets.filter((t) => t > minute + 0.01), 1035);
    return {
      ...s,
      ticks: next * 1200,
      story: advanceStory(s.story, next),
      inspection: null,
      target: null,
      pending: null,
    };
  }
  if (a.type === "pause") return { ...s, paused: !s.paused };
  if (a.type === "dismiss") return { ...s, inspection: null };
  if (a.type === "time")
    return Number.isFinite(a.minute)
      ? {
          ...s,
          ticks: Math.round(Math.max(0, Math.min(1439, a.minute)) * 1200),
          story: advanceStory(s.story, a.minute),
        }
      : s;
  if (a.type === "move")
    return walkable(a.point)
      ? { ...s, target: { ...a.point }, pending: null, inspection: null }
      : s;
  if (a.type === "inspect") {
    const obj = allObjects.find((o) => o.id === a.id);
    if (a.id in characters) {
      const id = a.id as keyof typeof characters;
      const p =
        id === "sarah" || id === "mark"
          ? locations[
              id === "sarah" && minute >= 1035 ? "exit" : npcState(s)[id]
            ]
          : npcLocations[id];
      return {
        ...s,
        inspection: null,
        target: { x: p.x, z: Math.max(-0.8, p.z + 0.35) },
        pending: id,
      };
    }
    return obj
      ? { ...s, target: { ...obj.approach }, pending: obj.id, inspection: null }
      : s;
  }
  if (s.paused || s.story.finished) return s;
  let next = {
    ...s,
    ticks: s.inspection ? s.ticks : Math.min(1035 * 1200, s.ticks + 6),
  };
  if (s.target) {
    const dx = s.target.x - s.player.x,
      dz = s.target.z - s.player.z,
      distance = Math.hypot(dx, dz),
      step = 0.12;
    if (distance <= step)
      next = {
        ...next,
        player: { ...s.target },
        target: null,
        pending: null,
        inspection: s.pending,
        inspected: s.pending
          ? [...new Set([...s.inspected, s.pending])]
          : s.inspected,
      };
    else
      next.player = {
        x: s.player.x + (dx / distance) * step,
        z: s.player.z + (dz / distance) * step,
      };
  }
  next.story = advanceStory(next.story, next.ticks / 1200);
  return next;
}
export function serialize(s: State) {
  return JSON.stringify(s);
}
export function deserialize(raw: string): State {
  const s = JSON.parse(raw);
  const validId = (id: unknown) =>
    id === null ||
    allObjects.some((o) => o.id === id) ||
    (typeof id === "string" && id in characters);
  if (
    s.version !== 1 ||
    !Number.isSafeInteger(s.ticks) ||
    s.ticks < 0 ||
    s.ticks > 1439 * 1200 ||
    typeof s.paused !== "boolean" ||
    !s.player ||
    !walkable(s.player) ||
    !(s.target === null || (s.target && walkable(s.target))) ||
    !validId(s.pending) ||
    !validId(s.inspection) ||
    !Array.isArray(s.inspected) ||
    !s.inspected.every((id: unknown) => id !== null && validId(id))
  )
    throw new Error("Unsupported or invalid save");
  if (s.story !== undefined) validateStory(s.story);
  return {
    version: 1,
    story: s.story ?? advanceStory(initialStory(), s.ticks / 1200),
    ticks: s.ticks,
    paused: s.paused,
    player: { x: s.player.x, z: s.player.z },
    target: s.target && { x: s.target.x, z: s.target.z },
    pending: s.pending,
    inspected: [...new Set<string>(s.inspected)],
    inspection: s.inspection,
  };
}

function validateStory(s: Story) {
  if (
    !s ||
    s.schema !== 1 ||
    ![s.flags, s.done, s.beats].every(
      (v) => Array.isArray(v) && v.every((x) => typeof x === "string"),
    ) ||
    typeof s.message !== "string" ||
    typeof s.finished !== "boolean" ||
    !Number.isSafeInteger(s.hints) ||
    !s.facts ||
    !Object.values(s.facts).every((v) => typeof v === "string") ||
    !Array.isArray(s.claims) ||
    !s.claims.every(
      (c) =>
        Number.isFinite(c.at) &&
        typeof c.text === "string" &&
        typeof c.kind === "string",
    ) ||
    !Array.isArray(s.evidence) ||
    !s.evidence.every(
      (e) =>
        typeof e.id === "string" &&
        Number.isFinite(e.at) &&
        typeof e.content === "string" &&
        typeof e.source === "string" &&
        typeof e.editable === "boolean" &&
        typeof e.altered === "boolean" &&
        Array.isArray(e.access) &&
        e.access.every((x) => typeof x === "string") &&
        typeof e.provenance === "string",
    ) ||
    !Array.isArray(s.observations) ||
    !s.observations.every(
      (o) =>
        typeof o.action === "string" &&
        Number.isFinite(o.at) &&
        typeof o.summary === "string" &&
        typeof o.context === "string",
    ) ||
    !Array.isArray(s.journal) ||
    !s.journal.every(
      (j) => Number.isFinite(j.at) && typeof j.text === "string",
    ) ||
    !Object.keys(characters).every((n) => {
      const k = n as keyof typeof characters;
      return (
        Array.isArray(s.knowledge?.[k]) &&
        s.knowledge[k].every((f) => typeof f === "string") &&
        s.beliefs?.[k] &&
        Object.values(s.beliefs[k]).every((v) => typeof v === "string") &&
        s.relationships?.[k] &&
        ["trust", "suspicion", "warmth", "confidence", "resentment"].every(
          (f) =>
            Number.isFinite(
              s.relationships[k][f as keyof (typeof s.relationships)[typeof k]],
            ),
        )
      );
    })
  )
    throw new Error("Invalid story save");
}
