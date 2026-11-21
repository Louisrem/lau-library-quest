/**
 * APP.JS — CONTRÔLEUR PRINCIPAL & ARCHITECTE UI/UX
 * "L'Assistante du Vilain & Le Multivers de @lau.libraryyy"
 * Style : Grimoire Illustré & Cartes de Tarot (Dark Academia / Romantasy / De Saxus / Hades)
 *
 * Responsabilités :
 * 1. HUD Royal : Compteur 0/24 Runes, Badge de Maison d'Aldryn (Curious Tides),
 *    Sélecteur Temporel (Mode Exploration Libre / Démo ACTIVÉ PAR DÉFAUT vs Mode Décembre Réel).
 * 2. Les 4 Semaines / Mondes avec leurs bannières illustrées et les 24 Cartes de Tarot 3D
 *    (Commun, Épique Boss Jours 6/12/18/21, Légendaire Jour 24 avec les 23 serrures runiques).
 * 3. Scène Narrative Visual Novel Interactif (Portraits Laura, Kingsley, Le Vilain)
 *    + Intégration souple avec window.MiniGamesEngine.renderGame(...).
 * 4. Cérémonie du Sceau de Cire Rouge (3 clics tactiles avec fissures dorées, vibrations,
 *    explosion ParticleFX.burst) & Ouverture du Coffre SVG (Bois/Laiton, Cramoisi/Rubis, Solaire)
 *    + Carte de Butin IRL ("Où récupérer ta surprise dans le monde réel") + Lettre d'Amour Jour 24.
 * 5. Grimoire de Butin & Bons Digitaux ("Marquer comme réclamé") + Bibliothèque de Lau (Codex).
 * 6. Atelier du Vilain (Mode Maître du Jeu / Copain) : personnalisation des 24 cadeaux/cachettes IRL,
 *    Grande Lettre d'Amour, export/import JSON, réinitialisation 0/24.
 */

(function () {
  'use strict';

  const STORAGE_KEYS = {
    STATE: 'lau_grimoire_quest_state_v1',
    GM_OVERRIDES: 'lau_grimoire_gm_overrides_v1'
  };

  const ROMAN_NUMERALS = [
    '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
    'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
    'XXI', 'XXII', 'XXIII', 'XXIV'
  ];

  const WORLDS_CONFIG = [
    {
      week: 1,
      daysRange: [1, 6],
      kicker: 'SEMAINE I • JOURS I À VI',
      title: 'Le Bureau du Vilain & L’Académie des Marées',
      banner: 'assets/world_week1_office.png',
      description: 'Des parchemins tachés d’encre rouge du Manoir du Vilain jusqu’aux falaises lunaires d’Aldryn, là où Sire Kingsley veille sur les secrets des marées.'
    },
    {
      week: 2,
      daysRange: [7, 12],
      kicker: 'SEMAINE II • JOURS VII À XII',
      title: 'Du Désert de Laiton aux Brumes d’Irlande',
      banner: 'assets/world_week2_desert_forest.png',
      description: 'De la cité de Daevabad aux landes mystiques d’Irlande, en passant par les Cartes de la Providence de Rachel Gillig et les manoirs gothiques.'
    },
    {
      week: 3,
      daysRange: [13, 18],
      kicker: 'SEMAINE III • JOURS XIII À XVIII',
      title: 'Flammes, Guerres et Salons à Mons',
      banner: 'assets/world_week3_flames_gold.png',
      description: 'Entre les machines à écrire enchantées de Divine Rivals, les flammes dorées, les thés brûlants à Mons et les jugements littéraires sans pitié de Lau.'
    },
    {
      week: 4,
      daysRange: [19, 24],
      kicker: 'SEMAINE IV • JOURS XIX À XXIV',
      title: 'L’Alchimie et le Sanctuaire Final',
      banner: 'assets/world_week4_sanctuary.png',
      description: 'Les dernières runes alchimiques convergent vers les 23 serrures du Sanctuaire Solaire, où le Vilain attend son Assistante pour l’apothéose du 24 Décembre.'
    }
  ];

  const DEFAULT_LOVE_LETTER = `Ma chère Assistante (et Héroïne préférée de tous les multivers),

Depuis le premier chapitre de notre histoire — entre nos fous rires, nos balades à Mons, tes piles à lire qui défient les lois de la gravité et tes avis littéraires aussi tranchants qu’une dague de Romantasy — tu as ensorcelé mon quotidien bien mieux que n’importe quel grimoire.

Même le plus redoutable des Vilains dépose les armes devant toi (et Kingsley approuve depuis son coussin royal 🐸👑).

Merci d’être cette lectrice passionnée, solaire, drôle et merveilleuse. Que ces 24 Arcanes ne soient que le prologue de toutes nos prochaines aventures à deux.

Joyeux Noël mon amour,
Ton Vilain dévoué pour l’éternité ❤️`;

  // Fallback de sécurité si days_data.js n'est pas encore chargé
  const FALLBACK_24_DAYS = [
    { day: 1, week: 1, roman: 'I', arcanaName: 'L’Assistante & La Grenouille', title: 'Entretien au Manoir du Vilain', rarity: 'common', emblem: '🐸', books: ['Assistant to the Villain — Hannah Nicole Maehrer'], lootTitle: 'Relique du Bureau du Vilain & Surprise Cosy', lootCategory: 'Cadeau caché chez nous', irlLocation: 'Cachette IRL : Regarde sous ton oreiller ou près de ta pile à lire sur la table de chevet !', lootDescription: 'Un premier artefact scellé par Sire Kingsley pour inaugurer ton contrat officiel au Manoir.' },
    { day: 2, week: 1, roman: 'II', arcanaName: 'Le Calice d’Encre Rouge', title: 'Les Archives Interdites', rarity: 'common', emblem: '🪶', books: ['Assistant to the Villain', 'Red Rising'], lootTitle: 'Douceur Sucrée & Marque-Page Royal', lootCategory: 'Cadeau caché chez nous', irlLocation: 'Cachette IRL : Dans le tiroir ou l’étagère des thés et chocolats de la cuisine !', lootDescription: 'De quoi reprendre des forces entre deux rapports de torture (très bien orthographiés).' },
    { day: 3, week: 1, roman: 'III', arcanaName: 'L’Oracle duNon-Absolu', title: 'Le Tribunal Critique de @lau.libraryyy', rarity: 'common', emblem: '⚖️', books: ['Powerless ("C’est NON !")', 'Fourth Wing'], lootTitle: 'Bon Digital : Session Librairie / Vinted Bookish', lootCategory: 'Bon digital', irlLocation: 'Bon Digital à présenter à ton Vilain : 1 livre de ta Wishlist offert sans aucune négociation !', lootDescription: 'Parce qu’après un "C’est NON !", il faut toujours un vrai coup de cœur pour se consoler.' },
    { day: 4, week: 1, roman: 'IV', arcanaName: 'La Lune d’Aldryn', title: 'La Cérémonie des Marées', rarity: 'common', emblem: '🌙', books: ['Curious Tides — Pascale Lacelle'], lootTitle: 'Insigne Lunaire d’Aldryn & Pause Cocooning', lootCategory: 'Cadeau caché chez nous', irlLocation: 'Cachette IRL : Caché derrière ta rangée de romans reliés préférés dans la bibliothèque !', lootDescription: 'Les marées d’Aldryn ont reconnu ton affinité arcanique.' },
    { day: 5, week: 1, roman: 'V', arcanaName: 'Le Miroir des Brumes', title: 'L’Énigme de la Fenêtre Sombre', rarity: 'common', emblem: '🃏', books: ['One Dark Window — Rachel Gillig'], lootTitle: 'Carte de la Providence & Gourmandise', lootCategory: 'Cadeau caché chez nous', irlLocation: 'Cachette IRL : Dans la poche de ton manteau préféré dans l’entrée !', lootDescription: 'Une Carte de la Providence qui ne réclame aucun tribut obscur.' },
    { day: 6, week: 1, roman: 'VI', arcanaName: 'Le Cauchemar & Le Roi des Ombres', title: 'BOSS I : L’Assaut du Roi de la Brume', rarity: 'epic', isBoss: true, emblem: '⚔️', books: ['Two Twisted Crowns — Rachel Gillig', 'Assistant to the Villain'], lootTitle: 'COFFRE ÉPIQUE DE SAINT-NICOLAS : Trésor Majeur de la Semaine I', lootCategory: 'Gros Cadeau Boss', irlLocation: 'Cachette Boss IRL : Regarde tout au fond du grand placard du salon (sous le plaid) !', lootDescription: 'Premier Boss terrassé ! Le Roi des Ombres s’incline devant l’Assistante du Vilain.' },
    { day: 7, week: 2, roman: 'VII', arcanaName: 'La Flamme de Laiton', title: 'Les Portes de Daevabad', rarity: 'common', emblem: '🕌', books: ['La Cité de Laiton — S.A. Chakraborty'], lootTitle: 'Élixir des Djinns & Thé Parfumé', lootCategory: 'Cadeau caché chez nous', irlLocation: 'Cachette IRL : Près de la bouilloire ou de ta tasse préférée !', lootDescription: 'Un parfum d’épices et de magie ancienne venu tout droit de Daevabad.' },
    { day: 8, week: 2, roman: 'VIII', arcanaName: 'Le Trèfle des Landes', title: 'Souvenirs des Falaises d’Irlande', rarity: 'common', emblem: '☘️', books: ['Contes d’Irlande & Romantasy'], lootTitle: 'Bon Digital : Soirée Pub Irlandais / Guiness & Plaid', lootCategory: 'Bon digital', irlLocation: 'Bon Digital : Ton Vilain prépare l’apéro dînatoire d’inspiration irlandaise ce soir !', lootDescription: 'Un vent d’Irlande souffle sur le grimoire de votre couple.' },
    { day: 9, week: 2, roman: 'IX', arcanaName: 'L’Épée de Verre', title: 'La Danse des Lames', rarity: 'common', emblem: '🗡️', books: ['Le Pont des Tempêtes', 'The Serpent and the Wings of Night'], lootTitle: 'Surprise Brillante pour Lectrice Nocturne', lootCategory: 'Cadeau caché chez nous', irlLocation: 'Cachette IRL : Sous le coussin gauche du canapé du salon !', lootDescription: 'Pour éclairer tes chapitres lus à 2h du matin ("juste un dernier chapitre").' },
    { day: 10, week: 2, roman: 'X', arcanaName: 'La Roue des Saisons', title: 'Les Éditions Reliées De Saxus', rarity: 'common', emblem: '📚', books: ['Collection De Saxus — Jaspages Dorés'], lootTitle: 'Accessoire Bookstagram pour @lau.libraryyy', lootCategory: 'Cadeau caché chez nous', irlLocation: 'Cachette IRL : Posé près de ton coin photo Bookstagram !', lootDescription: 'De quoi sublimer tes prochains reels et photos de jaspages dorés.' },
    { day: 11, week: 2, roman: 'XI', arcanaName: 'La Plume Enchantée', title: 'Correspondance au Clair de Lune', rarity: 'common', emblem: '✉️', books: ['Divine Rivals — Rebecca Ross'], lootTitle: 'Lettre Scellée & Douceur d’Hiver', lootCategory: 'Cadeau caché chez nous', irlLocation: 'Cachette IRL : Glissé entre les pages du livre tout en haut de ta PAL !', lootDescription: 'Une missive glissée sous l’armoire magique.' },
    { day: 12, week: 2, roman: 'XII', arcanaName: 'Le Léviathan des Brumes', title: 'BOSS II : Le Gardien du Solstice', rarity: 'epic', isBoss: true, emblem: '🐉', books: ['A Fate Inked in Blood', 'La Cité de Laiton'], lootTitle: 'COFFRE ÉPIQUE DE MI-PARCOURS : Le Grand Butin de la Semaine II', lootCategory: 'Gros Cadeau Boss', irlLocation: 'Cachette Boss IRL : Dans le coffre / tiroir secret de la chambre à coucher !', lootDescription: 'À mi-chemin du Sanctuaire ! Tu viens de briser le douzième sceau.' },
    { day: 13, week: 3, roman: 'XIII', arcanaName: 'La Machine à Écrire d’Iris', title: 'Les Dépêches du Front Mystique', rarity: 'common', emblem: '⌨️', books: ['Divine Rivals & Ruthless Vows — Rebecca Ross'], lootTitle: 'Bon Digital : Massage Royal de 30 Minutes par le Vilain', lootCategory: 'Bon digital', irlLocation: 'Bon Digital à activer quand tu veux : Massage des épaules et du dos pendant ta lecture !', lootDescription: 'Même les correspondantes de guerre ont droit au repos royal.' },
    { day: 14, week: 3, roman: 'XIV', arcanaName: 'Le Beffroi de Mons', title: 'Rendez-vous Secret sur la Grand-Place', rarity: 'common', emblem: '🏛️', books: ['Chroniques de Mons & Souvenirs à Deux'], lootTitle: 'Bon Digital : Date Romantique & Goûter Gourmand à Mons', lootCategory: 'Bon digital', irlLocation: 'Bon Digital : Sortie en amoureux à Mons (librairie + pâtisserie + boisson chaude) offerte par ton Vilain !', lootDescription: 'Parce que toutes les plus belles quêtes passent par les pavés de Mons.' },
    { day: 15, week: 3, roman: 'XV', arcanaName: 'Le Pacte du Prince Cruel', title: 'Les Intrigues de Domfhlaith', rarity: 'common', emblem: '👑', books: ['Le Prince Cruel — Holly Black'], lootTitle: 'Trésor Féerique (Sans Piège de Faë)', lootCategory: 'Cadeau caché chez nous', irlLocation: 'Cachette IRL : Derrière le miroir ou dans le meuble de la salle de bain !', lootDescription: 'Juré sur l’honneur de Jude Duarte : ce cadeau ne contient aucun enchantement traître.' },
    { day: 16, week: 3, roman: 'XVI', arcanaName: 'La Tour d’Obsidienne', title: 'Le Choc des Empires', rarity: 'common', emblem: '🔥', books: ['Red Rising — Pierce Brown', 'Empire of the Vampire'], lootTitle: 'Récompense Ardente de Mars', lootCategory: 'Cadeau caché chez nous', irlLocation: 'Cachette IRL : Sur l’étagère du haut du bureau !', lootDescription: 'Omnis Vir Lupus ! Une surprise forgée dans l’or et la braise.' },
    { day: 17, week: 3, roman: 'XVII', arcanaName: 'L’Étoile des Lectrices', title: 'La Nuit des 1000 Pages', rarity: 'common', emblem: '⭐', books: ['Once Upon a Broken Heart — Stephanie Garber'], lootTitle: 'Surprise Enchantée du Nord Magnifique', lootCategory: 'Cadeau caché chez nous', irlLocation: 'Cachette IRL : Caché dans ton sac à main ou ton tote-bag de librairie préféré !', lootDescription: 'Jacks aurait demandé un baiser mortel, ton Vilain se contente d’un vrai bisou.' },
    { day: 18, week: 3, roman: 'XVIII', arcanaName: 'L’Inquisiteur des Flammes', title: 'BOSS III : La Bataille du Troisième Monde', rarity: 'epic', isBoss: true, emblem: '⚔️', books: ['Ruthless Vows', 'One Dark Window'], lootTitle: 'COFFRE ÉPIQUE DE LA SEMAINE III : Relique Majeure de Flamme & d’Or', lootCategory: 'Gros Cadeau Boss', irlLocation: 'Cachette Boss IRL : Regarde sous le lit (côté fenêtre) dans la boîte dorée !', lootDescription: 'Troisième Boss vaincu ! Plus que six runes avant l’ouverture du Sanctuaire.' },
    { day: 19, week: 4, roman: 'XIX', arcanaName: 'Le Soleil Alchimique', title: 'L’Atelier des Potions d’Or', rarity: 'common', emblem: '⚗️', books: ['Alchemised', 'A Study in Drowning'], lootTitle: 'Élixir de Détente & Bougie Parfumée', lootCategory: 'Cadeau caché chez nous', irlLocation: 'Cachette IRL : Près des bougies du salon !', lootDescription: 'Une transmutation parfaite pour parfumer tes soirées de lecture d’hiver.' },
    { day: 20, week: 4, roman: 'XX', arcanaName: 'Le Jugement des Reliures', title: 'La Grande Bibliothèque Céleste', rarity: 'common', emblem: '📜', books: ['Babel — R.F. Kuang', 'The Atlas Six'], lootTitle: 'Bon Digital : Soirée Cinéma / Série & Repas Favori commandé', lootCategory: 'Bon digital', irlLocation: 'Bon Digital : Tu choisis le film/série ET le plat commandé ce soir, le Vilain s’occupe de tout !', lootDescription: 'L’étymologie du bonheur se traduit par : zéro vaisselle et ton plat préféré.' },
    { day: 21, week: 4, roman: 'XXI', arcanaName: 'L’Archonte du Solstice d’Hiver', title: 'BOSS IV : L’Épreuve Ultime avant le Sanctuaire', rarity: 'epic', isBoss: true, emblem: '👑', books: ['Assistant to the Villain — Tome II & III', 'Curious Tides'], lootTitle: 'COFFRE ÉPIQUE DU SOLSTICE (JOUR 21) : Le Trésor Royal du Vilain', lootCategory: 'Gros Cadeau Boss', irlLocation: 'Cachette Boss IRL : Dans la penderie derrière la pile de pulls d’hiver !', lootDescription: 'Tous les Généraux du Multivers sont tombés ! Le chemin vers le 24 Décembre est ouvert.' },
    { day: 22, week: 4, roman: 'XXII', arcanaName: 'La Couronne de Gui', title: 'Les Préparatifs du Réveillon au Manoir', rarity: 'common', emblem: '🌿', books: ['The Love Hypothesis', 'Romances de Noël'], lootTitle: 'Douceur Pré-Réveillon & Attention Tendre', lootCategory: 'Cadeau caché chez nous', irlLocation: 'Cachette IRL : Au pied du sapin (ou près des décorations de Noël) !', lootDescription: 'Kingsley a mis son petit bonnet rouge pour l’occasion.' },
    { day: 23, week: 4, roman: 'XXIII', arcanaName: 'La Clé des 23 Serrures', title: 'La Veille de l’Apothéose', rarity: 'common', emblem: '🗝️', books: ['Tous les coups de cœur de @lau.libraryyy'], lootTitle: 'Le Vingt-Troisième Fragment & Surprise de la Veille', lootCategory: 'Cadeau caché chez nous', irlLocation: 'Cachette IRL : Sur ta table de nuit, juste à côté de ta lampe !', lootDescription: 'Les 23 serrures runiques brillent dans l’obscurité. Demain, le Sanctuaire s’ouvre.' },
    { day: 24, week: 4, roman: 'XXIV', arcanaName: 'Le Monde & Les Amants Éternels', title: 'GRAND FINAL : Le Sanctuaire Secret du Vilain & de son Assistante', rarity: 'legendary', isBoss: true, isFinale: true, emblem: '☀️', books: ['L’Histoire Éternelle de Laura & Son Vilain'], lootTitle: 'COFFRE LÉGENDAIRE DU 24 DÉCEMBRE : Le Grand Cadeau de Noël & La Lettre du Vilain', lootCategory: 'Gros Cadeau Boss', irlLocation: 'Cachette Légendaire IRL : Demande directement à ton Vilain en lui donnant le mot de passe secret (ou regarde au pied du sapin) !', lootDescription: 'Les 24 Arcanes sont réunis. La Bibliothèque Ensorcelée s’incline devant sa Reine.' }
  ];

  // ==========================================================================
  // ÉTAT GLOBAL DE L'APPLICATION
  // ==========================================================================
  const AppState = {
    // ACTIVÉ PAR DÉFAUT aujourd'hui pour que son copain puisse tout tester librement !
    freeExploreMode: true,
    completedDays: [], // ex: [1, 2, 4]
    claimedLoots: [],  // ex: [1, 3]
    selectedWeek: 'all',
    selectedFilter: 'all',
    selectedCodexFilter: 'all',
    showAllLootPreview: false,
    aldrynHouse: {
      name: "Ordre de l'Éclipse & des Marées",
      icon: '🌙',
      power: 'Totem : Corbeau Astral • Pouvoir : Clairvoyance des Arcanes'
    },
    couplePassword: 'KINGSLEY',
    finaleLoveLetter: DEFAULT_LOVE_LETTER,
    // État de la modale active
    activeDayNumber: null,
    activeStage: 'story', // 'story' | 'game' | 'loot'
    vnLineIndex: 0,
    vnShowAll: false,
    waxClicksCount: 0,
    waxBrokenInSession: false
  };

  let gmOverrides = {};

  // ==========================================================================
  // INITIALISATION & PERSISTANCE LOCALSTORAGE
  // ==========================================================================
  function loadPersistedState() {
    try {
      const rawState = localStorage.getItem(STORAGE_KEYS.STATE);
      if (rawState) {
        const parsed = JSON.parse(rawState);
        if (typeof parsed.freeExploreMode === 'boolean') {
          AppState.freeExploreMode = parsed.freeExploreMode;
        }
        if (Array.isArray(parsed.completedDays)) {
          AppState.completedDays = parsed.completedDays;
        }
        if (Array.isArray(parsed.claimedLoots)) {
          AppState.claimedLoots = parsed.claimedLoots;
        }
        if (parsed.aldrynHouse && parsed.aldrynHouse.name) {
          AppState.aldrynHouse = parsed.aldrynHouse;
        }
        if (parsed.couplePassword) {
          AppState.couplePassword = parsed.couplePassword;
        }
        if (parsed.finaleLoveLetter) {
          AppState.finaleLoveLetter = parsed.finaleLoveLetter;
        }
      }
    } catch (e) {
      console.warn('Impossible de charger AppState depuis localStorage:', e);
    }

    try {
      const rawGM = localStorage.getItem(STORAGE_KEYS.GM_OVERRIDES);
      if (rawGM) {
        gmOverrides = JSON.parse(rawGM) || {};
      }
    } catch (e) {
      gmOverrides = {};
    }
  }

  function savePersistedState() {
    try {
      const payload = {
        freeExploreMode: AppState.freeExploreMode,
        completedDays: AppState.completedDays,
        claimedLoots: AppState.claimedLoots,
        aldrynHouse: AppState.aldrynHouse,
        couplePassword: AppState.couplePassword,
        finaleLoveLetter: AppState.finaleLoveLetter
      };
      localStorage.setItem(STORAGE_KEYS.STATE, JSON.stringify(payload));
    } catch (e) {
      console.warn('Erreur sauvegarde AppState:', e);
    }
  }

  function saveGMOverrides() {
    try {
      localStorage.setItem(STORAGE_KEYS.GM_OVERRIDES, JSON.stringify(gmOverrides));
    } catch (e) {
      console.warn('Erreur sauvegarde GMOverrides:', e);
    }
  }

  // ==========================================================================
  // NORMALISATION DES 24 JOURS (COMPATIBLE AVEC TOUTE STRUCTURE DE DAYS_DATA.JS)
  // ==========================================================================
  function getRawDaysSource() {
    if (Array.isArray(window.ADVENT_DAYS_DATA) && window.ADVENT_DAYS_DATA.length > 0) {
      return window.ADVENT_DAYS_DATA;
    }
    if (window.ADVENT_DAYS_DATA && Array.isArray(window.ADVENT_DAYS_DATA.days)) {
      return window.ADVENT_DAYS_DATA.days;
    }
    return FALLBACK_24_DAYS;
  }

  function normalizeDayObject(raw, idx) {
    const dayNum = Number(raw.day || raw.id || idx + 1);
    const fallback = FALLBACK_24_DAYS.find((d) => d.day === dayNum) || FALLBACK_24_DAYS[0];
    const weekNum = Number(raw.week || Math.ceil(dayNum / 6));
    const isBossDay = Boolean(
      raw.isBoss ||
      [6, 12, 18, 21, 24].includes(dayNum) ||
      String(raw.rarity || '').toLowerCase().includes('epic') ||
      String(raw.rarity || '').toLowerCase().includes('épique') ||
      String(raw.rarity || '').toLowerCase().includes('legend')
    );
    const isFinale = dayNum === 24 || Boolean(raw.isFinale);

    let rarityKey = 'commun';
    if (isFinale) {
      rarityKey = 'legendaire';
    } else if (isBossDay) {
      rarityKey = 'epique';
    }

    // Livres associés
    let booksList = [];
    if (Array.isArray(raw.books)) {
      booksList = raw.books.map((b) => (typeof b === 'string' ? b : b.title || b.name || 'Roman Mystère'));
    } else if (Array.isArray(raw.bookReferences)) {
      booksList = raw.bookReferences;
    } else if (typeof raw.book === 'string') {
      booksList = [raw.book];
    } else if (typeof raw.themeBook === 'string') {
      booksList = [raw.themeBook];
    } else {
      booksList = fallback.books || ['Grimoire de @lau.libraryyy'];
    }

    // Dialogues Visual Novel
    let dialogues = [];
    const rawDialogues = raw.introDialogue || raw.dialogue || raw.dialogues || raw.story || (raw.narrative && raw.narrative.dialogue);
    if (Array.isArray(rawDialogues) && rawDialogues.length > 0) {
      dialogues = rawDialogues.map((line) => ({
        speaker: line.name || line.speaker || line.character || line.author || 'Le Vilain',
        role: detectSpeakerRole(line.speaker || line.name || line.character || line.role || ''),
        text: line.text || line.line || line.content || ''
      }));
    } else if (typeof rawDialogues === 'string') {
      dialogues = [
        { speaker: '👑 Le Vilain', role: 'villain', text: rawDialogues }
      ];
    } else {
      dialogues = buildDefaultDialogues(dayNum, raw.title || fallback.title, booksList, isBossDay, isFinale);
    }

    // Butin & Cachette IRL (avec surcharge Maître du Jeu / Copain si présente)
    const rawLoot = raw.defaultLoot || raw.loot || raw.reward || raw.gift || {};
    const override = gmOverrides[dayNum] || {};

    const CATEGORY_LABELS = {
      IRL_GIFT: 'Cadeau caché chez nous',
      DIGITAL_COUPON: 'Bon digital',
      BOSS_GIFT: 'Gros Cadeau Boss',
      LEGENDARY_GIFT: 'Gros Cadeau Boss'
    };

    const rawCat = rawLoot.category || rawLoot.type || raw.lootCategory || '';
    const mappedCategory = CATEGORY_LABELS[rawCat] || rawCat || fallback.lootCategory || (isBossDay ? 'Gros Cadeau Boss' : 'Cadeau caché chez nous');

    const lootTitle =
      override.lootTitle ||
      rawLoot.title ||
      rawLoot.name ||
      raw.lootTitle ||
      fallback.lootTitle;

    const irlLocation =
      override.irlLocation ||
      rawLoot.irlClue ||
      rawLoot.irlLocation ||
      rawLoot.irlHint ||
      rawLoot.hidingSpot ||
      rawLoot.cachette ||
      raw.irlLocation ||
      raw.irlHint ||
      fallback.irlLocation;

    const lootCategory =
      override.lootCategory ||
      mappedCategory;

    const lootDescription =
      override.lootDescription ||
      rawLoot.description ||
      rawLoot.rpDescription ||
      rawLoot.lore ||
      raw.lootDescription ||
      fallback.lootDescription;

    return {
      day: dayNum,
      week: weekNum,
      roman: raw.roman || ROMAN_NUMERALS[dayNum] || String(dayNum),
      arcanaName: raw.tarotArcana || raw.arcanaName || raw.arcana || raw.tarotCard || fallback.arcanaName,
      title: raw.title || raw.chapterTitle || fallback.title,
      subtitle: raw.subtitle || '',
      emblem: raw.tarotSymbol || raw.emblem || raw.icon || fallback.emblem || '✦',
      rarityKey, // 'commun' | 'epique' | 'legendaire'
      isBoss: isBossDay,
      isFinale,
      books: booksList,
      dialogues,
      minigame: raw.gameConfig || raw.minigame || raw.game || raw.challenge || {
        type: raw.gameType || 'password',
        day: dayNum
      },
      loot: {
        title: lootTitle,
        irlLocation,
        category: lootCategory,
        description: lootDescription,
        keyFragmentName: rawLoot.keyFragmentName || `Rune ${ROMAN_NUMERALS[dayNum] || dayNum} (${dayNum}/24)`
      },
      rawOriginal: raw
    };
  }

  function detectSpeakerRole(speakerStr) {
    const s = String(speakerStr).toLowerCase();
    if (s.includes('laura') || s.includes('héroïne') || s.includes('heroine') || s.includes('assistante') || s.includes('lau')) {
      return 'laura';
    }
    if (s.includes('kingsley') || s.includes('grenouille') || s.includes('frog')) {
      return 'kingsley';
    }
    return 'villain';
  }

  function buildDefaultDialogues(dayNum, chapterTitle, booksList, isBossDay, isFinale) {
    const bookLabel = booksList.join(' & ');
    if (isFinale) {
      return [
        {
          speaker: '👑 Le Vilain (Ton Copain)',
          role: 'villain',
          text: `Nous y voilà, mon Assistante adorée. Les 23 serrures runiques ont cédé une à une devant ta perspicacité littéraire.`
        },
        {
          speaker: '🐸 Sire Kingsley',
          role: 'kingsley',
          text: `*Coasse solennellement en ajustant sa couronne d’or* « CROÂ ! (Traduction officielle : La Reine de @lau.libraryyy mérite son coffre légendaire !) »`
        },
        {
          speaker: '✨ Laura (@lau.libraryyy)',
          role: 'laura',
          text: `Vingt-quatre jours à travers nos livres préférés, de Mons jusqu’à Aldryn… Voyons quel ultime secret tu me caches dans ce Sanctuaire !`
        }
      ];
    }
    if (isBossDay) {
      return [
        {
          speaker: '🐸 Sire Kingsley',
          role: 'kingsley',
          text: `*Agit sa pancarte miniature d’alerte rouge* « ALERTE BOSS DU JOUR ${dayNum} ! Un gardien majeur bloque le coffre épique ! »`
        },
        {
          speaker: '👑 Le Vilain (Ton Copain)',
          role: 'villain',
          text: `Attention Laura, ce chapitre "${chapterTitle}" (${bookLabel}) garde l’un des plus gros trésors IRL de ton calendrier. Prête à lui montrer la puissance de @lau.libraryyy ?`
        },
        {
          speaker: '✨ Laura (@lau.libraryyy)',
          role: 'laura',
          text: `J’ai survécu à des cliffhangers insoutenables et à des romans de 900 pages. Ce Boss n’a aucune chance !`
        }
      ];
    }
    return [
      {
        speaker: '👑 Le Vilain (Ton Copain)',
        role: 'villain',
        text: `Bienvenue au Jour ${dayNum} du Grimoire, mon Assistante. Aujourd’hui, les astres s’alignent autour de "${chapterTitle}" (${bookLabel}).`
      },
      {
        speaker: '✨ Laura (@lau.libraryyy)',
        role: 'laura',
        text: `Voyons quelle épreuve littéraire tu as préparée avec Kingsley pour déverrouiller ma surprise du jour !`
      },
      {
        speaker: '🐸 Sire Kingsley',
        role: 'kingsley',
        text: `*Tient un petit sceau de cire rouge entre ses pattes* « Brise l’énigme, puis fais éclater la cire pour découvrir où ton cadeau est caché dans la maison ! »`
      }
    ];
  }

  function getAllNormalizedDays() {
    const rawList = getRawDaysSource();
    return rawList.map((item, idx) => normalizeDayObject(item, idx));
  }

  function getDayByNumber(dayNum) {
    const all = getAllNormalizedDays();
    return all.find((d) => d.day === Number(dayNum)) || all[0];
  }

  // ==========================================================================
  // LOGIQUE TEMPORELLE (MODE EXPLORATION LIBRE vs MODE DÉCEMBRE RÉEL)
  // ==========================================================================
  function getCurrentDecemberDay() {
    const now = new Date();
    const month = now.getMonth(); // 11 = Décembre
    const date = now.getDate();
    if (month === 11) {
      return Math.min(24, Math.max(1, date));
    }
    return 1;
  }

  function isDayUnlocked(dayNum) {
    if (AppState.freeExploreMode) {
      return true;
    }
    const maxAllowed = getCurrentDecemberDay();
    return dayNum <= maxAllowed || AppState.completedDays.includes(dayNum);
  }

  function isDayCompleted(dayNum) {
    return AppState.completedDays.includes(Number(dayNum));
  }

  // ==========================================================================
  // 1. RENDU DU HUD ROYAL (COMPTEUR RUNES, MAISON D'ALDRYN, MODE TEMPOREL)
  // ==========================================================================
  function renderHUD() {
    const completedCount = AppState.completedDays.length;
    const pct = Math.min(100, Math.round((completedCount / 24) * 100));

    const badgeEl = document.getElementById('runes-counter-badge');
    const fillEl = document.getElementById('runes-bar-fill');
    const navLootCountEl = document.getElementById('nav-loot-count');

    if (badgeEl) {
      badgeEl.textContent = `${completedCount} / 24 Runes (${pct}%)`;
    }
    if (fillEl) {
      fillEl.style.width = `${pct}%`;
    }
    if (navLootCountEl) {
      navLootCountEl.textContent = String(completedCount);
    }

    // Maison d'Aldryn
    const houseIconEl = document.getElementById('aldryn-crest-icon');
    const houseNameEl = document.getElementById('aldryn-house-name');
    const housePowerEl = document.getElementById('aldryn-house-power');
    if (houseIconEl) houseIconEl.textContent = AppState.aldrynHouse.icon || '🌙';
    if (houseNameEl) houseNameEl.textContent = AppState.aldrynHouse.name;
    if (housePowerEl) housePowerEl.textContent = AppState.aldrynHouse.power;

    // Mode Temporel
    const modeNameEl = document.getElementById('temporal-mode-name');
    const toggleBtn = document.getElementById('temporal-toggle-btn');
    const toggleIcon = document.getElementById('temporal-toggle-icon');
    const toggleText = document.getElementById('temporal-toggle-text');

    if (AppState.freeExploreMode) {
      if (modeNameEl) modeNameEl.textContent = 'Mode Test (Tous les 24 jours accessibles)';
      if (toggleBtn) toggleBtn.classList.remove('strict-mode');
      if (toggleIcon) toggleIcon.textContent = '🔓';
      if (toggleText) toggleText.textContent = 'Passer en Mode Décembre Réel';
    } else {
      const decDay = getCurrentDecemberDay();
      if (modeNameEl) modeNameEl.textContent = `Mode Décembre Réel (Jours 1 à ${decDay})`;
      if (toggleBtn) toggleBtn.classList.add('strict-mode');
      if (toggleIcon) toggleIcon.textContent = '🗓️';
      if (toggleText) toggleText.textContent = 'Revenir en Mode Test (Libre)';
    }
  }

  // ==========================================================================
  // 2. RENDU DES 4 MONDES / SEMAINES & DES 24 CARTES DE TAROT 3D
  // ==========================================================================
  function renderWorldsAndTarotCards() {
    const container = document.getElementById('worlds-tarot-container');
    if (!container) return;

    const allDays = getAllNormalizedDays();
    const todayHighlight = getCurrentDecemberDay();

    const weeksToRender =
      AppState.selectedWeek === 'all'
        ? WORLDS_CONFIG
        : WORLDS_CONFIG.filter((w) => String(w.week) === String(AppState.selectedWeek));

    let html = '';

    weeksToRender.forEach((world) => {
      const worldDays = allDays.filter((d) => {
        if (d.week !== world.week) return false;
        if (AppState.selectedFilter === 'boss') return d.isBoss || d.isFinale;
        if (AppState.selectedFilter === 'completed') return isDayCompleted(d.day);
        if (AppState.selectedFilter === 'todo') return !isDayCompleted(d.day);
        return true;
      });

      const totalWeekDays = allDays.filter((d) => d.week === world.week);
      const completedInWeek = totalWeekDays.filter((d) => isDayCompleted(d.day)).length;

      html += `
        <section class="world-section-block" data-world-week="${world.week}">
          <!-- Bannière Panoramique Illustrée de la Semaine -->
          <div class="world-hero-banner">
            <img
              src="${world.banner}"
              alt="${escapeHtml(world.title)}"
              class="world-banner-img"
              loading="lazy"
              onerror="this.style.opacity='0.15'"
            />
            <div class="world-banner-overlay">
              <div>
                <div class="world-banner-kicker">✦ ${escapeHtml(world.kicker)} ✦</div>
                <h2 class="world-banner-title">${escapeHtml(world.title)}</h2>
                <p class="world-banner-desc">${escapeHtml(world.description)}</p>
              </div>
              <div class="world-banner-progress">
                🗝️ ${completedInWeek} / ${totalWeekDays.length} Arcanes Accomplis
              </div>
            </div>
          </div>

          <!-- Grille des Cartes de Tarot 3D -->
          <div class="tarot-cards-grid">
            ${worldDays.map((dayObj) => renderSingleTarotCardHTML(dayObj, todayHighlight)).join('')}
          </div>
        </section>
      `;
    });

    container.innerHTML = html;

    // Attache les événements sur chaque Carte de Tarot
    container.querySelectorAll('.tarot-card').forEach((cardEl) => {
      cardEl.addEventListener('click', () => {
        const dayNum = Number(cardEl.getAttribute('data-day'));
        handleTarotCardClick(dayNum, cardEl);
      });
    });
  }

  function renderSingleTarotCardHTML(dayObj, todayHighlight) {
    const unlocked = isDayUnlocked(dayObj.day);
    const completed = isDayCompleted(dayObj.day);
    const isToday = dayObj.day === todayHighlight;

    let rarityLabel = 'Arcane Commun';
    let rarityBadgeClass = 'rarity-badge-commun';
    if (dayObj.rarityKey === 'legendaire') {
      rarityLabel = '☀️ GRAND FINAL LÉGENDAIRE';
      rarityBadgeClass = 'rarity-badge-legendaire';
    } else if (dayObj.rarityKey === 'epique') {
      rarityLabel = '⚔️ ÉPREUVE DE BOSS • GROS CADEAU';
      rarityBadgeClass = 'rarity-badge-epique';
    }

    let statusHTML = '';
    let ctaText = '';
    if (completed) {
      statusHTML = `<span class="tarot-status-indicator status-completed">✓ Sceau Brisé &amp; Rune Acquise</span>`;
      ctaText = 'Rejouer / Revoir mon cadeau';
    } else if (unlocked) {
      statusHTML = `<span class="tarot-status-indicator status-available">✦ Prêt à être ouvert</span>`;
      ctaText = dayObj.isBoss ? 'Affronter le Boss →' : 'Ouvrir l’Arcane →';
    } else {
      statusHTML = `<span class="tarot-status-indicator status-locked">🔒 Scellé (${dayObj.day} Déc.)</span>`;
      ctaText = 'Verrouillé';
    }

    // Les 23 Serrures Runiques sur la Carte Légendaire du Jour 24
    let locks23HTML = '';
    if (dayObj.isFinale) {
      const pips = [];
      for (let i = 1; i <= 23; i++) {
        const pipUnlocked = isDayCompleted(i);
        pips.push(
          `<span class="rune-lock-pip ${pipUnlocked ? 'unlocked' : ''}" title="Rune du Jour ${i}">${
            pipUnlocked ? '✓' : i
          }</span>`
        );
      }
      const unlocked23Count = AppState.completedDays.filter((d) => d >= 1 && d <= 23).length;
      locks23HTML = `
        <div class="sanctuary-23-locks">
          <div class="sanctuary-locks-title">
            🗝️ Les 23 Serrures Runiques du Sanctuaire (${unlocked23Count} / 23 Brisées)
          </div>
          <div class="sanctuary-locks-grid">
            ${pips.join('')}
          </div>
        </div>
      `;
    }

    const wrapperClasses = [
      'tarot-card-wrapper',
      dayObj.isFinale ? 'legendary-fullwidth' : ''
    ].filter(Boolean).join(' ');

    const cardClasses = [
      'tarot-card',
      `rarity-${dayObj.rarityKey}`,
      completed ? 'is-completed' : '',
      !unlocked ? 'is-locked' : '',
      isToday ? 'is-today' : ''
    ].filter(Boolean).join(' ');

    return `
      <div class="${wrapperClasses}">
        <article class="${cardClasses}" data-day="${dayObj.day}" role="button" tabindex="0" aria-label="Jour ${dayObj.day} : ${escapeHtml(dayObj.title)}">
          <div class="tarot-inner-frame">
            <span class="tarot-corner tl"></span>
            <span class="tarot-corner tr"></span>
            <span class="tarot-corner bl"></span>
            <span class="tarot-corner br"></span>

            <!-- En-tête Tarot : Chiffre Romain, Arabe & Badge de Rareté -->
            <div class="tarot-header">
              <div class="tarot-numeral-group">
                <span class="tarot-roman">${escapeHtml(dayObj.roman)}</span>
                <span class="tarot-arabic">Jour ${dayObj.day}</span>
              </div>
              <span class="tarot-rarity-badge ${rarityBadgeClass}">${rarityLabel}</span>
            </div>

            <!-- Centre de la Carte : Emblème, Nom d'Arcane, Titre & Livres -->
            <div class="tarot-arcana-center">
              <div class="tarot-arcana-emblem">${dayObj.emblem}</div>
              <div class="tarot-arcana-name">${escapeHtml(dayObj.arcanaName)}</div>
              <h3 class="tarot-chapter-title">${escapeHtml(dayObj.title)}</h3>
              <div class="tarot-books-pills">
                ${dayObj.books.map((b) => `<span class="tarot-book-pill">📖 ${escapeHtml(b)}</span>`).join('')}
              </div>
              ${locks23HTML}
            </div>

            <!-- Pied de la Carte : Statut & Action -->
            <div class="tarot-footer">
              ${statusHTML}
              <span class="tarot-cta-btn">${ctaText}</span>
            </div>
          </div>
        </article>
      </div>
    `;
  }

  function handleTarotCardClick(dayNum, cardEl) {
    if (!isDayUnlocked(dayNum)) {
      if (window.AudioFX) window.AudioFX.playError();
      showRoyalToast(
        '🔒',
        `Ce chapitre est scellé jusqu’au ${dayNum} Décembre ! (Astuce : active le "Mode Test" en haut à droite pour l'explorer librement)`
      );
      return;
    }

    if (window.AudioFX) window.AudioFX.playCardFlip();
    if (cardEl) {
      cardEl.classList.add('card-flipping');
      setTimeout(() => cardEl.classList.remove('card-flipping'), 460);
    }

    openChapterModal(dayNum);
  }

  // ==========================================================================
  // 3. LA SCÈNE NARRATIVE & LE DÉFI DU JOUR (MODALE PLEIN ÉCRAN IMMERSIVE)
  // ==========================================================================
  function openChapterModal(dayNum) {
    const dayObj = getDayByNumber(dayNum);
    AppState.activeDayNumber = dayObj.day;
    AppState.vnLineIndex = 0;
    AppState.vnShowAll = false;
    AppState.waxClicksCount = 0;
    AppState.waxBrokenInSession = isDayCompleted(dayObj.day);

    const backdrop = document.getElementById('chapter-modal-backdrop');
    const modalContainer = document.getElementById('chapter-modal-container');
    const bossBanner = document.getElementById('modal-boss-banner');
    const headerBg = document.getElementById('modal-header-bg');
    const eyebrowEl = document.getElementById('modal-chapter-eyebrow');
    const titleEl = document.getElementById('modal-chapter-title');
    const booksEl = document.getElementById('modal-chapter-books');
    const rarityPill = document.getElementById('modal-rarity-pill');

    // Décor illustré de la semaine
    const worldCfg = WORLDS_CONFIG.find((w) => w.week === dayObj.week) || WORLDS_CONFIG[0];
    if (headerBg) {
      headerBg.style.backgroundImage = `url('${worldCfg.banner}')`;
    }

    if (eyebrowEl) {
      eyebrowEl.textContent = `JOUR ${dayObj.day} (${dayObj.roman}) • ARCANE : ${dayObj.arcanaName.toUpperCase()}`;
    }
    if (titleEl) {
      titleEl.textContent = dayObj.title;
    }
    if (booksEl) {
      booksEl.innerHTML = dayObj.books
        .map((b) => `<span class="tarot-book-pill">📖 ${escapeHtml(b)}</span>`)
        .join('');
    }

    // Style & Alerte Boss
    if (dayObj.isBoss || dayObj.isFinale) {
      modalContainer.classList.add('is-boss-modal');
      if (bossBanner) {
        bossBanner.style.display = 'block';
        bossBanner.textContent = dayObj.isFinale
          ? '☀️ APOTHÉOSE LÉGENDAIRE DU 24 DÉCEMBRE — LE SANCTUAIRE DU VILAIN ☀️'
          : '⚔️ ALERTE BOSS — COFFRE ÉPIQUE & GROS CADEAU IRL EN JEU ⚔️';
      }
      if (rarityPill) {
        rarityPill.className = `tarot-rarity-badge ${
          dayObj.isFinale ? 'rarity-badge-legendaire' : 'rarity-badge-epique'
        }`;
        rarityPill.textContent = dayObj.isFinale ? '☀️ GRAND FINAL LÉGENDAIRE' : '⚔️ ÉPREUVE DE BOSS';
      }
    } else {
      modalContainer.classList.remove('is-boss-modal');
      if (bossBanner) bossBanner.style.display = 'none';
      if (rarityPill) {
        rarityPill.className = 'tarot-rarity-badge rarity-badge-commun';
        rarityPill.textContent = '✦ ARCANE COMMUN';
      }
    }

    backdrop.classList.add('open');

    // Tremblement dramatique si Jour de Boss
    if (dayObj.isBoss || dayObj.isFinale) {
      modalContainer.classList.remove('boss-shake');
      void modalContainer.offsetWidth;
      modalContainer.classList.add('boss-shake');
      if (window.AudioFX) window.AudioFX.playBossHit();
    }

    // Démarre sur l'étape Scène Narrative
    switchModalStage('story');
    renderVisualNovelScene(dayObj);
  }

  function closeChapterModal() {
    const backdrop = document.getElementById('chapter-modal-backdrop');
    if (backdrop) backdrop.classList.remove('open');
    AppState.activeDayNumber = null;
  }

  function switchModalStage(stageName) {
    AppState.activeStage = stageName;
    const dayObj = getDayByNumber(AppState.activeDayNumber || 1);

    document.querySelectorAll('.modal-stage-tab').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-stage') === stageName);
    });

    const storyEl = document.getElementById('modal-stage-story');
    const gameEl = document.getElementById('modal-stage-game');
    const lootEl = document.getElementById('modal-stage-loot');

    if (storyEl) storyEl.style.display = stageName === 'story' ? 'flex' : 'none';
    if (gameEl) gameEl.style.display = stageName === 'game' ? 'block' : 'none';
    if (lootEl) lootEl.style.display = stageName === 'loot' ? 'block' : 'none';

    if (stageName === 'game') {
      mountDayMiniGame(dayObj);
    } else if (stageName === 'loot') {
      renderLootCeremonyStage(dayObj);
    }
  }

  // ==========================================================================
  // SCÈNE VISUAL NOVEL INTERACTIF
  // ==========================================================================
  function renderVisualNovelScene(dayObj) {
    const lines = dayObj.dialogues || [];
    const idx = Math.max(0, Math.min(AppState.vnLineIndex, lines.length - 1));
    const currentLine = lines[idx] || {
      speaker: '👑 Le Vilain',
      role: 'villain',
      text: 'Bienvenue dans ce nouveau chapitre du Grimoire.'
    };

    // Illumination du portrait actif
    const slotLaura = document.getElementById('vn-slot-laura');
    const slotKingsley = document.getElementById('vn-slot-kingsley');
    const slotVillain = document.getElementById('vn-slot-villain');

    if (slotLaura) slotLaura.classList.toggle('speaking', currentLine.role === 'laura');
    if (slotKingsley) slotKingsley.classList.toggle('speaking', currentLine.role === 'kingsley');
    if (slotVillain) slotVillain.classList.toggle('speaking', currentLine.role === 'villain');

    const speakerBadge = document.getElementById('vn-speaker-badge');
    const lineCounter = document.getElementById('vn-line-counter');
    const dialogueText = document.getElementById('vn-dialogue-text');
    const transcriptAll = document.getElementById('vn-transcript-all');
    const prevBtn = document.getElementById('vn-prev-btn');
    const nextBtn = document.getElementById('vn-next-btn');

    if (speakerBadge) speakerBadge.textContent = currentLine.speaker;
    if (lineCounter) lineCounter.textContent = `Réplique ${idx + 1} / ${lines.length}`;
    if (dialogueText) dialogueText.textContent = `« ${currentLine.text} »`;

    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) {
      nextBtn.textContent = idx < lines.length - 1 ? 'Suivant →' : 'Passer à l’Épreuve ⚔️';
    }

    if (transcriptAll) {
      if (AppState.vnShowAll) {
        transcriptAll.style.display = 'flex';
        transcriptAll.innerHTML = lines
          .map(
            (l) => `
              <div class="vn-transcript-line">
                <strong style="color:var(--gold-brass); font-family:var(--font-title);">${escapeHtml(l.speaker)} :</strong>
                <span> « ${escapeHtml(l.text)} »</span>
              </div>
            `
          )
          .join('');
      } else {
        transcriptAll.style.display = 'none';
      }
    }
  }

  // ==========================================================================
  // INTÉGRATION DU MINI-JEU (WINDOW.MINIGAMESENGINE.RENDERGAME)
  // ==========================================================================
  function mountDayMiniGame(dayObj) {
    const mountRoot = document.getElementById('minigame-mount-root');
    if (!mountRoot) return;
    mountRoot.innerHTML = '';

    const onVictoryCallback = (extraData) => {
      handleDayChallengeVictory(dayObj, extraData);
    };

    if (window.MiniGamesEngine && typeof window.MiniGamesEngine.renderGame === 'function') {
      try {
        window.MiniGamesEngine.renderGame(mountRoot, dayObj.rawOriginal || dayObj, {
          onVictory: onVictoryCallback,
          onWin: onVictoryCallback,
          onComplete: onVictoryCallback,
          hasLunarPower: isDayCompleted(4) || AppState.freeExploreMode,
          isLunarHintUsed: false,
          onUseLunarHint: () => {
            showRoyalToast('🌙', `Sort de Lune d'Aldryn (${AppState.aldrynHouse.name}) invoqué !`);
          }
        });
        return;
      } catch (err) {
        console.warn('Fallback MiniGame suite à erreur MiniGamesEngine:', err);
      }
    }

    renderBuiltInFallbackGame(dayObj, mountRoot, onVictoryCallback);
  }

  function renderBuiltInFallbackGame(dayObj, mountRoot, onVictoryCallback) {
    mountRoot.innerHTML = `
      <div style="text-align:center; padding: 1.25rem;">
        <div class="grimoire-eyebrow">✦ ÉPREUVE ARCANIQUE DU JOUR ${dayObj.day} ✦</div>
        <h3 class="world-banner-title" style="margin-bottom:0.65rem;">${escapeHtml(dayObj.title)}</h3>
        <p class="world-banner-desc" style="margin: 0 auto 1.5rem;">
          Inscris ta maîtrise des romans de ce chapitre (${escapeHtml(dayObj.books.join(', '))}) pour briser la barrière magique et faire apparaître le Coffre scellé à la cire rouge !
        </p>
        <button id="fallback-win-game-btn" class="btn-royal btn-royal-gold" type="button" style="font-size:1rem; padding:0.85rem 1.75rem;">
          ⚔️ Invoquer la Rune &amp; Faire apparaître le Coffre Scellé
        </button>
      </div>
    `;
    const btn = mountRoot.querySelector('#fallback-win-game-btn');
    if (btn) {
      btn.addEventListener('click', () => onVictoryCallback());
    }
  }

  function handleDayChallengeVictory(dayObj, bonusPayload) {
    // Si Jour 4 Curious Tides a renvoyé une Maison d'Aldryn personnalisée
    if (bonusPayload) {
      if (typeof bonusPayload.aldrynHouse === 'string') {
        AppState.aldrynHouse = {
          name: `Maison de la ${bonusPayload.aldrynHouse}`,
          icon: '🌙',
          power: `Totem : ${bonusPayload.aldrynTotem || 'Cerf Astral'} • Sort de Lune Actif`
        };
      } else if (bonusPayload.aldrynHouse && bonusPayload.aldrynHouse.name) {
        AppState.aldrynHouse = bonusPayload.aldrynHouse;
      }
    }

    if (!isDayCompleted(dayObj.day)) {
      AppState.completedDays.push(dayObj.day);
      AppState.completedDays.sort((a, b) => a - b);
      savePersistedState();
      renderHUD();
      renderWorldsAndTarotCards();
    }

    if (window.AudioFX) window.AudioFX.playRuneChime();
    AppState.waxClicksCount = 0;
    AppState.waxBrokenInSession = false;
    switchModalStage('loot');
  }

  // ==========================================================================
  // 4. LE SCEAU DE CIRE ROUGE (3 CLICS) & LE COFFRE DE LOOT IRL
  // ==========================================================================
  function renderLootCeremonyStage(dayObj) {
    const root = document.getElementById('loot-ceremony-root');
    if (!root) return;

    const alreadyCompleted = isDayCompleted(dayObj.day);

    // Si le sceau n'a pas encore été brisé dans cette session, on affiche le Coffre SVG fermé par le Sceau de Cire Rouge
    if (!AppState.waxBrokenInSession) {
      root.innerHTML = `
        <div class="chest-seal-arena" id="chest-seal-arena">
          <div class="grimoire-eyebrow">✦ COFFRE ARCANIQUE SCELLÉ • JOUR ${dayObj.day} ✦</div>
          <h3 class="world-banner-title" style="font-size:1.45rem; margin-bottom:0.35rem;">
            ${
              dayObj.isFinale
                ? 'Le Coffre Solaire Légendaire du Sanctuaire'
                : dayObj.isBoss
                ? 'Le Coffre Cramoisi & Rubis de Boss'
                : 'Le Coffre de Bois & Laiton du Manoir'
            }
          </h3>
          <p class="world-banner-desc" style="font-size:1.05rem; margin-bottom:1.1rem;">
            Clique <strong>3 fois sur le Sceau de Cire Rouge</strong> frappé du blason de Kingsley et du Vilain pour fissurer la cire et révéler où se cache ta surprise dans le monde réel !
          </p>

          <!-- Coffre Illustré en SVG selon la Rareté -->
          <div class="chest-svg-container">
            ${getChestIllustrationSVG(dayObj.rarityKey)}
          </div>

          <!-- Sceau de Cire Rouge Interactif -->
          <button id="wax-seal-trigger-btn" class="wax-seal-button" type="button" aria-label="Frapper le sceau de cire rouge">
            <!-- Fissures dorées SVG apparaissant aux clics 1 et 2 -->
            <svg class="wax-crack-svg wax-crack-1" viewBox="0 0 140 140" fill="none">
              <path d="M70 8 L62 42 L75 68 L54 98 L65 130" stroke="#fff1b8" stroke-width="3" stroke-linecap="round"/>
              <path d="M62 42 L35 55" stroke="#e6c665" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg class="wax-crack-svg wax-crack-2" viewBox="0 0 140 140" fill="none">
              <path d="M18 45 L58 64 L85 52 L124 78" stroke="#fff1b8" stroke-width="3.2" stroke-linecap="round"/>
              <path d="M75 68 L108 108" stroke="#e6c665" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
            <span class="wax-seal-emblem">🐸👑</span>
            <span class="wax-seal-motto" id="wax-seal-motto-text">FRAPPER (0/3)</span>
          </button>

          <div class="wax-seal-progress-pips">
            <span class="wax-pip" id="wax-pip-1"></span>
            <span class="wax-pip" id="wax-pip-2"></span>
            <span class="wax-pip" id="wax-pip-3"></span>
          </div>

          ${
            alreadyCompleted
              ? `<button id="skip-wax-btn" class="btn-royal" type="button" style="margin-top:0.5rem;">
                   ✨ Ouvrir immédiatement (Sceau déjà brisé)
                 </button>`
              : ''
          }
        </div>
      `;

      const sealBtn = root.querySelector('#wax-seal-trigger-btn');
      const arenaEl = root.querySelector('#chest-seal-arena');
      const skipBtn = root.querySelector('#skip-wax-btn');

      if (skipBtn) {
        skipBtn.addEventListener('click', () => {
          AppState.waxBrokenInSession = true;
          revealLootCardIRL(dayObj);
        });
      }

      if (sealBtn) {
        sealBtn.addEventListener('click', (evt) => {
          AppState.waxClicksCount += 1;
          const count = AppState.waxClicksCount;

          // Son de craquement de cire & vibration visuelle
          if (window.AudioFX) window.AudioFX.playWaxCrack();
          if (arenaEl) {
            arenaEl.classList.remove('boss-shake');
            void arenaEl.offsetWidth;
            arenaEl.classList.add('boss-shake');
          }

          const mottoEl = root.querySelector('#wax-seal-motto-text');
          const pipEl = root.querySelector(`#wax-pip-${count}`);
          if (pipEl) pipEl.classList.add('broken');

          if (count === 1) {
            sealBtn.classList.add('cracked-1');
            if (mottoEl) mottoEl.textContent = 'FISSURÉ (1/3)';
          } else if (count === 2) {
            sealBtn.classList.add('cracked-2');
            if (mottoEl) mottoEl.textContent = 'PRÊT À ROMPRE (2/3)';
          } else if (count >= 3) {
            // 3e clic : Explosion de particules d'or + ouverture du coffre !
            const rect = sealBtn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const burstRarity =
              dayObj.rarityKey === 'legendaire'
                ? 'legendary'
                : dayObj.rarityKey === 'epique'
                ? 'epic'
                : 'common';

            if (window.ParticleFX) {
              window.ParticleFX.burst(centerX, centerY, burstRarity);
            }
            if (window.AudioFX) {
              window.AudioFX.playChestOpen(burstRarity);
            }

            if (!isDayCompleted(dayObj.day)) {
              AppState.completedDays.push(dayObj.day);
              AppState.completedDays.sort((a, b) => a - b);
              savePersistedState();
              renderHUD();
              renderWorldsAndTarotCards();
            }

            AppState.waxBrokenInSession = true;
            revealLootCardIRL(dayObj);
          }
        });
      }
    } else {
      revealLootCardIRL(dayObj);
    }
  }

  function revealLootCardIRL(dayObj) {
    const root = document.getElementById('loot-ceremony-root');
    if (!root) return;

    const totalRunes = AppState.completedDays.length;
    const isClaimed = AppState.claimedLoots.includes(dayObj.day);

    let rarityBadgeHTML = `<span class="tarot-rarity-badge rarity-badge-commun">TRÉSOR COMMUN • ${escapeHtml(dayObj.loot.category)}</span>`;
    if (dayObj.rarityKey === 'legendaire') {
      rarityBadgeHTML = `<span class="tarot-rarity-badge rarity-badge-legendaire">☀️ TRÉSOR LÉGENDAIRE DU 24 DÉCEMBRE</span>`;
    } else if (dayObj.rarityKey === 'epique') {
      rarityBadgeHTML = `<span class="tarot-rarity-badge rarity-badge-epique">⚔️ BUTIN DE BOSS ÉPIQUE • ${escapeHtml(dayObj.loot.category)}</span>`;
    }

    // Section Spéciale Jour 24 : Illustration du Couple & Grande Lettre d'Amour du Vilain
    let finaleShowcaseHTML = '';
    if (dayObj.isFinale) {
      finaleShowcaseHTML = `
        <div class="finale-couple-showcase">
          <div class="grimoire-eyebrow">✦ PORTRAIT ROYAL DU VILAIN &amp; DE SON ASSISTANTE ✦</div>
          <div class="finale-couple-img-frame">
            <img src="assets/couple_finale.png" alt="Laura & Son Vilain — Grand Final" onerror="this.style.display='none'" />
          </div>
          <div class="grimoire-eyebrow" style="margin-bottom:0.75rem;">💌 LA GRANDE LETTRE D'AMOUR DU VILAIN 💌</div>
          <div class="love-letter-parchment">${escapeHtml(AppState.finaleLoveLetter)}</div>
        </div>
      `;
    }

    root.innerHTML = `
      <div class="loot-card-revealed">
        <div class="loot-rune-gain-pill">
          🗝️ +1 Éclat de Clé du Sanctuaire récolté (${totalRunes} / 24)
        </div>
        <div>${rarityBadgeHTML}</div>
        <h3 class="loot-title-display">${escapeHtml(dayObj.loot.title)}</h3>
        <p class="loot-rp-description">« ${escapeHtml(dayObj.loot.description)} »</p>

        <!-- ENCADRÉ IRL : OÙ RÉCUPÉRER TA SURPRISE DANS LE MONDE RÉEL -->
        <div class="irl-treasure-callout">
          <div class="irl-callout-header">
            <span>🧭</span>
            <span>Où récupérer ta surprise dans le monde réel (Cachette IRL / Bon)</span>
          </div>
          <div class="irl-location-instruction">
            ${escapeHtml(dayObj.loot.irlLocation)}
          </div>
        </div>

        ${finaleShowcaseHTML}

        <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:0.85rem; margin-top:1.5rem;">
          <button id="modal-claim-loot-btn" class="btn-royal ${isClaimed ? '' : 'btn-royal-gold'}" type="button">
            ${isClaimed ? '✓ Surprise déjà marquée comme récupérée' : '🎁 Marquer cette surprise comme réclamée'}
          </button>
          <button id="modal-replay-wax-btn" class="btn-royal" type="button">
            🕯️ Rejouer le bris du Sceau de Cire
          </button>
          <button id="modal-back-to-map-btn" class="btn-royal" type="button">
            🗺️ Retourner à la Carte des 4 Mondes
          </button>
        </div>
      </div>
    `;

    const claimBtn = root.querySelector('#modal-claim-loot-btn');
    const replayWaxBtn = root.querySelector('#modal-replay-wax-btn');
    const backMapBtn = root.querySelector('#modal-back-to-map-btn');

    if (claimBtn) {
      claimBtn.addEventListener('click', () => {
        toggleLootClaimed(dayObj.day);
        revealLootCardIRL(dayObj);
      });
    }
    if (replayWaxBtn) {
      replayWaxBtn.addEventListener('click', () => {
        AppState.waxClicksCount = 0;
        AppState.waxBrokenInSession = false;
        renderLootCeremonyStage(dayObj);
      });
    }
    if (backMapBtn) {
      backMapBtn.addEventListener('click', () => {
        closeChapterModal();
      });
    }
  }

  function getChestIllustrationSVG(rarityKey) {
    if (rarityKey === 'legendaire') {
      // Coffre Astral Solaire
      return `
        <svg viewBox="0 0 240 180" width="220" height="165" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="legGold" x1="0" y1="0" x2="240" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#fff1b8"/>
              <stop offset="50%" stop-color="#d4af37"/>
              <stop offset="100%" stop-color="#8c6518"/>
            </linearGradient>
          </defs>
          <rect x="24" y="62" width="192" height="96" rx="12" fill="#1d1836" stroke="url(#legGold)" stroke-width="5"/>
          <path d="M20 66 C20 28, 220 28, 220 66 Z" fill="#2e2040" stroke="url(#legGold)" stroke-width="5"/>
          <rect x="24" y="96" width="192" height="14" fill="url(#legGold)" opacity="0.85"/>
          <circle cx="120" cy="65" r="24" fill="#fff1b8" stroke="#8b1e24" stroke-width="4"/>
          <circle cx="62" cy="115" r="7" fill="#e63946"/>
          <circle cx="178" cy="115" r="7" fill="#e63946"/>
        </svg>
      `;
    }
    if (rarityKey === 'epique') {
      // Coffre Cramoisi & Rubis (Boss)
      return `
        <svg viewBox="0 0 240 180" width="215" height="160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="28" y="64" width="184" height="92" rx="10" fill="#4f0e12" stroke="#d4af37" stroke-width="4.5"/>
          <path d="M24 66 C24 32, 216 32, 216 66 Z" fill="#78171d" stroke="#d4af37" stroke-width="4.5"/>
          <rect x="64" y="42" width="14" height="114" fill="#d4af37"/>
          <rect x="162" y="42" width="14" height="114" fill="#d4af37"/>
          <polygon points="120,44 134,64 120,84 106,64" fill="#ff4d58" stroke="#fff1b8" stroke-width="2.5"/>
        </svg>
      `;
    }
    // Coffre de Bois & Laiton (Commun)
    return `
      <svg viewBox="0 0 240 180" width="210" height="155" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="66" width="180" height="88" rx="9" fill="#3b2618" stroke="#d4af37" stroke-width="4"/>
        <path d="M28 68 C28 36, 212 36, 212 68 Z" fill="#4f3321" stroke="#d4af37" stroke-width="4"/>
        <rect x="68" y="46" width="12" height="108" fill="#c79f42"/>
        <rect x="160" y="46" width="12" height="108" fill="#c79f42"/>
        <rect x="30" y="96" width="180" height="10" fill="#c79f42" opacity="0.8"/>
      </svg>
    `;
  }

  function toggleLootClaimed(dayNum) {
    const num = Number(dayNum);
    const idx = AppState.claimedLoots.indexOf(num);
    if (idx === -1) {
      AppState.claimedLoots.push(num);
      if (window.AudioFX) window.AudioFX.playRuneChime();
      showRoyalToast('🎁', `Surprise du Jour ${num} marquée comme récupérée !`);
    } else {
      AppState.claimedLoots.splice(idx, 1);
      showRoyalToast('↩️', `Surprise du Jour ${num} remise en attente.`);
    }
    savePersistedState();
    renderLootInventoryView();
  }

  // ==========================================================================
  // 5. VUE 2 : LE GRIMOIRE DE BUTIN & BONS DIGITAUX (INVENTAIRE IRL)
  // ==========================================================================
  function renderLootInventoryView() {
    const container = document.getElementById('loot-inventory-container');
    if (!container) return;

    const allDays = getAllNormalizedDays();
    const visibleDays = AppState.showAllLootPreview
      ? allDays
      : allDays.filter((d) => isDayCompleted(d.day));

    if (visibleDays.length === 0) {
      container.innerHTML = `
        <div class="gm-day-card" style="grid-column: 1 / -1; text-align:center; padding: 2.5rem;">
          <div style="font-size:2.5rem; margin-bottom:0.5rem;">🕯️</div>
          <h3 class="world-banner-title" style="font-size:1.35rem;">Aucun Sceau de Cire brisé pour l’instant</h3>
          <p class="world-banner-desc" style="margin:0.5rem auto 1.25rem;">
            Ouvre une Carte de Tarot sur la Carte des 4 Mondes (ou clique sur « Afficher tous les trésors » ci-dessus en Mode Test) pour découvrir tes cadeaux IRL et tes bons digitaux !
          </p>
          <button id="empty-loot-preview-btn" class="btn-royal btn-royal-gold" type="button">
            👁️ Prévisualiser les 24 Trésors IRL maintenant
          </button>
        </div>
      `;
      const btn = container.querySelector('#empty-loot-preview-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          AppState.showAllLootPreview = true;
          renderLootInventoryView();
        });
      }
      return;
    }

    container.innerHTML = visibleDays
      .map((dayObj) => {
        const claimed = AppState.claimedLoots.includes(dayObj.day);
        const unlocked = isDayCompleted(dayObj.day);
        return `
          <article class="loot-item-card ${claimed ? 'claimed' : ''}">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
                <span class="tarot-arabic">Jour ${dayObj.day} (${escapeHtml(dayObj.roman)})</span>
                <span class="tarot-rarity-badge ${
                  dayObj.rarityKey === 'legendaire'
                    ? 'rarity-badge-legendaire'
                    : dayObj.rarityKey === 'epique'
                    ? 'rarity-badge-epique'
                    : 'rarity-badge-commun'
                }">${escapeHtml(dayObj.loot.category)}</span>
              </div>
              <h3 class="tarot-chapter-title" style="color:var(--gold-bright);">${escapeHtml(dayObj.loot.title)}</h3>
              <p style="font-family:var(--font-literary); font-style:italic; color:var(--ivory-muted); font-size:1.05rem; margin-bottom:0.85rem;">
                « ${escapeHtml(dayObj.loot.description)} »
              </p>
              <div class="irl-treasure-callout" style="padding:0.9rem 1.1rem; margin:0.5rem 0;">
                <div class="irl-callout-header" style="font-size:0.72rem; margin-bottom:0.25rem;">
                  🧭 Cachette IRL / Instruction
                </div>
                <div style="font-size:0.96rem; font-weight:700; color:var(--ivory-parchment);">
                  ${escapeHtml(dayObj.loot.irlLocation)}
                </div>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem; pt:0.5rem;">
              <span style="font-size:0.78rem; color:${unlocked ? 'var(--emerald-bright)' : 'var(--gold-brass)'};">
                ${unlocked ? '✓ Débloqué en jeu' : '👁️ Mode Aperçu'}
              </span>
              <button class="btn-royal ${claimed ? '' : 'btn-royal-gold'} loot-claim-toggle" data-day="${dayObj.day}" type="button" style="padding:0.45rem 0.85rem; font-size:0.76rem;">
                ${claimed ? '✓ Réclamé au Vilain' : '🎁 Marquer comme réclamé'}
              </button>
            </div>
          </article>
        `;
      })
      .join('');

    container.querySelectorAll('.loot-claim-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const d = Number(btn.getAttribute('data-day'));
        toggleLootClaimed(d);
      });
    });
  }

  // ==========================================================================
  // 6. VUE 3 : LA BIBLIOTHÈQUE DE LAU (CODEX LITTÉRAIRE & EASTER EGGS)
  // ==========================================================================
  const CODEX_ENTRIES = [
    {
      title: 'Assistant to the Villain',
      author: 'Hannah Nicole Maehrer',
      category: 'fav',
      verdict: '🐸 PILIER DU GRIMOIRE • COUP DE CŒUR',
      quote: 'Le Bureau du Vilain, les panneaux en carton de Sire Kingsley et la tension slow-burn entre Evie Sage et Trystan : l’inspiration royale de ce calendrier !',
      days: 'Jours 1, 2, 6, 21'
    },
    {
      title: 'Curious Tides',
      author: 'Pascale Lacelle',
      category: 'fav',
      verdict: '🌙 DARK ACADEMIA & MARÉES LUNAIRES',
      quote: 'L’Académie d’Aldryn, les Maisons Lunaires et les secrets engloutis. C’est ici que Laura débloque son Blason de Maison au Jour 4 !',
      days: 'Jours 4, 21'
    },
    {
      title: 'One Dark Window & Two Twisted Crowns',
      author: 'Rachel Gillig',
      category: 'fav',
      verdict: '🃏 CARTES DE LA PROVIDENCE • PÉPITE',
      quote: 'La brume gothique, le Cauchemar et les Cartes de Tarot magiques qui ont inspiré les 24 Cartes de ce Grimoire.',
      days: 'Jours 5, 6, 18'
    },
    {
      title: 'Divine Rivals & Ruthless Vows',
      author: 'Rebecca Ross',
      category: 'fav',
      verdict: '⌨️ LETTRES MAGIQUES & ÉMOTION PURE',
      quote: 'Iris et Roman qui s’écrivent à travers leurs machines à écrire enchantées… impossible de ne pas fondre.',
      days: 'Jours 11, 13, 18'
    },
    {
      title: 'La Cité de Laiton (Trilogie Daevabad)',
      author: 'S.A. Chakraborty',
      category: 'fav',
      verdict: '🕌 ÉPOPÉE FLAMBOYANTE',
      quote: 'Nahri, Dara et les intrigues brûlantes de Daevabad au cœur du Désert de Laiton (Semaine II).',
      days: 'Jours 7, 12'
    },
    {
      title: 'Red Rising',
      author: 'Pierce Brown',
      category: 'fav',
      verdict: '🔥 OMNIS VIR LUPUS • MASTERCLASS',
      quote: 'L’intensité dramatique, la stratégie et la rage de Darrow qui enflamment les épreuves de la Semaine III.',
      days: 'Jours 2, 16'
    },
    {
      title: 'Powerless & Les Livres du Tribunal Critique',
      author: 'Avis Tranchés de @lau.libraryyy',
      category: 'roast',
      verdict: '🚫 « C’EST NON ! » • LE VERDICT IMPITOYABLE',
      quote: 'Parce que @lau.libraryyy ne mâche jamais ses mots devant les tropes recyclés ou les protagonistes agaçants : quand c’est NON, c’est NON !',
      days: 'Jour 3'
    },
    {
      title: 'Mons, L’Irlande & Les Éditions De Saxus',
      author: 'Easter Eggs de Couple & Bookstagram',
      category: 'couple',
      verdict: '💑 SANCTUAIRE DU COUPLE & JASPAGES DORÉS',
      quote: 'Vos escapades à Mons, le rêve des brumes d’Irlande, la chasse aux éditions reliées De Saxus et la complicité entre Laura et son Vilain.',
      days: 'Jours 8, 10, 14, 24'
    }
  ];

  function getCodexCatalogEntries() {
    if (Array.isArray(window.MULTIVERSE_LIBRARY_CATALOG) && window.MULTIVERSE_LIBRARY_CATALOG.length > 0) {
      return window.MULTIVERSE_LIBRARY_CATALOG.map((b) => {
        const tierLower = String(b.tier || '').toLowerCase();
        const noteLower = String(b.note || '').toLowerCase();
        let category = 'fav';
        if (
          tierLower.includes('surcoté') ||
          tierLower.includes('dnf') ||
          tierLower.includes('débat') ||
          tierLower.includes('vinted') ||
          tierLower.includes('standalone')
        ) {
          category = 'roast';
        } else if (
          tierLower.includes('mons') ||
          tierLower.includes('irlande') ||
          tierLower.includes('duo') ||
          noteLower.includes('mons') ||
          noteLower.includes('irlande') ||
          noteLower.includes('amoureux')
        ) {
          category = 'couple';
        }
        return {
          title: b.title,
          author: b.author || '@lau.libraryyy',
          category,
          verdict: `✦ ${b.tier || 'Grimoire de Lau'}`,
          quote: b.note || '',
          days: Array.isArray(b.featuredDays) ? `Jours ${b.featuredDays.join(', ')}` : ''
        };
      });
    }
    return CODEX_ENTRIES;
  }

  function renderCodexView() {
    const container = document.getElementById('codex-books-container');
    if (!container) return;

    const allEntries = getCodexCatalogEntries();
    const filtered = allEntries.filter((entry) => {
      if (AppState.selectedCodexFilter === 'all') return true;
      return entry.category === AppState.selectedCodexFilter;
    });

    container.innerHTML = filtered
      .map(
        (item) => `
        <article class="codex-book-card">
          <span class="codex-verdict-tag">${escapeHtml(item.verdict)}</span>
          <h3 class="tarot-chapter-title" style="font-size:1.2rem; margin-top:0.25rem;">${escapeHtml(item.title)}</h3>
          <div style="font-family:var(--font-title); font-size:0.78rem; color:var(--gold-brass);">
            ${escapeHtml(item.author)} ${item.days ? `• ${escapeHtml(item.days)}` : ''}
          </div>
          <p style="font-family:var(--font-literary); font-size:1.15rem; color:var(--ivory-parchment); line-height:1.55;">
            « ${escapeHtml(item.quote)} »
          </p>
        </article>
      `
      )
      .join('');
  }

  // ==========================================================================
  // 7. VUE 4 : L'ATELIER DU VILAIN (MODE MAÎTRE DU JEU / COPAIN)
  // ==========================================================================
  function renderGameMasterView() {
    const grid = document.getElementById('gm-days-editor-grid');
    if (!grid) return;

    const pwdInput = document.getElementById('gm-couple-password');
    const letterInput = document.getElementById('gm-finale-love-letter');
    const houseSelect = document.getElementById('gm-aldryn-house-select');

    if (pwdInput) pwdInput.value = AppState.couplePassword || 'KINGSLEY';
    if (letterInput) letterInput.value = AppState.finaleLoveLetter || DEFAULT_LOVE_LETTER;
    if (houseSelect) {
      const composite = `${AppState.aldrynHouse.name}|${AppState.aldrynHouse.icon}|${AppState.aldrynHouse.power}`;
      Array.from(houseSelect.options).forEach((opt) => {
        if (opt.value.startsWith(AppState.aldrynHouse.name)) {
          houseSelect.value = opt.value;
        }
      });
    }

    const allDays = getAllNormalizedDays();
    grid.innerHTML = allDays
      .map((dayObj) => {
        const categories = ['Cadeau caché chez nous', 'Bon digital', 'Gros Cadeau Boss'];
        return `
          <div class="gm-day-card ${dayObj.isBoss ? 'boss-day' : ''}" data-gm-day="${dayObj.day}">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="tarot-roman" style="font-size:1rem;">
                Jour ${dayObj.day} (${escapeHtml(dayObj.roman)}) — ${escapeHtml(dayObj.title)}
              </span>
              ${
                dayObj.isBoss
                  ? `<span class="tarot-rarity-badge rarity-badge-epique">⚔️ BOSS</span>`
                  : `<span class="tarot-arabic">${dayObj.emblem}</span>`
              }
            </div>

            <div class="gm-field-group">
              <label class="gm-field-label">Nom du Cadeau / Butin</label>
              <input type="text" class="gm-input gm-field-title" data-day="${dayObj.day}" value="${escapeHtml(dayObj.loot.title)}" />
            </div>

            <div class="gm-field-group">
              <label class="gm-field-label">Catégorie de Surprise</label>
              <select class="gm-select gm-field-category" data-day="${dayObj.day}">
                ${categories
                  .map(
                    (cat) =>
                      `<option value="${escapeHtml(cat)}" ${
                        dayObj.loot.category === cat ? 'selected' : ''
                      }>${escapeHtml(cat)}</option>`
                  )
                  .join('')}
              </select>
            </div>

            <div class="gm-field-group">
              <label class="gm-field-label">Indice IRL / Cachette dans la maison (ou texte du Bon)</label>
              <textarea class="gm-textarea gm-field-irl" data-day="${dayObj.day}">${escapeHtml(dayObj.loot.irlLocation)}</textarea>
            </div>
          </div>
        `;
      })
      .join('');

    // Sauvegarde automatique dès qu'on modifie un champ dans l'Atelier du Vilain
    grid.querySelectorAll('.gm-field-title, .gm-field-category, .gm-field-irl').forEach((inputEl) => {
      inputEl.addEventListener('change', () => {
        collectAndSaveAllGMFields(false);
      });
    });
  }

  function collectAndSaveAllGMFields(showNotification = true) {
    const pwdInput = document.getElementById('gm-couple-password');
    const letterInput = document.getElementById('gm-finale-love-letter');
    const houseSelect = document.getElementById('gm-aldryn-house-select');

    if (pwdInput) AppState.couplePassword = pwdInput.value.trim() || 'KINGSLEY';
    if (letterInput) AppState.finaleLoveLetter = letterInput.value;
    if (houseSelect && houseSelect.value) {
      const parts = houseSelect.value.split('|');
      if (parts.length >= 3) {
        AppState.aldrynHouse = {
          name: parts[0],
          icon: parts[1],
          power: parts[2]
        };
      }
    }

    document.querySelectorAll('[data-gm-day]').forEach((cardEl) => {
      const d = Number(cardEl.getAttribute('data-gm-day'));
      const titleVal = cardEl.querySelector('.gm-field-title')?.value || '';
      const catVal = cardEl.querySelector('.gm-field-category')?.value || '';
      const irlVal = cardEl.querySelector('.gm-field-irl')?.value || '';

      gmOverrides[d] = {
        lootTitle: titleVal,
        lootCategory: catVal,
        irlLocation: irlVal
      };
    });

    saveGMOverrides();
    savePersistedState();
    renderHUD();
    renderWorldsAndTarotCards();
    renderLootInventoryView();

    if (showNotification) {
      if (window.AudioFX) window.AudioFX.playRuneChime();
      showRoyalToast('💾', 'Les 24 cachettes IRL et la Lettre du 24 Décembre ont été sauvegardées !');
    }
  }

  function exportGMConfigurationJSON() {
    collectAndSaveAllGMFields(false);
    const payload = {
      exportedAt: new Date().toISOString(),
      app: 'L’Assistante du Vilain & Le Multivers de @lau.libraryyy',
      couplePassword: AppState.couplePassword,
      finaleLoveLetter: AppState.finaleLoveLetter,
      aldrynHouse: AppState.aldrynHouse,
      gmOverrides
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config-atelier-du-vilain-lau-libraryyy.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showRoyalToast('📤', 'Fichier JSON de configuration téléchargé !');
  }

  function importGMConfigurationJSON(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.gmOverrides && typeof data.gmOverrides === 'object') {
          gmOverrides = data.gmOverrides;
        }
        if (data.couplePassword) AppState.couplePassword = data.couplePassword;
        if (data.finaleLoveLetter) AppState.finaleLoveLetter = data.finaleLoveLetter;
        if (data.aldrynHouse) AppState.aldrynHouse = data.aldrynHouse;

        saveGMOverrides();
        savePersistedState();
        renderHUD();
        renderWorldsAndTarotCards();
        renderLootInventoryView();
        renderGameMasterView();
        showRoyalToast('📂', 'Configuration importée avec succès dans le Grimoire !');
      } catch (err) {
        showRoyalToast('⚠️', 'Fichier JSON invalide.');
      }
    };
    reader.readAsText(file);
  }

  // ==========================================================================
  // NAVIGATION & ÉCOUTEURS D'ÉVÉNEMENTS GLOBAUX
  // ==========================================================================
  function switchMainView(viewName) {
    document.querySelectorAll('.grimoire-nav-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
    });

    const viewsMap = {
      map: 'view-map',
      loot: 'view-loot',
      codex: 'view-codex',
      gm: 'view-gm'
    };

    Object.entries(viewsMap).forEach(([key, id]) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('active', key === viewName);
    });

    if (window.AudioFX) window.AudioFX.playClick();

    if (viewName === 'loot') renderLootInventoryView();
    if (viewName === 'codex') renderCodexView();
    if (viewName === 'gm') renderGameMasterView();
  }

  function bindGlobalEvents() {
    // 1. Switch Mode Temporel (Mode Exploration Libre vs Mode Décembre Réel)
    const temporalBtn = document.getElementById('temporal-toggle-btn');
    if (temporalBtn) {
      temporalBtn.addEventListener('click', () => {
        AppState.freeExploreMode = !AppState.freeExploreMode;
        savePersistedState();
        renderHUD();
        renderWorldsAndTarotCards();
        if (window.AudioFX) window.AudioFX.playClick();
        showRoyalToast(
          AppState.freeExploreMode ? '🔓' : '🗓️',
          AppState.freeExploreMode
            ? 'Mode Test activé : les 24 Jours, Boss et Coffres sont librement accessibles !'
            : 'Mode Calendrier de Décembre activé : déverrouillage selon la date réelle.'
        );
      });
    }

    // 2. Bouton Mute Audio
    if (window.AudioFX && typeof window.AudioFX.bindMuteButton === 'function') {
      window.AudioFX.bindMuteButton('#audio-mute-btn');
    }

    // 3. Onglets de Navigation Principale
    document.querySelectorAll('.grimoire-nav-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        switchMainView(view);
      });
    });

    // 4. Badge Maison d'Aldryn cliquable -> ouvre le Jour 4 (Curious Tides)
    const aldrynBadge = document.getElementById('aldryn-house-badge');
    if (aldrynBadge) {
      aldrynBadge.addEventListener('click', () => {
        openChapterModal(4);
      });
    }

    // 5. Sélecteur des 4 Semaines / Mondes
    document.querySelectorAll('.world-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.world-tab-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        AppState.selectedWeek = btn.getAttribute('data-week') || 'all';
        if (window.AudioFX) window.AudioFX.playClick();
        renderWorldsAndTarotCards();
      });
    });

    // 6. Filtres de Cartes (Toutes / Boss / Complétés / À explorer)
    document.querySelectorAll('[data-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-filter]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        AppState.selectedFilter = btn.getAttribute('data-filter') || 'all';
        if (window.AudioFX) window.AudioFX.playClick();
        renderWorldsAndTarotCards();
      });
    });

    // 7. Filtres de la Bibliothèque de Lau (Codex)
    document.querySelectorAll('[data-codex-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-codex-filter]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        AppState.selectedCodexFilter = btn.getAttribute('data-codex-filter') || 'all';
        if (window.AudioFX) window.AudioFX.playClick();
        renderCodexView();
      });
    });

    // 8. Bouton Aperçu Complet dans le Grimoire de Butin
    const lootPreviewBtn = document.getElementById('loot-unlock-preview-btn');
    if (lootPreviewBtn) {
      lootPreviewBtn.addEventListener('click', () => {
        AppState.showAllLootPreview = !AppState.showAllLootPreview;
        lootPreviewBtn.textContent = AppState.showAllLootPreview
          ? '🔒 Afficher uniquement mes trésors gagnés'
          : '👁️ Afficher tous les trésors (Mode Aperçu)';
        renderLootInventoryView();
      });
    }

    // 9. Contrôles de la Modale Chapitre
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBackdrop = document.getElementById('chapter-modal-backdrop');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeChapterModal);
    }
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeChapterModal();
      });
    }

    // Onglets internes de la Modale (1. Scène Narrative / 2. Épreuve / 3. Sceau & Coffre)
    document.querySelectorAll('.modal-stage-tab').forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        const stage = tabBtn.getAttribute('data-stage');
        if (window.AudioFX) window.AudioFX.playClick();
        switchModalStage(stage);
      });
    });

    // Navigation Visual Novel (Précédent / Suivant / Tout afficher / Relever l'Épreuve)
    const vnPrevBtn = document.getElementById('vn-prev-btn');
    const vnNextBtn = document.getElementById('vn-next-btn');
    const vnShowAllBtn = document.getElementById('vn-show-all-btn');
    const vnStartChallengeBtn = document.getElementById('vn-start-challenge-btn');

    if (vnPrevBtn) {
      vnPrevBtn.addEventListener('click', () => {
        if (AppState.vnLineIndex > 0) {
          AppState.vnLineIndex -= 1;
          if (window.AudioFX) window.AudioFX.playClick();
          renderVisualNovelScene(getDayByNumber(AppState.activeDayNumber));
        }
      });
    }

    if (vnNextBtn) {
      vnNextBtn.addEventListener('click', () => {
        const dayObj = getDayByNumber(AppState.activeDayNumber);
        const total = (dayObj.dialogues || []).length;
        if (AppState.vnLineIndex < total - 1) {
          AppState.vnLineIndex += 1;
          if (window.AudioFX) window.AudioFX.playClick();
          renderVisualNovelScene(dayObj);
        } else {
          switchModalStage('game');
        }
      });
    }

    if (vnShowAllBtn) {
      vnShowAllBtn.addEventListener('click', () => {
        AppState.vnShowAll = !AppState.vnShowAll;
        vnShowAllBtn.textContent = AppState.vnShowAll
          ? '📜 Masquer le parchemin complet'
          : '📜 Afficher tout le dialogue';
        renderVisualNovelScene(getDayByNumber(AppState.activeDayNumber));
      });
    }

    if (vnStartChallengeBtn) {
      vnStartChallengeBtn.addEventListener('click', () => {
        if (window.AudioFX) window.AudioFX.playClick();
        switchModalStage('game');
      });
    }

    // 10. Boutons de l'Atelier du Vilain (Maître du Jeu)
    const gmSaveBtn = document.getElementById('gm-save-all-btn');
    const gmExportBtn = document.getElementById('gm-export-json-btn');
    const gmImportInput = document.getElementById('gm-import-json-input');
    const gmUnlockAllBtn = document.getElementById('gm-unlock-all-btn');
    const gmResetBtn = document.getElementById('gm-reset-progress-btn');

    if (gmSaveBtn) {
      gmSaveBtn.addEventListener('click', () => collectAndSaveAllGMFields(true));
    }
    if (gmExportBtn) {
      gmExportBtn.addEventListener('click', exportGMConfigurationJSON);
    }
    if (gmImportInput) {
      gmImportInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          importGMConfigurationJSON(e.target.files[0]);
        }
      });
    }
    if (gmUnlockAllBtn) {
      gmUnlockAllBtn.addEventListener('click', () => {
        AppState.completedDays = Array.from({ length: 24 }, (_, i) => i + 1);
        savePersistedState();
        renderHUD();
        renderWorldsAndTarotCards();
        renderLootInventoryView();
        if (window.ParticleFX) window.ParticleFX.burst(window.innerWidth / 2, window.innerHeight / 2, 'legendary');
        if (window.AudioFX) window.AudioFX.playChestOpen('legendary');
        showRoyalToast('✨', 'Les 24 Arcanes sont marqués comme complétés (24/24 Runes) !');
      });
    }
    if (gmResetBtn) {
      gmResetBtn.addEventListener('click', () => {
        AppState.completedDays = [];
        AppState.claimedLoots = [];
        savePersistedState();
        renderHUD();
        renderWorldsAndTarotCards();
        renderLootInventoryView();
        showRoyalToast('🔄', 'Progression remise à 0/24 Runes (vos textes et cachettes personnalisés sont conservés) !');
      });
    }
  }

  // ==========================================================================
  // UTILITAIRES & TOAST ROYAL
  // ==========================================================================
  let toastTimer = null;
  function showRoyalToast(icon, message) {
    const toastEl = document.getElementById('royal-toast');
    const iconEl = document.getElementById('royal-toast-icon');
    const textEl = document.getElementById('royal-toast-text');
    if (!toastEl) return;

    if (iconEl) iconEl.textContent = icon || '✦';
    if (textEl) textEl.textContent = message;

    toastEl.classList.add('visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('visible');
    }, 4200);
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==========================================================================
  // DÉMARRAGE DU GRIMOIRE
  // ==========================================================================
  function initApp() {
    loadPersistedState();

    if (window.ParticleFX && typeof window.ParticleFX.initAmbientCanvas === 'function') {
      window.ParticleFX.initAmbientCanvas('ambient-particles-canvas');
    }

    renderHUD();
    renderWorldsAndTarotCards();
    renderCodexView();
    bindGlobalEvents();
  }

  // Expose une API publique pour que les autres modules (minigames_engine.js, etc.) puissent interagir
  window.LauGrimoireApp = {
    openDay: openChapterModal,
    completeDay: (dayNum, bonusPayload) => {
      const dayObj = getDayByNumber(dayNum);
      handleDayChallengeVictory(dayObj, bonusPayload);
    },
    setAldrynHouse: (houseObj) => {
      if (houseObj && houseObj.name) {
        AppState.aldrynHouse = houseObj;
        savePersistedState();
        renderHUD();
      }
    },
    showToast: showRoyalToast,
    getState: () => AppState
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
