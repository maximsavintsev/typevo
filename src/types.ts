export type CharState = 'pending' | 'correct' | 'incorrect';

export interface WordState {
  text: string;
  chars: CharState[]; // one entry per character in text
  extra: string[];    // characters typed beyond word length (always incorrect)
}

export interface TypingState {
  words: WordState[];
  wordIdx: number;  // index of active word
  charIdx: number;  // index of active char within active word
  startTime: number | null;
  timeLeft: number;
  done: boolean;
  wpm: number;
  accuracy: number;
  corrections: number; // backspaced incorrect/extra chars
}
