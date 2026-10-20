export type ExperienceAct = 'awakening' | 'letter' | 'blooming' | 'neon_ascension';

export interface LetterData {
  id: string;
  presetName: string;
  recipient: string;
  title: string;
  paragraphs: string[];
  signOff: string;
  dateStr: string;
}

export type TulipPaletteName = 'neon_pink' | 'golden_sun' | 'cyan_gem' | 'coral_dawn' | 'dream_lavender' | 'pure_pearl';

export interface TulipPalette {
  name: TulipPaletteName;
  label: string;
  petalPrimary: string;
  petalSecondary: string;
  petalHighlight: string;
  neonCore: string;
  neonGlow: string;
  shadowGlow: string;
}

export interface FloatingWord {
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  glowColor: string;
  swaySpeed: number;
  swayOffset: number;
}
