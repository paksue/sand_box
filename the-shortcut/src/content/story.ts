export type NPC = "sarah" | "maya" | "kevin" | "mark" | "luis";
export const characters: Record<NPC, { name: string; color: string }> = {
  sarah: { name: "Sarah Chen", color: "#7da6ac" },
  maya: { name: "Maya Patel", color: "#bd957e" },
  kevin: { name: "Kevin Brooks", color: "#91aa79" },
  mark: { name: "Mark Ellison", color: "#a697af" },
  luis: { name: "Luis Romero", color: "#8a9dbc" },
};
export type Place =
  | "daniel-desk"
  | "sarah-desk"
  | "noticeboard"
  | "kevin-desk"
  | "server"
  | "elevator"
  | NPC;
export const records = {
  requirements: [
    "Requirements",
    "Yesterday 16:20 · Match by account ID before name; preserve unmatched rows. Thursday client demo requires a reconciled ledger.",
  ],
  source: [
    "Local source",
    "08:47 · matchRows() still returns TODO. Task says “implementation in progress.” No QA build exists.",
  ],
  yesterday: [
    "Yesterday’s team chat",
    "Yesterday 17:42 · Daniel: “I will finish reconciliation before stand-up.” Sarah: “Integration is ready.” Mark: “Ready today for Thursday, please.”",
  ],
  tests: [
    "Local test output",
    "08:47 baseline · 0 of 6 tests pass: matcher unimplemented. This test run is local, not proof of a submitted build.",
  ],
  samples: [
    "Sample ledger",
    "A-41 / Lee: 10; B-12 / Patel: 20. Matching by account ID preserves both. A missing account must remain unresolved, not disappear.",
  ],
  routine: [
    "Coffee rota",
    "Sarah takes coffee at 09:40–09:50. Kevin goes to lunch at 12:00. Luis handles infrastructure access from 14:00.",
  ],
  sarahCode: [
    "Sarah’s implementation",
    "CandidateMatcher groups by account ID and returns candidates. Header: Sarah Chen. Copying the implementation preserves her naming and signature.",
  ],
  qaOutput: [
    "QA failure report",
    "Maya · Unmatched account C-07 disappears. Expected: unresolved row retained. Actual: missing row. Repro attached.",
  ],
  config: [
    "QA configuration diff",
    "Maya changed locale en-GB → en-US at 10:15. Input account IDs and row counts are identical before and after.",
  ],
  qaCode: [
    "Wrapper / empty result",
    "Daniel wrapper: if candidates.length === 0, continue. The unmatched row never reaches the output.",
  ],
  private: [
    "Private conversation",
    "Sarah → Kevin: “I probably shouldn’t say this, but Mark told me Daniel is talented but unreliable. He asked whether I would lead the next project. I don’t want to become the person who cleans up every time.”",
  ],
  git: [
    "Source history",
    "Server-side Git records keep commit times and diffs. The first implementation commit is later than stand-up; local edits cannot rewrite the remote audit copy.",
  ],
  tracker: [
    "Task history",
    "Task description and displayed status can be edited. Status audit events preserve both the prior value and the time of each edit.",
  ],
  upload: [
    "QA upload ledger",
    "Maya’s upload ledger timestamps when the first build actually arrived. It is independent of Daniel’s task description.",
  ],
  chat: [
    "Team chat chronology",
    "Stand-up minutes and subsequent team messages remain timestamped in the shared transcript. Editing the task cannot change them.",
  ],
  prodLog: [
    "Production duplicate-name failures",
    "14:20 · Lee / account A-41 and Lee / account A-42 collapse into one total. Stack: CandidateMatcher → Daniel.reconcile. Library appears in every trace.",
  ],
  contract: [
    "CandidateMatcher contract",
    "A query returns a SET of possible matches, not a single chosen row. Multiple candidates are valid output. Callers must resolve using account ID or mark ambiguous.",
  ],
  wrapper: [
    "Deployed wrapper",
    "Daniel.reconcile uses candidates[0]. Production contains duplicate names; the wrapper picks one before checking account ID.",
  ],
  coverage: [
    "Prior test coverage",
    "All previous matcher fixtures used distinct names. No test exercised two accounts sharing one name.",
  ],
} as const;
export type RecordId = keyof typeof records;
export type ActionDef = {
  id: string;
  place: Place;
  label: string;
  cost?: number;
  read?: RecordId;
  from?: number;
  until?: number;
  needs?: string[];
  absent?: string[];
  once?: boolean;
};
export const actions: ActionDef[] = [
  ...(
    ["requirements", "source", "yesterday", "tests", "samples"] as RecordId[]
  ).map((id) => ({
    id: `read-${id}`,
    place: "daniel-desk" as Place,
    label: `Read ${records[id][0]}`,
    read: id,
    cost: 1,
  })),
  {
    id: "read-routine",
    place: "noticeboard",
    label: "Read the coffee and support rota",
    read: "routine",
  },
  {
    id: "assess",
    place: "daniel-desk",
    label: "Compare source, promise, requirements and test run",
    needs: ["requirements", "source", "yesterday", "tests"],
    once: true,
    cost: 1,
  },
  {
    id: "stand-plain",
    place: "noticeboard",
    label: "“The matcher is not implemented. I need the morning.”",
    from: 540,
    until: 551,
    absent: ["standup"],
    once: true,
  },
  {
    id: "stand-shade",
    place: "noticeboard",
    label: "“The integration is there. I’m working through the last details.”",
    from: 540,
    until: 551,
    absent: ["standup"],
    once: true,
  },
  {
    id: "stand-redirect",
    place: "noticeboard",
    label: "“Kevin, where are we on the API? That may affect the build.”",
    from: 540,
    until: 551,
    absent: ["standup"],
    once: true,
  },
  {
    id: "stand-done",
    place: "noticeboard",
    label: "“It’s done. I’ll get Maya a build after this.”",
    from: 540,
    until: 551,
    absent: ["standup"],
    once: true,
  },
  {
    id: "ask-matcher",
    place: "sarah",
    label: "“Could you walk me through how you matched those accounts?”",
    from: 560,
    absent: ["matching"],
    once: true,
    cost: 25,
  },
  {
    id: "derive",
    place: "daniel-desk",
    label: "Implement account-ID matching from requirements and samples",
    from: 560,
    needs: ["requirements", "samples"],
    absent: ["matching"],
    once: true,
    cost: 45,
  },
  {
    id: "read-sarahCode",
    place: "sarah-desk",
    label: "Inspect the unlocked matching implementation",
    from: 580,
    until: 590,
    read: "sarahCode",
    cost: 2,
  },
  {
    id: "copy",
    place: "sarah-desk",
    label: "Adapt the open implementation into my branch",
    from: 580,
    until: 590,
    needs: ["sarahCode"],
    absent: ["matching"],
    once: true,
    cost: 6,
  },
  {
    id: "credit",
    place: "daniel-desk",
    label: "Commit with Sarah’s matching work acknowledged",
    needs: ["matching"],
    absent: ["committed"],
    once: true,
    cost: 2,
  },
  {
    id: "commit",
    place: "daniel-desk",
    label: "Commit as “Implement reconciliation”",
    needs: ["matching"],
    absent: ["committed"],
    once: true,
    cost: 2,
  },
  {
    id: "submit",
    place: "daniel-desk",
    label: "Upload the build to Maya",
    needs: ["committed"],
    absent: ["submitted"],
    once: true,
    cost: 3,
  },
  ...(["qaOutput", "config"] as RecordId[]).map((id) => ({
    id: `read-${id}`,
    place: "maya" as Place,
    label: `Inspect ${records[id][0]}`,
    read: id,
    needs: ["qaFailure"],
    cost: 1,
  })),
  {
    id: "read-qaCode",
    place: "daniel-desk",
    label: "Inspect the empty-result branch",
    read: "qaCode",
    needs: ["qaFailure"],
    cost: 2,
  },
  {
    id: "qa-blame",
    place: "maya",
    label: "“The locale changed. Could you undo that first?”",
    needs: ["qaFailure", "config"],
    absent: ["qaFixed"],
    once: true,
    cost: 12,
  },
  {
    id: "qa-defer",
    place: "maya",
    label: "“Can you keep the repro? I need to finish the matcher first.”",
    needs: ["qaFailure"],
    absent: ["qaFixed"],
    once: true,
    cost: 8,
  },
  {
    id: "qa-fix",
    place: "daniel-desk",
    label: "Retain unresolved rows; rerun Maya’s reproduction",
    needs: ["qaOutput", "config", "qaCode", "requirements"],
    absent: ["qaFixed"],
    once: true,
    cost: 15,
  },
  {
    id: "qa-correct",
    place: "maya",
    label:
      "“It was my empty-result branch. Your locale change did not cause this.”",
    needs: ["qaFixed"],
    once: true,
    cost: 1,
  },
  {
    id: "help-kevin",
    place: "kevin",
    label: "“Show me the API trace.”",
    from: 690,
    once: true,
    cost: 8,
  },
  {
    id: "read-private",
    place: "kevin-desk",
    label: "Open Sarah’s private message preview",
    from: 720,
    until: 750,
    read: "private",
    once: true,
    cost: 2,
  },
  {
    id: "lead-talk",
    place: "sarah",
    label: "“If Mark asks you to lead, I can own the reconciliation handover.”",
    needs: ["private"],
    once: true,
    cost: 4,
  },
  ...(["git", "tracker", "upload", "chat"] as RecordId[]).map((id) => ({
    id: `read-${id}`,
    place: "daniel-desk" as Place,
    label: `Open ${records[id][0]}`,
    read: id,
    from: 810,
    cost: 1,
  })),
  {
    id: "compare",
    place: "daniel-desk",
    label: "Compare the four timestamps with my local source",
    from: 810,
    needs: ["git", "tracker", "upload", "chat", "source"],
    once: true,
    cost: 3,
  },
  {
    id: "edit-task",
    place: "daniel-desk",
    label: "Change task description to “complete before stand-up”",
    from: 810,
    needs: ["tracker"],
    once: true,
    cost: 2,
  },
  {
    id: "correct-record",
    place: "daniel-desk",
    label: "Post a dated correction with actual build time",
    from: 810,
    needs: ["compared"],
    once: true,
    cost: 2,
  },
  {
    id: "read-prodLog",
    place: "server",
    label: "Read the reconciliation alert and failing rows",
    from: 860,
    read: "prodLog",
    cost: 2,
  },
  {
    id: "access",
    place: "luis",
    label: "“I need the deployment audit and a recovery window.”",
    from: 860,
    once: true,
    cost: 3,
  },
  ...(["contract", "wrapper", "coverage"] as RecordId[]).map((id) => ({
    id: `read-${id}`,
    place: "daniel-desk" as Place,
    label: `Inspect ${records[id][0]}`,
    read: id,
    from: 860,
    cost: 2,
  })),
  {
    id: "diagnose",
    place: "daniel-desk",
    label: "Reproduce duplicate names against the library contract",
    from: 860,
    needs: ["prodLog", "contract", "wrapper", "coverage"],
    once: true,
    cost: 5,
  },
  {
    id: "incident-tell",
    place: "daniel-desk",
    label:
      "Message team: “My wrapper chooses the first candidate. I’m investigating.”",
    needs: ["diagnosed"],
    absent: ["recovered"],
    once: true,
    cost: 1,
  },
  {
    id: "incident-blame",
    place: "daniel-desk",
    label:
      "Message team: “The trace points at Sarah’s library. Please check that first.”",
    needs: ["prodLog"],
    once: true,
    cost: 1,
  },
  {
    id: "ask-private",
    place: "sarah",
    label: "“Can we look at the candidate contract together, privately?”",
    from: 860,
    once: true,
    cost: 10,
  },
  {
    id: "fix-wrapper",
    place: "server",
    label: "Deploy account-ID resolution with duplicate-name regression tests",
    needs: ["diagnosed", "access"],
    absent: ["recovered"],
    once: true,
    cost: 18,
  },
  {
    id: "rollback",
    place: "server",
    label: "Roll back reconciliation; suspend the new feature",
    from: 860,
    needs: ["access", "prodLog"],
    absent: ["recovered"],
    once: true,
    cost: 6,
  },
  {
    id: "safe-hold",
    place: "server",
    label: "Quarantine ambiguous rows for manual reconciliation",
    needs: ["diagnosed", "access"],
    absent: ["recovered"],
    once: true,
    cost: 10,
  },
  {
    id: "incident-admit",
    place: "daniel-desk",
    label:
      "Message team: “Service is stable. The wrapper assumption was mine.”",
    needs: ["recovered", "diagnosed"],
    absent: ["disclosed"],
    once: true,
    cost: 1,
  },
  {
    id: "challenge-blame",
    place: "sarah",
    label:
      "“The library returned what it promised. I should correct the thread.”",
    needs: ["diagnosed", "blamedSarah"],
    once: true,
    cost: 2,
  },
  {
    id: "mark-full",
    place: "daniel-desk",
    label: "Reply to Mark with the build, incident and recovery timeline",
    from: 970,
    absent: ["markAnswered"],
    once: true,
    cost: 3,
  },
  {
    id: "mark-short",
    place: "daniel-desk",
    label:
      "Reply to Mark: “We have a stable service. Details are in the task.”",
    from: 970,
    absent: ["markAnswered"],
    once: true,
    cost: 1,
  },
  {
    id: "mark-lead",
    place: "daniel-desk",
    label:
      "Reply: “I’d like to discuss reliability and the next project lead.”",
    from: 970,
    needs: ["private"],
    absent: ["markAnswered"],
    once: true,
    cost: 3,
  },
  {
    id: "finish",
    place: "elevator",
    label: "Leave with Sarah · reconstruct the day",
    from: 1035,
    once: true,
  },
];
export const beats = [
  {
    id: "standup",
    at: 540,
    text: "Stand-up · Sarah: “Integration is ready.” Kevin: “Still chasing the API bug.” Maya: “I need your build.” Mark looks toward Daniel. The team noticeboard holds the stand-up conversation.",
  },
  {
    id: "departure",
    at: 551,
    text: "Mark takes his suitcase. “Message me if the demo is at risk.” The door closes. Daniel notices how quiet the room becomes. There is suddenly room to breathe.",
  },
  {
    id: "matching",
    at: 560,
    text: "The matcher is harder than the task title suggests. Requirements and sample rows are on Daniel’s workstation. Sarah has worked on this before.",
  },
  {
    id: "qa",
    at: 630,
    text: "Maya is ready to test. An uploaded build will produce her report; the QA desk keeps the reproduction available.",
  },
  {
    id: "private",
    at: 720,
    text: "Kevin: “Can you look at my API trace? I’m grabbing lunch.” A private message preview lights up his desk: Sarah — “I probably shouldn’t say this, but Mark told me…”",
  },
  {
    id: "timeline",
    at: 810,
    text: "The afternoon build window opens. Git history, the task, chat and QA uploads tell slightly different stories. They can be compared at Daniel’s workstation.",
  },
  {
    id: "incident",
    at: 860,
    text: "Production alert · Reconciliation totals are wrong. Sarah’s shared library appears in the trace. Luis opens the infrastructure desk; Maya keeps the duplicate-name failures.",
  },
  {
    id: "return",
    at: 970,
    text: "Mark is online: “Landed. How did everything go?” His message is waiting at Daniel’s workstation.",
  },
  {
    id: "ending",
    at: 1035,
    text: "17:15 · The office empties. Sarah waits by the elevator. Unfinished work will remain part of the handover, not disappear.",
  },
];
