# Deploying Ledger to your phone (with GitHub)

This gets Ledger onto your Samsung S25 as a real, installable app — no Play Store, no fee — and (optionally) syncing to a Google Sheet.

**What's in this folder** (upload all of it):
- `index.html` — the app
- `manifest.webmanifest`, `sw.js` — make it installable + work offline
- `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` — the app icon
- `Code.gs` — the Google Sheet sync script (used later, in Step 4)

---

## What GitHub is (30 seconds)
GitHub stores files (a "repository" = a project folder) and can *serve* them as a live website for free via a feature called **GitHub Pages**. So we put these files in a repo, switch Pages on, and you get a public `https://…` link. That link is your app.

---

## Step 1 — Make a GitHub account
1. Go to **github.com** → **Sign up**. Use your personal email. It's free.
2. Verify your email.

## Step 2 — Create the repository
1. Top-right **+** → **New repository**.
2. **Repository name:** `ledger` (lowercase).
3. Set it to **Public** (Pages is free on public repos). *Your money data is NOT in these files — it only ever lives on your phone/sheet — so the code being public is fine.*
4. Click **Create repository**.

## Step 3 — Upload the files
1. On the new repo page click **uploading an existing file** (the link in the middle), or **Add file ▸ Upload files**.
2. Drag in **every file from this folder** (`index.html`, `manifest.webmanifest`, `sw.js`, the 3 icons — `Code.gs` and this guide can go in too, they don't hurt).
3. Scroll down → **Commit changes**.

## Step 4 — Turn on GitHub Pages
1. In the repo, click **Settings** (top) → **Pages** (left sidebar).
2. Under **Build and deployment ▸ Source**, choose **Deploy from a branch**.
3. **Branch:** `main`, folder `/ (root)` → **Save**.
4. Wait ~1 minute. The page will show your link, like:
   **`https://YOURNAME.github.io/ledger/`**

Open that link in a browser — you should see Ledger. 🎉

## Step 5 — Install it on your Samsung S25
1. On your phone, open that same link in **Chrome**.
2. Chrome menu **⋮** → **Add to Home screen** / **Install app** → **Install**.
3. It now has its own icon and opens full-screen like a normal app, and works offline.

*(Your data is saved on the phone. Settings ▸ Backup & transfer ▸ Export JSON makes a backup file anytime.)*

---

## Step 6 (optional) — Sync to a Google Sheet
This makes a Google Sheet a live backup, and lets rows you add in the sheet come back into the app.

1. Create/open a Google Sheet (any name).
2. **Extensions ▸ Apps Script.** Delete whatever's there, paste **all of `Code.gs`**, and **Save** (disk icon).
3. **Deploy ▸ New deployment.** Click the gear ▸ choose **Web app**.
   - **Execute as:** Me
   - **Who has access:** **Anyone**
4. **Deploy** → it asks you to **authorise** (approve your own script; if it warns "unverified", choose *Advanced ▸ go to project*, it's your own script).
5. Copy the **Web app URL** (ends in `/exec`).
6. In Ledger on your phone: **Settings ▸ Google Sheet sync** → paste the URL → **Push to Sheet**. Check your sheet fills in.
7. Turn on **Auto-sync** so every change pushes automatically. Use **Pull from Sheet** to bring back rows you typed into the sheet (put them under the right Category/Flow columns).

Notes:
- Push **updates and adds** rows — it never deletes, so your sheet is a safe growing record.
- The URL is the key to your sheet's data — keep it private (don't post it publicly).
- Browser security around Apps Script can be fussy; if push/pull misbehaves once it's live, tell me the exact message and I'll adjust the script.

---

## Making changes later (the update loop)
1. You tell me what to change / a bug → I give you a new `index.html` (and bump `sw.js` if needed).
2. In your repo: **Add file ▸ Upload files**, drop the new `index.html`, **Commit**.
3. Reopen the app on your phone — the update arrives automatically (it may take one extra open to refresh).

Your logged data is **not** affected by updates — it lives separately on the device and in your sheet.

---

## Quick troubleshooting
- **Blank page / 404:** wait another minute after enabling Pages; make sure the file is named exactly `index.html` at the repo root.
- **No "Install app" option:** you must open the `github.io` **link** (not a local file) in Chrome; give it a few seconds.
- **Sync does nothing:** re-check the `/exec` URL is pasted fully, and that the Apps Script deployment access is **Anyone**.
