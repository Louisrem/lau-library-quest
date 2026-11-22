/**
 * ============================================================================
 * L'ASSISTANTE DU VILAIN & LE MULTIVERS DE LAU.LIBRARYYY
 * ============================================================================
 * Fichier de données narratives, Lore, Dialogues, Mini-Jeux, Tarot, Maisons
 * d'Aldryn, Grimoire des Livres et Récompenses par défaut (Jours 1 à 24).
 *
 * Exports globaux :
 * - window.STORY_INTRO
 * - window.ALDRYN_HOUSES
 * - window.ADVENT_DAYS_DATA
 * - window.DEFAULT_REWARDS
 * - window.MULTIVERSE_LIBRARY_CATALOG
 * ============================================================================
 */

(function () {
  "use strict";

  // ==========================================================================
  // 1. STORY INTRO & PROLOGUE DU MANOIR
  // ==========================================================================
  window.STORY_INTRO = {
    gameTitle: "L'Assistante du Vilain & Le Multivers de @lau.libraryyy",
    gameSubtitle: "Calendrier de l'Avent RPG Littéraire — 24 Jours dans nos Livres & Souvenirs",
    heroineName: "Laure",
    heroineHandle: "@lau.libraryyy",
    heroineTitle: "Grande Archiviste du Multivers & Assistante Principale du Vilain",
    villainName: "Le Vilain (Ton Chéri)",
    villainTitle: "Seigneur des Ténèbres, Sponsor Officiel de ta PAL & Fan n°1 de Babel",
    companionName: "Kingsley",
    companionTitle: "Batracien Royal à Couronne d'Or & Porteur de Pancartes",
    epigraph:
 "« Certains construisent des empires avec des épées. Nous, on les a construits entre deux stands à Trolls & Légendes, une pinte belge à la main, sous la pluie d'Irlande et devant des alertes Vinted improbables. »",
    prologueSlides: [
      {
        id: "prologue_1",
 title: "Acte I — L'anomalie de la grande bibliothèque",
 speaker: "villain",
        name: "Le Vilain",
        avatar: "assets/villain_boyfriend.png",
        mood: "dramatic",
 text: "Approche, ma chère Assistante... Pendant que tu réorganisais les étagères sacrées de @lau.libraryyy, une faille astrale a fait exploser la frontière entre nos souvenirs et tes romans préférés. De Daevabad aux falaises d'Aldryn, de l'Académie de Caten jusqu'aux tavernes de Mons, tout s'est entremêlé !"
      },
      {
        id: "prologue_2",
 title: "Acte II — Les 24 sceaux du sanctuaire",
 speaker: "kingsley",
        name: "Kingsley",
        avatar: "assets/kingsley_frog.png",
        mood: "excited",
 text: "*CROÂ !* [Lève une pancarte dorée : « 24 PORTES. 24 ÉCLATS DE RUNE. 24 TRÉSORS CACHÉS DANS LE MANOIR ! »] (Traduction officielle d'Evie Sage : chaque jour de décembre jusqu'à Noël, une porte du multivers s'ouvre sur un défi corsé inspiré de tes lectures.)"
      },
      {
        id: "prologue_3",
 title: "Acte III — Les boss, la lune et le trésor final",
 speaker: "villain",
        name: "Le Vilain",
        avatar: "assets/villain_boyfriend.png",
        mood: "loving",
 text: "Méfie-toi des Jours 6, 12, 18 et 21 : quatre Boss Épiques y gardent tes plus gros cadeaux d'étape. Au Jour 4, le Rituel d'Aldryn t'accordera même un Sort de Lune permanent pour t'éclairer... Et le 24 décembre, si tu réunis les 24 Runes, le Sanctuaire Final s'ouvrira. Prête à prendre ton service, Assistante ?"
      }
    ],
    rulesSummary: [
      "Un nouveau chapitre littéraire se débloque chaque jour du 1er au 24 décembre.",
      "Chaque victoire forge 1 Éclat de Rune (1/24 à 24/24), tire une Carte de Tarot de la Providence et révèle ton Butin du Jour (Cadeau IRL caché ou Bon Royal).",
      "Au Jour 4 (Curious Tides), tu passeras le Rituel des Marées d'Aldryn qui déterminera ta Maison Lunaire et débloquera le Sort de Lune Permanent (1 indice lunaire gratuit par jour).",
      "Les Jours 6, 12, 18 et 21 sont des Combats de Boss Épiques liés à des cadeaux majeurs. Le Jour 24 est l'Apothéose Légendaire !"
    ]
  };

  // ==========================================================================
  // 2. MAISONS D'ALDRYN (CURIOUS TIDES - JOUR 4 & POUVOIR PERMANENT)
  // ==========================================================================
  window.ALDRYN_HOUSES = {
    NEW_MOON: {
      id: "NEW_MOON",
      name: "Maison de la Nouvelle Lune",
      englishName: "House of the New Moon",
      motto: "« Ce que l'ombre engloutit, la mémoire le murmure aux profondeurs. »",
      affinity: "Ombres, Secrets Occultes & Enquêtes Nocturnes",
      archetype: "Veilleuse des Abysses d'Aldryn (Lignée d'Emory & des Noyés)",
      totemName: "La Phalène des Abysses Étoilées",
      totemIcon: "🌑",
      totemSvg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" stroke="#C5A059" stroke-width="2" fill="#0B0F19"/><path d="M20 32C24 22 40 22 44 32C40 42 24 42 20 32Z" stroke="#8B5CF6" stroke-width="2"/><circle cx="32" cy="32" r="4" fill="#C5A059"/></svg>`,
      colorPrimary: "#6D28D9",
      colorAccent: "#C5A059",
      spellName: "Murmure des Noyés d'Aldryn",
      spellDescription:
        "Invoque les ombres de la Crique de Dover pour révéler gratuitement l'Indice Lunaire de n'importe quelle énigme du calendrier.",
 description:
        "Comme ceux qui entendent l'appel des Noyés sous les falaises d'Aldryn, tu lis entre les lignes, tu débusques les complots avant la fin du chapitre (même dans les thrillers de Freida McFadden ou La Femme de l'Ombre) et tu gardes farouchement les secrets de la bibliothèque."
    },
    WAXING_MOON: {
      id: "WAXING_MOON",
      name: "Maison de la Lune Croissante",
      englishName: "House of the Waxing Moon",
      motto: "« Avec la marée montante s'éveillent les mondes que l'on ose rêver. »",
      affinity: "Création, Marées Montantes & Alchimie des Mots",
      archetype: "Tisseuse de Marées & d'Encre Enchantée (Lignée d'Emory & Iris Winnow)",
      totemName: "Le Cerf d'Écume & de Laiton",
      totemIcon: "🌒",
      totemSvg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" stroke="#C5A059" stroke-width="2" fill="#0F172A"/><path d="M36 10A22 22 0 1 0 36 54A18 18 0 1 1 36 10Z" fill="#38BDF8" opacity="0.85"/></svg>`,
      colorPrimary: "#0284C7",
      colorAccent: "#F59E0B",
      spellName: "Flux de la Marée Montante",
      spellDescription:
        "Fait monter les eaux mystiques d'Aldryn pour illuminer instantanément l'Indice Lunaire d'un défi sans dépenser d'énergie.",
 description:
        "Ton cœur bat au rythme des univers foisonnants et des sagas qui grandissent tome après tome. Des papotages passionnés avec les autrices à la Foire du Livre de Mons jusqu'aux chroniques de @lau.libraryyy, ton enthousiasme fait lever des océans."
    },
    FULL_MOON: {
      id: "FULL_MOON",
      name: "Maison de la Pleine Lune",
      englishName: "House of the Full Moon",
      motto: "« Sous l'astre souverain, aucune chaîne ni aucun trône ne nous résiste. »",
      affinity: "Force Pure, Flamme Souveraine & Volonté Indomptable",
      archetype: "Souveraine des Marées Hautes (Lignée de Keiran, Nahri & Rin)",
      totemName: "Le Phénix d'Argent & de Feu",
      totemIcon: "🌕",
      totemSvg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" fill="#FDE68A" stroke="#C5A059" stroke-width="3"/><circle cx="24" cy="26" r="4" fill="#D97706" opacity="0.35"/><circle cx="38" cy="38" r="6" fill="#D97706" opacity="0.35"/></svg>`,
      colorPrimary: "#D97706",
      colorAccent: "#FEF08A",
      spellName: "Éclat du Zénith Sélène",
      spellDescription:
        "Frappe le sceau d'un rayon de Pleine Lune pure pour dévoiler l'Indice Lunaire secret de n'importe quel jour.",
 description:
        "Flamboyante, entière et passionnée ! Quand tu aimes un livre (coucou La Cité de Laiton ou The Will of the Many), tu le défends jusqu'au bout ; et quand un roman est surcoté (coucou Fourth Wing ou Babel), aucun mortel ne peut te faire dire le contraire !"
    },
    WANING_MOON: {
      id: "WANING_MOON",
      name: "Maison de la Lune Décroissante",
      englishName: "House of the Waning Moon",
      motto: "« Quand la mer se retire, seule la vérité nue demeure sur le sable. »",
      affinity: "Divination, Mémoire Ancienne & Esprit Critique",
      archetype: "Oracle des Reliques & des Brumes (Lignée de Baz, Paige Mahoney & Elspeth)",
      totemName: "Le Corbeau d'Obsidienne & de Brume",
      totemIcon: "🌘",
      totemSvg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" stroke="#C5A059" stroke-width="2" fill="#1E1B4B"/><path d="M28 10A22 22 0 1 1 28 54A18 18 0 1 0 28 10Z" fill="#A855F7" opacity="0.85"/></svg>`,
      colorPrimary: "#7E22CE",
      colorAccent: "#E9D5FF",
      spellName: "Clairvoyance du Reflux Astral",
      spellDescription:
        "Sonde la mémoire des astres d'Aldryn pour extraire gratuitement l'Indice Lunaire caché dans l'énigme.",
 description:
        "Gardienne de la mémoire du couple et critique littéraire redoutable ! Tu te souviens de chaque détail d'intrigue, de chaque conversation à Trolls & Légendes, et tu sais exactement pourquoi seuls certains tomes méritent d'entrer au panthéon de @lau.libraryyy."
    }
  };

  // ==========================================================================
  // 3. CATALOGUE COMPLET DU GRIMOIRE DE @LAU.LIBRARYYY (TOUS LES LIVRES CITÉS)
  // ==========================================================================
  window.MULTIVERSE_LIBRARY_CATALOG = [
    { title: "La Cité de Laiton (Trilogie Daevabad)", author: "S.A. Chakraborty", tier: "Panthéon Absolu", note: "Saga préférée entre toutes ! Nahri, Dara, Ali et le feu de Daevabad.", featuredDays: [3, 15, 18, 24] },
    { title: "Assistant to the Villain", author: "Hannah Nicole Maehrer", tier: "Coup de Cœur & Fil Rouge", note: "Evie Sage, le Vilain et évidemment Kingsley la grenouille à pancartes !", featuredDays: [1, 22, 24] },
    { title: "The Will of the Many", author: "James Islington", tier: "Lecture Commune Légendaire", note: "Lu en lecture commune en amoureux, Tome 2 tout juste acheté !", featuredDays: [6, 18, 23, 24] },
    { title: "The Bone Season", author: "Samantha Shannon", tier: "Épopée Vinted & Retraite Lecture", note: "Tome 1 lu en retraite lecture. Tomes 2, 3 et 4 achetés reliés une fortune sur Vinted 1 mois avant la réédition (et toujours pas lus !).", featuredDays: [2, 18] },
    { title: "Curious Tides", author: "Pascale Lacelle", tier: "Coup de Cœur Lunaire", note: "Les Maisons d'Aldryn, Emory et Baz — en attente fervente du Tome 2 !", featuredDays: [4, 14, 18] },
    { title: "L'Effondrement, T1 : Là où poussent les coquelicots", author: "Rencontre Foire du Livre de Mons", tier: "Souvenir Dédié à Mons", note: "Long papotage inoubliable avec l'autrice à Mons sur son inspiration du jeu vidéo Hades !", featuredDays: [4] },
    { title: "Ceux qu'on implore à la terre", author: "Nell Pfeiffer", tier: "Pépite Trolls & Légendes", note: "Découvert et adoré grâce aux rencontres de Trolls & Légendes à Mons.", featuredDays: [10] },
    { title: "Les Carmidors (Tomes 1, 2 et 3)", author: "Olivia Gometz", tier: "Trilogie Coup de Cœur", note: "Trilogie complète dévorée après nos discussions passionnées en festival.", featuredDays: [10, 18] },
    { title: "Un passé englouti (A Study in Drowning)", author: "Ava Reid", tier: "Coup de Cœur Gothique", note: "Ambiance brumeuse et Roi des Aulnes — il faut absolument lire le Tome 2 !", featuredDays: [10, 18] },
    { title: "N'invite pas la forêt à entrer", author: "C.G. Drews", tier: "Souvenir d'Irlande", note: "Lu pendant notre voyage en amoureux en Irlande, entre brumes et forêts anciennes.", featuredDays: [7, 24] },
    { title: "The Poppy War (La Guerre du Pavot)", author: "R.F. Kuang", tier: "Flamme Épique", note: "Rin et l'Académie de Sinegard — vivement la lecture du Tome 3 !", featuredDays: [12, 18] },
    { title: "La Rage des Dragons", author: "Evan Winter", tier: "Fureur & Vengeance", note: "Tau Solarin et les brasiers de l'Isihogo + La Flamme des Dragons.", featuredDays: [12] },
    { title: "Gild (La Saga d'Auren)", author: "Raven Kennedy", tier: "Or & Ombres", note: "Les rubans d'or d'Auren et les ombres du Commandant Rip / Slade.", featuredDays: [13, 24] },
    { title: "Les Aventures d'Amina al-Sirafi", author: "S.A. Chakraborty", tier: "Piraterie Mystique", note: "Le navire Le Maram sur l'océan Indien, par la reine S.A. Chakraborty.", featuredDays: [15] },
    { title: "Divines Rivalités, Impitoyables Serments & Féroce Déférence", author: "Rebecca Ross", tier: "Romantisme Épistolaire", note: "La machine à écrire magique d'Iris Winnow et Roman Kitt + Enva & Dacre.", featuredDays: [16] },
    { title: "Blood Over Bright Haven & A Forbidden Alchemy", author: "M.L. Wang / Stacey McEwan", tier: "Alchimie Sombre", note: "Sciona à Tiran et les secrets alchimiques interdits.", featuredDays: [17] },
    { title: "La Femme de l'Ombre & Thrillers Freida McFadden", author: "Loreth Anne White / Freida McFadden", tier: "Frissons & Huis Clos", note: "Chambres mansardées verrouillées, twists et enquêtes sous haute tension.", featuredDays: [18] },
    { title: "Fenêtre sur les Ténèbres & Deux Couronnes Corrompues", author: "Rachel Gillig", tier: "Cartes de la Providence", note: "Elspeth Spindle, le Cauchemar (Roi des Bergers) et les brumes de Pierres-Claires.", featuredDays: [19] },
    { title: "Red City", author: "Marie Lu", tier: "Coup de Cœur Majeur", note: "Alchimie moderne, sociétés secrètes et tension électrique — un de ses grands favoris !", featuredDays: [20, 24] },
    { title: "Gods of Men & The Poet Empress", author: "Barbara Kloss / Shen Tao", tier: "Magie & Poésie Impériale", note: "Mondes âpres, musique magique et vers dangereux.", featuredDays: [20] },
    { title: "This Kingdom Will Not Kill Me & Rose in Chains", author: "Ilona Andrews / Julie Soto", tier: "Complots Royaux", note: "Survivre aux intrigues de cour et briser ses chaînes.", featuredDays: [21] },
    { title: "L'Effet Boule de Neige & Happy Place", author: "Clara Héraut / Emily Henry", tier: "Douceur & Cocooning", note: "Romance sous les flocons et nostalgie lumineuse entre amis.", featuredDays: [22] },
    { title: "Un destin forgé dans le feu, La Voie Éternelle (The Raven Scholar) & A Monsoon Rising", author: "Hazel McBride / Antonia Hodgson / Thea Guanzon", tier: "Sentinelles du Sanctuaire", note: "Forgerons célestes, érudits du Corbeau et moussons guerrières.", featuredDays: [21, 23] },
    { title: "Heartless Hunter (The Crimson Moth) & Rebel Witch", author: "Kristen Ciccarelli", tier: "Duel Écarlate", note: "Rune Winters (la Phalène Écarlate) face à Gideon Sharpe.", featuredDays: [8] },
    { title: "Spark of the Everflame (Kindred's Curse)", author: "Penn Cole", tier: "Flamme Éternelle", note: "Diem Bellator, Luther Corbois et l'étincelle des Descendants.", featuredDays: [9, 18] },
    { title: "The Prison Healer", author: "Lynette Noni", tier: "Standalone Officiel du Cœur", note: "Dans le canon de Laure, SEUL le Tome 1 à Zalindov existe. Point final !", featuredDays: [11] },
    { title: "Yellowface & La Maison des Sortilèges (Weyward)", author: "R.F. Kuang / Emilia Hart", tier: "Satire & Sorcellerie", note: "Le vol du manuscrit d'Athena Liu et les trois lignées de sorcières de Weyward.", featuredDays: [11] },
    { title: "Babel", author: "R.F. Kuang", tier: "Le Grand Débat du Couple", note: "Chef-d'œuvre absolu selon le Vilain... très moyen selon Laure !", featuredDays: [5, 11] },
    { title: "Fourth Wing", author: "Rebecca Yarros", tier: "Verdict : Surcoté !", note: "Tairn et Xaden Riorson sont là, mais BookTok a clairement exagéré.", featuredDays: [5] },
    { title: "Jade City (Les Os d'Émeraude)", author: "Fonda Lee", tier: "DNF après le Tome 1", note: "Les clans de Janloon (Sans-Cime et Montagne) sont restés au Tome 1.", featuredDays: [5] },
    { title: "Une braise sous la cendre", author: "Sabaa Tahir", tier: "Classique Ardent", note: "Laia, Elias et l'Académie de Blackcliff.", featuredDays: [12, 18] },
    { title: "Powerless, Une saison pour mourir & Les mémoires d'un expert psychiatre", author: "Lauren Roberts / & Co.", tier: "Étagères Secrètes du Manoir", note: "Entre joutes mortelles, thrillers glaçants et dossiers psychiatriques.", featuredDays: [11, 18] },
    { title: "Un royaume de griffes, L'ombre du savoir perdu & Bénie de Césaré", author: "Archives Fantastiques", tier: "Grimoires du Sanctuaire", note: "Griffes anciennes, bibliothèques oubliées et bénédictions impériales.", featuredDays: [17, 21] },
    { title: "Le trône d'Orlane Grey, Nous deux et la lune & Contes de l'aura", author: "Chroniques Étoilées", tier: "Veillées Lunaires", note: "Couronnes rebelles, promesses sous la lune et halos mystiques.", featuredDays: [14, 22] },
    { title: "Porcelaine sous les ruines & Le refrain de la rivière", author: "Reliques Poétiques", tier: "Chants de Cristal", note: "Éclats délicats sous la cendre et murmures d'eau vive.", featuredDays: [19, 23] }
  ];

  // ==========================================================================
  // 4. LES 24 JOURS DU CALENDRIER RPG (ADVENT_DAYS_DATA)
  // ==========================================================================
  window.ADVENT_DAYS_DATA = [
    // ========================================================================
    // SEMAINE 1 : LE BUREAU DU VILAIN & L'ACADÉMIE (JOURS 1 À 6)
    // ========================================================================
    {
      day: 1,
      week: 1,
 title: "Entretien d'embauche chez le Vilain",
 subtitle: "Assistant to the Villain — Hannah Nicole Maehrer",
      books: ["Assistant to the Villain"],
      rarity: "common",
      tarotArcana: "0. L'Assistante & Le Batracien Couronné",
      tarotSymbol: "👑🐸",
      location: "Hall d'Entrée du Manoir de Mornebois",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "smirk",
 text: "Bienvenue dans mon repaire, @lau.libraryyy. Puisque tu as survécu à mes blagues douteuses, aux files d'attente de la Foire du Livre de Mons et à mon amour inconditionnel pour *Babel*, tu es officiellement promue Assistante Principale du Vilain."
        },
        {
 speaker: "kingsley",
          name: "Grenouille Mystérieuse",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*Croâ.* [Sort de derrière une pile de têtes coupées factices et brandit une petite pancarte écrite à la craie : « URGENCE CAFÉ & MOT DE PASSE REQUIS »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "loving",
 text: "Ah. Le directeur des ressources humaines veut vérifier que tu as bien lu tes classiques avant d'ouvrir le premier coffre de décembre. Déchiffre son identité royale et valide la règle n°1 du bureau, Evie Sage !"
        }
      ],
      gameType: "password",
      gameConfig: {
        promptTitle: "L'Énigme de la Pancarte d'Émeraude",
        riddleText:
 "« Je porte une couronne d'or mais je n'ai pas de voix,\nJ'accompagne Evie Sage et le Vilain sous ce toit.\nEn huit lettres royales, écris mon vrai prénom,\nPuis choisis la règle d'or qui régit ce donjon ! »",
        expectedAnswers: ["KINGSLEY", "LE ROI KINGSLEY", "ROI KINGSLEY"],
        placeholder: "Tape le nom du fidèle batracien royal...",
        bonusQuestion: {
          question: "Question Bonus de Mise en Route : Quelle est la Règle N°1 absolue dans le bureau du Vilain (et dans notre couple) ?",
          options: [
            { id: "a", text: "Ne jamais toucher aux reliés collectors sans s'être lavé les mains (et toujours prévoir un café chaud)" },
            { id: "b", text: "Toujours dire à tout le monde que le Vilain est un être doux, inoffensif et fan de Fourth Wing" },
            { id: "c", text: "Vendre tous les livres de S.A. Chakraborty pour acheter l'intégrale de Jade City" },
            { id: "d", text: "Ignorer les pancartes de la grenouille et ranger les dossiers par couleur de chaussettes" }
          ],
          correctOptionId: "a",
          wrongFeedback: "Sacrilège ! Même Trystan Maverine s'étoufferait avec son thé en entendant ça."
        },
        hints: [
 "Indice 1 : C'est le prénom du petit prince transformé en grenouille qui communique avec des pancartes dans *Assistant to the Villain* (commence par K et finit par Y).",
 "Indice Lunaire : Son nom commence par « KING » (comme un roi !) suivi de « SLEY »."
        ],
        victoryLore:
          "Kingsley lève une nouvelle pancarte : « EMBAUCHÉE ! (ET BRAVO POUR LES RELIÉS COLLECTORS) ». Le premier sceau du Manoir cède dans un tourbillon d'étincelles dorées !"
      },
      defaultLoot: {
 title: "Kit d'intégration de l'assistante du Vilain",
        category: "IRL_GIFT",
 description:
          "Un premier présent de bienvenue scellé par Kingsley lui-même pour inaugurer tes 24 jours de règne au Manoir.",
        irlClue:
          "Va inspecter l'endroit où l'on prépare les élixirs chauds du matin (près de la machine à café ou des mugs préférés de l'Assistante) : le paquet n°1 t'y attend !",
        keyFragmentName: "Rune I — La Couronne d'Émeraude de Kingsley (1/24)"
      }
    },

    // ========================================================================
    // JOUR 2 — THE BONE SEASON & LA LÉGENDE VINTED
    // ========================================================================
    {
      day: 2,
      week: 1,
 title: "La malédiction des reliés de Vinted",
 subtitle: "The Bone Season — Samantha Shannon ( & Notre Retraite Lecture)",
      books: ["The Bone Season"],
      rarity: "common",
      tarotArcana: "II. L'Onirophage & Le Colis Vinted",
      tarotSymbol: "📦🔮",
      location: "Aile des Reliques Hors de Prix (Couloir Scion-Londres)",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "laughing",
 text: "Stop ! Ne bouge plus ! Le couloir est bloqué par une barricade mystique composée de trois énormes tomes reliés d'occasion qui brillent d'une aura d'ironie financière..."
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "cheeky",
 text: "*Croâ !* [Pancarte : « ALERTE VINTED : ACHETÉS UNE FORTUNE. JAMAIS OUVERTS. RÉÉDITÉS 30 JOURS PLUS TARD. »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "smirk",
 text: "Ah, notre fameuse retraite lecture sur le Tome 1 de *The Bone Season*... Suivie de ta traque héroïque des tomes 2, 3 et 4 en relié sur Vinted ! Pour franchir cette barricade, tu dois affronter le Quiz Troll & Lore de Scion sans perdre ton sang-froid."
        }
      ],
      gameType: "troll_quiz",
      gameConfig: {
        promptTitle: "Le Tribunal de Scion & de Vinted (3 Épreuves)",
        questions: [
          {
            id: "q1_vinted",
            question:
              "Épreuve 1 (Le Timing Légendaire) : Combien de temps s'est écoulé entre ton achat héroïque (et ruineux) des tomes 2, 3 et 4 de *The Bone Season* en relié d'occasion sur Vinted et l'annonce officielle de leur toute nouvelle réédition ?",
            options: [
              { id: "opt1", text: "Environ 10 ans, le temps que George R.R. Martin finisse son prochain chapitre" },
              { id: "opt2", text: "Environ 1 petit mois à peine — le timing le plus cruel de l'histoire de l'édition (la haine absolue)" },
              { id: "opt3", text: "Exactement 4 ans et demi, après une prophétie des Rephaïm" },
              { id: "opt4", text: "Ils n'ont jamais été réédités, cet achat était un placement boursier digne de Wall Street" }
            ],
            correctOptionId: "opt2",
            explanation: "Un mois. Trente petits jours. Même l'Arcturus aurait pleuré devant la facture Vinted !"
          },
          {
            id: "q2_paige",
            question:
              "Épreuve 2 (Le Lore de la Retraite Lecture) : Dans le Tome 1 de *The Bone Season* (le seul lu pendant notre retraite lecture !), quelle est la rare capacité de voyance de Paige Mahoney au sein de la pègre de Scion-Londres ?",
            options: [
              { id: "opt1", text: "Elle est Onirophage (Dreamwalker / Marchande de rêves), capable de voyager dans l'Éther et d'entrer dans l'esprit d'autrui" },
              { id: "opt2", text: "Elle est Cartomancienne de la Providence et invoque le Roi des Bergers avec des cartes" },
              { id: "opt3", text: "Elle est Nécromancienne d'Argent et grave des barres de traduction à Oxford" },
              { id: "opt4", text: "Elle est Dompteuse de Rephaïm à dos de dragon noir grincheux" }
            ],
            correctOptionId: "opt1",
            explanation: "Exact ! La fameuse Marchande de rêves (Dreamwalker / Onirophage) de la cohorte de Jaxon Hall !"
          },
          {
            id: "q3_unread",
            question:
              "Épreuve 3 (L'Autopsie de la PAL) : Soyons honnêtes devant le Conseil du Manoir... Combien de ces fameux tomes 2, 3 et 4 reliés chèrement acquis sur Vinted ont été lus depuis cette épopée ?",
            options: [
              { id: "opt1", text: "Les trois, annotés en quatre couleurs avec une thèse comparative" },
              { id: "opt2", text: "Deux sur trois, lus en cachette pendant Trolls & Légendes" },
              { id: "opt3", text: "ZÉRO. Pas une page. Ils trônent fièrement sur l'étagère comme des trophées intouchables !" },
              { id: "opt4", text: "Un demi-chapitre lu à l'envers sous la pluie irlandaise" }
            ],
            correctOptionId: "opt3",
            explanation: "Zéro pointé ! Mais avouons-le : ils sont magnifiques sur l'étagère de @lau.libraryyy."
          }
        ],
        hints: [
 "Indice 1 : Souviens-toi du traumatisme Vinted (30 jours avant l'annonce !), du don de voyage dans les rêves de Paige Mahoney (Onirophage), et du fait que les tomes 2, 3 et 4 attendent toujours sagement sur l'étagère.",
 "Indice Lunaire : Réponses dans l'ordre : ~1 mois avant la réédition / Onirophage (Marchande de rêves) / ZÉRO tome lu depuis !"
        ],
        victoryLore:
          "Les trois tomes reliés de *The Bone Season* s'écartent respectueusement en lévitant. Paige Mahoney et Warden saluent ta franchise (et ton budget collectionneuse) !"
      },
      defaultLoot: {
 title: "Trophée de consolation de l'investisseuse Vinted",
        category: "IRL_GIFT",
 description:
          "Un trésor garanti 100% neuf, sans réédition surprise dans 30 jours, validé par le syndicat des Onirophages de Scion.",
        irlClue:
          "Cherche précisément sur ton étagère juste à côté (ou derrière) les fameux tomes reliés 2, 3 et 4 de *The Bone Season* qui attendent d'être lus !",
        keyFragmentName: "Rune II — L'Anémone Blanche de Scion (2/24)"
      }
    },

    // ========================================================================
    // JOUR 3 — LA CITÉ DE LAITON (BOOK-WORDLE DAEVABAD)
    // ========================================================================
    {
      day: 3,
      week: 1,
 title: "Le portail de flammes du désert",
 subtitle: "La Cité de Laiton (Trilogie Daevabad) — S.A. Chakraborty",
      books: ["La Cité de Laiton", "Le Royaume de Cuivre", "L'Empire d'Or"],
      rarity: "common",
      tarotArcana: "I. Le Magicien des Six Tribus & L'Anneau de Suleiman",
      tarotSymbol: "🔥🕌",
      location: "Remparts de Laiton au-dessus du Lac Émeraude",
      companion: "villain",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "dramatic",
 text: "Incline-toi, Assistante... Voici le sanctuaire de TA saga préférée entre toutes. L'air sent l'encens du Caire, la cendre des Éfrits et la magie ancienne des Nahids."
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*Croâ-flamme !* [Porte un petit turban brodé d'or et lève une pancarte : « TEAM DARA + NAHRI + ALI = CHEF-D'ŒUVRE ABSOLU »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "loving",
 text: "Sur le mur de laiton, le sceau de Suleiman exige un **Book-Wordle en 8 lettres**. Six essais maximum : l'Or indique une lettre bien placée, le Cuivre une lettre mal placée, et l'Obsidienne une lettre absente. Fais briller ton amour pour S.A. Chakraborty !"
        }
      ],
      gameType: "book_wordle",
      gameConfig: {
        promptTitle: "Le Wordle de Flammes de Suleiman (8 Lettres)",
        loreClue:
 "« Au-delà du voile de sable où Nahri a invoqué Dara par erreur, se dresse la légendaire cité aux murailles de laiton gouvernée par la famille Qahtani et divisée entre six tribus de Djinns... Quel est son nom en 8 lettres ? »",
        targetWord: "DAEVABAD",
        wordLength: 8,
        maxAttempts: 6,
        validBonusGuesses: ["SULEIMAN", "QAHTANI", "NAHRI", "AFSHIN", "GEZIRI", "SAHRAYN", "IFRIT", "MARID"],
        hints: [
 "Indice 1 : C'est le nom même de la cité cachée des Djinns où règnent les Nahids et la famille royale Qahtani (8 lettres, commence par D et finit par D).",
 "Indice Lunaire : Le mot contient trois fois la lettre A : D _ E V _ B _ D."
        ],
        victoryLore:
          "Les portes de laiton s'ouvrent dans un rugissement de flammes émeraude ! Au loin, Dara rengaine son cimeterre et Nahri te fait un clin d'œil complice depuis les jardins du palais."
      },
      defaultLoot: {
 title: "Relique de laiton de la Banu Nahida",
        category: "IRL_GIFT",
 description:
          "Une offrande digne de la cour royale de Daevabad, forgée sans une seule trace de fer pour ne blesser aucun Djinn.",
        irlClue:
          "Dirige-toi vers le sanctuaire de S.A. Chakraborty dans ta bibliothèque : regarde près de ta trilogie *La Cité de Laiton* !",
        keyFragmentName: "Rune III — Le Sceau de Flamme de Daevabad (3/24)"
      }
    },

    // ========================================================================
    // JOUR 4 — CURIOUS TIDES & FOIRE DU LIVRE DE MONS (RITUEL D'ALDRYN)
    // ========================================================================
    {
      day: 4,
      week: 1,
 title: "Le rituel des marées d'Aldryn et les coquelicots de Mons",
 subtitle: "Curious Tides (Pascale Lacelle) & L'Effondrement T1 : Là où poussent les coquelicots",
      books: ["Curious Tides", "L'Effondrement, tome 1 : Là où poussent les coquelicots"],
      rarity: "common",
      tarotArcana: "XVIII. La Lune d'Aldryn & Les Coquelicots des Enfers",
      tarotSymbol: "🌙🌺",
      location: "Observatoire Lunaire de la Crique de Dover (via la Foire du Livre de Mons)",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "loving",
 text: "Ce soir, la lune monte sur l'Académie d'Aldryn, ma chère Emory ! Mais regarde bien l'arche qui mène au bassin des Marées : elle est recouverte de coquelicots rouges tout droit sortis de notre expédition à la Foire du Livre de Mons."
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*Croâ-Mons !* [Pancarte : « ÉTAPE 1 : LE MOT DE PASSE DE L'AUTRICE À MONS / ÉTAPE 2 : TON RITUEL DE MAISON LUNAIRE ! »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "dramatic",
 text: "Tu te souviens de notre longue discussion passionnée à Mons avec l'autrice de *L'Effondrement, tome 1 : Là où poussent les coquelicots* ? Ouvre d'abord la Porte des Coquelicots grâce à son inspiration secrète, puis accomplis les 5 Dilemmes d'Aldryn pour découvrir ta Maison Lunaire et débloquer ton **Sort de Lune Permanent** !"
        }
      ],
      gameType: "aldryn_ritual",
      gameConfig: {
        partA: {
 title: "Partie A — La porte des coquelicots de la Foire du livre de Mons",
          loreDescription:
            "Lors de notre passage à la Foire du Livre de Mons, nous avons longuement papoté avec l'autrice de *L'Effondrement, tome 1 : Là où poussent les coquelicots*. Elle nous a confié qu'avant d'écrire son roman, son univers avait été directement inspiré par un célèbre jeu vidéo mythologique où l'on tente de s'échapper des Enfers grecs...",
          question: "Quel est le nom de ce jeu vidéo mythologique (et dieu des Enfers) qui a inspiré l'autrice de *L'Effondrement* ?",
          expectedAnswers: ["HADES", "HADÈS", "HADES II", "HADES 1"],
          placeholder: "Tape le nom du jeu vidéo (5 lettres)...",
 hint: "C'est le dieu grec des Enfers (et le jeu roguelike culte de Supergiant Games avec Zagreus) : H _ D _ S."
        },
        partB: {
 title: "Partie B — Le rituel des 5 dilemmes de marée d'Aldryn",
 subtitle:
            "Réponds avec ton cœur de lectrice. La Lune d'Aldryn analysera ton alignement astral pour révéler ta Maison de Marée, ton Totem Mystique et activer ton Sort de Lune Permanent dans l'inventaire !",
          dilemmas: [
            {
              id: "dilemma_1",
              question:
                "1. Minuit sonne à l'Académie d'Aldryn. En attendant la sortie du Tome 2 de *Curious Tides*, une porte secrète s'entrouvre sous la Crique de Dover. Que fais-tu ?",
              choices: [
                {
                  id: "c1_new",
                  house: "NEW_MOON",
 text: "Je me glisse dans l'ombre avec le journal de Romie pour déchiffrer la société secrète de l'Éclipse sans être vue."
                },
                {
                  id: "c1_waxing",
                  house: "WAXING_MOON",
 text: "J'appelle Baz pour explorer la bibliothèque engloutie et cartographier chaque constellation lunaire."
                },
                {
                  id: "c1_full",
                  house: "FULL_MOON",
 text: "J'invoque directement la marée haute face à Keiran pour forcer les Noyés à révéler la vérité."
                },
                {
                  id: "c1_waning",
                  house: "WANING_MOON",
 text: "J'analyse froidement chaque indice laissé sur le sable : personne ne me piège dans un mystère académique."
                }
              ]
            },
            {
              id: "dilemma_2",
              question:
                "2. Nous sommes en pleine Foire du Livre de Mons ou à Trolls & Légendes. Quelle est ta posture héroïque favorite ?",
              choices: [
                {
                  id: "c2_waxing",
                  house: "WAXING_MOON",
 text: "Papoter pendant vingt minutes avec les autrices de leurs inspirations secrètes et repartir avec des dédicaces plein les bras."
                },
                {
                  id: "c2_full",
                  house: "FULL_MOON",
 text: "Trinquer joyeusement avec mon chéri, défendre mes coups de cœur avec flamme et convertir tout le stand à S.A. Chakraborty !"
                },
                {
                  id: "c2_new",
                  house: "NEW_MOON",
 text: "Chasser la pépite indé introuvable au fond d'une allée brumeuse que personne d'autre n'a encore repérée."
                },
                {
                  id: "c2_waning",
                  house: "WANING_MOON",
 text: "Inspecter la pile de livres d'un œil d'experte pour éviter tout syndrome Vinted / réédition surprise !"
                }
              ]
            },
            {
              id: "dilemma_3",
              question:
                "3. Si la Lune d'Aldryn devait canaliser ta magie à travers un artefact de ta bibliothèque, lequel choisirais-tu ?",
              choices: [
                {
                  id: "c3_new",
                  house: "NEW_MOON",
 text: "Une fiole d'encre nocturne mêlée au sang des runes de la Phalène Écarlate (*Heartless Hunter*)."
                },
                {
                  id: "c3_waxing",
                  house: "WAXING_MOON",
 text: "La machine à écrire enchantée d'Iris Winnow et Roman Kitt (*Divines Rivalités*)."
                },
                {
                  id: "c3_full",
                  house: "FULL_MOON",
 text: "L'Anneau de Suleiman flamboyant au cœur de *La Cité de Laiton*."
                },
                {
                  id: "c3_waning",
                  house: "WANING_MOON",
 text: "La Carte de la Providence du Cauchemar dans les brumes de *Fenêtre sur les Ténèbres*."
                }
              ]
            },
            {
              id: "dilemma_4",
              question:
                "4. Ton chéri (le Vilain) tente une nouvelle fois de te convaincre que *Babel* est le plus grand chef-d'œuvre de l'histoire humaine. Ta réaction mystique ?",
              choices: [
                {
                  id: "c4_waning",
                  house: "WANING_MOON",
 text: "Je lève un sourcil implacable et je lui sors une argumentation critique en 4 points qui clôt le débat."
                },
                {
                  id: "c4_full",
                  house: "FULL_MOON",
 text: "Je brandis *The Will of the Many* et *La Cité de Laiton* en déclarant que mon trône littéraire est non-négociable !"
                },
                {
                  id: "c4_waxing",
                  house: "WAXING_MOON",
 text: "Je souris tendrement (parce que je l'aime quand même) et je lui propose une nouvelle lecture commune à la place."
                },
                {
                  id: "c4_new",
                  house: "NEW_MOON",
 text: "Je cache discrètement son exemplaire de *Babel* derrière la pile de *Red City* et *Curious Tides*."
                }
              ]
            },
            {
              id: "dilemma_5",
              question:
                "5. Enfin, quelle promesse murmures-tu à l'océan d'Aldryn pour le reste de cette aventure de l'Avent ?",
              choices: [
                {
                  id: "c5_new",
                  house: "NEW_MOON",
 text: "« Je percerai les secrets des 24 portes, même les énigmes les plus retorses du Manoir. »"
                },
                {
                  id: "c5_waxing",
                  house: "WAXING_MOON",
 text: "« Je savourerai chaque histoire, chaque souvenir de voyage et chaque page écrite à deux. »"
                },
                {
                  id: "c5_full",
                  house: "FULL_MOON",
 text: "« Je terrasserai les quatre Boss Épiques et j'ouvrirai le Coffre Légendaire du 24 décembre ! »"
                },
                {
                  id: "c5_waning",
                  house: "WANING_MOON",
 text: "« Je garderai en mémoire chaque clin d'œil de notre multivers, d'Aldryn aux forêts d'Irlande. »"
                }
              ]
            }
          ],
          unlocksPermanentLunarSpell: true
        },
        hints: [
 "Indice 1 : Pour la Porte de Mons (Partie A), pense au jeu vidéo culte où l'on incarne Zagreus, fils du dieu des Enfers grecs (5 lettres commençant par H).",
 "Indice Lunaire : Le mot de passe de la Partie A est HADES. Ensuite, réponds librement aux 5 questions du Rituel d'Aldryn pour recevoir ton Totem et ton Sort de Lune !"
        ],
        victoryLore:
          "Les eaux argentées de la Crique de Dover s'élèvent en couronne autour de toi ! Les coquelicots de Mons s'illuminent, ta Maison d'Aldryn est gravée dans les astres, et le **Sort de Lune Permanent** brille désormais dans ta barre d'inventaire pour t'aider sur tous les jours suivants !"
      },
      defaultLoot: {
 title: "Talisman des marées d'Aldryn et souvenir de Mons",
        category: "IRL_GIFT",
 description:
          "Un présent béni par la Lune d'Aldryn et par nos souvenirs de dédicaces à la Foire du Livre de Mons, accompagné de ton nouveau pouvoir lunaire permanent.",
        irlClue:
          "Regarde près de ton exemplaire de *Curious Tides* ou de *L'Effondrement* (là où reposent nos pépites dédicacées à Mons) !",
        keyFragmentName: "Rune IV — L'Astrolabe des Marées d'Aldryn (4/24)"
      }
    },

    // ========================================================================
    // JOUR 5 — LE CRYPTEX DES LECTURES "BOF" (BABEL, FOURTH WING, JADE CITY)
    // ========================================================================
    {
      day: 5,
      week: 1,
 title: "Le cryptex des lectures « bof » et surcotées",
 subtitle: "Babel (R.F. Kuang), Fourth Wing (Rebecca Yarros) & Jade City (Fonda Lee)",
      books: ["Babel", "Fourth Wing", "Jade City"],
      rarity: "common",
      tarotArcana: "V. Le Juge Implacable de BookTok",
      tarotSymbol: "⚖️🐉",
      location: "Chambre Forte des Avis Tranchés (Sous-sol du Manoir)",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "dramatic",
 text: "Aujourd'hui, j'ai mal à mon petit cœur de Vilain. Nous sommes devant le coffre où tu as enfermé à double tour les livres qui t'ont laissée de marbre... dont MON chef-d'œuvre adoré, *Babel* !"
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "laughing",
 text: "*Croâ-clash !* [Pancarte : « BABEL = MOYEN / FOURTH WING = SURCOTÉ / JADE CITY = ABANDONNÉ APRÈS LE TOME 1 ! »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "smirk",
 text: "Puisque tu affirmes avoir un esprit critique supérieur à la hype de BookTok, prouve que tu maîtrises quand même leur lore ! Aligne les **4 rouleaux de ce Cryptex mécanique** avec la première lettre de chaque réponse pour sceller ces livres une bonne fois pour toutes."
        }
      ],
      gameType: "cryptex",
      gameConfig: {
        promptTitle: "Le Cryptex à 4 Rouleaux de l'Esprit Critique",
        targetCode: "ATMR",
        dials: [
          {
            id: "dial_1",
            book: "Babel (R.F. Kuang)",
            clue: "Rouleau 1 (*Babel*) : Première lettre du métal précieux sur lequel sont gravées les barres de traduction magiques de l'Institut Royal d'Oxford.",
            targetLetter: "A",
            fullAnswerWord: "ARGENT",
            unlockQuip: "« A comme Argent ! » (Le Vilain murmure : 'Avoue quand même que le système de magie par étymologie était génial...' / Laure : 'Mouais, moyen !')"
          },
          {
            id: "dial_2",
            book: "Fourth Wing (Rebecca Yarros)",
            clue: "Rouleau 2 (*Fourth Wing*) : Première lettre du nom du grand dragon noir grincheux (et sarcastique) qui choisit de se lier à Violet Sorrengail.",
            targetLetter: "T",
            fullAnswerWord: "TAIRN",
            unlockQuip: "« T comme Tairn ! » (Seul personnage à peu près épargné par le verdict implacable de @lau.libraryyy sur ce phénomène surcoté.)"
          },
          {
            id: "dial_3",
            book: "Jade City (Fonda Lee)",
            clue: "Rouleau 3 (*Jade City*) : Première lettre du nom (en français ou en anglais !) du clan rival du clan Sans-Cime (No Peak) à Janloon.",
            targetLetter: "M",
            fullAnswerWord: "MONTAGNE / MOUNTAIN",
            unlockQuip: "« M comme le clan de la Montagne (Mountain) ! » (Qui attendra éternellement que tu lises le tome 2... spoiler : ça n'arrivera jamais.)"
          },
          {
            id: "dial_4",
            book: "Fourth Wing (Rebecca Yarros)",
            clue: "Rouleau 4 (*Fourth Wing*) : Première lettre du nom de famille de Xaden, le ténébreux chef d'escadrille qui manipule les ombres à Basgiath.",
            targetLetter: "R",
            fullAnswerWord: "RIORSON",
            unlockQuip: "« R comme Riorson ! » (Le Cryptex cliquette : BookTok est vaincu, ton honnêteté intellectuelle triomphe !)"
          }
        ],
        hints: [
 "Indice 1 : Les 4 mots complets sont : le métal blanc précieux d'Oxford (A...), le dragon noir de Violet (T...), le clan de la M... dans Jade City, et Xaden R...",
 "Indice Lunaire : Aligne les quatre rouleaux du Cryptex sur les lettres : A - T - M - R (Argent, Tairn, Montagne, Riorson)."
        ],
        victoryLore:
          "*CLAC !* Les 4 cylindres de bronze s'alignent sur **A - T - M - R**. Le Cryptex s'ouvre en libérant un petit nuage de poussière d'argent d'Oxford (et le Vilain promet de ne plus défendre *Babel* pendant au moins... vingt-quatre heures)."
      },
      defaultLoot: {
 title: "Sceau d'immunité anti-BookTok et anti-Babel",
        category: "DIGITAL_COUPON",
 description:
          "Un privilège royal accordé à la critique la plus honnête du royaume (et une petite surprise bien méritée qui, elle, ne sera pas 'moyenne' !).",
        irlClue:
          "BON ROYAL + SURPRISE : Montre cet écran au Vilain pour recevoir un massage de 15 minutes pendant lequel il a l'interdiction formelle de dire du bien de *Babel*, ET regarde sous l'exemplaire de *Babel* dans la bibliothèque !",
        keyFragmentName: "Rune V — Le Cylindre d'Argent Critique (5/24)"
      }
    },

    // ========================================================================
    // JOUR 6 — BOSS ÉPIQUE 1 : THE WILL OF THE MANY (SÉNAT DE CATEN)
    // ========================================================================
    {
      day: 6,
      week: 1,
 title: "Boss I — L'épreuve du Sénat de Caten",
 subtitle: "The Will of the Many — James Islington (Notre Lecture Commune )",
      books: ["The Will of the Many", "The Strength of the Few (Tome 2)"],
      rarity: "epic",
      tarotArcana: "VI. Les Amants de Caten & La Pyramide de Volonté",
      tarotSymbol: "🏛️⚡",
      location: "Arène du Transvect & Colisée de l'Académie de Caten",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "dramatic",
 text: "ALERTE BOSS ÉPIQUE ! Pour clore cette première semaine, les colonnes de marbre de la République de Caten s'élèvent devant nous ! Quel meilleur Boss pour notre premier Gros Cadeau que *The Will of the Many*, notre lecture commune coup de cœur dont on vient tout juste d'acheter le Tome 2 ?"
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*CROÂ IMPÉRIAL !* [Porte une toge de Sénateur romain et brandit une pancarte : « BOSS 1 : LE PRÉCEPTEUR DE CATEN (3 BARRES DE VOLONTÉ) »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "loving",
 text: "Le Précepteur Ulciscor et le Sénat bloquent le Coffre Épique avec 3 boucliers de Volonté. Prouve que notre lecture commune n'a aucun secret pour toi en brisant ses 3 manches : l'identité secrète du prince de Suus, le nom de la force cédée par les Octavii, et la hiérarchie exacte des pyramides !"
        }
      ],
      gameType: "boss_caten",
      gameConfig: {
        bossName: "Le Grand Précepteur du Sénat de Caten",
        bossTitle: "Gardien de l'Aurora Columnae & des Pyramides de la Hiérarchie",
        bossMaxHp: 3,
        bossAvatar: "🏛️",
        rounds: [
          {
            roundNumber: 1,
 title: "Manche 1 / 3 — L'identité cachée du prince de Suus",
            inputType: "text",
            bossTaunt:
 "« Nul n'entre en Première Classe à l'Académie de Caten sans décliner son nom ! Sous quel pseudonyme le prince Diago, survivant du royaume détruit de Suus, infiltre-t-il l'Académie sous la tutelle d'Ulciscor Telimus ? »",
            expectedAnswers: ["VIS", "VIS TELIMUS", "CENSOR VIS TELIMUS"],
            placeholder: "Tape son prénom d'emprunt (3 lettres) ou son nom complet...",
            damageMessage: "💥 IMPACT CRITIQUE ! Le premier bouclier du Sénat se fissure : Vis Telimus entre dans l'arène !"
          },
          {
            roundNumber: 2,
 title: "Manche 2 / 3 — Le tribut de l'Aurora Columnae",
            inputType: "text",
            bossTaunt:
 "« Tu connais son nom... Mais comment s'appelle la force vitale, mentale et physique que les citoyens du rang inférieur (les Octavii) cèdent aux rangs supérieurs à travers les Pyramides de la Hiérarchie ? »",
            expectedAnswers: ["VOLONTE", "LA VOLONTE", "WILL", "THE WILL", "IMPERIUM"],
            placeholder: "Tape le nom de cette force en français ou en anglais...",
            damageMessage: "⚡ DEUXIÈME BOUCLIER BRISÉ ! La Volonté pure fait trembler les colonnes de Caten !"
          },
          {
            roundNumber: 3,
 title: "Manche 3 / 3 — L'architecture de la pyramide romaine",
            inputType: "mcq",
            bossTaunt:
 "« Dernier rempart avant le Coffre Épique ! Dans la pyramide de la Hiérarchie de Caten, quel est le titre exact du rang situé JUSTE AU-DESSUS d'un Octavus (celui qui reçoit la Volonté d'un seul Octavus) ? »",
            options: [
              { id: " princeps", text: "Un Princeps (le sommet absolu d'une pyramide sénatoriale)" },
              { id: "septimus", text: "Un Septimus (le 7e échelon, juste au-dessus de l'Octavus)" },
              { id: "sextus", text: "Un Sextus (le 6e échelon de l'administration)" },
              { id: "quintus", text: "Un Quintus (le 5e échelon militaire)" }
            ],
            correctOptionId: "septimus",
            damageMessage: "🌟 VICTOIRE ÉPIQUE ! Le Précepteur s'incline devant la lauréate du Labyrinthos ! La Tempête Dorée éclate !"
          }
        ],
        hints: [
 "Indice 1 : Manche 1 = Le héros s'appelle V_S (Telimus). Manche 2 = Le titre même du livre en français (*The Will of the Many* -> La V______). Manche 3 = En latin, juste au-dessus du 8e (Octavus), c'est le 7e (Sept...).",
 "Indice Lunaire : Manche 1 : VIS | Manche 2 : VOLONTE (ou WILL) | Manche 3 : Un Septimus !"
        ],
        victoryLore:
          "Les portes d'or du Sénat de Caten s'ouvrent en grand ! Vis Telimus, Callidus et Eidhin lèvent leurs coupes à votre lecture commune (et au Tome 2 qui vous attend déjà !). Le **Premier Coffre de Boss Épique** apparaît au centre de l'arène !"
      },
      defaultLoot: {
 title: "Coffre épique I — Le trésor du Princeps de Caten",
        category: "EPIC_BOSS_GIFT",
 description:
          "Tu as vaincu le Boss de la Semaine 1 ! Ce coffre renferme ton Premier Gros Cadeau d'Étape, forgé en l'honneur de notre lecture commune de *The Will of the Many*.",
        irlClue:
          "GROS CADEAU ÉPIQUE N°1 : Va chercher dans le bas de l'armoire / penderie du Vilain (ou demande au Maître du Jeu de t'apporter le Coffre Sénatorial scellé d'un ruban doré, près du Tome 2 de *The Will of the Many*) !",
        keyFragmentName: "Rune Épique VI — L'Égide Dorée de Vis Telimus (6/24)"
      }
    },

    // ========================================================================
    // SEMAINE 2 : DU DÉSERT DE LAITON AUX BRUMES D'IRLANDE (JOURS 7 À 12)
    // ========================================================================
    {
      day: 7,
      week: 2,
 title: "Murmures sous les brumes d'émeraude",
 subtitle: "N'invite pas la forêt à entrer — C.G. Drews (Notre Voyage en Amoureux)",
      books: ["N'invite pas la forêt à entrer"],
      rarity: "common",
      tarotArcana: "VII. Le Voyageur des Landes & Les Fleurs Vénéneuses",
      tarotSymbol: "🌲☘️",
      location: "Clairière Brumeuse aux Ronces Enchantées",
      companion: "villain",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "loving",
 text: "Ferme les yeux une seconde, mon cœur... Tu entends la pluie fine sur les vitres, le vent sur les landes vertes et le bruissement des arbres anciens qui veulent franchir le seuil ?"
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*Croâ-trèfle !* [Porte un petit pull irlandais en laine tricotée et une pancarte : « SOUVENIR DE VOYAGE + FORÊT INTERDITE »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "loving",
 text: "Impossible d'ouvrir les portes de la Semaine 2 sans évoquer *N'invite pas la forêt à entrer* et le pays magique où nous étions tous les deux quand on l'a lu. Inscris le nom de cette terre de légendes et brise le sceau des ronces !"
        }
      ],
      gameType: "password",
      gameConfig: {
        promptTitle: "Le Sceau des Ronces & des Falaises Vertes",
        riddleText:
 "« Entre falaises battues par le vent, pubs chaleureux et pluie d'émeraude,\nNous avons tourné les pages sombres où la forêt rôde.\nQuel est le nom du pays où notre voyage amoureux a croisé ce roman ? »",
        expectedAnswers: ["IRLANDE", "L'IRLANDE", "IRELAND", "EIRE"],
        placeholder: "Tape le nom du pays de notre voyage...",
        bonusQuestion: {
          question: "Question Lore des Ronces : Dans *N'invite pas la forêt à entrer* (Don't Let the Forest In), quelle horreur poétique afflige Andrew et Thomas autour du pensionnat de Wickwood ?",
          options: [
            { id: "a", text: "Les monstres dessinés et écrits dans leurs contes macabres prennent vie dans la forêt, tandis que des fleurs et des ronces poussent de l'intérieur" },
            { id: "b", text: "Un dragon de laiton exige qu'on lui traduise des dictionnaires latins d'Oxford" },
            { id: "c", text: "Les arbres chantent des chansons d'Emily Henry sous le soleil de Californie" },
            { id: "d", text: "Une grenouille verte leur vend des tomes de The Bone Season sur Vinted" }
          ],
          correctOptionId: "a",
          wrongFeedback: "Les ronces se resserrent ! Souviens-toi des contes illustrés de Thomas et des fleurs sombres de Wickwood."
        },
        hints: [
 "Indice 1 : C'est l'île d'émeraude des trèfles, des pubs de Dublin aux falaises de Moher, où nous sommes partis en voyage tous les deux (7 lettres, commence par I).",
 "Indice Lunaire : Le pays est l'IRLANDE (et dans le roman, ce sont leurs contes/dessins de monstres et les fleurs vénéneuses de la forêt qui prennent vie)."
        ],
        victoryLore:
          "Les ronces noires se changent en bruyère d'Irlande illuminée de lucioles ! Un doux parfum de tourbe, de pluie fraîche et de souvenirs à deux envahit le Manoir."
      },
      defaultLoot: {
 title: "Souvenir des brumes d'Irlande et de Wickwood",
        category: "IRL_GIFT",
 description:
          "Un trésor enveloppé de nostalgie irlandaise et de magie sylvestre (promis, aucune forêt carnivore n'a été invitée à l'intérieur).",
        irlClue:
          "Cherche près de notre boîte à souvenirs de voyage / photos d'Irlande (ou juste à côté de ton exemplaire de *N'invite pas la forêt à entrer*) !",
        keyFragmentName: "Rune VII — Le Trèfle Noir de Wickwood (7/24)"
      }
    },

    // ========================================================================
    // JOUR 8 — HEARTLESS HUNTER / THE CRIMSON MOTH (PENDU AUX RUNES DE SANG)
    // ========================================================================
    {
      day: 8,
      week: 2,
 title: "La valse de la sorcière et du chasseur",
 subtitle: "Heartless Hunter (The Crimson Moth) & Rebel Witch — Kristen Ciccarelli",
      books: ["Heartless Hunter (The Crimson Moth)", "Rebel Witch"],
      rarity: "common",
      tarotArcana: "XV. La Phalène Écarlate & Le Chasseur",
      tarotSymbol: "🦋🩸",
      location: "Salle de Bal de la Nouvelle-République",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "smirk",
 text: "Une musique de violon résonne dans l'ombre... Le jour, Rune Winters joue les mondaines frivoles ; la nuit, elle sauve les sorcières sous le nez du redoutable chasseur Gideon Sharpe."
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*Croâ-écarlate !* [Porte un loup de bal masqué rouge sang et lève une pancarte : « ATTENTION : SI TU TE TROMPES DE LETTRE, GIDEON RESSERRE SON FILET ! »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "dramatic",
 text: "Voici le **Pendu Mystique aux Runes de Sang**. Révèle en 7 lettres le nom français de l'insecte nocturne qui sert d'emblème à Rune Winters (*The Crimson Moth*), puis valide le secret de sa magie !"
        }
      ],
      gameType: "hangman",
      gameConfig: {
        promptTitle: "La Constellation Écarlate de Rune Winters",
        riddleClue:
 "« Papillon de nuit attiré par la flamme, je suis l'emblème écarlate gravé sur les scènes d'évasion de Rune Winters face à Gideon Sharpe. Quel est mon nom en 7 lettres ? »",
        targetWord: "PHALENE",
        maxErrors: 6,
        followUpQuestion: {
          question: "Validation du Sceau Écarlate : Dans *Heartless Hunter*, que doivent absolument utiliser les sorcières comme Rune pour tracer leurs runes et lancer leurs sortilèges ?",
          options: [
            { id: "blood", text: "Leur propre sang frais (ce qui laisse des cicatrices révélatrices que traquent les Chasseurs)" },
            { id: "silver", text: "Des barres d'argent fondu importées d'Oxford" },
            { id: "water", text: "De l'eau de mer puisée uniquement pendant l'éclipse d'Aldryn" },
            { id: "ink", text: "De l'encre de machine à écrire enchantée" }
          ],
          correctOptionId: "blood"
        },
        hints: [
 "Indice 1 : En anglais son surnom est *The Crimson Moth*. En français, ce papillon nocturne en 7 lettres commence par P H et finit par N E.",
 "Indice Lunaire : Le mot à deviner est PHALENE (Phalène), et les sorcières utilisent leur propre sang frais (d'où la traque des cicatrices par Gideon !)."
        ],
        victoryLore:
          "La constellation écarlate déploie ses ailes de lumière ! Gideon Sharpe arrive une seconde trop tard : la Phalène Écarlate s'est déjà envolée avec le coffre du Jour 8."
      },
      defaultLoot: {
 title: "Masque de velours de la phalène écarlate",
        category: "IRL_GIFT",
 description:
          "Un butin dérobé en pleine valse sous les yeux de Gideon Sharpe pour la sorcière la plus rusée du Manoir.",
        irlClue:
          "Fouille dans l'endroit où tu ranges tes bijoux, accessoires de soirée ou foulards : la Phalène Écarlate y a déposé le paquet n°8 !",
        keyFragmentName: "Rune VIII — L'Aile Pourpre de Rune Winters (8/24)"
      }
    },

    // ========================================================================
    // JOUR 9 — SPARK OF THE EVERFLAME (LORE + DÉFI RÉFLEXE DE LA FLAMME)
    // ========================================================================
    {
      day: 9,
      week: 2,
 title: "L'étincelle des descendants de Lumnos",
 subtitle: "Spark of the Everflame (Kindred's Curse) — Penn Cole",
      books: ["Spark of the Everflame", "Glow of the Everflame", "Heat of the Everflame"],
      rarity: "common",
      tarotArcana: "XI. La Force & La Flamme Éternelle",
      tarotSymbol: "🔥⚔️",
      location: "Sanctuaire Ardent de Lumnos",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "dramatic",
 text: "Alerte à Lumnos ! Diem Bellator et le prince Luther Corbois sont encerclés par les Gardiens. Le brasier de la Flamme Éternelle menace de s'éteindre !"
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*Croâ-brasier !* [Pancarte : « ÉCHAUFFE TON DOIGT : QUESTION DE LORE + 22 CLICS EN 5 SECONDES POUR EMBRASER L'AUTEL ! »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "smirk",
 text: "Prouve d'abord que tu connais le secret de Diem Bellator au début de *Spark of the Everflame*, puis déchaîne ta vitesse pour frapper l'étincelle 22 fois en moins de 5 secondes avant que l'ombre ne l'étouffe !"
        }
      ],
      gameType: "reflex_flame",
      gameConfig: {
        promptTitle: "L'Épreuve du Brasier de Diem Bellator",
        preQuestion: {
          question:
            "Verrou de Lore : Au début de *Spark of the Everflame*, quel métier exerce Diem Bellator parmi les mortels de Lumnos avant de découvrir sa véritable nature liée aux Descendants ?",
          options: [
            { id: "healer", text: "Elle est Guérisseuse (Healer / Apothicaire) et vole secrètement du Flameroot pour soigner les mortels" },
            { id: "pirate", text: "Elle est Capitaine pirate sur l'océan Indien à bord du Maram" },
            { id: "senator", text: "Elle est Sénatrice de la République de Caten au rang de Princeps" },
            { id: "journalist", text: "Elle est Journaliste de guerre avec une machine à écrire magique" }
          ],
          correctOptionId: "healer"
        },
        reflexChallenge: {
          targetClicks: 22,
          timeLimitSeconds: 5,
          buttonLabel: "🔥 ATTISER L'EVERFLAME ! 🔥",
          encouragementStages: [
            "L'étincelle crépite...",
            "Le feu de Lumnos s'élève !",
            "Luther Corbois dégaine son épée !",
            "LA FLAMME ÉTERNELLE RUGIT !"
          ]
        },
        hints: [
 "Indice 1 : Diem travaille comme Guérisseuse (Healer) au début du roman. Ensuite, prépare-toi à tapoter très vite le bouton du brasier (22 clics en 5 secondes !).",
 "Indice Lunaire : Choisis « Guérisseuse (Healer) », puis utilise deux doigts sur mobile ou un clic rapide à la souris dès que le compte à rebours de 5 secondes démarre !"
        ],
        victoryLore:
          "*WHOOOOSH !* Une colonne de feu argenté et d'or jaillit jusqu'à la voûte ! Luther Corbois te salue d'un hochement de tête respectueux tandis que Diem Bellator descelle le coffre brûlant."
      },
      defaultLoot: {
 title: "Élixir ardent de la flamme éternelle",
        category: "IRL_GIFT",
 description:
          "Une récompense forgée dans la chaleur de Lumnos pour réchauffer les soirées d'hiver de l'Assistante.",
        irlClue:
          "Regarde près de la source de chaleur la plus cosy du salon (près des bougies parfumées, du plaid préféré ou du radiateur du coin lecture) !",
        keyFragmentName: "Rune IX — L'Étincelle de Diem Bellator (9/24)"
      }
    },

    // ========================================================================
    // JOUR 10 — TROLLS & LÉGENDES (ÉNIGME D'EINSTEIN À LA TAVERNE DE MONS)
    // ========================================================================
    {
      day: 10,
      week: 2,
 title: "L'énigme d'Einstein à la taverne de Trolls & Légendes",
 subtitle: "Ceux qu'on implore à la terre (Nell Pfeiffer), Les Carmidors (Olivia Gometz) & Un passé englouti (Ava Reid)",
      books: [
        "Ceux qu'on implore à la terre",
        "Les Carmidors (Tomes 1, 2 et 3)",
        "Un passé englouti (A Study in Drowning)"
      ],
      rarity: "common",
      tarotArcana: "XIV. La Tempérance (Toute Relative) à Trolls & Légendes",
      tarotSymbol: "🍺🧝‍♀️",
      location: "La Grande Taverne du Festival Trolls & Légendes (Mons)",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "laughing",
 text: "Ahhh, Trolls & Légendes à Mons ! Notre pèlerinage sacré : des bières belges qui coulent à flots, des heures à refaire le monde avec les auteurs et autrices aux stands, et ton sac qui pèse quinze kilos de dédicaces à la sortie !"
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "cheeky",
 text: "*Hips... Croâ !* [Trempe sa couronne dans une chope de mousse et lève une pancarte : « ON A TROP BU AVEC LES AUTRICES : LES RELIQUES SONT MÉLANGÉES ! »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "smirk",
 text: "À notre table de taverne, les héroïnes de trois de tes pépites adorées — *Ceux qu'on implore à la terre* (Nell Pfeiffer), la trilogie *Les Carmidors* (Olivia Gometz) et *Un passé englouti* (Ava Reid, dont tu dois lire le tome 2 !) — ont échangé leurs boissons de festival et leurs reliques. Résous cette **Grille Logique d'Einstein 3x3** grâce aux 5 indices !"
        }
      ],
      gameType: "einstein_tavern",
      gameConfig: {
        promptTitle: "La Grille Logique 3x3 de la Taverne de Mons",
        scenarioDescription:
          "Associe chaque Univers / Autrice à sa Boisson de Trolls & Légendes ET à sa Relique Mystique exacte. Aucune boisson ni aucune relique ne peut être partagée !",
        entities: [
          {
            id: "nell",
 label: "Héroïne de Nell Pfeiffer",
            subLabel: "Ceux qu'on implore à la terre"
          },
          {
            id: "olivia",
 label: "Héroïne d'Olivia Gometz",
            subLabel: "Trilogie Les Carmidors (T1, T2, T3)"
          },
          {
            id: "ava",
 label: "Effy Sayre (Ava Reid)",
            subLabel: "Un passé englouti (en attendant le T2 !)"
          }
        ],
        drinks: [
          { id: "cuvee_trolls", label: "🍺 Cuvée des Trolls Ambrée" },
          { id: "hydromel_brume", label: "🍯 Hydromel des Brumes Salées" },
          { id: "triple_abbaye", label: "🍷 Triple d'Abbaye aux Épices" }
        ],
        relics: [
          { id: "autel_terre", label: "🌿 Sceau d'Argile des Prières de la Terre" },
          { id: "blason_carmidor", label: "🦅 Trilogie des Blasons de Carmidor" },
          { id: "manuscrit_aulnes", label: "🌊 Manuscrit Englouti du Roi des Aulnes" }
        ],
        clues: [
 "Indice Logique 1 : Effy Sayre (*Un passé englouti* d'Ava Reid), venue étudier l'architecture du manoir d'Hiraeth et le mythe du Roi des Aulnes en attendant que tu lises son Tome 2, ne boit JAMAIS de bière houblonnée : elle a commandé l'**Hydromel des Brumes Salées**.",
 "Indice Logique 2 : La lectrice qui garde précieusement la **Trilogie des Blasons de Carmidor** (les 3 tomes d'Olivia Gometz dévorés !) déguste la **Triple d'Abbaye aux Épices** en papotant avec l'autrice au stand.",
 "Indice Logique 3 : L'héroïne de **Nell Pfeiffer** (*Ceux qu'on implore à la terre*) a levé sa chope de **Cuvée des Trolls Ambrée** pour trinquer avec le Vilain et Laure à Mons.",
 "Indice Logique 4 : Celle qui boit l'**Hydromel des Brumes Salées** protège le **Manuscrit Englouti du Roi des Aulnes** contre la marée montante.",
 "Indice Logique 5 : Le **Sceau d'Argile des Prières de la Terre** n'appartient ni à Effy Sayre ni à l'héroïne d'Olivia Gometz."
        ],
        solution: {
          nell: {
            drink: "cuvee_trolls",
            relic: "autel_terre"
          },
          olivia: {
            drink: "triple_abbaye",
            relic: "blason_carmidor"
          },
          ava: {
            drink: "hydromel_brume",
            relic: "manuscrit_aulnes"
          }
        },
        hints: [
 "Indice 1 : L'indice 1 et l'indice 4 te donnent toute la ligne d'Ava Reid (*Un passé englouti*) : Hydromel des Brumes Salées + Manuscrit Englouti du Roi des Aulnes !",
 "Indice Lunaire : Solution complète : Nell Pfeiffer = Cuvée des Trolls + Sceau d'Argile de la Terre | Olivia Gometz (Les Carmidors) = Triple d'Abbaye + Trilogie des Blasons | Ava Reid (Un passé englouti) = Hydromel des Brumes + Manuscrit du Roi des Aulnes."
        ],
        victoryLore:
          "*TIIIING !* Les trois chopes s'entrechoquent joyeusement dans la taverne de Trolls & Légendes ! Nell Pfeiffer, Olivia Gometz et Ava Reid signent ton grimoire d'or tandis que le tavernier déverrouille le coffre du Jour 10."
      },
      defaultLoot: {
 title: "Chope royale et trésor de Trolls & Légendes",
        category: "IRL_GIFT",
 description:
          "Un souvenir digne de nos meilleures soirées à Mons, à savourer en repensant à nos fous rires avec les auteurs.",
        irlClue:
          "Va jeter un œil dans le coin apéro / réserve à bonnes bouteilles ou chocolats belges de la cuisine (et regarde aussi près de tes romans dédicacés de Nell Pfeiffer et Olivia Gometz) !",
        keyFragmentName: "Rune X — L'Écu Houblonné de Mons (10/24)"
      }
    },

    // ========================================================================
    // JOUR 11 — TRIBUNAL VRAI/FAUX (PRISON HEALER, YELLOWFACE, WEYWARD, BABEL)
    // ========================================================================
    {
      day: 11,
      week: 2,
 title: "Le tribunal de l'inquisition littéraire",
 subtitle: "The Prison Healer, Yellowface, La Maison des Sortilèges (Weyward) & Powerless",
      books: ["The Prison Healer", "Yellowface", "La Maison des Sortilèges (Weyward)", "Powerless"],
      rarity: "common",
      tarotArcana: "XX. Le Jugement Dernier de @lau.libraryyy",
      tarotSymbol: "📜⚖️",
      location: "Haut Tribunal de Zalindov & de Weyward",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "dramatic",
 text: "Silence dans la salle d'audience ! Aujourd'hui siège le Tribunal Suprême du Canon de @lau.libraryyy. Ici, on juge les impostures littéraires, les suites qui n'auraient jamais dû exister et les crimes d'édition !"
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*Croâ-marteau !* [Porte une perruque poudrée de juge et frappe avec une pancarte : « 5 PARCHEMINS DE VÉRITÉ : ZÉRO ERREUR TOLÉRÉE ! »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "smirk",
 text: "Cinq parchemins portant sur *The Prison Healer*, *Yellowface*, *La Maison des Sortilèges (Weyward)* et nos grands débats de couple vont défiler. Tranche entre **VRAI** et **FAUX** avec la rigueur d'un expert psychiatre !"
        }
      ],
      gameType: "truth_trial",
      gameConfig: {
        promptTitle: "Les 5 Parchemins de Jugement (Vrai ou Faux)",
        statements: [
          {
            id: "trial_1",
            bookTag: "The Prison Healer — Canon Personnel",
            statement:
              "Parchemin I : « Dans le canon officiel et sacré du cœur de @lau.libraryyy, *The Prison Healer* est un standalone parfait qui se suffit à lui-même : les tomes 2 et 3 n'ont tout simplement jamais existé. »",
            isTrue: true,
            explanation:
              "VRAI ! Kiva Meridan s'arrête à la fin du Tome 1 dans notre univers, et personne n'a le droit de contredire ce décret royal !"
          },
          {
            id: "trial_2",
            bookTag: "Yellowface — R.F. Kuang",
            statement:
              "Parchemin II : « Dans *Yellowface*, June Hayward a courageusement écrit elle-même de A à Z le premier jet original du roman *The Last Front* avant le tragique accident de son amie Athena Liu. »",
            isTrue: false,
            explanation:
              "FAUX ! June a volé le manuscrit inédit d'Athena Liu le soir même où Athena s'est étouffée avec des pancakes !"
          },
          {
            id: "trial_3",
            bookTag: "La Maison des Sortilèges (Weyward) — Emilia Hart",
            statement:
              "Parchemin III : « Dans *La Maison des Sortilèges (Weyward)*, le récit entrelace le destin de trois femmes de la même lignée (Altha en 1619, Violet en 1942 et Kate en 2019) dotées d'un lien sauvage avec la nature et les insectes. »",
            isTrue: true,
            explanation:
              "VRAI ! Trois époques, trois femmes indomptables et le cottage de Weyward peuplé de corbeaux et d'abeilles."
          },
          {
            id: "trial_4",
            bookTag: "The Prison Healer — Lynette Noni",
            statement:
              "Parchemin IV : « Dans l'unique tome existant de *The Prison Healer*, Kiva Meridan survit depuis dix ans en travaillant comme guérisseuse/apothicaire au sein du terrible camp pénitentiaire de Zalindov. »",
            isTrue: true,
            explanation:
              "VRAI ! Elle est la guérisseuse de Zalindov avant d'affronter l'Ordalie des quatre éléments pour sauver la Reine Rebelle."
          },
          {
            id: "trial_5",
            bookTag: "Le Dossier Psychiatrique du Couple",
            statement:
              "Parchemin V : « Selon *Les mémoires d'un expert psychiatre* du Manoir, ton chéri déteste *Babel* qu'il trouve très moyen, alors que toi tu lui as mis 20/20 en pleurant d'émotion devant tant de génie. »",
            isTrue: false,
            explanation:
              "FAUX ARCHI-FAUX ! C'est exactement l'inverse : le Vilain voue un culte à *Babel*, tandis que Laure a rendu un verdict implacable : 'Moyen' !"
          }
        ],
        hints: [
 "Indice 1 : Souviens-toi que June Hayward est une voleuse de manuscrit dans *Yellowface* (Parchemin II = FAUX) et que c'est ton copain qui adore *Babel* (Parchemin V = FAUX).",
 "Indice Lunaire : La séquence exacte des 5 verdicts est : 1 = VRAI | 2 = FAUX | 3 = VRAI | 4 = VRAI | 5 = FAUX."
        ],
        victoryLore:
          "*BAM !* Le marteau d'or de Kingsley frappe le pupitre : « VERDICT SANS APPEL ! ». Les parchemins de Zalindov et de Weyward s'illuminent, et les tomes 2 et 3 de *Prison Healer* sont officiellement bannis dans le néant éternel."
      },
      defaultLoot: {
 title: "Ordonnance royale de la guérisseuse de Zalindov",
        category: "IRL_GIFT",
 description:
          "Un remède doux et réconfortant validé par Kiva Meridan et les sorcières du cottage de Weyward.",
        irlClue:
          "Cherche dans l'armoire à soins / boîte à tisanes ou chocolats de secours (ou juste à côté du Tome 1 — et unique ! — de *The Prison Healer*) !",
        keyFragmentName: "Rune XI — Le Mortier d'Or de Zalindov (11/24)"
      }
    },

    // ========================================================================
    // JOUR 12 — BOSS ÉPIQUE 2 : THE POPPY WAR & LA RAGE DES DRAGONS
    // ========================================================================
    {
      day: 12,
      week: 2,
 title: "Boss II — Le brasier de Sinegard et des Omehi",
 subtitle: "The Poppy War (R.F. Kuang) & La Rage des Dragons (Evan Winter)",
      books: ["The Poppy War (La Guerre du Pavot)", "La République du Dragon", "La Rage des Dragons", "La Flamme des Dragons"],
      rarity: "epic",
      tarotArcana: "XVI. La Maison-Dieu du Phénix & des Dragons",
      tarotSymbol: "🐉🔥",
      location: "Citadelle Enflammée de Sinegard & Portail de l'Isihogo",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "dramatic",
 text: "DEUXIÈME BOSS ÉPIQUE ! Le ciel s'embrase au-dessus du Manoir ! D'un côté, le Phénix chamanique de Fang Runin (*The Poppy War*, dont le Tome 3 t'attend de pied ferme !) ; de l'autre, les dragons des Omehi et la fureur de *La Rage des Dragons* !"
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*CROÂ-DRACARYS !* [Porte un bandeau d'artilleur de Sinegard et lève une pancarte : « BOSS 2 : LE DRAGON DU PHÉNIX (LORE + MÉMOIRE DES 5 RUNES DE FEU) »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "loving",
 text: "Pour ouvrir le **Deuxième Coffre de Boss Épique**, tu dois triompher en 3 phases : prouver ton savoir sur l'académie militaire de Rin, nommer le guerrier vengeur de l'Isihogo, puis reproduire sans erreur la séquence ardente des **5 Runes de Feu** !"
        }
      ],
      gameType: "boss_fire",
      gameConfig: {
        bossName: "L'Avatar du Phénix de Sinegard & du Dragon Omehi",
        bossTitle: "Gardien de l'Isihogo & du Panthéon Chamanique",
        bossAvatar: "🐉",
        phase1: {
 title: "Phase 1 / 3 — L'académie impériale de Rin (*The Poppy War*)",
          question:
            "Pour échapper à un mariage arrangé dans la province du Coq, Fang Runin (Rin) réussit le Keju et intègre la plus prestigieuse académie militaire de l'Empire Nikara, où enseigne l'excentrique maître Jiang. Quel est le nom de cette académie ?",
          expectedAnswers: ["SINEGARD", "ACADEMIE DE SINEGARD", "L'ACADEMIE DE SINEGARD"],
          placeholder: "Tape le nom de l'académie militaire (8 lettres)..."
        },
        phase2: {
 title: "Phase 2 / 3 — Le guerrier de l'Isihogo (*La Rage des dragons*)",
          question:
            "Dans *La Rage des Dragons* (et *La Flamme des Dragons*) d'Evan Winter, comment s'appelle le jeune guerrier de caste inférieure (Moindre / Lesser) qui s'entraîne sans relâche dans la dimension démoniaque de l'Isihogo pour assouvir sa vengeance ?",
          expectedAnswers: ["TAU", "TAU SOLARIN", "SOLARIN"],
          placeholder: "Tape son prénom (3 lettres) ou son nom complet..."
        },
        phase3: {
 title: "Phase 3 / 3 — Le sceau mémoriel des 5 runes de feu",
          instruction:
            "Le Dragon-Phénix embrase 5 Runes sur l'autel selon une séquence sacrée. Observe bien l'ordre dans lequel les 5 symboles s'illuminent, puis clique dessus dans l'ordre exact pour briser le sceau final !",
          runes: [
            { id: "phoenix", label: "Phénix de Rin", icon: "🦅" },
            { id: "dragon", label: "Dragon Omehi", icon: "🐉" },
            { id: "sabre", label: "Deux-Lames de Tau", icon: "⚔️" },
            { id: "flame", label: "Feu Chamanique", icon: "🔥" },
            { id: "drum", label: "Tambour de Guerre", icon: "🥁" }
          ],
          sequenceLength: 5
        },
        hints: [
 "Indice 1 : Phase 1 = L'académie de Rin commence par SINE... (8 lettres). Phase 2 = Le héros d'Evan Winter s'appelle T_U (Solarin).",
 "Indice Lunaire : Phase 1 : SINEGARD | Phase 2 : TAU (ou TAU SOLARIN) | Phase 3 : Mémorise les 5 icônes qui s'allument une par une et reproduis la séquence !"
        ],
        victoryLore:
          "Dans un cri triomphal, le Phénix de Sinegard et le Dragon d'Or des Omehi s'inclinent devant toi ! Rin, Kitay et Tau Solarin ouvrent la chambre forte du **Deuxième Gros Cadeau Épique** (et te rappellent que le Tome 3 de *The Poppy War* t'attend sur l'étagère !)."
      },
      defaultLoot: {
 title: "Coffre épique II — Le trésor impérial de Sinegard",
        category: "EPIC_BOSS_GIFT",
 description:
          "Mi-parcours du Calendrier ! Tu as terrassé le Boss de la Semaine 2. Ce coffre majeur renferme ton Deuxième Gros Cadeau d'Étape !",
        irlClue:
          "GROS CADEAU ÉPIQUE N°2 : Regarde derrière les grands coussins du canapé ou sous le lit du côté du Vilain (le paquet scellé du Phénix de Sinegard t'y attend) !",
        keyFragmentName: "Rune Épique XII — La Plume Ardente du Phénix (12/24)"
      }
    },

    // ========================================================================
    // SEMAINE 3 : L'OR, LES MARÉES ET LES THRILLERS (JOURS 13 À 18)
    // ========================================================================
    {
      day: 13,
      week: 3,
 title: "La cage dorée et les rubans d'Auren",
 subtitle: "Gild (La Saga d'Auren / The Plated Prisoner) — Raven Kennedy",
      books: ["Gild", "Glint", "Gleam", "Glow", "Gold", "Goldfinch"],
      rarity: "common",
      tarotArcana: "VIII. La Justice d'Or & Les Ombres du Quatrième Royaume",
      tarotSymbol: "🎗️✨",
      location: "Palais Doré d'Highbell & Camp du Commandant Rip",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "smirk",
 text: "Bienvenue dans la Semaine 3, ma reine dorée ! Autour du coffre du Jour 13, six rubans d'or étincelants s'entrelacent comme ceux d'Auren dans *Gild*... mais attention, cette cage n'est pas là pour te retenir, elle est là pour être brisée !"
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*Croâ-doré !* [Enroule un ruban d'or autour de sa patte et lève une pancarte : « TRANCHE LES RUBANS DANS L'ORDRE EXACT DU RÉCIT D'AUREN & SLADE ! »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "loving",
 text: "Interdiction de couper au hasard ! Lis l'énigme chronologique de la saga d'Auren et tranche les **6 rubans d'or dans l'ordre exact** (de sa cage dorée chez Midas jusqu'à sa souveraineté aux côtés de Slade Ravinger) pour libérer ta récompense."
        }
      ],
      gameType: "gild_ribbons",
      gameConfig: {
        promptTitle: "L'Énigme des 6 Rubans d'Or d'Auren",
        riddleInstruction:
          "Tranche les 6 rubans d'or dans l'ordre chronologique exact du voyage d'Auren à travers les royaumes d'Orea (du 1er au 6e) :",
        ribbons: [
          {
            id: "ribbon_cage",
            order: 1,
            runeTitle: "I. La Cage d'Or d'Highbell",
            clueText: "Au commencement, je suis la favorite enfermée derrière des barreaux dorés par l'illusion du roi Midas au Sixième Royaume..."
          },
          {
            id: "ribbon_ribbons",
            order: 2,
            runeTitle: "II. Les Rubans Vivants du Dos",
            clueText: "Dans mon dos s'agitent mes rubans d'or que je cache sous mes capes, ignorant encore toute l'étendue de mon propre pouvoir..."
          },
          {
            id: "ribbon_rip",
            order: 3,
            runeTitle: "III. La Capture par le Commandant Rip",
            clueText: "Sur la route enneigée vers le Cinquième Royaume, l'Armée de laColère attaque le convoi et le redoutable Commandant Rip me fait prisonnière..."
          },
          {
            id: "ribbon_shadows",
            order: 4,
            runeTitle: "IV. La Vérité des Ombres & de la Pourriture",
            clueText: "Sous son masque de guerrier balafré se révèlent la magie de la pourriture, les ombres protectrices et le vrai visage de Slade Ravinger..."
          },
          {
            id: "ribbon_midas_fall",
            order: 5,
            runeTitle: "V. Le Mensonge Brisé de Midas",
            clueText: "Je découvre enfin que l'or ne venait pas du roi Midas mais de ma propre magie exploitée, et je brise mes chaînes dorées pour de bon !"
          },
          {
            id: "ribbon_queen",
            order: 6,
            runeTitle: "VI. L'Envol du Chardonneret (Goldfinch)",
            clueText: "Libre, couronnée de ma propre lumière aux côtés du Roi du Quatrième Royaume, je déploie enfin mes ailes d'or sans aucune cage !"
          }
        ],
        hints: [
 "Indice 1 : Suis l'histoire d'Auren du Tome 1 au dernier tome : 1. La Cage d'Highbell -> 2. Ses Rubans cachés -> 3. Sa capture par le Commandant Rip -> 4. La découverte de Slade Ravinger.",
 "Indice Lunaire : Ordre exact : Cage d'Highbell (1) -> Rubans Vivants (2) -> Capture par Rip (3) -> Vérité de Slade (4) -> Mensonge brisé de Midas (5) -> Envol du Chardonneret (6)."
        ],
        victoryLore:
          "*SCHLACK !* Les six rubans d'or volent en éclats lumineux et la cage dorée se dissout ! Slade Ravinger enveloppe le coffre d'un voile d'ombres bienveillantes pour te l'offrir."
      },
      defaultLoot: {
 title: "Trésor doré du quatrième royaume",
        category: "IRL_GIFT",
 description:
          "Un bijou d'attention (100% véritable, sans illusion de Midas) béni par Auren et Slade Ravinger.",
        irlClue:
          "Cherche près de l'élément le plus doré de la chambre ou du salon (un miroir doré, un cadre doré ou près de ta pile de *Gild*) !",
        keyFragmentName: "Rune XIII — Le Ruban d'Or Souverain d'Auren (13/24)"
      }
    },

    // ========================================================================
    // JOUR 14 — CURIOUS TIDES II (MÉCANISME LUNAIRE D'ALDRYN)
    // ========================================================================
    {
      day: 14,
      week: 3,
 title: "Le planétaire des noyés de Dover",
 subtitle: "Curious Tides (En attendant le Tome 2 !) & Nous deux et la lune",
      books: ["Curious Tides", "Stranger Skies (Tome 2 attendu !)", "Nous deux et la lune", "Contes de l'aura"],
      rarity: "common",
      tarotArcana: "XVII. L'Étoile d'Aldryn & Le Planétaire des Huit Marées",
      tarotSymbol: "🔭🌊",
      location: "Planétaire Englouti de la Crique de Dover",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "loving",
 text: "Retour à l'Académie d'Aldryn ! En attendant que tu puisses enfin dévorer le Tome 2 de *Curious Tides* (et sous le regard poétique de *Nous deux et la lune*), Emory et Baz ont besoin de ton aide devant le Grand Planétaire de Dover."
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*Croâ-marée !* [Pancarte : « ALIGNE LES 5 ROUAGES LUNAIRES SELON LE PARCHEMIN DES NOYÉS ! »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "smirk",
 text: "Cinq mécanismes célestes du planétaire sont désynchronisés. Associe chaque Phase ou Conjonction d'Aldryn à son effet occulte exact décrit dans le Grimoire de Romie pour stabiliser la marée haute !"
        }
      ],
      gameType: "lunar_mechanisms",
      gameConfig: {
        promptTitle: "L'Alignement des 5 Anneaux du Planétaire d'Aldryn",
        parchmentClue:
          "Extrait du Journal des Noyés : « À Aldryn, chaque phase de la lune gouverne un ordre de magie des marées. Mais lorsque survient l'Éclipse à la Crique de Dover, huit étudiants sont appelés par la mer et seuls les survivants reviennent avec des dons impossibles... »",
        mechanisms: [
          {
            id: "mech_1",
            lunarPhase: "🌑 Rouage I — La Nouvelle Lune d'Aldryn",
            correctEffectId: "eff_shadows",
            hintFragment: "Quand l'astre est noir, les secrets et les ombres s'éveillent."
          },
          {
            id: "mech_2",
            lunarPhase: "🌒 Rouage II — La Lune Croissante (Lignée d'Emory)",
            correctEffectId: "eff_healing_tide",
            hintFragment: "La marée qui monte apporte la guérison, le renouveau et l'éveil inattendu d'Emory."
          },
          {
            id: "mech_3",
            lunarPhase: "🌕 Rouage III — La Pleine Lune (Lignée de Keiran)",
            correctEffectId: "eff_tidal_force",
            hintFragment: "L'astre à son apogée déchaîne la puissance brute et la maîtrise souveraine des courants."
          },
          {
            id: "mech_4",
            lunarPhase: "🌘 Rouage IV — La Lune Décroissante (Lignée de Baz)",
            correctEffectId: "eff_memory_veil",
            hintFragment: "Le reflux dévoile la mémoire, la connaissance érudite et les vérités cachées sous l'écume."
          },
          {
            id: "mech_5",
            lunarPhase: "🌘☀️ Rouage V — L'Éclipse de la Crique de Dover",
            correctEffectId: "eff_drowned_ritual",
            hintFragment: "La conjonction interdite de la Société de l'Éclipse où la mer réclame ses Noyés et le livre des *Marées Curieuses*."
          }
        ],
        effectsPool: [
          {
            id: "eff_shadows",
 label: "Domaine des Ombres, de la Discrétion & des Illusions Nocturnes"
          },
          {
            id: "eff_healing_tide",
 label: "Flux de Guérison, de Création & d'Éveil Mystique d'Emory"
          },
          {
            id: "eff_tidal_force",
 label: "Puissance Souveraine des Hautes Eaux & Tempêtes de Keiran"
          },
          {
            id: "eff_memory_veil",
 label: "Reflux de la Mémoire, de l'Érudition de Baz & des Secrets Anciens"
          },
          {
            id: "eff_drowned_ritual",
 label: "Rituel Interdit des Noyés de Dover & Porte vers les Mondes Engloutis"
          }
        ],
        hints: [
 "Indice 1 : Nouvelle Lune = Ombres/Discrétion | Lune Croissante = Guérison/Emory | Pleine Lune = Puissance/Keiran | Lune Décroissante = Mémoire/Baz | Éclipse = Rituel des Noyés de Dover.",
 "Indice Lunaire : Associe chaque Rouage au personnage ou mot-clé correspondant : I->Ombres, II->Emory/Guérison, III->Keiran/Puissance, IV->Baz/Mémoire, V->Rituel des Noyés !"
        ],
        victoryLore:
          "Les cinq anneaux d'argent et de saphir s'emboîtent avec une mélodie cristalline ! Le Planétaire d'Aldryn projette une carte étoilée au plafond du Manoir, promettant que le Tome 2 de *Curious Tides* rejoindra bientôt tes mains."
      },
      defaultLoot: {
 title: "Astrolabe étoilé de la crique de Dover",
        category: "IRL_GIFT",
 description:
          "Un trésor lunaire remonté des profondeurs d'Aldryn par Emory et Baz pour illuminer ta veille de mi-décembre.",
        irlClue:
          "Regarde près de la fenêtre d'où l'on voit le mieux la lune le soir (sur le rebord ou derrière le rideau de la chambre/du salon) !",
        keyFragmentName: "Rune XIV — La Perle d'Éclipse de Dover (14/24)"
      }
    },

    // ========================================================================
    // JOUR 15 — LA BOUSSOLE DU MARAM (AMINA AL-SIRAFI & S.A. CHAKRABORTY)
    // ========================================================================
    {
      day: 15,
      week: 3,
 title: "La boussole pirate du Maram",
 subtitle: "Les Aventures d'Amina al-Sirafi & La Cité de Laiton — S.A. Chakraborty",
      books: ["Les Aventures d'Amina al-Sirafi", "La Cité de Laiton"],
      rarity: "common",
      tarotArcana: "X. La Roue de Fortune & La Boussole de l'Océan Indien",
      tarotSymbol: "🧭⛵",
      location: "Pont du Navire Le Maram (Mer des Récifs & des Djinns)",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "dramatic",
 text: "Hissez les voiles, Assistante ! Aujourd'hui, la reine S.A. Chakraborty est de retour avec la plus badass des capitaines pirates de l'océan Indien : Amina al-Sirafi !"
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*Croâ-pirate !* [Porte un cache-œil et un tricorne, cramponné à la barre avec une pancarte : « CARTE MARITIME 5x5 : 4 ÉNIGMES DE CAP POUR ÉVITER LES RÉCIFS ! »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "smirk",
 text: "Ton navire est entouré de monstres marins et de récifs sur une grille 5x5. Pour naviguer du Port de départ jusqu'à l'Île du Trésor, tu dois résoudre **4 énigmes de cap** sur les univers de S.A. Chakraborty. Chaque bonne réponse te donne la direction exacte (NORD ou EST) à suivre sur la boussole !"
        }
      ],
      gameType: "maram_compass",
      gameConfig: {
        promptTitle: "Navigation Tactique sur la Carte Maritime (5x5)",
        gridSize: 5,
        startPos: { row: 4, col: 0 },
        treasurePos: { row: 0, col: 4 },
        waypoints: [
          {
            step: 1,
 title: "Cap n°1 — Le métal mortel des djinns",
            question:
              "Premier récif en vue ! À Daevabad (*La Cité de Laiton*), quel métal redouté brûle la peau des Djinns, bloque leur guérison et annule leur magie ?",
            options: [
              { id: "fer", label: "Le FER (Cap NORD ⬆️ : 2 cases vers le Nord)", direction: "N", steps: 2, isCorrect: true },
              { id: "argent", label: "L'ARGENT (Cap EST ➡️ : droit dans le Kraken !)", direction: "E", steps: 1, isCorrect: false },
              { id: "cuivre", label: "Le CUIVRE (Cap OUEST ⬅️ : sur les récifs !)", direction: "W", steps: 1, isCorrect: false },
              { id: "or", label: "L'OR (Cap SUD ⬇️ : retour au port !)", direction: "S", steps: 1, isCorrect: false }
            ],
            targetPosAfterStep: { row: 2, col: 0 },
            loreFeedback: "Cap au NORD validé ! Le Fer est le fléau des Djinns : le navire évite les brisants !"
          },
          {
            step: 2,
 title: "Cap n°2 — La tribu du fléau de Qui-zi",
            question:
              "Un tourbillon barre la route ! Dans *La Cité de Laiton*, à quelle tribu militaire déchue appartient Dara (Darayavahoush), le légendaire guerrier Afshin ?",
            options: [
              { id: "nahid", label: "Les Banu Nahida (Cap SUD ⬇️ : dans le Maelström !)", direction: "S", steps: 1, isCorrect: false },
              { id: "afshin", label: "La tribu des AFSHIN (Cap EST ➡️ : 2 cases vers l'Est)", direction: "E", steps: 2, isCorrect: true },
              { id: "geziri", label: "Les Geziri (Cap OUEST ⬅️ : échouage !)", direction: "W", steps: 1, isCorrect: false },
              { id: "sahrayn", label: "Les Sahrayn (Cap NORD-OUEST : récifs !)", direction: "W", steps: 1, isCorrect: false }
            ],
            targetPosAfterStep: { row: 2, col: 2 },
            loreFeedback: "Cap à l'EST validé ! L'honneur des Afshin fend les vagues jusqu'au centre de la carte !"
          },
          {
            step: 3,
 title: "Cap n°3 — Le fleuron de la capitaine Amina",
            question:
              "La brume se lève sur l'océan Indien ! Dans *Les Aventures d'Amina al-Sirafi*, comment s'appelle le navire bien-aimé (un boutre légendaire) de la capitaine Amina ? (Tape son nom pour mettre le cap au NORD ⬆️ !)",
            inputType: "text",
            expectedAnswers: ["MARAM", "LE MARAM", "AL MARAM"],
            placeholder: "Tape le nom du navire d'Amina (5 lettres)...",
            direction: "N",
            steps: 2,
            targetPosAfterStep: { row: 0, col: 2 },
            loreFeedback: "Cap au NORD à bord du MARAM ! Les voiles claquent, l'Île du Trésor est en vue à l'horizon Est !"
          },
          {
            step: 4,
 title: "Cap n°4 — L'autrice souveraine des deux univers",
            question:
              "Dernière ligne droite vers l'Île du Coffre ! Tape le nom de famille de l'autrice géniale qui a créé à la fois *La Cité de Laiton* et *Les Aventures d'Amina al-Sirafi* pour voguer plein EST ➡️ jusqu'au Trésor !",
            inputType: "text",
            expectedAnswers: ["CHAKRABORTY", "S.A. CHAKRABORTY", "SA CHAKRABORTY", "SHANNON CHAKRABORTY"],
            placeholder: "Tape le nom de famille de l'autrice (11 lettres)...",
            direction: "E",
            steps: 2,
            targetPosAfterStep: { row: 0, col: 4 },
            loreFeedback: "TERRE EN VUE ! S.A. CHAKRABORTY guide le Maram droit dans la baie secrète du Trésor !"
          }
        ],
        hints: [
 "Indice 1 : Cap 1 = Le FER brûle les Djinns (NORD). Cap 2 = Dara appartient aux AFSHIN (EST). Cap 3 = Le navire s'appelle le MARAM (NORD). Cap 4 = L'autrice est S.A. CHAKRABORTY (EST).",
 "Indice Lunaire : Réponses des 4 caps : 1. Le FER (Nord) -> 2. Les AFSHIN (Est) -> 3. MARAM (Nord) -> 4. CHAKRABORTY (Est)."
        ],
        victoryLore:
          "L'ancre du *Maram* plonge dans le lagon doré ! Amina al-Sirafi, Dalila et Tinbu sabrent une bouteille d'épices sur le pont en saluant la meilleure navigatrice du multivers de S.A. Chakraborty !"
      },
      defaultLoot: {
 title: "Butin des sept mers de la capitaine Amina al-Sirafi",
        category: "IRL_GIFT",
 description:
          "Un coffret de contrebande royale rapporté d'Aden et de Daevabad à bord du *Maram*.",
        irlClue:
          "Navigue jusqu'à ton exemplaire des *Aventures d'Amina al-Sirafi* (ou regarde près de l'endroit où l'on garde les épices, le thé exotique ou les carnets de voyage) !",
        keyFragmentName: "Rune XV — La Rose des Vents du Maram (15/24)"
      }
    },

    // ========================================================================
    // JOUR 16 — LA MACHINE À ÉCRIRE ENCHANTÉE (REBECCA ROSS)
    // ========================================================================
    {
      day: 16,
      week: 3,
 title: "La machine à écrire d'Iris et Roman",
 subtitle: "Divines Rivalités, Impitoyables Serments & Féroce Déférence — Rebecca Ross",
      books: ["Divines Rivalités", "Impitoyables Serments", "Féroce Déférence (Wild Reverence)"],
      rarity: "common",
      tarotArcana: "III. L'Impératrice des Lettres & La Harpe d'Enva",
      tarotSymbol: "⌨️✉️",
      location: "Chambre d'Iris Winnow & Rédaction de l'Oath Gazette",
      companion: "villain",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "loving",
 text: "*Clic-clac-ding !* Tu entends ce bruit dans la nuit, mon cœur ? Une vieille machine à écrire Alouette vient de faire glisser une lettre magique sous la porte de l'armoire, comme entre Iris Winnow et Roman dans *Divines Rivalités* !"
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*Croâ-courrier !* [Coiffé d'une casquette de facteur du front, il tend une pancarte : « LA LETTRE S'EST FRAGMENTÉE EN 8 MORCEAUX + SIGNATURE REQUISE ! »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "loving",
 text: "Les vents divins d'Enva et Dacre (*Divines Rivalités* & *Féroce Déférence*) ont mélangé les **8 segments** de ma lettre secrète sur le rouleau de papier. Remets-les dans l'ordre exact pour reconstituer le message, puis frappe sur les touches le **nom de famille de Roman** pour sceller l'enveloppe !"
        }
      ],
      gameType: "enchanted_typewriter",
      gameConfig: {
        promptTitle: "L'Alouette Enchantée d'Oath (8 Segments + Signature)",
        instruction:
          "Clique sur les 8 fragments de papier dans le bon ordre pour dactylographier la lettre complète d'un bout à l'autre, puis tape la signature finale :",
        segments: [
          {
            id: "seg_1",
            order: 1,
 text: "Ma chère Iris de @lau.libraryyy,"
          },
          {
            id: "seg_2",
            order: 2,
 text: "Même lorsque les dieux Enva et Dacre"
          },
          {
            id: "seg_3",
            order: 3,
 text: "déchaînent leurs tempêtes avec une Féroce Déférence,"
          },
          {
            id: "seg_4",
            order: 4,
 text: "nos Divines Rivalités sur Babel ou Fourth Wing"
          },
          {
            id: "seg_5",
            order: 5,
 text: "se transforment toujours en Impitoyables Serments d'amour."
          },
          {
            id: "seg_6",
            order: 6,
 text: "Glisse cette lettre sous la porte de notre armoire magique :"
          },
          {
            id: "seg_7",
            order: 7,
 text: "au bout de chaque ligne tapée dans la nuit,"
          },
          {
            id: "seg_8",
            order: 8,
 text: "c'est toujours toi que je choisis. — Ton dévoué C. / Roman"
          }
        ],
        signaturePrompt:
          "Dernière touche sur la machine à écrire : Quel est le nom de famille en 4 lettres de Roman (le rival et grand amour d'Iris Winnow, qui signe d'abord « C. » pour Carver) ?",
        expectedSignatures: ["KITT", "ROMAN KITT", "CARVER"],
        signaturePlaceholder: "Tape le nom de famille de Roman (4 lettres)...",
        hints: [
 "Indice 1 : La lettre commence par « Ma chère Iris de @lau.libraryyy, » -> « Même lorsque les dieux Enva et Dacre » -> « déchaînent leurs tempêtes avec une Féroce Déférence, » -> « nos Divines Rivalités... ». Et le nom de famille de Roman est K _ T T.",
 "Indice Lunaire : Ordre des phrases : 1. Ma chère Iris... -> 2. Même lorsque les dieux... -> 3. déchaînent leurs tempêtes... -> 4. nos Divines Rivalités... -> 5. se transforment toujours... -> 6. Glisse cette lettre... -> 7. au bout de chaque ligne... -> 8. c'est toujours toi... | Signature : KITT."
        ],
        victoryLore:
          "*DING !* Le chariot de la machine à écrire revient en place dans une pluie d'étincelles bleues. La lettre s'envole sous la porte de l'armoire d'Iris et fait apparaître en retour un pli scellé de cire dorée !"
      },
      defaultLoot: {
 title: "Missive enchantée de l'armoire d'Oath",
        category: "IRL_GIFT",
 description:
          "Un courrier traversant l'espace et le temps depuis la machine à écrire de Roman Kitt et du Vilain.",
        irlClue:
          "Comme Iris Winnow, va regarder juste au pied ou à l'intérieur de la porte de notre armoire / placard (une enveloppe ou un paquet glissé sous la porte t'y attend) !",
        keyFragmentName: "Rune XVI — La Touche d'Argent de l'Alouette (16/24)"
      }
    },

    // ========================================================================
    // JOUR 17 — LE CHAUDRON D'ALCHIMIE (BLOOD OVER BRIGHT HAVEN & FORBIDDEN ALCHEMY)
    // ========================================================================
    {
      day: 17,
      week: 3,
 title: "Le laboratoire de Sciona et l'alchimie interdite",
 subtitle: "Blood Over Bright Haven (M.L. Wang) & A Forbidden Alchemy (Stacey McEwan)",
      books: ["Blood Over Bright Haven", "A Forbidden Alchemy", "L'ombre du savoir perdu", "Bénie de Césaré"],
      rarity: "common",
      tarotArcana: "IX. L'Hermite de Tiran & Le Grand Œuvre Interdit",
      tarotSymbol: "⚗️🕯️",
      location: "Haute Tour du Magisterium de Tiran",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "dramatic",
 text: "Attention où tu mets les pieds, Archimage ! Nous sommes dans le laboratoire secret de Sciona Freynan (*Blood Over Bright Haven*), où elle étudie aux côtés de Thomil la sombre vérité derrière la magie de la cité de Tiran, mêlée aux secrets de *A Forbidden Alchemy* !"
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*Croâ-potion !* [Porte des lunettes d'alchimiste sur le museau et lève une pancarte : « 6 FIOLES SUR L'ÉTAGÈRE : DISTILLE LES 3 BONNES DANS L'ORDRE EXACT ! »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "smirk",
 text: "Six fioles alchimiques reposent devant le chaudron bouillonnant. Mais le grimoire de Sciona impose **4 lois logiques strictes**. Déduis quelles sont les **3 fioles exactes** et verse-les **dans le bon ordre (1re, 2e, 3e)** pour stabiliser la transmutation sans faire sauter le Magisterium !"
        }
      ],
      gameType: "alchemy_cauldron",
      gameConfig: {
        promptTitle: "La Transmutation Logique de Tiran (3 Fioles Ordonnées sur 6)",
        vials: [
          {
            id: "ether_tiran",
            name: "Éther Lumineux de Tiran",
            color: "#38BDF8",
            icon: "💠",
            tag: "Arcane / Énergie"
          },
          {
            id: "scribe_ink",
            name: "Encre Codée du Haut-Magistère",
            color: "#818CF8",
            icon: "🖋️",
            tag: "Formule / Savoir"
          },
          {
            id: "willow_ash",
            name: "Cendre de Saule des Plaines Kwen",
            color: "#A3E635",
            icon: "🌿",
            tag: "Terre / Thomil"
          },
          {
            id: "star_blood",
            name: "Quintessence d'Alchimie Interdite",
            color: "#F43F5E",
            icon: "🩸",
            tag: "Catalyseur / Sang"
          },
          {
            id: "brass_mist",
            name: "Vapeur de Laiton Corrompu",
            color: "#F59E0B",
            icon: "🌫️",
            tag: "Métal / Instable"
          },
          {
            id: "winter_dew",
            name: "Rosée Glacée de la Barrière",
            color: "#E2E8F0",
            icon: "❄️",
            tag: "Glace / Inerte"
          }
        ],
        grimoireRules: [
          "Loi I (L'exclusion du Métal & du Givre) : La formule de Sciona rejette tout métal instable et toute eau gelée : ni la **Vapeur de Laiton Corrompu** ni la **Rosée Glacée de la Barrière** ne doivent entrer dans le chaudron.",
          "Loi II (La Base de la Formule) : Comme Sciona doit d'abord calculer ses équations sur sa machine de transcription avant tout sortilège, la **1re fiole** versée au fond du chaudron est obligatoirement l'**Encre Codée du Haut-Magistère**.",
          "Loi III (La Mémoire de Thomil) : Pour apaiser la douleur de l'Au-Delà révélée par Thomil, la **2e fiole** doit provenir de sa terre natale : la **Cendre de Saule des Plaines Kwen**.",
          "Loi IV (Le Catalyseur Final) : Entre l'*Éther Lumineux de Tiran* (qui perpétue l'exploitation du Magisterium) et la **Quintessence d'Alchimie Interdite** (*A Forbidden Alchemy*), Sciona refuse le mensonge de Tiran et achève la potion (**3e fiole**) avec la **Quintessence d'Alchimie Interdite** !"
        ],
        targetSequence: ["scribe_ink", "willow_ash", "star_blood"],
        hints: [
 "Indice 1 : Lis bien les Lois II, III et IV du grimoire : chacune désigne directement la 1re fiole (Encre Codée), la 2e fiole (Cendre de Saule des Kwen) et la 3e fiole !",
 "Indice Lunaire : Verse dans cet ordre exact : 1. Encre Codée du Haut-Magistère -> 2. Cendre de Saule des Plaines Kwen -> 3. Quintessence d'Alchimie Interdite ."
        ],
        victoryLore:
          "*BOUM DORÉ !* Le chaudron vire au pourpre étoilé et dissout le dôme mensonger de Tiran ! Sciona Freynan et Thomil te confient la clé alchimique du Jour 17."
      },
      defaultLoot: {
 title: "Élixir transmuté de Sciona et de l'alchimiste",
        category: "IRL_GIFT",
 description:
          "Une potion parfaitement dosée (garantie sans sacrifice occulte de Tiran) pour enchanter tes papilles ou ton bain.",
        irlClue:
          "Cherche dans le laboratoire d'alchimie de la maison : la salle de bain (près des flacons/élixirs) ou l'étagère à thés et infusions de la cuisine !",
        keyFragmentName: "Rune XVII — La Fiole Pourpre de Bright Haven (17/24)"
      }
    },

    // ========================================================================
    // JOUR 18 — BOSS ÉPIQUE 3 : THRILLER & CHIFFRE DE LA BIBLIOTHÈQUE
    // ========================================================================
    {
      day: 18,
      week: 3,
 title: "Boss III — Le huis clos du grenier et le chiffre de l'ombre",
 subtitle: "La Femme de l'Ombre (Loreth Anne White) & Les Thrillers de Freida McFadden",
      books: [
        "La Femme de l'Ombre",
        "La Femme de Ménage (Freida McFadden)",
        "Une saison pour mourir",
        "Les mémoires d'un expert psychiatre"
      ],
      rarity: "epic",
      tarotArcana: "XII. Le Pendu du Grenier & Le Dossier Criminel",
      tarotSymbol: "🔐🕵️‍♀️",
      location: "Chambre Mansardée Verrouillée de l'Extérieur",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "dramatic",
 text: "*CLAC !* La porte vient de se refermer à double tour derrière nous... et la poignée est verrouillée de l'extérieur ! Bienvenue dans le **TROISIÈME BOSS ÉPIQUE**, un huis clos psychologique digne de *La Femme de l'Ombre* de Loreth Anne White et des thrillers de Freida McFadden !"
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*Croâ-frisson !* [Éclaire son visage par en dessous avec une lampe torche et lève une pancarte : « BOSS 3 : CADENAS À 4 CHIFFRES DE TA BIBLIOTHÈQUE + NOM DE L'AUTRICE ! »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "smirk",
 text: "Pour t'échapper de cette chambre mansardée et débloquer ton **Troisième Gros Cadeau Épique**, aucun chiffre ne s'invente au hasard : tu dois inspecter les **4 Dossiers Criminels** posés sur le bureau, calculer chaque chiffre à partir de tes propres lectures, puis entrer le mot de passe final de *La Femme de l'Ombre* !"
        }
      ],
      gameType: "boss_thriller_cipher",
      gameConfig: {
        bossName: "L'Architecte du Huis Clos",
        bossTitle: "Maître des Chambres Verrouillées & des Twists Psychologiques",
        bossAvatar: "🕵️‍♀️",
        targetPinCode: "3426",
        caseFiles: [
          {
            digitIndex: 1,
            fileTitle: "📁 Dossier #1 : LaCitéDeLaiton_vs_BoneSeason.case",
            clueText:
              "CHIFRE 1 : Prends le nombre total de tomes de la trilogie principale de *Daevabad / La Cité de Laiton* (3), et MULTIPLIE-LE par le nombre de tomes de *The Bone Season* que nous avons réellement lus ensemble en retraite lecture (avant la fameuse expédition Vinted !).",
            expectedDigit: "3",
            calculationExplanation: "3 tomes de Daevabad × 1 seul tome de The Bone Season lu = 3 !"
          },
          {
            digitIndex: 2,
            fileTitle: "📁 Dossier #2 : SuitesEnAttenteSurEtagere.case",
            clueText:
              "CHIFFRE 2 : Additionne le nombre de tomes de *The Poppy War* déjà lus/prêts avant d'attaquer le tome 3 (2) + le nombre de tomes de *Curious Tides* déjà lus en attendant le tome 2 (1) + le nombre de tomes d'*Un passé englouti* déjà lus en attendant de lire le tome 2 (1).",
            expectedDigit: "4",
            calculationExplanation: "2 (The Poppy War) + 1 (Curious Tides T1) + 1 (Un passé englouti T1) = 4 !"
          },
          {
            digitIndex: 3,
            fileTitle: "📁 Dossier #3 : LectureCommuneCaten.case",
            clueText:
              "CHIFFRE 3 : Quel est le numéro du tome de la saga *The Will of the Many* (*Hierarchy*) que nous venons tout juste d'acheter après avoir adoré notre lecture commune du premier ?",
            expectedDigit: "2",
            calculationExplanation: "Le Tome 2 tout fraîchement acheté !"
          },
          {
            digitIndex: 4,
            fileTitle: "📁 Dossier #4 : GrenierVerrouille_McFadden.case",
            clueText:
              "CHIFFRE 4 : Dans les thrillers domestiques où la chambre sous les combles cache un terrible secret, compte exactement le nombre de lettres qui composent le prénom de la reine du twist psychologique : **F - R - E - I - D - A** (McFadden).",
            expectedDigit: "6",
            calculationExplanation: "F-R-E-I-D-A = 6 lettres !"
          }
        ],
        finalSecurityQuestion: {
 title: "Verrou biométrique final — L'autrice de *La Femme de l'ombre*",
          question:
            "Le cadenas affiche **3 - 4 - 2 - 6** ! Pour faire sauter le dernier verrou de la porte mansardée, tape le nom de l'autrice canadienne qui a écrit le thriller *La Femme de l'Ombre* (*The Maid's Diary*) :",
          expectedAnswers: [
            "LORETH ANNE WHITE",
            "WHITE",
            "LORETH WHITE",
            "LORETH-ANNE WHITE"
          ],
          placeholder: "Tape le nom de l'autrice (ex: Loreth Anne White)..."
        },
        hints: [
 "Indice 1 : Calcul des 4 chiffres : Chiffre 1 = 3 × 1 = 3 | Chiffre 2 = 2 + 1 + 1 = 4 | Chiffre 3 = Tome 2 = 2 | Chiffre 4 = F-R-E-I-D-A = 6 lettres. Et l'autrice de *La Femme de l'Ombre* est Loreth Anne W____.",
 "Indice Lunaire : Le code à 4 chiffres du cadenas est **3426** et le nom de l'autrice à valider est **LORETH ANNE WHITE** (ou **WHITE**)."
        ],
        victoryLore:
          "*CLIC-CLAC-BOUM !* Le cadenas cryptographique 3-4-2-6 s'ouvre et la porte du grenier vole en éclats ! Quel twist digne de Freida McFadden et Loreth Anne White : derrière la porte ne se cachait aucun tueur, mais le **Troisième Coffre de Boss Épique** !"
      },
      defaultLoot: {
 title: "Coffre épique III — Le dossier secret du grenier",
        category: "EPIC_BOSS_GIFT",
 description:
          "Victoire sur le Boss Thriller de la Semaine 3 ! Ton sens de l'enquête et ta connaissance chirurgicale de ta bibliothèque t'ouvrent le Troisième Gros Cadeau d'Étape !",
        irlClue:
          "GROS CADEAU ÉPIQUE N°3 : Comme dans tout bon thriller de Freida McFadden, monte chercher à l'endroit le plus haut perché de la maison (tout en haut d'une étagère/placard en hauteur ou à l'étage/grenier) !",
        keyFragmentName: "Rune Épique XVIII — La Clé Pourpre du Huis Clos (18/24)"
      }
    },

    // ========================================================================
    // SEMAINE 4 : L'ALCHIMIE ET LE TRÔNE FINAL (JOURS 19 À 24)
    // ========================================================================
    {
      day: 19,
      week: 4,
 title: "Les cartes de la providence et le roi des bergers",
 subtitle: "Fenêtre sur les Ténèbres & Deux Couronnes Corrompues — Rachel Gillig",
      books: ["Fenêtre sur les Ténèbres (One Dark Window)", "Deux Couronnes Corrompues (Two Twisted Crowns)", "Porcelaine sous les ruines"],
      rarity: "common",
      tarotArcana: "XIII. L'Arcane du Cauchemar & Le Calice d'Aulne",
      tarotSymbol: "🃏🌫️",
      location: "Forêt Brumeuse de Pierres-Claires (Blunder)",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "dramatic",
 text: "La brume de Pierres-Claires envahit le Manoir pour inaugurer la quatrième et dernière semaine avant Noël... *« Sois prudente, sois rusée, sois bonne... »* Sur la table de chêne d'Elspeth Spindle et de Ravyn Yew, douze **Cartes de la Providence** sont retournées face cachée."
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*Croâ-brume !* [Tapote la table de trois coups de griffes et lève une pancarte : « MEMORY DES 6 PAIRES DE LA PROVIDENCE + LE NOM DU MONSTRE DANS SA TÊTE ! »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "loving",
 text: "Réunis les **6 paires de Cartes de la Providence** (*Fenêtre sur les Ténèbres* & *Deux Couronnes Corrompues*), puis réponds à l'appel de la voix ancienne qui habite l'esprit d'Elspeth depuis ses onze ans !"
        }
      ],
      gameType: "providence_tarot_memory",
      gameConfig: {
        promptTitle: "Le Jeu des 12 Cartes de la Providence de Blunder",
        pairs: [
          {
            pairId: "nightmare",
            name: "Le Cauchemar",
            icon: "👹",
            borderColor: "#DC2626",
            powerText: "Permet de marcher dans les ténèbres et de parler dans l'esprit de son hôte."
          },
          {
            pairId: "maiden",
            name: "La Jeune Fille",
            icon: "🌹",
            borderColor: "#F472B6",
            powerText: "Confère une beauté et une grâce surnaturelles qui figent les regards."
          },
          {
            pairId: "scythe",
            name: "La Faux",
            icon: "⚔️",
            borderColor: "#EF4444",
            powerText: "Commande par la force du sang et plie la volonté d'autrui."
          },
          {
            pairId: "mirror",
            name: "Le Miroir Noir",
            icon: "🪞",
            borderColor: "#8B5CF6",
            powerText: "Dissimule son porteur aux yeux du monde et révèle ce qui est caché."
          },
          {
            pairId: "steed",
            name: "Le Destrier Blanc",
            icon: "🐎",
            borderColor: "#38BDF8",
            powerText: "Traverse les bois infectés par la brume avec une vitesse prodigieuse."
          },
          {
            pairId: "chalice",
            name: "Le Calice d'Aulne",
            icon: "🏆",
            borderColor: "#F59E0B",
            powerText: "Fait éclater la vérité pure dans chaque goutte versée."
          }
        ],
        finalQuestion: {
          question:
            "Les 12 Cartes de la Providence sont réunies ! Pour lever la brume de Blunder : comment s'appelle le monstre ancien de cinq cents ans (autrefois connu sous le nom de Roi des Bergers) qui partage l'esprit d'Elspeth Spindle ?",
          expectedAnswers: [
            "LE CAUCHEMAR",
            "CAUCHEMAR",
            "THE NIGHTMARE",
            "NIGHTMARE",
            "LE ROI DES BERGERS",
            "ROI DES BERGERS",
            "SHEPHERD KING"
          ],
          placeholder: "Tape le nom de cette entité (ex: Le Cauchemar)..."
        },
        hints: [
 "Indice 1 : Retourne les cartes deux par deux pour mémoriser l'emplacement des 6 icônes (, , , , , ). Ensuite, le monstre dans l'esprit d'Elspeth porte le même nom que la carte rouge aux griffes noires !",
 "Indice Lunaire : Une fois les 6 paires réunies, tape **LE CAUCHEMAR** (ou **ROI DES BERGERS**) pour valider l'épreuve !"
        ],
        victoryLore:
          "Les douze Cartes de la Providence fusionnent dans un éclat d'or et de sel ! Le Cauchemar fait claquer ses griffes avec un rire rauque mais satisfait, et Ravyn Yew dépose le coffre du Jour 19 hors de la brume."
      },
      defaultLoot: {
 title: "Reliquaire des douze cartes de pierres-claires",
        category: "IRL_GIFT",
 description:
          "Un présent tiré de la brume de Blunder, garanti sans dégénérescence magique mais 100% approuvé par Elspeth et Ravyn.",
        irlClue:
          "Regarde derrière un miroir (comme la carte du Miroir Noir !) ou tout près de ta duologie *Fenêtre sur les Ténèbres* & *Deux Couronnes Corrompues* !",
        keyFragmentName: "Rune XIX — La Carte Pourpre du Roi des Bergers (19/24)"
      }
    },

    // ========================================================================
    // JOUR 20 — LA FORGE DES ANAGRAMMES (RED CITY, GODS OF MEN & @LAU.LIBRARYYY)
    // ========================================================================
    {
      day: 20,
      week: 4,
 title: "Les portes blindées de Red City et le sceau royal",
 subtitle: "Red City (Marie Lu), Gods of Men (Barbara Kloss) & The Poet Empress",
      books: ["Red City", "Gods of Men", "The Poet Empress", "Un royaume de griffes"],
      rarity: "common",
      tarotArcana: "XIX. Le Soleil Pourpre de Red City",
      tarotSymbol: "🏙️🔮",
      location: "Distillerie Alchimique Secrète de Red City",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "loving",
 text: "Nous voici devant les portes blindées de l'un de tes grands livres préférés : *Red City* ! L'air crépite d'alchimie clandestine et de rivalités entre syndicats, mêlé aux harmonies sauvages de *Gods of Men* et aux vers dangereux de *The Poet Empress*."
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*Croâ-néon !* [Porte un trench-coat d'alchimiste urbain et une pancarte : « 2 SCEAUX D'ANAGRAMMES MAGNÉTIQUES + CLIN D'ŒIL ROYAL ! »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "smirk",
 text: "Les runes magnétiques du portail ont été brouillées ! Reconstitue d'abord le nom de cette métropole alchimique adorée, puis forge lettre par lettre le nom complet du compte Bookstagram légendaire qui règne sur tout ce multivers (avec ses trois Y finaux !)."
        }
      ],
      gameType: "anagram_forge",
      gameConfig: {
        promptTitle: "La Forge aux Deux Sceaux Magnétiques",
        seals: [
          {
            sealNumber: 1,
 title: "Sceau I — La métropole alchimique coup de cœur",
            clue: "Clique sur les 7 runes magnétiques dans le bon ordre pour reconstituer le titre (sans espace) de l'un de tes romans préférés où l'alchimie moderne gouverne la ville :",
            targetWord: "REDCITY",
            scrambledLetters: ["C", "R", "Y", "E", "T", "D", "I"]
          },
          {
            sealNumber: 2,
 title: "Sceau II — La souveraine du multivers littéraire",
            clue: "Clique sur les 12 runes d'or (sans le point ni l'@) pour forger le nom exact de ton sanctuaire Bookstagram (n'oublie aucun des trois Y finaux !) :",
            targetWord: "LAULIBRARYYY",
            scrambledLetters: ["Y", "L", "R", "A", "Y", "U", "B", "L", "I", "R", "Y", "A"]
          }
        ],
        bonusQuestion: {
          question:
            "Validation des Harmonies (*Gods of Men* & *The Poet Empress*) : Quelle forme d'art ou d'expression est au cœur du pouvoir dangereux dans *Gods of Men* (Sable) et *The Poet Empress* ?",
          options: [
            { id: "music_poetry", text: "La musique vibratoire des harmonies de l'Éther (pour Sable dans *Gods of Men*) et la poésie impériale mortelle (dans *The Poet Empress*)" },
            { id: "cooking", text: "La pâtisserie moléculaire aux pancakes d'Athena Liu" },
            { id: "football", text: "Le tournoi de Quidditch sur dragons de Basgiath" },
            { id: "knitting", text: "Le tricot de pulls irlandais pour grenouilles couronnées" }
          ],
          correctOptionId: "music_poetry"
        },
        hints: [
 "Indice 1 : Sceau 1 = RED CITY (7 lettres : R-E-D-C-I-T-Y). Sceau 2 = LAU LIBRARYYY (12 lettres : L-A-U-L-I-B-R-A-R-Y-Y-Y).",
 "Indice Lunaire : Forme d'abord REDCITY, puis LAULIBRARYYY, et choisis la réponse sur la musique vibratoire et la poésie impériale !"
        ],
        victoryLore:
          "Les runes de néon rouge et d'or s'emboîtent avec un grondement sourd ! Le blason lumineux de **@lau.libraryyy** s'allume au sommet des tours de *Red City* et ouvre la chambre forte du Jour 20."
      },
      defaultLoot: {
 title: "Insigne souverain de Red City et de @lau.libraryyy",
        category: "IRL_GIFT",
 description:
          "Un trésor d'alchimiste réservé à la créatrice de @lau.libraryyy, à seulement quatre jours du Grand Final.",
        irlClue:
          "Va regarder là où tu prends tes plus belles photos pour @lau.libraryyy (près de ton coin photo bookstagram, de ton trépied/lumière ou de ton exemplaire de *Red City*) !",
        keyFragmentName: "Rune XX — Le Sceau Écarlate de Red City (20/24)"
      }
    },

    // ========================================================================
    // JOUR 21 — BOSS ÉPIQUE 4 : COMPLOT ROYAL (THIS KINGDOM WILL NOT KILL ME & ROSE IN CHAINS)
    // ========================================================================
    {
      day: 21,
      week: 4,
 title: "Boss IV — Le complot de la couronne et les chaînes de rose",
 subtitle: "This Kingdom Will Not Kill Me, Rose in Chains & Le trône d'Orlane Grey",
      books: [
        "This Kingdom Will Not Kill Me",
        "Rose in Chains",
        "Le trône d'Orlane Grey",
        "Un destin forgé dans le feu",
        "La voie éternelle (The Raven Scholar)"
      ],
      rarity: "epic",
      tarotArcana: "IV. L'Empereur Déchu & La Rose Brise-Chaînes",
      tarotSymbol: "👑⛓️",
      location: "Salle du Trône Assiégée du Palais Royal",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "dramatic",
 text: "QUATRIÈME ET DERNIER BOSS ÉPIQUE ! Aux portes de la Salle du Trône, l'Usurpateur Royal tente d'accomplir ce que le titre de ton roman jure d'empêcher : *This Kingdom Will Not Kill Me* ! Et autour du trône s'enroulent les fers de *Rose in Chains* et du *Trône d'Orlane Grey* !"
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*CROÂ-CHEVALIER !* [Porte un heaume royal miniature et brandit une épée en bois avec une pancarte : « ACTE 1 : DÉMASQUE L'ESPION LOGIQUE / ACTE 2 : DUEL RPG EN 3 TOURS (100 PV) ! »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "loving",
 text: "Ce Boss se joue en **2 Actes** ! Dans l'Acte 1, quatre conspirateurs de la Cour te font face : utilise la logique pure pour démasquer celui qui détient la clé de l'armurerie. Dans l'Acte 2, affronte l'Usurpateur (100 PV) dans un **Combat RPG Tactique en 3 Tours** en choisissant à chaque tour la parade littéraire exacte pour débloquer ton **4e Gros Cadeau Épique** !"
        }
      ],
      gameType: "boss_royal_conspiracy",
      gameConfig: {
        bossName: "L'Usurpateur aux Chaînes d'Or",
        bossTitle: "Seigneur des Conspirateurs & Geôlier de la Couronne",
        bossMaxHp: 100,
        bossAvatar: "👑",
        act1: {
 title: "Acte I — L'énigme logique des 4 conspirateurs de la cour",
          ruleDescription:
            "Quatre nobles de la cour sont alignés devant la porte de l'armurerie. Un seul d'entre eux a caché la Clé Royale dans sa cape. ATTENTION À LA RÈGLE D'OR : **Parmi ces 4 suspects, UN SEUL dit la vérité, et les TROIS AUTRES mentent !**",
          suspects: [
            {
              id: "suspect_1",
              name: "Lord Cassian de Haute-Tour",
              portrait: "🧔‍♂️",
              statement: "« Ce n'est pas moi qui ai la Clé Royale ! C'est Lady Vespera qui l'a cachée dans sa manche ! »"
            },
            {
              id: "suspect_2",
              name: "Lady Vespera des Ronces",
              portrait: "👩‍🦰",
              statement: "« Lord Cassian ment ! La Clé Royale est entre les mains du Chambellan Aldric ! »"
            },
            {
              id: "suspect_3",
              name: "Chambellan Aldric le Silencieux",
              portrait: "🧓",
              statement: "« Ni moi ni Lady Vespera n'avons la Clé Royale. »"
            },
            {
              id: "suspect_4",
              name: "Duchesse Orlane d'Épine",
              portrait: "👸",
              statement: "« C'est moi qui détiens la Clé Royale ! »"
            }
          ],
          question:
            "Analyse logique : Sachant qu'UN SEUL suspect dit la vérité et que les TROIS autres mentent, qui détient réellement la Clé Royale ?",
          correctSuspectId: "suspect_2",
          logicalProof:
            "Démonstration : Si la Clé était chez Cassian, Orlane ou Aldric, alors soit deux personnes diraient la vérité, soit zéro ! En revanche, si **Lady Vespera** détient la Clé : 1) Cassian dit la VÉRITÉ ('C'est Vespera !'), 2) Vespera MENT ('C'est Aldric'), 3) Aldric MENT (car Vespera l'a !), et 4) Orlane MENT ('C'est moi'). Un seul dit la vérité : la coupable est donc **Lady Vespera des Ronces** !"
        },
        act2: {
 title: "Acte II — Duel RPG tactique contre l'usurpateur (100 PV)",
          rounds: [
            {
              turn: 1,
              bossHpBefore: 100,
              bossDamageOnWin: 35,
              bossAttackName: "Attaque 1 : « Décret Mortel de la Couronne ! »",
              bossAttackDescription:
                "L'Usurpateur lève son sceptre : « Tu es piégée dans un royaume impitoyable où chaque noble complote ta mort ! Aucune voyageuse projetée dans ces intrigues royales ne peut survivre à ma cour ! »",
              tacticalPrompt: "Quelle parade littéraire de ta bibliothèque brise son décret royal ?",
              moves: [
                {
                  id: "move_kingdom",
 label: "Parade : « This Kingdom Will Not Kill Me ! »",
                  subText: "Invoquer la ténacité de survivante face aux complots meurtriers du royaume",
                  isCorrect: true,
                  combatLog: "💥 COUP CRITIQUE (-35 PV) ! Tu lui renvoies son propre décret : ce royaume ne te tuera pas !"
                },
                {
                  id: "move_babel",
 label: "Parade : « Réciter une note de bas de page de Babel »",
                  subText: "Lui expliquer l'étymologie latine du mot 'couronne' pendant 40 minutes",
                  isCorrect: false,
                  combatLog: "❌ ÉCHEC ! Le Vilain applaudit au fond de la salle, mais l'Usurpateur n'est même pas égratigné !"
                },
                {
                  id: "move_vinted",
 label: "Parade : « Lui revendre The Bone Season 2 sur Vinted »",
                  subText: "Lui proposer un lot relié juste avant une réédition",
                  isCorrect: false,
                  combatLog: "❌ ÉCHEC ! L'Usurpateur a déjà précommandé la réédition brochée !"
                }
              ]
            },
            {
              turn: 2,
              bossHpBefore: 65,
              bossDamageOnWin: 35,
              bossAttackName: "Attaque 2 : « Entraves de Fer & Rosier Captif ! »",
              bossAttackDescription:
                "L'Usurpateur fait jaillir des chaînes enchantées du sol pour emprisonner ta magie et briser ta lignée comme une fleur captive dans un cachot d'enchères obscures !",
              tacticalPrompt: "Quel sortilège littéraire transmute ses fers en épines mortelles ?",
              moves: [
                {
                  id: "move_jade",
 label: "Sort : « Invoquer le Tome 2 de Jade City »",
                  subText: "Appeler à l'aide un livre que tu as abandonné après le tome 1",
                  isCorrect: false,
                  combatLog: "❌ ÉCHEC ! Aucun guerrier de Janloon ne répond à l'appel d'un DNF !"
                },
                {
                  id: "move_rose",
 label: "Sort : « Brise-Fers de Rose in Chains ! »",
                  subText: "Retourner les chaînes royales contre le geôlier dans une tempête de ronces et de magie rebelle",
                  isCorrect: true,
                  combatLog: "💥 FRAPPE DÉVASTATRICE (-35 PV) ! Les fers de *Rose in Chains* se brisent et lacèrent l'armure de l'Usurpateur !"
                },
                {
                  id: "move_pancake",
 label: "Sort : « Lancer les pancakes de Yellowface »",
                  subText: "Tenter d'étouffer le Boss tout en volant son manuscrit",
                  isCorrect: false,
                  combatLog: "❌ ÉCHEC ! L'Usurpateur esquive le pancake d'Athena Liu !"
                }
              ]
            },
            {
              turn: 3,
              bossHpBefore: 30,
              bossDamageOnWin: 30,
              bossAttackName: "Attaque 3 : « Jugement de l'Ombre & de la Flamme Céleste ! »",
              bossAttackDescription:
                "Affaibli à 30 PV, l'Usurpateur invoque à la fois un brasier de métal ardent et une énigme des anciens érudits pour te porter le coup de grâce !",
              tacticalPrompt: "Choisis ton attaque finale combinée pour réduire ses PV à ZÉRO :",
              moves: [
                {
                  id: "move_final_combo",
 label: "Combo Ultime : « Un destin forgé dans le feu & La Voie Éternelle du Corbeau ! »",
                  subText: "Allier le marteau ardent d'Hazel McBride et la sagesse du Raven Scholar pour foudroyer le trône",
                  isCorrect: true,
                  combatLog: "🌟 COUP DE GRÂCE (-30 PV -> 0 PV) ! Le marteau de feu et les ailes du Corbeau pulvérisent la couronne de l'Usurpateur !"
                },
                {
                  id: "move_fourth_wing",
 label: "Attaque : « Crier que Fourth Wing est sous-coté »",
                  subText: "Prononcer un mensonge si énorme qu'il fait trembler le plafond",
                  isCorrect: false,
                  combatLog: "❌ IMPOSSIBLE ! Même ton personnage refuse de prononcer une telle hérésie !"
                },
                {
                  id: "move_prison2",
 label: "Attaque : « Lire le Tome 2 de The Prison Healer »",
                  subText: "Invoquer un livre qui n'existe pas dans ton canon",
                  isCorrect: false,
                  combatLog: "❌ ÉCHEC ! On ne peut pas frapper un Boss avec un tome qui n'existe pas !"
                }
              ]
            }
          ]
        },
        hints: [
 "Indice 1 : Acte 1 (Logique) : Si Lady Vespera a la clé, alors seul Lord Cassian dit la vérité ('C'est Vespera !') tandis que Vespera, Aldric et Orlane mentent tous les trois. La coupable qui détient la clé est donc **Lady Vespera** !",
 "Indice Lunaire : Acte 1 : Choisis **Lady Vespera des Ronces**. Acte 2 (Combat RPG) : Tour 1 = *This Kingdom Will Not Kill Me* | Tour 2 = *Rose in Chains* | Tour 3 = *Un destin forgé dans le feu & La Voie Éternelle* !"
        ],
        victoryLore:
          "L'Usurpateur tombe à genoux, sa couronne brisée roule jusqu'aux pattes de Kingsley ! Tu as triomphé des **4 Boss Épiques** du multivers. Le trône s'ouvre pour révéler le **Quatrième Coffre de Boss Épique** !"
      },
      defaultLoot: {
 title: "Coffre épique IV — Le trésor de la reine indomptable",
        category: "EPIC_BOSS_GIFT",
 description:
          "4 Boss Épiques vaincus sur 4 ! Tu règnes sans partage sur la Cour Royale. Voici ton Quatrième Gros Cadeau d'Étape avant le sprint final vers Noël !",
        irlClue:
          "GROS CADEAU ÉPIQUE N°4 : Va fouiller sous le « trône » officiel de la maison (sous ou derrière ton fauteuil de lecture préféré / le canapé royal du salon) !",
        keyFragmentName: "Rune Épique XXI — La Couronne Brise-Chaînes (21/24)"
      }
    },

    // ========================================================================
    // JOUR 22 — PUZZLE GLISSANT HIVERNAL (L'EFFET BOULE DE NEIGE & HAPPY PLACE)
    // ========================================================================
    {
      day: 22,
      week: 4,
 title: "Chalet sous la neige et souvenirs de Happy Place",
 subtitle: "L'Effet Boule de Neige (Clara Héraut) & Happy Place (Emily Henry)",
      books: ["L'Effet Boule de Neige", "Happy Place"],
      rarity: "common",
      tarotArcana: "XXI. Le Monde Enfloconné & Le Refuge des Amis",
      tarotSymbol: "❄️🏡",
      location: "Véranda Enneigée du Manoir & Cottage du Maine",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "loving",
 text: "Après l'intensité du Boss Royal d'hier, regarde par la fenêtre, mon cœur : de gros flocons tombent sur le Manoir ! Aujourd'hui, place à une pause cocooning tout en douceur entre *L'Effet Boule de Neige* de Clara Héraut et le cottage en bord de mer de *Happy Place* d'Emily Henry."
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*Croâ-flocon !* [Porte un bonnet à pompon rouge et une écharpe trois fois trop longue, avec une pancarte : « PUZZLE GLISSANT 3x3 + 1ER FRAGMENT MAJEUR DE LA CLÉ DU SANCTUAIRE ! »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "loving",
 text: "Une bourrasque hivernale a mélangé les **9 tuiles** du vitrail illustré de notre chalet de Noël ! Fais glisser les tuiles sur la grille 3x3 pour reconstituer l'image (et si jamais un taquin te résiste, Kingsley a caché une baguette d'alignement magique !), puis réponds à la question douceur pour forger le **Premier Fragment Majeur de la Clé du Sanctuaire**."
        }
      ],
      gameType: "winter_sliding_puzzle",
      gameConfig: {
        promptTitle: "Le Vitrail Hivernal de Noël (Taquin 3x3 + Question Cocooning)",
        gridSize: 3,
        tiles: [
          { id: 1, label: "1", icon: "🌨️", title: "Ciel Étoilé" },
          { id: 2, label: "2", icon: "🏔️", title: "Sommets Blancs" },
          { id: 3, label: "3", icon: "🌙", title: "Lune d'Hiver" },
          { id: 4, label: "4", icon: "🎄", title: "Sapin Doré" },
          { id: 5, label: "5", icon: "🏡", title: "Chalet Cocooning" },
          { id: 6, label: "6", icon: "📚", title: "Pile de Livres" },
          { id: 7, label: "7", icon: "☕", title: "Chocolat Chaud" },
          { id: 8, label: "8", icon: "🐸", title: "Kingsley au Chaud" },
          { id: 0, label: "", icon: "✨", title: "Case Vide", isEmpty: true }
        ],
        initialBoard: [1, 2, 3, 4, 5, 6, 0, 7, 8],
        magicAutoSolveAfterMoves: 12,
        cozyQuestion: {
          question:
            "Douceur Hivernale : Que partagent l'ambiance de *L'Effet Boule de Neige* (Clara Héraut) et celle de *Happy Place* (Emily Henry) dans ta bibliothèque ?",
          options: [
            {
              id: "cozy_romance",
 text: "Ce sont deux romans contemporains pleins d'émotion, de retrouvailles (chalet enneigé en famille / maison de vacances dans le Maine avec Harriet et Wyn) et de tendresse qui réchauffent le cœur entre deux dark fantasy"
            },
            {
              id: "cozy_wrong1",
 text: "Ce sont deux traités militaires sur l'art de décapiter des Rephaïm à Oxford"
            },
            {
              id: "cozy_wrong2",
 text: "Ce sont les tomes 5 et 6 de The Prison Healer écrits par Gideon Sharpe"
            },
            {
              id: "cozy_wrong3",
 text: "Ce sont deux guides juridiques pour négocier les frais de port sur Vinted"
            }
          ],
          correctOptionId: "cozy_romance"
        },
        hints: [
 "Indice 1 : Sur le taquin 3x3, fais glisser les tuiles adjacentes à la case vide pour aligner les numéros 1 à 8 dans l'ordre (les tuiles 7 et 8 sont presque déjà en place !). Tu peux aussi utiliser le bouton « Coup de Pouce Magique de Kingsley » si besoin.",
 "Indice Lunaire : Clique sur la tuile 7 puis sur la tuile 8 (ou sur le bouton d'alignement magique de Kingsley), puis choisis la réponse sur les retrouvailles au chalet enneigé et la maison du Maine (Harriet & Wyn) !"
        ],
        victoryLore:
          "Le vitrail enneigé s'illumine d'une lueur ambrée ! Au centre du chalet, Kingsley te tend sur un coussin de velours le **Premier Fragment Majeur de la Clé Légendaire du Sanctuaire** !"
      },
      defaultLoot: {
 title: "Coffret cocooning « effet boule de neige » et 1er fragment de clé",
        category: "IRL_GIFT",
 description:
          "Une parenthèse de douceur hivernale pour te chouchouter à l'approche du réveillon, accompagnée de la première moitié de la Clé du 24 décembre.",
        irlClue:
          "Regarde au pied ou dans les branches du sapin de Noël (ou près des décorations d'hiver du salon) : un paquet tout doux y brille sous les guirlandes !",
        keyFragmentName: "Rune XXII — Le Premier Fragment de la Clé Astrale (22/24)"
      }
    },

    // ========================================================================
    // JOUR 23 — LE GRAND CONSEIL DE LA VEILLE (UN DESTIN FORGÉ DANS LE FEU, RAVEN SCHOLAR, MONSOON RISING)
    // ========================================================================
    {
      day: 23,
      week: 4,
 title: "Le grand conseil de la veille du sanctuaire",
 subtitle: "Un destin forgé dans le feu (Hazel McBride), La Voie Éternelle (The Raven Scholar) & A Monsoon Rising (Thea Guanzon)",
      books: [
        "Un destin forgé dans le feu",
        "La voie éternelle (The Raven Scholar)",
        "A Monsoon Rising (The Hurricane Wars T2)",
        "Le refrain de la rivière"
      ],
      rarity: "common",
      tarotArcana: "IX-Bis. Le Conseil des Sentinelles & Le Marteau Céleste",
      tarotSymbol: "🐦‍⬛🌩️",
      location: "Grande Arche Étoilée devant les Portes du Sanctuaire Final",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "dramatic",
 text: "23 décembre... Nous y sommes presque, mon Assistante adorée. Devant la Grande Arche du Sanctuaire Final montent la garde les héros de *Un destin forgé dans le feu* (Hazel McBride), les érudits de *La Voie Éternelle (The Raven Scholar)* et les tempêtes de *A Monsoon Rising* !"
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*CROÂ SOLENNEL !* [Porte une cape étoilée d'Archiviste et lève une pancarte : « DERNIÈRE VEILLE : 4 QUESTIONS DU GRAND CONSEIL POUR FORGER LA SECONDE MOITIÉ DE LA CLÉ ! »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain",
          avatar: "assets/villain_boyfriend.png",
          mood: "loving",
 text: "Le Grand Conseil de la Veille veut s'assurer que tu as gardé en mémoire tous nos voyages à travers ce calendrier avant l'Apothéose de demain. Réponds sans faillir à leurs **4 questions de synthèse** pour souder le **Second Fragment Majeur de la Clé Légendaire** !"
        }
      ],
      gameType: "grand_council_quiz",
      gameConfig: {
        promptTitle: "L'Épreuve des Quatre Sentinelles de la Grande Arche",
        questions: [
          {
            id: "council_q1",
            sentinel: "Sentinelle I — L'Érudit du Corbeau (*La Voie Éternelle / The Raven Scholar*)",
            question:
 "« Dans *The Raven Scholar* (*La Voie Éternelle* d'Antonia Hodgson), huit candidats représentant les huit grands gardiens animaux s'affrontent à travers des épreuves d'érudition, d'intrigues et un meurtre mystérieux pour succéder à l'Empereur. Quel animal tutélaire est associé à Neema Kraa, l'érudite brillante au cœur du récit ? »",
            options: [
              { id: "raven", text: "Le Corbeau (The Raven) — symbole d'intelligence, de mémoire et de ruse" },
              { id: "frog", text: "La Grenouille à Pancartes du Vilain" },
              { id: "platypus", text: "L'Ornithorynque d'Argent d'Oxford" },
              { id: "koala", text: "Le Koala des Brumes de Blunder" }
            ],
            correctOptionId: "raven",
            explanation: "Le Corbeau (The Raven Scholar), évidemment !"
          },
          {
            id: "council_q2",
            sentinel: "Sentinelle II — La Tempête & La Forge (*Un destin forgé dans le feu* & *A Monsoon Rising*)",
            question:
 "« Entre *Un destin forgé dans le feu* (Hazel McBride) et *A Monsoon Rising* (suite de *The Hurricane Wars* de Thea Guanzon avec Talasyn et Alaric), quelle force unit ces deux récits épiques de ta bibliothèque ? »",
            options: [
              {
                id: "elements_enemies",
 text: "Des héroïnes puissantes maîtrisant des forces élémentaires ou divines (le feu de la forge céleste / la magie de lumière face à la mousson d'ombres) liées à un ennemi juré par un destin ou une alliance forcée"
              },
              {
                id: "elements_wrong1",
 text: "Deux documentaires réalistes sur la météo en Belgique pendant Trolls & Légendes"
              },
              {
                id: "elements_wrong2",
 text: "Deux suites directes de Jade City écrites par Freida McFadden"
              },
              {
                id: "elements_wrong3",
 text: "Deux romans où tout le monde adore Babel sans la moindre réserve"
              }
            ],
            correctOptionId: "elements_enemies",
            explanation: "Exact : le feu des dieux, la mousson des ombres et des alliances électriques !"
          },
          {
            id: "council_q3",
            sentinel: "Sentinelle III — Le Gardien de nos Souvenirs de Couple",
            question:
 "« Récapitulatif de nos aventures depuis le Jour 1 : laquelle de ces affirmations rassemble EXACTEMENT nos vraies anecdotes de couple croisées dans ce calendrier ? »",
            options: [
              {
                id: "couple_true",
 text: "Mons & Trolls & Légendes (bières + papotages avec l'autrice de L'Effondrement inspirée par Hades), l'Irlande avec N'invite pas la forêt à entrer, la retraite lecture de The Bone Season 1 (et l'achat Vinted des 2-3-4 reliés 1 mois avant leur réédition !), et notre lecture commune de The Will of the Many"
              },
              {
                id: "couple_false1",
 text: "Un voyage au Japon en lisant Fourth Wing, suivi de l'achat de 14 exemplaires de Babel pour décorer la salle de bain"
              },
              {
                id: "couple_false2",
 text: "L'abandon de La Cité de Laiton au chapitre 2 pour relire dix fois les tomes 2 et 3 de The Prison Healer"
              },
              {
                id: "couple_false3",
 text: "Une retraite silencieuse sans une goutte de bière où l'on a fui tous les auteurs de Trolls & Légendes"
              }
            ],
            correctOptionId: "couple_true",
            explanation: "100% notre histoire, avec chaque pépite et chaque fou rire !"
          },
          {
            id: "council_q4",
            sentinel: "Sentinelle IV — Le Portier du 24 Décembre",
            question:
 "« Dernière question avant l'assemblage de la Clé Légendaire : combien d'Éclats de Runes auras-tu réunis au total ce soir après avoir validé cette 23e porte, juste avant l'ouverture du Sanctuaire Final demain ? »",
            options: [
              { id: "runes_23", text: "23 Éclats de Runes (23/24) — prêts à accueillir la 24e Rune Légendaire demain !" },
              { id: "runes_12", text: "12 Éclats et un bon d'achat Vinted" },
              { id: "runes_99", text: "99 barres d'argent d'Oxford" },
              { id: "runes_1", text: "Un seul (parce que comme pour Prison Healer, seul le 1 compte)" }
            ],
            correctOptionId: "runes_23",
            explanation: "23 Runes sur 24 brillent dans ton inventaire ! La Clé du Sanctuaire est forgée !"
          }
        ],
        hints: [
 "Indice 1 : Question 1 = Le Corbeau (The Raven) | Question 2 = Les forces élémentaires/divines et alliances forcées | Question 3 = Mons, Irlande, Vinted (Bone Season) et The Will of the Many | Question 4 = 23 Éclats de Runes (23/24).",
 "Indice Lunaire : Choisis la 1re option à chacune des 4 questions du Grand Conseil pour forger le Second Fragment de la Clé !"
        ],
        victoryLore:
          "Dans un éclair d'or et d'argent, le Premier et le Second Fragment fusionnent devant la Grande Arche ! Les 23 Runes lévitent en couronne autour des Portes du Sanctuaire. Demain, le 24 décembre, l'Apothéose t'attend..."
      },
      defaultLoot: {
 title: "Trésor de la veille et clé légendaire forgée",
        category: "IRL_GIFT",
 description:
          "L'avant-dernier présent du Manoir pour savourer la veille du 24 décembre, tandis que la Clé du Sanctuaire brille dans ton inventaire.",
        irlClue:
          "Regarde sur ta table de chevet (ou sous ton oreiller avant de t'endormir à la veille du réveillon) : le paquet n°23 veille sur tes rêves !",
        keyFragmentName: "Rune XXIII — Le Second Fragment de la Clé Astrale (23/24)"
      }
    },

    // ========================================================================
    // JOUR 24 — LÉGENDAIRE : LE GRAND FINAL (LE SANCTUAIRE DE @LAU.LIBRARYYY)
    // ========================================================================
    {
      day: 24,
      week: 4,
 title: "Légendaire — Le sanctuaire étoilé de @lau.libraryyy",
 subtitle: "L'Apothéose du 24 Décembre — Tous nos Univers Réunis",
      books: [
        "La Cité de Laiton (Trilogie Daevabad)",
        "Assistant to the Villain",
        "The Will of the Many",
        "Red City",
        "Curious Tides",
        "N'invite pas la forêt à entrer",
        "Gild (La Saga d'Auren)",
        "Divines Rivalités"
      ],
      rarity: "legendary",
      tarotArcana: "XXII. L'Éternité du Vilain & de son Assistante (@lau.libraryyy)",
      tarotSymbol: "👑💖✨",
      location: "Le Sanctuaire Astral au Cœur du Multivers de Laure",
      companion: "both",
      introDialogue: [
        {
 speaker: "villain",
          name: "Le Vilain (Ton Chéri)",
          avatar: "assets/villain_boyfriend.png",
          mood: "loving",
 text: "Joyeux Réveillon du 24 décembre, mon Assistante préférée... Regarde autour de nous : les portes du Sanctuaire Étoilé se sont ouvertes. Nahri et Dara sont venus de Daevabad, Vis Telimus a quitté Caten, Auren a déployé ses rubans d'or, Emory contemple la lune d'Aldryn et Iris Winnow tient sa machine à écrire prête."
        },
        {
 speaker: "kingsley",
          name: "Kingsley",
          avatar: "assets/kingsley_frog.png",
          mood: "excited",
 text: "*CROÂ LÉGENDAIRE !* [Porte son plus beau nœud papillon doré de Noël et lève une pancarte scintillante : « 24/24 : ASSEMBLE LA ROSACE, RÉSOUS L'ACROSTICHE DU CŒUR & OUVRE LE COFFRE LÉGENDAIRE ! »]"
        },
        {
 speaker: "villain",
          name: "Le Vilain (Ton Chéri)",
          avatar: "assets/villain_boyfriend.png",
          mood: "loving",
 text: "Voici l'ultime épreuve de notre Calendrier RPG en **3 Sceaux d'Amour & de Littérature** : insère les 23 Runes et la Clé Légendaire sur la Rosace Astrale, déchiffre l'**Acrostiche Final du Multivers**, puis brise le cachet de cire de ma **Grande Lettre d'Amour** pour révéler la cachette de ton **Gros Cadeau de Noël Légendaire** !"
        }
      ],
      gameType: "legendary_finale",
      gameConfig: {
        promptTitle: "L'Apothéose du Sanctuaire — Les 3 Sceaux Légendaires",
        seal1: {
 title: "Premier sceau — La rosace astrale des 24 runes",
 description:
            "Active les 4 Piliers Cardinaux du Multivers pour enchâsser tes 23 Runes récoltées et tourner la Clé Légendaire au centre de la Rosace :",
          pillars: [
            {
              id: "pillar_daevabad",
 label: "Pilier du Feu de Daevabad & du Maram",
              icon: "🔥",
              quote: "« Pour ta saga préférée de S.A. Chakraborty qui brille au sommet de tes étagères. »"
            },
            {
              id: "pillar_mons_ireland",
 label: "Pilier des Souvenirs : Mons, Trolls & Légendes & l'Irlande",
              icon: "🍻☘️",
              quote: "« Pour nos bières belges en papotant avec les auteurs, nos fous rires sur Vinted et nos lectures sous la pluie irlandaise. »"
            },
            {
              id: "pillar_caten_aldryn",
 label: "Pilier de Caten, d'Aldryn & de Red City",
              icon: "🏛️🌙",
              quote: "« Pour notre lecture commune de The Will of the Many, ton Sort de Lune d'Aldryn et les néons de Red City. »"
            },
            {
              id: "pillar_villain_evie",
 label: "Pilier du Vilain, d'Evie Sage & de Kingsley",
              icon: "👑🐸",
              quote: "« Pour la meilleure Assistante du multivers et la reine de @lau.libraryyy ! »"
            }
          ]
        },
        seal2: {
 title: "Deuxième sceau — L'acrostiche final du multivers",
          instruction:
            "Les premières lettres de 5 réponses sacrées de ton multivers forment le mot-clé final en 5 lettres qui gouverne ce calendrier. Résous l'acrostiche et tape le mot secret (5 lettres) :",
          acrosticLines: [
            {
              letterIndex: 1,
              expectedLetter: "A",
              clue: "1re lettre : Comme **A**uren aux rubans d'or (*Gild*), **A**mina al-Sirafi ou **A**ssistant to the Villain."
            },
            {
              letterIndex: 2,
              expectedLetter: "M",
              clue: "2e lettre : Comme **M**ons (notre Foire du Livre et Trolls & Légendes) ou le navire Le **M**aram."
            },
            {
              letterIndex: 3,
              expectedLetter: "O",
              clue: "3e lettre : Comme l'**O**nirophage Paige Mahoney (*The Bone Season 1*) ou **O**livia Gometz (*Les Carmidors*)."
            },
            {
              letterIndex: 4,
              expectedLetter: "U",
              clue: "4e lettre : Comme **U**n passé englouti (Ava Reid) ou **U**n destin forgé dans le feu (Hazel McBride)."
            },
            {
              letterIndex: 5,
              expectedLetter: "R",
              clue: "5e lettre : Comme **R**ed City, **R**in de Sinegard (*The Poppy War*) ou **R**une Winters (*Heartless Hunter*)."
            }
          ],
          expectedFinalWords: ["AMOUR", "LAURE", "LAURA", "L'AMOUR"],
          placeholder: "Tape le mot de 5 lettres formé par l'acrostiche (A-M-O-U-R ou L-A-U-R-A)..."
        },
        seal3: {
 title: "Troisième sceau — La lettre d'amour du Vilain à son assistante préférée",
          illustrationAsset: "assets/couple_finale.png",
          defaultLoveLetter: `Ma tendre Laure, mon Assistante préférée et Reine absolue de @lau.libraryyy,

Si tu lis cette lettre au cœur du Sanctuaire Étoilé, c'est que tu as triomphé des 24 portes, déjoué mes quiz trolls, survécu aux 4 Boss Épiques et réuni toutes les runes de notre multivers.

En créant cette aventure pour toi, j'ai réalisé à quel point chacun de tes livres raconte aussi un chapitre de notre propre histoire :
- Nos yeux qui brillent et nos pintes qui trinquent à Trolls & Légendes et à la Foire du Livre de Mons pendant que tu papotes vingt minutes avec les autrices de leurs inspirations secrètes ;
- Nos paysages d'Irlande enveloppés de brume pendant qu'on lisait *N'invite pas la forêt à entrer* ;
- Notre retraite lecture en amoureux sur le tome 1 de *The Bone Season* (et mon fou rire éternel devant ton expédition Vinted pour acheter les tomes 2, 3 et 4 reliés une fortune tout juste un mois avant l'annonce de leur réédition... sans jamais les avoir ouverts depuis !) ;
- Notre lecture commune géniale de *The Will of the Many* (vivement qu'on dévore le tome 2 qu'on vient d'acheter !) ;
- Et même nos éternels débats passionnés où je défends *Babel* corps et âme pendant que tu me regardes avec ton sourire malicieux en décrétant que c'est « moyen », que *Fourth Wing* est surcoté et que seul le tome 1 de *The Prison Healer* existe dans l'univers !

Tu es mon coup de cœur littéraire et réel de chaque jour, ma Nahri à Daevabad, mon Evie Sage dans ce manoir (avec Kingsley qui lève sa pancarte « JE T'AIME »), mon Iris Winnow derrière la machine à écrire.

Joyeux Noël mon amour. Que ta bibliothèque continue de grandir, que les tomes 2 de *Curious Tides* et d'*Un passé englouti* ainsi que le tome 3 de *The Poppy War* soient à la hauteur de tes rêves, et que nous écrivions encore des milliers de chapitres tous les deux.

Avec tout mon amour (et promis, aucune réédition surprise sous le sapin),
Ton Vilain préféré ❤️`
        },
        hints: [
 "Indice 1 : Active d'abord les 4 piliers de la Rosace Astrale. Ensuite, les premières lettres des 5 lignes de l'acrostiche sont A - M - O - U - R (tu peux aussi taper LAURE !).",
 "Indice Lunaire : Clique sur les 4 piliers dorés, puis tape **AMOUR** (ou **LAURA**) pour desceller la Lettre Finale du Vilain et révéler le Coffre Légendaire !"
        ],
        victoryLore:
          "✨ APOTHÉOSE DANS LE SANCTUAIRE ! ✨ Une pluie d'étoiles dorées s'abat sur la Grande Bibliothèque de @lau.libraryyy ! Les 24 Runes forment une couronne céleste, Kingsley lance des confettis d'or, et le **Coffre Légendaire de Noël** s'ouvre enfin devant toi !"
      },
      defaultLoot: {
 title: "Coffre légendaire de Noël — Le grand trésor du sanctuaire de @lau.libraryyy",
        category: "LEGENDARY_GIFT",
 description:
          "La récompense ultime du 24 Décembre ! Tu as complété le Calendrier de l'Avent RPG à 100% et réuni les 24 Runes du Multivers.",
        irlClue:
          "CADEAU LÉGENDAIRE DU 24 DÉCEMBRE : Ferme les yeux, tourne-toi vers ton Vilain préféré et dis-lui le mot de passe « KINGSLEY COURONNE D'OR » — il va te remettre en main propre (ou t'emmener devant la cachette secrète sous le sapin) ton Grand Cadeau de Noël Légendaire !",
        keyFragmentName: "Rune Légendaire XXIV — Le Cœur Étoilé de @lau.libraryyy (24/24)"
      }
    }
  ];

  // ==========================================================================
  // 5. EXPORT DES RÉCOMPENSES PAR DÉFAUT & LETTRE FINALE (POUR LE MODE MAÎTRE DU JEU)
  // ==========================================================================
  window.DEFAULT_REWARDS = {
    days: {},
    finalLoveLetter:
      window.ADVENT_DAYS_DATA[23] &&
      window.ADVENT_DAYS_DATA[23].gameConfig &&
      window.ADVENT_DAYS_DATA[23].gameConfig.seal3
        ? window.ADVENT_DAYS_DATA[23].gameConfig.seal3.defaultLoveLetter
        : ""
  };

  window.ADVENT_DAYS_DATA.forEach(function (dayObj) {
    window.DEFAULT_REWARDS.days[dayObj.day] = {
      day: dayObj.day,
 title: dayObj.defaultLoot.title,
      category: dayObj.defaultLoot.category,
 description: dayObj.defaultLoot.description,
      irlClue: dayObj.defaultLoot.irlClue,
      keyFragmentName: dayObj.defaultLoot.keyFragmentName,
      rarity: dayObj.rarity
    };
  });
})();
