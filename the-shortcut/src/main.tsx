import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Scene from "./render/Scene";
import { allObjects, extraSchedule } from "./content/world";
import { npcState, timeLabel } from "./simulation/game";
import { dispatch, reset, save, status, useGame } from "./simulation/store";
import { characters } from "./content/story";
import { objective } from "./simulation/story";
import { StoryPanel, Journal, Ending } from "./ui/StoryPanel";
import "./ui/style.css";
function App() {
  const s = useGame(),
    [debug, setDebug] = useState(false),
    [notebook, setNotebook] = useState(false),
    [interact, setInteract] = useState(false),
    [hover, setHover] = useState(""),
    [time, setTime] = useState("09:40");
  const npcs = npcState(s);
  return (
    <main>
      <Scene onHover={setHover} />
      <header>
        <strong>THE SHORTCUT</strong>
        <span>The Conference · Graybox 02</span>
      </header>
      <nav aria-label="Session">
        <time>{timeLabel(s)}</time>
        <button onClick={() => dispatch({ type: "pause" })}>
          {s.paused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={() => {
            save();
            setDebug(true);
          }}
        >
          Save
        </button>
        <button aria-expanded={debug} onClick={() => setDebug(!debug)}>
          Debug
        </button>
      </nav>
      <div className="story-tools">
        <button onClick={() => setInteract(!interact)} aria-expanded={interact}>
          Interact
        </button>
        <button onClick={() => setNotebook(!notebook)}>Notebook</button>
        <button
          onClick={() => dispatch({ type: "wait" })}
          disabled={s.story.finished || s.ticks >= 1035 * 1200}
        >
          Wait to next moment
        </button>
      </div>
      {interact && (
        <section className="interact" aria-label="Nearby interactions">
          {[
            ...allObjects,
            ...Object.entries(characters).map(([id, c]) => ({
              id,
              name: c.name,
            })),
          ].map((o) => (
            <button
              key={o.id}
              onClick={() => {
                dispatch({ type: "inspect", id: o.id });
                setInteract(false);
              }}
            >
              {o.name}
            </button>
          ))}
        </section>
      )}
      <div className="objective">{objective(s.story, s.ticks / 1200)}</div>
      <div className="hint">
        {hover || "Click the floor to walk · Click an object to inspect"}
      </div>
      {!s.inspection && !notebook && (
        <p className="caption" aria-live="polite">
          {s.story.message}
        </p>
      )}
      <aside className="legend">
        <span className="daniel">● Daniel</span>
        <span className="sarah">● Sarah</span>
        <span className="mark">● Mark</span>
        <span>● Maya</span>
        <span>● Kevin</span>
        <span>● Luis</span>
      </aside>
      {debug && (
        <section className="debug" aria-label="Debug tools">
          <h2>Simulation probe</h2>
          <p>
            Time {timeLabel(s)} · tick {s.ticks}
          </p>
          <p>
            Daniel {s.player.x.toFixed(2)}, {s.player.z.toFixed(2)}
          </p>
          <p data-testid="npc-state">
            Sarah: {npcs.sarah}
            <br />
            Mark: {npcs.mark}
          </p>
          <label>
            Set time{" "}
            <input
              aria-label="Set time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
          <button
            onClick={() => {
              const [h, m] = time.split(":").map(Number);
              dispatch({ type: "time", minute: h * 60 + m });
            }}
          >
            Set
          </button>
          <button
            onClick={() =>
              dispatch({
                type: "time",
                minute: Math.floor(s.ticks / 1200) + 10,
              })
            }
          >
            +10 min
          </button>
          <p>Inspect objects (keyboard alternative)</p>
          {allObjects.map((o) => (
            <button
              key={o.id}
              onClick={() => dispatch({ type: "inspect", id: o.id })}
            >
              {o.name}
            </button>
          ))}
          <p data-testid="inspected">Inspected: {s.inspected.length}/3</p>
          <output>{status()}</output>
          <button
            onClick={() => {
              if (confirm("Reset this graybox session?")) reset();
            }}
          >
            Reset session
          </button>
          <details>
            <summary>Story state and export</summary>
            <pre>
              {JSON.stringify(
                {
                  schedules: {
                    maya: extraSchedule("maya", s.ticks / 1200),
                    kevin: extraSchedule("kevin", s.ticks / 1200),
                    luis: extraSchedule("luis", s.ticks / 1200),
                  },
                  ...s.story,
                },
                null,
                2,
              )}
            </pre>
            <button
              onClick={() => {
                const u = URL.createObjectURL(
                  new Blob([JSON.stringify(s, null, 2)], {
                    type: "application/json",
                  }),
                );
                const a = document.createElement("a");
                a.href = u;
                a.download = "the-shortcut-state.json";
                a.click();
                URL.revokeObjectURL(u);
              }}
            >
              Export state
            </button>
          </details>
          <p className="note">
            Story clock: 08:47–17:15. Time jumps fire due events once; backward
            jumps only rewind schedules. Reset for a fresh story.
          </p>
        </section>
      )}
      <StoryPanel s={s} />
      {notebook && <Journal s={s} onClose={() => setNotebook(false)} />}
      {s.story.finished && <Ending s={s} />}
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
