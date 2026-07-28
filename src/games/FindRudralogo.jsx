import React, { useState, useEffect, useCallback, useRef } from 'react';
import './FindRudraGame.css';

// ============================================================================
// REAL LOGO — REPLACE THIS SECTION WITH YOUR ACTUAL RUDRA LOGO
// ============================================================================
// Option A: If you have an image file:
// const RealLogo = () => (
//   <img src="/images/rudra-logo.png" alt="RUDRA" className="rudra-logo" />
// );
//
// Option B: Paste your SVG code below instead of this placeholder:
// ============================================================================

const RealLogo = () => (
  <svg viewBox="0 0 100 100" className="rudra-logo" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rudraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FF4500" />
        <stop offset="100%" stopColor="#DC143C" />
      </linearGradient>
      <filter id="rudraGlow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {/* Hexagon frame */}
    <polygon
      points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
      fill="none"
      stroke="url(#rudraGrad)"
      strokeWidth="3"
      filter="url(#rudraGlow)"
    />
    {/* R letter */}
    <text
      x="50"
      y="62"
      textAnchor="middle"
      fill="url(#rudraGrad)"
      fontSize="36"
      fontWeight="900"
      fontFamily="Arial Black, sans-serif"
      filter="url(#rudraGlow)"
    >
      R
    </text>
  </svg>
);

// ============================================================================
// FAKE LOGOS — 15 different decoy designs
// ============================================================================
const FakeLogo = ({ variant }) => {
  const logos = [
    <svg viewBox="0 0 100 100" className="fake-logo">
      <circle cx="50" cy="50" r="38" fill="none" stroke="#00BFFF" strokeWidth="3" />
      <text x="50" y="62" textAnchor="middle" fill="#00BFFF" fontSize="32" fontWeight="bold">R</text>
    </svg>,
    <svg viewBox="0 0 100 100" className="fake-logo">
      <rect x="15" y="15" width="70" height="70" rx="12" fill="none" stroke="#32CD32" strokeWidth="3" />
      <text x="50" y="62" textAnchor="middle" fill="#32CD32" fontSize="30" fontWeight="bold">R</text>
    </svg>,
    <svg viewBox="0 0 100 100" className="fake-logo">
      <polygon points="50,12 88,82 12,82" fill="none" stroke="#9370DB" strokeWidth="3" />
      <text x="50" y="68" textAnchor="middle" fill="#9370DB" fontSize="26" fontWeight="bold">R</text>
    </svg>,
    <svg viewBox="0 0 100 100" className="fake-logo">
      <polygon points="50,10 88,50 50,90 12,50" fill="none" stroke="#FF8C00" strokeWidth="3" />
      <text x="50" y="58" textAnchor="middle" fill="#FF8C00" fontSize="28" fontWeight="bold">R</text>
    </svg>,
    <svg viewBox="0 0 100 100" className="fake-logo">
      <path d="M35,10 h30 v25 h25 v30 h-25 v25 h-30 v-25 h-25 v-30 h25 z" fill="none" stroke="#FF69B4" strokeWidth="3" />
      <text x="50" y="58" textAnchor="middle" fill="#FF69B4" fontSize="20" fontWeight="bold">R</text>
    </svg>,
    <svg viewBox="0 0 100 100" className="fake-logo">
      <polygon points="50,8 60,38 92,38 66,58 76,88 50,68 24,88 34,58 8,38 40,38" fill="none" stroke="#20B2AA" strokeWidth="3" />
      <text x="50" y="58" textAnchor="middle" fill="#20B2AA" fontSize="18" fontWeight="bold">R</text>
    </svg>,
    <svg viewBox="0 0 100 100" className="fake-logo">
      <ellipse cx="50" cy="50" rx="42" ry="28" fill="none" stroke="#FFD700" strokeWidth="3" />
      <text x="50" y="58" textAnchor="middle" fill="#FFD700" fontSize="28" fontWeight="bold">R</text>
    </svg>,
    <svg viewBox="0 0 100 100" className="fake-logo">
      <path d="M50,8 L88,22 V52 Q88,80 50,92 Q12,80 12,52 V22 Z" fill="none" stroke="#C0C0C0" strokeWidth="3" />
      <text x="50" y="58" textAnchor="middle" fill="#C0C0C0" fontSize="24" fontWeight="bold">R</text>
    </svg>,
    <svg viewBox="0 0 100 100" className="fake-logo">
      <polygon points="50,8 88,28 88,72 50,92 12,72 12,28" fill="none" stroke="#FF7F50" strokeWidth="3" />
      <text x="50" y="58" textAnchor="middle" fill="#FF7F50" fontSize="26" fontWeight="bold">R</text>
    </svg>,
    <svg viewBox="0 0 100 100" className="fake-logo">
      <circle cx="50" cy="50" r="32" fill="none" stroke="#00FF00" strokeWidth="8" />
      <circle cx="50" cy="50" r="18" fill="none" stroke="#00FF00" strokeWidth="3" />
      <text x="50" y="58" textAnchor="middle" fill="#00FF00" fontSize="18" fontWeight="bold">R</text>
    </svg>,
    <svg viewBox="0 0 100 100" className="fake-logo">
      <polygon points="50,8 78,50 65,50 65,92 35,92 35,50 22,50" fill="none" stroke="#00FFFF" strokeWidth="3" />
      <text x="50" y="58" textAnchor="middle" fill="#00FFFF" fontSize="18" fontWeight="bold">R</text>
    </svg>,
    <svg viewBox="0 0 100 100" className="fake-logo">
      <polygon points="55,8 38,42 52,42 42,92 70,48 56,48" fill="none" stroke="#FF00FF" strokeWidth="3" />
      <text x="50" y="58" textAnchor="middle" fill="#FF00FF" fontSize="16" fontWeight="bold">R</text>
    </svg>,
    <svg viewBox="0 0 100 100" className="fake-logo">
      <path d="M50,10 A40,40 0 1,1 50,90 A30,30 0 1,0 50,10" fill="none" stroke="#4B0082" strokeWidth="3" />
      <text x="50" y="58" textAnchor="middle" fill="#4B0082" fontSize="22" fontWeight="bold">R</text>
    </svg>,
    <svg viewBox="0 0 100 100" className="fake-logo">
      <path d="M50,85 C50,85 15,58 15,38 C15,22 25,12 40,12 C47,12 50,17 50,17 C50,17 53,12 60,12 C75,12 85,22 85,38 C85,58 50,85 50,85Z" fill="none" stroke="#DC143C" strokeWidth="3" />
      <text x="50" y="50" textAnchor="middle" fill="#DC143C" fontSize="16" fontWeight="bold">R</text>
    </svg>,
    <svg viewBox="0 0 100 100" className="fake-logo">
      <path d="M50,50 m0,-38 a38,38 0 1,1 0,76 a28,28 0 1,0 0,-56 a18,18 0 1,1 0,36" fill="none" stroke="#DAA520" strokeWidth="3" />
      <text x="50" y="58" textAnchor="middle" fill="#DAA520" fontSize="20" fontWeight="bold">R</text>
    </svg>,
  ];
  return logos[variant % logos.length];
};

// ============================================================================
// SOUND EFFECTS (Web Audio API — no external files needed)
// ============================================================================
const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1047, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    // Audio not supported
  }
};

// ============================================================================
// GAME CONSTANTS
// ============================================================================
const GAME_DURATION = 60;
const BASE_ROUND_DURATION = 2500;

const getDifficulty = (score) => {
  if (score < 50) return { level: 1, count: 4 };
  if (score < 100) return { level: 2, count: 6 };
  if (score < 150) return { level: 3, count: 9 };
  return { level: 4, count: Math.floor(Math.random() * 5) + 12 }; // 12-16
};

const getRoundDuration = (score) => {
  const reduction = Math.floor(score / 20) * 200;
  return Math.max(800, BASE_ROUND_DURATION - reduction);
};

const getGridClass = (count) => {
  if (count <= 4) return 'grid-4';
  if (count <= 6) return 'grid-6';
  if (count <= 9) return 'grid-9';
  return 'grid-16';
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const FindRudraGame = () => {
  const [gameState, setGameState] = useState('start'); // start | playing | end
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [combo, setCombo] = useState(0);
  const [level, setLevel] = useState(1);
  const [logos, setLogos] = useState([]);
  const [shake, setShake] = useState(false);
  const [floaters, setFloaters] = useState([]);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('findRudraHighScore') || '0', 10);
  });

  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const gameStateRef = useRef('start');
  const timerRef = useRef(null);
  const roundTimerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { comboRef.current = combo; }, [combo]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  // Generate a new round of logos
  const generateRound = useCallback(() => {
    const diff = getDifficulty(scoreRef.current);
    setLevel(diff.level);
    const count = diff.count;
    const correctIndex = Math.floor(Math.random() * count);

    const newLogos = [];
    for (let i = 0; i < count; i++) {
      const scale = 0.85 + Math.random() * 0.25; // Slight size variation
      if (i === correctIndex) {
        newLogos.push({ id: `round-${Date.now()}-${i}`, isCorrect: true, scale });
      } else {
        newLogos.push({ id: `round-${Date.now()}-${i}`, isCorrect: false, variant: i, scale });
      }
    }
    // Shuffle
    newLogos.sort(() => Math.random() - 0.5);
    setLogos(newLogos);
  }, []);

  // Schedule next round
  const scheduleRound = useCallback(() => {
    if (gameStateRef.current !== 'playing') return;
    const duration = getRoundDuration(scoreRef.current);
    roundTimerRef.current = setTimeout(() => {
      if (gameStateRef.current === 'playing') {
        generateRound();
        scheduleRound();
      }
    }, duration);
  }, [generateRound]);

  // Start game
  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setCombo(0);
    setLevel(1);
    setFloaters([]);
    setGameState('playing');
    generateRound();
    scheduleRound();
  };

  // End game
  const endGame = useCallback(() => {
    setGameState('end');
    if (timerRef.current) clearInterval(timerRef.current);
    if (roundTimerRef.current) clearTimeout(roundTimerRef.current);

    const finalScore = scoreRef.current;
    setScore(finalScore);
    const currentHigh = parseInt(localStorage.getItem('findRudraHighScore') || '0', 10);
    if (finalScore > currentHigh) {
      localStorage.setItem('findRudraHighScore', finalScore.toString());
      setHighScore(finalScore);
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, endGame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (roundTimerRef.current) clearTimeout(roundTimerRef.current);
    };
  }, []);

  // Add floating text
  const addFloater = (text, x, y, isPositive) => {
    const id = Date.now() + Math.random();
    setFloaters((prev) => [...prev, { id, text, x, y, isPositive }]);
    setTimeout(() => {
      setFloaters((prev) => prev.filter((f) => f.id !== id));
    }, 900);
  };

  // Handle logo click
  const handleLogoClick = (e, isCorrect) => {
    if (gameState !== 'playing') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    const x = rect.left - (containerRect?.left || 0) + rect.width / 2;
    const y = rect.top - (containerRect?.top || 0);

    if (isCorrect) {
      playSound('correct');
      const newCombo = comboRef.current + 1;
      comboRef.current = newCombo;
      setCombo(newCombo);

      let points = 10;
      let bonusText = '+10';

      if (newCombo % 5 === 0) {
        points += 20;
        bonusText = '+30 🔥';
      }

      setScore((prev) => prev + points);
      addFloater(bonusText, x, y, true);
      generateRound();
      if (roundTimerRef.current) clearTimeout(roundTimerRef.current);
      scheduleRound();
    } else {
      playSound('wrong');
      comboRef.current = 0;
      setCombo(0);
      setScore((prev) => Math.max(0, prev - 5));
      addFloater('-5', x, y, false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================
  return (
    <div className={`rudra-game ${shake ? 'shake' : ''}`} ref={containerRef}>
      {/* Floating score animations */}
      {floaters.map((f) => (
        <span
          key={f.id}
          className={`floater ${f.isPositive ? 'positive' : 'negative'}`}
          style={{ left: f.x, top: f.y }}
        >
          {f.text}
        </span>
      ))}

      {/* START SCREEN */}
      {gameState === 'start' && (
        <div className="screen start-screen">
          <div className="logo-showcase">
            <RealLogo />
          </div>
          <h1 className="game-title">FIND RUDRA LOGO</h1>
          <p className="game-subtitle">Spot the official logo. Avoid the fakes.</p>
          <div className="rules-box">
            <p>⏱️ <strong>60 seconds</strong> on the clock</p>
            <p>🎯 Correct click: <strong>+10 points</strong></p>
            <p>❌ Wrong click: <strong>−5 points</strong></p>
            <p>🔥 5 correct in a row: <strong>+20 bonus</strong></p>
            <p>⚡ Speed increases every 20 points</p>
          </div>
          <button className="play-btn" onClick={startGame}>
            ▶ PLAY NOW
          </button>
          {highScore > 0 && <p className="high-score-text">🏆 High Score: {highScore}</p>}
        </div>
      )}

      {/* GAME SCREEN */}
      {gameState === 'playing' && (
        <>
          <div className="hud">
            <div className="hud-item">
              <span className="hud-label">SCORE</span>
              <span className="hud-value">{score}</span>
            </div>
            <div className="hud-item">
              <span className="hud-label">LEVEL</span>
              <span className="hud-value">{level}</span>
            </div>
            <div className="hud-item">
              <span className="hud-label">TIME</span>
              <span className={`hud-value timer ${timeLeft <= 10 ? 'urgent' : ''}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="hud-item">
              <span className="hud-label">COMBO</span>
              <span className={`hud-value combo ${combo >= 5 ? 'hot' : ''}`}>
                {combo}x
              </span>
            </div>
          </div>

          <div className={`logo-grid ${getGridClass(logos.length)}`}>
            {logos.map((logo) => (
              <button
                key={logo.id}
                className="logo-card"
                style={{ transform: `scale(${logo.scale})` }}
                onClick={(e) => handleLogoClick(e, logo.isCorrect)}
                aria-label={logo.isCorrect ? 'Official RUDRA logo' : 'Fake logo'}
              >
                {logo.isCorrect ? <RealLogo /> : <FakeLogo variant={logo.variant} />}
              </button>
            ))}
          </div>
        </>
      )}

      {/* END SCREEN */}
      {gameState === 'end' && (
        <div className="screen end-screen">
          <h1 className="game-title">TIME'S UP!</h1>
          <div className="result-box">
            <div className="result-item">
              <span className="result-label">Final Score</span>
              <span className="result-value">{score}</span>
            </div>
            <div className="result-item">
              <span className="result-label">High Score</span>
              <span className="result-value high">{highScore}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Level Reached</span>
              <span className="result-value">{level}</span>
            </div>
          </div>
          <button className="play-btn" onClick={startGame}>
            ↻ PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
};

export default FindRudraGame;