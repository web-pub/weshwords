/* =========================================================
   Wesh Words — photo du cours → vocabulaire (V01-007)
   Reconnaissance de texte dans le navigateur (Tesseract.js),
   aucune image n'est envoyée à un serveur ni enregistrée.
   ========================================================= */
const TESS_VERSION = "5.1.1";
const TESS_JS = `https://cdn.jsdelivr.net/npm/tesseract.js@${TESS_VERSION}/dist/tesseract.min.js`;
const TESS_WORKER = `https://cdn.jsdelivr.net/npm/tesseract.js@${TESS_VERSION}/dist/worker.min.js`;
const TESS_CORE = `https://cdn.jsdelivr.net/npm/tesseract.js-core@${TESS_VERSION}`;

let loading = null;
function loadTesseract() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  if (loading) return loading;
  loading = new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = TESS_JS; s.async = true;
    s.onload = () => window.Tesseract ? res(window.Tesseract) : rej(new Error("Tesseract indisponible"));
    s.onerror = () => { loading = null; rej(new Error("Impossible de charger le module de lecture (connexion internet requise).")); };
    document.head.appendChild(s);
  });
  return loading;
}

/** Réduit, passe en niveaux de gris et renforce le contraste pour aider la lecture */
async function prepare(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error("Image illisible")); i.src = url; });
    const max = 2400, k = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0, c.width, c.height);
    const d = g.getImageData(0, 0, c.width, c.height), p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      let y = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2];
      y = Math.max(0, Math.min(255, (y - 128) * 1.35 + 128)); // contraste
      p[i] = p[i + 1] = p[i + 2] = y;
    }
    g.putImageData(d, 0, 0);
    return c;
  } finally { URL.revokeObjectURL(url); }
}

/**
 * Lit le texte d'une ou plusieurs photos.
 * onProgress(pct, label) est appelé pendant le traitement.
 */
export async function ocrImages(files, onProgress = () => {}) {
  const T = await loadTesseract();
  let cur = 0;
  const worker = await T.createWorker(["fra", "eng"], 1, {
    workerPath: TESS_WORKER, corePath: TESS_CORE,
    logger: m => {
      if (m.status === "recognizing text") onProgress(Math.round(((cur + m.progress) / files.length) * 100), "Lecture du texte");
      else onProgress(null, m.status === "loading language traineddata" ? "Chargement du dictionnaire (1re fois : quelques secondes)" : "Préparation");
    }
  });
  try {
    const texts = [];
    for (cur = 0; cur < files.length; cur++) {
      const canvas = await prepare(files[cur]);
      const { data } = await worker.recognize(canvas);
      texts.push(data.text || "");
    }
    return texts.join("\n");
  } finally { await worker.terminate(); }
}

/* ---------------- Découpage du texte en paires FR / EN ---------------- */
const FR_START = /^(le|la|les|l'|un|une|des|du|de|d'|se|s'|au|aux)\b/i;
const EN_START = /^(to|a|an|the)\s/i;
function englishness(s) {
  const t = " " + s.toLowerCase() + " ";
  let en = 0, fr = 0;
  if (EN_START.test(s.trim())) en += 3;
  if (FR_START.test(s.trim())) fr += 2.5;
  fr += (s.match(/[éèêëàâùûçôîïœ]/gi) || []).length * 2;
  if (/ (and|of|the|with|my|your|is|are|it|you|at|in|on) /.test(t)) en += 1;
  if (/ (et|de|du|des|avec|mon|ma|mes|est|sont|pour|dans|sur|à) /.test(t)) fr += 1;
  if (/ing\b/.test(t)) en += 1;
  if (/(th|w|k|sh|ght)/.test(t)) en += 0.4;
  if (/(eau|oux|ais|ée|tion\b)/.test(t)) fr += 0.6;
  return en - fr;
}
function clean(line) {
  return line
    .replace(/[|¦]/g, " | ")
    .replace(/^[\s•·*▪►✓✔\-–—]+/, "")
    .replace(/^\(?\d{1,3}[.)\]]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
}
function split2(line) {
  const seps = [/\s*=\s*/, /\s*:\s*/, /\s*(?:→|->|=>|>)\s*/, /\s*\|\s*/, /\s+[–—-]\s+/, /\t+/, /\s{2,}/];
  for (const re of seps) {
    const parts = line.split(re).map(x => x.trim()).filter(Boolean);
    if (parts.length === 2) return parts;
  }
  return null;
}
/**
 * texte brut → { rows:[{fr, en, sure}], skipped:[lignes non comprises] }
 * Le sens (français à gauche ou à droite) est deviné ligne par ligne, puis
 * la majorité tranche pour les lignes ambiguës.
 */
export function parseOcrText(text) {
  const raw = String(text || "").split(/\r?\n/);
  const pairs = [], skipped = [];
  for (const r0 of raw) {
    // on garde les tabulations / grands espaces avant nettoyage pour le découpage en colonnes
    const cols = r0.replace(/^[\s•·*▪►✓✔\-–—]+/, "").replace(/^\(?\d{1,3}[.)\]]\s*/, "").trim();
    if (!cols || !/[a-zà-ÿ]{2,}/i.test(cols)) continue;
    if (/^(unit|lesson|chapter|chapitre|le[çc]on|page|p\.|vocabulary|vocabulaire|voc|th[èe]me|date)\b/i.test(cols)) { skipped.push(clean(r0)); continue; }
    const p = split2(cols) || split2(clean(r0));
    if (!p) { if (clean(r0).length > 2) skipped.push(clean(r0)); continue; }
    const [a, b] = p.map(x => x.replace(/\s+/g, " ").replace(/[.;,]+$/, "").trim());
    if (a.length < 1 || b.length < 1 || a.length > 80 || b.length > 80) { skipped.push(clean(r0)); continue; }
    pairs.push({ a, b, d: englishness(b) - englishness(a) });
  }
  const vote = pairs.reduce((s, x) => s + Math.sign(x.d), 0); // > 0 : l'anglais est à droite
  const rows = pairs.map(x => {
    const enRight = x.d > 0 || (x.d === 0 && vote >= 0);
    return { fr: enRight ? x.a : x.b, en: enRight ? x.b : x.a, sure: x.d !== 0 };
  });
  return { rows, skipped };
}
