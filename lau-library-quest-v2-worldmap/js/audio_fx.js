/**
 * AUDIO_FX.JS & PARTICLE_FX.JS
 * Moteur d'effets sonores mystiques 100% procédural (Web Audio API)
 * et système de particules étoilées / confettis royaux sur <canvas>.
 * Sans aucune dépendance externe - Vanilla JS ES6+
 */

(function () {
  'use strict';

  // ============================================================================
  // 1. WINDOW.AUDIOFX - MOTEUR SONORE PROCÉDURAL MYSTIQUE (WEB AUDIO API)
  // ============================================================================
  class ProceduralAudioEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.masterGain = null;
      this._loadMuteState();
    }

    _loadMuteState() {
      try {
        const saved = localStorage.getItem('lau_library_audio_muted');
        if (saved !== null) {
          this.muted = JSON.parse(saved);
        }
      } catch (e) {
        this.muted = false;
      }
    }

    _saveMuteState() {
      try {
        localStorage.setItem('lau_library_audio_muted', JSON.stringify(this.muted));
      } catch (e) {
        // Ignore storage errors
      }
    }

    _ensureContext() {
      if (this.muted) return null;
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.7;
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    isMuted() {
      return this.muted;
    }

    setMuted(flag) {
      this.muted = Boolean(flag);
      this._saveMuteState();
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.7, this.ctx.currentTime);
      }
      return this.muted;
    }

    toggleMute() {
      const next = !this.muted;
      this.setMuted(next);
      if (!next) {
        this.playClick();
      }
      return next;
    }

    // Générateur de bruit blanc / rose filtré (pour parchemin, cire, cartes, machine à écrire)
    _createNoiseBuffer(durationSec = 0.3) {
      const ctx = this._ensureContext();
      if (!ctx) return null;
      const sampleRate = ctx.sampleRate;
      const bufferSize = Math.floor(sampleRate * durationSec);
      const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      return buffer;
    }

    /**
     * playClick() : léger son cristallin accompagné d'un effleurement de parchemin
     */
    playClick() {
      const ctx = this._ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Cristal doux
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(1480, now + 0.065);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.09);

      // Léger grain de parchemin
      const noiseBuf = this._createNoiseBuffer(0.04);
      if (noiseBuf) {
        const src = ctx.createBufferSource();
        src.buffer = noiseBuf;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 3200;
        filter.Q.value = 2.5;
        const nGain = ctx.createGain();
        nGain.gain.setValueAtTime(0.04, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

        src.connect(filter);
        filter.connect(nGain);
        nGain.connect(this.masterGain);
        src.start(now);
      }
    }

    /**
     * playCardFlip() : bruissement mystique de carte de tarot + souffle astral
     */
    playCardFlip() {
      const ctx = this._ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Souffle de papier tarot (bruit filtré avec sweep)
      const noiseBuf = this._createNoiseBuffer(0.22);
      if (noiseBuf) {
        const src = ctx.createBufferSource();
        src.buffer = noiseBuf;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(700, now);
        filter.frequency.exponentialRampToValueAtTime(2600, now + 0.11);
        filter.frequency.exponentialRampToValueAtTime(900, now + 0.21);
        filter.Q.value = 1.8;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.21);

        src.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        src.start(now);
      }

      // Harmonique mystique subtile
      const osc = ctx.createOscillator();
      const oGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(528, now + 0.03);
      osc.frequency.exponentialRampToValueAtTime(792, now + 0.18);

      oGain.gain.setValueAtTime(0.001, now + 0.03);
      oGain.gain.linearRampToValueAtTime(0.07, now + 0.07);
      oGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(oGain);
      oGain.connect(this.masterGain);
      osc.start(now + 0.03);
      osc.stop(now + 0.21);
    }

    /**
     * playRuneChime() : accord harpe/célesta doré quand une étape est réussie
     */
    playRuneChime() {
      const ctx = this._ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Arpège céleste doré (Ré majeur 9 / Lydien mystique)
      const notes = [587.33, 739.99, 880.0, 1174.66, 1318.51];

      notes.forEach((freq, idx) => {
        const start = now + idx * 0.055;
        const osc = ctx.createOscillator();
        const overtone = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * 2, start);

        const overtoneGain = ctx.createGain();
        overtoneGain.gain.value = 0.25;

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.16, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.65);

        osc.connect(gain);
        overtone.connect(overtoneGain);
        overtoneGain.connect(gain);
        gain.connect(this.masterGain);

        osc.start(start);
        overtone.start(start);
        osc.stop(start + 0.68);
        overtone.stop(start + 0.68);
      });
    }

    /**
     * playError() : vibration sourde de sceau magique qui résiste
     */
    playError() {
      const ctx = this._ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      // Intervalle dissonant grave (seconde mineure / triton sourd)
      osc1.frequency.setValueAtTime(145, now);
      osc1.frequency.linearRampToValueAtTime(112, now + 0.28);

      osc2.frequency.setValueAtTime(154, now);
      osc2.frequency.linearRampToValueAtTime(118, now + 0.28);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(620, now);
      filter.frequency.exponentialRampToValueAtTime(220, now + 0.3);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.02);
      gain.gain.setValueAtTime(0.18, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.34);
      osc2.stop(now + 0.34);
    }

    /**
     * playWaxCrack() : craquement sec de sceau de cire qui se fissure sous le clic
     */
    playWaxCrack() {
      const ctx = this._ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Série de micro-impulsions de fracture
      const crackTimes = [0, 0.028, 0.065, 0.11];
      crackTimes.forEach((offset, i) => {
        const t = now + offset;
        const noiseBuf = this._createNoiseBuffer(0.045);
        if (!noiseBuf) return;

        const src = ctx.createBufferSource();
        src.buffer = noiseBuf;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1800 + i * 450, t);
        filter.Q.value = 3.2;

        const gain = ctx.createGain();
        const amp = i === 0 ? 0.28 : 0.2 / i;
        gain.gain.setValueAtTime(amp, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

        src.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        src.start(t);
      });

      // Impact grave du cachet
      const thud = ctx.createOscillator();
      const tGain = ctx.createGain();
      thud.type = 'triangle';
      thud.frequency.setValueAtTime(210, now);
      thud.frequency.exponentialRampToValueAtTime(68, now + 0.11);

      tGain.gain.setValueAtTime(0.22, now);
      tGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      thud.connect(tGain);
      tGain.connect(this.masterGain);
      thud.start(now);
      thud.stop(now + 0.13);
    }

    /**
     * playChestOpen(rarity) : fanfare mystique adaptée à la rareté ('common' | 'epic' | 'legendary')
     */
    playChestOpen(rarity = 'common') {
      const ctx = this._ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const normRarity = String(rarity || 'common').toLowerCase();

      // Craquement d'ouverture du coffre ancien
      this.playWaxCrack();

      if (normRarity === 'legendary') {
        // Symphonie céleste aux cloches d'or et choeur astral
        const chord = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
        chord.forEach((freq, idx) => {
          const start = now + 0.08 + idx * 0.075;
          const osc = ctx.createOscillator();
          const bell = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);

          bell.type = 'triangle';
          bell.frequency.setValueAtTime(freq * 2.0, start);

          const bellGain = ctx.createGain();
          bellGain.gain.value = 0.35;

          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.18, start + 0.025);
          gain.gain.exponentialRampToValueAtTime(0.0008, start + 1.65);

          osc.connect(gain);
          bell.connect(bellGain);
          bellGain.connect(gain);
          gain.connect(this.masterGain);

          osc.start(start);
          bell.start(start);
          osc.stop(start + 1.7);
          bell.stop(start + 1.7);
        });
      } else if (normRarity === 'epic' || normRarity === 'boss') {
        // Fanfare dramatique et puissante (cuivres mystiques + carillon)
        const notes = [220.0, 277.18, 329.63, 440.0, 554.37, 659.25, 880.0];
        notes.forEach((freq, idx) => {
          const start = now + 0.06 + idx * 0.065;
          const osc = ctx.createOscillator();
          const sub = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, start);

          sub.type = 'triangle';
          sub.frequency.setValueAtTime(freq * 0.5, start);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(2400, start);

          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 1.1);

          osc.connect(filter);
          sub.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain);

          osc.start(start);
          sub.start(start);
          osc.stop(start + 1.15);
          sub.stop(start + 1.15);
        });
      } else {
        // Fanfare douce et féerique pour coffre 'common'
        const notes = [440.0, 554.37, 659.25, 880.0, 1108.73];
        notes.forEach((freq, idx) => {
          const start = now + 0.05 + idx * 0.06;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.15, start + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.8);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(start);
          osc.stop(start + 0.85);
        });
      }
    }

    /**
     * playBossHit() : impact dramatique quand le Boss perd un cœur de Volonté ou des PV
     */
    playBossHit() {
      const ctx = this._ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Onde de choc sub-bass
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(160, now);
      sub.frequency.exponentialRampToValueAtTime(38, now + 0.35);

      subGain.gain.setValueAtTime(0.38, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      sub.connect(subGain);
      subGain.connect(this.masterGain);
      sub.start(now);
      sub.stop(now + 0.4);

      // Éclat métallique d'épée / bris d'armure runique
      const noiseBuf = this._createNoiseBuffer(0.26);
      if (noiseBuf) {
        const src = ctx.createBufferSource();
        src.buffer = noiseBuf;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.frequency.exponentialRampToValueAtTime(420, now + 0.25);
        filter.Q.value = 1.4;

        const nGain = ctx.createGain();
        nGain.gain.setValueAtTime(0.32, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        src.connect(filter);
        filter.connect(nGain);
        nGain.connect(this.masterGain);
        src.start(now);
      }

      // Résonance cristalline de fissure
      const chime = ctx.createOscillator();
      const cGain = ctx.createGain();
      chime.type = 'sawtooth';
      chime.frequency.setValueAtTime(620, now);
      chime.frequency.exponentialRampToValueAtTime(280, now + 0.22);

      cGain.gain.setValueAtTime(0.14, now);
      cGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      chime.connect(cGain);
      cGain.connect(this.masterGain);
      chime.start(now);
      chime.stop(now + 0.25);
    }

    /**
     * playTypewriterKey() : cliquetis authentique de machine à écrire ancienne (Jour 16 Divines Rivalités)
     */
    playTypewriterKey() {
      const ctx = this._ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Frappe mécanique du marteau sur le ruban d'encre
      const noiseBuf = this._createNoiseBuffer(0.045);
      if (noiseBuf) {
        const src = ctx.createBufferSource();
        src.buffer = noiseBuf;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2400 + Math.random() * 500, now);
        filter.Q.value = 2.8;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        src.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        src.start(now);
      }

      // Petit ressort métallique de retour
      const osc = ctx.createOscillator();
      const oGain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(420 + Math.random() * 80, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.028);

      oGain.gain.setValueAtTime(0.11, now);
      oGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(oGain);
      oGain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.032);
    }

    /**
     * playPotionBubble() : glouglou alchimique (Jour 17 Laboratoire d'Alchimie)
     */
    playPotionBubble() {
      const ctx = this._ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 3 bulles successives qui éclatent à la surface du chaudron
      const baseFreqs = [320, 460, 580];
      baseFreqs.forEach((baseF, idx) => {
        const start = now + idx * 0.075;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const f1 = baseF + (Math.random() * 60 - 30);
        osc.frequency.setValueAtTime(f1, start);
        osc.frequency.exponentialRampToValueAtTime(f1 * 2.15, start + 0.065);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.18, start + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.07);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(start);
        osc.stop(start + 0.075);
      });
    }

    /**
     * Monte automatiquement un bouton Mute/Unmute s'il existe dans le DOM
     * ou expose un helper pour le créer.
     */
    bindMuteButton(buttonOrSelector) {
      const btn =
        typeof buttonOrSelector === 'string'
          ? document.querySelector(buttonOrSelector)
          : buttonOrSelector;
      if (!btn) return;

      const updateUI = () => {
        btn.setAttribute('aria-pressed', String(!this.muted));
        btn.dataset.muted = String(this.muted);
        if (btn.classList.contains('audio-toggle-btn') || btn.children.length === 0) {
          btn.innerHTML = this.muted ? '🔇 Son coupé' : '🔊 Effets mystiques';
        }
      };

      updateUI();
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMute();
        updateUI();
      });
    }
  }

  // ============================================================================
  // 2. WINDOW.PARTICLEFX - POUSSIÈRE D'OR AMBIANTE & EXPLOSIONS DE COFFRES
  // ============================================================================
  class MysticalParticleEngine {
    constructor() {
      this.ambientCanvas = null;
      this.ambientCtx = null;
      this.ambientParticles = [];
      this.ambientAnimId = null;

      this.burstCanvas = null;
      this.burstCtx = null;
      this.burstParticles = [];
      this.burstAnimId = null;
    }

    /**
     * Système de poussière d'or et flocons d'étoiles flottants en arrière-plan
     * @param {string|HTMLCanvasElement} canvasId
     */
    initAmbientCanvas(canvasId = 'ambient-particles-canvas') {
      let canvas =
        typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;

      if (!canvas) {
        // Crée automatiquement le canvas d'ambiance s'il n'est pas encore dans le DOM
        canvas = document.createElement('canvas');
        canvas.id = typeof canvasId === 'string' ? canvasId : 'ambient-particles-canvas';
        Object.assign(canvas.style, {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: '1'
        });
        document.body.prepend(canvas);
      }

      this.ambientCanvas = canvas;
      this.ambientCtx = canvas.getContext('2d');

      const resize = () => {
        if (!this.ambientCanvas) return;
        this.ambientCanvas.width = window.innerWidth;
        this.ambientCanvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener('resize', resize, { passive: true });

      const count = Math.min(75, Math.max(35, Math.floor(window.innerWidth / 24)));
      this.ambientParticles = [];
      const palette = [
        'rgba(212, 175, 55, ', // Or royal #d4af37
        'rgba(245, 222, 145, ', // Poussière stellaire
        'rgba(200, 117, 51, ', // Cuivre astral
        'rgba(255, 245, 214, ' // Éclat de lune
      ];

      for (let i = 0; i < count; i++) {
        this.ambientParticles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: Math.random() * 2.3 + 0.7,
          vx: (Math.random() - 0.5) * 0.28,
          vy: -Math.random() * 0.38 - 0.08,
          alpha: Math.random() * 0.65 + 0.15,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: Math.random() * 0.025 + 0.008,
          isStar: Math.random() > 0.72,
          colorPrefix: palette[Math.floor(Math.random() * palette.length)]
        });
      }

      if (this.ambientAnimId) {
        cancelAnimationFrame(this.ambientAnimId);
      }

      const renderAmbient = () => {
        if (!this.ambientCtx || !this.ambientCanvas) return;
        const ctx = this.ambientCtx;
        const w = this.ambientCanvas.width;
        const h = this.ambientCanvas.height;

        ctx.clearRect(0, 0, w, h);

        for (let i = 0; i < this.ambientParticles.length; i++) {
          const p = this.ambientParticles[i];
          p.x += p.vx + Math.sin(p.phase) * 0.12;
          p.y += p.vy;
          p.phase += p.phaseSpeed;

          if (p.y < -10) p.y = h + 10;
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;

          const twinkle = Math.max(0.1, Math.min(0.95, p.alpha + Math.sin(p.phase) * 0.25));
          ctx.save();
          ctx.fillStyle = `${p.colorPrefix}${twinkle.toFixed(2)})`;

          if (p.isStar) {
            // Dessine une petite étoile à 4 branches
            this._drawFourPointStar(ctx, p.x, p.y, p.r * 2.1);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        this.ambientAnimId = requestAnimationFrame(renderAmbient);
      };

      this.ambientAnimId = requestAnimationFrame(renderAmbient);
    }

    _drawFourPointStar(ctx, x, y, size) {
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.quadraticCurveTo(x, y, x + size, y);
      ctx.quadraticCurveTo(x, y, x, y + size);
      ctx.quadraticCurveTo(x, y, x - size, y);
      ctx.quadraticCurveTo(x, y, x, y - size);
      ctx.closePath();
      ctx.fill();
    }

    _ensureBurstCanvas() {
      if (this.burstCanvas && document.body.contains(this.burstCanvas)) {
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.id = 'particle-burst-overlay-canvas';
      Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: '99999'
      });
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.appendChild(canvas);

      window.addEventListener(
        'resize',
        () => {
          if (this.burstCanvas) {
            this.burstCanvas.width = window.innerWidth;
            this.burstCanvas.height = window.innerHeight;
          }
        },
        { passive: true }
      );

      this.burstCanvas = canvas;
      this.burstCtx = canvas.getContext('2d');
    }

    /**
     * Explosion de particules d'or, d'éclats écarlates ou de confettis royaux
     * @param {number} [x] - Coordonnée X (par défaut centre de l'écran)
     * @param {number} [y] - Coordonnée Y (par défaut centre de l'écran)
     * @param {string} [rarity='common'] - 'common' | 'epic' | 'legendary' | 'crimson'
     */
    burst(x, y, rarity = 'common') {
      this._ensureBurstCanvas();
      const originX = typeof x === 'number' && !isNaN(x) ? x : window.innerWidth / 2;
      const originY = typeof y === 'number' && !isNaN(y) ? y : window.innerHeight / 2;
      const normRarity = String(rarity || 'common').toLowerCase();

      let count = 55;
      let colors = ['#d4af37', '#f5e19c', '#c87533', '#fff6d6'];

      if (normRarity === 'legendary') {
        count = 135;
        colors = ['#ffd700', '#fff3b0', '#e63946', '#a855f7', '#38bdf8', '#d4af37'];
      } else if (normRarity === 'epic' || normRarity === 'boss') {
        count = 90;
        colors = ['#d4af37', '#e63946', '#9d174d', '#fb923c', '#fef08a'];
      } else if (normRarity === 'crimson' || normRarity === 'fire') {
        count = 40;
        colors = ['#ef4444', '#f97316', '#facc15', '#dc2626'];
      }

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed =
          (Math.random() * 8 + 2.5) * (normRarity === 'legendary' ? 1.35 : 1.0);
        const shapeTypes = ['star', 'circle', 'ribbon'];
        this.burstParticles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 2.5,
          gravity: 0.16 + Math.random() * 0.08,
          drag: 0.975,
          size: Math.random() * 5.5 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.014 + 0.009,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.22,
          shape: shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
        });
      }

      if (!this.burstAnimId) {
        this._animateBurst();
      }
    }

    _animateBurst() {
      if (!this.burstCtx || !this.burstCanvas) return;
      const ctx = this.burstCtx;
      ctx.clearRect(0, 0, this.burstCanvas.width, this.burstCanvas.height);

      for (let i = this.burstParticles.length - 1; i >= 0; i--) {
        const p = this.burstParticles[i];
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.burstParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === 'star') {
          this._drawFourPointStar(ctx, 0, 0, p.size * 1.3);
        } else if (p.shape === 'ribbon') {
          ctx.fillRect(-p.size, -p.size * 0.45, p.size * 2, p.size * 0.9);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (this.burstParticles.length > 0) {
        this.burstAnimId = requestAnimationFrame(() => this._animateBurst());
      } else {
        this.burstAnimId = null;
        ctx.clearRect(0, 0, this.burstCanvas.width, this.burstCanvas.height);
      }
    }
  }

  window.AudioFX = new ProceduralAudioEngine();
  window.ParticleFX = new MysticalParticleEngine();
})();
