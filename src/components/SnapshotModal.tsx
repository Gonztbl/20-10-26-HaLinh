import React from 'react';
import { X, Download, Heart } from 'lucide-react';

interface SnapshotModalProps {
  imageDataUrl: string | null;
  onClose: () => void;
}

export const SnapshotModal: React.FC<SnapshotModalProps> = ({
  imageDataUrl,
  onClose
}) => {
  if (!imageDataUrl) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imageDataUrl;
    a.download = `tulip-twilight-ha-linh-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#FF758F]/50 flex flex-col animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#FFF9F6] to-[#FDE8E8]">
          <div className="flex items-center gap-2">
            <span className="text-xl">📸</span>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#3D2C2E] flex items-center gap-1.5">
                <span>Bưu Thiếp Kỷ Niệm Tặng Hà Linh</span>
                <Heart className="w-4 h-4 fill-[#FF2A85] text-[#FF2A85] inline" />
              </h3>
              <p className="text-xs text-[#3D2C2E]/60">
                Lưu giữ khoảnh khắc hoàng hôn và triệu đóa hoa phát sáng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Preview */}
        <div className="p-4 sm:p-6 bg-[#3D2C2E]/5 flex items-center justify-center">
          <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-white max-h-[55vh]">
            <img
              src={imageDataUrl}
              alt="Khoảnh khắc hoa Tulip phát sáng hoàng hôn dành tặng Hà Linh"
              className="w-full h-auto object-contain max-h-[55vh]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-light">
            Độ phân giải cao · Sẵn sàng gửi tặng Hà Linh
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Đóng
            </button>
            <button
              onClick={handleDownload}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#FF2A85] to-[#FF758F] rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Tải Ảnh Về Máy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
