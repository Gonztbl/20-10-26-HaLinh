/**
 * Web Audio API Acoustic Piano & Cinematic Ambient Sound Synthesizer
 * Plays an emotional, romantic piano progression inspired by "River Flows in You"
 * with zero external dependencies, 100% offline-ready and glitch-free.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;
  private volume: number = 0.45;
  private masterGain: GainNode | null = null;
  private timerId: number | null = null;
  private currentStep: number = 0;

  // Emotional arpeggio notes in Hz (A Minor / F Major 7 / C Major / G Major progression)
  // Inspired by romantic contemporary piano
  private progressionChords: number[][] = [
    // Chord 1: Am9 (A2, E3, A3, C4, E4, B4, C5)
    [110.0, 164.81, 220.0, 261.63, 329.63, 493.88, 523.25],
    // Chord 2: Fmaj7 (F2, C3, F3, A3, C4, E4, G4)
    [87.31, 130.81, 174.61, 220.0, 261.63, 329.63, 392.0],
    // Chord 3: Cmaj9 (C2, G2, E3, G3, B3, D4, E4, G4)
    [65.41, 98.0, 164.81, 196.0, 246.94, 293.66, 329.63, 392.0],
    // Chord 4: Gsus4 -> G (G2, D3, G3, B3, D4, F#4, G4)
    [98.0, 146.83, 196.0, 246.94, 293.66, 369.99, 392.0],
    // Chord 5: Dm9 (D2, A2, F3, A3, C4, E4, F4)
    [73.42, 110.0, 174.61, 220.0, 261.63, 329.63, 349.23],
    // Chord 6: Em7 (E2, B2, G3, B3, D4, E4, G4)
    [82.41, 123.47, 196.0, 246.94, 293.66, 329.63, 392.0],
    // Chord 7: Fmaj9 (F2, C3, A3, C4, E4, G4, A4)
    [87.31, 130.81, 220.0, 261.63, 329.63, 392.0, 440.0],
    // Chord 8: E7sus4 (E2, B2, D3, G#3, B3, E4)
    [82.41, 123.47, 146.83, 207.65, 246.94, 329.63]
  ];

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Play a single acoustic piano tone using multi-harmonic additive synthesis & natural decay
  public playPianoTone(freq: number, duration: number = 2.4, velocity: number = 0.5): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!this.masterGain) return;

      const now = ctx.currentTime;
      const fundamentalGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Warm acoustic low-pass characteristic of felt-tipped piano hammers
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.min(freq * 3.5, 3800), now);
      filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 0.9, 200), now + duration);

      // Amplitude envelope (hammer attack & soft natural acoustic decay)
      fundamentalGain.gain.setValueAtTime(0.0001, now);
      fundamentalGain.gain.linearRampToValueAtTime(velocity * 0.7, now + 0.015);
      fundamentalGain.gain.exponentialRampToValueAtTime(velocity * 0.2, now + 0.35);
      fundamentalGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      // Primary tone (warm triangle oscillator)
      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);

      // Harmonic overtone (pure sine at octave)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.002, now); // slight detune for warmth

      // Sub-harmonic body resonance
      const osc3 = ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq * 0.5, now);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.12, now);

      osc1.connect(fundamentalGain);
      osc2.connect(fundamentalGain);
      osc3.connect(subGain);
      subGain.connect(fundamentalGain);

      fundamentalGain.connect(filter);
      filter.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + duration + 0.05);
      osc2.stop(now + duration + 0.05);
      osc3.stop(now + duration + 0.05);
    } catch {
      // AudioContext might be blocked until gesture
    }
  }

  // Play a mystical chime / sparkle sound on hover or sparkle generation
  public playSparkleSound(pitch: number = 1.0): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!this.masterGain) return;

      const now = ctx.currentTime;
      const baseFreq = 880 * pitch;

      [1, 1.25, 1.5, 2].forEach((ratio, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * ratio, now + i * 0.04);

        gain.gain.setValueAtTime(0.0001, now + i * 0.04);
        gain.gain.linearRampToValueAtTime(0.08, now + i * 0.04 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.45);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.5);
      });
    } catch {
      // Ignored
    }
  }

  // Envelope seal crack / open sound
  public playSealOpenSound(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!this.masterGain) return;

      const now = ctx.currentTime;

      // Soft paper whoosh & crystalline chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.35);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.65);

      // Followed by a gentle high bell
      setTimeout(() => {
        this.playPianoTone(587.33, 2.5, 0.4); // D5
        this.playPianoTone(880.0, 2.8, 0.3);  // A5
      }, 180);
    } catch {
      // Ignored
    }
  }

  // Bloom whoosh when transitioning to Neon or Forest
  public playBloomWhoosh(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!this.masterGain) return;

      const now = ctx.currentTime;

      // Filtered sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 1.2);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + 1.2);
      filter.Q.value = 3;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 1.7);

      // Play major harmonic chords in sequence
      [0, 150, 320, 500, 700].forEach((delay, idx) => {
        setTimeout(() => {
          const notes = [329.63, 392.0, 493.88, 587.33, 659.25];
          this.playPianoTone(notes[idx % notes.length], 3.0, 0.35);
        }, delay);
      });
    } catch {
      // Ignored
    }
  }

  // Start the background piano melody (arpeggiated River Flows in You style loop)
  public startMelody(): void {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.initContext();
    this.currentStep = 0;
    this.scheduleNextArpeggio();
  }

  private scheduleNextArpeggio(): void {
    if (!this.isPlaying) return;

    const chordIndex = Math.floor(this.currentStep / 8) % this.progressionChords.length;
    const noteInChord = this.currentStep % 8;
    const chord = this.progressionChords[chordIndex];

    // Pick note from chord with musical phrasing
    let freq = chord[0];
    let vel = 0.35;
    let dur = 1.8;

    if (noteInChord === 0) {
      // Bass root note on downbeat
      freq = chord[0];
      vel = 0.5;
      dur = 2.8;
    } else if (noteInChord === 2) {
      freq = chord[1] || chord[0];
      vel = 0.3;
      dur = 2.0;
    } else if (noteInChord === 4) {
      // High melody sparkle
      freq = chord[Math.min(4, chord.length - 1)];
      vel = 0.45;
      dur = 2.2;
    } else if (noteInChord === 6) {
      freq = chord[Math.min(3, chord.length - 1)];
      vel = 0.35;
      dur = 1.8;
    } else {
      // In-between gentle passing tones
      const midIdx = (noteInChord % (chord.length - 2)) + 1;
      freq = chord[midIdx];
      vel = 0.25;
      dur = 1.4;
    }

    this.playPianoTone(freq, dur, vel);

    this.currentStep++;
    // Tempo: ~340ms per eighth note (around 88 BPM)
    const delay = noteInChord === 7 ? 400 : 340;
    this.timerId = window.setTimeout(() => this.scheduleNextArpeggio(), delay);
  }

  public stopMelody(): void {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    if (!this.isMuted && !this.isPlaying) {
      this.startMelody();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setVolume(val: number): void {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }
}

export const audioSynth = new AudioSynthesizer();
