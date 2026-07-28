import React, { useState, useEffect, useRef, useCallback } from 'react';
import './FindRudraLogo.css';

const GAME_DURATION = 60;

export default function FindRudraLogo() {
  const [gameState, setGameState] = useState('menu'); // menu | playing | gameover
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [logoPos, setLogoPos] = useState({ x: 0, y: 0 });
  const [logoSize, setLogoSize] = useState(140);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('rudraHighScore')) || 0;
    } catch {
      return 0;
    }
  });
  const [effects, setEffects] = useState([]);
  const [combo, setCombo] = useState(0);

  const gameAreaRef = useRef(null);
  const timerRef = useRef(null);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);

  const getRandomPos = useCallback(() => {
    if (!gameAreaRef.current) return { x: 100, y: 100 };
    const rect = gameAreaRef.current.getBoundingClientRect();
    const pad = logoSize + 24;
    return {
      x: Math.random() * Math.max(20, rect.width - pad) + 12,
      y: Math.random() * Math.max(20, rect.height - pad) + 12,
    };
  }, [logoSize]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    scoreRef.current = 0;
    setCombo(0);
    comboRef.current = 0;
    setTimeLeft(GAME_DURATION);
    setLogoSize(140);
    setEffects([]);
    setTimeout(() => setLogoPos(getRandomPos()), 50);
  };

  const endGame = useCallback(() => {
    setGameState('gameover');
    const final = scoreRef.current;
    if (final > highScore) {
      localStorage.setItem('rudraHighScore', final);
      setHighScore(final);
    }
  }, [highScore]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameState, endGame]);

  useEffect(() => {
    if (gameState === 'playing') {
      const elapsed = GAME_DURATION - timeLeft;
      setLogoSize(Math.max(55, 140 - elapsed * 1.4));
    }
  }, [timeLeft, gameState]);

  const handleLogoClick = (e) => {
    e.stopPropagation();
    if (gameState !== 'playing') return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    comboRef.current += 1;
    setCombo(comboRef.current);

    const base = 10;
    const comboBonus = Math.min(comboRef.current * 2, 40);
    const diffBonus = Math.floor((140 - logoSize) / 2);
    const points = base + comboBonus + diffBonus;

    scoreRef.current += points;
    setScore(scoreRef.current);

    const id = Date.now() + Math.random();
    setEffects((prev) => [...prev, { id, x: cx, y: cy, points }]);
    setTimeout(() => {
      setEffects((prev) => prev.filter((ef) => ef.id !== id));
    }, 900);

    setLogoPos(getRandomPos());
  };

  const handleMiss = () => {
    if (gameState !== 'playing') return;
    comboRef.current = 0;
    setCombo(0);
  };

  const timerPct = (timeLeft / GAME_DURATION) * 100;
  const timerColor =
    timeLeft > 20 ? '#00e5ff' : timeLeft > 10 ? '#ffca28' : '#ff5252';

  return (
    <div className="rudra-container">
      {/* Ambient particles */}
      <div className="particles">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${7 + Math.random() * 9}s`,
            }}
          />
        ))}
      </div>

      {/* ===== MENU ===== */}
      {gameState === 'menu' && (
        <div className="screen menu-screen">
          <div className="menu-logo-wrap">
            <img
              src="/rudra-logo.png"
              alt="RUDRA Logo"
              className="menu-logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="logo-pulse-ring" />
          </div>

          <h1 className="game-title">FIND RUDRA LOGO</h1>
          <p className="game-subtitle">
            How many times can you spot the logo in 60 seconds?
          </p>

          <div className="info-row">
            <div className="info-pill">
              <span className="info-icon">⏱️</span>
              <span>60 Seconds</span>
            </div>
            <div className="info-pill">
              <span className="info-icon">🎯</span>
              <span>Click to Score</span>
            </div>
            <div className="info-pill">
              <span className="info-icon">⚡</span>
              <span>Shrinks Over Time</span>
            </div>
          </div>

          {highScore > 0 && (
            <div className="high-score-badge">🏆 High Score: {highScore}</div>
          )}

          <button className="btn-primary" onClick={startGame}>
            <span className="btn-shine" />
            START GAME
          </button>
        </div>
      )}

      {/* ===== PLAYING ===== */}
      {gameState === 'playing' && (
        <div className="game-layout">
          <div className="hud">
            <div className="hud-group">
              <span className="hud-label">SCORE</span>
              <span className="hud-value score-color">{score}</span>
            </div>

            <div className="timer-box">
              <div className="timer-track">
                <div
                  className="timer-bar"
                  style={{
                    width: `${timerPct}%`,
                    background: timerColor,
                    boxShadow: `0 0 12px ${timerColor}`,
                  }}
                />
              </div>
              <span className="timer-label" style={{ color: timerColor }}>
                {timeLeft}s
              </span>
            </div>

            <div className="hud-group">
              <span className="hud-label">COMBO</span>
              <span className="hud-value combo-color">x{combo}</span>
            </div>
          </div>

          <div
            className="play-area"
            ref={gameAreaRef}
            onClick={handleMiss}
          >
            <div className="circuit-bg" />

            <div
              className="logo-target"
              style={{
                left: `${logoPos.x}px`,
                top: `${logoPos.y}px`,
                width: `${logoSize}px`,
                height: `${logoSize}px`,
              }}
              onClick={handleLogoClick}
            >
              <div className="target-glow" />
              <img
                src="/rudra-logo.png"
                alt="Click me!"
                draggable={false}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {effects.map((ef) => (
              <div
                key={ef.id}
                className="click-fx"
                style={{ left: ef.x, top: ef.y }}
              >
                <span className="points-pop">+{ef.points}</span>
                <div className="ripple" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== GAME OVER ===== */}
      {gameState === 'gameover' && (
        <div className="screen over-screen">
          <div
            className={`result-badge ${
              score >= highScore && score > 0 ? 'new-record' : ''
            }`}
          >
            {score >= highScore && score > 0 ? '🎉 NEW RECORD!' : "⏰ TIME'S UP!"}
          </div>

          <img
            src="/rudra-logo.png"
            alt="RUDRA"
            className="over-logo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />

          <div className="final-score-box">
            <span className="final-label">YOUR SCORE</span>
            <span className="final-number">{score}</span>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-title">High Score</span>
              <span className="stat-figure">{Math.max(score, highScore)}</span>
            </div>
            <div className="stat-card">
              <span className="stat-title">Combo Best</span>
              <span className="stat-figure">{combo}</span>
            </div>
            <div className="stat-card">
              <span className="stat-title">Duration</span>
              <span className="stat-figure">60s</span>
            </div>
          </div>

          <div className="btn-row">
            <button className="btn-primary" onClick={startGame}>
              PLAY AGAIN
            </button>
            <button className="btn-secondary" onClick={() => setGameState('menu')}>
              MAIN MENU
            </button>
          </div>
        </div>
      )}
    </div>
  );
}