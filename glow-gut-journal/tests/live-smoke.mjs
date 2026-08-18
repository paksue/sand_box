const base = 'https://paksue.github.io/sand_box/glow-gut-journal/';
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function check() {
  const indexResponse = await fetch(base, { cache: 'no-store' });
  if (!indexResponse.ok) throw new Error(`Live app returned ${indexResponse.status}`);
  const html = await indexResponse.text();
  if (!html.includes('name="glow-build" content="round2"')) throw new Error('Live app has not deployed the round2 build yet');
  if (!html.includes('polish.js') || !html.includes('polish.css')) throw new Error('Live app is missing round2 assets');

  const manifestResponse = await fetch(new URL('manifest.webmanifest', base), { cache: 'no-store' });
  if (!manifestResponse.ok) throw new Error(`Manifest returned ${manifestResponse.status}`);
  const manifest = await manifestResponse.json();
  if (manifest.display !== 'standalone') throw new Error('Manifest is not standalone');

  const swResponse = await fetch(new URL('sw.js', base), { cache: 'no-store' });
  if (!swResponse.ok) throw new Error(`Service worker returned ${swResponse.status}`);
  const sw = await swResponse.text();
  if (!sw.includes('polish.js') || !sw.includes('polish.css')) throw new Error('Live service worker does not cache round2 assets');
}

let lastError;
for (let attempt = 1; attempt <= 18; attempt += 1) {
  try {
    await check();
    console.log(`Live Glow Pages smoke passed on attempt ${attempt}: ${base}`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.log(`Live smoke attempt ${attempt}/18: ${error.message}`);
    if (attempt < 18) await wait(10_000);
  }
}

throw lastError;
