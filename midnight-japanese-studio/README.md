# Midnight Japanese — Listening & Speaking Studio

An independent, mobile-friendly Japanese language learning web app inspired by the atmosphere of **Midnight Diner (深夜食堂)**. It is not affiliated with the series or its distributors.

**Open the app:** https://paksue.github.io/sand_box/midnight-japanese-studio/

## What works

- **36 guided Japanese phrases** in six themed chapters. One very short excerpt from the series' opening; all other study examples independently written.
- **Hear Japanese** using native device speech synthesis, with selectable speed (0.7×, 0.85×, 1×, 1.15×), triple-repeat and continuous chapter playback.
- **Masculine Japanese voice selection** now prioritizes recognized male Japanese names, particularly Apple's **Otoya** on iPhone, if exposed by the browser. Manual selection, a warm, slightly lower-pitched style and a natural pitch profile are available under **Progress & Settings**. The app warns when no recognizable male voice is available; Web Speech API does not report voice gender.
- **Optional personal audio source**: choose a short audio file for a particular phrase. This is saved on-device in IndexedDB, *not* in GitHub or on any server.
- **Practice speaking**: authorize the microphone, record a take, see a live audio-level waveform, listen to your own take and compare it sequentially with the reference.
- **Read Japanese**: Japanese text, kana, optional romaji and optional English translation. Tap vocabulary tokens for reading/meaning, plus a grammar note and a pronunciation note per phrase.
- **Active recall and spaced review**: mark a phrase practiced, then review it using listening-comprehension or English-to-Japanese speaking prompts. Grade Again/Hard/Good/Easy to schedule the next review.
- **Searchable phrase library**, six chapter filters, favorites, progress, practice streaks and a data-backup tool.
- **Installable PWA** with offline shell caching. Japanese audio depends on your device's installed voice and personal imported clips.
- No login, no advertising, no analytics and no external libraries required to run the app.

## First use (iPhone)

1. Open the URL above in Safari.
2. Go to **Listening Studio** and tap the large ▶ button. Turn up media volume. If no Japanese male voice is detected, go to **iPhone Settings → Accessibility → Read & Speak → Voices → Japanese** and download **Otoya** if offered, then reopen Safari and select **Auto-select male Japanese voice** in the app. In some iOS versions this settings section is labeled **Spoken Content**. Tap **Test audio**. The browser may not expose every installed system voice.
3. Tap **Record my voice**, allow microphone access, read the phrase aloud and tap **Stop recording**. Use Compare or the recording's playback bar.
4. Select **I've practiced this phrase** and open **Daily Review**. The initial card is due immediately.
5. In Safari, tap **Share → Add to Home Screen** to use the app like an installed app.

On desktop, the same URL works in a modern Chromium/Firefox/Safari browser. Microphone recording requires HTTPS (provided by GitHub Pages).

## Data and privacy

Progress is stored via **localStorage**. Imported personal reference clips are stored in **IndexedDB**. Voice recordings stay in browser memory until downloaded or the page closes. This is not a cloud-synced account.

Use **Progress & Settings → Export progress** to back up or transfer your data between devices. Import the JSON export on the other device. Personal reference clips and unsaved microphone takes are not included in that JSON.

Deleting browser website data or using private browsing can lose locally stored progress.

## Copyright, audio and current limitations

This project does **not** redistribute the TV show's audio, soundtrack or complete copyrighted monologue. The speech player uses the device's Japanese text-to-speech voices by default. To practice directly against the actor's original delivery, listen to the licensed series on Netflix; you may attach personally held audio where permitted by applicable law.

The basic compare function **plays both recordings** but does **not** claim to automatically grade Japanese pitch accent, pronunciation or fluency. That would require a suitable trained service and careful calibration. Native browser speech voices vary in quality/availability between iOS and desktop. The warmer style adjusts pitch slightly (0.92) but does not clone or impersonate the TV actor's distinctive voice; the naturally voiced male option is most faithful for pronunciation learning. The website's offline cache does not guarantee an offline Japanese synthesis voice.

A microphone cannot be tested from automated GitHub tool access; test it in your own browser. No API keys or paid services are required.

## Technical architecture

- Dependency-free HTML, CSS and ES2020 JavaScript.
- Native Web Speech API for speech synthesis.
- Native MediaRecorder / getUserMedia / Web Audio Analyser for microphone capture and visualization.
- IndexedDB for user-provided audio, localStorage for spaced-repetition data.
- Scoped service worker with offline asset caching.
- Static GitHub Pages hosting; assets and PWA scope are isolated inside this folder.
- Simple adaptive review schedule (SM-2-inspired): Again 10 minutes; Hard at least 1 day; Good at least 1 day with escalating interval; Easy at least 4 days. This is not a validated personalized FSRS implementation.

## Files

- index.html — accessible responsive app shell
- styles.css — mobile and desktop night café design
- data.js — six chapters, 36 curated phrases and notes
- app.js — player, recorder, state, reviews, library and settings
- manifest.webmanifest / sw.js / icon.svg — install and offline support

## Verify

Basic checks were run against the committed code for script syntax, initial page rendering, navigation through all five routes, practice → review → scheduling, library navigation and favorites. The website's GitHub Pages delivery and Safari microphone permissions must be checked in a real browser.

## Robust masculine Japanese narration (Safari workaround)

Safari/WebKit currently has a documented issue (WebKit bug 290497) where
downloaded iOS Accessibility voices, including enhanced Otoya, can be missing
from \`speechSynthesis.getVoices()\`. Choosing Otoya in iPhone Settings therefore
does not guarantee Safari websites can use Otoya. This is a browser limitation,
not an incorrect phone setting.

The app now prefers **pre-generated male Japanese MP3 clips**, made with
Kokoro-82M's \`jm_kumo\` voice, independent of Safari voice availability.
The audio is generated by a GitHub Actions workflow and committed under
\`audio/male/\` when that workflow succeeds. The player checks the generated
\`audio/male/manifest.json\` at startup.

In **Progress & Settings → Audio source** choose:
- **Recorded male voice (recommended)** — uses hosted MP3s when available;
  if the package is missing, temporarily falls back to device Japanese voice.
- **iPhone / browser voices** — uses device speech synthesis and your selected
  installed voice, where supported by the browser.

A personally uploaded audio reference overrides both sources for that phrase.
The recorded male synthetic voice is **not an imitation or clone** of the actor.
Open-source model/voice credits: \`audio/LICENSE-VOICE.md\`.

If the new audio doesn't appear, check the publishing workflow:
https://github.com/paksue/sand_box/actions/workflows/midnight-japanese-voice.yml
