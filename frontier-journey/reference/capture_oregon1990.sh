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

# Setup: banker, named party, April departure.
sleep 4; key Return; answer '1'; answer '1'; answer 'Benchmark'
for name in A B C D; do answer "$name"; done
answer 'y'; answer '2'
# Outfitting intro: three SPACE pages to reach store.
key space; key space; key space; sleep 1
capture '01-store-empty' 1

# Buy 3 yoke of oxen (6 animals).
answer '1'; capture '02-oxen-prompt' 1; answer '3'; capture '03-after-oxen' 1
# Buy 1600 lb food.
answer '2'; capture '04-food-prompt' 1; answer '1600'; capture '05-after-food' 1
# Buy 10 sets of clothing.
answer '3'; capture '06-clothing-prompt' 1; answer '10'; capture '07-after-clothing' 1
# Buy 20 ammunition units/boxes as prompted by this build.
answer '4'; capture '08-ammo-prompt' 1; answer '20'; capture '09-after-ammo' 1
# Buy spare parts; capture prompt before answering 2 wheels, 2 axles, 2 tongues if requested.
answer '5'; capture '10-spares-prompt-1' 1; answer '2'; capture '11-spares-prompt-2' 1; answer '2'; capture '12-spares-prompt-3' 1; answer '2'; capture '13-after-spares' 1

# Leave store and advance through any departure pages into the first travel decision screen.
key space; capture '14-leave-store' 1
for n in 15 16 17 18; do key space; capture "${n}-post-store" 1; done

cp /tmp/dosbox.log "$RESULT_DIR/dosbox.log" || true
cp /tmp/xvfb.log "$RESULT_DIR/xvfb.log" || true
