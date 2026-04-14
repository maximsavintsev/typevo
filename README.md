# Typevo

Minimalist typing speed test. Type words against a 30-second timer, get your WPM and accuracy.

Test it https://typevo.vercel.app/

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
