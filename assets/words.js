/* =========================================================
   Wesh Words — moteur de vocabulaire
   (vérification des réponses, choix des mots, import/export)
   ========================================================= */
import { stripAccents } from "./app.js";

export const MAX_LEVEL = 5;
export const PER_DIRECTION = 10;
export const DAILY_GOAL = PER_DIRECTION * 2;

const ARTICLES_EN = /^(a|an|the|to|some)\s+/;
const ARTICLES_FR = /^(?:(?:de la|les|le|la|une|un|des|du|de|se)\s+|(?:de l'|l'|d'|s')\s*)/;
const ARTICLES_NL = /^(de|het|een|te)\s+/;

function baseNorm(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[“”«»"]/g, " ")
    .replace(/[.,!?;:…()\[\]{}]/g, " ")
    .replace(/[-–—_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function dropArticle(s, lang) {
  const re = lang === "en" ? ARTICLES_EN : lang === "nl" ? ARTICLES_NL : ARTICLES_FR;
  let prev;
  do { prev = s; s = s.replace(re, "").trim(); } while (s !== prev && s.length);
  return s;
}
/** Toutes les variantes acceptables d'une réponse attendue */
export function variants(expected, lang) {
  const raw = String(expected ?? "");
  const pieces = new Set([raw]);
  // version sans parenthèses + version avec leur contenu
  pieces.add(raw.replace(/\([^)]*\)/g, " "));
  pieces.add(raw.replace(/[()]/g, " "));
  const out = new Set();
  for (const p of pieces) {
    const parts = [p, ...p.split(/\s*[\/;|]\s*/)];
    if (lang === "fr") parts.push(...p.split(/\s*,\s*/));
    for (const q of parts) {
      const n = baseNorm(q);
      if (!n) continue;
      out.add(n);
      out.add(dropArticle(n, lang));
    }
  }
  out.delete("");
  return [...out];
}
/**
 * Vérifie une réponse.
 * @returns {{ok:boolean, accent:boolean}} accent=true si juste uniquement en ignorant les accents
 */
export function checkAnswer(expected, given, lang) {
  const g = baseNorm(given);
  if (!g) return { ok: false, accent: false };
  const gv = new Set([g, dropArticle(g, lang)]);
  const vs = variants(expected, lang);
  for (const v of vs) if (gv.has(v)) return { ok: true, accent: false };
  const noAcc = s => stripAccents(s).replace(/\s+/g, " ");
  const gva = new Set([...gv].map(noAcc));
  for (const v of vs) if (gva.has(noAcc(v))) return { ok: true, accent: true };
  // On ignore les espaces et les caractères spéciaux (tirets, apostrophes, ponctuation…)
  const sq = s => String(s).toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  const gs = new Set([...gv].map(sq));
  for (const v of vs) if (gs.has(sq(v))) return { ok: true, accent: false };
  const gsa = new Set([...gv].map(x => sq(stripAccents(x))));
  for (const v of vs) if (gsa.has(sq(stripAccents(v)))) return { ok: true, accent: true };
  return { ok: false, accent: false };
}

/* ---------------- Sélection intelligente ---------------- */
const LEVEL_WEIGHT = [12, 8, 5, 3, 1.6, 0.8];
export function wordWeight(w, today) {
  const lvl = Math.max(0, Math.min(MAX_LEVEL, w.level ?? 0));
  let wt = LEVEL_WEIGHT[lvl];
  const ko = w.ko || 0, ok = w.ok || 0;
  wt += Math.min(6, ko * 0.8) - Math.min(3, ok * 0.15);
  if (!w.seen) wt += 3;                         // jamais vu
  if (w.lastKo && w.lastKo === today) wt += 4;  // raté aujourd'hui
  return Math.max(0.3, wt);
}
/**
 * Choisit le prochain mot.
 * recent : ids des derniers mots posés (à éviter), retry : [{id, due}] mots ratés à reposer
 */
export function pickWord(words, { recent = [], retry = [], step = 0, today = "" } = {}) {
  if (!words.length) return null;
  const due = retry.find(r => r.due <= step && !recent.slice(-2).includes(r.id));
  if (due) {
    const w = words.find(x => x.id === due.id);
    if (w) return w;
  }
  const avoid = new Set(recent.slice(-Math.min(6, Math.max(0, words.length - 1))));
  const pool = words.filter(w => !avoid.has(w.id));
  const list = pool.length ? pool : words;
  const total = list.reduce((s, w) => s + wordWeight(w, today), 0);
  let r = Math.random() * total;
  for (const w of list) { r -= wordWeight(w, today); if (r <= 0) return w; }
  return list[list.length - 1];
}
export function nextDirection(session, last) {
  const a = session.frEn || 0, b = session.enFr || 0;
  if (a >= PER_DIRECTION && b >= PER_DIRECTION) return Math.random() < .5 ? "frEn" : "enFr";
  if (a >= PER_DIRECTION) return "enFr";
  if (b >= PER_DIRECTION) return "frEn";
  if (last === "frEn") return "enFr";
  if (last === "enFr") return "frEn";
  return Math.random() < .5 ? "frEn" : "enFr";
}

/* ---------------- Série ---------------- */
export function computeStreak(completedDays /* Set de 'YYYY-MM-DD' */, today, offsetFn) {
  let d = completedDays.has(today) ? today : offsetFn(today, -1);
  let n = 0;
  while (completedDays.has(d)) { n++; d = offsetFn(d, -1); }
  return n;
}

/* ---------------- Import ---------------- */
const HEADER_MAP = {
  fr: ["fr", "francais", "français", "french", "mot fr", "mot francais", "mot français"],
  en: ["en", "anglais", "english", "mot en", "mot anglais", "traduction"],
  cat: ["categorie", "catégorie", "theme", "thème", "category", "chapitre", "unite", "unité"],
  nature: ["nature", "type", "classe"],
  ex: ["examples", "example", "exemple", "exemples"],
  note: ["note", "notes", "remarque", "commentaire"],
  irr: ["irregular", "irrégulier", "irregulier"],
  conj: ["conjugation", "conjugaison", "formes"]
};
function keyOf(h) {
  const n = stripAccents(String(h || "").trim().toLowerCase());
  for (const [k, list] of Object.entries(HEADER_MAP)) if (list.map(x => stripAccents(x)).includes(n)) return k;
  return null;
}
const JUNK_EXAMPLE = /^(This is an? .+\.|I .+ it every day\.)$/;
export function cleanRow(o) {
  const w = {
    fr: String(o.fr ?? "").trim(), en: String(o.en ?? "").trim(),
    cat: String(o.cat ?? "").trim(), nature: String(o.nature ?? "").trim(),
    ex: String(o.ex ?? "").trim(), note: String(o.note ?? "").replace(/Source : PDF « [^»]*»/g, "").replace(/^\s*\|\s*|\s*\|\s*$/g, "").trim(),
    irr: /^(oui|yes|true|1|x)$/i.test(String(o.irr ?? "").trim()), conj: String(o.conj ?? "").trim()
  };
  if (JUNK_EXAMPLE.test(w.ex)) w.ex = "";
  return w;
}
/** Lit un fichier .xlsx / .xls / .csv → [{fr,en,cat,...}] (nécessite SheetJS global XLSX) */
export async function parseVocabFile(file) {
  if (!window.XLSX) throw new Error("Module Excel non chargé (connexion internet requise).");
  const buf = await file.arrayBuffer();
  const wb = window.XLSX.read(buf, { type: "array" });
  // Feuille « Vocabulaire » si elle existe, sinon la première
  const name = wb.SheetNames.find(n => /vocab/i.test(n)) || wb.SheetNames[0];
  const rows = window.XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, defval: "" });
  if (!rows.length) return [];
  const head = rows[0].map(keyOf);
  let start = 1, map = head;
  if (!head.includes("fr") || !head.includes("en")) { map = ["fr", "en", "cat", "nature", "ex", "note"]; start = head.some(Boolean) ? 1 : 0; }
  const out = [];
  for (let i = start; i < rows.length; i++) {
    const o = {};
    rows[i].forEach((v, j) => { if (map[j]) o[map[j]] = v; });
    const w = cleanRow(o);
    if (w.fr && w.en) out.push(w);
  }
  return out;
}
/* ---------- Import en 2 temps : lecture brute puis choix des colonnes (V02-001) ---------- */
export const IMPORT_FIELDS = [
  ["", "— ignorer —"], ["fr", "🇫🇷 Français"], ["en", "🇬🇧 Anglais"], ["cat", "Catégorie / thème"],
  ["nature", "Nature"], ["ex", "Exemple"], ["note", "Note"], ["conj", "Formes (verbe irrégulier)"], ["irr", "Irrégulier (oui/non)"]
];
/** Mêmes colonnes, libellé « Néerlandais » à la place d'« Anglais » (V03-002) */
export const IMPORT_FIELDS_NL = IMPORT_FIELDS.map(([v, l]) => v === "en" ? ["en", "🇳🇱 Néerlandais"] : [v, l]);
/** Lit la 1re feuille « vocab » (ou la 1re) et renvoie les lignes brutes */
export async function readSheet(file) {
  if (!window.XLSX) throw new Error("Module Excel non chargé (connexion internet requise).");
  const wb = window.XLSX.read(await file.arrayBuffer(), { type: "array" });
  const name = wb.SheetNames.find(n => /vocab/i.test(n)) || wb.SheetNames[0];
  const rows = window.XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, defval: "" })
    .filter(r => r.some(c => String(c).trim() !== ""));
  return { rows, sheet: name, sheets: wb.SheetNames };
}
/** Devine le rôle de chaque colonne à partir de la ligne de titres */
export function guessMapping(rows) {
  const head = (rows[0] || []).map(keyOf);
  const hasHeader = head.filter(Boolean).length >= 2;
  const n = Math.max(...rows.slice(0, 20).map(r => r.length), 0);
  let map = hasHeader ? Array.from({ length: n }, (_, i) => head[i] || "") : Array.from({ length: n }, (_, i) => ["fr", "en", "cat", "nature", "ex", "note"][i] || "");
  return { map, hasHeader };
}
export function rowsFromMapping(rows, map, hasHeader) {
  const out = [];
  for (let i = hasHeader ? 1 : 0; i < rows.length; i++) {
    const o = {};
    rows[i].forEach((v, j) => { if (map[j]) o[map[j]] = v; });
    const w = cleanRow(o);
    if (w.fr && w.en) out.push(w);
  }
  return out;
}
export function dupKey(w) {
  return baseNorm(stripAccents(w.fr)) + "|" + baseNorm(stripAccents(w.en));
}
export function exportVocab(words, filename = "WeshWords-vocabulaire.xlsx") {
  if (!window.XLSX) throw new Error("Module Excel non chargé.");
  const data = words.map(w => ({
    categorie: w.cat || "", fr: w.fr, en: w.en, nature: w.nature || "", examples: w.ex || "",
    note: w.note || "", irregular: w.irr ? "oui" : "non", conjugation: w.conj || "",
    niveau: w.level ?? 0, reussites: w.ok || 0, erreurs: w.ko || 0
  }));
  const ws = window.XLSX.utils.json_to_sheet(data);
  ws["!cols"] = [{ wch: 22 }, { wch: 30 }, { wch: 30 }, { wch: 16 }, { wch: 34 }, { wch: 20 }, { wch: 9 }, { wch: 30 }, { wch: 7 }, { wch: 9 }, { wch: 8 }];
  const wb = window.XLSX.utils.book_new();
  window.XLSX.utils.book_append_sheet(wb, ws, "Vocabulaire");
  window.XLSX.writeFile(wb, filename);
}

/* ---------------- Prononciation (en-GB de préférence) ---------------- */
let _voice = null;
function pickVoice() {
  if (!("speechSynthesis" in window)) return null;
  const vs = speechSynthesis.getVoices();
  return vs.find(v => v.lang === "en-GB") || vs.find(v => /^en[-_]GB/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
}
if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => { _voice = pickVoice(); };
export function speak(text, lang = "en-GB", rate = 0.92) {
  if (!("speechSynthesis" in window) || !text) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(String(text).replace(/\s*\/\s*/g, ", "));
  if (lang.startsWith("en")) { _voice = _voice || pickVoice(); if (_voice) u.voice = _voice; u.lang = "en-GB"; }
  else if (lang.startsWith("nl")) u.lang = "nl-NL";
  else u.lang = "fr-FR";
  u.rate = rate;
  speechSynthesis.speak(u);
}

/* ---------------- Aides : indice, QCM, thèmes (V01-002) ---------------- */
/** Première variante lisible d'une réponse (avant « / », sans parenthèses) */
export function mainAnswer(expected) {
  return String(expected ?? "").split(/\s*\/\s*/)[0].replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
}
export function wordCount(expected) {
  return mainAnswer(expected).split(/\s+/).filter(Boolean).length;
}
export function isLong(expected, minWords = 4) {
  return wordCount(expected) >= minWords;
}
/** Indice : 1re lettre de chaque mot + tirets, ex. « d _ _ _   g _ _ _ _ » */
export function hintPattern(expected) {
  const txt = mainAnswer(expected);
  const parts = txt.split(/\s+/).filter(Boolean);
  const letters = [];
  const pattern = parts.map(p => {
    let first = true, n = 0;
    const out = [...p].map(ch => {
      if (/[\p{L}\p{N}]/u.test(ch)) { n++; if (first) { first = false; return ch; } return "_"; }
      first = true; // nouvelle partie après un trait d'union ou une apostrophe
      return ch;
    }).join(" ");
    letters.push(n);
    return out;
  }).join("     ");
  return { pattern, letters };
}
/** Construit un QCM (bonne réponse + jusqu'à 3 intrus proches) */
export function buildChoices(word, dir, pool, n = 4) {
  const field = dir === "frEn" ? "en" : "fr";
  const promptField = dir === "frEn" ? "fr" : "en";
  const norm = s => baseNorm(stripAccents(s));
  const correct = word[field];
  const bad = new Set([norm(correct)]);
  pool.filter(x => norm(x[promptField]) === norm(word[promptField])).forEach(x => bad.add(norm(x[field])));
  const wc = wordCount(correct);
  const cands = pool.filter(x => x.id !== word.id && x[field] && !bad.has(norm(x[field])))
    .map(x => ({ x, s: (x.cat && x.cat === word.cat ? 2 : 0) + (Math.abs(wordCount(x[field]) - wc) <= 1 ? 1.5 : 0) + (x.nature && x.nature === word.nature ? 1 : 0) + Math.random() * 1.2 }))
    .sort((a, b) => b.s - a.s);
  const picked = [], seen = new Set();
  for (const c of cands) {
    const k = norm(c.x[field]);
    if (seen.has(k)) continue;
    seen.add(k); picked.push(c.x[field]);
    if (picked.length >= n - 1) break;
  }
  const list = [{ text: correct, correct: true }, ...picked.map(t => ({ text: t, correct: false }))];
  for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
  return list;
}
export const DEFAULT_SETTINGS = { hints: true, autoQcm: true, qcmMinWords: 4, themes: [], themesLocked: false, themesUntil: "", childThemes: [] };
/** Thèmes actifs : imposés par le parent (jusqu'à une date éventuelle) sinon choisis par l'élève */
export function activeThemes(settings, today) {
  const s = { ...DEFAULT_SETTINGS, ...(settings || {}) };
  if (s.themesLocked && s.themes.length && (!s.themesUntil || today <= s.themesUntil)) return { list: s.themes, locked: true, until: s.themesUntil };
  return { list: s.childThemes || [], locked: false, until: "" };
}
export function filterByThemes(words, list) {
  if (!list || !list.length) return words;
  const set = new Set(list);
  const f = words.filter(w => set.has(w.cat || ""));
  return f.length ? f : words;
}
export function categoriesOf(words) {
  const m = new Map();
  words.forEach(w => { const c = w.cat || ""; m.set(c, (m.get(c) || 0) + 1); });
  return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([cat, count]) => ({ cat, count }));
}

/* ---------------- Verbes irréguliers (V01-006) ---------------- */
/** « be — was/were — been » → ["be", "was/were", "been"] (null si pas 3 formes) */
export function parseForms(conj) {
  const parts = String(conj || "").split(/\s+[—–-]\s+|\s*[—–]\s*/).map(x => x.trim()).filter(Boolean);
  return parts.length === 3 ? parts : null;
}
/** Regroupe les mots par verbe irrégulier (une entrée par base verbale) */
export function irregularVerbs(words, findIrr) {
  const map = new Map();
  for (const w of words) {
    let f = parseForms(w.conj);
    if (!f && findIrr) { const v = findIrr(w.en, w.nature); if (v) f = [v[0], v[1], v[2]]; }
    if (!f) continue;
    const key = f[0].toLowerCase();
    const cur = map.get(key);
    // on garde comme « porteur » le mot au français le plus court (ex. « être » plutôt que « être bon en »)
    if (!cur) map.set(key, { key, forms: f, word: w, meanings: [w.fr] });
    else {
      if (!cur.meanings.includes(w.fr)) cur.meanings.push(w.fr);
      if ((w.fr || "").length < (cur.word.fr || "").length) cur.word = w;
    }
  }
  return [...map.values()].sort((a, b) => a.key.localeCompare(b.key));
}
