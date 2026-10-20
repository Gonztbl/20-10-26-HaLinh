import React, { useState } from 'react';
import { audioSynth } from '../utils/audioSynth.ts';

interface EnvelopeStageProps {
  onOpen: () => void;
}

export const EnvelopeStage: React.FC<EnvelopeStageProps> = ({ onOpen }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Audio cues
    audioSynth.playSealOpenSound();
    audioSynth.startMelody();

    // Give time for 3D flap opening and letter slide animation
    setTimeout(() => {
      onOpen();
    }, 1000);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pointer-events-auto">
      {/* Cinematic Tagline for Ha Linh */}
      <div className="text-center mb-8 animate-fade-in">
        <p className="text-xs uppercase tracking-[0.28em] text-[#D4AF37] font-semibold mb-2 drop-shadow-sm flex items-center justify-center gap-2">
          <span>💖</span>
          <span>Dành Riêng Cho Người Tôi Yêu · Hà Linh</span>
          <span>💖</span>
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#3D2C2E] font-medium tracking-tight">
          Gửi Hà Linh · Triệu Lời Yêu Tỏa Sáng
        </h1>
      </div>

      {/* 3D Envelope Wrapper */}
      <div
        className="relative group cursor-pointer select-none"
        style={{ perspective: '1200px' }}
        onClick={handleOpenEnvelope}
        onMouseEnter={() => {
          setIsHovered(true);
          audioSynth.playSparkleSound(1.2);
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Soft floating shadow */}
        <div
          className={`absolute -bottom-8 left-1/2 -translate-x-1/2 w-72 sm:w-88 h-10 bg-[#3D2C2E]/15 rounded-full blur-xl transition-all duration-700 ${
            isHovered ? 'scale-110 opacity-70' : 'scale-95 opacity-40'
          }`}
        />

        {/* Envelope Box */}
        <div
          className={`relative w-72 sm:w-96 h-48 sm:h-64 rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF3EC] to-[#F5E8DC] border border-[#E8D7C3] shadow-[0_20px_50px_rgba(61,44,46,0.12)] transition-all duration-700 ease-out overflow-visible flex items-center justify-center ${
            isHovered ? '-translate-y-2.5 shadow-[0_30px_60px_rgba(255,42,133,0.22)]' : ''
          } ${isOpening ? 'scale-105' : ''}`}
        >
          {/* Subtle gold foil trim line */}
          <div className="absolute inset-2 sm:inset-3 border border-[#D4AF37]/35 rounded-xl pointer-events-none" />

          {/* Letter preview card inside envelope */}
          <div
            className={`absolute top-4 left-6 right-6 bottom-4 bg-white rounded-lg shadow-sm flex items-center justify-center p-4 transition-transform duration-700 ease-out z-1 ${
              isOpening ? '-translate-y-28 scale-105 opacity-90' : ''
            }`}
          >
            <span className="font-calligraphy text-2xl sm:text-3xl text-[#FF2A85] font-bold">
              For My Beloved Hà Linh
            </span>
          </div>

          {/* Pocket folds */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-2"
            viewBox="0 0 384 256"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 256 L192 136 L384 256"
              stroke="#D4AF37"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
          </svg>

          {/* 3D Flap Top */}
          <div
            className={`absolute top-0 left-0 right-0 h-1/2 origin-top transition-transform duration-1000 ease-in-out pointer-events-none ${
              isOpening ? '-rotate-x-180 opacity-30' : 'rotate-x-0'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              zIndex: 3
            }}
          >
            <div className="w-full h-full bg-gradient-to-b from-[#F7ECE1] to-[#EFE0D0] rounded-t-2xl [clip-path:polygon(0_0,100%_0,50%_100%)] shadow-md border-b border-[#D4AF37]/30" />
          </div>

          {/* Tulip Seal with Reference SVG Design */}
          <div
            className={`relative z-10 flex flex-col items-center justify-center transition-all duration-500 ${
              isOpening ? 'scale-150 opacity-0 rotate-12' : isHovered ? 'scale-110' : 'scale-100'
            }`}
          >
            {/* Pulsing Ripple Aura */}
            <div className="absolute w-24 h-24 rounded-full bg-[#FF2A85]/25 blur-md animate-ping pointer-events-none opacity-60" />
            <div className="absolute w-20 h-20 rounded-full bg-[#D4AF37]/20 blur-sm pointer-events-none" />

            {/* Wax Seal Container */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-[#FFFFFF] via-[#FFF0F3] to-[#FFDDE4] flex items-center justify-center shadow-[0_10px_25px_rgba(255,42,133,0.35)] border-2 border-[#D4AF37]/70 ring-4 ring-white/60">
              <svg className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-sm" viewBox="0 0 100 100" fill="none">
                <defs>
                  <linearGradient id="sealCenter" x1="50" y1="15" x2="50" y2="75" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FF85A1" />
                    <stop offset="50%" stopColor="#FF2A85" />
                    <stop offset="100%" stopColor="#A8004F" />
                  </linearGradient>
                  <linearGradient id="sealLeft" x1="25" y1="20" x2="55" y2="75" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFB3C6" />
                    <stop offset="60%" stopColor="#FF477E" />
                    <stop offset="100%" stopColor="#C9184A" />
                  </linearGradient>
                  <linearGradient id="sealRight" x1="75" y1="20" x2="45" y2="75" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFC2D1" />
                    <stop offset="60%" stopColor="#FF5C8A" />
                    <stop offset="100%" stopColor="#B5179E" />
                  </linearGradient>
                </defs>
                {/* Stem & Leaves */}
                <path d="M50 72 L50 94" stroke="#38B000" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M50 88 C35 84, 28 70, 32 58 C38 68, 44 78, 50 84 Z" fill="#52B788" />
                <path d="M50 88 C65 84, 72 70, 68 58 C62 68, 56 78, 50 84 Z" fill="#40916C" />
                {/* Center Petal */}
                <path d="M50 14 C66 28, 68 58, 50 74 C32 58, 34 28, 50 14 Z" fill="url(#sealCenter)" />
                {/* Left Petal */}
                <path d="M50 74 C26 70, 18 42, 30 20 C38 30, 44 48, 50 74 Z" fill="url(#sealLeft)" opacity="0.95" />
                {/* Right Petal */}
                <path d="M50 74 C74 70, 82 42, 70 20 C62 30, 56 48, 50 74 Z" fill="url(#sealRight)" opacity="0.95" />
                {/* Stamen Light */}
                <circle cx="50" cy="30" r="3.2" fill="#FFF" opacity="0.85" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Prompt & Instructions for Ha Linh */}
      <div className="mt-8 text-center flex flex-col items-center gap-2">
        <button
          onClick={handleOpenEnvelope}
          className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/85 hover:bg-white text-[#3D2C2E] text-sm font-medium shadow-[0_4px_20px_rgba(255,42,133,0.25)] border border-[#FF758F]/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <span className="w-2 h-2 rounded-full bg-[#FF2A85] animate-ping" />
          <span>Chạm vào hoa gửi trọn lời yêu đến Hà Linh</span>
          <span className="text-[#FF2A85] group-hover:translate-x-1 transition-transform">✨</span>
        </button>

        <p className="text-xs text-[#3D2C2E]/60 max-w-xs font-light">
          (Trải nghiệm có âm thanh đàn Piano du dương tự phát khi mở thiệp)
        </p>
      </div>
    </div>
  );
};
