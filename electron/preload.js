const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  isElectron: true,
  loadStore: () => ipcRenderer.sendSync("store:load"),
  saveTracker: (text) => ipcRenderer.send("store:save-tracker", text),
  saveConfig: (text) => ipcRenderer.send("store:save-config", text),
  notify: (a, b) => ipcRenderer.send("notify", (a && typeof a === "object") ? a : { title: a, body: b })
});
