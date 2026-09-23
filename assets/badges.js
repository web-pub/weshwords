/* =========================================================
   Wesh Words — badges et trophées (V01-005)
   Les titres / descriptions sont éditables (Super Admin →
   Contenus → groupe « Badges ») : clés badge.<id>.t / .d
   ========================================================= */
import { dayKeyOffset } from "./app.js";

/* need : seuil à atteindre · val : valeur actuelle (pour la barre de progression) */
export const BADGES = [
  { id: "premier",    icon: "🌱", need: 1,   val: s => s.completedDays },
  { id: "serie3",     icon: "🔥", need: 3,   val: s => s.bestStreak },
  { id: "serie7",     icon: "⚡", need: 7,   val: s => s.bestStreak },
  { id: "serie14",    icon: "🚀", need: 14,  val: s => s.bestStreak },
  { id: "serie30",    icon: "👑", need: 30,  val: s => s.bestStreak },
  { id: "jours10",    icon: "📅", need: 10,  val: s => s.completedDays },
  { id: "jours50",    icon: "🗓️", need: 50,  val: s => s.completedDays },
  { id: "semaine",    icon: "💪", need: 1,   val: s => s.fullWeeks },
  { id: "weekend",    icon: "🛋️", need: 1,   val: s => s.weekends },
  { id: "parfait",    icon: "🎯", need: 1,   val: s => s.perfectDays },
  { id: "parfait5",   icon: "💎", need: 5,   val: s => s.perfectDays },
  { id: "sansaide",   icon: "🦸", need: 5,   val: s => s.noHelpDays },
  { id: "mots25",     icon: "⭐", need: 25,  val: s => s.mastered },
  { id: "mots100",    icon: "🌟", need: 100, val: s => s.mastered },
  { id: "mots250",    icon: "💫", need: 250, val: s => s.mastered },
  { id: "mots500",    icon: "🏅", need: 500, val: s => s.mastered },
  { id: "explo",      icon: "🧭", need: 10,  val: s => s.catsPracticed },
  { id: "controle",   icon: "📝", need: 1,   val: s => s.exams },
  { id: "controle90", icon: "🧠", need: 90,  val: s => s.bestExam },
  { id: "controle100",icon: "🏆", need: 100, val: s => s.bestExam },
  { id: "bonus50",    icon: "🏋️", need: 50,  val: s => s.totalBonus },
  { id: "honte5",     icon: "💀", need: 5,   val: s => s.revealed },
  { id: "honte20",    icon: "☠️", need: 20,  val: s => s.revealed }
];

const weekday = k => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d).getDay(); };

/**
 * sessions : tableau de sessions {day, completed, errors, helped, bonus}
 * words : vocabulaire · exams : contrôles blancs · revealed : nb de hontes révélées
 */
export function badgeStats({ sessions = [], words = [], exams = [], revealed = 0 }) {
  const done = new Set(sessions.filter(s => s.completed).map(s => s.day));
  const days = [...done].sort();
  let best = 0;
  for (const d of days) {
    if (done.has(dayKeyOffset(d, -1))) continue; // pas un début de série
    let n = 0, k = d;
    while (done.has(k)) { n++; k = dayKeyOffset(k, 1); }
    best = Math.max(best, n);
  }
  let fullWeeks = 0, weekends = 0;
  for (const d of days) {
    const wd = weekday(d);
    if (wd === 1 && [1, 2, 3, 4, 5, 6].every(i => done.has(dayKeyOffset(d, i)))) fullWeeks++;
    if (wd === 6 && done.has(dayKeyOffset(d, 1))) weekends++;
  }
  const comp = sessions.filter(s => s.completed);
  const bigExams = exams.filter(x => (x.total || 0) >= 10);
  return {
    completedDays: done.size,
    bestStreak: best,
    fullWeeks, weekends,
    perfectDays: comp.filter(s => !s.errors).length,
    noHelpDays: comp.filter(s => !s.helped).length,
    mastered: words.filter(w => (w.level || 0) >= 5).length,
    catsPracticed: new Set(words.filter(w => (w.seen || 0) > 0 && w.cat).map(w => w.cat)).size,
    exams: exams.length,
    bestExam: bigExams.reduce((m, x) => Math.max(m, x.score || 0), 0),
    totalBonus: sessions.reduce((a, s) => a + (s.bonus || 0), 0),
    revealed
  };
}
export function evaluateBadges(stats) {
  return BADGES.map(b => {
    const v = b.val(stats) || 0;
    return { ...b, value: v, done: v >= b.need, pct: Math.min(100, Math.round(v / b.need * 100)) };
  });
}
/** Grille HTML des badges (T = traduction, esc = échappement, unlocked = {id: jour}) :
 *  badges obtenus d'abord, puis les 4 plus proches d'être débloqués, le reste replié */
export function badgesGrid(list, unlocked, T, esc, fmtDay, showLocked = 4) {
  const card = b => {
    const got = b.done, when = unlocked?.[b.id];
    return `<div class="badge ${got ? "on" : ""}" title="${esc(T(`badge.${b.id}.d`))}">
      <div class="bi">${got ? b.icon : "🔒"}</div>
      <div class="bt">${esc(T(`badge.${b.id}.t`))}</div>
      <div class="bd">${esc(T(`badge.${b.id}.d`))}</div>
      ${got ? `<div class="bw">${when ? esc(fmtDay(when)) : "✅"}</div>` : `<div class="bp"><i style="width:${b.pct}%"></i></div><div class="bw">${Math.min(b.value, b.need)} / ${b.need}</div>`}
    </div>`;
  };
  const got = list.filter(b => b.done).sort((a, b) => (unlocked?.[b.id] || "").localeCompare(unlocked?.[a.id] || ""));
  const locked = list.filter(b => !b.done).sort((a, b) => b.pct - a.pct);
  const first = locked.slice(0, showLocked), rest = locked.slice(showLocked);
  return `<div class="badges">${[...got, ...first].map(card).join("")}</div>` +
    (rest.length ? `<details class="more-badges"><summary>Voir les ${rest.length} autres badges à débloquer</summary><div class="badges" style="margin-top:10px">${rest.map(card).join("")}</div></details>` : "");
}
