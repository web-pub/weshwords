/* =========================================================
   Wesh Words — vérification automatique du vocabulaire (V03-002)
   Un petit assistant intégré au site (pas un service d'IA externe payant :
   Wesh Words n'a pas de serveur capable de garder une clé API en sécurité)
   qui relit chaque mot ajouté ou importé et signale ce qui semble louche —
   colonnes inversées, mot vide, doublon de langue, texte trop long...
   ========================================================= */

const STOP_FR = ["le", "la", "les", "de", "des", "un", "une", "est", "avec", "pour", "dans", "qui", "que", "et", "à", "du", "se", "ce", "sont"];
const STOP_EN = ["the", "is", "and", "to", "of", "with", "for", "you", "are", "this", "that", "in", "on", "at"];
const STOP_NL = ["de", "het", "een", "van", "is", "en", "niet", "met", "voor", "dat", "ik", "jij", "zijn", "wordt"];
const HAS_ACCENT = /[éèêëàâäîïôöùûüçœ]/i;

function words(s) {
  return String(s || "").toLowerCase().replace(/[’']/g, " ").split(/[^a-zàâäéèêëîïôöùûüç]+/i).filter(Boolean);
}
function score(s, stop) {
  const ws = words(s);
  if (!ws.length) return 0;
  return ws.filter(w => stop.includes(w)).length / ws.length;
}
const looksFrench = s => HAS_ACCENT.test(s) || score(s, STOP_FR) > 0.15;
const looksEnglish = s => !HAS_ACCENT.test(s) && score(s, STOP_EN) > 0.15;
const looksDutch = s => !HAS_ACCENT.test(s) && score(s, STOP_NL) > 0.15;

/**
 * Vérifie un mot { fr, en (= mot cible, anglais ou néerlandais selon lang) }.
 * @returns {{level:'ok'|'warn'|'error', reasons:string[]}}
 */
export function checkWord(w, lang = "en") {
  const targetLabel = lang === "nl" ? "néerlandais" : "anglais";
  const fr = String(w?.fr ?? "").trim();
  const tgt = String(w?.en ?? "").trim();
  const reasons = [];
  if (!fr || !tgt) return { level: "error", reasons: [`Champ français ou ${targetLabel} manquant.`] };
  if (fr.toLowerCase() === tgt.toLowerCase()) reasons.push(`Français et ${targetLabel} identiques : vérifie que ce n'est pas une erreur de copie.`);
  if (looksFrench(tgt) && !looksFrench(fr)) reasons.push(`Le mot « ${tgt} » ressemble à du français : les colonnes sont peut-être inversées.`);
  if (lang === "en" && !looksEnglish(tgt) && looksDutch(tgt)) reasons.push(`Le mot « ${tgt} » ressemble à du néerlandais plutôt qu'à de l'anglais.`);
  if (lang === "nl" && looksEnglish(tgt) && !looksDutch(tgt) && /\b(the|and|is)\b/i.test(tgt)) reasons.push(`Le mot « ${tgt} » ressemble à de l'anglais plutôt qu'à du néerlandais.`);
  if (fr.length > 70 || tgt.length > 70) reasons.push("Texte très long : vérifie qu'il ne s'agit pas d'une phrase entière collée par erreur.");
  if (/^\d+$/.test(fr) || /^\d+$/.test(tgt)) reasons.push("Ne contient que des chiffres.");
  if (/https?:\/\//i.test(fr) || /https?:\/\//i.test(tgt)) reasons.push("Contient un lien internet : probablement une erreur d'import.");
  return { level: reasons.length ? "warn" : "ok", reasons };
}

/** Vérifie un tableau de lignes ; ajoute une clé _check à chacune */
export function checkBatch(rows, lang = "en") {
  return rows.map(r => ({ ...r, _check: checkWord(r, lang) }));
}
export function summarizeChecks(checked) {
  const error = checked.filter(c => c._check.level === "error").length;
  const warn = checked.filter(c => c._check.level === "warn").length;
  return { error, warn, ok: checked.length - error - warn, total: checked.length };
}
