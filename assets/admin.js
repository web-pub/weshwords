/* Wesh Words — espace Super Admin */
import {
  db, $, $$, esc, T, guard, initPrivatePage, renderAppHeader, fmtTs, toast, errMsg, roleLabel, VERSION,
  doc, getDocs, setDoc, updateDoc, deleteDoc, collection, query, where, onSnapshot, writeBatch, serverTimestamp,
  changeAuthPassword, deleteAuthAccount, loadContent, PSEUDO_DOMAIN, enhancePasswords,
  updateMemberInfo, changeMemberEmailUsername
} from "./app.js";
import { DEFAULT_CONTENT, LEGAL_PAGES } from "./content.js";
import { mountMemberForm } from "./member-form.js";

await initPrivatePage();
const { user, profile } = await guard(["superadmin"]);
renderAppHeader($("#appHead"), profile, [{ href: "admin.html", label: "Super Admin", active: true }, { href: "parent.html", label: "Espace parent" }, { href: "diagnostic.html", label: "🩺 Diagnostic" }]);
$$(".js-ver").forEach(e => e.textContent = VERSION);
$("#loader").classList.add("hidden");
$("#main").classList.remove("hidden");

let users = [], secrets = {}, requests = [];

/* ---------------- Onglets ---------------- */
function showTab(name) {
  $$("#tabs .tab").forEach(x => x.classList.toggle("on", x.dataset.tab === name));
  $$(".panel").forEach(p => p.classList.toggle("on", p.id === "p-" + name));
}
$$("#tabs .tab").forEach(t => t.onclick = () => showTab(t.dataset.tab));

function openOverlay(html) {
  $("#overlayInner").innerHTML = html + `<div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn ghost sm" id="ovClose">Fermer</button></div>`;
  $("#overlay").classList.remove("hidden");
  $("#ovClose").onclick = closeOverlay;
}
function closeOverlay() { $("#overlay").classList.add("hidden"); }

/* ---------------- Membres ---------------- */
const nameOf = u => u ? `${u.prenom || ""} ${u.nom || ""}`.trim() || u.username : "—";
const shownEmail = e => e && !e.endsWith("@" + PSEUDO_DOMAIN) ? e : "— (technique)";

onSnapshot(collection(db, "users"), snap => {
  users = snap.docs.map(d => ({ uid: d.id, ...d.data() }))
    .sort((a, b) => (a.role || "").localeCompare(b.role || "") || nameOf(a).localeCompare(nameOf(b)));
  renderMembers(); renderPwd(); mountForm();
}, e => toast(errMsg(e), "err"));

function renderMembers() {
  $("#sParents").textContent = users.filter(u => u.role === "parent").length;
  $("#sKids").textContent = users.filter(u => u.role === "enfant").length;
  const byId = Object.fromEntries(users.map(u => [u.uid, u]));
  $("#mBody").innerHTML = users.map(u => `
    <tr><td><b>${esc(nameOf(u))}</b></td><td>${esc(u.username)}</td>
    <td><span class="role-badge r-${esc(u.role)}">${esc(roleLabel(u.role))}</span></td>
    <td>${u.role === "enfant" ? esc(nameOf(byId[u.parentUid])) : ""}</td>
    <td class="small">${esc(shownEmail(u.email))}</td><td class="small muted">${esc(fmtTs(u.createdAt))}</td>
    <td class="small muted">${u.lastSeen ? esc(fmtTs(u.lastSeen)) : "—"}</td>
    <td class="small muted">${u.lastLogin ? esc(fmtTs(u.lastLogin)) : "—"}</td>
    <td class="actions">
      <button class="icon-btn" data-edit="${u.uid}" title="Modifier la fiche">✏️</button>
      ${u.role === "enfant" ? `<a class="btn ghost sm" href="parent.html?child=${u.uid}">Suivi</a>` : ""}
      ${u.role === "enfant" ? `<button class="icon-btn" data-relink="${u.uid}" title="Changer de parent">🔗</button>` : ""}
      ${u.uid !== user.uid ? `<button class="icon-btn" data-del="${u.uid}" title="Supprimer">🗑️</button>` : ""}
    </td></tr>`).join("") || `<tr><td colspan="9" class="muted center">Aucun membre.</td></tr>`;
  $$("[data-del]").forEach(b => b.onclick = () => deleteMember(users.find(u => u.uid === b.dataset.del)));
  $$("[data-relink]").forEach(b => b.onclick = () => relink(users.find(u => u.uid === b.dataset.relink)));
  $$("[data-edit]").forEach(b => b.onclick = () => editMember(users.find(u => u.uid === b.dataset.edit)));
}

function editMember(u) {
  const s = secrets[u.uid] || {};
  openOverlay(`<h3>✏️ Modifier la fiche — ${esc(nameOf(u))}</h3>
    <form id="emInfoForm" class="grid g2">
      <div class="field"><label>Prénom</label><input type="text" id="emPrenom" value="${esc(u.prenom || "")}"></div>
      <div class="field"><label>Nom</label><input type="text" id="emNom" value="${esc(u.nom || "")}"></div>
      <div class="field"><label>Date de naissance</label><input type="date" id="emBirth" value="${esc(u.birth || "")}"></div>
      <div class="field"><label>GSM</label><input type="tel" id="emGsm" value="${esc(u.gsm || "")}"></div>
      <div class="field" style="grid-column:1/-1"><button class="btn soft" type="submit">💾 Enregistrer la fiche</button></div>
    </form>
    <h4 style="margin-top:14px">📧 E-mail / identifiant</h4>
    <form id="emCredForm" class="grid g2">
      <div class="field"><label>Adresse e-mail</label><input type="email" id="emEmail" value="${esc(s.email && !s.email.endsWith("@" + PSEUDO_DOMAIN) ? s.email : "")}"></div>
      <div class="field"><label>Identifiant</label><input type="text" id="emUser" autocapitalize="none" value="${esc(u.username || "")}"></div>
      <div class="field" style="grid-column:1/-1"><label>Mot de passe actuel</label><input type="password" id="emOld" value="${esc(s.password || "")}" required></div>
      <div class="field" style="grid-column:1/-1"><button class="btn soft" type="submit">Enregistrer</button></div>
    </form>
    <p class="small muted" style="margin-top:10px">Dernière visite : ${u.lastSeen ? esc(fmtTs(u.lastSeen)) : "—"} · Dernière connexion : ${u.lastLogin ? esc(fmtTs(u.lastLogin)) : "—"}</p>`);
  enhancePasswords($("#overlayInner"));
  $("#emInfoForm").onsubmit = async ev => {
    ev.preventDefault();
    try {
      await updateMemberInfo(u.uid, { prenom: $("#emPrenom").value.trim(), nom: $("#emNom").value.trim(), birth: $("#emBirth").value, gsm: $("#emGsm").value.trim() });
      toast("Fiche mise à jour ✅");
    } catch (e) { toast(errMsg(e), "err"); }
  };
  $("#emCredForm").onsubmit = async ev => {
    ev.preventDefault();
    try {
      await changeMemberEmailUsername(u.uid, {
        oldEmail: s.email || u.email, oldPwd: $("#emOld").value, oldUsername: u.username,
        newEmail: $("#emEmail").value.trim(), newUsername: $("#emUser").value.trim()
      });
      toast("E-mail / identifiant mis à jour ✅"); closeOverlay();
    } catch (e) { toast(errMsg(e), "err"); }
  };
}

function parentOptions() {
  return users.filter(u => u.role === "parent" || u.role === "superadmin").map(u => ({ uid: u.uid, label: `${nameOf(u)} (${roleLabel(u.role)})` }));
}
let formPrefill = null;
function mountForm() {
  mountMemberForm($("#memberFormHost"), {
    roles: [{ v: "parent", l: "Parent (Admin)" }, { v: "enfant", l: "Élève (Membre)" }],
    parents: parentOptions(),
    prefill: formPrefill || { role: "parent" },
    onCreated: async () => {
      if (formPrefill?.requestId) await updateDoc(doc(db, "demandes", formPrefill.requestId), { statut: "compte créé" }).catch(() => {});
      formPrefill = null;
    }
  });
}

function relink(child) {
  const opts = parentOptions();
  openOverlay(`<h3>🔗 Parent lié à ${esc(nameOf(child))}</h3>
    <div class="field"><select id="rlSel">${opts.map(o => `<option value="${o.uid}" ${o.uid === child.parentUid ? "selected" : ""}>${esc(o.label)}</option>`).join("")}</select></div>
    <button class="btn" id="rlGo">Enregistrer</button>`);
  $("#rlGo").onclick = async () => {
    try { await updateDoc(doc(db, "users", child.uid), { parentUid: $("#rlSel").value }); toast("Parent modifié ✅"); closeOverlay(); }
    catch (e) { toast(errMsg(e), "err"); }
  };
}

async function deleteMember(u) {
  if (u.role === "parent" && users.some(c => c.parentUid === u.uid)) {
    toast("Ce parent a encore des enfants liés : supprime-les ou change leur parent d'abord.", "warn"); return;
  }
  if (!confirm(`Supprimer définitivement le compte de ${nameOf(u)} (${u.username}) et toutes ses données ?`)) return;
  try {
    const sec = secrets[u.uid];
    let authDeleted = false;
    if (sec?.password) {
      try { await deleteAuthAccount(sec.email || u.email, sec.password); authDeleted = true; } catch (e) { console.warn(e); }
    }
    // données de l'élève
    if (u.role === "enfant") {
      for (const sub of ["words", "sessions", "shame", "meta", "exams", "duels", "wordsNl", "sessionsNl"]) {
        const snap = await getDocs(collection(db, "users", u.uid, sub));
        for (let i = 0; i < snap.docs.length; i += 400) {
          const b = writeBatch(db);
          snap.docs.slice(i, i + 400).forEach(d => b.delete(d.ref));
          await b.commit();
        }
      }
    }
    const b = writeBatch(db);
    b.delete(doc(db, "users", u.uid));
    if (u.username) b.delete(doc(db, "usernames", u.username));
    b.delete(doc(db, "secrets", u.uid));
    await b.commit();
    toast(authDeleted ? "Compte supprimé ✅" : "Données supprimées. ⚠️ Supprime aussi l'utilisateur dans Firebase Console → Authentication (mot de passe inconnu).", authDeleted ? "ok" : "warn");
  } catch (e) { toast(errMsg(e), "err"); }
}

/* ---------------- Mots de passe ---------------- */
onSnapshot(collection(db, "secrets"), snap => {
  secrets = Object.fromEntries(snap.docs.map(d => [d.id, d.data()]));
  renderPwd();
}, e => toast(errMsg(e), "err"));

function renderPwd() {
  $("#pwBody").innerHTML = users.map(u => {
    const s = secrets[u.uid] || {};
    return `<tr><td><b>${esc(nameOf(u))}</b></td><td>${esc(u.username)}</td>
      <td><span class="role-badge r-${esc(u.role)}">${esc(roleLabel(u.role))}</span></td>
      <td class="small">${esc(s.email || u.email)}</td>
      <td><code style="font-size:1rem">${s.password ? esc(s.password) : '<span class="muted">inconnu</span>'}</code></td>
      <td class="small muted">${esc(fmtTs(s.updatedAt))}</td>
      <td class="actions"><button class="btn ghost sm" data-pw="${u.uid}">Changer</button></td></tr>`;
  }).join("");
  $$("[data-pw]").forEach(b => b.onclick = () => changePwd(users.find(u => u.uid === b.dataset.pw)));
}
function changePwd(u) {
  const s = secrets[u.uid] || {};
  openOverlay(`<h3>🔑 Nouveau mot de passe — ${esc(nameOf(u))}</h3>
    <form id="cpForm">
      <div class="field"><label>Mot de passe actuel</label><input type="password" id="cpOld" value="${esc(s.password || "")}" required></div>
      <div class="field"><label>Nouveau mot de passe</label><input type="password" id="cpNew" required minlength="6"></div>
      <button class="btn" type="submit">Enregistrer</button>
    </form>`);
  enhancePasswords($("#overlayInner"));
  $("#cpForm").onsubmit = async ev => {
    ev.preventDefault();
    const nw = $("#cpNew").value;
    try {
      await changeAuthPassword(s.email || u.email, $("#cpOld").value, nw);
      await setDoc(doc(db, "secrets", u.uid), { username: u.username, email: s.email || u.email, password: nw, updatedAt: serverTimestamp() }, { merge: true });
      toast("Mot de passe modifié ✅"); closeOverlay();
    } catch (e) { toast(errMsg(e), "err"); }
  };
}

/* ---------------- Demandes ---------------- */
onSnapshot(collection(db, "demandes"), snap => {
  requests = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  const open = requests.filter(r => r.statut === "nouvelle").length;
  $("#sReq").textContent = open;
  $("#reqCount").innerHTML = open ? `<span class="chip p">${open}</span>` : "";
  $("#rqBody").innerHTML = requests.map(r => `
    <tr><td class="small">${esc(fmtTs(r.createdAt))}</td><td><b>${esc(r.nom)}</b></td><td>${esc(r.prenom)}</td>
    <td><a href="tel:${esc(r.gsm)}">${esc(r.gsm)}</a></td><td><a href="mailto:${esc(r.email)}">${esc(r.email)}</a></td>
    <td><span class="chip ${r.statut === "nouvelle" ? "p" : "g"}">${esc(r.statut || "")}</span></td>
    <td class="actions"><button class="btn sm" data-mk="${r.id}">Créer le compte</button>
    <button class="icon-btn" data-done="${r.id}" title="Marquer comme traitée">✔️</button>
    <button class="icon-btn" data-rdel="${r.id}" title="Supprimer">🗑️</button></td></tr>`).join("")
    || `<tr><td colspan="7" class="muted center">Aucune demande.</td></tr>`;
  $$("[data-mk]").forEach(b => b.onclick = () => {
    const r = requests.find(x => x.id === b.dataset.mk);
    formPrefill = { role: "parent", prenom: r.prenom, nom: r.nom, gsm: r.gsm, email: r.email, requestId: r.id };
    mountForm(); showTab("members");
    $("#memberFormHost").scrollIntoView({ behavior: "smooth" });
  });
  $$("[data-done]").forEach(b => b.onclick = () => updateDoc(doc(db, "demandes", b.dataset.done), { statut: "traitée" }).catch(e => toast(errMsg(e), "err")));
  $$("[data-rdel]").forEach(b => b.onclick = () => { if (confirm("Supprimer cette demande ?")) deleteDoc(doc(db, "demandes", b.dataset.rdel)).catch(e => toast(errMsg(e), "err")); });
}, e => toast(errMsg(e), "err"));

/* ---------------- Contenus ---------------- */
const defaults = {};
DEFAULT_CONTENT.forEach(c => defaults[c.key] = c.value);
LEGAL_PAGES.forEach(p => { defaults[`legal.${p.id}.title`] = p.title; defaults[`legal.${p.id}.body`] = p.body; });
const current = await loadContent();

function fieldHTML(key, label, ml, cls = "") {
  const v = current[key] ?? "";
  const input = ml
    ? `<textarea data-ck="${key}" class="${cls}">${esc(v)}</textarea>`
    : `<input type="text" data-ck="${key}" value="${esc(v)}">`;
  return `<div class="field"><div class="row between"><label style="margin:0">${esc(label)} <span class="small muted">(${esc(key)})</span></label>
    <button type="button" class="btn ghost sm" data-reset="${key}" title="Revenir au texte d'origine">↺</button></div>${input}</div>`;
}
const groups = [...new Set(DEFAULT_CONTENT.map(c => c.g))];
$("#contentForm").innerHTML = groups.map(g => `<details ${g === "Général" ? "open" : ""} style="margin:14px 0"><summary>${esc(g)}</summary><div style="margin-top:12px">${
  DEFAULT_CONTENT.filter(c => c.g === g).map(c => fieldHTML(c.key, c.label, c.ml)).join("")}</div></details>`).join("");
$("#legalForm").innerHTML = LEGAL_PAGES.map(p => `<details style="margin:14px 0"><summary>${esc(p.title)}</summary><div style="margin-top:12px">
  ${fieldHTML(`legal.${p.id}.title`, "Titre (lien du pied de page)", false)}
  ${fieldHTML(`legal.${p.id}.body`, "Contenu (HTML)", true, "code")}
  <a class="small" href="legal.html?p=${p.id}" target="_blank">Voir la page ↗</a></div></details>`).join("");
$$("[data-reset]").forEach(b => b.onclick = () => { const el = $(`[data-ck="${b.dataset.reset}"]`); el.value = defaults[b.dataset.reset] ?? ""; });

async function saveContent() {
  const texts = {};
  $$("[data-ck]").forEach(el => { if (el.value !== (defaults[el.dataset.ck] ?? "")) texts[el.dataset.ck] = el.value; });
  try {
    await setDoc(doc(db, "content", "site"), { texts, updatedAt: serverTimestamp(), updatedBy: user.uid });
    toast(`Contenus enregistrés ✅ (${Object.keys(texts).length} texte(s) personnalisé(s))`);
  } catch (e) { toast(errMsg(e), "err"); }
}
$("#btnSaveContent").onclick = saveContent;
$("#btnSaveLegal").onclick = saveContent;

/* ---------------- Mon compte ---------------- */
$("#myPwdForm").addEventListener("submit", async ev => {
  ev.preventDefault();
  const nw = $("#mpNew").value;
  try {
    await changeAuthPassword(profile.email, $("#mpOld").value, nw);
    await setDoc(doc(db, "secrets", user.uid), { username: profile.username, email: profile.email, password: nw, updatedAt: serverTimestamp() }, { merge: true });
    toast("Ton mot de passe a été modifié ✅"); ev.target.reset();
  } catch (e) { toast(errMsg(e), "err"); }
});
