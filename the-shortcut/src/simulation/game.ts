import {
  objects,
  scheduledLocation,
  walkable,
  type Point,
} from "../content/world";
export const SAVE_KEY = "the-shortcut:save";
export type State = {
  version: 1;
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
  | { type: "move"; point: Point }
  | { type: "inspect"; id: string }
  | { type: "time"; minute: number }
  | { type: "pause" }
  | { type: "dismiss" };
export const initialState = (): State => ({
  version: 1,
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
  if (a.type === "pause") return { ...s, paused: !s.paused };
  if (a.type === "dismiss") return { ...s, inspection: null };
  if (a.type === "time")
    return Number.isFinite(a.minute)
      ? {
          ...s,
          ticks: Math.round(Math.max(0, Math.min(1439, a.minute)) * 1200),
        }
      : s;
  if (a.type === "move")
    return walkable(a.point)
      ? { ...s, target: { ...a.point }, pending: null, inspection: null }
      : s;
  if (a.type === "inspect") {
    const obj = objects.find((o) => o.id === a.id);
    return obj
      ? { ...s, target: { ...obj.approach }, pending: obj.id, inspection: null }
      : s;
  }
  if (s.paused) return s;
  let next = { ...s, ticks: Math.min(1439 * 1200, s.ticks + 6) };
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
  return next;
}
export function serialize(s: State) {
  return JSON.stringify(s);
}
export function deserialize(raw: string): State {
  const s = JSON.parse(raw);
  const validId = (id: unknown) =>
    id === null || objects.some((o) => o.id === id);
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
  return {
    version: 1,
    ticks: s.ticks,
    paused: s.paused,
    player: { x: s.player.x, z: s.player.z },
    target: s.target && { x: s.target.x, z: s.target.z },
    pending: s.pending,
    inspected: [...new Set<string>(s.inspected)],
    inspection: s.inspection,
  };
}
