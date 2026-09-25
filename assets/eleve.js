/* Wesh Words — espace élève */
import {
  db, $, esc, T, guard, MOODS, initPrivatePage, renderAppHeader, todayKey, dayKeyOffset, fmtDay, fmtTs, toast, errMsg,
  doc, getDoc, setDoc, updateDoc, addDoc, collection, query, where, onSnapshot, writeBatch, serverTimestamp, arrayRemove
} from "./app.js";
import { shuffle } from "./app.js";
import { findIrregular, IRREGULAR_VERBS } from "./irregular-verbs.js";
import { accuracy, seriesPoints, earnsPiece, puzzleState, puzzleGrid, pieceOrderIndex, PIECES } from "./rewards.js";
import { renderCe1dCard } from "./ce1d-ui.js";
import { badgeStats, evaluateBadges, badgesGrid } from "./badges.js";
import { runVerbs, runDictee, playDuel, buildDuelItems, duelWinner, fmtTime, DUEL_PENALTIES } from "./practice.js";
import { irregularVerbs, wordCount } from "./words.js";
import {
  checkAnswer, pickWord, nextDirection, computeStreak, speak, PER_DIRECTION, DAILY_GOAL, MAX_LEVEL,
  isLong, hintPattern, buildChoices, DEFAULT_SETTINGS, activeThemes, filterByThemes, categoriesOf
} from "./words.js";

await initPrivatePage();
const { user, profile } = await guard(["enfant"]);
renderAppHeader($("#appHead"), profile);
const uid = user.uid;
const today = todayKey();
const vars = { prenom: profile.prenom || profile.username };

let words = [];
let sessions = {};
let revealed = [];
let meta = { queue: [], lastRevealDay: "" };
let ready = { w: false, s: false };
let settings = { ...DEFAULT_SETTINGS };
let duels = [];
let puzzle = { pieces: 0, log: [] }, puzzleLoaded = false;
// --- Néerlandais (V03-002) : même moteur de quiz que l'anglais, vocabulaire et sessions séparés,
// séries toujours « libres » (pas de série obligatoire du jour), points et pièces de puzzle partagés.
let wordsNl = [], sessionsNl = {}, readyNl = { w: false, s: false };
let holdBadges = false; // pas de pop-up de badge pendant un écran de fin
let exams = [], badgesMeta = { unlocked: {} }, badgesLoaded = { m: false, x: false }, badgeQueue = [];
const pool = () => filterByThemes(words, activeThemes(settings, today).list);

const emptySession = () => ({ day: today, frEn: 0, enFr: 0, attempts: 0, errors: 0, completed: false, wrong: [], bonus: 0 });
const sess = () => sessions[today] || (sessions[today] = emptySession());
const newCur = () => ({ frEn: 0, enFr: 0, attempts: 0, errors: 0, helped: 0, wrong: [] });
const curSeries = () => { const s = sess(); if (!s.cur) s.cur = newCur(); return s.cur; };
const sessionRef = () => doc(db, "users", uid, "sessions", today);

const emptySessionNl = () => ({ day: today, series: [], cur: null });
const sessNl = () => sessionsNl[today] || (sessionsNl[today] = emptySessionNl());
const curSeriesNl = () => { const s = sessNl(); if (!s.cur) s.cur = newCur(); return s.cur; };
const sessionRefNl = () => doc(db, "users", uid, "sessionsNl", today);
function saveSessionNl() {
  const s = sessNl();
  setDoc(sessionRefNl(), { ...s }, { merge: true }).catch(e => console.warn(e));
}

/* ---------------- Flux temps réel ---------------- */
onSnapshot(collection(db, "users", uid, "words"), snap => {
  words = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  ready.w = true; boot();
}, e => { toast(errMsg(e), "err"); ready.w = true; boot(); });

onSnapshot(collection(db, "users", uid, "sessions"), snap => {
  const local = sessions[today];
  sessions = {};
  snap.docs.forEach(d => sessions[d.id] = { day: d.id, ...d.data() });
  // on ne remplace pas la session en cours si elle est plus avancée localement
  if (local && quiz.active && (!sessions[today] || (sessions[today].attempts || 0) < (local.attempts || 0))) sessions[today] = local;
  // séries en plus : la série en cours locale prime tant qu'elle est plus avancée que celle du serveur
  else if (local && quiz.active && quiz.mode === "extra" && sessions[today]) {
    const srv = sessions[today], ls = (local.series || []).length, ss = (srv.series || []).length;
    if (ls > ss || (ls === ss && (local.cur?.attempts || 0) >= (srv.cur?.attempts || 0))) { srv.series = local.series; srv.cur = local.cur; }
  }
  ready.s = true; boot();
}, e => { toast(errMsg(e), "err"); ready.s = true; boot(); });

onSnapshot(collection(db, "users", uid, "wordsNl"), snap => {
  wordsNl = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  readyNl.w = true;
  if (ready.w && ready.s && !quiz.active) renderNl();
}, () => { readyNl.w = true; });

onSnapshot(collection(db, "users", uid, "sessionsNl"), snap => {
  const local = sessionsNl[today];
  sessionsNl = {};
  snap.docs.forEach(d => sessionsNl[d.id] = { day: d.id, ...d.data() });
  if (local && quiz.active && quiz.mode === "nl") {
    const srv = sessionsNl[today] || (sessionsNl[today] = emptySessionNl());
    const ls = (local.series || []).length, ss = (srv.series || []).length;
    if (ls > ss || (ls === ss && (local.cur?.attempts || 0) >= (srv.cur?.attempts || 0))) { srv.series = local.series; srv.cur = local.cur; }
  }
  readyNl.s = true;
  if (ready.w && ready.s && !quiz.active) renderNl();
}, () => { readyNl.s = true; });

onSnapshot(query(collection(db, "users", uid, "shame"), where("revealed", "==", true)), snap => {
  revealed = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.revealedDay || "").localeCompare(a.revealedDay || ""));
  if (ready.w && ready.s) renderHome();
}, () => {});

onSnapshot(doc(db, "users", uid, "meta", "shame"), s => {
  meta = s.exists() ? { queue: [], lastRevealDay: "", ...s.data() } : { queue: [], lastRevealDay: "" };
  if (ready.w && ready.s) renderHome();
}, () => {});

onSnapshot(doc(db, "users", uid, "meta", "settings"), s => {
  settings = { ...DEFAULT_SETTINGS, ...(s.exists() ? s.data() : {}) };
  if (ready.w && ready.s) renderHome();
}, () => {});

onSnapshot(collection(db, "users", uid, "exams"), s => {
  exams = s.docs.map(d => ({ id: d.id, ...d.data() }));
  badgesLoaded.x = true;
  if (ready.w && ready.s) renderHome();
}, () => { badgesLoaded.x = true; });
onSnapshot(doc(db, "users", uid, "meta", "badges"), s => {
  const remote = s.exists() ? (s.data().unlocked || {}) : {};
  badgesMeta.unlocked = { ...remote, ...badgesMeta.unlocked };
  badgesLoaded.m = true;
  if (ready.w && ready.s) renderHome();
}, () => { badgesLoaded.m = true; });

onSnapshot(collection(db, "users", uid, "duels"), s => {
  duels = s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.seconds || 9e12) - (a.createdAt?.seconds || 9e12));
  if (ready.w && ready.s) renderHome();
}, () => {});

onSnapshot(doc(db, "users", uid, "meta", "puzzle"), s => {
  puzzle = s.exists() ? { pieces: 0, log: [], ...s.data() } : { pieces: 0, log: [] };
  puzzleLoaded = true;
  if (ready.w && ready.s && !quiz.active) renderHome();
}, () => { puzzleLoaded = true; });

/* ---------------- Préparer le CE1D (V02-001) ---------------- */
let ce1dResults = [];
const saveCe1d = res => addDoc(collection(db, "users", uid, "ce1d"), { ...res, day: today, createdAt: serverTimestamp() });
onSnapshot(collection(db, "users", uid, "ce1d"), s => {
  ce1dResults = s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.seconds || 9e12) - (a.createdAt?.seconds || 9e12));
  if ($("#ce1dZone")) renderCe1dCard($("#ce1dZone"), ce1dResults, saveCe1d);
}, () => {});
renderCe1dCard($("#ce1dZone"), ce1dResults, saveCe1d);

function boot() {
  if (!ready.w || !ready.s) return;
  $("#loader").classList.add("hidden");
  $("#main").classList.remove("hidden");
  if (!quiz.active) renderHome();
}

/* ---------------- Accueil ---------------- */
function streak() {
  const done = new Set(Object.values(sessions).filter(s => s.completed).map(s => s.day));
  return computeStreak(done, today, dayKeyOffset);
}
function barsHTML(s, lang = "en") {
  const flag = lang === "nl" ? "🇳🇱" : "🇬🇧";
  const a = Math.min(PER_DIRECTION, s.frEn || 0), b = Math.min(PER_DIRECTION, s.enFr || 0);
  return `
    <div class="bar"><div class="t"><span>🇫🇷 → ${flag}</span><span>${a}/${PER_DIRECTION}</span></div><div class="track"><div class="fill" style="width:${a * 10}%"></div></div></div>
    <div class="bar"><div class="t"><span>${flag} → 🇫🇷</span><span>${b}/${PER_DIRECTION}</span></div><div class="track"><div class="fill" style="width:${b * 10}%"></div></div></div>`;
}
const nextShameId = () => (meta.queue || []).find(id => !((meta.dates || {})[id]) || meta.dates[id] <= today) || null;
const canReveal = () => sess().completed && !!nextShameId() && meta.lastRevealDay !== today;
const nextShameDate = () => (meta.queue || []).map(id => (meta.dates || {})[id]).filter(d => d && d > today).sort()[0] || "";
const todayShame = () => revealed.find(r => r.revealedDay === today);

function renderHome() {
  if (quiz.active) return;
  const s = sess();
  const total = Math.min(DAILY_GOAL, (s.frEn || 0) + (s.enFr || 0));
  $("#hello").textContent = T("eleve.hello", vars);
  $("#ringN").textContent = total;
  $("#ring").style.setProperty("--p", Math.round(total / DAILY_GOAL * 100));
  $("#homeBars").innerHTML = barsHTML(s);

  let act = "";
  if (!words.length) act = `<p class="note">${esc(T("eleve.empty"))}</p>`;
  else if (s.completed) {
    act = `<h3 style="color:var(--green)">${esc(T("eleve.done"))}</h3><p class="muted">${esc(T("eleve.done.text"))}</p><div class="row" style="justify-content:center">`;
    if (canReveal()) act += `<button class="btn pink" id="btnReward">🎁 ${esc(T("end.btn"))}</button>`;
    else if (todayShame()) act += `<button class="btn pink" id="btnReview">${esc(T("eleve.review"))}</button>`;
    const nSer = (s.series || []).length + 1;
    act += `<button class="btn" id="btnExtra">${esc(T(s.cur && s.cur.attempts ? "series.continue" : "series.new", { n: nSer }))}</button></div>`;
    const ser = s.series || [];
    act += `<p class="small muted" style="margin-top:8px">${esc(T("series.optional"))}</p>`;
    if (ser.length) act += `<div class="series-pills">${ser.map(x => `<span title="${x.acc}% de réussite">#${x.n} · ⭐ ${x.points}</span>`).join("")}</div>
      <p class="small muted">${esc(T("series.today", { n: ser.length, pts: ser.reduce((a, x) => a + x.points, 0) }))}</p>`;
  } else {
    act = `<button class="btn big" id="btnStart">${esc(T(s.attempts ? "eleve.continue" : "eleve.start"))}</button>`;
    if (s.attempts) act += `<p class="small muted" style="margin-top:10px">Tentatives : ${s.attempts} · erreurs : ${s.errors || 0}</p>`;
  }
  if (words.length) act += `<div style="margin-top:12px"><button class="btn soft" id="btnExam">${esc(T("exam.btn"))}</button></div>`;
  $("#homeAction").innerHTML = act;
  $("#btnExam")?.addEventListener("click", openExamSetup);
  renderThemeBar();
  // Personnage selon la situation
  const yest = sessions[dayKeyOffset(today, -1)];
  const hadHistory = Object.keys(sessions).some(k => k < today);
  let art = "ensemble", cls = "home-art scene-img";
  if (s.completed) art = "bravo";
  else if (s.attempts) { art = "reflechie"; cls = "home-art"; }
  else if (hadHistory && !(yest && yest.completed)) art = "rate";
  $("#homeArt").src = MOODS[art]; $("#homeArt").className = cls;
  $("#btnStart")?.addEventListener("click", () => startQuiz("daily"));
  $("#btnBonus")?.addEventListener("click", () => startQuiz("bonus"));
  $("#btnExtra")?.addEventListener("click", () => startQuiz("extra"));
  renderPuzzle();
  renderNl();
  $("#btnReward")?.addEventListener("click", revealShame);
  $("#btnReview")?.addEventListener("click", () => showShame(todayShame(), true));

  $("#stStreak").textContent = streak();
  $("#stMaster").textContent = words.filter(w => (w.level || 0) >= MAX_LEVEL).length;
  $("#stWords").textContent = words.length;
  $("#stShame").textContent = revealed.length;

  // calendrier 28 jours
  let cells = "";
  for (let i = 27; i >= 0; i--) {
    const k = dayKeyOffset(today, -i), ss = sessions[k];
    const cls = ss?.completed ? "ok" : (ss?.attempts ? "part" : "");
    cells += `<div class="day ${cls} ${i === 0 ? "today" : ""}" title="${esc(fmtDay(k))}">${Number(k.slice(8))}</div>`;
  }
  $("#days").innerHTML = cells;

  // collection de hontes
  $("#shameList").innerHTML = revealed.length ? `<div class="table-wrap"><table><thead><tr><th>Expression</th><th>Honte</th><th>Phrase</th><th>Débloquée</th></tr></thead><tbody>${
    revealed.map(r => `<tr><td><b>« ${esc(r.expression)} »</b></td><td class="skulls">${"💀".repeat(r.honte || 1)}</td><td class="muted">${esc(fillPrenom(r.phrase))}</td><td class="small muted">${esc(fmtDay(r.revealedDay))}</td></tr>`).join("")
  }</tbody></table></div>` : `<p class="muted">${esc(T("shame.collection.empty"))}</p>`;

  // badges
  const bl = evaluateBadges(badgeStats({ sessions: Object.values(sessions), words, exams, revealed: revealed.length }));
  $("#badgeCount").textContent = `${bl.filter(b => b.done).length} / ${bl.length}`;
  $("#badgeGrid").innerHTML = badgesGrid(bl, badgesMeta.unlocked, T, esc, fmtDay);
  checkBadges(bl);
  renderPractice();
  renderProposalsNote();

  // mots difficiles
  const hard = words.filter(w => (w.ko || 0) > 0).sort((a, b) => ((b.ko || 0) - (b.ok || 0) * .5) - ((a.ko || 0) - (a.ok || 0) * .5)).slice(0, 8);
  $("#hardList").innerHTML = hard.length ? `<div class="table-wrap"><table><thead><tr><th>Français</th><th>Anglais</th><th>Niveau</th><th>Erreurs</th><th></th></tr></thead><tbody>${
    hard.map(w => `<tr><td>${esc(w.fr)}</td><td><b>${esc(w.en)}</b></td><td>${lvlDots(w.level)}</td><td>${w.ko || 0}</td><td class="actions"><button class="icon-btn" data-say="${esc(w.en)}" title="Écouter">🔊</button></td></tr>`).join("")
  }</tbody></table></div>` : `<p class="muted">${esc(T("eleve.hard.none"))}</p>`;
  document.querySelectorAll("[data-say]").forEach(b => b.onclick = () => speak(b.dataset.say));
}
const lvlDots = l => `<span class="lvl">${Array.from({ length: MAX_LEVEL }, (_, i) => `<i class="${i < (l || 0) ? "on" : ""}"></i>`).join("")}</span>`;
const fillPrenom = s => String(s || "").replace(/\{prenom\}/g, vars.prenom);

/* ---------------- Badges ---------------- */
function checkBadges(bl) {
  if (holdBadges || !badgesLoaded.m || !badgesLoaded.x || quiz.active || !$("#overlay").classList.contains("hidden")) return;
  const fresh = bl.filter(b => b.done && !badgesMeta.unlocked[b.id]);
  if (!fresh.length) return;
  fresh.forEach(b => { badgesMeta.unlocked[b.id] = today; });
  setDoc(doc(db, "users", uid, "meta", "badges"), { unlocked: badgesMeta.unlocked }, { merge: true }).catch(e => console.warn(e));
  badgeQueue.push(...fresh);
  showNextBadge();
}
function showNextBadge() {
  const b = badgeQueue.shift();
  if (!b) { closeOverlay(); return; }
  confetti();
  openOverlay(`<div class="card center badge-pop">
    <img class="shame-art" src="${MOODS.joyeuse}" alt="">
    <h2 style="color:var(--blue-d)">${esc(T("badges.new"))}</h2>
    <div class="big-badge">${b.icon}</div>
    <h3>${esc(T(`badge.${b.id}.t`))}</h3>
    <p class="muted">${esc(T(`badge.${b.id}.d`))}</p>
    <button class="btn big" id="bgNext">${esc(T("badges.ok"))}${badgeQueue.length ? ` (+${badgeQueue.length})` : ""}</button>
  </div>`);
  $("#bgNext").onclick = showNextBadge;
}

/* ---------------- Entraînements : verbes, dictée, duel ---------------- */
const parentName = () => T("duel.parent");
function renderPractice() {
  const verbs = irregularVerbs(words, findIrregular);
  $("#btnVerbs").textContent = `${T("verbs.btn")} (${verbs.length})`;
  $("#btnVerbs").onclick = openVerbsSetup;
  $("#btnDictee").onclick = startDictee;
  $("#btnDuel").onclick = createDuel;
  $("#btnVerbs").disabled = $("#btnDictee").disabled = $("#btnDuel").disabled = !words.length;
  // Duels
  const fin = duels.filter(d => duelWinner(d));
  const w = fin.filter(d => duelWinner(d) === "child").length, l = fin.filter(d => duelWinner(d) === "parent").length;
  let html = fin.length ? `<p class="small"><b>⚔️ ${esc(vars.prenom)} ${w} – ${l} ${esc(parentName())}</b></p>` : "";
  duels.slice(0, 4).forEach(d => {
    const win = duelWinner(d);
    if (!d.child) html += `<div class="duel-row todo"><b>${esc(T("duel.challenge", { qui: parentName() }))}</b><button class="btn pink sm" data-play="${d.id}">Relever le défi</button></div>`;
    else if (!d.parent) html += `<div class="duel-row"><span>${esc(T("duel.wait", { qui: parentName() }))}</span><span class="small muted">ton score : ${d.child.score}/${d.child.total}</span></div>`;
    else {
      const lab = win === "child" ? T("duel.win") : win === "parent" ? T("duel.lose") : T("duel.tie");
      let extra = "";
      if (win === "child" && !d.penalty) extra = `<button class="btn sm" data-pen="${d.id}">😈 Choisir le gage</button>`;
      else if (d.penalty && d.penalty.for === "child" && !d.penaltyDone) extra = `<button class="btn sm" data-see="${d.id}">😈 Voir mon gage</button>`;
      else if (d.penalty) extra = `<span class="small muted">« ${esc(d.penalty.text)} » ${d.penaltyDone ? "✅" : "⏳"}</span>`;
      html += `<div class="duel-row"><span><b>${esc(lab)}</b> ${d.child.score}–${d.parent.score} <span class="small muted">${esc(fmtDay(d.day))}</span></span>${extra}</div>`;
    }
  });
  $("#duelZone").innerHTML = html;
  document.querySelectorAll("[data-play]").forEach(b => b.onclick = () => playChildDuel(duels.find(d => d.id === b.dataset.play)));
  document.querySelectorAll("[data-pen]").forEach(b => b.onclick = () => choosePenalty(duels.find(d => d.id === b.dataset.pen)));
  document.querySelectorAll("[data-see]").forEach(b => b.onclick = () => seePenalty(duels.find(d => d.id === b.dataset.see)));
}
function resultOverlay({ title, ok, total, score, wrongHTML, again }) {
  const key = score >= 90 ? "r90" : score >= 70 ? "r70" : score >= 50 ? "r50" : "r0";
  const art = score >= 90 ? MOODS.bravo : score >= 70 ? MOODS.sure : score >= 50 ? MOODS.reflechie : MOODS.rate;
  if (score >= 90) confetti();
  openOverlay(`<div class="card center">
    <img class="end-art" src="${art}" alt="" style="object-fit:contain;background:var(--card2)">
    <h2>${esc(title)}</h2>
    <div style="font:700 3rem var(--font-h)" class="grad-text">${ok} / ${total}</div>
    <p style="font-weight:800">${score}% — ${esc(T("exam." + key))}</p>
    ${wrongHTML || ""}
    <div class="row" style="justify-content:center;margin-top:12px"><button class="btn" id="prAgain">🔁 Recommencer</button><button class="btn ghost" id="ovClose">Terminer</button></div>
  </div>`);
  $("#prAgain").onclick = again;
}
function openVerbsSetup() {
  const verbs = irregularVerbs(words, findIrregular);
  if (!verbs.length) { toast(T("verbs.none"), "warn"); return; }
  openOverlay(`<div class="card">
    <h3>🔤 ${esc(T("verbs.title"))} <span class="chip">${verbs.length}</span></h3>
    <div class="field"><label class="check"><input type="radio" name="vMode" value="fr3" checked> ${esc(T("verbs.mode1"))}</label>
    <label class="check"><input type="radio" name="vMode" value="base2"> ${esc(T("verbs.mode2"))}</label></div>
    <div class="field"><label>Nombre de verbes</label><select id="vCount"><option value="10">10</option><option value="20">20</option><option value="999">Tous (${verbs.length})</option></select></div>
    <div class="table-wrap" style="max-height:26vh"><table><tbody>${verbs.map(v => `<tr><td class="small">${esc(v.forms.join(" — "))}</td><td class="small muted">${esc(v.meanings[0])}</td><td>${lvlDots(v.word.vLevel)}</td></tr>`).join("")}</tbody></table></div>
    <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn ghost" id="ovClose">Annuler</button><button class="btn" id="vStart">C'est parti 🔤</button></div>
  </div>`);
  $("#vStart").onclick = () => startVerbs(document.querySelector('input[name="vMode"]:checked').value, Number($("#vCount").value));
}
function startVerbs(mode, count) {
  holdBadges = true;
  runVerbs({
    verbs: irregularVerbs(words, findIrregular), mode, count,
    onAnswer: (v, ok) => {
      const w = v.word;
      const upd = { vLevel: ok ? Math.min(MAX_LEVEL, (w.vLevel || 0) + 1) : Math.max(0, (w.vLevel || 0) - 1), vOk: (w.vOk || 0) + (ok ? 1 : 0), vKo: (w.vKo || 0) + (ok ? 0 : 1), vLast: today };
      Object.assign(w, upd);
      updateDoc(doc(db, "users", uid, "words", w.id), upd).catch(e => console.warn(e));
      const s = sess(); s.verbs = (s.verbs || 0) + 1; if (ok) s.verbsOk = (s.verbsOk || 0) + 1;
      saveSession();
    },
    onFinish: r => resultOverlay({
      title: "🔤 " + T("verbs.title"), ok: r.ok, total: r.total, score: r.score, again: () => startVerbs(mode, count),
      wrongHTML: r.wrong.length ? `<details style="text-align:left;margin:10px 0"><summary>❌ ${r.wrong.length} verbe(s) à revoir</summary><p class="small" style="margin-top:8px">${r.wrong.map(v => `<b>${esc(v.forms.join(" — "))}</b> <span class="muted">(${esc(v.meanings[0])})</span>`).join("<br>")}</p></details>` : ""
    }),
    onQuit: () => { holdBadges = false; renderHome(); }
  });
}
function startDictee() {
  if (!("speechSynthesis" in window)) { toast(T("dictee.nosound"), "warn"); return; }
  const list = pool().filter(w => wordCount(w.en) <= 4 && w.en.length <= 40);
  if (!list.length) return;
  // mots jamais dictés ou souvent ratés en priorité
  const pick = shuffle(list).sort((a, b) => ((a.dOk || 0) - (a.dKo || 0) * 2 + Math.random() * 3) - ((b.dOk || 0) - (b.dKo || 0) * 2 + Math.random() * 3)).slice(0, 10);
  holdBadges = true;
  runDictee({
    items: pick.map(w => ({ id: w.id, en: w.en, fr: w.fr, altEn: w.altEn || [], w })),
    onAnswer: (it, ok) => {
      const w = it.w, upd = { dOk: (w.dOk || 0) + (ok ? 1 : 0), dKo: (w.dKo || 0) + (ok ? 0 : 1) };
      Object.assign(w, upd);
      updateDoc(doc(db, "users", uid, "words", w.id), upd).catch(e => console.warn(e));
      const s = sess(); s.dictee = (s.dictee || 0) + 1; if (ok) s.dicteeOk = (s.dicteeOk || 0) + 1;
      saveSession();
    },
    onFinish: r => resultOverlay({
      title: "🎧 " + T("dictee.title"), ok: r.ok, total: r.total, score: r.score, again: startDictee,
      wrongHTML: r.wrong.length ? `<details style="text-align:left;margin:10px 0"><summary>❌ ${r.wrong.length} mot(s) à revoir</summary><p class="small" style="margin-top:8px">${r.wrong.map(w => `<b>${esc(w.en)}</b> <span class="muted">(${esc(w.fr)})</span>`).join("<br>")}</p></details>` : ""
    }),
    onQuit: () => { holdBadges = false; renderHome(); }
  });
}
async function createDuel() {
  const items = buildDuelItems(pool(), words, 10);
  if (items.length < 3) return;
  openOverlay(`<div class="card center"><h2>⚔️ ${esc(T("duel.title"))}</h2><p class="muted">${esc(T("duel.help"))}</p>
    <div class="row" style="justify-content:center"><button class="btn ghost" id="ovClose">Annuler</button><button class="btn pink big" id="duStart">C'est parti ⚔️</button></div></div>`);
  $("#duStart").onclick = async () => {
    try {
      const ref = await addDoc(collection(db, "users", uid, "duels"), { createdBy: "child", day: today, items, child: null, parent: null, status: "open", createdAt: serverTimestamp() });
      playChildDuel({ id: ref.id, items, child: null, parent: null });
    } catch (e) { toast(errMsg(e), "err"); }
  };
}
function playChildDuel(d) {
  holdBadges = true;
  playDuel({
    items: d.items, who: vars.prenom,
    onFinish: async r => {
      const upd = { child: r };
      const cur = duels.find(x => x.id === d.id) || d;
      if (cur.parent) { const win = duelWinner({ child: r, parent: cur.parent }); upd.status = "done"; upd.winner = win; }
      try { await updateDoc(doc(db, "users", uid, "duels", d.id), upd); } catch (e) { toast(errMsg(e), "err"); }
      duelResult({ ...cur, ...upd });
    },
    onQuit: () => { holdBadges = false; renderHome(); }
  });
}
function duelResult(d) {
  const win = duelWinner(d);
  if (!win) {
    openOverlay(`<div class="card center"><img class="shame-art" src="${MOODS.sure}" alt=""><h2>⚔️ ${d.child.score} / ${d.child.total}</h2>
      <p class="muted">⏱ ${esc(fmtTime(d.child.timeMs))}</p><p>${esc(T("duel.wait", { qui: parentName() }))}</p>
      <button class="btn ghost" id="ovClose">Fermer</button></div>`);
    return;
  }
  const lab = win === "child" ? T("duel.win") : win === "parent" ? T("duel.lose") : T("duel.tie");
  if (win === "child") confetti();
  openOverlay(`<div class="card center">
    <img class="shame-art" src="${win === "child" ? MOODS.joyeuse : win === "parent" ? MOODS.colere : MOODS.sure}" alt="">
    <h2>${esc(lab)}</h2>
    <div class="duel-score"><div><b>${esc(vars.prenom)}</b><span>${d.child.score}/${d.child.total}</span><small>${esc(fmtTime(d.child.timeMs))}</small></div>
      <div class="vs">VS</div><div><b>${esc(parentName())}</b><span>${d.parent.score}/${d.parent.total}</span><small>${esc(fmtTime(d.parent.timeMs))}</small></div></div>
    <div class="row" style="justify-content:center;margin-top:12px">
      ${win === "child" && !d.penalty ? `<button class="btn pink" id="duPen">😈 Choisir le gage de ${esc(parentName())}</button>` : ""}
      <button class="btn ghost" id="ovClose">Fermer</button></div>
  </div>`);
  $("#duPen")?.addEventListener("click", () => choosePenalty(d));
}
function choosePenalty(d) {
  openOverlay(`<div class="card"><h3>${esc(T("duel.choose", { qui: parentName() }))}</h3>
    <div class="pen-list">${DUEL_PENALTIES.map((p, i) => `<button class="choice" data-p="${i}"><span>${esc(p)}</span></button>`).join("")}</div>
    <div class="field" style="margin-top:10px"><label>…ou ta propre expression</label><input type="text" id="penOwn" maxlength="80" placeholder="ex. Chill out, Mum!"></div>
    <div class="row" style="justify-content:flex-end"><button class="btn ghost" id="ovClose">Annuler</button><button class="btn" id="penOk">Valider mon gage</button></div></div>`);
  let chosen = "";
  document.querySelectorAll("[data-p]").forEach(b => b.onclick = () => { chosen = DUEL_PENALTIES[Number(b.dataset.p)]; document.querySelectorAll("[data-p]").forEach(x => x.classList.toggle("good", x === b)); $("#penOwn").value = ""; });
  $("#penOk").onclick = async () => {
    const text = $("#penOwn").value.trim() || chosen;
    if (!text) { toast("Choisis une expression 😈", "warn"); return; }
    try { await updateDoc(doc(db, "users", uid, "duels", d.id), { penalty: { text, for: "parent" } }); toast(`${parentName()} devra dire « ${text} » 😈`); closeOverlay(); }
    catch (e) { toast(errMsg(e), "err"); }
  };
}
function seePenalty(d) {
  openOverlay(`<div class="shame-card"><img class="shame-art" src="${MOODS.malicieuse}" alt="">
    <p class="warn">${esc(T("duel.penalty"))}</p><div class="expr" style="font-size:2rem">« ${esc(d.penalty.text)} »</div>
    <button class="btn pink block" id="penDone">${esc(T("duel.done"))}</button><button class="btn ghost block" id="ovClose" style="margin-top:10px">Plus tard</button></div>`);
  $("#penDone").onclick = async () => { try { await updateDoc(doc(db, "users", uid, "duels", d.id), { penaltyDone: true }); closeOverlay(); } catch (e) { toast(errMsg(e), "err"); } };
}

/* ---------------- Propositions de l'élève (réponse alternative / correction) ---------------- */
let proposals = [];
onSnapshot(collection(db, "users", uid, "proposals"), s => {
  proposals = s.docs.map(d => ({ id: d.id, ...d.data() }));
  if (ready.w && ready.s && !quiz.active) renderHome();
}, () => {});
async function sendProposal(p, btn) {
  const data = {
    type: p.type, wordId: p.word.id, dir: p.dir || "", given: (p.given || "").slice(0, 80),
    oldFr: p.word.fr, oldEn: p.word.en, fr: (p.fr ?? p.word.fr).slice(0, 120), en: (p.en ?? p.word.en).slice(0, 120),
    note: (p.note || "").slice(0, 200), day: today, status: "pending", createdAt: serverTimestamp()
  };
  try {
    await addDoc(collection(db, "users", uid, "proposals"), data);
    if (btn) { btn.outerHTML = `<span class="small" style="color:var(--green-d);font-weight:800">${esc(T("prop.sent", { qui: T("duel.parent") }))}</span>`; }
    else toast(T("prop.sent", { qui: T("duel.parent") }));
  } catch (e) { toast(errMsg(e), "err"); }
}
function openFixBox(w) {
  const box = $("#prBox");
  if (!box) return;
  box.innerHTML = `<div class="prop-box">
    <div class="small" style="font-weight:800;margin-bottom:6px">${esc(T("prop.fixTitle"))}</div>
    <div class="grid g2"><div><label class="small">🇫🇷 Français</label><input type="text" id="pxFr" value="${esc(w.fr)}"></div>
    <div><label class="small">🇬🇧 Anglais</label><input type="text" id="pxEn" value="${esc(w.en)}"></div></div>
    <input type="text" id="pxNote" placeholder="${esc(T("prop.notePh"))}" style="margin-top:8px">
    <div class="row" style="justify-content:flex-end;margin-top:8px"><button type="button" class="btn sm" id="pxSend">${esc(T("prop.send"))}</button></div></div>`;
  const send = () => {
    const fr = $("#pxFr").value.trim(), en = $("#pxEn").value.trim();
    if (!fr || !en || (fr === w.fr && en === w.en && !$("#pxNote").value.trim())) { toast(T("prop.nochange"), "warn"); return; }
    sendProposal({ type: "fix", word: w, fr, en, note: $("#pxNote").value.trim() }, null);
    box.innerHTML = "";
    $("#prFix")?.remove();
  };
  box.querySelectorAll("input").forEach(el => el.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); send(); } }));
  $("#pxSend").onclick = send;
  $("#pxFr").focus();
}
function renderProposalsNote() {
  const recent = proposals.filter(p => p.status !== "pending" && p.decidedDay && p.decidedDay >= dayKeyOffset(today, -7))
    .sort((a, b) => (b.decidedDay || "").localeCompare(a.decidedDay || "")).slice(0, 4);
  const pend = proposals.filter(p => p.status === "pending").length;
  const qui = T("duel.parent");
  $("#propZone").innerHTML = (pend ? `<p class="small muted">⏳ ${pend} proposition(s) en attente de ${esc(qui)}.</p>` : "") + recent.map(p => {
    const what = p.type === "alt" ? `« ${esc(p.given)} » pour ${esc(p.dir === "frEn" ? p.oldFr : p.oldEn)}` : `${esc(p.fr)} = ${esc(p.en)}`;
    return `<p class="small">${p.status === "ok" ? esc(T("prop.accepted", { qui })) : esc(T("prop.refused", { qui }))} ${what}</p>`;
  }).join("");
}

/* ---------------- Thèmes ---------------- */
function renderThemeBar() {
  const th = activeThemes(settings, today);
  const cats = new Set(words.map(w => w.cat || ""));
  const list = th.list.filter(c => cats.has(c));
  const chips = list.length ? list.map(c => `<span class="chip b">${esc(c || "Sans catégorie")}</span>`).join("") : `<span class="chip">${esc(T("eleve.themes.all"))}</span>`;
  const n = pool().length;
  let right = "";
  if (th.locked) right = `<span class="chip w">${esc(T("eleve.themes.locked"))}${th.until ? " · jusqu'au " + esc(fmtDay(th.until)) : ""}</span>`;
  else if (words.length) right = `<button class="btn ghost sm" id="btnThemes">${esc(T("eleve.themes.btn"))}</button>`;
  $("#themeBar").innerHTML = words.length ? `<span class="lbl">${esc(T("eleve.themes"))}</span>${chips}<span class="small muted">(${n} mots)</span>${right}` : "";
  $("#btnThemes")?.addEventListener("click", openThemePicker);
}
function openThemePicker() {
  const chosen = new Set(settings.childThemes || []);
  const cats = categoriesOf(words);
  openOverlay(`<div class="card">
    <h3>🎯 ${esc(T("eleve.themes.btn"))}</h3>
    <p class="muted small">${esc(T("eleve.themes.help"))}</p>
    <div class="row" style="margin-bottom:8px"><button class="btn ghost sm" id="thAll">Tout cocher</button><button class="btn ghost sm" id="thNone">Tout décocher</button></div>
    <div class="theme-list">${cats.map((c, i) => `<label class="check"><input type="checkbox" data-cat="${esc(c.cat)}" ${chosen.has(c.cat) ? "checked" : ""}> ${esc(c.cat || "Sans catégorie")} <span class="n">${c.count}</span></label>`).join("")}</div>
    <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn ghost" id="ovClose">Annuler</button><button class="btn" id="thSave">Enregistrer</button></div>
  </div>`);
  const boxes = () => [...document.querySelectorAll("#overlayInner [data-cat]")];
  $("#thAll").onclick = () => boxes().forEach(b => b.checked = true);
  $("#thNone").onclick = () => boxes().forEach(b => b.checked = false);
  $("#thSave").onclick = async () => {
    let list = boxes().filter(b => b.checked).map(b => b.dataset.cat);
    if (list.length === cats.length) list = []; // tout coché = tout le vocabulaire
    settings.childThemes = list;
    closeOverlay();
    try { await setDoc(doc(db, "users", uid, "meta", "settings"), { childThemes: list }, { merge: true }); toast("Thèmes enregistrés 🎯"); }
    catch (e) { toast(errMsg(e), "err"); }
  };
}

/* ---------------- Mode révision de contrôle ---------------- */
function openExamSetup() {
  const th = activeThemes(settings, today);
  const pre = new Set(th.list);
  const cats = categoriesOf(words);
  openOverlay(`<div class="card">
    <h3>${esc(T("exam.title"))}</h3>
    <p class="muted small">${esc(T("exam.help"))}</p>
    <div class="theme-list" style="max-height:38vh">${cats.map(c => `<label class="check"><input type="checkbox" data-xcat="${esc(c.cat)}" ${pre.has(c.cat) ? "checked" : ""}> ${esc(c.cat || "Sans catégorie")} <span class="n">${c.count}</span></label>`).join("")}</div>
    <div class="field" style="margin-top:12px"><label>Sens des questions</label>
      <select id="xDir"><option value="mix">🔀 Les deux sens (mélangés)</option><option value="frEn">🇫🇷 → 🇬🇧 uniquement</option><option value="enFr">🇬🇧 → 🇫🇷 uniquement</option></select></div>
    <p class="small" id="xCount"></p>
    <div class="row" style="justify-content:flex-end"><button class="btn ghost" id="ovClose">Annuler</button><button class="btn" id="xGo">${esc(T("exam.start"))}</button></div>
  </div>`);
  const boxes = () => [...document.querySelectorAll("#overlayInner [data-xcat]")];
  const chosen = () => boxes().filter(b => b.checked).map(b => b.dataset.xcat);
  const count = () => {
    const n = chosen().length ? words.filter(w => chosen().includes(w.cat || "")).length : 0;
    $("#xCount").innerHTML = n ? `<b>${n}</b> mot(s) à réviser${n > 120 ? " — c'est long, tu peux faire une pause à tout moment" : ""}.` : `<span class="muted">Coche au moins un thème.</span>`;
    $("#xGo").disabled = !n;
  };
  boxes().forEach(b => b.onchange = count);
  count();
  $("#xGo").onclick = () => { const t = chosen(); const d = $("#xDir").value; closeOverlay(); startExam(t, d); };
}
function examQueue(ids, dir) {
  return shuffle(ids).map(id => ({ id, dir: dir === "mix" ? (Math.random() < .5 ? "frEn" : "enFr") : dir }));
}
function startExam(themes, dir) {
  const list = words.filter(w => themes.includes(w.cat || ""));
  if (!list.length) return;
  quiz.exam = { themes, dir, round: 1, total: list.length, done: 0, ok: 0, ko: 0, helped: 0, wrong: [], queue: examQueue(list.map(w => w.id), dir), start: Date.now(), dailyToast: sess().completed };
  Object.assign(quiz, { active: true, mode: "exam", recent: [], retry: [], step: 0, lastDir: null, bonusCount: 0 });
  $("#vHome").classList.add("hidden");
  $("#vQuiz").classList.remove("hidden");
  $("#qMode").textContent = T("exam.mode");
  nextQuestion();
}
function examRetry() {
  const ex = quiz.exam;
  const ids = [...new Set(ex.wrong.map(w => w.id))];
  ex.round++; ex.total = ids.length; ex.done = 0; ex.ok = 0; ex.ko = 0; ex.retryWrong = [];
  ex.queue = examQueue(ids, ex.dir);
  $("#overlay").classList.add("hidden");
  Object.assign(quiz, { active: true, mode: "exam" });
  $("#vHome").classList.add("hidden");
  $("#vQuiz").classList.remove("hidden");
  $("#qMode").textContent = T("exam.mode") + " · 🔁";
  nextQuestion();
}
async function finishExam() {
  const ex = quiz.exam;
  holdBadges = true;
  stopQuiz();
  const score = ex.total ? Math.round(ex.ok / ex.total * 100) : 0;
  if (ex.round === 1) {
    addDoc(collection(db, "users", uid, "exams"), {
      day: today, themes: ex.themes, dir: ex.dir, total: ex.total, ok: ex.ok, ko: ex.ko, helped: ex.helped, score,
      wrong: ex.wrong.map(w => ({ fr: w.fr, en: w.en, dir: w.dir })).slice(0, 80),
      durationSec: Math.round((Date.now() - ex.start) / 1000), createdAt: serverTimestamp()
    }).catch(e => console.warn(e));
  }
  const key = score >= 90 ? "r90" : score >= 70 ? "r70" : score >= 50 ? "r50" : "r0";
  const art = score >= 90 ? MOODS.bravo : score >= 70 ? MOODS.sure : score >= 50 ? MOODS.reflechie : MOODS.rate;
  if (score >= 90) confetti();
  const wrongNow = ex.round === 1 ? ex.wrong : (ex.retryWrong || []);
  if (ex.round > 1) ex.wrong = wrongNow;
  openOverlay(`<div class="card center">
    <img class="end-art" src="${art}" alt="" style="object-fit:contain;background:var(--card2)">
    <h2>${ex.round === 1 ? "📝 Résultat du contrôle blanc" : "🔁 Tour de rattrapage"}</h2>
    <div style="font:700 3rem var(--font-h)" class="grad-text">${ex.ok} / ${ex.total}</div>
    <p style="font-weight:800">${score}% — ${esc(T("exam." + key))}</p>
    <p class="small muted">${esc(ex.themes.join(", "))}${ex.helped ? ` · ${ex.helped} avec aide` : ""}</p>
    ${wrongNow.length ? `<details style="text-align:left;margin:10px 0"><summary>❌ ${wrongNow.length} mot(s) à revoir</summary>
      <div class="table-wrap" style="margin-top:8px;max-height:30vh"><table><tbody>${wrongNow.map(w => `<tr><td>${esc(w.fr)}</td><td><b>${esc(w.en)}</b></td></tr>`).join("")}</tbody></table></div></details>` : ""}
    <div class="row" style="justify-content:center;margin-top:12px">
      ${wrongNow.length ? `<button class="btn" id="xRetry">${esc(T("exam.retry"))}</button>` : ""}
      ${canReveal() ? `<button class="btn pink" id="xReward">🎁 ${esc(T("end.btn"))}</button>` : ""}
      <button class="btn ghost" id="ovClose">Terminer</button>
    </div>
  </div>`);
  $("#xRetry")?.addEventListener("click", examRetry);
  $("#xReward")?.addEventListener("click", revealShame);
}

/* ---------------- Quiz ---------------- */
const quiz = { active: false, mode: "daily", cur: null, dir: null, answered: false, recent: [], retry: [], step: 0, lastDir: null, bonusCount: 0, help: 0, qcmAuto: false, choices: [] };
const expectedOf = () => quiz.dir === "frEn" ? quiz.cur.en : quiz.cur.fr;

function startQuiz(mode) {
  if (mode === "nl" ? !wordsNl.length : !words.length) return;
  Object.assign(quiz, { active: true, mode, recent: [], retry: [], step: 0, lastDir: null, bonusCount: 0 });
  $("#vHome").classList.add("hidden");
  $("#vQuiz").classList.remove("hidden");
  if (mode === "extra") curSeries();
  if (mode === "nl") curSeriesNl();
  $("#qMode").textContent = mode === "daily" ? T("quiz.mode.daily") : mode === "extra" ? T("series.mode", { n: (sess().series || []).length + 1 })
    : mode === "nl" ? "🇳🇱 " + T("series.mode", { n: (sessNl().series || []).length + 1 }) : T("quiz.mode.bonus");
  nextQuestion();
}
function stopQuiz() {
  quiz.active = false;
  speechSynthesis?.cancel?.();
  $("#vQuiz").classList.add("hidden");
  $("#vHome").classList.remove("hidden");
  renderHome();
}
$("#qBack").onclick = () => {
  if (quiz.mode === "exam" && quiz.exam?.round === 1 && quiz.exam.done > 0 && !confirm(T("exam.quit"))) return;
  stopQuiz();
};

function renderQuizBars() {
  const s = sess();
  if (quiz.mode === "daily" || quiz.mode === "extra" || quiz.mode === "nl") {
    const c = quiz.mode === "extra" ? curSeries() : quiz.mode === "nl" ? curSeriesNl() : s;
    $("#qBars").innerHTML = barsHTML(c, quiz.mode === "nl" ? "nl" : "en");
    const left = DAILY_GOAL - ((c.frEn || 0) + (c.enFr || 0));
    $("#qSuspense").textContent = left === 1 ? T("quiz.s1") : left === 2 ? T("quiz.s2") : (left <= 5 && left > 2) ? T("quiz.s5", { n: left }) : "";
  } else if (quiz.mode === "exam") {
    const ex = quiz.exam, pct = ex.total ? Math.round(ex.done / ex.total * 100) : 0;
    $("#qBars").innerHTML = `<div class="bar" style="grid-column:1/-1"><div class="t"><span>📝 ${ex.done} / ${ex.total}</span><span>✅ ${ex.ok} · ❌ ${ex.ko}</span></div><div class="track"><div class="fill" style="width:${pct}%"></div></div></div>`;
    $("#qSuspense").textContent = "";
  } else {
    $("#qBars").innerHTML = `<div class="bar" style="grid-column:1/-1"><div class="t"><span>Bonus</span><span>${quiz.bonusCount} bonne(s) réponse(s)</span></div></div>`;
    $("#qSuspense").textContent = "";
  }
}
function nextQuestion() {
  const s = sess();
  if (quiz.mode === "exam") {
    let item, w = null;
    while (!w && (item = quiz.exam.queue.shift())) w = words.find(x => x.id === item.id) || null;
    if (!w) { finishExam(); return; }
    quiz.dir = item.dir; quiz.cur = w;
  } else if (quiz.mode === "nl") {
    quiz.dir = nextDirection(curSeriesNl(), quiz.lastDir);
    quiz.cur = pickWord(wordsNl, { recent: quiz.recent, retry: quiz.retry, step: quiz.step, today });
  } else {
    quiz.dir = quiz.mode === "daily" ? nextDirection(s, quiz.lastDir) : quiz.mode === "extra" ? nextDirection(curSeries(), quiz.lastDir) : (quiz.lastDir === "frEn" ? "enFr" : "frEn");
    quiz.cur = pickWord(pool(), { recent: quiz.recent, retry: quiz.retry, step: quiz.step, today });
  }
  quiz.lastDir = quiz.dir;
  quiz.answered = false;
  const w = quiz.cur;
  const frEn = quiz.dir === "frEn";
  const isNl = quiz.mode === "nl";
  const tFlag = isNl ? "🇳🇱" : "🇬🇧";
  $("#qDir").innerHTML = frEn ? `🇫🇷 <span>→</span> ${tFlag} <span class='small'>Traduis en ${isNl ? "néerlandais" : "anglais"}</span>` : `${tFlag} <span>→</span> 🇫🇷 <span class='small'>Traduis en français</span>`;
  $("#qPrompt").textContent = frEn ? w.fr : w.en;
  const meta = [];
  if (w.cat) meta.push(`<span class="chip b">${esc(w.cat)}</span>`);
  if (w.nature) meta.push(`<span class="chip">${esc(w.nature)}</span>`);
  if (!frEn) meta.push(`<button type="button" class="icon-btn" id="qSay" title="Écouter">🔊</button>`);
  $("#qMeta").innerHTML = meta.join("");
  $("#qSay")?.addEventListener("click", () => speak(w.en, isNl ? "nl-NL" : "en-GB"));
  const a = $("#qAnswer");
  a.value = ""; a.className = "answer"; a.disabled = false;
  $("#qFeedback").innerHTML = "";
  $("#qSubmit").textContent = "Valider ✔";
  $("#qSkip").classList.remove("hidden");
  $("#qHint").classList.add("hidden"); $("#qHint").innerHTML = "";
  quiz.help = 0;
  setMood("reflechie");
  quiz.qcmAuto = !!settings.autoQcm && isLong(expectedOf(), settings.qcmMinWords || 4);
  if (quiz.qcmAuto) showChoices(); else showInput();
  renderQuizBars();
}
/* Mode écrit / mode choix multiple */
function showInput() {
  $("#qChoices").classList.add("hidden");
  $("#qAnswer").classList.remove("hidden");
  $("#qSubmit").classList.remove("hidden");
  updateHelpBtn();
  setTimeout(() => $("#qAnswer").focus(), 30);
}
function showChoices() {
  const w = quiz.cur;
  quiz.choices = buildChoices(w, quiz.dir, quiz.mode === "nl" ? wordsNl : words);
  $("#qAnswer").classList.add("hidden");
  $("#qSubmit").classList.add("hidden");
  $("#qChoices").innerHTML = `<div class="q-intro">${esc(T("quiz.qcmIntro"))}</div>` +
    quiz.choices.map((c, i) => `<button type="button" class="choice" data-ch="${i}"><span class="k">${i + 1}</span><span>${esc(c.text)}</span></button>`).join("") +
    (quiz.qcmAuto ? `<button type="button" class="link-btn" id="qWrite">${esc(T("quiz.write"))}</button>` : "");
  $("#qChoices").classList.remove("hidden");
  document.querySelectorAll("[data-ch]").forEach(b => b.onclick = () => pickChoice(Number(b.dataset.ch)));
  $("#qWrite")?.addEventListener("click", () => { quiz.qcmAuto = false; showInput(); });
  updateHelpBtn();
}
function pickChoice(i) {
  if (quiz.answered) return;
  const c = quiz.choices[i];
  if (!c) return;
  document.querySelectorAll("[data-ch]").forEach(b => {
    const k = quiz.choices[Number(b.dataset.ch)];
    b.disabled = true;
    if (k.correct) b.classList.add("good");
    else if (Number(b.dataset.ch) === i) b.classList.add("bad");
  });
  answer(c.text, false, { choiceOk: c.correct });
}
function updateHelpBtn() {
  const b = $("#qHelp");
  const onChoices = !$("#qChoices").classList.contains("hidden");
  if (!settings.hints || quiz.answered || onChoices) { b.classList.add("hidden"); return; }
  b.classList.remove("hidden");
  b.textContent = quiz.help === 0 ? T("quiz.hint") : T("quiz.qcm");
}
$("#qHelp").onclick = () => {
  if (quiz.answered) return;
  if (quiz.help === 0) {
    quiz.help = 1;
    const h = hintPattern(expectedOf());
    $("#qHint").innerHTML = `<div class="small muted">${esc(T("quiz.hintLabel"))}</div><div class="pat">${esc(h.pattern)}</div><div class="cnt">${h.letters.join(" + ")} lettre${h.letters.reduce((a, b) => a + b, 0) > 1 ? "s" : ""}</div>`;
    $("#qHint").classList.remove("hidden");
    updateHelpBtn();
    $("#qAnswer").focus();
  } else {
    quiz.help = 2;
    showChoices();
  }
};
document.addEventListener("keydown", ev => {
  if (!quiz.active || quiz.answered || $("#qChoices").classList.contains("hidden")) return;
  const n = Number(ev.key);
  if (n >= 1 && n <= quiz.choices.length) { ev.preventDefault(); pickChoice(n - 1); }
});

function setMood(m) {
  const el = $("#qMood");
  if (!el || el.dataset.m === m) return;
  el.dataset.m = m; el.src = MOODS[m];
  el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
}
function saveWord(w, ok, gain = 1, coll = "words") {
  const upd = {
    level: ok ? Math.min(MAX_LEVEL, (w.level || 0) + gain) : Math.max(0, (w.level || 0) - 1),
    ok: (w.ok || 0) + (ok ? 1 : 0), ko: (w.ko || 0) + (ok ? 0 : 1),
    seen: (w.seen || 0) + 1, lastSeen: today
  };
  if (!ok) upd.lastKo = today;
  const before = w.level || 0;
  Object.assign(w, upd);
  updateDoc(doc(db, "users", uid, coll, w.id), upd).catch(e => console.warn(e));
  return { before, after: upd.level };
}
function saveSession() {
  const s = sess();
  const data = { ...s };
  if (data.completed && !data.completedAt) data.completedAt = serverTimestamp();
  setDoc(sessionRef(), data, { merge: true }).catch(e => console.warn(e));
}

function answer(given, skipped = false, opt = {}) {
  const w = quiz.cur, frEn = quiz.dir === "frEn", isNl = quiz.mode === "nl";
  const expected = frEn ? w.en : w.fr;
  const pool2 = isNl ? wordsNl : words;
  // Accepte aussi la traduction d'un autre mot ayant exactement le même énoncé (ex. « band »)
  const promptOf = x => String(frEn ? x.fr : x.en).trim().toLowerCase();
  const alts = [...((frEn ? w.altEn : w.altFr) || []), ...pool2.filter(x => x.id !== w.id && promptOf(x) === promptOf(w)).map(x => frEn ? x.en : x.fr)];
  let res = { ok: false, accent: false };
  if ("choiceOk" in opt) res = { ok: opt.choiceOk, accent: false };
  else if (!skipped) {
    for (const exp of [expected, ...alts]) { const r = checkAnswer(exp, given, frEn ? (isNl ? "nl" : "en") : "fr"); if (r.ok && (!res.ok || res.accent)) res = r; }
  }
  // Aide utilisée (indice ou QCM demandé) : compte pour les 20 mais pas de montée de niveau
  const helped = quiz.help > 0 && !quiz.qcmAuto;
  quiz.answered = true; quiz.step++;
  quiz.recent.push(w.id);
  const a = $("#qAnswer");
  a.disabled = true;
  a.classList.add(res.ok ? "ok" : "ko");
  const lv = saveWord(w, res.ok, helped ? 0 : 1, isNl ? "wordsNl" : "words");
  $("#qHelp").classList.add("hidden");
  $("#qSubmit").classList.remove("hidden");
  setMood(res.ok ? (helped ? "sure" : "joyeuse") : "colere");
  document.querySelectorAll("[data-ch]").forEach(bt => { bt.disabled = true; if (quiz.choices[Number(bt.dataset.ch)]?.correct) bt.classList.add("good"); });

  const s = sess();
  if (lv.before < MAX_LEVEL && lv.after >= MAX_LEVEL) s.mastered = [...(s.mastered || []), { fr: w.fr, en: w.en }].slice(-100);
  if (quiz.mode === "exam") {
    const ex = quiz.exam;
    ex.done++;
    if (res.ok) { ex.ok++; if (helped) ex.helped++; }
    else {
      ex.ko++;
      const entry = { id: w.id, fr: w.fr, en: w.en, dir: quiz.dir };
      if (ex.round === 1) ex.wrong.push(entry); else (ex.retryWrong = ex.retryWrong || []).push(entry);
    }
  }
  const countsDaily = quiz.mode === "daily" || (quiz.mode === "exam" && !s.completed);
  if (countsDaily) {
    s.attempts = (s.attempts || 0) + 1;
    if (res.ok) {
      s[quiz.dir] = Math.min(PER_DIRECTION, (s[quiz.dir] || 0) + 1);
      if (helped) s.helped = (s.helped || 0) + 1;
      if (quiz.qcmAuto) s.qcm = (s.qcm || 0) + 1;
    } else {
      s.errors = (s.errors || 0) + 1;
      s.wrong = [...(s.wrong || []), { fr: w.fr, en: w.en, dir: quiz.dir, given: String(given || "").slice(0, 80), help: quiz.help }].slice(-40);
    }
    if ((s.frEn || 0) + (s.enFr || 0) >= DAILY_GOAL && !s.completed) {
      s.completed = true;
      s.series = [...(s.series || []).filter(x => x.n !== 1), { n: 1, attempts: s.attempts, errors: s.errors || 0, helped: s.helped || 0, acc: accuracy(s.errors || 0), points: seriesPoints(s.errors || 0, s.helped || 0) }];
      quiz.justDone = s.series[s.series.length - 1];
    }
    if (quiz.mode === "exam") s.exam = (s.exam || 0) + 1;
  } else if (quiz.mode === "extra") {
    const c = curSeries();
    c.attempts++;
    if (res.ok) { c[quiz.dir] = Math.min(PER_DIRECTION, (c[quiz.dir] || 0) + 1); if (helped) c.helped = (c.helped || 0) + 1; }
    else { c.errors = (c.errors || 0) + 1; c.wrong = [...(c.wrong || []), { fr: w.fr, en: w.en, dir: quiz.dir, given: String(given || "").slice(0, 80) }].slice(-40); }
    if ((c.frEn || 0) + (c.enFr || 0) >= DAILY_GOAL) {
      const n = (s.series || []).length + 1;
      const done = { n, attempts: c.attempts, errors: c.errors || 0, helped: c.helped || 0, acc: accuracy(c.errors || 0), points: seriesPoints(c.errors || 0, c.helped || 0) };
      s.series = [...(s.series || []), done];
      s.cur = null;
      quiz.justDone = done;
    }
  } else if (quiz.mode === "exam") {
    s.exam = (s.exam || 0) + 1;
  } else if (quiz.mode === "nl") {
    const c = curSeriesNl();
    c.attempts++;
    if (res.ok) { c[quiz.dir] = Math.min(PER_DIRECTION, (c[quiz.dir] || 0) + 1); if (helped) c.helped = (c.helped || 0) + 1; }
    else { c.errors = (c.errors || 0) + 1; c.wrong = [...(c.wrong || []), { fr: w.fr, en: w.en, dir: quiz.dir, given: String(given || "").slice(0, 80) }].slice(-40); }
    if ((c.frEn || 0) + (c.enFr || 0) >= DAILY_GOAL) {
      const sn = sessNl();
      const n = (sn.series || []).length + 1;
      const done = { n, attempts: c.attempts, errors: c.errors || 0, helped: c.helped || 0, acc: accuracy(c.errors || 0), points: seriesPoints(c.errors || 0, c.helped || 0) };
      sn.series = [...(sn.series || []), done];
      sn.cur = null;
      quiz.justDone = done;
    }
  } else if (res.ok) { quiz.bonusCount++; s.bonus = (s.bonus || 0) + 1; }
  if (isNl) saveSessionNl(); else saveSession();

  if (res.ok) quiz.retry = quiz.retry.filter(r => r.id !== w.id);
  else if (!quiz.retry.some(r => r.id === w.id)) quiz.retry.push({ id: w.id, due: quiz.step + 3 });

  const extra = [];
  if (w.conj) extra.push(`Formes : ${esc(w.conj)}`);
  else if (!isNl) { const iv = findIrregular(w.en, w.nature); if (iv) extra.push(`🔤 Verbe irrégulier : <b>${esc(iv[0])} — ${esc(iv[1])} — ${esc(iv[2])}</b>`); }
  if (w.ex) extra.push(`Exemple : <i>${esc(w.ex)}</i>`);
  const say = `<button type="button" class="icon-btn" id="fbSay" title="Écouter" style="margin-left:6px">🔊</button>`;
  if (res.ok) {
    const msgs = T("quiz.ok").split("|").filter(Boolean);
    $("#qFeedback").innerHTML = `<div class="good">${esc(msgs[Math.floor(Math.random() * msgs.length)] || "✅")}</div>` +
      (res.accent ? `<div class="bad" style="color:var(--warn)">${esc(T("quiz.accent"))} <b>${esc(expected)}</b></div>` : `<div class="sol">${esc(expected)}${say}</div>`) +
      (helped ? `<div class="extra" style="color:var(--warn)">${esc(T("quiz.hinted"))}</div>` : "") +
      (extra.length ? `<div class="extra">${extra.join("<br>")}</div>` : "");
  } else {
    $("#qFeedback").innerHTML = `<div class="bad">${esc(T("quiz.ko"))}</div><div class="sol">${esc(expected)}${say}</div>` +
      (extra.length ? `<div class="extra">${extra.join("<br>")}</div>` : "");
  }
  const speakLang = isNl ? "nl-NL" : "en-GB";
  $("#fbSay")?.addEventListener("click", () => speak(w.en, speakLang));
  if (frEn) speak(w.en, speakLang);
  // Propositions : « ma réponse est juste aussi » / « il y a une erreur dans ce mot » (anglais uniquement pour l'instant)
  const canAlt = !isNl && !res.ok && !skipped && !("choiceOk" in opt) && String(given || "").trim();
  if (!isNl) {
    $("#qFeedback").insertAdjacentHTML("beforeend", `<div class="prop-links">
      ${canAlt ? `<button type="button" class="link-btn" id="prAlt">${esc(T("prop.alt"))}</button>` : ""}
      <button type="button" class="link-btn" id="prFix">${esc(T("prop.fix"))}</button></div><div id="prBox"></div>`);
    $("#prAlt")?.addEventListener("click", () => sendProposal({ type: "alt", word: w, dir: quiz.dir, given: String(given).trim() }, $("#prAlt")));
    $("#prFix").addEventListener("click", () => openFixBox(w));
  }
  $("#qSkip").classList.add("hidden");
  $("#qSubmit").textContent = "Suivant →";
  renderQuizBars();
  setTimeout(() => $("#qSubmit").focus(), 30);

  if (quiz.mode === "exam" && s.completed && !quiz.exam.dailyToast) { quiz.exam.dailyToast = true; toast(T("exam.daily")); }
  if ((quiz.mode === "daily" && s.completed) || ((quiz.mode === "extra" || quiz.mode === "nl") && quiz.justDone)) {
    $("#qSubmit").disabled = true;
    holdBadges = true;
    const done = quiz.justDone, mode = quiz.mode;
    quiz.justDone = null;
    setTimeout(async () => { $("#qSubmit").disabled = false; stopQuiz(); const piece = await awardPiece(done); mode === "daily" ? showEnd(done, piece) : showSeriesEnd(done, piece, mode); }, 900);
  }
}

$("#qForm").addEventListener("submit", ev => {
  ev.preventDefault();
  if (quiz.mode === "daily" && sess().completed) return; // 20/20 atteint : écran de fin en cours
  if (quiz.mode === "extra" && !sess().cur) return;
  if (quiz.mode === "nl" && !sessNl().cur) return;
  if (quiz.answered) { nextQuestion(); return; }
  const v = $("#qAnswer").value;
  if (!v.trim()) { $("#qAnswer").focus(); return; }
  answer(v);
});
$("#qSkip").onclick = () => { if (!quiz.answered) answer("", true); };

/* ---------------- Fin de session ---------------- */
function confetti() {
  const colors = ["#2EE59D", "#4D8DFF", "#FF4D8D", "#FFB020", "#fff"];
  for (let i = 0; i < 90; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = 1.8 + Math.random() * 1.8 + "s";
    c.style.animationDelay = Math.random() * .6 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4500);
  }
}
function openOverlay(html) {
  $("#overlayInner").innerHTML = html;
  $("#overlay").classList.remove("hidden");
  $("#ovClose")?.addEventListener("click", closeOverlay);
}
function closeOverlay() { holdBadges = false; $("#overlay").classList.add("hidden"); renderHome(); }

function seriesBlock(done, piece) {
  if (!done) return "";
  const pz = piece ? `<div style="margin:10px 0">${puzzleGrid(puzzleState(piece.total).img, puzzleState(piece.total).shown, piece.index, piece.completed)}</div>
      <p style="font-weight:800;color:#FFD27A">${esc(piece.completed ? T("puzzle.complete") : T("puzzle.won", { n: puzzleState(piece.total).inCur || PIECES }))}</p>`
    : `<p class="small muted">${esc(T("puzzle.rule"))}</p>`;
  return `<p style="font:700 1.5rem var(--font-h);margin:8px 0">⭐ ${done.points} points <span class="small muted" style="font-size:.9rem">· ${done.acc} % de réussite</span></p>${pz}`;
}
async function awardPiece(done) {
  if (!done || !earnsPiece(done.errors)) return null;
  const total = (puzzle.pieces || 0) + 1;
  const log = [...(puzzle.log || []), { day: today, n: done.n, points: done.points }].slice(-100);
  puzzle = { ...puzzle, pieces: total, log };
  try { await setDoc(doc(db, "users", uid, "meta", "puzzle"), { pieces: total, log }, { merge: true }); } catch (e) { console.warn(e); }
  const inCur = total % PIECES;
  return { total, completed: inCur === 0, index: inCur === 0 ? -1 : pieceOrderIndex(inCur) };
}
function showSeriesEnd(done, piece, mode = "extra") {
  confetti();
  openOverlay(`<div class="shame-card">
    <img class="end-art" src="${done.acc > 90 ? MOODS.bravo : MOODS.sure}" alt="">
    <h1 style="font-size:2rem">${mode === "nl" ? "🇳🇱 " : ""}${esc(T("series.done", { n: done.n }))}</h1>
    <p class="small muted">${done.attempts} tentatives · ${done.errors} erreur(s)</p>
    ${seriesBlock(done, piece)}
    <button class="btn block" id="ovAgain" style="margin-top:12px">${esc(T("series.new", { n: done.n + 1 }))}</button>
    <button class="btn ghost block" id="ovClose" style="margin-top:10px">Fermer</button>
  </div>`);
  $("#ovAgain").onclick = () => { $("#overlay").classList.add("hidden"); startQuiz(mode); };
}
function renderPuzzle() {
  if (!$("#puzzleZone")) return;
  const st = puzzleState(puzzle.pieces || 0);
  $("#puzzleZone").innerHTML = `${puzzleGrid(st.img, st.shown)}
    <p class="center" style="font-weight:800;margin-top:10px">${st.inCur} / ${PIECES} ${esc(T("puzzle.pieces"))}</p>
    <p class="small muted center">${esc(T("puzzle.rule"))}</p>
    ${st.done ? `<p class="small" style="margin-top:8px"><b>${esc(T("puzzle.gallery"))} (${st.done})</b></p><div class="pz-gallery">${st.completedImgs.map(i => `<img src="${i}" alt="">`).join("")}</div>` : ""}`;
}
/* ---------------- Néerlandais (V03-002) ---------------- */
function renderNl() {
  if (!$("#nlZone")) return;
  if (!readyNl.w || !readyNl.s) { $("#nlZone").innerHTML = `<p class="muted small">Chargement…</p>`; return; }
  const sn = sessNl();
  const ser = sn.series || [];
  let html = "";
  if (!wordsNl.length) {
    html = `<p class="note">Ton parent n'a pas encore ajouté de vocabulaire néerlandais dans l'espace parent → 🇳🇱 Néerlandais.</p>`;
  } else {
    const nSer = ser.length + 1;
    html += `<p class="muted small">${wordsNl.length} mot(s) néerlandais au programme.</p>`;
    html += `<button class="btn" id="btnNl">🇳🇱 ${esc(T(sn.cur && sn.cur.attempts ? "series.continue" : "series.new", { n: nSer }))}</button>`;
    html += `<p class="small muted" style="margin-top:8px">Séries libres, comme les séries bonus : pas d'obligation, mais des points et des pièces de puzzle à chaque série réussie.</p>`;
    if (ser.length) html += `<div class="series-pills">${ser.map(x => `<span title="${x.acc}% de réussite">#${x.n} · ⭐ ${x.points}</span>`).join("")}</div>
      <p class="small muted">${esc(T("series.today", { n: ser.length, pts: ser.reduce((a, x) => a + x.points, 0) }))}</p>`;
  }
  $("#nlZone").innerHTML = html;
  $("#btnNl")?.addEventListener("click", () => startQuiz("nl"));
}
function showEnd(done, piece) {
  const s = sess();
  confetti();
  let reward = "";
  if (canReveal()) {
    reward = `<hr class="sep"><h2 style="color:#FF8DB6">${esc(T("end.reward"))}</h2>
      <p class="warn">${esc(T("shame.warning"))}</p><p class="warned">${esc(T("shame.warned"))}</p>
      <button class="btn pink big block" id="ovReveal">${esc(T("end.btn"))}</button>`;
  } else if (todayShame()) {
    reward = `<hr class="sep"><button class="btn pink block" id="ovReview">${esc(T("eleve.review"))}</button>`;
  } else if (nextShameDate() && meta.lastRevealDay !== today) {
    reward = `<hr class="sep"><p class="warn">${esc(T("shame.waitdate", { date: fmtDay(nextShameDate()) }))}</p>`;
  } else {
    reward = `<hr class="sep"><p class="muted">${esc(T("end.noreward"))}</p>`;
  }
  openOverlay(`<div class="shame-card">
    <img class="end-art" src="${MOODS.bravo}" alt="Super travail !">
    <h1 style="font-size:2.4rem">${esc(T("end.title"))}</h1>
    <div class="end-score"><div>🇫🇷→🇬🇧 ${s.frEn}/${PER_DIRECTION}</div><div>🇬🇧→🇫🇷 ${s.enFr}/${PER_DIRECTION}</div></div>
    <p class="streak">🔥 Série : ${streak()} jour${streak() > 1 ? "s" : ""}</p>
    <p class="small muted">${s.attempts} tentatives · ${s.errors || 0} erreur(s)</p>
    ${seriesBlock(done, piece)}
    ${reward}
    <button class="btn ghost block" id="ovClose" style="margin-top:12px">Fermer</button>
  </div>`);
  $("#ovReveal")?.addEventListener("click", revealShame);
  $("#ovReview")?.addEventListener("click", () => showShame(todayShame(), true));
}

async function revealShame() {
  const id = nextShameId();
  if (!id) return;
  openOverlay(`<div class="shame-card"><div class="lock">🔒</div><p class="warn">Ouverture du coffre de la honte…</p></div>`);
  try {
    const b = writeBatch(db);
    b.update(doc(db, "users", uid, "shame", id), { revealed: true, revealedAt: serverTimestamp(), revealedDay: today });
    b.update(doc(db, "users", uid, "meta", "shame"), { queue: arrayRemove(id), lastRevealDay: today });
    await b.commit();
    const snap = await getDoc(doc(db, "users", uid, "shame", id));
    const data = { id, ...snap.data() };
    setTimeout(() => showShame(data, false), 900);
  } catch (e) {
    openOverlay(`<div class="shame-card"><p class="warn">Impossible d'ouvrir le coffre pour l'instant.</p><p class="small muted">${esc(errMsg(e))}</p><button class="btn ghost block" id="ovClose">Fermer</button></div>`);
  }
}

function levelAlert(h) {
  return h >= 5 ? T("shame.max") : h >= 3 ? T("shame.high") : T("shame.low");
}
function showShame(r, review) {
  if (!r) return;
  const h = Math.max(1, Math.min(6, r.honte || 5));
  if (!review) confetti();
  openOverlay(`<div class="shame-card">
    <img class="shame-art" src="${MOODS.malicieuse}" alt="">
    <h2>${esc(T("shame.unlock"))}</h2>
    <span class="alert">${esc(levelAlert(h))}</span>
    <div class="expr">« ${esc(String(r.expression || "").toUpperCase())} »</div>
    <p class="warn">${esc(T("shame.warning"))}</p>
    <p class="warned">${esc(T("shame.warned"))}</p>
    <button class="btn pink block" id="ovPhrase" style="margin-top:12px">${esc(T("shame.phraseBtn"))}</button>
    <div class="phrase-box hidden" id="ovPhraseBox">
      <div class="small muted">${esc(T("shame.phraseLabel"))}</div>
      <div class="q">« ${esc(fillPrenom(r.phrase) || r.expression)} »</div>
      <div><span class="small muted">${esc(T("shame.levelLabel"))}</span> <span class="honte-bar">${"█".repeat(h)} ${esc(T("shame.l" + h))}</span></div>
      <div class="skulls" style="margin-top:6px;font-size:1.3rem">${"💀".repeat(h)}</div>
    </div>
    <button class="btn ghost block" id="ovClose" style="margin-top:12px">Fermer</button>
  </div>`);
  $("#ovPhrase").onclick = () => { $("#ovPhraseBox").classList.remove("hidden"); $("#ovPhrase").classList.add("hidden"); };
}
