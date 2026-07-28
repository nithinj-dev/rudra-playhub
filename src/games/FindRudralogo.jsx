import React, { useState, useEffect, useRef, useCallback } from 'react';
import './FindRudraLogo.css';

// INSTRUCTION: Save your uploaded logo image as "rudra-logo.png" 
// inside your React app's "public" folder.

const GAME_DURATION = 60;

const FindRudraLogo = () => {
  const [gameState, setGameState] = useState('start'); // start, playing, ended
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [logoPos, setLogoPos] = useState({ x: 50, y: 50 });
  const [logoSize, setLogoSize] = useState(140);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('rudraHighScore')) || 0;
  });
  const [clickEffects, setClickEffects] = useState([]);
  const [shake, setShake] = useState(false);
  
  const gameAreaRef = useRef(null);
  const timerRef = useRef(null);
  const scoreRef = useRef(0);

  // Generate random position keeping logo within bounds
  const getRandomPosition = useCallback(() => {
    if (!gameAreaRef.current) return { x: 50, y: 50 };
    const rect = gameAreaRef.current.getBoundingClientRect();
    const padding = logoSize + 20;
    const x = Math.random() * (rect.width - padding) + 10;
    const y = Math.random() * (rect.height - padding) + 10;
    return { x, y };
  }, [logoSize]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    scoreRef.current = 0;
    setTimeLeft(GAME_DURATION);
    setLogoSize(140);
    setLogoPos(getRandomPosition());
    setClickEffects([]);
  };

  const endGame = useCallback(() => {
    setGameState('ended');
    if (scoreRef.current > highScore) {
      localStorage.setItem('rudraHighScore', scoreRef.current);
      setHighScore(scoreRef.current);
    }
  }, [highScore]);

  // Timer logic
  useEffect(() => {
    if (gameState === 'playing') {
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
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, endGame]);

  // Increase difficulty: shrink logo over time
  useEffect(() => {
    if (gameState === 'playing') {
      const elapsed = GAME_DURATION - timeLeft;
      const newSize = Math.max(60, 140 - elapsed * 1.3);
      setLogoSize(newSize);
    }
  }, [timeLeft, gameState]);

  const handleLogoClick = (e) => {
    e.stopPropagation();
    if (gameState !== 'playing') return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Add click effect
    const newEffect = {
      id: Date.now(),
      x: clickX,
      y: clickY,
      points: 10 + Math.floor((140 - logoSize) / 5),
    };
    setClickEffects((prev) => [...prev, newEffect]);
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((eff) => eff.id !== newEffect.id));
    }, 800);

    // Update score
    const points = 10 + Math.floor((140 - logoSize) / 5);
    scoreRef.current += points;
    setScore(scoreRef.current);

    // Move logo
    setLogoPos(getRandomPosition());
    setShake(true);
    setTimeout(() => setShake(false), 200);
  };

  const handleMissClick = () => {
    if (gameState !== 'playing') return;
    // Small penalty for missing
    scoreRef.current = Math.max(0, scoreRef.current - 2);
    setScore(scoreRef.current);
  };

  // Progress bar color
  const getTimerColor = () => {
    if (timeLeft > 30) return '#00e5ff';
    if (timeLeft > 10) return '#ffca28';
    return '#ff5252';
  };

  return (
    <div className="rudra-game-container">
      {/* Animated background particles */}
      <div className="bg-particles">
        {[...Array(20)].map((_, i) => (
          <span key={i} className="particle" style={{ 
            left: `${Math.random() * 100}%`, 
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${8 + Math.random() * 10}s`
          }} />
        ))}
      </div>

      {/* START SCREEN */}
      {gameState === 'start' && (
        <div className="screen start-screen">
          <div className="logo-wrapper pulse">
            <img 
              src="/rudra-logo.png" 
              alt="RUDRA Logo" 
              className="main-logo"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwQkNENCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlJVRFJBPC90ZXh0Pjwvc3ZnPg==';
              }}
            />
          </div>
          <h1 className="game-title">FIND RUDRA LOGO</h1>
          <p className="game-subtitle">How many times can you find the logo in 60 seconds?</p>
          
          <div className="info-cards">
            <div className="info-card">
              <span className="info-icon">⏱️</span>
              <span className="info-text">60 Seconds</span>
            </div>
            <div className="info-card">
              <span className="info-icon">🎯</span>
              <span className="info-text">Click to Score</span>
            </div>
            <div className="info-card">
              <span className="info-icon">⚡</span>
              <span className="info-text">Gets Harder</span>
            </div>
          </div>

          {highScore > 0 && (
            <div className="high-score-badge">
              🏆 High Score: <strong>{highScore}</strong>
            </div>
          )}

          <button className="start-btn" onClick={startGame}>
            <span className="btn-glow"></span>
            START GAME
          </button>
        </div>
      )}

      {/* GAME SCREEN */}
      {gameState === 'playing' && (
        <div className="game-interface">
          {/* HUD */}
          <div className="hud">
            <div className="hud-item">
              <span className="hud-label">SCORE</span>
              <span className="hud-value score-value">{score}</span>
            </div>
            
            <div className="timer-container">
              <div 
                className="timer-bar" 
                style={{ 
                  width: `${(timeLeft / GAME_DURATION) * 100}%`,
                  background: getTimerColor()
                }}
              />
              <span className="timer-text">{timeLeft}s</span>
            </div>

            <div className="hud-item">
              <span className="hud-label">BEST</span>
              <span className="hud-value">{highScore}</span>
            </div>
          </div>

          {/* Game Area */}
          <div 
            className="game-area" 
            ref={gameAreaRef}
            onClick={handleMissClick}
          >
            {/* Circuit pattern overlay */}
            <div className="circuit-overlay"></div>

            {/* The Logo */}
            <div
              className={`logo-target ${shake ? 'shake' : ''}`}
              style={{
                left: `${logoPos.x}px`,
                top: `${logoPos.y}px`,
                width: `${logoSize}px`,
                height: `${logoSize}px`,
              }}
              onClick={handleLogoClick}
            >
              <div className="logo-glow"></div>
              <img 
                src="/rudra-logo.png" 
                alt="Find Me!" 
                className="game-logo"
                draggable={false}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwQkNENCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlJVRFJBPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
            </div>

            {/* Click effects */}
            {clickEffects.map((effect) => (
              <div
                key={effect.id}
                className="click-effect"
                style={{ left: effect.x, top: effect.y }}
              >
                <span className="points-popup">+{effect.points}</span>
                <div className="ripple"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* END SCREEN */}
      {gameState === 'ended' && (
        <div className="screen end-screen">
          <div className={`result-badge ${score >= highScore && score > 0 ? 'new-record' : ''}`}>
            {score >= highScore && score > 0 ? '🎉 NEW RECORD!' : '⏰ TIME\'S UP!'}
          </div>
          
          <img 
            src="/rudra-logo.png" 
            alt="RUDRA" 
            className="end-logo"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwQkNENCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlJVRFJBPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
          
          <h2 className="final-score-label">YOUR SCORE</h2>
          <div className="final-score">{score}</div>
          
          <div className="stats-row">
            <div className="stat-box">
              <span className="stat-label">Clicks</span>
              <span className="stat-value">{Math.floor(score / 10)}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">High Score</span>
              <span className="stat-value">{Math.max(score, highScore)}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Accuracy</span>
              <span className="stat-value">
                {score > 0 ? Math.min(100, Math.round((score / (score + 10)) * 100)) : 0}%
              </span>
            </div>
          </div>

          <div className="end-buttons">
            <button className="start-btn" onClick={startGame}>
              PLAY AGAIN
            </button>
            <button className="secondary-btn" onClick={() => setGameState('start')}>
              MAIN MENU
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindRudraLogo;