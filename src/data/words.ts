import { CharState, WordState } from '../types';

export const WORD_POOL: readonly string[] = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
  'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
  'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so',
  'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when',
  'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people',
  'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
  'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
  'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
  'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'great',
  'between', 'need', 'large', 'often', 'hand', 'high', 'place', 'hold', 'turn', 'found',
  'still', 'learn', 'should', 'part', 'small', 'every', 'near', 'food', 'keep', 'light',
  'feet', 'land', 'side', 'without', 'once', 'life', 'enough', 'took', 'four', 'head',
  'above', 'kind', 'began', 'almost', 'live', 'page', 'got', 'earth', 'thought', 'city',
  'tree', 'farm', 'hard', 'start', 'might', 'story', 'never', 'ten', 'open', 'seem',
  'together', 'next', 'white', 'begin', 'walk', 'example', 'paper', 'always', 'music',
  'those', 'both', 'mark', 'book', 'letter', 'until', 'mile', 'river', 'car', 'care',
  'second', 'plain', 'girl', 'young', 'ready', 'ever', 'list', 'feel', 'talk', 'bird',
  'soon', 'body', 'dog', 'family', 'leave', 'song', 'measure', 'door', 'product', 'black',
  'short', 'numeral', 'class', 'wind', 'question', 'happen', 'complete', 'ship', 'area', 'half',
];

function makeWord(text: string): WordState {
  return { text, chars: new Array<CharState>(text.length).fill('pending'), extra: [] };
}

export function generateWords(count: number, lastText = ''): WordState[] {
  const result: WordState[] = [];
  let prev = lastText;
  for (let i = 0; i < count; i++) {
    let text: string;
    do {
      text = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
    } while (text === prev && WORD_POOL.length > 1);
    prev = text;
    result.push(makeWord(text));
  }
  return result;
}
