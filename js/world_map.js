/**
 * ============================================================================
 * WORLD_MAP.JS — MOTEUR DE CARTE DU MONDE JRPG PLEIN ÉCRAN (OVERWORLD ENGINE)
 * ============================================================================
 * "L'Assistante du Vilain & Le Multivers de @lau.libraryyy"
 *
 * Inspiré de Super Mario World, Unicorn Overlord & Final Fantasy IX :
 * - Espace monde 2000 × 1125 (16:9) calé sur assets/world_overworld_map.png
 * - Caméra Pan & Zoom 60fps (souris, tactile, molette centrée curseur, pinch)
 * - 24 nœuds de niveau reliés par une spline Catmull-Rom double couche Éther
 * - Chibi Laure qui marche réellement sur la courbe + Kingsley en suivi fluide
 *   + Le Vilain Chibi interactif + Le navire pirate Le Maram en navigation
 * - 12 Easter Eggs cliquables cachés dans les 4 biomes (persistés localStorage)
 * - Canvas ambiant (nuages doux, lucioles d'Éther, neige au Nord-Est, étincelles)
 *
 * Exports globaux :
 * - window.MAP_EASTER_EGGS
 * - window.WorldMapEngine
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. CONSTANTES DU MONDE & DONNÉES CARTOGRAPHIQUES
  // ==========================================================================
  const WORLD_W = 2000;
  const WORLD_H = 1125;
  const MIN_ZOOM = 0.55;
  const MAX_ZOOM = 2.0;
  const SECRETS_STORAGE_KEY = 'lau_library_map_secrets_v1';

  const BOSS_DAYS = new Set([6, 12, 18, 21]);
  const FINALE_DAY = 24;

  // Les 24 nœuds géographiques calés au pixel près sur les lieux peints de world_overworld_map.png (2000 × 1125)
  const LEVEL_NODES = [
    // Semaine 1 (Sud-Ouest : Manoir du Vilain & Baie d'Aldryn — Jours 1 à 6)
    { day: 1, week: 1, x: 640, y: 745, place: 'Manoir du Vilain', role: 'start' },
    { day: 2, week: 1, x: 475, y: 755, place: 'Allée des Reliés Vinted', role: 'normal' },
    { day: 3, week: 1, x: 375, y: 725, place: 'Portail de Laiton', role: 'normal' },
    { day: 4, week: 1, x: 296, y: 695, place: "Observatoire Lunaire d'Aldryn", role: 'normal' },
    { day: 5, week: 1, x: 795, y: 785, place: 'Cryptex de la Côte', role: 'normal' },
    { day: 6, week: 1, x: 1002, y: 775, place: "Pont de l'Académie de Caten", role: 'boss' },

    // Semaine 2 (Sud-Est : Désert de Daevabad & Brumes d'Irlande — Jours 7 à 12)
    { day: 7, week: 2, x: 1145, y: 785, place: 'Dunes de Laiton', role: 'normal' },
    { day: 8, week: 2, x: 1270, y: 765, place: 'Cité Orientale de Daevabad', role: 'normal' },
    { day: 9, week: 2, x: 1455, y: 780, place: "Oasis d'Everflame", role: 'normal' },
    { day: 10, week: 2, x: 1630, y: 760, place: "Pierres Celtiques d'Irlande", role: 'normal' },
    { day: 11, week: 2, x: 1755, y: 680, place: 'Forêt des Sortilèges', role: 'normal' },
    { day: 12, week: 2, x: 1512, y: 578, place: 'Pont Est de Sinegard', role: 'boss' },

    // Semaine 3 (Nord-Ouest : Terres de Feu, Palais d'Or & Mons — Jours 13 à 18)
    { day: 13, week: 3, x: 1000, y: 585, place: 'Carrefour de la Boussole', role: 'normal' },
    { day: 14, week: 3, x: 564, y: 585, place: 'Pont Ouest des Marées', role: 'normal' },
    { day: 15, week: 3, x: 506, y: 440, place: 'Champ des Coquelicots', role: 'normal' },
    { day: 16, week: 3, x: 344, y: 295, place: 'Volcan de Feu de Dragon', role: 'normal' },
    { day: 17, week: 3, x: 622, y: 260, place: "Palais Doré d'Auren", role: 'normal' },
    { day: 18, week: 3, x: 808, y: 435, place: 'Beffroi & Grenier de Mons', role: 'boss' },

    // Semaine 4 (Nord-Est : Pics d'Alchimie & Sanctuaire de Noël — Jours 19 à 24)
    { day: 19, week: 4, x: 1006, y: 398, place: 'Pont Nord des Brumes', role: 'normal' },
    { day: 20, week: 4, x: 1234, y: 425, place: "Tour d'Alchimiste de Red City", role: 'normal' },
    { day: 21, week: 4, x: 1390, y: 380, place: 'Col du Complot Royal', role: 'boss' },
    { day: 22, week: 4, x: 1535, y: 350, place: "Sapins de l'Effet Boule de Neige", role: 'normal' },
    { day: 23, week: 4, x: 1680, y: 325, place: 'Arche du Grand Conseil', role: 'normal' },
    { day: 24, week: 4, x: 1578, y: 265, place: 'Sanctuaire du Cristal Mère de Noël', role: 'finale' }
  ];

  // Plaques cartographiques subtiles dans les 4 coins du continent
  const REGION_PLAQUES = [
    {
      week: 1,
      roman: 'I',
      title: "Manoir du Vilain & Baie d'Aldryn",
      sub: 'Jours 1 – 6 • Sud-Ouest',
      x: 42,
      y: 1036,
      align: 'left'
    },
    {
      week: 2,
      roman: 'II',
      title: "Désert de Daevabad & Brumes d'Irlande",
      sub: 'Jours 7 – 12 • Sud-Est',
      x: 1958,
      y: 1036,
      align: 'right'
    },
    {
      week: 3,
      roman: 'III',
      title: "Terres de Feu, Palais d'Or & Mons",
      sub: 'Jours 13 – 18 • Nord-Ouest',
      x: 42,
      y: 42,
      align: 'left'
    },
    {
      week: 4,
      roman: 'IV',
      title: "Pics d'Alchimie & Sanctuaire de Noël",
      sub: 'Jours 19 – 24 • Nord-Est',
      x: 1958,
      y: 42,
      align: 'right'
    }
  ];

  // Cadrages caméra par région (Semaines 1 à 4)
  const REGION_CAMERAS = {
    1: { x: 600, y: 760, zoom: 1.18 },
    2: { x: 1450, y: 745, zoom: 1.15 },
    3: { x: 640, y: 410, zoom: 1.15 },
    4: { x: 1420, y: 320, zoom: 1.18 }
  };

  // Position du Vilain Chibi (devant le Sanctuaire du Cristal Mère du Jour 24)
  const VILLAIN_POS = { x: 1690, y: 225 };

  // Petits mots doux aléatoires du Vilain (ton copain)
  const VILLAIN_LOVE_NOTES = [
    "« Chut... Ne le dis à personne, mais tu es de loin la meilleure Assistante (et la plus incroyable des copines) de tout le multivers. ❤️ »",
    "« J'ai caché 24 petits bouts de nous sur cette carte. Prends ton temps, un café chaud à la main, et profite de chaque étape, ma Laure ! ☕✨ »",
    "« Entre nous : même si tu critiques *Babel* encore 100 fois, je t'aimerai toujours plus que toutes les bibliothèques du monde réunies. 🏛️💛 »",
    "« Kingsley m'a soufflé une pancarte secrète : « CÂLIN ILLIMITÉ VALABLE DÈS QUE TU FERMES L'ÉCRAN ! » 🐸💕 »",
    "« De nos verres à Mons jusqu'aux sentiers d'Irlande, chaque aventure avec toi vaut mille fois tous les romans de fantasy. ☘️🌙 »",
    "« Promis, au Sanctuaire du 24 décembre, il n'y a aucune arnaque Vinted — juste un trésor préparé rien que pour toi ! 🎄👑 »",
    "« Psst, @lau.libraryyy ! Si tu cherches tous les secrets cachés sur la carte, j'ai glissé quelques clins d'œil bien sentis dans les quatre coins du continent... 😉🗺️ »",
    "« Règle officielle du Manoir : zéro stress, 100% magie, plaid obligatoire et chocolat à volonté pour l'Assistante Principale ! 🍫✨ »"
  ];

  // ==========================================================================
  // 2. LES 12 EASTER EGGS CLIQUABLES CACHÉS SUR LA CARTE (window.MAP_EASTER_EGGS)
  // ==========================================================================
  const MAP_EASTER_EGGS = [
    {
      id: 'vinted_bones',
      x: 705,
      y: 660,
      icon: '📚',
      biome: 1,
      title: 'La Tour Vinted de The Bone Season',
      text: "Tomes 2, 3 et 4 reliés achetés une fortune sur Vinted... réédités neufs 1 mois plus tard. Statut de lecture : toujours 0 page !"
    },
    {
      id: 'mons_trolls',
      x: 865,
      y: 350,
      icon: '🍺',
      biome: 3,
      title: 'Le Beffroi de Mons & Trolls & Légendes',
      text: "On avait juré qu'on venait juste acheter UN livre... on a fini à boire des verres et à refaire le monde avec les autrices !"
    },
    {
      id: 'fourth_wing_dragon',
      x: 470,
      y: 235,
      icon: '🐉',
      biome: 3,
      title: 'Le Dragon « Bof » de Fourth Wing',
      text: "Zzz... Tout BookTok hurle au chef-d'œuvre, mais Laure lève les yeux au ciel et passe son chemin."
    },
    {
      id: 'babel_tower',
      x: 915,
      y: 525,
      icon: '🏛️',
      biome: 1,
      title: "La Tour d'Argent d'Oxford (Babel)",
      text: "Chuchotement de ton copain au loin : « Je te jure que Babel c'est un chef-d'œuvre absolu, donne-lui une seconde chance ! »"
    },
    {
      id: 'amina_ship',
      x: 960,
      y: 1020,
      icon: '⛵',
      biome: 2,
      attachedToShip: true,
      title: 'Le Navire Pirate Le Maram',
      text: "Ohé matelot ! Capitaine Amina al-Sirafi a caché une cargaison d'épices et de coffres de S.A. Chakraborty à bord."
    },
    {
      id: 'ireland_clover',
      x: 1755,
      y: 835,
      icon: '☘️',
      biome: 2,
      title: "Le Bosquet d'Irlande (N'invite pas la forêt à entrer)",
      text: "Souvenir de notre voyage en Irlande ! Les arbres murmurent encore... et on n'a toujours pas invité la forêt à entrer."
    },
    {
      id: 'hades_poppies',
      x: 440,
      y: 390,
      icon: '🌺',
      biome: 3,
      title: "Le Champ de Coquelicots d'Hades",
      text: "Clin d'œil à notre super discussion à la Foire de Mons avec l'autrice de « Là où poussent les coquelicots » inspirée du jeu Hades !"
    },
    {
      id: 'prison_healer_chest',
      x: 1365,
      y: 865,
      icon: '💎',
      biome: 2,
      title: 'Le Coffre Prison Healer (Édition Spéciale)',
      text: "Règle officielle du multivers : seul le Tome 1 existe. Les tomes 2 et 3 ont été effacés de la réalité."
    },
    {
      id: 'laulibraryyy_sign',
      x: 1085,
      y: 635,
      icon: '📸',
      biome: 2,
      title: 'Le Panneau Légendaire @lau.libraryyy',
      text: "Attention, zone de critiques littéraires sans pitié et de piles à lire qui menacent de s'effondrer !"
    },
    {
      id: 'aldryn_lighthouse',
      x: 225,
      y: 635,
      icon: '🌙',
      biome: 1,
      title: "Le Phare des Marées d'Aldryn",
      text: "En attendant le tome 2 de Curious Tides... la marée lunaire veille sur tes lectures nocturnes."
    },
    {
      id: 'poppy_campfire',
      x: 245,
      y: 295,
      icon: '🔥',
      biome: 3,
      title: 'Le Feu de Camp de The Poppy War',
      text: "Rin affûte sa lame en attendant que le Tome 3 arrive enfin dans ta bibliothèque !"
    },
    {
      id: 'kingsley_lilypad',
      x: 530,
      y: 883,
      icon: '🐸',
      biome: 1,
      title: 'Le Nénuphar Secret de Kingsley',
      text: "Croâ ! Pancarte secrète n°42 : « URGENCE CAFÉ, PLAID ET CHOCOLAT IMMÉDIAT ! »"
    }
  ];

  window.MAP_EASTER_EGGS = MAP_EASTER_EGGS;

  // ==========================================================================
  // 3. UTILITAIRES MATHÉMATIQUES & SPLINE CATMULL-ROM
  // ==========================================================================
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Construit une spline Catmull-Rom douce (tension réglable) convertie en
   * courbe de Bézier cubique SVG + table d'échantillonnage par longueur d'arc
   * pour un déplacement de Laure à vitesse parfaitement constante.
   */
  function buildSplineGeometry(nodes) {
    const n = nodes.length;
    const tension = 0.22; // Doux et organique sans boucle parasite
    const segments = [];
    const nodeArcLengths = new Array(n).fill(0);
    let totalLength = 0;

    let d = `M ${nodes[0].x.toFixed(1)} ${nodes[0].y.toFixed(1)}`;

    for (let i = 0; i < n - 1; i++) {
      const p0 = nodes[Math.max(0, i - 1)];
      const p1 = nodes[i];
      const p2 = nodes[i + 1];
      const p3 = nodes[Math.min(n - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;

      // Échantillonnage fin du segment cubique (40 pas)
      const SAMPLES = 40;
      const pts = [];
      let segLen = 0;
      let prevX = p1.x;
      let prevY = p1.y;

      for (let s = 0; s <= SAMPLES; s++) {
        const t = s / SAMPLES;
        const mt = 1 - t;
        const x =
          mt * mt * mt * p1.x +
          3 * mt * mt * t * cp1x +
          3 * mt * t * t * cp2x +
          t * t * t * p2.x;
        const y =
          mt * mt * mt * p1.y +
          3 * mt * mt * t * cp1y +
          3 * mt * t * t * cp2y +
          t * t * t * p2.y;

        if (s > 0) {
          segLen += Math.hypot(x - prevX, y - prevY);
        }
        pts.push({ x, y, dist: segLen, globalDist: totalLength + segLen });
        prevX = x;
        prevY = y;
      }

      segments.push({
        fromDay: p1.day,
        toDay: p2.day,
        startDist: totalLength,
        length: segLen,
        endDist: totalLength + segLen,
        points: pts
      });

      totalLength += segLen;
      nodeArcLengths[i + 1] = totalLength;
    }

    /**
     * Évalue la position (x, y) et la tangente à une distance d'arc globale `dist`.
     */
    function sampleAtDistance(dist) {
      const clamped = clamp(dist, 0, totalLength);
      // Recherche du segment contenant `clamped`
      let seg = segments[segments.length - 1];
      for (let i = 0; i < segments.length; i++) {
        if (clamped <= segments[i].endDist || i === segments.length - 1) {
          seg = segments[i];
          break;
        }
      }
      const localDist = clamped - seg.startDist;
      const pts = seg.points;
      for (let j = 1; j < pts.length; j++) {
        if (localDist <= pts[j].dist || j === pts.length - 1) {
          const a = pts[j - 1];
          const b = pts[j];
          const span = Math.max(0.0001, b.dist - a.dist);
          const ratio = clamp((localDist - a.dist) / span, 0, 1);
          return {
            x: lerp(a.x, b.x, ratio),
            y: lerp(a.y, b.y, ratio),
            dx: b.x - a.x,
            dy: b.y - a.y
          };
        }
      }
      const last = pts[pts.length - 1];
      return { x: last.x, y: last.y, dx: 1, dy: 0 };
    }

    return {
      svgPathD: d,
      segments,
      nodeArcLengths,
      totalLength,
      sampleAtDistance
    };
  }

  // ==========================================================================
  // 4. STYLES CSS AUTO-INJECTÉS (AESTHETIC FINAL FANTASY CRISTAL / JRPG)
  // ==========================================================================
  function injectEngineStyles() {
    if (document.getElementById('world-map-engine-styles')) return;
    const style = document.createElement('style');
    style.id = 'world-map-engine-styles';
    style.textContent = `
/* ==========================================================================
   WORLD MAP ENGINE — OVERWORLD JRPG PLEIN ÉCRAN
   ========================================================================== */
.ow-viewport {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  cursor: grab;
  background: radial-gradient(circle at 50% 45%, #efe4cf 0%, #e4d5b9 65%, #d6c3a3 100%);
  font-family: var(--font-ui, 'Plus Jakarta Sans', system-ui, sans-serif);
}

.ow-viewport.ow-dragging {
  cursor: grabbing;
}

.ow-world-stage {
  position: absolute;
  left: 0;
  top: 0;
  width: 2000px;
  height: 1125px;
  transform-origin: 0 0;
  will-change: transform;
  background: #f2e7d2;
  box-shadow: 0 0 80px rgba(45, 30, 18, 0.35);
}

.ow-bg-map {
  position: absolute;
  inset: 0;
  width: 2000px;
  height: 1125px;
  object-fit: cover;
  pointer-events: none;
  display: block;
  filter: contrast(1.02);
}

.ow-map-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow: inset 0 0 95px rgba(56, 38, 22, 0.24);
}

/* Couche SVG du chemin sinueux */
.ow-path-svg {
  position: absolute;
  inset: 0;
  width: 2000px;
  height: 1125px;
  pointer-events: none;
  overflow: visible;
}

.ow-path-shadow {
  fill: none;
  stroke: rgba(35, 26, 22, 0.24);
  stroke-width: 10;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ow-path-track {
  fill: none;
  stroke: rgba(110, 78, 48, 0.48);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 10 10;
}

.ow-path-ether-glow {
  fill: none;
  stroke: rgba(181, 73, 58, 0.32);
  stroke-width: 9;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.85;
  transition: stroke-dashoffset 0.75s cubic-bezier(0.22, 1, 0.36, 1);
}

.ow-path-ether-core {
  fill: none;
  stroke: #b5493a;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.95;
  transition: stroke-dashoffset 0.75s cubic-bezier(0.22, 1, 0.36, 1);
}

.ow-fast-travel-arc {
  fill: none;
  stroke: #231a16;
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-dasharray: 8 8;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.ow-fast-travel-arc.is-active {
  opacity: 0.75;
  animation: owDashFlow 0.6s linear infinite;
}

@keyframes owDashFlow {
  to { stroke-dashoffset: -40; }
}

/* Plaques cartographiques de régions (4 coins) */
.ow-region-plaques {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
}

.ow-region-plaque {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 8px 12px;
  border-radius: 10px;
  background: linear-gradient(160deg, rgba(10, 22, 58, 0.76) 0%, rgba(5, 11, 32, 0.84) 100%);
  border: 1px solid rgba(200, 216, 255, 0.38);
  box-shadow: 0 6px 22px rgba(2, 6, 22, 0.55), inset 0 0 0 1px rgba(246, 211, 101, 0.16);
  backdrop-filter: blur(4px);
}

.ow-region-plaque.align-right {
  transform: translateX(-100%);
  flex-direction: row-reverse;
  padding: 8px 12px 8px 16px;
  text-align: right;
}

.ow-region-roman {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display, 'Cinzel Decorative', Georgia, serif);
  font-size: 13px;
  font-weight: 700;
  color: #fef08a;
  background: radial-gradient(circle, rgba(234, 179, 8, 0.32) 0%, rgba(15, 29, 72, 0.9) 100%);
  border: 1px solid rgba(246, 211, 101, 0.65);
  flex-shrink: 0;
}

.ow-region-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.ow-region-title {
  font-family: var(--font-title, 'Cinzel', Georgia, serif);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #f8fafc;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
  white-space: nowrap;
}

.ow-region-sub {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7dd3fc;
  opacity: 0.9;
}

/* Couche Navire Pirate Le Maram */
.ow-ship-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 6;
}

.ow-ship-actor {
  position: absolute;
  left: 0;
  top: 0;
  width: 118px;
  height: 118px;
  margin-left: -59px;
  margin-top: -82px;
  pointer-events: auto;
  cursor: pointer;
  will-change: transform;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
}

.ow-ship-wake {
  position: absolute;
  bottom: 14px;
  left: 50%;
  width: 84px;
  height: 22px;
  transform: translateX(-50%);
  border-radius: 50%;
  border: 2px solid rgba(125, 211, 252, 0.55);
  background: radial-gradient(ellipse, rgba(125, 211, 252, 0.28) 0%, transparent 72%);
  animation: owWakePulse 2.4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes owWakePulse {
  0%, 100% { transform: translateX(-50%) scale(0.92); opacity: 0.45; }
  50% { transform: translateX(-50%) scale(1.14); opacity: 0.85; }
}

.ow-ship-flip {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.35s ease;
}

.ow-ship-sprite {
  width: 108px;
  height: 108px;
  object-fit: contain;
  filter: drop-shadow(0 8px 10px rgba(2, 8, 28, 0.72));
  animation: owShipBob 2.8s ease-in-out infinite;
  pointer-events: none;
}

.ow-ship-actor:hover .ow-ship-sprite {
  filter: drop-shadow(0 0 14px rgba(246, 211, 101, 0.9)) drop-shadow(0 8px 10px rgba(2, 8, 28, 0.75));
}

.ow-ship-badge {
  position: absolute;
  top: 6px;
  right: 10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  background: rgba(10, 22, 58, 0.88);
  border: 1.5px solid rgba(246, 211, 101, 0.85);
  color: #fef08a;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.65);
  animation: owSecretFloat 2.4s ease-in-out infinite;
  pointer-events: none;
}

.ow-ship-actor.is-discovered .ow-ship-badge {
  background: linear-gradient(135deg, #ca8a04, #facc15);
  color: #0b1228;
  border-color: #fef9c3;
}

@keyframes owShipBob {
  0%, 100% { transform: translateY(0) rotate(-2.5deg); }
  50% { transform: translateY(-6px) rotate(2.5deg); }
}

/* Couche des 12 Easter Eggs cachés */
.ow-secrets-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 8;
}

.ow-secret-marker {
  position: absolute;
  width: 40px;
  height: 40px;
  margin-left: -20px;
  margin-top: -20px;
  border-radius: 50%;
  border: 1.5px solid rgba(200, 216, 255, 0.52);
  background: radial-gradient(circle at 35% 30%, rgba(30, 58, 138, 0.82), rgba(7, 15, 42, 0.86));
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.6), 0 0 14px rgba(56, 189, 248, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  padding: 0;
  opacity: 0.76;
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  animation: owSecretFloat 3.1s ease-in-out infinite;
}

.ow-secret-marker::before {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px dashed rgba(125, 211, 252, 0.45);
  animation: owSpinSlow 14s linear infinite;
  pointer-events: none;
}

.ow-secret-marker:hover {
  opacity: 1;
  transform: scale(1.22);
  border-color: #fef08a;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.7), 0 0 22px rgba(246, 211, 101, 0.75);
  z-index: 25;
}

.ow-secret-marker.is-discovered {
  opacity: 1;
  border-color: #f6d365;
  background: radial-gradient(circle at 35% 30%, rgba(202, 138, 4, 0.55), rgba(16, 34, 92, 0.94));
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.65), 0 0 18px rgba(246, 211, 101, 0.65);
}

.ow-secret-marker.is-discovered::before {
  border-color: rgba(254, 240, 138, 0.65);
}

.ow-secret-icon {
  font-size: 19px;
  line-height: 1;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.6));
}

.ow-secret-star {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #eab308, #fef08a);
  color: #091538;
  font-size: 10px;
  font-weight: 900;
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.55);
}

.ow-secret-marker.is-discovered .ow-secret-star {
  display: flex;
}

@keyframes owSecretFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

@keyframes owSpinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Couche des 24 Nœuds de Niveau */
.ow-nodes-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 12;
}

.ow-node {
  position: absolute;
  width: 48px;
  height: 48px;
  margin-left: -24px;
  margin-top: -24px;
  border-radius: 50%;
  border: 2.5px solid #c8d8ff;
  background: radial-gradient(circle at 35% 28%, #1e3d8f 0%, #0d1f54 62%, #050d26 100%);
  box-shadow:
    0 6px 16px rgba(2, 6, 22, 0.8),
    inset 0 2px 5px rgba(255, 255, 255, 0.3),
    0 0 16px rgba(56, 189, 248, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  padding: 0;
  color: #f8fafc;
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.22s ease, border-color 0.22s ease;
}

.ow-node:hover {
  transform: scale(1.16);
  border-color: #fef08a;
  box-shadow:
    0 8px 22px rgba(2, 6, 22, 0.88),
    0 0 26px rgba(246, 211, 101, 0.78);
  z-index: 30;
}

.ow-node:focus-visible {
  outline: 3px solid #7dd3fc;
  outline-offset: 4px;
}

.ow-node-num {
  font-family: var(--font-title, 'Cinzel', Georgia, serif);
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.85);
  pointer-events: none;
}

.ow-node-ring {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 2px solid transparent;
  pointer-events: none;
}

/* Nœud Actuel (où se trouve Laure) */
.ow-node.is-current {
  border-color: #fef08a;
  box-shadow:
    0 6px 22px rgba(2, 6, 22, 0.88),
    0 0 28px rgba(56, 189, 248, 0.88),
    0 0 42px rgba(246, 211, 101, 0.55);
}

.ow-node.is-current .ow-node-ring {
  border-color: rgba(125, 211, 252, 0.85);
  animation: owNodePulse 1.8s ease-out infinite;
}

@keyframes owNodePulse {
  0% { transform: scale(0.95); opacity: 0.95; }
  100% { transform: scale(1.48); opacity: 0; }
}

/* Nœud Complété (Sceau brisé) */
.ow-node.is-completed {
  border-color: #f6d365;
  background: radial-gradient(circle at 35% 28%, #0f5c4d 0%, #0a3642 62%, #06182c 100%);
  box-shadow:
    0 6px 16px rgba(2, 6, 22, 0.82),
    inset 0 2px 5px rgba(254, 240, 138, 0.35),
    0 0 18px rgba(52, 211, 153, 0.5);
}

.ow-node-check {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 19px;
  height: 19px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #34d399);
  border: 1.5px solid #ecfdf5;
  color: #022c22;
  font-size: 11px;
  font-weight: 900;
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.65);
  pointer-events: none;
}

.ow-node.is-completed .ow-node-check {
  display: flex;
}

/* Nœud Verrouillé (Mode Décembre) */
.ow-node.is-locked {
  border-color: rgba(148, 163, 184, 0.5);
  background: radial-gradient(circle at 35% 28%, #1e293b 0%, #0f172a 70%, #020617 100%);
  color: #94a3b8;
  box-shadow: 0 4px 12px rgba(2, 6, 22, 0.7);
  filter: saturate(0.45);
}

.ow-node-lock {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #0f172a;
  border: 1.5px solid #64748b;
  font-size: 10px;
  display: none;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.ow-node.is-locked .ow-node-lock {
  display: flex;
}

.ow-node.ow-shake {
  animation: owShake 0.36s ease;
}

@keyframes owShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-3px); }
}

/* Nœuds BOSS (Jours 6, 12, 18, 21) */
.ow-node.is-boss {
  width: 58px;
  height: 58px;
  margin-left: -29px;
  margin-top: -29px;
  border-width: 3px;
  border-color: #fda4af;
  background: radial-gradient(circle at 35% 28%, #be123c 0%, #7f1d1d 58%, #2a0410 100%);
  box-shadow:
    0 8px 22px rgba(2, 6, 22, 0.85),
    inset 0 2px 6px rgba(255, 228, 230, 0.38),
    0 0 24px rgba(244, 63, 94, 0.65);
}

.ow-node.is-boss.is-completed {
  border-color: #f6d365;
  background: radial-gradient(circle at 35% 28%, #9f1239 0%, #4c0519 60%, #1e1b4b 100%);
}

.ow-node.is-boss .ow-node-num {
  font-size: 18px;
  color: #fff1f2;
}

.ow-node-crest {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 15px;
  line-height: 1;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.85));
  pointer-events: none;
}

/* Nœud FINAL LÉGENDAIRE (Jour 24) */
.ow-node.is-finale {
  width: 68px;
  height: 68px;
  margin-left: -34px;
  margin-top: -34px;
  border-width: 3px;
  border-color: #fef08a;
  background: radial-gradient(circle at 35% 25%, #f59e0b 0%, #b45309 45%, #1e1b4b 100%);
  box-shadow:
    0 10px 28px rgba(2, 6, 22, 0.9),
    inset 0 2px 8px rgba(255, 255, 255, 0.55),
    0 0 34px rgba(250, 204, 21, 0.82),
    0 0 58px rgba(56, 189, 248, 0.45);
}

.ow-node.is-finale .ow-node-num {
  font-size: 20px;
  color: #fef9c3;
}

.ow-node.is-finale .ow-node-crest {
  top: -15px;
  font-size: 20px;
}

/* Étiquette flottante du nœud (nom du lieu) */
.ow-node-label {
  position: absolute;
  top: calc(100% + 7px);
  left: 50%;
  transform: translateX(-50%);
  padding: 3px 9px;
  border-radius: 6px;
  background: rgba(6, 14, 42, 0.88);
  border: 1px solid rgba(200, 216, 255, 0.42);
  color: #f1f5f9;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.72);
  opacity: 0.86;
  transition: opacity 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
}

.ow-node.is-boss .ow-node-label {
  border-color: rgba(251, 113, 133, 0.7);
  color: #ffe4e6;
}

.ow-node.is-finale .ow-node-label {
  border-color: rgba(254, 240, 138, 0.82);
  color: #fef08a;
  font-family: var(--font-title, 'Cinzel', Georgia, serif);
  font-weight: 700;
}

.ow-node:hover .ow-node-label,
.ow-node.is-current .ow-node-label {
  opacity: 1;
  border-color: #f6d365;
  transform: translateX(-50%) translateY(2px);
}

/* Couche Personnages (Laure, Kingsley, Le Vilain) */
.ow-actors-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 18;
}

.ow-actor {
  position: absolute;
  left: 0;
  top: 0;
  will-change: transform;
  pointer-events: none;
}

.ow-actor-shadow {
  position: absolute;
  left: 50%;
  bottom: -6px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(2, 6, 24, 0.65) 0%, rgba(2, 6, 24, 0.25) 55%, transparent 78%);
  pointer-events: none;
}

/* Laure Chibi */
.ow-laura {
  width: 88px;
  height: 98px;
  margin-left: -44px;
  margin-top: -90px;
  z-index: 22;
}

.ow-laura .ow-actor-shadow {
  width: 54px;
  height: 16px;
}

.ow-laura-aura {
  position: absolute;
  left: 50%;
  bottom: -10px;
  width: 66px;
  height: 22px;
  transform: translateX(-50%);
  border-radius: 50%;
  border: 2px solid rgba(125, 211, 252, 0.65);
  box-shadow: 0 0 18px rgba(56, 189, 248, 0.55);
  opacity: 0.7;
  pointer-events: none;
  transition: border-color 0.35s ease, box-shadow 0.35s ease;
}

.ow-laura-motion {
  width: 100%;
  height: 100%;
  transform-origin: 50% 92%;
  will-change: transform;
}

.ow-laura-flip {
  width: 100%;
  height: 100%;
  transition: transform 0.14s ease-out;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.ow-laura-sprite {
  width: 86px;
  height: 96px;
  object-fit: contain;
  filter: drop-shadow(0 6px 8px rgba(2, 8, 28, 0.75));
  pointer-events: none;
}

.ow-laura-pointer {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 13px;
  color: #fef08a;
  text-shadow: 0 0 10px rgba(246, 211, 101, 0.95), 0 2px 4px rgba(0, 0, 0, 0.9);
  animation: owPointerBounce 1.15s ease-in-out infinite;
  pointer-events: none;
}

@keyframes owPointerBounce {
  0%, 100% { transform: translateX(-50%) translateY(0px); }
  50% { transform: translateX(-50%) translateY(-6px); }
}

/* Kingsley Chibi */
.ow-kingsley {
  width: 52px;
  height: 54px;
  margin-left: -26px;
  margin-top: -48px;
  z-index: 21;
  pointer-events: auto;
  cursor: pointer;
}

.ow-kingsley .ow-actor-shadow {
  width: 34px;
  height: 11px;
}

.ow-kingsley-motion {
  width: 100%;
  height: 100%;
  transform-origin: 50% 90%;
  will-change: transform;
}

.ow-kingsley-flip {
  width: 100%;
  height: 100%;
  transition: transform 0.16s ease-out;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.ow-kingsley-sprite {
  width: 50px;
  height: 52px;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(2, 8, 28, 0.72));
  pointer-events: none;
}

/* Le Vilain Chibi */
.ow-villain {
  width: 90px;
  height: 100px;
  margin-left: -45px;
  margin-top: -92px;
  z-index: 20;
  pointer-events: auto;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}

.ow-villain .ow-actor-shadow {
  width: 56px;
  height: 16px;
}

.ow-villain-sprite {
  width: 88px;
  height: 98px;
  object-fit: contain;
  filter: drop-shadow(0 6px 10px rgba(2, 8, 28, 0.8));
  animation: owVillainIdle 2.9s ease-in-out infinite;
  transition: filter 0.2s ease, transform 0.2s ease;
  pointer-events: none;
}

.ow-villain:hover .ow-villain-sprite {
  filter: drop-shadow(0 0 16px rgba(244, 63, 94, 0.8)) drop-shadow(0 6px 10px rgba(2, 8, 28, 0.85));
}

.ow-villain-tag {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(15, 23, 56, 0.9);
  border: 1px solid rgba(246, 211, 101, 0.72);
  color: #fef08a;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  white-space: nowrap;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.65);
  pointer-events: none;
}

@keyframes owVillainIdle {
  0%, 100% { transform: translateY(0) scaleY(1); }
  50% { transform: translateY(-4px) scaleY(1.025); }
}

/* Canvas Ambiant (nuages, lucioles, neige, étincelles) */
.ow-ambient-canvas {
  position: absolute;
  inset: 0;
  width: 2000px;
  height: 1125px;
  pointer-events: none;
  z-index: 24;
}

/* Bulle de Dialogue JRPG ancrée sur la carte */
.ow-bubble-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 35;
}

.ow-dialog-bubble {
  position: absolute;
  width: 310px;
  max-width: 330px;
  padding: 13px 15px 14px;
  border-radius: 12px;
  background: linear-gradient(165deg, rgba(16, 36, 98, 0.96) 0%, rgba(8, 17, 52, 0.98) 58%, rgba(4, 9, 30, 0.99) 100%);
  border: 2px solid #c8d8ff;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.3),
    0 14px 36px rgba(0, 6, 26, 0.88),
    0 0 26px rgba(56, 189, 248, 0.38);
  color: #f8fafc;
  pointer-events: auto;
  transform: translate(-50%, calc(-100% - 26px));
  animation: owBubblePop 0.24s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.ow-dialog-bubble.is-below {
  transform: translate(-50%, 28px);
  animation: owBubblePopBelow 0.24s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.ow-dialog-bubble::after {
  content: '';
  position: absolute;
  left: var(--tail-left, 50%);
  bottom: -9px;
  width: 14px;
  height: 14px;
  margin-left: -7px;
  background: #060f30;
  border-right: 2px solid #c8d8ff;
  border-bottom: 2px solid #c8d8ff;
  transform: rotate(45deg);
}

.ow-dialog-bubble.is-below::after {
  bottom: auto;
  top: -9px;
  background: #102462;
  border-right: none;
  border-bottom: none;
  border-left: 2px solid #c8d8ff;
  border-top: 2px solid #c8d8ff;
}

.ow-dialog-bubble.is-villain {
  border-color: #f6d365;
  box-shadow:
    inset 0 0 0 1px rgba(254, 240, 138, 0.35),
    0 14px 36px rgba(0, 6, 26, 0.9),
    0 0 28px rgba(244, 63, 94, 0.38);
}

@keyframes owBubblePop {
  from { opacity: 0; transform: translate(-50%, calc(-100% - 14px)) scale(0.88); }
  to { opacity: 1; transform: translate(-50%, calc(-100% - 26px)) scale(1); }
}

@keyframes owBubblePopBelow {
  from { opacity: 0; transform: translate(-50%, 16px) scale(0.88); }
  to { opacity: 1; transform: translate(-50%, 28px) scale(1); }
}

.ow-bubble-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.ow-bubble-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ow-bubble-icon {
  font-size: 20px;
  line-height: 1;
  flex-shrink: 0;
}

.ow-bubble-title {
  font-family: var(--font-title, 'Cinzel', Georgia, serif);
  font-size: 13.5px;
  font-weight: 700;
  color: #fef08a;
  line-height: 1.25;
}

.ow-bubble-close {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid rgba(200, 216, 255, 0.45);
  background: rgba(15, 29, 72, 0.85);
  color: #e2e8f0;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.16s ease, color 0.16s ease;
}

.ow-bubble-close:hover {
  background: rgba(244, 63, 94, 0.85);
  color: #fff;
}

.ow-bubble-text {
  font-family: var(--font-literary, 'Cormorant Garamond', Georgia, serif);
  font-size: 16px;
  font-style: italic;
  line-height: 1.42;
  color: #f1f5f9;
  margin: 0;
}

.ow-bubble-footer {
  margin-top: 9px;
  padding-top: 7px;
  border-top: 1px solid rgba(200, 216, 255, 0.22);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #7dd3fc;
}

.ow-bubble-badge-new {
  color: #fef08a;
}
`;
    document.head.appendChild(style);
  }

  // ==========================================================================
  // 5. EFFETS SONORES LÉGERS OVERWORLD (S'APPUIE SUR WINDOW.AUDIOFX SI PRÉSENT)
  // ==========================================================================
  const MapSFX = {
    playStep() {
      const fx = window.AudioFX;
      if (!fx || (typeof fx.isMuted === 'function' && fx.isMuted())) return;
      try {
        const ctx = typeof fx._ensureContext === 'function' ? fx._ensureContext() : null;
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const baseFreq = 240 + Math.random() * 85;
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.045);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.065, now + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(fx.masterGain || ctx.destination);
        osc.start(now);
        osc.stop(now + 0.055);
      } catch (e) {
        // Silence si audio bloqué
      }
    },

    playFastTravel() {
      const fx = window.AudioFX;
      if (!fx) return;
      if (typeof fx.playRuneChime === 'function') {
        fx.playRuneChime();
      } else if (typeof fx.playClick === 'function') {
        fx.playClick();
      }
    },

    playSecret(isNew) {
      const fx = window.AudioFX;
      if (!fx) return;
      if (isNew && typeof fx.playRuneChime === 'function') {
        fx.playRuneChime();
      } else if (typeof fx.playClick === 'function') {
        fx.playClick();
      }
    },

    playClick() {
      const fx = window.AudioFX;
      if (fx && typeof fx.playClick === 'function') {
        fx.playClick();
      }
    },

    playLocked() {
      const fx = window.AudioFX;
      if (fx && typeof fx.playError === 'function') {
        fx.playError();
      }
    }
  };

  // ==========================================================================
  // 6. MOTEUR OVERWORLD PRINCIPAL (WorldMapEngine)
  // ==========================================================================
  class OverworldEngine {
    constructor() {
      this._initialized = false;
      this.viewportEl = null;
      this.stageEl = null;
      this.pathEtherGlowEl = null;
      this.pathEtherCoreEl = null;
      this.fastTravelArcEl = null;
      this.ambientCanvas = null;
      this.ambientCtx = null;
      this.bubbleLayerEl = null;

      this.nodeEls = new Map();
      this.secretEls = new Map();
      this.lauraEl = null;
      this.lauraMotionEl = null;
      this.lauraFlipEl = null;
      this.lauraAuraEl = null;
      this.kingsleyEl = null;
      this.kingsleyMotionEl = null;
      this.kingsleyFlipEl = null;
      this.villainEl = null;
      this.shipEl = null;
      this.shipFlipEl = null;

      // Géométrie de la spline
      this.spline = buildSplineGeometry(LEVEL_NODES);

      // État métier
      this.options = {};
      this.daysByNum = new Map();
      this.completedDays = new Set();
      this.unlockedCheckFn = () => true;
      this.discoveredSecrets = new Set();
      this.aldrynHouse = null;
      this.currentDay = 1;
      this.villainNoteIdx = -1;

      // État Caméra (centre en coordonnées monde + zoom)
      this.vpW = 1280;
      this.vpH = 720;
      this.cam = {
        x: LEVEL_NODES[0].x,
        y: LEVEL_NODES[0].y,
        zoom: 1.05,
        targetX: LEVEL_NODES[0].x,
        targetY: LEVEL_NODES[0].y,
        targetZoom: 1.05,
        vx: 0,
        vy: 0,
        followHero: false
      };

      // Interaction Pointer / Pinch
      this.pointers = new Map();
      this.isDragging = false;
      this.dragMoved = false;
      this.dragStartX = 0;
      this.dragStartY = 0;
      this.lastPanX = 0;
      this.lastPanY = 0;
      this.lastPinchDist = 0;
      this.lastPinchMidX = 0;
      this.lastPinchMidY = 0;
      this.lastNodeClick = { day: 0, time: 0 };

      // État Héros (Laure & Kingsley)
      this.laura = {
        x: LEVEL_NODES[0].x,
        y: LEVEL_NODES[0].y,
        arcDist: 0,
        facing: 1,
        walkPhase: 0,
        idlePhase: 0,
        stepSoundTimer: 0,
        sparkleTimer: 0
      };

      this.kingsley = {
        x: LEVEL_NODES[0].x - 36,
        y: LEVEL_NODES[0].y + 10,
        facing: 1,
        hopPhase: 0
      };

      // Historique de trajectoire de Laure pour le délai fluide de Kingsley (~180ms)
      this.trailHistory = [];

      // État de marche / voyage rapide
      this.travel = null; // { mode: 'walk' | 'fast', ... }

      // État du navire pirate Le Maram
      this.ship = {
        phase: 0.4,
        x: 840,
        y: 995,
        facing: 1
      };

      // Bulle active
      this.activeBubble = null;

      // Particules ambiantes
      this.clouds = [];
      this.fireflies = [];
      this.snowflakes = [];
      this.sparkles = [];

      // Boucle RAF & Observers
      this.rafId = null;
      this.lastFrameTime = 0;
      this.elapsedTime = 0;
      this.resizeObserver = null;

      // Handlers liés
      this._boundLoop = this._loop.bind(this);
      this._boundPointerDown = this._onPointerDown.bind(this);
      this._boundPointerMove = this._onPointerMove.bind(this);
      this._boundPointerUp = this._onPointerUp.bind(this);
      this._boundWheel = this._onWheel.bind(this);
      this._boundKeyDown = this._onKeyDown.bind(this);
      this._boundResize = this._updateViewportSize.bind(this);
    }

    // ------------------------------------------------------------------------
    // INITIALISATION & DESTRUCTION
    // ------------------------------------------------------------------------
    init(viewportEl, options = {}) {
      if (this._initialized) {
        this.destroy();
      }

      const el = typeof viewportEl === 'string' ? document.querySelector(viewportEl) : viewportEl;
      if (!el) {
        console.warn('[WorldMapEngine] Conteneur introuvable:', viewportEl);
        return;
      }

      injectEngineStyles();

      this.viewportEl = el;
      this.options = options || {};

      // Indexation des jours (window.ADVENT_DAYS_DATA ou options.days)
      this.daysByNum.clear();
      const daysList = Array.isArray(this.options.days)
        ? this.options.days
        : Array.isArray(window.ADVENT_DAYS_DATA)
          ? window.ADVENT_DAYS_DATA
          : [];
      for (const d of daysList) {
        if (d && typeof d.day === 'number') {
          this.daysByNum.set(d.day, d);
        }
      }

      this.completedDays = new Set(this.options.completedDays || []);
      this.unlockedCheckFn =
        typeof this.options.unlockedCheckFn === 'function'
          ? this.options.unlockedCheckFn
          : () => true;
      this.aldrynHouse = this.options.aldrynHouse || null;

      // Fusion des secrets persistés dans localStorage + options.discoveredSecrets
      this.discoveredSecrets = this._loadStoredSecrets();
      if (this.options.discoveredSecrets) {
        for (const id of this.options.discoveredSecrets) {
          this.discoveredSecrets.add(id);
        }
        this._saveStoredSecrets();
      }

      const startDay = clamp(Number(this.options.currentDay) || 1, 1, 24);
      this.currentDay = startDay;

      // Construction du DOM plein écran
      this._buildDOM();

      // Placement initial de Laure & Kingsley
      const startNode = LEVEL_NODES[startDay - 1];
      this.laura.x = startNode.x;
      this.laura.y = startNode.y;
      this.laura.arcDist = this.spline.nodeArcLengths[startDay - 1];
      this.laura.facing = startDay >= 12 && startDay <= 17 ? -1 : 1;

      this.kingsley.x = startNode.x - 38 * this.laura.facing;
      this.kingsley.y = startNode.y + 8;
      this.kingsley.facing = this.laura.facing;
      this.trailHistory = [{ t: 0, x: this.laura.x, y: this.laura.y, facing: this.laura.facing }];

      // Initialisation des couches ambiantes
      this._initAmbientEntities();

      // Calcul taille viewport & cadrage initial autour de Laure
      this._updateViewportSize();
      const comfortZoom = clamp(Math.max(this.vpW / 1420, this.vpH / 800), 0.85, 1.22);
      this.cam.zoom = comfortZoom;
      this.cam.targetZoom = comfortZoom;
      this.focusOnHero(false);

      // Mise à jour initiale de l'état visuel
      this._refreshNodesState();
      this._refreshSecretsState();
      this._refreshEtherPath();
      this._refreshAldrynAura();
      this._applyStageTransform();

      // Attache des événements
      this._bindEvents();

      // Démarrage boucle 60fps
      this._initialized = true;
      this.lastFrameTime = performance.now();
      this.rafId = requestAnimationFrame(this._boundLoop);
    }

    destroy() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      if (this.viewportEl) {
        this.viewportEl.removeEventListener('pointerdown', this._boundPointerDown);
        this.viewportEl.removeEventListener('pointermove', this._boundPointerMove);
        this.viewportEl.removeEventListener('pointerup', this._boundPointerUp);
        this.viewportEl.removeEventListener('pointercancel', this._boundPointerUp);
        this.viewportEl.removeEventListener('wheel', this._boundWheel);
      }
      window.removeEventListener('keydown', this._boundKeyDown);
      window.removeEventListener('resize', this._boundResize);
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
      this.pointers.clear();
      this.nodeEls.clear();
      this.secretEls.clear();
      this.travel = null;
      this.activeBubble = null;
      this._initialized = false;
    }

    // ------------------------------------------------------------------------
    // CONSTRUCTION DU DOM DE LA CARTE MONDE
    // ------------------------------------------------------------------------
    _buildDOM() {
      const vp = this.viewportEl;
      vp.classList.add('ow-viewport');
      vp.innerHTML = '';

      // Stage 2000 × 1125
      const stage = document.createElement('div');
      stage.className = 'ow-world-stage';
      this.stageEl = stage;

      // 1. Fond illustré de la carte du monde
      const bgImg = document.createElement('img');
      bgImg.className = 'ow-bg-map';
      bgImg.src = 'assets/world_overworld_map.png';
      bgImg.alt = 'Carte du Multivers de @lau.libraryyy';
      bgImg.draggable = false;
      bgImg.onerror = () => {
        bgImg.style.display = 'none';
      };
      stage.appendChild(bgImg);

      const vignette = document.createElement('div');
      vignette.className = 'ow-map-vignette';
      stage.appendChild(vignette);

      // 2. Chemin SVG Catmull-Rom double couche (piste pointillée + traînée Éther Or & Cyan)
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('class', 'ow-path-svg');
      svg.setAttribute('viewBox', `0 0 ${WORLD_W} ${WORLD_H}`);
      svg.setAttribute('width', String(WORLD_W));
      svg.setAttribute('height', String(WORLD_H));

      const defs = document.createElementNS(svgNS, 'defs');
      defs.innerHTML = `
        <linearGradient id="ow-ether-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f6d365" />
          <stop offset="48%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#fef08a" />
        </linearGradient>
        <filter id="ow-glow-ether" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      `;
      svg.appendChild(defs);

      const pathShadow = document.createElementNS(svgNS, 'path');
      pathShadow.setAttribute('class', 'ow-path-shadow');
      pathShadow.setAttribute('d', this.spline.svgPathD);
      svg.appendChild(pathShadow);

      const pathTrack = document.createElementNS(svgNS, 'path');
      pathTrack.setAttribute('class', 'ow-path-track');
      pathTrack.setAttribute('d', this.spline.svgPathD);
      svg.appendChild(pathTrack);

      const pathEtherGlow = document.createElementNS(svgNS, 'path');
      pathEtherGlow.setAttribute('class', 'ow-path-ether-glow');
      pathEtherGlow.setAttribute('d', this.spline.svgPathD);
      svg.appendChild(pathEtherGlow);
      this.pathEtherGlowEl = pathEtherGlow;

      const pathEtherCore = document.createElementNS(svgNS, 'path');
      pathEtherCore.setAttribute('class', 'ow-path-ether-core');
      pathEtherCore.setAttribute('d', this.spline.svgPathD);
      svg.appendChild(pathEtherCore);
      this.pathEtherCoreEl = pathEtherCore;

      const fastArc = document.createElementNS(svgNS, 'path');
      fastArc.setAttribute('class', 'ow-fast-travel-arc');
      fastArc.setAttribute('d', '');
      svg.appendChild(fastArc);
      this.fastTravelArcEl = fastArc;

      stage.appendChild(svg);

      // 3. Plaques de Régions Cartographiques dans les 4 coins
      const plaquesLayer = document.createElement('div');
      plaquesLayer.className = 'ow-region-plaques';
      for (const r of REGION_PLAQUES) {
        const plaque = document.createElement('div');
        plaque.className = `ow-region-plaque${r.align === 'right' ? ' align-right' : ''}`;
        plaque.style.left = `${r.x}px`;
        plaque.style.top = `${r.y}px`;
        plaque.innerHTML = `
          <div class="ow-region-roman">${r.roman}</div>
          <div class="ow-region-text">
            <span class="ow-region-title">${escapeHtml(r.title)}</span>
            <span class="ow-region-sub">${escapeHtml(r.sub)}</span>
          </div>
        `;
        plaquesLayer.appendChild(plaque);
      }
      stage.appendChild(plaquesLayer);

      // 4. Navire Pirate Le Maram (vogue en boucle + Easter Egg cliquable)
      const shipLayer = document.createElement('div');
      shipLayer.className = 'ow-ship-layer';
      const shipBtn = document.createElement('button');
      shipBtn.type = 'button';
      shipBtn.className = 'ow-ship-actor';
      shipBtn.setAttribute('aria-label', 'Le Navire Pirate Le Maram — Secret caché');
      shipBtn.innerHTML = `
        <span class="ow-ship-wake" aria-hidden="true"></span>
        <span class="ow-ship-flip">
          <img class="ow-ship-sprite" src="assets/sprite_ship.png" alt="Le Maram" draggable="false" />
        </span>
        <span class="ow-ship-badge" aria-hidden="true">⛵</span>
      `;
      const shipImg = shipBtn.querySelector('.ow-ship-sprite');
      shipImg.onerror = () => {
        shipImg.style.display = 'none';
        shipBtn.querySelector('.ow-ship-badge').style.fontSize = '24px';
        shipBtn.querySelector('.ow-ship-badge').style.width = '46px';
        shipBtn.querySelector('.ow-ship-badge').style.height = '46px';
      };
      shipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.dragMoved) return;
        const shipSecret = MAP_EASTER_EGGS.find((s) => s.id === 'amina_ship');
        if (shipSecret) {
          this._triggerSecret(shipSecret, this.ship.x, this.ship.y - 26);
        }
      });
      this.shipEl = shipBtn;
      this.shipFlipEl = shipBtn.querySelector('.ow-ship-flip');
      shipLayer.appendChild(shipBtn);
      stage.appendChild(shipLayer);

      // 5. Les 11 Easter Eggs fixes sur la carte (amina_ship est sur le navire)
      const secretsLayer = document.createElement('div');
      secretsLayer.className = 'ow-secrets-layer';
      this.secretEls.clear();
      MAP_EASTER_EGGS.forEach((secret, idx) => {
        if (secret.attachedToShip) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ow-secret-marker';
        btn.style.left = `${secret.x}px`;
        btn.style.top = `${secret.y}px`;
        btn.style.animationDelay = `${(idx * 0.27) % 2.5}s`;
        btn.dataset.secretId = secret.id;
        btn.setAttribute('aria-label', `Secret : ${secret.title}`);
        btn.title = secret.title;
        btn.innerHTML = `
          <span class="ow-secret-icon" aria-hidden="true">${secret.icon}</span>
          <span class="ow-secret-star" aria-hidden="true">★</span>
        `;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (this.dragMoved) return;
          this._triggerSecret(secret, secret.x, secret.y);
        });
        secretsLayer.appendChild(btn);
        this.secretEls.set(secret.id, btn);
      });
      stage.appendChild(secretsLayer);

      // 6. Les 24 Nœuds de Niveau
      const nodesLayer = document.createElement('div');
      nodesLayer.className = 'ow-nodes-layer';
      this.nodeEls.clear();
      for (const node of LEVEL_NODES) {
        const dayInfo = this.daysByNum.get(node.day);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ow-node';
        if (BOSS_DAYS.has(node.day)) btn.classList.add('is-boss');
        if (node.day === FINALE_DAY) btn.classList.add('is-finale');

        btn.style.left = `${node.x}px`;
        btn.style.top = `${node.y}px`;
        btn.dataset.day = String(node.day);

        const labelText = node.place;
        const ariaTitle = dayInfo ? `Jour ${node.day} : ${dayInfo.title} (${labelText})` : `Jour ${node.day} : ${labelText}`;
        btn.setAttribute('aria-label', ariaTitle);

        let crestHtml = '';
        if (BOSS_DAYS.has(node.day)) {
          crestHtml = '<span class="ow-node-crest" aria-hidden="true">⚔️</span>';
        } else if (node.day === FINALE_DAY) {
          crestHtml = '<span class="ow-node-crest" aria-hidden="true">👑</span>';
        }

        btn.innerHTML = `
          <span class="ow-node-ring" aria-hidden="true"></span>
          ${crestHtml}
          <span class="ow-node-num">${node.day}</span>
          <span class="ow-node-check" aria-hidden="true">✓</span>
          <span class="ow-node-lock" aria-hidden="true">🔒</span>
          <span class="ow-node-label">${escapeHtml(labelText)}</span>
        `;

        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (this.dragMoved) return;
          this._onNodeClick(node.day);
        });

        btn.addEventListener('dblclick', (e) => {
          e.stopPropagation();
          if (this.dragMoved) return;
          this._onNodeDoubleClick(node.day);
        });

        nodesLayer.appendChild(btn);
        this.nodeEls.set(node.day, btn);
      }
      stage.appendChild(nodesLayer);

      // 7. Personnages (Le Vilain Chibi, Kingsley, Laure Chibi)
      const actorsLayer = document.createElement('div');
      actorsLayer.className = 'ow-actors-layer';

      // Le Vilain Chibi (près du Sanctuaire du Jour 24)
      const villainBtn = document.createElement('button');
      villainBtn.type = 'button';
      villainBtn.className = 'ow-actor ow-villain';
      villainBtn.style.transform = `translate3d(${VILLAIN_POS.x}px, ${VILLAIN_POS.y}px, 0)`;
      villainBtn.setAttribute('aria-label', 'Parler au Vilain');
      villainBtn.innerHTML = `
        <span class="ow-actor-shadow" aria-hidden="true"></span>
        <span class="ow-villain-tag">Le Vilain 💬</span>
        <img class="ow-villain-sprite" src="assets/sprite_villain.png" alt="Le Vilain" draggable="false" />
      `;
      const villainImg = villainBtn.querySelector('.ow-villain-sprite');
      villainImg.onerror = () => {
        villainImg.src = 'assets/villain_avatar.png';
      };
      villainBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.dragMoved) return;
        this._onVillainClick();
      });
      this.villainEl = villainBtn;
      actorsLayer.appendChild(villainBtn);

      // Kingsley Chibi
      const kingsleyEl = document.createElement('div');
      kingsleyEl.className = 'ow-actor ow-kingsley';
      kingsleyEl.title = 'Kingsley — Fidèle Batracien Royal';
      kingsleyEl.innerHTML = `
        <span class="ow-actor-shadow" aria-hidden="true"></span>
        <div class="ow-kingsley-motion">
          <div class="ow-kingsley-flip">
            <img class="ow-kingsley-sprite" src="assets/sprite_kingsley.png" alt="Kingsley" draggable="false" />
          </div>
        </div>
      `;
      const kingsleyImg = kingsleyEl.querySelector('.ow-kingsley-sprite');
      kingsleyImg.onerror = () => {
        kingsleyImg.src = 'assets/kingsley_avatar.png';
      };
      kingsleyEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.dragMoved) return;
        MapSFX.playClick();
        this._spawnSparkleBurst(this.kingsley.x, this.kingsley.y - 16, 14, '#34d399');
        this._showDialogBubble({
          x: this.kingsley.x,
          y: this.kingsley.y - 30,
          icon: '👑🐸',
          title: 'Kingsley brandit une pancarte !',
          text: "« CROÂ ! EN ROUTE ASSISTANTE, LES COFFRES ET LE CHOCOLAT NE VONT PAS S'OUVRIR TOUT SEULS ! »",
          footerLeft: 'Compagnon Royal',
          footerRight: '✦ Fidèle au poste'
        });
      });
      this.kingsleyEl = kingsleyEl;
      this.kingsleyMotionEl = kingsleyEl.querySelector('.ow-kingsley-motion');
      this.kingsleyFlipEl = kingsleyEl.querySelector('.ow-kingsley-flip');
      actorsLayer.appendChild(kingsleyEl);

      // Laure Chibi
      const lauraEl = document.createElement('div');
      lauraEl.className = 'ow-actor ow-laura';
      lauraEl.innerHTML = `
        <span class="ow-actor-shadow" aria-hidden="true"></span>
        <span class="ow-laura-aura" aria-hidden="true"></span>
        <span class="ow-laura-pointer" aria-hidden="true">▼</span>
        <div class="ow-laura-motion">
          <div class="ow-laura-flip">
            <img class="ow-laura-sprite" src="assets/sprite_laura.png" alt="Laure" draggable="false" />
          </div>
        </div>
      `;
      const lauraImg = lauraEl.querySelector('.ow-laura-sprite');
      lauraImg.onerror = () => {
        lauraImg.src = 'assets/heroine_avatar.png';
      };
      this.lauraEl = lauraEl;
      this.lauraMotionEl = lauraEl.querySelector('.ow-laura-motion');
      this.lauraFlipEl = lauraEl.querySelector('.ow-laura-flip');
      this.lauraAuraEl = lauraEl.querySelector('.ow-laura-aura');
      actorsLayer.appendChild(lauraEl);

      stage.appendChild(actorsLayer);

      // 8. Canvas Ambiant (Nuages, Lucioles d'Éther, Neige Nord-Est, Étincelles)
      const canvas = document.createElement('canvas');
      canvas.className = 'ow-ambient-canvas';
      canvas.width = WORLD_W;
      canvas.height = WORLD_H;
      canvas.setAttribute('aria-hidden', 'true');
      this.ambientCanvas = canvas;
      this.ambientCtx = canvas.getContext('2d');
      stage.appendChild(canvas);

      // 9. Couche Bulles de Dialogue JRPG
      const bubbleLayer = document.createElement('div');
      bubbleLayer.className = 'ow-bubble-layer';
      this.bubbleLayerEl = bubbleLayer;
      stage.appendChild(bubbleLayer);

      vp.appendChild(stage);
    }

    // ------------------------------------------------------------------------
    // GESTION DES ÉVÉNEMENTS (PAN, PINCH-TO-ZOOM, MOLETTE, CLAVIER, RESIZE)
    // ------------------------------------------------------------------------
    _bindEvents() {
      const vp = this.viewportEl;
      vp.addEventListener('pointerdown', this._boundPointerDown);
      vp.addEventListener('pointermove', this._boundPointerMove);
      vp.addEventListener('pointerup', this._boundPointerUp);
      vp.addEventListener('pointercancel', this._boundPointerUp);
      vp.addEventListener('wheel', this._boundWheel, { passive: false });

      window.addEventListener('keydown', this._boundKeyDown);
      window.addEventListener('resize', this._boundResize, { passive: true });

      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => {
          this._updateViewportSize();
        });
        this.resizeObserver.observe(vp);
      }
    }

    _updateViewportSize() {
      if (!this.viewportEl) return;
      const rect = this.viewportEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        this.vpW = rect.width;
        this.vpH = rect.height;
        this._clampCameraTarget();
        this._clampCameraNow();
      }
    }

    _onPointerDown(e) {
      // Ignorer clic droit ou clic à l'intérieur d'une bulle de dialogue
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.target && e.target.closest && e.target.closest('.ow-dialog-bubble')) return;

      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (this.pointers.size === 1) {
        this.isDragging = true;
        this.dragMoved = false;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        this.lastPanX = e.clientX;
        this.lastPanY = e.clientY;
        this.cam.vx = 0;
        this.cam.vy = 0;
      } else if (this.pointers.size === 2) {
        // Début d'un pincement tactile (pinch-to-zoom)
        this.dragMoved = true;
        this.cam.followHero = false;
        const pts = Array.from(this.pointers.values());
        this.lastPinchDist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        this.lastPinchMidX = (pts[0].x + pts[1].x) * 0.5;
        this.lastPinchMidY = (pts[0].y + pts[1].y) * 0.5;
      }
    }

    _onPointerMove(e) {
      if (!this.pointers.has(e.pointerId)) return;
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (this.pointers.size === 2) {
        const pts = Array.from(this.pointers.values());
        const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        const midX = (pts[0].x + pts[1].x) * 0.5;
        const midY = (pts[0].y + pts[1].y) * 0.5;

        if (this.lastPinchDist > 8) {
          const factor = dist / this.lastPinchDist;
          const rect = this.viewportEl.getBoundingClientRect();
          const localMidX = midX - rect.left;
          const localMidY = midY - rect.top;
          this._zoomAroundScreenPoint(this.cam.targetZoom * factor, localMidX, localMidY, true);
        }

        // Translation simultanée du point médian des deux doigts
        const dx = midX - this.lastPinchMidX;
        const dy = midY - this.lastPinchMidY;
        this.cam.x -= dx / this.cam.zoom;
        this.cam.y -= dy / this.cam.zoom;
        this.cam.targetX = this.cam.x;
        this.cam.targetY = this.cam.y;
        this._clampCameraTarget();
        this._clampCameraNow();

        this.lastPinchDist = dist;
        this.lastPinchMidX = midX;
        this.lastPinchMidY = midY;
        return;
      }

      if (this.isDragging && this.pointers.size === 1) {
        const totalMove = Math.hypot(e.clientX - this.dragStartX, e.clientY - this.dragStartY);
        if (!this.dragMoved && totalMove > 6) {
          this.dragMoved = true;
          this.cam.followHero = false;
          this.viewportEl.classList.add('ow-dragging');
          // Capturer uniquement quand un vrai drag démarre afin de préserver les clics sur boutons enfants
          try {
            this.viewportEl.setPointerCapture(e.pointerId);
          } catch (err) {
            // Ignore
          }
        }

        if (this.dragMoved) {
          const dx = e.clientX - this.lastPanX;
          const dy = e.clientY - this.lastPanY;
          const worldDx = -dx / this.cam.zoom;
          const worldDy = -dy / this.cam.zoom;

          this.cam.x += worldDx;
          this.cam.y += worldDy;
          this.cam.targetX = this.cam.x;
          this.cam.targetY = this.cam.y;

          // Vélocité douce pour inertie à la relâche
          this.cam.vx = lerp(this.cam.vx, worldDx * 14, 0.45);
          this.cam.vy = lerp(this.cam.vy, worldDy * 14, 0.45);
          this._clampCameraTarget();
          this._clampCameraNow();
        }

        this.lastPanX = e.clientX;
        this.lastPanY = e.clientY;
      }
    }

    _onPointerUp(e) {
      const wasDragging = this.dragMoved;
      this.pointers.delete(e.pointerId);

      try {
        if (this.viewportEl && this.viewportEl.hasPointerCapture(e.pointerId)) {
          this.viewportEl.releasePointerCapture(e.pointerId);
        }
      } catch (err) {
        // Ignore
      }

      if (this.pointers.size === 0) {
        this.isDragging = false;
        this.viewportEl.classList.remove('ow-dragging');

        // Clic vide sur la carte -> ferme une éventuelle bulle ouverte
        if (!wasDragging && this.activeBubble) {
          const clickedInteractive =
            e.target &&
            e.target.closest &&
            e.target.closest('.ow-node, .ow-secret-marker, .ow-ship-actor, .ow-villain, .ow-kingsley, .ow-dialog-bubble');
          if (!clickedInteractive) {
            this._closeDialogBubble();
          }
        }

        // Petite inertie fluide après un glisser
        if (wasDragging && Math.hypot(this.cam.vx, this.cam.vy) > 15) {
          this.cam.targetX = this.cam.x + this.cam.vx * 0.14;
          this.cam.targetY = this.cam.y + this.cam.vy * 0.14;
          this._clampCameraTarget();
        }
        this.cam.vx = 0;
        this.cam.vy = 0;

        // Réinitialisation de dragMoved après le cycle click natif
        setTimeout(() => {
          this.dragMoved = false;
        }, 0);
      } else if (this.pointers.size === 1) {
        const remaining = Array.from(this.pointers.values())[0];
        this.lastPanX = remaining.x;
        this.lastPanY = remaining.y;
      }
    }

    _onWheel(e) {
      e.preventDefault();
      this.cam.followHero = false;
      const rect = this.viewportEl.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;

      // Normalisation du delta molette (souris & trackpad)
      const delta = clamp(-e.deltaY * 0.0014, -0.25, 0.25);
      const nextZoom = clamp(this.cam.targetZoom * Math.exp(delta * 1.15), MIN_ZOOM, MAX_ZOOM);
      this._zoomAroundScreenPoint(nextZoom, sx, sy, false);
    }

    _zoomAroundScreenPoint(newZoom, sx, sy, immediate) {
      const clampedZoom = clamp(newZoom, MIN_ZOOM, MAX_ZOOM);
      const refZoom = immediate ? this.cam.zoom : this.cam.targetZoom;
      const refX = immediate ? this.cam.x : this.cam.targetX;
      const refY = immediate ? this.cam.y : this.cam.targetY;

      // Point monde sous le curseur avant zoom
      const worldX = (sx - this.vpW * 0.5) / refZoom + refX;
      const worldY = (sy - this.vpH * 0.5) / refZoom + refY;

      // Nouveau centre caméra pour garder ce point monde fixe sous le curseur
      const nextX = worldX - (sx - this.vpW * 0.5) / clampedZoom;
      const nextY = worldY - (sy - this.vpH * 0.5) / clampedZoom;

      this.cam.targetZoom = clampedZoom;
      this.cam.targetX = nextX;
      this.cam.targetY = nextY;
      this._clampCameraTarget();

      if (immediate) {
        this.cam.zoom = this.cam.targetZoom;
        this.cam.x = this.cam.targetX;
        this.cam.y = this.cam.targetY;
      }
    }

    _isMapInteractiveForKeyboard() {
      if (!this.viewportEl) return false;
      if (this.viewportEl.offsetParent === null) return false;
      const activeEl = document.activeElement;
      if (activeEl) {
        const tag = activeEl.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || activeEl.isContentEditable) {
          return false;
        }
      }
      // Ne pas intercepter si une modale / fenêtre de niveau est ouverte au-dessus
      const openModal = document.querySelector(
        '.modal-overlay.active, .day-modal.active, .day-modal-overlay.active, .story-modal.active, [role="dialog"].active'
      );
      if (openModal && openModal.offsetParent !== null) return false;
      return true;
    }

    _onKeyDown(e) {
      if (!this._isMapInteractiveForKeyboard()) return;

      if (e.key === 'Escape' && this.activeBubble) {
        this._closeDialogBubble();
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        this.stepDay(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        this.stepDay(-1);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this._enterDayIfAllowed(this.currentDay);
      } else if (e.key === '+' || e.key === '=') {
        this.zoomIn();
      } else if (e.key === '-' || e.key === '_') {
        this.zoomOut();
      }
    }

    // ------------------------------------------------------------------------
    // CONTRÔLES CAMÉRA PUBLICS
    // ------------------------------------------------------------------------
    _getCameraBounds(zoom) {
      const halfVisW = this.vpW / (2 * zoom);
      const halfVisH = this.vpH / (2 * zoom);
      const padX = 95;
      const padY = 95;

      let minX, maxX, minY, maxY;
      if (WORLD_W * zoom <= this.vpW) {
        minX = maxX = WORLD_W * 0.5;
      } else {
        minX = halfVisW - padX;
        maxX = WORLD_W - halfVisW + padX;
      }

      if (WORLD_H * zoom <= this.vpH) {
        minY = maxY = WORLD_H * 0.5;
      } else {
        minY = halfVisH - padY;
        maxY = WORLD_H - halfVisH + padY;
      }
      return { minX, maxX, minY, maxY };
    }

    _clampCameraTarget() {
      this.cam.targetZoom = clamp(this.cam.targetZoom, MIN_ZOOM, MAX_ZOOM);
      const b = this._getCameraBounds(this.cam.targetZoom);
      this.cam.targetX = clamp(this.cam.targetX, b.minX, b.maxX);
      this.cam.targetY = clamp(this.cam.targetY, b.minY, b.maxY);
    }

    _clampCameraNow() {
      this.cam.zoom = clamp(this.cam.zoom, MIN_ZOOM, MAX_ZOOM);
      const b = this._getCameraBounds(this.cam.zoom);
      this.cam.x = clamp(this.cam.x, b.minX, b.maxX);
      this.cam.y = clamp(this.cam.y, b.minY, b.maxY);
    }

    zoomIn() {
      this.cam.followHero = false;
      const next = clamp(this.cam.targetZoom * 1.24, MIN_ZOOM, MAX_ZOOM);
      this._zoomAroundScreenPoint(next, this.vpW * 0.5, this.vpH * 0.5, false);
      MapSFX.playClick();
    }

    zoomOut() {
      this.cam.followHero = false;
      const next = clamp(this.cam.targetZoom / 1.24, MIN_ZOOM, MAX_ZOOM);
      this._zoomAroundScreenPoint(next, this.vpW * 0.5, this.vpH * 0.5, false);
      MapSFX.playClick();
    }

    focusOnHero(animate = true) {
      this.cam.targetX = this.laura.x;
      this.cam.targetY = this.laura.y - 20;
      if (this.cam.targetZoom < 0.92) {
        this.cam.targetZoom = 1.06;
      }
      this._clampCameraTarget();
      if (!animate) {
        this.cam.x = this.cam.targetX;
        this.cam.y = this.cam.targetY;
        this.cam.zoom = this.cam.targetZoom;
        this._applyStageTransform();
      }
    }

    focusOnNode(dayNum, animate = true) {
      const idx = clamp(Number(dayNum) || 1, 1, 24) - 1;
      const node = LEVEL_NODES[idx];
      this.cam.followHero = false;
      this.cam.targetX = node.x;
      this.cam.targetY = node.y - 16;
      if (this.cam.targetZoom < 0.98) {
        this.cam.targetZoom = 1.12;
      }
      this._clampCameraTarget();
      if (!animate) {
        this.cam.x = this.cam.targetX;
        this.cam.y = this.cam.targetY;
        this.cam.zoom = this.cam.targetZoom;
        this._applyStageTransform();
      }
    }

    focusOnRegion(weekNum) {
      this.cam.followHero = false;
      if (weekNum === 'all' || weekNum === 0 || weekNum == null) {
        const fitZoom = clamp(
          Math.min(this.vpW / WORLD_W, this.vpH / WORLD_H) * 0.97,
          MIN_ZOOM,
          1.0
        );
        this.cam.targetX = WORLD_W * 0.5;
        this.cam.targetY = WORLD_H * 0.5;
        this.cam.targetZoom = fitZoom;
        this._clampCameraTarget();
        return;
      }

      const preset = REGION_CAMERAS[Number(weekNum)];
      if (!preset) return;
      const scaleAdapt = clamp(Math.min(this.vpW / 1280, this.vpH / 720), 0.72, 1.18);
      this.cam.targetX = preset.x;
      this.cam.targetY = preset.y;
      this.cam.targetZoom = clamp(preset.zoom * scaleAdapt, MIN_ZOOM, MAX_ZOOM);
      this._clampCameraTarget();
    }

    // ------------------------------------------------------------------------
    // DÉPLACEMENT DE LAURA SUR LE CHEMIN & INTERACTION NŒUDS
    // ------------------------------------------------------------------------
    _onNodeClick(dayNum) {
      const now = performance.now();
      const isRapidSecondClick =
        this.lastNodeClick.day === dayNum && now - this.lastNodeClick.time < 420;
      this.lastNodeClick = { day: dayNum, time: now };

      // Si Laure est déjà sur ce nœud (et ne marche pas), ouvre directement le niveau !
      if (dayNum === this.currentDay && !this.travel) {
        this._enterDayIfAllowed(dayNum);
        return;
      }

      // Si double-clic rapide sur un autre nœud -> lance dès l'arrivée
      this.walkToDay(dayNum, isRapidSecondClick);
    }

    _onNodeDoubleClick(dayNum) {
      if (dayNum === this.currentDay && !this.travel) {
        this._enterDayIfAllowed(dayNum);
      } else {
        this.walkToDay(dayNum, true);
      }
    }

    _enterDayIfAllowed(dayNum) {
      const unlocked = Boolean(this.unlockedCheckFn(dayNum));
      if (!unlocked) {
        this._showLockedFeedback(dayNum);
        return;
      }
      MapSFX.playClick();
      if (typeof this.options.onEnterDay === 'function') {
        this.options.onEnterDay(dayNum);
      }
    }

    _showLockedFeedback(dayNum) {
      MapSFX.playLocked();
      const node = LEVEL_NODES[dayNum - 1];
      const el = this.nodeEls.get(dayNum);
      if (el) {
        el.classList.remove('ow-shake');
        void el.offsetWidth;
        el.classList.add('ow-shake');
      }
      this._showDialogBubble({
        x: node.x,
        y: node.y - 24,
        icon: '🔒',
        title: `Sceau Temporel — Jour ${dayNum}`,
        text: `Cette porte du multivers s'ouvrira le ${dayNum} décembre ! (Tu peux activer le Mode Exploration Libre dans le HUD pour tout tester.)`,
        footerLeft: node.place,
        footerRight: '⏳ Patience...'
      });
    }

    stepDay(delta) {
      const baseDay = this.travel ? this.travel.targetDay : this.currentDay;
      const nextDay = clamp(baseDay + (delta >= 0 ? 1 : -1), 1, 24);
      if (nextDay !== baseDay) {
        this.walkToDay(nextDay, false);
      }
    }

    walkToDay(dayNum, autoEnter = false) {
      const targetDay = clamp(Number(dayNum) || 1, 1, 24);
      const targetNode = LEVEL_NODES[targetDay - 1];

      // Si déjà en train de marcher vers ce même nœud, on active simplement autoEnter si demandé
      if (this.travel && this.travel.targetDay === targetDay) {
        if (autoEnter) this.travel.autoEnter = true;
        return;
      }

      // Déjà sur place
      if (!this.travel && targetDay === this.currentDay) {
        this.focusOnHero(true);
        if (autoEnter) {
          this._enterDayIfAllowed(targetDay);
        } else if (typeof this.options.onSelectDay === 'function') {
          this.options.onSelectDay(targetDay);
        }
        return;
      }

      this._closeDialogBubble();

      const fromDay = this.currentDay;
      const dayDelta = Math.abs(targetDay - fromDay);
      const startArc = this.laura.arcDist;
      const endArc = this.spline.nodeArcLengths[targetDay - 1];

      this.cam.followHero = true;

      if (dayDelta <= 5) {
        // MARCHE RÉELLE LE LONG DE LA COURBE SVG
        const dist = Math.abs(endArc - startArc);
        const speed = 325; // pixels monde / seconde
        const duration = clamp(dist / speed, 0.32, 3.2);

        this.travel = {
          mode: 'walk',
          targetDay,
          autoEnter: Boolean(autoEnter),
          startArc,
          endArc,
          elapsed: 0,
          duration
        };
        if (this.fastTravelArcEl) {
          this.fastTravelArcEl.classList.remove('is-active');
        }
      } else {
        // VOYAGE RAPIDE ÉTOILÉ SUR UN ARC LUMINEUX
        const sx = this.laura.x;
        const sy = this.laura.y;
        const ex = targetNode.x;
        const ey = targetNode.y;
        const midX = (sx + ex) * 0.5;
        const arcLift = clamp(Math.hypot(ex - sx, ey - sy) * 0.24, 110, 260);
        const ctrlY = Math.min(sy, ey) - arcLift;

        if (this.fastTravelArcEl) {
          this.fastTravelArcEl.setAttribute(
            'd',
            `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${midX.toFixed(1)} ${ctrlY.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`
          );
          this.fastTravelArcEl.classList.add('is-active');
        }

        MapSFX.playFastTravel();
        this._spawnSparkleBurst(sx, sy - 20, 18, '#7dd3fc');

        this.travel = {
          mode: 'fast',
          targetDay,
          autoEnter: Boolean(autoEnter),
          sx,
          sy,
          cx: midX,
          cy: ctrlY,
          ex,
          ey,
          endArc,
          elapsed: 0,
          duration: 0.95
        };
      }
    }

    _finishTravel(travel) {
      const targetNode = LEVEL_NODES[travel.targetDay - 1];
      this.currentDay = travel.targetDay;
      this.laura.x = targetNode.x;
      this.laura.y = targetNode.y;
      this.laura.arcDist = travel.endArc;
      this.travel = null;

      if (this.fastTravelArcEl) {
        this.fastTravelArcEl.classList.remove('is-active');
      }

      this._refreshNodesState();
      this._refreshEtherPath();
      this._spawnSparkleBurst(targetNode.x, targetNode.y - 6, 14, '#fef08a');

      // Centrage doux sur la position finale
      this.cam.targetX = targetNode.x;
      this.cam.targetY = targetNode.y - 20;
      this._clampCameraTarget();
      this.cam.followHero = false;

      if (typeof this.options.onSelectDay === 'function') {
        this.options.onSelectDay(this.currentDay);
      }

      if (travel.autoEnter) {
        const dayToOpen = this.currentDay;
        setTimeout(() => {
          if (this._initialized && this.currentDay === dayToOpen) {
            this._enterDayIfAllowed(dayToOpen);
          }
        }, 120);
      }
    }

    // ------------------------------------------------------------------------
    // EASTER EGGS & LE VILAIN CHIBI
    // ------------------------------------------------------------------------
    _loadStoredSecrets() {
      const set = new Set();
      try {
        const raw = localStorage.getItem(SECRETS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            for (const id of parsed) set.add(id);
          }
        }
      } catch (e) {
        // Ignore storage errors
      }
      return set;
    }

    _saveStoredSecrets() {
      try {
        localStorage.setItem(SECRETS_STORAGE_KEY, JSON.stringify(Array.from(this.discoveredSecrets)));
      } catch (e) {
        // Ignore storage errors
      }
    }

    _triggerSecret(secret, worldX, worldY) {
      const isNew = !this.discoveredSecrets.has(secret.id);
      if (isNew) {
        this.discoveredSecrets.add(secret.id);
        this._saveStoredSecrets();
        this._refreshSecretsState();
      }

      MapSFX.playSecret(isNew);
      this._spawnSparkleBurst(worldX, worldY, isNew ? 26 : 12, isNew ? '#fef08a' : '#7dd3fc');

      const foundCount = this.discoveredSecrets.size;
      const totalCount = MAP_EASTER_EGGS.length;

      this._showDialogBubble({
        x: worldX,
        y: worldY,
        icon: secret.icon,
        title: secret.title,
        text: `« ${secret.text} »`,
        footerLeft: isNew ? '✦ Nouveau Secret Découvert !' : '★ Secret du Multivers',
        footerRight: `${foundCount} / ${totalCount} Secrets`,
        isNew
      });

      if (typeof this.options.onSecretFound === 'function') {
        this.options.onSecretFound(secret.id, foundCount, totalCount, secret);
      }
    }

    _onVillainClick() {
      this.villainNoteIdx = (this.villainNoteIdx + 1) % VILLAIN_LOVE_NOTES.length;
      const pick =
        this.villainNoteIdx === 0
          ? VILLAIN_LOVE_NOTES[Math.floor(Math.random() * VILLAIN_LOVE_NOTES.length)]
          : VILLAIN_LOVE_NOTES[this.villainNoteIdx];

      MapSFX.playSecret(true);
      this._spawnSparkleBurst(VILLAIN_POS.x, VILLAIN_POS.y - 45, 22, '#fb7185');

      this._showDialogBubble({
        x: VILLAIN_POS.x - 10,
        y: VILLAIN_POS.y - 60,
        icon: '🖤👑',
        title: 'Le Vilain (Ton Chéri)',
        text: pick,
        footerLeft: 'Sanctuaire du 24 Décembre',
        footerRight: '❤️ Mot Doux Secret',
        variant: 'villain'
      });

      if (typeof this.options.onVillainClick === 'function') {
        this.options.onVillainClick(pick);
      }
    }

    _showDialogBubble({ x, y, icon, title, text, footerLeft, footerRight, isNew, variant }) {
      if (!this.bubbleLayerEl) return;
      this.bubbleLayerEl.innerHTML = '';

      // Empêcher la bulle de sortir des bords gauche/droite/haut du monde 2000 × 1125
      const clampedX = clamp(x, 190, WORLD_W - 190);
      const showBelow = y < 275;
      const tailOffsetPx = clamp(x - clampedX, -110, 110);

      const el = document.createElement('div');
      el.className = `ow-dialog-bubble${showBelow ? ' is-below' : ''}${variant === 'villain' ? ' is-villain' : ''}`;
      el.style.left = `${clampedX}px`;
      el.style.top = `${y}px`;
      el.style.setProperty('--tail-left', `calc(50% + ${tailOffsetPx.toFixed(1)}px)`);

      el.innerHTML = `
        <div class="ow-bubble-header">
          <div class="ow-bubble-title-wrap">
            <span class="ow-bubble-icon" aria-hidden="true">${icon || '✦'}</span>
            <span class="ow-bubble-title">${escapeHtml(title)}</span>
          </div>
          <button type="button" class="ow-bubble-close" aria-label="Fermer">×</button>
        </div>
        <p class="ow-bubble-text">${escapeHtml(text)}</p>
        <div class="ow-bubble-footer">
          <span class="${isNew ? 'ow-bubble-badge-new' : ''}">${escapeHtml(footerLeft || '')}</span>
          <span>${escapeHtml(footerRight || '')}</span>
        </div>
      `;

      el.querySelector('.ow-bubble-close').addEventListener('click', (e) => {
        e.stopPropagation();
        this._closeDialogBubble();
      });

      this.bubbleLayerEl.appendChild(el);
      this.activeBubble = el;
    }

    _closeDialogBubble() {
      if (this.bubbleLayerEl) {
        this.bubbleLayerEl.innerHTML = '';
      }
      this.activeBubble = null;
    }

    // ------------------------------------------------------------------------
    // SYNCHRONISATION D'ÉTAT EXTERNE (updateState & getSecretsData)
    // ------------------------------------------------------------------------
    updateState(patch = {}) {
      if (!patch || typeof patch !== 'object') return;

      if (patch.completedDays !== undefined) {
        this.completedDays = new Set(patch.completedDays || []);
      }
      if (typeof patch.unlockedCheckFn === 'function') {
        this.unlockedCheckFn = patch.unlockedCheckFn;
      }
      if (patch.discoveredSecrets !== undefined) {
        this.discoveredSecrets = new Set(patch.discoveredSecrets || []);
        this._saveStoredSecrets();
      }
      if (patch.aldrynHouse !== undefined) {
        this.aldrynHouse = patch.aldrynHouse;
      }
      if (typeof patch.currentDay === 'number' && !this.travel) {
        const clamped = clamp(patch.currentDay, 1, 24);
        if (clamped !== this.currentDay) {
          this.currentDay = clamped;
          const node = LEVEL_NODES[clamped - 1];
          this.laura.x = node.x;
          this.laura.y = node.y;
          this.laura.arcDist = this.spline.nodeArcLengths[clamped - 1];
        }
      }

      if (this._initialized) {
        this._refreshNodesState();
        this._refreshSecretsState();
        this._refreshEtherPath();
        this._refreshAldrynAura();
      }
    }

    getSecretsData() {
      const secrets = MAP_EASTER_EGGS.map((s) => ({
        ...s,
        discovered: this.discoveredSecrets.has(s.id)
      }));
      return {
        total: MAP_EASTER_EGGS.length,
        foundCount: this.discoveredSecrets.size,
        foundIds: Array.from(this.discoveredSecrets),
        secrets
      };
    }

    getCurrentDay() {
      return this.currentDay;
    }

    getNodesData() {
      return LEVEL_NODES.map((n) => ({ ...n }));
    }

    // ------------------------------------------------------------------------
    // MISE À JOUR VISUELLE DES COUCHES
    // ------------------------------------------------------------------------
    _refreshNodesState() {
      for (const node of LEVEL_NODES) {
        const el = this.nodeEls.get(node.day);
        if (!el) continue;
        const unlocked = Boolean(this.unlockedCheckFn(node.day));
        const completed = this.completedDays.has(node.day);
        const isCurrent = node.day === this.currentDay;

        el.classList.toggle('is-unlocked', unlocked);
        el.classList.toggle('is-locked', !unlocked);
        el.classList.toggle('is-completed', completed);
        el.classList.toggle('is-current', isCurrent);
      }
    }

    _refreshSecretsState() {
      for (const secret of MAP_EASTER_EGGS) {
        const found = this.discoveredSecrets.has(secret.id);
        if (secret.attachedToShip && this.shipEl) {
          this.shipEl.classList.toggle('is-discovered', found);
        } else {
          const el = this.secretEls.get(secret.id);
          if (el) el.classList.toggle('is-discovered', found);
        }
      }
    }

    _refreshEtherPath() {
      if (!this.pathEtherGlowEl || !this.pathEtherCoreEl) return;
      const total = this.spline.totalLength;

      // Éclaire le chemin d'Éther jusqu'au plus haut niveau atteint (complété + 1 ou position de Laure)
      let highestCompleted = 0;
      for (const d of this.completedDays) {
        if (d > highestCompleted) highestCompleted = d;
      }
      const litDay = clamp(Math.max(highestCompleted + (highestCompleted > 0 ? 1 : 0), this.currentDay), 1, 24);
      const litLength = Math.max(this.spline.nodeArcLengths[litDay - 1], this.laura.arcDist);
      const dashOffset = Math.max(0, total - litLength);

      for (const pathEl of [this.pathEtherGlowEl, this.pathEtherCoreEl]) {
        pathEl.style.strokeDasharray = `${total.toFixed(1)}`;
        pathEl.style.strokeDashoffset = `${dashOffset.toFixed(1)}`;
      }
    }

    _refreshAldrynAura() {
      if (!this.lauraAuraEl) return;
      const house = this.aldrynHouse;
      const primary = house && house.colorPrimary ? house.colorPrimary : '#38bdf8';
      const accent = house && house.colorAccent ? house.colorAccent : '#7dd3fc';
      this.lauraAuraEl.style.borderColor = accent;
      this.lauraAuraEl.style.boxShadow = `0 0 18px ${primary}, 0 0 10px ${accent}`;
    }

    // ------------------------------------------------------------------------
    // CANVAS AMBIANT (NUAGES, LUCIOLES D'ÉTHER, NEIGE NORD-EST, ÉTINCELLES)
    // ------------------------------------------------------------------------
    _initAmbientEntities() {
      // 9 nuages doux translucides
      this.clouds = [];
      for (let i = 0; i < 9; i++) {
        this.clouds.push({
          x: Math.random() * (WORLD_W + 400) - 200,
          y: 70 + Math.random() * (WORLD_H - 140),
          rx: 95 + Math.random() * 130,
          ry: 32 + Math.random() * 34,
          speed: 7 + Math.random() * 11,
          alpha: 0.045 + Math.random() * 0.055
        });
      }

      // 56 lucioles d'Éther (forêts, baie d'Aldryn & autour du Cristal Mère)
      this.fireflies = [];
      for (let i = 0; i < 56; i++) {
        const nearCrystal = i < 16;
        this.fireflies.push({
          x: nearCrystal ? 1520 + Math.random() * 400 : 120 + Math.random() * (WORLD_W - 240),
          y: nearCrystal ? 80 + Math.random() * 320 : 140 + Math.random() * (WORLD_H - 240),
          vx: (Math.random() - 0.5) * 14,
          vy: (Math.random() - 0.5) * 12,
          r: 1.8 + Math.random() * 2.6,
          phase: Math.random() * Math.PI * 2,
          speed: 1.4 + Math.random() * 2.2,
          color: Math.random() > 0.45 ? '#7dd3fc' : '#fef08a'
        });
      }

      // 48 flocons de neige féeriques dans le quadrant Nord-Est (zone Noël)
      this.snowflakes = [];
      for (let i = 0; i < 48; i++) {
        this.snowflakes.push({
          x: 1120 + Math.random() * 880,
          y: Math.random() * 540,
          r: 1.4 + Math.random() * 2.4,
          vy: 18 + Math.random() * 24,
          drift: 8 + Math.random() * 14,
          phase: Math.random() * Math.PI * 2,
          alpha: 0.35 + Math.random() * 0.5
        });
      }

      this.sparkles = [];
    }

    _spawnFootstepSparkle(x, y) {
      for (let i = 0; i < 2; i++) {
        this.sparkles.push({
          x: x + (Math.random() - 0.5) * 18,
          y: y + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 28,
          vy: -14 - Math.random() * 24,
          size: 2.2 + Math.random() * 2.6,
          life: 0,
          maxLife: 0.45 + Math.random() * 0.3,
          color: Math.random() > 0.35 ? '#fef08a' : '#7dd3fc'
        });
      }
    }

    _spawnSparkleBurst(x, y, count = 16, mainColor = '#fef08a') {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
        const speed = 35 + Math.random() * 75;
        this.sparkles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 12,
          size: 2.5 + Math.random() * 3.2,
          life: 0,
          maxLife: 0.55 + Math.random() * 0.42,
          color: i % 3 === 0 ? '#ffffff' : mainColor
        });
      }
    }

    _updateAndDrawAmbient(dt) {
      const ctx = this.ambientCtx;
      if (!ctx) return;

      ctx.clearRect(0, 0, WORLD_W, WORLD_H);

      // 1. Nuages doux translucides
      for (const c of this.clouds) {
        c.x += c.speed * dt;
        if (c.x - c.rx > WORLD_W + 160) {
          c.x = -c.rx - 140;
          c.y = 70 + Math.random() * (WORLD_H - 140);
        }
        const grad = ctx.createRadialGradient(c.x, c.y, c.ry * 0.2, c.x, c.y, c.rx);
        grad.addColorStop(0, `rgba(226, 238, 255, ${c.alpha.toFixed(3)})`);
        grad.addColorStop(0.6, `rgba(186, 214, 255, ${(c.alpha * 0.45).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(186, 214, 255, 0)');
        ctx.save();
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, c.rx, c.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Lucioles d'Éther cyan & dorées
      for (const f of this.fireflies) {
        f.phase += f.speed * dt;
        f.x += (f.vx + Math.sin(f.phase * 0.7) * 6) * dt;
        f.y += (f.vy + Math.cos(f.phase * 0.6) * 5) * dt;

        if (f.x < 40) f.x = WORLD_W - 40;
        if (f.x > WORLD_W - 40) f.x = 40;
        if (f.y < 40) f.y = WORLD_H - 40;
        if (f.y > WORLD_H - 40) f.y = 40;

        const glow = 0.22 + 0.68 * (0.5 + 0.5 * Math.sin(f.phase));
        ctx.save();
        ctx.globalAlpha = glow;
        ctx.fillStyle = f.color;
        ctx.shadowColor = f.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Flocons de neige féeriques dans le quadrant Nord-Est (zone Noël)
      ctx.save();
      for (const s of this.snowflakes) {
        s.phase += 1.4 * dt;
        s.y += s.vy * dt;
        s.x += Math.sin(s.phase) * s.drift * dt;

        if (s.y > 540) {
          s.y = -10;
          s.x = 1120 + Math.random() * 880;
        }
        // Atténuation douce sur la frontière du quadrant Nord-Est
        const edgeFadeX = clamp((s.x - 1100) / 180, 0, 1);
        const edgeFadeY = clamp((545 - s.y) / 140, 0, 1);
        const alpha = s.alpha * edgeFadeX * edgeFadeY;
        if (alpha <= 0.01) continue;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 4. Étincelles dynamiques (pas de Laure, voyage rapide, secrets, Vilain)
      for (let i = this.sparkles.length - 1; i >= 0; i--) {
        const p = this.sparkles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          this.sparkles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.96;
        p.vy *= 0.96;

        const progress = p.life / p.maxLife;
        const alpha = 1 - progress;
        const radius = p.size * (1 - progress * 0.45);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        // Petite étoile à 4 branches
        ctx.translate(p.x, p.y);
        ctx.beginPath();
        ctx.moveTo(0, -radius * 1.6);
        ctx.quadraticCurveTo(radius * 0.25, -radius * 0.25, radius * 1.6, 0);
        ctx.quadraticCurveTo(radius * 0.25, radius * 0.25, 0, radius * 1.6);
        ctx.quadraticCurveTo(-radius * 0.25, radius * 0.25, -radius * 1.6, 0);
        ctx.quadraticCurveTo(-radius * 0.25, -radius * 0.25, 0, -radius * 1.6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // ------------------------------------------------------------------------
    // BOUCLE PRINCIPALE 60 FPS
    // ------------------------------------------------------------------------
    _loop(now) {
      if (!this._initialized) return;

      const dt = Math.min(0.05, Math.max(0.001, (now - this.lastFrameTime) / 1000));
      this.lastFrameTime = now;
      this.elapsedTime += dt;

      // 1. Mise à jour déplacement de Laure
      this._updateHeroAndCompanion(dt);

      // 2. Mise à jour du navire pirate Le Maram
      this._updateShip(dt);

      // 3. Lissage 60fps de la caméra Pan & Zoom
      this._updateCamera(dt);

      // 4. Rendu du canvas ambiant
      this._updateAndDrawAmbient(dt);

      this.rafId = requestAnimationFrame(this._boundLoop);
    }

    _updateHeroAndCompanion(dt) {
      let isMoving = false;
      let moveSpeedRatio = 0;

      if (this.travel) {
        isMoving = true;
        this.travel.elapsed += dt;
        const rawT = clamp(this.travel.elapsed / this.travel.duration, 0, 1);

        if (this.travel.mode === 'walk') {
          // Léger ease-in-out sur les bords tout en gardant un rythme naturel
          const easeT = rawT < 0.5 ? 2 * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 2) / 2;
          const curArc = lerp(this.travel.startArc, this.travel.endArc, easeT);
          const sample = this.spline.sampleAtDistance(curArc);

          const dx = sample.x - this.laura.x;
          if (Math.abs(dx) > 0.35) {
            this.laura.facing = dx >= 0 ? 1 : -1;
          }
          this.laura.x = sample.x;
          this.laura.y = sample.y;
          this.laura.arcDist = curArc;
          moveSpeedRatio = 1;

          // Étincelles dorées sous les pas + léger bruit de pas
          this.laura.sparkleTimer += dt;
          if (this.laura.sparkleTimer >= 0.055) {
            this.laura.sparkleTimer = 0;
            this._spawnFootstepSparkle(this.laura.x, this.laura.y);
          }

          this.laura.stepSoundTimer += dt;
          if (this.laura.stepSoundTimer >= 0.22) {
            this.laura.stepSoundTimer = 0;
            MapSFX.playStep();
          }
        } else {
          // Voyage rapide étoilé le long d'une courbe quadratique
          const easeT = rawT < 0.5 ? 4 * rawT * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 3) / 2;
          const mt = 1 - easeT;
          const nx = mt * mt * this.travel.sx + 2 * mt * easeT * this.travel.cx + easeT * easeT * this.travel.ex;
          const ny = mt * mt * this.travel.sy + 2 * mt * easeT * this.travel.cy + easeT * easeT * this.travel.ey;

          if (Math.abs(nx - this.laura.x) > 0.35) {
            this.laura.facing = nx >= this.laura.x ? 1 : -1;
          }
          this.laura.x = nx;
          this.laura.y = ny;
          moveSpeedRatio = 1.4;

          this.laura.sparkleTimer += dt;
          if (this.laura.sparkleTimer >= 0.025) {
            this.laura.sparkleTimer = 0;
            this._spawnFootstepSparkle(this.laura.x, this.laura.y - 12);
          }
        }

        // La caméra suit Laure en douceur pendant le trajet
        if (this.cam.followHero) {
          this.cam.targetX = this.laura.x;
          this.cam.targetY = this.laura.y - 22;
          this._clampCameraTarget();
        }

        if (rawT >= 1) {
          this._finishTravel(this.travel);
          isMoving = false;
        }
      }

      // Enregistrement de la trajectoire pour Kingsley (lag fluide de 180ms)
      this.trailHistory.push({
        t: this.elapsedTime,
        x: this.laura.x,
        y: this.laura.y,
        facing: this.laura.facing
      });
      // Purge de l'historique > 0.6s
      while (this.trailHistory.length > 2 && this.elapsedTime - this.trailHistory[0].t > 0.6) {
        this.trailHistory.shift();
      }

      // Position cible de Kingsley (décalée de 180ms derrière Laure)
      const lagTime = this.elapsedTime - 0.18;
      let sampleLag = this.trailHistory[0];
      for (let i = this.trailHistory.length - 1; i >= 0; i--) {
        if (this.trailHistory[i].t <= lagTime) {
          sampleLag = this.trailHistory[i];
          break;
        }
      }

      const desiredKx = sampleLag.x - 36 * sampleLag.facing;
      const desiredKy = sampleLag.y + 8;
      const kDist = Math.hypot(desiredKx - this.kingsley.x, desiredKy - this.kingsley.y);
      const kLerp = 1 - Math.exp(-10 * dt);
      const prevKx = this.kingsley.x;
      this.kingsley.x = lerp(this.kingsley.x, desiredKx, kLerp);
      this.kingsley.y = lerp(this.kingsley.y, desiredKy, kLerp);
      if (Math.abs(this.kingsley.x - prevKx) > 0.25) {
        this.kingsley.facing = this.kingsley.x >= prevKx ? 1 : -1;
      } else {
        this.kingsley.facing = this.laura.facing;
      }

      // Animations visuelles Laure (idle respiration vs balancement/sautillement marche)
      if (isMoving) {
        this.laura.walkPhase += dt * (this.travel && this.travel.mode === 'fast' ? 16 : 14);
        const hopY = -Math.abs(Math.sin(this.laura.walkPhase)) * (10 * moveSpeedRatio);
        const tilt = Math.sin(this.laura.walkPhase) * 6.5;
        if (this.lauraMotionEl) {
          this.lauraMotionEl.style.transform = `translate3d(0, ${hopY.toFixed(2)}px, 0) rotate(${tilt.toFixed(2)}deg)`;
        }
      } else {
        this.laura.idlePhase += dt * 3.1;
        const breatheY = Math.sin(this.laura.idlePhase) * 2.2;
        const scaleY = 1 + Math.sin(this.laura.idlePhase) * 0.025;
        if (this.lauraMotionEl) {
          this.lauraMotionEl.style.transform = `translate3d(0, ${(-breatheY).toFixed(2)}px, 0) scaleY(${scaleY.toFixed(4)})`;
        }
      }

      if (this.lauraEl) {
        this.lauraEl.style.transform = `translate3d(${this.laura.x.toFixed(2)}px, ${this.laura.y.toFixed(2)}px, 0)`;
      }
      if (this.lauraFlipEl) {
        this.lauraFlipEl.style.transform = `scaleX(${this.laura.facing})`;
      }

      // Animations visuelles Kingsley (petits bonds adorables quand il suit)
      const kingsleyMoving = kDist > 3.5 || isMoving;
      if (kingsleyMoving) {
        this.kingsley.hopPhase += dt * 13.5;
        const kHopY = -Math.abs(Math.sin(this.kingsley.hopPhase)) * 13;
        const kTilt = Math.sin(this.kingsley.hopPhase) * 9;
        if (this.kingsleyMotionEl) {
          this.kingsleyMotionEl.style.transform = `translate3d(0, ${kHopY.toFixed(2)}px, 0) rotate(${kTilt.toFixed(2)}deg)`;
        }
      } else {
        this.kingsley.hopPhase += dt * 2.6;
        const idleHop = Math.max(0, Math.sin(this.kingsley.hopPhase) - 0.65) * 14;
        if (this.kingsleyMotionEl) {
          this.kingsleyMotionEl.style.transform = `translate3d(0, ${(-idleHop).toFixed(2)}px, 0)`;
        }
      }

      if (this.kingsleyEl) {
        this.kingsleyEl.style.transform = `translate3d(${this.kingsley.x.toFixed(2)}px, ${this.kingsley.y.toFixed(2)}px, 0)`;
      }
      if (this.kingsleyFlipEl) {
        this.kingsleyFlipEl.style.transform = `scaleX(${this.kingsley.facing})`;
      }
    }

    _updateShip(dt) {
      // Navigation douce en boucle de "Le Maram" sur la mer du Sud (autour de 840, 995)
      this.ship.phase += dt * 0.24;
      const nextX = 875 + Math.cos(this.ship.phase) * 165;
      const nextY = 998 + Math.sin(this.ship.phase * 2) * 34;

      if (Math.abs(nextX - this.ship.x) > 0.05) {
        this.ship.facing = nextX >= this.ship.x ? 1 : -1;
      }
      this.ship.x = nextX;
      this.ship.y = nextY;

      if (this.shipEl) {
        this.shipEl.style.transform = `translate3d(${this.ship.x.toFixed(2)}px, ${this.ship.y.toFixed(2)}px, 0)`;
      }
      if (this.shipFlipEl) {
        this.shipFlipEl.style.transform = `scaleX(${this.ship.facing})`;
      }
    }

    _updateCamera(dt) {
      if (!this.isDragging || !this.dragMoved) {
        const smooth = 1 - Math.exp(-8.5 * dt);
        this.cam.x = lerp(this.cam.x, this.cam.targetX, smooth);
        this.cam.y = lerp(this.cam.y, this.cam.targetY, smooth);
        this.cam.zoom = lerp(this.cam.zoom, this.cam.targetZoom, smooth);

        if (Math.abs(this.cam.x - this.cam.targetX) < 0.05) this.cam.x = this.cam.targetX;
        if (Math.abs(this.cam.y - this.cam.targetY) < 0.05) this.cam.y = this.cam.targetY;
        if (Math.abs(this.cam.zoom - this.cam.targetZoom) < 0.0005) this.cam.zoom = this.cam.targetZoom;
      }

      this._applyStageTransform();
    }

    _applyStageTransform() {
      if (!this.stageEl) return;
      const tx = this.vpW * 0.5 - this.cam.x * this.cam.zoom;
      const ty = this.vpH * 0.5 - this.cam.y * this.cam.zoom;
      this.stageEl.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${this.cam.zoom.toFixed(5)})`;
    }
  }

  // Exposition globale
  window.WorldMapEngine = new OverworldEngine();
})();
