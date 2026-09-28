/* =========================================================
   Wesh Words — 🪂 Parachute de série (V04-003)
   ---------------------------------------------------------
   Mécanique (langue obligatoire de l'enfant uniquement) :
   - Chaque enfant démarre avec 1 Parachute.
   - 10 jours de LEÇON RÉUSSIE de suite (série réelle) = +1 Parachute (compteur remis à 0).
   - Si un jour est manqué et qu'au moins 1 Parachute est disponible : il est utilisé
     automatiquement, la série (le 🔥) continue normalement, mais ce jour est marqué à part
     dans le calendrier (couleur différente) — et il NE COMPTE PAS dans les 10 jours (ni +1,
     ni retour à 0 : il est simplement neutre).
   - Si aucun Parachute n'est disponible, un jour manqué casse la série comme avant.
   - Un Parachute supplémentaire est offert le jour de l'anniversaire de l'enfant (une fois par an).
   ========================================================= */

export const FREEZE_TARGET = 10;

export const DEFAULT_STREAKFREEZE = { count: 1, progress: 0, frozen: {}, lastEvalDay: null, lastBirthdayYear: null };

/**
 * Fait avancer l'état du Parachute jour par jour, du dernier jour déjà évalué jusqu'à hier
 * (jamais "aujourd'hui", qui n'est pas terminé), puis vérifie l'anniversaire du jour.
 * Pure (aucun accès réseau) : à l'appelant de persister `state` si `events.length` ou si
 * l'état a changé par rapport à `prev`.
 *
 * @param prev          état précédent (peut être {} / undefined pour un nouvel enfant)
 * @param sessionsByDay { 'YYYY-MM-DD': { completed } } — sessions de la langue obligatoire
 * @param today         'YYYY-MM-DD' du jour courant
 * @param offsetFn      dayKeyOffset(key, delta) de app.js
 * @param birth         'YYYY-MM-DD' (date de naissance) ou "" / undefined
 */
export function evaluateStreakFreeze(prev, sessionsByDay, today, offsetFn, birth) {
  const state = { ...DEFAULT_STREAKFREEZE, ...(prev || {}), frozen: { ...((prev && prev.frozen) || {}) } };
  const events = [];

  if (!state.lastEvalDay) {
    // Première activation de la fonctionnalité pour cet enfant : on ne va pas fouiller
    // rétroactivement tout son historique de séries passées, on démarre le compteur à partir
    // d'aujourd'hui (le Parachute de départ, lui, est déjà dans `count` par défaut).
    state.lastEvalDay = offsetFn(today, -1);
  } else {
    let d = offsetFn(state.lastEvalDay, 1);
    let guard = 0;
    while (d < today && guard++ < 3660) {
      const done = !!(sessionsByDay && sessionsByDay[d] && sessionsByDay[d].completed);
      if (done) {
        state.progress++;
        if (state.progress >= FREEZE_TARGET) {
          state.count++;
          state.progress = 0;
          events.push({ type: "earned", day: d });
        }
      } else if (state.count > 0) {
        state.count--;
        state.frozen[d] = true;
        events.push({ type: "used", day: d });
        // ne touche pas à state.progress : un jour "sauvé" ne compte ni pour ni contre les 10 jours.
      } else {
        state.progress = 0;
      }
      state.lastEvalDay = d;
      d = offsetFn(d, 1);
    }
  }

  if (birth && /^\d{4}-\d{2}-\d{2}$/.test(birth) && birth.slice(5) === today.slice(5)) {
    const year = Number(today.slice(0, 4));
    if (state.lastBirthdayYear !== year) {
      state.count++;
      state.lastBirthdayYear = year;
      events.push({ type: "birthday", day: today });
    }
  }

  return { state, events };
}

export const isFrozenDay = (state, dayKey) => !!(state && state.frozen && state.frozen[dayKey]);
