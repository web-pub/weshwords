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
  ]
};
