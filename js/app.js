/**
 * APP.JS — CONTRÔLEUR PRINCIPAL & ARCHITECTE GAME UI/UX (ÉDITION 2026)
 * "L'Assistante du Vilain & Le Multivers de @lau.libraryyy"
 *
 * Architecture Zero-UI / Liquid Glass / JRPG Moderne :
 * 1. Écran Titre Cinématique par-dessus la Carte du Monde animée en temps réel.
 * 2. Carte du Monde plein écran (100vw × 100vh) pilotée via window.WorldMapEngine
 *    + fallback interactif élégant si WorldMapEngine n'est pas encore chargé.
 * 3. HUD Flottant Minimaliste : Pilule Profil (🗝️ 0/24, ✨ 0/12, Maison d'Aldryn),
 *    Dock d'icônes, Contrôles Caméra (+/-/🎯/I-IV), Barre de Niveau Sélectionné.
 * 4. Modale de Chapitre : Visual Novel -> Mini-Jeu (window.MiniGamesEngine) ->
 *    Sceau de Cire Rouge (3 clics) & Coffre IRL (+ Portrait & Lettre Jour 24).
 * 5. Modale Tiroir Unifiée : Butin & Bons / Bibliothèque (35 livres) /
 *    Journal des 12 Secrets (window.MAP_EASTER_EGGS) / Atelier du Vilain (MJ).
 */

(function () {
  'use strict';

  const STORAGE_KEYS = {
    STATE: 'lau_grimoire_quest_state_v1',
    GM_OVERRIDES: 'lau_grimoire_gm_overrides_v1',
    SECRETS: 'lau_library_map_secrets_v1'
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
      kicker: 'MONDE I • JOURS 1 À 6',
      title: 'Le Bureau du Vilain & L’Académie des Marées',
      banner: 'assets/world_week1_office.png'
    },
    {
      week: 2,
      daysRange: [7, 12],
      kicker: 'MONDE II • JOURS 7 À 12',
      title: 'Du Désert de Laiton aux Brumes d’Irlande',
      banner: 'assets/world_week2_desert_forest.png'
    },
    {
      week: 3,
      daysRange: [13, 18],
      kicker: 'MONDE III • JOURS 13 À 18',
      title: 'Flammes, Guerres et Salons à Mons',
      banner: 'assets/world_week3_flames_gold.png'
    },
    {
      week: 4,
      daysRange: [19, 24],
      kicker: 'MONDE IV • JOURS 19 À 24',
      title: 'L’Alchimie et le Sanctuaire Final',
      banner: 'assets/world_week4_sanctuary.png'
    }
  ];

  const DEFAULT_LOVE_LETTER = `Ma chère Assistante (et Héroïne préférée de tous les multivers),

Depuis le premier chapitre de notre histoire — entre nos fous rires, nos balades à Mons, tes piles à lire qui défient les lois de la gravité et tes avis littéraires aussi tranchants qu’une dague de Romantasy — tu as ensorcelé mon quotidien bien mieux que n’importe quel grimoire.

Même le plus redoutable des Vilains dépose les armes devant toi (et Kingsley approuve depuis son coussin royal 🐸👑).

Merci d’être cette lectrice passionnée, solaire, drôle et merveilleuse. Que ces 24 Arcanes ne soient que le prologue de toutes nos prochaines aventures à deux.

Joyeux Noël mon amour,
Ton Vilain dévoué pour l’éternité ❤️`;

  // Fallback des 12 Secrets si window.MAP_EASTER_EGGS n'est pas encore défini
  const FALLBACK_EASTER_EGGS = [
    { id: 'egg_kingsley_sign', region: 1, icon: '🪧', title: 'La Pancarte Secrète de Kingsley', hint: 'Cachez-vous près du Bureau du Vilain au Monde I...', text: '« URGENCE : Laure mérite un café chaud et un nouveau livre relié immédiatement ! » — Signé Sire Kingsley.' },
    { id: 'egg_vinted_alert', region: 1, icon: '📦', title: 'L’Alerte Vinted Relié Collector', hint: 'Un colis mystérieux brille près des Archives (Monde I)...', text: 'Alerte Vinted : Tomes 2, 3 et 4 de The Bone Season en relié introuvable... juste un mois avant la réédition !' },
    { id: 'egg_aldryn_tide', region: 1, icon: '🌊', title: 'Le Coquillage d’Aldryn', hint: 'Sur les falaises lunaires de l’Académie (Monde I)...', text: 'En collant l’oreille au coquillage, on entend Emory et Baz murmurer : « Vivement le Tome 2 de Curious Tides ! »' },
    { id: 'egg_babel_debate', region: 2, icon: '🏛️', title: 'La Tour du Grand Débat : Babel', hint: 'Une stèle argentée entre le Monde I et le Désert (Monde II)...', text: 'Gravure du couple : « Chef-d’œuvre absolu » (Le Vilain) vs « Mouais, très moyen ! » (@lau.libraryyy).' },
    { id: 'egg_ireland_pint', region: 2, icon: '☘️', title: 'Le Pub Brumeux d’Irlande', hint: 'Dans la forêt d’émeraude du Monde II...', text: 'Souvenir de votre voyage en amoureux en Irlande : la pluie sur les vitres, une pinte et "N’invite pas la forêt à entrer".' },
    { id: 'egg_daevabad_lamp', region: 2, icon: '🪔', title: 'La Lampe de Laiton de Nahri', hint: 'Au cœur des dunes dorées de Daevabad (Monde II)...', text: 'Un djinn s’échappe et confirme que la Trilogie de Daevabad reste indétrônable au Panthéon de Lau !' },
    { id: 'egg_mons_belfry', region: 3, icon: '🔔', title: 'Le Beffroi de Mons & Trolls & Légendes', hint: 'Près des salons littéraires du Monde III...', text: 'Écho de vos week-ends à Mons : discussions passionnées avec les autrices, piles de dédicaces et goûters en amoureux.' },
    { id: 'egg_typewriter', region: 3, icon: '⌨️', title: 'La Machine à Écrire d’Iris Winnow', hint: 'Dans les brumes romantiques du Monde III...', text: 'Une lettre glisse sous la porte : « Peu importe les mondes qui s’effondrent, je te choisirai toujours. »' },
    { id: 'egg_powerless_verdict', region: 3, icon: '🚫', title: 'Le Tampon "C’EST NON !"', hint: 'Un marteau de juge scintille au Monde III...', text: 'Verdict officiel de @lau.libraryyy sur les romans BookTok surcotés : Fourth Wing & Powerless recalés à l’entrée !' },
    { id: 'egg_providence_card', region: 4, icon: '🃏', title: 'La Treizième Carte de la Providence', hint: 'Aux abords de la forêt de Pierres-Claires (Monde IV)...', text: 'Le Cauchemar ricane : « Une carte rare : La Carte du Bonheur Éternel. Prix à payer : un bisou au Vilain. »' },
    { id: 'egg_red_city_vial', region: 4, icon: '⚗️', title: 'La Fiole Alchimique de Red City', hint: 'Près du laboratoire doré du Monde IV...', text: 'Distillation d’or pur : 50% passion Bookstagram, 50% fous rires à deux, 100% coup de cœur absolu.' },
    { id: 'egg_sanctuary_star', region: 4, icon: '⭐', title: 'L’Étoile du 24 Décembre', hint: 'Tout près du Sanctuaire Solaire Final (Monde IV)...', text: 'Une constellation secrète forme les initiales de Laure & son Vilain au-dessus de la Grande Bibliothèque.' }
  ];

  // Fallback minimal des 24 jours si days_data.js venait à manquer
  const FALLBACK_24_DAYS = Array.from({ length: 24 }, (_, i) => {
    const day = i + 1;
    const week = Math.ceil(day / 6);
    const isFinale = day === 24;
    const isBoss = [6, 12, 18, 21, 24].includes(day);
    return {
      day,
      week,
      roman: ROMAN_NUMERALS[day],
      arcanaName: `Arcane ${ROMAN_NUMERALS[day]}`,
      title: isFinale ? 'Le Sanctuaire Secret du Vilain' : isBoss ? `Épreuve de Boss — Jour ${day}` : `Chapitre ${day} du Multivers`,
      rarity: isFinale ? 'legendary' : isBoss ? 'epic' : 'common',
      isBoss,
      isFinale,
      emblem: isFinale ? '☀️' : isBoss ? '⚔️' : '✦',
      books: ['Grimoire de @lau.libraryyy'],
      lootTitle: `Trésor du Jour ${day}`,
      lootCategory: isBoss ? 'Gros Cadeau Boss' : 'Cadeau caché chez nous',
      irlLocation: `Indice IRL du Jour ${day} (modifiable dans l’Atelier du Vilain).`,
      lootDescription: 'Une surprise préparée par ton Vilain préféré.'
    };
  });

  // ==========================================================================
  // ÉTAT GLOBAL
  // ==========================================================================
  const AppState = {
    freeExploreMode: true, // Mode Test 24/24 activé par défaut
    completedDays: [],
    claimedLoots: [],
    foundSecrets: [],
    selectedDay: 1,
    activeRegion: 1,
    selectedCodexFilter: 'all',
    showAllLootPreview: false,
    aldrynUnlocked: false,
    aldrynHouse: {
      name: 'Maison de la Lune Croissante',
      icon: '🌒',
      power: "Totem : Cerf d'Écume • Flux de la Marée"
    },
    couplePassword: 'KINGSLEY',
    finaleLoveLetter: DEFAULT_LOVE_LETTER,
    // Modale chapitre
    activeDayNumber: null,
    activeStage: 'story',
    vnLineIndex: 0,
    vnShowAll: false,
    waxClicksCount: 0,
    waxBrokenInSession: false,
    // Modale tiroir
    activeDrawerTab: 'loot',
    titleDismissed: false
  };

  let gmOverrides = {};
  let worldMapInstance = null;
  let fallbackMapState = { scale: 1, tx: 0, ty: 0 };

  // ==========================================================================
  // PERSISTANCE LOCALSTORAGE
  // ==========================================================================
  function loadPersistedState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.STATE);
      if (raw) {
        const p = JSON.parse(raw);
        if (typeof p.freeExploreMode === 'boolean') AppState.freeExploreMode = p.freeExploreMode;
        if (Array.isArray(p.completedDays)) AppState.completedDays = p.completedDays.map(Number);
        if (Array.isArray(p.claimedLoots)) AppState.claimedLoots = p.claimedLoots.map(Number);
        if (p.aldrynHouse && p.aldrynHouse.name) AppState.aldrynHouse = p.aldrynHouse;
        if (typeof p.aldrynUnlocked === 'boolean') AppState.aldrynUnlocked = p.aldrynUnlocked;
        if (p.couplePassword) AppState.couplePassword = p.couplePassword;
        if (p.finaleLoveLetter) AppState.finaleLoveLetter = p.finaleLoveLetter;
        if (typeof p.selectedDay === 'number' && p.selectedDay >= 1 && p.selectedDay <= 24) {
          AppState.selectedDay = p.selectedDay;
        }
      }
    } catch (e) {
      console.warn('Chargement AppState impossible:', e);
    }

    // Déduit si Aldryn est déjà débloqué (Jour 4 complété)
    if (AppState.completedDays.includes(4)) {
      AppState.aldrynUnlocked = true;
    }

    // Lettre d'amour par défaut issue de days_data.js si non personnalisée
    if (
      AppState.finaleLoveLetter === DEFAULT_LOVE_LETTER &&
      window.DEFAULT_REWARDS &&
      window.DEFAULT_REWARDS.loveLetter
    ) {
      AppState.finaleLoveLetter = window.DEFAULT_REWARDS.loveLetter;
    }

    try {
      const rawGM = localStorage.getItem(STORAGE_KEYS.GM_OVERRIDES);
      if (rawGM) gmOverrides = JSON.parse(rawGM) || {};
    } catch (e) {
      gmOverrides = {};
    }

    try {
      const rawSec = localStorage.getItem(STORAGE_KEYS.SECRETS);
      if (rawSec) {
        const arr = JSON.parse(rawSec);
        if (Array.isArray(arr)) AppState.foundSecrets = arr;
      }
    } catch (e) {
      AppState.foundSecrets = [];
    }
  }

  function savePersistedState() {
    try {
      localStorage.setItem(
        STORAGE_KEYS.STATE,
        JSON.stringify({
          freeExploreMode: AppState.freeExploreMode,
          completedDays: AppState.completedDays,
          claimedLoots: AppState.claimedLoots,
          aldrynUnlocked: AppState.aldrynUnlocked,
          aldrynHouse: AppState.aldrynHouse,
          couplePassword: AppState.couplePassword,
          finaleLoveLetter: AppState.finaleLoveLetter,
          selectedDay: AppState.selectedDay
        })
      );
    } catch (e) {
      console.warn('Sauvegarde AppState impossible:', e);
    }
  }

  function saveGMOverrides() {
    try {
      localStorage.setItem(STORAGE_KEYS.GM_OVERRIDES, JSON.stringify(gmOverrides));
    } catch (e) {
      console.warn('Sauvegarde GMOverrides impossible:', e);
    }
  }

  function saveFoundSecrets() {
    try {
      localStorage.setItem(STORAGE_KEYS.SECRETS, JSON.stringify(AppState.foundSecrets));
    } catch (e) {
      console.warn('Sauvegarde secrets impossible:', e);
    }
  }

  // ==========================================================================
  // NORMALISATION DES 24 JOURS & DES 12 SECRETS
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

  function detectSpeakerRole(speakerStr) {
    const s = String(speakerStr || '').toLowerCase();
    if (s.includes('laure') || s.includes('laura') || s.includes('héroïne') || s.includes('heroine') || s.includes('assistante') || s.includes('lau')) {
      return 'laura';
    }
    if (s.includes('kingsley') || s.includes('grenouille') || s.includes('frog')) {
      return 'kingsley';
    }
    return 'villain';
  }

  function buildDefaultDialogues(dayNum, title, books, isBoss, isFinale) {
    const bookText = books.join(' & ');
    if (isFinale) {
      return [
        { speaker: '👑 Le Vilain', role: 'villain', text: 'Nous y voilà, mon Assistante. Les 23 serrures runiques ont cédé une à une devant toi.' },
        { speaker: '🐸 Sire Kingsley', role: 'kingsley', text: '*Ajuste sa couronne dorée* « CROÂ ! La Reine de @lau.libraryyy mérite son coffre légendaire ! »' },
        { speaker: '✨ Laure', role: 'laura', text: '24 jours à travers nos livres et nos souvenirs… Voyons quel ultime secret tu caches dans ce Sanctuaire !' }
      ];
    }
    if (isBoss) {
      return [
        { speaker: '🐸 Sire Kingsley', role: 'kingsley', text: `*Brandit une pancarte rouge* « ALERTE BOSS DU JOUR ${dayNum} ! Un coffre épique est en jeu ! »` },
        { speaker: '👑 Le Vilain', role: 'villain', text: `Prête à affronter "${title}" (${bookText}) ? Un gros trésor IRL t'attend derrière ce gardien.` },
        { speaker: '✨ Laure', role: 'laura', text: 'J’ai survécu à des cliffhangers de 900 pages. Ce Boss n’a aucune chance !' }
      ];
    }
    return [
      { speaker: '👑 Le Vilain', role: 'villain', text: `Bienvenue au Jour ${dayNum}, mon Assistante. Cap sur "${title}" (${bookText}).` },
      { speaker: '✨ Laure', role: 'laura', text: 'Montre-moi l’épreuve que tu as concoctée avec Kingsley pour débloquer ma surprise !' }
    ];
  }

  function normalizeDayObject(raw, idx) {
    const dayNum = Number(raw.day || raw.id || idx + 1);
    const fallback = FALLBACK_24_DAYS[dayNum - 1] || FALLBACK_24_DAYS[0];
    const weekNum = Number(raw.week || Math.ceil(dayNum / 6));
    const isFinale = dayNum === 24 || Boolean(raw.isFinale);
    const isBoss = Boolean(
      raw.isBoss ||
      [6, 12, 18, 21, 24].includes(dayNum) ||
      String(raw.rarity || '').toLowerCase().includes('epic') ||
      String(raw.rarity || '').toLowerCase().includes('legend')
    );

    const rarityKey = isFinale ? 'legendaire' : isBoss ? 'epique' : 'commun';

    let books = [];
    if (Array.isArray(raw.books)) {
      books = raw.books.map((b) => (typeof b === 'string' ? b : b.title || b.name || 'Roman'));
    } else if (typeof raw.book === 'string') {
      books = [raw.book];
    } else {
      books = fallback.books;
    }

    let dialogues = [];
    const rawDlg = raw.introDialogue || raw.dialogue || raw.dialogues;
    if (Array.isArray(rawDlg) && rawDlg.length > 0) {
      dialogues = rawDlg.map((line) => ({
        speaker: line.name || line.speaker || 'Le Vilain',
        role: detectSpeakerRole(line.speaker || line.name || line.role || ''),
        text: line.text || line.line || line.content || ''
      }));
    } else {
      dialogues = buildDefaultDialogues(dayNum, raw.title || fallback.title, books, isBoss, isFinale);
    }

    const rawLoot = raw.defaultLoot || raw.loot || raw.reward || {};
    const defaultRewardsDay =
      window.DEFAULT_REWARDS && window.DEFAULT_REWARDS.days ? window.DEFAULT_REWARDS.days[dayNum] || {} : {};
    const override = gmOverrides[dayNum] || {};

    const CATEGORY_MAP = {
      IRL_GIFT: 'Cadeau caché chez nous',
      DIGITAL_COUPON: 'Bon digital',
      BOSS_GIFT: 'Gros Cadeau Boss',
      LEGENDARY_GIFT: 'Gros Cadeau Boss'
    };

    const rawCat = rawLoot.category || rawLoot.type || defaultRewardsDay.category || '';
    const mappedCat = CATEGORY_MAP[rawCat] || rawCat || fallback.lootCategory;

    return {
      day: dayNum,
      week: weekNum,
      roman: raw.roman || ROMAN_NUMERALS[dayNum] || String(dayNum),
      arcanaName: raw.tarotArcana || raw.arcanaName || fallback.arcanaName,
      title: raw.title || fallback.title,
      subtitle: raw.subtitle || '',
      emblem: raw.tarotSymbol || raw.emblem || fallback.emblem,
      rarityKey,
      isBoss,
      isFinale,
      books,
      dialogues,
      loot: {
        title: override.lootTitle || rawLoot.title || defaultRewardsDay.title || fallback.lootTitle,
        irlLocation:
          override.irlLocation ||
          rawLoot.irlClue ||
          rawLoot.irlLocation ||
          defaultRewardsDay.irlClue ||
          fallback.irlLocation,
        category: override.lootCategory || mappedCat,
        description:
          override.lootDescription ||
          rawLoot.description ||
          rawLoot.rpDescription ||
          defaultRewardsDay.description ||
          fallback.lootDescription
      },
      rawOriginal: raw
    };
  }

  function getAllNormalizedDays() {
    return getRawDaysSource().map((raw, idx) => normalizeDayObject(raw, idx));
  }

  function getDayByNumber(dayNum) {
    const all = getAllNormalizedDays();
    return all.find((d) => d.day === Number(dayNum)) || all[0];
  }

  function getAllEasterEggs() {
    const src =
      Array.isArray(window.MAP_EASTER_EGGS) && window.MAP_EASTER_EGGS.length > 0
        ? window.MAP_EASTER_EGGS
        : FALLBACK_EASTER_EGGS;

    return src.map((egg, idx) => {
      const region = Number(egg.biome || egg.region || egg.world || egg.week || Math.ceil((idx + 1) / 3));
      const worldObj = WORLDS_CONFIG.find((w) => w.week === region);
      const worldLabel = worldObj ? worldObj.title : `Monde ${ROMAN_NUMERALS[region] || 'I'}`;
      return {
        id: egg.id || `secret_${idx + 1}`,
        region,
        icon: egg.icon || egg.emoji || '✨',
        title: egg.title || egg.name || `Secret #${idx + 1}`,
        hint: egg.hint || egg.clue || `Une lueur secrète brille dans le Monde ${ROMAN_NUMERALS[region] || 'I'} (${worldLabel})…`,
        text: egg.text || egg.message || egg.dialogue || egg.lore || egg.description || 'Un clin d’œil secret du Multivers !',
        x: egg.x,
        y: egg.y
      };
    });
  }

  function getAldrynHouseForMap() {
    if (!AppState.aldrynUnlocked && !isDayCompleted(4)) return null;
    const houses = window.ALDRYN_HOUSES || {};
    const matched = Object.values(houses).find(
      (h) => h && AppState.aldrynHouse && h.name === AppState.aldrynHouse.name
    );
    return matched || AppState.aldrynHouse;
  }

  // ==========================================================================
  // LOGIQUE TEMPORELLE
  // ==========================================================================
  function getCurrentDecemberDay() {
    const now = new Date();
    if (now.getMonth() === 11) {
      return Math.min(24, Math.max(1, now.getDate()));
    }
    return 1;
  }

  function isDayUnlocked(dayNum) {
    if (AppState.freeExploreMode) return true;
    return Number(dayNum) <= getCurrentDecemberDay() || isDayCompleted(dayNum);
  }

  function isDayCompleted(dayNum) {
    return AppState.completedDays.includes(Number(dayNum));
  }

  // ==========================================================================
  // 1. INTERFACE AVEC WINDOW.WORLDMAPENGINE (+ FALLBACK INTERACTIF)
  // ==========================================================================
  function initWorldMap() {
    const root = document.getElementById('world-map-root');
    if (!root) return;

    const allDays = getAllNormalizedDays();
    const mapOptions = {
      days: allDays,
      completedDays: [...AppState.completedDays],
      unlockedCheckFn: (d) => isDayUnlocked(d),
      aldrynHouse: getAldrynHouseForMap(),
      discoveredSecrets: [...AppState.foundSecrets],
      currentDay: AppState.selectedDay,
      onSelectDay: (d) => handleMapSelectDay(d, false),
      onEnterDay: (d) => handlePlayDay(d),
      onSecretFound: (secretId, foundCount, totalCount, secretObj) => {
        handleEasterEggFound(secretObj || secretId, true);
      },
      onVillainClick: (loveNote) => {
        if (loveNote) showRoyalToast('🖤👑', loveNote);
      }
    };

    const Engine = window.WorldMapEngine;
    if (Engine && typeof Engine.init === 'function') {
      try {
        Engine.init(root, mapOptions);
        worldMapInstance = Engine;
        if (typeof worldMapInstance.getSecretsData === 'function') {
          const secData = worldMapInstance.getSecretsData();
          if (secData && Array.isArray(secData.foundIds)) {
            AppState.foundSecrets = [...secData.foundIds];
          }
        }
        return;
      } catch (err) {
        console.warn('WorldMapEngine init fallback:', err);
        worldMapInstance = null;
      }
    }

    // Fallback visuel interactif élégant si world_map.js est absent
    renderFallbackOverworld(root, allDays);
  }

  function syncWorldMapState() {
    const payload = {
      completedDays: [...AppState.completedDays],
      unlockedCheckFn: (d) => isDayUnlocked(d),
      discoveredSecrets: [...AppState.foundSecrets],
      aldrynHouse: getAldrynHouseForMap(),
      currentDay: AppState.selectedDay
    };

    if (worldMapInstance && typeof worldMapInstance.updateState === 'function') {
      worldMapInstance.updateState(payload);
    } else {
      updateFallbackMapNodes();
    }
  }

  function walkHeroToDay(dayNum) {
    const target = Math.max(1, Math.min(24, Number(dayNum)));
    AppState.selectedDay = target;
    AppState.activeRegion = Math.ceil(target / 6);
    savePersistedState();

    renderStageSelectorBar();
    updateRegionRailActive(AppState.activeRegion);

    if (worldMapInstance && typeof worldMapInstance.walkToDay === 'function') {
      worldMapInstance.walkToDay(target, false);
    } else {
      updateFallbackHeroPosition(target);
    }
  }

  function handleMapSelectDay(dayNum, shouldPlayIfSame = false) {
    const num = Number(dayNum);
    if (!num || num < 1 || num > 24) return;
    const wasAlreadySelected = AppState.selectedDay === num;
    AppState.selectedDay = num;
    AppState.activeRegion = Math.ceil(num / 6);
    savePersistedState();

    renderStageSelectorBar();
    updateRegionRailActive(AppState.activeRegion);

    if (shouldPlayIfSame && wasAlreadySelected) {
      handlePlayDay(num);
    }
  }

  function cameraZoom(delta) {
    if (worldMapInstance) {
      if (delta > 0 && typeof worldMapInstance.zoomIn === 'function') return worldMapInstance.zoomIn();
      if (delta < 0 && typeof worldMapInstance.zoomOut === 'function') return worldMapInstance.zoomOut();
    } else {
      if (window.AudioFX) window.AudioFX.playClick();
      fallbackMapState.scale = Math.max(0.65, Math.min(1.65, fallbackMapState.scale + delta));
      applyFallbackCameraTransform();
    }
  }

  function cameraCenterHero() {
    if (window.AudioFX) window.AudioFX.playClick();
    if (worldMapInstance && typeof worldMapInstance.focusOnHero === 'function') {
      worldMapInstance.focusOnHero(true);
    } else {
      fallbackMapState.scale = 1;
      centerFallbackOnDay(AppState.selectedDay);
    }
  }

  function cameraJumpRegion(regionNum) {
    const r = Math.max(1, Math.min(4, Number(regionNum)));
    AppState.activeRegion = r;
    updateRegionRailActive(r);
    if (window.AudioFX) window.AudioFX.playClick();

    if (worldMapInstance && typeof worldMapInstance.focusOnRegion === 'function') {
      worldMapInstance.focusOnRegion(r);
    } else {
      centerFallbackOnDay((r - 1) * 6 + 3);
    }
  }

  function updateRegionRailActive(regionNum) {
    document.querySelectorAll('.cam-region-btn').forEach((btn) => {
      btn.classList.toggle('active', Number(btn.getAttribute('data-cam-region')) === Number(regionNum));
    });
  }

  // --- FALLBACK OVERWORLD INTERACTIF (SI WORLD_MAP.JS NON PRÉSENT) ---
  const FALLBACK_COORDS = [
    [220, 420], [340, 340], [470, 410], [600, 320], [740, 390], [870, 300],
    [1040, 380], [1170, 470], [1310, 390], [1440, 480], [1580, 390], [1720, 310],
    [1900, 390], [2040, 470], [2180, 380], [2310, 460], [2440, 370], [2580, 290],
    [2750, 380], [2880, 460], [3020, 360], [3150, 440], [3280, 360], [3440, 310]
  ];

  function renderFallbackOverworld(root, allDays) {
    const eggs = getAllEasterEggs();
    const pathPoints = FALLBACK_COORDS.map(([x, y]) => `${x},${y}`).join(' ');

    root.innerHTML = `
      <div class="wm-viewport" id="fb-wm-viewport">
        <div class="wm-world-layer" id="fb-wm-world" style="width:3700px; height:860px; background: radial-gradient(circle at 18% 45%, rgba(45,65,130,0.45), transparent 32%), radial-gradient(circle at 46% 50%, rgba(160,105,40,0.32), transparent 30%), radial-gradient(circle at 72% 45%, rgba(165,40,65,0.34), transparent 30%), radial-gradient(circle at 92% 42%, rgba(246,211,101,0.28), transparent 28%), linear-gradient(180deg, #071028 0%, #0b1838 55%, #060d20 100%);">
          <svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;" viewBox="0 0 3700 860">
            <polyline points="${pathPoints}" fill="none" stroke="rgba(246,211,101,0.32)" stroke-width="4" stroke-dasharray="10 10" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <div class="wm-region-label" style="left:540px; top:160px; transform:translateX(-50%);">I • Bureau du Vilain &amp; Aldryn</div>
          <div class="wm-region-label" style="left:1380px; top:160px; transform:translateX(-50%);">II • Désert de Laiton &amp; Irlande</div>
          <div class="wm-region-label" style="left:2240px; top:160px; transform:translateX(-50%);">III • Flammes &amp; Salons de Mons</div>
          <div class="wm-region-label" style="left:3100px; top:160px; transform:translateX(-50%);">IV • Alchimie &amp; Sanctuaire Final</div>

          ${allDays
            .map((d, i) => {
              const [x, y] = FALLBACK_COORDS[i] || [200 + i * 130, 400];
              const cls = [
                'wm-node',
                d.isFinale ? 'wm-legendary-node' : d.isBoss ? 'wm-boss-node' : ''
              ]
                .filter(Boolean)
                .join(' ');
              return `<button type="button" class="${cls}" data-fb-day="${d.day}" style="left:${x}px; top:${y}px;" title="Jour ${d.day} : ${escapeHtml(d.title)}">${d.isFinale ? '👑' : d.isBoss ? '⚔️' : d.day}</button>`;
            })
            .join('')}

          ${eggs
            .map((egg, i) => {
              const baseX = 280 + i * 285;
              const baseY = i % 2 === 0 ? 245 : 565;
              const found = AppState.foundSecrets.includes(egg.id);
              return `<button type="button" class="wm-easter-egg ${found ? 'is-found' : ''}" data-fb-egg="${escapeHtml(egg.id)}" style="left:${baseX}px; top:${baseY}px;" title="${escapeHtml(egg.title)}">${egg.icon}</button>`;
            })
            .join('')}

          <div id="fb-hero-sprite" class="wm-hero-sprite">
            <img src="assets/sprite_laura.png" alt="Laure" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src='assets/heroine_avatar.png';}" />
          </div>
          <div id="fb-kingsley-sprite" class="wm-kingsley-sprite">
            <img src="assets/sprite_kingsley.png" alt="Kingsley" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src='assets/kingsley_avatar.png';}" />
          </div>
        </div>
      </div>
    `;

    // Pan à la souris / tactile
    const vp = root.querySelector('#fb-wm-viewport');
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let origTx = 0;
    let origTy = 0;

    if (vp) {
      vp.addEventListener('pointerdown', (e) => {
        if (e.target.closest('button')) return;
        dragging = true;
        vp.classList.add('is-dragging');
        startX = e.clientX;
        startY = e.clientY;
        origTx = fallbackMapState.tx;
        origTy = fallbackMapState.ty;
      });
      window.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        fallbackMapState.tx = origTx + (e.clientX - startX);
        fallbackMapState.ty = origTy + (e.clientY - startY);
        applyFallbackCameraTransform();
      });
      window.addEventListener('pointerup', () => {
        dragging = false;
        vp.classList.remove('is-dragging');
      });
      vp.addEventListener(
        'wheel',
        (e) => {
          e.preventDefault();
          cameraZoom(e.deltaY < 0 ? 0.1 : -0.1);
        },
        { passive: false }
      );
    }

    root.querySelectorAll('[data-fb-day]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const d = Number(btn.getAttribute('data-fb-day'));
        const same = AppState.selectedDay === d;
        walkHeroToDay(d);
        if (same) handlePlayDay(d);
      });
    });

    root.querySelectorAll('[data-fb-egg]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-fb-egg');
        const egg = getAllEasterEggs().find((e) => e.id === id);
        if (egg) {
          btn.classList.add('is-found');
          handleEasterEggFound(egg);
        }
      });
    });

    updateFallbackMapNodes();
    updateFallbackHeroPosition(AppState.selectedDay);
    centerFallbackOnDay(AppState.selectedDay);
  }

  function updateFallbackMapNodes() {
    document.querySelectorAll('[data-fb-day]').forEach((btn) => {
      const d = Number(btn.getAttribute('data-fb-day'));
      btn.classList.toggle('is-completed', isDayCompleted(d));
      btn.classList.toggle('is-locked', !isDayUnlocked(d));
      btn.classList.toggle('is-selected', AppState.selectedDay === d);
    });
  }

  function updateFallbackHeroPosition(dayNum) {
    const [x, y] = FALLBACK_COORDS[dayNum - 1] || FALLBACK_COORDS[0];
    const hero = document.getElementById('fb-hero-sprite');
    const frog = document.getElementById('fb-kingsley-sprite');
    if (hero) {
      hero.classList.add('is-walking');
      hero.style.left = `${x}px`;
      hero.style.top = `${y - 16}px`;
      setTimeout(() => hero.classList.remove('is-walking'), 520);
    }
    if (frog) {
      frog.style.left = `${x - 42}px`;
      frog.style.top = `${y + 6}px`;
    }
    updateFallbackMapNodes();
    centerFallbackOnDay(dayNum);
  }

  function centerFallbackOnDay(dayNum) {
    const [x, y] = FALLBACK_COORDS[dayNum - 1] || FALLBACK_COORDS[0];
    const s = fallbackMapState.scale;
    fallbackMapState.tx = window.innerWidth / 2 - x * s;
    fallbackMapState.ty = window.innerHeight / 2 - y * s;
    applyFallbackCameraTransform();
  }

  function applyFallbackCameraTransform() {
    const world = document.getElementById('fb-wm-world');
    if (world) {
      world.style.transform = `translate3d(${fallbackMapState.tx}px, ${fallbackMapState.ty}px, 0) scale(${fallbackMapState.scale})`;
    }
  }

  // ==========================================================================
  // 2. RENDU DU HUD FLOTTANT & DE LA BARRE DE NIVEAU SÉLECTIONNÉ
  // ==========================================================================
  function renderHUD() {
    const completedCount = AppState.completedDays.length;
    const totalEggs = getAllEasterEggs().length;
    const foundCount = AppState.foundSecrets.length;
    const pct = Math.min(100, Math.round((completedCount / 24) * 100));

    const runesCountEl = document.getElementById('hud-runes-count');
    const secretsCountEl = document.getElementById('hud-secrets-count');
    const runesBarFill = document.getElementById('hud-runes-bar-fill');
    const lootBadge = document.getElementById('hud-loot-badge');
    const secretsBadge = document.getElementById('hud-secrets-badge');

    if (runesCountEl) runesCountEl.textContent = `${completedCount}/24`;
    if (secretsCountEl) secretsCountEl.textContent = `${foundCount}/${totalEggs}`;
    if (runesBarFill) runesBarFill.style.width = `${pct}%`;
    if (lootBadge) lootBadge.textContent = String(completedCount);
    if (secretsBadge) secretsBadge.textContent = String(foundCount);

    // Badge discret de la Maison d'Aldryn (visible dès que Jour 4 complété ou débloqué)
    const aldrynBadge = document.getElementById('hud-aldryn-badge');
    const aldrynIcon = document.getElementById('hud-aldryn-icon');
    const aldrynName = document.getElementById('hud-aldryn-name');
    if (aldrynBadge) {
      const showAldryn = AppState.aldrynUnlocked || isDayCompleted(4);
      aldrynBadge.style.display = showAldryn ? 'inline-flex' : 'none';
      if (aldrynIcon) aldrynIcon.textContent = AppState.aldrynHouse.icon || '🌙';
      if (aldrynName) aldrynName.textContent = AppState.aldrynHouse.name;
    }

    // Bouton Mode Temporel
    const tempBtn = document.getElementById('hud-btn-temporal');
    const tempIcon = document.getElementById('hud-temporal-icon');
    if (tempBtn && tempIcon) {
      if (AppState.freeExploreMode) {
        tempBtn.classList.remove('is-strict-mode');
        tempIcon.textContent = '🔓';
        tempBtn.setAttribute('data-tooltip', 'Mode Libre (24/24) • Cliquer pour Décembre Réel');
      } else {
        tempBtn.classList.add('is-strict-mode');
        tempIcon.textContent = '📅';
        tempBtn.setAttribute('data-tooltip', `Décembre Réel (Jours 1–${getCurrentDecemberDay()}) • Cliquer pour Mode Libre`);
      }
    }

    // Bouton Audio
    updateAudioButtonUI();

    // Barre de niveau sélectionné en bas-centre
    renderStageSelectorBar();
  }

  function updateAudioButtonUI() {
    const btn = document.getElementById('hud-btn-audio');
    const icon = document.getElementById('hud-audio-icon');
    const muted = window.AudioFX && typeof window.AudioFX.isMuted === 'function' ? window.AudioFX.isMuted() : false;
    if (icon) icon.textContent = muted ? '🔇' : '🔊';
    if (btn) btn.setAttribute('data-tooltip', muted ? 'Son coupé (activer)' : 'Son activé (couper)');
  }

  function renderStageSelectorBar() {
    const dayObj = getDayByNumber(AppState.selectedDay);
    const unlocked = isDayUnlocked(dayObj.day);
    const completed = isDayCompleted(dayObj.day);

    const bar = document.getElementById('stage-selector-bar');
    const dayPill = document.getElementById('stage-day-badge');
    const bookPill = document.getElementById('stage-book-badge');
    const statusPill = document.getElementById('stage-status-badge');
    const titleEl = document.getElementById('stage-bar-title');
    const playBtn = document.getElementById('stage-play-btn');
    const playIcon = document.getElementById('stage-play-icon');
    const playLabel = document.getElementById('stage-play-label');
    const prevBtn = document.getElementById('stage-prev-btn');
    const nextBtn = document.getElementById('stage-next-btn');

    if (bar) {
      bar.classList.toggle('is-boss', dayObj.isBoss && !dayObj.isFinale);
      bar.classList.toggle('is-legendary', dayObj.isFinale);
    }

    if (dayPill) {
      if (dayObj.isFinale) dayPill.textContent = '👑 FINAL • JOUR 24';
      else if (dayObj.isBoss) dayPill.textContent = `⚔️ BOSS • JOUR ${dayObj.day}`;
      else dayPill.textContent = `JOUR ${dayObj.day}`;
    }

    if (bookPill) {
      const mainBook = dayObj.books[0] || 'Grimoire de Lau';
      bookPill.textContent = `📖 ${mainBook}`;
    }

    if (statusPill) {
      statusPill.className = 'stage-status-pill';
      if (completed) {
        statusPill.classList.add('status-done');
        statusPill.textContent = '✓ Complété';
      } else if (unlocked) {
        statusPill.classList.add('status-new');
        statusPill.textContent = '✦ Nouveau';
      } else {
        statusPill.classList.add('status-locked');
        statusPill.textContent = `🔒 ${dayObj.day} Déc.`;
      }
    }

    if (titleEl) {
      titleEl.textContent = dayObj.title;
    }

    if (playBtn && playIcon && playLabel) {
      playBtn.classList.remove('is-replay', 'is-locked');
      if (!unlocked) {
        playBtn.classList.add('is-locked');
        playIcon.textContent = '🔒';
        playLabel.textContent = 'SCELLÉ';
      } else if (completed) {
        playBtn.classList.add('is-replay');
        playIcon.textContent = '📖';
        playLabel.textContent = 'REJOUER';
      } else {
        playIcon.textContent = '▶';
        playLabel.textContent = 'JOUER';
      }
    }

    if (prevBtn) prevBtn.disabled = dayObj.day <= 1;
    if (nextBtn) nextBtn.disabled = dayObj.day >= 24;
  }

  // ==========================================================================
  // 3. GESTION DES EASTER EGGS (12 SECRETS SUR LA CARTE)
  // ==========================================================================
  function handleEasterEggFound(eggOrId, fromWorldMap = false) {
    const allEggs = getAllEasterEggs();
    const eggId = typeof eggOrId === 'string' ? eggOrId : eggOrId && eggOrId.id;
    const eggObj =
      allEggs.find((e) => e.id === eggId) ||
      (typeof eggOrId === 'object' && eggOrId ? eggOrId : null);

    if (!eggObj) return;

    const isNew = !AppState.foundSecrets.includes(eggObj.id);
    if (isNew) {
      AppState.foundSecrets.push(eggObj.id);
      saveFoundSecrets();
      if (!fromWorldMap) {
        if (window.AudioFX) window.AudioFX.playRuneChime();
        if (window.ParticleFX) {
          window.ParticleFX.burst(window.innerWidth / 2, window.innerHeight * 0.35, 'common');
        }
      }
      showRoyalToast(
        eggObj.icon || '✨',
        `Secret découvert (${AppState.foundSecrets.length}/${allEggs.length}) : ${eggObj.title} !`
      );
      renderHUD();
      if (!fromWorldMap) syncWorldMapState();
    } else if (!fromWorldMap) {
      if (window.AudioFX) window.AudioFX.playClick();
      showRoyalToast(eggObj.icon || '✨', `${eggObj.title} — ${eggObj.text}`);
    }

    if (document.getElementById('drawer-modal-backdrop')?.classList.contains('open')) {
      renderSecretsJournal();
    }
  }

  // ==========================================================================
  // 4. MODALE DE CHAPITRE (VISUAL NOVEL + MINI-JEU + SCEAU DE CIRE & COFFRE)
  // ==========================================================================
  function handlePlayDay(dayNum) {
    const num = Number(dayNum || AppState.selectedDay);
    if (!isDayUnlocked(num)) {
      if (window.AudioFX) window.AudioFX.playError();
      showRoyalToast(
        '🔒',
        `Le Jour ${num} est scellé jusqu'au ${num} Décembre ! (Clique sur 🔓 en haut à droite pour activer le Mode Libre)`
      );
      return;
    }

    if (window.AudioFX) window.AudioFX.playCardFlip();
    openChapterModal(num);
  }

  function openChapterModal(dayNum) {
    const dayObj = getDayByNumber(dayNum);
    AppState.activeDayNumber = dayObj.day;
    AppState.selectedDay = dayObj.day;
    AppState.vnLineIndex = 0;
    AppState.vnShowAll = false;
    AppState.waxClicksCount = 0;
    AppState.waxBrokenInSession = isDayCompleted(dayObj.day);

    const backdrop = document.getElementById('chapter-modal-backdrop');
    const container = document.getElementById('chapter-modal-container');
    const bossBanner = document.getElementById('modal-boss-banner');
    const headerBg = document.getElementById('modal-header-bg');
    const eyebrow = document.getElementById('modal-chapter-eyebrow');
    const title = document.getElementById('modal-chapter-title');
    const booksRow = document.getElementById('modal-chapter-books');
    const rarityPill = document.getElementById('modal-rarity-pill');

    const worldCfg = WORLDS_CONFIG.find((w) => w.week === dayObj.week) || WORLDS_CONFIG[0];
    if (headerBg) headerBg.style.backgroundImage = `url('${worldCfg.banner}')`;
    if (eyebrow) eyebrow.textContent = `JOUR ${dayObj.day} (${dayObj.roman}) • ${dayObj.arcanaName.toUpperCase()}`;
    if (title) title.textContent = dayObj.title;
    if (booksRow) {
      booksRow.innerHTML = dayObj.books
        .map((b) => `<span class="book-chip">📖 ${escapeHtml(b)}</span>`)
        .join('');
    }

    if (dayObj.isBoss || dayObj.isFinale) {
      container.classList.add('is-boss-modal');
      if (bossBanner) {
        bossBanner.style.display = 'block';
        bossBanner.textContent = dayObj.isFinale
          ? '👑 APOTHÉOSE DU 24 DÉCEMBRE — LE SANCTUAIRE DU VILAIN 👑'
          : '⚔️ ALERTE BOSS — COFFRE ÉPIQUE & GROS CADEAU IRL EN JEU ⚔️';
      }
      if (rarityPill) {
        rarityPill.className = `rarity-pill ${dayObj.isFinale ? 'rarity-legendaire' : 'rarity-epique'}`;
        rarityPill.textContent = dayObj.isFinale ? '☀️ GRAND FINAL' : '⚔️ BOSS ÉPIQUE';
      }
    } else {
      container.classList.remove('is-boss-modal');
      if (bossBanner) bossBanner.style.display = 'none';
      if (rarityPill) {
        rarityPill.className = 'rarity-pill rarity-commun';
        rarityPill.textContent = '✦ ARCANE';
      }
    }

    // Réinitialise le bouton "Tout lire"
    const showAllBtn = document.getElementById('vn-show-all-btn');
    if (showAllBtn) showAllBtn.textContent = '📜 Tout lire';

    closeDrawerModal();
    backdrop.classList.add('open', 'active');

    if (dayObj.isBoss || dayObj.isFinale) {
      container.classList.remove('boss-shake');
      void container.offsetWidth;
      container.classList.add('boss-shake');
      if (window.AudioFX) window.AudioFX.playBossHit();
    }

    switchModalStage('story');
    renderVisualNovelScene(dayObj);
  }

  function closeChapterModal() {
    const backdrop = document.getElementById('chapter-modal-backdrop');
    if (backdrop) backdrop.classList.remove('open', 'active');
    AppState.activeDayNumber = null;
  }

  function switchModalStage(stageName) {
    AppState.activeStage = stageName;
    const dayObj = getDayByNumber(AppState.activeDayNumber || AppState.selectedDay);

    document.querySelectorAll('.stage-tab-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-stage') === stageName);
    });

    const storyEl = document.getElementById('modal-stage-story');
    const gameEl = document.getElementById('modal-stage-game');
    const lootEl = document.getElementById('modal-stage-loot');

    if (storyEl) storyEl.style.display = stageName === 'story' ? 'flex' : 'none';
    if (gameEl) gameEl.style.display = stageName === 'game' ? 'block' : 'none';
    if (lootEl) lootEl.style.display = stageName === 'loot' ? 'block' : 'none';

    if (stageName === 'game') mountDayMiniGame(dayObj);
    if (stageName === 'loot') renderLootCeremonyStage(dayObj);
  }

  function renderVisualNovelScene(dayObj) {
    const lines = dayObj.dialogues || [];
    const idx = Math.max(0, Math.min(AppState.vnLineIndex, lines.length - 1));
    const current = lines[idx] || { speaker: '👑 Le Vilain', role: 'villain', text: 'Bienvenue dans ce chapitre.' };

    const slotLaura = document.getElementById('vn-slot-laura');
    const slotKingsley = document.getElementById('vn-slot-kingsley');
    const slotVillain = document.getElementById('vn-slot-villain');
    if (slotLaura) slotLaura.classList.toggle('speaking', current.role === 'laura');
    if (slotKingsley) slotKingsley.classList.toggle('speaking', current.role === 'kingsley');
    if (slotVillain) slotVillain.classList.toggle('speaking', current.role === 'villain');

    const speakerBadge = document.getElementById('vn-speaker-badge');
    const lineCounter = document.getElementById('vn-line-counter');
    const copyEl = document.getElementById('vn-dialogue-text');
    const transcriptEl = document.getElementById('vn-transcript-all');
    const prevBtn = document.getElementById('vn-prev-btn');
    const nextBtn = document.getElementById('vn-next-btn');

    if (speakerBadge) speakerBadge.textContent = current.speaker;
    if (lineCounter) lineCounter.textContent = `${idx + 1} / ${lines.length}`;
    if (copyEl) copyEl.textContent = `« ${current.text} »`;
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.textContent = idx < lines.length - 1 ? 'Suivant →' : 'Lancer l’Épreuve ⚔️';

    if (transcriptEl) {
      if (AppState.vnShowAll) {
        transcriptEl.style.display = 'flex';
        transcriptEl.innerHTML = lines
          .map(
            (l) => `
              <div class="vn-transcript-line">
                <strong style="color:var(--gold-main); font-family:var(--font-title);">${escapeHtml(l.speaker)} :</strong>
                <span> « ${escapeHtml(l.text)} »</span>
              </div>
            `
          )
          .join('');
      } else {
        transcriptEl.style.display = 'none';
      }
    }
  }

  function mountDayMiniGame(dayObj) {
    const mountRoot = document.getElementById('minigame-mount-root');
    if (!mountRoot) return;
    mountRoot.innerHTML = '';

    const onVictory = (extra) => handleDayChallengeVictory(dayObj, extra);

    if (window.MiniGamesEngine && typeof window.MiniGamesEngine.renderGame === 'function') {
      try {
        window.MiniGamesEngine.renderGame(mountRoot, dayObj.rawOriginal || dayObj, {
          onVictory,
          onWin: onVictory,
          onComplete: onVictory,
          hasLunarPower: AppState.aldrynUnlocked || isDayCompleted(4) || AppState.freeExploreMode,
          isLunarHintUsed: false,
          onUseLunarHint: () => {
            showRoyalToast('🌙', `Sort de Lune d'Aldryn (${AppState.aldrynHouse.name}) invoqué !`);
          }
        });
        return;
      } catch (err) {
        console.warn('MiniGamesEngine fallback:', err);
      }
    }

    mountRoot.innerHTML = `
      <div class="glass-card" style="text-align:center; padding:1.75rem;">
        <div class="card-kicker">✦ ÉPREUVE DU JOUR ${dayObj.day} ✦</div>
        <h3 class="drawer-title" style="margin:0.35rem 0;">${escapeHtml(dayObj.title)}</h3>
        <p class="drawer-desc" style="margin:0 auto 1.25rem;">
          Valide ce chapitre (${escapeHtml(dayObj.books.join(', '))}) pour révéler le Coffre scellé à la cire rouge !
        </p>
        <div>
          <button id="fallback-win-btn" class="btn-gold" type="button">⚔️ Invoquer la Rune &amp; Ouvrir le Coffre</button>
        </div>
      </div>
    `;
    const btn = mountRoot.querySelector('#fallback-win-btn');
    if (btn) btn.addEventListener('click', () => onVictory());
  }

  function handleDayChallengeVictory(dayObj, bonusPayload) {
    if (bonusPayload) {
      if (typeof bonusPayload.aldrynHouse === 'string') {
        const houses = window.ALDRYN_HOUSES || {};
        const matched = Object.values(houses).find(
          (h) => h.name.toLowerCase().includes(bonusPayload.aldrynHouse.toLowerCase()) || h.id === bonusPayload.aldrynHouse
        );
        AppState.aldrynUnlocked = true;
        AppState.aldrynHouse = matched
          ? { name: matched.name, icon: matched.totemIcon || '🌙', power: `${matched.totemName} • ${matched.spellName}` }
          : { name: `Maison de la ${bonusPayload.aldrynHouse}`, icon: '🌙', power: `Totem : ${bonusPayload.aldrynTotem || 'Cerf Astral'}` };
      } else if (bonusPayload.aldrynHouse && bonusPayload.aldrynHouse.name) {
        AppState.aldrynUnlocked = true;
        AppState.aldrynHouse = bonusPayload.aldrynHouse;
      }
    }

    if (dayObj.day === 4) {
      AppState.aldrynUnlocked = true;
    }

    if (!isDayCompleted(dayObj.day)) {
      AppState.completedDays.push(dayObj.day);
      AppState.completedDays.sort((a, b) => a - b);
    }

    savePersistedState();
    renderHUD();
    syncWorldMapState();

    if (window.AudioFX) window.AudioFX.playRuneChime();
    AppState.waxClicksCount = 0;
    AppState.waxBrokenInSession = false;
    switchModalStage('loot');
  }

  // --- SCEAU DE CIRE ROUGE (3 CLICS) & COFFRE IRL ---
  function renderLootCeremonyStage(dayObj) {
    const root = document.getElementById('loot-ceremony-root');
    if (!root) return;

    const alreadyDone = isDayCompleted(dayObj.day);

    if (!AppState.waxBrokenInSession) {
      root.innerHTML = `
        <div class="chest-seal-arena" id="chest-seal-arena">
          <div class="chapter-eyebrow">✦ COFFRE SCELLÉ • JOUR ${dayObj.day} ✦</div>
          <h3 class="drawer-title">
            ${
              dayObj.isFinale
                ? 'Le Coffre Solaire Légendaire du Sanctuaire'
                : dayObj.isBoss
                ? 'Le Coffre Cramoisi &amp; Rubis de Boss'
                : 'Le Coffre de Bois &amp; Laiton du Manoir'
            }
          </h3>
          <p class="drawer-desc">
            Clique <strong>3 fois sur le Sceau de Cire Rouge</strong> pour briser le cachet et révéler où se cache ta surprise IRL !
          </p>

          <div class="chest-svg-wrap">${getChestSVG(dayObj.rarityKey)}</div>

          <button id="wax-seal-trigger-btn" class="wax-seal-button" type="button" aria-label="Frapper le sceau de cire rouge">
            <svg class="wax-crack-svg wax-crack-1" viewBox="0 0 140 140" fill="none">
              <path d="M70 8 L62 42 L75 68 L54 98 L65 130" stroke="#fef3c7" stroke-width="3" stroke-linecap="round"/>
              <path d="M62 42 L35 55" stroke="#f6d365" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg class="wax-crack-svg wax-crack-2" viewBox="0 0 140 140" fill="none">
              <path d="M18 45 L58 64 L85 52 L124 78" stroke="#fef3c7" stroke-width="3.2" stroke-linecap="round"/>
              <path d="M75 68 L108 108" stroke="#f6d365" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
            <span class="wax-seal-emblem">🐸👑</span>
            <span class="wax-seal-motto" id="wax-seal-motto-text">FRAPPER (0/3)</span>
          </button>

          <div class="wax-pips-row">
            <span class="wax-pip" id="wax-pip-1"></span>
            <span class="wax-pip" id="wax-pip-2"></span>
            <span class="wax-pip" id="wax-pip-3"></span>
          </div>

          ${
            alreadyDone
              ? `<button id="skip-wax-btn" class="btn-glass" type="button">✨ Ouvrir directement</button>`
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
        sealBtn.addEventListener('click', () => {
          AppState.waxClicksCount += 1;
          const count = AppState.waxClicksCount;

          if (window.AudioFX) window.AudioFX.playWaxCrack();
          if (arenaEl) {
            arenaEl.classList.remove('boss-shake');
            void arenaEl.offsetWidth;
            arenaEl.classList.add('boss-shake');
          }

          const motto = root.querySelector('#wax-seal-motto-text');
          const pip = root.querySelector(`#wax-pip-${count}`);
          if (pip) pip.classList.add('broken');

          if (count === 1) {
            sealBtn.classList.add('cracked-1');
            if (motto) motto.textContent = 'FISSURÉ (1/3)';
          } else if (count === 2) {
            sealBtn.classList.add('cracked-2');
            if (motto) motto.textContent = 'ENCORE 1 ! (2/3)';
          } else if (count >= 3) {
            const rect = sealBtn.getBoundingClientRect();
            const burstRarity = dayObj.rarityKey === 'legendaire' ? 'legendary' : dayObj.rarityKey === 'epique' ? 'epic' : 'common';
            if (window.ParticleFX) window.ParticleFX.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, burstRarity);
            if (window.AudioFX) window.AudioFX.playChestOpen(burstRarity);

            if (!isDayCompleted(dayObj.day)) {
              AppState.completedDays.push(dayObj.day);
              AppState.completedDays.sort((a, b) => a - b);
              if (dayObj.day === 4) AppState.aldrynUnlocked = true;
              savePersistedState();
              renderHUD();
              syncWorldMapState();
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

    const claimed = AppState.claimedLoots.includes(dayObj.day);
    const totalRunes = AppState.completedDays.length;

    const rarityBadge = dayObj.isFinale
      ? `<span class="rarity-pill rarity-legendaire">☀️ TRÉSOR LÉGENDAIRE DU 24 DÉCEMBRE</span>`
      : dayObj.isBoss
      ? `<span class="rarity-pill rarity-epique">⚔️ BUTIN DE BOSS • ${escapeHtml(dayObj.loot.category)}</span>`
      : `<span class="rarity-pill rarity-commun">✦ ${escapeHtml(dayObj.loot.category)}</span>`;

    const finaleHTML = dayObj.isFinale
      ? `
        <div class="finale-showcase">
          <div class="chapter-eyebrow">✦ PORTRAIT DU VILAIN &amp; DE SON ASSISTANTE ✦</div>
          <div class="finale-couple-frame">
            <img src="assets/couple_finale.png" alt="Laure &amp; Son Vilain" onerror="this.style.display='none'" />
          </div>
          <div class="chapter-eyebrow">💌 LA GRANDE LETTRE D'AMOUR DU VILAIN 💌</div>
          <div class="love-letter-box">${escapeHtml(AppState.finaleLoveLetter)}</div>
        </div>
      `
      : '';

    root.innerHTML = `
      <div class="loot-revealed-card">
        <div class="loot-rune-pill">🗝️ Rune ${dayObj.day} acquise (${totalRunes} / 24)</div>
        <div>${rarityBadge}</div>
        <h3 class="loot-title-display">${escapeHtml(dayObj.loot.title)}</h3>
        <p class="loot-rp-desc">« ${escapeHtml(dayObj.loot.description)} »</p>

        <div class="irl-callout">
          <div class="irl-callout-label">🧭 Cachette IRL / Bon Digital</div>
          <div class="irl-callout-text">${escapeHtml(dayObj.loot.irlLocation)}</div>
        </div>

        ${finaleHTML}

        <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:0.65rem; margin-top:1.25rem;">
          <button id="modal-claim-loot-btn" class="${claimed ? 'btn-glass' : 'btn-gold'}" type="button">
            ${claimed ? '✓ Déjà réclamé' : '🎁 Marquer comme réclamé'}
          </button>
          <button id="modal-replay-wax-btn" class="btn-glass" type="button">🕯️ Rejouer le Sceau</button>
          <button id="modal-back-map-btn" class="btn-glass" type="button">🗺️ Retour à la Carte</button>
        </div>
      </div>
    `;

    root.querySelector('#modal-claim-loot-btn')?.addEventListener('click', () => {
      toggleLootClaimed(dayObj.day);
      revealLootCardIRL(dayObj);
    });
    root.querySelector('#modal-replay-wax-btn')?.addEventListener('click', () => {
      AppState.waxClicksCount = 0;
      AppState.waxBrokenInSession = false;
      renderLootCeremonyStage(dayObj);
    });
    root.querySelector('#modal-back-map-btn')?.addEventListener('click', closeChapterModal);
  }

  function getChestSVG(rarityKey) {
    if (rarityKey === 'legendaire') {
      return `
        <svg viewBox="0 0 240 175" width="205" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs><linearGradient id="gSol" x1="0" y1="0" x2="240" y2="175" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#fef3c7"/><stop offset="50%" stop-color="#f6d365"/><stop offset="100%" stop-color="#b45309"/></linearGradient></defs>
          <rect x="24" y="60" width="192" height="94" rx="12" fill="#131c42" stroke="url(#gSol)" stroke-width="4.5"/>
          <path d="M20 64 C20 26, 220 26, 220 64 Z" fill="#1e2b5c" stroke="url(#gSol)" stroke-width="4.5"/>
          <rect x="24" y="94" width="192" height="12" fill="url(#gSol)" opacity="0.85"/>
          <circle cx="120" cy="64" r="22" fill="#fef3c7" stroke="#e11d48" stroke-width="3.5"/>
        </svg>`;
    }
    if (rarityKey === 'epique') {
      return `
        <svg viewBox="0 0 240 175" width="200" height="145" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="28" y="62" width="184" height="90" rx="10" fill="#4c0519" stroke="#f6d365" stroke-width="4"/>
          <path d="M24 64 C24 30, 216 30, 216 64 Z" fill="#881337" stroke="#f6d365" stroke-width="4"/>
          <rect x="64" y="40" width="12" height="112" fill="#f6d365"/>
          <rect x="164" y="40" width="12" height="112" fill="#f6d365"/>
          <polygon points="120,44 134,64 120,84 106,64" fill="#fb7185" stroke="#fef3c7" stroke-width="2"/>
        </svg>`;
    }
    return `
      <svg viewBox="0 0 240 175" width="195" height="142" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="64" width="180" height="86" rx="9" fill="#2e1f16" stroke="#d4af37" stroke-width="3.5"/>
        <path d="M28 66 C28 34, 212 34, 212 66 Z" fill="#422c1f" stroke="#d4af37" stroke-width="3.5"/>
        <rect x="68" y="44" width="11" height="106" fill="#d4af37"/>
        <rect x="161" y="44" width="11" height="106" fill="#d4af37"/>
        <rect x="30" y="95" width="180" height="9" fill="#d4af37" opacity="0.78"/>
      </svg>`;
  }

  // ==========================================================================
  // 5. MODALE TIROIR UNIFIÉE (BUTIN / CODEX / SECRETS / ATELIER MJ)
  // ==========================================================================
  function openDrawerModal(tabName = 'loot') {
    closeChapterModal();
    const backdrop = document.getElementById('drawer-modal-backdrop');
    if (backdrop) backdrop.classList.add('open', 'active');
    switchDrawerTab(tabName);
  }

  function closeDrawerModal() {
    const backdrop = document.getElementById('drawer-modal-backdrop');
    if (backdrop) backdrop.classList.remove('open', 'active');
  }

  function switchDrawerTab(tabName) {
    AppState.activeDrawerTab = tabName;
    document.querySelectorAll('.drawer-tab-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-drawer-tab') === tabName);
    });
    document.querySelectorAll('.drawer-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.id === `drawer-panel-${tabName}`);
    });

    if (tabName === 'loot') renderLootInventory();
    if (tabName === 'codex') renderCodexLibrary();
    if (tabName === 'secrets') renderSecretsJournal();
    if (tabName === 'gm') renderGameMasterPanel();
  }

  function toggleLootClaimed(dayNum) {
    const num = Number(dayNum);
    const idx = AppState.claimedLoots.indexOf(num);
    if (idx === -1) {
      AppState.claimedLoots.push(num);
      if (window.AudioFX) window.AudioFX.playRuneChime();
      showRoyalToast('🎁', `Surprise du Jour ${num} marquée comme réclamée !`);
    } else {
      AppState.claimedLoots.splice(idx, 1);
      showRoyalToast('↩️', `Surprise du Jour ${num} remise en attente.`);
    }
    savePersistedState();
    renderLootInventory();
  }

  // --- ONGLET BUTIN ---
  function renderLootInventory() {
    const container = document.getElementById('loot-inventory-container');
    if (!container) return;

    const allDays = getAllNormalizedDays();
    const list = AppState.showAllLootPreview ? allDays : allDays.filter((d) => isDayCompleted(d.day));

    if (list.length === 0) {
      container.innerHTML = `
        <div class="glass-card" style="grid-column:1 / -1; text-align:center; padding:2rem;">
          <div style="font-size:2.2rem;">🕯️</div>
          <h3 class="drawer-title" style="margin:0.35rem 0;">Aucun coffre ouvert pour l’instant</h3>
          <p class="drawer-desc" style="margin:0 auto 1.1rem;">
            Explore la carte du monde et termine un chapitre pour révéler tes cadeaux IRL et tes bons digitaux !
          </p>
          <div>
            <button id="empty-loot-preview-btn" class="btn-gold" type="button">👁️ Prévisualiser les 24 trésors</button>
          </div>
        </div>
      `;
      container.querySelector('#empty-loot-preview-btn')?.addEventListener('click', () => {
        AppState.showAllLootPreview = true;
        updateLootPreviewBtnLabel();
        renderLootInventory();
      });
      return;
    }

    container.innerHTML = list
      .map((d) => {
        const claimed = AppState.claimedLoots.includes(d.day);
        const done = isDayCompleted(d.day);
        return `
          <article class="glass-card ${claimed ? 'is-claimed' : ''}">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem;">
                <span class="card-kicker">Jour ${d.day} (${escapeHtml(d.roman)})</span>
                <span class="rarity-pill ${d.rarityKey === 'legendaire' ? 'rarity-legendaire' : d.rarityKey === 'epique' ? 'rarity-epique' : 'rarity-commun'}">
                  ${escapeHtml(d.loot.category)}
                </span>
              </div>
              <h3 class="card-title">${escapeHtml(d.loot.title)}</h3>
              <p class="card-quote">« ${escapeHtml(d.loot.description)} »</p>
              <div class="card-irl-box" style="margin-top:0.65rem;">
                <strong style="color:var(--gold-main);">🧭 Cachette / Bon :</strong> ${escapeHtml(d.loot.irlLocation)}
              </div>
            </div>
            <div class="card-footer-row">
              <span class="card-sub" style="color:${done ? 'var(--emerald-bright)' : 'var(--gold-main)'};">
                ${done ? '✓ Débloqué' : '👁️ Aperçu'}
              </span>
              <button class="${claimed ? 'btn-glass' : 'btn-gold'} loot-claim-btn" data-day="${d.day}" type="button" style="padding:0.4rem 0.78rem; font-size:0.74rem;">
                ${claimed ? '✓ Réclamé' : '🎁 Réclamer'}
              </button>
            </div>
          </article>
        `;
      })
      .join('');

    container.querySelectorAll('.loot-claim-btn').forEach((btn) => {
      btn.addEventListener('click', () => toggleLootClaimed(btn.getAttribute('data-day')));
    });
  }

  function updateLootPreviewBtnLabel() {
    const btn = document.getElementById('loot-unlock-preview-btn');
    if (btn) {
      btn.textContent = AppState.showAllLootPreview
        ? '🔒 Mes trésors gagnés uniquement'
        : '👁️ Aperçu des 24 trésors';
    }
  }

  // --- ONGLET CODEX (35 LIVRES DE LAU) ---
  function getCodexEntries() {
    if (Array.isArray(window.MULTIVERSE_LIBRARY_CATALOG) && window.MULTIVERSE_LIBRARY_CATALOG.length > 0) {
      return window.MULTIVERSE_LIBRARY_CATALOG.map((b) => {
        const t = String(b.tier || '').toLowerCase();
        const n = String(b.note || '').toLowerCase();
        let category = 'fav';
        if (t.includes('surcoté') || t.includes('dnf') || t.includes('débat') || t.includes('vinted') || t.includes('standalone')) {
          category = 'roast';
        } else if (t.includes('mons') || t.includes('irlande') || t.includes('duo') || n.includes('mons') || n.includes('irlande') || n.includes('amoureux')) {
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
    return [];
  }

  function renderCodexLibrary() {
    const container = document.getElementById('codex-books-container');
    if (!container) return;

    const entries = getCodexEntries().filter(
      (e) => AppState.selectedCodexFilter === 'all' || e.category === AppState.selectedCodexFilter
    );

    container.innerHTML = entries
      .map(
        (item) => `
        <article class="glass-card">
          <div>
            <div class="card-kicker">${escapeHtml(item.verdict)}</div>
            <h3 class="card-title">${escapeHtml(item.title)}</h3>
            <div class="card-sub">${escapeHtml(item.author)} ${item.days ? `• ${escapeHtml(item.days)}` : ''}</div>
          </div>
          <p class="card-quote">« ${escapeHtml(item.quote)} »</p>
        </article>
      `
      )
      .join('');
  }

  // --- ONGLET SECRETS (12 EASTER EGGS DE LA CARTE) ---
  function renderSecretsJournal() {
    const container = document.getElementById('secrets-journal-container');
    const pill = document.getElementById('secrets-progress-pill');
    if (!container) return;

    const eggs = getAllEasterEggs();
    const foundCount = eggs.filter((e) => AppState.foundSecrets.includes(e.id)).length;
    if (pill) pill.textContent = `✨ ${foundCount} / ${eggs.length} Découverts`;

    container.innerHTML = eggs
      .map((egg) => {
        const found = AppState.foundSecrets.includes(egg.id);
        const regionRoman = ROMAN_NUMERALS[egg.region] || 'I';
        return `
          <article class="glass-card ${found ? 'secret-found' : 'secret-locked'}">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="card-kicker" style="color:${found ? 'var(--ether-cyan)' : 'var(--text-muted)'};">
                  Monde ${regionRoman} • ${found ? 'Découvert' : 'Secret Caché'}
                </span>
                <span style="font-size:1.3rem;">${found ? egg.icon : '❓'}</span>
              </div>
              <h3 class="card-title">${found ? escapeHtml(egg.title) : 'Lueur Mystérieuse sur la Carte'}</h3>
              <p class="card-quote" style="margin-top:0.35rem;">
                ${found ? `« ${escapeHtml(egg.text)} »` : `Indice : ${escapeHtml(egg.hint)}`}
              </p>
            </div>
            <div class="card-footer-row">
              <span class="card-sub">${found ? '✓ Ajouté au Journal' : 'Explore la carte pour le trouver'}</span>
              <button class="btn-glass secret-goto-btn" data-region="${egg.region}" type="button" style="padding:0.35rem 0.7rem; font-size:0.72rem;">
                🗺️ Aller au Monde ${regionRoman}
              </button>
            </div>
          </article>
        `;
      })
      .join('');

    container.querySelectorAll('.secret-goto-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const region = Number(btn.getAttribute('data-region'));
        closeDrawerModal();
        cameraJumpRegion(region);
      });
    });
  }

  // --- ONGLET ATELIER DU VILAIN (MAÎTRE DU JEU) ---
  function renderGameMasterPanel() {
    const grid = document.getElementById('gm-days-editor-grid');
    if (!grid) return;

    const pwdInput = document.getElementById('gm-couple-password');
    const letterInput = document.getElementById('gm-finale-love-letter');
    const houseSelect = document.getElementById('gm-aldryn-house-select');

    if (pwdInput) pwdInput.value = AppState.couplePassword || 'KINGSLEY';
    if (letterInput) letterInput.value = AppState.finaleLoveLetter || DEFAULT_LOVE_LETTER;
    if (houseSelect) {
      Array.from(houseSelect.options).forEach((opt) => {
        if (opt.value.startsWith(AppState.aldrynHouse.name)) houseSelect.value = opt.value;
      });
    }

    const categories = ['Cadeau caché chez nous', 'Bon digital', 'Gros Cadeau Boss'];
    grid.innerHTML = getAllNormalizedDays()
      .map(
        (d) => `
        <div class="gm-day-item ${d.isBoss ? 'is-boss' : ''}" data-gm-day="${d.day}">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="font-family:var(--font-title); font-size:0.86rem; color:var(--gold-light);">
              Jour ${d.day} — ${escapeHtml(d.title)}
            </strong>
            <span>${d.isFinale ? '👑' : d.isBoss ? '⚔️' : d.emblem}</span>
          </div>
          <div class="gm-field">
            <label class="gm-label">Nom du Cadeau / Butin</label>
            <input type="text" class="gm-input gm-field-title" value="${escapeHtml(d.loot.title)}" />
          </div>
          <div class="gm-field">
            <label class="gm-label">Catégorie</label>
            <select class="gm-select gm-field-category">
              ${categories
                .map((c) => `<option value="${escapeHtml(c)}" ${d.loot.category === c ? 'selected' : ''}>${escapeHtml(c)}</option>`)
                .join('')}
            </select>
          </div>
          <div class="gm-field">
            <label class="gm-label">Cachette IRL / Texte du Bon</label>
            <textarea class="gm-textarea gm-field-irl">${escapeHtml(d.loot.irlLocation)}</textarea>
          </div>
        </div>
      `
      )
      .join('');

    grid.querySelectorAll('.gm-field-title, .gm-field-category, .gm-field-irl').forEach((el) => {
      el.addEventListener('change', () => collectAndSaveGMFields(false));
    });
  }

  function collectAndSaveGMFields(notify = true) {
    const pwdInput = document.getElementById('gm-couple-password');
    const letterInput = document.getElementById('gm-finale-love-letter');
    const houseSelect = document.getElementById('gm-aldryn-house-select');

    if (pwdInput) AppState.couplePassword = pwdInput.value.trim() || 'KINGSLEY';
    if (letterInput) AppState.finaleLoveLetter = letterInput.value;
    if (houseSelect && houseSelect.value) {
      const parts = houseSelect.value.split('|');
      if (parts.length >= 3) {
        AppState.aldrynHouse = { name: parts[0], icon: parts[1], power: parts[2] };
      }
    }

    document.querySelectorAll('[data-gm-day]').forEach((card) => {
      const d = Number(card.getAttribute('data-gm-day'));
      gmOverrides[d] = {
        lootTitle: card.querySelector('.gm-field-title')?.value || '',
        lootCategory: card.querySelector('.gm-field-category')?.value || '',
        irlLocation: card.querySelector('.gm-field-irl')?.value || ''
      };
    });

    saveGMOverrides();
    savePersistedState();
    renderHUD();

    if (notify) {
      if (window.AudioFX) window.AudioFX.playRuneChime();
      showRoyalToast('💾', 'Les 24 cachettes IRL et la Lettre du 24 Décembre sont sauvegardées !');
    }
  }

  function exportGMJSON() {
    collectAndSaveGMFields(false);
    const payload = {
      exportedAt: new Date().toISOString(),
      app: "L'Assistante du Vilain & Le Multivers de @lau.libraryyy",
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
    showRoyalToast('📤', 'Configuration JSON exportée !');
  }

  function importGMJSON(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.gmOverrides && typeof data.gmOverrides === 'object') gmOverrides = data.gmOverrides;
        if (data.couplePassword) AppState.couplePassword = data.couplePassword;
        if (data.finaleLoveLetter) AppState.finaleLoveLetter = data.finaleLoveLetter;
        if (data.aldrynHouse) AppState.aldrynHouse = data.aldrynHouse;
        saveGMOverrides();
        savePersistedState();
        renderHUD();
        renderGameMasterPanel();
        showRoyalToast('📂', 'Configuration importée avec succès !');
      } catch (err) {
        showRoyalToast('⚠️', 'Fichier JSON invalide.');
      }
    };
    reader.readAsText(file);
  }

  // ==========================================================================
  // 6. ÉVÉNEMENTS GLOBAUX & ÉCRAN TITRE
  // ==========================================================================
  function startAdventure() {
    if (AppState.titleDismissed) return;
    AppState.titleDismissed = true;

    const overlay = document.getElementById('title-screen-overlay');
    if (overlay) {
      overlay.classList.add('is-hidden');
      overlay.classList.remove('active');
    }
    document.body.classList.remove('title-active');

    if (window.AudioFX) window.AudioFX.playRuneChime();
    if (window.ParticleFX) {
      window.ParticleFX.burst(window.innerWidth / 2, window.innerHeight / 2, 'common');
    }

    setTimeout(() => {
      cameraCenterHero();
    }, 180);
  }

  function bindGlobalEvents() {
    // Écran titre
    document.getElementById('btn-start-adventure')?.addEventListener('click', startAdventure);

    // HUD Haut-Gauche
    document.getElementById('hud-avatar-btn')?.addEventListener('click', cameraCenterHero);
    document.getElementById('hud-runes-btn')?.addEventListener('click', () => openDrawerModal('loot'));
    document.getElementById('hud-secrets-btn')?.addEventListener('click', () => openDrawerModal('secrets'));
    document.getElementById('hud-aldryn-badge')?.addEventListener('click', () => handlePlayDay(4));

    // HUD Haut-Droit (Dock Icônes)
    document.getElementById('hud-btn-loot')?.addEventListener('click', () => {
      if (window.AudioFX) window.AudioFX.playClick();
      openDrawerModal('loot');
    });
    document.getElementById('hud-btn-codex')?.addEventListener('click', () => {
      if (window.AudioFX) window.AudioFX.playClick();
      openDrawerModal('codex');
    });
    document.getElementById('hud-btn-secrets')?.addEventListener('click', () => {
      if (window.AudioFX) window.AudioFX.playClick();
      openDrawerModal('secrets');
    });
    document.getElementById('hud-btn-gm')?.addEventListener('click', () => {
      if (window.AudioFX) window.AudioFX.playClick();
      openDrawerModal('gm');
    });

    // Switch Mode Libre / Décembre Réel
    document.getElementById('hud-btn-temporal')?.addEventListener('click', () => {
      AppState.freeExploreMode = !AppState.freeExploreMode;
      savePersistedState();
      renderHUD();
      syncWorldMapState();
      if (window.AudioFX) window.AudioFX.playClick();
      showRoyalToast(
        AppState.freeExploreMode ? '🔓' : '📅',
        AppState.freeExploreMode
          ? 'Mode Libre activé : tous les 24 jours sont accessibles !'
          : `Mode Décembre Réel activé (Jours 1 à ${getCurrentDecemberDay()}).`
      );
    });

    // Switch Audio Mute/Unmute (icon-only, pas de texte injecté)
    document.getElementById('hud-btn-audio')?.addEventListener('click', () => {
      if (window.AudioFX && typeof window.AudioFX.toggleMute === 'function') {
        window.AudioFX.toggleMute();
      }
      updateAudioButtonUI();
    });

    // Contrôles Caméra (Droite)
    document.getElementById('cam-zoom-in')?.addEventListener('click', () => cameraZoom(0.18));
    document.getElementById('cam-zoom-out')?.addEventListener('click', () => cameraZoom(-0.18));
    document.getElementById('cam-center-hero')?.addEventListener('click', cameraCenterHero);
    document.querySelectorAll('.cam-region-btn').forEach((btn) => {
      btn.addEventListener('click', () => cameraJumpRegion(btn.getAttribute('data-cam-region')));
    });

    // Barre de Niveau Sélectionné (Bas-Centre)
    document.getElementById('stage-prev-btn')?.addEventListener('click', () => {
      if (AppState.selectedDay > 1) {
        if (window.AudioFX) window.AudioFX.playClick();
        walkHeroToDay(AppState.selectedDay - 1);
      }
    });
    document.getElementById('stage-next-btn')?.addEventListener('click', () => {
      if (AppState.selectedDay < 24) {
        if (window.AudioFX) window.AudioFX.playClick();
        walkHeroToDay(AppState.selectedDay + 1);
      }
    });
    document.getElementById('stage-play-btn')?.addEventListener('click', () => handlePlayDay(AppState.selectedDay));

    // Modale Chapitre
    document.getElementById('modal-close-btn')?.addEventListener('click', closeChapterModal);
    document.getElementById('chapter-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'chapter-modal-backdrop') closeChapterModal();
    });
    document.querySelectorAll('.stage-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (window.AudioFX) window.AudioFX.playClick();
        switchModalStage(btn.getAttribute('data-stage'));
      });
    });

    // Visual Novel controls
    document.getElementById('vn-prev-btn')?.addEventListener('click', () => {
      if (AppState.vnLineIndex > 0) {
        AppState.vnLineIndex -= 1;
        if (window.AudioFX) window.AudioFX.playClick();
        renderVisualNovelScene(getDayByNumber(AppState.activeDayNumber));
      }
    });
    document.getElementById('vn-next-btn')?.addEventListener('click', () => {
      const d = getDayByNumber(AppState.activeDayNumber);
      if (AppState.vnLineIndex < (d.dialogues || []).length - 1) {
        AppState.vnLineIndex += 1;
        if (window.AudioFX) window.AudioFX.playClick();
        renderVisualNovelScene(d);
      } else {
        switchModalStage('game');
      }
    });
    document.getElementById('vn-show-all-btn')?.addEventListener('click', (e) => {
      AppState.vnShowAll = !AppState.vnShowAll;
      e.currentTarget.textContent = AppState.vnShowAll ? '📜 Masquer' : '📜 Tout lire';
      renderVisualNovelScene(getDayByNumber(AppState.activeDayNumber));
    });
    document.getElementById('vn-start-challenge-btn')?.addEventListener('click', () => {
      if (window.AudioFX) window.AudioFX.playClick();
      switchModalStage('game');
    });

    // Modale Tiroir Unifiée
    document.getElementById('drawer-close-btn')?.addEventListener('click', closeDrawerModal);
    document.getElementById('drawer-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'drawer-modal-backdrop') closeDrawerModal();
    });
    document.querySelectorAll('.drawer-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (window.AudioFX) window.AudioFX.playClick();
        switchDrawerTab(btn.getAttribute('data-drawer-tab'));
      });
    });

    // Filtres Codex
    document.querySelectorAll('[data-codex-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-codex-filter]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        AppState.selectedCodexFilter = btn.getAttribute('data-codex-filter') || 'all';
        if (window.AudioFX) window.AudioFX.playClick();
        renderCodexLibrary();
      });
    });

    // Aperçu 24 trésors
    document.getElementById('loot-unlock-preview-btn')?.addEventListener('click', () => {
      AppState.showAllLootPreview = !AppState.showAllLootPreview;
      updateLootPreviewBtnLabel();
      renderLootInventory();
    });

    // Atelier du Vilain (MJ)
    document.getElementById('gm-save-all-btn')?.addEventListener('click', () => collectAndSaveGMFields(true));
    document.getElementById('gm-export-json-btn')?.addEventListener('click', exportGMJSON);
    document.getElementById('gm-import-json-input')?.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) importGMJSON(e.target.files[0]);
    });
    document.getElementById('gm-unlock-all-btn')?.addEventListener('click', () => {
      AppState.completedDays = Array.from({ length: 24 }, (_, i) => i + 1);
      AppState.aldrynUnlocked = true;
      savePersistedState();
      renderHUD();
      syncWorldMapState();
      if (window.ParticleFX) window.ParticleFX.burst(window.innerWidth / 2, window.innerHeight / 2, 'legendary');
      if (window.AudioFX) window.AudioFX.playChestOpen('legendary');
      showRoyalToast('✨', 'Les 24 chapitres sont débloqués et marqués complétés (24/24) !');
    });
    document.getElementById('gm-reset-progress-btn')?.addEventListener('click', () => {
      AppState.completedDays = [];
      AppState.claimedLoots = [];
      AppState.foundSecrets = [];
      AppState.aldrynUnlocked = false;
      savePersistedState();
      saveFoundSecrets();
      renderHUD();
      syncWorldMapState();
      showRoyalToast('🔄', 'Progression remise à 0/24 et 0/12 (vos cachettes personnalisées sont conservées) !');
    });

    // Raccourcis clavier (Escape ferme les modales ; navigation déléguée à WorldMapEngine si actif)
    window.addEventListener('keydown', (e) => {
      const inInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
      if (e.key === 'Escape') {
        closeChapterModal();
        closeDrawerModal();
        return;
      }
      if (!AppState.titleDismissed) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startAdventure();
        }
        return;
      }
      if (inInput || worldMapInstance) return;
      const modalOpen =
        document.getElementById('chapter-modal-backdrop')?.classList.contains('open') ||
        document.getElementById('drawer-modal-backdrop')?.classList.contains('open');
      if (modalOpen) return;

      if (e.key === 'ArrowLeft' && AppState.selectedDay > 1) {
        walkHeroToDay(AppState.selectedDay - 1);
      } else if (e.key === 'ArrowRight' && AppState.selectedDay < 24) {
        walkHeroToDay(AppState.selectedDay + 1);
      } else if (e.key === 'Enter') {
        handlePlayDay(AppState.selectedDay);
      }
    });
  }

  // ==========================================================================
  // TOAST & UTILITAIRES
  // ==========================================================================
  let toastTimer = null;
  function showRoyalToast(icon, message) {
    const toast = document.getElementById('royal-toast');
    const iconEl = document.getElementById('royal-toast-icon');
    const textEl = document.getElementById('royal-toast-text');
    if (!toast) return;

    if (iconEl) iconEl.textContent = icon || '✦';
    if (textEl) textEl.textContent = message;
    toast.classList.add('visible');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 4000);
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
  // DÉMARRAGE DE L'APPLICATION
  // ==========================================================================
  function initApp() {
    loadPersistedState();

    if (window.ParticleFX && typeof window.ParticleFX.initAmbientCanvas === 'function') {
      window.ParticleFX.initAmbientCanvas('ambient-particles-canvas');
    }

    initWorldMap();
    renderHUD();
    updateRegionRailActive(Math.ceil(AppState.selectedDay / 6));
    bindGlobalEvents();
  }

  // API publique pour interopérabilité avec world_map.js & minigames_engine.js
  window.LauGrimoireApp = {
    openDay: handlePlayDay,
    selectDay: walkHeroToDay,
    openDrawer: openDrawerModal,
    recordEasterEggFound: handleEasterEggFound,
    getFoundSecrets: () => [...AppState.foundSecrets],
    completeDay: (dayNum, bonusPayload) => {
      handleDayChallengeVictory(getDayByNumber(dayNum), bonusPayload);
    },
    setAldrynHouse: (houseObj) => {
      if (houseObj && houseObj.name) {
        AppState.aldrynUnlocked = true;
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
