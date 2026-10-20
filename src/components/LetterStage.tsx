import React, { useState, useEffect, useRef } from 'react';
import type { LetterData } from '../types/index.ts';
import { audioSynth } from '../utils/audioSynth.ts';
import { Edit3, Sparkles, FastForward, Heart } from 'lucide-react';

interface LetterStageProps {
  letter: LetterData;
  onProceedToBloom: () => void;
  onOpenCustomize: () => void;
}

export const LetterStage: React.FC<LetterStageProps> = ({
  letter,
  onProceedToBloom,
  onOpenCustomize
}) => {
  const [displayedParagraphs, setDisplayedParagraphs] = useState<string[]>([]);
  const [currentParaIndex, setCurrentParaIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const typingTimerRef = useRef<number | null>(null);

  // Typewriter effect
  useEffect(() => {
    setDisplayedParagraphs(letter.paragraphs.map(() => ''));
    setCurrentParaIndex(0);
    setCurrentCharIndex(0);
    setIsTypingComplete(false);
  }, [letter]);

  useEffect(() => {
    if (isTypingComplete) return;

    if (currentParaIndex >= letter.paragraphs.length) {
      setIsTypingComplete(true);
      return;
    }

    const currentTargetPara = letter.paragraphs[currentParaIndex];

    if (currentCharIndex < currentTargetPara.length) {
      typingTimerRef.current = window.setTimeout(() => {
        setDisplayedParagraphs(prev => {
          const updated = [...prev];
          updated[currentParaIndex] = currentTargetPara.slice(0, currentCharIndex + 1);
          return updated;
        });
        setCurrentCharIndex(c => c + 1);
      }, 22);
    } else {
      typingTimerRef.current = window.setTimeout(() => {
        setCurrentParaIndex(p => p + 1);
        setCurrentCharIndex(0);
      }, 240);
    }

    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, [currentParaIndex, currentCharIndex, letter.paragraphs, isTypingComplete]);

  const handleSkipTyping = () => {
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    setDisplayedParagraphs([...letter.paragraphs]);
    setIsTypingComplete(true);
    audioSynth.playSparkleSound(1.3);
  };

  const handleBloomClick = () => {
    audioSynth.playBloomWhoosh();
    onProceedToBloom();
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 pointer-events-auto">
      {/* Glassmorphism Letter Card */}
      <div
        className="w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-white/90 rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_25px_60px_rgba(61,44,46,0.15)] relative overflow-hidden transition-all duration-700 animate-scale-up"
        style={{
          boxShadow: '0 25px 60px -15px rgba(255, 42, 133, 0.22), 0 0 40px 0 rgba(255, 255, 255, 0.8) inset'
        }}
      >
        {/* Subtle Decorative Gold & Rose Border */}
        <div className="absolute inset-2 sm:inset-3 border border-[#D4AF37]/30 rounded-2xl pointer-events-none" />

        {/* Vintage Top Ribbon Bar */}
        <div className="flex items-center justify-between border-b border-[#FF758F]/20 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌷</span>
            <span className="text-xs uppercase font-medium tracking-[0.2em] text-[#FF2A85]">
              Lá Thư Tình Yêu · Dành Tặng Hà Linh
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isTypingComplete && (
              <button
                onClick={handleSkipTyping}
                className="flex items-center gap-1 text-xs text-[#3D2C2E]/70 hover:text-[#3D2C2E] px-2.5 py-1 rounded-lg bg-black/5 hover:bg-black/10 transition-colors"
                title="Đọc toàn bộ nội dung"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Hiện tất cả</span>
              </button>
            )}

            <button
              onClick={onOpenCustomize}
              className="flex items-center gap-1.5 text-xs text-[#3D2C2E] font-medium px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white border border-[#FF758F]/40 shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#FF2A85]" />
              <span>Đổi lời thư</span>
            </button>
          </div>
        </div>

        {/* Letter Recipient */}
        <p className="font-serif italic text-lg sm:text-xl text-[#FF2A85] font-semibold mb-3 flex items-center gap-2">
          <span>{letter.recipient}</span>
          <Heart className="w-4 h-4 fill-[#FF2A85] text-[#FF2A85] inline animate-pulse" />
        </p>

        {/* Letter Title */}
        <h2 className="font-serif text-2xl sm:text-3xl text-[#3D2C2E] font-bold mb-6 tracking-tight">
          {letter.title}
        </h2>

        {/* Letter Paragraphs */}
        <div className="space-y-4 font-serif text-[#3D2C2E]/90 text-base sm:text-lg md:text-[19px] leading-[1.85] tracking-normal">
          {letter.paragraphs.map((_, idx) => {
            const content = displayedParagraphs[idx] || '';
            const isCurrentlyTypingThis = idx === currentParaIndex && !isTypingComplete;

            if (idx > currentParaIndex && !isTypingComplete) {
              return null;
            }

            return (
              <p key={idx} className="relative transition-opacity duration-300">
                {content}
                {isCurrentlyTypingThis && (
                  <span className="inline-block w-1.5 h-4 ml-1 bg-[#FF2A85] animate-pulse align-middle" />
                )}
              </p>
            );
          })}
        </div>

        {/* Sign-off & Date */}
        {(isTypingComplete || currentParaIndex >= letter.paragraphs.length - 1) && (
          <div className="mt-8 pt-6 border-t border-[#FF758F]/20 flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fade-in">
            <div>
              <p className="text-xs text-[#3D2C2E]/60 tracking-wider">
                {letter.dateStr}
              </p>
            </div>
            <div className="text-right">
              <p className="font-serif italic text-base text-[#3D2C2E]/80">
                {letter.signOff}
              </p>
              <p className="font-calligraphy text-2xl sm:text-3xl text-[#FF2A85] font-bold mt-1">
                Mãi Yêu Hà Linh ❤️
              </p>
            </div>
          </div>
        )}

        {/* Primary Action Button: "Thắp sáng triệu hoa tặng Hà Linh ✨" */}
        <div className="mt-8 pt-4 flex flex-col items-center">
          <button
            onClick={handleBloomClick}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-base font-semibold text-white transition-all duration-500 shadow-[0_10px_35px_rgba(255,42,133,0.45)] hover:shadow-[0_15px_45px_rgba(255,42,133,0.65)] hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #FF2A85 0%, #FF6B35 100%)'
            }}
          >
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#FF2A85] via-[#FF6B35] to-[#FFEA00] blur-sm opacity-60 group-hover:opacity-100 transition-opacity animate-pulse" />
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-200 group-hover:rotate-12 transition-transform" />
              <span>Thắp sáng triệu đóa hoa tặng Hà Linh</span>
              <span className="text-xl">✨</span>
            </span>
          </button>

          <p className="text-xs text-[#3D2C2E]/60 mt-3 font-light">
            Nhấn để đánh thức khu rừng triệu đóa Tulip rực rỡ và bay lên trời đêm dành cho em
          </p>
        </div>
      </div>
    </div>
  );
};
