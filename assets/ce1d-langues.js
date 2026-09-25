/* =========================================================
   Wesh Words — CE1D : banque LANGUES MODERNES (anglais, niveau A2)
   Questions et documents ORIGINAUX, rédigés dans l'esprit des épreuves externes CE1D
   (consignes en français, documents en anglais britannique).
   ========================================================= */

// ---------- Documents de lecture ----------
const EMAIL = `From: jack.turner@mailbox.co.uk
To: Margaux
Subject: Hello from York!

Hi Margaux,
Thanks for your last email! I'm Jack and I live in York, in the north of England, with my mum, my stepdad and my little sister, Ruby. She's six and she's very noisy! I go to Millfield School. My favourite subject is history because our teacher tells us brilliant stories about the Romans. After school, I play football on Tuesdays and Thursdays. At the weekend, I usually help my grandad in his bakery.
Big news: next month, my class is coming to Brussels for three days! Can we meet? What's your favourite place in the city?
Write soon,
Jack`;

const POSTER = `SUMMER FUN RUN — RIVERSIDE PARK
Saturday 14th June
Start: 10 a.m. (please arrive 30 minutes before the start)
Distances: 2 km (under 12) / 5 km (12 and over)
Entry: £5 for adults, £3 for children
FREE for runners in fancy dress!
All the money goes to the Greenfield Animal Shelter.
Free water and a medal for every runner.
Register at the town library before 10th June.
Dogs are welcome on a lead.`;

const MENU = `THE BLUE TEAPOT CAFÉ
Open Monday to Saturday, 8 a.m. – 6 p.m. Closed on Sundays.

BREAKFAST (until 11 a.m.)
Full English breakfast ........ £7.50
Pancakes with fruit ........... £5.00

LUNCH
Tomato soup with bread ........ £4.50
Cheese and ham sandwich ....... £4.00
Veggie burger and chips ....... £8.00

DRINKS
Tea / Coffee .................. £2.00
Fresh orange juice ............ £2.50
Hot chocolate ................. £3.00

Student offer: 10% off with your school card (lunch only).`;

const POST = `lily_draws — posted 2 hours ago
I can't believe it! Yesterday my painting of the old lighthouse won first prize in the town art competition. I worked on it every evening for three weeks. The prize is a set of professional paints and a day at an art workshop in London. Thank you to my art teacher, Mr Patel, who always says "Don't give up!". The painting will be in the window of the town library until the end of May. Go and see it!
42 likes · 9 comments`;

const ARTICLE = `TEEN SAVES THE DAY
Last Sunday, 14-year-old Tom Baker was walking his dog on Brighton beach when he heard someone shouting. A little boy was in the water, too far from the beach, and he couldn't swim back. Tom didn't wait. He called the lifeguards on his phone, then he took a lifebuoy from its post and threw it to the boy. The boy caught it and held it until the lifeguards arrived two minutes later.
"I learnt what to do in a first-aid course at school last year," said Tom. The boy's parents want to thank him with a special dinner.`;

const RULES = `SEAVIEW YOUTH HOSTEL — HOUSE RULES
- Check-in: from 3 p.m. Check-out: before 10 a.m.
- Breakfast is served in the dining room from 7.30 to 9 a.m.
- Please be quiet in the bedrooms after 10.30 p.m.
- The front door closes at midnight. Late? Ring the bell and show your room card.
- No food in the bedrooms. You can use the guest kitchen until 9 p.m.
- Towels can be rented at reception (£1.50).
- Free Wi-Fi in the lounge only.
Enjoy your stay!`;

// ---------- Audios d'écoute ----------
const A_RESTAURANT = "Waiter: Are you ready to order? Anna: Yes, I'd like the chicken salad, please. Waiter: And to drink? Anna: Just a glass of water, please. Ben: For me, the fish and chips and an apple juice, please.";
const A_SHOP = "Shop assistant: Can I help you? Mark: Yes, how much is this blue T-shirt? Shop assistant: It's twelve pounds. Mark: Have you got it in medium? Shop assistant: Sorry, we've only got small and large.";

export default {
  id: "langues",
  name: "Anglais (langues modernes)",
  icon: "🇬🇧",
  voiceLang: "en-GB",
  themes: [
    // =====================================================
    {
      id: "reading",
      name: "Reading — lire",
      desc: "Comprendre de courts documents authentiques : e-mail, affiche, menu, réseau social, article, règlement.",
      items: [
        // --- E-mail ---
        { t: "qcm", ctx: EMAIL, q: "Pourquoi l'histoire est-elle la matière préférée de Jack ?",
          c: ["Parce que son professeur raconte des histoires passionnantes sur les Romains.", "Parce qu'il visite souvent des musées romains avec sa classe.", "Parce que c'est la matière où il a les meilleures notes.", "Parce que son grand-père lui parle des Romains."], a: 0,
          ex: "Le texte dit « because our teacher tells us brilliant stories about the Romans ». Le mot « because » annonce toujours la raison : c'est là qu'il faut chercher." },
        { t: "vf", ctx: EMAIL, q: "Jack joue au football deux fois par semaine.", a: true,
          ex: "Vrai : « I play football on Tuesdays and Thursdays » — le mardi et le jeudi, donc deux fois par semaine." },
        { t: "qcm", ctx: EMAIL, q: "Quelle grande nouvelle Jack annonce-t-il à Margaux ?",
          c: ["Sa classe vient à Bruxelles pendant trois jours le mois prochain.", "Il part vivre à Bruxelles avec sa famille.", "Sa petite sœur va entrer à l'école de Margaux.", "Il a gagné un voyage de trois jours à York."], a: 0,
          ex: "« Next month, my class is coming to Brussels for three days! » Le present continuous (is coming) est souvent utilisé pour un projet futur déjà organisé." },
        // --- Affiche ---
        { t: "qcm", ctx: POSTER, q: "À quelle heure les coureurs doivent-ils arriver au parc ?",
          c: ["9 h 30", "10 h", "10 h 30", "9 h"], a: 0,
          ex: "La course commence à 10 a.m. et il faut arriver « 30 minutes before the start », donc à 9 h 30. Attention : a.m. = le matin, p.m. = l'après-midi/le soir." },
        { t: "qcm", ctx: POSTER, q: "Margaux a 13 ans et veut courir déguisée en panda. Combien paie-t-elle pour s'inscrire ?",
          c: ["Rien du tout", "3 £", "5 £", "8 £"], a: 0,
          ex: "« FREE for runners in fancy dress! » : les coureurs déguisés (fancy dress = déguisement) ne paient rien, quel que soit leur âge." },
        { t: "vf", ctx: POSTER, q: "L'argent récolté sert à acheter les médailles des coureurs.", a: false,
          ex: "Faux : « All the money goes to the Greenfield Animal Shelter », un refuge pour animaux. Les médailles et l'eau sont offertes, mais l'argent va au refuge." },
        // --- Menu ---
        { t: "qcm", ctx: MENU, q: "Margaux arrive au café à midi et veut des pancakes. Que va-t-il se passer ?",
          c: ["Elle ne peut pas en commander : le petit-déjeuner est servi jusqu'à 11 h.", "Elle paie 5 £ pour ses pancakes.", "Elle reçoit 10 % de réduction sur ses pancakes.", "Elle doit revenir le dimanche matin."], a: 0,
          ex: "« BREAKFAST (until 11 a.m.) » : until = jusqu'à. À midi, le petit-déjeuner n'est plus servi, et les pancakes font partie du breakfast." },
        { t: "qcm", ctx: MENU, q: "Un adulte commande une soupe à la tomate et un chocolat chaud. Combien paie-t-il ?",
          c: ["7,50 £", "6,50 £", "8,00 £", "7,00 £"], a: 0,
          ex: "Tomato soup = 4,50 £ et hot chocolate = 3,00 £ : 4,50 + 3,00 = 7,50 £. Un adulte n'a pas de carte scolaire, donc pas de réduction." },
        { t: "vf", ctx: MENU, q: "On peut prendre son petit-déjeuner au Blue Teapot le dimanche matin.", a: false,
          ex: "Faux : « Closed on Sundays » — le café est fermé le dimanche. Il est ouvert du lundi au samedi." },
        // --- Réseau social ---
        { t: "qcm", ctx: POST, q: "Comment Lily se sent-elle quand elle écrit ce message ?",
          c: ["Très fière et un peu surprise", "Déçue et fatiguée", "Inquiète pour son concours", "En colère contre son professeur"], a: 0,
          ex: "« I can't believe it! » (je n'en reviens pas) montre la surprise, et elle annonce son premier prix : elle est fière. On déduit le sentiment à partir des indices du texte." },
        { t: "qcm", ctx: POST, q: "Combien de temps Lily a-t-elle travaillé sur son tableau ?",
          c: ["Trois semaines", "Trois jours", "Deux heures", "Un mois"], a: 0,
          ex: "« I worked on it every evening for three weeks. » « For » + durée indique combien de temps une action a duré. « 2 hours ago » concerne la publication du message, pas le tableau." },
        { t: "vf", ctx: POST, q: "On peut voir le tableau de Lily dans la vitrine de la bibliothèque jusqu'à fin mai.", a: true,
          ex: "Vrai : « The painting will be in the window of the town library until the end of May. »" },
        // --- Article ---
        { t: "qcm", ctx: ARTICLE, q: "Quelle est l'idée principale de cet article ?",
          c: ["Un adolescent aide à sauver un petit garçon en difficulté dans la mer.", "Un chien sauve un enfant sur une plage de Brighton.", "Des maîtres-nageurs donnent un cours de natation à l'école.", "Une famille organise un dîner spécial à la plage."], a: 0,
          ex: "Le titre « TEEN SAVES THE DAY » et tout le texte racontent comment Tom, 14 ans, aide un enfant qui ne pouvait pas revenir vers la plage. Le chien et le dîner sont des détails." },
        { t: "qcm", ctx: ARTICLE, q: "Comment Tom savait-il ce qu'il fallait faire ?",
          c: ["Il avait suivi un cours de premiers secours à l'école.", "Son père est maître-nageur.", "Il l'avait vu dans un film.", "Les maîtres-nageurs le lui ont expliqué au téléphone."], a: 0,
          ex: "« I learnt what to do in a first-aid course at school last year. » First aid = premiers secours. « Learnt » est le past simple irrégulier de « learn » (anglais britannique)." },
        { t: "vf", ctx: ARTICLE, q: "Tom a nagé jusqu'au petit garçon pour le ramener sur la plage.", a: false,
          ex: "Faux : Tom a appelé les maîtres-nageurs puis a lancé une bouée (lifebuoy) au garçon. Il n'est jamais entré dans l'eau." },
        // --- Règlement ---
        { t: "qcm", ctx: RULES, q: "Tu veux te connecter au Wi-Fi. Où dois-tu aller ?",
          c: ["Dans le salon", "Dans ta chambre", "Dans la salle à manger", "À la cuisine"], a: 0,
          ex: "« Free Wi-Fi in the lounge only. » Lounge = salon, only = seulement. Dans les autres pièces, il n'y a pas de Wi-Fi." },
        { t: "vf", ctx: RULES, q: "À 20 h, tu peux manger un paquet de chips dans ta chambre.", a: false,
          ex: "Faux : « No food in the bedrooms. » La nourriture est interdite dans les chambres ; tu peux utiliser la cuisine jusqu'à 21 h (9 p.m.)." },
        { t: "qcm", ctx: RULES, q: "Tu as oublié ta serviette de bain. Que peux-tu faire ?",
          c: ["En louer une à la réception pour 1,50 £.", "En demander une gratuite dans le salon.", "En acheter une dans la cuisine.", "Rien : les serviettes sont interdites."], a: 0,
          ex: "« Towels can be rented at reception (£1.50). » To rent = louer. Towel = serviette de bain." }
      ]
    },
    // =====================================================
    {
      id: "listening",
      name: "Listening — écouter",
      desc: "Écoute des annonces, messages, dialogues et bulletins météo et repère l'information utile.",
      items: [
        { t: "qcm", audio: "Attention, please. The ten fifteen train to Manchester is delayed by twenty minutes. It will now leave from platform four. We apologise for the delay.",
          q: "Écoute l'annonce en gare. À quelle heure le train pour Manchester va-t-il partir ?",
          c: ["10 h 35", "10 h 15", "10 h 20", "10 h 50"], a: 0,
          ex: "Le train de « ten fifteen » (10 h 15) est « delayed by twenty minutes » (en retard de 20 minutes) : 10 h 15 + 20 min = 10 h 35." },
        { t: "qcm", audio: "This is the final call for flight B A two six three to Dublin. Passengers must go to gate twelve immediately. The gate will close in five minutes.",
          q: "Écoute l'annonce à l'aéroport. Vers quelle porte les passagers pour Dublin doivent-ils se rendre ?",
          c: ["La porte 12", "La porte 2", "La porte 20", "La porte 5"], a: 0,
          ex: "« Gate twelve » = porte 12. Attention à ne pas confondre twelve (12) et twenty (20). « Five minutes » est le temps avant la fermeture de la porte." },
        { t: "qcm", audio: "Hi Emma, it's Sophie. I'm sorry, but I can't come to the cinema tonight because I've got a terrible cold. Can we go on Saturday afternoon instead? Call me back. Bye!",
          q: "Écoute le message vocal. Pourquoi Sophie ne peut-elle pas aller au cinéma ce soir ?",
          c: ["Elle est enrhumée.", "Elle n'a plus d'argent.", "Elle doit travailler le samedi.", "Le cinéma est fermé."], a: 0,
          ex: "« I've got a terrible cold » = j'ai un gros rhume. Sophie propose d'y aller « on Saturday afternoon instead » (samedi après-midi à la place)." },
        { t: "qcm", audio: "Hello, this is Doctor Green's surgery. Your appointment is moved from Monday to Wednesday at half past four. Please call us if this time is not good for you.",
          q: "Écoute le message du cabinet médical. Quand a lieu le nouveau rendez-vous ?",
          c: ["Mercredi à 16 h 30", "Lundi à 16 h 30", "Mercredi à 15 h 30", "Mercredi à 16 h 15"], a: 0,
          ex: "Le rendez-vous passe « from Monday to Wednesday » (du lundi au mercredi). « Half past four » = 4 h 30, donc 16 h 30 (et non 3 h 30 !)." },
        { t: "qcm", audio: A_RESTAURANT,
          q: "Écoute la commande au restaurant. Qu'est-ce qu'Anna commande ?",
          c: ["Une salade de poulet et un verre d'eau", "Du poisson-frites et un jus de pomme", "Une salade de poulet et un jus de pomme", "Du poisson-frites et un verre d'eau"], a: 0,
          ex: "Anna dit « I'd like the chicken salad » puis « Just a glass of water ». C'est Ben qui prend le fish and chips et l'apple juice." },
        { t: "qcm", audio: A_RESTAURANT,
          q: "Écoute encore la commande au restaurant. Que boit Ben ?",
          c: ["Un jus de pomme", "Un verre d'eau", "Un jus d'orange", "Un thé"], a: 0,
          ex: "Ben dit « For me, the fish and chips and an apple juice ». « For me » introduit sa propre commande." },
        { t: "qcm", audio: "Good morning! Here is the weather for today. It will be cloudy in the morning, with some rain in the north. In the afternoon, the sun will come out and it will be warm, about twenty-two degrees.",
          q: "Écoute la météo. Quel temps fera-t-il l'après-midi ?",
          c: ["Du soleil et environ 22 degrés", "Des nuages et de la pluie au nord", "Du vent et environ 12 degrés", "De la neige toute la journée"], a: 0,
          ex: "« In the afternoon, the sun will come out and it will be warm, about twenty-two degrees. » Les nuages et la pluie, c'est pour le matin." },
        { t: "vf", audio: "And now the weather for the weekend. On Saturday, it will be very windy and cold, only eight degrees. Take your umbrella on Sunday, because it's going to rain all day.",
          q: "Écoute la météo du week-end. Vrai ou faux : dimanche, il fera beau toute la journée.",
          a: false,
          ex: "Faux : « Take your umbrella on Sunday, because it's going to rain all day. » Il pleuvra toute la journée (all day). Samedi, il y aura du vent et du froid." },
        { t: "qcm", audio: "Tourist: Excuse me, where is the museum, please? Lucy: Go straight on, then take the second street on the left. The museum is next to the bank, opposite the park.",
          q: "Écoute le dialogue. Où se trouve le musée ?",
          c: ["À côté de la banque, en face du parc", "En face de la banque, à côté du parc", "Derrière le parc, à droite", "Dans la première rue à gauche"], a: 0,
          ex: "« Next to » = à côté de ; « opposite » = en face de. Le chemin : tout droit (straight on), puis la deuxième rue à gauche." },
        { t: "qcm", audio: A_SHOP,
          q: "Écoute le dialogue dans le magasin. Combien coûte le t-shirt bleu ?",
          c: ["12 £", "20 £", "2 £", "22 £"], a: 0,
          ex: "« It's twelve pounds » = 12 livres. Twelve (12) et twenty (20) se ressemblent : écoute bien la fin du mot (-elve / -enty)." },
        { t: "qcm", audio: A_SHOP,
          q: "Écoute encore le dialogue dans le magasin. Quel est le problème de Mark ?",
          c: ["Sa taille (M) n'est pas disponible.", "Le t-shirt est trop cher.", "Il n'y a plus de t-shirts bleus.", "Le magasin va fermer."], a: 0,
          ex: "Mark demande « Have you got it in medium? » et la vendeuse répond « we've only got small and large » : seulement S et L, pas de M." },
        { t: "qcm", audio: "Good afternoon, shoppers. Today only, all fruit and vegetables are half price. Don't forget, the shop closes early today, at five o'clock.",
          q: "Écoute l'annonce du supermarché. À quelle heure le magasin ferme-t-il aujourd'hui ?",
          c: ["À 17 h", "À 15 h", "À 19 h", "À 12 h"], a: 0,
          ex: "« The shop closes early today, at five o'clock » : five o'clock l'après-midi = 17 h. « Half price » signifie que les fruits et légumes sont à moitié prix." },
        { t: "qcm", audio: "Jake: What did you do last weekend, Mia? Mia: I went to the seaside with my cousins. We swam in the sea and had a picnic. Jake: Lucky you! I stayed at home and studied for my maths test.",
          q: "Écoute le dialogue. Qu'a fait Jake le week-end dernier ?",
          c: ["Il est resté chez lui pour étudier ses maths.", "Il est allé à la mer avec ses cousins.", "Il a fait un pique-nique.", "Il a nagé à la piscine."], a: 0,
          ex: "Jake dit « I stayed at home and studied for my maths test ». C'est Mia qui est allée à la mer (went, swam, had : past simple irréguliers)." },
        { t: "vf", audio: "Hello everyone, this is Mrs Clarke. Tomorrow's school trip to the zoo is cancelled because of the storm. The trip is now on Friday. Please bring a packed lunch and a raincoat.",
          q: "Écoute le message de l'école. Vrai ou faux : l'excursion au zoo est reportée à vendredi.",
          a: true,
          ex: "Vrai : l'excursion de demain est annulée (cancelled) à cause de la tempête, et « The trip is now on Friday ». Il faut prendre un pique-nique (packed lunch) et un imperméable." },
        { t: "qcm", audio: "Olivia: Hi Sam, would you like to come to my birthday party on Saturday? Sam: I'd love to! What time does it start? Olivia: At three o'clock, at my house. Sam: Great, see you then!",
          q: "Écoute le dialogue. Comment Sam répond-il à l'invitation d'Olivia ?",
          c: ["Il accepte avec plaisir.", "Il refuse car il est occupé.", "Il hésite et rappellera plus tard.", "Il propose un autre jour."], a: 0,
          ex: "« I'd love to! » = j'adorerais / avec plaisir : c'est une façon enthousiaste d'accepter une invitation. La fête commence à 15 h (three o'clock)." },
        { t: "qcm", audio: "Receptionist: Good evening. Can I help you? Mr Hill: Yes, I've got a reservation for two nights. My name is Hill. Receptionist: Ah yes, room two hundred and eight, on the second floor. Breakfast is from seven to ten.",
          q: "Écoute le dialogue à l'hôtel. Quel est le numéro de la chambre de Mr Hill ?",
          c: ["208", "280", "218", "228"], a: 0,
          ex: "« Two hundred and eight » = 208. En anglais britannique, on dit « and » entre les centaines et le reste : two hundred AND eight." },
        { t: "qcm", audio: "Hi, I'm Noah. I'm fourteen and I love sport. I play basketball three times a week, but my favourite thing is skateboarding. I don't like swimming because the water is always too cold!",
          q: "Écoute Noah se présenter. Quel sport n'aime-t-il pas ?",
          c: ["La natation", "Le basket", "Le skateboard", "Le football"], a: 0,
          ex: "« I don't like swimming because the water is always too cold! » Noah joue au basket trois fois par semaine et préfère le skateboard." }
      ]
    },
    // =====================================================
    {
      id: "grammar",
      name: "Grammar",
      desc: "Temps des verbes, comparatifs, modaux, quantifieurs, pronoms, questions, possessifs.",
      items: [
        { t: "qcm", q: "Complète : She ___ to school every day.", c: ["goes", "go", "is going", "going"], a: 0,
          ex: "« Every day » = habitude → present simple. À la 3e personne du singulier (he/she/it), on ajoute -s ou -es : she goes." },
        { t: "qcm", q: "Complète : Look! The children ___ in the garden.", c: ["are playing", "play", "plays", "played"], a: 0,
          ex: "« Look! » montre une action en train de se passer → present continuous : be (am/is/are) + verbe-ing. The children = they → are playing." },
        { t: "txt", q: "Mets le verbe au past simple : Yesterday I ___ (go) to the cinema.", a: ["went"],
          ex: "« Go » est irrégulier : go – went – gone. « Yesterday » indique un moment terminé du passé → past simple." },
        { t: "txt", q: "Mets le verbe au past simple : We ___ (visit) our grandparents last Sunday.", a: ["visited"],
          ex: "« Visit » est régulier : on ajoute -ed → visited. « Last Sunday » = moment passé précis → past simple." },
        { t: "txt", q: "Mets à la forme négative du past simple : I saw the film yesterday. → I ___ see the film yesterday.", a: ["didn't", "did not"],
          ex: "Négation au past simple : didn't (did not) + verbe à l'infinitif, pour tous les verbes, réguliers ou irréguliers. On écrit donc « didn't see », jamais « didn't saw »." },
        { t: "qcm", q: "Complète : ___ you ever ___ to London?", c: ["Have … been", "Did … go", "Have … went", "Do … go"], a: 0,
          ex: "« Ever » (déjà, dans ta vie) s'emploie avec le present perfect : have/has + participe passé. Le participe de « be » est « been » : Have you ever been to London?" },
        { t: "qcm", q: "Complète : I have ___ finished my homework, so I can go out now.", c: ["just", "ago", "yesterday", "last"], a: 0,
          ex: "« Just » (venir de) se place entre have et le participe passé : I have just finished = je viens de terminer. « Ago », « yesterday » et « last » vont avec le past simple." },
        { t: "qcm", q: "Complète : I've never ___ sushi. I'd like to try it!", c: ["eaten", "ate", "eat", "eating"], a: 0,
          ex: "Present perfect = have + participe passé. « Eat » est irrégulier : eat – ate – eaten. « Ate » est le past simple, il ne va pas après « have »." },
        { t: "qcm", q: "Complète : Look at those black clouds! It ___ rain.", c: ["is going to", "going to", "is go to", "goes to"], a: 0,
          ex: "On utilise be going to + verbe pour une prédiction basée sur ce qu'on voit (les nuages noirs). Il faut toujours le verbe « be » : It IS going to rain." },
        { t: "qcm", q: "Complète : « The phone is ringing! » — « OK, I ___ it. »", c: ["'ll answer", "answering", "am answer", "answered"], a: 0,
          ex: "Pour une décision prise sur le moment, on emploie « will » + verbe (souvent contracté en 'll) : I'll answer it = je vais répondre / je réponds." },
        { t: "txt", q: "Écris le comparatif : My brother is ___ (tall) than me.", a: ["taller"],
          ex: "Adjectif court (une syllabe) : on ajoute -er, puis « than ». tall → taller than." },
        { t: "qcm", q: "Complète : Rome is ___ than Brussels. (big)", c: ["bigger", "more big", "biggest", "biger"], a: 0,
          ex: "Adjectif court qui finit par consonne-voyelle-consonne : on double la consonne finale → big → bigger. « Than » demande le comparatif, pas le superlatif." },
        { t: "qcm", q: "Complète : This is ___ film I have ever seen!", c: ["the best", "the goodest", "the better", "the most good"], a: 0,
          ex: "« Good » est irrégulier : good – better – the best. Le superlatif prend toujours « the »." },
        { t: "qcm", q: "Complète : You ___ wear a helmet when you ride a motorbike. It's the law.", c: ["must", "can", "mustn't", "don't"], a: 0,
          ex: "« Must » exprime une obligation (ici, c'est la loi). « Mustn't » exprime une interdiction et « can » une possibilité." },
        { t: "qcm", q: "Complète : You look tired. You ___ go to bed earlier.", c: ["should", "should to", "mustn't", "can't"], a: 0,
          ex: "« Should » + verbe sans « to » sert à donner un conseil : you should go = tu devrais aller." },
        { t: "qcm", q: "Complète : There isn't ___ milk in the fridge.", c: ["any", "some", "many", "no"], a: 0,
          ex: "Dans une phrase négative, on utilise « any ». « No » est impossible ici car la phrase est déjà négative (isn't) ; « many » s'emploie avec des noms dénombrables." },
        { t: "qcm", q: "Complète : How ___ sugar do you want in your tea?", c: ["much", "many", "any", "lot"], a: 0,
          ex: "« Sugar » est indénombrable (on ne peut pas le compter comme des objets) → how much. « How many » s'emploie avec les noms dénombrables au pluriel (how many apples)." },
        { t: "qcm", q: "Complète : Tom and I are best friends. ___ play tennis together every Saturday.", c: ["We", "Us", "They", "Our"], a: 0,
          ex: "« Tom and I » = nous → pronom sujet « we ». « Us » est un pronom complément et « our » un adjectif possessif." },
        { t: "txt", q: "Complète la question avec un auxiliaire : ___ your sister like pizza?", a: ["does"],
          ex: "Question au present simple : do/does + sujet + verbe. « Your sister » = she (3e personne du singulier) → Does your sister like pizza?" },
        { t: "qcm", q: "Complète : ___ did you go on holiday? — To Spain.", c: ["Where", "When", "Who", "What time"], a: 0,
          ex: "La réponse « To Spain » est un lieu → where (où). When = quand, who = qui, what time = à quelle heure." },
        { t: "qcm", q: "Complète : ___ a lot of people at the party last night.", c: ["There were", "There was", "It was", "They was"], a: 0,
          ex: "There is/are au passé : there was (singulier) / there were (pluriel). « A lot of people » est pluriel → there were." },
        { t: "qcm", q: "Complète (le vélo de mon frère) : This is ___ bike.", c: ["my brother's", "my brother", "brother's my", "my brothers bike's"], a: 0,
          ex: "Pour dire « le … de quelqu'un », on met le possesseur + 's devant l'objet : my brother's bike = le vélo de mon frère." },
        { t: "qcm", q: "Complète : Sarah loves ___ cat. It's so cute!", c: ["her", "his", "she", "its"], a: 0,
          ex: "Le possessif dépend du possesseur, pas de l'objet : Sarah est une fille → her cat. His s'emploie pour un garçon, its pour un animal ou une chose." },
        { t: "txt", q: "Mets à la forme négative : He plays the piano. → He ___ play the piano.", a: ["doesn't", "does not"],
          ex: "Négation au present simple à la 3e personne : doesn't (does not) + verbe sans -s. He doesn't play (et non « doesn't plays »)." }
      ]
    },
    // =====================================================
    {
      id: "vocab",
      name: "Vocabulary & functions",
      desc: "Vocabulaire A2 par thèmes et fonctions langagières : se présenter, demander son chemin, proposer, s'excuser, commander…",
      items: [
        { t: "qcm", q: "Que réponds-tu si quelqu'un te demande « How are you? » ?", c: ["Fine, thanks. And you?", "I'm thirteen.", "I'm Margaux.", "Yes, I am."], a: 0,
          ex: "« How are you? » = comment vas-tu ? On répond par exemple « Fine, thanks » ou « I'm OK ». « I'm thirteen » répond à « How old are you? »." },
        { t: "qcm", q: "Pour te présenter, quelle phrase est correcte ?", c: ["I'm thirteen years old.", "I have thirteen years.", "I've got thirteen years old.", "I am thirteen years."], a: 0,
          ex: "En anglais, l'âge s'exprime avec « be » : I am (I'm) thirteen (years old). Ne traduis pas « j'ai » par « I have » pour l'âge." },
        { t: "qcm", q: "Un touriste te demande : « Excuse me, how can I get to the station? » Que réponds-tu ?", c: ["Go straight on and turn right at the traffic lights.", "It's ten o'clock.", "I'm going by train.", "Yes, I can."], a: 0,
          ex: "Il demande son chemin : on répond avec des directions à l'impératif. Go straight on = continuez tout droit ; turn right = tournez à droite ; traffic lights = feux." },
        { t: "qcm", q: "Tu veux proposer à ton ami d'aller au parc. Que dis-tu ?", c: ["Let's go to the park!", "Let's to go to the park!", "I went to the park.", "Do you go to the park?"], a: 0,
          ex: "Pour faire une suggestion : Let's + verbe sans « to » (Let's go!). On peut aussi dire « Why don't we go to the park? »." },
        { t: "qcm", q: "Tu as bousculé quelqu'un dans le bus. Que dis-tu ?", c: ["Oh, I'm sorry!", "You're welcome.", "Cheers!", "Bless you!"], a: 0,
          ex: "Pour s'excuser : « I'm sorry » ou « Sorry! ». « You're welcome » répond à un merci, « Bless you! » se dit quand quelqu'un éternue." },
        { t: "qcm", q: "Au restaurant, quelle phrase utilises-tu pour commander poliment ?", c: ["I'd like a cheese sandwich, please.", "I like a cheese sandwich.", "Do you like a cheese sandwich?", "I'd like to a cheese sandwich."], a: 0,
          ex: "« I'd like » (= I would like) signifie « je voudrais » : c'est la formule polie pour commander. « I like » veut dire « j'aime » (en général)." },
        { t: "qcm", q: "Comment demandes-tu à ton ami son avis sur un film ?", c: ["What do you think of the film?", "How is the film called?", "Where do you think the film?", "What is the film thinking?"], a: 0,
          ex: "Pour demander une opinion : What do you think of/about…? Pour répondre : I think it's great / In my opinion, it's boring." },
        { t: "qcm", q: "Ton ami te dit « I've passed my exam! » Que réponds-tu ?", c: ["Congratulations!", "Bless you!", "Get well soon!", "Sorry to hear that."], a: 0,
          ex: "Il a réussi son examen : on le félicite avec « Congratulations! » (ou « Well done! »). « Get well soon » se dit à quelqu'un de malade." },
        { t: "qcm", q: "Trouve l'intrus : aunt – nephew – cousin – kitchen", c: ["kitchen", "aunt", "nephew", "cousin"], a: 0,
          ex: "Aunt (tante), nephew (neveu) et cousin sont des membres de la famille. Kitchen = cuisine, c'est une pièce de la maison." },
        { t: "qcm", q: "Trouve l'intrus : sunny – windy – cloudy – hungry", c: ["hungry", "sunny", "windy", "cloudy"], a: 0,
          ex: "Sunny (ensoleillé), windy (venteux) et cloudy (nuageux) décrivent la météo. Hungry = avoir faim." },
        { t: "qcm", q: "Trouve l'intrus : trousers – skirt – jumper – spoon", c: ["spoon", "trousers", "skirt", "jumper"], a: 0,
          ex: "Trousers (pantalon), skirt (jupe) et jumper (pull, en anglais britannique) sont des vêtements. Spoon = cuillère." },
        { t: "qcm", q: "Que signifie « I've got a headache » ?", c: ["J'ai mal à la tête.", "J'ai mal au ventre.", "J'ai de la fièvre.", "J'ai mal aux dents."], a: 0,
          ex: "Head = tête, ache = douleur → headache = mal de tête. De même : stomachache (mal au ventre), toothache (mal aux dents). Fièvre = a temperature." },
        { t: "qcm", q: "Que veut dire « What's the matter? » ?", c: ["Qu'est-ce qui ne va pas ?", "Quelle est ta matière préférée ?", "De quoi est-ce fait ?", "Quelle heure est-il ?"], a: 0,
          ex: "« What's the matter? » (ou « What's wrong? ») = qu'est-ce qui ne va pas ? Une matière scolaire se dit « a subject »." },
        { t: "qcm", q: "Que signifie « a library » ?", c: ["une bibliothèque", "une librairie", "une liberté", "un libraire"], a: 0,
          ex: "Attention, faux ami ! A library = une bibliothèque (on emprunte des livres). Une librairie (on achète des livres) = a bookshop." },
        { t: "txt", q: "Traduis en anglais : le petit-déjeuner", a: ["breakfast", "the breakfast", "a breakfast"],
          ex: "Breakfast = petit-déjeuner, lunch = dîner (repas de midi en Belgique), dinner = souper (repas du soir)." },
        { t: "txt", q: "À la gare, tu veux un billet aller-retour. Complète : A ___ ticket to London, please.", a: ["return", "round-trip"],
          ex: "En anglais britannique : a return ticket = un aller-retour ; a single ticket = un aller simple. (Les Américains disent round-trip et one-way.)" },
        { t: "qcm", q: "Quelle matière étudie-t-on avec des cartes, des pays et des fleuves ?", c: ["Geography", "History", "Chemistry", "Physical Education"], a: 0,
          ex: "Geography = géographie. History = histoire, chemistry = chimie, Physical Education (PE) = éducation physique." },
        { t: "qcm", q: "À l'hôtel, complète : I'd like to book a ___ for two nights.", c: ["room", "chamber", "piece", "kitchen"], a: 0,
          ex: "Une chambre d'hôtel = a room (a single room, a double room). « Chamber » est un faux ami vieilli, et « a piece » veut dire un morceau." },
        { t: "vf", q: "En anglais britannique, le mot « chips » désigne des frites.", a: true,
          ex: "Vrai : au Royaume-Uni, chips = frites (fish and chips). Les chips en paquet s'appellent « crisps ». Aux États-Unis, frites = French fries." }
      ]
    }
  ,
    /* ======= 200 QCM CE1D importés (parent) ======= */
    {
      id: "qcmEn1",
      name: "QCM CE1D · Vocabulary",
      desc: "Banque QCM 200 questions CE1D Anglais — 25 questions, avec correction et explication.",
      items: [
        { t: "qcm", q: "What is the opposite of big?", c: ["Small", "Tall", "Long", "Heavy"], a: 0, ex: "The opposite of “big” is “small”." },
        { t: "qcm", q: "What does hungry mean?", c: ["Tired", "Wanting to eat", "Angry", "Thirsty"], a: 1, ex: "If you are hungry, you want to eat." },
        { t: "qcm", q: "Choose the synonym of happy.", c: ["Sad", "Angry", "Glad", "Tired"], a: 2, ex: "“Happy” and “glad” have similar meanings." },
        { t: "qcm", q: "What is the opposite of expensive?", c: ["Beautiful", "Modern", "Difficult", "Cheap"], a: 3, ex: "Something inexpensive is cheap." },
        { t: "qcm", q: "Which word is connected with school?", c: ["Teacher", "Airport", "Kitchen", "Hospital"], a: 0, ex: "A teacher works at a school." },
        { t: "qcm", q: "What does thirsty mean?", c: ["Wanting to sleep", "Wanting to drink", "Wanting to run", "Wanting to study"], a: 1, ex: "When you are thirsty, you want something to drink." },
        { t: "qcm", q: "Choose the opposite of early.", c: ["Fast", "Soon", "Late", "Quick"], a: 2, ex: "“Late” is the opposite of “early”." },
        { t: "qcm", q: "Which word is a fruit?", c: ["Carrot", "Potato", "Onion", "Apple"], a: 3, ex: "An apple is a fruit." },
        { t: "qcm", q: "What does borrow mean?", c: ["To take something and return it later", "To buy something", "To break something", "To lose something"], a: 0, ex: "If you borrow something, you use it temporarily and give it back." },
        { t: "qcm", q: "What is the opposite of easy?", c: ["Simple", "Difficult", "Nice", "Short"], a: 1, ex: "The opposite of easy is difficult." },
        { t: "qcm", q: "Which word means very tired?", c: ["Excited", "Hungry", "Exhausted", "Noisy"], a: 2, ex: "“Exhausted” means extremely tired." },
        { t: "qcm", q: "What is a neighbour?", c: ["Someone who lives near you", "Your teacher", "Your doctor", "Someone on television"], a: 0, ex: "A neighbour is a person who lives near you." },
        { t: "qcm", q: "Which word is connected with weather?", c: ["Pencil", "Cloud", "Chair", "Plate"], a: 1, ex: "A cloud is part of the weather." },
        { t: "qcm", q: "What does quiet mean?", c: ["Very loud", "Very fast", "Not noisy", "Very expensive"], a: 2, ex: "A quiet place is not noisy." },
        { t: "qcm", q: "Choose the opposite of dangerous.", c: ["Difficult", "Safe", "Strong", "Strange"], a: 1, ex: "Safe is the opposite of dangerous." },
        { t: "qcm", q: "Which word means to begin?", c: ["Start", "Finish", "Stop", "Close"], a: 0, ex: "“Start” means “begin”." },
        { t: "qcm", q: "What is a journey?", c: ["A meal", "A trip", "A lesson", "A sport"], a: 1, ex: "A journey is a trip from one place to another." },
        { t: "qcm", q: "Which word is connected with clothes?", c: ["Shirt", "River", "Forest", "Cloud"], a: 0, ex: "A shirt is a piece of clothing." },
        { t: "qcm", q: "What does careful mean?", c: ["Acting without thinking", "Acting with attention", "Acting very quickly", "Acting angrily"], a: 1, ex: "A careful person pays attention and avoids mistakes or danger." },
        { t: "qcm", q: "What is the opposite of noisy?", c: ["Loud", "Busy", "Quiet", "Excited"], a: 2, ex: "Quiet means not noisy." },
        { t: "qcm", q: "Which word is a means of transport?", c: ["Bicycle", "Window", "Bottle", "Blanket"], a: 0, ex: "A bicycle is a means of transport." },
        { t: "qcm", q: "What does cheap mean?", c: ["Not expensive", "Very large", "Very old", "Difficult to find"], a: 0, ex: "Cheap means costing little money." },
        { t: "qcm", q: "Which word means angry?", c: ["Furious", "Relaxed", "Sleepy", "Nervous"], a: 0, ex: "Furious means very angry." },
        { t: "qcm", q: "What is a forest?", c: ["A place with many trees", "A place with many cars", "A type of building", "A type of food"], a: 0, ex: "A forest is a large area covered mainly with trees." },
        { t: "qcm", q: "Which word is connected with cooking?", c: ["Pan", "Pencil", "Ticket", "Bicycle"], a: 0, ex: "A pan is used for cooking." },
      ]
    },
    {
      id: "qcmEn2",
      name: "QCM CE1D · Present simple / Present continuous",
      desc: "Banque QCM 200 questions CE1D Anglais — 25 questions, avec correction et explication.",
      items: [
        { t: "qcm", q: "She ___ to school every day.", c: ["go", "goes", "going", "gone"], a: 1, ex: "With “she” in the present simple, we add -s: she goes." },
        { t: "qcm", q: "Look! The baby ___.", c: ["sleeps", "sleep", "is sleeping", "sleeping"], a: 2, ex: "“Look!” indicates an action happening now: present continuous." },
        { t: "qcm", q: "I ___ football every Saturday.", c: ["play", "am playing", "plays", "playing"], a: 0, ex: "“Every Saturday” describes a habit, so we use the present simple." },
        { t: "qcm", q: "They ___ TV at the moment.", c: ["watch", "watches", "are watching", "watched"], a: 2, ex: "“At the moment” indicates an action happening now." },
        { t: "qcm", q: "My brother ___ chocolate.", c: ["don't like", "doesn't like", "isn't like", "not likes"], a: 1, ex: "With “he”, the negative present simple uses “doesn't + base verb”." },
        { t: "qcm", q: "___ you like pizza?", c: ["Are", "Does", "Do", "Is"], a: 2, ex: "Questions with “you” in the present simple use “do”." },
        { t: "qcm", q: "Tom ___ his homework now.", c: ["does", "is doing", "do", "doing"], a: 1, ex: "“Now” indicates the present continuous." },
        { t: "qcm", q: "We ___ in Belgium.", c: ["live", "lives", "are live", "living"], a: 0, ex: "A permanent situation uses the present simple." },
        { t: "qcm", q: "Listen! Someone ___ at the door.", c: ["knocks", "knock", "is knocking", "knocked"], a: 2, ex: "“Listen!” indicates something happening now." },
        { t: "qcm", q: "Sarah ___ coffee every morning.", c: ["drink", "drinks", "is drinking", "drinking"], a: 1, ex: "“Every morning” describes a habit." },
        { t: "qcm", q: "They ___ football right now.", c: ["play", "plays", "are playing", "played"], a: 2, ex: "“Right now” requires the present continuous." },
        { t: "qcm", q: "My parents ___ work at eight o'clock every day.", c: ["start", "starts", "are starting", "starting"], a: 0, ex: "This is a regular routine." },
        { t: "qcm", q: "Why ___ you crying?", c: ["do", "are", "does", "is"], a: 1, ex: "“Are you crying?” is a present continuous question." },
        { t: "qcm", q: "He ___ his room every Saturday.", c: ["clean", "cleaning", "cleans", "is clean"], a: 2, ex: "“Every Saturday” indicates a routine." },
        { t: "qcm", q: "Be quiet! The students ___ a test.", c: ["take", "takes", "are taking", "taking"], a: 2, ex: "The test is happening now." },
        { t: "qcm", q: "I usually ___ breakfast at 7.", c: ["have", "am having", "has", "having"], a: 0, ex: "“Usually” indicates a habit." },
        { t: "qcm", q: "At the moment, my sister ___ a book.", c: ["reads", "read", "is reading", "reading"], a: 2, ex: "“At the moment” indicates the present continuous." },
        { t: "qcm", q: "Does your father ___ English?", c: ["speaks", "speak", "speaking", "spoke"], a: 1, ex: "After “does”, use the base form: speak." },
        { t: "qcm", q: "My friends ___ video games every evening.", c: ["plays", "playing", "play", "are play"], a: 2, ex: "“My friends” is plural, so we use “play”." },
        { t: "qcm", q: "She ___ wearing a blue jacket today.", c: ["are", "is", "do", "does"], a: 1, ex: "With “she”, the verb “be” is “is”." },
        { t: "qcm", q: "I ___ not understand this question.", c: ["am", "does", "do", "is"], a: 2, ex: "The negative present simple is “I do not understand”." },
        { t: "qcm", q: "He ___ usually late.", c: ["is", "are", "does", "do"], a: 0, ex: "“He is usually late” is the correct form of “be”." },
        { t: "qcm", q: "The children ___ in the garden now.", c: ["play", "plays", "are playing", "played"], a: 2, ex: "“Now” indicates the present continuous." },
        { t: "qcm", q: "My mother ___ to work by car every day.", c: ["go", "goes", "is go", "going"], a: 1, ex: "“Every day” indicates a routine, and “she” requires -s." },
        { t: "qcm", q: "What ___ you doing?", c: ["do", "does", "are", "is"], a: 2, ex: "Present continuous question: “What are you doing?”" },
      ]
    },
    {
      id: "qcmEn3",
      name: "QCM CE1D · Past simple",
      desc: "Banque QCM 200 questions CE1D Anglais — 25 questions, avec correction et explication.",
      items: [
        { t: "qcm", q: "Yesterday, I ___ to the cinema.", c: ["go", "went", "gone", "going"], a: 1, ex: "The past of “go” is irregular: went." },
        { t: "qcm", q: "She ___ her homework last night.", c: ["did", "does", "do", "doing"], a: 0, ex: "The past of “do” is “did”." },
        { t: "qcm", q: "We ___ football yesterday.", c: ["play", "plays", "played", "playing"], a: 2, ex: "The regular past of “play” is “played”." },
        { t: "qcm", q: "He ___ breakfast at 8 yesterday.", c: ["has", "have", "had", "having"], a: 2, ex: "The past of “have” is “had”." },
        { t: "qcm", q: "They ___ not go to school yesterday.", c: ["did", "do", "were", "are"], a: 0, ex: "The negative past uses “did not + base verb”." },
        { t: "qcm", q: "Did you ___ the film?", c: ["saw", "see", "seeing", "seen"], a: 1, ex: "After “did”, use the base form: see." },
        { t: "qcm", q: "Tom ___ his keys last night.", c: ["loses", "lose", "lost", "losing"], a: 2, ex: "The past of “lose” is “lost”." },
        { t: "qcm", q: "We ___ at home last Sunday.", c: ["were", "are", "was", "be"], a: 0, ex: "“We” takes “were” in the past." },
        { t: "qcm", q: "She ___ very tired after the race.", c: ["is", "was", "were", "be"], a: 1, ex: "“She was” is the past form of “she is”." },
        { t: "qcm", q: "I ___ my grandmother two days ago.", c: ["visit", "visited", "visiting", "visits"], a: 1, ex: "“Two days ago” indicates the past simple." },
        { t: "qcm", q: "They ___ a new car last month.", c: ["bought", "buy", "buys", "buying"], a: 0, ex: "The past of “buy” is “bought”." },
        { t: "qcm", q: "He ___ a sandwich yesterday.", c: ["eat", "eats", "ate", "eating"], a: 2, ex: "The past of “eat” is “ate”." },
        { t: "qcm", q: "What did you ___ yesterday?", c: ["did", "do", "doing", "done"], a: 1, ex: "After “did”, use the infinitive/base form “do”." },
        { t: "qcm", q: "Sarah ___ her room last Saturday.", c: ["cleaned", "clean", "cleans", "cleaning"], a: 0, ex: "“Clean” is a regular verb: cleaned." },
        { t: "qcm", q: "We ___ a great time at the party.", c: ["have", "had", "having", "has"], a: 1, ex: "The past of “have” is “had”." },
        { t: "qcm", q: "I ___ my phone yesterday.", c: ["forget", "forgot", "forgetting", "forgets"], a: 1, ex: "The past of “forget” is “forgot”." },
        { t: "qcm", q: "Did she ___ the answer?", c: ["knew", "know", "knowing", "knows"], a: 1, ex: "After “did”, use “know”." },
        { t: "qcm", q: "They ___ late for school yesterday.", c: ["are", "was", "were", "be"], a: 2, ex: "“They were” is the correct past form." },
        { t: "qcm", q: "He ___ a letter to his friend.", c: ["wrote", "write", "writes", "writing"], a: 0, ex: "The past of “write” is “wrote”." },
        { t: "qcm", q: "I ___ my room yesterday.", c: ["tidy", "tidied", "tidies", "tidying"], a: 1, ex: "“Tidy” becomes “tidied” in the past." },
        { t: "qcm", q: "She ___ the window because it was cold.", c: ["close", "closed", "closes", "closing"], a: 1, ex: "The past simple of “close” is “closed”." },
        { t: "qcm", q: "We ___ a film last night.", c: ["watched", "watch", "watches", "watching"], a: 0, ex: "“Watched” is the past simple of “watch”." },
        { t: "qcm", q: "He ___ his bike to school yesterday.", c: ["ride", "rides", "rode", "riding"], a: 2, ex: "The past of “ride” is “rode”." },
        { t: "qcm", q: "They ___ dinner at 7 p.m.", c: ["have", "had", "has", "having"], a: 1, ex: "The past of “have” is “had”." },
        { t: "qcm", q: "I ___ very happy when I won the competition.", c: ["am", "was", "were", "be"], a: 1, ex: "The past of “I am” is “I was”." },
      ]
    },
    {
      id: "qcmEn4",
      name: "QCM CE1D · Future, modal verbs and questions",
      desc: "Banque QCM 200 questions CE1D Anglais — 25 questions, avec correction et explication.",
      items: [
        { t: "qcm", q: "I think it ___ rain tomorrow.", c: ["will", "did", "was", "has"], a: 0, ex: "“Will” is used to express a future prediction." },
        { t: "qcm", q: "We ___ visit London next summer.", c: ["are", "will", "did", "were"], a: 1, ex: "“Will visit” expresses a future action." },
        { t: "qcm", q: "You ___ wear a helmet when cycling.", c: ["should", "shouldn't", "can't", "aren't"], a: 0, ex: "“Should” expresses advice." },
        { t: "qcm", q: "You ___ smoke in a hospital.", c: ["should", "can", "mustn't", "are"], a: 2, ex: "“Mustn't” expresses prohibition." },
        { t: "qcm", q: "___ I open the window?", c: ["Must", "May", "Did", "Was"], a: 1, ex: "“May I...?” is a polite way of asking permission." },
        { t: "qcm", q: "You ___ do your homework before playing.", c: ["must", "are", "did", "have"], a: 0, ex: "“Must” expresses obligation." },
        { t: "qcm", q: "I ___ swim when I was five.", c: ["can", "could", "must", "should"], a: 1, ex: "“Could” expresses ability in the past." },
        { t: "qcm", q: "She ___ speak three languages.", c: ["can", "must", "should", "was"], a: 0, ex: "“Can” expresses present ability." },
        { t: "qcm", q: "You ___ be quiet in the library.", c: ["can", "should", "shouldn't", "aren't"], a: 1, ex: "“Should” gives advice or indicates appropriate behaviour." },
        { t: "qcm", q: "What ___ you do tomorrow?", c: ["did", "will", "were", "does"], a: 1, ex: "“Will” forms a future question." },
        { t: "qcm", q: "___ you help me, please?", c: ["Could", "Did", "Were", "Has"], a: 0, ex: "“Could you...?” is a polite request." },
        { t: "qcm", q: "I ___ probably stay at home tonight.", c: ["did", "will", "was", "have"], a: 1, ex: "“Will” is used for a future decision or prediction." },
        { t: "qcm", q: "Students ___ use their phones during the exam.", c: ["mustn't", "can", "should", "may"], a: 0, ex: "“Mustn't” means it is forbidden." },
        { t: "qcm", q: "You look tired. You ___ go to bed.", c: ["should", "mustn't", "can't", "weren't"], a: 0, ex: "“Should” gives advice." },
        { t: "qcm", q: "___ I borrow your pen?", c: ["Must", "Can", "Did", "Was"], a: 1, ex: "“Can I...?” asks for permission." },
        { t: "qcm", q: "Tomorrow, she ___ be sixteen.", c: ["will", "did", "was", "does"], a: 0, ex: "“Will be” refers to the future." },
        { t: "qcm", q: "You ___ eat so much junk food.", c: ["shouldn't", "mustn't", "can't", "weren't"], a: 0, ex: "“Shouldn't” means it is not advisable." },
        { t: "qcm", q: "He ___ play the piano very well.", c: ["can", "must", "should", "will"], a: 0, ex: "“Can” expresses ability." },
        { t: "qcm", q: "We ___ leave now. The bus is coming.", c: ["must", "shouldn't", "can't", "weren't"], a: 0, ex: "“Must” expresses necessity." },
        { t: "qcm", q: "___ you like some water?", c: ["Would", "Did", "Were", "Have"], a: 0, ex: "“Would you like...?” is used to offer something politely." },
        { t: "qcm", q: "I promise I ___ help you tomorrow.", c: ["did", "will", "was", "have"], a: 1, ex: "“Will help” expresses a future promise." },
        { t: "qcm", q: "You ___ park here. It's forbidden.", c: ["can", "should", "mustn't", "may"], a: 2, ex: "“Mustn't” means parking is prohibited." },
        { t: "qcm", q: "When ___ they arrive?", c: ["will", "did", "were", "have"], a: 0, ex: "“When will they arrive?” is a future question." },
        { t: "qcm", q: "___ you like to come with us?", c: ["Would", "Did", "Were", "Are"], a: 0, ex: "“Would you like...?” is a polite invitation." },
        { t: "qcm", q: "You ___ be more careful next time.", c: ["should", "shouldn't", "can't", "weren't"], a: 0, ex: "“Should” is used to give advice." },
      ]
    },
    {
      id: "qcmEn5",
      name: "QCM CE1D · Pronouns, possessives, articles and prepositions",
      desc: "Banque QCM 200 questions CE1D Anglais — 25 questions, avec correction et explication.",
      items: [
        { t: "qcm", q: "This is ___ book.", c: ["my", "me", "I", "mine"], a: 0, ex: "“My” is a possessive adjective placed before a noun." },
        { t: "qcm", q: "That bag belongs to Sarah. It is ___ bag.", c: ["she", "her", "hers", "herself"], a: 1, ex: "“Her” comes before the noun “bag”." },
        { t: "qcm", q: "This phone belongs to me. It is ___.", c: ["my", "me", "mine", "I"], a: 2, ex: "“Mine” is a possessive pronoun." },
        { t: "qcm", q: "___ are my friends.", c: ["Them", "They", "Their", "Theirs"], a: 1, ex: "“They” is the subject pronoun." },
        { t: "qcm", q: "I can see John. I can see ___.", c: ["he", "his", "him", "himself"], a: 2, ex: "After the verb “see”, we use the object pronoun “him”." },
        { t: "qcm", q: "We live ___ Belgium.", c: ["at", "in", "on", "to"], a: 1, ex: "Countries are normally used with “in”." },
        { t: "qcm", q: "The book is ___ the table.", c: ["in", "at", "on", "to"], a: 2, ex: "Something touching the surface of a table is “on the table”." },
        { t: "qcm", q: "I get up ___ seven o'clock.", c: ["in", "on", "at", "to"], a: 2, ex: "We use “at” with specific clock times." },
        { t: "qcm", q: "My birthday is ___ July.", c: ["in", "on", "at", "to"], a: 0, ex: "We use “in” with months." },
        { t: "qcm", q: "The test is ___ Monday.", c: ["at", "on", "in", "from"], a: 1, ex: "We use “on” with days of the week." },
        { t: "qcm", q: "There is ___ apple on the table.", c: ["a", "an", "the", "some"], a: 1, ex: "“Apple” begins with a vowel sound, so we use “an”." },
        { t: "qcm", q: "I have ___ dog.", c: ["an", "a", "some", "any"], a: 1, ex: "“Dog” begins with a consonant sound, so we use “a”." },
        { t: "qcm", q: "Can you give ___ the book?", c: ["I", "me", "my", "mine"], a: 1, ex: "“Me” is the object pronoun." },
        { t: "qcm", q: "This is ___ house.", c: ["they", "them", "their", "theirs"], a: 2, ex: "“Their” is a possessive adjective before a noun." },
        { t: "qcm", q: "The children are playing with ___ dog.", c: ["they", "them", "their", "theirs"], a: 2, ex: "“Their dog” means the dog belongs to them." },
        { t: "qcm", q: "I don't have ___ money.", c: ["some", "any", "an", "a"], a: 1, ex: "“Any” is commonly used in negative sentences." },
        { t: "qcm", q: "There are ___ books on the desk.", c: ["some", "any", "a", "an"], a: 0, ex: "“Some” can be used with plural nouns in affirmative sentences." },
        { t: "qcm", q: "Is there ___ milk in the fridge?", c: ["some", "a", "any", "an"], a: 2, ex: "“Any” is commonly used in questions." },
        { t: "qcm", q: "The cat is ___ the chair.", c: ["under", "between", "from", "to"], a: 0, ex: "“Under” means below something." },
        { t: "qcm", q: "The school is ___ the bank and the supermarket.", c: ["under", "between", "on", "at"], a: 1, ex: "“Between” is used for something located in the middle of two things." },
        { t: "qcm", q: "Come ___ me!", c: ["with", "at", "in", "from"], a: 0, ex: "“Come with me” means accompany me." },
        { t: "qcm", q: "She is ___ the kitchen.", c: ["on", "at", "in", "to"], a: 2, ex: "We say “in the kitchen”." },
        { t: "qcm", q: "The picture is ___ the wall.", c: ["on", "in", "at", "from"], a: 0, ex: "A picture attached to a wall is “on the wall”." },
        { t: "qcm", q: "This is ___ umbrella.", c: ["a", "an", "some", "any"], a: 1, ex: "“Umbrella” begins with a vowel sound." },
        { t: "qcm", q: "Those shoes are ___.", c: ["my", "me", "mine", "I"], a: 2, ex: "“Mine” replaces “my shoes”." },
      ]
    },
    {
      id: "qcmEn6",
      name: "QCM CE1D · Comparatives, adjectives and quantity",
      desc: "Banque QCM 200 questions CE1D Anglais — 25 questions, avec correction et explication.",
      items: [
        { t: "qcm", q: "My brother is ___ than me.", c: ["tall", "taller", "tallest", "more tall"], a: 1, ex: "For a short adjective, the comparative is formed with -er." },
        { t: "qcm", q: "This book is ___ than that one.", c: ["interesting", "most interesting", "more interesting", "interestinger"], a: 2, ex: "Longer adjectives use “more”." },
        { t: "qcm", q: "Mount Everest is the ___ mountain in the world.", c: ["high", "higher", "highest", "most high"], a: 2, ex: "“The highest” is the superlative form of “high”." },
        { t: "qcm", q: "Today is ___ than yesterday.", c: ["cold", "colder", "coldest", "more cold"], a: 1, ex: "“Colder” is the comparative of “cold”." },
        { t: "qcm", q: "This is the ___ film I have ever seen.", c: ["good", "better", "best", "more good"], a: 2, ex: "The superlative of “good” is “best”." },
        { t: "qcm", q: "My bag is ___ than yours.", c: ["heavy", "heavier", "heaviest", "more heavy"], a: 1, ex: "“Heavy” becomes “heavier”." },
        { t: "qcm", q: "A car is usually ___ than a bicycle.", c: ["fast", "faster", "fastest", "more fast"], a: 1, ex: "The comparative of “fast” is “faster”." },
        { t: "qcm", q: "This exercise is ___ than the previous one.", c: ["difficult", "difficulter", "more difficult", "most difficult"], a: 2, ex: "“Difficult” normally uses “more” in the comparative." },
        { t: "qcm", q: "There are ___ apples than oranges.", c: ["much", "more", "most", "many of"], a: 1, ex: "“More” compares quantities." },
        { t: "qcm", q: "I don't have ___ money.", c: ["many", "much", "a lot", "few"], a: 1, ex: "“Money” is uncountable, so “much” is appropriate in a negative sentence." },
        { t: "qcm", q: "There are ___ students in the classroom.", c: ["much", "many", "little", "any of"], a: 1, ex: "“Students” is countable plural, so use “many”." },
        { t: "qcm", q: "I have ___ friends at school.", c: ["a lot of", "much", "little", "any"], a: 0, ex: "“A lot of” can be used with plural countable nouns." },
        { t: "qcm", q: "There is ___ water in the bottle.", c: ["many", "a few", "a little", "several"], a: 2, ex: "“Water” is uncountable, so “a little” is appropriate." },
        { t: "qcm", q: "I have ___ pencils in my bag.", c: ["a little", "a few", "much", "little"], a: 1, ex: "“Pencils” is countable plural." },
        { t: "qcm", q: "Which sentence is correct?", c: ["She is more tall than me.", "She is taller than me.", "She is tallest than me.", "She is tall than me."], a: 1, ex: "The correct comparative is “taller”." },
        { t: "qcm", q: "Which is the superlative of small?", c: ["Smaller", "More small", "Smallest", "Most small"], a: 2, ex: "The superlative is “smallest”." },
        { t: "qcm", q: "Which is the comparative of bad?", c: ["Badder", "Worse", "Worst", "More bad"], a: 1, ex: "“Bad” is irregular: bad → worse → worst." },
        { t: "qcm", q: "Which is the superlative of good?", c: ["Goodest", "Better", "Best", "More good"], a: 2, ex: "Good → better → best." },
        { t: "qcm", q: "My new phone is ___ expensive than my old one.", c: ["more", "most", "many", "much"], a: 0, ex: "“More expensive” is the comparative form." },
        { t: "qcm", q: "This is ___ restaurant in town.", c: ["better", "the best", "good", "more good"], a: 1, ex: "We use the superlative “the best”." },
        { t: "qcm", q: "There aren't ___ chairs in the room.", c: ["much", "many", "little", "a little"], a: 1, ex: "“Chairs” is countable plural." },
        { t: "qcm", q: "Would you like ___ tea?", c: ["some", "many", "a few", "an"], a: 0, ex: "“Some” is natural when offering an uncountable substance." },
        { t: "qcm", q: "There is ___ milk left.", c: ["a few", "many", "a little", "several"], a: 2, ex: "Milk is uncountable." },
        { t: "qcm", q: "I have ___ homework tonight.", c: ["many", "much", "a lot of", "a few"], a: 2, ex: "“A lot of homework” is correct; homework is uncountable." },
        { t: "qcm", q: "Which sentence is correct?", c: ["Tom is more young than Paul.", "Tom is younger than Paul.", "Tom is youngest than Paul.", "Tom is young than Paul."], a: 1, ex: "The comparative of “young” is “younger”." },
      ]
    },
    {
      id: "qcmEn7",
      name: "QCM CE1D · Micro-texts / Reading comprehension",
      desc: "Banque QCM 200 questions CE1D Anglais — 25 questions, avec correction et explication.",
      items: [
        { t: "qcm", ctx: "Emma woke up late on Monday morning. She quickly got dressed, grabbed her schoolbag and ran to the bus stop. When she arrived, the bus was already there.", q: "Why did Emma hurry?", c: ["She was late.", "She wanted breakfast.", "She wanted to go shopping.", "She was looking for her dog."], a: 0, ex: "She woke up late and ran to catch the bus." },
        { t: "qcm", ctx: "Jack loves animals. Last year, he adopted a small dog called Max. Every morning, Jack takes Max for a walk before school.", q: "What does Jack do every morning?", c: ["He feeds a cat.", "He takes Max for a walk.", "He goes swimming.", "He visits his grandmother."], a: 1, ex: "The text explicitly says that Jack takes Max for a walk every morning." },
        { t: "qcm", ctx: "It was raining heavily, so Lily decided to stay at home. She made some hot chocolate and watched a film.", q: "Why does Lily stay home?", c: ["She is sick.", "She has homework.", "The weather is bad.", "Her friends are visiting."], a: 2, ex: "The text says it was raining heavily." },
        { t: "qcm", ctx: "Ben opened the fridge. There was no milk, no cheese and only one apple. He wrote a shopping list.", q: "Why does Ben write a shopping list?", c: ["The fridge is broken.", "He wants to cook dinner.", "He is going to school.", "He needs to buy food."], a: 3, ex: "Several foods are missing, so he needs to go shopping." },
        { t: "qcm", ctx: "Sarah studied hard for her English test. When the teacher gave her the result, she smiled. She had got 18 out of 20.", q: "Why is Sarah smiling?", c: ["She got a good mark.", "She forgot the test.", "She didn't study.", "She wants to leave school."], a: 0, ex: "She studied hard and got 18/20." },
        { t: "qcm", ctx: "Tom looked out of the window. The sky was dark and he could hear thunder. He closed the windows.", q: "What weather is probably coming?", c: ["Sunshine", "A storm", "Snow", "A heatwave"], a: 1, ex: "Dark skies and thunder suggest a storm." },
        { t: "qcm", ctx: "Mia couldn't find her keys. She checked her bedroom, the kitchen and the living room. Finally, she found them in her schoolbag.", q: "Where were the keys?", c: ["In the kitchen.", "In the bedroom.", "In her schoolbag.", "In the living room."], a: 2, ex: "The final sentence gives the answer." },
        { t: "qcm", ctx: "The library was very quiet. Daniel sat near the window and read for an hour. Nobody spoke loudly.", q: "Why was the library quiet?", c: ["It was a sports centre.", "People were sleeping.", "It was closed.", "People were respecting the quiet atmosphere."], a: 3, ex: "Libraries are generally quiet places, and nobody was speaking loudly." },
        { t: "qcm", ctx: "On Saturday morning, Lucy put on her boots and took a basket. She walked towards the forest with her parents.", q: "What are they probably going to do?", c: ["Go for a walk.", "Go to school.", "Take a train.", "Visit a hospital."], a: 0, ex: "Boots, a basket and a walk towards the forest suggest an outdoor activity." },
        { t: "qcm", ctx: "“Don't forget your passport,” Dad told Alex. “Our flight leaves at six tomorrow morning.”", q: "Where are Alex and his family probably going?", c: ["To a supermarket.", "On a trip abroad.", "To school.", "To a sports centre."], a: 1, ex: "A passport and a flight indicate international travel." },
        { t: "qcm", ctx: "Peter was very tired after football practice. He took a shower, ate dinner and went to bed early.", q: "Why did Peter go to bed early?", c: ["He was bored.", "He was hungry.", "He was tired.", "He had an exam."], a: 2, ex: "The text explicitly says that he was very tired." },
        { t: "qcm", ctx: "Anna wanted to buy a new jacket. She tried three jackets in the shop before choosing a black one because it was cheaper.", q: "Why did she choose the black jacket?", c: ["It was bigger.", "It was more colourful.", "It was warmer.", "It was cheaper."], a: 3, ex: "The text gives the reason: it was cheaper." },
        { t: "qcm", ctx: "The teacher entered the classroom carrying a large box. The students immediately became excited.", q: "What can we infer?", c: ["The box probably contains something interesting.", "The students are going home.", "There is a test.", "The teacher is angry."], a: 0, ex: "The students become excited when they see the box, suggesting something interesting is inside." },
        { t: "qcm", ctx: "Mark checked the time. It was 7:50 and his train left at 8:00. He started running.", q: "Why is Mark running?", c: ["He is exercising.", "He doesn't want to miss the train.", "He is late for dinner.", "He wants to meet a friend at school."], a: 1, ex: "His train leaves in ten minutes." },
        { t: "qcm", ctx: "Emily opened her schoolbag and discovered that she had forgotten her maths book at home.", q: "What did Emily forget?", c: ["Her pencil case.", "Her English book.", "Her maths book.", "Her lunch."], a: 2, ex: "The text directly says she forgot her maths book." },
        { t: "qcm", ctx: "The children were wearing coats, scarves and gloves. They were building a snowman in the garden.", q: "What is the weather like?", c: ["Hot", "Rainy", "Windy", "Cold and snowy"], a: 3, ex: "Snow and winter clothes indicate cold, snowy weather." },
        { t: "qcm", ctx: "After dinner, James washed the dishes while his sister dried them. Their parents cleaned the kitchen.", q: "What are the family doing?", c: ["They are cleaning the kitchen.", "They are cooking breakfast.", "They are watching TV.", "They are studying."], a: 0, ex: "Everyone is helping clean the kitchen after dinner." },
        { t: "qcm", ctx: "Sophie received a message from her friend: “Don't forget! The party starts at 7 p.m. at my house.”", q: "When does the party start?", c: ["At 5 p.m.", "At 6 p.m.", "At 7 p.m.", "At 8 p.m."], a: 2, ex: "The message clearly states 7 p.m." },
        { t: "qcm", ctx: "Liam wanted to become healthier. He started eating more fruit and vegetables and began cycling to school.", q: "What is Liam trying to do?", c: ["Save money.", "Become healthier.", "Study more.", "Travel abroad."], a: 1, ex: "The text explicitly says he wanted to become healthier." },
        { t: "qcm", ctx: "The museum was closed on Monday, so the class decided to visit it on Tuesday instead.", q: "Why did they change the day?", c: ["Tuesday was cheaper.", "The teacher was absent.", "The students were tired.", "The museum was closed on Monday."], a: 3, ex: "The museum was not open on Monday." },
        { t: "qcm", ctx: "Olivia looked at the clock. It was nearly midnight, but she was still studying.", q: "What can we infer?", c: ["She has probably been studying for a long time.", "She has just woken up.", "She is going to school.", "She is preparing breakfast."], a: 0, ex: "Studying near midnight suggests she has been working late." },
        { t: "qcm", ctx: "Max opened the door and saw his grandparents standing outside with a large birthday cake.", q: "What is probably happening?", c: ["A school lesson", "A birthday celebration", "A football match", "A family argument"], a: 1, ex: "A birthday cake strongly suggests a birthday celebration." },
        { t: "qcm", ctx: "The road was covered with ice. The driver slowed down and drove very carefully.", q: "Why did the driver slow down?", c: ["The road was empty.", "He was looking for a shop.", "The road was dangerous and slippery.", "He wanted to stop for lunch."], a: 2, ex: "Ice makes the road slippery and dangerous." },
        { t: "qcm", ctx: "Kate put her swimming costume, towel and goggles into a bag.", q: "Where is she probably going?", c: ["To the library.", "To the cinema.", "To school.", "To the swimming pool."], a: 3, ex: "A swimsuit, towel and goggles are used for swimming." },
        { t: "qcm", ctx: "“Could you close the window, please?” asked Mrs Brown. “It's getting cold.”", q: "What does Mrs Brown want?", c: ["The window closed.", "The door opened.", "The lights turned off.", "The heating turned off."], a: 0, ex: "She explicitly asks someone to close the window." },
      ]
    },
    {
      id: "qcmEn8",
      name: "QCM CE1D · Mixed CE1D",
      desc: "Banque QCM 200 questions CE1D Anglais — 25 questions, avec correction et explication.",
      items: [
        { t: "qcm", q: "Choose the correct sentence.", c: ["He don't like football.", "He doesn't likes football.", "He doesn't like football.", "He not like football."], a: 2, ex: "With “he”, use “doesn't + base verb”: doesn't like." },
        { t: "qcm", q: "Choose the correct question.", c: ["Where you live?", "Where do you live?", "Where does you live?", "Where are you live?"], a: 1, ex: "Present simple questions with “you” use “do”." },
        { t: "qcm", q: "Choose the correct sentence.", c: ["She can sings.", "She can singing.", "She can sing.", "She can to sing."], a: 2, ex: "After a modal verb such as “can”, use the base verb." },
        { t: "qcm", q: "Choose the correct sentence.", c: ["I have 14 years old.", "I am 14 years old.", "I do 14 years old.", "I make 14 years old."], a: 1, ex: "In English, age is expressed with the verb “to be”." },
        { t: "qcm", q: "Choose the correct sentence.", c: ["There is three books.", "There are three books.", "There have three books.", "There be three books."], a: 1, ex: "“Books” is plural, so we use “there are”." },
        { t: "qcm", q: "Choose the correct sentence.", c: ["There is a cat under the table.", "There are a cat under the table.", "There be a cat under the table.", "There have a cat under the table."], a: 0, ex: "“A cat” is singular, so we use “there is”." },
        { t: "qcm", q: "What is the correct plural of child?", c: ["Childs", "Childes", "Children", "Childrens"], a: 2, ex: "“Children” is the irregular plural of “child”." },
        { t: "qcm", q: "What is the correct plural of person?", c: ["Persons", "People", "Peoples", "Persones"], a: 1, ex: "“People” is the common plural of “person”." },
        { t: "qcm", q: "Which word is a question word for time?", c: ["Where", "Who", "When", "Why"], a: 2, ex: "“When?” asks about time." },
        { t: "qcm", q: "Which question word asks about a reason?", c: ["Why", "Where", "Who", "What"], a: 0, ex: "“Why?” asks for a reason." },
        { t: "qcm", q: "Which question word asks about a place?", c: ["When", "Where", "Why", "Who"], a: 1, ex: "“Where?” asks about a place." },
        { t: "qcm", q: "Which question word asks about a person?", c: ["What", "Where", "Who", "When"], a: 2, ex: "“Who?” asks about a person." },
        { t: "qcm", q: "Choose the correct sentence.", c: ["I am going to visit my grandmother tomorrow.", "I going visit my grandmother tomorrow.", "I am go to visit my grandmother tomorrow.", "I am going visit my grandmother tomorrow."], a: 0, ex: "The correct “going to” structure is “am going to + verb”." },
        { t: "qcm", q: "Choose the correct sentence.", c: ["We was at home yesterday.", "We were at home yesterday.", "We are at home yesterday.", "We be at home yesterday."], a: 1, ex: "The past form of “be” with “we” is “were”." },
        { t: "qcm", q: "Choose the correct sentence.", c: ["She have got a brother.", "She has got a brother.", "She having got a brother.", "She haves got a brother."], a: 1, ex: "With “she”, use “has got”." },
        { t: "qcm", ctx: "Ben usually walks to school, but today he is taking the bus because it is raining.", q: "Why is Ben taking the bus today?", c: ["He is tired.", "He has no bicycle.", "It is raining.", "He is late."], a: 2, ex: "The text explicitly gives the reason: it is raining." },
        { t: "qcm", ctx: "Lucy loves reading. She goes to the library every Saturday and usually borrows two books.", q: "What does Lucy usually do on Saturdays?", c: ["She goes swimming.", "She goes to the library.", "She plays football.", "She watches films."], a: 1, ex: "The text says she goes to the library every Saturday." },
        { t: "qcm", q: "Choose the correct sentence.", c: ["My father drive to work every day.", "My father drives to work every day.", "My father driving to work every day.", "My father is drive to work every day."], a: 1, ex: "“My father” is third-person singular, so “drive” becomes “drives”." },
        { t: "qcm", q: "Choose the correct sentence.", c: ["They is watching TV.", "They are watching TV.", "They am watching TV.", "They watching TV."], a: 1, ex: "Present continuous with “they”: they are watching." },
        { t: "qcm", q: "Choose the correct sentence.", c: ["I went to London last year.", "I go to London last year.", "I goed to London last year.", "I going to London last year."], a: 0, ex: "“Go” has the irregular past form “went”." },
        { t: "qcm", ctx: "Amy wanted to buy a present for her brother. She went to the shopping centre and found a blue T-shirt on sale.", q: "What did Amy buy?", c: ["A blue T-shirt.", "A pair of shoes.", "A book.", "A football."], a: 0, ex: "The text says she found a blue T-shirt on sale." },
        { t: "qcm", q: "Choose the correct answer:\n“Would you like some coffee?”", c: ["Yes, please.", "Yes, I am.", "Yes, I do.", "Yes, I can."], a: 0, ex: "“Yes, please” is a natural answer to an offer." },
        { t: "qcm", q: "Choose the correct answer:\n“How often do you play football?”", c: ["At five o'clock.", "In the park.", "Twice a week.", "With my brother."], a: 2, ex: "“How often?” asks about frequency." },
        { t: "qcm", q: "Choose the correct answer:\n“Where did you go yesterday?”", c: ["I went to the cinema.", "I go to the cinema.", "I am at the cinema.", "I will go tomorrow."], a: 0, ex: "The question is in the past, so “I went...” is correct." },
        { t: "qcm", ctx: "Sarah has an important English test tomorrow. Tonight, she is reviewing vocabulary, grammar and irregular verbs. She wants to feel confident tomorrow morning.", q: "Why is Sarah studying tonight?", c: ["She has nothing else to do.", "She wants to prepare for her English test.", "She doesn't like English.", "She wants to go shopping."], a: 1, ex: "The text clearly says she has an English test tomorrow and is studying to prepare for it." },
      ]
    }
  ]
};
