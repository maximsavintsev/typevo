import { WordState } from '../types';

export function computeStats(
  words: WordState[],
  wordIdx: number,
  charIdx: number,
  elapsedMs: number,
  corrections: number = 0,
): { wpm: number; accuracy: number } {
  let correct = 0;
  let total = 0;

  for (let i = 0; i < wordIdx && i < words.length; i++) {
    for (const c of words[i].chars) {
      if (c !== 'pending') { total++; if (c === 'correct') correct++; }
    }
    total += words[i].extra.length;
  }

  if (wordIdx < words.length) {
    const cur = words[wordIdx];
    for (let i = 0; i < Math.min(charIdx, cur.chars.length); i++) {
      if (cur.chars[i] !== 'pending') { total++; if (cur.chars[i] === 'correct') correct++; }
    }
    total += cur.extra.length;
  }

  const mins = elapsedMs / 60000;
  const wpm = mins > 0 ? Math.round((correct / 5) / mins) : 0;
  const accuracy = total > 0 ? Math.round((correct / (total + corrections)) * 100) : 100;
  return { wpm, accuracy };
}
