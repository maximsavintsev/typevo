# Typevo

Minimalist typing speed test. Type words against a 30-second timer, get your WPM and accuracy.

## Features

- 30-second timed test
- Accuracy penalizes corrected typos, not just final mistakes
- Smooth animated caret with pixel-perfect positioning
- Infinite word buffer — words never run out
- Keyboard-first: press `Tab` to restart at any time

## Stack

- React 19 + TypeScript
- Vite
- SCSS

## Getting started

```bash
npm install
npm run dev
```

## Project structure

```
src/
├── components/
│   ├── TextDisplay.tsx   # word grid + animated caret
│   └── Results.tsx       # WPM / accuracy screen
├── hooks/
│   └── useTyping.ts      # all state logic (useReducer)
├── utils/
│   └── stats.ts          # WPM and accuracy calculation
├── data/
│   └── words.ts          # word list + generator
├── styles/
│   └── main.scss
├── config.ts             # timer duration, buffer sizes
├── types.ts
└── App.tsx
```

## How accuracy is calculated

```
accuracy = correct_chars / (correct_chars + incorrect_chars + corrections) × 100
```

`corrections` counts every backspace over an incorrect or extra character — fixing a typo leaves a trace even if the final character is correct.

WPM uses the standard formula: `(correct_chars / 5) / minutes`.
