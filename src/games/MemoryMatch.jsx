// File: MemoryMatch.jsx
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import VictoryModal from "./VictoryModal";
import "./MemoryMatch.css";
import { saveScore } from "../services/leaderboardService";
import { useNavigate } from "react-router-dom";

const EMOJIS = ["🧠", "🚀", "🎮", "⚡", "💎", "🌙", "🎧", "🍎"];
const STARTING_SCORE = 1000;
const MINIMUM_SCORE = 100;

function calculateScore(moves, time) {
  return Math.max(STARTING_SCORE - moves * 15 - time * 5, MINIMUM_SCORE);
}

function shuffleCards() {
  const cards = [...EMOJIS, ...EMOJIS].map((emoji, id) => ({
    id,
    emoji,
    flipped: false,
    matched: false,
  }));

  for (let index = cards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[randomIndex]] = [
      cards[randomIndex],
      cards[index],
    ];
  }

  return cards;
}

function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainingSeconds = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function MemoryMatch() {
  const [screen, setScreen] = useState("menu");
  const [countdown, setCountdown] = useState(3);
  const [cards, setCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const score = calculateScore(moves, time);

  const selectedRef = useRef([]);
  const checkingRef = useRef(false);
  const matchTimeoutRef = useRef(null);

  useEffect(() => {
    if (screen !== "countdown") return undefined;

    if (countdown === 0) {
      const startTimer = window.setTimeout(() => {
        setScreen("game");
      }, 700);

      return () => window.clearTimeout(startTimer);
    }

    const countdownTimer = window.setTimeout(() => {
      setCountdown((currentCountdown) => currentCountdown - 1);
    }, 1000);

    return () => window.clearTimeout(countdownTimer);
  }, [screen, countdown]);

  useEffect(() => {
    if (screen !== "game" || showVictory) return undefined;

    const gameTimer = window.setInterval(() => {
      setTime((currentTime) => currentTime + 1);
    }, 1000);

    return () => window.clearInterval(gameTimer);
  }, [screen, showVictory]);

  useEffect(() => {
    if (!showVictory) return undefined;

    confetti({
      particleCount: 200,
      spread: 180,
      origin: { y: 0.6 },
    });

    return undefined;
  }, [showVictory]);

  useEffect(
    () => () => {
      if (matchTimeoutRef.current !== null) {
        window.clearTimeout(matchTimeoutRef.current);
      }
    },
    [],
  );

  function resetGame() {
    if (matchTimeoutRef.current !== null) {
      window.clearTimeout(matchTimeoutRef.current);
      matchTimeoutRef.current = null;
    }

    selectedRef.current = [];
    checkingRef.current = false;
    setCards(shuffleCards());
    setMoves(0);
    setTime(0);
    setIsChecking(false);
    setShowVictory(false);
    setCountdown(3);
    setScreen("countdown");
  }

  function flipCard(index) {
    const card = cards[index];

    if (
      !card ||
      checkingRef.current ||
      selectedRef.current.length >= 2 ||
      card.flipped ||
      card.matched
    ) {
      return;
    }

    const nextSelected = [...selectedRef.current, index];
    selectedRef.current = nextSelected;
    setCards((currentCards) =>
      currentCards.map((currentCard, cardIndex) =>
        cardIndex === index
          ? { ...currentCard, flipped: true }
          : currentCard,
      ),
    );

    if (nextSelected.length < 2) return;

    checkingRef.current = true;
    setIsChecking(true);

    const [firstIndex, secondIndex] = nextSelected;
    const isMatch = cards[firstIndex].emoji === cards[secondIndex].emoji;
    const hasWon =
      isMatch &&
      cards.every(
        (currentCard, cardIndex) =>
          currentCard.matched ||
          cardIndex === firstIndex ||
          cardIndex === secondIndex,
      );
    const nextMoves = moves + 1;
    setMoves(nextMoves);

    matchTimeoutRef.current = window.setTimeout(
      () => {
        setCards((currentCards) => {
          const updatedCards = currentCards.map((currentCard, cardIndex) => {
            if (cardIndex !== firstIndex && cardIndex !== secondIndex) {
              return currentCard;
            }

            return isMatch
              ? { ...currentCard, flipped: true, matched: true }
              : { ...currentCard, flipped: false };
          });

          return updatedCards;
        });

        selectedRef.current = [];
        checkingRef.current = false;
        setIsChecking(false);
        matchTimeoutRef.current = null;

        if (hasWon) {
  const finalScore = calculateScore(nextMoves, time);

  const player =
    localStorage.getItem("playerName") || "Anonymous";

  saveScore(player, "memoryMatch", finalScore);

  setShowVictory(true);
}
      },
      isMatch ? 400 : 800,
    );
  }

  return (
    <div className="memory-page">
      <div className="background-grid" />

      {screen === "menu" && (
        <div className="menu-screen">
          <div className="brain">🧠</div>
          <h1>MEMORY MATCH</h1>
          <p className="arena-text">GAME ARENA</p>

          <div className="instructions">
            <h2>🎮 How to Play</h2>
            <ul>
              <li>🃏 Flip two cards.</li>
              <li>✅ Match all pairs.</li>
              <li>⏱ Finish as quickly as possible.</li>
              <li>🏆 Use the fewest moves to get a high score.</li>
            </ul>
          </div>

          <button className="start-btn" type="button" onClick={resetGame}>
            START GAME
          </button>
        </div>
      )}

      {screen === "countdown" && (
        <div className="countdown-screen">
          <h1 key={countdown}>{countdown === 0 ? "GO!" : countdown}</h1>
        </div>
      )}

      {screen === "game" && (
        <div className="game-screen">
          <div className="top-bar">
            <div className="stat">
              <small>TIME</small>
              <h3>{formatTime(time)}</h3>
            </div>

            <div className="game-title">MEMORY MATCH</div>

            <div className="stat">
              <small>MOVES</small>
              <h3>{moves}</h3>
            </div>

            <div className="stat">
              <small>SCORE</small>
              <h3>{score}</h3>
            </div>
          </div>

          <div className={`board ${isChecking ? "checking" : ""}`}>
            {cards.map((card, index) => (
              <button
                key={card.id}
                className={`memory-card ${
                  card.flipped || card.matched ? "flipped" : ""
                } ${card.matched ? "matched" : ""}`}
                type="button"
                onClick={() => flipCard(index)}
                disabled={isChecking || card.flipped || card.matched}
                aria-label={
                  card.flipped || card.matched
                    ? `Card showing ${card.emoji}`
                    : "Hidden memory card"
                }
              >
                <span className="card-inner">
                  <span className="card-front">?</span>
                  <span className="card-back">{card.emoji}</span>
                </span>
              </button>
            ))}
          </div>

          {showVictory && (
            <VictoryModal
              time={time}
              moves={moves}
              score={score}
              onRestart={resetGame}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default MemoryMatch;
