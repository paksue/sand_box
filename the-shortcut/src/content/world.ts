export type Point = { x: number; z: number };
export const objects = [
  {
    id: "daniel-desk",
    name: "Daniel’s workstation",
    x: -3,
    z: -1.7,
    approach: { x: -3, z: -0.45 },
    text: "Daniel’s workstation. A monitor, keyboard and unfinished work. Source, tests, messages and task records are available here.",
  },
  {
    id: "sarah-desk",
    name: "Sarah’s workstation",
    x: 1,
    z: -1.7,
    approach: { x: 1, z: -0.45 },
    text: "Sarah’s workstation. The graybox identifies the desk independently of Sarah’s current location. Her implementation is accessible only during her coffee break.",
  },
  {
    id: "noticeboard",
    name: "Team noticeboard",
    x: 4.4,
    z: -2.8,
    approach: { x: 4.2, z: -0.65 },
    text: "The team noticeboard. Stand-up is at 09:00. Join the conversation here at nine; the rota lists office routines.",
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
    { at: 1035, location: "exit" },
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

export const extraObjects = [
  {
    id: "kevin-desk",
    name: "Kevin’s workstation",
    x: -2,
    z: -3.4,
    approach: { x: -1.2, z: -0.5 },
    text: "Kevin’s API trace is open. Private notifications remain private unless opened.",
  },
  {
    id: "server",
    name: "Infrastructure desk",
    x: 4.6,
    z: 0,
    approach: { x: 4.2, z: 0.9 },
    text: "Production logs and deployment controls. Luis records every change.",
  },
  {
    id: "elevator",
    name: "Elevator",
    x: 5.1,
    z: 3.1,
    approach: { x: 4.6, z: 2.8 },
    text: "The elevator leaves at the end of the workday.",
  },
] as const;
export const allObjects = [...objects, ...extraObjects];
export const npcLocations = {
  maya: { x: 3.1, z: -0.6 },
  kevin: { x: -1.5, z: -0.6 },
  luis: { x: 4.5, z: 1.3 },
};
export function extraSchedule(npc: "maya" | "kevin" | "luis", minute: number) {
  if (minute >= 1035) return "away";
  if (minute >= 540 && minute < 551) return "standup";
  if (npc === "kevin" && minute >= 720 && minute < 750) return "lunch";
  if (npc === "luis" && minute < 840) return "rounds";
  if (npc === "maya" && minute >= 750 && minute < 780) return "lunch";
  return npc === "luis" ? "infrastructure" : "desk";
}
