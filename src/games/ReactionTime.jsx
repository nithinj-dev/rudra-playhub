import { useState, useRef, useEffect } from "react";
import "./ReactionTime.css";
import { saveScore } from "../services/leaderboardService";

function ReactionTime() {
  const playerName = localStorage.getItem("playerName") || "Player";

  const [gameState, setGameState] = useState("idle");
  const [reactionTime, setReactionTime] = useState(null);

  const [bestTime, setBestTime] = useState(
    localStorage.getItem("bestReaction")
      ? Number(localStorage.getItem("bestReaction"))
      : null
  );

  const startTime = useRef(null);
  const timer = useRef(null);

  // Start Game
  const startGame = () => {
    setReactionTime(null);
    setGameState("waiting");

    const delay = Math.floor(Math.random() * 3000) + 2000;

    timer.current = setTimeout(() => {
      startTime.current = Date.now();
      setGameState("ready");
    }, delay);
  };

  // Handle Screen Click
  const handleClick = () => {
    if (gameState === "waiting") {
      clearTimeout(timer.current);
      setGameState("tooSoon");
      return;
    }

    if (gameState === "ready") {
      const time = Date.now() - startTime.current;
      const player = localStorage.getItem("playerName") || "Anonymous";
      const reactionScore = Math.max(1000 - time * 2, 100);

saveScore(
    player,
    "reactionTime",
    reactionScore
);
      setReactionTime(time);

      if (!bestTime || time < bestTime) {
        setBestTime(time);
        localStorage.setItem("bestReaction", time);
      }

      setGameState("result");
    }
  };

  // Cleanup timer
  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  // Score
  const score =
    reactionTime !== null
      ? Math.max(0, 1000 - reactionTime)
      : 0;

  // Rating
  const getRating = () => {
    if (reactionTime < 200) return "⚡ Lightning Fast!";
    if (reactionTime < 250) return "🔥 Excellent!";
    if (reactionTime < 320) return "😊 Great!";
    if (reactionTime < 400) return "👍 Good!";
    return "😅 Keep Practicing!";
  };

  return (
    <div
      className={`reaction-container ${
        gameState === "ready" ? "green" : ""
      }`}
      onClick={handleClick}
    >
      <div className="reaction-card">

        {/* HOME */}
        {gameState === "idle" && (
          <>
            <h1>⚡ Reaction Time Challenge</h1>

            <p className="description">
              Welcome <strong>{playerName}</strong>!
            </p>

            <p>
              Click <b>Start Game</b> and wait until the screen turns
              <span className="green-text"> GREEN</span>.
              Click as quickly as you can!
            </p>

            {bestTime && (
              <h3 className="best-score">
                🏆 Best Time : {bestTime} ms
              </h3>
            )}

            <button onClick={startGame}>
              🚀 Start Game
            </button>
          </>
        )}

        {/* WAITING */}
        {gameState === "waiting" && (
          <>
            <h1 className="waiting">
              ⏳ Wait<span>.</span><span>.</span><span>.</span>
            </h1>

            <p>
              Don't click yet!
            </p>
          </>
        )}

        {/* READY */}
        {gameState === "ready" && (
          <>
            <h1>🟢 CLICK NOW!</h1>

            <p>
              Click anywhere on the screen!
            </p>
          </>
        )}

        {/* TOO SOON */}
        {gameState === "tooSoon" && (
          <>
            <h1>❌ Too Soon!</h1>

            <p>
              You clicked before the screen turned green.
            </p>

            <button onClick={startGame}>
              Try Again
            </button>
          </>
        )}

        {/* RESULT */}
        {gameState === "result" && (
          <>
            <h1>
              🎉 Great Job, {playerName}!
            </h1>

            <h2 className="score">
              {reactionTime} ms
            </h2>

            <h3 className="score-points">
              ⭐ Score : {score}
            </h3>

            <p className="rating">
              {getRating()}
            </p>

            {bestTime === reactionTime && (
              <p className="new-record">
                🏆 New Personal Best!
              </p>
            )}

            <button onClick={startGame}>
              🔄 Play Again
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default ReactionTime;