/* =========================================================
   Wesh Words — points des séries & puzzle à collectionner (V02-001)
   ========================================================= */
export const PUZZLES = ["assets/puzzle-1.webp", "assets/puzzle-2.webp", "assets/puzzle-3.webp", "assets/puzzle-4.webp", "assets/puzzle-5.webp", "assets/puzzle-6.webp"];
export const PIECES = 12; // 4 colonnes × 3 lignes
const ORDER = [5, 0, 10, 3, 8, 1, 11, 6, 2, 9, 4, 7]; // ordre d'apparition des morceaux

/** Réussite d'une série de 20 : 20 bonnes réponses / tentatives */
export const accuracy = errors => Math.round(20 / (20 + (errors || 0)) * 100);
/** Points d'une série : 100, −5 par erreur, −2 par aide, +20 si zéro faute (minimum 10) */
export function seriesPoints(errors = 0, helped = 0) {
  return Math.max(10, 100 - 5 * errors - 2 * helped + (errors === 0 ? 20 : 0));
}
/** Un morceau de puzzle est gagné si la réussite dépasse 90 % (2 erreurs maximum) */
export const earnsPiece = errors => accuracy(errors) > 90;

/** État du puzzle à partir du nombre total de morceaux gagnés */
export function puzzleState(total) {
  const done = Math.floor(total / PIECES);          // puzzles complétés
  const inCur = total % PIECES;                      // morceaux du puzzle en cours
  const idx = done % PUZZLES.length;
  return { total, done, inCur, img: PUZZLES[idx], idx, shown: new Set(ORDER.slice(0, inCur)), completedImgs: Array.from({ length: done }, (_, i) => PUZZLES[i % PUZZLES.length]) };
}
/** Grille HTML 4×3 ; highlight = index de la pièce à animer */
export function puzzleGrid(img, shown, highlight = -1, full = false) {
  let h = `<div class="puzzle">`;
  for (let i = 0; i < PIECES; i++) {
    const x = (i % 4) * (100 / 3), y = Math.floor(i / 4) * 50;
    const on = full || shown.has(i);
    h += `<div class="pz ${on ? "on" : ""} ${i === highlight ? "new" : ""}" style="${on ? `background-image:url('${img}');background-position:${x}% ${y}%` : ""}">${on ? "" : "?"}</div>`;
  }
  return h + `</div>`;
}
export const pieceOrderIndex = n => ORDER[(n - 1) % PIECES]; // pièce révélée par le n-ième morceau du puzzle en cours
