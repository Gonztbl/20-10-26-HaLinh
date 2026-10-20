import React, { useEffect, useRef } from 'react';
import type { ExperienceAct, FloatingWord, TulipPalette } from '../types/index.ts';
import { TULIP_PALETTES, TRIBUTE_WORDS } from '../utils/tulipPalette.ts';
import { audioSynth } from '../utils/audioSynth.ts';

interface CanvasTulipUniverseProps {
  act: ExperienceAct;
  customWord?: string;
  onSceneReady?: () => void;
}

interface GoldenParticle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  vx: number;
  vy: number;
  pulseSpeed: number;
  baseAlpha: number;
}

interface ForestTulip {
  x: number;
  y: number;
  baseY: number;
  targetHeight: number;
  currentHeight: number;
  scale: number;
  paletteIdx: number;
  palette: TulipPalette;
  layer: 'bg' | 'mid' | 'fg';
  swayPhase: number;
  swaySpeed: number;
  bloomProgress: number;
  isAscending: boolean;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  wordSpawned: boolean;
  sparkleTimer: number;
}

interface MicroGalaxyTulip {
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  paletteIdx: number;
  alpha: number;
  phase: number;
}

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

// Draw the iconic tulip shape using smooth Bezier curves
function drawTulipHeadPath(ctx: CanvasRenderingContext2D, scale: number = 1) {
  ctx.save();
  ctx.scale(scale, scale);

  // Center Petal
  ctx.beginPath();
  ctx.moveTo(0, -32);
  ctx.bezierCurveTo(18, -16, 20, 14, 0, 28);
  ctx.bezierCurveTo(-20, 14, -18, -16, 0, -32);
  ctx.closePath();
  ctx.fill();

  // Left Petal wrapping inward
  ctx.beginPath();
  ctx.moveTo(0, 28);
  ctx.bezierCurveTo(-26, 24, -34, -6, -20, -26);
  ctx.bezierCurveTo(-10, -14, -6, 4, 0, 28);
  ctx.closePath();
  ctx.fill();

  // Right Petal wrapping inward
  ctx.beginPath();
  ctx.moveTo(0, 28);
  ctx.bezierCurveTo(26, 24, 34, -6, 20, -26);
  ctx.bezierCurveTo(10, -14, 6, 4, 0, 28);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export const CanvasTulipUniverse: React.FC<CanvasTulipUniverseProps> = ({
  act,
  customWord
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const actRef = useRef<ExperienceAct>(act);
  actRef.current = act;

  const customWordRef = useRef<string | undefined>(customWord);
  customWordRef.current = customWord;

  const mouseRef = useRef<{ x: number; y: number; isDown: boolean; lastSoundTime: number }>({
    x: -1000,
    y: -1000,
    isDown: false,
    lastSoundTime: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Twilight Shift Progress: 0 (Day) -> 1 (Dreamy Pastel Twilight)
    let twilightShift = actRef.current === 'neon_ascension' ? 1.0 : (actRef.current === 'blooming' ? 0.35 : 0.0);

    // Pre-rendered offscreen sprite caches for ultra-fast 60 FPS rendering
    const spriteCache = {
      day: [] as HTMLCanvasElement[],
      neon: [] as HTMLCanvasElement[],
      microNeon: [] as HTMLCanvasElement[]
    };

    function initSprites() {
      spriteCache.day = [];
      spriteCache.neon = [];
      spriteCache.microNeon = [];

      TULIP_PALETTES.forEach((p) => {
        // 1. Day Sprite
        const dayCanvas = document.createElement('canvas');
        dayCanvas.width = 130;
        dayCanvas.height = 130;
        const dCtx = dayCanvas.getContext('2d');
        if (dCtx) {
          dCtx.translate(65, 68);

          // Center petal
          dCtx.fillStyle = p.petalPrimary;
          dCtx.beginPath();
          dCtx.moveTo(0, -34);
          dCtx.bezierCurveTo(18, -16, 20, 14, 0, 28);
          dCtx.bezierCurveTo(-20, 14, -18, -16, 0, -34);
          dCtx.fill();

          // Left petal
          dCtx.fillStyle = p.petalHighlight;
          dCtx.beginPath();
          dCtx.moveTo(0, 28);
          dCtx.bezierCurveTo(-26, 24, -34, -6, -20, -26);
          dCtx.bezierCurveTo(-10, -14, -6, 4, 0, 28);
          dCtx.fill();

          // Right petal
          dCtx.fillStyle = p.petalSecondary;
          dCtx.beginPath();
          dCtx.moveTo(0, 28);
          dCtx.bezierCurveTo(26, 24, 34, -6, 20, -26);
          dCtx.bezierCurveTo(10, -14, 6, 4, 0, 28);
          dCtx.fill();

          // Delicate highlight line
          dCtx.strokeStyle = 'rgba(255,255,255,0.6)';
          dCtx.lineWidth = 1.2;
          dCtx.stroke();
        }
        spriteCache.day.push(dayCanvas);

        // 2. Neon Sprite with multi-layer high-luminance bloom
        const neonCanvas = document.createElement('canvas');
        neonCanvas.width = 170;
        neonCanvas.height = 170;
        const nCtx = neonCanvas.getContext('2d');
        if (nCtx) {
          nCtx.translate(85, 88);

          // Layer 1: Wide diffused neon halo
          nCtx.shadowColor = p.neonGlow;
          nCtx.shadowBlur = 30;
          nCtx.fillStyle = p.petalPrimary;
          drawTulipHeadPath(nCtx, 1.05);

          // Layer 2: Radiant petal body
          nCtx.shadowColor = p.neonGlow;
          nCtx.shadowBlur = 15;
          nCtx.fillStyle = p.petalHighlight;
          drawTulipHeadPath(nCtx, 0.92);

          // Layer 3: Pure white core
          nCtx.shadowColor = '#FFFFFF';
          nCtx.shadowBlur = 10;
          nCtx.fillStyle = p.neonCore;
          drawTulipHeadPath(nCtx, 0.55);

          // Stamen sparkle light
          nCtx.beginPath();
          nCtx.arc(0, -6, 3.8, 0, Math.PI * 2);
          nCtx.fillStyle = '#FFFFFF';
          nCtx.fill();
        }
        spriteCache.neon.push(neonCanvas);

        // 3. Micro Neon for the vast galaxy stream of "Triệu bông hoa"
        const microCanvas = document.createElement('canvas');
        microCanvas.width = 40;
        microCanvas.height = 40;
        const mCtx = microCanvas.getContext('2d');
        if (mCtx) {
          mCtx.translate(20, 20);
          mCtx.shadowColor = p.neonGlow;
          mCtx.shadowBlur = 8;
          mCtx.fillStyle = '#FFFFFF';
          drawTulipHeadPath(mCtx, 0.26);
        }
        spriteCache.microNeon.push(microCanvas);
      });
    }

    initSprites();

    // Golden Bokeh particles for Act 1 & 2
    const goldenParticles: GoldenParticle[] = [];
    const NUM_GOLDEN = 60;
    for (let i = 0; i < NUM_GOLDEN; i++) {
      goldenParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3.5 + 1.2,
        alpha: Math.random() * 0.7 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.2,
        vx: (Math.random() - 0.5) * 0.35,
        vy: - (Math.random() * 0.45 + 0.15),
        pulseSpeed: Math.random() * 0.03 + 0.015
      });
    }

    // Collections
    const forestTulips: ForestTulip[] = [];
    const galaxyTulips: MicroGalaxyTulip[] = [];
    const floatingWords: FloatingWord[] = [];
    const sparkles: SparkleParticle[] = [];

    // Initialize Forest Tulips
    function initForest() {
      forestTulips.length = 0;

      // Layer 0: Background horizon (140 smaller tulips)
      const numBg = Math.floor(width / 11);
      for (let i = 0; i < numBg; i++) {
        const x = (i / numBg) * width + (Math.random() - 0.5) * 20;
        const pIdx = Math.floor(Math.random() * TULIP_PALETTES.length);
        forestTulips.push({
          x,
          y: height + 10,
          baseY: height * (0.76 + Math.random() * 0.24),
          targetHeight: Math.random() * 55 + 50,
          currentHeight: actRef.current === 'neon_ascension' ? 100 : 0,
          scale: Math.random() * 0.22 + 0.25,
          paletteIdx: pIdx,
          palette: TULIP_PALETTES[pIdx],
          layer: 'bg',
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.02 + 0.015,
          bloomProgress: actRef.current === 'neon_ascension' ? 1 : 0,
          isAscending: actRef.current === 'neon_ascension',
          vx: (Math.random() - 0.5) * 0.4,
          vy: - (Math.random() * 1.4 + 0.8),
          rotation: 0,
          vRot: (Math.random() - 0.5) * 0.012,
          wordSpawned: false,
          sparkleTimer: 0
        });
      }

      // Layer 1: Midground (55 medium tulips)
      const numMid = Math.floor(width / 26);
      for (let i = 0; i < numMid; i++) {
        const x = (i / numMid) * width + (Math.random() - 0.5) * 35;
        const pIdx = Math.floor(Math.random() * TULIP_PALETTES.length);
        forestTulips.push({
          x,
          y: height + 10,
          baseY: height + 10,
          targetHeight: Math.random() * 110 + 130,
          currentHeight: actRef.current === 'neon_ascension' ? 180 : 0,
          scale: Math.random() * 0.32 + 0.6,
          paletteIdx: pIdx,
          palette: TULIP_PALETTES[pIdx],
          layer: 'mid',
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.02 + 0.012,
          bloomProgress: actRef.current === 'neon_ascension' ? 1 : 0,
          isAscending: actRef.current === 'neon_ascension',
          vx: (Math.random() - 0.5) * 0.5,
          vy: - (Math.random() * 1.5 + 0.9),
          rotation: 0,
          vRot: (Math.random() - 0.5) * 0.015,
          wordSpawned: false,
          sparkleTimer: 0
        });
      }

      // Layer 2: Foreground (12 large hero blooms framing the screen)
      const numFg = 12;
      for (let i = 0; i < numFg; i++) {
        const isLeft = i < numFg / 2;
        const x = isLeft
          ? Math.random() * (width * 0.26)
          : width - Math.random() * (width * 0.26);
        const pIdx = Math.floor(Math.random() * TULIP_PALETTES.length);
        forestTulips.push({
          x,
          y: height + 25,
          baseY: height + 25,
          targetHeight: Math.random() * 140 + 190,
          currentHeight: actRef.current === 'neon_ascension' ? 240 : 0,
          scale: Math.random() * 0.35 + 1.1,
          paletteIdx: pIdx,
          palette: TULIP_PALETTES[pIdx],
          layer: 'fg',
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.015 + 0.01,
          bloomProgress: actRef.current === 'neon_ascension' ? 1 : 0,
          isAscending: actRef.current === 'neon_ascension',
          vx: (Math.random() - 0.5) * 0.6,
          vy: - (Math.random() * 1.6 + 1.0),
          rotation: 0,
          vRot: (Math.random() - 0.5) * 0.01,
          wordSpawned: false,
          sparkleTimer: 0
        });
      }

      // Galaxy Stream of Micro Tulips for Act 4
      galaxyTulips.length = 0;
      const galaxyCount = Math.min(380, Math.floor(width * 0.35));
      for (let i = 0; i < galaxyCount; i++) {
        galaxyTulips.push({
          x: Math.random() * width,
          y: Math.random() * height + height * 0.1,
          vy: 0.45 + Math.random() * 1.1,
          vx: (Math.random() - 0.5) * 0.35,
          scale: 0.2 + Math.random() * 0.45,
          paletteIdx: Math.floor(Math.random() * TULIP_PALETTES.length),
          alpha: 0.35 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    initForest();

    function spawnFloatingWord(x: number, y: number, palette: TulipPalette) {
      const wordsPool = customWordRef.current
        ? [customWordRef.current, ...TRIBUTE_WORDS]
        : TRIBUTE_WORDS;
      const text = wordsPool[Math.floor(Math.random() * wordsPool.length)];

      floatingWords.push({
        text,
        x,
        y: y - 12,
        vx: (Math.random() - 0.5) * 0.5,
        vy: - (Math.random() * 0.8 + 0.65),
        size: Math.floor(Math.random() * 7 + 22),
        opacity: 0.05,
        color: '#FFFFFF',
        glowColor: palette.neonGlow,
        swaySpeed: Math.random() * 0.02 + 0.015,
        swayOffset: Math.random() * Math.PI * 2
      });
    }

    function addSparkles(x: number, y: number, count: number, color: string) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 0.6;
        sparkles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.8,
          size: Math.random() * 3 + 1.2,
          color,
          alpha: 1,
          life: 0,
          maxLife: Math.floor(Math.random() * 30 + 25)
        });
      }
    }

    // Spawn a burst of flowers with "Hà Linh" at click location
    function spawnInteractiveLoveBurst(cx: number, cy: number) {
      for (let i = 0; i < 3; i++) {
        const offsetX = (Math.random() - 0.5) * 60;
        const offsetY = (Math.random() - 0.5) * 40;
        const pIdx = Math.floor(Math.random() * TULIP_PALETTES.length);
        const palette = TULIP_PALETTES[pIdx];

        forestTulips.push({
          x: cx + offsetX,
          y: cy + offsetY,
          baseY: cy + offsetY,
          targetHeight: 120,
          currentHeight: 120,
          scale: 0.85 + Math.random() * 0.35,
          paletteIdx: pIdx,
          palette,
          layer: 'mid',
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: 0.02,
          bloomProgress: 1,
          isAscending: true,
          vx: (Math.random() - 0.5) * 0.6,
          vy: - (Math.random() * 1.5 + 1.0),
          rotation: (Math.random() - 0.5) * 0.2,
          vRot: (Math.random() - 0.5) * 0.015,
          wordSpawned: true,
          sparkleTimer: 0
        });

        if (i === 0) {
          floatingWords.push({
            text: 'Anh Yêu Hà Linh ❤️',
            x: cx,
            y: cy - 20,
            vx: 0,
            vy: -1.0,
            size: 26,
            opacity: 0.95,
            color: '#FFFFFF',
            glowColor: palette.neonGlow,
            swaySpeed: 0.02,
            swayOffset: 0
          });
        }
      }

      addSparkles(cx, cy, 14, '#FF2A85');
    }

    let time = 0;

    const render = () => {
      time += 0.03;
      const currentAct = actRef.current;

      const targetTwilight = currentAct === 'neon_ascension' ? 1.0 : (currentAct === 'blooming' ? 0.38 : 0.0);
      twilightShift += (targetTwilight - twilightShift) * 0.025;

      // 1. SKY BACKGROUND RENDER (Ethereal Pastel Twilight: #7F7FD5 -> #86A8E7 -> #E0C3FC -> #F9C5D1)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);

      if (twilightShift < 0.01) {
        skyGrad.addColorStop(0, '#FFFDF9');
        skyGrad.addColorStop(0.5, '#FFE8E8');
        skyGrad.addColorStop(1, '#FCE1E4');
      } else {
        const t = twilightShift;
        // Top: #FFFDF9 -> #7F7FD5 (127, 127, 213)
        const topR = Math.round(255 * (1 - t) + 127 * t);
        const topG = Math.round(253 * (1 - t) + 127 * t);
        const topB = Math.round(249 * (1 - t) + 213 * t);

        // Upper Mid: #FFE8E8 -> #86A8E7 (134, 168, 231)
        const midR = Math.round(255 * (1 - t) + 134 * t);
        const midG = Math.round(232 * (1 - t) + 168 * t);
        const midB = Math.round(232 * (1 - t) + 231 * t);

        // Lower Mid: #FCE1E4 -> #E0C3FC (224, 195, 252)
        const lowR = Math.round(252 * (1 - t) + 224 * t);
        const lowG = Math.round(225 * (1 - t) + 195 * t);
        const lowB = Math.round(228 * (1 - t) + 252 * t);

        // Horizon: #F9C5D1 (249, 197, 209)
        const botR = Math.round(250 * (1 - t) + 249 * t);
        const botG = Math.round(225 * (1 - t) + 197 * t);
        const botB = Math.round(228 * (1 - t) + 209 * t);

        skyGrad.addColorStop(0, `rgb(${topR}, ${topG}, ${topB})`);
        skyGrad.addColorStop(0.38, `rgb(${midR}, ${midG}, ${midB})`);
        skyGrad.addColorStop(0.72, `rgb(${lowR}, ${lowG}, ${lowB})`);
        skyGrad.addColorStop(1, `rgb(${botR}, ${botG}, ${botB})`);
      }

      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Dreamy luminous bokeh auras during Twilight
      if (twilightShift > 0.05) {
        ctx.save();
        const auraAlpha = 0.45 * twilightShift;

        // Aura 1: Soft Rose-Pink at top left
        const g1 = ctx.createRadialGradient(width * 0.15, height * 0.2, 20, width * 0.15, height * 0.2, width * 0.45);
        g1.addColorStop(0, `rgba(255, 194, 226, ${auraAlpha})`);
        g1.addColorStop(1, 'rgba(255, 194, 226, 0)');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, width, height);

        // Aura 2: Aqua-Mint at bottom right
        const g2 = ctx.createRadialGradient(width * 0.85, height * 0.75, 20, width * 0.85, height * 0.75, width * 0.5);
        g2.addColorStop(0, `rgba(168, 237, 234, ${auraAlpha * 0.9})`);
        g2.addColorStop(1, 'rgba(168, 237, 234, 0)');
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // 2. GOLDEN BOKEH (Act 1 & 2)
      if (twilightShift < 0.85) {
        ctx.save();
        goldenParticles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;

          p.alpha = p.baseAlpha + Math.sin(time * p.pulseSpeed * 10) * 0.2;
          const currentAlpha = Math.max(0.1, p.alpha * (1 - twilightShift * 0.6));

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 175, 55, ${currentAlpha})`;
          ctx.shadowColor = '#FFE57F';
          ctx.shadowBlur = 6;
          ctx.fill();
        });
        ctx.restore();
      }

      // 3. FOREST & NEON ASCENSION (Act 3 & 4)
      if (currentAct === 'blooming' || currentAct === 'neon_ascension') {
        const isNeonMode = currentAct === 'neon_ascension' && twilightShift > 0.25;
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;

        // A. Background Galaxy Stream of Micro Tulips (Act 4)
        if (isNeonMode) {
          ctx.save();
          galaxyTulips.forEach(gt => {
            gt.y -= gt.vy;
            gt.x += gt.vx + Math.sin(time * 1.5 + gt.phase) * 0.35;

            // Interactive mouse nudge
            if (mx > -100 && my > -100) {
              const dx = gt.x - mx;
              const dy = gt.y - my;
              const dist = Math.hypot(dx, dy);
              if (dist < 120 && dist > 1) {
                gt.x += (dx / dist) * 2.2;
              }
            }

            if (gt.y < -30) {
              gt.y = height + 20 + Math.random() * 50;
              gt.x = Math.random() * width;
            }

            const size = 32 * gt.scale;
            ctx.globalAlpha = gt.alpha * (0.65 + 0.35 * Math.sin(time * 3 + gt.phase));
            const mSprite = spriteCache.microNeon[gt.paletteIdx];
            if (mSprite) {
              ctx.drawImage(mSprite, gt.x - size / 2, gt.y - size / 2, size, size);
            }
          });
          ctx.restore();
        }

        // B. Midground & Foreground Forest Tulips
        forestTulips.forEach(tulip => {
          // Blooming growth
          if (tulip.currentHeight < tulip.targetHeight) {
            tulip.currentHeight += (tulip.targetHeight - tulip.currentHeight) * 0.055 + 1.2;
            tulip.bloomProgress = Math.min(1.0, tulip.currentHeight / tulip.targetHeight);
          }

          const sway = Math.sin(time * tulip.swaySpeed + tulip.swayPhase) * (14 * tulip.scale);

          // Ascension in Act 4
          if (currentAct === 'neon_ascension') {
            if (!tulip.isAscending) {
              if (Math.random() < 0.035 || tulip.layer === 'bg') {
                tulip.isAscending = true;
                tulip.vy = - (Math.random() * 1.5 + 0.85);
                tulip.vx = (Math.random() - 0.5) * 0.5;
              }
            } else {
              tulip.y += tulip.vy;
              tulip.x += tulip.vx + Math.sin(time * 1.5 + tulip.swayPhase) * 0.5;
              tulip.rotation += tulip.vRot;

              tulip.sparkleTimer++;
              if (tulip.sparkleTimer % 14 === 0 && tulip.layer !== 'bg') {
                addSparkles(tulip.x, tulip.y - 15 * tulip.scale, 2, tulip.palette.neonGlow);
              }

              // Spawn floating "Hà Linh" words
              if (!tulip.wordSpawned && tulip.y < height * 0.68 && tulip.layer === 'mid') {
                if (Math.random() < 0.4) {
                  spawnFloatingWord(tulip.x, tulip.y, tulip.palette);
                  tulip.wordSpawned = true;
                }
              }

              // Infinite stream respawn
              if (tulip.y < -90) {
                tulip.y = height + 40;
                tulip.x = Math.random() * width;
                tulip.vy = - (Math.random() * 1.5 + 0.8);
                tulip.wordSpawned = false;
                tulip.paletteIdx = Math.floor(Math.random() * TULIP_PALETTES.length);
                tulip.palette = TULIP_PALETTES[tulip.paletteIdx];
              }
            }
          }

          // Interactive mouse deflection
          if (mx > -100 && my > -100) {
            const dx = tulip.x - mx;
            const dy = (tulip.isAscending ? tulip.y : tulip.baseY - tulip.currentHeight) - my;
            const dist = Math.hypot(dx, dy);
            if (dist < 130) {
              const force = (130 - dist) / 130;
              tulip.x += (dx / dist) * force * 3.5;
              if (tulip.isAscending) {
                tulip.y += (dy / dist) * force * 2.5;
              }
            }
          }

          // Draw stem & leaves if still rooted
          ctx.save();
          if (!tulip.isAscending) {
            const stemHeadX = tulip.x + sway;
            const stemHeadY = tulip.baseY - tulip.currentHeight;

            ctx.beginPath();
            ctx.moveTo(tulip.x, tulip.baseY);
            ctx.quadraticCurveTo(
              tulip.x + sway * 0.35,
              tulip.baseY - tulip.currentHeight * 0.5,
              stemHeadX,
              stemHeadY
            );
            ctx.lineWidth = Math.max(1.8, 3.8 * tulip.scale);
            ctx.strokeStyle = isNeonMode ? 'rgba(0, 245, 212, 0.75)' : '#40916C';
            if (isNeonMode) {
              ctx.shadowColor = '#00F5D4';
              ctx.shadowBlur = 8 * tulip.scale;
            }
            ctx.stroke();

            // Leaf
            if (tulip.layer !== 'bg') {
              ctx.beginPath();
              const leafBaseY = tulip.baseY - tulip.currentHeight * 0.25;
              ctx.moveTo(tulip.x, leafBaseY);
              ctx.quadraticCurveTo(
                tulip.x + (tulip.layer === 'fg' ? 40 : 22) * tulip.scale,
                leafBaseY - 30 * tulip.scale,
                tulip.x + (tulip.layer === 'fg' ? 30 : 16) * tulip.scale,
                leafBaseY - 60 * tulip.scale
              );
              ctx.quadraticCurveTo(
                tulip.x + 8 * tulip.scale,
                leafBaseY - 20 * tulip.scale,
                tulip.x,
                leafBaseY
              );
              ctx.fillStyle = isNeonMode ? 'rgba(168, 255, 242, 0.5)' : '#52B788';
              ctx.fill();
            }

            ctx.translate(stemHeadX, stemHeadY);
            ctx.rotate(sway * 0.015);
          } else {
            ctx.translate(tulip.x, tulip.y);
            ctx.rotate(tulip.rotation);
          }

          // Draw tulip head from cached sprites
          const flowerDrawSize = (isNeonMode ? 135 : 100) * tulip.scale * Math.max(0.2, tulip.bloomProgress);
          const sprite = isNeonMode
            ? spriteCache.neon[tulip.paletteIdx]
            : spriteCache.day[tulip.paletteIdx];

          if (sprite) {
            ctx.drawImage(
              sprite,
              -flowerDrawSize / 2,
              -flowerDrawSize / 2,
              flowerDrawSize,
              flowerDrawSize
            );
          }

          ctx.restore();
        });

        // 4. FLOATING DEDICATION WORDS ("Hà Linh ❤️", "Anh Yêu Hà Linh", etc.)
        for (let i = floatingWords.length - 1; i >= 0; i--) {
          const fw = floatingWords[i];
          fw.y += fw.vy;
          fw.x += fw.vx + Math.sin(time * fw.swaySpeed + fw.swayOffset) * 0.6;

          if (fw.y > height * 0.75) {
            fw.opacity = Math.min(0.96, fw.opacity + 0.035);
          } else if (fw.y < height * 0.2) {
            fw.opacity -= 0.018;
          } else {
            fw.opacity = Math.min(0.96, fw.opacity + 0.02);
          }

          if (fw.opacity <= 0 || fw.y < -50) {
            floatingWords.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.font = `700 ${fw.size}px 'Dancing Script', 'Playfair Display', cursive, serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Outer glowing aura
          ctx.shadowColor = fw.glowColor;
          ctx.shadowBlur = 18;
          ctx.fillStyle = `rgba(255, 255, 255, ${fw.opacity})`;
          ctx.fillText(fw.text, fw.x, fw.y);

          // Inner white brilliance
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 6;
          ctx.fillStyle = `rgba(255, 255, 255, ${fw.opacity})`;
          ctx.fillText(fw.text, fw.x, fw.y);
          ctx.restore();
        }

        // 5. SPARKLE PARTICLES
        for (let i = sparkles.length - 1; i >= 0; i--) {
          const sp = sparkles[i];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.life++;
          sp.alpha = 1 - sp.life / sp.maxLife;

          if (sp.life >= sp.maxLife) {
            sparkles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size * (1 - sp.life / sp.maxLife * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = sp.color;
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 8;
          ctx.globalAlpha = Math.max(0, sp.alpha);
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initSprites();
      initForest();
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      mouseRef.current.x = clientX;
      mouseRef.current.y = clientY;

      if (actRef.current === 'neon_ascension' || actRef.current === 'blooming') {
        const randPalette = TULIP_PALETTES[Math.floor(Math.random() * TULIP_PALETTES.length)];
        addSparkles(clientX, clientY, 2, randPalette.neonGlow);

        const now = Date.now();
        if (now - mouseRef.current.lastSoundTime > 160) {
          mouseRef.current.lastSoundTime = now;
          audioSynth.playSparkleSound(0.9 + Math.random() * 0.4);
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (actRef.current === 'neon_ascension') {
        if ((e.target as HTMLElement)?.closest('header, button, input, form')) return;
        spawnInteractiveLoveBurst(e.clientX, e.clientY);
        audioSynth.playSparkleSound(1.4);
      }
    };

    const handlePointerLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-auto touch-none"
      style={{ zIndex: 1 }}
      aria-label="Khung cảnh tương tác hoa Tulip bừng nở và phát sáng hoàng hôn dành tặng Hà Linh"
    />
  );
};
