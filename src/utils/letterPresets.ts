import type { LetterData } from '../types/index.ts';

export const LETTER_PRESETS: LetterData[] = [
  {
    id: 'ha_linh_love',
    presetName: 'Dành Riêng Cho Hà Linh ❤️',
    recipient: 'Hà Linh yêu dấu của anh,',
    title: 'Gửi Hà Linh - Triệu Đóa Tulip Dành Riêng Em...',
    paragraphs: [
      'Có những điều kỳ diệu không thể diễn tả trọn vẹn bằng lời, như khoảnh khắc em mỉm cười và làm bừng sáng cả thế giới xung quanh anh.',
      'Nếu mỗi đóa hoa là một nhịp đập yêu thương, anh nguyện gom cả triệu đóa Tulip rực rỡ nhất dưới bầu trời hoàng hôn huyền ảo này chỉ để đổi lấy nụ cười của em.',
      'Cảm ơn Hà Linh đã đến bên anh, mang theo sự ấm áp, dịu dàng và những thanh âm ngọt ngào nhất của cuộc đời.',
      'Dưới vòm trời lấp lánh ánh sao và triệu đóa hoa phát sáng, anh muốn gửi trọn đến em tất cả tình yêu chân thành nhất: Anh yêu Hà Linh nhiều lắm!'
    ],
    signOff: 'Mãi mãi yêu Hà Linh ❤️',
    dateStr: 'Mãi Bên Nhau Em Nhé'
  },
  {
    id: 'ha_linh_anniversary',
    presetName: 'Kỷ Niệm Tình Yêu Với Hà Linh',
    recipient: 'Bé Hà Linh của anh,',
    title: 'Kỷ Niệm Tình Yêu Chúng Mình...',
    paragraphs: [
      'Từng ngày trôi qua bên Hà Linh là những ngày tháng anh cảm thấy may mắn và bình yên nhất.',
      'Dù mai này cuộc sống có bao nhiêu đổi thay, bàn tay này vẫn sẽ luôn nắm chặt tay em, cùng em đi qua muôn dặm đường dài.',
      'Nguyện ước tình yêu của hai đứa mình mãi rạng ngời và ngát hương như rừng hoa Tulip đêm nay.'
    ],
    signOff: 'Yêu em hơn mỗi ngày',
    dateStr: 'Trọn Đời Yêu Em'
  },
  {
    id: 'teachers_day_20_11',
    presetName: 'Tri Ân Thầy Cô (20/11)',
    recipient: 'Kính gửi Thầy Cô kính yêu,',
    title: 'Gửi Người Gieo Mầm Ánh Sáng...',
    paragraphs: [
      'Có những hành trình bắt đầu từ những nét chữ đầu tiên nơi bảng đen phấn trắng, từ sự kiên nhẫn dịu dàng và ánh mắt ấm áp chở che của Thầy Cô qua từng năm tháng.',
      'Người ta bảo nghề giáo như người lái đò thầm lặng sang sông, nhưng với chúng em, Thầy Cô chính là những người thắp lên ngọn đèn soi sáng tâm hồn, gieo vào lòng chúng em những ước mơ bay cao.',
      'Hôm nay, giữa muôn sắc hoa rực rỡ, xin kính gửi đến Thầy Cô ngàn đóa Tulip tinh khôi nhất cùng lòng biết ơn sâu sắc và lòng kính yêu vô bờ.',
      'Kính chúc Thầy Cô luôn dồi dào sức khỏe, ngập tràn niềm vui và mãi là ngọn hải đăng vững chãi của bao thế hệ học trò.'
    ],
    signOff: 'Học trò mãi khắc ghi công ơn',
    dateStr: 'Mùa Tri Ân 20/11'
  },
  {
    id: 'mother_first_teacher',
    presetName: 'Mẹ - Người Thầy Đầu Tiên',
    recipient: 'Mẹ yêu dấu của con,',
    title: 'Người Dạy Con Yêu Thương...',
    paragraphs: [
      'Mẹ là người thầy đầu tiên dạy con bi bô cất tiếng nói, dạy con biết mỉm cười và biết nâng niu những điều bình dị nhất trong cuộc đời.',
      'Tóc mẹ vương màu sương gió cũng vì những lo toan nuôi nấng con nên người. Cảm ơn Mẹ vì tình yêu bao la tựa biển trời.',
      'Con gom hết ngàn sắc hoa lung linh này để kính dâng lên Mẹ — người phụ nữ tuyệt vời nhất trần gian.'
    ],
    signOff: 'Con yêu của Mẹ',
    dateStr: 'Mãi Yêu Mẹ'
  }
];

export function getPresetById(id: string): LetterData {
  const found = LETTER_PRESETS.find(p => p.id === id);
  return found || LETTER_PRESETS[0];
}

export function validateLetterData(letter: Partial<LetterData>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!letter.recipient?.trim()) {
    errors.push('Vui lòng nhập tên người nhận');
  }
  if (!letter.title?.trim()) {
    errors.push('Vui lòng nhập tiêu đề bức thư');
  }
  if (!letter.paragraphs || letter.paragraphs.length === 0 || !letter.paragraphs.some(p => p.trim().length > 0)) {
    errors.push('Vui lòng nhập ít nhất một đoạn nội dung thư');
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function estimateReadTimeSeconds(paragraphs: string[]): number {
  const totalWords = paragraphs.reduce((acc, p) => acc + p.trim().split(/\s+/).filter(Boolean).length, 0);
  const seconds = Math.ceil((totalWords / 180) * 60);
  return Math.max(10, seconds);
}

export function formatFullLetterText(letter: LetterData): string {
  return `${letter.recipient}\n\n${letter.paragraphs.join('\n\n')}\n\n${letter.signOff}\n${letter.dateStr}`;
}
