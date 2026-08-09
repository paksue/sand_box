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
if [[ -z "$TARGET" ]]; then
  TARGET="$(find "$GAME_DIR" -type f \( -iname '*.bat' -o -iname '*.exe' -o -iname '*.com' \) | head -n 1 || true)"
fi
[[ -n "$TARGET" ]] || { echo 'Could not find a DOS executable/batch file.' >&2; exit 3; }

echo "Launch target: $TARGET" | tee "$RESULT_DIR/launch-target.txt"
REL="${TARGET#${GAME_DIR}/}"
REL_DIR="$(dirname "$REL")"
BASE="$(basename "$REL")"

cat > /tmp/oregon1990.conf <<EOF
[sdl]
fullscreen=false
fulldouble=false
output=surface
windowresolution=640x480
autolock=false
sensitivity=100
waitonerror=true
priority=higher,normal
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
cputype=auto
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

export DISPLAY=:99
export SDL_AUDIODRIVER=dummy
Xvfb :99 -screen 0 1024x768x24 >/tmp/xvfb.log 2>&1 &
XVFB_PID=$!
trap 'kill ${DOSBOX_PID:-999999} 2>/dev/null || true; kill $XVFB_PID 2>/dev/null || true' EXIT
sleep 1

dosbox -conf /tmp/oregon1990.conf >/tmp/dosbox.log 2>&1 &
DOSBOX_PID=$!
for i in {1..60}; do
  if xdotool search --name 'DOSBox' >/tmp/dosbox-window 2>/dev/null; then break; fi
  sleep 0.25
done
WINDOW_ID="$(head -n1 /tmp/dosbox-window 2>/dev/null || true)"
[[ -n "$WINDOW_ID" ]] || { cat /tmp/dosbox.log >&2 || true; exit 4; }
xdotool windowactivate --sync "$WINDOW_ID" || true

capture() { sleep "${2:-1}"; import -display :99 -window root "$RESULT_DIR/$1.png"; }
key() { xdotool key --window "$WINDOW_ID" "$1"; }
type() { xdotool type --window "$WINDOW_ID" --delay 40 "$1"; }

capture '01-title' 4
key Return
capture '02-main-menu' 2
type '1'; key Return
capture '03-after-travel-choice' 2
# Select the first profession if a numbered profession menu is now visible.
type '1'; key Return
capture '04-after-profession-choice' 2
# Supply a leader name if prompted.
type 'Benchmark'; key Return
capture '05-after-leader-name' 2
# Continue with four short party names if requested one at a time.
for name in A B C D; do type "$name"; key Return; sleep 0.5; done
capture '06-after-party-names' 2

cp /tmp/dosbox.log "$RESULT_DIR/dosbox.log" || true
cp /tmp/xvfb.log "$RESULT_DIR/xvfb.log" || true
