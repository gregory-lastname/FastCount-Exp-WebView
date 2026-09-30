/**
 * Web Audio API synthesizer for instant, zero-dependency sound effects.
 * Supports two distinct themes:
 * 1. 'classic': warm, calm, harmonious chimes (calm educational focus)
 * 2. 'funny': playful cartoon sounds (slide whistle "whoop-whoop", comic boing, goofy muted wah-wah, duck quack)
 */

import { SoundTheme } from '../types/math';

class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public theme: SoundTheme = 'funny';
  private funnyMistakeVariant = 0;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Cheerful success sound
   */
  public playSuccess() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      if (this.theme === 'funny') {
        // Comic double pop + joyful rising chirp + bright cartoon chime
        this.playCartoonPop(now, 260, 620);
        this.playCartoonPop(now + 0.07, 380, 880);
        this.playCartoonSlideUp(now + 0.12, 520, 1100);
        this.playChimeNote(880.0, now + 0.18, 0.25, 0.18); // A5
        this.playChimeNote(1174.66, now + 0.26, 0.32, 0.2); // D6
      } else {
        // Classic harmonious chime (C5 -> G5)
        this.playChimeNote(523.25, now, 0.25, 0.15);
        this.playChimeNote(783.99, now + 0.08, 0.35, 0.18);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  /**
   * Error feedback sound with hilarious cartoon variations
   */
  public playError() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      if (this.theme === 'funny') {
        // Rotate between 5 genuinely funny cartoon sounds!
        const variant = this.funnyMistakeVariant % 5;
        this.funnyMistakeVariant++;

        if (variant === 0) {
          // 1. Comic Spring Boing ("Б-о-о-и-н-г!")
          this.playCartoonBoing(now);
        } else if (variant === 1) {
          // 2. Comic Slide Whistle Drop ("Пьюууу-у-и-п!")
          this.playSlideWhistle(now);
        } else if (variant === 2) {
          // 3. Goofy Duck Quack ("Кря-кря!")
          this.playCartoonDuckQuack(now);
        } else if (variant === 3) {
          // 4. Goofy Muted Tuba / Wah-Wah ("Уа-уа-а-а")
          this.playGoofyWahWah(now);
        } else {
          // 5. Silly Raspberry / Comic Buzz ("Прр-ф-ф!")
          this.playCartoonRaspberry(now);
        }
      } else {
        // Classic gentle marimba thud
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(170, now + 0.28);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch {
      // ignore
    }
  }

  /**
   * Subtle key tap click
   */
  public playKeyTap() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(this.theme === 'funny' ? 560 : 440, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.04);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  /**
   * Sparkling star unlock sound
   */
  public playStar(starIndex: number = 0) {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const baseFreqs = [523.25, 659.25, 783.99, 880.0, 1046.5]; // C5, E5, G5, A5, C6
      const freq = baseFreqs[Math.min(starIndex, baseFreqs.length - 1)];
      const now = this.ctx.currentTime;
      this.playChimeNote(freq, now, 0.45, 0.16);

      if (this.theme === 'funny') {
        // Extra comic spring bounce tone
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq * 0.7, now + 0.05);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + 0.16);
        gain.gain.setValueAtTime(0.09, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + 0.05);
        osc.stop(now + 0.2);
      }
    } catch {
      // ignore
    }
  }

  /**
   * Fanfare celebration when opening a prize chest or finishing session
   */
  public playCelebration() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, High C
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        this.playChimeNote(freq, now + idx * 0.09, 0.45, 0.14);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Exciting level up or boss round entry sound
   */
  public playLevelUp() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [440.0, 554.37, 659.25, 880.0]; // A4, C#5, E5, A5
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        this.playChimeNote(freq, now + idx * 0.07, 0.4, 0.12);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Interactive chest opening sound
   */
  public playChestOpen() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Rising rapid arpeggio + fanfare
      const notes = [392.0, 440.0, 523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        this.playChimeNote(freq, now + i * 0.06, 0.35, 0.12);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Soft timer urgency tick
   */
  public playTimerTick() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // ignore
    }
  }

  // --- Cartoon Synthesizer Generators ---

  private playCartoonPop(startTime: number, fromFreq: number, toFreq: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(fromFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(toFreq, startTime + 0.06);

    gain.gain.setValueAtTime(0.16, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.09);
  }

  private playCartoonSlideUp(startTime: number, fromFreq: number, toFreq: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(fromFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(toFreq, startTime + 0.12);

    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.15);
  }

  /**
   * 1. Cartoon Spring Boing ("Б-о-о-и-н-г!")
   */
  private playCartoonBoing(startTime: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, startTime);
    osc.frequency.exponentialRampToValueAtTime(420, startTime + 0.28);

    // Rapid vibrato frequency modulation (wobbly cartoon spring)
    lfo.frequency.setValueAtTime(24, startTime);
    lfoGain.gain.setValueAtTime(55, startTime);
    lfoGain.gain.exponentialRampToValueAtTime(4, startTime + 0.35);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0.24, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    lfo.start(startTime);
    osc.start(startTime);
    lfo.stop(startTime + 0.4);
    osc.stop(startTime + 0.4);
  }

  /**
   * 2. Cartoon Slide Whistle Drop ("Пьюууу-у-и-п!")
   */
  private playSlideWhistle(startTime: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(680, startTime);
    osc.frequency.exponentialRampToValueAtTime(140, startTime + 0.38);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, startTime);
    filter.frequency.exponentialRampToValueAtTime(300, startTime + 0.38);

    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.42);
  }

  /**
   * 3. Comic Duck Quack ("Кря-кря-кря!")
   */
  private playCartoonDuckQuack(startTime: number) {
    if (!this.ctx) return;

    // Two rapid quacks
    const quack = (t: number) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(210, t + 0.12);

      // Duck bill nasal formant filter
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(950, t);
      filter.frequency.linearRampToValueAtTime(700, t + 0.12);
      filter.Q.setValueAtTime(4.5, t);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.14);
    };

    quack(startTime);
    quack(startTime + 0.13);
  }

  /**
   * 4. Goofy Muted Tuba / Wah-Wah ("Уа-уа-а-а")
   */
  private playGoofyWahWah(startTime: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(230, startTime);
    osc.frequency.linearRampToValueAtTime(196, startTime + 0.16);
    osc.frequency.linearRampToValueAtTime(165, startTime + 0.38);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(460, startTime);
    filter.frequency.linearRampToValueAtTime(750, startTime + 0.16);
    filter.frequency.linearRampToValueAtTime(280, startTime + 0.4);
    filter.Q.setValueAtTime(4.0, startTime);

    gain.gain.setValueAtTime(0.22, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.42);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.44);
  }

  /**
   * 5. Silly Raspberry / Comic Buzz ("Прр-ф-ф!")
   */
  private playCartoonRaspberry(startTime: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, startTime);
    osc.frequency.exponentialRampToValueAtTime(70, startTime + 0.28);

    // Flapping lips modulation
    lfo.type = 'square';
    lfo.frequency.setValueAtTime(30, startTime);
    lfoGain.gain.setValueAtTime(60, startTime);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, startTime);

    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    lfo.start(startTime);
    osc.start(startTime);
    lfo.stop(startTime + 0.32);
    osc.stop(startTime + 0.32);
  }

  private playChimeNote(freq: number, startTime: number, duration: number, peakVolume: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(peakVolume, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }
}

export const soundManager = new SoundEffects();
