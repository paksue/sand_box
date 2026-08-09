#!/usr/bin/env bash
set -euo pipefail

GAME_DIR="$(realpath "$1")"
RESULT_DIR="$(realpath "$2")"
mkdir -p "$RESULT_DIR"
ACTION_LOG="$RESULT_DIR/action-log.tsv"
printf 'step\taction\n' > "$ACTION_LOG"

TARGET="$(find "$GAME_DIR" -type f -iname 'OREGON.EXE' | head -n1 || true)"
[[ -n "$TARGET" ]] || { echo 'OREGON.EXE not found' >&2; exit 3; }
REL="${TARGET#${GAME_DIR}/}"; REL_DIR="$(dirname "$REL")"; BASE="$(basename "$REL")"
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

export DISPLAY=:99 SDL_AUDIODRIVER=dummy
Xvfb :99 -screen 0 1024x768x24 >/tmp/xvfb.log 2>&1 & XVFB_PID=$!
trap 'kill ${DOSBOX_PID:-999999} 2>/dev/null || true; kill $XVFB_PID 2>/dev/null || true' EXIT
sleep 1
dosbox -conf /tmp/oregon1990.conf >/tmp/dosbox.log 2>&1 & DOSBOX_PID=$!
for i in {1..60}; do xdotool search --name 'DOSBox' >/tmp/dosbox-window 2>/dev/null && break; sleep 0.25; done
WINDOW_ID="$(head -n1 /tmp/dosbox-window 2>/dev/null || true)"; [[ -n "$WINDOW_ID" ]] || exit 4
xdotool windowactivate --sync "$WINDOW_ID" || true
capture(){ sleep "${2:-0.6}"; import -display :99 -window root "$RESULT_DIR/$1.png"; }
key(){ xdotool key --window "$WINDOW_ID" "$1"; sleep 0.65; }
type(){ xdotool type --window "$WINDOW_ID" --delay 60 "$1"; }
answer(){ type "$1"; key Return; sleep 0.55; }
log(){ printf '%s\t%s\n' "$1" "$2" >> "$ACTION_LOG"; }

# Banker, April, five people; Matt's recommended baseline supplies.
sleep 4; key Return; answer '1'; answer '1'; answer 'Benchmark'
for name in A B C D; do answer "$name"; done
answer 'y'; answer '2'
for _ in 1 2 3 4; do key space; done
answer '1'; answer '3'
answer '2'; answer '1000'
answer '3'; answer '10'
answer '4'; answer '15'
answer '5'; answer '2'; answer '2'; answer '2'

# Store -> farewell -> Independence illustration -> main travel menu.
key space; capture '01-store-farewell'
key space; capture '02-independence-illustration'
key space; capture '03-main-travel-menu'

# One meaningful decision starts the travel segment.
answer '1'; log 1 'Continue on trail'
capture '04-route-distance-card'
key space; log 2 'Acknowledge route card / start wagon'
capture '05-wagon-moving' 1

# Do not interrupt with Enter. Let the game travel on its own until landmark/event.
sleep 9
capture '06-after-nine-seconds'

# If at Kansas River look-around prompt, decline and inspect crossing menu.
answer 'n'; log 3 'Decline look-around at interruption'
capture '07-after-lookaround-response' 1

cp /tmp/dosbox.log "$RESULT_DIR/dosbox.log" || true
cp /tmp/xvfb.log "$RESULT_DIR/xvfb.log" || true
