#!/usr/bin/env bash
set -euo pipefail

GAME_DIR="$(realpath "$1")"
RESULT_DIR="$(realpath "$2")"
mkdir -p "$RESULT_DIR"
ACTION_LOG="$RESULT_DIR/action-log.tsv"
printf 'step\taction\n' > "$ACTION_LOG"

TARGET=""
for pattern in 'OREGON.EXE' 'oregon.exe' 'OREGON.BAT' 'oregon.bat' 'TRAIL.EXE' 'trail.exe' 'START.BAT' 'start.bat'; do
  candidate="$(find "$GAME_DIR" -type f -name "$pattern" | head -n 1 || true)"
  if [[ -n "$candidate" ]]; then TARGET="$candidate"; break; fi
done
if [[ -z "$TARGET" ]]; then TARGET="$(find "$GAME_DIR" -type f \( -iname '*.bat' -o -iname '*.exe' -o -iname '*.com' \) | head -n 1 || true)"; fi
[[ -n "$TARGET" ]] || { echo 'Could not find DOS launch target' >&2; exit 3; }

REL="${TARGET#${GAME_DIR}/}"; REL_DIR="$(dirname "$REL")"; BASE="$(basename "$REL")"
echo "Launch target: $TARGET" > "$RESULT_DIR/launch-target.txt"
cat > /tmp/oregon1990.conf <<EOF
[sdl]
fullscreen=false
output=surface
windowresolution=640x480
autolock=false
waitonerror=true
usescancodes=true
[dosbox]
machine=svga_s3
memsize=16
[render]
frameskip=0
aspect=false
scaler=normal2x
[cpu]
core=auto
cycles=auto
[mixer]
nosound=true
[autoexec]
mount c "$GAME_DIR"
c:
EOF
if [[ "$REL_DIR" != "." ]]; then echo "cd ${REL_DIR//\//\\}" >> /tmp/oregon1990.conf; fi
echo "$BASE" >> /tmp/oregon1990.conf
cp /tmp/oregon1990.conf "$RESULT_DIR/dosbox.conf.txt"

export DISPLAY=:99 SDL_AUDIODRIVER=dummy
Xvfb :99 -screen 0 1024x768x24 >/tmp/xvfb.log 2>&1 & XVFB_PID=$!
trap 'kill ${DOSBOX_PID:-999999} 2>/dev/null || true; kill $XVFB_PID 2>/dev/null || true' EXIT
sleep 1
dosbox -conf /tmp/oregon1990.conf >/tmp/dosbox.log 2>&1 & DOSBOX_PID=$!
for i in {1..60}; do xdotool search --name 'DOSBox' >/tmp/dosbox-window 2>/dev/null && break; sleep 0.25; done
WINDOW_ID="$(head -n1 /tmp/dosbox-window 2>/dev/null || true)"; [[ -n "$WINDOW_ID" ]] || exit 4
xdotool windowactivate --sync "$WINDOW_ID" || true
capture(){ sleep "${2:-0.65}"; import -display :99 -window root "$RESULT_DIR/$1.png"; }
key(){ xdotool key --window "$WINDOW_ID" "$1"; sleep 0.65; }
type(){ xdotool type --window "$WINDOW_ID" --delay 60 "$1"; }
answer(){ type "$1"; key Return; sleep 0.55; }
log(){ printf '%s\t%s\n' "$1" "$2" >> "$ACTION_LOG"; }

# Reproducible competent baseline: Banker / April / game's recommended quantities.
sleep 4; key Return
answer '1'; log setup 'travel trail'
answer '1'; log setup 'banker'
answer 'Benchmark'; for name in A B C D; do answer "$name"; done
answer 'y'; answer '2'; log setup 'April departure'
for _ in 1 2 3 4; do key space; done
answer '1'; answer '3'; log store '3 yoke oxen'
answer '2'; answer '1000'; log store '1000 lb food'
answer '3'; answer '10'; log store '10 clothing sets'
answer '4'; answer '15'; log store '15 ammo boxes'
answer '5'; answer '2'; answer '2'; answer '2'; log store '2 each spare part'
key space; capture '00-ready-to-leave'
key space; capture '01-travel-menu-start'

# Measure the first segment. Each numbered choice is a player-level Continue decision.
# After each Continue, capture immediately, then send SPACE once to clear any ordinary
# arrival/event continuation screen. If no continuation screen is present, SPACE is harmless.
for i in $(seq -w 1 12); do
  answer '1'; log "$i" 'Continue on trail'
  capture "travel-${i}-after-continue" 1.4
  key space
  capture "travel-${i}-after-space" 0.45
done

cp /tmp/dosbox.log "$RESULT_DIR/dosbox.log" || true
cp /tmp/xvfb.log "$RESULT_DIR/xvfb.log" || true
