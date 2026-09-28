# Trello Vault

A static, client-side Trello Workspace exporter for paksue/sand_box GitHub Pages.

## What it does

- Connects to Trello with a temporary **read-only** authorization token.
- Discovers the Workspaces available to the signed-in Trello account.
- Exports open and archived boards, lists, cards, labels, checklists, custom fields, members, comments, attachment metadata, and optional activity/Power-Up metadata.
- Primary export is now a **complete ZIP** built entirely in the browser. It contains structured JSON plus Trello-uploaded attachment files when Trello permits download.
- Can also write the same structured backup directly to a chosen folder when the File System Access API is available.
- Can download a metadata-only JSON snapshot as a lightweight fallback.
- Uses an in-repo ZIP writer; no third-party runtime library or backend is required.

## Security model

- Static HTML/CSS/JS only. No backend, database, analytics, or third-party runtime scripts.
- Requests Trello scope read only and a 1hour token.
- Access token is held in JavaScript memory only. It is never placed in localStorage, sessionStorage, IndexedDB, the backup, or this repository.
- The Trello API key can optionally be remembered locally. It is not included in backups.
- API requests authenticate with the Authorization header rather than putting the token in request URLs.
- A restrictive Content Security Policy limits scripts to this site and network access to Trello/attachment hosts.

## GitHub Pages

Expected live path:

    https://paksue.github.io/sand_box/trello-vault/

For popup authorization, add the GitHub Pages origin:

    https://paksue.github.io

to the Trello API key's **Allowed Origins**. The app also has a manual-token fallback.

## Backup layout

The ZIP contains a top-level Workspace folder with the same structure as folder export:

    Workspace-trello-vault-YYYY-MM-DD_HH-MM-SS/
      manifest.json
      workspace.json
      members.json
      memberships.json
      README.txt
      boards/
        001-Board Name/
          board.json
          lists.json
          cards.json
          checklists.json
          labels.json
          custom-fields.json
          members.json
          comments.json
          activity.json
          attachments/

## Public API limitations

A public Trello API export cannot guarantee a byte-for-byte copy of everything Trello stores internally. In particular, Butler automations and some private Power-Up data may not be exposed. External link attachments are kept as metadata rather than downloaded.


## Browser compatibility

The complete ZIP export does **not** require `showDirectoryPicker()`. Folder export is optional and appears only in browsers that expose the File System Access API.
