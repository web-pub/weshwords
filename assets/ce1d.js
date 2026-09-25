/* =========================================================
   Wesh Words — Préparation CE1D (V02-001)
   Moteur des exercices interactifs : séries de 10 questions par matière / thème.
   Questions ORIGINALES rédigées dans l'esprit des épreuves externes CE1D
   (Fédération Wallonie-Bruxelles) — elles ne reproduisent pas les épreuves officielles.

   Formats d'une question (champ t) :
     qcm : { q, c: [choix…], a: index de la bonne réponse, ex }
     vf  : { q, a: true|false, ex }                      (vrai / faux)
     num : { q, a: nombre, tol?: marge, unit?: "cm", ex } (réponse numérique, virgule ou point)
     txt : { q, a: ["réponse", "variante"…], strict?: true (accents exigés), ex }
   Champs facultatifs : ctx (texte/document à lire au-dessus), audio (texte anglais lu à voix haute), img.
   Un thème peut contenir gen: [fonctions qui renvoient une question] pour des exercices aléatoires.
   ========================================================= */
import MATH from "./ce1d-math.js";
import FRANCAIS from "./ce1d-francais.js";
import SCIENCES from "./ce1d-sciences.js";
import LANGUES from "./ce1d-langues.js";

export const SUBJECTS = [MATH, FRANCAIS, SCIENCES, LANGUES];
export const SERIES_LEN = 10;

const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const noAcc = s => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "");
// espaces, ponctuation et caractères spéciaux ignorés… sauf les signes de calcul dans les réponses mathématiques
const norm = (s, keepAcc, maths) => {
  let x = String(s ?? "").toLowerCase().replace(/[’`]/g, "'").replace(/œ/g, "oe").replace(/æ/g, "ae");
  x = keepAcc ? x : noAcc(x);
  if (maths) return x.replace(/[−–]/g, "-").replace(/[×·]/g, "*").replace(/\^2/g, "²").replace(/\^3/g, "³").replace(/[^\p{L}\p{N}+\-=*/²³()]/gu, "");
  return x.replace(/[^\p{L}\p{N}]/gu, "");
};

export const subjectById = id => SUBJECTS.find(s => s.id === id);
export function countItems(sub, themeId = null) {
  return sub.themes.filter(t => !themeId || t.id === themeId).reduce((a, t) => a + (t.items || []).length + (t.gen || []).length, 0);
}

/** Prépare une question concrète (générateur exécuté, choix du QCM mélangés) */
function concrete(raw, theme) {
  const it = { ...raw, theme: theme.id, themeName: theme.name };
  if (it.t === "qcm") {
    const order = shuffle(it.c.map((_, i) => i));
    it.c = order.map(i => raw.c[i]);
    it.a = order.indexOf(raw.a);
  }
  return it;
}

/** Série de n questions (mélange équilibré entre les thèmes si themeId est vide) */
export function buildSeries(subjectId, themeId = null, n = SERIES_LEN, avoid = new Set()) {
  const sub = subjectById(subjectId);
  const themes = sub.themes.filter(t => !themeId || t.id === themeId);
  // pool : questions fixes + générateurs
  const pools = themes.map(t => shuffle([
    ...(t.items || []).map(q => ({ q, t })),
    ...(t.gen || []).map(g => ({ g, t }))
  ]).sort((a, b) => (avoid.has(a.q?.q) ? 1 : 0) - (avoid.has(b.q?.q) ? 1 : 0)));
  const out = [];
  let k = 0, guard = 0;
  while (out.length < n && guard++ < 500) {
    const p = pools[k++ % pools.length];
    if (!p.length) { if (pools.every(x => !x.length)) break; continue; }
    const e = p.shift();
    const raw = e.g ? e.g() : e.q;
    if (e.g) p.push(e); // un générateur peut resservir (valeurs différentes)
    if (out.some(o => o.q === raw.q && o.ctx === raw.ctx)) continue;
    out.push(concrete(raw, e.t));
  }
  return shuffle(out);
}

/** Texte de la bonne réponse */
export function expectedText(it) {
  if (it.t === "qcm") return it.c[it.a];
  if (it.t === "vf") return it.a ? "Vrai" : "Faux";
  if (it.t === "num") return String(it.a).replace(".", ",") + (it.unit ? " " + it.unit : "");
  return (it.a || [])[0] || "";
}

/** Correction. given : index (qcm), booléen (vf), texte (num / txt) */
export function checkCe1d(it, given) {
  if (it.t === "qcm") return given === it.a;
  if (it.t === "vf") return given === it.a;
  if (it.t === "num") {
    const s = String(given ?? "").trim().replace(/\s/g, "").replace(",", ".").replace(/[^\d.\-\/]/g, "");
    let v;
    if (/^-?\d+\/\d+$/.test(s)) { const [a, b] = s.split("/").map(Number); v = a / b; } else v = parseFloat(s);
    if (!isFinite(v)) return false;
    return Math.abs(v - Number(it.a)) <= (it.tol ?? 1e-9) + 1e-9;
  }
  if (it.t === "txt") {
    const maths = (it.a || []).some(a => /\d/.test(a) && /[+\-−=²]/.test(a));
    const g = norm(given, it.strict, maths);
    if (!g) return false;
    return (it.a || []).some(a => norm(a, it.strict, maths) === g);
  }
  return false;
}

/** Vérifie une banque d'exercices (utilisé par les tests) */
export function validateSubject(sub) {
  const errs = [];
  if (!sub.id || !sub.name || !sub.icon || !Array.isArray(sub.themes)) errs.push("sujet incomplet");
  for (const t of sub.themes || []) {
    if (!t.id || !t.name) errs.push(`thème sans id/nom`);
    const all = [...(t.items || [])];
    for (const g of t.gen || []) for (let i = 0; i < 25; i++) { try { all.push(g()); } catch (e) { errs.push(`${t.id}: générateur en erreur ${e.message}`); break; } }
    for (const it of all) {
      const w = m => errs.push(`${sub.id}/${t.id}: ${m} — « ${String(it.q).slice(0, 60)} »`);
      if (!it.q || typeof it.q !== "string") w("q manquant");
      if (!it.ex || typeof it.ex !== "string") w("explication manquante");
      if (it.t === "qcm") {
        if (!Array.isArray(it.c) || it.c.length < 2) w("choix manquants");
        else if (!(Number.isInteger(it.a) && it.a >= 0 && it.a < it.c.length)) w("index a invalide");
        else if (new Set(it.c.map(String)).size !== it.c.length) w("choix en double");
      } else if (it.t === "vf") { if (typeof it.a !== "boolean") w("a doit être booléen"); }
      else if (it.t === "num") { if (typeof it.a !== "number" || !isFinite(it.a)) w("a doit être un nombre"); }
      else if (it.t === "txt") { if (!Array.isArray(it.a) || !it.a.length) w("a doit être une liste"); }
      else w("type inconnu " + it.t);
    }
  }
  return errs;
}
