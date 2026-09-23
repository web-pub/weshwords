/* Wesh Words — formulaire de création de membre (partagé Parent / Super Admin) */
import { $, esc, enhancePasswords, suggestUsername, suggestPassword, createMember, toast, errMsg, PSEUDO_DOMAIN } from "./app.js";

let seq = 0;
/**
 * opts : { roles:[{v,l}], parents:[{uid,label}] | null, fixedParentUid, prefill:{}, onCreated(uid,data) , submitLabel }
 */
export function mountMemberForm(host, opts = {}) {
  const id = "mf" + (++seq);
  const roles = opts.roles || [{ v: "enfant", l: "Élève (enfant)" }];
  const pf = opts.prefill || {};
  host.innerHTML = `
  <form id="${id}" autocomplete="off">
    ${roles.length > 1 ? `<div class="field"><label>Rôle <span class="req">*</span></label>
      <select id="${id}-role">${roles.map(r => `<option value="${r.v}" ${pf.role === r.v ? "selected" : ""}>${esc(r.l)}</option>`).join("")}</select></div>` : ""}
    <div class="field ${opts.parents ? "" : "hidden"}" id="${id}-parentWrap"><label>Parent lié <span class="req">*</span></label>
      <select id="${id}-parent">${(opts.parents || []).map(p => `<option value="${p.uid}">${esc(p.label)}</option>`).join("")}</select></div>
    <div class="grid g2">
      <div class="field"><label>Prénom <span class="req">*</span></label><input type="text" id="${id}-prenom" required value="${esc(pf.prenom || "")}"></div>
      <div class="field"><label>Nom <span class="req">*</span></label><input type="text" id="${id}-nom" required value="${esc(pf.nom || "")}"></div>
    </div>
    <div class="grid g2">
      <div class="field"><label>Date de naissance</label><input type="date" id="${id}-birth" value="${esc(pf.birth || "")}"></div>
      <div class="field"><label>GSM</label><input type="tel" id="${id}-gsm" value="${esc(pf.gsm || "")}"></div>
    </div>
    <div class="field"><label>Adresse e-mail <span id="${id}-mailReq" class="req"></span></label><input type="email" id="${id}-email" value="${esc(pf.email || "")}">
      <p class="small muted" id="${id}-mailHelp" style="margin-top:4px"></p></div>
    <div class="grid g2">
      <div class="field"><label>Utilisateur (identifiant) <span class="req">*</span></label><input type="text" id="${id}-user" required autocapitalize="none"></div>
      <div class="field"><label>Mot de passe <span class="req">*</span></label><input type="password" id="${id}-pwd" required minlength="6"></div>
    </div>
    <p class="small muted">Suggestions automatiques : identifiant « prénom.initiale » et mot de passe « 3 lettres prénom + 3 lettres nom + JJMM » — modifiables avant d'enregistrer.<br>* Champs obligatoires</p>
    <button class="btn" type="submit">${esc(opts.submitLabel || "Créer le compte")}</button>
  </form>`;
  enhancePasswords(host);
  const f = $("#" + id);
  const g = s => $(`#${id}-${s}`);
  const dirty = { user: false, pwd: false };
  g("user").addEventListener("input", () => dirty.user = true);
  g("pwd").addEventListener("input", () => dirty.pwd = true);
  const role = () => g("role")?.value || roles[0].v;
  function refresh() {
    if (!dirty.user) g("user").value = suggestUsername(g("prenom").value, g("nom").value);
    if (!dirty.pwd) g("pwd").value = suggestPassword(g("prenom").value, g("nom").value, g("birth").value);
    const isChild = role() === "enfant";
    g("parentWrap").classList.toggle("hidden", !(isChild && opts.parents));
    g("mailReq").textContent = isChild ? "" : "*";
    g("email").required = !isChild;
    g("mailHelp").textContent = isChild
      ? "Facultatif pour un élève : sans adresse, un e-mail technique est créé (" + "identifiant@" + PSEUDO_DOMAIN + ")."
      : "Obligatoire : sert à la connexion et à la réinitialisation du mot de passe.";
  }
  ["prenom", "nom", "birth"].forEach(k => g(k).addEventListener("input", refresh));
  g("role")?.addEventListener("change", refresh);
  refresh();

  f.addEventListener("submit", async ev => {
    ev.preventDefault();
    const btn = f.querySelector("button[type=submit]");
    btn.disabled = true;
    const data = {
      role: role(), prenom: g("prenom").value.trim(), nom: g("nom").value.trim(),
      birth: g("birth").value, gsm: g("gsm").value.trim(), email: g("email").value.trim(),
      username: g("user").value, password: g("pwd").value,
      parentUid: role() === "enfant" ? (opts.fixedParentUid || g("parent")?.value || null) : null
    };
    if (data.role === "enfant" && !data.parentUid) { toast("Choisis le parent lié.", "warn"); btn.disabled = false; return; }
    try {
      const uid = await createMember(data);
      toast(`Compte créé ✅ — Utilisateur : ${data.username}`);
      f.reset(); dirty.user = dirty.pwd = false; refresh();
      opts.onCreated?.(uid, data);
    } catch (e) { toast(errMsg(e), "err"); }
    btn.disabled = false;
  });
}
