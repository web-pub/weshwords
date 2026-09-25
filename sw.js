/* Wesh Words — service worker (V03-002)
   Réseau d'abord pour les pages, cache en secours → l'app s'ouvre même hors connexion.
   Les données Firestore ont leur propre cache hors connexion (IndexedDB). */
const CACHE = "weshwords-V03-002";
const CORE = [
  "./", "index.html", "connexion.html", "eleve.html", "parent.html", "admin.html", "legal.html", "diagnostic.html",
  "manifest.webmanifest",
  "assets/style.css", "assets/app.js", "assets/content.js", "assets/words.js", "assets/member-form.js",
  "assets/connexion.js", "assets/eleve.js", "assets/parent.js", "assets/admin.js", "assets/badges.js", "assets/practice.js", "assets/ocr.js", "assets/fixes.js", "assets/diagnostic.js",
  "assets/irregular-verbs.js", "assets/irregular-verbs-nl.js", "assets/vocab-check.js", "assets/rewards.js", "assets/ce1d.js", "assets/ce1d-util.js", "assets/ce1d-ui.js", "assets/ce1d-math.js", "assets/ce1d-francais.js", "assets/ce1d-sciences.js", "assets/ce1d-langues.js",
  "assets/puzzle-1.webp", "assets/puzzle-2.webp", "assets/puzzle-3.webp", "assets/puzzle-4.webp", "assets/puzzle-5.webp", "assets/puzzle-6.webp", "assets/puzzle-7.webp",
  "favicon.ico", "assets/favicon-32.png", "assets/icon-192.png", "assets/icon-512.png", "assets/logo-160.webp", "assets/hl-logo-128.webp",
  "assets/margaux-joyeuse.webp", "assets/margaux-colere.webp", "assets/margaux-reflechie.webp", "assets/margaux-sure.webp",
  "assets/margaux-malicieuse.webp", "assets/margaux-sixseven.gif", "assets/scene-ensemble.webp", "assets/scene-bravo.webp", "assets/scene-rate.webp"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const cdn = /gstatic\.com\/firebasejs|fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net\/npm\/(?!tesseract|@tesseract)|cdn\.sheetjs\.com/.test(url.href);
  if (!sameOrigin && !cdn) return; // Firestore / Auth : jamais interceptés
  e.respondWith(
    fetch(req).then(res => {
      if (res && (res.ok || res.type === "opaque")) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: sameOrigin && req.mode === "navigate" }))
  );
});
