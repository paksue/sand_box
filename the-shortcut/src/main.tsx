import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Scene from "./render/Scene";
import { objects } from "./content/world";
import { npcState, timeLabel } from "./simulation/game";
import { dispatch, reset, save, status, useGame } from "./simulation/store";
import "./ui/style.css";
function App() {
  const s = useGame(),
    [debug, setDebug] = useState(false),
    [hover, setHover] = useState(""),
    [time, setTime] = useState("09:40");
  const obj = objects.find((o) => o.id === s.inspection),
    npcs = npcState(s);
  return (
    <main>
      <Scene onHover={setHover} />
      <header>
        <strong>THE SHORTCUT</strong>
        <span>Developer area · Graybox 01</span>
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
      <div className="hint">
        {hover || "Click the floor to walk · Click an object to inspect"}
      </div>
      <aside className="legend">
        <span className="daniel">● Daniel</span>
        <span className="sarah">● Sarah</span>
        <span className="mark">● Mark</span>
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
          {objects.map((o) => (
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
          <p className="note">
            Schedule fixture: stand-up 09:00; Mark leaves 09:11; Sarah coffee
            09:40–09:50. No story events implemented.
          </p>
        </section>
      )}
      {obj && (
        <section className="inspection" role="dialog" aria-label={obj.name}>
          <button
            className="close"
            aria-label="Close inspection"
            onClick={() => dispatch({ type: "dismiss" })}
          >
            ×
          </button>
          <h2>{obj.name}</h2>
          <p>{obj.text}</p>
        </section>
      )}
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
