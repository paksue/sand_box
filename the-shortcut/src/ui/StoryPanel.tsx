import { useEffect, useRef, useState } from "react";
import {
  actions,
  characters,
  records,
  type Place,
  type RecordId,
} from "../content/story";
import { allObjects, extraSchedule } from "../content/world";
import type { State } from "../simulation/game";
import {
  available,
  clock,
  elevatorLine,
  has,
  markQuestion,
  objective,
  reconstruction,
  unavailableReason,
} from "../simulation/story";
import { dispatch } from "../simulation/store";
export function StoryPanel({ s }: { s: State }) {
  const [tab, setTab] = useState("Work");
  const panel = useRef<HTMLElement>(null);
  const place = s.inspection as Place,
    m = s.ticks / 1200;
  useEffect(() => {
    setTab("Work");
    panel.current?.focus();
  }, [place]);
  if (!place) return null;
  const obj = allObjects.find((o) => o.id === place);
  const person = characters[place as keyof typeof characters];
  const title = obj?.name || person?.name || place;
  const own = place === "daniel-desk";
  const groups = ["Work", "Messages", "Records", "Incident"];
  const group = (id: string) =>
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
  const list = actions.filter(
    (a) => a.place === place && (!own || group(a.id) === tab),
  );
  const shown = list
    .filter((a) => !a.once || !s.story.done.includes(a.id))
    .filter((a) => !a.absent?.some((f) => has(s.story, f)))
    .filter(
      (a) =>
        (a.from === undefined || m >= a.from) &&
        (a.until === undefined || m < a.until),
    );
  const away =
    (place === "kevin" || place === "maya" || place === "luis") &&
    ["lunch", "rounds", "away"].includes(extraSchedule(place, m));
  return (
    <section
      className={`inspection ${own ? "computer" : ""}`}
      role="dialog"
      aria-label={title}
      tabIndex={-1}
      ref={panel}
      onKeyDown={(e) => {
        if (e.key === "Escape") dispatch({ type: "dismiss" });
      }}
    >
      <button
        className="close"
        aria-label="Close inspection"
        onClick={() => dispatch({ type: "dismiss" })}
      >
        ×
      </button>
      <h2>{title}</h2>
      <p className="note">
        {obj?.text ||
          (away
            ? "Away from the desk. Notes remain available; come back to talk."
            : place === "sarah"
              ? "Sarah stops typing and looks up."
              : place === "maya"
                ? "Maya keeps the reproduction beside the build."
                : place === "kevin"
                  ? "Kevin swivels away from his API trace."
                  : place === "luis"
                    ? "Luis keeps the deployment audit open."
                    : "Mark’s suitcase is by the door.")}
      </p>
      {own && (
        <div className="tabs" role="tablist" aria-label="Workstation apps">
          {groups.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}
      {own && m >= 970 && tab === "Messages" && <p>{markQuestion(s.story)}</p>}
      {place === "kevin-desk" && m >= 720 && m < 750 && (
        <p>
          Private · Sarah: “I probably shouldn’t say this, but Mark told me…”
        </p>
      )}
      {place === "sarah-desk" && !(m >= 580 && m < 590) && (
        <p>
          Sarah’s session is not available. You can ask her for help or derive
          the matcher from your samples.
        </p>
      )}
      <div className="story-response" role="status">
        {s.story.message}
      </div>
      <div className="actions">
        {shown.map((a) => (
          <div key={a.id}>
            <button
              data-action={a.id}
              disabled={!available(a, s.story, m)}
              onClick={() => dispatch({ type: "story", id: a.id })}
            >
              {a.label}
              {a.cost ? ` · ${a.cost} min` : ""}
            </button>
            {!available(a, s.story, m) && (
              <small>{unavailableReason(a, s.story, m)}</small>
            )}
          </div>
        ))}
      </div>
      {!shown.length && <p>{objective(s.story, m)}</p>}
      <p className="note">
        The clock pauses while reading. Actions show their time cost. Close to
        explore or wait.
      </p>
    </section>
  );
}
export function Journal({ s, onClose }: { s: State; onClose: () => void }) {
  return (
    <section className="journal inspection" role="dialog" aria-label="Notebook">
      <button className="close" aria-label="Close notebook" onClick={onClose}>
        ×
      </button>
      <h2>Daniel’s notebook</h2>
      <p>{objective(s.story, s.ticks / 1200)}</p>
      <button onClick={() => dispatch({ type: "hint" })}>
        Look for another clue
      </button>
      <p>{s.story.message}</p>
      <h3>Collected evidence</h3>
      {s.story.evidence.map((e, i) => (
        <details key={i}>
          <summary>
            {clock(e.at)} · {e.source}
            {e.altered ? " · edited" : ""}
          </summary>
          <p>{e.content}</p>
          <small>
            {e.editable ? "Display editable" : "Original record retained"} ·{" "}
            {e.provenance}
          </small>
        </details>
      ))}
      {has(s.story, "contract") &&
        !s.story.evidence.some((e) => e.id === "contract") && (
          <p>{records["contract" as RecordId][1]}</p>
        )}
      <h3>Day log</h3>
      {s.story.journal.map((j, i) => (
        <p key={i}>
          {clock(j.at)} · {j.text}
        </p>
      ))}
    </section>
  );
}
export function Ending({ s }: { s: State }) {
  return (
    <section
      className="ending"
      role="dialog"
      aria-label="Behavioral reconstruction"
    >
      <p>17:15 · THE CONFERENCE</p>
      <h1>THE SHORTCUT</h1>
      <p>A reconstruction from the day’s records</p>
      <ul>
        {reconstruction(s.story).map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
      <blockquote>{elevatorLine(s.story)}</blockquote>
      <p className="note">
        No verdict. These are the actions, records and explanations you left
        behind. Your session is saved; Debug → Reset session starts another day.
      </p>
    </section>
  );
}
