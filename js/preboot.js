/* Runs in <head> before the body is parsed/painted, so the correct language,
   text direction and theme are applied with no visible English flash.
   Desktop: language/theme come synchronously from the data files.
   Web: they come from a UI-only hint (URL hash / localStorage) - never data. */
(function () {
  var lang = "en", theme = "light";

  function parse(text) {
    try { return JSON.parse(String(text || "").replace(/^\uFEFF/, "")) || {}; } catch (e) { return {}; }
  }

  try {
    if (window.electronAPI && window.electronAPI.loadStore) {
      var res = window.electronAPI.loadStore() || {};
      var tracker = parse(res.tracker);
      var config = parse(res.config);
      if (tracker.settings && tracker.settings.language) lang = tracker.settings.language;
      if (config.theme) theme = config.theme;
    } else {
      try {
        var h = (location.hash || "").replace(/^#/, "");
        var m = h.match(/(?:^|&)lang=([^&]+)/);
        if (m) lang = decodeURIComponent(m[1]);
        else { var l = localStorage.getItem("mt.lang"); if (l) lang = l; }
      } catch (e) {}
      try { var t = localStorage.getItem("mt.theme"); if (t) theme = th; } catch (e) {}
    }
  } catch (e) {}

  var root = document.documentElement;
  if (lang !== "he") lang = "en";
  if (theme !== "dark") theme = "light";
  root.setAttribute("lang", lang);
  root.setAttribute("dir", lang === "he" ? "rtl" : "ltr");
  root.setAttribute("data-theme", theme);
  if (typeof initLang === "function") { try { initLang(lang); } catch (e) {} }
  if (typeof applyLang === "function") { try { applyLang(); } catch (e) {} }
})();
