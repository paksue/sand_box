#!/usr/bin/env bash
set -euo pipefail

GAME_DIR="$(realpath "$1")"
RESULT_DIR="$(realpath "$2")"
mkdir -p "$RESULT_DIR"

TARGET=""
for pattern in 'OREGON.EXE' 'oregon.exe' 'OREGON.BAT' 'oregon.bat' 'TRAIL.EXE' 'trail.exe' 'START.BAT' 'start.bat'; do
  candidate="$(find "$GAME_DIR" -type f -name "$pattern" | head -n 1 || true)"
  if [[ -n "$candidate" ]]; then TARGET="$candidate"; break; fi
done
if [[ -z "$TARGET" ]]; then TARGET="$(find "$GAME_DIR" -type f \( -iname '*.bat' -o -iname '*.exe' -o -iname '*.com' \) | head -n 1 || true)"; fi
[[ -n "$TARGET" ]] || { echo 'Could not find DOS launch target' >&2; exit 3; }

echo "Launch target: $TARGET" | tee "$RESULT_DIR/launch-target.txt"
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
cp /tmp/oregon1990.conf "$RESULT_DIR/dosbox.conf.txt"

export DISPLAY=:99 SDL_AUDIODRIVER=dummy
Xvfb :99 -screen 0 1024x768x24 >/tmp/xvfb.log 2>&1 & XVFB_PID=$!
trap 'kill ${DOSBOX_PID:-999999} 2>/dev/null || true; kill $XVFB_PID 2>/dev/null || true' EXIT
sleep 1
dosbox -conf /tmp/oregon1990.conf >/tmp/dosbox.log 2>&1 & DOSBOX_PID=$!
for i in {1..60}; do xdotool search --name 'DOSBox' >/tmp/dosbox-window 2>/dev/null && break; sleep 0.25; done
WINDOW_ID="$(head -n1 /tmp/dosbox-window 2>/dev/null || true)"; [[ -n "$WINDOW_ID" ]] || exit 4
xdotool windowactivate --sync "$WINDOW_ID" || true
capture(){ sleep "${2:-1}"; import -display :99 -window root "$RESULT_DIR/$1.png"; }
key(){ xdotool key --window "$WINDOW_ID" "$1"; }
type(){ xdotool type --window "$WINDOW_ID" --delay 35 "$1"; }
answer(){ type "$1"; key Return; }

capture '01-title' 4
key Return; capture '02-main-menu' 1
answer '1'; capture '03-profession-menu' 1
answer '1'; capture '04-leader-prompt' 1
answer 'Benchmark'; capture '05-party-prompt' 1
for name in A B C D; do answer "$name"; sleep 0.3; done
capture '06-name-confirmation' 1
answer 'y'; capture '07-departure-menu' 1
answer '2'; capture '08-outfitting-intro-1' 1

# The outfitting introduction uses SPACE BAR pages. Capture each one until a numeric/text prompt appears.
for n in 09 10 11 12 13 14; do
  key space
  capture "${n}-outfitting-sequence" 1
 done

cp /tmp/dosbox.log "$RESULT_DIR/dosbox.log" || true
cp /tmp/xvfb.log "$RESULT_DIR/xvfb.log" || true
