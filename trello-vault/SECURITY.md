# Security notes

Trello Vault is intentionally a static, read-only browser application.

## Secrets

The Trello access token is the secret. The app keeps it only in JavaScript memory for the current tab and requests a one-hour lifetime. Disconnecting or closing the page discards the in-memory token.

The Trello API key is treated as an application identifier. The user may opt in to remembering only that key in localStorage.

The app never writes an access token or API key into an exported archive.

## Network boundary

Runtime code is served from GitHub Pages. During use, the browser talks directly to Trello over HTTPS. There is no application server, telemetry endpoint, database, ad network, or third-party JavaScript.

The Content Security Policy limits runtime network calls to Trello. Attachment-storage hosts are not required by the card-data exporter.

## Permissions

Trello authorization requests only scope=read. The application code makes GET requests only; there are no create, update, move, archive, or delete operations.

## Attachment and image policy

Attachments, uploaded binaries, attachment metadata, and card cover image metadata are intentionally excluded from exported archives. This keeps the archive compact and avoids exposing or copying unrelated files.

The app may display the signed-in Trello member avatar in the live UI, but that avatar is not written into the archive.

## Local files

ZIP export is assembled in browser memory and saved with a normal browser download. Optional folder export uses the File System Access API only after an explicit user folder choice. A cancelled folder export may leave already-written partial JSON files in the chosen local folder; Trello itself is never modified.
