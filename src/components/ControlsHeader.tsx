import React, { useState } from 'react';
import type { ExperienceAct } from '../types/index.ts';
import { audioSynth } from '../utils/audioSynth.ts';
import { Volume2, VolumeX, RotateCcw, Camera, SlidersHorizontal, Maximize2 } from 'lucide-react';

interface ControlsHeaderProps {
  currentAct: ExperienceAct;
  onSelectAct: (act: ExperienceAct) => void;
  onOpenCustomize: () => void;
  onTakeSnapshot: () => void;
}

export const ControlsHeader: React.FC<ControlsHeaderProps> = ({
  currentAct,
  onSelectAct,
  onOpenCustomize,
  onTakeSnapshot
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleSound = () => {
    const muted = audioSynth.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      audioSynth.playSparkleSound(1.4);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const acts: { id: ExperienceAct; label: string; icon: string }[] = [
    { id: 'awakening', label: '1. Thiệp Hoa', icon: '💌' },
    { id: 'letter', label: '2. Thư Tình', icon: '📜' },
    { id: 'blooming', label: '3. Rừng Hoa', icon: '🌷' },
    { id: 'neon_ascension', label: '4. Triệu Hoa Bay', icon: '✨' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 pointer-events-auto backdrop-blur-md bg-white/45 border-b border-white/50 transition-colors">
      {/* Brand / Title Wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xl">🌷</span>
        <button
          onClick={() => onSelectAct('awakening')}
          className="font-serif text-base sm:text-lg font-bold text-[#3D2C2E] tracking-tight hover:opacity-80 transition-opacity whitespace-nowrap text-left"
        >
          Tulip Twilight <span className="font-calligraphy font-semibold text-sm sm:text-base text-[#FF2A85] hidden md:inline ml-1">· Dành Tặng Hà Linh ❤️</span>
        </button>
      </div>

      {/* Timeline Steps / Segmented Act Bar */}
      <nav aria-label="Phân cảnh trải nghiệm" className="hidden lg:flex items-center gap-1 p-1 bg-white/70 border border-[#FF758F]/30 rounded-full shadow-sm">
        {acts.map((item) => {
          const isActive = currentAct === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectAct(item.id);
                audioSynth.playSparkleSound(1.1);
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF2A85] to-[#FF758F] text-white shadow-sm'
                  : 'text-[#3D2C2E]/70 hover:text-[#3D2C2E] hover:bg-white/80'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Action Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Sound Toggle */}
        <button
          onClick={handleToggleSound}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            isMuted
              ? 'bg-white/70 border-gray-300 text-gray-600'
              : 'bg-white/90 border-[#FF758F]/60 text-[#FF2A85] shadow-sm ring-2 ring-[#FF758F]/20'
          }`}
          title={isMuted ? 'Bật âm thanh Piano' : 'Tắt âm thanh'}
          aria-label={isMuted ? 'Bật nhạc Piano' : 'Tắt nhạc Piano'}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : (
            <div className="flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5" />
              <span className="flex items-end gap-0.5 h-2.5">
                <span className="w-0.5 h-2 bg-[#FF2A85] animate-pulse" />
                <span className="w-0.5 h-3 bg-[#FF2A85] animate-pulse delay-75" />
                <span className="w-0.5 h-1.5 bg-[#FF2A85] animate-pulse delay-150" />
              </span>
            </div>
          )}
          <span className="hidden sm:inline">{isMuted ? 'Bật nhạc' : 'Piano'}</span>
        </button>

        {/* Customize Letter */}
        <button
          onClick={onOpenCustomize}
          className="p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium bg-white/80 hover:bg-white border border-[#FF758F]/40 text-[#3D2C2E] shadow-sm transition-all hover:scale-105"
          title="Tùy chỉnh nội dung thư"
          aria-label="Tùy chỉnh thư"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 sm:mr-1 inline text-[#FF2A85]" />
          <span className="hidden sm:inline">Lời thư</span>
        </button>

        {/* Snapshot / Photo Mode */}
        <button
          onClick={onTakeSnapshot}
          className="p-2 rounded-full bg-white/80 hover:bg-white border border-white/60 text-[#3D2C2E] shadow-sm transition-all hover:scale-105"
          title="Lưu khoảnh khắc đẹp (Chụp ảnh kỷ niệm)"
          aria-label="Chụp ảnh kỷ niệm"
        >
          <Camera className="w-3.5 h-3.5 text-[#3D2C2E]" />
        </button>

        {/* Fullscreen */}
        <button
          onClick={handleToggleFullscreen}
          className="p-2 rounded-full bg-white/80 hover:bg-white border border-white/60 text-[#3D2C2E] shadow-sm transition-all hover:scale-105 hidden sm:flex"
          title="Toàn màn hình"
          aria-label="Chế độ toàn màn hình"
        >
          <Maximize2 className="w-3.5 h-3.5 text-[#3D2C2E]" />
        </button>

        {/* Replay journey */}
        <button
          onClick={() => {
            onSelectAct('awakening');
            audioSynth.playSparkleSound(1.0);
          }}
          className="p-2 rounded-full bg-white/80 hover:bg-white border border-white/60 text-[#3D2C2E] shadow-sm transition-all hover:scale-105"
          title="Bắt đầu lại từ đầu"
          aria-label="Xem lại từ đầu"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#3D2C2E]" />
        </button>
      </div>
    </header>
  );
};
