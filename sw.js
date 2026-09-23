/* Wesh Words — service worker (V01-007)
   Réseau d'abord pour les pages, cache en secours → l'app s'ouvre même hors connexion.
   Les données Firestore ont leur propre cache hors connexion (IndexedDB). */
const CACHE = "weshwords-V01-007";
const CORE = [
  "./", "index.html", "connexion.html", "eleve.html", "parent.html", "admin.html", "legal.html", "diagnostic.html",
  "manifest.webmanifest",
  "assets/style.css", "assets/app.js", "assets/content.js", "assets/words.js", "assets/member-form.js",
  "assets/connexion.js", "assets/eleve.js", "assets/parent.js", "assets/admin.js", "assets/badges.js", "assets/practice.js", "assets/ocr.js", "assets/diagnostic.js",
  "favicon.ico", "assets/favicon-32.png", "assets/icon-192.png", "assets/icon-512.png", "assets/logo-160.webp",
  "assets/margaux-joyeuse.webp", "assets/margaux-colere.webp", "assets/margaux-reflechie.webp", "assets/margaux-sure.webp",
  "assets/margaux-malicieuse.webp", "assets/scene-ensemble.webp", "assets/scene-bravo.webp", "assets/scene-rate.webp"
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
