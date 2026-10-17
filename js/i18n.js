/* ===================== Internationalization (English / Hebrew) ===================== */
/* Classic script: defines global helpers used by app.js (t, tp, getLang, setLang, applyLang, localeTag, isRTL). */

const I18N = {
  en: {
    "app.title": "Med Tracker",
    "med.Madison": "Madison",
    "med.Medsion": "Medsion",

    "nav.today": "Today",
    "nav.history": "History",
    "nav.settings": "Settings",

    "today.last7": "Last 7 days",
    "history.last30": "Last 30 days",
    "history.sub": "Your full history, most recent first.",

    "app.theme": "Toggle light / dark",

    "settings.reminders": "Reminders",
    "settings.remindersSub": "Get notified when a dose is due",
    "settings.meds": "Medications & times",
    "settings.medsSub": "Add or change your medications and how many times a day or week you take them.",
    "med.dailyTitle": "Daily medications",
    "med.weeklyTitle": "Weekly medications",
    "med.add": "Add a dose",
    "med.ph": "Medication name",
    "med.pills": "Pills",
    "med.freq": "Frequency",
    "med.everyDay": "Every day",
    "med.weeklyOn": "Weekly on",
    "med.time": "Time",
    "med.remove": "Remove",
    "day.sun": "Sunday",
    "day.mon": "Monday",
    "day.tue": "Tuesday",
    "day.wed": "Wednesday",
    "day.thu": "Thursday",
    "day.fri": "Friday",
    "day.sat": "Saturday",
    "settings.morning": "Morning",
    "settings.evening": "Evening",
    "settings.sunday": "Sunday (Medsion)",
    "settings.enableNotif": "Enable notifications",

    "settings.language": "Language",
    "settings.languageSub": "Choose the language for the app.",

    "settings.github": "GitHub sync",
    "settings.githubSub": "Back up and sync your data with your own private GitHub repository.",
    "settings.owner": "Repo owner",
    "settings.repo": "Repo name",
    "settings.token": "Access token (classic, repo scope)",
    "settings.path": "File path",
    "settings.branch": "Branch",
    "settings.save": "Save settings",
    "settings.test": "Test connection",
    "settings.pull": "Pull",
    "settings.push": "Push",
    "settings.ownerPh": "your-github-username",
    "settings.repoPh": "med-tracker-data",

    "modal.day": "Day",
    "modal.close": "Close",
    "modal.done": "Done",

    "common.weekly": "Weekly",
    "common.daily": "Daily",
    "common.morning": "Morning",
    "common.evening": "Evening",
    "common.taken": "Taken",
    "common.toTake": "To take",
    "common.today": "Today",
    "common.edit": "Edit",
    "common.notDue": "Not due",
    "common.notDueToday": "Not due today",
    "common.nextDose": "next dose {date}",
    "common.lastTaken": "Last taken: {when}",
    "common.lastNever": "Not taken yet",
    "common.takenCount": "{n} taken",
    "common.toTakeCount": "{n} to take",

    "pill.one": "{n} pill",
    "pill.other": "{n} pills",

    "sub.takenAt": "taken {time}",
    "title.undoTaken": "Taken \u2014 click to undo",
    "title.markTaken": "Mark as taken",

    "msg.noDoses": "No doses are scheduled for today.",
    "msg.allDone": "All done for today \u2014 great job!",
    "msg.toTake.one": "You have {n} dose to take today.",
    "msg.toTake.other": "You have {n} doses to take today.",
    "msg.almost.one": "Almost there \u2014 {n} dose left to take.",
    "msg.almost.other": "Almost there \u2014 {n} doses left to take.",

    "stats.dosesTaken.one": "{n} dose taken",
    "stats.dosesTaken.other": "{n} doses taken",
    "stats.over30": "{n}% over 30 days",

    "week.editDay": "Edit {name}",
    "history.col.day": "Day",
    "history.col.date": "Date",
    "history.col.taken": "Taken",
    "history.col.toTake": "To take",
    "history.col.progress": "Progress",
    "editor.editDay": "Edit day",

    "notif.title": "Time for {med} ({slot})",
    "notif.body.one": "Take {n} pill",
    "notif.body.other": "Take {n} pills",

    "rem.alertTitle": "Reminder",
    "rem.alertSub": "Time to take your medicine",
    "rem.stop": "Stop sound",
    "rem.markTaken": "Mark as taken",

    "sync.settingsSaved": "Settings saved.",
    "sync.testing": "Testing connection...",
    "sync.connectionOk": "Connection OK \u2014 file found.",
    "sync.noContent": "No content in file.",
    "sync.pulling": "Pulling...",
    "sync.pulled": "Pulled your data from GitHub.",
    "sync.pushing": "Pushing...",
    "sync.pushed": "Pushed to GitHub.",
    "sync.notifDesktop": "Notifications enabled (desktop app).",
    "sync.notifUnsupported": "Notifications are not supported here.",
    "sync.notifPermission": "Notification permission: {p}",
    "sync.error": "Error: {msg}",
    "sync.pullError": "Pull error: {msg}",
    "sync.pushError": "Push error: {msg}",
    "err.missingGithub": "Missing GitHub settings"
  },

  he: {
    "app.title": "\u05de\u05e2\u05e7\u05d1 \u05ea\u05e8\u05d5\u05e4\u05d5\u05ea",
    "med.Madison": "\u05ea\u05e8\u05d5\u05e4\u05d5\u05ea",
    "med.Medsion": "\u05ea\u05e8\u05d5\u05e4\u05d5\u05ea",

    "nav.today": "\u05d4\u05d9\u05d5\u05dd",
    "nav.history": "\u05d4\u05d9\u05e1\u05d8\u05d5\u05e8\u05d9\u05d4",
    "nav.settings": "\u05d4\u05d2\u05d3\u05e8\u05d5\u05ea",

    "today.last7": "\u05e9\u05d1\u05d5\u05e2 \u05d4\u05d0\u05d7\u05e8\u05d5\u05df",
    "history.last30": "30 \u05d4\u05d9\u05de\u05d9\u05dd \u05d4\u05d0\u05d7\u05e8\u05d5\u05e0\u05d9\u05dd",
    "history.sub": "\u05d4\u05d4\u05d9\u05e1\u05d8\u05d5\u05e8\u05d9\u05d4 \u05d4\u05de\u05dc\u05d0\u05d4 \u05e9\u05dc\u05da, \u05de\u05d4\u05d7\u05d3\u05e9 \u05dc\u05d9\u05e9\u05df.",

    "app.theme": "\u05de\u05e2\u05d1\u05e8 \u05d1\u05d9\u05df \u05de\u05e6\u05d1 \u05d1\u05d4\u05d9\u05e8 \u05dc\u05db\u05d4\u05d4",

    "settings.reminders": "\u05ea\u05d6\u05db\u05d5\u05e8\u05d5\u05ea",
    "settings.remindersSub": "\u05e7\u05d1\u05dc \u05d4\u05ea\u05e8\u05d0\u05d4 \u05db\u05d0\u05e9\u05e8 \u05de\u05d2\u05d9\u05e2 \u05d6\u05de\u05df \u05e0\u05d8\u05d9\u05dc\u05ea \u05de\u05e0\u05d4",
    "settings.meds": "\u05ea\u05e8\u05d5\u05e4\u05d5\u05ea \u05d5\u05d6\u05de\u05e0\u05d9\u05dd",
    "settings.medsSub": "\u05d4\u05d5\u05e1\u05e3 \u05d0\u05d5 \u05e9\u05e0\u05d4 \u05ea\u05e8\u05d5\u05e4\u05d5\u05ea \u05d5\u05db\u05de\u05d4 \u05e4\u05e2\u05de\u05d9\u05dd \u05d1\u05d9\u05d5\u05dd \u05d0\u05d5 \u05d1\u05e9\u05d1\u05d5\u05e2 \u05dc\u05d5\u05e7\u05d7\u05d9\u05dd \u05d0\u05d5\u05ea\u05df.",
    "med.dailyTitle": "\u05ea\u05e8\u05d5\u05e4\u05d5\u05ea \u05d9\u05d5\u05de\u05d9\u05d5\u05ea",
    "med.weeklyTitle": "\u05ea\u05e8\u05d5\u05e4\u05d5\u05ea \u05e9\u05d1\u05d5\u05e2\u05d9\u05d5\u05ea",
    "med.add": "\u05d4\u05d5\u05e1\u05e3 \u05de\u05e0\u05d4",
    "med.ph": "\u05e9\u05dd \u05d4\u05ea\u05e8\u05d5\u05e4\u05d4",
    "med.pills": "\u05db\u05d3\u05d5\u05e8\u05d9\u05dd",
    "med.freq": "\u05ea\u05d3\u05d9\u05e8\u05d5\u05ea",
    "med.everyDay": "\u05db\u05dc \u05d9\u05d5\u05dd",
    "med.weeklyOn": "\u05e9\u05d1\u05d5\u05e2\u05d9 \u05d1",
    "med.time": "\u05e9\u05e2\u05d4",
    "med.remove": "\u05d4\u05e1\u05e8",
    "day.sun": "\u05e8\u05d0\u05e9\u05d5\u05df",
    "day.mon": "\u05e9\u05e0\u05d9",
    "day.tue": "\u05e9\u05dc\u05d9\u05e9\u05d9",
    "day.wed": "\u05e8\u05d1\u05d9\u05e2\u05d9",
    "day.thu": "\u05d7\u05de\u05d9\u05e9\u05d9",
    "day.fri": "\u05e9\u05d9\u05e9\u05d9",
    "day.sat": "\u05e9\u05d1\u05ea",
    "settings.morning": "\u05d1\u05d5\u05e7\u05e8",
    "settings.evening": "\u05e2\u05e8\u05d1",
    "settings.sunday": "\u05e8\u05d0\u05e9\u05d5\u05df (\u05ea\u05e8\u05d5\u05e4\u05d5\u05ea)",
    "settings.enableNotif": "\u05d4\u05e4\u05e2\u05dc \u05d4\u05ea\u05e8\u05d0\u05d5\u05ea",

    "settings.language": "\u05e9\u05e4\u05d4",
    "settings.languageSub": "\u05d1\u05d7\u05e8 \u05d0\u05ea \u05e9\u05e4\u05ea \u05d4\u05d0\u05e4\u05dc\u05d9\u05e7\u05e6\u05d9\u05d4.",

    "settings.github": "\u05e1\u05e0\u05db\u05e8\u05d5\u05df GitHub",
    "settings.githubSub": "\u05d2\u05d1\u05d4 \u05d5\u05e1\u05e0\u05db\u05e8\u05df \u05d0\u05ea \u05d4\u05e0\u05ea\u05d5\u05e0\u05d9\u05dd \u05e9\u05dc\u05da \u05e2\u05dd \u05de\u05d0\u05d2\u05e8 GitHub \u05e4\u05e8\u05d8\u05d9 \u05e9\u05dc\u05da.",
    "settings.owner": "\u05d1\u05e2\u05dc\u05d9 \u05d4\u05de\u05d0\u05d2\u05e8",
    "settings.repo": "\u05e9\u05dd \u05d4\u05de\u05d0\u05d2\u05e8",
    "settings.token": "\u05d8\u05d5\u05e7\u05df \u05d2\u05d9\u05e9\u05d4 (classic, repo scope)",
    "settings.path": "\u05e0\u05ea\u05d9\u05d1 \u05d4\u05e7\u05d5\u05d1\u05e5",
    "settings.branch": "\u05e2\u05e0\u05e3",
    "settings.save": "\u05e9\u05de\u05d5\u05e8 \u05d4\u05d2\u05d3\u05e8\u05d5\u05ea",
    "settings.test": "\u05d1\u05d3\u05d9\u05e7\u05ea \u05d7\u05d9\u05d1\u05d5\u05e8",
    "settings.pull": "\u05de\u05e9\u05d9\u05db\u05d4",
    "settings.push": "\u05d3\u05d7\u05d9\u05e4\u05d4",
    "settings.ownerPh": "your-github-username",
    "settings.repoPh": "med-tracker-data",

    "modal.day": "\u05d9\u05d5\u05dd",
    "modal.close": "\u05e1\u05d2\u05d9\u05e8\u05d4",
    "modal.done": "\u05e1\u05d9\u05d5\u05dd",

    "common.weekly": "\u05e9\u05d1\u05d5\u05e2\u05d9",
    "common.daily": "\u05d9\u05d5\u05de\u05d9",
    "common.morning": "\u05d1\u05d5\u05e7\u05e8",
    "common.evening": "\u05e2\u05e8\u05d1",
    "common.taken": "\u05e0\u05dc\u05e7\u05d7",
    "common.toTake": "\u05dc\u05e7\u05d7\u05ea",
    "common.today": "\u05d4\u05d9\u05d5\u05dd",
    "common.edit": "\u05e2\u05e8\u05d9\u05db\u05d4",
    "common.notDue": "\u05dc\u05d0 \u05e0\u05d3\u05e8\u05e9",
    "common.notDueToday": "\u05dc\u05d0 \u05e0\u05d3\u05e8\u05e9 \u05d4\u05d9\u05d5\u05dd",
    "common.nextDose": "\u05de\u05e0\u05d4 \u05d4\u05d1\u05d0\u05d4 {date}",
    "common.lastTaken": "\u05e0\u05dc\u05e7\u05d7 \u05dc\u05d0\u05d7\u05e8\u05d5\u05e0\u05d4: {when}",
    "common.lastNever": "\u05d8\u05e8\u05dd \u05e0\u05dc\u05e7\u05d7",
    "common.takenCount": "{n} \u05e0\u05dc\u05e7\u05d7\u05d5",
    "common.toTakeCount": "{n} \u05dc\u05e7\u05d7\u05ea",

    "pill.one": "{n} \u05db\u05d3\u05d5\u05e8",
    "pill.other": "{n} \u05db\u05d3\u05d5\u05e8\u05d9\u05dd",

    "sub.takenAt": "\u05e0\u05dc\u05e7\u05d7 {time}",
    "title.undoTaken": "\u05e0\u05dc\u05e7\u05d7 \u2014 \u05dc\u05d7\u05e5 \u05dc\u05d1\u05d9\u05d8\u05d5\u05dc",
    "title.markTaken": "\u05e1\u05de\u05df \u05db\u05e0\u05dc\u05e7\u05d7",

    "msg.noDoses": "\u05dc\u05d0 \u05de\u05ea\u05d5\u05db\u05e0\u05e0\u05d5\u05ea \u05de\u05e0\u05d5\u05ea \u05dc\u05d4\u05d9\u05d5\u05dd.",
    "msg.allDone": "\u05d4\u05db\u05dc \u05d1\u05d5\u05e6\u05e2 \u05dc\u05d4\u05d9\u05d5\u05dd \u2014 \u05db\u05dc \u05d4\u05db\u05d1\u05d5\u05d3!",
    "msg.toTake.one": "\u05e0\u05d5\u05ea\u05e8\u05d4 \u05dc\u05da \u05de\u05e0\u05d4 \u05d0\u05d7\u05ea \u05dc\u05d4\u05d9\u05d5\u05dd.",
    "msg.toTake.other": "\u05e0\u05d5\u05ea\u05e8\u05d5 \u05dc\u05da {n} \u05de\u05e0\u05d5\u05ea \u05dc\u05d4\u05d9\u05d5\u05dd.",
    "msg.almost.one": "\u05db\u05de\u05e2\u05d8 \u05e9\u05dd \u2014 \u05e0\u05d5\u05ea\u05e8\u05d4 \u05de\u05e0\u05d4 \u05d0\u05d7\u05ea.",
    "msg.almost.other": "\u05db\u05de\u05e2\u05d8 \u05e9\u05dd \u2014 \u05e0\u05d5\u05ea\u05e8\u05d5 {n} \u05de\u05e0\u05d5\u05ea.",

    "stats.dosesTaken.one": "\u05de\u05e0\u05d4 \u05d0\u05d7\u05ea \u05e0\u05dc\u05e7\u05d7\u05d4",
    "stats.dosesTaken.other": "{n} \u05de\u05e0\u05d5\u05ea \u05e0\u05dc\u05e7\u05d7\u05d5",
    "stats.over30": "{n}% \u05d1-30 \u05d4\u05d9\u05de\u05d9\u05dd \u05d4\u05d0\u05d7\u05e8\u05d5\u05e0\u05d9\u05dd",

    "week.editDay": "\u05e2\u05e8\u05d9\u05db\u05ea {name}",
    "history.col.day": "\u05d9\u05d5\u05dd",
    "history.col.date": "\u05ea\u05d0\u05e8\u05d9\u05da",
    "history.col.taken": "\u05e0\u05dc\u05e7\u05d7\u05d5",
    "history.col.toTake": "\u05dc\u05e7\u05d7\u05ea",
    "history.col.progress": "\u05d4\u05ea\u05e7\u05d3\u05de\u05d5\u05ea",
    "editor.editDay": "\u05e2\u05e8\u05d9\u05db\u05ea \u05d9\u05d5\u05dd",

    "notif.title": "\u05d6\u05de\u05df \u05dc{med} ({slot})",
    "notif.body.one": "\u05e7\u05d7 {n} \u05db\u05d3\u05d5\u05e8",
    "notif.body.other": "\u05e7\u05d7 {n} \u05db\u05d3\u05d5\u05e8\u05d9\u05dd",

    "rem.alertTitle": "\u05ea\u05d6\u05db\u05d5\u05e8\u05ea",
    "rem.alertSub": "\u05d6\u05de\u05df \u05dc\u05e7\u05d7\u05ea \u05d0\u05ea \u05d4\u05ea\u05e8\u05d5\u05e4\u05d4",
    "rem.stop": "\u05e2\u05e6\u05d5\u05e8 \u05e6\u05dc\u05d9\u05dc",
    "rem.markTaken": "\u05e1\u05de\u05df \u05db\u05e0\u05dc\u05e7\u05d7",

    "sync.settingsSaved": "\u05d4\u05d4\u05d2\u05d3\u05e8\u05d5\u05ea \u05e0\u05e9\u05de\u05e8\u05d5.",
    "sync.testing": "\u05d1\u05d5\u05d3\u05e7 \u05d7\u05d9\u05d1\u05d5\u05e8...",
    "sync.connectionOk": "\u05d4\u05d7\u05d9\u05d1\u05d5\u05e8 \u05ea\u05e7\u05d9\u05df \u2014 \u05d4\u05e7\u05d5\u05d1\u05e5 \u05e0\u05de\u05e6\u05d0.",
    "sync.noContent": "\u05d0\u05d9\u05df \u05ea\u05d5\u05db\u05df \u05d1\u05e7\u05d5\u05d1\u05e5.",
    "sync.pulling": "\u05de\u05d5\u05e9\u05da...",
    "sync.pulled": "\u05d4\u05e0\u05ea\u05d5\u05e0\u05d9\u05dd \u05e0\u05de\u05e9\u05db\u05d5 \u05de-GitHub.",
    "sync.pushing": "\u05d3\u05d5\u05d7\u05e3...",
    "sync.pushed": "\u05e0\u05d3\u05d7\u05e3 \u05dc-GitHub.",
    "sync.notifDesktop": "\u05d4\u05ea\u05e8\u05d0\u05d5\u05ea \u05d4\u05d5\u05e4\u05e2\u05dc\u05d5 (\u05d0\u05e4\u05dc\u05d9\u05e7\u05e6\u05d9\u05d9\u05ea \u05e9\u05d5\u05dc\u05d7\u05df \u05d4\u05e2\u05d1\u05d5\u05d3\u05d4).",
    "sync.notifUnsupported": "\u05d4\u05ea\u05e8\u05d0\u05d5\u05ea \u05d0\u05d9\u05e0\u05df \u05e0\u05ea\u05de\u05db\u05d5\u05ea \u05db\u05d0\u05df.",
    "sync.notifPermission": "\u05d4\u05e8\u05e9\u05d0\u05ea \u05d4\u05ea\u05e8\u05d0\u05d5\u05ea: {p}",
    "sync.error": "\u05e9\u05d2\u05d9\u05d0\u05d4: {msg}",
    "sync.pullError": "\u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1\u05de\u05e9\u05d9\u05db\u05d4: {msg}",
    "sync.pushError": "\u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1\u05d3\u05d7\u05d9\u05e4\u05d4: {msg}",
    "err.missingGithub": "\u05d7\u05e1\u05e8\u05d5\u05ea \u05d4\u05d2\u05d3\u05e8\u05d5\u05ea GitHub"
  }
};

const I18N_LANGS = ["en", "he"];

/* In-memory only (no browser storage). app.js calls initLang() at boot with
   the language stored in the synced tracker file. */
let I18N_LANG = "en";

function initLang(code){ if(code && I18N[code]) I18N_LANG = code; }

function getLang(){ return I18N_LANG; }

function isRTL(){ return I18N_LANG === "he"; }

function localeTag(){ return I18N_LANG === "he" ? "he-IL" : "en-GB"; }

function t(key, vars){
  const dict = I18N[I18N_LANG] || I18N.en;
  let s = dict[key];
  if(s == null) s = I18N.en[key];
  if(s == null) return key;
  if(vars){
    for(const k in vars){
      if(Object.prototype.hasOwnProperty.call(vars, k)){
        s = s.split("{" + k + "}").join(String(vars[k]));
      }
    }
  }
  return s;
}

/* Plural helper: tp("pill", 2) -> t("pill.other", {n:2}) */
function tp(base, n){
  return t(base + (n === 1 ? ".one" : ".other"), { n: n });
}

function applyLang(){
  const lang = I18N_LANG;
  const root = (typeof document !== "undefined") ? document.documentElement : null;
  if(typeof document !== "undefined" && "title" in document) document.title = t("app.title");
  if(root && root.setAttribute){
    root.setAttribute("lang", lang === "he" ? "he" : "en");
    root.setAttribute("dir", lang === "he" ? "rtl" : "ltr");
  }
  if(typeof document !== "undefined" && document.body && document.querySelectorAll){
    document.querySelectorAll("[data-i18n]").forEach(function(el){
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-title]").forEach(function(el){
      el.setAttribute("title", t(el.getAttribute("data-i18n-title")));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function(el){
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function(el){
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
    });
  }
}

function setLang(code){
  I18N_LANG = I18N[code] ? code : "en";
  applyLang();
  if(typeof onLangChange === "function"){ onLangChange(); }
}

/* Apply immediately (documentElement exists while parsing <head>) */
applyLang();
