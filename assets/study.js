/* =========================================================
   Wesh Words — Cartes mentales & Flashcards (V03-005)
   Une carte mentale ultra-visuelle par matière (construite à partir des catégories de
   vocabulaire déjà existantes et des thèmes CE1D déjà existants — pas de nouveau contenu
   à maintenir en double), qui ouvre des flashcards (recto/verso) par catégorie.
   Pensé pour réviser 5 minutes, même hors ligne mentalement : une bulle, une carte, suivant.
   ========================================================= */
import { $, esc, T, shuffle } from "./app.js";
import { speak, categoriesOf } from "./words.js";
import { subjectById, expectedText } from "./ce1d.js";

const ov = () => $("#overlay"), inner = () => $("#overlayInner");
function show(html) { inner().innerHTML = html; ov().classList.remove("hidden"); inner().scrollTop = 0; }
const hide = () => ov().classList.add("hidden");
const nl2br = s => esc(s).replace(/\n/g, "<br>");

const STUDY_SUBJECTS = [
  { id: "en", icon: "🇬🇧", name: "Anglais", kind: "vocab" },
  { id: "nl", icon: "🇳🇱", name: "Néerlandais", kind: "vocab" },
  { id: "math", icon: "📐", name: "Mathématiques", kind: "ce1d" },
  { id: "francais", icon: "📖", name: "Français", kind: "ce1d" },
  { id: "sciences", icon: "🔬", name: "Sciences", kind: "ce1d" }
];

function wordsOf(s, ctx) { return s.id === "en" ? ctx.words : ctx.wordsNl; }

function nodesFor(s, ctx) {
  if (s.kind === "vocab") {
    return categoriesOf(wordsOf(s, ctx)).map(c => ({ id: c.cat, label: c.cat || "Sans catégorie", count: c.count }));
  }
  const sub = subjectById(s.id);
  return sub.themes.map(t => ({ id: t.id, label: t.name, count: (t.items || []).length }));
}

/** Carte d'accueil élève : une tuile par matière activée → ouvre sa carte mentale */
export function renderStudyCard(el, ctx) {
  const list = STUDY_SUBJECTS.filter(s => ctx.subjects[s.id]);
  if (!list.length) { el.innerHTML = `<p class="muted small">Aucune matière activée pour l'instant.</p>`; return; }
  el.innerHTML = `<p class="small muted">Une carte visuelle par matière : touche une bulle pour réviser en flashcards, même 5 minutes.</p>
    <div class="ce1d-subjects">${list.map(s => {
      const nodes = nodesFor(s, ctx).filter(n => n.count > 0);
      const total = nodes.reduce((a, n) => a + n.count, 0);
      return `<button class="ce1d-sub" data-study="${esc(s.id)}"><span class="ic">${s.icon}</span><b>${esc(s.name)}</b>
        <span class="small muted">${nodes.length} catégorie(s) · ${total} élément(s)</span></button>`;
    }).join("")}</div>`;
  el.querySelectorAll("[data-study]").forEach(b => b.onclick = () => showMindMap(STUDY_SUBJECTS.find(s => s.id === b.dataset.study), ctx));
}

function showMindMap(s, ctx) {
  const nodes = nodesFor(s, ctx).filter(n => n.count > 0);
  const total = nodes.reduce((a, n) => a + n.count, 0);
  if (!nodes.length) {
    show(`<h3>${s.icon} ${esc(s.name)}</h3><p class="note">Rien à réviser ici pour l'instant.</p>
      <div class="row" style="justify-content:center"><button class="btn ghost sm" id="mmClose">Fermer</button></div>`);
    $("#mmClose").onclick = hide;
    return;
  }
  show(`<h3>${s.icon} ${esc(s.name)}</h3>
    <p class="small muted center">Touche une bulle pour réviser cette catégorie en flashcards, ou le centre pour tout mélanger.</p>
    <div class="mindmap-wrap" id="mmWrap"></div>
    <div class="row" style="justify-content:center;margin-top:10px"><button class="btn ghost sm" id="mmClose">Fermer</button></div>`);
  $("#mmClose").onclick = hide;
  renderMindMap($("#mmWrap"), s, nodes, total, ctx);
}

function renderMindMap(el, s, nodes, total, ctx) {
  const W = Math.max(280, el.clientWidth || 520), H = W;
  const cx = W / 2, cy = H / 2, R = W * 0.36;
  const n = nodes.length;
  const maxCount = Math.max(1, ...nodes.map(x => x.count));
  const pts = nodes.map((node, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const size = Math.round(58 + Math.sqrt(node.count / maxCount) * 42);
    return { ...node, x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), size };
  });
  const lines = pts.map(p => `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}"></line>`).join("");
  const bubbles = pts.map(p => {
    const label = p.label.length > 16 ? p.label.slice(0, 15) + "…" : p.label;
    return `<button class="mindmap-node" style="left:${p.x}px;top:${p.y}px;width:${p.size}px;height:${p.size}px" data-node="${esc(p.id)}" title="${esc(p.label)}">${esc(label)}<span class="n">${p.count}</span></button>`;
  }).join("");
  el.innerHTML = `<svg class="mindmap-svg" viewBox="0 0 ${W} ${H}">${lines}</svg>
    <button class="mindmap-center" data-node=""><span class="ic">${s.icon}</span>${esc(s.name)}<span class="n" style="color:#fff;opacity:.9">${total} au total</span></button>
    ${bubbles}`;
  el.querySelectorAll("[data-node]").forEach(b => b.onclick = () => showFlashcards(s, b.dataset.node || null, ctx));
}

function cardsFor(s, nodeId, ctx) {
  if (s.kind === "vocab") {
    const words = wordsOf(s, ctx);
    const filtered = nodeId ? words.filter(w => (w.cat || "") === nodeId) : words;
    return shuffle(filtered).slice(0, 40).map(w => ({
      front: w.fr, back: w.en, cat: w.cat || "Sans catégorie",
      say: { text: w.en, lang: s.id === "nl" ? "nl-NL" : "en-GB" }
    }));
  }
  const sub = subjectById(s.id);
  const themes = nodeId ? sub.themes.filter(t => t.id === nodeId) : sub.themes;
  const items = themes.flatMap(t => (t.items || []).map(it => ({ it, t })));
  return shuffle(items).slice(0, 40).map(({ it, t }) => ({
    front: (it.ctx ? it.ctx + "\n\n" : "") + it.q,
    back: expectedText(it) + (it.ex ? "\n\n💡 " + it.ex : ""),
    cat: t.name
  }));
}

function showFlashcards(s, nodeId, ctx) {
  const cards = cardsFor(s, nodeId, ctx);
  if (!cards.length) {
    show(`<p class="note">Rien à réviser ici pour l'instant.</p><div class="row" style="justify-content:center"><button class="btn ghost sm" id="fcClose">Fermer</button></div>`);
    $("#fcClose").onclick = hide;
    return;
  }
  const st = { i: 0, flipped: false };
  function render() {
    const c = cards[st.i];
    show(`<div class="flashcard-zone">
      <div class="row between"><span class="chip b">${s.icon} ${esc(c.cat)}</span><span class="small muted">${st.i + 1} / ${cards.length}</span></div>
      <div class="flashcard-track"><i style="width:${st.i / cards.length * 100}%"></i></div>
      <div class="flashcard ${st.flipped ? "flip" : ""}" id="fcCard">
        <div class="flashcard-inner">
          <div class="flashcard-face front">${nl2br(c.front)}</div>
          <div class="flashcard-face back">${nl2br(c.back)}</div>
        </div>
      </div>
      <p class="flashcard-hint small">👆 Touche la carte pour retourner</p>
      <div class="flashcard-nav">
        <button class="btn ghost sm" id="fcPrev">← Précédent</button>
        ${c.say ? `<button class="btn soft sm" id="fcSay">🔊 Écouter</button>` : ""}
        <button class="btn sm" id="fcNext">Suivant →</button>
      </div>
      <div class="row" style="justify-content:center;margin-top:10px"><button class="btn ghost sm" id="fcClose">Fermer</button></div>
    </div>`);
    $("#fcCard").onclick = () => { st.flipped = !st.flipped; render(); };
    $("#fcPrev").onclick = () => { st.i = (st.i - 1 + cards.length) % cards.length; st.flipped = false; render(); };
    $("#fcNext").onclick = () => { st.i = (st.i + 1) % cards.length; st.flipped = false; render(); };
    $("#fcClose").onclick = hide;
    $("#fcSay")?.addEventListener("click", () => speak(c.say.text, c.say.lang));
  }
  render();
}
