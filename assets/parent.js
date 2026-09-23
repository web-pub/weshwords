/* Wesh Words — espace parent (« Maman ») */
import {
  db, $, $$, esc, T, guard, initPrivatePage, renderAppHeader, todayKey, dayKeyOffset, fmtDay, fmtTs, toast, errMsg, shuffle,
  doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, collection, query, where, onSnapshot, writeBatch, serverTimestamp,
  arrayRemove, arrayUnion, changeAuthPassword, PSEUDO_DOMAIN, applyContent, MOODS
} from "./app.js";
import { parseVocabFile, dupKey, exportVocab, speak, computeStreak, PER_DIRECTION, DAILY_GOAL, MAX_LEVEL, DEFAULT_SETTINGS, categoriesOf } from "./words.js";
import { SHAME_IDEAS } from "./content.js";
import { mountMemberForm } from "./member-form.js";
import { badgeStats, evaluateBadges, badgesGrid, BADGES } from "./badges.js";
import { playDuel, buildDuelItems, duelWinner, fmtTime, DUEL_PENALTIES, hideOverlay } from "./practice.js";
import { irregularVerbs, activeThemes, filterByThemes } from "./words.js";
import { ocrImages, parseOcrText } from "./ocr.js";
import { pendingFixes } from "./fixes.js";

await initPrivatePage();
const { user, profile } = await guard(["parent", "superadmin"]);
const isSuper = profile.role === "superadmin";
renderAppHeader($("#appHead"), profile, isSuper ? [{ href: "admin.html", label: "Super Admin" }, { href: "parent.html", label: "Espace parent", active: true }] : []);
$("#welcome").textContent = T("parent.welcome", { prenom: profile.prenom || profile.username });
const today = todayKey();

let children = [];
let child = null;
let words = [], sessions = [], shames = [], meta = { queue: [], lastRevealDay: "" };
let settings = { ...DEFAULT_SETTINGS }, settingsDirty = false;
let exams = [], weekOffset = 0, badgesUnlocked = {}, duels = [], proposals = [];
let unsubs = [];
let loaded = { shame: false, meta: false };
let firstLoad = true;

/* ---------------- Enfants ---------------- */
const childQuery = isSuper
  ? query(collection(db, "users"), where("role", "==", "enfant"))
  : query(collection(db, "users"), where("parentUid", "==", user.uid));
onSnapshot(childQuery, snap => {
  children = snap.docs.map(d => ({ uid: d.id, ...d.data() })).sort((a, b) => (a.prenom || "").localeCompare(b.prenom || ""));
  $("#loader").classList.add("hidden");
  $("#main").classList.remove("hidden");
  if (!children.length) {
    $("#noChild").classList.remove("hidden");
    $("#childZone").classList.add("hidden");
    $("#childPicker").innerHTML = "";
    return;
  }
  $("#noChild").classList.add("hidden");
  $("#childZone").classList.remove("hidden");
  const wanted = new URLSearchParams(location.search).get("child");
  const keep = child && children.find(c => c.uid === child.uid);
  const pick = keep || (firstLoad && children.find(c => c.uid === wanted)) || children[0];
  firstLoad = false;
  renderPicker();
  if (!child || child.uid !== pick.uid) selectChild(pick); else { child = pick; renderAccount(); }
}, e => { $("#loader").classList.add("hidden"); $("#main").classList.remove("hidden"); toast(errMsg(e), "err"); });

function renderPicker() {
  $("#childPicker").innerHTML = children.length > 1
    ? children.map(c => `<button class="btn sm ${child?.uid === c.uid ? "" : "ghost"}" data-child="${c.uid}">👧 ${esc(c.prenom || c.username)}</button>`).join("")
    : (children[0] ? `<span class="chip g">👧 ${esc(children[0].prenom || children[0].username)}</span>` : "");
  $$("[data-child]").forEach(b => b.onclick = () => selectChild(children.find(c => c.uid === b.dataset.child)));
}

const childFormOpts = {
  roles: [{ v: "enfant", l: "Élève (enfant)" }],
  parents: null,
  fixedParentUid: user.uid,
  submitLabel: "Créer le compte élève"
};
mountMemberForm($("#childFormHost"), childFormOpts);
mountMemberForm($("#childFormHost2"), childFormOpts);

function selectChild(c) {
  unsubs.forEach(u => u()); unsubs = [];
  child = c; words = []; sessions = []; shames = []; meta = { queue: [], lastRevealDay: "" };
  loaded = { shame: false, meta: false };
  settings = { ...DEFAULT_SETTINGS }; settingsDirty = false; exams = []; weekOffset = 0; badgesUnlocked = {}; duels = []; proposals = [];
  renderPicker();
  $("#shTitle").textContent = T("parent.shame.title", { prenom: c.prenom || c.username });
  const base = ["users", c.uid];
  unsubs.push(onSnapshot(collection(db, ...base, "words"), s => {
    words = s.docs.map(d => ({ id: d.id, ...d.data() }));
    renderVocab(); renderDash(); renderProposals(); renderFixBanner();
    if (!settingsDirty) renderSettings();
  }, e => toast(errMsg(e), "err")));
  unsubs.push(onSnapshot(collection(db, ...base, "sessions"), s => {
    sessions = s.docs.map(d => ({ day: d.id, ...d.data() })).sort((a, b) => b.day.localeCompare(a.day));
    renderDash(); renderHist(); renderBilan();
  }, () => {}));
  unsubs.push(onSnapshot(collection(db, ...base, "proposals"), s => {
    proposals = s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.seconds || 9e12) - (a.createdAt?.seconds || 9e12));
    renderProposals();
  }, () => {}));
  unsubs.push(onSnapshot(collection(db, ...base, "duels"), s => {
    duels = s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.seconds || 9e12) - (a.createdAt?.seconds || 9e12));
    renderDuels(); renderBilan();
  }, () => {}));
  unsubs.push(onSnapshot(doc(db, ...base, "meta", "badges"), s => {
    badgesUnlocked = s.exists() ? (s.data().unlocked || {}) : {};
    renderBadges(); renderBilan();
  }, () => {}));
  unsubs.push(onSnapshot(collection(db, ...base, "exams"), s => {
    exams = s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    renderExams(); renderBilan();
  }, () => {}));
  unsubs.push(onSnapshot(collection(db, ...base, "shame"), s => {
    shames = s.docs.map(d => ({ id: d.id, ...d.data() }));
    loaded.shame = true; renderShame(); renderBilan();
  }, () => {}));
  unsubs.push(onSnapshot(doc(db, ...base, "meta", "shame"), s => {
    meta = s.exists() ? { queue: [], lastRevealDay: "", ...s.data() } : { queue: [], lastRevealDay: "" };
    loaded.meta = true; renderShame();
  }, () => {}));
  unsubs.push(onSnapshot(doc(db, ...base, "meta", "settings"), s => {
    settings = { ...DEFAULT_SETTINGS, ...(s.exists() ? s.data() : {}) };
    if (!settingsDirty) renderSettings(); else renderChildChoice();
  }, () => {}));
  renderAccount();
  renderVocab(); renderDash(); renderHist(); renderShame(); renderSettings(); renderExams(); renderBilan(); renderDuels();
}

/* ---------------- Onglets ---------------- */
$$("#tabs .tab").forEach(t => t.onclick = () => {
  $$("#tabs .tab").forEach(x => x.classList.toggle("on", x === t));
  $$(".panel").forEach(p => p.classList.toggle("on", p.id === "p-" + t.dataset.tab));
});

/* ---------------- Overlay ---------------- */
function openOverlay(html) {
  $("#overlayInner").innerHTML = html + `<div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn ghost sm" id="ovClose">Fermer</button></div>`;
  $("#overlay").classList.remove("hidden");
  $("#ovClose").onclick = closeOverlay;
}
function closeOverlay() { $("#overlay").classList.add("hidden"); }
// (pas de fermeture en cliquant à côté : évite de perdre un duel ou une correction de photo en cours)

const lvlDots = l => `<span class="lvl" title="Niveau ${l || 0}">${Array.from({ length: MAX_LEVEL }, (_, i) => `<i class="${i < (l || 0) ? "on" : ""}"></i>`).join("")}</span>`;
const wordsCol = () => collection(db, "users", child.uid, "words");

/* ---------------- Tableau de bord ---------------- */
function renderDash() {
  if (!child) return;
  const t = sessions.find(s => s.day === today);
  const tot = t ? Math.min(DAILY_GOAL, (t.frEn || 0) + (t.enFr || 0)) : 0;
  $("#dToday").textContent = `${tot}/${DAILY_GOAL}${t?.completed ? " ✅" : ""}`;
  const done = new Set(sessions.filter(s => s.completed).map(s => s.day));
  $("#dStreak").textContent = computeStreak(done, today, dayKeyOffset);
  $("#dMaster").textContent = words.filter(w => (w.level || 0) >= MAX_LEVEL).length;
  $("#dWords").textContent = words.length;

  let bars = "";
  for (let i = 6; i >= 0; i--) {
    const k = dayKeyOffset(today, -i), s = sessions.find(x => x.day === k);
    const ok = s ? Math.min(DAILY_GOAL, (s.frEn || 0) + (s.enFr || 0)) : 0, ko = s?.errors || 0;
    bars += `<div class="b" title="${esc(fmtDay(k))} : ${ok}/20, ${ko} erreur(s)">
      <div style="display:flex;gap:2px;align-items:flex-end;height:100%;width:100%;justify-content:center">
        <div class="c" style="height:${ok / DAILY_GOAL * 100}%"></div>
        <div class="c ko" style="height:${Math.min(100, ko / DAILY_GOAL * 100)}%;max-width:10px"></div></div>
      <span>${esc(fmtDay(k).split(" ")[0])}</span></div>`;
  }
  $("#dBars").innerHTML = bars;

  const counts = Array.from({ length: MAX_LEVEL + 1 }, (_, l) => words.filter(w => (w.level || 0) === l).length);
  const max = Math.max(1, ...counts);
  $("#dLevels").innerHTML = counts.map((n, l) => `
    <div class="row" style="margin:6px 0;flex-wrap:nowrap"><span style="width:70px" class="small"><b>Niv. ${l}</b></span>
    <div class="track" style="flex:1;height:12px;background:var(--bg2);border-radius:99px;overflow:hidden"><div style="height:100%;width:${n / max * 100}%;background:var(--grad)"></div></div>
    <span class="small" style="width:44px;text-align:right">${n}</span></div>`).join("");

  const hard = words.filter(w => (w.ko || 0) > 0)
    .sort((a, b) => ((b.ko || 0) - (b.ok || 0) * .5) - ((a.ko || 0) - (a.ok || 0) * .5)).slice(0, 10);
  renderBadges(); renderPracticeDash();
  $("#dHard").innerHTML = hard.length ? `<div class="table-wrap"><table><thead><tr><th>Français</th><th>Anglais</th><th>Niveau</th><th>✅</th><th>❌</th></tr></thead><tbody>${
    hard.map(w => `<tr><td>${esc(w.fr)}</td><td><b>${esc(w.en)}</b></td><td>${lvlDots(w.level)}</td><td>${w.ok || 0}</td><td>${w.ko || 0}</td></tr>`).join("")}</tbody></table></div>`
    : `<p class="muted">Pas encore de mot difficile.</p>`;
}

/* ---------------- Vocabulaire ---------------- */
let vPage = 0;
const PAGE = 50;
function filtered() {
  const q = $("#vSearch").value.trim().toLowerCase(), c = $("#vCat").value, l = $("#vLvl").value;
  return words.filter(w =>
    (!q || (w.fr || "").toLowerCase().includes(q) || (w.en || "").toLowerCase().includes(q)) &&
    (!c || w.cat === c) && (l === "" || (w.level || 0) === Number(l))
  ).sort((a, b) => (a.cat || "").localeCompare(b.cat || "") || (a.fr || "").localeCompare(b.fr || ""));
}
function renderVocab() {
  if (!child) return;
  const cats = [...new Set(words.map(w => w.cat).filter(Boolean))].sort();
  const cur = $("#vCat").value;
  $("#vCat").innerHTML = `<option value="">Toutes les catégories</option>` + cats.map(c => `<option ${c === cur ? "selected" : ""}>${esc(c)}</option>`).join("");
  $("#catList").innerHTML = cats.map(c => `<option value="${esc(c)}">`).join("");
  const list = filtered();
  const pages = Math.max(1, Math.ceil(list.length / PAGE));
  vPage = Math.min(vPage, pages - 1);
  $("#vCount").textContent = `${list.length} / ${words.length}`;
  $("#vBody").innerHTML = list.slice(vPage * PAGE, vPage * PAGE + PAGE).map(w => `
    <tr><td>${esc(w.fr)}</td><td><b>${esc(w.en)}</b>${w.conj ? `<div class="small muted">${esc(w.conj)}</div>` : ""}</td>
    <td>${w.cat ? `<span class="chip b">${esc(w.cat)}</span>` : ""}</td><td>${lvlDots(w.level)}</td>
    <td class="small">${w.ok || 0} / ${w.ko || 0}</td>
    <td class="actions"><button class="icon-btn" data-say="${w.id}" title="Écouter">🔊</button>
    <button class="icon-btn" data-edit="${w.id}" title="Modifier">✏️</button>
    <button class="icon-btn" data-del="${w.id}" title="Supprimer">🗑️</button></td></tr>`).join("")
    || `<tr><td colspan="6" class="muted center">Aucun mot. Ajoute-en ou importe un fichier Excel.</td></tr>`;
  $("#vPager").innerHTML = pages > 1 ? `<button class="btn ghost sm" id="pgPrev" ${vPage ? "" : "disabled"}>←</button><span class="small">Page ${vPage + 1} / ${pages}</span><button class="btn ghost sm" id="pgNext" ${vPage < pages - 1 ? "" : "disabled"}>→</button>` : "";
  $("#pgPrev")?.addEventListener("click", () => { vPage--; renderVocab(); });
  $("#pgNext")?.addEventListener("click", () => { vPage++; renderVocab(); });
  $$("[data-say]").forEach(b => b.onclick = () => speak(words.find(w => w.id === b.dataset.say)?.en));
  $$("[data-edit]").forEach(b => b.onclick = () => editWord(words.find(w => w.id === b.dataset.edit)));
  $$("[data-del]").forEach(b => b.onclick = async () => {
    const w = words.find(x => x.id === b.dataset.del);
    if (!confirm(`Supprimer « ${w.fr} → ${w.en} » ?`)) return;
    deleteDoc(doc(wordsCol(), w.id)).catch(e => toast(errMsg(e), "err"));
  });
}
["vSearch", "vCat", "vLvl"].forEach(id => $("#" + id).addEventListener("input", () => { vPage = 0; renderVocab(); }));

function editWord(w) {
  openOverlay(`<h3>✏️ Modifier le mot</h3>
    <form id="ewForm">
      <div class="grid g2"><div class="field"><label>Français</label><input type="text" id="ewFr" value="${esc(w.fr)}" required></div>
      <div class="field"><label>Anglais</label><input type="text" id="ewEn" value="${esc(w.en)}" required></div></div>
      <div class="grid g2"><div class="field"><label>Catégorie</label><input type="text" id="ewCat" value="${esc(w.cat || "")}" list="catList"></div>
      <div class="field"><label>Nature</label><input type="text" id="ewNat" value="${esc(w.nature || "")}"></div></div>
      <div class="field"><label>Exemple</label><input type="text" id="ewEx" value="${esc(w.ex || "")}"></div>
      <div class="field"><label>Conjugaison / formes</label><input type="text" id="ewConj" value="${esc(w.conj || "")}"></div>
      <div class="grid g2"><div class="field"><label>Autres réponses acceptées en français <span class="small muted">(séparées par /)</span></label><input type="text" id="ewAltFr" value="${esc((w.altFr || []).join(" / "))}"></div>
      <div class="field"><label>Autres réponses acceptées en anglais <span class="small muted">(séparées par /)</span></label><input type="text" id="ewAltEn" value="${esc((w.altEn || []).join(" / "))}"></div></div>
      <div class="field"><label>Niveau (0 à 5)</label><input type="number" min="0" max="5" id="ewLvl" value="${w.level || 0}"></div>
      <button class="btn" type="submit">Enregistrer</button>
    </form>`);
  $("#ewForm").onsubmit = async ev => {
    ev.preventDefault();
    try {
      await updateDoc(doc(wordsCol(), w.id), {
        fr: $("#ewFr").value.trim(), en: $("#ewEn").value.trim(), cat: $("#ewCat").value.trim(),
        nature: $("#ewNat").value.trim(), ex: $("#ewEx").value.trim(), conj: $("#ewConj").value.trim(),
        altFr: $("#ewAltFr").value.split("/").map(x => x.trim()).filter(Boolean),
        altEn: $("#ewAltEn").value.split("/").map(x => x.trim()).filter(Boolean),
        level: Math.max(0, Math.min(MAX_LEVEL, Number($("#ewLvl").value) || 0))
      });
      toast("Mot modifié ✅"); closeOverlay();
    } catch (e) { toast(errMsg(e), "err"); }
  };
}

$("#addWord").addEventListener("submit", async ev => {
  ev.preventDefault();
  const w = { fr: $("#awFr").value.trim(), en: $("#awEn").value.trim(), cat: $("#awCat").value.trim(), nature: $("#awNat").value, ex: $("#awEx").value.trim(), conj: $("#awConj").value.trim(), note: "", irr: !!$("#awConj").value.trim() };
  if (!w.fr || !w.en) return;
  const keys = new Set(words.map(dupKey));
  if (keys.has(dupKey(w))) { toast("Ce mot existe déjà dans la liste.", "warn"); return; }
  try {
    await addDoc(wordsCol(), { ...w, level: 0, ok: 0, ko: 0, seen: 0, createdAt: serverTimestamp() });
    toast("Mot ajouté ✅");
    ["awFr", "awEn", "awEx", "awConj"].forEach(id => $("#" + id).value = "");
    $("#awFr").focus();
  } catch (e) { toast(errMsg(e), "err"); }
});

/* Import */
async function writeWords(list) {
  let done = 0;
  for (let i = 0; i < list.length; i += 400) {
    const b = writeBatch(db);
    list.slice(i, i + 400).forEach(w => b.set(doc(wordsCol()), { ...w, level: 0, ok: 0, ko: 0, seen: 0, createdAt: serverTimestamp() }));
    await b.commit();
    done += Math.min(400, list.length - i);
    $("#impPreview").innerHTML = `<p class="note">Import en cours… ${done} / ${list.length}</p>`;
  }
}
function previewImport(rows, sourceLabel) {
  const existing = new Set(words.map(dupKey));
  const seen = new Set();
  const fresh = [], dups = [];
  rows.forEach(r => {
    const k = dupKey(r);
    if (existing.has(k) || seen.has(k)) dups.push(r); else { seen.add(k); fresh.push(r); }
  });
  $("#impPreview").innerHTML = `
    <div class="note">
      <b>${esc(sourceLabel)}</b> : ${rows.length} ligne(s) lue(s) — <b style="color:var(--green)">${fresh.length} nouveau(x)</b>, ${dups.length} doublon(s) ignoré(s).
      ${fresh.length ? `<div class="table-wrap" style="margin:10px 0;max-height:220px"><table><thead><tr><th>Français</th><th>Anglais</th><th>Catégorie</th></tr></thead><tbody>${
        fresh.slice(0, 12).map(w => `<tr><td>${esc(w.fr)}</td><td>${esc(w.en)}</td><td class="small">${esc(w.cat)}</td></tr>`).join("")}
        ${fresh.length > 12 ? `<tr><td colspan="3" class="muted small">… et ${fresh.length - 12} autre(s)</td></tr>` : ""}</tbody></table></div>
        <button class="btn sm" id="impGo">Importer ${fresh.length} mot(s)</button>` : ""}
      <button class="btn ghost sm" id="impCancel">Annuler</button>
    </div>`;
  $("#impCancel").onclick = () => { $("#impPreview").innerHTML = ""; $("#impFile").value = ""; };
  $("#impGo")?.addEventListener("click", async () => {
    try { await writeWords(fresh); toast(`${fresh.length} mot(s) importé(s) ✅`); $("#impPreview").innerHTML = ""; $("#impFile").value = ""; }
    catch (e) { toast(errMsg(e), "err"); }
  });
}
$("#impFile").addEventListener("change", async () => {
  const f = $("#impFile").files[0];
  if (!f) return;
  try { previewImport(await parseVocabFile(f), f.name); }
  catch (e) { toast(errMsg(e), "err"); }
});
$("#btnSeed").onclick = async () => {
  try {
    const raw = await (await fetch("assets/vocab-margaux.json")).json();
    const rows = raw.map(r => ({ fr: r.fr, en: r.en, cat: r.c || "", nature: r.n || "", ex: r.x || "", note: r.o || "", irr: !!r.i, conj: r.g || "" }));
    previewImport(rows, "Vocabulaire de départ");
  } catch (e) { toast(errMsg(e), "err"); }
};
$("#btnExport").onclick = () => {
  try { exportVocab(words, `WeshWords-${(child.prenom || "eleve").replace(/\s+/g, "")}-vocabulaire.xlsx`); }
  catch (e) { toast(errMsg(e), "err"); }
};
$("#btnResetLvls").onclick = async () => {
  if (!confirm("Remettre le niveau de TOUS les mots à 0 (et effacer les compteurs) ?")) return;
  for (let i = 0; i < words.length; i += 400) {
    const b = writeBatch(db);
    words.slice(i, i + 400).forEach(w => b.update(doc(wordsCol(), w.id), { level: 0, ok: 0, ko: 0, seen: 0 }));
    await b.commit().catch(e => toast(errMsg(e), "err"));
  }
  toast("Niveaux remis à zéro.");
};
$("#btnDelFiltered").onclick = async () => {
  const list = filtered();
  if (!list.length) return;
  if (!confirm(`Supprimer définitivement ${list.length} mot(s) (selon les filtres actuels) ?`)) return;
  for (let i = 0; i < list.length; i += 400) {
    const b = writeBatch(db);
    list.slice(i, i + 400).forEach(w => b.delete(doc(wordsCol(), w.id)));
    await b.commit().catch(e => toast(errMsg(e), "err"));
  }
  toast(`${list.length} mot(s) supprimé(s).`);
};

/* ---------------- Mots de la honte ---------------- */
let pickHonte = 5;
function renderSkullPicker() {
  $("#asHonte").innerHTML = [1, 2, 3, 4, 5, 6].map(n => `<button type="button" data-h="${n}" class="${n <= pickHonte ? "on" : ""}">💀</button>`).join("");
  $$("#asHonte [data-h]").forEach(b => b.onclick = () => { pickHonte = Number(b.dataset.h); renderSkullPicker(); });
}
renderSkullPicker();
let hidePending = false;
try { hidePending = localStorage.getItem("ww-hide-pending") === "1"; } catch (e) {}
$("#chkHide").checked = hidePending;
$("#chkHide").onchange = () => { hidePending = $("#chkHide").checked; try { localStorage.setItem("ww-hide-pending", hidePending ? "1" : "0"); } catch (e) {} renderShame(); };

const shameCol = () => collection(db, "users", child.uid, "shame");
const metaRef = () => doc(db, "users", child.uid, "meta", "shame");
const fillP = s => String(s || "").replace(/\{prenom\}/g, child?.prenom || "");
function pendingOrdered() {
  const pend = shames.filter(s => !s.revealed);
  const byId = Object.fromEntries(pend.map(s => [s.id, s]));
  const ordered = (meta.queue || []).map(id => byId[id]).filter(Boolean);
  const orphans = pend.filter(s => !(meta.queue || []).includes(s.id));
  return { ordered, orphans };
}
async function saveQueue(queue) {
  await setDoc(metaRef(), { queue, lastRevealDay: meta.lastRevealDay || "" }, { merge: true });
}
let repairTimer = null;
function queueMismatch() {
  const { ordered, orphans } = pendingOrdered();
  const clean = [...ordered, ...orphans].map(s => s.id);
  return JSON.stringify(clean) !== JSON.stringify(meta.queue || []) ? clean : null;
}
// Répare la file (ids obsolètes / expressions absentes) seulement si l'écart persiste
function scheduleRepair() {
  clearTimeout(repairTimer);
  if (!loaded.shame || !loaded.meta || !queueMismatch()) return;
  const uidAtStart = child.uid;
  repairTimer = setTimeout(() => {
    const clean = child && child.uid === uidAtStart && queueMismatch();
    if (clean) saveQueue(clean).catch(() => {});
  }, 3000);
}
function renderShame() {
  if (!child) return;
  const { ordered, orphans } = pendingOrdered();
  // Répare la file si des expressions en attente n'y figurent pas (ou si elle contient des ids obsolètes)
  scheduleRepair();
  const pend = [...ordered, ...orphans];
  const dates = meta.dates || {};
  const nextId = (pend.find(s => !dates[s.id] || dates[s.id] <= today) || {}).id;
  $("#shPendingCount").textContent = pend.length;
  $("#shPending").innerHTML = pend.map((s, i) => `
    <tr><td>${i + 1}${s.id === nextId ? ' <span class="chip p">prochaine</span>' : ""}</td>
    <td><b>${hidePending ? "🙈 ••••••" : "« " + esc(s.expression) + " »"}</b></td>
    <td class="muted small">${hidePending ? "••••••" : esc(fillP(s.phrase))}</td>
    <td class="skulls">${"💀".repeat(s.honte || 1)}</td>
    <td>${dates[s.id] ? `<span class="chip ${dates[s.id] > today ? "w" : "g"}">📅 ${esc(fmtDay(dates[s.id]))}</span>` : ""}</td>
    <td class="actions">
      <button class="icon-btn" data-up="${s.id}" title="Monter" ${i ? "" : "disabled"}>↑</button>
      <button class="icon-btn" data-down="${s.id}" title="Descendre" ${i < pend.length - 1 ? "" : "disabled"}>↓</button>
      <button class="icon-btn" data-sedit="${s.id}" title="Modifier">✏️</button>
      <button class="icon-btn" data-sdel="${s.id}" title="Supprimer">🗑️</button></td></tr>`).join("")
    || `<tr><td colspan="6" class="muted center">Aucune expression en attente. Prépare la prochaine ! 😈</td></tr>`;

  const done = shames.filter(s => s.revealed).sort((a, b) => (b.revealedDay || "").localeCompare(a.revealedDay || ""));
  $("#shDoneCount").textContent = done.length;
  $("#shDone").innerHTML = done.map(s => `
    <tr><td><b>« ${esc(s.expression)} »</b></td><td class="muted small">${esc(fillP(s.phrase))}</td>
    <td class="skulls">${"💀".repeat(s.honte || 1)}</td><td class="small">${esc(fmtDay(s.revealedDay))}</td>
    <td class="actions"><button class="icon-btn" data-again="${s.id}" title="Remettre en attente">↩️</button>
    <button class="icon-btn" data-sdel="${s.id}" title="Supprimer">🗑️</button></td></tr>`).join("")
    || `<tr><td colspan="5" class="muted center">Rien de révélé pour l'instant.</td></tr>`;

  const ids = pend.map(s => s.id);
  const move = (id, d) => { const q = [...ids]; const i = q.indexOf(id); const j = i + d; if (j < 0 || j >= q.length) return; [q[i], q[j]] = [q[j], q[i]]; saveQueue(q).catch(e => toast(errMsg(e), "err")); };
  $$("[data-up]").forEach(b => b.onclick = () => move(b.dataset.up, -1));
  $$("[data-down]").forEach(b => b.onclick = () => move(b.dataset.down, 1));
  $$("[data-sdel]").forEach(b => b.onclick = async () => {
    if (!confirm("Supprimer cette expression ?")) return;
    const bt = writeBatch(db);
    bt.delete(doc(shameCol(), b.dataset.sdel));
    bt.set(metaRef(), { queue: arrayRemove(b.dataset.sdel) }, { merge: true });
    bt.commit().catch(e => toast(errMsg(e), "err"));
  });
  $$("[data-again]").forEach(b => b.onclick = async () => {
    const bt = writeBatch(db);
    bt.update(doc(shameCol(), b.dataset.again), { revealed: false, revealedDay: "", revealedAt: null });
    bt.set(metaRef(), { queue: [...ids, b.dataset.again] }, { merge: true });
    bt.commit().catch(e => toast(errMsg(e), "err"));
  });
  $$("[data-sedit]").forEach(b => b.onclick = () => editShame(shames.find(s => s.id === b.dataset.sedit)));
}
function editShame(s) {
  let h = s.honte || 5;
  openOverlay(`<h3>✏️ Modifier l'expression</h3>
    <form id="esForm">
      <div class="field"><label>Expression</label><input type="text" id="esExpr" value="${esc(s.expression)}" required></div>
      <div class="field"><label>Phrase</label><input type="text" id="esPhrase" value="${esc(s.phrase || "")}"></div>
      <div class="field"><label>Honte</label><div class="skull-pick" id="esHonte"></div></div>
      ${s.revealed ? "" : `<div class="field"><label>Pas avant le (laisser vide = dès que possible)</label><input type="date" id="esDate" value="${esc((meta.dates || {})[s.id] || "")}"></div>`}
      <button class="btn" type="submit">Enregistrer</button>
    </form>`);
  const draw = () => {
    $("#esHonte").innerHTML = [1, 2, 3, 4, 5, 6].map(n => `<button type="button" data-h="${n}" class="${n <= h ? "on" : ""}">💀</button>`).join("");
    $$("#esHonte [data-h]").forEach(b => b.onclick = () => { h = Number(b.dataset.h); draw(); });
  };
  draw();
  $("#esForm").onsubmit = async ev => {
    ev.preventDefault();
    try {
      const bt = writeBatch(db);
      bt.update(doc(shameCol(), s.id), { expression: $("#esExpr").value.trim(), phrase: $("#esPhrase").value.trim(), honte: h });
      if ($("#esDate")) bt.set(metaRef(), { dates: { [s.id]: $("#esDate").value || "" } }, { merge: true });
      await bt.commit(); closeOverlay(); toast("Expression modifiée ✅");
    }
    catch (e) { toast(errMsg(e), "err"); }
  };
}
async function addShames(list) {
  const b = writeBatch(db);
  const ids = [], newDates = {};
  list.forEach(x => {
    const r = doc(shameCol());
    ids.push(r.id);
    b.set(r, { expression: x.expression, phrase: x.phrase || "", honte: x.honte || 5, revealed: false, revealedDay: "", createdAt: serverTimestamp() });
    if (x.date) newDates[r.id] = x.date;
  });
  const { ordered, orphans } = pendingOrdered();
  const upd = { queue: [...ordered, ...orphans].map(s => s.id).concat(ids), lastRevealDay: meta.lastRevealDay || "" };
  if (Object.keys(newDates).length) upd.dates = newDates;
  b.set(metaRef(), upd, { merge: true });
  await b.commit();
}
$("#addShame").addEventListener("submit", async ev => {
  ev.preventDefault();
  const expression = $("#asExpr").value.trim();
  if (!expression) return;
  try {
    await addShames([{ expression, phrase: $("#asPhrase").value.trim(), honte: pickHonte, date: $("#asDate").value || "" }]);
    $("#asExpr").value = ""; $("#asPhrase").value = ""; $("#asDate").value = "";
    toast("Expression ajoutée à la file 😈");
  } catch (e) { toast(errMsg(e), "err"); }
});
$("#btnIdeas").onclick = async () => {
  const have = new Set(shames.map(s => (s.expression || "").toLowerCase()));
  const list = SHAME_IDEAS.filter(i => !have.has(i.expression.toLowerCase()));
  if (!list.length) { toast("Toutes les idées sont déjà dans ta liste.", "warn"); return; }
  try { await addShames(list); toast(`${list.length} idée(s) ajoutée(s) 💀`); } catch (e) { toast(errMsg(e), "err"); }
};
$("#btnShuffle").onclick = async () => {
  const { ordered, orphans } = pendingOrdered();
  const q = shuffle([...ordered, ...orphans].map(s => s.id));
  try { await saveQueue(q); toast("Ordre mélangé 🎲 — surprise !"); } catch (e) { toast(errMsg(e), "err"); }
};

/* ---------------- Historique ---------------- */
function renderHist() {
  if (!child) return;
  $("#hBody").innerHTML = sessions.map(s => {
    const ok = Math.min(DAILY_GOAL, (s.frEn || 0) + (s.enFr || 0));
    const rate = s.attempts ? Math.round(ok / s.attempts * 100) : 0;
    return `<tr><td><b>${esc(fmtDay(s.day))}</b><div class="small muted">${esc(s.day)}</div></td>
      <td>${s.frEn || 0}/${PER_DIRECTION}</td><td>${s.enFr || 0}/${PER_DIRECTION}</td><td>${s.attempts || 0}</td><td>${s.errors || 0}</td>
      <td>${rate}%</td><td>${s.helped || 0}${s.qcm ? ` <span class="small muted">(+${s.qcm} QCM auto)</span>` : ""}</td><td>${s.bonus || 0}</td>
      <td>${s.completed ? '<span class="chip g">20/20 ✅</span>' : (s.attempts ? '<span class="chip w">en cours</span>' : "")}</td>
      <td class="actions">${(s.wrong || []).length ? `<button class="btn ghost sm" data-wrong="${s.day}">Erreurs</button>` : ""}</td></tr>`;
  }).join("") || `<tr><td colspan="10" class="muted center">Aucune session pour l'instant.</td></tr>`;
  $$("[data-wrong]").forEach(b => b.onclick = () => {
    const s = sessions.find(x => x.day === b.dataset.wrong);
    openOverlay(`<h3>❌ Erreurs du ${esc(fmtDay(s.day))}</h3><div class="table-wrap"><table><thead><tr><th>Sens</th><th>Question</th><th>Réponse donnée</th><th>Attendu</th></tr></thead><tbody>${
      (s.wrong || []).map(w => `<tr><td>${w.dir === "frEn" ? "🇫🇷→🇬🇧" : "🇬🇧→🇫🇷"}${w.help ? " 💡" : ""}</td><td>${esc(w.dir === "frEn" ? w.fr : w.en)}</td><td class="muted">${esc(w.given || "—")}</td><td><b>${esc(w.dir === "frEn" ? w.en : w.fr)}</b></td></tr>`).join("")
    }</tbody></table></div>`);
  });
}

/* ---------------- Comptes ---------------- */
function renderAccount() {
  if (!child) return;
  $("#acChildName").textContent = child.prenom || child.username;
  const mail = child.email && !child.email.endsWith("@" + PSEUDO_DOMAIN) ? child.email : "— (e-mail technique)";
  $("#acChildInfo").innerHTML = `Utilisateur : <b>${esc(child.username)}</b><br>E-mail : ${esc(mail)}`;
}
$("#childPwdForm").addEventListener("submit", async ev => {
  ev.preventDefault();
  const nw = $("#cpNew").value;
  try {
    await changeAuthPassword(child.email, $("#cpOld").value, nw);
    await setDoc(doc(db, "secrets", child.uid), { username: child.username, email: child.email, password: nw, updatedAt: serverTimestamp() }, { merge: true });
    toast("Mot de passe de l'enfant modifié ✅");
    ev.target.reset();
  } catch (e) { toast(errMsg(e), "err"); }
});
$("#myPwdForm").addEventListener("submit", async ev => {
  ev.preventDefault();
  const nw = $("#mpNew").value;
  try {
    await changeAuthPassword(profile.email, $("#mpOld").value, nw);
    await setDoc(doc(db, "secrets", user.uid), { username: profile.username, email: profile.email, password: nw, updatedAt: serverTimestamp() }, { merge: true });
    toast("Ton mot de passe a été modifié ✅");
    ev.target.reset();
  } catch (e) { toast(errMsg(e), "err"); }
});

/* ---------------- Réglages (thèmes & aides) ---------------- */
function renderChildChoice() {
  const ct = settings.childThemes || [];
  $("#stChildChoice").textContent = `Choix actuel de ${child?.prenom || "l'élève"} : ` + (ct.length ? ct.join(", ") : "tous les thèmes");
}
function renderSettings() {
  if (!child) return;
  $("#stChildName").textContent = child.prenom || child.username;
  const lock = !!settings.themesLocked;
  $$('input[name="thMode"]').forEach(r => r.checked = (r.value === (lock ? "lock" : "free")));
  $("#stLockZone").classList.toggle("hidden", !lock);
  const chosen = new Set(settings.themes || []);
  $("#stThemes").innerHTML = categoriesOf(words).map(c =>
    `<label class="check"><input type="checkbox" data-scat="${esc(c.cat)}" ${chosen.has(c.cat) ? "checked" : ""}> ${esc(c.cat || "Sans catégorie")} <span class="n">${c.count}</span></label>`).join("")
    || `<p class="muted small">Ajoute d'abord du vocabulaire.</p>`;
  $("#stUntil").value = settings.themesUntil || "";
  $("#stHints").checked = settings.hints !== false;
  $("#stAutoQcm").checked = settings.autoQcm !== false;
  $("#stMinWords").value = settings.qcmMinWords || 4;
  renderChildChoice();
}
$("#p-settings").addEventListener("input", () => { settingsDirty = true; });
$("#p-settings").addEventListener("change", ev => {
  settingsDirty = true;
  if (ev.target.name === "thMode") $("#stLockZone").classList.toggle("hidden", ev.target.value !== "lock");
});
$("#stAll").onclick = () => { settingsDirty = true; $$("[data-scat]").forEach(b => b.checked = true); };
$("#stNone").onclick = () => { settingsDirty = true; $$("[data-scat]").forEach(b => b.checked = false); };
$("#stSave").onclick = async () => {
  const lock = $('input[name="thMode"]:checked')?.value === "lock";
  const themes = $$("[data-scat]").filter(b => b.checked).map(b => b.dataset.scat);
  if (lock && !themes.length) { toast("Coche au moins un thème à imposer.", "warn"); return; }
  const data = {
    themesLocked: lock, themes, themesUntil: lock ? ($("#stUntil").value || "") : "",
    hints: $("#stHints").checked, autoQcm: $("#stAutoQcm").checked,
    qcmMinWords: Math.max(2, Math.min(12, Number($("#stMinWords").value) || 4))
  };
  try {
    await setDoc(doc(db, "users", child.uid, "meta", "settings"), data, { merge: true });
    settingsDirty = false;
    toast("Réglages enregistrés ✅");
  } catch (e) { toast(errMsg(e), "err"); }
};

/* ---------------- Contrôles blancs (historique) ---------------- */
const dirLabel = d => d === "frEn" ? "🇫🇷→🇬🇧" : d === "enFr" ? "🇬🇧→🇫🇷" : "🔀";
function renderExams() {
  if (!child) return;
  $("#xBody").innerHTML = exams.map(x => `<tr><td><b>${esc(fmtDay(x.day))}</b></td>
    <td class="small">${esc((x.themes || []).join(", "))} <span class="muted">${dirLabel(x.dir)}</span></td>
    <td><span class="chip ${x.score >= 90 ? "g" : x.score >= 70 ? "b" : x.score >= 50 ? "w" : "p"}">${x.ok}/${x.total} · ${x.score}%</span></td>
    <td>${x.helped || 0}</td><td class="small">${Math.max(1, Math.round((x.durationSec || 0) / 60))} min</td>
    <td class="actions">${(x.wrong || []).length ? `<button class="btn ghost sm" data-xw="${x.id}">Erreurs</button>` : ""}</td></tr>`).join("")
    || `<tr><td colspan="6" class="muted center">Aucun contrôle blanc pour l'instant.</td></tr>`;
  $$("[data-xw]").forEach(b => b.onclick = () => {
    const x = exams.find(e => e.id === b.dataset.xw);
    openOverlay(`<h3>❌ Erreurs du contrôle du ${esc(fmtDay(x.day))}</h3><div class="table-wrap"><table><thead><tr><th>Sens</th><th>Français</th><th>Anglais</th></tr></thead><tbody>${
      (x.wrong || []).map(w => `<tr><td>${dirLabel(w.dir)}</td><td>${esc(w.fr)}</td><td><b>${esc(w.en)}</b></td></tr>`).join("")}</tbody></table></div>`);
  });
}

/* ---------------- Bilan de la semaine ---------------- */
function weekDays(offset) {
  const dow = (new Date().getDay() + 6) % 7; // lundi = 0
  const monday = dayKeyOffset(today, -dow + offset * 7);
  return Array.from({ length: 7 }, (_, i) => dayKeyOffset(monday, i));
}
function weekStats() {
  const days = weekDays(weekOffset);
  const inWeek = k => k >= days[0] && k <= days[6];
  const ss = days.map(k => sessions.find(s => s.day === k) || null);
  const done = ss.filter(s => s?.completed).length;
  const good = ss.reduce((a, s) => a + (s ? Math.min(DAILY_GOAL, (s.frEn || 0) + (s.enFr || 0)) : 0), 0);
  const attempts = ss.reduce((a, s) => a + (s?.attempts || 0), 0);
  const errors = ss.reduce((a, s) => a + (s?.errors || 0), 0);
  const helped = ss.reduce((a, s) => a + (s?.helped || 0), 0);
  const mastered = ss.flatMap(s => s?.mastered || []);
  const cnt = new Map();
  ss.forEach(s => (s?.wrong || []).forEach(w => { const k = w.fr + "|" + w.en; cnt.set(k, { fr: w.fr, en: w.en, n: (cnt.get(k)?.n || 0) + 1 }); }));
  const hard = [...cnt.values()].sort((a, b) => b.n - a.n).slice(0, 8);
  const xs = exams.filter(x => inWeek(x.day || ""));
  const sh = shames.filter(x => x.revealed && inWeek(x.revealedDay || ""));
  const doneSet = new Set(sessions.filter(s => s.completed).map(s => s.day));
  const bw = BADGES.filter(b => inWeek(badgesUnlocked[b.id] || ""));
  const sum = k => ss.reduce((a, s) => a + (s?.[k] || 0), 0);
  return { bw, verbs: sum("verbs"), verbsOk: sum("verbsOk"), dictee: sum("dictee"), dicteeOk: sum("dicteeOk"),
    duels: duels.filter(d => inWeek(d.day || "") && duelWinner(d)), days, ss, done, good, attempts, errors, helped, mastered, hard, xs, sh, streak: computeStreak(doneSet, today, dayKeyOffset) };
}
function renderBilan() {
  if (!child || !$("#bilanBody")) return;
  const st = weekStats();
  const prenom = child.prenom || child.username;
  const key = st.done >= 5 ? "r5" : st.done >= 3 ? "r3" : st.done >= 1 ? "r1" : "r0";
  const art = st.done >= 5 ? MOODS.bravo : st.done >= 3 ? MOODS.sure : st.done >= 1 ? MOODS.reflechie : MOODS.rate;
  const rate = st.attempts ? Math.round(st.good / st.attempts * 100) : 0;
  const names = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  $("#bNext").disabled = weekOffset >= 0;
  $("#bilanBody").innerHTML = `
    <div class="card">
      <div class="bilan-head">
        <img src="${art}" alt="">
        <div>
          <h2 style="margin-bottom:4px">${esc(T("bilan.title"))} — ${esc(prenom)}</h2>
          <p class="muted" style="margin-bottom:6px">Du ${esc(fmtDay(st.days[0]))} au ${esc(fmtDay(st.days[6]))}</p>
          <p style="font-weight:800;font-size:1.1rem">${esc(T("bilan." + key, { prenom }))}</p>
          <div class="week">${st.days.map((k, i) => { const s = st.ss[i]; const c = s?.completed ? "ok" : s?.attempts ? "part" : "";
            return `<div class="wd ${c}">${names[i]}<b>${s?.completed ? "✅" : s?.attempts ? Math.min(DAILY_GOAL, (s.frEn || 0) + (s.enFr || 0)) : "·"}</b></div>`; }).join("")}</div>
        </div>
      </div>
    </div>
    <div class="grid g4 keep2" style="margin-top:16px">
      <div class="stat"><div class="v">${st.done}/7</div><div class="l">📅 jours à 20/20</div></div>
      <div class="stat"><div class="v">${st.good}</div><div class="l">✅ bonnes réponses</div></div>
      <div class="stat"><div class="v">${rate}%</div><div class="l">🎯 taux de réussite (${st.errors} erreur${st.errors > 1 ? "s" : ""})</div></div>
      <div class="stat"><div class="v">${st.streak}</div><div class="l">🔥 série actuelle</div></div>
    </div>
    <div class="grid g2" style="margin-top:16px">
      <div class="card">
        <h3>⭐ Mots maîtrisés cette semaine <span class="chip g">${st.mastered.length}</span></h3>
        ${st.mastered.length ? `<p class="small">${st.mastered.slice(0, 40).map(m => `<b>${esc(m.en)}</b> <span class="muted">(${esc(m.fr)})</span>`).join(" · ")}${st.mastered.length > 40 ? " …" : ""}</p>` : `<p class="muted small">Aucun mot n'a atteint le niveau 5 cette semaine.</p>`}
        ${st.helped ? `<p class="small muted">💡 ${st.helped} réponse(s) réussie(s) avec une aide.</p>` : ""}
      </div>
      <div class="card">
        <h3>🧠 Mots difficiles de la semaine</h3>
        ${st.hard.length ? `<div class="table-wrap"><table><tbody>${st.hard.map(h => `<tr><td>${esc(h.fr)}</td><td><b>${esc(h.en)}</b></td><td class="small muted">${h.n}×</td></tr>`).join("")}</tbody></table></div>` : `<p class="muted small">Aucune erreur cette semaine. 😎</p>`}
      </div>
    </div>
    <div class="grid g2" style="margin-top:16px">
      <div class="card">
        <h3>📝 Contrôles blancs</h3>
        ${st.xs.length ? st.xs.map(x => `<p class="small"><b>${esc(fmtDay(x.day))}</b> — ${esc((x.themes || []).join(", "))} : <b>${x.ok}/${x.total}</b> (${x.score}%)</p>`).join("") : `<p class="muted small">Pas de contrôle blanc cette semaine.</p>`}
      </div>
      <div class="card">
        <h3>🎮 Entraînements</h3>
        <p class="small">🔤 Verbes irréguliers : <b>${st.verbs}</b> essai(s)${st.verbs ? ` — ${Math.round(st.verbsOk / st.verbs * 100)} % réussis` : ""}<br>
        🎧 Dictée : <b>${st.dictee}</b> mot(s)${st.dictee ? ` — ${Math.round(st.dicteeOk / st.dictee * 100)} % justes` : ""}<br>
        ⚔️ Duels : <b>${st.duels.length}</b>${st.duels.length ? ` — ${esc(child.prenom || "")} ${st.duels.filter(d => duelWinner(d) === "child").length} / ${esc(pName())} ${st.duels.filter(d => duelWinner(d) === "parent").length}` : ""}</p>
      </div>
      <div class="card">
        <h3>🏆 Badges débloqués</h3>
        ${st.bw.length ? st.bw.map(b => `<p class="small">${b.icon} <b>${esc(T(`badge.${b.id}.t`))}</b> <span class="muted">— ${esc(fmtDay(badgesUnlocked[b.id]))}</span></p>`).join("") : `<p class="muted small">Pas de nouveau badge cette semaine.</p>`}
      </div>
      <div class="card">
        <h3>💀 Mots de la honte révélés</h3>
        ${st.sh.length ? st.sh.map(x => `<p class="small"><b>« ${esc(x.expression)} »</b> <span class="skulls">${"💀".repeat(x.honte || 1)}</span> <span class="muted">${esc(fmtDay(x.revealedDay))}</span></p>`).join("") : `<p class="muted small">Aucun cette semaine.</p>`}
      </div>
    </div>`;
}
function bilanText() {
  const st = weekStats(), prenom = child.prenom || child.username;
  const rate = st.attempts ? Math.round(st.good / st.attempts * 100) : 0;
  const L = [];
  L.push(`Wesh Words — Bilan de la semaine de ${prenom}`);
  L.push(`Du ${fmtDay(st.days[0])} au ${fmtDay(st.days[6])}`);
  L.push("");
  L.push(`Jours à 20/20 : ${st.done}/7  (${st.ss.map((s, i) => ["L", "M", "M", "J", "V", "S", "D"][i] + (s?.completed ? "✅" : s?.attempts ? "🟠" : "·")).join(" ")})`);
  L.push(`Bonnes réponses : ${st.good} — taux de réussite ${rate}% (${st.errors} erreurs)`);
  L.push(`Série actuelle : ${st.streak} jour(s)`);
  L.push(`Mots maîtrisés cette semaine : ${st.mastered.length}${st.mastered.length ? " — " + st.mastered.slice(0, 20).map(m => m.en).join(", ") : ""}`);
  if (st.hard.length) L.push(`Mots difficiles : ${st.hard.map(h => `${h.en} (${h.fr})`).join(", ")}`);
  if (st.xs.length) L.push(`Contrôles blancs : ${st.xs.map(x => `${(x.themes || []).join("/")} ${x.ok}/${x.total} (${x.score}%)`).join(" ; ")}`);
  if (st.verbs || st.dictee || st.duels.length) L.push(`Entraînements : verbes ${st.verbs} essai(s), dictée ${st.dictee} mot(s), duels ${st.duels.length}`);
  if (st.bw.length) L.push(`Badges débloqués : ${st.bw.map(b => b.icon + " " + T(`badge.${b.id}.t`)).join(", ")}`);
  if (st.sh.length) L.push(`Mots de la honte révélés : ${st.sh.map(x => x.expression).join(", ")}`);
  L.push("");
  L.push(T("bilan." + (st.done >= 5 ? "r5" : st.done >= 3 ? "r3" : st.done >= 1 ? "r1" : "r0"), { prenom }));
  return L.join("\n");
}
$("#bPrev").onclick = () => { weekOffset--; renderBilan(); };
$("#bNext").onclick = () => { if (weekOffset < 0) { weekOffset++; renderBilan(); } };
$("#bPrint").onclick = () => {
  document.body.classList.add("print-bilan");
  const done = () => { document.body.classList.remove("print-bilan"); window.removeEventListener("afterprint", done); };
  window.addEventListener("afterprint", done);
  setTimeout(() => window.print(), 50);
};
$("#bCopy").onclick = async () => {
  try { await navigator.clipboard.writeText(bilanText()); toast("Bilan copié 📋"); }
  catch (e) { toast("Copie impossible sur cet appareil.", "warn"); }
};
$("#bMail").onclick = () => {
  const st = weekStats();
  const subject = `Wesh Words — Bilan de ${child.prenom || ""} (semaine du ${fmtDay(st.days[0])})`;
  location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bilanText())}`;
};

/* ---------------- Badges ---------------- */
function renderBadges() {
  if (!child || !$("#bgGrid")) return;
  const bl = evaluateBadges(badgeStats({ sessions, words, exams, revealed: shames.filter(x => x.revealed).length }));
  $("#bgName").textContent = child.prenom || child.username;
  $("#bgCount").textContent = `${bl.filter(b => b.done).length} / ${bl.length}`;
  $("#bgGrid").innerHTML = badgesGrid(bl, badgesUnlocked, T, esc, fmtDay);
}

/* ---------------- Verbes & dictée (tableau de bord) ---------------- */
function renderPracticeDash() {
  if (!child || !$("#dPractice")) return;
  const verbs = irregularVerbs(words);
  const vTot = sessions.reduce((a, s) => a + (s.verbs || 0), 0), vOk = sessions.reduce((a, s) => a + (s.verbsOk || 0), 0);
  const dTot = sessions.reduce((a, s) => a + (s.dictee || 0), 0), dOk = sessions.reduce((a, s) => a + (s.dicteeOk || 0), 0);
  const hardV = verbs.filter(v => (v.word.vKo || 0) > 0).sort((a, b) => (b.word.vKo || 0) - (a.word.vKo || 0)).slice(0, 6);
  const hardD = words.filter(w => (w.dKo || 0) > 0).sort((a, b) => (b.dKo || 0) - (a.dKo || 0)).slice(0, 6);
  $("#dPractice").innerHTML = `
    <div class="grid g4 keep2">
      <div class="stat"><div class="v">${verbs.filter(v => (v.word.vLevel || 0) >= 3).length}/${verbs.length}</div><div class="l">🔤 verbes bien acquis (niv. 3+)</div></div>
      <div class="stat"><div class="v">${vTot ? Math.round(vOk / vTot * 100) : 0}%</div><div class="l">🔤 réussite verbes (${vTot} essais)</div></div>
      <div class="stat"><div class="v">${dTot}</div><div class="l">🎧 mots dictés</div></div>
      <div class="stat"><div class="v">${dTot ? Math.round(dOk / dTot * 100) : 0}%</div><div class="l">🎧 réussite dictée</div></div>
    </div>
    <div class="grid g2" style="margin-top:12px">
      <div><b class="small">Verbes qui coincent</b>${hardV.length ? `<p class="small">${hardV.map(v => `${esc(v.forms.join(" — "))} <span class="muted">(${v.word.vKo}×)</span>`).join("<br>")}</p>` : `<p class="small muted">Rien à signaler.</p>`}</div>
      <div><b class="small">Orthographe à revoir (dictée)</b>${hardD.length ? `<p class="small">${hardD.map(w => `${esc(w.en)} <span class="muted">(${w.dKo}×)</span>`).join("<br>")}</p>` : `<p class="small muted">Rien à signaler.</p>`}</div>
    </div>`;
}

/* ---------------- Duel ---------------- */
const pName = () => T("duel.parent");
function renderDuels() {
  if (!child || !$("#duList")) return;
  const cName = child.prenom || child.username;
  $("#duChildName").textContent = cName;
  const fin = duels.filter(d => duelWinner(d));
  $("#duTally").textContent = `${cName} ${fin.filter(d => duelWinner(d) === "child").length} – ${fin.filter(d => duelWinner(d) === "parent").length} ${pName()}`;
  $("#duList").innerHTML = duels.slice(0, 20).map(d => {
    const win = duelWinner(d);
    let st = "", act = "";
    if (!d.parent) { st = `<b>⚔️ ${esc(cName)} te défie !</b>${d.child ? ` <span class="small muted">(elle a fait ${d.child.score}/${d.child.total})</span>` : ""}`; act = `<button class="btn pink sm" data-dplay="${d.id}">Relever le défi</button>`; }
    else if (!d.child) st = `⏳ En attente de ${esc(cName)}… <span class="small muted">(ton score : ${d.parent.score}/${d.parent.total})</span>`;
    else {
      st = `<b>${win === "parent" ? "🏆 Victoire !" : win === "child" ? `😬 ${esc(cName)} a gagné` : "🤝 Égalité"}</b> ${d.parent.score}–${d.child.score} <span class="small muted">(${esc(fmtTime(d.parent.timeMs))} / ${esc(fmtTime(d.child.timeMs))})</span>`;
      if (win === "parent" && !d.penalty) act = `<button class="btn sm" data-dpen="${d.id}">😈 Choisir son gage</button>`;
      else if (d.penalty?.for === "parent") act = `<span class="small">😈 Ton gage : <b>« ${esc(d.penalty.text)} »</b></span>${d.penaltyDone ? " ✅" : ` <button class="btn soft sm" data-ddone="${d.id}">C'est fait ✅</button>`}`;
      else if (d.penalty) act = `<span class="small muted">Gage de ${esc(cName)} : « ${esc(d.penalty.text)} » ${d.penaltyDone ? "✅" : "⏳"}</span>`;
    }
    return `<div class="duel-row ${!d.parent ? "todo" : ""}"><span>${st} <span class="small muted">· ${esc(fmtDay(d.day))}</span></span><span class="row">${act}</span></div>`;
  }).join("") || `<p class="muted">Aucun duel pour l'instant. Lance le premier ! ⚔️</p>`;
  $$("[data-dplay]").forEach(b => b.onclick = () => playParentDuel(duels.find(d => d.id === b.dataset.dplay)));
  $$("[data-dpen]").forEach(b => b.onclick = () => chooseChildPenalty(duels.find(d => d.id === b.dataset.dpen)));
  $$("[data-ddone]").forEach(b => b.onclick = () => updateDoc(doc(db, "users", child.uid, "duels", b.dataset.ddone), { penaltyDone: true }).catch(e => toast(errMsg(e), "err")));
}
$("#btnDuelNew").onclick = async () => {
  const pool = filterByThemes(words, activeThemes(settings, today).list);
  const items = buildDuelItems(pool, words, 10);
  if (items.length < 3) { toast("Ajoute d'abord du vocabulaire.", "warn"); return; }
  try {
    const ref = await addDoc(collection(db, "users", child.uid, "duels"), { createdBy: "parent", day: today, items, child: null, parent: null, status: "open", createdAt: serverTimestamp() });
    playParentDuel({ id: ref.id, items });
  } catch (e) { toast(errMsg(e), "err"); }
};
function playParentDuel(d) {
  const uidC = child.uid;
  playDuel({
    items: d.items, who: pName(),
    onFinish: async r => {
      const cur = duels.find(x => x.id === d.id) || d;
      const upd = { parent: r };
      if (cur.child) { upd.status = "done"; upd.winner = duelWinner({ child: cur.child, parent: r }); }
      try { await updateDoc(doc(db, "users", uidC, "duels", d.id), upd); } catch (e) { toast(errMsg(e), "err"); }
      const full = { ...cur, ...upd };
      const win = duelWinner(full);
      openOverlay(`<div class="center"><h2>⚔️ ${r.score} / ${r.total}</h2><p class="muted">⏱ ${esc(fmtTime(r.timeMs))}</p>
        ${!win ? `<p>⏳ En attente de ${esc(child.prenom || "")}… Elle verra ton défi dans son espace.</p>`
          : `<p style="font-weight:800;font-size:1.2rem">${win === "parent" ? "🏆 Victoire !" : win === "child" ? "😬 Défaite…" : "🤝 Égalité parfaite !"} ${r.score}–${full.child.score}</p>
             ${win === "parent" ? `<button class="btn pink" id="pdPen">😈 Choisir son gage</button>` : ""}`}</div>`);
      $("#pdPen")?.addEventListener("click", () => chooseChildPenalty(full));
    },
    onQuit: () => {}
  });
}
function chooseChildPenalty(d) {
  const cName = child.prenom || "";
  openOverlay(`<h3>${esc(T("duel.choose", { qui: cName }))}</h3>
    <div class="pen-list">${DUEL_PENALTIES.map((p, i) => `<button class="choice" data-p="${i}"><span>${esc(p)}</span></button>`).join("")}</div>
    <div class="field" style="margin-top:10px"><label>…ou ta propre expression</label><input type="text" id="penOwn" maxlength="80"></div>
    <button class="btn" id="penOk">Valider le gage</button>`);
  let chosen = "";
  $$("#overlayInner [data-p]").forEach(b => b.onclick = () => { chosen = DUEL_PENALTIES[Number(b.dataset.p)]; $$("#overlayInner [data-p]").forEach(x => x.classList.toggle("good", x === b)); $("#penOwn").value = ""; });
  $("#penOk").onclick = async () => {
    const text = $("#penOwn").value.trim() || chosen;
    if (!text) { toast("Choisis une expression 😈", "warn"); return; }
    try { await updateDoc(doc(db, "users", child.uid, "duels", d.id), { penalty: { text, for: "child" } }); toast(`${cName} devra dire « ${text} » 😈`); closeOverlay(); }
    catch (e) { toast(errMsg(e), "err"); }
  };
}

/* ---------------- Photo du cours → vocabulaire (OCR) ---------------- */
let ocrRows = [], ocrRaw = "";
$("#ocrFile").addEventListener("change", async () => {
  const files = [...$("#ocrFile").files];
  $("#ocrFile").value = "";
  if (!files.length) return;
  openOverlay(`<div class="center"><img class="shame-art" src="${MOODS.reflechie}" alt=""><h3>📷 Lecture de la photo…</h3>
    <div class="track" style="height:10px;background:var(--line);border-radius:99px;overflow:hidden;margin:12px 0"><div id="ocrBar" style="height:100%;width:3%;background:var(--grad);transition:width .3s"></div></div>
    <p class="small muted" id="ocrLbl">Préparation…</p></div>`);
  try {
    ocrRaw = await ocrImages(files, (pct, lbl) => {
      if ($("#ocrLbl")) $("#ocrLbl").textContent = lbl + (pct != null ? ` — ${pct} %` : "");
      if (pct != null && $("#ocrBar")) $("#ocrBar").style.width = Math.max(3, pct) + "%";
    });
    ocrRows = parseOcrText(ocrRaw).rows.map(r => ({ ...r, on: true }));
    ocrEditor();
  } catch (e) {
    openOverlay(`<h3>📷 Lecture impossible</h3><p class="muted">${esc(errMsg(e))}</p>`);
  }
});
function ocrEditor() {
  const { skipped } = parseOcrText(ocrRaw);
  const cat = `Photo ${new Date().toLocaleDateString("fr-BE", { day: "2-digit", month: "2-digit" })}`;
  openOverlay(`<h3>📷 Mots reconnus <span class="chip b">${ocrRows.length}</span></h3>
    <p class="small muted">Vérifie et corrige avant d'importer : la lecture automatique peut se tromper (lettres, accents). ⇄ inverse français / anglais.</p>
    <div class="field"><label>Catégorie de ces mots</label><input type="text" id="ocrCat" value="${esc(cat)}" list="catList"></div>
    <div class="table-wrap" style="max-height:44vh"><table><thead><tr><th></th><th>🇫🇷 Français</th><th></th><th>🇬🇧 Anglais</th><th></th></tr></thead><tbody id="ocrBody"></tbody></table></div>
    <div class="row" style="margin-top:8px"><button class="btn ghost sm" id="ocrAdd">➕ Ajouter une ligne</button><button class="btn ghost sm" id="ocrSwapAll">⇄ Tout inverser</button></div>
    <details style="margin-top:12px"><summary class="small">Texte lu (${skipped.length} ligne(s) non comprise(s))</summary>
      <textarea id="ocrText" class="code" style="margin-top:8px">${esc(ocrRaw)}</textarea>
      <button class="btn soft sm" id="ocrReparse" style="margin-top:6px">🔄 Réanalyser ce texte</button>
      <p class="small muted">Astuce : une paire par ligne, séparée par « = », « : », « – » ou une tabulation.</p></details>
    <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn" id="ocrGo">Continuer vers l'import →</button></div>`);
  const draw = () => {
    $("#ocrBody").innerHTML = ocrRows.map((r, i) => `<tr>
      <td><input type="checkbox" data-oon="${i}" ${r.on ? "checked" : ""}></td>
      <td><input type="text" data-ofr="${i}" value="${esc(r.fr)}" style="min-width:150px"></td>
      <td><button class="icon-btn" data-osw="${i}" title="Inverser">⇄</button></td>
      <td><input type="text" data-oen="${i}" value="${esc(r.en)}" style="min-width:150px"></td>
      <td><button class="icon-btn" data-odel="${i}" title="Retirer">🗑️</button></td></tr>`).join("")
      || `<tr><td colspan="5" class="muted center">Aucune paire reconnue. Corrige le texte lu ci-dessous puis « Réanalyser », ou ajoute les lignes à la main.</td></tr>`;
    $$("[data-oon]").forEach(el => el.onchange = () => ocrRows[el.dataset.oon].on = el.checked);
    $$("[data-ofr]").forEach(el => el.oninput = () => ocrRows[el.dataset.ofr].fr = el.value);
    $$("[data-oen]").forEach(el => el.oninput = () => ocrRows[el.dataset.oen].en = el.value);
    $$("[data-osw]").forEach(el => el.onclick = () => { const r = ocrRows[el.dataset.osw]; [r.fr, r.en] = [r.en, r.fr]; draw(); });
    $$("[data-odel]").forEach(el => el.onclick = () => { ocrRows.splice(Number(el.dataset.odel), 1); draw(); });
  };
  draw();
  $("#ocrAdd").onclick = () => { ocrRows.push({ fr: "", en: "", on: true }); draw(); };
  $("#ocrSwapAll").onclick = () => { ocrRows.forEach(r => { [r.fr, r.en] = [r.en, r.fr]; }); draw(); };
  $("#ocrReparse").onclick = () => { ocrRaw = $("#ocrText").value; ocrRows = parseOcrText(ocrRaw).rows.map(r => ({ ...r, on: true })); ocrEditor(); };
  $("#ocrGo").onclick = () => {
    const cat = $("#ocrCat").value.trim();
    const rows = ocrRows.filter(r => r.on && r.fr.trim() && r.en.trim())
      .map(r => ({ fr: r.fr.trim(), en: r.en.trim(), cat, nature: "", ex: "", note: "Photo du cours", irr: false, conj: "" }));
    if (!rows.length) { toast("Aucune ligne à importer.", "warn"); return; }
    closeOverlay();
    $$("#tabs .tab").forEach(x => x.classList.toggle("on", x.dataset.tab === "vocab"));
    $$(".panel").forEach(p => p.classList.toggle("on", p.id === "p-vocab"));
    previewImport(rows, "Photo du cours");
    $("#impPreview").scrollIntoView({ behavior: "smooth", block: "center" });
  };
}

/* ---------------- Propositions de l'enfant ---------------- */
function renderProposals() {
  if (!child || !$("#propList")) return;
  const pend = proposals.filter(p => p.status === "pending");
  $("#propCard").classList.toggle("hidden", !pend.length);
  $("#propName").textContent = child.prenom || child.username;
  $("#propCount").textContent = pend.length;
  const byId = Object.fromEntries(words.map(w => [w.id, w]));
  $("#propList").innerHTML = pend.map(p => {
    const w = byId[p.wordId];
    const gone = !w ? `<span class="small muted">(mot supprimé)</span>` : "";
    let what;
    if (p.type === "alt") {
      const q = p.dir === "frEn" ? p.oldFr : p.oldEn, exp = p.dir === "frEn" ? p.oldEn : p.oldFr;
      what = `<span>${p.dir === "frEn" ? "🇫🇷→🇬🇧" : "🇬🇧→🇫🇷"} <b>${esc(q)}</b> : réponse attendue « ${esc(exp)} », ${esc(child.prenom || "")} propose aussi <b>« ${esc(p.given)} »</b> ${gone}</span>`;
    } else {
      const chg = [p.fr !== p.oldFr ? `🇫🇷 « ${esc(p.oldFr)} » → <b>« ${esc(p.fr)} »</b>` : "", p.en !== p.oldEn ? `🇬🇧 « ${esc(p.oldEn)} » → <b>« ${esc(p.en)} »</b>` : ""].filter(Boolean).join("<br>");
      what = `<span>🚩 Erreur signalée : ${chg || `<b>${esc(p.oldFr)} = ${esc(p.oldEn)}</b>`}${p.note ? `<br><i class="small muted">« ${esc(p.note)} »</i>` : ""} ${gone}</span>`;
    }
    return `<div class="prop-row">${what}<span class="row">
      ${w ? `<button class="btn sm" data-pok="${p.id}">✅ ${p.type === "alt" ? "Accepter" : "Corriger"}</button>` : ""}
      <button class="btn ghost sm" data-pko="${p.id}">❌ Refuser</button></span></div>`;
  }).join("");
  $$("[data-pok]").forEach(b => b.onclick = () => acceptProposal(proposals.find(p => p.id === b.dataset.pok)));
  $$("[data-pko]").forEach(b => b.onclick = () => decide(proposals.find(p => p.id === b.dataset.pko), "ko"));
}
const decide = (p, status) => updateDoc(doc(db, "users", child.uid, "proposals", p.id), { status, decidedDay: today }).catch(e => toast(errMsg(e), "err"));
async function acceptProposal(p) {
  const w = words.find(x => x.id === p.wordId);
  if (!w) return;
  if (p.type === "alt") {
    const field = p.dir === "frEn" ? "altEn" : "altFr";
    try {
      const b = writeBatch(db);
      b.update(doc(wordsCol(), w.id), { [field]: arrayUnion(p.given) });
      b.update(doc(db, "users", child.uid, "proposals", p.id), { status: "ok", decidedDay: today });
      await b.commit();
      toast(`« ${p.given} » est maintenant accepté ✅`);
    } catch (e) { toast(errMsg(e), "err"); }
    return;
  }
  openOverlay(`<h3>🚩 Corriger le mot</h3>
    <p class="small muted">Actuellement : ${esc(w.fr)} = ${esc(w.en)}</p>
    <div class="grid g2"><div class="field"><label>🇫🇷 Français</label><input type="text" id="pfFr" value="${esc(p.fr)}"></div>
    <div class="field"><label>🇬🇧 Anglais</label><input type="text" id="pfEn" value="${esc(p.en)}"></div></div>
    <p class="small muted">Astuce : plusieurs réponses possibles → sépare-les par « / » (ex. américain / américaine).</p>
    <button class="btn" id="pfOk">Enregistrer la correction</button>`);
  $("#pfOk").onclick = async () => {
    const fr = $("#pfFr").value.trim(), en = $("#pfEn").value.trim();
    if (!fr || !en) return;
    try {
      const b = writeBatch(db);
      b.update(doc(wordsCol(), w.id), { fr, en });
      b.update(doc(db, "users", child.uid, "proposals", p.id), { status: "ok", decidedDay: today, fr, en });
      await b.commit();
      closeOverlay(); toast("Mot corrigé ✅");
    } catch (e) { toast(errMsg(e), "err"); }
  };
}

/* ---------------- Corrections du vocabulaire de départ ---------------- */
function renderFixBanner() {
  if (!child || !$("#fixBanner")) return;
  const list = pendingFixes(words);
  $("#fixBanner").classList.toggle("hidden", !list.length);
  if (!list.length) return;
  $("#fixBanner").innerHTML = `<b>🛠️ ${list.length} erreur(s) connue(s) dans le vocabulaire de départ</b>
    <p class="small" style="margin:6px 0">Par exemple : ${list.slice(0, 4).map(f => `« ${esc(f.word.en)} » : ${esc(f.word.fr)} → <b>${esc(f.to)}</b>`).join(" · ")}${list.length > 4 ? " …" : ""}</p>
    <button class="btn sm" id="fixGo">Corriger automatiquement</button>`;
  $("#fixGo").onclick = async () => {
    try {
      for (let i = 0; i < list.length; i += 400) {
        const b = writeBatch(db);
        list.slice(i, i + 400).forEach(f => b.update(doc(wordsCol(), f.word.id), { fr: f.to }));
        await b.commit();
      }
      toast(`${list.length} mot(s) corrigé(s) ✅`);
    } catch (e) { toast(errMsg(e), "err"); }
  };
}
