const LOCAL_FILE = 0x04034b50;
const CENTRAL_FILE = 0x02014b50;
const END_OF_CENTRAL = 0x06054b50;

export function readStoredZip(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  const view = new DataView(arrayBuffer);
  const decoder = new TextDecoder('utf-8');
  const entries = [];
  let offset = 0;

  while (offset + 4 <= bytes.length) {
    const signature = view.getUint32(offset, true);
    if (signature === CENTRAL_FILE || signature === END_OF_CENTRAL) break;
    if (signature !== LOCAL_FILE) throw new Error('Unsupported ZIP structure. Please use a ZIP exported by Hold Gesture Lab.');
    if (offset + 30 > bytes.length) throw new Error('Truncated ZIP header.');

    const flags = view.getUint16(offset + 6, true);
    const method = view.getUint16(offset + 8, true);
    const compressedSize = view.getUint32(offset + 18, true);
    const uncompressedSize = view.getUint32(offset + 22, true);
    const nameLength = view.getUint16(offset + 26, true);
    const extraLength = view.getUint16(offset + 28, true);

    if (flags & 0x0008) throw new Error('ZIP data descriptors are not supported. Re-export from Hold Gesture Lab.');
    if (method !== 0) throw new Error('This ZIP is compressed. Re-export it directly from Hold Gesture Lab.');
    if (compressedSize !== uncompressedSize) throw new Error('Unexpected ZIP size mismatch.');

    const nameStart = offset + 30;
    const nameEnd = nameStart + nameLength;
    const dataStart = nameEnd + extraLength;
    const dataEnd = dataStart + compressedSize;
    if (dataEnd > bytes.length) throw new Error('Truncated ZIP entry.');

    const name = decoder.decode(bytes.slice(nameStart, nameEnd));
    if (name && !name.endsWith('/')) entries.push({ name, bytes: bytes.slice(dataStart, dataEnd) });
    offset = dataEnd;
  }

  if (!entries.length) throw new Error('No files found in ZIP.');
  return entries;
}
