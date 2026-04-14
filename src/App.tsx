import { useTyping } from './hooks/useTyping';
import { TextDisplay } from './components/TextDisplay';
import { Results } from './components/Results';

export default function App() {
  const [state, restart] = useTyping();

  const timerUrgency =
    state.timeLeft <= 5 ? 'urgent' :
    state.timeLeft <= 10 ? 'warning' :
    null;

  return (
    <div className="container">
      <div className="card">
        <div className="top-row">
          {!state.done && (
            <span
              className="timer"
              data-idle={!state.startTime ? '' : undefined}
              data-warning={timerUrgency === 'warning' ? '' : undefined}
              data-urgent={timerUrgency === 'urgent' ? '' : undefined}
            >
              {state.timeLeft}
            </span>
          )}
          <button className="icon-btn" onClick={restart} title="Restart (Tab)">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 8a5.5 5.5 0 1 0 1.06-3.28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2.5 2v3.5H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        {state.done ? (
          <Results wpm={state.wpm} accuracy={state.accuracy} />
        ) : (
          <TextDisplay
            words={state.words}
            wordIdx={state.wordIdx}
            charIdx={state.charIdx}
          />
        )}
      </div>
    </div>
  );
}
