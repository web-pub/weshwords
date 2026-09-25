/* =========================================================
   Wesh Words — CE1D : banque d'exercices MATHÉMATIQUES
   Questions originales rédigées dans l'esprit des épreuves externes CE1D
   (livret 1 sans calculatrice / livret 2 avec calculatrice).
   ========================================================= */
import { rnd, pick, fr, pgcd, frac } from "./ce1d-util.js";

/* ---------- petits outils locaux ---------- */
/** nombre en texte avec le vrai signe moins */
const F = x => fr(x).replace("-", "−");
/** nombre entre parenthèses s'il est négatif */
const P = x => (x < 0 ? `(${F(x)})` : F(x));
/** « + 5 » ou « − 5 » pour écrire un terme à la suite */
const T = x => (x < 0 ? `− ${F(-x)}` : `+ ${F(x)}`);
/** exposant en caractères surélevés */
const SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
const sup = n => String(n).split("").map(c => SUP[c]).join("");
/** coordonnées d'un point */
const pt = (x, y) => `(${F(x)} ; ${F(y)})`;
/** arrondi propre (évite 0,1 + 0,2 = 0,30000000004) */
const r2 = x => Math.round(x * 1e6) / 1e6;
/** fraction en texte avec signe moins typographique */
const FR = (n, d) => frac(n, d).replace("-", "−");
/** nombre affiché avec exactement 3 décimales (F() en a au plus 2, ce qui cachait le chiffre
    à arrondir dans les questions d'arrondi et affichait parfois un nombre déjà arrondi — V03-006) */
const F3 = x => (x < 0 ? "−" : "") + Math.abs(x).toFixed(3).replace(".", ",");
/** valeur numérique d'un choix de QCM (nombre ou fraction), NaN si ce n'est pas un nombre
    (ex. « x² + 6x + 9 » ou « (3 ; −2) ») — sert à détecter les doublons « écrits différemment »
    comme 6/4 et 3/2, qui passaient à travers la comparaison texte (V03-006) */
function numVal(s) {
  const t = String(s).replace(/[−–]/g, "-").trim();
  if (/^-?\d+\/\d+$/.test(t)) { const [n, d] = t.split("/").map(Number); return n / d; }
  const n = Number(t.replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}
/** QCM de générateur : bonne réponse en premier, distracteurs sans doublon
    (ni en texte, ni en valeur numérique quand les choix sont des nombres/fractions) */
function qcm(q, good, bad, ex, extra = {}) {
  const seen = new Set([numVal(good)]);
  const c = [good];
  for (const b of bad) {
    if (c.length >= 4) break;
    if (c.includes(b)) continue;
    const v = numVal(b);
    if (!Number.isNaN(v) && seen.has(v)) continue;
    c.push(b);
    seen.add(v);
  }
  return { t: "qcm", q, c, a: 0, ex, ...extra };
}
/** terme « ax » : 1x → x, −1x → −x */
const ax = (a, v = "x") => (a === 1 ? v : a === -1 ? `−${v}` : `${F(a)}${v}`);
/** écriture compacte (pour les réponses txt) : 6x+15, 6x-15 */
const cx = (a, b) => `${a === 1 ? "" : a === -1 ? "-" : a}x${b === 0 ? "" : b > 0 ? "+" + b : b}`;

/* =========================================================
   1. NOMBRES & CALCUL
   ========================================================= */
const nombres = {
  id: "nombres",
  name: "Nombres & calcul",
  desc: "Priorités, relatifs, fractions, puissances, division euclidienne, arrondis et suites.",
  items: [
    { t: "num", q: "Sans calculatrice, calcule : 5 + 3 × 4", a: 17, ex: "La multiplication est prioritaire : 3 × 4 = 12, puis 5 + 12 = 17." },
    { t: "num", q: "Calcule : 20 − 12 : 4 + 2", a: 19, ex: "On effectue d'abord la division : 12 : 4 = 3. Ensuite, de gauche à droite : 20 − 3 + 2 = 19." },
    { t: "num", q: "Calcule : (−3) × (−4) − 5", a: 7, ex: "Moins par moins donne plus : (−3) × (−4) = 12. Puis 12 − 5 = 7." },
    { t: "num", q: "Calcule : −8 + 15 − (−3)", a: 10, ex: "Soustraire un nombre, c'est additionner son opposé : −8 + 15 + 3 = 10." },
    { t: "num", q: "Calcule : (−12) : (−3) + (−2) × 5", a: -6, ex: "Priorités : (−12) : (−3) = 4 et (−2) × 5 = −10. Puis 4 + (−10) = −6." },
    { t: "qcm", q: "Que vaut −2² ?", c: ["−4", "4", "−2", "2"], a: 0, ex: "Sans parenthèses, l'exposant ne porte que sur le 2 : −2² = −(2 × 2) = −4. Par contre, (−2)² = 4." },
    { t: "num", q: "Calcule : (−2)³", a: -8, ex: "(−2)³ = (−2) × (−2) × (−2) = 4 × (−2) = −8. Un exposant impair garde le signe moins." },
    { t: "num", q: "Que vaut 7⁰ ?", a: 1, ex: "Tout nombre non nul exposant 0 vaut 1 : 7⁰ = 1." },
    { t: "qcm", q: "Que vaut 2⁻¹ ?", c: ["1/2", "−2", "−1/2", "0,2"], a: 0, ex: "Un exposant −1 donne l'inverse : 2⁻¹ = 1/2 = 0,5. Ce n'est pas un nombre négatif !" },
    { t: "num", q: "Écris 10⁻² sous forme d'un nombre décimal.", a: 0.01, ex: "10⁻² = 1/10² = 1/100 = 0,01." },
    { t: "vf", q: "(−1)²⁰²⁵ = −1", a: true, ex: "L'exposant 2025 est impair : on multiplie un nombre impair de fois −1, le résultat est −1." },
    { t: "qcm", q: "Quelle est la forme irréductible de la fraction 18/24 ?", c: ["3/4", "9/12", "2/3", "6/8"], a: 0, ex: "On divise le numérateur et le dénominateur par leur PGCD, 6 : 18/24 = 3/4. 9/12 et 6/8 sont égales mais pas irréductibles." },
    { t: "qcm", q: "Calcule : 2/3 + 1/4", c: ["11/12", "3/7", "3/12", "2/12"], a: 0, ex: "On réduit au même dénominateur 12 : 8/12 + 3/12 = 11/12. On n'additionne jamais les dénominateurs !" },
    { t: "qcm", q: "Calcule : 5/6 − 1/3", c: ["1/2", "4/3", "2/3", "1/3"], a: 0, ex: "1/3 = 2/6, donc 5/6 − 2/6 = 3/6 = 1/2." },
    { t: "num", q: "Calcule : 3/5 × 10", a: 6, ex: "3/5 × 10 = 30/5 = 6 (ou : 10 : 5 = 2, puis 2 × 3 = 6)." },
    { t: "vf", q: "3/4 : 1/2 = 3/8", a: false, ex: "Diviser par une fraction, c'est multiplier par son inverse : 3/4 × 2/1 = 6/4 = 3/2." },
    { t: "qcm", q: "Quelle est la plus grande de ces fractions ?", c: ["3/4", "2/3", "5/8", "7/12"], a: 0, ex: "Au dénominateur 24 : 3/4 = 18/24, 2/3 = 16/24, 5/8 = 15/24, 7/12 = 14/24. La plus grande est 3/4." },
    { t: "num", q: "On effectue la division euclidienne de 247 par 12. Quel est le reste ?", a: 7, ex: "12 × 20 = 240 et 247 − 240 = 7. Donc 247 = 12 × 20 + 7, avec 7 < 12." },
    { t: "num", q: "Dans une division euclidienne, le diviseur est 9, le quotient 14 et le reste 5. Quel est le dividende ?", a: 131, ex: "Dividende = diviseur × quotient + reste = 9 × 14 + 5 = 126 + 5 = 131." },
    { t: "vf", q: "Pour la division euclidienne de 50 par 7, on peut écrire : 50 = 7 × 6 + 8.", a: false, ex: "L'égalité est juste, mais le reste doit être plus petit que le diviseur (8 > 7). La bonne écriture est 50 = 7 × 7 + 1." },
    { t: "num", q: "Arrondis 3,14159 au centième.", a: 3.14, ex: "Le chiffre des centièmes est 4 ; le suivant (1) est plus petit que 5, on garde 3,14." },
    { t: "qcm", q: "Entre quels nombres entiers consécutifs se trouve −3,7 ?", c: ["−4 et −3", "−3 et −2", "3 et 4", "−5 et −4"], a: 0, ex: "Sur la droite graduée, −3,7 est à gauche de −3 et à droite de −4 : −4 < −3,7 < −3." },
    { t: "num", q: "Voici une suite de nombres : 3 ; 7 ; 11 ; 15 ; … Quel est le terme suivant ?", a: 19, ex: "On ajoute 4 à chaque fois : 15 + 4 = 19." },
    { t: "num", q: "Voici une suite de nombres : 2 ; 6 ; 18 ; 54 ; … Quel est le terme suivant ?", a: 162, ex: "On multiplie par 3 à chaque fois : 54 × 3 = 162." },
    { t: "qcm", q: "Suite : 1 ; 4 ; 9 ; 16 ; 25 ; … Quelle est la règle ?", c: ["Ce sont les carrés des nombres 1, 2, 3, 4, 5…", "On ajoute 3 à chaque fois", "On multiplie par 4 à chaque fois", "On ajoute 5 à chaque fois"], a: 0, ex: "1 = 1², 4 = 2², 9 = 3², 16 = 4², 25 = 5² : le terme suivant est 6² = 36. Les écarts (3, 5, 7, 9…) augmentent de 2." }
  ],
  gen: [
    // priorités des opérations
    () => {
      const a = rnd(2, 20), b = rnd(2, 9), c = rnd(2, 9), d = rnd(1, 10);
      const r = a + b * c - d;
      return { t: "num", q: `Sans calculatrice, calcule : ${a} + ${b} × ${c} − ${d}`, a: r, ex: `La multiplication d'abord : ${b} × ${c} = ${b * c}. Puis de gauche à droite : ${a} + ${b * c} − ${d} = ${F(r)}.` };
    },
    // parenthèses et priorités
    () => {
      const a = rnd(2, 9), b = rnd(1, 9), c = rnd(2, 6), d = rnd(1, 20);
      const r = (a + b) * c - d;
      return { t: "num", q: `Calcule : (${a} + ${b}) × ${c} − ${d}`, a: r, ex: `Les parenthèses d'abord : ${a} + ${b} = ${a + b}. Puis ${a + b} × ${c} = ${(a + b) * c}, et ${(a + b) * c} − ${d} = ${F(r)}.` };
    },
    // nombres relatifs
    () => {
      const a = rnd(-9, -2), b = pick([-1, 1]) * rnd(2, 9), c = rnd(-15, 15) || 4;
      const m = a * b, r = m - c;
      return { t: "num", q: `Calcule : ${P(a)} × ${P(b)} − ${P(c)}`, a: r, ex: `${P(a)} × ${P(b)} = ${F(m)} (${b < 0 ? "moins par moins donne plus" : "moins par plus donne moins"}). Puis ${F(m)} − ${P(c)}${c < 0 ? ` = ${F(m)} ${T(-c)}` : ""} = ${F(r)}.` };
    },
    // addition de fractions
    () => {
      const d1 = pick([2, 3, 4, 5, 6]), d2 = pick([3, 4, 6, 8, 10].filter(x => x !== d1));
      const n1 = rnd(1, d1 - 1), n2 = rnd(1, d2 - 1);
      const L = d1 * d2 / pgcd(d1, d2), a1 = n1 * L / d1, a2 = n2 * L / d2;
      const good = FR(a1 + a2, L);
      return qcm(`Calcule et donne la réponse sous forme irréductible : ${n1}/${d1} + ${n2}/${d2}`, good,
        [`${n1 + n2}/${d1 + d2}`, FR(n1 * n2, d1 * d2), `${n1 + n2}/${L}`, FR(a1 + a2 + 1, L), FR(a1 + a2, L * 2)],
        `Même dénominateur ${L} : ${n1}/${d1} = ${a1}/${L} et ${n2}/${d2} = ${a2}/${L}. Donc ${a1}/${L} + ${a2}/${L} = ${a1 + a2}/${L}${frac(a1 + a2, L) !== `${a1 + a2}/${L}` ? ` = ${good}` : ""}.`);
    },
    // multiplication / division de fractions
    () => {
      const n1 = rnd(1, 7), d1 = rnd(n1 + 1, 9), n2 = rnd(1, 7), d2 = rnd(n2 + 1, 9);
      if (pick([true, false])) {
        const good = FR(n1 * n2, d1 * d2);
        return qcm(`Calcule et simplifie : ${n1}/${d1} × ${n2}/${d2}`, good,
          [FR(n1 * d2, d1 * n2), `${n1 * n2}/${d1 + d2}`, FR(n1 + n2, d1 * d2), `${n1 + n2}/${d1 + d2}`],
          `On multiplie les numérateurs entre eux et les dénominateurs entre eux : (${n1} × ${n2})/(${d1} × ${d2}) = ${n1 * n2}/${d1 * d2}${good !== `${n1 * n2}/${d1 * d2}` ? ` = ${good}` : ""}.`);
      }
      const good = FR(n1 * d2, d1 * n2);
      return qcm(`Calcule et simplifie : ${n1}/${d1} : ${n2}/${d2}`, good,
        [FR(n1 * n2, d1 * d2), FR(d1 * n2, n1 * d2), `${n1 * d2}/${d1 + n2}`, `${n1 + d2}/${d1 * n2}`, FR(n1, n2)],
        `Diviser par ${n2}/${d2}, c'est multiplier par son inverse ${d2}/${n2} : ${n1}/${d1} × ${d2}/${n2} = ${n1 * d2}/${d1 * n2}${good !== `${n1 * d2}/${d1 * n2}` ? ` = ${good}` : ""}.`);
    },
    // division euclidienne
    () => {
      const d = rnd(6, 15), qn = rnd(8, 40), r = rnd(0, d - 1), D = d * qn + r;
      const k = rnd(0, 2);
      const ex = `${D} = ${d} × ${qn} + ${r}, et le reste ${r} est bien plus petit que le diviseur ${d}.`;
      if (k === 0) return { t: "num", q: `Division euclidienne de ${D} par ${d} : quel est le quotient ?`, a: qn, ex };
      if (k === 1) return { t: "num", q: `Division euclidienne de ${D} par ${d} : quel est le reste ?`, a: r, ex };
      return { t: "num", q: `Dans une division euclidienne, le diviseur vaut ${d}, le quotient ${qn} et le reste ${r}. Quel est le dividende ?`, a: D, ex: `Dividende = diviseur × quotient + reste = ${d} × ${qn} + ${r} = ${d * qn} + ${r} = ${D}.` };
    },
    // puissances
    () => {
      if (rnd(1, 4) === 1) {
        const b = pick([2, 4, 5, 10]);
        return { t: "num", q: `Écris ${b}⁻¹ sous forme d'un nombre décimal.`, a: 1 / b, ex: `Un exposant −1 donne l'inverse : ${b}⁻¹ = 1/${b} = ${F(1 / b)}.` };
      }
      const b = rnd(2, 5), neg = pick([true, false]), n = rnd(0, b === 5 ? 3 : 4);
      const base = neg ? -b : b, r = base ** n;
      const txt = neg ? `(−${b})${sup(n)}` : `${b}${sup(n)}`;
      let ex;
      if (n === 1) ex = `Un nombre exposant 1 reste lui-même : ${txt} = ${F(r)}.`;
      else if (n === 0) ex = `Tout nombre non nul exposant 0 vaut 1 : ${txt} = 1.`;
      else ex = `${txt} = ${Array(n).fill(P(base)).join(" × ")} = ${F(r)}.${neg ? ` L'exposant ${n} est ${n % 2 ? "impair : le résultat est négatif" : "pair : le résultat est positif"}.` : ""}`;
      return { t: "num", q: `Calcule : ${txt}`, a: r, ex };
    },
    // suites
    () => {
      if (pick([true, false])) {
        const s = rnd(-10, 20), p = pick([-7, -5, -3, -2, 2, 3, 4, 5, 6, 7, 9]);
        const u = [0, 1, 2, 3].map(i => s + i * p);
        return { t: "num", q: `Voici une suite de nombres : ${u.map(F).join(" ; ")} ; … Quel est le terme suivant ?`, a: s + 4 * p, ex: `On ${p > 0 ? "ajoute " + p : "retire " + -p} à chaque fois : ${F(u[3])} ${T(p)} = ${F(s + 4 * p)}.` };
      }
      const s = rnd(1, 5), k = pick([2, 3]);
      const u = [0, 1, 2, 3].map(i => s * k ** i);
      return { t: "num", q: `Voici une suite de nombres : ${u.join(" ; ")} ; … Quel est le terme suivant ?`, a: s * k ** 4, ex: `On multiplie par ${k} à chaque fois : ${u[3]} × ${k} = ${s * k ** 4}.` };
    },
    // arrondis
    () => {
      const k = rnd(100, 9999) * 10 + rnd(1, 9);
      const x = k / 1000;
      if (pick([true, false])) {
        const r = Math.round(k / 10) / 100, m = k % 10;
        return { t: "num", q: `Arrondis ${F3(x)} au centième.`, a: r, ex: `Le chiffre des millièmes est ${m} : ${m >= 5 ? "5 ou plus, on augmente le chiffre des centièmes d'une unité" : "moins de 5, on garde le chiffre des centièmes"}. Résultat : ${F(r)}.` };
      }
      const r = Math.round(k / 100) / 10, m = Math.floor(k / 10) % 10;
      return { t: "num", q: `Arrondis ${F3(x)} au dixième.`, a: r, ex: `Le chiffre des centièmes est ${m} : ${m >= 5 ? "5 ou plus, on augmente le chiffre des dixièmes d'une unité" : "moins de 5, on garde le chiffre des dixièmes"}. Résultat : ${F(r)}.` };
    }
  ]
};

/* =========================================================
   2. PROPORTIONNALITÉ & POURCENTAGES
   ========================================================= */
const proportion = {
  id: "proportion",
  name: "Proportionnalité & pourcentages",
  desc: "Règle de trois, échelles, pourcentages, TVA, vitesse moyenne et conversions.",
  items: [
    { t: "num", q: "3 cahiers coûtent 4,50 €. Combien coûtent 7 cahiers ?", a: 10.5, unit: "€", ex: "Un cahier coûte 4,50 : 3 = 1,50 €. Donc 7 cahiers coûtent 7 × 1,50 = 10,50 €." },
    { t: "num", q: "Pour 4 personnes, la recette de crêpes de Margaux demande 300 g de farine. Combien de grammes faut-il pour 6 personnes ?", a: 450, unit: "g", ex: "Pour 1 personne : 300 : 4 = 75 g. Pour 6 personnes : 6 × 75 = 450 g." },
    { t: "vf", ctx: "Masse de pommes (kg) : 2 | 3 | 5\nPrix (€) : 7 | 10,5 | 17,5", q: "Ce tableau est un tableau de proportionnalité.", a: true, ex: "On divise chaque prix par la masse : 7 : 2 = 3,5 ; 10,5 : 3 = 3,5 ; 17,5 : 5 = 3,5. Le coefficient est toujours 3,5 €/kg." },
    { t: "vf", ctx: "Âge de Margaux (ans) : 2 | 6 | 12\nTaille de Margaux (cm) : 86 | 115 | 150", q: "La taille de Margaux est proportionnelle à son âge.", a: false, ex: "86 : 2 = 43 mais 115 : 6 ≈ 19,2 : les quotients ne sont pas égaux, donc ce n'est pas proportionnel." },
    { t: "num", q: "Sur une carte à l'échelle 1/50 000, deux villages sont séparés de 3 cm. Quelle est la distance réelle en km ?", a: 1.5, unit: "km", ex: "Réel = 3 × 50 000 = 150 000 cm = 1 500 m = 1,5 km." },
    { t: "num", q: "Sur un plan à l'échelle 1/200, quelle longueur (en cm) représente un mur de 5 m ?", a: 2.5, unit: "cm", ex: "5 m = 500 cm, et 500 : 200 = 2,5 cm sur le plan." },
    { t: "num", q: "Pendant les soldes, un jean à 80 € est réduit de 30 %. Quel est son nouveau prix ?", a: 56, unit: "€", ex: "Réduction : 30 % de 80 = 0,30 × 80 = 24 €. Nouveau prix : 80 − 24 = 56 € (ou directement 80 × 0,70)." },
    { t: "num", q: "Un vélo coûte 200 € hors TVA. La TVA est de 21 %. Quel est son prix TVA comprise ?", a: 242, unit: "€", ex: "TVA : 21 % de 200 = 42 €. Prix TVAC : 200 + 42 = 242 € (ou 200 × 1,21)." },
    { t: "num", q: "Une console coûte 363 € TVA comprise (TVA de 21 %). Quel est son prix hors TVA ?", a: 300, unit: "€", ex: "Prix TVAC = prix HTVA × 1,21, donc prix HTVA = 363 : 1,21 = 300 €. Attention : retirer 21 % de 363 € ne donne pas le bon résultat !" },
    { t: "num", q: "Après une augmentation de 15 %, un abonnement de sport coûte 46 €. Combien coûtait-il avant ?", a: 40, unit: "€", ex: "Nouveau prix = ancien prix × 1,15, donc ancien prix = 46 : 1,15 = 40 €." },
    { t: "qcm", q: "Le prix d'un article baisse de 20 %, puis augmente de 20 %. Au final, par rapport au prix de départ, le prix a…", c: ["diminué de 4 %", "retrouvé sa valeur de départ", "augmenté de 4 %", "diminué de 20 %"], a: 0, ex: "Avec 100 € : −20 % donne 80 €, puis +20 % de 80 = +16 €, soit 96 €. Le prix a baissé de 4 %." },
    { t: "num", q: "Dans une classe de 30 élèves, 12 font partie d'un club de sport. Quel pourcentage des élèves cela représente-t-il ?", a: 40, unit: "%", ex: "12/30 = 0,4 = 40 %." },
    { t: "num", q: "Pour la sortie scolaire, le car roule 180 km en 2 h 30 min. Quelle est sa vitesse moyenne en km/h ?", a: 72, unit: "km/h", ex: "2 h 30 min = 2,5 h (et pas 2,3 h !). Vitesse = distance : durée = 180 : 2,5 = 72 km/h." },
    { t: "num", q: "Un train roule à 90 km/h de moyenne. Combien de minutes lui faut-il pour parcourir 45 km ?", a: 30, unit: "min", ex: "Durée = distance : vitesse = 45 : 90 = 0,5 h = 30 min." },
    { t: "num", q: "Combien de minutes y a-t-il dans 1 h 45 min ?", a: 105, unit: "min", ex: "1 h = 60 min, donc 60 + 45 = 105 min." },
    { t: "num", q: "Convertis 2,5 h en minutes.", a: 150, unit: "min", ex: "2,5 h = 2 h + 0,5 h = 120 min + 30 min = 150 min." },
    { t: "num", q: "Convertis 3,2 m² en dm².", a: 320, unit: "dm²", ex: "1 m² = 100 dm² (on multiplie par 100 à chaque rang pour les aires) : 3,2 × 100 = 320 dm²." },
    { t: "num", q: "Convertis 1,5 L en cL.", a: 150, unit: "cL", ex: "1 L = 100 cL, donc 1,5 L = 150 cL." },
    { t: "num", q: "Un aquarium contient 2 500 cm³ d'eau. Combien de litres cela fait-il ?", a: 2.5, unit: "L", ex: "1 L = 1 dm³ = 1 000 cm³, donc 2 500 cm³ = 2,5 L." },
    { t: "num", q: "Convertis 0,75 km en mètres.", a: 750, unit: "m", ex: "1 km = 1 000 m, donc 0,75 × 1 000 = 750 m." },
    { t: "qcm", q: "Une piscine a la forme d'un pavé de 10 m sur 4 m, profonde de 2 m. Combien de litres d'eau faut-il pour la remplir ?", c: ["80 000 L", "80 L", "8 000 L", "800 L"], a: 0, ex: "Volume = 10 × 4 × 2 = 80 m³. Or 1 m³ = 1 000 L, donc 80 000 L." }
  ],
  gen: [
    // règle de trois
    () => {
      const obj = pick(["cahiers", "stylos", "croissants", "bouteilles d'eau", "paquets de chips", "cartes Pokémon"]);
      const u = rnd(3, 30) * 10, n1 = rnd(2, 6), n2 = rnd(7, 15);
      const p1 = n1 * u / 100, p2 = n2 * u / 100;
      return { t: "num", q: `Au magasin, ${n1} ${obj} coûtent ${F(p1)} €. Combien coûtent ${n2} ${obj} ?`, a: p2, unit: "€", ex: `Prix d'un seul : ${F(p1)} : ${n1} = ${F(u / 100)} €. Pour ${n2} : ${n2} × ${F(u / 100)} = ${F(p2)} €.` };
    },
    // réduction ou augmentation en %
    () => {
      const p = rnd(2, 30) * 5, pc = pick([10, 20, 25, 30, 40, 50]);
      const d = r2(p * pc / 100);
      if (pick([true, false])) {
        const n = r2(p - d);
        return { t: "num", q: `Soldes ! Un article à ${F(p)} € est réduit de ${pc} %. Quel est son nouveau prix ?`, a: n, unit: "€", ex: `Réduction : ${pc} % de ${F(p)} = ${F(pc / 100)} × ${F(p)} = ${F(d)} €. Nouveau prix : ${F(p)} − ${F(d)} = ${F(n)} €.` };
      }
      const n = r2(p + d);
      return { t: "num", q: `Le prix d'une place de concert (${F(p)} €) augmente de ${pc} %. Quel est le nouveau prix ?`, a: n, unit: "€", ex: `Augmentation : ${pc} % de ${F(p)} = ${F(d)} €. Nouveau prix : ${F(p)} + ${F(d)} = ${F(n)} € (ou ${F(p)} × ${F(1 + pc / 100)}).` };
    },
    // TVA 21 %
    () => {
      const h = rnd(2, 60) * 10, tva = r2(h * 0.21), c = r2(h + tva);
      const obj = pick(["un smartphone", "une trottinette", "un casque audio", "une paire de baskets", "une tablette"]);
      if (pick([true, false])) return { t: "num", q: `${obj[0].toUpperCase() + obj.slice(1)} coûte ${F(h)} € hors TVA. Avec une TVA de 21 %, quel est son prix TVA comprise ?`, a: c, unit: "€", ex: `TVA : 21 % de ${F(h)} = ${F(tva)} €. Prix TVAC : ${F(h)} + ${F(tva)} = ${F(c)} € (ou ${F(h)} × 1,21).` };
      return { t: "num", q: `${obj[0].toUpperCase() + obj.slice(1)} coûte ${F(c)} € TVA comprise (TVA de 21 %). Quel est son prix hors TVA ?`, a: h, unit: "€", ex: `Prix TVAC = prix HTVA × 1,21, donc prix HTVA = ${F(c)} : 1,21 = ${F(h)} €.` };
    },
    // pourcentage d'une partie
    () => {
      const tot = pick([20, 25, 40, 50, 200]), part = rnd(1, tot - 1), pc = r2(part * 100 / tot);
      return { t: "num", q: `Lors d'une sortie scolaire, ${part} des ${tot} élèves ont choisi l'atelier escalade. Quel pourcentage des élèves cela représente-t-il ?`, a: pc, unit: "%", ex: `${part}/${tot} = ${F(part / tot)}, soit ${F(pc)} %. (Méthode : ${part} : ${tot} × 100.)` };
    },
    // vitesse moyenne
    () => {
      let v, t, d;
      do { v = pick([30, 45, 60, 72, 80, 90, 100, 120]); t = pick([30, 45, 90, 120, 150]); d = v * t / 60; } while (!Number.isInteger(d));
      const ht = t >= 60 ? `${Math.floor(t / 60)} h${t % 60 ? " " + (t % 60) + " min" : ""}` : `${t} min`;
      if (pick([true, false])) return { t: "num", q: `Un car roule pendant ${ht} à la vitesse moyenne de ${v} km/h. Quelle distance parcourt-il (en km) ?`, a: d, unit: "km", ex: `${t % 60 ? ht + " = " + F(t / 60) + " h. " : ""}Distance = vitesse × durée = ${v} × ${F(t / 60)} = ${d} km.` };
      return { t: "num", q: `Un car parcourt ${d} km en ${ht}. Quelle est sa vitesse moyenne en km/h ?`, a: v, unit: "km/h", ex: `${t % 60 ? ht + " = " + F(t / 60) + " h. " : ""}Vitesse = distance : durée = ${d} : ${F(t / 60)} = ${v} km/h.` };
    },
    // échelles
    () => {
      const e = pick([100, 200, 500, 1000, 25000, 50000, 100000]), c = rnd(2, 15);
      if (e <= 1000) {
        const m = r2(c * e / 100);
        return { t: "num", q: `Sur un plan à l'échelle 1/${e}, une longueur mesure ${c} cm. Quelle est la longueur réelle en mètres ?`, a: m, unit: "m", ex: `Réel = ${c} × ${e} = ${c * e} cm = ${F(m)} m.` };
      }
      const km = r2(c * e / 100000);
      return { t: "num", q: `Sur une carte à l'échelle 1/${e}, deux villes sont à ${c} cm l'une de l'autre. Quelle est la distance réelle en km ?`, a: km, unit: "km", ex: `Réel = ${c} × ${e} = ${c * e} cm. Et 1 km = 100 000 cm, donc ${F(km)} km.` };
    },
    // conversions
    () => {
      const C = pick([
        ["m", "cm", 100, "1 m = 100 cm"], ["km", "m", 1000, "1 km = 1 000 m"], ["cm", "mm", 10, "1 cm = 10 mm"],
        ["m²", "cm²", 10000, "1 m² = 10 000 cm² (× 100 à chaque rang pour les aires)"], ["dm²", "cm²", 100, "1 dm² = 100 cm²"],
        ["m³", "L", 1000, "1 m³ = 1 000 dm³ = 1 000 L"], ["L", "cL", 100, "1 L = 100 cL"], ["dm³", "cm³", 1000, "1 dm³ = 1 000 cm³ (× 1 000 à chaque rang pour les volumes)"],
        ["h", "min", 60, "1 h = 60 min"], ["kg", "g", 1000, "1 kg = 1 000 g"]
      ]);
      const v = rnd(2, 95) / 10, r = r2(v * C[2]);
      return { t: "num", q: `Convertis ${F(v)} ${C[0]} en ${C[1]}.`, a: r, unit: C[1], ex: `${C[3]}, donc ${F(v)} × ${C[2]} = ${F(r)} ${C[1]}.` };
    }
  ]
};

/* =========================================================
   3. ALGÈBRE
   ========================================================= */
const algebre = {
  id: "algebre",
  name: "Algèbre",
  desc: "Réduire, développer, produits remarquables, factoriser, équations et problèmes.",
  items: [
    { t: "txt", q: "Réduis : 3x + 5x − 2x", a: ["6x"], ex: "On additionne les coefficients des termes semblables : 3 + 5 − 2 = 6, donc 6x." },
    { t: "txt", q: "Réduis : 4a × 3a", a: ["12a²", "12a^2", "12aa"], ex: "On multiplie les nombres (4 × 3 = 12) et les lettres (a × a = a²) : 12a²." },
    { t: "txt", q: "Développe : 3(2x + 5)", a: ["6x+15", "15+6x"], ex: "Distributivité : 3 × 2x + 3 × 5 = 6x + 15." },
    { t: "txt", q: "Développe et réduis : (x + 2)(x + 3)", a: ["x²+5x+6", "x^2+5x+6", "6+5x+x²", "x²+6+5x"], ex: "Double distributivité : x × x + x × 3 + 2 × x + 2 × 3 = x² + 3x + 2x + 6 = x² + 5x + 6." },
    { t: "vf", q: "−(x − 4) = −x + 4", a: true, ex: "Un signe moins devant une parenthèse change le signe de chaque terme : −x + 4." },
    { t: "vf", q: "Pour tous les nombres a et b : (a + b)² = a² + b²", a: false, ex: "(a + b)² = a² + 2ab + b². Contre-exemple : (1 + 2)² = 9 mais 1² + 2² = 5." },
    { t: "qcm", q: "Développe : (x + 3)²", c: ["x² + 6x + 9", "x² + 9", "x² + 3x + 9", "2x + 6"], a: 0, ex: "(a + b)² = a² + 2ab + b² : x² + 2 × x × 3 + 3² = x² + 6x + 9." },
    { t: "qcm", q: "Développe : (2a − 5)²", c: ["4a² − 20a + 25", "4a² − 25", "4a² + 25", "4a² − 10a + 25"], a: 0, ex: "(a − b)² = a² − 2ab + b² : (2a)² − 2 × 2a × 5 + 5² = 4a² − 20a + 25." },
    { t: "qcm", q: "Développe : (x + 4)(x − 4)", c: ["x² − 16", "x² + 16", "x² − 8x + 16", "x² − 8"], a: 0, ex: "(a + b)(a − b) = a² − b² : x² − 4² = x² − 16." },
    { t: "qcm", q: "Factorise au maximum : 6x² + 9x", c: ["3x(2x + 3)", "3(2x² + 3x)", "x(6x + 9)", "3x(2x + 9)"], a: 0, ex: "Le plus grand facteur commun est 3x : 6x² = 3x × 2x et 9x = 3x × 3, donc 3x(2x + 3). Les autres réponses ne sont pas complètement factorisées ou sont fausses." },
    { t: "qcm", q: "Factorise : x² − 25", c: ["(x − 5)(x + 5)", "(x − 5)²", "(x + 5)²", "(x − 25)(x + 25)"], a: 0, ex: "C'est une différence de deux carrés : a² − b² = (a − b)(a + b) avec a = x et b = 5." },
    { t: "qcm", q: "Factorise : x² + 10x + 25", c: ["(x + 5)²", "(x + 25)²", "(x + 5)(x − 5)", "x(x + 10) + 25"], a: 0, ex: "On reconnaît a² + 2ab + b² avec a = x et b = 5 (2 × x × 5 = 10x) : (x + 5)²." },
    { t: "num", q: "Calcule la valeur numérique de 2x² − 3x + 1 pour x = −2.", a: 15, ex: "2 × (−2)² − 3 × (−2) + 1 = 2 × 4 + 6 + 1 = 15. Pense aux parenthèses quand tu remplaces x par un nombre négatif !" },
    { t: "num", q: "Pour a = 3 et b = −2, calcule a² − 2ab.", a: 21, ex: "3² − 2 × 3 × (−2) = 9 − (−12) = 9 + 12 = 21." },
    { t: "qcm", q: "Quelle expression traduit « la somme du double d'un nombre x et de 5 » ?", c: ["2x + 5", "2(x + 5)", "x² + 5", "2 + x + 5"], a: 0, ex: "On prend d'abord le double de x (2x), puis on lui ajoute 5 : 2x + 5. « Le double de la somme de x et de 5 » serait 2(x + 5)." },
    { t: "qcm", q: "Quelle expression traduit « le carré de la différence entre un nombre x et 3 » ?", c: ["(x − 3)²", "x² − 3", "x² − 3²", "2(x − 3)"], a: 0, ex: "On calcule d'abord la différence x − 3, puis on l'élève au carré : (x − 3)². « La différence des carrés » serait x² − 3²." },
    { t: "num", q: "Résous : 3x + 7 = 22", a: 5, ex: "3x = 22 − 7 = 15, donc x = 15 : 3 = 5. Vérification : 3 × 5 + 7 = 22." },
    { t: "num", q: "Résous : 5x − 4 = 2x + 14", a: 6, ex: "5x − 2x = 14 + 4, donc 3x = 18 et x = 6. Vérification : 26 = 26." },
    { t: "num", q: "Résous : 2(x − 3) = x + 4", a: 10, ex: "On développe : 2x − 6 = x + 4, donc 2x − x = 4 + 6 et x = 10." },
    { t: "num", q: "Résous : x/4 + 1 = 3", a: 8, ex: "x/4 = 3 − 1 = 2, donc x = 2 × 4 = 8." },
    { t: "num", q: "Margaux a trois fois plus de BD que son frère Lucas. À eux deux, ils en ont 48. Combien Margaux a-t-elle de BD ?", a: 36, ex: "Si Lucas a x BD, Margaux en a 3x : x + 3x = 48, donc 4x = 48 et x = 12. Margaux en a 3 × 12 = 36." },
    { t: "num", q: "Le périmètre d'un terrain rectangulaire vaut 50 m. Sa longueur mesure 5 m de plus que sa largeur. Quelle est la largeur (en m) ?", a: 10, unit: "m", ex: "Largeur x, longueur x + 5 : 2(x + x + 5) = 50, donc 4x + 10 = 50, 4x = 40 et x = 10 m (longueur 15 m)." },
    { t: "num", q: "La somme de trois nombres entiers consécutifs vaut 72. Quel est le plus petit des trois ?", a: 23, ex: "n + (n + 1) + (n + 2) = 72, donc 3n + 3 = 72, 3n = 69 et n = 23 (23 + 24 + 25 = 72)." }
  ],
  gen: [
    // équation ax + b = c
    () => {
      const x = rnd(-9, 12), a = rnd(2, 9), b = pick([-1, 1]) * rnd(1, 20), c = a * x + b;
      return { t: "num", q: `Résous : ${a}x ${T(b)} = ${F(c)}`, a: x, ex: `${a}x = ${F(c)} ${T(-b)} = ${F(c - b)}, donc x = ${F(c - b)} : ${a} = ${F(x)}. Vérification : ${a} × ${P(x)} ${T(b)} = ${F(c)}.` };
    },
    // équation ax + b = cx + d
    () => {
      const x = rnd(-6, 10), a = rnd(3, 9), c = rnd(1, a - 1), b = pick([-1, 1]) * rnd(1, 15), d = a * x + b - c * x;
      const right = `${ax(c)}${d ? " " + T(d) : ""}`;
      return { t: "num", q: `Résous : ${a}x ${T(b)} = ${right}`, a: x, ex: `On regroupe les x à gauche et les nombres à droite : ${a}x − ${ax(c)} = ${F(d)} ${T(-b)}, donc ${a - c === 1 ? `x = ${F(x)}` : `${a - c}x = ${F(d - b)} et x = ${F(d - b)} : ${a - c} = ${F(x)}`}.` };
    },
    // valeur numérique
    () => {
      const a = rnd(1, 4), b = pick([-1, 1]) * rnd(1, 6), c = rnd(-9, 9), x = pick([-4, -3, -2, -1, 1, 2, 3, 4]);
      const expr = `${a === 1 ? "" : a}x² ${b === 1 ? "+ x" : b === -1 ? "− x" : T(b) + "x"}${c ? " " + T(c) : ""}`;
      const r = a * x * x + b * x + c;
      return { t: "num", q: `Calcule la valeur numérique de ${expr} pour x = ${F(x)}.`, a: r, ex: `On remplace x par ${P(x)} : ${a} × ${P(x)}² ${T(b)} × ${P(x)}${c ? " " + T(c) : ""} = ${F(a * x * x)} ${T(b * x)}${c ? " " + T(c) : ""} = ${F(r)}.` };
    },
    // développer k(ax + b)
    () => {
      const k = rnd(2, 9), a = rnd(1, 7), b = pick([-1, 1]) * rnd(1, 9);
      const A = k * a, B = k * b;
      return { t: "txt", q: `Développe : ${k}(${ax(a)} ${T(b)})`, a: [cx(A, B), `${B}${A > 0 ? "+" : ""}${A === 1 ? "" : A}x`], ex: `Distributivité : ${k} × ${ax(a)} ${T(b).slice(0, 1)} ${k} × ${Math.abs(b)} = ${ax(A)} ${T(B)}.` };
    },
    // produits remarquables
    () => {
      const a = rnd(2, 9), k = rnd(0, 2);
      if (k === 0) return qcm(`Développe : (x + ${a})²`, `x² + ${2 * a}x + ${a * a}`, [`x² + ${a * a}`, `x² + ${a}x + ${a * a}`, `x² + ${2 * a}x + ${2 * a}`, `x² − ${2 * a}x + ${a * a}`],
        `(a + b)² = a² + 2ab + b² : x² + 2 × x × ${a} + ${a}² = x² + ${2 * a}x + ${a * a}.`);
      if (k === 1) return qcm(`Développe : (x − ${a})²`, `x² − ${2 * a}x + ${a * a}`, [`x² − ${a * a}`, `x² + ${a * a}`, `x² − ${2 * a}x − ${a * a}`, `x² − ${a}x + ${a * a}`],
        `(a − b)² = a² − 2ab + b² : x² − 2 × x × ${a} + ${a}² = x² − ${2 * a}x + ${a * a}.`);
      return qcm(`Développe : (x + ${a})(x − ${a})`, `x² − ${a * a}`, [`x² + ${a * a}`, `x² − ${2 * a}x + ${a * a}`, `x² + ${2 * a}x − ${a * a}`, `x² − ${2 * a}`],
        `(a + b)(a − b) = a² − b² : x² − ${a}² = x² − ${a * a}.`);
    },
    // factorisation
    () => {
      const a = rnd(2, 9);
      if (pick([true, false])) return qcm(`Factorise : x² − ${a * a}`, `(x − ${a})(x + ${a})`, [`(x − ${a})²`, `(x + ${a})²`, `(x − ${a * a})(x + ${a * a})`],
        `Différence de deux carrés : x² − ${a}² = (x − ${a})(x + ${a}).`);
      const k = rnd(2, 6), p = rnd(2, 9);
      return qcm(`Factorise au maximum : ${k * p}x² + ${k}x`, `${k}x(${p}x + 1)`, [`${k}x(${p}x)`, `${k}(${p}x² + x)`, `x(${k * p}x + ${k})`, `${k}x(${p}x + ${k})`],
        `Facteur commun : ${k}x. ${k * p}x² = ${k}x × ${p}x et ${k}x = ${k}x × 1, donc ${k}x(${p}x + 1). N'oublie pas le « 1 » !`);
    },
    // problèmes mis en équation
    () => {
      if (pick([true, false])) {
        const g = rnd(8, 14), d = rnd(2, 6), N = 2 * g + d;
        return { t: "num", q: `Dans la classe de Margaux, il y a ${N} élèves et ${d} filles de plus que de garçons. Combien y a-t-il de garçons ?`, a: g, ex: `Garçons : x, filles : x + ${d}. Donc 2x + ${d} = ${N}, 2x = ${N - d} et x = ${g}.` };
      }
      const n = rnd(10, 60), S = 3 * n + 3;
      return { t: "num", q: `La somme de trois nombres entiers consécutifs vaut ${S}. Quel est le plus petit des trois ?`, a: n, ex: `n + (n + 1) + (n + 2) = ${S}, donc 3n + 3 = ${S}, 3n = ${S - 3} et n = ${n} (${n} + ${n + 1} + ${n + 2} = ${S}).` };
    },
    // prix : problème avec deux articles
    () => {
      const x = rnd(3, 12), k = rnd(2, 4), e = rnd(1, 5), tot = x * k + e + x;
      return { t: "num", q: `À la cafétéria, un sandwich coûte ${e} € de plus que ${k} fois le prix d'un jus. Un jus et un sandwich coûtent ensemble ${tot} €. Combien coûte un jus (en €) ?`, a: x, unit: "€", ex: `Jus : x, sandwich : ${k}x + ${e}. Donc x + ${k}x + ${e} = ${tot}, ${k + 1}x = ${tot - e} et x = ${x} €.` };
    }
  ]
};

/* =========================================================
   4. GÉOMÉTRIE
   ========================================================= */
const geometrie = {
  id: "geometrie",
  name: "Géométrie",
  desc: "Angles, quadrilatères, transformations, repère, lieux, aires, périmètres et solides.",
  items: [
    { t: "num", q: "Dans un triangle, deux angles mesurent 48° et 67°. Quelle est l'amplitude du troisième angle ?", a: 65, unit: "°", ex: "La somme des angles d'un triangle vaut 180° : 180 − 48 − 67 = 65°." },
    { t: "num", q: "Un triangle isocèle a un angle au sommet principal de 40°. Quelle est l'amplitude de chacun des deux autres angles ?", a: 70, unit: "°", ex: "Les deux angles à la base sont égaux : (180 − 40) : 2 = 70°." },
    { t: "num", q: "Trois angles d'un quadrilatère mesurent 90°, 110° et 75°. Quelle est l'amplitude du quatrième ?", a: 85, unit: "°", ex: "La somme des angles d'un quadrilatère vaut 360° : 360 − 90 − 110 − 75 = 85°." },
    { t: "vf", q: "Deux angles opposés par le sommet ont toujours la même amplitude.", a: true, ex: "Deux droites sécantes forment deux paires d'angles opposés par le sommet, et chaque paire a la même amplitude." },
    { t: "qcm", q: "Deux droites parallèles sont coupées par une sécante. Un des angles formés mesure 65°. Que vaut l'angle alterne-interne à celui-ci ?", c: ["65°", "115°", "25°", "130°"], a: 0, ex: "Avec des droites parallèles, deux angles alternes-internes ont la même amplitude : 65°." },
    { t: "qcm", q: "Deux droites parallèles sont coupées par une sécante. Deux angles situés du même côté de la sécante, entre les parallèles (« intérieurs du même côté »), ont pour somme :", c: ["180°", "90°", "360°", "Cela dépend de la sécante"], a: 0, ex: "L'un est égal au correspondant de l'autre, qui lui est adjacent supplémentaire : leur somme vaut 180°." },
    { t: "qcm", q: "Quel quadrilatère a toujours des diagonales de même longueur qui se coupent en leur milieu, sans être forcément perpendiculaires ?", c: ["Le rectangle", "Le losange", "Le trapèze isocèle", "Le parallélogramme quelconque"], a: 0, ex: "Rectangle : diagonales de même longueur et de même milieu. Losange : perpendiculaires. Trapèze isocèle : même longueur mais pas le même milieu." },
    { t: "vf", q: "Les diagonales d'un losange sont perpendiculaires.", a: true, ex: "Dans un losange (et donc aussi dans un carré), les diagonales sont perpendiculaires et se coupent en leur milieu." },
    { t: "vf", q: "Les diagonales d'un parallélogramme ont toujours la même longueur.", a: false, ex: "Elles se coupent en leur milieu, mais n'ont la même longueur que si le parallélogramme est un rectangle." },
    { t: "qcm", q: "Dans un triangle, la droite qui passe par un sommet et par le milieu du côté opposé s'appelle :", c: ["la médiane", "la hauteur", "la médiatrice", "la bissectrice"], a: 0, ex: "Médiane : sommet → milieu du côté opposé. Hauteur : perpendiculaire au côté opposé. Médiatrice : perpendiculaire en son milieu. Bissectrice : partage l'angle en deux." },
    { t: "qcm", q: "Quel est le lieu des points situés à égale distance de deux points A et B ?", c: ["La médiatrice du segment [AB]", "Le cercle de diamètre [AB]", "La droite AB", "La bissectrice de l'angle AOB"], a: 0, ex: "Tout point de la médiatrice de [AB] est à la même distance de A et de B, et c'est le seul lieu qui a cette propriété." },
    { t: "qcm", q: "Quel est le lieu des points situés exactement à 3 cm d'un point O ?", c: ["Le cercle de centre O et de rayon 3 cm", "Le disque de centre O et de rayon 3 cm", "Le cercle de centre O et de diamètre 3 cm", "Un carré de côté 3 cm autour de O"], a: 0, ex: "Les points EXACTEMENT à 3 cm forment le cercle. Le disque contient aussi les points à moins de 3 cm." },
    { t: "qcm", q: "Quel est le lieu des points situés à égale distance des deux côtés d'un angle ?", c: ["La bissectrice de l'angle", "La médiatrice de l'angle", "La hauteur de l'angle", "Un cercle centré au sommet"], a: 0, ex: "Tout point de la bissectrice est à égale distance des deux côtés de l'angle." },
    { t: "qcm", q: "Dans un repère, quelle est l'image du point A(3 ; −2) par la symétrie centrale de centre O(0 ; 0) ?", c: ["(−3 ; 2)", "(3 ; 2)", "(−3 ; −2)", "(−2 ; 3)"], a: 0, ex: "Par la symétrie de centre O, les deux coordonnées changent de signe : (x ; y) → (−x ; −y)." },
    { t: "qcm", q: "Quelle est l'image du point A(2 ; 5) par la symétrie orthogonale d'axe « axe des abscisses » (axe horizontal) ?", c: ["(2 ; −5)", "(−2 ; 5)", "(−2 ; −5)", "(5 ; 2)"], a: 0, ex: "Par rapport à l'axe horizontal, l'abscisse reste la même et l'ordonnée change de signe : (2 ; −5)." },
    { t: "qcm", q: "Une translation applique le point (1 ; 1) sur le point (4 ; 3). Quelle est l'image du point B(−2 ; 5) par cette translation ?", c: ["(1 ; 7)", "(−5 ; 3)", "(2 ; 8)", "(1 ; 3)"], a: 0, ex: "La translation déplace de 3 vers la droite et de 2 vers le haut : (−2 + 3 ; 5 + 2) = (1 ; 7)." },
    { t: "qcm", q: "Quelle est l'image du point A(3 ; 0) par la rotation de centre O(0 ; 0) et d'amplitude 90° dans le sens contraire des aiguilles d'une montre ?", c: ["(0 ; 3)", "(0 ; −3)", "(−3 ; 0)", "(3 ; 3)"], a: 0, ex: "Le point est sur l'axe horizontal, à droite de O. Un quart de tour dans le sens contraire des aiguilles l'amène sur l'axe vertical, en haut : (0 ; 3)." },
    { t: "qcm", q: "Quelles sont les coordonnées du milieu du segment [AB] avec A(2 ; 6) et B(8 ; −2) ?", c: ["(5 ; 2)", "(10 ; 4)", "(3 ; −4)", "(5 ; 4)"], a: 0, ex: "Milieu = ((2 + 8) : 2 ; (6 + (−2)) : 2) = (5 ; 2)." },
    { t: "vf", q: "Une translation conserve les longueurs, les amplitudes des angles et le parallélisme.", a: true, ex: "Toutes les isométries (translations, rotations, symétries) conservent longueurs, angles, parallélisme et alignement." },
    { t: "vf", q: "Une symétrie orthogonale conserve le sens de rotation (l'orientation) des figures.", a: false, ex: "Une symétrie orthogonale « retourne » la figure, comme un miroir : elle change l'orientation. Translations, rotations et symétries centrales la conservent." },
    { t: "num", q: "Calcule l'aire d'un trapèze dont les bases mesurent 8 cm et 5 cm et la hauteur 4 cm.", a: 26, unit: "cm²", ex: "Aire = (grande base + petite base) × hauteur : 2 = (8 + 5) × 4 : 2 = 26 cm²." },
    { t: "num", q: "Calcule l'aire d'un disque de rayon 5 cm (prends π ≈ 3,14).", a: 78.5, unit: "cm²", ex: "Aire = π × r² = 3,14 × 5 × 5 = 3,14 × 25 = 78,5 cm²." },
    { t: "num", q: "Calcule le périmètre d'un cercle de diamètre 10 cm (prends π ≈ 3,14).", a: 31.4, unit: "cm", ex: "Périmètre = π × diamètre = 3,14 × 10 = 31,4 cm (ou 2 × π × r)." },
    { t: "num", q: "Calcule l'aire d'un triangle de base 12 cm et de hauteur 7 cm.", a: 42, unit: "cm²", ex: "Aire = base × hauteur : 2 = 12 × 7 : 2 = 42 cm²." },
    { t: "num", q: "Calcule l'aire d'un parallélogramme de base 9 cm et de hauteur 4 cm.", a: 36, unit: "cm²", ex: "Aire = base × hauteur = 9 × 4 = 36 cm² (on ne divise pas par 2, contrairement au triangle)." },
    { t: "num", q: "Combien d'arêtes possède un prisme droit à base triangulaire ?", a: 9, ex: "3 arêtes pour la base du dessous, 3 pour celle du dessus et 3 arêtes latérales : 9 arêtes (avec 6 sommets et 5 faces)." },
    { t: "num", q: "Combien de sommets possède une pyramide à base carrée ?", a: 5, ex: "Les 4 sommets du carré de base et le sommet de la pyramide : 5 sommets (avec 8 arêtes et 5 faces)." },
    { t: "num", q: "Calcule le volume d'un pavé droit de 5 cm sur 4 cm sur 3 cm.", a: 60, unit: "cm³", ex: "Volume = longueur × largeur × hauteur = 5 × 4 × 3 = 60 cm³." },
    { t: "vf", q: "Le développement d'un cube est formé de 6 carrés identiques.", a: true, ex: "Un cube a 6 faces carrées de même taille ; son développement (patron) contient donc 6 carrés." }
  ],
  gen: [
    // troisième angle d'un triangle
    () => {
      const a = rnd(20, 100), b = rnd(20, 60), c = 180 - a - b;
      return { t: "num", q: `Dans le triangle ABC, l'angle A mesure ${a}° et l'angle B mesure ${b}°. Quelle est l'amplitude de l'angle C ?`, a: c, unit: "°", ex: `Somme des angles d'un triangle : 180°. Donc 180 − ${a} − ${b} = ${c}°.` };
    },
    // quatrième angle d'un quadrilatère
    () => {
      let a, b, c, d;
      do { a = rnd(50, 140); b = rnd(50, 140); c = rnd(50, 140); d = 360 - a - b - c; } while (d < 40 || d > 170);
      return { t: "num", q: `Trois angles d'un quadrilatère mesurent ${a}°, ${b}° et ${c}°. Quelle est l'amplitude du quatrième ?`, a: d, unit: "°", ex: `Somme des angles d'un quadrilatère : 360°. Donc 360 − ${a} − ${b} − ${c} = ${d}°.` };
    },
    // angles et parallèles
    () => {
      const x = rnd(25, 155);
      if (x === 90) return { t: "num", q: "Deux droites parallèles sont coupées par une sécante qui leur est perpendiculaire. Quelle est l'amplitude de chacun des angles formés ?", a: 90, unit: "°", ex: "La sécante est perpendiculaire : tous les angles sont droits, 90°." };
      const k = rnd(0, 2);
      if (k === 0) return { t: "num", q: `Deux droites parallèles sont coupées par une sécante. Un angle mesure ${x}°. Quelle est l'amplitude de l'angle qui lui est correspondant ?`, a: x, unit: "°", ex: `Avec des parallèles, deux angles correspondants ont la même amplitude : ${x}°.` };
      if (k === 1) return { t: "num", q: `Deux droites parallèles sont coupées par une sécante. Un angle mesure ${x}°. Quelle est l'amplitude de l'angle qui lui est alterne-interne ?`, a: x, unit: "°", ex: `Avec des parallèles, deux angles alternes-internes ont la même amplitude : ${x}°.` };
      return { t: "num", q: `Deux droites sécantes forment un angle de ${x}°. Quelle est l'amplitude de l'angle qui lui est adjacent (sur la même droite) ?`, a: 180 - x, unit: "°", ex: `Deux angles adjacents formant un angle plat sont supplémentaires : 180 − ${x} = ${180 - x}°. (L'angle opposé par le sommet, lui, mesure aussi ${x}°.)` };
    },
    // aires de figures
    () => {
      const k = rnd(0, 3);
      if (k === 0) { const L = rnd(4, 15), l = rnd(2, L - 1); return { t: "num", q: `Calcule l'aire d'un rectangle de ${L} cm sur ${l} cm.`, a: L * l, unit: "cm²", ex: `Aire = longueur × largeur = ${L} × ${l} = ${L * l} cm².` }; }
      if (k === 1) { const b = rnd(3, 16), h = rnd(2, 12); return { t: "num", q: `Calcule l'aire d'un triangle de base ${b} cm et de hauteur ${h} cm.`, a: b * h / 2, unit: "cm²", ex: `Aire = base × hauteur : 2 = ${b} × ${h} : 2 = ${F(b * h / 2)} cm².` }; }
      if (k === 2) { const b = rnd(3, 15), h = rnd(2, 10); return { t: "num", q: `Calcule l'aire d'un parallélogramme de base ${b} cm et de hauteur ${h} cm.`, a: b * h, unit: "cm²", ex: `Aire = base × hauteur = ${b} × ${h} = ${b * h} cm².` }; }
      const B = rnd(6, 16), b = rnd(2, B - 1), h = rnd(2, 10), A = (B + b) * h / 2;
      return { t: "num", q: `Calcule l'aire d'un trapèze de bases ${B} cm et ${b} cm, et de hauteur ${h} cm.`, a: A, unit: "cm²", ex: `Aire = (B + b) × h : 2 = (${B} + ${b}) × ${h} : 2 = ${B + b} × ${h} : 2 = ${F(A)} cm².` };
    },
    // disque et cercle
    () => {
      const r = rnd(2, 12);
      if (pick([true, false])) { const A = r2(3.14 * r * r); return { t: "num", q: `Calcule l'aire d'un disque de rayon ${r} cm (prends π ≈ 3,14).`, a: A, tol: 0.01, unit: "cm²", ex: `Aire = π × r² = 3,14 × ${r} × ${r} = 3,14 × ${r * r} = ${F(A)} cm².` }; }
      const p = r2(2 * 3.14 * r);
      if (pick([true, false])) return { t: "num", q: `Calcule le périmètre d'un cercle de rayon ${r} cm (prends π ≈ 3,14).`, a: p, tol: 0.01, unit: "cm", ex: `Périmètre = 2 × π × r = 2 × 3,14 × ${r} = ${F(p)} cm.` };
      return { t: "num", q: `La roue du vélo de Margaux a un diamètre de ${2 * r} dm. Quelle distance (en dm) parcourt-elle en un tour complet (prends π ≈ 3,14) ?`, a: p, tol: 0.01, unit: "dm", ex: `Un tour = le périmètre de la roue = π × diamètre = 3,14 × ${2 * r} = ${F(p)} dm.` };
    },
    // image d'un point par une symétrie
    () => {
      let x, y;
      do { x = rnd(-7, 7); y = rnd(-7, 7); } while (!x || !y || Math.abs(x) === Math.abs(y));
      const k = rnd(0, 2);
      const all = [pt(-x, -y), pt(x, -y), pt(-x, y), pt(y, x), pt(-y, -x)];
      if (k === 0) return qcm(`Quelle est l'image du point A${pt(x, y)} par la symétrie centrale de centre O(0 ; 0) ?`, pt(-x, -y), all,
        `Par la symétrie de centre O, les deux coordonnées changent de signe : ${pt(x, y)} → ${pt(-x, -y)}.`);
      if (k === 1) return qcm(`Quelle est l'image du point A${pt(x, y)} par la symétrie orthogonale d'axe « axe des abscisses » (horizontal) ?`, pt(x, -y), all,
        `Par rapport à l'axe horizontal, l'abscisse reste ${F(x)} et l'ordonnée change de signe : ${pt(x, -y)}.`);
      return qcm(`Quelle est l'image du point A${pt(x, y)} par la symétrie orthogonale d'axe « axe des ordonnées » (vertical) ?`, pt(-x, y), all,
        `Par rapport à l'axe vertical, l'ordonnée reste ${F(y)} et l'abscisse change de signe : ${pt(-x, y)}.`);
    },
    // milieu d'un segment
    () => {
      const x1 = rnd(-8, 8), y1 = rnd(-8, 8), x2 = x1 + 2 * rnd(-5, 5), y2 = y1 + 2 * pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      return qcm(`Quelles sont les coordonnées du milieu du segment [AB] avec A${pt(x1, y1)} et B${pt(x2, y2)} ?`, pt(mx, my),
        [pt(x1 + x2, y1 + y2), pt((x2 - x1) / 2, (y2 - y1) / 2), pt(my, mx), pt(mx + 1, my - 1), pt(mx - 1, my + 1)],
        `Milieu = ((${F(x1)} ${T(x2)}) : 2 ; (${F(y1)} ${T(y2)}) : 2) = ${pt(mx, my)}. On fait la moyenne des abscisses et celle des ordonnées.`);
    },
    // translation dans un repère
    () => {
      const a = pick([-1, 1]) * rnd(1, 6), b = pick([-1, 1]) * rnd(1, 6), x = rnd(-6, 6), y = rnd(-6, 6);
      return qcm(`Une translation déplace chaque point de ${Math.abs(a)} ${a > 0 ? "vers la droite" : "vers la gauche"} et de ${Math.abs(b)} ${b > 0 ? "vers le haut" : "vers le bas"}. Quelle est l'image du point P${pt(x, y)} ?`, pt(x + a, y + b),
        [pt(x - a, y - b), pt(x + b, y + a), pt(x + a, y - b), pt(x - a, y + b)],
        `On ajoute ${F(a)} à l'abscisse et ${F(b)} à l'ordonnée : (${F(x)} ${T(a)} ; ${F(y)} ${T(b)}) = ${pt(x + a, y + b)}.`);
    },
    // volume d'un pavé / d'un cube
    () => {
      if (pick([true, false])) { const c = rnd(2, 10); return { t: "num", q: `Calcule le volume d'un cube d'arête ${c} cm.`, a: c ** 3, unit: "cm³", ex: `Volume = arête × arête × arête = ${c} × ${c} × ${c} = ${c ** 3} cm³.` }; }
      const L = rnd(3, 12), l = rnd(2, 9), h = rnd(2, 8);
      return { t: "num", q: `Une boîte a la forme d'un pavé droit de ${L} cm sur ${l} cm sur ${h} cm. Quel est son volume ?`, a: L * l * h, unit: "cm³", ex: `Volume = L × l × h = ${L} × ${l} × ${h} = ${L * l * h} cm³.` };
    }
  ]
};

/* =========================================================
   5. STATISTIQUES & PROBABILITÉS
   ========================================================= */
const CTX_SPORT = "Sport préféré des 25 élèves de 2e B\nFootball : 8\nNatation : 5\nBasket : 3\nDanse : 6\nTennis : 3";
const CTX_NOTES = "Résultats de l'interro de maths (sur 20)\nNote : 10 | 12 | 14 | 16 | 18\nEffectif : 2 | 5 | 6 | 4 | 3";
const stats = {
  id: "stats",
  name: "Statistiques & probabilités",
  desc: "Moyenne, médiane, mode, étendue, fréquences, diagrammes et probabilités.",
  items: [
    { t: "num", q: "Margaux a obtenu ces notes sur 20 : 12 ; 15 ; 9 ; 14 ; 10. Quelle est sa moyenne ?", a: 12, ex: "Somme : 12 + 15 + 9 + 14 + 10 = 60. Moyenne : 60 : 5 = 12." },
    { t: "num", q: "Quelle est la médiane de la série : 3 ; 8 ; 5 ; 12 ; 7 ?", a: 7, ex: "On range d'abord : 3 ; 5 ; 7 ; 8 ; 12. Il y a 5 valeurs, la médiane est la 3e : 7." },
    { t: "num", q: "Quelle est la médiane de la série : 2 ; 9 ; 4 ; 7 ?", a: 5.5, ex: "Rangée : 2 ; 4 ; 7 ; 9. Nombre pair de valeurs : on fait la moyenne des deux du milieu, (4 + 7) : 2 = 5,5." },
    { t: "num", q: "Quelle est l'étendue de la série : 14 ; 8 ; 19 ; 11 ?", a: 11, ex: "Étendue = plus grande valeur − plus petite valeur = 19 − 8 = 11." },
    { t: "num", q: "Températures relevées à 8 h pendant une semaine d'hiver (°C) : −3 ; 2 ; −1 ; 4 ; 3. Quelle est la température moyenne ?", a: 1, unit: "°C", ex: "Somme : −3 + 2 − 1 + 4 + 3 = 5. Moyenne : 5 : 5 = 1 °C." },
    { t: "num", q: "Margaux a eu 12, 14 et 13 sur 20 à ses trois premières interros. Quelle note doit-elle avoir à la 4e pour obtenir exactement 14 de moyenne ?", a: 17, ex: "Pour 14 de moyenne sur 4 interros, il faut un total de 4 × 14 = 56. Elle a déjà 12 + 14 + 13 = 39, il lui faut donc 56 − 39 = 17." },
    { t: "num", q: "La moyenne de 5 nombres vaut 11. Quelle est leur somme ?", a: 55, ex: "Moyenne = somme : nombre de valeurs, donc somme = 11 × 5 = 55." },
    { t: "vf", q: "La moyenne d'une série est toujours une des valeurs de la série.", a: false, ex: "Exemple : la moyenne de 1 et 2 vaut 1,5, qui n'est pas dans la série." },
    { t: "qcm", q: "Dans une série de notes, une note très basse (0/20) s'ajoute. Laquelle de ces valeurs est en général la moins influencée ?", c: ["La médiane", "La moyenne", "L'étendue", "La somme des notes"], a: 0, ex: "La médiane ne dépend que du rang des valeurs : une valeur extrême ne la déplace que très peu, alors que la moyenne, l'étendue et la somme changent beaucoup." },
    { t: "num", ctx: CTX_SPORT, q: "Quel pourcentage des élèves préfèrent la natation ?", a: 20, unit: "%", ex: "Fréquence = 5/25 = 0,2 = 20 %." },
    { t: "num", ctx: CTX_SPORT, q: "Quel pourcentage des élèves préfèrent la danse ?", a: 24, unit: "%", ex: "Fréquence = 6/25 = 0,24 = 24 %." },
    { t: "qcm", ctx: CTX_SPORT, q: "Quel est le mode de cette série ?", c: ["Le football", "La danse", "8", "Le tennis"], a: 0, ex: "Le mode est la valeur la plus fréquente : le football (8 élèves). Attention, le mode est la valeur (le sport), pas l'effectif 8." },
    { t: "num", ctx: CTX_NOTES, q: "Combien d'élèves ont passé l'interro ?", a: 20, ex: "On additionne les effectifs : 2 + 5 + 6 + 4 + 3 = 20." },
    { t: "num", ctx: CTX_NOTES, q: "Quelle est la moyenne de la classe (moyenne pondérée) ?", a: 14.1, ex: "Somme des notes : 10 × 2 + 12 × 5 + 14 × 6 + 16 × 4 + 18 × 3 = 20 + 60 + 84 + 64 + 54 = 282. Moyenne : 282 : 20 = 14,1." },
    { t: "num", ctx: CTX_NOTES, q: "Quelle est la note médiane ?", a: 14, ex: "20 notes : la médiane est entre la 10e et la 11e. Effectifs cumulés : 2, 7, 13… La 10e et la 11e sont 14, donc médiane = 14." },
    { t: "num", ctx: CTX_NOTES, q: "Quelle est l'étendue des notes ?", a: 8, ex: "18 − 10 = 8." },
    { t: "qcm", q: "On lance un dé équilibré à 6 faces. Quelle est la probabilité d'obtenir un nombre pair ?", c: ["1/2", "1/3", "1/6", "2/3"], a: 0, ex: "3 cas favorables (2, 4, 6) sur 6 cas possibles : 3/6 = 1/2." },
    { t: "qcm", q: "On lance un dé équilibré à 6 faces. Quelle est la probabilité d'obtenir un nombre supérieur à 4 ?", c: ["1/3", "1/2", "2/3", "1/6"], a: 0, ex: "Supérieur à 4 : 5 et 6, soit 2 cas sur 6 : 2/6 = 1/3." },
    { t: "qcm", q: "Une urne contient 3 boules rouges, 5 bleues et 2 vertes. On tire une boule au hasard. Quelle est la probabilité qu'elle soit bleue ?", c: ["1/2", "1/5", "5/8", "1/3"], a: 0, ex: "5 boules bleues sur 3 + 5 + 2 = 10 boules : 5/10 = 1/2." },
    { t: "qcm", q: "On tire une carte au hasard dans un jeu de 52 cartes. Quelle est la probabilité de tirer un roi ?", c: ["1/13", "1/4", "1/52", "4/13"], a: 0, ex: "Il y a 4 rois sur 52 cartes : 4/52 = 1/13." },
    { t: "vf", q: "Une probabilité peut valoir 1,2.", a: false, ex: "Une probabilité est toujours comprise entre 0 (impossible) et 1 (certain)." }
  ],
  gen: [
    // moyenne simple
    () => {
      let n, m, v;
      do { n = rnd(4, 6); m = rnd(9, 16); v = Array.from({ length: n - 1 }, () => rnd(m - 5, m + 5)); v.push(n * m - v.reduce((s, x) => s + x, 0)); } while (v[n - 1] < 0 || v[n - 1] > 20);
      const who = pick(["Margaux", "Lucas", "Inès", "Noah"]);
      return { t: "num", q: `${who} a obtenu ces notes sur 20 : ${v.join(" ; ")}. Quelle est sa moyenne ?`, a: m, ex: `Somme : ${v.join(" + ")} = ${n * m}. Moyenne : ${n * m} : ${n} = ${m}.` };
    },
    // médiane
    () => {
      const n = pick([5, 6, 7]), v = Array.from({ length: n }, () => rnd(1, 30)), s = [...v].sort((a, b) => a - b);
      const med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
      const ex = n % 2 ? `Rangée : ${s.join(" ; ")}. ${n} valeurs : la médiane est la ${(n + 1) / 2}e, soit ${med}.`
        : `Rangée : ${s.join(" ; ")}. ${n} valeurs (nombre pair) : moyenne des deux valeurs du milieu, (${s[n / 2 - 1]} + ${s[n / 2]}) : 2 = ${F(med)}.`;
      return { t: "num", q: `Quelle est la médiane de la série : ${v.join(" ; ")} ?`, a: med, ex };
    },
    // étendue (températures)
    () => {
      const v = Array.from({ length: 6 }, () => rnd(-8, 15)), mx = Math.max(...v), mn = Math.min(...v);
      return { t: "num", q: `Températures relevées à midi pendant 6 jours (°C) : ${v.map(F).join(" ; ")}. Quelle est l'étendue de cette série ?`, a: mx - mn, unit: "°C", ex: `Étendue = plus grande − plus petite = ${F(mx)} − ${P(mn)} = ${mx - mn} °C.` };
    },
    // note nécessaire pour une moyenne
    () => {
      let k, v, t, x;
      do { k = rnd(3, 4); v = Array.from({ length: k }, () => rnd(8, 18)); t = rnd(11, 16); x = t * (k + 1) - v.reduce((s, y) => s + y, 0); } while (x < 8 || x > 20);
      const s = v.reduce((a, b) => a + b, 0);
      return { t: "num", q: `Margaux a obtenu ${v.join(", ")} sur 20 à ses ${k} premières interros. Quelle note doit-elle avoir à la suivante pour obtenir exactement ${t} de moyenne ?`, a: x, ex: `Pour ${t} de moyenne sur ${k + 1} interros, il faut un total de ${k + 1} × ${t} = ${t * (k + 1)}. Elle a déjà ${s}, il lui faut donc ${t * (k + 1)} − ${s} = ${x}.` };
    },
    // moyenne pondérée à partir d'un tableau
    () => {
      const notes = [8, 10, 12, 14, 16], eff = notes.map(() => rnd(1, 7)), N = eff.reduce((a, b) => a + b, 0);
      const S = notes.reduce((s, x, i) => s + x * eff[i], 0), m = Math.round(S / N * 10) / 10;
      const ctx = `Résultats d'un contrôle (sur 20)\nNote : ${notes.join(" | ")}\nEffectif : ${eff.join(" | ")}`;
      return { t: "num", ctx, q: `Calcule la moyenne de la classe, arrondie au dixième.`, a: m, ex: `Somme : ${notes.map((x, i) => `${x} × ${eff[i]}`).join(" + ")} = ${S}. Effectif total : ${N}. Moyenne : ${S} : ${N} ${m * N === S ? "=" : "≈"} ${F(m)}.` };
    },
    // probabilité dans une urne
    () => {
      const cols = ["rouges", "bleues", "vertes"], n = cols.map(() => rnd(1, 8)), N = n[0] + n[1] + n[2], i = rnd(0, 2);
      const c = n[i], good = FR(c, N);
      return qcm(`Une urne contient ${n[0]} boules rouges, ${n[1]} bleues et ${n[2]} vertes. On tire une boule au hasard. Quelle est la probabilité qu'elle soit ${cols[i].slice(0, -1)} ?`, good,
        [FR(c, N - c), FR(N - c, N), "1/3", FR(1, c), FR(c, N + 1)],
        `Cas favorables : ${c} ; cas possibles : ${n.join(" + ")} = ${N}. Probabilité : ${c}/${N}${frac(c, N) !== `${c}/${N}` ? ` = ${good}` : ""}.`);
    },
    // fréquence en %
    () => {
      const tot = pick([20, 25, 50]), part = rnd(1, tot - 1), pc = r2(part * 100 / tot);
      const act = pick(["viennent à l'école à vélo", "ont un animal de compagnie", "jouent d'un instrument", "pratiquent un sport en club"]);
      return { t: "num", q: `Sur les ${tot} élèves interrogés, ${part} ${act}. Quelle est la fréquence de cette réponse, en pourcentage ?`, a: pc, unit: "%", ex: `Fréquence = effectif : effectif total = ${part} : ${tot} = ${F(part / tot)}, soit ${F(pc)} %.` };
    }
  ]
};

export default {
  id: "math",
  name: "Mathématiques",
  icon: "📐",
  themes: [nombres, proportion, algebre, geometrie, stats]
};
