/* =========================================================
   Wesh Words — entraînements complémentaires (V01-006)
   🔤 Verbes irréguliers · 🎧 Dictée audio · ⚔️ Duel
   Ces modes s'affichent dans la fenêtre #overlay de la page.
   ========================================================= */
import { $, esc, T } from "./app.js";
import { checkAnswer, speak } from "./words.js";

const ov = () => $("#overlay"), inner = () => $("#overlayInner");
function show(html) { inner().innerHTML = html; ov().classList.remove("hidden"); }
export function hideOverlay() { ov().classList.add("hidden"); }
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/** vérifie une réponse contre une liste de réponses possibles */
function checkAny(expectedList, given, lang) {
  let best = { ok: false, accent: false };
  for (const e of expectedList) {
    const r = checkAnswer(e, given, lang);
    if (r.ok && (!best.ok || best.accent)) best = r;
  }
  return best;
}
function onEnter(el, fn) { el.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); fn(); } }); }

/* =========================================================
   🔤 VERBES IRRÉGULIERS
   verbs : [{ key, forms:[base, prét, pp], meanings:[fr…], word }]
   mode  : "fr3" (français → 3 formes) | "base2" (base donnée → 2 formes)
   ========================================================= */
export function runVerbs({ verbs, mode = "fr3", count = 10, onAnswer, onFinish, onQuit }) {
  // les verbes les moins maîtrisés d'abord (avec un peu de hasard)
  const list = [...verbs].sort((a, b) => ((a.word.vLevel || 0) + Math.random() * 2) - ((b.word.vLevel || 0) + Math.random() * 2)).slice(0, count);
  const st = { i: 0, ok: 0, ko: 0, wrong: [], answered: false };
  const labels = ["Base verbale", "Prétérit", "Participe passé"];

  function q() {
    const v = list[st.i];
    const asked = mode === "fr3" ? [0, 1, 2] : [1, 2];
    st.answered = false;
    show(`<div class="card practice">
      <div class="row between"><span class="chip b">🔤 ${esc(T("verbs.title"))}</span><span class="small muted">${st.i + 1} / ${list.length} · ✅ ${st.ok} · ❌ ${st.ko}</span></div>
      <div class="track" style="height:6px;background:var(--line);border-radius:99px;margin:10px 0 14px;overflow:hidden"><div style="height:100%;width:${st.i / list.length * 100}%;background:var(--grad)"></div></div>
      <p class="small muted center" style="margin:0">${esc(T("verbs.prompt"))}</p>
      <div class="prompt">${esc(v.meanings.slice(0, 2).join(" · "))}</div>
      ${mode === "base2" ? `<p class="center"><span class="chip g" style="font-size:1rem">to ${esc(v.forms[0])}</span></p>` : ""}
      <div class="verb-grid">${asked.map(k => `<div class="field"><label>${labels[k]}</label><input type="text" class="answer vf" data-k="${k}" autocapitalize="none" autocorrect="off" spellcheck="false"></div>`).join("")}</div>
      <div class="feedback" id="vFb"></div>
      <div class="row" style="justify-content:center">
        <button class="btn ghost" id="vQuit">✖ ${esc(T("practice.quit"))}</button>
        <button class="btn" id="vGo">Valider ✔</button>
      </div>
    </div>`);
    const inputs = [...inner().querySelectorAll(".vf")];
    inputs[0].focus();
    inputs.forEach((el, n) => onEnter(el, () => { if (st.answered) next(); else if (n < inputs.length - 1 && !inputs[n + 1].value) inputs[n + 1].focus(); else check(); }));
    $("#vGo").onclick = () => st.answered ? next() : check();
    $("#vQuit").onclick = () => { hideOverlay(); onQuit?.(); };
  }
  function check() {
    const v = list[st.i];
    const inputs = [...inner().querySelectorAll(".vf")];
    let all = true;
    inputs.forEach(el => {
      const k = Number(el.dataset.k);
      const exp = v.forms[k].split(/\s*\/\s*/);
      const r = checkAny([v.forms[k], ...exp], el.value, "en");
      el.disabled = true;
      el.classList.add(r.ok ? "ok" : "ko");
      if (!r.ok) all = false;
    });
    st.answered = true;
    if (all) st.ok++; else { st.ko++; st.wrong.push(v); }
    onAnswer?.(v, all);
    $("#vFb").innerHTML = `<div class="${all ? "good" : "bad"}">${all ? esc(T("verbs.ok")) : esc(T("verbs.ko"))}</div>
      <div class="sol">${esc(v.forms.join(" — "))} <button type="button" class="icon-btn" id="vSay">🔊</button></div>`;
    $("#vSay").onclick = () => speak(v.forms.join(", "));
    speak(v.forms.join(", "));
    $("#vGo").textContent = st.i + 1 < list.length ? "Suivant →" : "Voir mon score →";
    $("#vGo").focus();
  }
  function next() { st.i++; if (st.i < list.length) q(); else end(); }
  function end() {
    const score = Math.round(st.ok / list.length * 100);
    onFinish?.({ total: list.length, ok: st.ok, ko: st.ko, score, wrong: st.wrong });
  }
  if (!list.length) return false;
  q();
  return true;
}

/* =========================================================
   🎧 DICTÉE AUDIO — on entend l'anglais, on l'écrit
   items : [{ id, en, fr }]
   ========================================================= */
export function runDictee({ items, onAnswer, onFinish, onQuit }) {
  const st = { i: 0, ok: 0, ko: 0, wrong: [], answered: false };
  const say = (slow) => speak(items[st.i].en.split(/\s*\/\s*/)[0].replace(/\([^)]*\)/g, ""), "en-GB", slow ? 0.6 : 0.9);
  function q() {
    st.answered = false;
    show(`<div class="card practice center">
      <div class="row between"><span class="chip b">🎧 ${esc(T("dictee.title"))}</span><span class="small muted">${st.i + 1} / ${items.length} · ✅ ${st.ok} · ❌ ${st.ko}</span></div>
      <div class="track" style="height:6px;background:var(--line);border-radius:99px;margin:10px 0 14px;overflow:hidden"><div style="height:100%;width:${st.i / items.length * 100}%;background:var(--grad)"></div></div>
      <p class="muted">${esc(T("dictee.prompt"))}</p>
      <div class="row" style="justify-content:center;margin:10px 0 16px">
        <button class="btn big" id="dSay">🔊 ${esc(T("dictee.replay"))}</button>
        <button class="btn soft" id="dSlow">🐢 ${esc(T("dictee.slow"))}</button>
      </div>
      <input type="text" class="answer" id="dIn" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="${esc(T("dictee.ph"))}">
      <div class="feedback" id="dFb"></div>
      <div class="row" style="justify-content:center">
        <button class="btn ghost" id="dQuit">✖ ${esc(T("practice.quit"))}</button>
        <button class="btn" id="dGo">Valider ✔</button>
      </div>
    </div>`);
    $("#dSay").onclick = () => { say(false); $("#dIn").focus(); };
    $("#dSlow").onclick = () => { say(true); $("#dIn").focus(); };
    onEnter($("#dIn"), () => st.answered ? next() : check());
    $("#dGo").onclick = () => st.answered ? next() : check();
    $("#dQuit").onclick = () => { speechSynthesis?.cancel?.(); hideOverlay(); onQuit?.(); };
    $("#dIn").focus();
    setTimeout(() => say(false), 250);
  }
  function check() {
    const it = items[st.i], v = $("#dIn").value;
    if (!v.trim()) { $("#dIn").focus(); return; }
    const r = checkAny([it.en], v, "en");
    st.answered = true;
    $("#dIn").disabled = true; $("#dIn").classList.add(r.ok ? "ok" : "ko");
    if (r.ok) st.ok++; else { st.ko++; st.wrong.push(it); }
    onAnswer?.(it, r.ok);
    $("#dFb").innerHTML = `<div class="${r.ok ? "good" : "bad"}">${r.ok ? esc(T("dictee.ok")) : esc(T("dictee.ko"))}</div>
      <div class="sol">${esc(it.en)}</div><div class="extra">🇫🇷 ${esc(it.fr)}</div>`;
    $("#dGo").textContent = st.i + 1 < items.length ? "Suivant →" : "Voir mon score →";
    $("#dGo").focus();
  }
  function next() { st.i++; if (st.i < items.length) q(); else onFinish?.({ total: items.length, ok: st.ok, ko: st.ko, score: Math.round(st.ok / items.length * 100), wrong: st.wrong }); }
  if (!items.length) return false;
  q();
  return true;
}

/* =========================================================
   ⚔️ DUEL — même série de mots pour les deux joueurs, chrono
   items : [{ id, fr, en, dir, alts:[…] }]
   ========================================================= */
export function playDuel({ items, who, onFinish, onQuit }) {
  const st = { i: 0, ok: 0, answers: [], answered: false, start: Date.now(), timer: null };
  const clock = () => { const s = Math.round((Date.now() - st.start) / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
  function q() {
    const it = items[st.i], frEn = it.dir === "frEn";
    st.answered = false;
    show(`<div class="card practice">
      <div class="row between"><span class="chip p">⚔️ ${esc(T("duel.title"))} — ${esc(who)}</span><span class="small muted">⏱ <b id="duClock">${clock()}</b> · ${st.i + 1} / ${items.length}</span></div>
      <div class="track" style="height:6px;background:var(--line);border-radius:99px;margin:10px 0 14px;overflow:hidden"><div style="height:100%;width:${st.i / items.length * 100}%;background:linear-gradient(135deg,#FF4D8D,#FF8A3D)"></div></div>
      <div class="dir">${frEn ? "🇫🇷 → 🇬🇧" : "🇬🇧 → 🇫🇷"}</div>
      <div class="prompt">${esc(frEn ? it.fr : it.en)}</div>
      <input type="text" class="answer" id="duIn" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="Ta réponse…">
      <div class="feedback" id="duFb"></div>
      <div class="row" style="justify-content:center">
        <button class="btn ghost" id="duQuit">✖ ${esc(T("practice.quit"))}</button>
        <button class="btn pink" id="duGo">Valider ✔</button>
      </div>
    </div>`);
    onEnter($("#duIn"), () => st.answered ? next() : check());
    $("#duGo").onclick = () => st.answered ? next() : check();
    $("#duQuit").onclick = () => { clearInterval(st.timer); if (confirm(T("duel.quit"))) { hideOverlay(); onQuit?.(); } else st.timer = setInterval(tick, 1000); };
    $("#duIn").focus();
  }
  const tick = () => { const c = $("#duClock"); if (c) c.textContent = clock(); };
  function check() {
    const it = items[st.i], frEn = it.dir === "frEn";
    const v = $("#duIn").value;
    if (!v.trim()) { $("#duIn").focus(); return; }
    const r = checkAny([frEn ? it.en : it.fr, ...(it.alts || [])], v, frEn ? "en" : "fr");
    st.answered = true;
    $("#duIn").disabled = true; $("#duIn").classList.add(r.ok ? "ok" : "ko");
    if (r.ok) st.ok++;
    st.answers.push({ ok: r.ok, given: v.slice(0, 60) });
    $("#duFb").innerHTML = `<div class="${r.ok ? "good" : "bad"}">${r.ok ? "✅" : "❌"} ${esc(frEn ? it.en : it.fr)}</div>`;
    $("#duGo").textContent = st.i + 1 < items.length ? "Suivant →" : "Terminer ⚔️";
    $("#duGo").focus();
  }
  function next() {
    st.i++;
    if (st.i < items.length) q();
    else { clearInterval(st.timer); onFinish?.({ score: st.ok, total: items.length, timeMs: Date.now() - st.start, answers: st.answers }); }
  }
  st.timer = setInterval(tick, 1000);
  q();
}

/** Construit une série de duel (10 mots, sens alternés) */
export function buildDuelItems(pool, allWords, n = 10) {
  const pick = shuffle(pool).slice(0, n);
  return pick.map((w, i) => {
    const dir = i % 2 ? "enFr" : "frEn";
    const same = allWords.filter(x => x.id !== w.id && (dir === "frEn" ? x.fr : x.en).trim().toLowerCase() === (dir === "frEn" ? w.fr : w.en).trim().toLowerCase());
    return { id: w.id, fr: w.fr, en: w.en, dir, alts: same.map(x => dir === "frEn" ? x.en : x.fr).slice(0, 5) };
  });
}
/** Résultat d'un duel : "child" | "parent" | "tie" | null (pas fini) */
export function duelWinner(d) {
  if (!d.child || !d.parent) return null;
  if (d.child.score !== d.parent.score) return d.child.score > d.parent.score ? "child" : "parent";
  if (Math.abs(d.child.timeMs - d.parent.timeMs) > 1000) return d.child.timeMs < d.parent.timeMs ? "child" : "parent";
  return "tie";
}
export const fmtTime = ms => { const s = Math.round((ms || 0) / 1000); return `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s`; };

/* Expressions anglaises proposées au gagnant (la perdante doit la placer dans une phrase) */
export const DUEL_PENALTIES = [
  "It's a piece of cake!", "It's raining cats and dogs.", "Break a leg!", "I'm over the moon!",
  "Easy peasy lemon squeezy!", "Let's call it a day.", "You rock!", "Mind your own business!",
  "I'm all ears.", "That's the icing on the cake.", "Hold your horses!", "What's up, dude?",
  "Cool as a cucumber.", "Once in a blue moon.", "Keep calm and carry on.", "I'm starving!",
  "Oh my goodness!", "No way, José!", "See you later, alligator!", "It's not rocket science."
];
