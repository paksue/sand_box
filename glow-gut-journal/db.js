const DB_NAME = 'glowGutJournal';
const DB_VERSION = 1;
let dbPromise;

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('entries')) {
        const store = db.createObjectStore('entries', { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('dateTime', 'dateTime', { unique: false });
      }
      if (!db.objectStoreNames.contains('days')) db.createObjectStore('days', { keyPath: 'date' });
      if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'key' });
      if (!db.objectStoreNames.contains('weekly')) db.createObjectStore('weekly', { keyPath: 'weekStart' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

function txDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

function req(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function dataUrlToBlob(dataUrl) {
  const [header, body] = dataUrl.split(',');
  const mime = /data:([^;]+)/.exec(header)?.[1] || 'application/octet-stream';
  const binary = atob(body || '');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

async function serializeEntry(entry) {
  if (!(entry.photo instanceof Blob)) return entry;
  return { ...entry, photo: await blobToDataUrl(entry.photo), photoEncoding: 'data-url' };
}

function hydrateEntry(entry) {
  if (entry?.photoEncoding === 'data-url' && typeof entry.photo === 'string' && entry.photo.startsWith('data:')) {
    const hydrated = { ...entry, photo: dataUrlToBlob(entry.photo) };
    delete hydrated.photoEncoding;
    return hydrated;
  }
  return entry;
}

export async function putEntry(entry) {
  const db = await openDb();
  const tx = db.transaction('entries', 'readwrite');
  tx.objectStore('entries').put(entry);
  await txDone(tx);
  return entry;
}

export async function deleteEntry(id) {
  const db = await openDb();
  const tx = db.transaction('entries', 'readwrite');
  tx.objectStore('entries').delete(id);
  await txDone(tx);
}

export async function getEntriesByDate(date) {
  const db = await openDb();
  const tx = db.transaction('entries', 'readonly');
  const items = await req(tx.objectStore('entries').index('date').getAll(date));
  return items.sort((a, b) => (a.dateTime || '').localeCompare(b.dateTime || ''));
}

export async function getAllEntries() {
  const db = await openDb();
  const tx = db.transaction('entries', 'readonly');
  const items = await req(tx.objectStore('entries').getAll());
  return items.sort((a, b) => (a.dateTime || '').localeCompare(b.dateTime || ''));
}

export async function putDay(day) {
  const db = await openDb();
  const tx = db.transaction('days', 'readwrite');
  tx.objectStore('days').put(day);
  await txDone(tx);
  return day;
}

export async function getDay(date) {
  const db = await openDb();
  const tx = db.transaction('days', 'readonly');
  return req(tx.objectStore('days').get(date));
}

export async function getAllDays() {
  const db = await openDb();
  const tx = db.transaction('days', 'readonly');
  return req(tx.objectStore('days').getAll());
}

export async function setSetting(key, value) {
  const db = await openDb();
  const tx = db.transaction('settings', 'readwrite');
  tx.objectStore('settings').put({ key, value });
  await txDone(tx);
}

export async function getSetting(key, fallback = null) {
  const db = await openDb();
  const tx = db.transaction('settings', 'readonly');
  const item = await req(tx.objectStore('settings').get(key));
  return item ? item.value : fallback;
}

export async function putWeekly(record) {
  const db = await openDb();
  const tx = db.transaction('weekly', 'readwrite');
  tx.objectStore('weekly').put(record);
  await txDone(tx);
  return record;
}

export async function getWeekly(weekStart) {
  const db = await openDb();
  const tx = db.transaction('weekly', 'readonly');
  return req(tx.objectStore('weekly').get(weekStart));
}

export async function getAllWeekly() {
  const db = await openDb();
  const tx = db.transaction('weekly', 'readonly');
  return req(tx.objectStore('weekly').getAll());
}

export async function exportAll() {
  const [rawEntries, days, weekly] = await Promise.all([getAllEntries(), getAllDays(), getAllWeekly()]);
  const entries = await Promise.all(rawEntries.map(serializeEntry));
  const db = await openDb();
  const tx = db.transaction('settings', 'readonly');
  const settings = await req(tx.objectStore('settings').getAll());
  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    entries,
    days,
    weekly,
    settings
  };
}

export async function importAll(payload) {
  if (!payload || payload.schemaVersion !== 1 || !Array.isArray(payload.entries) || !Array.isArray(payload.days)) {
    throw new Error('This does not look like a valid Glow backup.');
  }
  const db = await openDb();
  const tx = db.transaction(['entries','days','settings','weekly'], 'readwrite');
  const entries = tx.objectStore('entries');
  const days = tx.objectStore('days');
  const settings = tx.objectStore('settings');
  const weekly = tx.objectStore('weekly');
  entries.clear(); days.clear(); settings.clear(); weekly.clear();
  payload.entries.map(hydrateEntry).forEach(item => entries.put(item));
  payload.days.forEach(item => days.put(item));
  (payload.settings || []).forEach(item => settings.put(item));
  (payload.weekly || []).forEach(item => weekly.put(item));
  await txDone(tx);
}

export async function clearAll() {
  const db = await openDb();
  const tx = db.transaction(['entries','days','settings','weekly'], 'readwrite');
  ['entries','days','settings','weekly'].forEach(name => tx.objectStore(name).clear());
  await txDone(tx);
}
