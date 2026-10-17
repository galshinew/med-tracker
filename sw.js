const CACHE = "meds-v16";
const ASSETS = ["./", "./index.html", "./css/style.css", "./js/i18n.js", "./js/preboot.js", "./js/app.js", "./manifest.json", "./public/audio/reminder.mp3"];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(ASSETS.map(async (a) => {
      try { const res = await fetch(a, { cache: "no-store" }); await cache.put(a, res); } catch (err) {}
    }));
  })());
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
    // Force every open page to reload so it picks up the new version immediately.
    const clients = await self.clients.matchAll({ type: "window" });
    clients.forEach(c => { try { c.navigate(c.url); } catch (err) {} });
  })());
});

self.addEventListener("fetch", e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return; // pass API/other through to network
  // Network-first, bypassing the browser HTTP cache, then fall back to cache offline.
  e.respondWith(
    fetch(req, { cache: "no-store" }).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(req))
  );
});
