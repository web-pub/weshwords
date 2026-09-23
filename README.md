# Wesh Words — V01-008

Révisions de vocabulaire anglais 🇫🇷 ↔ 🇬🇧 : 20 bonnes réponses par jour (10 FR→EN + 10 EN→FR), et au 20/20… le **mot de la honte**. 💀

© Hélène Laruelle — Tous droits réservés.

---

## 1. Structure du ZIP

```
index.html            Accueil public
connexion.html        Connexion (utilisateur + mot de passe) + « Devenez membre ! » + installation initiale
eleve.html            Espace élève (session du jour, contrôle blanc, série, collection de hontes)
parent.html           Espace parent (bilan de la semaine, vocabulaire, import/export, suivi, mots de la honte, réglages thèmes/aides, comptes)
admin.html            Espace Super Admin (membres, mots de passe, demandes, contenus, pages légales)
diagnostic.html       Diagnostic de mise en ligne (Firebase + GitHub Pages)
legal.html            Pages légales (?p=securisation | confidentialite | ethique | cookies | responsabilite | mentions)
sw.js                 Service worker (PWA, ouverture hors connexion)
manifest.webmanifest  Manifeste PWA (installable)
firestore.rules       Règles de sécurité Firestore
firebase.json         Config Firebase CLI (règles + hébergement optionnel)
.firebaserc           Projet par défaut : weshwords
favicon.ico           Icône d'onglet (mascotte bulle)
assets/               CSS, JS, logo, icônes, personnage Margaux (margaux-*.webp, scene-*.webp), vocabulaire de départ
```

## 2. Mise en ligne pas à pas (≈ 15 minutes)

### Étape A — Firebase (console : https://console.firebase.google.com/project/weshwords)

1. **Authentication** → « Commencer » (si demandé) → onglet **Méthode de connexion** → **E-mail/Mot de passe** → Activer → **Enregistrer**.
2. **Authentication** → onglet **Paramètres** → **Domaines autorisés** → **Ajouter un domaine** → `web-pub.github.io`.
3. **Firestore Database** → **Créer une base de données** → emplacement Europe (`eur3` ou `europe-west1`) → **mode production** → Créer.
4. **Firestore Database** → onglet **Règles** → tout effacer → coller **tout** le contenu du fichier `firestore.rules` → **Publier**.
   ⚠️ À refaire à **chaque nouvelle version** du ZIP (le diagnostic le signale).

### Étape B — GitHub Pages (dépôt `web-pub/weshwords`), sans ligne de commande

1. Décompresser le ZIP sur le PC (clic droit → Extraire tout).
2. Sur https://github.com/web-pub/weshwords → **Add file** → **Upload files**.
3. Ouvrir le dossier décompressé, **sélectionner tout son contenu** (Ctrl + A : les pages HTML, `sw.js`, `favicon.ico`… **et le dossier `assets`**) et le glisser dans la page GitHub.
   Les fichiers doivent arriver **à la racine** du dépôt (pas dans un sous-dossier « WeshWords-V01-008 »).
4. En bas : message « Wesh Words V01-008 » → **Commit changes**.
5. Première fois seulement : **Settings** → **Pages** → Source « Deploy from a branch » → Branch **main** / **(root)** → Save.
6. Attendre 1 à 2 minutes. Adresse du site : `https://web-pub.github.io/weshwords/`

> Pour une mise à jour : refaire B.2 → B.4 (GitHub remplace les fichiers existants).
> Le fichier caché `.firebaserc` n'est pas nécessaire sur GitHub (il ne sert qu'à la ligne de commande Firebase).

Alternative en ligne de commande :

```bash
git clone https://github.com/web-pub/weshwords.git
cd weshwords
# décompresser le ZIP ici (fichiers à la racine + dossier assets/)
git add -A
git commit -m "Wesh Words V01-008"
git push origin main
```

> ⚠️ **Installation initiale protégée** : seule l'adresse `helene2406@gmail.com` peut créer le compte Super Admin
> (fonction `canInstall()` en tête de `firestore.rules`). Pour utiliser une autre adresse, modifie-la dans ce fichier avant de publier les règles.

### Étape C — Vérifier : page de diagnostic

Ouvrir **`https://web-pub.github.io/weshwords/diagnostic.html`**. Elle teste et explique quoi corriger :

| Test | Si ❌ / ⚠️ |
|---|---|
| Site en ligne, dossier `assets` présent | renvoyer le dossier `assets` à la racine du dépôt |
| Base Firestore créée | étape A.3 |
| Règles publiées **et à jour** (V01-008) | étape A.4 |
| Méthode E-mail/Mot de passe active | étape A.1 |
| Super Admin installé | ouvrir `connexion.html` → Installation initiale |
| Application installable | recharger la page une fois |

Astuce : après une mise à jour, si l'ancienne version s'affiche encore, recharger avec **Ctrl + F5**.

## 3. Premier démarrage

1. Ouvrir `connexion.html` : tant qu'aucun Super Admin n'existe, le bloc **🛠️ Installation initiale** s'affiche.
2. Créer le compte Super Admin (e-mail réel + utilisateur + mot de passe). Le bloc disparaît ensuite définitivement.
3. Super Admin → **Membres** : créer le compte **Parent** (e-mail réel obligatoire).
4. Espace parent → créer le compte **élève** (e-mail facultatif : un e-mail technique
   `identifiant@weshwords.firebaseapp.com` est alors utilisé en coulisses).
5. Espace parent → **Vocabulaire** → « 📦 Vocabulaire de départ » (1 029 mots) ou import d'un fichier Excel.
6. Espace parent → **Mots de la honte** → « 💡 Ajouter 20 idées » ou ses propres expressions.

## 4. Connexion

- Dans l'application : **Utilisateur + mot de passe** (ex. `margaux.h`).
- Dans Firebase : e-mail + mot de passe (l'identifiant est traduit en e-mail via la collection `usernames`).
- Une adresse e-mail complète fonctionne aussi dans le champ « Utilisateur ».

## 5. Règles métier

| Règle | Détail |
|---|---|
| Objectif du jour | 20 **bonnes** réponses : 10 🇫🇷→🇬🇧 et 10 🇬🇧→🇫🇷 |
| Erreur | ne compte pas, fait **baisser** le niveau du mot (0 à 5) et le mot revient 3 questions plus tard |
| Choix des mots | pondéré : niveaux bas, mots ratés et jamais vus sortent plus souvent |
| Réponses | insensible aux majuscules/minuscules, articles facultatifs (a/an/the/to, le/la/les…), variantes séparées par « / », accents tolérés en français (avec remarque) |
| Série | nombre de jours consécutifs à 20/20 |
| Aides (V01-002) | 💡 indice (1re lettre de chaque mot + nombre de lettres), puis 🔢 choix multiple. Réussi avec aide = compte pour les 20, **le mot ne monte pas de niveau**. Activable/désactivable par le parent. |
| QCM automatique (V01-002) | pour les longues phrases (par défaut ≥ 4 mots) : choix multiple d'office, compte normalement. « ✍️ Je préfère écrire » reste possible. |
| Thèmes (V01-002) | l'élève choisit ses catégories, ou le parent les **impose** (éventuellement jusqu'à une date, ex. le jour du contrôle). |
| Contrôle blanc (V01-004) | l'élève choisit un ou plusieurs thèmes et le sens : chaque mot passe une fois, score final (%), puis « Revoir mes erreurs ». Les bonnes réponses comptent aussi pour les 20 du jour. Résultats visibles par le parent (Historique + Bilan). |
| Bilan de la semaine (V01-004) | espace parent → 📅 Bilan : jours à 20/20, bonnes réponses, taux de réussite, série, mots maîtrisés, mots difficiles, contrôles blancs, hontes révélées. Semaine précédente/suivante, impression / PDF, copie du texte, envoi par e-mail. |
| Badges (V01-005) | 23 badges à débloquer (séries, jours à 20/20, sans-faute, mots maîtrisés, contrôles blancs, hontes…). Pop-up « 🏆 Nouveau badge ! », collection dans l'espace élève et l'espace parent, badges de la semaine dans le Bilan. |
| Verbes irréguliers (V01-006) | à partir de la colonne « conjugation » (ex. `be — was/were — been`) : mode 🇫🇷 → 3 formes ou base donnée → 2 formes, 10 / 20 / tous les verbes, niveau propre à chaque verbe. Suivi séparé (ne compte pas dans les 20 du jour). |
| Dictée audio (V01-006) | le mot anglais est lu (voix britannique, 🐢 version lente), l'élève l'écrit. Mots de 4 mots maximum, suivi séparé. |
| Duel (V01-006) | 10 mots identiques pour Maman et Margaux, chrono. Meilleur score gagne (égalité : le plus rapide). Le gagnant choisit une expression anglaise que la perdante doit placer dans une phrase ; « C'est fait ✅ ». |
| Dates de déblocage (V01-006) | une expression de la honte peut porter une date « pas avant le… » : elle reste en file mais n'est révélée qu'à partir de cette date (la suivante disponible passe devant). |
| Photo du cours (V01-007) | espace parent → Vocabulaire → 📷 Photo du cours : la liste du cahier est lue dans le navigateur (Tesseract.js, rien n'est envoyé ni stocké), les paires FR/EN sont proposées dans un tableau modifiable (⇄ inverser, cocher/décocher), puis passent par l'import habituel avec détection des doublons. |
| Propositions (V01-008) | après une réponse, l'élève peut proposer « ✋ Ma réponse est juste aussi » (réponse alternative) ou « 🚩 Il y a une erreur dans ce mot » (correction FR/EN). Le parent valide ou refuse dans son tableau de bord ; une réponse acceptée est ensuite toujours comptée juste. Réponses alternatives aussi modifiables dans ✏️ Modifier le mot. |
| Corrections du vocabulaire de départ (V01-008) | les 32 adjectifs de nationalité n'avaient pas de traduction française (« American = American ») : corrigés dans le fichier de départ, et bouton « 🛠️ Corriger automatiquement » dans Vocabulaire pour les mots déjà importés. « ice cream » accepte aussi « glace ». |
| Mot de la honte | 1 révélation max par jour, uniquement après le 20/20, dans l'ordre de la file du parent. Jamais visible par l'élève avant révélation (règles Firestore). Ne consomme aucune question et ne touche pas aux niveaux. |

## 6. Données Firestore

```
config/app                     { superAdminUid }
content/site                   { texts: { clé: texte personnalisé } }
usernames/{utilisateur}        { email, uid }
secrets/{uid}                  { username, email, password }   ← Super Admin uniquement
demandes/{id}                  { nom, prenom, gsm, email, statut }
users/{uid}                    { prenom, nom, username, email, role, parentUid, birth, gsm }
users/{uid}/proposals/{id}     { type: alt|fix, wordId, dir, given, oldFr, oldEn, fr, en, note, status, decidedDay }
users/{uid}/words/{id}         { fr, en, altFr[], altEn[], cat, nature, ex, conj, level, ok, ko, seen, lastSeen, lastKo, vLevel, vOk, vKo, dOk, dKo }
users/{uid}/sessions/{AAAA-MM-JJ} { frEn, enFr, attempts, errors, completed, wrong[], helped, qcm, bonus, exam, mastered[], verbs, verbsOk, dictee, dicteeOk }
users/{uid}/shame/{id}         { expression, phrase, honte, revealed, revealedDay }
users/{uid}/exams/{id}         { day, themes[], dir, total, ok, ko, score, helped, wrong[], durationSec }
users/{uid}/meta/shame         { queue: [ids], lastRevealDay, dates: { id: AAAA-MM-JJ } }
users/{uid}/duels/{id}         { createdBy, day, items[], child{score,total,timeMs}, parent{…}, winner, penalty{text,for}, penaltyDone }
users/{uid}/meta/badges        { unlocked: { idBadge: AAAA-MM-JJ } }
users/{uid}/meta/settings      { hints, autoQcm, qcmMinWords, themes[], themesLocked, themesUntil, childThemes[] }
```

⚠️ Les mots de passe sont également stockés en clair dans `secrets` (lecture Super Admin uniquement) — risque connu et accepté.
