# Trello Vault

A static, client-side Trello Workspace **card-data exporter** for paksue/sand_box GitHub Pages.

## What it does

- Connects to Trello with a temporary **read-only** authorization token.
- Discovers the Workspaces available to the signed-in Trello account.
- Exports open and archived boards, lists, cards, card descriptions, labels, checklists, custom fields, members, comments, due dates, and optional activity/Power-Up metadata.
- **Intentionally excludes attachments, uploaded files, images, card cover image metadata, and attachment metadata.**
- Primary export is a structured ZIP built entirely in the browser.
- Can also write the same structured card-data archive directly to a chosen folder when the File System Access API is available.
- Can download a single JSON file as a lightweight alternative.
- Uses an in-repo ZIP writer; no third-party runtime library or backend is required.

The purpose is a compact archive that can be searched, analyzed, transformed, or given to an AI later without hauling around hundreds of image/file attachments.

## Security model

- Static HTML/CSS/JS only. No backend, database, analytics, or third-party runtime scripts.
- Requests Trello scope read only and a 1hour token.
- Access token is held in JavaScript memory only. It is never placed in localStorage, sessionStorage, IndexedDB, the backup, or this repository.
- The Trello API key can optionally be remembered locally. It is not included in backups.
- API requests authenticate with the Authorization header rather than putting the token in request URLs.
- The app only calls Trello data APIs; it does not fetch attachment binary hosts.

## GitHub Pages

Expected live path:

    https://paksue.github.io/sand_box/trello-vault/

For popup authorization, add the GitHub Pages origin:

    https://paksue.github.io

to the Trello API key's **Allowed Origins**. The app also has a manual-token fallback.

## Archive layout

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

There is deliberately no attachments directory.

## Public API limitations

A public Trello API export cannot reproduce every internal Trello feature. Butler automations and some private Power-Up data may not be exposed.

## Browser compatibility

The ZIP export does **not** require showDirectoryPicker(). Folder export is optional and appears only in browsers that expose the File System Access API.
