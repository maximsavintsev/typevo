import { useLayoutEffect, useRef, useState } from 'react';
import { WordState } from '../types';

interface Props {
  words: WordState[];
  wordIdx: number;
  charIdx: number;
}

const LINE_H = 52;

export function TextDisplay({ words, wordIdx, charIdx }: Props) {
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  // cursorAfter: place cursor after the anchor span (not before it)
  const cursorAfterRef = useRef(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    const container = containerRef.current;
    const word = activeWordRef.current;
    const anchor = activeCharRef.current;
    if (!inner || !container || !word || !anchor) return;

    const line = Math.floor(word.offsetTop / LINE_H);
    const offsetY = Math.max(0, line - 1) * LINE_H;
    inner.style.transform = `translateY(-${offsetY}px)`;

    const aRect = anchor.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    const x = Math.max(0, aRect.left - cRect.left + (cursorAfterRef.current ? aRect.width : 0) - 1);
    const y = aRect.top - cRect.top;
    setCursorPos({ x, y });
  }, [wordIdx, charIdx]);

  return (
    <div className="words-container" ref={containerRef}>
      {cursorPos && (
        <span
          key={`${wordIdx}-${charIdx}`}
          className="cursor-caret"
          style={{ transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)` }}
        />
      )}
      <div ref={innerRef} className="words-inner">
        {words.map((word, wIdx) => {
          const isActive = wIdx === wordIdx;
          const isPast = wIdx < wordIdx;
          const atEnd = isActive && charIdx >= word.text.length + word.extra.length;

          return (
            <span
              key={wIdx}
              ref={isActive ? activeWordRef : undefined}
              className={`word${isPast ? ' word--past' : ''}`}
            >
              {word.text.split('').map((char, cIdx) => {
                const state = word.chars[cIdx];
                // cursor before this char, OR (if at end) attach to last char and place after
                const isAnchor = isActive && (
                  atEnd
                    ? word.extra.length === 0 && cIdx === word.text.length - 1
                    : cIdx === charIdx
                );
                if (isAnchor) cursorAfterRef.current = atEnd;
                let cls = 'char';
                if (state === 'correct') cls += ' char--correct';
                else if (state === 'incorrect') cls += ' char--incorrect';
                return (
                  <span key={cIdx} ref={isAnchor ? activeCharRef : undefined} className={cls}>{char}</span>
                );
              })}
              {word.extra.map((ch, xIdx) => {
                const isLastExtra = isActive && xIdx === word.extra.length - 1;
                const isBeforeExtra = isActive && charIdx === word.text.length + xIdx;
                const isAnchor = atEnd ? isLastExtra : isBeforeExtra;
                if (isAnchor) cursorAfterRef.current = atEnd;
                return (
                  <span key={`x${xIdx}`} ref={isAnchor ? activeCharRef : undefined} className="char char--incorrect">{ch}</span>
                );
              })}
            </span>
          );
        })}
      </div>
    </div>
  );
}
