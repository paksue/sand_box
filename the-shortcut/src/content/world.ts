export type Point = { x: number; z: number };
export const objects = [
  {
    id: "daniel-desk",
    name: "Daniel’s workstation",
    x: -3,
    z: -1.7,
    approach: { x: -3, z: -0.45 },
    text: "Daniel’s workstation. A monitor, keyboard and unfinished work. Inspection probe recorded; computer mode belongs to a later milestone.",
  },
  {
    id: "sarah-desk",
    name: "Sarah’s workstation",
    x: 1,
    z: -1.7,
    approach: { x: 1, z: -0.45 },
    text: "Sarah’s workstation. The graybox identifies the desk independently of Sarah’s current location. No private content is implemented.",
  },
  {
    id: "noticeboard",
    name: "Team noticeboard",
    x: 4.4,
    z: -2.8,
    approach: { x: 4.2, z: -0.65 },
    text: "The team noticeboard. Stand-up is at 09:00. This is a look-only interaction probe.",
  },
] as const;
export const locations: Record<string, Point> = {
  sarahDesk: { x: 1, z: -0.65 },
  markDesk: { x: -4.8, z: -1 },
  standupSarah: { x: 1.5, z: 1.8 },
  standupMark: { x: 3, z: 1.8 },
  coffee: { x: -4.6, z: 2.5 },
  exit: { x: 5.2, z: 2.5 },
};
// Coffee interval is a provisional M01 schedule fixture, not a new story beat.
export const schedules = {
  sarah: [
    { at: 0, location: "sarahDesk" },
    { at: 540, location: "standupSarah" },
    { at: 551, location: "sarahDesk" },
    { at: 580, location: "coffee" },
    { at: 590, location: "sarahDesk" },
  ],
  mark: [
    { at: 0, location: "markDesk" },
    { at: 540, location: "standupMark" },
    { at: 551, location: "exit" },
  ],
};
export function scheduledLocation(
  npc: keyof typeof schedules,
  seconds: number,
) {
  return schedules[npc].filter((s) => s.at * 60 <= seconds).at(-1)!.location;
}
export function walkable(p: Point) {
  return (
    Number.isFinite(p.x) &&
    Number.isFinite(p.z) &&
    p.x >= -5.5 &&
    p.x <= 5.5 &&
    p.z >= -0.8 &&
    p.z <= 3.5
  );
}
