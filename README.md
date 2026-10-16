# Med Tracker

A **standalone desktop app** (Electron) that tracks medications with reminders,
lets you mark each dose as **taken** or **missed**, and syncs your data to your
own GitHub repository (push / pull with a personal token).

## Your schedule

- **Madison** — 2 times a day
  - Morning: **2 pills**
  - Evening: **3 pills**
- **Medsion** — **1 pill once a week, every Sunday**

## Features

- Windows 11 Fluent-style interface (clean layout, rounded cards, subtle shadows)
- **Light theme by default**, with a one-click **dark theme** toggle
- Today view: a progress ring summary plus every dose with **Taken** / **Missed**
- Native desktop **reminders** at configurable times (morning, evening, Sunday)
- History: last 7 days with a progress bar and taken / missed / pending counts
- Overview: last 30 days taken / missed / % taken
- **GitHub sync** — store `data/tracker.json` in your own private repo
- Data is kept locally (Electron `localStorage`); GitHub is backup/sync
- Installable as a normal Windows program

## Run the desktop app (from source)

```
npm install
npm start
```

If Electron's binary did not download during `npm install` (some machines block
install scripts), run once:

```
node node_modules/electron/install.js
```

Then `npm start` again.

On Windows you can also double-click **`Run Med Tracker.bat`** to launch the app
from source (development mode) without building an exe.

## Build a standalone app

```
npm run pack   # unpacked app folder in release/win-unpacked
npm run dist   # installer + portable exe in release/
```

Outputs:

- `release/Med Tracker Setup 1.0.0.exe` — Windows installer
- `release/Med Tracker 1.0.0.exe` — portable single-file app (no install)

## GitHub sync setup

1. Create a private repo, e.g. `med-tracker-data`.
2. Create a **classic** personal access token with the `repo` scope
   (GitHub → Settings → Developer settings → Personal access tokens → Classic).
3. In the app, open **Settings** and fill in:
   - **owner** – your GitHub username
   - **repo** – e.g. `med-tracker-data`
   - **token** – the `ghp_...` token
   - **path** – `data/tracker.json` (created automatically on first push)
   - **branch** – `main`
4. **Save settings**, then **Push to GitHub** to back up, or **Pull from
   GitHub** to load data on another device.

> The token is stored only on this device (Electron user data). Only use a token
> scoped to this one repo if you can.

## Reminders setup

1. Settings → **Enable notifications** (in the desktop app this is instant).
2. Tick **Reminders on** and set your morning / evening / Sunday times.
3. **Save settings**. Keep the app open for reminders to fire. Notifications
   show as native Windows notifications.

Reminders are checked every 30 seconds while the app is running.

## Web / PWA version (optional)

The same UI can also run in a browser (PWA with service worker). Serve the
folder statically and open `index.html`:

```
npm run serve   # http://localhost:8000
```

## Tests

```
npm test
```

Runs the core logic (schedule generation, marking doses, stats, history) against
a tiny mock DOM.

## Files

- `index.html` – UI
- `css/style.css` – styling
- `js/app.js` – all logic (schedule, marking, reminders, GitHub sync)
- `electron/main.js`, `electron/preload.js` – Electron desktop shell
- `manifest.json`, `sw.js` – PWA (web version)
- `Run Med Tracker.bat` – Windows dev launcher (runs from source, no build)
- `tests/harness.js` – logic tests
