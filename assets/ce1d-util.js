/* =========================================================
   Wesh Words — CE1D : outils pour les banques d'exercices (V02-001)
   ========================================================= */
/** entier aléatoire entre a et b inclus */
export const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
/** élément au hasard */
export const pick = arr => arr[Math.floor(Math.random() * arr.length)];
/** nombre au format belge : virgule décimale, max 2 décimales */
export const fr = x => String(Math.round(x * 100) / 100).replace(".", ",");
/** plus grand commun diviseur */
export const pgcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
/** fraction irréductible sous forme de texte « a/b » */
export const frac = (n, d) => { const g = pgcd(n, d); n /= g; d /= g; if (d < 0) { n = -n; d = -d; } return d === 1 ? String(n) : `${n}/${d}`; };
