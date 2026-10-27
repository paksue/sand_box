# Orbit Ask

A polished, responsive open-source question-and-answer app for **GitHub Pages**, with an optional **local ChatGPT plan companion**.

- Website: https://paksue.github.io/sand_box/chatgpt-pages-qa/
- Source: https://github.com/paksue/sand_box/tree/main/chatgpt-pages-qa
- Official SIWC documentation: https://developers.openai.com/siwc/token-sharing-open-source

> **Current integration status:** Frontend and OAuth companion are implemented, but **end-to-end sign-in and model inference have not been verified against a real user account**. A local computer, browser authorization, and eligible account are required. The public GitHub Pages link works only after GitHub Pages is enabled on the repository.

## What this does

- A fast, responsive conversation UI with animated hero, prompt starters, model picker, copy, searchable-by-title conversation list (visually), delete and export.
- Persists chat text in your **own browser's localStorage**; no GitHub storage of personal conversations.
- Asks real models only after sign-in and optional plan-sharing consent.
- Uses OpenAI's **documented open-source Sign in with ChatGPT OAuth flow**, **not** reverse-engineered ChatGPT endpoints.
- Sends the required history in each request; **does not import or synchronize ChatGPT web conversations or memories**.
- Keeps OAuth access and refresh tokens in a protected file on your own computer instead of in GitHub Pages/browser JavaScript.

## Start the companion

1. Install [Node.js 22+](https://nodejs.org/).
2. Download or clone this repository and open a terminal in the subfolder chatgpt-pages-qa.
3. Run:

       cd companion
       node server.mjs

4. Keep the terminal running. Note the **6-digit pairing code** it prints.
5. Open the GitHub Pages site in **Chrome or Edge on the same computer**.
6. Open **Connection & settings**, enter the pairing code, and click **Pair**.
7. Click **Continue with ChatGPT**. In the new window, sign in, choose a workspace, and consent to plan usage if offered.
8. Return to Orbit Ask. Choose a model, then send a question.

**Note:** This is not currently a phone-only solution. The companion listens on 127.0.0.1 (same computer). Safari/iOS can block HTTPS-to-localhost HTTP communication; Chrome/Edge may show a local network access permission prompt. Avoid exposing the local service to the LAN or Internet.

### Windows PowerShell

    git clone https://github.com/paksue/sand_box.git
    cd sand_box\chatgpt-pages-qa\companion
    node .\server.mjs

### Linux/macOS

    git clone https://github.com/paksue/sand_box.git
    cd sand_box/chatgpt-pages-qa/companion
    node server.mjs

You do not need an OpenAI API key, npm dependencies, or separate API billing for eligible plan-sharing requests.

## GitHub Pages deployment

GitHub Pages only hosts the frontend. To publish it:

1. Open repository **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Select **main / (root)** and save.
4. The URL should then be: https://paksue.github.io/sand_box/chatgpt-pages-qa/

If the repository already has an existing Pages deployment, adding this subfolder generally makes it available under the same deployed site's path without changing its publishing settings. Do **not** overwrite an existing Pages source workflow.

## Security design

- Only binds to **127.0.0.1:42815**.
- Accepts browser calls only from https://paksue.github.io and two development origins.
- Checks Host, Origin and a random in-memory bearer pairing token before sensitive operations.
- Displays a one-time-per-process 6-digit pairing code in the companion terminal.
- Never sends OAuth credentials to the frontend, sessionStorage, localStorage or GitHub.
- Stores credentials at ~/.orbit-ask/credentials.json; file mode 0600 on Unix (on Windows filesystem access follows account ACLs).
- Uses OAuth PKCE, validates callback state, validates the OIDC token signature and claims against OpenAI's current signing keys.
- Refreshes the OAuth tokens when necessary; uses the public Responses API only.
- Only accepts text prompts and bounded message history. Does not proxy arbitrary URLs or implement hosted tools.
- API sends store:false and stream:true. It only treats response.completed as successful.

**Threat boundaries:** This is a personal developer preview, not an audited product. The pairing code is short and should not be used for a widely shared multiuser service. The username's entire github.io origin is allowlisted (browser origins cannot distinguish different path segments). Treat that origin as trusted. For production use, move the frontend to a dedicated domain, add stronger local pairing defenses, use OS credential vaults, and carry out an independent security review.

## Limitations

- OpenAI's OSS sign-in documentation covers locally hosted open-source integrations; commercial or remotely hosted usage can require approval.
- Plan sharing is optional and account-dependent; **identity-only** sign-in isn't enough to run models.
- Responses model and tool availability differs from ChatGPT web. Some tools are unsupported on this route.
- Conversations are browser-local and don't follow you across devices.
- No ChatGPT web project, history or memories integration.
- When your allowance runs out, requests fail rather than silently charging another method.
- The frontend may be viewable anywhere, but real answers only work when the local companion is reachable from the browser.

## Verification checklist

Run:

    node --check companion/server.mjs
    node --check app.js
    node companion/server.mjs

In another terminal:

    curl http://127.0.0.1:42815/health

The expected health JSON is {"ok":true,"name":"Orbit Ask Companion"}.

**Sign-in and inference cannot be verified automatically by CI.** Complete the browser consent flow manually, choose a model shown by your connection, ask "Reply with exactly: Orbit is working", and verify the stream finishes.

## References

- [Sign in with ChatGPT — OSS overview](https://developers.openai.com/siwc/token-sharing-open-source)
- [Open-source authorization flow](https://developers.openai.com/siwc/token-sharing-open-source/sign-in)
- [Models and inference](https://developers.openai.com/siwc/token-sharing-open-source/models-and-inference)
- [Preview limitations](https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations)
- [Chrome's Local Network Access guidance](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/security/local-network-access.md)

## License

MIT for the code in this folder.
