/**
 * MINIGAMES_ENGINE.JS
 * Moteur complet des 22 types de mini-jeux littéraires & mystiques (24 jours)
 * pour "L'Assistante du Vilain & Le Multivers de Lau.libraryyy".
 * 100% aligné avec ADVENT_DAYS_DATA / ALDRYN_HOUSES (days_data.js) et app.js.
 * Sans aucune dépendance externe - Vanilla JS ES6+
 */

(function () {
  'use strict';

  // ============================================================================
  // 1. UTILITAIRES & NORMALISATION
  // ============================================================================
  function normalizeAnswer(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatRichText(str) {
    if (!str) return '';
    return escapeHtml(str)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  function matchesAnyAnswer(userInput, acceptedAnswers) {
    const normUser = normalizeAnswer(userInput);
    if (!normUser) return false;
    const list = Array.isArray(acceptedAnswers)
      ? acceptedAnswers
      : [acceptedAnswers];
    return list.some((ans) => {
      const normAns = normalizeAnswer(ans);
      if (!normAns) return false;
      return normUser === normAns || (normAns.length >= 4 && normUser.includes(normAns));
    });
  }

  function normalizeCallbacks(cbOrFn) {
    if (typeof cbOrFn === 'function') {
      return {
        onVictory: cbOrFn,
        onUseLunarHint: () => {},
        hasLunarPower: true,
        isLunarHintUsed: false
      };
    }
    const obj = cbOrFn || {};
    return {
      onVictory:
        obj.onVictory ||
        obj.onComplete ||
        obj.onWin ||
        function () {},
      onUseLunarHint: obj.onUseLunarHint || function () {},
      hasLunarPower: obj.hasLunarPower !== undefined ? Boolean(obj.hasLunarPower) : true,
      isLunarHintUsed: Boolean(obj.isLunarHintUsed)
    };
  }

  const sfx = {
    click: () => window.AudioFX && window.AudioFX.playClick(),
    flip: () => window.AudioFX && window.AudioFX.playCardFlip(),
    chime: () => window.AudioFX && window.AudioFX.playRuneChime(),
    error: () => window.AudioFX && window.AudioFX.playError(),
    crack: () => window.AudioFX && window.AudioFX.playWaxCrack(),
    chest: (r) => window.AudioFX && window.AudioFX.playChestOpen(r),
    bossHit: () => window.AudioFX && window.AudioFX.playBossHit(),
    typeKey: () => window.AudioFX && window.AudioFX.playTypewriterKey(),
    bubble: () => window.AudioFX && window.AudioFX.playPotionBubble(),
    burst: (x, y, r) => window.ParticleFX && window.ParticleFX.burst(x, y, r)
  };

  // ============================================================================
  // 2. INJECTION DES STYLES AUTONOMES DES MINI-JEUX (DARK ACADEMIA / OR & OBSIDIENNE)
  // ============================================================================
  function injectMiniGamesStyles() {
    if (document.getElementById('mg-engine-styles')) return;
    const style = document.createElement('style');
    style.id = 'mg-engine-styles';
    style.textContent = `
      .mg-wrapper {
        position: relative;
        font-family: 'Cormorant Garamond', 'Crimson Text', Georgia, serif;
        color: #f5ebd6;
        background: linear-gradient(145deg, rgba(16, 12, 24, 0.96), rgba(28, 19, 38, 0.96));
        border: 1px solid rgba(212, 175, 55, 0.45);
        border-radius: 14px;
        padding: 1.35rem;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.75), inset 0 0 25px rgba(212, 175, 55, 0.08);
        max-width: 100%;
        overflow: hidden;
      }
      .mg-wrapper.mg-shake {
        animation: mgShakeAnim 0.45s cubic-bezier(.36,.07,.19,.97) both;
      }
      @keyframes mgShakeAnim {
        10%, 90% { transform: translate3d(-3px, 0, 0); }
        20%, 80% { transform: translate3d(5px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-7px, 0, 0); }
        40%, 60% { transform: translate3d(7px, 0, 0); }
      }
      .mg-header-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        font-size: 0.82rem;
        text-transform: uppercase;
        letter-spacing: 0.11em;
        color: #d4af37;
        background: rgba(212, 175, 55, 0.12);
        border: 1px solid rgba(212, 175, 55, 0.35);
        padding: 0.25rem 0.75rem;
        border-radius: 999px;
        margin-bottom: 0.7rem;
      }
      .mg-title {
        font-family: 'Cinzel', 'Playfair Display', Georgia, serif;
        font-size: 1.35rem;
        color: #f8e8b0;
        margin: 0 0 0.55rem 0;
        text-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
      }
      .mg-lore {
        font-size: 1.05rem;
        line-height: 1.55;
        color: #e2d5b8;
        margin-bottom: 1.05rem;
        padding: 0.85rem 1.05rem;
        background: rgba(0, 0, 0, 0.32);
        border-left: 3px solid #d4af37;
        border-radius: 0 8px 8px 0;
      }
      .mg-question-box {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(212, 175, 55, 0.28);
        border-radius: 10px;
        padding: 1.1rem;
        margin-bottom: 0.9rem;
      }
      .mg-input-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem;
        margin-top: 0.75rem;
      }
      .mg-runic-input {
        flex: 1;
        min-width: 190px;
        background: rgba(10, 8, 16, 0.9);
        border: 1.5px solid rgba(212, 175, 55, 0.55);
        color: #fff3c4;
        font-family: 'Cinzel', Georgia, serif;
        font-size: 1.02rem;
        letter-spacing: 0.06em;
        padding: 0.68rem 0.95rem;
        border-radius: 8px;
        outline: none;
        transition: all 0.2s ease;
      }
      .mg-runic-input:focus {
        border-color: #ffd700;
        box-shadow: 0 0 14px rgba(212, 175, 55, 0.45);
      }
      .mg-btn {
        cursor: pointer;
        font-family: 'Cinzel', Georgia, serif;
        font-weight: 600;
        font-size: 0.94rem;
        letter-spacing: 0.05em;
        padding: 0.68rem 1.2rem;
        border-radius: 8px;
        border: 1px solid #d4af37;
        background: linear-gradient(135deg, #d4af37 0%, #9e7a1c 100%);
        color: #120d1a;
        transition: all 0.2s ease;
        box-shadow: 0 4px 14px rgba(212, 175, 55, 0.28);
      }
      .mg-btn:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(212, 175, 55, 0.45);
        filter: brightness(1.08);
      }
      .mg-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .mg-btn-secondary {
        background: rgba(212, 175, 55, 0.12);
        color: #f3df9d;
        border: 1px solid rgba(212, 175, 55, 0.45);
        box-shadow: none;
      }
      .mg-btn-secondary:hover:not(:disabled) {
        background: rgba(212, 175, 55, 0.24);
      }
      .mg-btn-crimson {
        background: linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%);
        color: #fff5f5;
        border-color: #f87171;
      }
      .mg-feedback {
        margin-top: 0.85rem;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        font-size: 1rem;
        line-height: 1.45;
        display: none;
      }
      .mg-feedback.show {
        display: block;
        animation: mgFadeIn 0.25s ease;
      }
      .mg-feedback.ok {
        background: rgba(22, 101, 52, 0.35);
        border: 1px solid #4ade80;
        color: #dcfce7;
      }
      .mg-feedback.err {
        background: rgba(127, 29, 29, 0.45);
        border: 1px solid #f87171;
        color: #fee2e2;
      }
      .mg-feedback.info {
        background: rgba(212, 175, 55, 0.15);
        border: 1px solid rgba(212, 175, 55, 0.5);
        color: #fef08a;
      }
      @keyframes mgFadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
      }
      /* Bandeau d'indices & bouton d'aperçu */
      .mg-footer-bar {
        margin-top: 1.25rem;
        padding-top: 0.95rem;
        border-top: 1px dashed rgba(212, 175, 55, 0.3);
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
      }
      .mg-hints-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.6rem;
      }
      .mg-hint-btn {
        cursor: pointer;
        font-family: inherit;
        font-size: 0.92rem;
        padding: 0.44rem 0.9rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(212, 175, 55, 0.38);
        color: #e7d8b1;
        transition: all 0.2s;
      }
      .mg-hint-btn:hover {
        background: rgba(212, 175, 55, 0.18);
        color: #fff;
      }
      .mg-lunar-btn {
        cursor: pointer;
        font-family: 'Cinzel', Georgia, serif;
        font-size: 0.86rem;
        padding: 0.46rem 0.95rem;
        border-radius: 999px;
        background: linear-gradient(135deg, #312e81 0%, #581c87 50%, #1e1b4b 100%);
        border: 1px solid #c084fc;
        color: #f3e8ff;
        box-shadow: 0 0 15px rgba(192, 132, 252, 0.4);
        transition: all 0.25s;
      }
      .mg-lunar-btn:hover {
        box-shadow: 0 0 22px rgba(192, 132, 252, 0.75);
        transform: translateY(-1px);
      }
      .mg-hint-reveal {
        font-size: 0.96rem;
        padding: 0.65rem 0.95rem;
        border-radius: 8px;
        background: rgba(20, 16, 32, 0.88);
        border: 1px solid rgba(212, 175, 55, 0.35);
        color: #f5e0a3;
        display: none;
        line-height: 1.45;
      }
      .mg-hint-reveal.show {
        display: block;
      }
      .mg-hint-reveal.lunar {
        border-color: #c084fc;
        background: rgba(46, 16, 101, 0.45);
        color: #f3e8ff;
      }
      .mg-preview-row {
        display: flex;
        justify-content: flex-end;
        margin-top: 0.2rem;
      }
      .mg-preview-unlock-btn {
        cursor: pointer;
        font-size: 0.78rem;
        font-family: inherit;
        color: rgba(212, 175, 55, 0.65);
        background: rgba(0, 0, 0, 0.35);
        border: 1px dashed rgba(212, 175, 55, 0.35);
        padding: 0.3rem 0.7rem;
        border-radius: 6px;
        transition: all 0.2s;
      }
      .mg-preview-unlock-btn:hover {
        color: #ffd700;
        border-color: #ffd700;
        background: rgba(212, 175, 55, 0.14);
      }
      /* QCM / Options */
      .mg-options-list {
        display: flex;
        flex-direction: column;
        gap: 0.55rem;
        margin-top: 0.75rem;
      }
      .mg-option-btn {
        cursor: pointer;
        text-align: left;
        font-family: inherit;
        font-size: 1.02rem;
        line-height: 1.4;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(212, 175, 55, 0.32);
        color: #f5ebd6;
        transition: all 0.2s;
      }
      .mg-option-btn:hover:not(:disabled) {
        background: rgba(212, 175, 55, 0.18);
        border-color: #d4af37;
        transform: translateX(4px);
      }
      .mg-option-btn.correct {
        background: rgba(22, 101, 52, 0.5);
        border-color: #4ade80;
        color: #fff;
      }
      .mg-option-btn.wrong {
        background: rgba(127, 29, 29, 0.5);
        border-color: #f87171;
      }
      /* Progress bar & Boss Hearts */
      .mg-progress-track {
        width: 100%;
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 999px;
        overflow: hidden;
        margin-bottom: 0.9rem;
      }
      .mg-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #d4af37, #facc15, #e63946);
        transition: width 0.35s ease;
      }
      .mg-boss-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 0.6rem;
        padding: 0.75rem 1rem;
        background: linear-gradient(90deg, rgba(127, 29, 29, 0.45), rgba(20, 12, 28, 0.8));
        border: 1px solid rgba(239, 68, 68, 0.5);
        border-radius: 10px;
        margin-bottom: 0.95rem;
      }
      .mg-boss-hearts {
        display: flex;
        gap: 0.45rem;
        font-size: 1.35rem;
      }
      .mg-heart {
        transition: transform 0.3s, opacity 0.3s;
      }
      .mg-heart.lost {
        opacity: 0.22;
        filter: grayscale(1);
        transform: scale(0.8);
      }
      /* Wordle */
      .mg-wordle-grid {
        display: flex;
        flex-direction: column;
        gap: 6px;
        align-items: center;
        margin: 0.9rem 0;
      }
      .mg-wordle-row {
        display: flex;
        gap: 6px;
      }
      .mg-wordle-tile {
        width: 38px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Cinzel', Georgia, serif;
        font-weight: 700;
        font-size: 1.15rem;
        border: 1.5px solid rgba(212, 175, 55, 0.38);
        border-radius: 6px;
        background: rgba(12, 10, 18, 0.85);
        color: #fff;
        transition: transform 0.35s, background 0.35s, border-color 0.35s;
      }
      @media (max-width: 480px) {
        .mg-wordle-tile {
          width: 31px;
          height: 37px;
          font-size: 0.96rem;
        }
      }
      .mg-wordle-tile.flip {
        transform: rotateX(360deg);
      }
      .mg-wordle-tile.correct {
        background: #d4af37;
        color: #140f1d;
        border-color: #ffd700;
        box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
      }
      .mg-wordle-tile.present {
        background: #c87533;
        color: #fff;
        border-color: #f59e0b;
      }
      .mg-wordle-tile.absent {
        background: #1f1b29;
        color: #6b637b;
        border-color: #352f44;
      }
      .mg-kbd {
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-items: center;
        margin-top: 0.75rem;
      }
      .mg-kbd-row {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .mg-key {
        cursor: pointer;
        font-family: 'Cinzel', serif;
        font-size: 0.84rem;
        font-weight: 600;
        min-width: 28px;
        height: 35px;
        padding: 0 6px;
        border-radius: 5px;
        border: 1px solid rgba(212, 175, 55, 0.35);
        background: rgba(255, 255, 255, 0.08);
        color: #f5ebd6;
      }
      .mg-key.correct { background: #d4af37; color: #120d1a; }
      .mg-key.present { background: #c87533; color: #fff; }
      .mg-key.absent { background: #181420; color: #554e63; }
      /* Cryptex */
      .mg-cryptex-cylinder {
        display: flex;
        justify-content: center;
        gap: 0.85rem;
        margin: 1.1rem 0;
        flex-wrap: wrap;
      }
      .mg-cryptex-dial {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: linear-gradient(180deg, #2a2112, #151009);
        border: 2px solid #d4af37;
        border-radius: 10px;
        padding: 0.5rem;
        width: 72px;
        box-shadow: inset 0 0 12px rgba(0,0,0,0.8), 0 6px 16px rgba(0,0,0,0.5);
      }
      .mg-dial-btn {
        cursor: pointer;
        background: none;
        border: none;
        color: #d4af37;
        font-size: 1.15rem;
        padding: 0.2rem 0.6rem;
      }
      .mg-dial-letter {
        font-family: 'Cinzel', serif;
        font-size: 1.85rem;
        font-weight: 700;
        color: #ffd700;
        padding: 0.3rem 0;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.45);
      }
      /* Tarot Memory 3D */
      .mg-tarot-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.65rem;
        margin: 0.9rem 0;
      }
      @media (max-width: 500px) {
        .mg-tarot-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      .mg-tarot-card {
        cursor: pointer;
        height: 112px;
        perspective: 800px;
      }
      .mg-tarot-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transition: transform 0.5s;
        transform-style: preserve-3d;
      }
      .mg-tarot-card.flipped .mg-tarot-inner,
      .mg-tarot-card.matched .mg-tarot-inner {
        transform: rotateY(180deg);
      }
      .mg-tarot-face {
        position: absolute;
        inset: 0;
        backface-visibility: hidden;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0.4rem;
        text-align: center;
      }
      .mg-tarot-back {
        background: radial-gradient(circle, #2a183b 0%, #12091c 100%);
        border: 1.5px solid #d4af37;
        color: #d4af37;
        font-size: 1.4rem;
      }
      .mg-tarot-front {
        transform: rotateY(180deg);
        background: linear-gradient(145deg, #3b121e, #190914);
        border: 1.5px solid #f59e0b;
        color: #fde68a;
        font-size: 0.82rem;
        font-family: 'Cinzel', serif;
      }
      .mg-tarot-card.matched .mg-tarot-front {
        border-color: #4ade80;
        box-shadow: 0 0 12px rgba(74, 222, 128, 0.45);
      }
      /* Maram Compass 5x5 */
      .mg-sea-grid {
        display: grid;
        grid-template-columns: repeat(5, 48px);
        grid-template-rows: repeat(5, 48px);
        gap: 5px;
        justify-content: center;
        margin: 0.9rem auto;
      }
      .mg-sea-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        background: rgba(14, 42, 71, 0.65);
        border: 1px solid rgba(56, 189, 248, 0.3);
        border-radius: 6px;
      }
      .mg-sea-cell.ship {
        background: rgba(212, 175, 55, 0.35);
        border-color: #ffd700;
        box-shadow: 0 0 12px rgba(255, 215, 0, 0.5);
      }
      .mg-sea-cell.visited {
        background: rgba(56, 189, 248, 0.18);
      }
      /* Typewriter sheet */
      .mg-paper-sheet {
        background: #f5ecd7;
        color: #261c14;
        font-family: 'Courier New', Courier, monospace;
        padding: 1.1rem;
        border-radius: 6px;
        border: 1px solid #c2a878;
        box-shadow: inset 0 0 18px rgba(139, 105, 53, 0.25), 0 6px 16px rgba(0,0,0,0.45);
        min-height: 110px;
        margin: 0.85rem 0;
        line-height: 1.5;
        font-size: 0.94rem;
      }
      /* Sliding puzzle 3x3 */
      .mg-sliding-grid {
        display: grid;
        grid-template-columns: repeat(3, 84px);
        grid-template-rows: repeat(3, 84px);
        gap: 6px;
        justify-content: center;
        margin: 0.9rem auto;
      }
      .mg-slide-tile {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: linear-gradient(145deg, #1e293b, #0f172a);
        border: 1.5px solid #93c5fd;
        color: #f8fafc;
        font-family: 'Cinzel', serif;
        transition: all 0.18s;
        user-select: none;
        padding: 4px;
        text-align: center;
      }
      .mg-slide-tile.selected {
        border-color: #ffd700;
        box-shadow: 0 0 14px rgba(255, 215, 0, 0.7);
        transform: scale(1.04);
      }
      .mg-slide-tile.empty {
        background: rgba(255, 255, 255, 0.03);
        border: 1px dashed rgba(147, 197, 253, 0.35);
      }
      .mg-slide-tile.correct-pos {
        border-color: #4ade80;
        background: linear-gradient(145deg, #14532d, #064e3b);
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================================================
  // 3. COMPOSANTS COMMUNS (INDICES, SORT DE LUNE D'ALDRYN, BOUTON APERÇU)
  // ============================================================================
  function buildCommonFooter(wrapper, dayData, callbacks, extraVictoryPayloadGetter) {
    const gc = (dayData && dayData.gameConfig) || {};
    const dayNum = (dayData && (dayData.day || dayData.id)) || 1;
    const hasLunar =
      Boolean(callbacks && callbacks.hasLunarPower) || dayNum >= 4;

    const hintsArr = Array.isArray(gc.hints) ? gc.hints : [];
    const standardHint =
      hintsArr[0] ||
      gc.hint ||
      dayData.hint ||
      (gc.partA && gc.partA.hint) ||
      "Observe attentivement les indices littéraires du parchemin : chaque détail de vos lectures cache la clé.";

    const lunarHint =
      hintsArr[1] ||
      gc.lunarHint ||
      dayData.lunarHint ||
      hintsArr[0] ||
      "Suis la lueur dorée du grimoire ou utilise le bouton Mode Aperçu en bas à droite pour ouvrir directement le coffre.";

    const footer = document.createElement('div');
    footer.className = 'mg-footer-bar';

    const hintsRow = document.createElement('div');
    hintsRow.className = 'mg-hints-row';

    const stdBtn = document.createElement('button');
    stdBtn.type = 'button';
    stdBtn.className = 'mg-hint-btn';
    stdBtn.innerHTML = '🕯️ Besoin d’un murmure ?';

    const stdBox = document.createElement('div');
    stdBox.className = 'mg-hint-reveal';
    stdBox.innerHTML = `<strong>Murmure du Grimoire :</strong> ${formatRichText(standardHint)}`;

    stdBtn.addEventListener('click', () => {
      sfx.click();
      stdBox.classList.toggle('show');
    });
    hintsRow.appendChild(stdBtn);

    let lunarBox = null;
    if (hasLunar) {
      const lunarBtn = document.createElement('button');
      lunarBtn.type = 'button';
      lunarBtn.className = 'mg-lunar-btn';
      lunarBtn.innerHTML = '🌙 Invoquer ton Sort de Lune d’Aldryn';

      lunarBox = document.createElement('div');
      lunarBox.className = 'mg-hint-reveal lunar';
      lunarBox.innerHTML = `<strong>✨ Sort de Lune d’Aldryn :</strong> ${formatRichText(lunarHint)}`;

      if (callbacks && callbacks.isLunarHintUsed) {
        lunarBox.classList.add('show');
      }

      lunarBtn.addEventListener('click', () => {
        sfx.chime();
        if (callbacks && typeof callbacks.onUseLunarHint === 'function') {
          callbacks.onUseLunarHint();
        }
        lunarBox.classList.add('show');
      });
      hintsRow.appendChild(lunarBtn);
    }

    footer.appendChild(hintsRow);
    footer.appendChild(stdBox);
    if (lunarBox) footer.appendChild(lunarBox);

    // Bouton discret en bas à droite : Mode Aperçu / Débloquer ce coffre
    const previewRow = document.createElement('div');
    previewRow.className = 'mg-preview-row';

    const previewBtn = document.createElement('button');
    previewBtn.type = 'button';
    previewBtn.className = 'mg-preview-unlock-btn';
    previewBtn.innerHTML = '⚡ Mode Aperçu / Débloquer ce coffre';
    previewBtn.title = 'Débloquer immédiatement ce coffre (très utile pour tester l’ouverture des 24 coffres en 1 clic)';
    previewBtn.addEventListener('click', (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      sfx.chime();
      sfx.burst(rect.left + rect.width / 2, rect.top, dayData && dayData.rarity ? dayData.rarity : 'common');
      const payload =
        typeof extraVictoryPayloadGetter === 'function'
          ? extraVictoryPayloadGetter()
          : {};
      if (callbacks && typeof callbacks.onVictory === 'function') {
        callbacks.onVictory(Object.assign({ previewBypass: true }, payload));
      }
    });

    previewRow.appendChild(previewBtn);
    footer.appendChild(previewRow);
    wrapper.appendChild(footer);
  }

  function triggerShake(el) {
    if (!el) return;
    el.classList.remove('mg-shake');
    void el.offsetWidth;
    el.classList.add('mg-shake');
  }

  function completeGame(wrapper, dayData, callbacks, extraData = {}) {
    sfx.chime();
    const rect = wrapper.getBoundingClientRect();
    sfx.burst(
      rect.left + rect.width / 2,
      rect.top + rect.height / 3,
      (dayData && dayData.rarity) || 'common'
    );
    if (callbacks && typeof callbacks.onVictory === 'function') {
      callbacks.onVictory(extraData);
    }
  }

  // Helper universel pour poser une sous-question QCM ou texte (bonusQuestion / followUpQuestion / finalQuestion / cozyQuestion)
  function renderFollowUpQuestionBox(stage, wrapper, qObj, badgeTitle, onDone) {
    const qText = qObj.question || qObj.prompt || 'Question finale de validation :';
    const hasOptions = Array.isArray(qObj.options) && qObj.options.length > 0;

    if (hasOptions) {
      stage.innerHTML = `
        <div class="mg-question-box">
          <div class="mg-header-badge">${escapeHtml(badgeTitle)}</div>
          <p style="font-size:1.1rem; line-height:1.5; margin:0 0 0.75rem 0;">${formatRichText(qText)}</p>
          <div class="mg-options-list" id="mg-subq-opts"></div>
          <div class="mg-feedback" id="mg-subq-fb"></div>
        </div>
      `;

      const list = stage.querySelector('#mg-subq-opts');
      const fb = stage.querySelector('#mg-subq-fb');

      qObj.options.forEach((o, idx) => {
        const text = typeof o === 'string' ? o : o.text || o.label || '';
        const isCorr =
          typeof o === 'object' && o.isCorrect !== undefined
            ? Boolean(o.isCorrect)
            : typeof o === 'object' && o.correct !== undefined
            ? Boolean(o.correct)
            : qObj.correctOptionId !== undefined && typeof o === 'object'
            ? o.id === qObj.correctOptionId
            : qObj.correctIndex !== undefined
            ? idx === qObj.correctIndex
            : idx === 0;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mg-option-btn';
        btn.innerHTML = formatRichText(text);
        btn.addEventListener('click', () => {
          if (isCorr) {
            sfx.chime();
            btn.classList.add('correct');
            list.querySelectorAll('button').forEach((b) => (b.disabled = true));
            fb.className = 'mg-feedback show ok';
            fb.innerHTML = formatRichText(qObj.explanation || '✨ Réponse parfaite ! Le sceau s’ouvre !');
            setTimeout(() => onDone(), 650);
          } else {
            sfx.error();
            triggerShake(wrapper);
            btn.classList.add('wrong');
            fb.className = 'mg-feedback show err';
            fb.innerHTML = formatRichText(
              qObj.wrongFeedback || 'Le sceau crépite... Ce n’est pas cette réponse !'
            );
          }
        });
        list.appendChild(btn);
      });
    } else {
      const accepted =
        qObj.expectedAnswers || qObj.answers || qObj.answer || ['OUI'];
      const placeholder = qObj.placeholder || 'Inscris ta réponse...';

      stage.innerHTML = `
        <div class="mg-question-box">
          <div class="mg-header-badge">${escapeHtml(badgeTitle)}</div>
          <p style="font-size:1.1rem; line-height:1.5; margin:0 0 0.75rem 0;">${formatRichText(qText)}</p>
          <div class="mg-input-row">
            <input type="text" class="mg-runic-input" id="mg-subq-inp" placeholder="${escapeHtml(placeholder)}" autocomplete="off" />
            <button type="button" class="mg-btn" id="mg-subq-btn">Valider le Sceau ✨</button>
          </div>
          <div class="mg-feedback" id="mg-subq-fb"></div>
        </div>
      `;

      const inp = stage.querySelector('#mg-subq-inp');
      const btn = stage.querySelector('#mg-subq-btn');
      const fb = stage.querySelector('#mg-subq-fb');

      const verify = () => {
        if (matchesAnyAnswer(inp.value, accepted)) {
          sfx.chime();
          fb.className = 'mg-feedback show ok';
          fb.innerHTML = '<strong>✨ Sceau Validé !</strong>';
          setTimeout(() => onDone(), 650);
        } else {
          sfx.error();
          triggerShake(wrapper);
          fb.className = 'mg-feedback show err';
          fb.textContent = "Le sceau résiste... Vérifie l'orthographe ou consulte l'indice ci-dessous.";
        }
      };

      btn.addEventListener('click', verify);
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') verify();
      });
      setTimeout(() => { if (inp && typeof inp.focus === "function") inp.focus(); }, 50);
    }
  }

  // ============================================================================
  // 4. LES 22 MOTEURS DE MINI-JEUX SPÉCIALISÉS
  // ============================================================================

  /**
   * 1. "password" (Jours 1, 7)
   * Supporte riddleText / expectedAnswers / placeholder + bonusQuestion (QCM ou texte)
   */
  function renderPasswordGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const dayNum = (dayData && (dayData.day || dayData.id)) || 1;

    const promptText =
      gc.riddleText ||
      gc.question ||
      gc.prompt ||
      (dayNum === 7
        ? "Quel est le nom du pays aux falaises d’émeraude où notre voyage amoureux a croisé *N’invite pas la forêt à entrer* ?"
        : "Je porte une couronne d’or mais je n’ai pas de voix, j’accompagne Evie Sage et le Vilain. Quel est mon prénom en 8 lettres ?");

    const expected =
      gc.expectedAnswers ||
      gc.answers ||
      gc.answer ||
      (dayNum === 7
        ? ['IRLANDE', 'IRELAND', 'EIRE']
        : ['KINGSLEY', 'ROI KINGSLEY', 'VILAIN']);

    const placeholder =
      gc.placeholder || 'Inscris le mot de passe runique...';
    const bonusQ = gc.bonusQuestion || gc.subQuestion || gc.followUpQuestion || null;

    function renderStep1() {
      stage.innerHTML = `
        <div class="mg-question-box">
          <div class="mg-header-badge">${escapeHtml(gc.promptTitle || `Sceau Runique du Jour ${dayNum}`)}</div>
          <p style="font-size:1.1rem; line-height:1.55; margin:0 0 0.75rem 0;">${formatRichText(promptText)}</p>
          <div class="mg-input-row">
            <input type="text" class="mg-runic-input" id="mg-pwd-input" placeholder="${escapeHtml(placeholder)}" autocomplete="off" />
            <button type="button" class="mg-btn" id="mg-pwd-submit">Desceller la Rune ✨</button>
          </div>
          <div class="mg-feedback" id="mg-pwd-fb"></div>
        </div>
      `;

      const input = stage.querySelector('#mg-pwd-input');
      const btn = stage.querySelector('#mg-pwd-submit');
      const fb = stage.querySelector('#mg-pwd-fb');

      const validate = () => {
        if (matchesAnyAnswer(input.value, expected)) {
          sfx.chime();
          fb.className = 'mg-feedback show ok';
          fb.innerHTML = '<strong>✨ Mot de passe accepté !</strong> La rune s’illumine d’or !';
          input.disabled = true;
          btn.disabled = true;

          setTimeout(() => {
            if (bonusQ) {
              renderFollowUpQuestionBox(
                stage,
                wrapper,
                bonusQ,
                'Étape 2 / 2 — Validation du Sceau Bonus',
                () => completeGame(wrapper, dayData, callbacks)
              );
            } else {
              completeGame(wrapper, dayData, callbacks);
            }
          }, 600);
        } else {
          sfx.error();
          triggerShake(wrapper);
          fb.className = 'mg-feedback show err';
          fb.textContent =
            "Le sceau magique résiste... Vérifie ta réponse ou consulte un murmure ci-dessous.";
        }
      };

      btn.addEventListener('click', validate);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          validate();
        }
      });
      setTimeout(() => { if (input && typeof input.focus === "function") input.focus(); }, 50);
    }

    renderStep1();
  }

  /**
   * 2. "troll_quiz" / "grand_council_quiz" (Jours 2, 23)
   * Supporte questions[].options[].id + correctOptionId + sentinel + explanation
   */
  function renderQuizGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const rawQuestions = gc.questions || dayData.questions || [];

    const questions = rawQuestions.map((q) => {
      const opts = (q.options || q.choices || []).map((o, idx) => {
        if (typeof o === 'string') {
          const isCorr =
            q.correctIndex !== undefined ? idx === q.correctIndex : idx === 0;
          return {
            text: o,
            correct: isCorr,
            feedback: isCorr ? q.explanation || 'Exact !' : 'Hum, réessaie !'
          };
        }
        const isCorr =
          Boolean(o.correct || o.isCorrect) ||
          (q.correctOptionId !== undefined && o.id === q.correctOptionId) ||
          (q.correctIndex !== undefined && idx === q.correctIndex);
        return {
          text: o.text || o.label || '',
          correct: isCorr,
          feedback:
            o.feedback ||
            (isCorr
              ? q.explanation || 'Réponse magistrale !'
              : 'Le Conseil fronce les sourcils... Ce n’est pas la bonne option !')
        };
      });

      if (opts.length > 0 && !opts.some((o) => o.correct)) {
        opts[0].correct = true;
      }

      return {
        sentinel: q.sentinel || gc.promptTitle || '',
        question: q.question || q.prompt || '',
        options: opts,
        explanation: q.explanation || q.lore || ''
      };
    });

    let qIdx = 0;

    function renderQ() {
      const q = questions[qIdx];
      const pct = Math.round((qIdx / questions.length) * 100);

      stage.innerHTML = `
        <div class="mg-progress-track">
          <div class="mg-progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="mg-question-box">
          <div class="mg-header-badge">
            ${escapeHtml(q.sentinel || `Épreuve ${qIdx + 1} sur ${questions.length}`)}
          </div>
          <p style="font-size:1.1rem; line-height:1.5; margin:0 0 0.75rem 0;">${formatRichText(q.question)}</p>
          <div class="mg-options-list" id="mg-quiz-opts"></div>
          <div class="mg-feedback" id="mg-quiz-fb"></div>
          <div style="margin-top:0.85rem; display:none;" id="mg-quiz-next-wrap">
            <button type="button" class="mg-btn" id="mg-quiz-next-btn">
              ${qIdx + 1 < questions.length ? 'Épreuve Suivante →' : 'Valider le Verdict & Ouvrir le Coffre ✨'}
            </button>
          </div>
        </div>
      `;

      const optsContainer = stage.querySelector('#mg-quiz-opts');
      const fb = stage.querySelector('#mg-quiz-fb');
      const nextWrap = stage.querySelector('#mg-quiz-next-wrap');
      const nextBtn = stage.querySelector('#mg-quiz-next-btn');

      q.options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mg-option-btn';
        btn.innerHTML = formatRichText(opt.text);

        btn.addEventListener('click', () => {
          if (opt.correct) {
            sfx.chime();
            btn.classList.add('correct');
            optsContainer.querySelectorAll('button').forEach((b) => (b.disabled = true));
            fb.className = 'mg-feedback show ok';
            fb.innerHTML = `<strong>✨ ${formatRichText(opt.feedback)}</strong>`;
            nextWrap.style.display = 'block';
          } else {
            sfx.error();
            btn.classList.add('wrong');
            triggerShake(wrapper);
            fb.className = 'mg-feedback show err';
            fb.innerHTML = `<strong>💬 ${formatRichText(opt.feedback)}</strong>`;
          }
        });

        optsContainer.appendChild(btn);
      });

      nextBtn.addEventListener('click', () => {
        sfx.click();
        qIdx++;
        if (qIdx < questions.length) {
          renderQ();
        } else {
          completeGame(wrapper, dayData, callbacks);
        }
      });
    }

    renderQ();
  }

  /**
   * 3. "book_wordle" (Jour 3 - DAEVABAD)
   * Supporte gc.targetWord, gc.loreClue, gc.maxAttempts
   */
  function renderBookWordleGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const targetWord =
      normalizeAnswer(gc.targetWord || gc.word || gc.answer || 'DAEVABAD') ||
      'DAEVABAD';
    const wordLen = targetWord.length;
    const maxAttempts = gc.maxAttempts || 6;

    let currentRow = 0;
    let currentGuess = '';
    let gameOver = false;

    stage.innerHTML = `
      <div class="mg-question-box" style="text-align:center;">
        <div class="mg-header-badge">${escapeHtml(gc.promptTitle || `Wordle Littéraire (${wordLen} lettres)`)}</div>
        <p style="margin:0 0 0.6rem 0; font-size:1.05rem; line-height:1.45;">
          ${formatRichText(gc.loreClue || gc.question || "Retrouve le nom en 8 lettres de la légendaire cité de laiton de S.A. Chakraborty :")}
        </p>
        <div style="font-size:0.84rem; color:#d4af37; margin-bottom:0.5rem;">
          🟨 Or = Bien placée &nbsp;|&nbsp; 🟧 Cuivre = Présente ailleurs &nbsp;|&nbsp; ⬛ Obsidienne = Absente
        </div>
        <div class="mg-wordle-grid" id="mg-wordle-grid"></div>
        <div class="mg-feedback" id="mg-wordle-fb"></div>
        <div class="mg-kbd" id="mg-wordle-kbd"></div>
      </div>
    `;

    const gridEl = stage.querySelector('#mg-wordle-grid');
    const fbEl = stage.querySelector('#mg-wordle-fb');
    const kbdEl = stage.querySelector('#mg-wordle-kbd');

    const tileEls = [];
    for (let r = 0; r < maxAttempts; r++) {
      const rowEl = document.createElement('div');
      rowEl.className = 'mg-wordle-row';
      const rowTiles = [];
      for (let c = 0; c < wordLen; c++) {
        const tile = document.createElement('div');
        tile.className = 'mg-wordle-tile';
        rowEl.appendChild(tile);
        rowTiles.push(tile);
      }
      gridEl.appendChild(rowEl);
      tileEls.push(rowTiles);
    }

    const rows = [
      ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
      ['⌫', 'W', 'X', 'C', 'V', 'B', 'N', 'VALIDER']
    ];
    const keyMap = {};

    rows.forEach((r) => {
      const rEl = document.createElement('div');
      rEl.className = 'mg-kbd-row';
      r.forEach((k) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mg-key';
        btn.textContent = k;
        if (k === 'VALIDER') {
          btn.style.padding = '0 10px';
          btn.style.background = 'rgba(212, 175, 55, 0.25)';
        }
        btn.addEventListener('click', () => handleKey(k));
        rEl.appendChild(btn);
        if (k.length === 1) keyMap[k] = btn;
      });
      kbdEl.appendChild(rEl);
    });

    function updateCurrentRowUI() {
      if (currentRow >= maxAttempts) return;
      for (let c = 0; c < wordLen; c++) {
        tileEls[currentRow][c].textContent = currentGuess[c] || '';
      }
    }

    function evaluateGuess(guess) {
      const res = new Array(wordLen).fill('absent');
      const targetChars = targetWord.split('');
      const guessChars = guess.split('');

      for (let i = 0; i < wordLen; i++) {
        if (guessChars[i] === targetChars[i]) {
          res[i] = 'correct';
          targetChars[i] = null;
          guessChars[i] = null;
        }
      }
      for (let i = 0; i < wordLen; i++) {
        if (guessChars[i] !== null) {
          const idx = targetChars.indexOf(guessChars[i]);
          if (idx !== -1) {
            res[i] = 'present';
            targetChars[idx] = null;
          }
        }
      }
      return res;
    }

    function submitGuess() {
      if (gameOver) return;
      if (currentGuess.length < wordLen) {
        sfx.error();
        triggerShake(wrapper);
        fbEl.className = 'mg-feedback show err';
        fbEl.textContent = `Inscris ${wordLen} lettres avant de valider !`;
        return;
      }

      const states = evaluateGuess(currentGuess);
      const rowTiles = tileEls[currentRow];
      const guessCopy = currentGuess;

      states.forEach((st, idx) => {
        setTimeout(() => {
          const tile = rowTiles[idx];
          tile.classList.add('flip', st);
          sfx.flip();
          const letter = guessCopy[idx];
          const kBtn = keyMap[letter];
          if (kBtn) {
            if (st === 'correct') {
              kBtn.className = 'mg-key correct';
            } else if (st === 'present' && !kBtn.classList.contains('correct')) {
              kBtn.className = 'mg-key present';
            } else if (
              st === 'absent' &&
              !kBtn.classList.contains('correct') &&
              !kBtn.classList.contains('present')
            ) {
              kBtn.className = 'mg-key absent';
            }
          }
        }, idx * 85);
      });

      setTimeout(() => {
        if (guessCopy === targetWord) {
          gameOver = true;
          fbEl.className = 'mg-feedback show ok';
          fbEl.innerHTML = `<strong>✨ ${targetWord} !</strong> ${formatRichText(gc.victoryLore || 'Les portes de laiton s’ouvrent devant Nahri et Dara !')}`;
          setTimeout(() => completeGame(wrapper, dayData, callbacks), 700);
        } else {
          currentRow++;
          currentGuess = '';
          if (currentRow >= maxAttempts) {
            sfx.error();
            fbEl.className = 'mg-feedback show info';
            fbEl.innerHTML = `Les sables ont recouvert la grille... Le mot commence par <strong>${targetWord.slice(0, 4)}...</strong> Une nouvelle page s’ouvre !`;
            setTimeout(() => {
              currentRow = 0;
              currentGuess = '';
              tileEls.forEach((r) =>
                r.forEach((t) => {
                  t.textContent = '';
                  t.className = 'mg-wordle-tile';
                })
              );
            }, 1400);
          }
        }
      }, wordLen * 90 + 110);
    }

    function handleKey(k) {
      if (gameOver) return;
      if (k === '⌫' || k === 'BACKSPACE') {
        if (currentGuess.length > 0) {
          sfx.click();
          currentGuess = currentGuess.slice(0, -1);
          updateCurrentRowUI();
        }
      } else if (k === 'VALIDER' || k === 'ENTER') {
        submitGuess();
      } else if (/^[A-Z]$/.test(k)) {
        if (currentGuess.length < wordLen) {
          sfx.click();
          currentGuess += k;
          updateCurrentRowUI();
        }
      }
    }

    const onKeyDown = (e) => {
      if (!document.body.contains(stage)) {
        window.removeEventListener('keydown', onKeyDown);
        return;
      }
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }
      const key = e.key.toUpperCase();
      if (key === 'BACKSPACE' || key === 'ENTER' || /^[A-Z]$/.test(key)) {
        handleKey(key);
      }
    };
    window.addEventListener('keydown', onKeyDown);
  }

  /**
   * 4. "aldryn_ritual" (Jour 4 - Curious Tides & Foire de Mons Hades)
   * Supporte gc.partA (loreDescription, question, expectedAnswers)
   * et gc.partB (dilemmas[].choices[].house avec IDs NEW_MOON, WAXING_MOON, FULL_MOON, WANING_MOON)
   * + window.ALDRYN_HOUSES
   */
  function renderAldrynRitualGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const partA = gc.partA || {};
    const partB = gc.partB || {};

    const step1Answers =
      partA.expectedAnswers || gc.gateAnswer || ['HADES', 'HADÈS', 'HADES II'];
    const dilemmas = partB.dilemmas || gc.dilemmas || [];

    const scores = {
      NEW_MOON: 0,
      WAXING_MOON: 0,
      FULL_MOON: 0,
      WANING_MOON: 0
    };

    const fallbackHouses = {
      NEW_MOON: {
        id: 'NEW_MOON',
        name: 'Maison de la Nouvelle Lune',
        totemName: 'La Phalène des Abysses Étoilées',
        totemIcon: '🌑',
        motto: '« Ce que l’ombre engloutit, la mémoire le murmure aux profondeurs. »',
        description: 'Tu lis entre les lignes et perces les secrets les mieux gardés d’Aldryn.'
      },
      WAXING_MOON: {
        id: 'WAXING_MOON',
        name: 'Maison de la Lune Croissante',
        totemName: 'Le Cerf d’Écume & de Laiton',
        totemIcon: '🌒',
        motto: '« Avec la marée montante s’éveillent les mondes que l’on ose rêver. »',
        description: 'Ton enthousiasme à la Foire de Mons et sur @lau.libraryyy fait lever des océans.'
      },
      FULL_MOON: {
        id: 'FULL_MOON',
        name: 'Maison de la Pleine Lune',
        totemName: 'Le Phénix d’Argent & de Feu',
        totemIcon: '🌕',
        motto: '« Sous l’astre souverain, aucune chaîne ni aucun trône ne nous résiste. »',
        description: 'Flamboyante, entière et passionnée dans tous tes coups de cœur littéraires !'
      },
      WANING_MOON: {
        id: 'WANING_MOON',
        name: 'Maison de la Lune Décroissante',
        totemName: 'Le Corbeau d’Obsidienne & de Brume',
        totemIcon: '🌘',
        motto: '« Quand la mer se retire, seule la vérité nue demeure sur le sable. »',
        description: 'Gardienne de la mémoire du couple et critique littéraire redoutable !'
      }
    };

    function renderGateStep() {
      stage.innerHTML = `
        <div class="mg-question-box">
          <div class="mg-header-badge">${escapeHtml(partA.title || 'Étape 1 / 3 — La Porte des Coquelicots de Mons')}</div>
          ${partA.loreDescription ? `<p style="font-size:1.02rem; opacity:0.92; line-height:1.5;">${formatRichText(partA.loreDescription)}</p>` : ''}
          <p style="font-size:1.1rem; font-weight:600; line-height:1.5;">
            ${formatRichText(partA.question || "Quel est le nom du jeu vidéo mythologique (et dieu des Enfers) qui a inspiré l’autrice de *L’Effondrement* à Mons ?")}
          </p>
          <div class="mg-input-row">
            <input type="text" class="mg-runic-input" id="mg-aldryn-pwd" placeholder="${escapeHtml(partA.placeholder || 'Nom du dieu des Enfers (5 lettres)...')}" autocomplete="off" />
            <button type="button" class="mg-btn" id="mg-aldryn-gate-btn">Ouvrir le Portail 🌺</button>
          </div>
          <div class="mg-feedback" id="mg-aldryn-fb"></div>
        </div>
      `;

      const inp = stage.querySelector('#mg-aldryn-pwd');
      const btn = stage.querySelector('#mg-aldryn-gate-btn');
      const fb = stage.querySelector('#mg-aldryn-fb');

      const check = () => {
        if (matchesAnyAnswer(inp.value, step1Answers)) {
          sfx.chime();
          fb.className = 'mg-feedback show ok';
          fb.textContent = 'Les coquelicots de Mons s’écartent... Bienvenue sous les voûtes lunaires d’Aldryn !';
          setTimeout(() => renderDilemmaStep(0), 650);
        } else {
          sfx.error();
          triggerShake(wrapper);
          fb.className = 'mg-feedback show err';
          fb.textContent = partA.hint || "Pense au dieu grec des Enfers (H A D E S) !";
        }
      };

      btn.addEventListener('click', check);
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') check();
      });
    }

    function renderDilemmaStep(dIdx) {
      if (dIdx >= dilemmas.length) {
        renderCeremonyStep();
        return;
      }
      const d = dilemmas[dIdx];
      const pct = Math.round(((dIdx + 1) / (dilemmas.length + 1)) * 100);
      const choices = d.choices || d.options || [];

      stage.innerHTML = `
        <div class="mg-progress-track">
          <div class="mg-progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="mg-question-box">
          <div class="mg-header-badge">Étape 2 / 3 — Dilemme de Marée ${dIdx + 1} / ${dilemmas.length}</div>
          <p style="font-size:1.1rem; line-height:1.5;">${formatRichText(d.question)}</p>
          <div class="mg-options-list" id="mg-aldryn-opts"></div>
        </div>
      `;

      const list = stage.querySelector('#mg-aldryn-opts');
      const houseKeys = Object.keys(scores);

      choices.forEach((c, idx) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'mg-option-btn';
        const rawHouse = c.house || houseKeys[idx % houseKeys.length];
        b.innerHTML = formatRichText(c.text || c.label || '');
        b.addEventListener('click', () => {
          sfx.flip();
          scores[rawHouse] = (scores[rawHouse] || 0) + 1;
          renderDilemmaStep(dIdx + 1);
        });
        list.appendChild(b);
      });
    }

    function renderCeremonyStep() {
      let bestHouseId = 'FULL_MOON';
      let maxScore = -1;
      Object.entries(scores).forEach(([h, sc]) => {
        if (sc > maxScore) {
          maxScore = sc;
          bestHouseId = h;
        }
      });

      const housesCatalog = window.ALDRYN_HOUSES || fallbackHouses;
      const info = housesCatalog[bestHouseId] || fallbackHouses[bestHouseId] || fallbackHouses.FULL_MOON;

      sfx.chime();
      const rect = wrapper.getBoundingClientRect();
      sfx.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 'epic');

      stage.innerHTML = `
        <div class="mg-question-box" style="text-align:center; border-color:#c084fc; background:linear-gradient(145deg, rgba(46,16,101,0.48), rgba(15,23,42,0.9));">
          <div class="mg-header-badge" style="color:#e9d5ff; border-color:#c084fc;">Étape 3 / 3 — Cérémonie d’Intronisation d’Aldryn</div>
          <div style="font-size:3rem; margin:0.35rem 0;">${info.totemIcon || '🌕'}</div>
          <h3 class="mg-title" style="color:#f3e8ff;">${escapeHtml(info.name)}</h3>
          <p style="color:#e9d5ff; font-style:italic; margin:0.25rem 0;">${escapeHtml(info.motto || '')}</p>
          <p style="color:#facc15; font-weight:600; margin:0.45rem 0;">Totem Lunaire : ${escapeHtml(info.totemName)}</p>
          <p style="font-size:1.02rem; line-height:1.5; max-width:560px; margin:0.7rem auto;">${formatRichText(info.description)}</p>
          <div style="margin:0.95rem auto; padding:0.75rem; border-radius:8px; background:rgba(192,132,252,0.16); border:1px solid #c084fc; color:#f3e8ff;">
            🌙 <strong>Sort de Lune Permanent Débloqué : ${escapeHtml(info.spellName || 'Clairvoyance d’Aldryn')} !</strong><br>
            Tu peux désormais invoquer gratuitement l’Indice Lunaire dans tous les prochains défis du Calendrier !
          </div>
          <button type="button" class="mg-btn" id="mg-aldryn-claim">Sceller mon Pacte Lunaire & Ouvrir le Coffre ✨</button>
        </div>
      `;

      stage.querySelector('#mg-aldryn-claim').addEventListener('click', () => {
        completeGame(wrapper, dayData, callbacks, {
          aldrynHouse: info.id || bestHouseId,
          aldrynHouseName: info.name,
          aldrynTotem: info.totemName,
          unlockedLunarPower: true
        });
      });
    }

    renderGateStep();
  }

  /**
   * 5. "cryptex" (Jour 5 - Babel, Fourth Wing, Jade City)
   * Supporte gc.targetCode ('ATMR') et gc.dials[] (book, clue, targetLetter, unlockQuip)
   */
  function renderCryptexGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const targetCode =
      normalizeAnswer(gc.targetCode || gc.code || 'ATMR') || 'ATMR';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const dials = gc.dials || [];
    const dialCount = targetCode.length;

    const currentLetters = Array.from({ length: dialCount }, (_, idx) => {
      const targetChar = targetCode[idx];
      const offset = (alphabet.indexOf(targetChar) + 2 + idx * 3) % 26;
      return alphabet[offset];
    });

    stage.innerHTML = `
      <div class="mg-question-box">
        <div class="mg-header-badge">${escapeHtml(gc.promptTitle || 'Cylindre Cryptex à 4 Rouleaux')}</div>
        <div style="margin-bottom:0.85rem; font-size:0.97rem; line-height:1.45;">
          ${dials
            .map(
              (d) =>
                `<div style="margin-bottom:0.4rem;">🔹 ${formatRichText(d.clue || d.question || '')}</div>`
            )
            .join('')}
        </div>
        <div class="mg-cryptex-cylinder" id="mg-cryptex-dials"></div>
        <div style="text-align:center; margin-top:0.8rem;">
          <button type="button" class="mg-btn" id="mg-cryptex-unlock">Aligner le Cryptex 🔓</button>
        </div>
        <div class="mg-feedback" id="mg-cryptex-fb"></div>
      </div>
    `;

    const dialsContainer = stage.querySelector('#mg-cryptex-dials');
    const fb = stage.querySelector('#mg-cryptex-fb');

    currentLetters.forEach((letter, idx) => {
      const dial = document.createElement('div');
      dial.className = 'mg-cryptex-dial';
      dial.innerHTML = `
        <button type="button" class="mg-dial-btn" data-dir="-1" aria-label="Lettre précédente">▲</button>
        <div class="mg-dial-letter">${letter}</div>
        <button type="button" class="mg-dial-btn" data-dir="1" aria-label="Lettre suivante">▼</button>
        <span style="font-size:0.72rem; color:#c8b273;">Rouleau ${idx + 1}</span>
      `;

      dial.querySelectorAll('.mg-dial-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          sfx.typeKey();
          const dir = parseInt(btn.dataset.dir, 10);
          const curIdx = alphabet.indexOf(currentLetters[idx]);
          const nextIdx = (curIdx + dir + 26) % 26;
          currentLetters[idx] = alphabet[nextIdx];
          dial.querySelector('.mg-dial-letter').textContent = currentLetters[idx];

          // Affiche le petit commentaire drôle (unlockQuip) si le rouleau tombe sur la bonne lettre
          const dialCfg = dials[idx];
          if (dialCfg && currentLetters[idx] === targetCode[idx] && dialCfg.unlockQuip) {
            fb.className = 'mg-feedback show info';
            fb.innerHTML = formatRichText(dialCfg.unlockQuip);
          }
        });
      });

      dialsContainer.appendChild(dial);
    });

    stage.querySelector('#mg-cryptex-unlock').addEventListener('click', () => {
      const code = currentLetters.join('');
      if (code === targetCode) {
        sfx.crack();
        fb.className = 'mg-feedback show ok';
        fb.innerHTML = `<strong>✨ CLAC ! (${targetCode})</strong> ${formatRichText(gc.victoryLore || 'Les 4 rouleaux de bronze s’alignent !')}`;
        setTimeout(() => completeGame(wrapper, dayData, callbacks), 750);
      } else {
        sfx.error();
        triggerShake(wrapper);
        fb.className = 'mg-feedback show err';
        fb.textContent = `Le cylindre bloque sur « ${code} ». Aligne les 4 initiales grâce aux indices ci-dessus !`;
      }
    });
  }

  /**
   * 6. "boss_caten" (Jour 6 - BOSS 1 The Will of the Many)
   * Supporte gc.bossName, gc.rounds[] avec inputType ('text' ou 'mcq'), bossTaunt, expectedAnswers, options, correctOptionId, damageMessage
   */
  function renderBossCatenGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const rounds = gc.rounds || [];
    let currentRound = 0;
    const maxHearts = rounds.length || 3;

    function renderRound() {
      const r = rounds[currentRound];
      const remainingHearts = maxHearts - currentRound;
      let heartsHtml = '';
      for (let i = 0; i < maxHearts; i++) {
        heartsHtml += `<span class="mg-heart ${i >= remainingHearts ? 'lost' : ''}" title="Pilier de Volonté">🔺</span>`;
      }

      const isMcq = r.inputType === 'mcq' || (Array.isArray(r.options) && r.options.length > 0 && !r.expectedAnswers);

      stage.innerHTML = `
        <div class="mg-boss-bar">
          <div>
            <strong style="color:#fca5a5; font-family:'Cinzel',serif;">${escapeHtml(gc.bossAvatar || '🏛️')} ${escapeHtml(gc.bossName || 'LE GRAND PRÉCEPTEUR DU SÉNAT DE CATEN')}</strong>
            <div style="font-size:0.82rem; color:#fecaca;">Pyramide de Volonté : ${remainingHearts} / ${maxHearts} boucliers actifs</div>
          </div>
          <div class="mg-boss-hearts">${heartsHtml}</div>
        </div>
        <div class="mg-question-box">
          <div class="mg-header-badge">${escapeHtml(r.title || `Manche ${currentRound + 1} / ${maxHearts}`)}</div>
          <p style="font-size:1.1rem; line-height:1.5;">${formatRichText(r.bossTaunt || r.question)}</p>
          ${
            isMcq
              ? `<div id="mg-caten-choices" class="mg-options-list"></div>`
              : `
                <div class="mg-input-row">
                  <input type="text" class="mg-runic-input" id="mg-caten-inp" placeholder="${escapeHtml(r.placeholder || 'Frappe ta réponse...')}" autocomplete="off" />
                  <button type="button" class="mg-btn mg-btn-crimson" id="mg-caten-strike">Briser le Bouclier ⚡</button>
                </div>
              `
          }
          <div class="mg-feedback" id="mg-caten-fb"></div>
        </div>
      `;

      const fb = stage.querySelector('#mg-caten-fb');

      const onRoundSuccess = () => {
        sfx.bossHit();
        triggerShake(wrapper);
        const rect = wrapper.getBoundingClientRect();
        sfx.burst(rect.left + rect.width / 2, rect.top + 80, 'crimson');

        fb.className = 'mg-feedback show ok';
        fb.innerHTML = `<strong>${formatRichText(r.damageMessage || '💥 IMPACT CRITIQUE ! Le bouclier du Sénat vole en éclats !')}</strong>`;

        setTimeout(() => {
          currentRound++;
          if (currentRound < rounds.length) {
            renderRound();
          } else {
            completeGame(wrapper, dayData, callbacks);
          }
        }, 750);
      };

      if (isMcq) {
        const choicesEl = stage.querySelector('#mg-caten-choices');
        (r.options || []).forEach((o) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'mg-option-btn';
          b.innerHTML = formatRichText(o.text || o.label || '');
          b.addEventListener('click', () => {
            const isCorr =
              String(o.id || '').trim() === String(r.correctOptionId || '').trim() ||
              Boolean(o.isCorrect || o.correct);
            if (isCorr) {
              b.classList.add('correct');
              choicesEl.querySelectorAll('button').forEach((btn) => (btn.disabled = true));
              onRoundSuccess();
            } else {
              sfx.error();
              triggerShake(wrapper);
              b.classList.add('wrong');
              fb.className = 'mg-feedback show err';
              fb.textContent = 'La Pyramide de Caten repousse ton attaque ! Choisis l’échelon exact.';
            }
          });
          choicesEl.appendChild(b);
        });
      } else {
        const inp = stage.querySelector('#mg-caten-inp');
        const btn = stage.querySelector('#mg-caten-strike');
        const check = () => {
          if (matchesAnyAnswer(inp.value, r.expectedAnswers || r.answers || ['VIS'])) {
            inp.disabled = true;
            btn.disabled = true;
            onRoundSuccess();
          } else {
            sfx.error();
            triggerShake(wrapper);
            fb.className = 'mg-feedback show err';
            fb.textContent = 'Le bouclier de Volonté résiste ! Vérifie le terme exact ou consulte l’indice.';
          }
        };
        btn.addEventListener('click', check);
        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') check();
        });
        setTimeout(() => { if (inp && typeof inp.focus === "function") inp.focus(); }, 50);
      }
    }

    renderRound();
  }

  /**
   * 7. "hangman" (Jour 8 - Heartless Hunter)
   * Supporte gc.riddleClue, gc.targetWord ('PHALENE'), gc.maxErrors, gc.followUpQuestion
   */
  function renderHangmanGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const targetWord =
      normalizeAnswer(gc.targetWord || gc.word || 'PHALENE') || 'PHALENE';
    const maxErrors = gc.maxErrors || 6;
    let errors = 0;
    const guessed = new Set();
    const followUp = gc.followUpQuestion || gc.bonusQuestion || null;

    function renderHangmanStage() {
      const letters = targetWord.split('');
      const displayWord = letters
        .map((ch) => (guessed.has(ch) ? ch : '_'))
        .join(' ');

      const svgParts = [
        `<circle cx="100" cy="30" r="10" stroke="#ef4444" stroke-width="2.5" fill="rgba(239,68,68,0.2)"/>`,
        `<line x1="100" y1="40" x2="100" y2="95" stroke="#ef4444" stroke-width="3"/>`,
        `<path d="M100 50 C 55 20, 30 65, 95 75 Z" stroke="#f87171" stroke-width="2.5" fill="rgba(185,28,28,0.35)"/>`,
        `<path d="M100 50 C 145 20, 170 65, 105 75 Z" stroke="#f87171" stroke-width="2.5" fill="rgba(185,28,28,0.35)"/>`,
        `<path d="M97 75 C 65 80, 60 110, 98 95 Z" stroke="#dc2626" stroke-width="2" fill="rgba(153,27,27,0.4)"/>`,
        `<path d="M103 75 C 135 80, 140 110, 102 95 Z" stroke="#dc2626" stroke-width="2" fill="rgba(153,27,27,0.4)"/>`
      ];

      stage.innerHTML = `
        <div class="mg-question-box" style="text-align:center;">
          <div class="mg-header-badge">${escapeHtml(gc.promptTitle || 'La Constellation Écarlate (*Heartless Hunter*)')}</div>
          <p style="margin:0 0 0.6rem 0; font-size:1.05rem;">
            ${formatRichText(gc.riddleClue || "Découvre l’emblème écarlate en 7 lettres de Rune Winters :")}
          </p>
          <svg width="200" height="120" viewBox="0 0 200 120" style="margin:0.3rem auto; background:rgba(0,0,0,0.35); border-radius:10px; border:1px solid rgba(239,68,68,0.35);">
            <circle cx="100" cy="65" r="52" stroke="rgba(212,175,55,0.2)" stroke-dasharray="4 4" fill="none"/>
            ${svgParts.slice(0, errors).join('')}
          </svg>
          <div style="font-size:0.85rem; color:#fca5a5;">Gouttes de sang versées : ${errors} / ${maxErrors}</div>
          <div style="font-family:'Cinzel',serif; font-size:1.95rem; letter-spacing:0.25em; color:#ffd700; margin:0.75rem 0;">
            ${displayWord}
          </div>
          <div class="mg-kbd-row" id="mg-hang-kbd" style="max-width:460px; margin:0 auto;"></div>
        </div>
      `;

      const kbd = stage.querySelector('#mg-hang-kbd');

      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((ch) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'mg-key';
        b.textContent = ch;
        if (guessed.has(ch)) {
          b.disabled = true;
          b.classList.add(targetWord.includes(ch) ? 'correct' : 'absent');
        }
        b.addEventListener('click', () => {
          guessed.add(ch);
          if (targetWord.includes(ch)) {
            sfx.click();
            const allFound = letters.every((l) => guessed.has(l));
            renderHangmanStage();
            if (allFound) {
              sfx.chime();
              setTimeout(() => {
                if (followUp) {
                  renderFollowUpQuestionBox(
                    stage,
                    wrapper,
                    followUp,
                    `✨ Mot Révélé : ${targetWord} — Validation Écarlate`,
                    () => completeGame(wrapper, dayData, callbacks)
                  );
                } else {
                  completeGame(wrapper, dayData, callbacks);
                }
              }, 550);
            }
          } else {
            sfx.error();
            errors++;
            if (errors >= maxErrors) {
              const missing = letters.find((l) => !guessed.has(l));
              if (missing) guessed.add(missing);
              errors = maxErrors - 1;
            }
            renderHangmanStage();
          }
        });
        kbd.appendChild(b);
      });
    }

    renderHangmanStage();
  }

  /**
   * 8. "reflex_flame" (Jour 9 - Spark of the Everflame)
   * Supporte gc.preQuestion et gc.reflexChallenge (targetClicks: 22, timeLimitSeconds: 5)
   */
  function renderReflexFlameGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const preQ = gc.preQuestion || null;
    const rc = gc.reflexChallenge || {};
    const targetClicks = rc.targetClicks || gc.targetClicks || 22;
    const durationSec = rc.timeLimitSeconds || gc.durationSeconds || 5.0;

    function start() {
      if (preQ) {
        renderFollowUpQuestionBox(
          stage,
          wrapper,
          preQ,
          'Étape 1 / 2 — La Mise en Garde de Diem & Luther',
          () => renderFlameChallenge()
        );
      } else {
        renderFlameChallenge();
      }
    }

    function renderFlameChallenge() {
      let clicks = 0;
      let timeLeft = durationSec;
      let timerId = null;
      let started = false;
      let finished = false;
      const stagesText = rc.encouragementStages || [
        'L’étincelle crépite...',
        'Le feu de Lumnos s’élève !',
        'Luther Corbois dégaine son épée !',
        'LA FLAMME ÉTERNELLE RUGIT !'
      ];

      stage.innerHTML = `
        <div class="mg-question-box" style="text-align:center;">
          <div class="mg-header-badge">Étape 2 / 2 — Le Brasier de l’Everflame</div>
          <p style="margin:0 0 0.6rem 0; font-size:1.05rem;">
            Clique <strong>${targetClicks} fois</strong> sur le Sceau de Feu en moins de <strong>${durationSec} secondes</strong> !
          </p>
          <div style="display:flex; justify-content:space-around; align-items:center; margin:0.65rem 0; font-family:'Cinzel',serif;">
            <div>🔥 Flamme : <strong id="mg-flame-count" style="color:#facc15;">0 / ${targetClicks}</strong></div>
            <div>⏳ Sablier : <strong id="mg-flame-timer" style="color:#f87171;">${durationSec.toFixed(1)}s</strong></div>
          </div>
          <div class="mg-progress-track" style="height:14px; border:1px solid #f97316;">
            <div class="mg-progress-fill" id="mg-flame-bar" style="width:0%; transition:width 0.08s;"></div>
          </div>
          <div id="mg-flame-status" style="font-size:0.95rem; color:#fed7aa; min-height:22px; margin:0.4rem 0;">
            Clique sur le sceau ardent pour lancer le décompte !
          </div>
          <div style="margin:0.9rem 0;">
            <button type="button" id="mg-flame-seal" style="
              cursor:pointer;
              width:146px;
              height:146px;
              border-radius:50%;
              border:3px solid #facc15;
              background:radial-gradient(circle, #f97316 0%, #b91c1c 65%, #450a0a 100%);
              color:#fff;
              font-family:'Cinzel',serif;
              font-size:0.95rem;
              font-weight:700;
              box-shadow:0 0 28px rgba(249,115,22,0.65);
              transition:transform 0.05s;
              user-select:none;
            ">
              ${escapeHtml(rc.buttonLabel || "🔥 ATTISER L'EVERFLAME !")}
            </button>
          </div>
          <div class="mg-feedback" id="mg-flame-challenge-fb"></div>
        </div>
      `;

      const countEl = stage.querySelector('#mg-flame-count');
      const timerEl = stage.querySelector('#mg-flame-timer');
      const barEl = stage.querySelector('#mg-flame-bar');
      const statusEl = stage.querySelector('#mg-flame-status');
      const sealBtn = stage.querySelector('#mg-flame-seal');
      const fb = stage.querySelector('#mg-flame-challenge-fb');

      const stopTimer = () => {
        if (timerId) {
          clearInterval(timerId);
          timerId = null;
        }
      };

      sealBtn.addEventListener('click', () => {
        if (finished) return;

        if (!started) {
          started = true;
          const startTime = performance.now();
          timerId = setInterval(() => {
            if (!document.body.contains(stage)) {
              stopTimer();
              return;
            }
            const elapsed = (performance.now() - startTime) / 1000;
            timeLeft = Math.max(0, durationSec - elapsed);
            timerEl.textContent = `${timeLeft.toFixed(1)}s`;

            if (timeLeft <= 0 && !finished) {
              stopTimer();
              sfx.error();
              fb.className = 'mg-feedback show err';
              fb.innerHTML = `La flamme s’est éteinte à ${clicks}/${targetClicks}... <button type="button" class="mg-btn" id="mg-flame-retry" style="margin-left:0.5rem; padding:0.35rem 0.8rem;">Réessayer immédiatement 🔥</button>`;
              const retryBtn = stage.querySelector('#mg-flame-retry');
              if (retryBtn) {
                retryBtn.addEventListener('click', () => renderFlameChallenge());
              }
            }
          }, 55);
        }

        clicks++;
        sfx.click();
        const rect = sealBtn.getBoundingClientRect();
        sfx.burst(
          rect.left + rect.width / 2 + (Math.random() * 40 - 20),
          rect.top + rect.height / 2 + (Math.random() * 40 - 20),
          'fire'
        );

        sealBtn.style.transform = 'scale(0.92)';
        setTimeout(() => {
          sealBtn.style.transform = 'scale(1.04)';
        }, 40);

        const pct = Math.min(100, Math.round((clicks / targetClicks) * 100));
        countEl.textContent = `${clicks} / ${targetClicks}`;
        barEl.style.width = `${pct}%`;

        const stageIdx = Math.min(
          stagesText.length - 1,
          Math.floor((clicks / targetClicks) * stagesText.length)
        );
        statusEl.textContent = stagesText[stageIdx];

        if (clicks >= targetClicks) {
          finished = true;
          stopTimer();
          fb.className = 'mg-feedback show ok';
          fb.innerHTML = `<strong>🔥 L’EVERFLAME RUGIT !</strong> Embrasée en ${(durationSec - timeLeft).toFixed(2)} secondes !`;
          setTimeout(() => completeGame(wrapper, dayData, callbacks), 650);
        }
      });
    }

    start();
  }

  /**
   * 9. "einstein_tavern" (Jour 10 - Trolls & Légendes : Nell Pfeiffer, Olivia Gometz, Ava Reid)
   * Supporte gc.entities, gc.drinks, gc.relics, gc.clues, gc.solution
   */
  function renderEinsteinTavernGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};

    const entities = gc.entities || [
      { id: 'nell', label: 'Héroïne de Nell Pfeiffer', subLabel: "Ceux qu'on implore à la terre" },
      { id: 'olivia', label: "Héroïne d'Olivia Gometz", subLabel: 'Trilogie Les Carmidors' },
      { id: 'ava', label: 'Effy Sayre (Ava Reid)', subLabel: 'Un passé englouti' }
    ];

    const drinks = gc.drinks || [
      { id: 'cuvee_trolls', label: '🍺 Cuvée des Trolls Ambrée' },
      { id: 'hydromel_brume', label: '🍯 Hydromel des Brumes Salées' },
      { id: 'triple_abbaye', label: "🍷 Triple d'Abbaye aux Épices" }
    ];

    const relics = gc.relics || [
      { id: 'autel_terre', label: "🌿 Sceau d'Argile des Prières de la Terre" },
      { id: 'blason_carmidor', label: '🦅 Trilogie des Blasons de Carmidor' },
      { id: 'manuscrit_aulnes', label: '🌊 Manuscrit Englouti du Roi des Aulnes' }
    ];

    const solution = gc.solution || {
      nell: { drink: 'cuvee_trolls', relic: 'autel_terre' },
      olivia: { drink: 'triple_abbaye', relic: 'blason_carmidor' },
      ava: { drink: 'hydromel_brume', relic: 'manuscrit_aulnes' }
    };

    const clues = gc.clues || [];

    stage.innerHTML = `
      <div class="mg-question-box">
        <div class="mg-header-badge">${escapeHtml(gc.promptTitle || 'L’Énigme d’Einstein à la Taverne de Mons')}</div>
        ${gc.scenarioDescription ? `<p style="margin:0 0 0.7rem 0; font-size:1rem;">${formatRichText(gc.scenarioDescription)}</p>` : ''}
        <div style="margin-bottom:0.9rem; font-size:0.94rem; line-height:1.45; background:rgba(0,0,0,0.34); padding:0.75rem; border-radius:8px;">
          ${clues.map((c) => `<div style="margin-bottom:0.38rem;">🍺 ${formatRichText(c)}</div>`).join('')}
        </div>
        <div id="mg-tavern-rows" style="display:flex; flex-direction:column; gap:0.8rem;"></div>
        <div style="margin-top:1rem; text-align:center;">
          <button type="button" class="mg-btn" id="mg-tavern-check">Servir la Table des Autrices 🍻</button>
        </div>
        <div class="mg-feedback" id="mg-tavern-fb"></div>
      </div>
    `;

    const rowsEl = stage.querySelector('#mg-tavern-rows');
    const fb = stage.querySelector('#mg-tavern-fb');

    entities.forEach((ent, idx) => {
      const card = document.createElement('div');
      card.style.cssText =
        'padding:0.85rem; border-radius:8px; background:rgba(255,255,255,0.04); border:1px solid rgba(212,175,55,0.35);';
      card.innerHTML = `
        <div style="font-weight:700; color:#fde68a; margin-bottom:0.5rem;">
          📜 Tablette ${idx + 1} : ${escapeHtml(ent.label)} ${ent.subLabel ? `<span style="font-weight:400; color:#d4af37;">— <em>${escapeHtml(ent.subLabel)}</em></span>` : ''}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:0.6rem;">
          <select class="mg-runic-input" data-entity="${ent.id}" data-kind="drink" style="font-size:0.9rem; padding:0.45rem;">
            <option value="">-- Choisir la Boisson --</option>
            ${drinks.map((d) => `<option value="${d.id}">${escapeHtml(d.label)}</option>`).join('')}
          </select>
          <select class="mg-runic-input" data-entity="${ent.id}" data-kind="relic" style="font-size:0.9rem; padding:0.45rem;">
            <option value="">-- Choisir la Relique --</option>
            ${relics.map((r) => `<option value="${r.id}">${escapeHtml(r.label)}</option>`).join('')}
          </select>
        </div>
      `;
      rowsEl.appendChild(card);
    });

    stage.querySelectorAll('select').forEach((sel) => {
      sel.addEventListener('change', () => sfx.click());
    });

    stage.querySelector('#mg-tavern-check').addEventListener('click', () => {
      let allCorrect = true;
      entities.forEach((ent) => {
        const dVal = stage.querySelector(`select[data-entity="${ent.id}"][data-kind="drink"]`).value;
        const rVal = stage.querySelector(`select[data-entity="${ent.id}"][data-kind="relic"]`).value;
        const expected = solution[ent.id];
        if (!expected || dVal !== expected.drink || rVal !== expected.relic) {
          allCorrect = false;
        }
      });

      if (allCorrect) {
        sfx.chime();
        fb.className = 'mg-feedback show ok';
        fb.innerHTML = `<strong>🍻 Santé à Trolls & Légendes !</strong> ${formatRichText(gc.victoryLore || 'Nell Pfeiffer, Olivia Gometz et Ava Reid trinquent avec vous !')}`;
        setTimeout(() => completeGame(wrapper, dayData, callbacks), 700);
      } else {
        sfx.error();
        triggerShake(wrapper);
        fb.className = 'mg-feedback show err';
        fb.textContent =
          'Une boisson ou une relique ne correspond pas aux indices logiques de la Taverne !';
      }
    });
  }

  /**
   * 10. "truth_trial" (Jour 11 - Prison Healer, Yellowface, La Maison des Sortilèges)
   * Supporte gc.statements[] (bookTag, statement, isTrue, explanation)
   */
  function renderTruthTrialGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const statements = (gc.statements || []).map((s) => ({
      bookTag: s.bookTag || 'Tribunal de l’Inquisition Littéraire',
      text: s.statement || s.text || '',
      isTrue: Boolean(s.isTrue),
      explanation: s.explanation || s.comment || 'Jugement consigné au registre !'
    }));

    let idx = 0;

    function renderStatement() {
      const st = statements[idx];
      const pct = Math.round((idx / statements.length) * 100);

      stage.innerHTML = `
        <div class="mg-progress-track">
          <div class="mg-progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="mg-question-box" style="text-align:center;">
          <div class="mg-header-badge">Acte ${idx + 1} / ${statements.length} — ${escapeHtml(st.bookTag)}</div>
          <p style="font-size:1.12rem; line-height:1.55; margin:0.85rem 0;">${formatRichText(st.text)}</p>
          <div style="display:flex; justify-content:center; gap:1rem; margin-top:1rem;">
            <button type="button" class="mg-btn" id="mg-stamp-true" style="min-width:140px;">💮 TAMPON VRAI</button>
            <button type="button" class="mg-btn mg-btn-crimson" id="mg-stamp-false" style="min-width:140px;">🕯️ TAMPON FAUX</button>
          </div>
          <div class="mg-feedback" id="mg-trial-fb"></div>
          <div style="margin-top:0.85rem; display:none;" id="mg-trial-next-wrap">
            <button type="button" class="mg-btn" id="mg-trial-next">
              ${idx + 1 < statements.length ? 'Parchemin Suivant →' : 'Clore l’Audience & Ouvrir le Coffre ✨'}
            </button>
          </div>
        </div>
      `;

      const btnTrue = stage.querySelector('#mg-stamp-true');
      const btnFalse = stage.querySelector('#mg-stamp-false');
      const fb = stage.querySelector('#mg-trial-fb');
      const nextWrap = stage.querySelector('#mg-trial-next-wrap');
      const nextBtn = stage.querySelector('#mg-trial-next');

      const judge = (choice) => {
        sfx.crack();
        if (choice === st.isTrue) {
          sfx.chime();
          btnTrue.disabled = true;
          btnFalse.disabled = true;
          fb.className = 'mg-feedback show ok';
          fb.innerHTML = `<strong>⚖️ ${formatRichText(st.explanation)}</strong>`;
          nextWrap.style.display = 'block';
        } else {
          sfx.error();
          triggerShake(wrapper);
          fb.className = 'mg-feedback show err';
          fb.textContent = "Objection de Kingsley ! Ce tampon ne correspond pas à la vérité de ta bibliothèque !";
        }
      };

      btnTrue.addEventListener('click', () => judge(true));
      btnFalse.addEventListener('click', () => judge(false));
      nextBtn.addEventListener('click', () => {
        sfx.click();
        idx++;
        if (idx < statements.length) {
          renderStatement();
        } else {
          completeGame(wrapper, dayData, callbacks);
        }
      });
    }

    renderStatement();
  }

  /**
   * 11. "boss_fire" (Jour 12 - BOSS 2 The Poppy War & La Rage des Dragons)
   * Supporte gc.phase1, gc.phase2, gc.phase3 (runes[], sequenceLength)
   */
  function renderBossFireGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const p1 = gc.phase1 || {
      title: 'Phase 1 / 3 — The Poppy War',
      question: "Quel est le nom de la prestigieuse académie militaire de l’Empire Nikara qu’intègre Fang Runin (Rin) ?",
      expectedAnswers: ['SINEGARD'],
      placeholder: 'Nom de l’académie (8 lettres)...'
    };
    const p2 = gc.phase2 || {
      title: 'Phase 2 / 3 — La Rage des Dragons',
      question: "Comment s’appelle le jeune guerrier qui s’entraîne dans l’Isihogo pour assouvir sa vengeance ?",
      expectedAnswers: ['TAU', 'TAU SOLARIN'],
      placeholder: 'Son prénom (3 lettres)...'
    };
    const p3 = gc.phase3 || {};

    let phase = 1;

    function renderBossHeader(heartsLeft) {
      let hearts = '';
      for (let i = 0; i < 3; i++) {
        hearts += `<span class="mg-heart ${i >= heartsLeft ? 'lost' : ''}">🔥</span>`;
      }
      return `
        <div class="mg-boss-bar">
          <div>
            <strong style="color:#fdba74; font-family:'Cinzel',serif;">${escapeHtml(gc.bossAvatar || '🐉')} ${escapeHtml(gc.bossName || 'L’AVATAR DU PHÉNIX & DU DRAGON')}</strong>
            <div style="font-size:0.82rem; color:#fed7aa;">Phase ${phase} / 3 — ${escapeHtml(gc.bossTitle || 'Sinegard & Isihogo')}</div>
          </div>
          <div class="mg-boss-hearts">${hearts}</div>
        </div>
      `;
    }

    function renderTextPhase(phaseObj, heartsLeft, onNext) {
      stage.innerHTML = `
        ${renderBossHeader(heartsLeft)}
        <div class="mg-question-box">
          <div class="mg-header-badge">${escapeHtml(phaseObj.title)}</div>
          <p style="font-size:1.1rem; line-height:1.5;">${formatRichText(phaseObj.question)}</p>
          <div class="mg-input-row">
            <input type="text" class="mg-runic-input" id="mg-fire-inp" placeholder="${escapeHtml(phaseObj.placeholder || 'Ta réponse...')}" autocomplete="off" />
            <button type="button" class="mg-btn mg-btn-crimson" id="mg-fire-btn">Frapper par le Feu 🔥</button>
          </div>
          <div class="mg-feedback" id="mg-fire-fb"></div>
        </div>
      `;

      const inp = stage.querySelector('#mg-fire-inp');
      const btn = stage.querySelector('#mg-fire-btn');
      const fb = stage.querySelector('#mg-fire-fb');

      const check = () => {
        if (matchesAnyAnswer(inp.value, phaseObj.expectedAnswers || ['SINEGARD', 'TAU'])) {
          sfx.bossHit();
          triggerShake(wrapper);
          fb.className = 'mg-feedback show ok';
          fb.innerHTML = '<strong>🔥 FRAPPE ARDENTE !</strong> Le bouclier de cendres se brise !';
          setTimeout(() => onNext(), 650);
        } else {
          sfx.error();
          triggerShake(wrapper);
          fb.className = 'mg-feedback show err';
          fb.textContent = 'Les flammes repoussent ton assaut ! Vérifie le nom exact ou consulte l’indice.';
        }
      };

      btn.addEventListener('click', check);
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') check();
      });
      setTimeout(() => { if (inp && typeof inp.focus === "function") inp.focus(); }, 50);
    }

    function renderSimonPhase() {
      const runes = (p3.runes || [
        { id: 'phoenix', label: 'Phénix de Rin', icon: '🦅' },
        { id: 'dragon', label: 'Dragon Omehi', icon: '🐉' },
        { id: 'sabre', label: 'Deux-Lames de Tau', icon: '⚔️' },
        { id: 'flame', label: 'Feu Chamanique', icon: '🔥' },
        { id: 'drum', label: 'Tambour de Guerre', icon: '🥁' }
      ]).map((r, idx) => ({ ...r, idx }));

      const sequence = [0, 1, 3, 2, 4];
      const roundLengths = [3, 4, 5];
      let simonRound = 0;
      let userStep = 0;
      let isPlayingSeq = false;

      stage.innerHTML = `
        ${renderBossHeader(1)}
        <div class="mg-question-box" style="text-align:center;">
          <div class="mg-header-badge">${escapeHtml(p3.title || 'Phase 3 / 3 — Sceau Mémoriel des 5 Runes de Feu')}</div>
          <p style="margin:0 0 0.7rem 0;">
            ${formatRichText(p3.instruction || 'Observe l’ordre dans lequel les 5 Runes de Feu s’illuminent, puis clique dessus dans l’ordre exact !')}
            <br><strong id="mg-simon-round-label" style="color:#facc15;">Round 1 / 3 — 3 runes</strong>
          </p>
          <div id="mg-simon-medallions" style="display:flex; justify-content:center; gap:0.7rem; flex-wrap:wrap; margin:1rem 0;"></div>
          <div style="margin-top:0.5rem;">
            <button type="button" class="mg-btn mg-btn-secondary" id="mg-simon-replay">🔄 Rejouer la séquence lumineuse</button>
          </div>
          <div class="mg-feedback" id="mg-simon-fb"></div>
        </div>
      `;

      const container = stage.querySelector('#mg-simon-medallions');
      const roundLabel = stage.querySelector('#mg-simon-round-label');
      const fb = stage.querySelector('#mg-simon-fb');
      const medBtns = [];

      runes.forEach((m) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.style.cssText = `
          cursor:pointer; width:96px; height:94px; border-radius:12px;
          border:2px solid rgba(251,146,60,0.45);
          background:rgba(30,15,15,0.9); color:#fed7aa;
          font-family:'Cinzel',serif; font-size:0.78rem;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          gap:4px; transition:all 0.2s; padding:4px;
        `;
        b.innerHTML = `<span style="font-size:1.75rem;">${m.icon}</span><span>${escapeHtml(m.label)}</span>`;
        b.addEventListener('click', () => onMedallionClick(m.idx));
        container.appendChild(b);
        medBtns.push(b);
      });

      function flashMedallion(idx) {
        const b = medBtns[idx];
        if (!b) return;
        sfx.click();
        b.style.background = 'linear-gradient(135deg, #f97316, #facc15)';
        b.style.color = '#1a0a05';
        b.style.boxShadow = '0 0 22px #facc15';
        b.style.transform = 'scale(1.1)';
        setTimeout(() => {
          b.style.background = 'rgba(30,15,15,0.9)';
          b.style.color = '#fed7aa';
          b.style.boxShadow = 'none';
          b.style.transform = 'scale(1)';
        }, 380);
      }

      function playCurrentSequence() {
        isPlayingSeq = true;
        userStep = 0;
        const len = roundLengths[simonRound];
        roundLabel.textContent = `Round ${simonRound + 1} / 3 — ${len} runes à reproduire`;

        for (let i = 0; i < len; i++) {
          setTimeout(() => {
            if (!document.body.contains(stage)) return;
            flashMedallion(sequence[i]);
            if (i === len - 1) {
              setTimeout(() => {
                isPlayingSeq = false;
              }, 420);
            }
          }, 480 + i * 560);
        }
      }

      function onMedallionClick(idx) {
        if (isPlayingSeq) return;
        flashMedallion(idx);
        const expected = sequence[userStep];
        const len = roundLengths[simonRound];

        if (idx === expected) {
          userStep++;
          if (userStep >= len) {
            sfx.chime();
            simonRound++;
            if (simonRound >= roundLengths.length) {
              sfx.bossHit();
              fb.className = 'mg-feedback show ok';
              fb.innerHTML = '<strong>🦅 LE PHÉNIX & LE DRAGON S’INCLINENT !</strong> Victoire totale sur le Boss de Feu !';
              setTimeout(() => completeGame(wrapper, dayData, callbacks), 700);
            } else {
              fb.className = 'mg-feedback show info';
              fb.textContent = `Round ${simonRound} validé ! Observe bien la séquence suivante...`;
              setTimeout(() => playCurrentSequence(), 650);
            }
          }
        } else {
          sfx.error();
          triggerShake(wrapper);
          fb.className = 'mg-feedback show err';
          fb.textContent = 'Ordre incorrect ! Regarde à nouveau les médaillons s’illuminer...';
          setTimeout(() => playCurrentSequence(), 700);
        }
      }

      stage.querySelector('#mg-simon-replay').addEventListener('click', () => {
        if (!isPlayingSeq) playCurrentSequence();
      });

      playCurrentSequence();
    }

    renderTextPhase(p1, 3, () => {
      phase = 2;
      renderTextPhase(p2, 2, () => {
        phase = 3;
        renderSimonPhase();
      });
    });
  }

  /**
   * 12. "gild_ribbons" (Jour 13 - Gild / Auren & Slade)
   * Supporte gc.ribbons[] (order, runeTitle, clueText)
   */
  function renderGildRibbonsGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const rawRibbons = gc.ribbons || [];

    const ribbons = rawRibbons.map((r, i) => ({
      order: r.order || i + 1,
      title: r.runeTitle || r.label || `Ruban ${i + 1}`,
      clue: r.clueText || ''
    }));

    // Mélange déterministe des 6 rubans
    const displayOrder = [ribbons[2], ribbons[0], ribbons[4], ribbons[1], ribbons[5], ribbons[3]].filter(Boolean);
    let expectedOrder = 1;

    function renderRibbons() {
      stage.innerHTML = `
        <div class="mg-question-box">
          <div class="mg-header-badge">${escapeHtml(gc.promptTitle || 'Les Six Rubans d’Or d’Auren (*Gild*)')}</div>
          <p style="margin:0 0 0.8rem 0; font-size:1.05rem;">
            ${formatRichText(gc.riddleInstruction || 'Tranche les 6 rubans d’or dans l’ordre chronologique exact du voyage d’Auren (de I à VI) :')}
          </p>
          <div id="mg-ribbons-list" style="display:flex; flex-direction:column; gap:0.65rem;"></div>
          <div class="mg-feedback" id="mg-ribbons-fb"></div>
        </div>
      `;

      const list = stage.querySelector('#mg-ribbons-list');
      const fb = stage.querySelector('#mg-ribbons-fb');

      displayOrder.forEach((r) => {
        const isCut = r.order < expectedOrder;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.disabled = isCut;
        btn.style.cssText = `
          cursor:${isCut ? 'default' : 'pointer'};
          padding:0.8rem 1.1rem;
          border-radius:12px;
          border:1.5px solid ${isCut ? '#4ade80' : '#ffd700'};
          background:${
            isCut
              ? 'rgba(22, 101, 52, 0.35)'
              : 'linear-gradient(90deg, rgba(212,175,55,0.24), rgba(250,204,21,0.38), rgba(212,175,55,0.18))'
          };
          color:${isCut ? '#bbf7d0' : '#fffbeb'};
          font-family:inherit;
          font-size:0.98rem;
          text-align:left;
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:0.75rem;
          transition:all 0.25s;
        `;
        btn.innerHTML = `
          <div>
            <div style="font-family:'Cinzel',serif; font-weight:700; color:#fde68a;">✨ ${escapeHtml(r.title)}</div>
            ${r.clue ? `<div style="font-size:0.9rem; opacity:0.9; margin-top:2px;">${formatRichText(r.clue)}</div>` : ''}
          </div>
          <span style="white-space:nowrap; font-family:'Cinzel',serif; font-size:0.85rem;">${isCut ? '✂️ Tranché' : '🗡️ Trancher'}</span>
        `;

        btn.addEventListener('click', (e) => {
          if (r.order === expectedOrder) {
            sfx.crack();
            const rect = e.currentTarget.getBoundingClientRect();
            sfx.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 'common');
            expectedOrder++;
            renderRibbons();
            if (expectedOrder > ribbons.length) {
              sfx.chime();
              const fbNow = stage.querySelector('#mg-ribbons-fb');
              fbNow.className = 'mg-feedback show ok';
              fbNow.innerHTML = '<strong>✨ LES RUBANS D’AUREN SONT LIBRES !</strong> Slade Ravinger salue ta maîtrise.';
              setTimeout(() => completeGame(wrapper, dayData, callbacks), 700);
            }
          } else {
            sfx.error();
            triggerShake(wrapper);
            fb.className = 'mg-feedback show err';
            fb.textContent = `Ce ruban résiste ! Tu dois trancher l’étape n°${expectedOrder} en premier.`;
          }
        });

        list.appendChild(btn);
      });
    }

    renderRibbons();
  }

  /**
   * 13. "lunar_mechanisms" (Jour 14 - Curious Tides)
   * Supporte gc.mechanisms[] (lunarPhase, correctEffectId, hintFragment) et gc.effectsPool[] (id, label)
   */
  function renderLunarMechanismsGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const mechanisms = gc.mechanisms || [
      { id: 'mech_1', lunarPhase: '🌑 Rouage I — Nouvelle Lune', correctEffectId: 'eff_shadows', hintFragment: 'Les ombres s’éveillent.' },
      { id: 'mech_2', lunarPhase: '🌒 Rouage II — Lune Croissante (Emory)', correctEffectId: 'eff_healing_tide', hintFragment: 'Guérison et renouveau.' },
      { id: 'mech_3', lunarPhase: '🌕 Rouage III — Pleine Lune (Keiran)', correctEffectId: 'eff_tidal_force', hintFragment: 'Puissance brute des courants.' },
      { id: 'mech_4', lunarPhase: '🌘 Rouage IV — Lune Décroissante (Baz)', correctEffectId: 'eff_memory_veil', hintFragment: 'Mémoire et érudition.' },
      { id: 'mech_5', lunarPhase: '🌘☀️ Rouage V — Éclipse de Dover', correctEffectId: 'eff_drowned_ritual', hintFragment: 'Rituel des Noyés.' }
    ];

    const effectsPool = gc.effectsPool || [
      { id: 'eff_shadows', label: 'Domaine des Ombres & des Illusions Nocturnes' },
      { id: 'eff_healing_tide', label: "Flux de Guérison & d'Éveil Mystique d'Emory" },
      { id: 'eff_tidal_force', label: 'Puissance Souveraine des Hautes Eaux de Keiran' },
      { id: 'eff_memory_veil', label: "Reflux de la Mémoire & de l'Érudition de Baz" },
      { id: 'eff_drowned_ritual', label: 'Rituel Interdit des Noyés de Dover' }
    ];

    stage.innerHTML = `
      <div class="mg-question-box">
        <div class="mg-header-badge">${escapeHtml(gc.promptTitle || 'Le Planétaire d’Aldryn (*Curious Tides*)')}</div>
        ${gc.parchmentClue ? `<p style="font-size:0.98rem; opacity:0.92; margin:0 0 0.8rem 0;">${formatRichText(gc.parchmentClue)}</p>` : ''}
        <div id="mg-mech-rows" style="display:flex; flex-direction:column; gap:0.75rem;"></div>
        <div style="margin-top:1rem; text-align:center;">
          <button type="button" class="mg-btn" id="mg-mech-verify">Aligner les 5 Anneaux du Planétaire 🌙</button>
        </div>
        <div class="mg-feedback" id="mg-mech-fb"></div>
      </div>
    `;

    const rowsEl = stage.querySelector('#mg-mech-rows');
    const fb = stage.querySelector('#mg-mech-fb');

    mechanisms.forEach((m) => {
      const row = document.createElement('div');
      row.style.cssText =
        'padding:0.75rem; border-radius:8px; background:rgba(255,255,255,0.04); border:1px solid rgba(192,132,252,0.35);';
      row.innerHTML = `
        <div style="font-weight:700; color:#e9d5ff; margin-bottom:0.2rem;">${escapeHtml(m.lunarPhase)}</div>
        ${m.hintFragment ? `<div style="font-size:0.86rem; color:#c4b5fd; margin-bottom:0.45rem;"><em>« ${escapeHtml(m.hintFragment)} »</em></div>` : ''}
        <select class="mg-runic-input" data-mech="${m.id}" style="width:100%; font-size:0.9rem; padding:0.45rem;">
          <option value="">-- Associer le Pouvoir des Marées --</option>
          ${effectsPool.map((ef) => `<option value="${ef.id}">${escapeHtml(ef.label)}</option>`).join('')}
        </select>
      `;
      rowsEl.appendChild(row);
    });

    stage.querySelectorAll('select').forEach((s) =>
      s.addEventListener('change', () => sfx.click())
    );

    stage.querySelector('#mg-mech-verify').addEventListener('click', () => {
      let allOk = true;
      mechanisms.forEach((m) => {
        const val = stage.querySelector(`select[data-mech="${m.id}"]`).value;
        if (val !== m.correctEffectId) allOk = false;
      });

      if (allOk) {
        sfx.chime();
        fb.className = 'mg-feedback show ok';
        fb.innerHTML = `<strong>🌕 PLANÉTAIRE ALIGNÉ !</strong> ${formatRichText(gc.victoryLore || 'Les 5 anneaux d’Aldryn s’emboîtent avec une mélodie cristalline !')}`;
        setTimeout(() => completeGame(wrapper, dayData, callbacks), 700);
      } else {
        sfx.error();
        triggerShake(wrapper);
        fb.className = 'mg-feedback show err';
        fb.textContent =
          'Un ou plusieurs rouages ne sont pas alignés avec leur lignée lunaire ! Aide-toi des citations sous chaque phase.';
      }
    });
  }

  /**
   * 14. "maram_compass" (Jour 15 - Les Aventures d'Amina al-Sirafi)
   * Supporte gc.startPos ({row:4, col:0}), gc.treasurePos ({row:0, col:4}), gc.waypoints[] (options ou inputType:'text')
   */
  function renderMaramCompassGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const startPos = gc.startPos || { row: 4, col: 0 };
    const treasurePos = gc.treasurePos || { row: 0, col: 4 };
    const waypoints = gc.waypoints || [];

    let shipRow = startPos.row;
    let shipCol = startPos.col;
    let stepIdx = 0;
    const visited = new Set([`${shipRow},${shipCol}`]);

    const hazards = {
      '4,2': '🐙',
      '3,3': '🪨',
      '1,1': '🌪️',
      '1,4': '🪨'
    };

    function renderSeaMap() {
      let gridHtml = '';
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          const key = `${r},${c}`;
          const isShip = r === shipRow && c === shipCol;
          const isTreasure = r === treasurePos.row && c === treasurePos.col;
          const isVisited = visited.has(key);
          const icon = isShip
            ? '⛵'
            : isTreasure
            ? '🏝️'
            : hazards[key] || (isVisited ? '·' : '🌊');
          gridHtml += `<div class="mg-sea-cell ${isShip ? 'ship' : isVisited ? 'visited' : ''}">${icon}</div>`;
        }
      }

      const wp = waypoints[stepIdx];
      const hasOptions = Array.isArray(wp.options) && wp.options.length > 0;

      stage.innerHTML = `
        <div class="mg-question-box">
          <div class="mg-header-badge">${escapeHtml(wp.title || `Cap ${stepIdx + 1} / ${waypoints.length}`)}</div>
          <div class="mg-sea-grid">${gridHtml}</div>
          <p style="font-size:1.06rem; line-height:1.5; margin:0.7rem 0;">${formatRichText(wp.question)}</p>
          ${
            hasOptions
              ? `<div class="mg-options-list" id="mg-maram-opts"></div>`
              : `
                <div class="mg-input-row">
                  <input type="text" class="mg-runic-input" id="mg-maram-inp" placeholder="${escapeHtml(wp.placeholder || 'Tape le mot-clé du cap...')}" autocomplete="off" />
                  <button type="button" class="mg-btn" id="mg-maram-sail">Hisser les Voiles 🧭</button>
                </div>
              `
          }
          <div class="mg-feedback" id="mg-maram-fb"></div>
        </div>
      `;

      const fb = stage.querySelector('#mg-maram-fb');

      const advanceShip = () => {
        sfx.chime();
        if (wp.targetPosAfterStep) {
          shipRow = wp.targetPosAfterStep.row;
          shipCol = wp.targetPosAfterStep.col;
        }
        visited.add(`${shipRow},${shipCol}`);
        fb.className = 'mg-feedback show ok';
        fb.innerHTML = `<strong>🧭 ${formatRichText(wp.loreFeedback || 'Cap validé !')}</strong>`;

        setTimeout(() => {
          stepIdx++;
          if (stepIdx < waypoints.length) {
            renderSeaMap();
          } else {
            completeGame(wrapper, dayData, callbacks);
          }
        }, 650);
      };

      if (hasOptions) {
        const optsEl = stage.querySelector('#mg-maram-opts');
        wp.options.forEach((o) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'mg-option-btn';
          b.innerHTML = formatRichText(o.label || o.text || '');
          b.addEventListener('click', () => {
            if (o.isCorrect) {
              b.classList.add('correct');
              optsEl.querySelectorAll('button').forEach((btn) => (btn.disabled = true));
              advanceShip();
            } else {
              sfx.error();
              triggerShake(wrapper);
              b.classList.add('wrong');
              fb.className = 'mg-feedback show err';
              fb.textContent = 'Alerte Kraken et récifs ! Ce cap mènerait le Maram au naufrage.';
            }
          });
          optsEl.appendChild(b);
        });
      } else {
        const inp = stage.querySelector('#mg-maram-inp');
        const btn = stage.querySelector('#mg-maram-sail');
        const check = () => {
          if (matchesAnyAnswer(inp.value, wp.expectedAnswers || ['MARAM', 'CHAKRABORTY'])) {
            inp.disabled = true;
            btn.disabled = true;
            advanceShip();
          } else {
            sfx.error();
            triggerShake(wrapper);
            fb.className = 'mg-feedback show err';
            fb.textContent = 'La boussole du Maram oscille... Vérifie l’orthographe du mot-clé !';
          }
        };
        btn.addEventListener('click', check);
        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') check();
        });
        setTimeout(() => { if (inp && typeof inp.focus === "function") inp.focus(); }, 50);
      }
    }

    renderSeaMap();
  }

  /**
   * 15. "enchanted_typewriter" (Jour 16 - Divines Rivalités & Féroce Déférence)
   * Supporte gc.segments[] ({id, order, text}), gc.signaturePrompt, gc.expectedSignatures
   */
  function renderEnchantedTypewriterGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const rawSegments = gc.segments || [
      { id: 's1', order: 1, text: 'Ma chère Iris de @lau.libraryyy,' },
      { id: 's2', order: 2, text: 'Même lorsque les dieux Enva et Dacre' },
      { id: 's3', order: 3, text: 'déchaînent leurs tempêtes avec une Féroce Déférence,' },
      { id: 's4', order: 4, text: 'c’est toujours toi que je choisis. — Ton dévoué C. / Roman' }
    ];

    const sortedSegments = [...rawSegments].sort((a, b) => a.order - b.order);
    // Mélange déterministe pour l'affichage des boutons
    const pool = [...sortedSegments].sort(
      (a, b) => Math.sin(a.order * 7) - Math.sin(b.order * 7)
    );
    const typed = [];
    const signatureAnswers = gc.expectedSignatures || ['KITT', 'ROMAN KITT', 'CARVER'];

    function renderTypewriter() {
      const allTyped = typed.length === sortedSegments.length;

      stage.innerHTML = `
        <div class="mg-question-box">
          <div class="mg-header-badge">${escapeHtml(gc.promptTitle || 'La Machine à Écrire Alouette (*Divines Rivalités*)')}</div>
          <p style="margin:0 0 0.55rem 0; font-size:1.02rem;">
            ${formatRichText(gc.instruction || 'Clique sur les fragments de papier dans le bon ordre pour dactylographier la lettre complète :')}
          </p>
          <div class="mg-paper-sheet">
            <div style="text-align:right; font-size:0.78rem; opacity:0.75;">Oath — Correspondance de l’Armoire</div>
            <div style="margin-top:0.5rem;">
              ${
                typed.length === 0
                  ? '<span style="opacity:0.5;">[Clique sur le 1er fragment ci-dessous pour actionner les marteaux de la machine...]</span>'
                  : typed.map((t) => `<div style="margin-bottom:0.25rem;">${escapeHtml(t.text)}</div>`).join('')
              }
            </div>
          </div>
          ${
            !allTyped
              ? `<div id="mg-tw-pool" class="mg-options-list"></div>`
              : `
                <div style="margin-top:0.75rem;">
                  <p style="font-size:1.04rem; margin:0 0 0.5rem 0;">${formatRichText(gc.signaturePrompt || 'Signe maintenant du nom de famille de Roman (4 lettres) :')}</p>
                  <div class="mg-input-row">
                    <input type="text" class="mg-runic-input" id="mg-tw-sign" placeholder="${escapeHtml(gc.signaturePlaceholder || 'Tape KITT...')}" autocomplete="off" />
                    <button type="button" class="mg-btn" id="mg-tw-send">Glisser sous l’Armoire ✉️</button>
                  </div>
                </div>
              `
          }
          <div class="mg-feedback" id="mg-tw-fb"></div>
        </div>
      `;

      const fb = stage.querySelector('#mg-tw-fb');

      if (!allTyped) {
        const poolEl = stage.querySelector('#mg-tw-pool');
        pool.forEach((seg) => {
          const isUsed = typed.some((t) => t.id === seg.id);
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'mg-option-btn';
          b.disabled = isUsed;
          if (isUsed) b.classList.add('correct');
          b.textContent = seg.text;

          b.addEventListener('click', () => {
            const expected = sortedSegments[typed.length];
            if (seg.order === expected.order) {
              sfx.typeKey();
              setTimeout(() => sfx.typeKey(), 80);
              typed.push(seg);
              renderTypewriter();
            } else {
              sfx.error();
              triggerShake(wrapper);
              fb.className = 'mg-feedback show err';
              fb.textContent = `Ce fragment vient plus tard dans la phrase ! Sélectionne le fragment n°${typed.length + 1}.`;
            }
          });
          poolEl.appendChild(b);
        });
      } else {
        const inp = stage.querySelector('#mg-tw-sign');
        const btn = stage.querySelector('#mg-tw-send');

        const checkSign = () => {
          sfx.typeKey();
          if (matchesAnyAnswer(inp.value, signatureAnswers)) {
            sfx.chime();
            fb.className = 'mg-feedback show ok';
            fb.innerHTML = `<strong>✉️ Signé : Roman Kitt !</strong> ${formatRichText(gc.victoryLore || 'La lettre glisse sous la porte de l’armoire d’Iris !')}`;
            setTimeout(() => completeGame(wrapper, dayData, callbacks), 700);
          } else {
            sfx.error();
            triggerShake(wrapper);
            fb.className = 'mg-feedback show err';
            fb.textContent = 'Signature non reconnue... Signe KITT (ou ROMAN KITT) !';
          }
        };

        btn.addEventListener('click', checkSign);
        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') checkSign();
        });
        setTimeout(() => { if (inp && typeof inp.focus === "function") inp.focus(); }, 50);
      }
    }

    renderTypewriter();
  }

  /**
   * 16. "alchemy_cauldron" (Jour 17 - Blood Over Bright Haven & A Forbidden Alchemy)
   * Supporte gc.vials[] ({id, name, color, icon, tag}), gc.grimoireRules[], gc.targetSequence[]
   */
  function renderAlchemyCauldronGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const vials = gc.vials || [
      { id: 'scribe_ink', name: 'Encre Codée du Haut-Magistère', color: '#818CF8', icon: '🖋️', tag: 'Formule / Savoir' },
      { id: 'willow_ash', name: 'Cendre de Saule des Plaines Kwen', color: '#A3E635', icon: '🌿', tag: 'Terre / Thomil' },
      { id: 'star_blood', name: "Quintessence d'Alchimie Interdite", color: '#F43F5E', icon: '🩸', tag: 'Catalyseur / Sang' },
      { id: 'ether_tiran', name: 'Éther Lumineux de Tiran', color: '#38BDF8', icon: '💠', tag: 'Arcane' },
      { id: 'brass_mist', name: 'Vapeur de Laiton Corrompu', color: '#F59E0B', icon: '🌫️', tag: 'Métal / Instable' },
      { id: 'winter_dew', name: 'Rosée Glacée de la Barrière', color: '#E2E8F0', icon: '❄️', tag: 'Glace / Inerte' }
    ];

    const rules = gc.grimoireRules || [];
    const targetSeq = gc.targetSequence || ['scribe_ink', 'willow_ash', 'star_blood'];
    const poured = [];

    function renderLab() {
      stage.innerHTML = `
        <div class="mg-question-box">
          <div class="mg-header-badge">${escapeHtml(gc.promptTitle || 'Le Laboratoire de Sciona (*Blood Over Bright Haven*)')}</div>
          <div style="background:rgba(0,0,0,0.34); padding:0.75rem; border-radius:8px; font-size:0.93rem; margin-bottom:0.85rem; line-height:1.45;">
            ${rules.map((r) => `<div style="margin-bottom:0.35rem;">⚗️ ${formatRichText(r)}</div>`).join('')}
          </div>
          <div id="mg-vials-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(165px, 1fr)); gap:0.6rem; margin-bottom:1rem;"></div>
          <div style="text-align:center; padding:0.85rem; border-radius:10px; background:rgba(15,23,42,0.75); border:1px solid rgba(212,175,55,0.4);">
            <div style="font-family:'Cinzel',serif; color:#fde68a; margin-bottom:0.35rem;">
              ⚗️ Chaudron de Transmutation (${poured.length} / ${targetSeq.length} fioles versées)
            </div>
            <div style="font-size:0.94rem; min-height:24px;">
              ${
                poured.length === 0
                  ? '<span style="opacity:0.65;">Clique sur la 1re fiole à verser au fond du chaudron...</span>'
                  : poured
                      .map((id) => {
                        const v = vials.find((x) => x.id === id);
                        return v ? `${v.icon || ''} ${v.name}` : id;
                      })
                      .join(' ➔ ')
              }
            </div>
            <div style="margin-top:0.6rem;">
              <button type="button" class="mg-btn mg-btn-secondary" id="mg-cauldron-empty">🧹 Vider le Chaudron</button>
            </div>
          </div>
          <div class="mg-feedback" id="mg-cauldron-fb"></div>
        </div>
      `;

      const grid = stage.querySelector('#mg-vials-grid');
      const fb = stage.querySelector('#mg-cauldron-fb');

      vials.forEach((v) => {
        const isUsed = poured.includes(v.id);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.disabled = isUsed || poured.length >= targetSeq.length;
        btn.style.cssText = `
          cursor:pointer; padding:0.65rem; border-radius:10px;
          background:rgba(255,255,255,0.05);
          border:1.5px solid ${isUsed ? '#4ade80' : 'rgba(212,175,55,0.35)'};
          color:#f5ebd6; display:flex; align-items:center; gap:0.55rem; text-align:left;
        `;
        btn.innerHTML = `
          <svg width="34" height="42" viewBox="0 0 34 42" style="flex-shrink:0;">
            <rect x="12" y="2" width="10" height="6" rx="2" fill="#d4af37"/>
            <path d="M13 8 L13 15 L4 34 A5 5 0 0 0 8 40 L26 40 A5 5 0 0 0 30 34 L21 15 L21 8 Z" fill="${v.color || '#818cf8'}" stroke="#f8fafc" stroke-width="1.5"/>
            <circle cx="13" cy="30" r="2" fill="rgba(255,255,255,0.6)"/>
            <circle cx="19" cy="24" r="1.5" fill="rgba(255,255,255,0.6)"/>
          </svg>
          <div>
            <div style="font-weight:700; font-size:0.86rem;">${v.icon || ''} ${escapeHtml(v.name)}</div>
            <div style="font-size:0.74rem; opacity:0.75;">${escapeHtml(v.tag || '')}</div>
          </div>
        `;

        btn.addEventListener('click', () => {
          sfx.bubble();
          poured.push(v.id);
          renderLab();
          if (poured.length === targetSeq.length) {
            const isMatch = poured.every((id, i) => id === targetSeq[i]);
            const fbNow = stage.querySelector('#mg-cauldron-fb');
            if (isMatch) {
              sfx.chime();
              fbNow.className = 'mg-feedback show ok';
              fbNow.innerHTML = `<strong>✨ TRANSMUTATION PARFAITE !</strong> ${formatRichText(gc.victoryLore || 'Le chaudron dissout le dôme mensonger de Tiran !')}`;
              setTimeout(() => completeGame(wrapper, dayData, callbacks), 700);
            } else {
              sfx.error();
              triggerShake(wrapper);
              fbNow.className = 'mg-feedback show err';
              fbNow.textContent = '💨 Le mélange fume noir ! Clique sur « Vider le Chaudron » et suis les Lois II, III et IV du grimoire.';
            }
          }
        });

        grid.appendChild(btn);
      });

      stage.querySelector('#mg-cauldron-empty').addEventListener('click', () => {
        sfx.click();
        poured.length = 0;
        renderLab();
      });
    }

    renderLab();
  }

  /**
   * 17. "boss_thriller_cipher" (Jour 18 - BOSS 3 Freida McFadden & La Femme de l'Ombre)
   * Supporte gc.targetPinCode ('3426'), gc.caseFiles[] (fileTitle, clueText), gc.finalSecurityQuestion
   */
  function renderBossThrillerCipherGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const targetCode =
      String(gc.targetPinCode || gc.code || '3426').replace(/[^0-9]/g, '') || '3426';
    const digits = [0, 0, 0, 0];
    const caseFiles = gc.caseFiles || [];
    const finalQ = gc.finalSecurityQuestion || {
      title: "Verrou Biométrique Final — L'Autrice de *La Femme de l'Ombre*",
      question: "Tape le nom de l'autrice canadienne qui a écrit *La Femme de l'Ombre* (*The Maid's Diary*) :",
      expectedAnswers: ['LORETH ANNE WHITE', 'WHITE', 'LORETH WHITE']
    };

    function renderInvestigationWall() {
      stage.innerHTML = `
        <div class="mg-boss-bar">
          <div>
            <strong style="color:#fca5a5; font-family:'Cinzel',serif;">${escapeHtml(gc.bossAvatar || '🕵️‍♀️')} ${escapeHtml(gc.bossName || 'L’ARCHITECTE DU HUIS CLOS')}</strong>
            <div style="font-size:0.82rem; color:#fecaca;">${escapeHtml(gc.bossTitle || 'Maître des Chambres Verrouillées')}</div>
          </div>
          <div class="mg-boss-hearts">🔒🔒</div>
        </div>
        <div class="mg-question-box">
          <div class="mg-header-badge">Étape 1 / 2 — Les 4 Dossiers Classifiés & le Cadenas</div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.6rem; margin-bottom:1rem;">
            ${caseFiles
              .map(
                (c) => `
              <div style="padding:0.7rem; border-radius:8px; background:rgba(0,0,0,0.45); border:1px solid rgba(248,113,113,0.4); font-size:0.88rem; line-height:1.4;">
                <div style="font-weight:700; color:#fca5a5; margin-bottom:0.3rem;">${escapeHtml(c.fileTitle || c.name)}</div>
                <div>${formatRichText(c.clueText || c.clue)}</div>
              </div>
            `
              )
              .join('')}
          </div>
          <div class="mg-cryptex-cylinder" id="mg-cipher-dials"></div>
          <div style="text-align:center;">
            <button type="button" class="mg-btn mg-btn-crimson" id="mg-cipher-unlock">Déverrouiller le Cadenas 🔓</button>
          </div>
          <div class="mg-feedback" id="mg-cipher-fb"></div>
        </div>
      `;

      const dialsEl = stage.querySelector('#mg-cipher-dials');
      const fb = stage.querySelector('#mg-cipher-fb');

      digits.forEach((d, idx) => {
        const dial = document.createElement('div');
        dial.className = 'mg-cryptex-dial';
        dial.innerHTML = `
          <button type="button" class="mg-dial-btn" data-dir="1">▲</button>
          <div class="mg-dial-letter">${d}</div>
          <button type="button" class="mg-dial-btn" data-dir="-1">▼</button>
          <span style="font-size:0.72rem; color:#fca5a5;">Chiffre ${idx + 1}</span>
        `;
        dial.querySelectorAll('.mg-dial-btn').forEach((b) => {
          b.addEventListener('click', () => {
            sfx.typeKey();
            const dir = parseInt(b.dataset.dir, 10);
            digits[idx] = (digits[idx] + dir + 10) % 10;
            dial.querySelector('.mg-dial-letter').textContent = digits[idx];
          });
        });
        dialsEl.appendChild(dial);
      });

      stage.querySelector('#mg-cipher-unlock').addEventListener('click', () => {
        const entered = digits.join('');
        if (entered === targetCode) {
          sfx.bossHit();
          fb.className = 'mg-feedback show ok';
          fb.innerHTML = `<strong>🔓 CLAC ! (${targetCode})</strong> Le cadenas s’ouvre ! Place au verrou biométrique final !`;
          setTimeout(() => {
            renderFollowUpQuestionBox(
              stage,
              wrapper,
              finalQ,
              finalQ.title || 'Étape 2 / 2 — Verrou Biométrique Final',
              () => completeGame(wrapper, dayData, callbacks)
            );
          }, 650);
        } else {
          sfx.error();
          triggerShake(wrapper);
          fb.className = 'mg-feedback show err';
          fb.textContent = `Le cadenas refuse « ${entered} ». Calcule chaque chiffre grâce aux 4 dossiers ci-dessus !`;
        }
      });
    }

    renderInvestigationWall();
  }

  /**
   * 18. "providence_tarot_memory" (Jour 19 - Fenêtre sur les Ténèbres & Deux Couronnes Corrompues)
   * Supporte gc.pairs[] ({pairId, name, icon, borderColor, powerText}), gc.finalQuestion
   */
  function renderProvidenceTarotMemoryGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const pairs = (gc.pairs || [
      { pairId: 'nightmare', name: 'Le Cauchemar', icon: '👹' },
      { pairId: 'maiden', name: 'La Jeune Fille', icon: '🌹' },
      { pairId: 'scythe', name: 'La Faux', icon: '⚔️' },
      { pairId: 'mirror', name: 'Le Miroir Noir', icon: '🪞' },
      { pairId: 'steed', name: 'Le Destrier Blanc', icon: '🐎' },
      { pairId: 'chalice', name: "Le Calice d'Aulne", icon: '🏆' }
    ]).map((p) => ({
      id: p.pairId || p.id,
      name: p.name,
      icon: p.icon
    }));

    const deck = [...pairs, ...pairs]
      .map((card, i) => ({ ...card, uid: i, sort: Math.sin(i * 19 + 5) }))
      .sort((a, b) => a.sort - b.sort);

    let flipped = [];
    const matchedIds = new Set();
    let lockBoard = false;

    function renderBoard() {
      stage.innerHTML = `
        <div class="mg-question-box">
          <div class="mg-header-badge">${escapeHtml(gc.promptTitle || 'Les 12 Cartes de la Providence')}</div>
          <p style="margin:0 0 0.5rem 0; font-size:1.02rem;">
            Retourne les <strong>12 Cartes de la Providence</strong> deux par deux (${matchedIds.size} / ${pairs.length} paires réunies) :
          </p>
          <div class="mg-tarot-grid" id="mg-tarot-grid"></div>
        </div>
      `;

      const grid = stage.querySelector('#mg-tarot-grid');

      deck.forEach((card) => {
        const isMatched = matchedIds.has(card.id);
        const isFlipped = flipped.some((f) => f.uid === card.uid);

        const cardEl = document.createElement('div');
        cardEl.className = `mg-tarot-card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`;
        cardEl.innerHTML = `
          <div class="mg-tarot-inner">
            <div class="mg-tarot-face mg-tarot-back">
              <span>⚜️</span>
              <span style="font-size:0.65rem; letter-spacing:0.1em; margin-top:4px;">PROVIDENCE</span>
            </div>
            <div class="mg-tarot-face mg-tarot-front">
              <span style="font-size:1.65rem; margin-bottom:4px;">${card.icon}</span>
              <strong>${escapeHtml(card.name)}</strong>
            </div>
          </div>
        `;

        cardEl.addEventListener('click', () => {
          if (lockBoard || isMatched || flipped.some((f) => f.uid === card.uid)) return;
          sfx.flip();
          cardEl.classList.add('flipped');
          flipped.push({ ...card, el: cardEl });

          if (flipped.length === 2) {
            lockBoard = true;
            const [c1, c2] = flipped;
            if (c1.id === c2.id) {
              sfx.chime();
              matchedIds.add(c1.id);
              flipped = [];
              lockBoard = false;
              renderBoard();
              if (matchedIds.size === pairs.length) {
                setTimeout(() => {
                  const finalQ = gc.finalQuestion || {
                    question: "Comment s'appelle le monstre ancien qui partage l'esprit d'Elspeth Spindle ?",
                    expectedAnswers: ['LE CAUCHEMAR', 'CAUCHEMAR', 'ROI DES BERGERS']
                  };
                  renderFollowUpQuestionBox(
                    stage,
                    wrapper,
                    finalQ,
                    '✨ Les 12 Cartes sont Réunies — Question du Roi des Bergers',
                    () => completeGame(wrapper, dayData, callbacks)
                  );
                }, 550);
              }
            } else {
              setTimeout(() => {
                c1.el.classList.remove('flipped');
                c2.el.classList.remove('flipped');
                flipped = [];
                lockBoard = false;
              }, 680);
            }
          }
        });

        grid.appendChild(cardEl);
      });
    }

    renderBoard();
  }

  /**
   * 19. "anagram_forge" (Jour 20 - Red City, Gods of Men, @lau.libraryyy)
   * Supporte gc.seals[] ({title, clue, targetWord, scrambledLetters}) + gc.bonusQuestion
   */
  function renderAnagramForgeGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const seals = (gc.seals || [
      {
        title: 'Sceau I — La Métropole Alchimique',
        clue: 'Reconstitue le titre (sans espace) du roman de Marie Lu :',
        targetWord: 'REDCITY',
        scrambledLetters: ['C', 'R', 'Y', 'E', 'T', 'D', 'I']
      },
      {
        title: 'Sceau II — La Souveraine du Multivers',
        clue: 'Forge le nom de ton sanctuaire Bookstagram (avec ses trois Y !) :',
        targetWord: 'LAULIBRARYYY',
        scrambledLetters: ['Y', 'L', 'R', 'A', 'Y', 'U', 'B', 'L', 'I', 'R', 'Y', 'A']
      }
    ]).map((s) => ({
      title: s.title || 'Forge des Anagrammes',
      clue: s.clue || '',
      target: normalizeAnswer(s.targetWord || s.target),
      scrambled: s.scrambledLetters || s.scrambled || []
    }));

    let wIdx = 0;

    function renderForgeStep() {
      const w = seals[wIdx];
      const pool = w.scrambled.map((ch, idx) => ({ ch, id: idx, used: false }));
      const chosen = [];

      function updateUI() {
        stage.innerHTML = `
          <div class="mg-question-box" style="text-align:center;">
            <div class="mg-header-badge">${escapeHtml(w.title)} (${wIdx + 1} / ${seals.length})</div>
            <p style="font-size:1.05rem; margin:0 0 0.85rem 0;">${formatRichText(w.clue)}</p>
            <div style="display:flex; justify-content:center; gap:6px; flex-wrap:wrap; min-height:48px; padding:0.65rem; border-radius:8px; background:rgba(0,0,0,0.4); border:1px solid #d4af37; margin-bottom:0.9rem;">
              ${
                chosen.length === 0
                  ? '<span style="opacity:0.55; align-self:center;">Clique sur les runes magnétiques d’or ci-dessous...</span>'
                  : chosen
                      .map(
                        (item, cIdx) =>
                          `<button type="button" class="mg-key correct" data-remove="${cIdx}" title="Retirer cette lettre">${item.ch}</button>`
                      )
                      .join('')
              }
            </div>
            <div style="display:flex; justify-content:center; gap:6px; flex-wrap:wrap; margin-bottom:0.85rem;">
              ${pool
                .map(
                  (item) =>
                    `<button type="button" class="mg-key" data-add="${item.id}" ${item.used ? 'disabled style="opacity:0.25;"' : ''}>${item.ch}</button>`
                )
                .join('')}
            </div>
            <div style="display:flex; justify-content:center; gap:0.6rem;">
              <button type="button" class="mg-btn mg-btn-secondary" id="mg-anagram-clear">↺ Effacer les runes</button>
            </div>
            <div class="mg-feedback" id="mg-anagram-fb"></div>
          </div>
        `;

        stage.querySelectorAll('[data-add]').forEach((b) => {
          b.addEventListener('click', () => {
            const id = parseInt(b.dataset.add, 10);
            const item = pool.find((p) => p.id === id);
            if (!item || item.used) return;
            sfx.click();
            item.used = true;
            chosen.push(item);
            updateUI();

            if (chosen.length === w.target.length) {
              const formed = chosen.map((c) => c.ch).join('');
              const fbNow = stage.querySelector('#mg-anagram-fb');
              if (formed === w.target) {
                sfx.chime();
                fbNow.className = 'mg-feedback show ok';
                fbNow.innerHTML = `<strong>✨ ${w.target} FORGÉ DANS L’OR !</strong>`;
                setTimeout(() => {
                  wIdx++;
                  if (wIdx < seals.length) {
                    renderForgeStep();
                  } else if (gc.bonusQuestion) {
                    renderFollowUpQuestionBox(
                      stage,
                      wrapper,
                      gc.bonusQuestion,
                      'Validation Finale — *Gods of Men* & *The Poet Empress*',
                      () => completeGame(wrapper, dayData, callbacks)
                    );
                  } else {
                    completeGame(wrapper, dayData, callbacks);
                  }
                }, 650);
              } else {
                sfx.error();
                triggerShake(wrapper);
                fbNow.className = 'mg-feedback show err';
                fbNow.textContent = `« ${formed} » ne correspond pas encore à ${w.target}. Clique sur Effacer pour réessayer !`;
              }
            }
          });
        });

        stage.querySelectorAll('[data-remove]').forEach((b) => {
          b.addEventListener('click', () => {
            sfx.click();
            const cIdx = parseInt(b.dataset.remove, 10);
            const removed = chosen.splice(cIdx, 1)[0];
            if (removed) removed.used = false;
            updateUI();
          });
        });

        stage.querySelector('#mg-anagram-clear').addEventListener('click', () => {
          sfx.click();
          chosen.length = 0;
          pool.forEach((p) => (p.used = false));
          updateUI();
        });
      }

      updateUI();
    }

    renderForgeStep();
  }

  /**
   * 20. "boss_royal_conspiracy" (Jour 21 - BOSS 4 This Kingdom Will Not Kill Me & Rose in Chains)
   * Supporte gc.act1 (suspects[], correctSuspectId, logicalProof) et gc.act2 (rounds[] avec moves[])
   */
  function renderBossRoyalConspiracyGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const act1 = gc.act1 || {};
    const act2 = gc.act2 || {};
    const suspects = act1.suspects || [];
    const correctSuspectId = act1.correctSuspectId || 'suspect_2';
    const rounds = act2.rounds || [];

    function renderAct1() {
      stage.innerHTML = `
        <div class="mg-boss-bar">
          <div>
            <strong style="color:#fca5a5; font-family:'Cinzel',serif;">${escapeHtml(gc.bossAvatar || '👑')} ${escapeHtml(gc.bossName || 'L’USURPATEUR AUX CHAÎNES D’OR')}</strong>
            <div style="font-size:0.82rem; color:#fecaca;">${escapeHtml(gc.bossTitle || 'Seigneur des Conspirateurs')}</div>
          </div>
          <div class="mg-boss-hearts">🛡️⚔️👑</div>
        </div>
        <div class="mg-question-box">
          <div class="mg-header-badge">${escapeHtml(act1.title || 'Acte I — L’Interrogatoire des Conspirateurs')}</div>
          <p style="font-size:0.98rem; line-height:1.5; margin:0 0 0.75rem 0;">${formatRichText(act1.ruleDescription || '')}</p>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.6rem; margin-bottom:0.85rem;">
            ${suspects
              .map(
                (s) => `
              <div style="padding:0.7rem; border-radius:8px; background:rgba(0,0,0,0.4); border:1px solid rgba(212,175,55,0.35);">
                <div style="font-weight:700; color:#fde68a; margin-bottom:0.25rem;">${s.portrait || '🎭'} ${escapeHtml(s.name)}</div>
                <div style="font-size:0.9rem; font-style:italic;">${formatRichText(s.statement)}</div>
              </div>
            `
              )
              .join('')}
          </div>
          <p style="font-weight:600; margin-bottom:0.5rem;">${formatRichText(act1.question || 'Qui détient réellement la Clé Royale ?')}</p>
          <div class="mg-options-list" id="mg-guards-opts"></div>
          <div class="mg-feedback" id="mg-guards-fb"></div>
        </div>
      `;

      const optsEl = stage.querySelector('#mg-guards-opts');
      const fb = stage.querySelector('#mg-guards-fb');

      suspects.forEach((s) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'mg-option-btn';
        b.innerHTML = `<strong>${s.portrait || ''} ${escapeHtml(s.name)}</strong>`;
        b.addEventListener('click', () => {
          if (s.id === correctSuspectId) {
            sfx.chime();
            b.classList.add('correct');
            optsEl.querySelectorAll('button').forEach((btn) => (btn.disabled = true));
            fb.className = 'mg-feedback show ok';
            fb.innerHTML = `<strong>✨ ${formatRichText(act1.logicalProof || 'Déduction implacable !')}</strong>`;
            setTimeout(() => renderAct2(0, gc.bossMaxHp || 100), 1100);
          } else {
            sfx.error();
            triggerShake(wrapper);
            b.classList.add('wrong');
            fb.className = 'mg-feedback show err';
            fb.textContent = 'Si cette personne avait la clé, plus d’un suspect dirait la vérité ! Or UN SEUL dit la vérité.';
          }
        });
        optsEl.appendChild(b);
      });
    }

    function renderAct2(turnIdx, bossHp) {
      const r = rounds[turnIdx];
      if (!r) {
        completeGame(wrapper, dayData, callbacks);
        return;
      }

      stage.innerHTML = `
        <div class="mg-boss-bar">
          <div style="flex:1;">
            <strong style="color:#fca5a5; font-family:'Cinzel',serif;">⚔️ ${escapeHtml(act2.title || 'DUEL RPG TACTIQUE CONTRE L’USURPATEUR')}</strong>
            <div class="mg-progress-track" style="margin:0.4rem 0 0 0; height:10px; background:rgba(0,0,0,0.5);">
              <div class="mg-progress-fill" style="width:${bossHp}%; background:linear-gradient(90deg, #dc2626, #f97316);"></div>
            </div>
          </div>
          <div style="font-weight:700; color:#fca5a5;">PV : ${bossHp}%</div>
        </div>
        <div class="mg-question-box">
          <div class="mg-header-badge">Tour ${r.turn || turnIdx + 1} / ${rounds.length} — ${escapeHtml(r.bossAttackName || '')}</div>
          <p style="font-size:1.04rem; color:#fde68a; margin:0 0 0.5rem 0;">${formatRichText(r.bossAttackDescription || '')}</p>
          <p style="font-size:0.98rem; margin:0 0 0.7rem 0;"><strong>${formatRichText(r.tacticalPrompt || 'Choisis ta parade :')}</strong></p>
          <div class="mg-options-list" id="mg-rpg-actions"></div>
          <div class="mg-feedback" id="mg-rpg-fb"></div>
        </div>
      `;

      const list = stage.querySelector('#mg-rpg-actions');
      const fb = stage.querySelector('#mg-rpg-fb');

      (r.moves || []).forEach((m) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'mg-option-btn';
        b.innerHTML = `
          <div style="font-weight:700; color:#fde68a;">${escapeHtml(m.label)}</div>
          ${m.subText ? `<div style="font-size:0.88rem; opacity:0.88;">${escapeHtml(m.subText)}</div>` : ''}
        `;
        b.addEventListener('click', () => {
          if (m.isCorrect) {
            sfx.bossHit();
            triggerShake(wrapper);
            const rect = wrapper.getBoundingClientRect();
            sfx.burst(rect.left + rect.width / 2, rect.top + 80, 'epic');

            b.classList.add('correct');
            list.querySelectorAll('button').forEach((btn) => (btn.disabled = true));
            const nextHp = Math.max(0, bossHp - (r.bossDamageOnWin || 35));
            fb.className = 'mg-feedback show ok';
            fb.innerHTML = `<strong>${formatRichText(m.combatLog || '💥 COUP CRITIQUE !')}</strong>`;

            setTimeout(() => {
              if (turnIdx + 1 < rounds.length) {
                renderAct2(turnIdx + 1, nextHp);
              } else {
                completeGame(wrapper, dayData, callbacks);
              }
            }, 850);
          } else {
            sfx.error();
            triggerShake(wrapper);
            b.classList.add('wrong');
            fb.className = 'mg-feedback show err';
            fb.innerHTML = formatRichText(m.combatLog || 'Cette parade échoue !');
          }
        });
        list.appendChild(b);
      });
    }

    renderAct1();
  }

  /**
   * 21. "winter_sliding_puzzle" (Jour 22 - L'Effet Boule de Neige & Happy Place)
   * Supporte gc.tiles[] (id 1..8 et 0 vide), gc.initialBoard ([1,2,3,4,5,6,0,7,8]), gc.cozyQuestion
   */
  function renderWinterSlidingPuzzleGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const tilesDef = gc.tiles || [
      { id: 1, label: '1', icon: '🌨️', title: 'Ciel Étoilé' },
      { id: 2, label: '2', icon: '🏔️', title: 'Sommets Blancs' },
      { id: 3, label: '3', icon: '🌙', title: "Lune d'Hiver" },
      { id: 4, label: '4', icon: '🎄', title: 'Sapin Doré' },
      { id: 5, label: '5', icon: '🏡', title: 'Chalet Cocooning' },
      { id: 6, label: '6', icon: '📚', title: 'Pile de Livres' },
      { id: 7, label: '7', icon: '☕', title: 'Chocolat Chaud' },
      { id: 8, label: '8', icon: '🐸', title: 'Kingsley au Chaud' },
      { id: 0, label: '', icon: '✨', title: 'Case Vide', isEmpty: true }
    ];

    const initIds = gc.initialBoard || [1, 2, 3, 4, 5, 6, 0, 7, 8];
    let board = initIds.map((id) => tilesDef.find((t) => t.id === id) || tilesDef[0]);
    const targetOrder = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    let selectedIdx = null;

    function isSolved() {
      return board.every((t, idx) => t.id === targetOrder[idx]);
    }

    function onPuzzleSolved() {
      sfx.chime();
      const fbNow = stage.querySelector('#mg-slide-fb');
      if (fbNow) {
        fbNow.className = 'mg-feedback show ok';
        fbNow.innerHTML = '<strong>❄️ VITRAIL D’HIVER ALIGNÉ !</strong> Place à la question cocooning !';
      }
      setTimeout(() => {
        if (gc.cozyQuestion) {
          renderFollowUpQuestionBox(
            stage,
            wrapper,
            gc.cozyQuestion,
            'Étape 2 / 2 — Douceur Hivernale (*L’Effet Boule de Neige* & *Happy Place*)',
            () => completeGame(wrapper, dayData, callbacks)
          );
        } else {
          completeGame(wrapper, dayData, callbacks);
        }
      }, 650);
    }

    function renderGrid() {
      stage.innerHTML = `
        <div class="mg-question-box" style="text-align:center;">
          <div class="mg-header-badge">${escapeHtml(gc.promptTitle || 'Le Vitrail Hivernal de Noël (Taquin 3x3)')}</div>
          <p style="font-size:1rem; margin:0 0 0.65rem 0;">
            Aligne les tuiles <strong>1 à 8</strong> dans l’ordre (avec la case étoilée ✨ en bas à droite).<br>
            <span style="font-size:0.86rem; color:#93c5fd;">Clique sur une tuile adjacente à ✨ pour la faire glisser, ou clique sur deux tuiles pour les permuter !</span>
          </p>
          <div class="mg-sliding-grid" id="mg-slide-grid"></div>
          <div style="margin-top:0.75rem;">
            <button type="button" class="mg-btn mg-btn-secondary" id="mg-kingsley-boost">🐸 Coup de Pouce Magique de Kingsley</button>
          </div>
          <div class="mg-feedback" id="mg-slide-fb"></div>
        </div>
      `;

      const grid = stage.querySelector('#mg-slide-grid');

      board.forEach((tile, idx) => {
        const isCorrectPos = tile.id === targetOrder[idx];
        const isSelected = selectedIdx === idx;
        const el = document.createElement('div');
        el.className = `mg-slide-tile ${tile.isEmpty ? 'empty' : ''} ${isCorrectPos ? 'correct-pos' : ''} ${
          isSelected ? 'selected' : ''
        }`;
        el.innerHTML = `
          <span style="font-size:1.55rem;">${tile.icon}</span>
          <span style="font-size:0.72rem; font-weight:700; margin-top:2px;">${tile.label ? `${tile.label}. ` : ''}${escapeHtml(tile.title || '')}</span>
        `;

        el.addEventListener('click', () => {
          const emptyIdx = board.findIndex((t) => t.isEmpty || t.id === 0);
          const row = Math.floor(idx / 3);
          const col = idx % 3;
          const emptyRow = Math.floor(emptyIdx / 3);
          const emptyCol = emptyIdx % 3;
          const isAdjToEmpty = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;

          if (isAdjToEmpty && selectedIdx === null) {
            sfx.flip();
            const tmp = board[idx];
            board[idx] = board[emptyIdx];
            board[emptyIdx] = tmp;
            renderGrid();
          } else if (selectedIdx === null) {
            sfx.click();
            selectedIdx = idx;
            renderGrid();
          } else if (selectedIdx === idx) {
            selectedIdx = null;
            renderGrid();
          } else {
            sfx.flip();
            const tmp = board[idx];
            board[idx] = board[selectedIdx];
            board[selectedIdx] = tmp;
            selectedIdx = null;
            renderGrid();
          }

          if (isSolved()) {
            onPuzzleSolved();
          }
        });

        grid.appendChild(el);
      });

      stage.querySelector('#mg-kingsley-boost').addEventListener('click', () => {
        board = targetOrder.map((id) => tilesDef.find((t) => t.id === id));
        selectedIdx = null;
        renderGrid();
        onPuzzleSolved();
      });
    }

    renderGrid();
  }

  /**
   * 22. "legendary_finale" (Jour 24 - LÉGENDAIRE : Le Sanctuaire de Lau.libraryyy)
   * Supporte gc.seal1 (pillars[]), gc.seal2 (acrosticLines[], expectedFinalWords[]), gc.seal3 (defaultLoveLetter)
   */
  function renderLegendaryFinaleGame(stage, wrapper, dayData, callbacks) {
    const gc = (dayData && dayData.gameConfig) || {};
    const seal1 = gc.seal1 || {};
    const seal2 = gc.seal2 || {};
    const seal3 = gc.seal3 || {};

    const pillars = seal1.pillars || [
      { id: 'p1', label: 'Pilier du Feu de Daevabad & du Maram', icon: '🔥', quote: 'Pour ta saga préférée de S.A. Chakraborty.' },
      { id: 'p2', label: 'Pilier des Souvenirs : Mons, Trolls & Légendes & Irlande', icon: '🍻☘️', quote: 'Pour nos bières belges et nos voyages.' },
      { id: 'p3', label: 'Pilier de Caten, Aldryn & Red City', icon: '🏛️🌙', quote: 'Pour nos lectures communes.' },
      { id: 'p4', label: 'Pilier du Vilain, Evie Sage & Kingsley', icon: '👑🐸', quote: 'Pour la reine de @lau.libraryyy !' }
    ];
    const socketed = new Set();

    function renderSeal1() {
      stage.innerHTML = `
        <div class="mg-question-box" style="text-align:center; border-color:#ffd700;">
          <div class="mg-header-badge">${escapeHtml(seal1.title || 'Premier Sceau — La Rosace Astrale des 24 Runes')}</div>
          <p style="font-size:1.05rem; margin:0 0 0.85rem 0;">
            ${formatRichText(seal1.description || 'Active les 4 Piliers Cardinaux du Multivers pour enchâsser tes Runes :')}
          </p>
          <div id="mg-rosette-btns" style="display:flex; flex-direction:column; gap:0.65rem; margin-top:0.8rem; text-align:left;"></div>
        </div>
      `;

      const container = stage.querySelector('#mg-rosette-btns');
      pillars.forEach((p) => {
        const isDone = socketed.has(p.id);
        const b = document.createElement('button');
        b.type = 'button';
        b.className = `mg-option-btn ${isDone ? 'correct' : ''}`;
        b.disabled = isDone;
        b.innerHTML = `
          <div style="font-family:'Cinzel',serif; font-weight:700; color:#fde68a;">${p.icon} ${escapeHtml(p.label)} ${isDone ? '✨ (Enchâssé)' : ''}</div>
          ${p.quote ? `<div style="font-size:0.9rem; opacity:0.9; margin-top:3px;">${formatRichText(p.quote)}</div>` : ''}
        `;
        b.addEventListener('click', (e) => {
          sfx.chime();
          const rect = e.currentTarget.getBoundingClientRect();
          sfx.burst(rect.left + rect.width / 2, rect.top, 'legendary');
          socketed.add(p.id);
          renderSeal1();
          if (socketed.size === pillars.length) {
            setTimeout(() => renderSeal2(), 650);
          }
        });
        container.appendChild(b);
      });
    }

    function renderSeal2() {
      const lines = seal2.acrosticLines || [
        { expectedLetter: 'A', clue: '1re lettre : Comme **A**uren (*Gild*), **A**mina al-Sirafi ou **A**ssistant to the Villain.' },
        { expectedLetter: 'M', clue: '2e lettre : Comme **M**ons ou le navire Le **M**aram.' },
        { expectedLetter: 'O', clue: '3e lettre : Comme l’**O**nirophage Paige Mahoney (*The Bone Season*) ou **O**livia Gometz.' },
        { expectedLetter: 'U', clue: '4e lettre : Comme **U**n passé englouti (Ava Reid).' },
        { expectedLetter: 'R', clue: '5e lettre : Comme **R**ed City, **R**in de Sinegard ou **R**une Winters.' }
      ];
      const expectedWords = seal2.expectedFinalWords || ['AMOUR', 'LAURA', 'LAMOUR'];

      stage.innerHTML = `
        <div class="mg-question-box">
          <div class="mg-header-badge">${escapeHtml(seal2.title || 'Deuxième Sceau — L’Acrostiche Final du Multivers')}</div>
          <p style="font-size:1.05rem; margin:0 0 0.75rem 0;">
            ${formatRichText(seal2.instruction || 'Résous l’acrostiche et tape le mot secret en 5 lettres :')}
          </p>
          <div style="background:rgba(0,0,0,0.4); padding:0.85rem; border-radius:10px; border:1px solid rgba(212,175,55,0.45); margin-bottom:1rem; line-height:1.6;">
            ${lines
              .map(
                (l) =>
                  `<div style="margin-bottom:0.3rem;"><span style="display:inline-block; width:30px; font-family:'Cinzel',serif; font-weight:700; color:#ffd700;">[${escapeHtml(l.expectedLetter)}]</span> ${formatRichText(l.clue)}</div>`
              )
              .join('')}
          </div>
          <div class="mg-input-row">
            <input type="text" class="mg-runic-input" id="mg-acrostic-inp" placeholder="${escapeHtml(seal2.placeholder || 'Tape AMOUR ou LAURA...')}" autocomplete="off" />
            <button type="button" class="mg-btn" id="mg-acrostic-btn">Invoquer l’Acrostiche 🌟</button>
          </div>
          <div class="mg-feedback" id="mg-acrostic-fb"></div>
        </div>
      `;

      const inp = stage.querySelector('#mg-acrostic-inp');
      const btn = stage.querySelector('#mg-acrostic-btn');
      const fb = stage.querySelector('#mg-acrostic-fb');

      const check = () => {
        if (matchesAnyAnswer(inp.value, expectedWords)) {
          sfx.chime();
          fb.className = 'mg-feedback show ok';
          fb.innerHTML = '<strong>🌟 L’ACROSTICHE S’ILLUMINE D’OR !</strong> Le Troisième Sceau Royal s’ouvre devant toi !';
          setTimeout(() => renderSeal3(), 700);
        } else {
          sfx.error();
          triggerShake(wrapper);
          fb.className = 'mg-feedback show err';
          fb.textContent = 'Regarde les 5 initiales dorées entre crochets : A - M - O - U - R (ou LAURA) !';
        }
      };

      btn.addEventListener('click', check);
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') check();
      });
      setTimeout(() => { if (inp && typeof inp.focus === "function") inp.focus(); }, 50);
    }

    function renderSeal3() {
      const rect = wrapper.getBoundingClientRect();
      sfx.burst(rect.left + rect.width / 2, rect.top + 80, 'legendary');

      const letterText =
        seal3.defaultLoveLetter ||
        "Ma tendre Laura, mon Assistante préférée et Reine absolue de @lau.libraryyy,\n\nJoyeux Noël mon amour ! Que ta bibliothèque continue de grandir et que nous écrivions encore des milliers de chapitres tous les deux.\n\nAvec tout mon amour,\nTon Vilain préféré ❤️";

      stage.innerHTML = `
        <div class="mg-question-box" style="text-align:center; border:2px solid #ffd700; background:linear-gradient(145deg, rgba(45,15,28,0.92), rgba(20,14,32,0.96));">
          <div class="mg-header-badge" style="background:rgba(255,215,0,0.2); color:#ffd700;">${escapeHtml(seal3.title || 'Troisième Sceau — La Lettre d’Amour du Vilain')}</div>
          <div style="font-size:2.8rem; margin:0.35rem 0;">💌👑🐸</div>
          <div style="text-align:left; font-size:1.04rem; line-height:1.65; padding:1.15rem; margin:0.8rem 0; border-radius:10px; background:rgba(0,0,0,0.48); border:1px solid rgba(255,215,0,0.4); color:#fdf6e2;">
            ${formatRichText(letterText)}
          </div>
          <button type="button" class="mg-btn" id="mg-finale-break-seal" style="font-size:1.05rem; padding:0.85rem 1.7rem;">
            👑 Desceller le Coffre Légendaire du 24 Décembre ✨
          </button>
        </div>
      `;

      stage.querySelector('#mg-finale-break-seal').addEventListener('click', (e) => {
        sfx.crack();
        sfx.chest('legendary');
        const bRect = e.currentTarget.getBoundingClientRect();
        sfx.burst(bRect.left + bRect.width / 2, bRect.top, 'legendary');
        completeGame(wrapper, dayData, callbacks, { legendaryCompleted: true });
      });
    }

    renderSeal1();
  }

  // ============================================================================
  // 5. ROUTEUR PRINCIPAL : WINDOW.MINIGAMESENGINE.RENDERGAME
  // ============================================================================
  const GAME_RENDERERS = {
    password: renderPasswordGame,
    troll_quiz: renderQuizGame,
    grand_council_quiz: renderQuizGame,
    book_wordle: renderBookWordleGame,
    aldryn_ritual: renderAldrynRitualGame,
    cryptex: renderCryptexGame,
    boss_caten: renderBossCatenGame,
    hangman: renderHangmanGame,
    reflex_flame: renderReflexFlameGame,
    einstein_tavern: renderEinsteinTavernGame,
    truth_trial: renderTruthTrialGame,
    boss_fire: renderBossFireGame,
    gild_ribbons: renderGildRibbonsGame,
    lunar_mechanisms: renderLunarMechanismsGame,
    maram_compass: renderMaramCompassGame,
    enchanted_typewriter: renderEnchantedTypewriterGame,
    alchemy_cauldron: renderAlchemyCauldronGame,
    boss_thriller_cipher: renderBossThrillerCipherGame,
    providence_tarot_memory: renderProvidenceTarotMemoryGame,
    anagram_forge: renderAnagramForgeGame,
    boss_royal_conspiracy: renderBossRoyalConspiracyGame,
    winter_sliding_puzzle: renderWinterSlidingPuzzleGame,
    legendary_finale: renderLegendaryFinaleGame
  };

  const DAY_TO_GAMETYPE = {
    1: 'password',
    2: 'troll_quiz',
    3: 'book_wordle',
    4: 'aldryn_ritual',
    5: 'cryptex',
    6: 'boss_caten',
    7: 'password',
    8: 'hangman',
    9: 'reflex_flame',
    10: 'einstein_tavern',
    11: 'truth_trial',
    12: 'boss_fire',
    13: 'gild_ribbons',
    14: 'lunar_mechanisms',
    15: 'maram_compass',
    16: 'enchanted_typewriter',
    17: 'alchemy_cauldron',
    18: 'boss_thriller_cipher',
    19: 'providence_tarot_memory',
    20: 'anagram_forge',
    21: 'boss_royal_conspiracy',
    22: 'winter_sliding_puzzle',
    23: 'grand_council_quiz',
    24: 'legendary_finale'
  };

  class MiniGamesEngine {
    constructor() {
      this._expectsContainerFirst = true;
      this.normalizeAnswer = normalizeAnswer;
    }

    /**
     * Rend le mini-jeu correspondant à dayData dans containerEl.
     * Supporte toutes les conventions d'appel :
     *   - renderGame(containerEl, dayData, callbacksOrFn)
     *   - renderGame(dayData, containerEl, callbacksOrFn)
     *   - renderGame({ container, dayData, onVictory })
     */
    renderGame(containerEl, dayData = {}, callbacks = {}) {
      injectMiniGamesStyles();

      let resolvedContainer = containerEl;
      let resolvedDayData = dayData;
      let resolvedCallbacks = callbacks;

      // Cas objet unique : renderGame({ container, dayData, onVictory })
      if (
        containerEl &&
        typeof containerEl === 'object' &&
        !(containerEl instanceof Element) &&
        (containerEl.container || containerEl.dayData)
      ) {
        resolvedContainer = containerEl.container;
        resolvedDayData = containerEl.dayData || containerEl;
        resolvedCallbacks = containerEl;
      } else if (
        containerEl &&
        typeof containerEl === 'object' &&
        !(containerEl instanceof Element) &&
        dayData instanceof Element
      ) {
        // Cas inversé : renderGame(dayData, containerEl, callbacks)
        resolvedContainer = dayData;
        resolvedDayData = containerEl;
      }

      const container =
        typeof resolvedContainer === 'string'
          ? document.querySelector(resolvedContainer)
          : resolvedContainer;

      if (!container) {
        console.error('[MiniGamesEngine] Container element not found:', resolvedContainer);
        return;
      }

      const normCb = normalizeCallbacks(resolvedCallbacks);
      const dayNum = resolvedDayData.day || resolvedDayData.id || 1;
      const gc = resolvedDayData.gameConfig || {};
      const rawType =
        resolvedDayData.gameType ||
        gc.gameType ||
        gc.type ||
        DAY_TO_GAMETYPE[dayNum] ||
        'password';

      const renderer = GAME_RENDERERS[rawType] || renderPasswordGame;

      container.innerHTML = '';
      const wrapper = document.createElement('div');
      wrapper.className = 'mg-wrapper';
      wrapper.dataset.gameType = rawType;
      wrapper.dataset.day = String(dayNum);

      const stage = document.createElement('div');
      stage.className = 'mg-stage';
      wrapper.appendChild(stage);

      container.appendChild(wrapper);

      // Monte le mini-jeu spécifique
      renderer(stage, wrapper, resolvedDayData, normCb);

      // Ajoute le bandeau d'indices (Murmure + Sort de Lune d'Aldryn) et le bouton Mode Aperçu
      buildCommonFooter(wrapper, resolvedDayData, normCb, () => {
        if (rawType === 'aldryn_ritual') {
          return {
            aldrynHouse: 'FULL_MOON',
            aldrynHouseName: 'Maison de la Pleine Lune',
            aldrynTotem: "Le Phénix d'Argent & de Feu",
            unlockedLunarPower: true
          };
        }
        return {};
      });
    }
  }

  window.MiniGamesEngine = new MiniGamesEngine();
})();
