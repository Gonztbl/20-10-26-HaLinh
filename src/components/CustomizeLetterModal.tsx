import React, { useState } from 'react';
import type { LetterData } from '../types/index.ts';
import { LETTER_PRESETS, validateLetterData, estimateReadTimeSeconds } from '../utils/letterPresets.ts';
import { X, Check, Sparkles, BookOpen } from 'lucide-react';

interface CustomizeLetterModalProps {
  currentLetter: LetterData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (letter: LetterData) => void;
}

export const CustomizeLetterModal: React.FC<CustomizeLetterModalProps> = ({
  currentLetter,
  isOpen,
  onClose,
  onSave
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(currentLetter.id || 'teachers_day_20_11');
  const [recipient, setRecipient] = useState<string>(currentLetter.recipient);
  const [title, setTitle] = useState<string>(currentLetter.title);
  const [paragraphsText, setParagraphsText] = useState<string>(currentLetter.paragraphs.join('\n\n'));
  const [signOff, setSignOff] = useState<string>(currentLetter.signOff);
  const [dateStr, setDateStr] = useState<string>(currentLetter.dateStr);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: LetterData) => {
    setSelectedPresetId(preset.id);
    setRecipient(preset.recipient);
    setTitle(preset.title);
    setParagraphsText(preset.paragraphs.join('\n\n'));
    setSignOff(preset.signOff);
    setDateStr(preset.dateStr);
    setErrorMsg('');
  };

  const handleSave = () => {
    const rawParagraphs = paragraphsText
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const newLetter: LetterData = {
      id: selectedPresetId || 'custom_letter',
      presetName: 'Tùy Chỉnh Cá Nhân',
      recipient: recipient.trim(),
      title: title.trim(),
      paragraphs: rawParagraphs,
      signOff: signOff.trim(),
      dateStr: dateStr.trim()
    };

    const validation = validateLetterData(newLetter);
    if (!validation.isValid) {
      setErrorMsg(validation.errors[0]);
      return;
    }

    onSave(newLetter);
    onClose();
  };

  const paragraphsList = paragraphsText.split('\n').filter((p) => p.trim().length > 0);
  const readSeconds = estimateReadTimeSeconds(paragraphsList);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in pointer-events-auto">
      <div className="w-full max-w-xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/40 flex flex-col overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#FFF9F6] to-[#FDE8E8]">
          <div className="flex items-center gap-2">
            <span className="text-xl">✍️</span>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#3D2C2E]">
                Tùy Chỉnh Lời Tri Ân
              </h3>
              <p className="text-xs text-[#3D2C2E]/60">
                Soạn lời chúc mang dấu ấn riêng của bạn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#3D2C2E]/60 hover:text-[#3D2C2E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Preset Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#3D2C2E] uppercase tracking-wider mb-2">
              Chọn mẫu thư có sẵn:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LETTER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col gap-0.5 ${
                    selectedPresetId === preset.id
                      ? 'border-[#FF2A85] bg-[#FFF2EB] text-[#FF2A85] font-semibold ring-2 ring-[#FF2A85]/20'
                      : 'border-gray-200 hover:border-[#D4AF37]/60 text-[#3D2C2E]/80 bg-white'
                  }`}
                >
                  <span className="font-medium truncate">{preset.presetName}</span>
                  <span className="text-[10px] text-gray-500 truncate">{preset.recipient}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recipient */}
          <div>
            <label className="block text-xs font-semibold text-[#3D2C2E] uppercase tracking-wider mb-1.5">
              Người nhận:
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="VD: Kính gửi Thầy Nguyễn Văn An kính mến,"
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2A85]/40"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#3D2C2E] uppercase tracking-wider mb-1.5">
              Tiêu đề bức thư:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Gửi Người Gieo Mầm Ánh Sáng..."
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2A85]/40"
            />
          </div>

          {/* Paragraphs */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#3D2C2E] uppercase tracking-wider">
                Nội dung các đoạn (xuống dòng để chia đoạn):
              </label>
              <span className="text-[11px] text-gray-500 flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                ~{readSeconds}s đọc
              </span>
            </div>
            <textarea
              rows={6}
              value={paragraphsText}
              onChange={(e) => setParagraphsText(e.target.value)}
              placeholder="Nhập nội dung lời tri ân tại đây..."
              className="w-full px-3.5 py-2.5 text-sm font-serif bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2A85]/40 leading-relaxed resize-none"
            />
          </div>

          {/* Signoff & Date in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#3D2C2E] uppercase tracking-wider mb-1.5">
                Ký tên:
              </label>
              <input
                type="text"
                value={signOff}
                onChange={(e) => setSignOff(e.target.value)}
                placeholder="VD: Học trò của Thầy"
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2A85]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3D2C2E] uppercase tracking-wider mb-1.5">
                Ngày / Mốc kỷ niệm:
              </label>
              <input
                type="text"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                placeholder="VD: Mùa Tri Ân 20/11"
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF2A85]/40"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-500 font-medium bg-red-50 p-2.5 rounded-xl border border-red-200">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#FF2A85] to-[#FF758F] rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Áp Dụng Vào Thư</span>
          </button>
        </div>
      </div>
    </div>
  );
};
