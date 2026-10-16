# Design notes

## Schedule as given
- Madison: 2 times/day — AM 2 pills, PM 3 pills.
- Medsion: 1 pill once/week, every Sunday.

Encoded in `DEFAULT_SCHEDULE` in `js/app.js`:
- `m-am` daily morning, dose 2
- `m-pm` daily evening, dose 3
- `med-sun` weekly on `sun`, dose 1

## Architecture
- **Electron** desktop shell: `electron/main.js` (window + native
  notifications), `electron/preload.js` (safe IPC bridge `window.electronAPI`).
- **Renderer** is the same vanilla HTML/CSS/JS app in `index.html` + `js/app.js`,
  loaded via `loadFile` (file://), so the script tag is a classic script
  (ES modules are blocked over file://).
- Notifications: renderer calls `window.electronAPI.notify(...)` → main process
  `new Notification().show()`. Falls back to the web Notification API in a
  browser.
- Service worker is skipped when running under Electron.

## Data
- Local-first: Electron `localStorage` key `medtracker` holds
  `{ "YYYY-MM-DD": { "<slotId>": { taken, missed, ts } } }`.
- GitHub sync via REST contents API (base64 + optional SHA for updates).
  Token and repo settings stored in `localStorage` key `medtracker:settings`.
- Reminder de-duplication per day via `notif:<date>:<slot>` keys.

## Build
- `electron-builder` config in `package.json` (`build` field).
- Targets: `nsis` installer + `portable` exe. Icon: `public/icons/icon.ico`.

## Possible next steps
- Timezone-aware day keys (currently local device date).
- Editable schedule UI and per-med names/doses.
- Weekly adherence chart.
- Tray icon + start-with-Windows so reminders fire without opening the window.
