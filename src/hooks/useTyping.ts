import { useReducer, useEffect } from 'react';
import { TypingState, WordState } from '../types';
import { generateWords } from '../data/words';
import { computeStats } from '../utils/stats';
import { TIMER_SECONDS, INITIAL_COUNT, BUFFER_REFILL_AT, BUFFER_ADD, MAX_EXTRA } from '../config';

type Action =
  | { type: 'TYPE'; key: string }
  | { type: 'BACKSPACE' }
  | { type: 'TICK' }
  | { type: 'NEXT' };

function createState(): TypingState {
  return {
    words: generateWords(INITIAL_COUNT),
    wordIdx: 0,
    charIdx: 0,
    startTime: null,
    timeLeft: TIMER_SECONDS,
    done: false,
    wpm: 0,
    accuracy: 0,
    corrections: 0,
  };
}

function refillIfNeeded(words: WordState[], nextWordIdx: number): WordState[] {
  if (nextWordIdx + BUFFER_REFILL_AT < words.length) return words;
  return [...words, ...generateWords(BUFFER_ADD, words[words.length - 1].text)];
}

function commitWord(state: TypingState): TypingState {
  const nextWordIdx = state.wordIdx + 1;
  const words = refillIfNeeded(state.words, nextWordIdx).map((w, i) => {
    if (i !== state.wordIdx) return w;
    const chars = w.chars.map(c => c === 'pending' ? 'incorrect' : c) as typeof w.chars;
    return { ...w, chars };
  });
  return { ...state, words, wordIdx: nextWordIdx, charIdx: 0 };
}

function typeChar(state: TypingState, key: string): TypingState {
  const cur = state.words[state.wordIdx];
  if (state.charIdx >= cur.text.length + MAX_EXTRA) return state;

  const words = state.words.map((w, i) => {
    if (i !== state.wordIdx) return w;
    if (state.charIdx >= cur.text.length) {
      return { ...w, extra: [...w.extra, key] };
    }
    const chars = [...w.chars];
    chars[state.charIdx] = key === w.text[state.charIdx] ? 'correct' : 'incorrect';
    return { ...w, chars };
  });

  return { ...state, words, charIdx: state.charIdx + 1 };
}

function reducer(state: TypingState, action: Action): TypingState {
  switch (action.type) {

    case 'BACKSPACE': {
      if (state.charIdx === 0) return state;
      const cur = state.words[state.wordIdx];
      const isExtra = state.charIdx > cur.text.length;
      const wasIncorrect = !isExtra && cur.chars[state.charIdx - 1] === 'incorrect';
      const corrections = state.corrections + (isExtra || wasIncorrect ? 1 : 0);
      const words = state.words.map((w, i) => {
        if (i !== state.wordIdx) return w;
        if (isExtra) {
          return { ...w, extra: w.extra.slice(0, -1) };
        }
        const chars = [...w.chars];
        chars[state.charIdx - 1] = 'pending';
        return { ...w, chars };
      });
      return { ...state, words, charIdx: state.charIdx - 1, corrections };
    }

    case 'TYPE': {
      const startTime = state.startTime ?? Date.now();
      if (action.key === ' ') {
        if (state.charIdx === 0) return state;
        return { ...commitWord(state), startTime };
      }
      return { ...typeChar(state, action.key), startTime };
    }

    case 'TICK': {
      const newTimeLeft = state.timeLeft - 1;
      if (newTimeLeft <= 0) {
        const { wpm, accuracy } = computeStats(
          state.words, state.wordIdx, state.charIdx, TIMER_SECONDS * 1000, state.corrections,
        );
        return { ...state, timeLeft: 0, done: true, wpm, accuracy };
      }
      return { ...state, timeLeft: newTimeLeft };
    }

    case 'NEXT':
      return createState();
  }
}

export function useTyping(): [TypingState, () => void] {
  const [state, dispatch] = useReducer(reducer, undefined, createState);
  const restart = () => dispatch({ type: 'NEXT' });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Tab') { e.preventDefault(); dispatch({ type: 'NEXT' }); return; }
      if (e.key === 'Backspace') { e.preventDefault(); dispatch({ type: 'BACKSPACE' }); return; }
      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
      e.preventDefault();
      dispatch({ type: 'TYPE', key: e.key });
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!state.startTime || state.done) return;
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(id);
  }, [state.startTime, state.done]);

  return [state, restart];
}
