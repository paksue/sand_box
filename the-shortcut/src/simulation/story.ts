import { extraSchedule } from "../content/world";
import {
  actions,
  beats,
  characters,
  records,
  type ActionDef,
  type NPC,
  type Place,
  type RecordId,
} from "../content/story";
export type Relation = {
  trust: number;
  suspicion: number;
  warmth: number;
  confidence: number;
  resentment: number;
};
export type Evidence = {
  id: string;
  source: string;
  at: number;
  content: string;
  editable: boolean;
  visibility: string;
  access: string[];
  altered: boolean;
  provenance: string;
};
export type Observation = {
  action: string;
  at: number;
  category: string;
  detection: "low" | "high";
  benefit: string;
  harm: string;
  context: "private" | "public";
  initiated: boolean;
  escalation: boolean;
  correction: boolean;
  corrects?: string;
  rationalization: string;
  summary: string;
};
export type Story = {
  schema: 1;
  flags: string[];
  done: string[];
  beats: string[];
  facts: Record<string, string>;
  claims: { at: number; text: string; kind: string }[];
  knowledge: Record<NPC, string[]>;
  beliefs: Record<NPC, Record<string, string>>;
  relationships: Record<NPC, Relation>;
  evidence: Evidence[];
  observations: Observation[];
  journal: { at: number; text: string }[];
  message: string;
  finished: boolean;
  hints: number;
};
const npcIds = Object.keys(characters) as NPC[];
export const clock = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(Math.floor(m % 60)).padStart(2, "0")}`;
export function initialStory(): Story {
  return {
    schema: 1,
    flags: [],
    done: [],
    beats: [],
    facts: {
      matching: "unfinished",
      production: "stable",
      task: "implementation in progress",
    },
    claims: [],
    knowledge: Object.fromEntries(
      npcIds.map((n) => [
        n,
        n === "mark"
          ? ["deadline", "reliabilityDoubt"]
          : n === "sarah"
            ? ["libraryContract", "leadDiscussion"]
            : [],
      ]),
    ) as Story["knowledge"],
    beliefs: Object.fromEntries(npcIds.map((n) => [n, {}])) as Story["beliefs"],
    relationships: Object.fromEntries(
      npcIds.map((n) => [
        n,
        { trust: 0, suspicion: 0, warmth: 0, confidence: 0, resentment: 0 },
      ]),
    ) as Story["relationships"],
    evidence: [],
    observations: [],
    journal: [
      {
        at: 527,
        text: "Mark: “Reconciliation needs to be ready today for Thursday’s client demo. Stand-up at nine.”",
      },
    ],
    message:
      "Rain outside. Daniel’s feature is unfinished. Inspect his workstation before stand-up; the noticeboard holds the team conversation.",
    finished: false,
    hints: 0,
  };
}
export const has = (s: Story, f: string) => s.flags.includes(f);
function flag(s: Story, f: string) {
  if (!has(s, f)) s.flags.push(f);
}
function know(s: Story, n: NPC, f: string) {
  if (!s.knowledge[n].includes(f)) s.knowledge[n].push(f);
}
function team(s: Story, f: string) {
  for (const n of npcIds.filter((n) => n !== "luis")) know(s, n, f);
}
function note(s: Story, at: number, text: string) {
  s.message = text;
  s.journal.push({ at, text });
}
function evidence(
  s: Story,
  id: string,
  at: number,
  content: string,
  source: string,
  editable = false,
  access = ["daniel"],
  provenance = "recorded observation",
) {
  s.evidence.push({
    id,
    source,
    at,
    content,
    editable,
    visibility: access.length > 1 ? "shared" : "private",
    access,
    altered: false,
    provenance,
  });
}
export function available(a: ActionDef, s: Story, m: number) {
  if (
    s.finished ||
    (a.from !== undefined && m < a.from) ||
    (a.until !== undefined && m >= a.until)
  )
    return false;
  if (a.once && s.done.includes(a.id)) return false;
  if (a.needs?.some((f) => !has(s, f)) || a.absent?.some((f) => has(s, f)))
    return false;
  if (a.place === "sarah" && m >= 580 && m < 590) return false;
  if (
    (a.place === "kevin" || a.place === "maya" || a.place === "luis") &&
    ["lunch", "rounds", "away"].includes(extraSchedule(a.place, m))
  )
    return false;
  return true;
}
export function unavailableReason(a: ActionDef, s: Story, m: number) {
  if (a.from !== undefined && m < a.from)
    return `Available from ${clock(a.from)}`;
  if (a.until !== undefined && m >= a.until)
    return "That opportunity has passed; another route remains available.";
  const missing = a.needs?.filter((f) => !has(s, f));
  return missing?.length
    ? `Investigate first: ${missing.map((f) => records[f as RecordId]?.[0] || f).join(", ")}`
    : "This action is not available now.";
}
export function advanceStory(old: Story, m: number): Story {
  const pending = beats.filter((b) => m >= b.at && !old.beats.includes(b.id));
  const qa = m >= 630 && has(old, "submitted") && !has(old, "qaFailure");
  const witness =
    m >= 590 && has(old, "sarahCode") && !has(old, "sarahReturned");
  if (!pending.length && !qa && !witness) return old;
  const s = structuredClone(old);
  for (const b of pending) {
    s.beats.push(b.id);
    note(s, b.at, b.text);
    if (b.id === "departure" && !has(s, "standup")) {
      flag(s, "standup");
      s.facts.standup = "No status offered";
      s.claims.push({ at: 540, text: "No status offered", kind: "silence" });
      team(s, "standupSilence");
    }
    if (b.id === "incident") {
      s.facts.production = "wrong totals";
      // The deployed wrapper predates today: even an unsubmitted feature cannot erase the incident.
      evidence(
        s,
        "deployment",
        860,
        "Yesterday 16:05: Daniel’s reconciliation wrapper deployed behind the existing reconciliation job. Today’s feature is a separate pending build.",
        "Deployment audit",
        false,
        ["daniel", "luis"],
        "immutable deployment audit",
      );
      for (const n of ["sarah", "maya", "kevin", "luis"] as NPC[])
        know(s, n, "productionAlert");
      s.beliefs.kevin.incident = "library suspected from stack trace";
    }
    if (b.id === "return") {
      // Mark reads the shared thread on landing, not Daniel’s private inspections.
      know(s, "mark", "productionAlert");
      if (has(s, "blamedSarah") && !has(s, "disclosed"))
        s.beliefs.mark.incident = "Sarah library suspected in team thread";
      if (has(s, "recovered")) know(s, "mark", "serviceStable");
      note(s, b.at, markQuestion(s));
    }
    if (b.id === "ending" && !has(s, "recovered")) {
      s.facts.production = "isolated by Luis; feature unavailable";
      know(s, "luis", "emergencyIsolation");
      note(
        s,
        b.at,
        "Luis isolates reconciliation before handover. Totals stop propagating; the feature is unavailable. Sarah waits by the elevator.",
      );
    }
  }
  if (qa) {
    flag(s, "qaFailure");
    know(s, "maya", "qaFailure");
    note(
      s,
      m,
      "Maya: “An unmatched row vanished. The locale changed this morning, but I need to compare the reproduction before blaming the environment.”",
    );
  }
  if (witness) flag(s, "sarahReturned");
  return s;
}
export function markQuestion(s: Story) {
  const base = "Mark: “Landed. How did everything go?";
  if (s.knowledge.mark.includes("wrapperFault"))
    return base + " I read your wrapper explanation. What is still at risk?”";
  if (has(s, "blamedSarah"))
    return (
      base + " The thread points at Sarah’s library. Has anyone verified that?”"
    );
  if (s.claims.some((c) => c.kind === "stand-done") && has(s, "submitted"))
    return (
      base +
      " You said done at nine; Maya’s upload arrived later. What changed?”"
    );
  return (
    base +
    " I see the reconciliation alert. What is stable, and what is still unfinished?”"
  );
}
function observe(s: Story, a: ActionDef, m: number, summary: string) {
  const contexts: Record<string, Pick<Observation, "context" | "detection">> = {
    copy: { context: "private", detection: "low" },
    "read-private": { context: "private", detection: "low" },
    "edit-task": { context: "private", detection: "low" },
    // Luis authorizes recovery; Luis/Maya can inspect its immutable audit.
    "fix-wrapper": { context: "public", detection: "high" },
    rollback: { context: "public", detection: "high" },
    "safe-hold": { context: "public", detection: "high" },
  };
  const context = contexts[a.id] ?? { context: "public", detection: "high" };
  const correctionSources: Record<string, string[]> = {
    "qa-correct": ["qa-blame"],
    "correct-record": [
      "stand-shade",
      "stand-done",
      "stand-redirect",
      "edit-task",
    ],
    "incident-admit": ["incident-blame"],
    "challenge-blame": ["incident-blame"],
  };
  // A diagnosis/disclosure is not a retraction of an unrelated earlier claim.
  const source = [...s.observations]
    .reverse()
    .find((o) => correctionSources[a.id]?.includes(o.action));
  const recovery = ["fix-wrapper", "rollback", "safe-hold"].includes(a.id);
  const misleading = [
    "stand-shade",
    "stand-done",
    "stand-redirect",
    "qa-blame",
    "incident-blame",
    "edit-task",
    "mark-short",
  ].includes(a.id);
  s.observations.push({
    action: a.id,
    at: m,
    category: source
      ? "correction"
      : correctionSources[a.id]
        ? "clarification"
        : recovery
          ? "repair"
          : a.read
            ? "inspection"
            : a.id.startsWith("stand-")
              ? "claim"
              : a.id.includes("fix")
                ? "repair"
                : "action",
    detection: context.detection,
    benefit: misleading
      ? "protect apparent progress"
      : context.context === "private"
        ? "gain time or information"
        : "advance shared work",
    harm:
      a.id === "qa-blame"
        ? "Maya loses investigation time"
        : a.id === "incident-blame"
          ? "Sarah absorbs suspicion"
          : a.id === "read-private"
            ? "private confidence exposed"
            : "none established",
    context: context.context,
    initiated: !a.id.startsWith("mark-"),
    escalation:
      misleading && s.observations.some((o) => o.rationalization !== ""),
    correction: !!source,
    ...(source ? { corrects: source.action } : {}),
    rationalization: misleading ? a.label : "",
    summary,
  });
}
export function act(
  old: Story,
  id: string,
  m: number,
  place: Place,
): { story: Story; minute: number } {
  const a = actions.find((a) => a.id === id);
  if (!a || a.place !== place || !available(a, old, m))
    return { story: old, minute: m };
  const s = structuredClone(old);
  if (!s.done.includes(id)) s.done.push(id);
  const reread = !!a.read && has(old, a.read);
  const end = Math.min(1035, m + (reread ? 0 : a.cost || 0));
  let reply = "";
  if (a.read) {
    flag(s, a.read);
    reply = records[a.read][1];
    if (!s.evidence.some((e) => e.id === a.read))
      evidence(
        s,
        a.read,
        m,
        reply,
        records[a.read][0],
        a.read === "tracker",
        a.read === "private" ? ["daniel", "sarah", "kevin"] : ["daniel"],
        a.read === "sarahCode"
          ? "Sarah Chen implementation"
          : "inspected original",
      );
    if (a.read === "private") {
      s.facts.privateRead = clock(m);
      reply +=
        " Daniel now knows why the afternoon feels different. Sarah and Kevin do not know he opened it.";
    }
  } else
    switch (id) {
      case "assess":
        flag(s, "assessed");
        reply =
          "The feature is not almost finished: there is no matcher and no passing build. The task status was accurate; yesterday’s promise was not fulfilled.";
        break;
      case "stand-plain":
      case "stand-shade":
      case "stand-redirect":
      case "stand-done":
        flag(s, "standup");
        s.facts.standup = a.label;
        s.claims.push({ at: m, text: a.label, kind: id });
        team(s, id);
        evidence(s, "standup-claim", m, a.label, "Stand-up minutes", false, [
          "daniel",
          "sarah",
          "maya",
          "kevin",
          "mark",
        ]);
        s.beliefs.mark.progress =
          id === "stand-done"
            ? "ready"
            : id === "stand-plain"
              ? "unfinished"
              : "near completion / unclear";
        s.relationships.mark.confidence += id === "stand-plain" ? -1 : 1;
        reply =
          id === "stand-plain"
            ? "Mark: “That puts the demo at risk. Maya, reserve the afternoon. Daniel, give me an actual build time.”"
            : id === "stand-redirect"
              ? "Kevin: “The API bug is mine, but it doesn’t stop the local matcher.” Mark: “Send Maya a build after this.”"
              : "Mark: “Good. Send Maya the build. I’ll be travelling.” Maya reserves her test slot.";
        break;
      case "ask-matcher":
      case "derive":
      case "copy":
        flag(s, "matching");
        s.facts.matching =
          id === "copy"
            ? "adapted without permission"
            : id === "derive"
              ? "derived independently"
              : "with Sarah";
        s.facts.matchTime = clock(end);
        reply =
          "The matcher now handles the sample ledger. The wrapper still needs QA. Commit and upload from Daniel’s workstation.";
        if (id === "ask-matcher") {
          know(s, "sarah", "helpedDaniel");
          s.relationships.sarah.trust++;
          s.relationships.sarah.warmth++;
          reply =
            "Sarah stops typing. “Use the account ID. Names are only a lookup aid. I can give you twenty-five minutes; after that I need my integration back.” " +
            reply;
        }
        if (id === "copy") {
          evidence(
            s,
            "provenance",
            m,
            "Sarah’s signature and variable names persist in Daniel’s branch.",
            "Local diff",
            false,
            ["daniel"],
            "Sarah Chen",
          );
          if (end >= 590) {
            know(s, "sarah", "deskAccess");
            s.relationships.sarah.suspicion += 2;
            reply +=
              " Sarah returns as Daniel steps away: “Were you using my workstation?”";
          }
        }
        break;
      case "credit":
      case "commit":
        flag(s, "committed");
        s.facts.commitTime = clock(m);
        s.facts.credit = id === "credit" ? "Sarah acknowledged" : "Daniel only";
        evidence(
          s,
          "commit-record",
          m,
          `${a.label}; ${s.facts.matching}`,
          "Remote Git audit",
          false,
          ["daniel", "sarah", "kevin"],
          "immutable commit",
        );
        if (id === "credit") {
          know(s, "sarah", "credited");
          s.relationships.sarah.confidence++;
        }
        reply =
          "Commit stored in remote history. Maya still needs the uploaded build.";
        break;
      case "submit":
        flag(s, "submitted");
        s.facts.uploadTime = clock(m);
        know(s, "maya", "buildReceived");
        evidence(
          s,
          "upload-record",
          m,
          "First Daniel build received",
          "QA upload ledger",
          false,
          ["daniel", "maya"],
        );
        reply = "Build uploaded. Maya’s first QA slot starts at 10:30.";
        break;
      case "qa-blame":
        flag(s, "blamedMaya");
        s.beliefs.maya.qa = "locale might be responsible";
        s.relationships.maya.confidence--;
        reply =
          "Maya: “I did change locale. I’ll restore it and rerun.” Twelve minutes pass; the same row still disappears. Her report remains available.";
        break;
      case "qa-defer":
        reply =
          "Maya preserves the reproduction and moves another test into this slot. Your build remains blocked.";
        break;
      case "qa-fix":
        flag(s, "qaFixed");
        s.facts.qa = "unmatched rows retained";
        know(s, "maya", "qaPass");
        reply =
          "Six sample tests and Maya’s unmatched-row reproduction pass. Maya: “That build is usable. What changed?”";
        break;
      case "qa-correct":
        know(s, "maya", "wrapperEmptyFault");
        s.beliefs.maya.qa = "Daniel empty-result branch";
        s.relationships.maya.trust++;
        s.relationships.maya.confidence++;
        reply =
          "Maya: “Thanks. I’ll attach the failing and passing runs. We can stop chasing locale.”";
        break;
      case "help-kevin":
        know(s, "kevin", "helpedAPI");
        s.relationships.kevin.warmth++;
        reply =
          "Kevin: “The API retries were duplicating requests. Nice catch. Lunch is on me next time.” He records Daniel’s help in the thread.";
        break;
      case "lead-talk":
        know(s, "sarah", "leadMentioned");
        s.relationships.sarah.suspicion++;
        reply =
          "Sarah pauses. “Mark and I haven’t announced anything. But yes, I need an owner, not someone I have to cover for.”";
        break;
      case "compare":
        flag(s, "compared");
        reply = `Stand-up: ${s.facts.standup || "no statement"}. First commit: ${s.facts.commitTime || "none"}. QA upload: ${s.facts.uploadTime || "none"}. Task: ${s.facts.task}. Changing the task alone cannot make independent timestamps agree.`;
        break;
      case "edit-task":
        s.facts.task = "complete before stand-up";
        flag(s, "taskAltered");
        evidence(
          s,
          "task-edit",
          m,
          "In progress → complete before stand-up",
          "Task audit",
          false,
          ["daniel", "mark", "maya"],
          "append-only audit",
        );
        for (const e of s.evidence) if (e.id === "tracker") e.altered = true;
        reply =
          "The displayed description changes. The status audit keeps this edit’s time; Git, chat and the QA upload are untouched.";
        break;
      case "correct-record":
        flag(s, "recordCorrected");
        team(s, "timelineCorrection");
        s.facts.task = "corrected with actual timeline";
        s.relationships.mark.trust++;
        reply = `Posted: first commit ${s.facts.commitTime || "not made"}, QA upload ${s.facts.uploadTime || "not made"}. The original statement remains in the minutes.`;
        break;
      case "access":
        flag(s, "access");
        know(s, "luis", "accessRequested");
        reply =
          "Luis: “Here is the audit. Your wrapper went out yesterday at 16:05; today’s feature build is separate. I can authorize a patch, a rollback, or holding ambiguous rows. Every deployment is logged.”";
        break;
      case "diagnose":
        flag(s, "diagnosed");
        s.facts.cause = "Daniel wrapper selected first candidate";
        reply =
          "Reproduction confirms the chain: duplicate names → valid candidate set → Daniel picks index zero → wrong account total. Earlier tests used unique names. The library kept its contract.";
        break;
      case "incident-tell":
      case "incident-admit":
      case "challenge-blame":
        flag(s, "disclosed");
        team(s, "wrapperFault");
        for (const n of npcIds.filter((n) => n !== "luis"))
          s.beliefs[n].incident = "Daniel wrapper";
        s.relationships.sarah.trust++;
        s.relationships.maya.trust++;
        s.facts.disclosure = has(s, "recovered")
          ? "after recovery / correction"
          : "before recovery";
        reply =
          "Team message recorded. Sarah: “That fits the contract. I’ll check the regression while you handle the wrapper.”";
        break;
      case "incident-blame":
        flag(s, "blamedSarah");
        team(s, "libraryAccusation");
        s.beliefs.maya.incident = "library under investigation";
        s.beliefs.kevin.incident = "Sarah library suspected";
        s.relationships.sarah.resentment += 2;
        reply =
          "Kevin moves to Sarah’s library. Sarah stops typing: “A stack trace names a call, not the cause. Send me the failing inputs.” Investigation time shifts away from the wrapper.";
        break;
      case "ask-private":
        flag(s, "contract");
        know(s, "sarah", "privateContractQuestion");
        s.relationships.sarah.confidence++;
        reply =
          "Sarah: “It returns candidates. Show me what your caller does with two of them.” The contract is now in Daniel’s notes; the team has not been told.";
        break;
      case "fix-wrapper":
      case "rollback":
      case "safe-hold":
        flag(s, "recovered");
        s.facts.recovery = id;
        s.facts.recoveryTime = clock(end);
        s.facts.production =
          id === "fix-wrapper"
            ? "correct totals; feature active"
            : id === "rollback"
              ? "stable; new reconciliation disabled"
              : "stable; ambiguous rows await manual processing";
        know(s, "luis", "deploymentChanged");
        know(s, "maya", "serviceStable");
        evidence(
          s,
          "recovery",
          end,
          s.facts.production,
          "Deployment audit",
          false,
          ["daniel", "luis", "maya"],
          "immutable deployment",
        );
        reply =
          id === "fix-wrapper"
            ? "Duplicate-name regression passes; the new wrapper is live. Luis records the deployment. No explanation has been sent automatically."
            : id === "rollback"
              ? "Luis restores the previous release. Wrong totals stop, but the client demo loses the new feature. The cause has not been explained."
              : "Ambiguous rows are held instead of guessed. Maya inherits a manual queue; ordinary rows reconcile. The cause has not been explained.";
        break;
      case "mark-full":
      case "mark-short":
      case "mark-lead":
        flag(s, "markAnswered");
        know(s, "mark", "handover");
        s.facts.markReply = a.label;
        if (id === "mark-full") {
          know(s, "mark", "timeline");
          if (has(s, "diagnosed")) {
            know(s, "mark", "wrapperFault");
            s.beliefs.mark.incident = "Daniel wrapper";
          }
          s.relationships.mark.trust++;
          reply =
            "Mark: “Keep those timestamps and the remaining work attached. We’ll reset the demo scope tomorrow.”";
        } else if (id === "mark-lead") {
          know(s, "mark", "leadRequested");
          reply =
            "Mark: “We can discuss leadership tomorrow. Reliability means a usable handover today. Send the remaining risks.”";
        } else {
          s.relationships.mark.suspicion++;
          reply =
            "Mark: “Stable is useful. It doesn’t tell me what changed or what the demo can do. Keep the audit for tomorrow.”";
        }
        break;
      case "finish":
        s.finished = true;
        reply = elevatorLine(s);
        break;
    }
  if (!reread) observe(s, a, m, reply || a.label);
  note(s, end, reply || a.label);
  return { story: advanceStory(s, end), minute: end };
}
export function elevatorLine(s: Story) {
  if (has(s, "blamedSarah") && !has(s, "disclosed"))
    return "Sarah: “Tomorrow, we need to separate the trace from the story people told about it.”";
  if (has(s, "disclosed") && s.relationships.sarah.trust > 0)
    return "Sarah: “Thanks for putting the wrapper in the thread. I didn’t want to spend tomorrow proving it wasn’t the library.”";
  if (
    s.knowledge.sarah.includes("deskAccess") &&
    !s.knowledge.sarah.includes("credited")
  )
    return "Sarah: “Ask before using my workstation next time.”";
  if (s.relationships.sarah.warmth > 0)
    return "Sarah: “See you tomorrow. Bring the regression cases.”";
  return "Sarah holds the elevator. “See you tomorrow.” There is a pause before the doors close.";
}
export function reconstruction(s: Story): string[] {
  const out: string[] = [];
  const claim = s.claims[0];
  if (claim) out.push(`${clock(claim.at)} · Stand-up: ${claim.text}`);
  out.push(
    `Implementation: ${s.facts.matching}; credit: ${s.facts.credit || "no commit"}. QA: ${s.facts.qa || "unfinished"}.`,
  );
  if (has(s, "blamedMaya"))
    out.push(
      "Maya spent twelve minutes undoing a locale change that did not cause the missing row." +
        (s.knowledge.maya.includes("wrapperEmptyFault")
          ? " You later corrected that explanation."
          : " She received no explicit correction."),
    );
  if (has(s, "private"))
    out.push(
      `You opened a private conversation at ${s.facts.privateRead}. It gave you information about the lead role that Sarah had not shared with you.`,
    );
  if (has(s, "taskAltered"))
    out.push(
      "You changed a displayed record; independent Git, chat and upload timestamps remained." +
        (has(s, "recordCorrected")
          ? " A later dated correction remains beside the edit."
          : ""),
    );
  out.push(
    `Production: ${s.facts.production}. Recovery: ${s.facts.recovery || "Luis isolated the job"}.`,
  );
  const repair = s.observations.find((o) =>
    ["fix-wrapper", "rollback", "safe-hold"].includes(o.action),
  );
  const disclosure = s.observations.find((o) =>
    ["incident-tell", "incident-admit", "challenge-blame"].includes(o.action),
  );
  if (repair)
    out.push(
      disclosure
        ? `You explained your role ${disclosure.at <= repair.at ? "before" : "after"} starting recovery.`
        : "You changed the system without explaining your role to the team. The deployment itself was still logged.",
    );
  if (has(s, "blamedSarah"))
    out.push(
      has(s, "disclosed")
        ? "You first directed suspicion toward Sarah, then corrected the team’s explanation."
        : "You directed suspicion toward Sarah; that explanation remained in the team thread.",
    );
  const privateActs = s.observations.filter(
    (o) => o.context === "private" && o.detection === "low",
  );
  if (privateActs.length)
    out.push(
      `When oversight was limited, your recorded actions included: ${privateActs.map((o) => actions.find((a) => a.id === o.action)?.label || o.action).join("; ")}.`,
    );
  if (s.observations.some((o) => o.correction))
    out.push(
      "Later corrections changed what people knew; they did not remove the earlier records.",
    );
  out.push(`Mark’s handover: ${s.facts.markReply || "No reply sent"}.`);
  return out;
}
export function objective(s: Story, m: number) {
  if (m >= 1035) return "The day is over. Sarah is at the elevator.";
  if (m >= 970)
    return "Mark is online. Reply through Daniel’s workstation; finish any handover before leaving.";
  if (m >= 860)
    return has(s, "recovered")
      ? "Service is stable. Decide what to tell the team; Mark lands at 16:10."
      : "Production totals are wrong. Read the alert at infrastructure; Luis controls recovery access.";
  if (m >= 810)
    return "Compare Git, task, chat and QA timestamps at Daniel’s workstation.";
  if (m >= 750 && m < 810)
    return "Kevin is back. Finish outstanding work or compare the afternoon records at 13:30.";
  if (m >= 720)
    return "Kevin is at lunch until 12:30. His private message preview is visible.";
  if (has(s, "qaFailure") && !has(s, "qaFixed"))
    return "Maya has a reproduction. Compare it with the config, requirements and wrapper.";
  if (m >= 560 && !has(s, "matching"))
    return "Build the matcher: ask Sarah, derive from samples, or observe her coffee routine.";
  if (has(s, "matching") && !has(s, "submitted"))
    return "Commit and upload the build from Daniel’s workstation.";
  if (has(s, "qaFixed"))
    return "The QA build passes. Kevin could use help with his API trace before lunch.";
  if (has(s, "submitted"))
    return "Maya has the build. Her first test slot starts at 10:30.";
  if (m >= 551) return "Mark has left. The matching work starts at 09:20.";
  if (m >= 540 && !has(s, "standup"))
    return "Mark is waiting for your status. Join stand-up at the noticeboard.";
  if (m >= 540)
    return "Stand-up is over. Mark leaves at 09:11; work continues after he goes.";
  return "Inspect your source, requirements, yesterday’s chat and test output before stand-up.";
}
export function hint(s: Story, m: number) {
  if (m >= 860)
    return s.hints % 2 === 0
      ? "Compare two rows that share a name. Does a stack trace prove the library failed?"
      : "Inspect the contract, deployed wrapper and prior test coverage. Reproduce the duplicate-name case; ask Luis for recovery access.";
  if (m >= 810)
    return "Collect the four independent timestamp records and local source. Editing the displayed task does not edit the audit.";
  if (has(s, "qaFailure"))
    return "The locale changes formatting, not account IDs. Compare the vanished row with the empty-result branch.";
  return s.hints % 2 === 0
    ? "The requirements and sample ledger describe matching. Sarah has done similar work."
    : "Ask Sarah after 09:20 or derive at your workstation. The noticeboard also gives her coffee window; missing it never blocks the other routes.";
}
