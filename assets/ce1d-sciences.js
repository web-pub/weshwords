/* =========================================================
   Wesh Words — CE1D Sciences : banque d'exercices
   Questions ORIGINALES rédigées dans l'esprit des épreuves externes CE1D
   (Fédération Wallonie-Bruxelles) — elles ne reproduisent pas les épreuves officielles.
   ========================================================= */
import { rnd, pick, fr } from "./ce1d-util.js";

/* ---------- Documents partagés ---------- */
const MARE = "Réseau alimentaire d'une mare (la flèche signifie « est mangé par ») :\nalgues → daphnies\nalgues → têtards\ndaphnies → épinoches\ntêtards → épinoches\ntêtards → dytiques\népinoches → héron\ndytiques → héron";
const FORET = "Chaîne alimentaire d'une forêt :\nfeuilles de chêne → chenille → mésange → épervier";
const AIR = "Composition de l'air (en % du volume) :\nDioxygène : air inspiré 21 % ; air expiré 16 %\nDioxyde de carbone : air inspiré 0,04 % ; air expiré 4 %\nDiazote : air inspiré 78 % ; air expiré 78 %";
const GLACE = "On chauffe de la glace pilée sortie du congélateur et on relève sa température :\n0 min : −10 °C\n2 min : −4 °C\n4 min : 0 °C\n6 min : 0 °C\n8 min : 0 °C\n10 min : 5 °C\n12 min : 12 °C";
const SERIE = "Un circuit comporte une pile et deux lampes L1 et L2 branchées EN SÉRIE (une seule boucle). Les deux lampes brillent.";
const PARA = "Un circuit comporte une pile et deux lampes L1 et L2 branchées EN PARALLÈLE (chaque lampe est sur sa propre branche). Les deux lampes brillent.";
const HARICOT = "Margaux étudie la germination de graines de haricot. Chaque pot contient 10 graines. Après 8 jours, elle compte les graines germées.\nPot A : coton humide, lumière, 20 °C → 9 graines germées\nPot B : coton sec, lumière, 20 °C → 0 graine germée\nPot C : coton humide, obscurité, 20 °C → 9 graines germées\nPot D : coton humide, obscurité, 4 °C → 1 graine germée";
const SUCRE = "Thomas mesure le temps nécessaire pour qu'un morceau de sucre se dissolve complètement dans 100 mL d'eau, sans remuer. Il utilise à chaque fois le même type de morceau de sucre.\nEau à 10 °C : 180 s\nEau à 30 °C : 110 s\nEau à 50 °C : 60 s\nEau à 70 °C : 35 s";
const CANETTE = "Pour savoir quel manchon garde le mieux une boisson fraîche, Inès sort du frigo trois canettes identiques remplies de la même boisson à 5 °C et les pose dans une pièce à 22 °C. Elle mesure la température de la boisson après 30 minutes.\nCanette 1 : sans manchon → 14 °C\nCanette 2 : manchon en néoprène → 8 °C\nCanette 3 : manchon en aluminium fin → 15 °C";
const TOMATE = "Lucas veut savoir si un engrais fait pousser plus vite les plants de tomate. Il prend deux plants de même taille.\nPlant 1 : sans engrais, à l'intérieur près d'une fenêtre, arrosé chaque jour.\nPlant 2 : avec engrais, dehors en plein soleil, arrosé chaque jour.\nAprès 3 semaines, le plant 2 est le plus grand.";

/* ---------- Générateurs ---------- */
const MATERIAUX = [
  { n: "liège", r: 0.25 }, { n: "bois de pin", r: 0.5 }, { n: "glace", r: 0.9 },
  { n: "plastique PVC", r: 1.4 }, { n: "aluminium", r: 2.7 }, { n: "fer", r: 7.9 }
];

function genRho() {
  const V = pick([10, 20, 40, 50, 100, 200]);
  const m0 = pick(MATERIAUX);
  const m = Math.round(m0.r * V * 100) / 100;
  return {
    t: "num",
    q: `Un bloc de ${m0.n} a une masse de ${fr(m)} g et un volume de ${V} cm³. Calcule sa masse volumique (en g/cm³).`,
    a: m0.r, tol: 0.01, unit: "g/cm³",
    ex: `ρ = m / V = ${fr(m)} g ÷ ${V} cm³ = ${fr(m0.r)} g/cm³. ${m0.r < 1 ? "C'est moins que l'eau (1 g/cm³) : il flotte." : "C'est plus que l'eau (1 g/cm³) : il coule."}`
  };
}

function genFlotte() {
  const V = pick([10, 20, 50, 100]);
  const m0 = pick(MATERIAUX);
  const m = Math.round(m0.r * V * 100) / 100;
  const flotte = m0.r < 1;
  return {
    t: "qcm",
    q: `Un objet a une masse de ${fr(m)} g et un volume de ${V} cm³. On le dépose dans l'eau (ρ = 1 g/cm³). Que se passe-t-il ?`,
    c: ["Il flotte", "Il coule"], a: flotte ? 0 : 1,
    ex: `ρ = ${fr(m)} ÷ ${V} = ${fr(m0.r)} g/cm³. ${flotte ? "C'est moins que 1 g/cm³ : l'objet flotte." : "C'est plus que 1 g/cm³ : l'objet coule."}`
  };
}

function genPoids() {
  const lune = Math.random() < 0.4;
  const m = lune ? pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80]) : rnd(2, 95);
  const g = lune ? 1.6 : 10;
  const P = Math.round(m * g * 10) / 10;
  return {
    t: "num",
    q: `Quel est le poids d'un objet de ${m} kg ${lune ? "sur la Lune (g = 1,6 N/kg)" : "sur la Terre (g = 10 N/kg)"} ?`,
    a: P, tol: 0.01, unit: "N",
    ex: `P = m × g = ${m} kg × ${fr(g)} N/kg = ${fr(P)} N. Le poids est une force : il s'exprime en newtons.`
  };
}

function genMasse() {
  const m = rnd(3, 90);
  const P = m * 10;
  return {
    t: "num",
    q: `Sur la Terre (g = 10 N/kg), un dynamomètre indique qu'un sac a un poids de ${P} N. Quelle est sa masse ?`,
    a: m, unit: "kg",
    ex: `P = m × g, donc m = P ÷ g = ${P} N ÷ 10 N/kg = ${m} kg.`
  };
}

function genPression() {
  const S = pick([0.01, 0.02, 0.04, 0.05, 0.1, 0.2, 0.25, 0.5]);
  const F = rnd(2, 40) * 50;
  const p = Math.round(F / S);
  return {
    t: "num",
    q: `Une caisse de poids ${F} N repose sur le sol par une surface de ${fr(S)} m². Quelle pression exerce-t-elle sur le sol (en Pa) ?`,
    a: p, unit: "Pa",
    ex: `p = F / S = ${F} N ÷ ${fr(S)} m² = ${p} Pa (1 Pa = 1 N/m²).`
  };
}

export default {
  id: "sciences",
  name: "Sciences",
  icon: "🔬",
  themes: [
    /* ======================================================= */
    {
      id: "vivant",
      name: "Êtres vivants & écosystèmes",
      desc: "Chaînes alimentaires, photosynthèse, classification, cycles de vie, plantes à fleurs",
      items: [
        { t: "qcm", q: "Dans une chaîne alimentaire, que signifie la flèche dans « herbe → lapin » ?", c: ["« est mangé par »", "« mange »", "« vit à côté de »", "« se transforme en »"], a: 0, ex: "Par convention, la flèche va de l'être mangé vers celui qui le mange : l'herbe est mangée par le lapin. Elle montre le sens de passage de la matière." },
        { t: "qcm", ctx: FORET, q: "Dans cette chaîne, quel être vivant est un consommateur de 2e ordre ?", c: ["La mésange", "La chenille", "L'épervier", "Les feuilles de chêne"], a: 0, ex: "Les feuilles sont le producteur, la chenille (herbivore) est le consommateur de 1er ordre, la mésange qui mange la chenille est le consommateur de 2e ordre." },
        { t: "qcm", ctx: FORET, q: "Dans cette chaîne, quel est le rôle des feuilles de chêne ?", c: ["Producteur", "Consommateur de 1er ordre", "Décomposeur", "Prédateur"], a: 0, ex: "Le chêne est une plante verte : il fabrique sa propre matière grâce à la lumière (photosynthèse). C'est un producteur, toujours au début d'une chaîne." },
        { t: "qcm", ctx: MARE, q: "Si toutes les épinoches disparaissent, que risque-t-il d'arriver aux daphnies ?", c: ["Leur nombre augmente", "Leur nombre diminue", "Elles disparaissent aussi", "Rien ne change pour elles"], a: 0, ex: "Les épinoches sont les seuls prédateurs des daphnies dans ce réseau. Sans elles, les daphnies sont moins mangées : leur nombre augmente (du moins au début)." },
        { t: "num", ctx: MARE, q: "Combien de producteurs y a-t-il dans ce réseau alimentaire ?", a: 1, ex: "Seules les algues fabriquent leur matière grâce à la lumière. Tous les autres êtres vivants du réseau sont des consommateurs." },
        { t: "qcm", ctx: MARE, q: "Le héron est un consommateur de quel ordre ?", c: ["3e ordre", "1er ordre", "2e ordre", "4e ordre"], a: 0, ex: "Algues (producteur) → têtards (1er ordre) → dytiques (2e ordre) → héron (3e ordre). On obtient aussi 3e ordre via daphnies puis épinoches." },
        { t: "qcm", q: "Lequel de ces êtres vivants est un décomposeur ?", c: ["Un champignon qui pousse sur une souche", "Une coccinelle", "Une fougère", "Un hérisson"], a: 0, ex: "Les décomposeurs (champignons, bactéries…) transforment la matière morte en sels minéraux qui retournent au sol et servent aux plantes." },
        { t: "qcm", q: "De quoi une plante verte a-t-elle besoin pour réaliser la photosynthèse ?", c: ["Lumière, eau, dioxyde de carbone (et sels minéraux)", "Lumière, dioxygène, sucre", "Obscurité, eau, dioxygène", "Chaleur, sucre, dioxyde de carbone"], a: 0, ex: "Grâce à la lumière captée par la chlorophylle, la plante utilise l'eau et les sels minéraux du sol et le dioxyde de carbone de l'air pour fabriquer sa matière (sucres)." },
        { t: "vf", q: "Pendant la photosynthèse, la plante rejette du dioxygène.", a: true, ex: "La photosynthèse produit de la matière organique (sucres) et rejette du dioxygène dans l'air." },
        { t: "vf", q: "Les plantes vertes respirent uniquement la nuit.", a: false, ex: "Les plantes respirent jour et nuit (elles absorbent du dioxygène). Le jour, la photosynthèse masque la respiration car elle rejette plus de dioxygène qu'elle n'en consomme." },
        { t: "txt", q: "Comment appelle-t-on un être vivant qui fabrique sa propre matière grâce à la lumière ? (un mot)", a: ["producteur", "un producteur", "producteurs"], ex: "Les plantes vertes et les algues sont des producteurs : elles sont à la base de toutes les chaînes alimentaires." },
        { t: "qcm", q: "Animal vertébré à peau nue et humide, dont la larve vit dans l'eau et respire par des branchies. À quel groupe appartient-il ?", c: ["Amphibiens", "Reptiles", "Poissons", "Mammifères"], a: 0, ex: "Peau nue et humide + larve aquatique à branchies (le têtard) : ce sont les amphibiens (grenouille, crapaud, triton, salamandre)." },
        { t: "qcm", q: "La chauve-souris vole et possède des ailes. À quel groupe de vertébrés appartient-elle ?", c: ["Mammifères", "Oiseaux", "Reptiles", "Insectes"], a: 0, ex: "La chauve-souris a des poils et les femelles allaitent leurs petits avec des mamelles : c'est un mammifère. Voler n'est pas un critère de classification." },
        { t: "qcm", q: "Quel attribut possèdent TOUS les oiseaux ?", c: ["Des plumes", "La capacité de voler", "Des pattes palmées", "Un bec crochu"], a: 0, ex: "Tous les oiseaux ont des plumes, même ceux qui ne volent pas (autruche, manchot). C'est le critère qui les distingue des autres vertébrés." },
        { t: "qcm", q: "Pour classer les animaux, lequel de ces critères est un attribut observable correct ?", c: ["Possède des écailles", "Vit dans l'eau", "Est dangereux pour l'homme", "Se déplace rapidement"], a: 0, ex: "On classe les êtres vivants selon ce qu'ils possèdent (écailles, plumes, poils, nombre de pattes…), pas selon leur milieu de vie ni leur comportement." },
        { t: "vf", q: "L'araignée est un insecte.", a: false, ex: "L'araignée a 8 pattes et un corps en 2 parties : c'est un arachnide. Les insectes ont 6 pattes et un corps en 3 parties (tête, thorax, abdomen)." },
        { t: "vf", q: "La baleine est un poisson puisqu'elle vit dans l'eau.", a: false, ex: "La baleine respire avec des poumons, a quelques poils et allaite ses petits : c'est un mammifère. Le milieu de vie n'est pas un critère de classification." },
        { t: "qcm", q: "Lequel de ces insectes a une métamorphose INCOMPLÈTE (pas de stade nymphe) ?", c: ["Le criquet", "Le papillon", "La coccinelle", "La mouche"], a: 0, ex: "Chez le criquet, la larve ressemble déjà à l'adulte et grandit par mues : métamorphose incomplète. Papillon, coccinelle et mouche passent par larve puis nymphe : métamorphose complète." },
        { t: "txt", q: "Chez le papillon, comment s'appelle le stade nymphe, entre la chenille et l'adulte ? (un mot)", a: ["chrysalide", "une chrysalide", "la chrysalide"], ex: "Cycle du papillon : œuf → chenille (larve) → chrysalide (nymphe) → papillon adulte. C'est une métamorphose complète." },
        { t: "qcm", q: "Qu'est-ce que la pollinisation ?", c: ["Le transport du pollen des étamines jusqu'au pistil", "La transformation de l'ovule en graine", "La dispersion des graines loin de la plante", "La germination de la graine"], a: 0, ex: "La pollinisation est le transport du pollen (par le vent ou les insectes) vers le pistil. Elle précède la fécondation." },
        { t: "qcm", q: "Après la fécondation, en quoi se transforme l'ovaire de la fleur ?", c: ["En fruit", "En graine", "En pollen", "En pétale"], a: 0, ex: "Après la fécondation, l'ovule devient la graine et l'ovaire (qui contient les ovules) devient le fruit." },
        { t: "qcm", q: "Les fruits de l'érable possèdent des « ailes ». Quel est le principal agent de leur dissémination ?", c: ["Le vent", "Les animaux qui les mangent", "L'eau", "Les abeilles"], a: 0, ex: "Les fruits ailés tournoient et sont emportés par le vent loin de l'arbre : c'est une dissémination par le vent." }
      ]
    },
    /* ======================================================= */
    {
      id: "corps",
      name: "Le corps humain",
      desc: "Digestion, respiration, circulation, nutrition des cellules, système nerveux",
      items: [
        { t: "qcm", q: "Dans quel ordre les aliments passent-ils dans le tube digestif ?", c: ["Bouche → œsophage → estomac → intestin grêle → gros intestin", "Bouche → estomac → œsophage → intestin grêle → gros intestin", "Bouche → œsophage → estomac → gros intestin → intestin grêle", "Bouche → œsophage → foie → estomac → intestin grêle"], a: 0, ex: "Le trajet est : bouche, œsophage, estomac, intestin grêle, gros intestin, anus. Le foie n'est pas traversé par les aliments." },
        { t: "qcm", q: "Dans quel organe les nutriments passent-ils principalement dans le sang ?", c: ["L'intestin grêle", "L'estomac", "Le gros intestin", "L'œsophage"], a: 0, ex: "La paroi de l'intestin grêle, très longue et plissée (villosités), est riche en vaisseaux sanguins : c'est là que se fait l'absorption des nutriments." },
        { t: "qcm", q: "Lequel de ces organes est une glande digestive et ne fait PAS partie du tube digestif ?", c: ["Le foie", "L'estomac", "L'œsophage", "L'intestin grêle"], a: 0, ex: "Le foie (comme le pancréas et les glandes salivaires) déverse des sucs digestifs mais les aliments ne le traversent pas." },
        { t: "qcm", q: "Quel est le rôle des enzymes digestives ?", c: ["Découper les grosses molécules des aliments en nutriments plus petits", "Transporter les nutriments dans le sang", "Broyer les aliments comme les dents", "Faire avancer les aliments dans le tube digestif"], a: 0, ex: "Les enzymes, contenues dans les sucs digestifs, transforment chimiquement les aliments en nutriments assez petits pour traverser la paroi de l'intestin." },
        { t: "vf", q: "La salive contient une enzyme qui commence la digestion de l'amidon (présent dans le pain).", a: true, ex: "L'amylase salivaire commence à transformer l'amidon en sucres plus simples : c'est pourquoi le pain mâché longtemps prend un goût sucré." },
        { t: "qcm", q: "Quel est le trajet de l'air inspiré ?", c: ["Nez → trachée → bronches → bronchioles → alvéoles", "Nez → bronches → trachée → alvéoles → bronchioles", "Nez → œsophage → bronches → alvéoles", "Nez → trachée → alvéoles → bronches"], a: 0, ex: "L'air passe par le nez (ou la bouche), le pharynx, la trachée, les bronches, les bronchioles et arrive dans les alvéoles pulmonaires." },
        { t: "qcm", q: "Que se passe-t-il au niveau des alvéoles pulmonaires ?", c: ["Le dioxygène passe de l'air vers le sang et le dioxyde de carbone du sang vers l'air", "Le dioxyde de carbone passe de l'air vers le sang", "L'air est réchauffé puis renvoyé sans changement", "Les nutriments passent dans le sang"], a: 0, ex: "La paroi des alvéoles est très fine et entourée de capillaires : ce sont les échanges gazeux. Le sang s'enrichit en O2 et se débarrasse du CO2." },
        { t: "qcm", ctx: AIR, q: "Quel gaz voit sa proportion augmenter le plus entre l'air inspiré et l'air expiré ?", c: ["Le dioxyde de carbone", "Le dioxygène", "Le diazote", "Aucun, la composition ne change pas"], a: 0, ex: "Le CO2 passe de 0,04 % à 4 % (environ 100 fois plus) : il est produit par les cellules et rejeté par les poumons. Le dioxygène, lui, diminue (21 % → 16 %)." },
        { t: "vf", ctx: AIR, q: "D'après ce tableau, l'air expiré ne contient plus du tout de dioxygène.", a: false, ex: "L'air expiré contient encore 16 % de dioxygène : seule une partie du dioxygène inspiré (21 %) passe dans le sang." },
        { t: "qcm", q: "Quel est le rôle des artères ?", c: ["Transporter le sang du cœur vers les organes", "Ramener le sang des organes vers le cœur", "Transporter uniquement du sang pauvre en dioxygène", "Filtrer le sang"], a: 0, ex: "Les artères partent du cœur ; les veines reviennent au cœur. Attention : l'artère pulmonaire transporte du sang pauvre en dioxygène." },
        { t: "vf", q: "Les veines ramènent le sang des organes vers le cœur.", a: true, ex: "Veine = retour au cœur. Artère = départ du cœur." },
        { t: "qcm", q: "Dans la petite circulation (circulation pulmonaire), le sang va…", c: ["du cœur vers les poumons, puis revient au cœur", "du cœur vers tous les organes, puis revient au cœur", "des poumons vers l'intestin", "du cerveau vers les poumons"], a: 0, ex: "Double circulation : la petite circulation relie le cœur aux poumons (le sang s'y charge en O2) ; la grande circulation relie le cœur à tous les autres organes." },
        { t: "qcm", q: "Quelle partie du cœur envoie le sang riche en dioxygène vers tout le corps ?", c: ["Le ventricule gauche", "Le ventricule droit", "L'oreillette droite", "L'oreillette gauche"], a: 0, ex: "Le ventricule gauche, très musclé, propulse le sang riche en O2 dans l'aorte vers tous les organes. Le ventricule droit envoie le sang vers les poumons." },
        { t: "txt", q: "Quel organe fonctionne comme une pompe pour faire circuler le sang ? (un mot)", a: ["cœur", "coeur", "le cœur", "le coeur"], ex: "Le cœur est un muscle creux qui se contracte environ 70 fois par minute au repos pour faire circuler le sang." },
        { t: "qcm", q: "Quel est le rôle principal du sang ?", c: ["Apporter nutriments et dioxygène aux cellules et emporter leurs déchets (dont le CO2)", "Digérer les aliments", "Fabriquer le dioxygène", "Transmettre les messages nerveux"], a: 0, ex: "Le sang est le transporteur du corps : il distribue nutriments et O2 à toutes les cellules et emporte leurs déchets vers les poumons et les reins." },
        { t: "qcm", q: "De quoi les cellules d'un muscle ont-elles besoin pour libérer l'énergie nécessaire à son travail ?", c: ["De nutriments (comme le glucose) et de dioxygène", "De dioxyde de carbone et d'eau", "Uniquement de dioxygène", "D'enzymes digestives"], a: 0, ex: "Dans les cellules, les nutriments « brûlent » grâce au dioxygène (respiration cellulaire) : cela libère de l'énergie et produit du CO2." },
        { t: "qcm", q: "Margaux entend son téléphone sonner et le saisit. Quel est l'ordre correct ?", c: ["Stimulus → oreille → nerf → cerveau → nerf → muscles du bras", "Stimulus → cerveau → oreille → nerf → muscles du bras", "Stimulus → muscles du bras → nerf → cerveau", "Stimulus → nerf → oreille → muscles du bras → cerveau"], a: 0, ex: "L'organe des sens capte le stimulus, un nerf transmet le message au cerveau, qui l'analyse et envoie un ordre par un nerf aux muscles (réponse)." },
        { t: "qcm", q: "Dans l'exemple « Margaux voit le feu passer au rouge et s'arrête », quel est l'organe des sens concerné ?", c: ["L'œil", "Le cerveau", "Les muscles des jambes", "Le nerf optique"], a: 0, ex: "L'œil capte le stimulus lumineux. Le nerf optique transmet le message, le cerveau décide, les muscles réalisent la réponse." }
      ]
    },
    /* ======================================================= */
    {
      id: "matiere",
      name: "La matière",
      desc: "Mélanges, séparation, états et changements d'état, masse volumique, dissolution",
      items: [
        { t: "qcm", q: "Lequel de ces liquides est un corps pur ?", c: ["L'eau distillée", "L'eau du robinet", "L'eau de mer", "Le jus d'orange"], a: 0, ex: "L'eau distillée ne contient que des molécules d'eau. L'eau du robinet contient des sels minéraux dissous : c'est un mélange (homogène)." },
        { t: "qcm", q: "De l'eau dans laquelle on a complètement dissous du sel est…", c: ["un mélange homogène", "un mélange hétérogène", "un corps pur", "un solide"], a: 0, ex: "On ne distingue plus les constituants à l'œil nu : c'est un mélange homogène (une solution)." },
        { t: "qcm", q: "Un mélange d'eau et d'huile est…", c: ["un mélange hétérogène", "un mélange homogène", "un corps pur", "une solution"], a: 0, ex: "On voit deux couches distinctes (l'huile flotte sur l'eau) : le mélange est hétérogène." },
        { t: "qcm", q: "Après avoir laissé décanter de l'eau boueuse, quelle technique permet d'obtenir une eau limpide ?", c: ["La filtration", "L'aimantation", "Le tamisage", "L'évaporation"], a: 0, ex: "Le filtre retient les fines particules solides non dissoutes et laisse passer l'eau : on obtient un filtrat limpide." },
        { t: "qcm", q: "Comment récupérer le sel dissous dans de l'eau salée ?", c: ["Par évaporation de l'eau", "Par filtration", "Par décantation", "Par tamisage"], a: 0, ex: "Le sel dissous traverse le filtre et ne se dépose pas. En faisant évaporer l'eau (comme dans les marais salants), le sel reste au fond." },
        { t: "qcm", q: "Quelle technique permet d'obtenir de l'eau pure à partir d'eau salée ?", c: ["La distillation", "La filtration", "La décantation", "L'aimantation"], a: 0, ex: "Distillation : on fait bouillir l'eau salée, la vapeur (sans sel) est refroidie et se liquéfie dans un autre récipient." },
        { t: "qcm", q: "Comment séparer facilement de la limaille de fer mélangée à du sable ?", c: ["Avec un aimant", "Par filtration", "Par distillation", "Par évaporation"], a: 0, ex: "Le fer est attiré par un aimant, pas le sable : c'est la séparation par aimantation." },
        { t: "qcm", q: "Pour séparer des graviers du sable sec, on utilise…", c: ["le tamisage", "la décantation", "la distillation", "l'aimantation"], a: 0, ex: "Le tamis laisse passer les petits grains de sable et retient les graviers, plus gros." },
        { t: "qcm", q: "Qu'est-ce que la fusion ?", c: ["Le passage de l'état solide à l'état liquide", "Le passage de l'état liquide à l'état solide", "Le passage de l'état liquide à l'état gazeux", "Le passage de l'état solide à l'état gazeux"], a: 0, ex: "Fusion : solide → liquide (le glaçon fond). L'inverse est la solidification." },
        { t: "txt", q: "Comment s'appelle le passage de l'état gazeux à l'état liquide ? (un mot)", a: ["liquéfaction", "liquefaction", "condensation", "la liquéfaction", "la condensation"], ex: "Gaz → liquide : liquéfaction (souvent appelée condensation dans la vie courante), comme la buée sur un miroir de salle de bain." },
        { t: "qcm", q: "La neige carbonique (CO2 solide) passe directement à l'état gazeux sans devenir liquide. Comment s'appelle ce changement d'état ?", c: ["La sublimation", "La vaporisation", "La fusion", "La liquéfaction"], a: 0, ex: "Sublimation : solide → gaz directement. L'inverse (gaz → solide) s'appelle la condensation solide (ou déposition), comme le givre." },
        { t: "num", q: "Sous pression atmosphérique normale, à quelle température (en °C) l'eau pure bout-elle ?", a: 100, unit: "°C", ex: "L'eau pure bout à 100 °C et fond (ou gèle) à 0 °C sous pression normale." },
        { t: "qcm", ctx: GLACE, q: "Que se passe-t-il entre 4 et 8 minutes ?", c: ["La glace fond et la température reste constante", "La glace se réchauffe sans fondre", "L'eau bout", "Le thermomètre est en panne"], a: 0, ex: "Pendant le changement d'état d'un corps pur, la température reste constante : c'est le palier de fusion, à 0 °C pour l'eau." },
        { t: "vf", ctx: GLACE, q: "Le palier de température observé indique que cette glace est un corps pur (de l'eau pure).", a: true, ex: "Un corps pur change d'état à température constante (palier). Un mélange, comme de l'eau salée gelée, fond sans palier net." },
        { t: "vf", q: "Quand un glaçon de 20 g fond complètement, on obtient moins de 20 g d'eau liquide.", a: false, ex: "Lors d'un changement d'état, la masse se conserve : on obtient 20 g d'eau. Seul le volume change (la glace occupe un peu plus de place)." },
        { t: "vf", q: "Si on dissout 10 g de sel dans 200 g d'eau, la solution obtenue a une masse de 210 g.", a: true, ex: "Le sel ne disparaît pas quand il se dissout : la masse se conserve. 200 g + 10 g = 210 g." },
        { t: "qcm", q: "On ajoute du sucre dans un verre d'eau en remuant. À partir d'un moment, le sucre ajouté reste au fond sans se dissoudre. On dit que la solution est…", c: ["saturée", "diluée", "hétérogène dès le premier grain", "pure"], a: 0, ex: "Une solution saturée ne peut plus dissoudre de soluté à cette température : l'excès reste au fond." },
        { t: "qcm", q: "En général, lorsqu'on chauffe l'eau, la quantité de sucre qu'elle peut dissoudre…", c: ["augmente", "diminue", "reste la même", "devient nulle"], a: 0, ex: "La solubilité du sucre augmente avec la température : l'eau chaude peut dissoudre beaucoup plus de sucre que l'eau froide." },
        { t: "qcm", q: "Un bouchon de liège a une masse volumique de 0,25 g/cm³. Dans l'eau (1 g/cm³), il…", c: ["flotte", "coule", "flotte entre deux eaux", "se dissout"], a: 0, ex: "Un objet dont la masse volumique est inférieure à celle du liquide flotte : 0,25 < 1." },
        { t: "vf", q: "Un kilogramme de plumes est plus léger qu'un kilogramme de plomb.", a: false, ex: "Même masse (1 kg) ! Mais les plumes occupent un volume bien plus grand : leur masse volumique est beaucoup plus faible." }
      ],
      gen: [genRho, genFlotte]
    },
    /* ======================================================= */
    {
      id: "energie",
      name: "Énergie, chaleur & électricité",
      desc: "Sources d'énergie, transformations, transferts de chaleur, isolants, circuits",
      items: [
        { t: "qcm", q: "Laquelle de ces sources d'énergie est renouvelable ?", c: ["Le vent", "Le charbon", "Le pétrole", "Le gaz naturel"], a: 0, ex: "Le vent se renouvelle sans cesse à l'échelle humaine. Charbon, pétrole et gaz sont des combustibles fossiles, en quantité limitée." },
        { t: "qcm", q: "Laquelle de ces sources d'énergie est NON renouvelable ?", c: ["L'uranium des centrales nucléaires", "Le soleil", "La biomasse (bois)", "L'eau des barrages"], a: 0, ex: "L'uranium est un minerai extrait du sol, en quantité limitée. Le bois repousse, le soleil brille, l'eau circule : ce sont des sources renouvelables." },
        { t: "vf", q: "Le pétrole est une source non renouvelable parce qu'il a mis des millions d'années à se former.", a: true, ex: "Nous le consommons beaucoup plus vite qu'il ne se forme : les réserves s'épuisent." },
        { t: "qcm", q: "Quelle est la chaîne de transformations d'énergie d'une éolienne ?", c: ["Énergie de mouvement du vent → énergie mécanique (rotation) → énergie électrique", "Énergie électrique → énergie de mouvement → énergie lumineuse", "Énergie chimique → énergie thermique → énergie électrique", "Énergie lumineuse → énergie électrique"], a: 0, ex: "Le vent en mouvement fait tourner les pales ; l'alternateur transforme cette rotation en énergie électrique." },
        { t: "qcm", q: "Sur un vélo, la dynamo alimente la lampe. Quelle chaîne d'énergie est correcte ?", c: ["Mouvement de la roue → énergie électrique → énergie lumineuse (et thermique)", "Énergie lumineuse → énergie électrique → mouvement", "Énergie chimique de la pile → énergie lumineuse", "Énergie thermique → énergie électrique → mouvement"], a: 0, ex: "La roue fait tourner la dynamo qui produit de l'électricité ; la lampe la transforme en lumière (et un peu en chaleur)." },
        { t: "qcm", q: "Dans une centrale au gaz, quelle chaîne de transformations a lieu ?", c: ["Chimique → thermique → mécanique (turbine) → électrique", "Électrique → thermique → chimique", "Thermique → chimique → lumineuse", "Mécanique → chimique → électrique"], a: 0, ex: "La combustion libère l'énergie chimique du gaz en chaleur ; la vapeur produite fait tourner une turbine reliée à un alternateur." },
        { t: "qcm", q: "Un panneau photovoltaïque transforme…", c: ["l'énergie lumineuse en énergie électrique", "l'énergie thermique en énergie chimique", "l'énergie électrique en énergie lumineuse", "l'énergie du vent en énergie électrique"], a: 0, ex: "Les cellules photovoltaïques produisent directement de l'électricité à partir de la lumière du Soleil." },
        { t: "qcm", q: "On laisse une cuillère en métal dans une soupe chaude : le manche devient chaud. Quel mode de transfert de chaleur est en jeu ?", c: ["La conduction", "La convection", "Le rayonnement", "L'évaporation"], a: 0, ex: "La conduction transmet la chaleur de proche en proche à travers un solide, sans déplacement de matière. Les métaux sont de bons conducteurs." },
        { t: "qcm", q: "Dans une casserole chauffée par le bas, l'eau chaude monte et l'eau froide descend. Quel mode de transfert de chaleur est-ce ?", c: ["La convection", "La conduction", "Le rayonnement", "L'isolation"], a: 0, ex: "La convection est un transfert de chaleur par déplacement d'un fluide (liquide ou gaz) : le fluide chaud, moins dense, monte." },
        { t: "qcm", q: "La chaleur du Soleil nous parvient à travers le vide de l'espace. Par quel mode de transfert ?", c: ["Le rayonnement", "La conduction", "La convection", "Le contact"], a: 0, ex: "Seul le rayonnement peut transférer de l'énergie dans le vide : il n'a besoin d'aucune matière." },
        { t: "qcm", q: "Lequel de ces matériaux est un bon isolant thermique ?", c: ["Le polystyrène expansé", "Le cuivre", "L'aluminium", "Le fer"], a: 0, ex: "Le polystyrène expansé emprisonne de l'air, très mauvais conducteur de chaleur. Les métaux sont de bons conducteurs thermiques." },
        { t: "vf", q: "Un pull en laine tient chaud notamment parce qu'il emprisonne de l'air, qui est un bon isolant thermique.", a: true, ex: "Le pull ne produit pas de chaleur : il limite les pertes de chaleur du corps grâce à l'air immobile emprisonné entre les fibres." },
        { t: "qcm", q: "Lequel de ces objets est un conducteur électrique ?", c: ["Un clou en fer", "Une règle en plastique", "Un bâtonnet en bois sec", "Un verre"], a: 0, ex: "Les métaux conduisent le courant électrique. Le plastique, le bois sec et le verre sont des isolants électriques." },
        { t: "qcm", q: "La lampe d'un circuit ne s'allume pas car l'interrupteur est ouvert. Le circuit est…", c: ["ouvert", "fermé", "en court-circuit", "en parallèle"], a: 0, ex: "Pour que le courant circule, il faut une boucle ininterrompue (circuit fermé). Un interrupteur ouvert coupe la boucle." },
        { t: "vf", q: "Le rôle d'un interrupteur est d'ouvrir ou de fermer un circuit électrique.", a: true, ex: "Fermé, il laisse passer le courant ; ouvert, il coupe la boucle et le courant ne circule plus." },
        { t: "qcm", ctx: SERIE, q: "On dévisse la lampe L1. Que devient L2 ?", c: ["Elle s'éteint", "Elle brille plus fort", "Elle brille de la même façon", "Elle clignote"], a: 0, ex: "En série, il n'y a qu'une seule boucle : si on retire une lampe, le circuit est ouvert et plus aucun courant ne circule." },
        { t: "qcm", ctx: PARA, q: "On dévisse la lampe L1. Que devient L2 ?", c: ["Elle reste allumée", "Elle s'éteint", "Elle s'éteint puis se rallume", "Elle grille aussitôt"], a: 0, ex: "En parallèle, chaque lampe est sur sa propre boucle avec la pile : la branche de L2 reste fermée. C'est ainsi que sont câblées les lampes d'une maison." },
        { t: "qcm", q: "Dans un circuit « pile + lampe », on relie les deux bornes de la lampe par un fil de cuivre. Que se passe-t-il ?", c: ["La lampe s'éteint : elle est court-circuitée et la pile risque de chauffer", "La lampe brille plus fort", "Rien ne change", "La lampe brille moins fort mais reste allumée"], a: 0, ex: "Le courant passe par le fil (chemin le plus facile) plutôt que par la lampe. C'est un court-circuit : la pile débite fortement, chauffe et s'use." },
        { t: "vf", q: "Température et chaleur, c'est la même chose.", a: false, ex: "La température (°C) indique à quel point un corps est chaud ; la chaleur est de l'énergie (en joules) transférée d'un corps chaud vers un corps plus froid." },
        { t: "qcm", q: "Une baignoire pleine d'eau à 40 °C et une tasse de thé à 80 °C refroidissent toutes les deux jusqu'à 20 °C. Laquelle cède le plus de chaleur à la pièce ?", c: ["La baignoire", "La tasse de thé", "Les deux autant", "Aucune des deux"], a: 0, ex: "La quantité de chaleur dépend de la température ET de la masse. La baignoire contient des centaines de fois plus d'eau : elle cède beaucoup plus d'énergie malgré sa température plus basse." },
        { t: "qcm", q: "Dans quelle unité s'exprime l'énergie (et donc une quantité de chaleur) ?", c: ["Le joule (J)", "Le degré Celsius (°C)", "Le newton (N)", "Le pascal (Pa)"], a: 0, ex: "L'énergie se mesure en joules. Le °C mesure une température, le newton une force, le pascal une pression." }
      ]
    },
    /* ======================================================= */
    {
      id: "forces",
      name: "Forces, masse & pression",
      desc: "Forces et leurs effets, masse et poids, pression, pression atmosphérique, équilibre",
      items: [
        { t: "qcm", q: "Lequel de ces effets n'est PAS un effet d'une force ?", c: ["Changer la masse d'un objet", "Déformer un objet", "Mettre un objet en mouvement", "Modifier la trajectoire d'un objet"], a: 0, ex: "Une force peut déformer un objet, le mettre en mouvement, le freiner ou changer sa trajectoire. Elle ne modifie pas sa masse (la quantité de matière)." },
        { t: "qcm", q: "Dans quelle unité s'exprime une force ?", c: ["Le newton (N)", "Le kilogramme (kg)", "Le pascal (Pa)", "Le joule (J)"], a: 0, ex: "Les forces (dont le poids) s'expriment en newtons, du nom du physicien Isaac Newton." },
        { t: "qcm", q: "Quel instrument permet de mesurer une force ?", c: ["Le dynamomètre", "La balance", "Le baromètre", "Le thermomètre"], a: 0, ex: "Le dynamomètre contient un ressort qui s'allonge d'autant plus que la force est grande. La balance mesure une masse." },
        { t: "qcm", q: "On représente une force par une flèche. Qu'indique la longueur de la flèche ?", c: ["L'intensité (la valeur) de la force", "La masse de l'objet", "La durée de la force", "La vitesse de l'objet"], a: 0, ex: "Une flèche-force indique le point d'application (origine), la direction, le sens et l'intensité (longueur, selon une échelle choisie, ex. 1 cm pour 10 N)." },
        { t: "vf", q: "La masse se mesure en newtons.", a: false, ex: "La masse (quantité de matière) se mesure en kilogrammes avec une balance. C'est le poids, une force, qui se mesure en newtons." },
        { t: "vf", q: "Sur la Lune, la masse d'un astronaute est plus petite que sur la Terre.", a: false, ex: "La masse ne dépend pas du lieu : l'astronaute contient la même quantité de matière. C'est son poids qui change." },
        { t: "vf", q: "Sur la Lune, le poids d'un astronaute est environ 6 fois plus petit que sur la Terre.", a: true, ex: "g vaut environ 10 N/kg sur Terre et 1,6 N/kg sur la Lune : 10 ÷ 1,6 ≈ 6. Le poids est donc environ 6 fois plus petit." },
        { t: "qcm", q: "Que signifie « g = 10 N/kg » sur la Terre ?", c: ["Chaque kilogramme est attiré par la Terre avec une force d'environ 10 N", "Un objet de 10 kg pèse 1 N", "Un objet tombe à 10 km/h", "La Terre a une masse de 10 kg"], a: 0, ex: "g est l'intensité de la pesanteur : un objet de 1 kg a un poids de 10 N, un objet de 5 kg un poids de 50 N (P = m × g)." },
        { t: "qcm", q: "Pourquoi s'enfonce-t-on moins dans la neige avec des skis qu'avec des bottes ?", c: ["La surface de contact est plus grande, donc la pression est plus faible", "Les skis diminuent le poids du skieur", "La surface de contact est plus petite, donc la pression est plus faible", "Les skis augmentent la pression sur la neige"], a: 0, ex: "p = F / S : pour une même force (le poids), une plus grande surface donne une pression plus faible." },
        { t: "qcm", q: "Pourquoi un clou pointu s'enfonce-t-il facilement dans le bois ?", c: ["La force est concentrée sur une très petite surface : la pression est très grande", "La pointe diminue la force du marteau", "La pointe augmente la masse du clou", "La grande surface de la pointe répartit la force"], a: 0, ex: "p = F / S : avec une surface minuscule, la même force produit une pression énorme." },
        { t: "qcm", q: "Une brique est posée sur du sable, d'abord sur sa grande face, puis sur sa plus petite face. Dans quel cas s'enfonce-t-elle le plus ?", c: ["Sur sa plus petite face", "Sur sa grande face", "Autant dans les deux cas", "Elle ne s'enfonce jamais"], a: 0, ex: "Le poids est le même, mais sur la petite face la surface est plus petite : la pression est plus grande, la brique s'enfonce davantage." },
        { t: "qcm", q: "Dans quelle unité s'exprime la pression dans le Système international ?", c: ["Le pascal (Pa), soit 1 N/m²", "Le newton (N)", "Le kilogramme par mètre cube (kg/m³)", "Le joule (J)"], a: 0, ex: "p = F / S : une force en newtons divisée par une surface en m² donne des N/m², c'est-à-dire des pascals." },
        { t: "qcm", q: "Quand on monte en haut d'une montagne, la pression atmosphérique…", c: ["diminue", "augmente", "reste la même", "devient nulle au sommet"], a: 0, ex: "La pression atmosphérique est due au poids de l'air au-dessus de nous. Plus on monte, moins il y a d'air au-dessus : la pression diminue." },
        { t: "qcm", q: "Quel instrument mesure la pression atmosphérique ?", c: ["Le baromètre", "Le dynamomètre", "L'anémomètre", "Le thermomètre"], a: 0, ex: "Le baromètre mesure la pression atmosphérique (environ 1013 hPa au niveau de la mer)." },
        { t: "qcm", q: "Pourquoi une ventouse reste-t-elle collée à une vitre ?", c: ["La pression de l'air extérieur est plus grande que celle de l'air resté sous la ventouse", "La ventouse contient de la colle", "La vitre attire le caoutchouc", "Le poids de la ventouse la plaque contre la vitre"], a: 0, ex: "En écrasant la ventouse, on chasse l'air : la pression dessous devient plus faible et la pression atmosphérique extérieure la plaque contre la vitre." },
        { t: "qcm", q: "Un livre est posé, immobile, sur une table. Quelle affirmation est correcte ?", c: ["Son poids est compensé par la force exercée par la table, de même intensité et de sens opposé", "Aucune force n'agit sur le livre", "Seul son poids agit sur lui", "La table exerce une force plus grande que son poids"], a: 0, ex: "Le livre est en équilibre : deux forces de même direction (verticale), de même intensité et de sens opposés se compensent." },
        { t: "vf", q: "Un objet soumis à deux forces de même direction, de même intensité et de sens opposés peut rester immobile.", a: true, ex: "C'est la condition d'équilibre pour deux forces : elles se compensent. Par exemple, une lampe suspendue : poids vers le bas, tension du fil vers le haut." }
      ],
      gen: [genPoids, genMasse, genPression]
    },
    /* ======================================================= */
    {
      id: "demarche",
      name: "Démarche scientifique",
      desc: "Variable testée, témoin, hypothèse, lecture de résultats, conclusion",
      items: [
        /* --- Expérience 1 : germination --- */
        { t: "qcm", ctx: HARICOT, q: "En comparant les pots A et B, quel facteur Margaux teste-t-elle ?", c: ["L'eau (l'humidité)", "La lumière", "La température", "Le nombre de graines"], a: 0, ex: "Entre A et B, seule l'humidité change (humide / sec) ; lumière et température sont identiques. On teste donc l'effet de l'eau." },
        { t: "qcm", ctx: HARICOT, q: "Quels pots faut-il comparer pour savoir si la lumière est nécessaire à la germination ?", c: ["A et C", "A et B", "B et D", "A et D"], a: 0, ex: "Il faut deux pots qui ne diffèrent que par la lumière : A (lumière) et C (obscurité), tous deux humides à 20 °C." },
        { t: "qcm", ctx: HARICOT, q: "Que peut-on conclure en comparant les pots A et C ?", c: ["La lumière n'est pas nécessaire à la germination du haricot", "La lumière est indispensable à la germination", "L'obscurité empêche la germination", "L'eau n'est pas nécessaire à la germination"], a: 0, ex: "Avec ou sans lumière, 9 graines sur 10 ont germé : la lumière n'influence pas la germination (elle sera nécessaire plus tard, pour la photosynthèse)." },
        { t: "num", ctx: HARICOT, q: "Quel est le pourcentage de graines germées dans le pot A ?", a: 90, unit: "%", ex: "9 graines germées sur 10 : 9 ÷ 10 × 100 = 90 %." },
        { t: "qcm", ctx: HARICOT, q: "En comparant les pots C et D, quelle conclusion est correcte ?", c: ["Une température trop basse empêche presque totalement la germination", "Le froid accélère la germination", "La température n'a aucune influence", "L'obscurité empêche la germination"], a: 0, ex: "C et D ne diffèrent que par la température : 9 graines germent à 20 °C, 1 seule à 4 °C. Il faut une température suffisante pour germer." },
        /* --- Expérience 2 : dissolution du sucre --- */
        { t: "qcm", ctx: SUCRE, q: "Quelle est la variable testée (le facteur que Thomas fait varier) ?", c: ["La température de l'eau", "La durée de dissolution", "Le volume d'eau", "Le type de sucre"], a: 0, ex: "Thomas change volontairement la température (10, 30, 50, 70 °C). La durée de dissolution est ce qu'il mesure (le résultat)." },
        { t: "qcm", ctx: SUCRE, q: "Que mesure Thomas pour obtenir ses résultats ?", c: ["La durée de dissolution du sucre", "La température de l'eau", "La masse de sucre", "Le volume d'eau"], a: 0, ex: "Le résultat mesuré est le temps (en secondes) nécessaire pour que le sucre disparaisse complètement." },
        { t: "qcm", ctx: SUCRE, q: "Pour que son expérience soit valable, que doit garder Thomas IDENTIQUE à chaque essai ?", c: ["Le volume d'eau et la taille du morceau de sucre", "La température de l'eau", "La durée de dissolution", "Rien, tout peut changer"], a: 0, ex: "On ne fait varier qu'un seul facteur à la fois (la température). Tous les autres (volume, morceau de sucre, pas de mélange) doivent rester les mêmes." },
        { t: "num", ctx: SUCRE, q: "Combien de secondes faut-il au sucre pour se dissoudre dans l'eau à 50 °C ?", a: 60, unit: "s", ex: "On lit directement dans le tableau : à 50 °C, 60 s." },
        { t: "qcm", ctx: SUCRE, q: "Quelle conclusion Thomas peut-il tirer ?", c: ["Plus l'eau est chaude, plus le sucre se dissout rapidement", "Plus l'eau est chaude, plus le sucre met de temps à se dissoudre", "La température n'influence pas la dissolution", "Le sucre ne se dissout pas dans l'eau froide"], a: 0, ex: "Quand la température augmente (10 → 70 °C), la durée diminue (180 → 35 s) : la dissolution est plus rapide dans l'eau chaude. À 10 °C le sucre se dissout aussi, mais plus lentement." },
        /* --- Expérience 3 : isolation des canettes --- */
        { t: "qcm", ctx: CANETTE, q: "Quelle canette sert d'expérience témoin ?", c: ["La canette 1, sans manchon", "La canette 2, avec le néoprène", "La canette 3, avec l'aluminium", "Aucune, il n'y a pas de témoin"], a: 0, ex: "Le témoin est l'essai sans le facteur testé (pas de manchon). Il sert de référence pour voir si chaque manchon change quelque chose." },
        { t: "qcm", ctx: CANETTE, q: "Quel manchon garde le mieux la boisson fraîche ?", c: ["Le manchon en néoprène", "Le manchon en aluminium fin", "Les deux se valent", "Aucun ne fait mieux que le témoin"], a: 0, ex: "Après 30 min, la boisson de la canette 2 n'est qu'à 8 °C, contre 14 °C pour le témoin et 15 °C avec l'aluminium : le néoprène isole le mieux." },
        { t: "num", ctx: CANETTE, q: "De combien de degrés la boisson de la canette 2 s'est-elle réchauffée ?", a: 3, unit: "°C", ex: "Elle est passée de 5 °C à 8 °C : 8 − 5 = 3 °C." },
        { t: "qcm", ctx: CANETTE, q: "Quelle hypothèse est vérifiée par cette expérience ?", c: ["Le néoprène est un meilleur isolant thermique que l'aluminium", "L'aluminium est un bon isolant thermique", "Un manchon réchauffe toujours la boisson", "La température de la pièce n'a aucun effet sur la boisson"], a: 0, ex: "Avec l'aluminium, la boisson se réchauffe autant que sans manchon (et même un peu plus) : l'aluminium, un métal, conduit bien la chaleur. Le néoprène, lui, isole." },
        { t: "vf", ctx: CANETTE, q: "Pour que la comparaison soit juste, il fallait que les trois canettes contiennent la même quantité de boisson à la même température de départ.", a: true, ex: "Seul le manchon doit changer d'une canette à l'autre ; tous les autres facteurs doivent être identiques." },
        /* --- Expérience 4 : expérience mal conçue --- */
        { t: "qcm", ctx: TOMATE, q: "Pourquoi l'expérience de Lucas est-elle mal conçue ?", c: ["Deux facteurs changent à la fois : l'engrais et l'emplacement (lumière, température)", "Il n'a pas arrosé les plants", "Il aurait dû utiliser des plants de tailles différentes", "Trois semaines, c'est trop long"], a: 0, ex: "Le plant 2 a de l'engrais ET plus de soleil : impossible de savoir lequel des deux facteurs explique sa croissance." },
        { t: "vf", ctx: TOMATE, q: "Lucas peut conclure que c'est l'engrais qui a fait pousser le plant 2 plus vite.", a: false, ex: "Le plant 2 était aussi en plein soleil : sa croissance peut venir de la lumière. Une conclusion n'est valable que si un seul facteur a changé." },
        { t: "qcm", ctx: TOMATE, q: "Comment Lucas devrait-il corriger son expérience ?", c: ["Placer les deux plants au même endroit, avec le même arrosage : seul l'engrais diffère", "Mettre de l'engrais dans les deux pots", "Placer les deux plants dehors mais arroser seulement le plant 2", "Ne plus arroser aucun plant"], a: 0, ex: "Une expérience correcte ne fait varier qu'un facteur (l'engrais). Le plant 1, sans engrais mais dans les mêmes conditions, sert alors de témoin." },
        { t: "qcm", ctx: TOMATE, q: "Quelle phrase est une hypothèse que Lucas pourrait tester ?", c: ["L'engrais accélère la croissance des plants de tomate", "Le plant 2 mesure plus que le plant 1", "Est-ce que les tomates aiment l'engrais ?", "J'ai arrosé chaque jour"], a: 0, ex: "Une hypothèse est une réponse possible à la question de recherche, que l'expérience va vérifier ou non. « Le plant 2 mesure plus » est une observation, pas une hypothèse." }
      ]
    }
  ]
};
