# Security notes

Trello Vault is intentionally a static, read-only browser application.

## Secrets

The Trello access token is the secret. The app keeps it only in JavaScript memory for the current tab and requests a one-hour lifetime. Disconnecting or closing the page discards the in-memory token.

The Trello API key is treated as an application identifier. The user may opt in to remembering only that key in localStorage.

The app never writes an access token or API key into an exported backup.

## Network boundary

Runtime code is served from GitHub Pages. During use, the browser talks directly to Trello over HTTPS. There is no application server, telemetry endpoint, database, ad network, or third-party JavaScript.

The page Content Security Policy restricts scripts to the app's own origin and limits network access to Trello and attachment hosts.

## Permissions

Trello authorization requests only scope=read. The application code makes GET requests only; there are no create, update, move, archive, or delete operations.

## Attachments

Trello-uploaded attachment files are requested with the authenticated Trello download endpoint and an Authorization header. Browser CORS or storage redirects may prevent some files from downloading; those failures are recorded in the export report instead of weakening browser security.

## Local files

Folder export uses the browser File System Access API after an explicit user folder choice. JSON export uses a normal browser download. A cancelled folder export may leave already-written partial files in the chosen local folder; Trello itself is never modified.
