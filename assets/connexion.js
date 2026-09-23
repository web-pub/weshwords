/* Wesh Words — page de connexion */
import {
  auth, db, $, initPublicPage, logoMark, login, currentUser, getProfile, homeFor, toast, errMsg,
  doc, getDoc, writeBatch, addDoc, collection, serverTimestamp, slugUser, resolveEmail,
  sendPasswordResetEmail, createUserWithEmailAndPassword, signOut, PSEUDO_DOMAIN, T
} from "./app.js";

$("#logoMark").innerHTML = logoMark(34);
await initPublicPage();

if (new URLSearchParams(location.search).get("e") === "profil") {
  toast("Ton compte existe mais n'a pas de profil Wesh Words. Contacte l'administratrice.", "err");
}

// Déjà connecté ? → direction son espace
const u = await currentUser();
if (u) {
  const p = await getProfile(u.uid).catch(() => null);
  if (p) { location.replace(homeFor(p.role)); }
}

// Installation initiale : aucun Super Admin ?
try {
  const cfg = await getDoc(doc(db, "config", "app"));
  if (!cfg.exists()) $("#setupCard").classList.remove("hidden");
} catch (e) { /* hors ligne */ }

/* ---------- Connexion ---------- */
$("#loginForm").addEventListener("submit", async ev => {
  ev.preventDefault();
  const btn = $("#lgBtn");
  btn.disabled = true;
  try {
    const cred = await login($("#lgUser").value, $("#lgPwd").value);
    const p = await getProfile(cred.user.uid);
    if (!p) { await signOut(auth); throw new Error("Aucun profil Wesh Words n'est associé à ce compte."); }
    location.replace(homeFor(p.role));
  } catch (e) {
    toast(errMsg(e), "err");
    btn.disabled = false;
  }
});

/* ---------- Mot de passe oublié ---------- */
$("#lgForgot").addEventListener("click", async ev => {
  ev.preventDefault();
  $("#lgForgotHelp").classList.remove("hidden");
  const id = $("#lgUser").value.trim();
  if (!id) { toast("Indique d'abord ton utilisateur ou ton e-mail.", "warn"); $("#lgUser").focus(); return; }
  try {
    const email = await resolveEmail(id);
    if (email.endsWith("@" + PSEUDO_DOMAIN)) { toast("Compte élève : demande à ton parent de réinitialiser ton mot de passe.", "warn"); return; }
    await sendPasswordResetEmail(auth, email);
    toast("Si ce compte existe, un e-mail de réinitialisation vient d'être envoyé.");
  } catch (e) {
    toast("Si ce compte existe, un e-mail de réinitialisation vient d'être envoyé.");
  }
});

/* ---------- Devenez membre ---------- */
$("#joinForm").addEventListener("submit", async ev => {
  ev.preventDefault();
  const data = {
    nom: $("#jNom").value.trim(), prenom: $("#jPrenom").value.trim(),
    gsm: $("#jGsm").value.trim(), email: $("#jEmail").value.trim(),
    statut: "nouvelle", createdAt: serverTimestamp()
  };
  if (!data.nom || !data.prenom || !data.gsm || !data.email) { toast("Merci de remplir les champs obligatoires (*).", "warn"); return; }
  try {
    await addDoc(collection(db, "demandes"), data);
    $("#joinForm").classList.add("hidden");
    $("#joinOk").classList.remove("hidden");
  } catch (e) { toast(errMsg(e), "err"); }
});

/* ---------- Installation du Super Admin ---------- */
$("#suUser").addEventListener("focus", () => {
  if (!$("#suUser").value) {
    const p = slugUser($("#suPrenom").value).replace(/[._-]/g, ""), n = slugUser($("#suNom").value);
    if (p) $("#suUser").value = `${p}.${n.charAt(0)}`;
  }
});
$("#setupForm").addEventListener("submit", async ev => {
  ev.preventDefault();
  const username = slugUser($("#suUser").value);
  const email = $("#suEmail").value.trim().toLowerCase();
  const password = $("#suPwd").value;
  if (!username) { toast("Utilisateur invalide.", "err"); return; }
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;
    const b = writeBatch(db);
    b.set(doc(db, "config", "app"), { superAdminUid: uid, createdAt: serverTimestamp(), project: "weshwords" });
    b.set(doc(db, "users", uid), {
      prenom: $("#suPrenom").value.trim(), nom: $("#suNom").value.trim(), username, email, realEmail: true,
      role: "superadmin", parentUid: null, birth: $("#suBirth").value || "", gsm: "", createdAt: serverTimestamp(), createdBy: uid
    });
    b.set(doc(db, "usernames", username), { email, uid });
    b.set(doc(db, "secrets", uid), { username, email, password, updatedAt: serverTimestamp() });
    await b.commit();
    toast("Compte Super Admin créé ! 🎉");
    location.replace("admin.html");
  } catch (e) {
    if (e.code === "permission-denied") {
      toast("Installation refusée : cette adresse e-mail n'est pas autorisée dans firestore.rules (fonction canInstall), ou les règles ne sont pas publiées.", "err");
      try { await auth.currentUser?.delete(); } catch (x) {}
      await signOut(auth).catch(() => {});
    } else toast(errMsg(e), "err");
  }
});
