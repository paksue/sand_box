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
capture(){ sleep "${2:-0.7}"; import -display :99 -window root "$RESULT_DIR/$1.png"; }
key(){ xdotool key --window "$WINDOW_ID" "$1"; sleep 0.7; }
type(){ xdotool type --window "$WINDOW_ID" --delay 60 "$1"; }
answer(){ type "$1"; key Return; sleep 0.6; }
log(){ printf '%s\t%s\n' "$1" "$2" >> "$ACTION_LOG"; }

# Competent baseline setup, following Matt's recommendations.
sleep 4; key Return; answer '1'; answer '1'; answer 'Benchmark'
for name in A B C D; do answer "$name"; done
answer 'y'; answer '2'
for _ in 1 2 3 4; do key space; done
answer '1'; answer '3'
answer '2'; answer '1000'
answer '3'; answer '10'
answer '4'; answer '15'
answer '5'; answer '2'; answer '2'; answer '2'
key space; key space
capture '01-start-menu'

# One player decision: Continue. Do NOT press Enter while the wagon moves.
answer '1'; log 1 'Continue on trail from Independence'
capture '02-auto-travel-start' 1
sleep 8
capture '03-auto-stopped-at-landmark' 0.2

# Kansas River asks whether to look around. Decline so we can measure the decision screen directly.
answer 'n'; log 2 'Decline landmark look-around'
capture '04-kansas-river-options' 1

# Choose ferry if offered; option 3 in the classic river menu.
answer '3'; log 3 'Choose river option 3 (ferry)'
capture '05-kansas-crossing-result' 2
key space; capture '06-after-crossing-space' 1
key Return; capture '07-after-crossing-enter' 1

# If back at a travel menu, choose Continue once and allow the game to run until its next interruption.
answer '1'; log 4 'Continue after Kansas River'
capture '08-second-auto-travel-start' 1
sleep 8
capture '09-second-interruption' 0.2

cp /tmp/dosbox.log "$RESULT_DIR/dosbox.log" || true
cp /tmp/xvfb.log "$RESULT_DIR/xvfb.log" || true
