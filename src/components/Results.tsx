interface Props {
  wpm: number;
  accuracy: number;
}

export function Results({ wpm, accuracy }: Props) {
  return (
    <div className="results">
      <div className="results__stats">
        <div className="stat">
          <span className="stat__value">{wpm}</span>
          <span className="stat__label">wpm</span>
        </div>
        <div className="stat">
          <span className="stat__value">{accuracy}%</span>
          <span className="stat__label">accuracy</span>
        </div>
      </div>
    </div>
  );
}
