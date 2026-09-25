/* =========================================================
   Wesh Words — CE1D : banque LANGUES MODERNES (néerlandais, niveau A1-A2)
   Questions et documents ORIGINAUX, rédigés dans l'esprit des épreuves externes CE1D
   (consignes en français, documents en néerlandais standard/belge).
   ========================================================= */

// ---------- Documents de lecture ----------
const EMAIL = `Van: sanne.peeters@mailbox.be
Aan: Margaux
Onderwerp: Hallo uit Antwerpen!

Hoi Margaux,
Bedankt voor je laatste e-mail! Ik ben Sanne en ik woon in Antwerpen, met mijn vader, mijn stiefmoeder en mijn kleine broer, Wout. Hij is acht en hij is heel druk! Ik zit op het Sint-Jozefcollege. Mijn lievelingsvak is aardrijkskunde, want onze leraar vertelt altijd interessante verhalen over andere landen. Na school speel ik elke dinsdag en donderdag tennis. In het weekend help ik vaak mijn oma in haar bakkerij.
Groot nieuws: volgende maand komt mijn klas drie dagen naar Brussel! Kunnen we afspreken? Wat is jouw lievelingsplek in de stad?
Tot snel,
Sanne`;

const POSTER = `ZOMERLOOP — PARK AAN DE VAART
Zaterdag 14 juni
Start: 10 uur (kom 30 minuten voor de start)
Afstanden: 2 km (onder 12 jaar) / 5 km (12 jaar en ouder)
Inschrijving: 5 euro voor volwassenen, 3 euro voor kinderen
GRATIS voor lopers in verkleedkledij!
Alle geld gaat naar het Dierenasiel Zonnehof.
Gratis water en een medaille voor elke loper.
Inschrijven in de bibliotheek vóór 10 juni.
Honden zijn welkom aan de leiband.`;

const MENU = `DE BLAUWE THEEPOT
Open van maandag tot zaterdag, 8 tot 18 uur. Gesloten op zondag.

ONTBIJT (tot 11 uur)
Volledig ontbijt ................ 7,50 €
Pannenkoeken met fruit ........... 5,00 €

MIDDAGETEN
Tomatensoep met brood ............ 4,50 €
Kaas-hamsandwich .................. 4,00 €
Veggieburger met friet ............ 8,00 €

DRANKEN
Thee / Koffie ..................... 2,00 €
Verse jus d'orange ................ 2,50 €
Warme chocolademelk ............... 3,00 €

Studentenkorting: 10% korting met je schoolkaart (enkel middageten).`;

const POST = `lily_tekent — 2 uur geleden geplaatst
Ik kan het niet geloven! Gisteren won mijn schilderij van de oude vuurtoren de eerste prijs op de stadswedstrijd. Ik heb er drie weken lang elke avond aan gewerkt. De prijs is een set professionele verf en een dag op een kunstworkshop in Gent. Bedankt aan mijn kunstleraar, meneer Peeters, die altijd zegt: "Geef nooit op!" Het schilderij hangt tot eind mei in de etalage van de stadsbibliotheek. Ga het zeker bekijken!
42 keer leuk gevonden · 9 reacties`;

const ARTICLE = `TIENER REDT DE DAG
Vorige zondag liep de 14-jarige Tom Baker met zijn hond op het strand van Oostende, toen hij iemand hoorde roepen. Een klein jongetje zat te ver van het strand in het water en kon niet meer terugzwemmen. Tom wachtte niet. Hij belde de strandredders met zijn telefoon en gooide daarna een reddingsboei naar de jongen. De jongen ving de boei en hield zich eraan vast tot de strandredders twee minuten later aankwamen.
"Ik heb vorig jaar op school geleerd wat ik moest doen tijdens een cursus eerste hulp," zei Tom. De ouders van de jongen willen hem bedanken met een speciaal etentje.`;

const RULES = `JEUGDHERBERG ZEEZICHT — HUISREGELS
- Inchecken: vanaf 15 uur. Uitchecken: voor 10 uur.
- Het ontbijt wordt geserveerd in de eetzaal van 7.30 tot 9 uur.
- Wees stil in de slaapkamers na 22.30 uur.
- De voordeur sluit om middernacht. Te laat? Bel aan en toon je kamerkaart.
- Geen eten in de slaapkamers. Je mag de keuken gebruiken tot 21 uur.
- Handdoeken kun je huren aan de receptie (1,50 €).
- Gratis wifi, enkel in de lounge.
Fijn verblijf!`;

// ---------- Audios d'écoute ----------
const A_RESTAURANT = "Ober: Zijn jullie klaar om te bestellen? Anna: Ja, ik neem de kipsalade, alstublieft. Ober: En om te drinken? Anna: Gewoon een glas water, alstublieft. Ben: Voor mij de vis met friet en een appelsap, alstublieft.";
const A_SHOP = "Verkoper: Kan ik u helpen? Mark: Ja, hoeveel kost dit blauwe T-shirt? Verkoper: Het kost twaalf euro. Mark: Hebt u het in maat medium? Verkoper: Sorry, we hebben enkel small en large.";

export default {
  id: "langues_nl",
  name: "Néerlandais (langues modernes)",
  icon: "🇳🇱",
  voiceLang: "nl-NL",
  themes: [
    // =====================================================
    {
      id: "reading",
      name: "Lezen — lire",
      desc: "Comprendre de courts documents authentiques : e-mail, affiche, menu, réseau social, article, règlement.",
      items: [
        // --- E-mail ---
        { t: "qcm", ctx: EMAIL, q: "Pourquoi la géographie est-elle la matière préférée de Sanne ?",
          c: ["Parce que son professeur raconte toujours des histoires intéressantes sur d'autres pays.", "Parce qu'elle voyage souvent avec sa classe.", "Parce que c'est sa matière la plus facile.", "Parce que sa grand-mère lui enseigne la géographie."], a: 0,
          ex: "Le texte dit « want onze leraar vertelt altijd interessante verhalen over andere landen ». « Want » (car) annonce toujours la raison : c'est là qu'il faut chercher." },
        { t: "vf", ctx: EMAIL, q: "Sanne joue au tennis deux fois par semaine.", a: true,
          ex: "Vrai : « elke dinsdag en donderdag » — chaque mardi et jeudi, donc deux fois par semaine." },
        { t: "qcm", ctx: EMAIL, q: "Quelle grande nouvelle Sanne annonce-t-elle à Margaux ?",
          c: ["Sa classe vient à Bruxelles pendant trois jours le mois prochain.", "Elle part vivre à Bruxelles avec sa famille.", "Son petit frère va entrer à l'école de Margaux.", "Elle a gagné un voyage de trois jours à Anvers."], a: 0,
          ex: "« Volgende maand komt mijn klas drie dagen naar Brussel! » En néerlandais, le présent (komt) sert souvent à exprimer un projet futur déjà organisé, surtout avec une indication de temps comme « volgende maand »." },
        // --- Affiche ---
        { t: "qcm", ctx: POSTER, q: "À quelle heure les coureurs doivent-ils arriver au parc ?",
          c: ["9 h 30", "10 h", "10 h 30", "9 h"], a: 0,
          ex: "La course commence à 10 uur et il faut arriver « 30 minuten voor de start », donc à 9 h 30." },
        { t: "qcm", ctx: POSTER, q: "Margaux a 13 ans et veut courir déguisée en panda. Combien paie-t-elle pour s'inscrire ?",
          c: ["Rien du tout", "3 €", "5 €", "8 €"], a: 0,
          ex: "« GRATIS voor lopers in verkleedkledij! » : les coureurs déguisés (verkleedkledij = déguisement) ne paient rien, quel que soit leur âge." },
        { t: "vf", ctx: POSTER, q: "L'argent récolté sert à acheter les médailles des coureurs.", a: false,
          ex: "Faux : « Alle geld gaat naar het Dierenasiel Zonnehof », un refuge pour animaux. Les médailles et l'eau sont gratuites, mais l'argent va au refuge." },
        // --- Menu ---
        { t: "qcm", ctx: MENU, q: "Margaux arrive au café à midi et veut des pannenkoeken (crêpes). Que va-t-il se passer ?",
          c: ["Elle ne peut pas en commander : le petit-déjeuner est servi jusqu'à 11 h.", "Elle paie 5 € pour ses crêpes.", "Elle reçoit 10 % de réduction sur ses crêpes.", "Elle doit revenir le dimanche matin."], a: 0,
          ex: "« ONTBIJT (tot 11 uur) » : tot = jusqu'à. À midi, le petit-déjeuner (ontbijt) n'est plus servi, et les crêpes en font partie." },
        { t: "qcm", ctx: MENU, q: "Un adulte commande une soupe à la tomate et un chocolat chaud. Combien paie-t-il ?",
          c: ["7,50 €", "6,50 €", "8,00 €", "7,00 €"], a: 0,
          ex: "Tomatensoep = 4,50 € et warme chocolademelk = 3,00 € : 4,50 + 3,00 = 7,50 €. Un adulte n'a pas de carte scolaire, donc pas de réduction." },
        { t: "vf", ctx: MENU, q: "On peut prendre son petit-déjeuner à De Blauwe Theepot le dimanche matin.", a: false,
          ex: "Faux : « Gesloten op zondag » — le café est fermé le dimanche. Il est ouvert du lundi au samedi." },
        // --- Réseau social ---
        { t: "qcm", ctx: POST, q: "Comment Lily se sent-elle quand elle écrit ce message ?",
          c: ["Très fière et un peu surprise", "Déçue et fatiguée", "Inquiète pour son concours", "En colère contre son professeur"], a: 0,
          ex: "« Ik kan het niet geloven! » (je n'en reviens pas) montre la surprise, et elle annonce son premier prix : elle est fière." },
        { t: "qcm", ctx: POST, q: "Combien de temps Lily a-t-elle travaillé sur son tableau ?",
          c: ["Trois semaines", "Trois jours", "Deux heures", "Un mois"], a: 0,
          ex: "« Ik heb er drie weken lang elke avond aan gewerkt. » « 2 uur geleden » concerne la publication du message, pas le temps de travail sur le tableau." },
        { t: "vf", ctx: POST, q: "On peut voir le tableau de Lily dans la vitrine de la bibliothèque jusqu'à fin mai.", a: true,
          ex: "Vrai : « Het schilderij hangt tot eind mei in de etalage van de stadsbibliotheek. »" },
        // --- Article ---
        { t: "qcm", ctx: ARTICLE, q: "Quelle est l'idée principale de cet article ?",
          c: ["Un adolescent aide à sauver un petit garçon en difficulté dans la mer.", "Un chien sauve un enfant sur une plage d'Ostende.", "Des sauveteurs donnent un cours de natation à l'école.", "Une famille organise un dîner spécial à la plage."], a: 0,
          ex: "Le titre « TIENER REDT DE DAG » et tout le texte racontent comment Tom, 14 ans, aide un enfant qui ne pouvait pas revenir vers la plage. Le chien et le dîner sont des détails." },
        { t: "qcm", ctx: ARTICLE, q: "Comment Tom savait-il ce qu'il fallait faire ?",
          c: ["Il avait suivi un cours de premiers secours à l'école.", "Son père est sauveteur.", "Il l'avait vu dans un film.", "Les sauveteurs le lui ont expliqué au téléphone."], a: 0,
          ex: "« Ik heb vorig jaar op school geleerd wat ik moest doen tijdens een cursus eerste hulp. » Eerste hulp = premiers secours." },
        { t: "vf", ctx: ARTICLE, q: "Tom a nagé jusqu'au petit garçon pour le ramener sur la plage.", a: false,
          ex: "Faux : Tom a appelé les sauveteurs puis a lancé une bouée (reddingsboei) au garçon. Il n'est jamais entré dans l'eau." },
        // --- Règlement ---
        { t: "qcm", ctx: RULES, q: "Tu veux te connecter au wifi. Où dois-tu aller ?",
          c: ["Dans la lounge", "Dans ta chambre", "Dans la salle à manger", "À la cuisine"], a: 0,
          ex: "« Gratis wifi, enkel in de lounge. » Enkel = seulement. Dans les autres pièces, il n'y a pas de wifi." },
        { t: "vf", ctx: RULES, q: "À 20 h, tu peux manger un paquet de chips dans ta chambre.", a: false,
          ex: "Faux : « Geen eten in de slaapkamers. » La nourriture est interdite dans les chambres ; tu peux utiliser la cuisine jusqu'à 21 h." },
        { t: "qcm", ctx: RULES, q: "Tu as oublié ta serviette de bain. Que peux-tu faire ?",
          c: ["En louer une à la réception pour 1,50 €.", "En demander une gratuite dans la lounge.", "En acheter une dans la cuisine.", "Rien : les serviettes sont interdites."], a: 0,
          ex: "« Handdoeken kun je huren aan de receptie (1,50 €). » Huren = louer. Handdoek = serviette de bain." }
      ]
    },
    // =====================================================
    {
      id: "listening",
      name: "Luisteren — écouter",
      desc: "Écoute des annonces, messages, dialogues et bulletins météo et repère l'information utile.",
      items: [
        { t: "qcm", audio: "Let op, reizigers. De trein van tien uur vijftien naar Gent heeft twintig minuten vertraging. Hij vertrekt nu van spoor vier. Excuseer voor het ongemak.",
          q: "Écoute l'annonce en gare. À quelle heure le train pour Gand va-t-il partir ?",
          c: ["10 h 35", "10 h 15", "10 h 20", "10 h 50"], a: 0,
          ex: "Le train de « tien uur vijftien » (10 h 15) a « twintig minuten vertraging » (20 minutes de retard) : 10 h 15 + 20 min = 10 h 35." },
        { t: "qcm", audio: "Dit is de laatste oproep voor vlucht KL twee zes drie naar Dublin. Passagiers moeten onmiddellijk naar gate twaalf gaan. De gate sluit binnen vijf minuten.",
          q: "Écoute l'annonce à l'aéroport. Vers quelle porte les passagers pour Dublin doivent-ils se rendre ?",
          c: ["La porte 12", "La porte 2", "La porte 20", "La porte 5"], a: 0,
          ex: "« Gate twaalf » = porte 12. « Vijf minuten » est le temps avant la fermeture de la porte, pas le numéro de la porte." },
        { t: "qcm", audio: "Hoi Emma, met Sophie. Sorry, maar ik kan vanavond niet naar de bioscoop komen, want ik ben verkouden. Kunnen we zaterdagnamiddag gaan in plaats daarvan? Bel me terug. Doei!",
          q: "Écoute le message vocal. Pourquoi Sophie ne peut-elle pas aller au cinéma ce soir ?",
          c: ["Elle est enrhumée.", "Elle n'a plus d'argent.", "Elle doit travailler le samedi.", "Le cinéma est fermé."], a: 0,
          ex: "« Ik ben verkouden » = je suis enrhumée. Sophie propose d'y aller « zaterdagnamiddag » (samedi après-midi) à la place." },
        { t: "qcm", audio: "Hallo, dit is de praktijk van dokter Groen. Je afspraak is verplaatst van maandag naar woensdag om half vijf. Bel ons als dit tijdstip niet past.",
          q: "Écoute le message du cabinet médical. Quand a lieu le nouveau rendez-vous ?",
          c: ["Mercredi à 16 h 30", "Lundi à 16 h 30", "Mercredi à 15 h 30", "Mercredi à 16 h 15"], a: 0,
          ex: "Le rendez-vous passe « van maandag naar woensdag » (du lundi au mercredi). Attention : « half vijf » = 4 h 30 (la moitié AVANT 5 h), donc 16 h 30, et non 3 h 30 !" },
        { t: "qcm", audio: A_RESTAURANT,
          q: "Écoute la commande au restaurant. Qu'est-ce qu'Anna commande ?",
          c: ["Une salade de poulet et un verre d'eau", "Du poisson-frites et un jus de pomme", "Une salade de poulet et un jus de pomme", "Du poisson-frites et un verre d'eau"], a: 0,
          ex: "Anna dit « ik neem de kipsalade » puis « Gewoon een glas water ». C'est Ben qui prend le poisson-frites et le jus de pomme (appelsap)." },
        { t: "qcm", audio: A_RESTAURANT,
          q: "Écoute encore la commande au restaurant. Que boit Ben ?",
          c: ["Un jus de pomme", "Un verre d'eau", "Un jus d'orange", "Un thé"], a: 0,
          ex: "Ben dit « Voor mij de vis met friet en een appelsap ». Appelsap = jus de pomme." },
        { t: "qcm", audio: "Goedemorgen! Hier is het weerbericht voor vandaag. 's Morgens is het bewolkt, met wat regen in het noorden. In de namiddag komt de zon tevoorschijn en wordt het warm, ongeveer tweeëntwintig graden.",
          q: "Écoute la météo. Quel temps fera-t-il l'après-midi ?",
          c: ["Du soleil et environ 22 degrés", "Des nuages et de la pluie au nord", "Du vent et environ 12 degrés", "De la neige toute la journée"], a: 0,
          ex: "« In de namiddag komt de zon tevoorschijn en wordt het warm, ongeveer tweeëntwintig graden. » Les nuages et la pluie, c'est pour le matin ('s morgens)." },
        { t: "vf", audio: "En nu het weerbericht voor het weekend. Op zaterdag is het erg winderig en koud, maar acht graden. Neem je paraplu mee op zondag, want het gaat de hele dag regenen.",
          q: "Écoute la météo du week-end. Vrai ou faux : dimanche, il fera beau toute la journée.",
          a: false,
          ex: "Faux : « het gaat de hele dag regenen » — il pleuvra toute la journée (de hele dag). Samedi, il y aura du vent et du froid, seulement 8 degrés." },
        { t: "qcm", audio: "Toerist: Excuseer, waar is het museum, alstublieft? Lucy: Ga rechtdoor, neem dan de tweede straat links. Het museum is naast de bank, tegenover het park.",
          q: "Écoute le dialogue. Où se trouve le musée ?",
          c: ["À côté de la banque, en face du parc", "En face de la banque, à côté du parc", "Derrière le parc, à droite", "Dans la première rue à gauche"], a: 0,
          ex: "« Naast » = à côté de ; « tegenover » = en face de. Le chemin : tout droit (rechtdoor), puis la deuxième rue à gauche (de tweede straat links)." },
        { t: "qcm", audio: A_SHOP,
          q: "Écoute le dialogue dans le magasin. Combien coûte le T-shirt bleu ?",
          c: ["12 €", "20 €", "2 €", "22 €"], a: 0,
          ex: "« Het kost twaalf euro » = 12 euros." },
        { t: "qcm", audio: A_SHOP,
          q: "Écoute encore le dialogue dans le magasin. Quel est le problème de Mark ?",
          c: ["Sa taille (M) n'est pas disponible.", "Le T-shirt est trop cher.", "Il n'y a plus de T-shirts bleus.", "Le magasin va fermer."], a: 0,
          ex: "Mark demande « Hebt u het in maat medium? » et le vendeur répond « we hebben enkel small en large » : seulement S et L, pas de M." },
        { t: "qcm", audio: "Goedemiddag, klanten. Vandaag zijn alle groenten en fruit aan halve prijs. Vergeet niet, de winkel sluit vandaag vroeger, om vijf uur.",
          q: "Écoute l'annonce du supermarché. À quelle heure le magasin ferme-t-il aujourd'hui ?",
          c: ["À 17 h", "À 15 h", "À 19 h", "À 12 h"], a: 0,
          ex: "« De winkel sluit vandaag vroeger, om vijf uur » : vijf uur l'après-midi = 17 h. « Halve prijs » signifie que les fruits et légumes sont à moitié prix." },
        { t: "qcm", audio: "Jake: Wat heb je vorig weekend gedaan, Mia? Mia: Ik ben met mijn nichtjes naar zee geweest. We hebben in zee gezwommen en een picknick gehad. Jake: Boffer! Ik ben thuisgebleven en heb gestudeerd voor mijn wiskundetoets.",
          q: "Écoute le dialogue. Qu'a fait Jake le week-end dernier ?",
          c: ["Il est resté chez lui pour étudier ses maths.", "Il est allé à la mer avec ses cousines.", "Il a fait un pique-nique.", "Il a nagé à la piscine."], a: 0,
          ex: "Jake dit « Ik ben thuisgebleven en heb gestudeerd voor mijn wiskundetoets ». C'est Mia qui est allée à la mer." },
        { t: "vf", audio: "Hallo allemaal, met mevrouw Claes. De schooluitstap van morgen naar de zoo is geannuleerd wegens de storm. De uitstap is nu op vrijdag. Breng een lunchpakket en een regenjas mee.",
          q: "Écoute le message de l'école. Vrai ou faux : l'excursion au zoo est reportée à vendredi.",
          a: true,
          ex: "Vrai : l'excursion de demain est annulée (geannuleerd) à cause de la tempête, et « De uitstap is nu op vrijdag. » Il faut prendre un lunchpakket et un imperméable." },
        { t: "qcm", audio: "Olivia: Hoi Sam, wil je zaterdag naar mijn verjaardagsfeestje komen? Sam: Heel graag! Hoe laat begint het? Olivia: Om drie uur, bij mij thuis. Sam: Top, tot dan!",
          q: "Écoute le dialogue. Comment Sam répond-il à l'invitation d'Olivia ?",
          c: ["Il accepte avec plaisir.", "Il refuse car il est occupé.", "Il hésite et rappellera plus tard.", "Il propose un autre jour."], a: 0,
          ex: "« Heel graag! » = avec grand plaisir : c'est une façon enthousiaste d'accepter une invitation. La fête commence à 15 h (drie uur)." }
      ]
    },
    // =====================================================
    {
      id: "grammar",
      name: "Grammatica",
      desc: "Temps des verbes, ordre des mots, verbes à particule séparable, modaux, comparatifs, négation, possessifs.",
      items: [
        { t: "qcm", q: "Complète : Zij ___ elke dag naar school.", c: ["gaat", "ga", "gaan", "gaat te"], a: 0,
          ex: "« Elke dag » = habitude → présent. À la 3e personne du singulier (hij/zij), le verbe « gaan » devient « gaat »." },
        { t: "qcm", q: "Complète : Kijk! De kinderen ___ in de tuin.", c: ["spelen", "speelt", "speel", "gespeeld"], a: 0,
          ex: "« De kinderen » = zij (pluriel) → on utilise la forme infinitive du présent : spelen." },
        { t: "txt", q: "Mets le verbe au prétérit : Gisteren ___ (gaan) ik naar de bioscoop.", a: ["ging"],
          ex: "« Gaan » est irrégulier : ging – gingen ; gegaan. « Gisteren » (hier) indique un moment terminé du passé → prétérit." },
        { t: "txt", q: "Mets le verbe au prétérit : We ___ (bezoeken) onze grootouders vorige zondag.", a: ["bezochten"],
          ex: "« Bezoeken » se conjugue comme « zoeken » (irrégulier) : bezocht – bezochten ; bezocht. « We » (pluriel) → bezochten." },
        { t: "qcm", q: "Complète (négation d'un verbe) : Ik heb de film gisteren gezien. → Ik heb de film gisteren ___ gezien.", c: ["niet", "geen", "nooit", "geeneen"], a: 0,
          ex: "Pour nier un verbe (ou une phrase entière), on utilise « niet ». « Geen » sert à nier un nom (geen auto)." },
        { t: "qcm", q: "Complète : ___ je ooit in Amsterdam ___ ?", c: ["Ben … geweest", "Heb … gegaan", "Ben … gaan", "Heb … geweest"], a: 0,
          ex: "« Ooit » (déjà, dans ta vie) s'emploie avec le passé composé (voltooid tegenwoordige tijd). Le participe passé de « zijn » est « geweest », et il se construit avec l'auxiliaire « zijn » : Ben je ooit in Amsterdam geweest?" },
        { t: "qcm", q: "Complète : Ik heb net mijn huiswerk ___, dus ik mag nu buiten spelen.", c: ["gemaakt", "maken", "maak", "gemaakte"], a: 0,
          ex: "Passé composé = hebben + participe passé. « Maken » (régulier) → gemaakt." },
        { t: "qcm", q: "Complète : Kijk naar die zwarte wolken! Het ___ regenen.", c: ["gaat", "ga", "ben", "heeft"], a: 0,
          ex: "« Gaan » + infinitif sert à exprimer une prédiction basée sur ce qu'on voit (les nuages noirs) : het gaat regenen." },
        { t: "qcm", q: "Complète (verbe à particule séparable « opnemen ») : « De telefoon gaat! » — « Oké, ik ___ hem op. »", c: ["neem … op", "opneem", "neemop", "op neem"], a: 0,
          ex: "Avec un verbe à particule séparable dans la proposition principale, le verbe conjugué reste en 2e position et la particule (op) va à la fin : ik neem hem op." },
        { t: "txt", q: "Écris le comparatif : Mijn broer is ___ (groot) dan ik.", a: ["groter"],
          ex: "Adjectif court : on ajoute -er, puis « dan » (que). groot → groter dan." },
        { t: "qcm", q: "Complète : Gent is ___ dan Brussel. (klein)", c: ["kleiner", "meer klein", "kleinst", "kleinner"], a: 0,
          ex: "Adjectif court : on ajoute -er → klein → kleiner. « Dan » (que) demande le comparatif, pas le superlatif." },
        { t: "qcm", q: "Complète : Dit is ___ film die ik ooit heb gezien!", c: ["de beste", "de goedste", "de betere", "de meest goede"], a: 0,
          ex: "« Goed » est irrégulier : goed – beter – best. Le superlatif prend toujours « de » : de beste." },
        { t: "qcm", q: "Complète : Je ___ een helm dragen als je op de motor rijdt. Het is de wet.", c: ["moet", "kan", "mag niet", "hoeft niet"], a: 0,
          ex: "« Moeten » exprime une obligation (ici, c'est la loi). « Mogen … niet » exprime une interdiction et « hoeven … niet », l'absence d'obligation." },
        { t: "qcm", q: "Complète : Je ziet er moe uit. Je ___ vroeger naar bed gaan.", c: ["moet", "mag", "kan", "hoeft"], a: 0,
          ex: "« Moeten » sert ici à donner un conseil appuyé : je moet vroeger naar bed gaan = tu devrais aller te coucher plus tôt." },
        { t: "qcm", q: "Complète (négation d'un nom) : Er is ___ melk meer in de koelkast.", c: ["geen", "niet", "geeneen", "nooit"], a: 0,
          ex: "« Geen » nie un nom sans article (melk). « Niet » sert plutôt à nier un verbe, un adjectif ou un nom précédé d'un article." },
        { t: "qcm", q: "Complète : ___ boeken heb je deze zomer gelezen?", c: ["Hoeveel", "Hoeveel veel", "Veel", "Hoe"], a: 0,
          ex: "« Hoeveel » (combien) s'emploie devant un nom dénombrable au pluriel : hoeveel boeken." },
        { t: "qcm", q: "Complète : Tom en ik zijn beste vrienden. ___ spelen elke zaterdag samen tennis.", c: ["Wij", "Ons", "Zij", "Onze"], a: 0,
          ex: "« Tom en ik » = nous → pronom sujet « wij ». « Ons » est un pronom complément/possessif, « onze » un adjectif possessif." },
        { t: "txt", q: "Conjugue au présent : ___ (houden van) je zus van pizza?", a: ["Houdt"],
          ex: "« Houden » : le radical se termine déjà par -d, on ajoute simplement -t à la 3e personne du singulier : houd + t = houdt." },
        { t: "qcm", q: "Complète : ___ ben je op vakantie geweest? — In Spanje.", c: ["Waar", "Wanneer", "Wie", "Hoe laat"], a: 0,
          ex: "La réponse « In Spanje » est un lieu → waar (où). Wanneer = quand, wie = qui, hoe laat = à quelle heure." },
        { t: "qcm", q: "Complète : Er ___ veel mensen op het feest gisteravond.", c: ["waren", "was", "is", "zijn"], a: 0,
          ex: "« Er zijn/waren » au passé : er was (singulier) / er waren (pluriel). « Veel mensen » est pluriel → er waren." },
        { t: "qcm", q: "Complète (le vélo de mon frère) : Dit is ___ fiets.", c: ["mijn broers", "mijn broer", "broers mijn", "de fiets van broer"], a: 0,
          ex: "Pour dire « le … de quelqu'un », on ajoute -s au possesseur, sans apostrophe en néerlandais : mijn broers fiets = le vélo de mon frère." },
        { t: "txt", q: "Mets à la forme négative (négation d'un nom) : Hij speelt piano. → Hij speelt ___ piano.", a: ["geen"],
          ex: "« Piano » n'a pas d'article ici : on le nie avec « geen ». Hij speelt geen piano = il ne joue pas de piano." }
      ]
    },
    // =====================================================
    {
      id: "vocab",
      name: "Woordenschat & functies",
      desc: "Vocabulaire A1-A2 par thèmes et fonctions langagières : se présenter, demander son chemin, proposer, s'excuser, commander…",
      items: [
        { t: "qcm", q: "Que réponds-tu si quelqu'un te demande « Hoe gaat het? » ?", c: ["Goed, dank je. En met jou?", "Ik ben dertien.", "Ik heet Margaux.", "Ja, dat klopt."], a: 0,
          ex: "« Hoe gaat het? » = comment vas-tu ? On répond par exemple « Goed, dank je » (bien, merci). « Ik ben dertien » répond à « Hoe oud ben je? »." },
        { t: "qcm", q: "Pour te présenter (ton âge), quelle phrase est correcte ?", c: ["Ik ben dertien jaar oud.", "Ik heb dertien jaar.", "Ik heb dertien jaar oud.", "Ik ben dertien jaren."], a: 0,
          ex: "En néerlandais, l'âge s'exprime avec « zijn » : ik ben (…) jaar (oud). Ne traduis pas « j'ai » par « ik heb » pour l'âge." },
        { t: "qcm", q: "Un touriste te demande : « Excuseer, hoe kom ik bij het station? » Que réponds-tu ?", c: ["Ga rechtdoor en sla rechtsaf bij het verkeerslicht.", "Het is tien uur.", "Ik ga met de trein.", "Ja, dat kan."], a: 0,
          ex: "Il demande son chemin : on répond avec des indications à l'impératif. Rechtdoor = tout droit ; rechtsaf slaan = tourner à droite ; verkeerslicht = feu de circulation." },
        { t: "qcm", q: "Tu veux proposer à ton ami d'aller au parc. Que dis-tu ?", c: ["Zullen we naar het park gaan?", "Laten we te gaan naar het park!", "Ik ging naar het park.", "Ga je naar het park?"], a: 0,
          ex: "Pour faire une suggestion : « Zullen we … ? » = et si on … ? / on pourrait … ?" },
        { t: "qcm", q: "Tu as bousculé quelqu'un dans le bus. Que dis-tu ?", c: ["Oh, sorry!", "Graag gedaan.", "Proost!", "Gezondheid!"], a: 0,
          ex: "Pour s'excuser : « Sorry! » ou « Excuseer! ». « Graag gedaan » répond à un merci, « Gezondheid! » se dit quand quelqu'un éternue." },
        { t: "qcm", q: "Au restaurant, quelle phrase utilises-tu pour commander poliment ?", c: ["Ik neem graag een kaassandwich.", "Ik hou van een kaassandwich.", "Wil je een kaassandwich?", "Ik neem graag naar een kaassandwich."], a: 0,
          ex: "« Ik neem graag … » (je prendrai volontiers) est la formule polie pour commander. « Ik hou van » veut dire « j'aime » (en général)." },
        { t: "qcm", q: "Comment demandes-tu à ton ami son avis sur un film ?", c: ["Wat vind je van de film?", "Hoe heet de film?", "Waar denk je de film?", "Wat denkt de film?"], a: 0,
          ex: "Pour demander une opinion : « Wat vind je van … ? » Pour répondre : ik vind het geweldig / volgens mij is het saai." },
        { t: "qcm", q: "Ton ami te dit « Ik ben geslaagd voor mijn examen! » Que réponds-tu ?", c: ["Proficiat!", "Gezondheid!", "Beterschap!", "Wat jammer."], a: 0,
          ex: "Il a réussi son examen : on le félicite avec « Proficiat! » (félicitations). « Beterschap! » se dit à quelqu'un de malade." },
        { t: "qcm", q: "Trouve l'intrus : tante – neef – nicht – keuken", c: ["keuken", "tante", "neef", "nicht"], a: 0,
          ex: "Tante, neef (neveu/cousin) et nicht (nièce/cousine) sont des membres de la famille. Keuken = cuisine, c'est une pièce de la maison." },
        { t: "qcm", q: "Trouve l'intrus : zonnig – winderig – bewolkt – hongerig", c: ["hongerig", "zonnig", "winderig", "bewolkt"], a: 0,
          ex: "Zonnig (ensoleillé), winderig (venteux) et bewolkt (nuageux) décrivent la météo. Hongerig = avoir faim." },
        { t: "qcm", q: "Trouve l'intrus : broek – rok – trui – lepel", c: ["lepel", "broek", "rok", "trui"], a: 0,
          ex: "Broek (pantalon), rok (jupe) et trui (pull) sont des vêtements. Lepel = cuillère." },
        { t: "qcm", q: "Que signifie « Ik heb hoofdpijn » ?", c: ["J'ai mal à la tête.", "J'ai mal au ventre.", "J'ai de la fièvre.", "J'ai mal aux dents."], a: 0,
          ex: "Hoofd = tête, pijn = douleur → hoofdpijn = mal de tête. De même : buikpijn (mal au ventre), tandpijn (mal aux dents). Fièvre = koorts." },
        { t: "qcm", q: "Que veut dire « Wat is er? » ?", c: ["Qu'est-ce qui ne va pas ?", "Quelle est ta matière préférée ?", "De quoi est-ce fait ?", "Quelle heure est-il ?"], a: 0,
          ex: "« Wat is er? » (ou « Wat scheelt er? ») = qu'est-ce qui ne va pas ? Une matière scolaire se dit « een vak »." },
        { t: "qcm", q: "Que signifie « een bibliotheek » ?", c: ["une bibliothèque", "une librairie", "une liberté", "un libraire"], a: 0,
          ex: "Een bibliotheek = une bibliothèque (on y emprunte des livres). Une librairie (on y achète des livres) = een boekhandel." },
        { t: "txt", q: "Traduis en néerlandais : le petit-déjeuner", a: ["ontbijt", "het ontbijt"],
          ex: "Ontbijt = petit-déjeuner, middageten/lunch = dîner (repas de midi en Belgique), avondeten = souper." },
        { t: "txt", q: "À la gare, tu veux un billet aller-retour. Complète : Een ___ , alstublieft.", a: ["retourtje", "retour", "een retour"],
          ex: "Een retourtje (ou een retour) = un aller-retour ; een enkeltje = un aller simple." },
        { t: "qcm", q: "Quelle matière étudie-t-on avec des cartes, des pays et des rivières ?", c: ["Aardrijkskunde", "Geschiedenis", "Scheikunde", "Lichamelijke opvoeding"], a: 0,
          ex: "Aardrijkskunde = géographie. Geschiedenis = histoire, scheikunde = chimie, lichamelijke opvoeding (LO) = éducation physique." },
        { t: "qcm", q: "À l'hôtel, complète : Ik wil graag een ___ boeken voor twee nachten.", c: ["kamer", "keuken", "stuk", "zaal"], a: 0,
          ex: "Une chambre d'hôtel = een kamer (een eenpersoonskamer, een tweepersoonskamer). « Stuk » veut dire un morceau et « zaal » une salle." },
        { t: "vf", q: "En néerlandais, le mot « frieten » désigne des frites.", a: true,
          ex: "Vrai : en Belgique, frieten = frites. En néerlandais des Pays-Bas, on dit plutôt « patat » ou « friet »." }
      ]
    }
  ]
};
