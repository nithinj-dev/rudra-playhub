// File: VictoryModal.jsx
import { useNavigate } from "react-router-dom";
import "./VictoryModal.css";

function getStars(score) {
  if (score >= 950) return "⭐⭐⭐⭐⭐";
  if (score >= 850) return "⭐⭐⭐⭐";
  if (score >= 700) return "⭐⭐⭐";
  if (score >= 500) return "⭐⭐";
  return "⭐";
}

function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainingSeconds = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function VictoryModal({ time, moves, score, onRestart }) {
  const navigate = useNavigate();

  return (
    <div className="victory-overlay" role="dialog" aria-modal="true">
      <div className="victory-card">
        <div className="trophy">🏆</div>
        <h1>YOU WON!</h1>
        <div className="stars" aria-label={`${getStars(score).length} stars`}>
          {getStars(score)}
        </div>

        <div className="stats">
          <div className="stat-box">
            <span>⏱ Time</span>
            <h2>{formatTime(time)}</h2>
          </div>

          <div className="stat-box">
            <span>🎯 Moves</span>
            <h2>{moves}</h2>
          </div>

          <div className="stat-box">
            <span>💯 Score</span>
            <h2>{score}</h2>
          </div>
        </div>

        <div className="buttons">
          <button className="play-again" type="button" onClick={onRestart}>
            🔄 Play Again
          </button>

          <button
            className="game-hub"
            type="button"
            onClick={() => navigate("/games")}
          >
            🏠 Game Hub
          </button>
        </div>
      </div>
    </div>
  );
}

export default VictoryModal;
