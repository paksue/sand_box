# Trello Vault

A static, client-side Trello Workspace exporter for paksue/sand_box GitHub Pages.

## What it does

- Connects to Trello with a temporary **read-only** authorization token.
- Discovers the Workspaces available to the signed-in Trello account.
- Exports open and archived boards, lists, cards, labels, checklists, custom fields, members, comments, attachment metadata, and optional activity/Power-Up metadata.
- Can write a structured folder directly to the user's PC with the File System Access API.
- Can download a portable JSON snapshot in browsers without folder access.
- Makes a best-effort attempt to download Trello-uploaded attachment binaries using Trello's authenticated attachment endpoint.

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

## Folder layout

A folder export looks like:

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
