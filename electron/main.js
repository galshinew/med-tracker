const { app, BrowserWindow, Notification, ipcMain, shell } = require("electron");
const path = require("path");
const fs = require("fs");

app.commandLine.appendSwitch("lang", "en-GB"); // 24-hour clock for times

let mainWindow = null;

function storePath(name) {
  return path.join(app.getPath("userData"), name);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 460,
    height: 780,
    minWidth: 380,
    minHeight: 520,
    title: "Med Tracker",
    backgroundColor: "#f3f3f3",
    autoHideMenuBar: true,
    icon: path.join(__dirname, "..", "public", "icons", "icon-512.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, "..", "index.html"));

  mainWindow.webContents.on("did-fail-load", (_e, code, desc, url) => {
    console.error(`[did-fail-load] ${code} ${desc} ${url}`);
  });
  mainWindow.webContents.on("preload-error", (_e, preloadPath, error) => {
    console.error(`[preload-error] ${preloadPath}`, error);
  });
  mainWindow.webContents.on("render-process-gone", (_e, details) => {
    console.error(`[render-process-gone]`, details);
  });
  mainWindow.webContents.on("console-message", (_e, level, message) => {
    if(level >= 2) console.error(`[renderer:${level}] ${message}`);
  });


  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => { mainWindow = null; });
}

app.whenReady().then(() => {
  app.setAppUserModelId("com.medtracker.app");
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

/* ===================== Local file store (device) ===================== */
/* tracker.json holds synced data + settings; config.json holds device-only
   settings (GitHub credentials + theme). No browser storage is used. */
ipcMain.on("store:load", (event) => {
  const read = (name) => {
    try { return fs.readFileSync(storePath(name), "utf8"); } catch (e) { return ""; }
  };
  event.returnValue = { tracker: read("tracker.json"), config: read("config.json") };
});

ipcMain.on("store:save-tracker", (_event, text) => {
  try { fs.writeFileSync(storePath("tracker.json"), String(text), "utf8"); }
  catch (e) { console.error("[store:save-tracker]", e); }
});

ipcMain.on("store:save-config", (_event, text) => {
  try { fs.writeFileSync(storePath("config.json"), String(text), "utf8"); }
  catch (e) { console.error("[store:save-config]", e); }
});

ipcMain.on("notify", (_event, payload) => {
  const { title, body } = payload || {};
  if (!Notification.isSupported()) return;
  const n = new Notification({
    title: title || "Med Tracker",
    body: body || "",
    icon: path.join(__dirname, "..", "public", "icons", "icon-512.png")
  });
  n.on("click", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
  n.show();
});
