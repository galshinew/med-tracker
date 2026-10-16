/* ===================== Data / schedule ===================== */
const DEFAULT_SCHEDULE = [
  { id: "m-am", med: "Madison", dose: 2, type: "daily", timeOfDay: "morning", slot: "morning" },
  { id: "m-pm", med: "Madison", dose: 3, type: "daily", timeOfDay: "evening", slot: "evening" },
  { id: "med-sun", med: "Medsion", dose: 1, type: "weekly", day: "sun", slot: "sunday" }
];

const DEFAULT_REMINDERS = { morning: "08:00", evening: "20:00", sunday: "09:00" };

const ICONS = {
  pill: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 20.5a5 5 0 0 1-7-7l6-6a5 5 0 0 1 7 7z"/><path d="M8.5 8.5l7 7"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 9h18"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  circle: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/></svg>',
  x: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  sun: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg>'
};

/* ===================== State / storage =====================
   No browser storage is used. On desktop the data lives in two files on
   disk (tracker.json = synced data+settings, config.json = device-only
   GitHub credentials + theme). In the browser everything is kept in memory
   and synced to GitHub. */
const desktopBridge = (typeof window !== "undefined" && window.electronAPI) ? window.electronAPI : null;
const DATA_VERSION = 1;

function defaultGithub(){ return { owner: "", repo: "", token: "", path: "tracker.json", branch: "main" }; }

const state = { data: {}, settings: {}, config: {}, updatedAt: "" };

function safeParse(text, fallback){
  try {
    const s = (typeof text === "string") ? text.replace(/^\uFEFF/, "") : text;
    const o = JSON.parse(s);
    return (o && typeof o === "object") ? o : fallback;
  } catch(e){ return fallback; }
}

function applyStore(raw){
  raw = raw || {};
  state.data = (raw.data && typeof raw.data === "object") ? raw.data : {};
  state.updatedAt = raw.updatedAt || "";
  const s = raw.settings || {};
  state.settings = {
    reminders: Object.assign({}, DEFAULT_REMINDERS, s.reminders || {}),
    remindersEnabled: !!s.remindersEnabled,
    language: s.language || "en",
    tz: s.tz || ""
  };
  const c = raw.config || {};
  state.config = {
    github: Object.assign(defaultGithub(), c.github || {}),
    theme: c.theme || "light"
  };
}

function hasCreds(){
  const g = state.config.github || {};
  return !!(g.owner && g.repo && g.token);
}

function trackerObject(){
  return { version: DATA_VERSION, updatedAt: state.updatedAt, data: state.data, settings: state.settings };
}

/* Load persisted state. Desktop -> files on disk; browser -> GitHub (async). */
function loadStore(){
  if(desktopBridge && typeof desktopBridge.loadStore === "function"){
    let res = {};
    try { res = desktopBridge.loadStore() || {}; } catch(e){ res = {}; }
    const tracker = safeParse(res.tracker, {});
    const config = safeParse(res.config, {});
    applyStore({ data: tracker.data, settings: tracker.settings, config: config, updatedAt: tracker.updatedAt });
    return true;
  }
  applyStore({});
  return false;
}

/* Write the tracker file to disk (desktop only) without pushing to GitHub. */
function persistLocal(){
  if(desktopBridge && typeof desktopBridge.saveTracker === "function"){
    try { desktopBridge.saveTracker(JSON.stringify(trackerObject())); } catch(e){}
  }
}

/* Persist synced data + settings, stamping updatedAt, and push to GitHub
   (both desktop and browser) when credentials are configured. */
function saveStore(){
  state.updatedAt = new Date().toISOString();
  persistLocal();
  if(typeof pushRemote === "function") pushRemote(trackerObject());
}

/* Persist device-only config (GitHub credentials + theme). */
function saveConfigStore(){
  if(desktopBridge && typeof desktopBridge.saveConfig === "function"){
    try { desktopBridge.saveConfig(JSON.stringify(state.config)); } catch(e){}
  }
}

/* ===================== Helpers ===================== */
function $(q){ return document.querySelector(q); }
function fmtDate(d){
  const x = d ? new Date(d) : new Date();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return x.getFullYear() + "-" + m + "-" + day;
}
function dateFromKey(key){
  const p = String(key).split("-");
  return new Date(+p[0], +p[1] - 1, +p[2]);
}
function todayKey(d){ return fmtDate(d || new Date()); }
function getDayStr(d){ return ["sun","mon","tue","wed","thu","fri","sat"][d.getDay()]; }

function slotLabel(e){ return e.type === "weekly" ? t("common.weekly") : (e.timeOfDay === "morning" ? t("common.morning") : t("common.evening")); }
function displayMed(med){
  const key = "med." + med;
  return t(key) === key ? med : t(key);
}
function reminderTimeFor(e){ return (state.settings.reminders || {})[e.slot] || DEFAULT_REMINDERS[e.slot] || ""; }

function getEntriesForDay(d){
  const key = fmtDate(d);
  const dayStr = getDayStr(d);
  return DEFAULT_SCHEDULE
    .filter(it => it.type === "daily" || (it.type === "weekly" && it.day === dayStr))
    .map(it => Object.assign({}, it, { key }));
}

/* Entries due on a given stored day key */
function entriesForKey(key){
  const d = dateFromKey(key);
  const dayStr = getDayStr(d);
  return DEFAULT_SCHEDULE
    .filter(it => it.type === "daily" || (it.type === "weekly" && it.day === dayStr))
    .map(it => Object.assign({}, it, { key: key }));
}

function isDueOn(e, d){
  return e.type === "daily" || (e.type === "weekly" && e.day === getDayStr(d));
}

/* All medications, flagged with whether they are due today (weekly meds always show) */
function getAllEntriesForDay(d){
  return DEFAULT_SCHEDULE.map(it => Object.assign({}, it, {
    key: fmtDate(d),
    dueToday: isDueOn(it, d)
  }));
}

function nextDueDate(e, d){
  if(e.type !== "weekly") return d;
  const cur = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const target = ["sun","mon","tue","wed","thu","fri","sat"].indexOf(e.day);
  let diff = (target - cur.getDay() + 7) % 7;
  if(diff === 0) diff = 7; /* next occurrence, not today */
  cur.setDate(cur.getDate() + diff);
  return cur;
}

function dayCounts(d){
  const key = fmtDate(d);
  const entries = getEntriesForDay(d);
  const rec = state.data[key] || {};
  let taken = 0, pending = 0;
  for(const e of entries){
    const r = rec[e.id];
    if(r && r.taken) taken++; else pending++;
  }
  return { key, entries, taken, pending, total: entries.length };
}

/* ===================== Theme ===================== */
function getStoredTheme(){ return (state.config && state.config.theme) || "light"; }
function applyTheme(t, persist){
  try { if(document.documentElement && document.documentElement.setAttribute) document.documentElement.setAttribute("data-theme", t); } catch(e){}
  if(state.config){ state.config.theme = t; if(persist !== false) saveConfigStore(); }
  const b = $("#btnTheme");
  if(b) b.innerHTML = t === "dark" ? ICONS.sun : ICONS.moon;
}
function currentTheme(){
  try { return (document.documentElement && document.documentElement.getAttribute) ? (document.documentElement.getAttribute("data-theme") || "light") : "light"; } catch(e){ return "light"; }
}
function toggleTheme(){ applyTheme(currentTheme() === "dark" ? "light" : "dark"); }

/* ===================== Tabs ===================== */
function switchTab(name){
  const items = document.querySelectorAll(".pivot-item");
  items.forEach(b => b.classList.toggle("active", b.getAttribute("data-tab") === name));
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(s => s.classList.toggle("active", s.id === "tab-" + name));
  positionInk();
}
function positionInk(){
  const active = document.querySelector(".pivot-item.active");
  const ink = $("#pivotInk");
  if(!active || !ink || !ink.style || active.offsetLeft == null) return;
  ink.style.left = active.offsetLeft + "px";
  ink.style.width = active.offsetWidth + "px";
}

/* ===================== Rendering ===================== */
function render(){
  renderSchedule();
  renderStats();
  renderWeekStrip("#historyMain");
  renderHistoryTable(30, "#history");
  positionInk();
}

function todayLabelHTML(){
  const now = new Date();
  const weekday = now.toLocaleDateString(localeTag(), { weekday: "long" });
  const rest = now.toLocaleDateString(localeTag(), { month: "long", day: "numeric", year: "numeric" });
  return '<span class="today-weekday">' + weekday + '</span><span class="today-rest">, ' + rest + '</span>';
}

function takenFor(key, id){
  const r = state.data[key] && state.data[key][id];
  return !!(r && r.taken);
}

function lastTakenFor(id){
  let best = null;
  Object.keys(state.data || {}).forEach(function(k){
    const rec = state.data[k] && state.data[k][id];
    if(rec && rec.taken && (!best || k > best.key)) best = { key: k, ts: rec.ts };
  });
  return best;
}

function lastTakenLabel(id){
  const best = lastTakenFor(id);
  if(!best) return t("common.lastNever");
  const d = dateFromKey(best.key);
  let when = d.toLocaleDateString(localeTag(), { weekday: "short", day: "numeric", month: "short" });
  if(best.ts) when += ", " + best.ts;
  return t("common.lastTaken", { when: when });
}

function weeklyFoot(id){
  return '<div class="med-foot"><span class="med-last">' + ICONS.clock + lastTakenLabel(id) + '</span></div>';
}

function friendlyMessage(c){
  if(c.total === 0) return t("msg.noDoses");
  if(c.taken === c.total) return t("msg.allDone");
  if(c.taken === 0) return tp("msg.toTake", c.total);
  return tp("msg.almost", c.pending);
}

/* A single dose row with one Taken / To-take toggle */
function doseRow(e, key){
  const taken = takenFor(key, e.id);
  const rec = state.data[key] && state.data[key][e.id];
  const pills = tp("pill", e.dose);
  const sub = pills + (taken && rec && rec.ts ? " \u00b7 " + t("sub.takenAt", { time: rec.ts }) : " \u00b7 " + reminderTimeFor(e));
  return '<div class="dose-row' + (taken ? " taken" : "") + '">' +
    '<div class="dose-info">' +
      '<div class="dose-slot">' + slotLabel(e) + '</div>' +
      '<div class="dose-sub">' + sub + '</div>' +
    '</div>' +
    '<button type="button" class="toggle-taken' + (taken ? " on" : "") + '" data-id="' + e.id + '" data-key="' + key + '" aria-pressed="' + taken + '" title="' + (taken ? t("title.undoTaken") : t("title.markTaken")) + '">' +
      (taken ? ICONS.check : ICONS.circle) + '<span>' + (taken ? t("common.taken") : t("common.toTake")) + '</span>' +
    '</button>' +
  '</div>';
}

/* A medication box (weekly on top, daily below). Daily boxes can show today's progress. */
function medBox(med, entries, kind, key, opts){
  opts = opts || {};
  const icon = kind === "weekly" ? ICONS.calendar : ICONS.pill;
  const tag = kind === "weekly" ? t("common.weekly") : t("common.daily");
  const rows = entries.map(function(e){ return doseRow(e, key); }).join("");
  const kicker = opts.progress ? '<div class="med-date">' + todayLabelHTML() + '</div>' : '';
  let head = '<div class="med-head">' +
      '<div class="med-icon ' + kind + '">' + icon + '</div>' +
      '<div class="med-name">' + displayMed(med) + '</div>' +
      '<span class="med-tag ' + kind + '">' + tag + '</span>';
  let foot = '';
  if(opts.progress){
    const total = entries.length;
    let taken = 0;
    entries.forEach(function(e){ if(takenFor(key, e.id)) taken++; });
    const pending = total - taken;
    const pct = total ? Math.round(taken / total * 100) : 0;
    const R = 17;
    const C = 2 * Math.PI * R;
    const off = C * (1 - (total ? taken / total : 0));
    const done = total > 0 && taken === total;
    head += '<div class="med-ring">' +
        '<svg viewBox="0 0 40 40" width="46" height="46">' +
          '<defs>' +
            '<linearGradient id="medRingGrad" x1="0" y1="0" x2="1" y2="1">' +
              '<stop class="g0" offset="0" stop-color="#2f80ed"/>' +
              '<stop class="g1" offset="1" stop-color="#1fb6a6"/>' +
            '</linearGradient>' +
            '<linearGradient id="medRingGradDone" x1="0" y1="0" x2="1" y2="1">' +
              '<stop offset="0" stop-color="#22c55e"/>' +
              '<stop class="g1" offset="1" stop-color="#0e9f6e"/>' +
            '</linearGradient>' +
          '</defs>' +
          '<circle class="ring-bg" cx="20" cy="20" r="' + R + '"/>' +
          '<circle class="ring-fg' + (done ? " complete" : "") + '" cx="20" cy="20" r="' + R + '" style="stroke-dasharray:' + C.toFixed(2) + ';stroke-dashoffset:' + off.toFixed(2) + '"/>' +
        '</svg>' +
        '<div class="ring-label sm">' + pct + '%</div>' +
      '</div>';
    foot = '<div class="med-foot">' +
        '<span class="chip ok"><span class="dot"></span>' + t("common.takenCount", { n: taken }) + '</span>' +
        '<span class="chip warn"><span class="dot"></span>' + t("common.toTakeCount", { n: pending }) + '</span>' +
        '<span class="med-msg' + (done ? " success" : "") + '">' + friendlyMessage({ total: total, taken: taken, pending: pending }) + '</span>' +
      '</div>';
  } else if(kind === "weekly"){
    foot = weeklyFoot(entries[0].id);
  }
  head += '</div>';
  return '<div class="card med-box ' + kind + (opts.progress ? ' has-progress' : '') + '">' + kicker + head +
    '<div class="dose-rows">' + rows + '</div>' + foot + '</div>';
}

function renderSchedule(){
  const list = $("#scheduleList");
  if(!list) return;
  const now = new Date();
  const key = todayKey(now);
  const daily = [];
  const weekly = [];

  // all daily medications in a single box
  const byMed = {};
  DEFAULT_SCHEDULE.filter(e => e.type === "daily").forEach(function(e){
    (byMed[e.med] = byMed[e.med] || []).push(e);
  });
  Object.keys(byMed).forEach(function(med){
    daily.push(medBox(med, byMed[med], "daily", key, { progress: true }));
  });

  // weekly medications
  DEFAULT_SCHEDULE.filter(e => e.type === "weekly").forEach(function(e){
    if(isDueOn(e, now)){
      weekly.push(medBox(e.med, [e], "weekly", key));
    } else {
      const next = nextDueDate(e, now);
      const nextLabel = next.toLocaleDateString(localeTag(), { weekday: "long", month: "short", day: "numeric" });
      const pills = tp("pill", e.dose);
      weekly.push('<div class="card med-box off">' +
        '<div class="med-head">' +
          '<div class="med-icon weekly">' + ICONS.calendar + '</div>' +
          '<div class="med-name">' + displayMed(e.med) + '</div>' +
          '<span class="med-tag weekly">' + t("common.weekly") + '</span>' +
        '</div>' +
        '<div class="dose-rows">' +
          '<div class="dose-row notdue">' +
            '<div class="dose-info">' +
              '<div class="dose-slot">' + t("common.notDueToday") + '</div>' +
              '<div class="dose-sub">' + pills + ' \u00b7 ' + t("common.nextDose", { date: nextLabel }) + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        weeklyFoot(e.id) + '</div>');
    }
  });

  list.innerHTML = daily.concat(weekly).join("");
}

function renderStats(){
  const box = $("#stats");
  if(!box) return;
  const today = new Date();
  let taken = 0, possible = 0;
  for(let i = 0; i < 30; i++){
    const c = dayCounts(new Date(today.getTime() - i * 86400000));
    taken += c.taken;
    possible += c.total;
  }
  const pct = possible ? Math.round(taken / possible * 100) : 0;
  box.innerHTML =
    '<span class="chip ok"><span class="dot"></span>' + tp("stats.dosesTaken", taken) + '</span>' +
    '<span class="chip"><span class="dot"></span>' + t("stats.over30", { n: pct }) + '</span>';
}

function renderWeekStrip(selector){
  const box = $(selector || "#historyMain");
  if(!box) return;
  const today = new Date();
  const tiles = [];
  for(let i = 6; i >= 0; i--){
    const d = new Date(today.getTime() - i * 86400000);
    const c = dayCounts(d);
    if(!c.total) continue;
    const pct = c.total ? c.taken / c.total : 0;
    const R = 19;
    const C = 2 * Math.PI * R;
    const off = C * (1 - pct);
    const status = c.taken === c.total ? "done" : (c.taken > 0 ? "partial" : "none");
    const isToday = i === 0;
    const name = isToday ? t("common.today") : d.toLocaleDateString(localeTag(), { weekday: "short" });
    const num = d.getDate();
    const dots = [];
    for(let k = 0; k < c.total; k++){
      const cls = k < c.taken ? "ok" : "left";
      dots.push('<i class="wd-dot ' + cls + '"></i>');
    }
    tiles.push(
      '<button type="button" class="week-day ' + status + (isToday ? ' is-today' : '') + '" data-day="' + fmtDate(d) + '" title="' + t("week.editDay", { name: name }) + '">' +
        '<div class="wd-name">' + name + '</div>' +
        '<div class="wd-ring">' +
          '<svg viewBox="0 0 46 46" width="46" height="46">' +
            '<circle class="wd-track" cx="23" cy="23" r="' + R + '"/>' +
            '<circle class="wd-arc ' + status + '" cx="23" cy="23" r="' + R + '" style="stroke-dasharray:' + C.toFixed(2) + ';stroke-dashoffset:' + off.toFixed(2) + '"/>' +
          '</svg>' +
          '<span class="wd-num">' + num + '</span>' +
        '</div>' +
        '<div class="wd-dots">' + dots.join("") + '</div>' +
      '</button>'
    );
  }
  box.innerHTML = '<div class="weekstrip card">' + tiles.join("") + '</div>';
}

function renderHistoryTable(days, selector){
  days = days || 30;
  const box = $(selector || "#history");
  if(!box) return;
  const today = new Date();
  const rows = [];
  for(let i = 0; i < days; i++){
    const d = new Date(today.getTime() - i * 86400000);
    const c = dayCounts(d);
    if(!c.total) continue;
    const pct = c.total ? Math.round(c.taken / c.total * 100) : 0;
    const day = i === 0 ? t("common.today") : d.toLocaleDateString(localeTag(), { weekday: "short" });
    const date = d.toLocaleDateString(localeTag(), { month: "short", day: "numeric" });
    const cls = i === 0 ? ' class="is-today"' : "";
    const state = c.taken === c.total ? "done" : (c.taken > 0 ? "partial" : "none");
    rows.push(
      '<tr' + cls + ' data-day="' + fmtDate(d) + '">' +
        '<td class="c-day">' + day + '</td>' +
        '<td class="c-date">' + date + '</td>' +
        '<td class="c-num ok">' + c.taken + '</td>' +
        '<td class="c-num warn">' + c.pending + '</td>' +
        '<td class="c-prog"><div class="mini-bar"><div class="mini-bar-fill ' + state + '" style="width:' + pct + '%"></div></div><span class="mini-pct">' + pct + '%</span></td>' +
        '<td class="c-edit"><button type="button" class="link-edit" data-day="' + fmtDate(d) + '">' + t("common.edit") + '</button></td>' +
      '</tr>'
    );
  }
  box.innerHTML =
    '<table class="hist-table">' +
      '<thead><tr>' +
        '<th>' + t("history.col.day") + '</th><th>' + t("history.col.date") + '</th><th>' + t("history.col.taken") + '</th><th>' + t("history.col.toTake") + '</th><th class="th-prog">' + t("history.col.progress") + '</th><th></th>' +
      '</tr></thead>' +
      '<tbody>' + rows.join("") + '</tbody>' +
    '</table>';
}

/* ===================== Actions ===================== */
function setTaken(key, id, taken){
  if(taken){
    if(!state.data[key]) state.data[key] = {};
    const isToday = key === todayKey();
    const ts = isToday ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }) : "";
    state.data[key][id] = { taken: true, ts: ts };
  } else if(state.data[key] && state.data[key][id]){
    delete state.data[key][id];
    if(!Object.keys(state.data[key]).length) delete state.data[key];
  }
  saveStore();
  render();
  if(openDayKey === key) renderDayEditor(key);
}

function toggleTaken(key, id){
  setTaken(key, id, !takenFor(key, id));
}

/* ===================== Day editor ===================== */
let openDayKey = null;

function openDayEditor(key){
  openDayKey = key;
  renderDayEditor(key);
  const ov = $("#dayEditor");
  if(ov){ ov.hidden = false; ov.classList.add("open"); }
}

function closeDayEditor(){
  openDayKey = null;
  const ov = $("#dayEditor");
  if(ov){ ov.hidden = true; ov.classList.remove("open"); }
}

function renderDayEditor(key){
  const box = $("#dayEditorBody");
  const title = $("#dayEditorTitle");
  const sub = $("#dayEditorSub");
  if(!box) return;
  const d = dateFromKey(key);
  const isToday = key === todayKey();
  if(title) title.textContent = isToday ? t("common.today") : t("editor.editDay");
  if(sub) sub.textContent = d.toLocaleDateString(localeTag(), { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const entries = entriesForKey(key);
  const byMed = {};
  entries.forEach(function(e){ (byMed[e.med] = byMed[e.med] || []).push(e); });
  const boxes = Object.keys(byMed).map(function(med){
    const kind = byMed[med][0].type === "weekly" ? "weekly" : "daily";
    return medBox(med, byMed[med], kind, key);
  });
  box.innerHTML = boxes.join("");
}

/* ===================== Reminders ===================== */
function reminderKeyForEntry(e){ return e.slot; }

/* In-memory only (no browser storage): keys already shown this session. */
const _notified = {};

function checkReminders(){
  if(!state.settings.remindersEnabled) return;
  const canNotify = !!(desktopBridge && desktopBridge.notify) ||
    (typeof Notification !== "undefined" && Notification.permission === "granted");
  if(!canNotify) return;
  const now = new Date();
  const hhmm = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
  const key = todayKey(now);
  const entries = getEntriesForDay(now);
  for(const e of entries){
    const rem = (state.settings.reminders || {})[e.slot];
    if(!rem) continue;
    const rec = state.data[key] && state.data[key][e.id];
    if(rec && rec.taken) continue;
    const nkey = "notif:" + key + ":" + e.id;
    if(_notified[nkey]) continue;
    if(hhmm >= rem){
      const title = t("notif.title", { med: displayMed(e.med), slot: slotLabel(e) });
      const body = tp("notif.body", e.dose);
      if(desktopBridge && desktopBridge.notify){ desktopBridge.notify(title, body); }
      else { try { new Notification(title, { body: body, tag: nkey }); } catch(err){} }
      _notified[nkey] = 1;
    }
  }
}

/* ===================== Wiring ===================== */
function wire(){
  const themeBtn = $("#btnTheme");
  if(themeBtn) themeBtn.addEventListener("click", toggleTheme);

  document.querySelectorAll(".pivot-item").forEach(function(b){
    b.addEventListener("click", function(){ switchTab(b.getAttribute("data-tab")); });
  });

  const list = $("#scheduleList");
  if(list) list.addEventListener("click", function(ev){
    const btn = ev.target.closest("button.toggle-taken");
    if(!btn) return;
    toggleTaken(btn.getAttribute("data-key") || todayKey(), btn.getAttribute("data-id"));
  });

  const strip = $("#historyMain");
  if(strip) strip.addEventListener("click", function(ev){
    const tile = ev.target.closest("[data-day]");
    if(tile) openDayEditor(tile.getAttribute("data-day"));
  });

  const hist = $("#history");
  if(hist) hist.addEventListener("click", function(ev){
    const row = ev.target.closest("tr[data-day]");
    if(row) openDayEditor(row.getAttribute("data-day"));
  });

  const edBody = $("#dayEditorBody");
  if(edBody) edBody.addEventListener("click", function(ev){
    const btn = ev.target.closest("button.toggle-taken");
    if(!btn) return;
    toggleTaken(btn.getAttribute("data-key") || openDayKey, btn.getAttribute("data-id"));
  });
  const edClose = $("#dayEditorClose");
  if(edClose) edClose.addEventListener("click", closeDayEditor);
  const edDone = $("#dayEditorDone");
  if(edDone) edDone.addEventListener("click", closeDayEditor);
  const edOverlay = $("#dayEditor");
  if(edOverlay) edOverlay.addEventListener("click", function(ev){ if(ev.target === edOverlay) closeDayEditor(); });
  if(typeof document !== "undefined" && document.addEventListener){
    document.addEventListener("keydown", function(ev){ if(ev.key === "Escape" && openDayKey) closeDayEditor(); });
  }

  const saveBtn = $("#btnSaveSettings");
  if(saveBtn) saveBtn.addEventListener("click", function(){
    state.config.github = {
      owner: $("#ghOwner").value.trim(),
      repo: $("#ghRepo").value.trim(),
      token: $("#ghToken").value.trim(),
      path: $("#ghPath").value.trim() || "tracker.json",
      branch: $("#ghBranch").value.trim() || "main"
    };
    state.settings.tz = ($("#tz") && $("#tz").value.trim()) || "";
    state.settings.reminders = {
      morning: $("#remMorning").value || DEFAULT_REMINDERS.morning,
      evening: $("#remEvening").value || DEFAULT_REMINDERS.evening,
      sunday: $("#remSunday").value || DEFAULT_REMINDERS.sunday
    };
    state.settings.remindersEnabled = !!($("#remEnabled") && $("#remEnabled").checked);
    saveConfigStore();
    if(!desktopBridge) writeHashConfig();
    state.updatedAt = new Date().toISOString();
    persistLocal();
    if(hasCreds()){ syncOnLoad(); startPolling(); }
    $("#syncStatus").textContent = t("sync.settingsSaved");
    render();
    checkReminders();
  });

  const enableBtn = $("#btnEnableNotif");
  if(enableBtn) enableBtn.addEventListener("click", async function(){
    if(desktopBridge && desktopBridge.notify){
      $("#syncStatus").textContent = t("sync.notifDesktop");
      if($("#remEnabled")){ $("#remEnabled").checked = true; state.settings.remindersEnabled = true; saveStore(); checkReminders(); }
      return;
    }
    if(typeof Notification === "undefined"){ $("#syncStatus").textContent = t("sync.notifUnsupported"); return; }
    try {
      const p = await Notification.requestPermission();
      $("#syncStatus").textContent = t("sync.notifPermission", { p: p });
      if(p === "granted" && $("#remEnabled")){ $("#remEnabled").checked = true; state.settings.remindersEnabled = true; saveStore(); checkReminders(); }
    } catch(e){ $("#syncStatus").textContent = t("sync.error", { msg: e.message }); }
  });

  const testBtn = $("#btnTestSync");
  if(testBtn) testBtn.addEventListener("click", async function(){
    $("#syncStatus").textContent = t("sync.testing");
    try { await githubGet(); $("#syncStatus").textContent = t("sync.connectionOk"); }
    catch(e){ $("#syncStatus").textContent = t("sync.error", { msg: e.message }); }
  });

  const pullBtn = $("#btnPull");
  if(pullBtn) pullBtn.addEventListener("click", async function(){
    $("#syncStatus").textContent = t("sync.pulling");
    try {
      const res = await githubGet();
      if(res.content){
        const fromB64 = (b64) => new TextDecoder().decode(Uint8Array.from(atob(String(b64).replace(/\s/g, "")), c => c.charCodeAt(0)));
        const obj = JSON.parse(fromB64(res.content));
        if(obj && obj.data){ applyStore({ data: obj.data, settings: obj.settings, config: state.config }); }
        else { applyStore({ data: obj, settings: state.settings, config: state.config }); }
        initLang(state.settings.language);
        applyLang();
        applyTheme(state.config.theme, false);
        saveStore();
        syncLangSeg();
        loadSettingsUI();
        render();
        $("#syncStatus").textContent = t("sync.pulled");
      } else { $("#syncStatus").textContent = t("sync.noContent"); }
    } catch(e){ $("#syncStatus").textContent = t("sync.pullError", { msg: e.message }); }
  });

  const pushBtn = $("#btnPush");
  if(pushBtn) pushBtn.addEventListener("click", async function(){
    $("#syncStatus").textContent = t("sync.pushing");
    try {
      const res = await githubPut(JSON.stringify(trackerObject(), null, 2));
      $("#syncStatus").textContent = t("sync.pushed") + " (" + res.content.sha.slice(0, 7) + ")";
    } catch(e){ $("#syncStatus").textContent = t("sync.pushError", { msg: e.message }); }
  });

  if(!desktopBridge && "serviceWorker" in navigator){ navigator.serviceWorker.register("./sw.js").catch(function(){}); }

  const langSeg = $("#langSeg");
  if(langSeg) langSeg.addEventListener("click", function(ev){
    const btn = ev.target.closest(".seg-item");
    if(!btn) return;
    setLang(btn.getAttribute("data-lang"));
  });

  if(typeof window !== "undefined" && window.addEventListener) window.addEventListener("resize", positionInk);

  syncLangSeg();
  checkReminders();
  setInterval(checkReminders, 30000);
}

/* Called by setLang() in i18n.js when the language changes */
function onLangChange(){
  state.settings.language = getLang();
  saveStore();
  syncLangSeg();
  loadSettingsUI();
  render();
  positionInk();
}

function syncLangSeg(){
  const seg = $("#langSeg");
  if(!seg) return;
  document.querySelectorAll("#langSeg .seg-item").forEach(function(b){
    b.classList.toggle("active", b.getAttribute("data-lang") === getLang());
  });
}

function loadSettingsUI(){
  const set = (sel, val) => { const el = $(sel); if(el) el.value = val; };
  const g = state.config.github || defaultGithub();
  set("#ghOwner", g.owner || "");
  set("#ghRepo", g.repo || "");
  set("#ghToken", g.token || "");
  set("#ghPath", g.path || "tracker.json");
  set("#ghBranch", g.branch || "main");
  set("#tz", state.settings.tz || "");
  const r = state.settings.reminders || DEFAULT_REMINDERS;
  set("#remMorning", r.morning || DEFAULT_REMINDERS.morning);
  set("#remEvening", r.evening || DEFAULT_REMINDERS.evening);
  set("#remSunday", r.sunday || DEFAULT_REMINDERS.sunday);
  if($("#remEnabled")) $("#remEnabled").checked = !!state.settings.remindersEnabled;
}

/* ===================== GitHub sync ===================== */
async function githubGet(){
  const { owner, repo, token, path, branch } = state.config.github;
  if(!owner || !repo || !token) throw new Error(t("err.missingGithub"));
  const url = "https://api.github.com/repos/" + owner + "/" + repo + "/contents/" + encodeURIComponent(path) + "?ref=" + encodeURIComponent(branch);
  const r = await fetch(url, { cache: "no-store", headers: { "Authorization": "token " + token, "Accept": "application/vnd.github.v3+json", "User-Agent": "med-tracker" } });
  if(!r.ok) throw new Error(r.status + " " + r.statusText);
  return r.json();
}
async function githubPut(content){
  const { owner, repo, token, path, branch } = state.config.github;
  if(!owner || !repo || !token) throw new Error(t("err.missingGithub"));
  let sha;
  try { const cur = await githubGet(); sha = cur.sha; } catch(e){ sha = undefined; }
  const url = "https://api.github.com/repos/" + owner + "/" + repo + "/contents/" + encodeURIComponent(path);
  const toB64 = (t) => btoa(String.fromCharCode.apply(null, new TextEncoder().encode(t)));
  const body = Object.assign(
    { message: "Update tracker.json " + new Date().toISOString(), content: toB64(content), branch: branch },
    sha ? { sha: sha } : {}
  );
  const r = await fetch(url, { method: "PUT", cache: "no-store", headers: { "Authorization": "token " + token, "Accept": "application/vnd.github.v3+json", "Content-Type": "application/json", "User-Agent": "med-tracker" }, body: JSON.stringify(body) });
  if(!r.ok){ const txt = await r.text(); throw new Error(r.status + " " + r.statusText + " " + txt); }
  return r.json();
}

/* ===================== Web mode (GitHub, no local storage) ===================== */
function b64decode(b64){
  return new TextDecoder().decode(Uint8Array.from(atob(String(b64).replace(/\s/g, "")), c => c.charCodeAt(0)));
}

function parseHash(){
  const h = (typeof location !== "undefined" && location.hash) ? location.hash.replace(/^#/, "") : "";
  if(!h) return null;
  const out = {};
  h.split("&").forEach(function(kv){
    const i = kv.indexOf("=");
    if(i > 0) out[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1));
  });
  return out;
}

/* In the browser the GitHub credentials come from the URL hash (#owner=..&repo=..&token=..&branch=..)
   so nothing has to be stored on the device. */
function applyHashConfig(){
  if(desktopBridge) return;
  const p = parseHash();
  if(!p || !p.owner || !p.repo || !p.token) return;
  state.config.github = { owner: p.owner, repo: p.repo, token: p.token, path: p.path || "tracker.json", branch: p.branch || "main" };
}

function writeHashConfig(){
  if(desktopBridge || typeof location === "undefined") return;
  const g = state.config.github || {};
  try {
    location.hash = "owner=" + encodeURIComponent(g.owner || "") +
      "&repo=" + encodeURIComponent(g.repo || "") +
      "&token=" + encodeURIComponent(g.token || "") +
      "&branch=" + encodeURIComponent(g.branch || "main");
  } catch(e){}
}

/* Debounced auto-push of the whole tracker file after any change (needs creds). */
let _pushTimer = null;
function pushRemote(tracker){
  if(!hasCreds()) return;
  try { clearTimeout(_pushTimer); } catch(e){}
  _pushTimer = setTimeout(function(){
    githubPut(JSON.stringify(tracker, null, 2)).catch(function(){});
  }, 800);
}

/* Poll GitHub so changes made on another device appear without a reload. */
let _pollTimer = null;
let _polling = false;
async function pollRemote(){
  if(_polling || !hasCreds()) return;
  try { if(typeof document !== "undefined" && document.hidden) return; } catch(e){}
  _polling = true;
  try {
    const res = await githubGet();
    if(res && res.content){
      const remote = JSON.parse(b64decode(res.content));
      const remoteTs = (remote && remote.updatedAt) || "";
      if(remote && remote.data && remoteTs && remoteTs > (state.updatedAt || "")){
        applyStore({ data: remote.data, settings: remote.settings, config: state.config, updatedAt: remote.updatedAt });
        initLang(state.settings.language);
        applyLang();
        applyTheme(state.config.theme, false);
        loadSettingsUI();
        syncLangSeg();
        render();
        if(openDayKey) renderDayEditor(openDayKey);
        persistLocal();
      }
    }
  } catch(e){ /* offline or file not created yet */ }
  _polling = false;
}

function startPolling(){
  if(_pollTimer || !hasCreds()) return;
  _pollTimer = setInterval(pollRemote, 5000);
  if(typeof document !== "undefined" && document.addEventListener){
    document.addEventListener("visibilitychange", function(){ if(!document.hidden) pollRemote(); });
  }
  if(typeof window !== "undefined" && window.addEventListener){
    window.addEventListener("focus", function(){ pollRemote(); });
  }
}

/* On startup reconcile with GitHub; the newer of the two files wins ("last edit wins"). */
async function syncOnLoad(){
  if(!hasCreds()) return;
  let remote = null;
  try {
    const res = await githubGet();
    if(res && res.content) remote = JSON.parse(b64decode(res.content));
  } catch(e){ return; } // 404 (no file yet) or offline

  const localHasData = Object.keys(state.data).length > 0;
  const remoteTs = (remote && remote.updatedAt) || "";
  const adoptRemote = remote && (!localHasData || (remoteTs && remoteTs > (state.updatedAt || "")));
  if(adoptRemote){
    applyStore({ data: remote.data, settings: remote.settings, config: state.config, updatedAt: remote.updatedAt });
    initLang(state.settings.language);
    applyLang();
    applyTheme(state.config.theme, false);
    loadSettingsUI();
    syncLangSeg();
    render();
    persistLocal();
  } else if(localHasData && (!remote || (state.updatedAt || "") > remoteTs)){
    githubPut(JSON.stringify(trackerObject(), null, 2)).catch(function(){});
  }
}

/* ===================== Boot ===================== */
loadStore();
if(!desktopBridge) applyHashConfig();
initLang(state.settings.language);
applyLang();
applyTheme(getStoredTheme(), false);
wire();
loadSettingsUI();
syncLangSeg();
render();
positionInk();
syncOnLoad();
startPolling();
