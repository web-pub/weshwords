# Wesh Words — V03-007

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
   Les fichiers doivent arriver **à la racine** du dépôt (pas dans un sous-dossier « WeshWords-V03-007 »).
4. En bas : message « Wesh Words V03-007 » → **Commit changes**.
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
git commit -m "Wesh Words V03-007"
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
| Règles publiées **et à jour** (V03-007) | étape A.4 |
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
| Séries de 20 & points (V02-001) | la 1re série de 20 du jour est obligatoire ; ensuite « 🔁 Nouvelle série de 20 » autant de fois que voulu, toujours par blocs complets de 20 (10 + 10). Chaque série rapporte des points : 100, −5 par erreur, −2 par aide, +20 si zéro faute (minimum 10). Espace parent : séries et points par série dans le Tableau de bord, l'Historique et le Bilan. |
| Puzzle Margaux (V02-001) | une image de Margaux « wesh » découpée en 12 morceaux (4 × 3). Chaque série de 20 réussie à plus de 90 % (2 erreurs maximum) fait gagner 1 morceau. Puzzle complet → une nouvelle image commence (6 images). |
| Préparer le CE1D (V02-001) | espace élève → 📚 : Mathématiques (5 thèmes), Français (5), Sciences (6), Anglais – langues modernes (4, avec écoute audio). Environ 460 questions originales dans l'esprit des épreuves externes (QCM, vrai/faux, réponse numérique ou courte), dont 45 générateurs d'exercices de calcul aléatoires. Séries de 10, explication après chaque réponse, résultats et erreurs visibles par le parent. |
| Réponses (V02-001) | espaces, apostrophes, tirets et caractères spéciaux ignorés (« ice-cream » = « icecream », « I'm » = « im »). |
| Import (V02-001) | étape « associer les colonnes » : chaque colonne du fichier est reliée à un champ (Français, Anglais, Catégorie…), avec aperçu. Bouton 🗑️ « Tout supprimer et recommencer à zéro » (taper SUPPRIMER). |
| Verbes irréguliers (V02-001) | bouton « 🔤 Liste des verbes irréguliers (113) » : ajoute la liste de référence (nature « verbe irrégulier »). Dans le quiz, un mot du vocabulaire qui contient un verbe irrégulier (« to keep in touch ») affiche ses 3 formes après la réponse. |
| Historique navigable (V03-001) | espace parent → 🕓 Historique : boutons « Mois précédent / suivant » et « Tout afficher » pour remonter dans le temps, en plus de l'affichage habituel. |
| Fiches modifiables (V03-001) | espace parent (fiche de son/ses enfant(s)) et Super Admin (tous les membres) → « ✏️ Modifier la fiche » : prénom, nom, naissance, GSM, et un formulaire séparé pour changer l'adresse e-mail / l'identifiant (mot de passe actuel requis). |
| Suivi des connexions (V03-001) | Super Admin → Membres : colonnes « Dernière visite » (dès que la personne ouvre une page de l'appli, même reconnectée automatiquement sans retaper son mot de passe) et « Dernière connexion » (dernière fois où le mot de passe a été tapé avec succès). Le mot de passe réellement tapé à la connexion est aussi réenregistré automatiquement dans l'onglet Mots de passe. |
| Mots de la honte 2026 (V03-001) | 67 nouvelles expressions d'argot ajoutées (wesh, six seven / 67, rizz, aura farming, la hess, pain brioché, GOAT absolu…), dont plusieurs variantes autour du fameux « six seven » (67). Bouton « 💡 Ajouter des idées toutes prêtes » dans Vocabulaire → Mots de la honte. |
| Mot de la honte | 1 révélation max par jour, uniquement après le 20/20, dans l'ordre de la file du parent. Jamais visible par l'élève avant révélation (règles Firestore). Ne consomme aucune question et ne touche pas aux niveaux. |
| Néerlandais (V03-002) | Nouvel onglet « 🇳🇱 Néerlandais » (à côté de « 🇬🇧 Anglais », renommé en V03-003 pour la symétrie), en plus de l'anglais : vocabulaire, ajout, import/export et vérification séparés (espace parent → onglet dédié), séries de 20 **libres** (pas d'obligation quotidienne comme pour l'anglais), mêmes points et mêmes pièces de puzzle. Vocabulaire de départ fourni : 975 mots CE1D A1-A2 + 126 verbes irréguliers (liste officielle, V03-003), à importer via « 📦 Vocabulaire néerlandais CE1D » et « 🔤 Liste des verbes irréguliers ». *(Correction V03-006 : la liste importée en V03-002 annonçait 1500 mots mais contenait 525 entrées de remplissage fabriquées, sans valeur pédagogique — elles ont été retirées après audit ; 975 mots réels restent.)* Les outils dictée audio, duel et contrôle blanc restent pour l'instant réservés à l'anglais. |
| Vérification automatique (V03-002) | 🤖 Assistant intégré au site (pas un service d'IA externe payant : le site n'a pas de serveur pour garder une clé API en sécurité) qui relit chaque mot ajouté à la main ou importé (anglais et néerlandais) et signale ce qui semble louche : colonnes inversées, mot vide, texte identique en français et dans l'autre langue, phrase entière collée par erreur… Un avertissement n'empêche pas d'ajouter/importer, il demande juste une confirmation. |
| Import « OK / à vérifier » séparés (V03-003) | À l'import (fichier ou listes fournies), les mots jugés OK par la vérification automatique s'importent directement en un clic, sans avoir à faire défiler la liste. Les mots « à vérifier » sont affichés **en entier** (plus de limite à 30 lignes) dans un tableau à part, avec la raison de chaque alerte visible directement (plus besoin de survoler le ⚠️), pour les relire un par un avant de les importer ou non. |
| Verbes irréguliers néerlandais officiels (V03-003) | La liste des 126 verbes irréguliers néerlandais a été remplacée par la liste de référence officielle (Enseignement à Distance, Communauté française) : infinitif, prétérit, participe passé, traduction et auxiliaire (zijn/hebben) pour chaque verbe. |
| Puzzle « Six Seven » (V03-002) | Un 7e puzzle à collectionner (image de Margaux façon « SIX SEVEN », le mème TikTok) rejoint la rotation des 6 puzzles existants. Un petit sticker animé de Margaux « Six Seven » apparaît aussi à côté de la carte Néerlandais dans l'espace élève. |
| Confidentialité des espaces parent (V03-003) | Chaque parent (y compris le Super Admin, dans son propre espace parent) ne voit que ses propres enfants. Le Super Admin peut toujours consulter le bilan de n'importe quel enfant, mais uniquement via Super Admin → Membres → lien « Suivi » sur la ligne de l'enfant. |
| Page d'accueil CE1D (V03-004) | La page d'accueil (et le contenu, modifiable depuis Super Admin → Contenus du site) ne présente plus le site comme un simple outil d'anglais, mais comme une appli de révision pour le CE1D : anglais, néerlandais, maths, français, sciences, pensée pour de courtes séries de révision (« 5 minutes de libre ? »). |
| Matières & niveaux par enfant (V03-004) | Espace parent → 🎛️ Réglages → « 📚 Matières & niveaux » : le parent choisit, pour chaque enfant, quelles matières sont visibles dans son espace élève (anglais, néerlandais, mathématiques, français, sciences) et le niveau de langue à étudier (2e, 4e ou 6e/fin de rhéto) pour l'anglais et le néerlandais séparément. Une matière décochée disparaît entièrement de l'espace élève ; le vocabulaire de la langue choisie est filtré par niveau. Par défaut (comptes existants compris) : toutes les matières sont activées, niveau 2. |
| Niveau du vocabulaire (V03-004) | Chaque mot anglais/néerlandais porte désormais un niveau (2 / 4 / 6). Le vocabulaire déjà présent est au niveau 2. À l'import, une colonne « Niveau » (à mettre en colonne A du fichier Excel) permet de préciser le niveau de chaque mot importé ; sans cette colonne, les mots importés sont au niveau 2 par défaut. L'export (💾 Exporter) inclut aussi cette colonne. |
| Cartes mentales & Flashcards (V03-005) | Nouvelle carte « 🗺️ Cartes mentales & Flashcards » dans l'espace élève : une bulle par matière activée (anglais, néerlandais, maths, français, sciences), qui ouvre une carte mentale visuelle — une bulle par catégorie/thème, taille selon le nombre d'éléments. Toucher une bulle (ou le centre pour tout mélanger) ouvre une session de flashcards recto/verso (question/réponse pour le CE1D, français/langue pour le vocabulaire) avec prononciation audio, pensée pour réviser en quelques minutes. Construites à partir des catégories et thèmes déjà existants, sans contenu à maintenir en double. |
| Audit complet — code & contenu (V03-006) | Passage en revue de tout le code et de toute la matière (maths, français, sciences, anglais, néerlandais) par rapport au programme belge de 2e secondaire (CE1D). **Bugs corrigés :** plantage possible du quiz si un parent change le niveau de langue d'un enfant pendant qu'il joue ; message d'état vide trompeur côté néerlandais ; correcteur d'exercices CE1D qui refusait un signe moins normal ou mélangeait un chiffre d'unité (ex. « cm3 ») à la réponse ; question d'arrondi qui affichait un nombre déjà arrondi ; QCM générés pouvant proposer deux fois « la même » réponse écrite différemment (ex. 6/4 et 3/2). **Contenu corrigé :** un exercice de grammaire française mal formé, une explication d'étymologie imprécise, deux notes de conjugaison néerlandaise erronées, une vingtaine de traductions FR↔NL et FR↔EN incorrectes ou approximatives, une trentaine d'accords d'adjectifs néerlandais mal formés, une centaine de phrases d'exemple incohérentes (nettoyées plutôt que laissées fausses). **Correction de données :** la liste de vocabulaire néerlandais importée en V03-002 annonçait 1500 mots mais 525 étaient des entrées de remplissage fabriquées (« mot utile 1 », « mot utile 2 »…) sans aucune valeur pédagogique ; elles ont été retirées, il reste 975 mots néerlandais réels. |
| Onglet « 📚 Cours » + exercices CE1D personnalisés (V03-007) | Espace parent : Anglais et Néerlandais sont désormais regroupés avec Maths/Français/Sciences dans un même onglet « 📚 Cours » à sous-onglets, pour corriger le débordement de la barre d'onglets (le bouton « Réglages » était inatteignable sur petit écran — corrigé aussi). Le parent peut maintenant ajouter ses propres exercices CE1D (QCM, vrai/faux, numérique ou texte à trous) dans **toutes** les matières — Maths, Français, Sciences — comme c'était déjà possible pour Anglais/Néerlandais ; ils s'ajoutent aux banques intégrées sans les remplacer. |
| Banque CE1D néerlandaise (V03-007) | La carte « Préparer le CE1D » de l'espace élève affiche maintenant aussi 🇳🇱 Néerlandais (elle n'apparaissait qu'en anglais jusqu'ici) : nouvelle banque complète d'environ 75 questions (lecture, écoute, grammaire, vocabulaire), même format et même niveau d'exigence que la banque anglaise. |
| Langue obligatoire par enfant (V03-007) | En secondaire, chaque élève n'a qu'une seule langue germanique obligatoire (anglais **ou** néerlandais selon l'école) : le parent choisit maintenant, dans Réglages → « 🗣️ Langue obligatoire », laquelle est la langue étudiée en 1er pour chaque enfant. C'est cette langue qui porte désormais la série quotidienne des 20 mots, le calendrier, la série gardée (mot de la honte) et les badges ; l'autre langue reste disponible en séries libres, sans obligation, comme le néerlandais l'était jusqu'ici pour tout le monde. **Limite assumée :** les verbes irréguliers, la dictée audio, le duel et le contrôle blanc restent pour l'instant des outils réservés à l'anglais quelle que soit la langue obligatoire choisie (ils ne sont pas encore déclinés en néerlandais) ; pour un enfant dont la langue obligatoire est le néerlandais, le contrôle blanc anglais reste utilisable en pratique libre mais ne compte plus dans l'objectif quotidien. |

## 6. Données Firestore

```
config/app                     { superAdminUid }
content/site                   { texts: { clé: texte personnalisé } }
usernames/{utilisateur}        { email, uid }
secrets/{uid}                  { username, email, password }   ← Super Admin uniquement
demandes/{id}                  { nom, prenom, gsm, email, statut }
users/{uid}                    { prenom, nom, username, email, realEmail, role, parentUid, birth, gsm, lastSeen, lastLogin }   ← lastSeen/lastLogin V03-001
users/{uid}/proposals/{id}     { type: alt|fix, wordId, dir, given, oldFr, oldEn, fr, en, note, status, decidedDay }
users/{uid}/words/{id}         { fr, en, altFr[], altEn[], cat, nature, ex, conj, niveau (2/4/6, V03-004), level, ok, ko, seen, lastSeen, lastKo, vLevel, vOk, vKo, dOk, dKo }
users/{uid}/sessions/{AAAA-MM-JJ} { frEn, enFr, attempts, errors, completed, wrong[], helped, qcm, bonus, exam, mastered[], verbs, verbsOk, dictee, dicteeOk,
                                 series[{n, attempts, errors, helped, acc, points}], cur }
users/{uid}/shame/{id}         { expression, phrase, honte, revealed, revealedDay }
users/{uid}/exams/{id}         { day, themes[], dir, total, ok, ko, score, helped, wrong[], durationSec }
users/{uid}/meta/shame         { queue: [ids], lastRevealDay, dates: { id: AAAA-MM-JJ } }
users/{uid}/duels/{id}         { createdBy, day, items[], child{score,total,timeMs}, parent{…}, winner, penalty{text,for}, penaltyDone }
users/{uid}/meta/badges        { unlocked: { idBadge: AAAA-MM-JJ } }
users/{uid}/meta/puzzle        { pieces, log[{day, n, points}] }                      ← V02-001
users/{uid}/ce1d/{id}          { subject, theme, themeName, day, ok, total, score, wrong[], seen[], durationSec }   ← V02-001
users/{uid}/meta/settings      { hints, autoQcm, qcmMinWords, themes[], themesLocked, themesUntil, childThemes[],
                                 subjects: {en,nl,math,francais,sciences}, levels: {en,nl} (2/4/6) }              ← subjects/levels V03-004
users/{uid}/wordsNl/{id}       { fr, en (= mot néerlandais), cat, nature, ex, conj, niveau (2/4/6, V03-004), level, ok, ko, seen, lastSeen, lastKo }   ← V03-002
users/{uid}/sessionsNl/{AAAA-MM-JJ} { series[{n, attempts, errors, helped, acc, points}], cur }                              ← V03-002, séries toujours libres
```

⚠️ Les mots de passe sont également stockés en clair dans `secrets` (lecture Super Admin uniquement) — risque connu et accepté.
