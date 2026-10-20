import React, { useState } from 'react';
import type { ExperienceAct } from '../types/index.ts';
import { audioSynth } from '../utils/audioSynth.ts';
import { Sparkles, Send, Flame, Heart } from 'lucide-react';

interface AscensionOverlayProps {
  act: ExperienceAct;
  onProceedToNeon: () => void;
  onSendCustomWord: (word: string) => void;
  onReplay: () => void;
}

export const AscensionOverlay: React.FC<AscensionOverlayProps> = ({
  act,
  onProceedToNeon,
  onSendCustomWord,
  onReplay
}) => {
  const [inputText, setInputText] = useState('');
  const [hasSent, setHasSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendCustomWord(inputText.trim());
    setInputText('');
    setHasSent(true);
    audioSynth.playSparkleSound(1.5);
    setTimeout(() => setHasSent(false), 2500);
  };

  const handleQuickSend = (text: string) => {
    onSendCustomWord(text);
    audioSynth.playSparkleSound(1.3);
  };

  if (act === 'blooming') {
    return (
      <div className="fixed inset-x-0 bottom-8 z-30 flex flex-col items-center justify-center px-4 pointer-events-auto animate-fade-in">
        <div className="max-w-md w-full bg-white/85 backdrop-blur-md border border-[#FF758F]/40 rounded-2xl p-4 sm:p-5 shadow-xl text-center">
          <p className="text-xs uppercase font-medium tracking-[0.2em] text-[#FF2A85] mb-1 flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-[#FF2A85] text-[#FF2A85]" />
            <span>Phân Cảnh 3 · Rừng Hoa Cho Hà Linh</span>
          </p>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3D2C2E] mb-2">
            Muôn Đóa Tulip Thức Giấc
          </h3>
          <p className="text-xs sm:text-sm text-[#3D2C2E]/80 mb-4 font-light leading-relaxed">
            Hàng ngàn đóa hoa đang bung nở rực rỡ để chuẩn bị cho khoảnh khắc hoàng hôn huyền ảo nhất.
          </p>

          <button
            onClick={() => {
              audioSynth.playBloomWhoosh();
              onProceedToNeon();
            }}
            className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#FF2A85] via-[#FF758F] to-[#FFA07A] text-white font-medium text-sm sm:text-base shadow-lg shadow-[#FF2A85]/30 hover:shadow-[#FF2A85]/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            <Flame className="w-4 h-4 text-yellow-200 animate-bounce" />
            <span>Chuyển Sang Hoàng Hôn & Thắp Sáng Triệu Hoa</span>
            <Sparkles className="w-4 h-4 text-yellow-200 group-hover:rotate-45 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  if (act === 'neon_ascension') {
    return (
      <>
        {/* Finale Top Banner (Inspired by Reference) */}
        <div className="fixed top-16 sm:top-20 inset-x-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none animate-fade-in">
          <h2
            className="font-calligraphy text-4xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-[0_0_25px_rgba(255,42,133,0.9)] mb-2"
            style={{
              textShadow: '0 0 12px #FFFFFF, 0 0 30px #FF2A85, 0 0 55px #FF2A85, 0 4px 15px rgba(80, 40, 110, 0.4)'
            }}
          >
            Ngàn Hoa Tỏa Sáng Dành Trao Hà Linh
          </h2>
          <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-white/95 font-medium px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/50 shadow-[0_0_15px_rgba(127,127,213,0.5)]">
            Mỗi đóa Tulip bay lên là một lời "Anh Yêu Em" gửi đến Hà Linh
          </p>
        </div>

        {/* Interactive Floating Words Input Deck */}
        <div className="fixed inset-x-0 bottom-4 sm:bottom-6 z-30 flex flex-col items-center justify-center px-4 pointer-events-none">
          <div className="max-w-xl w-full bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-3 sm:p-4 shadow-[0_15px_40px_rgba(224,195,252,0.4)] pointer-events-auto transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF2A85] animate-ping" />
                <span className="text-[11px] sm:text-xs font-semibold text-[#FF2A85] tracking-wider uppercase flex items-center gap-1">
                  <span>Gửi Lời Yêu Đến Hà Linh Vào Trời Đêm</span>
                  <Heart className="w-3 h-3 fill-[#FF2A85] text-[#FF2A85] inline" />
                </span>
              </div>
              <span className="text-[11px] text-[#3D2C2E]/70 italic hidden sm:inline">
                Chạm / click màn hình để bung nở thêm hoa
              </span>
            </div>

            {/* Form for custom dedication message */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập lời yêu thương muốn gửi đến Hà Linh bay lên cùng hoa..."
                maxLength={45}
                className="flex-1 bg-white/90 border border-[#FF758F]/40 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#3D2C2E] placeholder-[#3D2C2E]/50 focus:outline-none focus:ring-2 focus:ring-[#FF2A85]/50 shadow-inner"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF2A85] to-[#FF758F] text-white font-medium text-xs sm:text-sm shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Bay Lên</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Preset Buttons for Ha Linh */}
            <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              <span className="text-[#3D2C2E]/60 shrink-0 font-medium mr-1">Gợi ý:</span>
              {[
                'Anh Yêu Hà Linh ❤️',
                'Hà Linh Là Tất Cả 🌸',
                'Mãi Bên Hà Linh Nhé 💖',
                'I Love You Hà Linh ✨',
                'Nụ Cười Của Hà Linh Đẹp Nhất 🌷',
                'Trọn Đời Yêu Em'
              ].map((msg) => (
                <button
                  key={msg}
                  onClick={() => handleQuickSend(msg)}
                  className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-[#FFF2EB] border border-[#FF758F]/30 text-[#3D2C2E]/80 hover:text-[#FF2A85] whitespace-nowrap transition-colors shadow-2xs shrink-0 flex items-center gap-1 active:scale-95"
                >
                  <span>{msg}</span>
                </button>
              ))}
            </div>

            {hasSent && (
              <p className="text-[11px] text-[#00BBF9] font-medium text-center mt-1 animate-pulse">
                ✨ Lời yêu của bạn đang bay lên cùng hàng triệu đóa hoa phát sáng gửi đến Hà Linh!
              </p>
            )}
          </div>
        </div>
      </>
    );
  }

  return null;
};
