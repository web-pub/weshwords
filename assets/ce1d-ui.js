/* =========================================================
   Wesh Words — Préparer le CE1D : interface élève (V02-001)
   Carte des matières + séries de 10 questions dans la fenêtre #overlay
   ========================================================= */
import { $, esc, T } from "./app.js";
import { speak } from "./words.js";
import { SUBJECTS, SERIES_LEN, buildSeries, checkCe1d, expectedText, countItems, subjectById } from "./ce1d.js";

const ov = () => $("#overlay"), inner = () => $("#overlayInner");
function show(html) { inner().innerHTML = html; ov().classList.remove("hidden"); inner().scrollTop = 0; }
const hide = () => ov().classList.add("hidden");
const nl = s => esc(s).replace(/\n/g, "<br>");

/** Statistiques par matière à partir des résultats enregistrés */
export function ce1dStats(results) {
  const by = {};
  for (const r of results) {
    const b = by[r.subject] || (by[r.subject] = { n: 0, ok: 0, total: 0, best: 0, themes: {} });
    b.n++; b.ok += r.ok || 0; b.total += r.total || 0; b.best = Math.max(b.best, r.score || 0);
    const t = b.themes[r.theme || "_all"] || (b.themes[r.theme || "_all"] = { n: 0, ok: 0, total: 0 });
    t.n++; t.ok += r.ok || 0; t.total += r.total || 0;
  }
  return by;
}

/** Carte « Préparer le CE1D » de l'accueil élève.
    enabledIds (V03-004) : liste des ids de matières à afficher (choisies par le parent) — null/absent = toutes.
    customItems (V04-001) : exercices ajoutés par le parent, [{ subject, theme, q, t, c?, a, ex, … }]. */
export function renderCe1dCard(el, results, onSave, enabledIds = null, customItems = []) {
  const st = ce1dStats(results);
  const subs = enabledIds ? SUBJECTS.filter(s => enabledIds.includes(s.id)) : SUBJECTS;
  el.innerHTML = `<p class="small muted">${esc(T("ce1d.help"))}</p>
    <div class="ce1d-subjects">${subs.map(s => {
      const b = st[s.id];
      const pct = b ? Math.round(b.ok / Math.max(1, b.total) * 100) : null;
      const nCustom = customItems.filter(c => c.subject === s.id).length;
      return `<button class="ce1d-sub" data-sub="${s.id}"><span class="ic">${s.icon}</span><b>${esc(s.name)}</b>
        <span class="small muted">${s.themes.length} thèmes · ${countItems(s)}${nCustom ? ` + ${nCustom}` : ""} questions</span>
        <span class="small">${b ? `${b.n} série(s) · ${pct} % de réussite` : esc(T("ce1d.new"))}</span>
        ${b ? `<span class="ce1d-bar"><i style="width:${pct}%"></i></span>` : ""}</button>`;
    }).join("")}</div>`;
  el.querySelectorAll("[data-sub]").forEach(b => b.onclick = () => chooseTheme(b.dataset.sub, results, onSave, customItems));
}

function chooseTheme(subId, results, onSave, customItems = []) {
  const sub = subjectById(subId), st = ce1dStats(results)[subId];
  show(`<h3>${sub.icon} ${esc(sub.name)}</h3>
    <p class="small muted">${esc(T("ce1d.choose"))}</p>
    <div class="ce1d-themes">
      <button class="choice" data-th=""><span class="k">🎲</span><span><b>${esc(T("ce1d.mix"))}</b><br><span class="small muted">${SERIES_LEN} questions de tous les thèmes</span></span></button>
      ${sub.themes.map(t => { const x = st?.themes[t.id]; return `<button class="choice" data-th="${t.id}"><span class="k">${x ? Math.round(x.ok / Math.max(1, x.total) * 100) + "%" : "·"}</span>
        <span><b>${esc(t.name)}</b>${t.desc ? `<br><span class="small muted">${esc(t.desc)}</span>` : ""}</span></button>`; }).join("")}
    </div>
    <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn ghost sm" id="c1Close">Fermer</button></div>`);
  $("#c1Close").onclick = hide;
  inner().querySelectorAll("[data-th]").forEach(b => b.onclick = () => runSeries(subId, b.dataset.th || null, results, onSave, customItems));
}

function runSeries(subId, themeId, results, onSave, customItems = []) {
  const sub = subjectById(subId);
  const theme = themeId ? sub.themes.find(t => t.id === themeId) : null;
  // éviter de reposer les questions ratées ou vues à la dernière série… sauf si la banque est trop petite
  const recent = new Set(results.filter(r => r.subject === subId).slice(0, 3).flatMap(r => (r.seen || [])));
  const extra = customItems.filter(c => c.subject === subId);
  const list = buildSeries(subId, themeId, SERIES_LEN, recent, extra);
  const st = { i: 0, ok: 0, wrong: [], answered: false, t0: Date.now() };

  function q() {
    const it = list[st.i];
    st.answered = false;
    let input = "";
    if (it.t === "qcm") input = `<div class="choices">${it.c.map((c, k) => `<button type="button" class="choice" data-k="${k}"><span class="k">${"ABCD"[k] || k + 1}</span><span>${esc(c)}</span></button>`).join("")}</div>`;
    else if (it.t === "vf") input = `<div class="row" style="justify-content:center"><button type="button" class="btn soft big" data-vf="1">✅ Vrai</button><button type="button" class="btn soft big" data-vf="0">❌ Faux</button></div>`;
    else input = `<div class="row" style="justify-content:center;flex-wrap:nowrap"><input type="text" class="answer" id="c1In" ${it.t === "num" ? 'inputmode="decimal"' : ""} autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="${it.t === "num" ? "Ta réponse (nombre)…" : "Ta réponse…"}">${it.unit ? `<b style="margin-left:8px">${esc(it.unit)}</b>` : ""}</div>
      <div class="row" style="justify-content:center;margin-top:10px"><button class="btn" id="c1Go">Valider ✔</button></div>`;
    show(`<div class="card practice ce1d-q">
      <div class="row between"><span class="chip b">${sub.icon} ${esc(it.themeName)}</span><span class="small muted">${st.i + 1} / ${list.length} · ✅ ${st.ok}</span></div>
      <div class="track" style="height:6px;background:var(--line);border-radius:99px;margin:10px 0 14px;overflow:hidden"><div style="height:100%;width:${st.i / list.length * 100}%;background:var(--grad)"></div></div>
      ${it.ctx ? `<div class="ce1d-ctx">${nl(it.ctx)}</div>` : ""}
      ${it.audio ? `<p class="center"><button type="button" class="btn soft" id="c1Play">🔊 ${esc(T("ce1d.listen"))}</button> <button type="button" class="btn ghost sm" id="c1Slow">🐢</button></p>` : ""}
      <div class="ce1d-question">${nl(it.q)}</div>
      ${input}
      <div class="feedback" id="c1Fb"></div>
      <div class="row" style="justify-content:space-between;margin-top:8px">
        <button class="btn ghost sm" id="c1Quit">✖ ${esc(T("practice.quit"))}</button>
        <button class="btn hidden" id="c1Next">${st.i + 1 < list.length ? "Suivant →" : "Voir mon score →"}</button>
      </div></div>`);
    const voice = sub.voiceLang || "en-GB";
    if (it.audio) { $("#c1Play").onclick = () => speak(it.audio, voice, .9); $("#c1Slow").onclick = () => speak(it.audio, voice, .65); setTimeout(() => speak(it.audio, voice, .9), 300); }
    $("#c1Quit").onclick = () => { speechSynthesis?.cancel?.(); hide(); };
    $("#c1Next").onclick = next;
    inner().querySelectorAll("[data-k]").forEach(b => b.onclick = () => !st.answered && check(Number(b.dataset.k), b.querySelector("span:last-child").textContent));
    inner().querySelectorAll("[data-vf]").forEach(b => b.onclick = () => !st.answered && check(b.dataset.vf === "1", b.dataset.vf === "1" ? "Vrai" : "Faux"));
    const inp = $("#c1In");
    if (inp) {
      inp.focus();
      const go = () => { if (st.answered) return next(); if (!inp.value.trim()) return inp.focus(); check(inp.value, inp.value); };
      $("#c1Go").onclick = go;
      inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); go(); } });
    }
  }
  function check(given, label) {
    const it = list[st.i];
    const ok = checkCe1d(it, given);
    st.answered = true;
    if (ok) st.ok++; else st.wrong.push({ q: (it.ctx ? "[document] " : "") + it.q, given: String(label).slice(0, 120), answer: expectedText(it), theme: it.theme });
    if (it.t === "qcm") inner().querySelectorAll("[data-k]").forEach(b => { b.disabled = true; const k = Number(b.dataset.k); if (k === it.a) b.classList.add("good"); else if (k === given) b.classList.add("bad"); });
    if (it.t === "vf") inner().querySelectorAll("[data-vf]").forEach(b => { b.disabled = true; if ((b.dataset.vf === "1") === it.a) b.classList.replace("soft", "green"); });
    const inp = $("#c1In"); if (inp) { inp.disabled = true; inp.classList.add(ok ? "ok" : "ko"); $("#c1Go").classList.add("hidden"); }
    $("#c1Fb").innerHTML = `<div class="${ok ? "good" : "bad"}">${ok ? esc(T("ce1d.ok")) : esc(T("ce1d.ko"))}</div>
      ${ok ? "" : `<div class="sol">${esc(expectedText(it))}</div>`}
      <p class="ce1d-ex">💡 ${nl(it.ex)}</p>`;
    $("#c1Next").classList.remove("hidden");
    $("#c1Next").focus();
  }
  function next() { st.i++; if (st.i < list.length) q(); else finish(); }
  async function finish() {
    const total = list.length, score = Math.round(st.ok / Math.max(1, total) * 100);
    const res = { subject: subId, theme: themeId || "", themeName: theme ? theme.name : "", ok: st.ok, total, score, wrong: st.wrong, seen: list.map(i => i.q).slice(0, 20), durationSec: Math.round((Date.now() - st.t0) / 1000) };
    const art = score >= 80 ? "assets/scene-bravo.webp" : score >= 50 ? "assets/margaux-sure.webp" : "assets/scene-rate.webp";
    show(`<div class="center">
      <img src="${art}" alt="" style="max-width:200px;border-radius:18px">
      <h2 style="margin:8px 0">${sub.icon} ${st.ok} / ${total}</h2>
      <p style="font-weight:800">${esc(T(score >= 80 ? "ce1d.end.great" : score >= 50 ? "ce1d.end.good" : "ce1d.end.try"))}</p>
      ${st.wrong.length ? `<div class="table-wrap" style="text-align:left;margin-top:10px"><table><thead><tr><th>Question</th><th>Ta réponse</th><th>Bonne réponse</th></tr></thead><tbody>${
        st.wrong.map(w => `<tr><td class="small">${esc(w.q)}</td><td class="small muted">${esc(w.given)}</td><td><b>${esc(w.answer)}</b></td></tr>`).join("")}</tbody></table></div>` : ""}
      <div class="row" style="justify-content:center;margin-top:14px">
        <button class="btn ghost" id="c1Done">Fermer</button>
        <button class="btn" id="c1Again">🔁 ${esc(T("ce1d.again"))}</button>
      </div></div>`);
    $("#c1Done").onclick = hide;
    $("#c1Again").onclick = () => runSeries(subId, themeId, [{ ...res }, ...results], onSave, customItems);
    try { await onSave(res); } catch (e) { console.warn(e); }
  }
  if (!list.length) { hide(); return; }
  q();
}
