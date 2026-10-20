/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import type { ExperienceAct, LetterData } from './types/index.ts';
import { LETTER_PRESETS } from './utils/letterPresets.ts';
import { CanvasTulipUniverse } from './components/CanvasTulipUniverse.tsx';
import { EnvelopeStage } from './components/EnvelopeStage.tsx';
import { LetterStage } from './components/LetterStage.tsx';
import { AscensionOverlay } from './components/AscensionOverlay.tsx';
import { ControlsHeader } from './components/ControlsHeader.tsx';
import { CustomizeLetterModal } from './components/CustomizeLetterModal.tsx';
import { SnapshotModal } from './components/SnapshotModal.tsx';
import { audioSynth } from './utils/audioSynth.ts';

export default function App() {
  const [currentAct, setCurrentAct] = useState<ExperienceAct>('awakening');
  const [letter, setLetter] = useState<LetterData>(LETTER_PRESETS[0]);
  const [customWord, setCustomWord] = useState<string | undefined>(undefined);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState<boolean>(false);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);

  // Auto transition from blooming to neon_ascension after 6 seconds if user doesn't click
  useEffect(() => {
    if (currentAct === 'blooming') {
      const timer = setTimeout(() => {
        audioSynth.playBloomWhoosh();
        setCurrentAct('neon_ascension');
      }, 5500);
      return () => clearTimeout(timer);
    }
  }, [currentAct]);

  const handleOpenEnvelope = useCallback(() => {
    setCurrentAct('letter');
  }, []);

  const handleProceedToBloom = useCallback(() => {
    setCurrentAct('blooming');
  }, []);

  const handleProceedToNeon = useCallback(() => {
    setCurrentAct('neon_ascension');
  }, []);

  const handleSelectAct = useCallback((act: ExperienceAct) => {
    setCurrentAct(act);
    if (act === 'neon_ascension' || act === 'blooming') {
      audioSynth.startMelody();
    }
  }, []);

  const handleTakeSnapshot = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL('image/png');
      setSnapshotUrl(dataUrl);
    } catch {
      // Ignored
    }
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none font-sans bg-[#FFF8F5]">
      {/* Dynamic Canvas Layer (The Blooming Forest & Neon Universe) */}
      <CanvasTulipUniverse
        act={currentAct}
        customWord={customWord}
      />

      {/* Persistent Navigation & Controls Header */}
      <ControlsHeader
        currentAct={currentAct}
        onSelectAct={handleSelectAct}
        onOpenCustomize={() => setIsCustomizeOpen(true)}
        onTakeSnapshot={handleTakeSnapshot}
      />

      {/* Main Experience Acts Container */}
      <main className="relative z-10 w-full h-full flex flex-col justify-center items-center pointer-events-none">
        {/* Act 1: The Awakening (3D Sealed Envelope) */}
        {currentAct === 'awakening' && (
          <EnvelopeStage onOpen={handleOpenEnvelope} />
        )}

        {/* Act 2: The Heartfelt Letter (Glassmorphism Letter Card) */}
        {currentAct === 'letter' && (
          <LetterStage
            letter={letter}
            onProceedToBloom={handleProceedToBloom}
            onOpenCustomize={() => setIsCustomizeOpen(true)}
          />
        )}

        {/* Act 3 & 4: Interactive Overlays for Blooming & Neon Ascension */}
        {(currentAct === 'blooming' || currentAct === 'neon_ascension') && (
          <AscensionOverlay
            act={currentAct}
            onProceedToNeon={handleProceedToNeon}
            onSendCustomWord={(w) => setCustomWord(w)}
            onReplay={() => setCurrentAct('awakening')}
          />
        )}
      </main>

      {/* Customize Letter Modal */}
      <CustomizeLetterModal
        currentLetter={letter}
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        onSave={(newLetter) => setLetter(newLetter)}
      />

      {/* Snapshot Preview Modal */}
      <SnapshotModal
        imageDataUrl={snapshotUrl}
        onClose={() => setSnapshotUrl(null)}
      />
    </div>
  );
}
