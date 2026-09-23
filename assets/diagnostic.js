/* Wesh Words — diagnostic de mise en ligne (V01-005) */
import { db, $, esc, VERSION, initPublicPage, logoMark, probeAuth, doc, getDocFromServer } from "./app.js";

$("#logoMark").innerHTML = logoMark();
await initPublicPage();

const CONSOLE = "https://console.firebase.google.com/project/weshwords";
const L = (href, txt) => `<a href="${href}" target="_blank" rel="noopener">${txt} ↗</a>`;

function row(state, title, detail) {
  const ico = { ok: "✅", warn: "⚠️", ko: "❌", wait: "⏳" }[state];
  return `<div class="diag ${state}"><div class="di">${ico}</div><div><b>${esc(title)}</b><div class="small">${detail || ""}</div></div></div>`;
}
async function withTimeout(p, ms = 12000) {
  return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej({ code: "timeout" }), ms))]);
}

async function run() {
  const out = [];
  const render = () => { $("#diagList").innerHTML = out.join(""); };
  $("#diagInfo").textContent = `Version du site : ${VERSION} · ${new Date().toLocaleString("fr-BE")}`;

  // 1. Hébergement
  const host = location.hostname;
  if (location.protocol === "file:") out.push(row("ko", "Page ouverte depuis l'ordinateur", "Le site doit être ouvert depuis son adresse en ligne (https://web-pub.github.io/weshwords/), pas en double-cliquant sur le fichier."));
  else if (location.protocol !== "https:" && host !== "localhost" && host !== "127.0.0.1") out.push(row("warn", "Connexion non sécurisée (http)", "Utilise l'adresse en https://."));
  else out.push(row("ok", "Site en ligne", `Adresse : <code>${esc(location.origin + location.pathname.replace(/[^/]*$/, ""))}</code>`));

  // 2. Fichiers du site (assets)
  try {
    const r = await fetch("assets/vocab-margaux.json", { method: "HEAD", cache: "no-store" });
    out.push(r.ok ? row("ok", "Dossier assets présent", "Les fichiers CSS/JS/images sont bien publiés.")
      : row("ko", "Dossier assets introuvable", "Vérifie que le dossier <b>assets</b> a bien été envoyé à la racine du dépôt GitHub (pas dans un sous-dossier)."));
  } catch (e) { out.push(row("warn", "Impossible de vérifier le dossier assets", esc(e.message || e))); }
  out.push(row("wait", "Firebase — base de données…", "")); render();

  // 3. Firestore : base créée + règles publiées + version des règles
  let cfg = null, rulesOk = false, rulesVersionOk = false;
  try {
    cfg = await withTimeout(getDocFromServer(doc(db, "config", "app")));
    rulesOk = true;
  } catch (e) {
    out.pop();
    const c = e.code || "";
    if (c === "permission-denied") out.push(row("ko", "Règles Firestore non publiées", `La base existe mais refuse tout accès. Copie le contenu de <code>firestore.rules</code> dans ${L(CONSOLE + "/firestore/rules", "Firestore → Règles")} puis clique sur <b>Publier</b>.`));
    else if (c === "failed-precondition" || c === "not-found" || /does not exist/i.test(e.message || "")) out.push(row("ko", "Base Firestore pas encore créée", `Crée-la dans ${L(CONSOLE + "/firestore", "Firestore Database")} → « Créer une base de données » (mode production, région Europe).`));
    else if (c === "unavailable" || c === "timeout") out.push(row("ko", "Firestore injoignable", `Pas de réponse du serveur (connexion internet ?). Si le problème persiste, vérifie que la base existe dans ${L(CONSOLE + "/firestore", "Firestore Database")}.`));
    else out.push(row("ko", "Erreur Firestore", esc(c + " " + (e.message || ""))));
    render();
  }
  if (rulesOk) {
    try { await withTimeout(getDocFromServer(doc(db, "rulesinfo", VERSION))); rulesVersionOk = true; } catch (e) { rulesVersionOk = false; }
    out.pop();
    out.push(row("ok", "Base Firestore opérationnelle", "La base existe et répond."));
    out.push(rulesVersionOk
      ? row("ok", `Règles Firestore à jour (${VERSION})`, "Les règles publiées correspondent à cette version du site.")
      : row("warn", "Règles Firestore d'une ancienne version", `Republie le contenu de <code>firestore.rules</code> (version ${VERSION}) dans ${L(CONSOLE + "/firestore/rules", "Firestore → Règles")}. Sans ça, certaines fonctions (badges, contrôles, thèmes…) seront refusées.`));
    out.push(cfg && cfg.exists()
      ? row("ok", "Compte Super Admin installé", "L'installation initiale est faite.")
      : row("warn", "Installation initiale à faire", `Ouvre la <a href="connexion.html">page de connexion</a> : le bloc « 🛠️ Installation initiale » permet de créer ton compte Super Admin. Fais-le tout de suite, avec l'adresse autorisée dans <code>firestore.rules</code> (fonction <code>canInstall</code>).`));
  }
  out.push(row("wait", "Firebase — authentification…", "")); render();

  // 4. Authentication : méthode e-mail / mot de passe activée
  let code = "";
  try { code = await withTimeout(probeAuth()); } catch (e) { code = e.code || "timeout"; }
  out.pop();
  if (["auth/invalid-credential", "auth/user-not-found", "auth/wrong-password", "auth/invalid-login-credentials"].includes(code))
    out.push(row("ok", "Connexion par e-mail / mot de passe activée", "Firebase Authentication répond correctement."));
  else if (code === "auth/operation-not-allowed" || code === "auth/admin-restricted-operation")
    out.push(row("ko", "Méthode « E-mail/Mot de passe » désactivée", `Active-la dans ${L(CONSOLE + "/authentication/providers", "Authentication → Méthode de connexion")} → E-mail/Mot de passe → Activer → Enregistrer.`));
  else if (code === "auth/configuration-not-found")
    out.push(row("ko", "Authentication pas encore initialisé", `Ouvre ${L(CONSOLE + "/authentication", "Authentication")} et clique sur « Commencer », puis active E-mail/Mot de passe.`));
  else if (code === "auth/too-many-requests")
    out.push(row("warn", "Trop de tentatives récentes", "Firebase a temporairement bloqué les essais. Réessaie dans quelques minutes."));
  else if (code === "auth/network-request-failed" || code === "timeout")
    out.push(row("ko", "Authentication injoignable", "Pas de réponse (connexion internet, bloqueur de publicité ?)."));
  else
    out.push(row("warn", "Réponse inattendue d'Authentication", `Code : <code>${esc(code)}</code>`));

  // 5. Domaine autorisé (conseil)
  if (host.endsWith("github.io"))
    out.push(row("ok", "Domaine GitHub Pages", `Pense à vérifier que <code>${esc(host)}</code> figure dans ${L(CONSOLE + "/authentication/settings", "Authentication → Paramètres → Domaines autorisés")} (utile pour les e-mails de réinitialisation).`));

  // 6. Application installable
  let sw = false;
  try { sw = !!(await navigator.serviceWorker?.getRegistration()); } catch (e) {}
  out.push(sw ? row("ok", "Application installable (PWA)", "Sur téléphone : menu du navigateur → « Ajouter à l'écran d'accueil ».")
    : row("warn", "Service worker pas encore actif", "Recharge la page une fois ; il s'active à la deuxième visite."));

  const ko = out.filter(x => x.includes('diag ko')).length, warn = out.filter(x => x.includes('diag warn')).length;
  out.unshift(ko ? row("ko", `${ko} point(s) à corriger`, "Suis les indications ci-dessous puis clique sur « Relancer les tests ».")
    : warn ? row("warn", "Presque prêt !", "Tout fonctionne, il reste quelques points à vérifier.")
    : row("ok", "Tout est prêt ! 🎉", `Wesh Words est en ligne et opérationnel. <a href="connexion.html">Se connecter →</a>`));
  render();
}
$("#btnRun").onclick = run;
run();
