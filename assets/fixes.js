/* Wesh Words — corrections du vocabulaire de départ (V01-008)
   Proposées dans l'espace parent → Vocabulaire lorsqu'un mot importé contient l'erreur. */
export const VOCAB_FIXES = [
 {
  "cat": "Pays / nationalités",
  "en": "Australian",
  "from": "Australian",
  "to": "australien / australienne"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Austrian",
  "from": "Austrian",
  "to": "autrichien / autrichienne"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Belgian",
  "from": "Belgian",
  "to": "belge"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Brazilian",
  "from": "Brazilian",
  "to": "brésilien / brésilienne"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Canadian",
  "from": "Canadian",
  "to": "canadien / canadienne"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Chinese",
  "from": "Chinese",
  "to": "chinois / chinoise"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Danish",
  "from": "Danish",
  "to": "danois / danoise"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Finnish",
  "from": "Finnish",
  "to": "finlandais / finlandaise"
 },
 {
  "cat": "Pays / nationalités",
  "en": "French",
  "from": "French",
  "to": "français / française"
 },
 {
  "cat": "Pays / nationalités",
  "en": "British",
  "from": "British",
  "to": "britannique"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Greek",
  "from": "Greek",
  "to": "grec / grecque"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Indian",
  "from": "Indian",
  "to": "indien / indienne"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Irish",
  "from": "Irish",
  "to": "irlandais / irlandaise"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Italian",
  "from": "Italian",
  "to": "italien / italienne"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Japanese",
  "from": "Japanese",
  "to": "japonais / japonaise"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Mexican",
  "from": "Mexican",
  "to": "mexicain / mexicaine"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Moroccan",
  "from": "Moroccan",
  "to": "marocain / marocaine"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Dutch",
  "from": "Dutch",
  "to": "néerlandais / néerlandaise / hollandais"
 },
 {
  "cat": "Pays / nationalités",
  "en": "New Zealand",
  "from": "New Zealand",
  "to": "néo-zélandais / néo-zélandaise"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Norwegian",
  "from": "Norwegian",
  "to": "norvégien / norvégienne"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Polish",
  "from": "Polish",
  "to": "polonais / polonaise"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Portuguese",
  "from": "Portuguese",
  "to": "portugais / portugaise"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Russian",
  "from": "Russian",
  "to": "russe"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Scottish",
  "from": "Scottish",
  "to": "écossais / écossaise"
 },
 {
  "cat": "Pays / nationalités",
  "en": "South African",
  "from": "South African",
  "to": "sud-africain / sud-africaine"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Spanish",
  "from": "Spanish",
  "to": "espagnol / espagnole"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Swedish",
  "from": "Swedish",
  "to": "suédois / suédoise"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Swiss",
  "from": "Swiss",
  "to": "suisse"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Turkish",
  "from": "Turkish",
  "to": "turc / turque"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Ukrainian",
  "from": "Ukrainian",
  "to": "ukrainien / ukrainienne"
 },
 {
  "cat": "Pays / nationalités",
  "en": "American",
  "from": "American",
  "to": "américain / américaine"
 },
 {
  "cat": "Pays / nationalités",
  "en": "Welsh",
  "from": "Welsh",
  "to": "gallois / galloise"
 },
 {
  "en": "ice cream",
  "from": "crème glacée",
  "to": "crème glacée / glace"
 }
];

const n = s => String(s || "").trim().toLowerCase();
/** Mots à corriger dans le vocabulaire actuel : [{ word, to }] */
export function pendingFixes(words) {
  const out = [];
  for (const w of words) {
    const f = VOCAB_FIXES.find(f => n(f.en) === n(w.en) && n(f.from) === n(w.fr) && (!f.cat || f.cat === w.cat));
    if (f && n(f.to) !== n(w.fr)) out.push({ word: w, to: f.to });
  }
  return out;
}
