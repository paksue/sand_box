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
if [[ -z "$TARGET" ]]; then
  echo 'Could not find a DOS executable/batch file.' >&2
  exit 3
fi

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
mapperfile=/tmp/oregon1990.map
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
if [[ "$REL_DIR" != "." ]]; then
  echo "cd ${REL_DIR//\//\\}" >> /tmp/oregon1990.conf
fi
echo "$BASE" >> /tmp/oregon1990.conf

echo 'exit' >> /tmp/oregon1990.conf
cp /tmp/oregon1990.conf "$RESULT_DIR/dosbox.conf.txt"

export DISPLAY=:99
export SDL_AUDIODRIVER=dummy
Xvfb :99 -screen 0 1024x768x24 >/tmp/xvfb.log 2>&1 &
XVFB_PID=$!
trap 'kill $XVFB_PID 2>/dev/null || true; kill ${DOSBOX_PID:-0} 2>/dev/null || true' EXIT
sleep 1

dosbox -conf /tmp/oregon1990.conf >/tmp/dosbox.log 2>&1 &
DOSBOX_PID=$!

# Wait for DOSBox window.
for i in {1..40}; do
  if xdotool search --name 'DOSBox' >/tmp/dosbox-window 2>/dev/null; then break; fi
  sleep 0.25
done
WINDOW_ID="$(head -n1 /tmp/dosbox-window 2>/dev/null || true)"
if [[ -z "$WINDOW_ID" ]]; then
  cat /tmp/dosbox.log >&2 || true
  exit 4
fi
xdotool windowactivate --sync "$WINDOW_ID" || true
sleep 4

capture() {
  local name="$1"
  import -display :99 -window root "$RESULT_DIR/$name.png"
}

capture '01-boot'
# Advance through common title/introduction prompts without assuming game state.
xdotool key --window "$WINDOW_ID" Return
sleep 2
capture '02-after-enter'
xdotool key --window "$WINDOW_ID" space
sleep 2
capture '03-after-space'
xdotool key --window "$WINDOW_ID" Return
sleep 2
capture '04-after-second-enter'

cp /tmp/dosbox.log "$RESULT_DIR/dosbox.log" || true
cp /tmp/xvfb.log "$RESULT_DIR/xvfb.log" || true
