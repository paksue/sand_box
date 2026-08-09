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
capture(){ sleep "${2:-0.7}"; import -display :99 -window root "$RESULT_DIR/$1.png"; }
key(){ xdotool key --window "$WINDOW_ID" "$1"; sleep 0.7; }
type(){ xdotool type --window "$WINDOW_ID" --delay 65 "$1"; }
answer(){ type "$1"; key Return; sleep 0.6; }

# Baseline setup: banker, 5-person party, April departure.
sleep 4; key Return; answer '1'; answer '1'; answer 'Benchmark'
for name in A B C D; do answer "$name"; done
answer 'y'; answer '2'

# Four SPACE pages: setup advice + Matt's two intro pages -> store menu.
for _ in 1 2 3 4; do key space; done
capture '01-store-empty'

# Follow the game's own recommendations.
answer '1'; capture '02-oxen-prompt'; answer '3'; capture '03-store-after-oxen'
answer '2'; capture '04-food-prompt'; answer '1000'; capture '05-store-after-food'
answer '3'; capture '06-clothing-prompt'; answer '10'; capture '07-store-after-clothing'
answer '4'; capture '08-ammo-prompt'; answer '15'; capture '09-store-after-ammo'
answer '5'; capture '10-spares-wheel-prompt'; answer '2'; capture '11-spares-axle-prompt'; answer '2'; capture '12-spares-tongue-prompt'; answer '2'; capture '13-store-final'

# Leave the store. Capture the next screens rather than guessing their meaning.
key space; capture '14-after-leave-store'
for n in 15 16 17 18 19 20 21 22; do key space; capture "${n}-departure-sequence"; done

cp /tmp/dosbox.log "$RESULT_DIR/dosbox.log" || true
cp /tmp/xvfb.log "$RESULT_DIR/xvfb.log" || true
