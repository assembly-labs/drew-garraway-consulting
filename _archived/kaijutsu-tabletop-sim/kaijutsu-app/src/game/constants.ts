export const HAND_SIZE = 5;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 4;

export const EMOTION_EMOJI: Record<string, string> = {
  happy: '\u{1F60A}',
  angry: '\u{1F620}',
  sad: '\u{1F622}',
  surprised: '\u{1F632}',
  confused: '\u{1F615}',
};

export const EMOTION_COLORS: Record<string, { primary: string; bg: string }> = {
  happy: { primary: '#FFD700', bg: '#FFF9E0' },
  angry: { primary: '#E74C3C', bg: '#FDE8E8' },
  sad: { primary: '#3498DB', bg: '#E8F4FD' },
  surprised: { primary: '#9B59B6', bg: '#F3E8FD' },
  confused: { primary: '#E67E22', bg: '#FDF2E8' },
};

export const CHARACTER_COLORS: Record<string, string> = {
  Hiro: '#E74C3C',
  Tatami: '#2ECC71',
  Lumi: '#3498DB',
  Stella: '#9B59B6',
  Rocky: '#E67E22',
};
