class ClassList {
  constructor() { this.set = new Set(); }
  add(c) { this.set.add(c); }
  remove(c) { this.set.delete(c); }
  toggle(c, on) { if (on === undefined) { this.set.has(c) ? this.set.delete(c) : this.set.add(c); } else if (on) this.set.add(c); else this.set.delete(c); }
  contains(c) { return this.set.has(c); }
}
class El {
  constructor(tag) {
    this.tagName = (tag || 'div').toUpperCase();
    this.children = [];
    this.classList = new ClassList();
    this.attributes = {};
    this._innerHTML = '';
    this.textContent = '';
    this.value = '';
    this.checked = false;
    this.listeners = {};
  }
  set innerHTML(v) { this._innerHTML = String(v); this.children = []; }
  get innerHTML() { return this._innerHTML; }
  appendChild(c) { this.children.push(c); return c; }
  setAttribute(k, v) { this.attributes[k] = v; }
  getAttribute(k) { return this.attributes[k]; }
  addEventListener(type, fn) { (this.listeners[type] = this.listeners[type] || []).push(fn); }
  click() { (this.listeners.click || []).forEach(fn => fn({ target: this })); }
  closest() { return null; }
  querySelectorAll() { return []; }
}

const registry = {};
function getEl(sel) {
  if (!registry[sel]) registry[sel] = new El('div');
  return registry[sel];
}

const store = {};
global.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; }
};
global.document = {
  documentElement: (function () {
    const attrs = {};
    return {
      setAttribute: (k, v) => { attrs[k] = String(v); },
      getAttribute: (k) => (k in attrs ? attrs[k] : null)
    };
  })(),
  querySelector: (sel) => getEl(sel),
  querySelectorAll: () => [],
  createElement: (t) => new El(t)
};
global.navigator = {};

// Mock the Electron file store (tracker.json + config.json) so the app uses
// the real file-backed path instead of browser storage.
const fileStore = { tracker: '', config: '' };
global.window = {
  electronAPI: {
    isElectron: true,
    loadStore: () => ({ tracker: fileStore.tracker, config: fileStore.config }),
    saveTracker: (t) => { fileStore.tracker = String(t); },
    saveConfig: (c) => { fileStore.config = String(c); },
    notify: () => {}
  },
  addEventListener: () => {}
};
global.fetch = async () => { throw new Error('no network in test'); };
global.setInterval = () => 0;
global.clearInterval = () => {};

const src = require('fs').readFileSync('js/i18n.js', 'utf8');
const vm = require('vm');
vm.runInThisContext(src, { filename: 'i18n.js' });
const src2 = require('fs').readFileSync('js/app.js', 'utf8');
vm.runInThisContext(src2, { filename: 'app.js' });

const scheduleList = getEl('#scheduleList');
const stats = getEl('#stats');
const history = getEl('#history');

function count(html, re) { return (html.match(re) || []).length; }
function assert(cond, msg) { if (!cond) { console.log('FAIL:', msg); process.exitCode = 1; } else { console.log('PASS:', msg); } }

const day = new Date().getDay();
const isSunday = day === 0;
const dueToday = isSunday ? 3 : 2;   // doses actually due today

// layout: weekly box on top + one daily box, all toggles
assert(count(scheduleList.innerHTML, /class="card med-box/g) === (isSunday ? 2 : 2), 'shows weekly + daily medication boxes');
assert(scheduleList.innerHTML.includes('med-tag weekly'), 'has a weekly box');
assert(scheduleList.innerHTML.includes('med-tag daily'), 'has a daily box');
assert(scheduleList.innerHTML.indexOf('med-tag daily') < scheduleList.innerHTML.indexOf('med-tag weekly'), 'daily box sits above the weekly box');
assert(count(scheduleList.innerHTML, /class="toggle-taken/g) === dueToday, 'one toggle per due dose');
assert(count(scheduleList.innerHTML, /class="dose-row notdue"/g) === (isSunday ? 0 : 1), 'weekly row is not-due on non-Sundays');

const _n = new Date();
const today = _n.getFullYear() + '-' + String(_n.getMonth() + 1).padStart(2, '0') + '-' + String(_n.getDate()).padStart(2, '0');

// progress ring + counts are combined into the daily med box
assert(scheduleList.innerHTML.includes('med-ring'), 'daily box shows a progress ring');
assert(scheduleList.innerHTML.includes('ring-label sm'), 'ring shows a percent label');
assert(scheduleList.innerHTML.includes('0 taken'), 'daily box shows taken count');
assert(scheduleList.innerHTML.includes('to take'), 'daily box shows to-take count');
assert(scheduleList.innerHTML.includes('med-date'), 'date is shown inside the daily box');
assert(scheduleList.innerHTML.includes('today-weekday'), 'date line includes the weekday');
assert(scheduleList.innerHTML.includes('med-last'), 'weekly box has a last-taken line');
assert(scheduleList.innerHTML.includes('Not taken yet'), 'weekly shows not-taken-yet before any dose');
assert(!scheduleList.innerHTML.includes('missed'), 'no missed anywhere on the today tab');

// marking (single toggle)
setTaken(today, 'm-am', true);
assert(state.data[today]['m-am'].taken === true, 'm-am marked taken');
assert(!('missed' in state.data[today]['m-am']), 'no missed field is stored');

// re-render reflects taken state
assert(count(scheduleList.innerHTML, /toggle-taken on/g) >= 1, 'an "on" (Taken) toggle is shown');

// stats (no missed)
assert(/dose/.test(stats.innerHTML), 'stats shows doses taken');
assert(!stats.innerHTML.includes('missed'), 'stats no longer mentions missed');

// history
assert(count(history.innerHTML, /<td class="c-day"/g) > 0, 'history tab renders rows');
assert(history.innerHTML.includes('Today'), 'history first row is Today');
assert(!history.innerHTML.includes('Missed'), 'history table has no Missed column');

// main-tab 7-day week strip is always present
const historyMain = getEl('#historyMain');
assert(count(historyMain.innerHTML, /class="week-day/g) === 7, 'main tab shows 7-day week strip');
assert(historyMain.innerHTML.includes('Today'), 'week strip includes Today');
assert(historyMain.innerHTML.includes('wd-ring'), 'week strip has progress rings');

// persistence
assert(fileStore.tracker && JSON.parse(fileStore.tracker).data[today]['m-am'].taken, 'saved to the tracker file');

// editing a past day (retroactively)
const pastKey = '2026-01-05'; // a Monday
setTaken(pastKey, 'm-am', true);
assert(state.data[pastKey] && state.data[pastKey]['m-am'].taken === true, 'can mark a dose on a past day');
const pe = entriesForKey(pastKey);
assert(pe.length === 2, 'past Monday has 2 due doses');
assert(!pe.some(e => e.id === 'med-sun'), 'weekly med not due on a past Monday');
const peSun = entriesForKey('2026-01-04'); // a Sunday
assert(peSun.length === 3, 'past Sunday has 3 due doses');

// toggling off
toggleTaken(pastKey, 'm-am'); // was taken -> clears
assert(!(state.data[pastKey] && state.data[pastKey]['m-am']), 're-clicking Taken clears it');
toggleTaken(pastKey, 'm-am');
assert(state.data[pastKey]['m-am'].taken === true, 'toggling from empty sets taken');
setTaken(pastKey, 'm-am', false);
assert(!(state.data[pastKey] && state.data[pastKey]['m-am']), 'setTaken(false) clears the entry');

// day editor opens and lists meds
openDayEditor(pastKey);
const edBody = getEl('#dayEditorBody');
assert(edBody.innerHTML.includes('Madison'), 'day editor lists the meds for that day');
assert(edBody.innerHTML.includes('toggle-taken'), 'day editor has toggles');
closeDayEditor();

// weekly schedule
const sunday = new Date('2026-01-04T12:00:00'); // a Sunday
assert(getEntriesForDay(sunday).length === 3, 'Sunday has 3 doses due (2 Madison + 1 Medsion)');
const monday = new Date('2026-01-05T12:00:00');
assert(getEntriesForDay(monday).length === 2, 'Monday has 2 doses due (dailies only)');

// weekly med always visible, flagged not due on Monday
const monAll = getAllEntriesForDay(monday);
assert(monAll.length === 3, 'all medications are listed on Monday');
assert(monAll.filter(e => e.type === 'weekly' && e.dueToday === false).length === 1, 'weekly med flagged not due on Monday');
const sunAll = getAllEntriesForDay(sunday);
assert(sunAll.filter(e => e.type === 'weekly' && e.dueToday === true).length === 1, 'weekly med flagged due on Sunday');

// next due date for the weekly med from a Monday should be the coming Sunday
const nd = nextDueDate(monAll.find(e => e.type === 'weekly'), monday);
assert(nd.getDay() === 0 && nd.getDate() === 11, 'next weekly dose from Mon Jan 5 is Sun Jan 11');

// reminders
assert(state.settings.remindersEnabled === false, 'reminders default off');

// theme default is light
assert(getStoredTheme() === 'light', 'default theme is light');
toggleTheme();
assert(currentTheme() === 'dark', 'toggleTheme switches to dark');
toggleTheme();
assert(currentTheme() === 'light', 'toggleTheme switches back to light');

// ===================== weekly last-taken =====================
setTaken('2026-01-04', 'med-sun', true); // Sunday Jan 4
assert(lastTakenFor('med-sun') && lastTakenFor('med-sun').key === '2026-01-04', 'last taken tracks the weekly dose');
assert(scheduleList.innerHTML.includes('med-last'), 'weekly box still shows the last-taken line');
assert(scheduleList.innerHTML.includes('Last taken:'), 'last-taken label shown (English)');

// ===================== i18n =====================
assert(getLang() === 'en', 'default language is English');
assert(t('nav.today') === 'Today', 'English nav.today');
assert(t('common.takenCount', { n: 3 }) === '3 taken', 'interpolates {n}');
assert(tp('pill', 1) === '1 pill', 'plural forms: singular');
assert(tp('pill', 2) === '2 pills', 'plural forms: plural');

setLang('he');
assert(getLang() === 'he', 'setLang switches to Hebrew');
assert(document.documentElement.getAttribute('dir') === 'rtl', 'Hebrew sets dir=rtl');
assert(document.documentElement.getAttribute('lang') === 'he', 'Hebrew sets lang=he');
assert(t('nav.today') === '\u05d4\u05d9\u05d5\u05dd', 'Hebrew nav.today');
assert(scheduleList.innerHTML.includes('\u05dc\u05e7\u05d7\u05ea'), 'Hebrew toggle label rendered');
assert(scheduleList.innerHTML.includes('\u05e0\u05dc\u05e7\u05d7\u05d5'), 'Hebrew taken count rendered');
assert(!scheduleList.innerHTML.includes('To take'), 'no English "To take" in the Hebrew box');
assert(!scheduleList.innerHTML.includes('Mark as taken'), 'no English toggle title in the Hebrew box');
assert(scheduleList.innerHTML.includes('\u05e1\u05de\u05df \u05db\u05e0\u05dc\u05e7\u05d7'), 'Hebrew toggle title rendered');
assert(t('app.title') === '\u05de\u05e2\u05e7\u05d1 \u05ea\u05e8\u05d5\u05e4\u05d5\u05ea', 'Hebrew app title');
assert(displayMed('Madison') === '\u05ea\u05e8\u05d5\u05e4\u05d5\u05ea', 'Hebrew med name resolves');
assert(scheduleList.innerHTML.includes('\u05ea\u05e8\u05d5\u05e4\u05d5\u05ea'), 'Hebrew med name rendered');
assert(displayMed('SomeOther') === 'SomeOther', 'unknown med name falls back to itself');
assert(scheduleList.innerHTML.includes('\u05e0\u05dc\u05e7\u05d7 \u05dc\u05d0\u05d7\u05e8\u05d5\u05e0\u05d4'), 'Hebrew last-taken label rendered');

setLang('en');
assert(getLang() === 'en', 'setLang switches back to English');
assert(document.documentElement.getAttribute('dir') === 'ltr', 'English sets dir=ltr');
assert(t('nav.today') === 'Today', 'English restored');

console.log('done');
