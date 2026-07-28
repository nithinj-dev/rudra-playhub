import React, { useState, useEffect, useRef, useCallback } from 'react';
import './CatchBug.css';

/* ==================== AUDIO ENGINE ==================== */
const AudioEngine = {
  ctx: null,
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  playTone(freq, type, duration, volume = 0.1) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },
  catch() {
    this.playTone(800, 'sine', 0.1, 0.15);
    setTimeout(() => this.playTone(1200, 'sine', 0.15, 0.1), 50);
  },
  miss() {
    this.playTone(200, 'sawtooth', 0.3, 0.08);
    setTimeout(() => this.playTone(150, 'sawtooth', 0.2, 0.05), 100);
  },
  spawn() {
    this.playTone(600, 'sine', 0.05, 0.03); 
  },
  countdown() {
    this.playTone(440, 'square', 0.2, 0.1);
  },
  go() {
    this.playTone(880, 'square', 0.3, 0.15);
    setTimeout(() => this.playTone(1100, 'square', 0.4, 0.15), 100);
  },
  levelUp() {
    [400, 500, 600, 800].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.2, 0.1), i * 100);
    });
  },
  gameOver() {
    [600, 500, 400, 300].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sawtooth', 0.3, 0.1), i * 200);
    });
  }
};

/* ==================== CONSTANTS ==================== */
const BUG_EMOJIS = ['🐞', '🐛', '🦟', '🪲', '🐜', '🦗'];
const DURATION = 60;
const HIGH_SCORE_KEY = 'ctb_highscore_react';

/* ==================== MAIN COMPONENT ==================== */
export default function CatchTheBug() {
  /* ---- State ---- */
  const [gameState, setGameState] = useState('menu'); // menu | countdown | playing | gameover
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [level, setLevel] = useState(1);
  const [spawnInterval, setSpawnInterval] = useState(1500);
  const [bugs, setBugs] = useState([]);
  const [particles, setParticles] = useState([]);
  const [popups, setPopups] = useState([]);
  const [countdownVal, setCountdownVal] = useState(null);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);
  const [diffWarning, setDiffWarning] = useState(false);
  const [stats, setStats] = useState({ caught: 0, missed: 0, totalClicks: 0 });
  const [highScore, setHighScore] = useState(0);

  /* ---- Refs ---- */
  const gameAreaRef = useRef(null);
  const bugIdRef = useRef(0);
  const timersRef = useRef([]);
  const bugLifetimeRef = useRef(2000);
  const gameStateRef = useRef('menu');
  const levelRef = useRef(1);

  /* Keep refs in sync with state for callbacks */
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { levelRef.current = level; }, [level]);

  /* ---- Load high score ---- */
  useEffect(() => {
    const hs = parseInt(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
    setHighScore(hs);
  }, []);

  /* ---- Cleanup on unmount ---- */
  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  const clearAllTimers = () => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
  };

  const addTimer = (fn, delay) => {
    const t = setTimeout(fn, delay);
    timersRef.current.push(t);
    return t;
  };

  /* ---- Start / Reset ---- */
  const startGame = useCallback(() => {
    AudioEngine.init();
    clearAllTimers();
    setScore(0);
    setTimeLeft(DURATION);
    setLevel(1);
    levelRef.current = 1;
    setSpawnInterval(1500);
    setBugs([]);
    setParticles([]);
    setPopups([]);
    setStats({ caught: 0, missed: 0, totalClicks: 0 });
    setShake(false);
    setFlash(false);
    setDiffWarning(false);
    bugLifetimeRef.current = 2000;
    bugIdRef.current = 0;
    setGameState('countdown');
  }, []);

  /* ---- Countdown sequence ---- */
  useEffect(() => {
    if (gameState !== 'countdown') return;
    const seq = ['3', '2', '1', 'GO!'];
    let i = 0;

    const step = () => {
      if (i < seq.length) {
        setCountdownVal(seq[i]);
        if (i < 3) AudioEngine.countdown();
        else AudioEngine.go();
        i++;
        addTimer(step, 800);
      } else {
        setCountdownVal(null);
        setGameState('playing');
      }
    };
    step();
  }, [gameState]);

  /* ---- Game timer (every 100ms) ---- */
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const next = Math.max(0, prev - 0.1);
        const elapsed = DURATION - next;
        // Level up every 20 seconds instead of 15 (slower ramp)
        const nextLevel = Math.min(4, Math.floor(elapsed / 20) + 1);

        if (nextLevel > levelRef.current) {
          setLevel(nextLevel);
          levelRef.current = nextLevel;
          // Slower spawn interval decrease
          setSpawnInterval(Math.max(700, 1500 - (nextLevel - 1) * 200));
          bugLifetimeRef.current = Math.max(1200, 2000 - (nextLevel - 1) * 200);
          setDiffWarning(true);
          AudioEngine.levelUp();
          addTimer(() => setDiffWarning(false), 2000);
        }

        if (next <= 0) {
          clearInterval(interval);
          handleGameOver();
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState]);

  /* ---- Bug spawner ---- */
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnBug = () => {
      if (gameStateRef.current !== 'playing') return;

      const id = ++bugIdRef.current;
      const pad = 60;
      const x = Math.random() * (window.innerWidth - pad * 2) + pad;
      const y = Math.random() * (window.innerHeight - pad - 100) + 100;

      setBugs(prev => [...prev, {
        id, x, y,
        emoji: BUG_EMOJIS[Math.floor(Math.random() * BUG_EMOJIS.length)],
        caught: false
      }]);
      AudioEngine.spawn();

      // Auto-remove after lifetime
      addTimer(() => {
        setBugs(prev => prev.filter(b => b.id !== id));
      }, bugLifetimeRef.current);

      // Multi-spawn at higher levels (less frequent)
      const lvl = levelRef.current;
      if (lvl >= 3 && Math.random() > 0.75) {
        addTimer(() => spawnSingleBug(), 150);
      }
      if (lvl >= 4 && Math.random() > 0.85) {
        addTimer(() => spawnSingleBug(), 300);
      }
    };

    const spawnSingleBug = () => {
      if (gameStateRef.current !== 'playing') return;
      const id = ++bugIdRef.current;
      const pad = 60;
      const x = Math.random() * (window.innerWidth - pad * 2) + pad;
      const y = Math.random() * (window.innerHeight - pad - 100) + 100;

      setBugs(prev => [...prev, {
        id, x, y,
        emoji: BUG_EMOJIS[Math.floor(Math.random() * BUG_EMOJIS.length)],
        caught: false
      }]);

      addTimer(() => {
        setBugs(prev => prev.filter(b => b.id !== id));
      }, bugLifetimeRef.current);
    };

    const interval = setInterval(spawnBug, spawnInterval);
    return () => clearInterval(interval);
  }, [gameState, spawnInterval]);

  /* ---- Game Over ---- */
  const handleGameOver = useCallback(() => {
    setGameState('gameover');
    clearAllTimers();
    AudioEngine.gameOver();

    setScore(finalScore => {
      const hs = parseInt(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
      if (finalScore > hs) {
        localStorage.setItem(HIGH_SCORE_KEY, finalScore);
        setHighScore(finalScore);
      }
      return finalScore;
    });
  }, []);

  /* ---- Click Handlers ---- */
  const handleBugClick = useCallback((e, bug) => {
    e.stopPropagation();
    if (gameStateRef.current !== 'playing' || bug.caught) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    setBugs(prev => prev.map(b => b.id === bug.id ? { ...b, caught: true } : b));
    setScore(prev => prev + 10);
    setStats(prev => ({
      ...prev,
      caught: prev.caught + 1,
      totalClicks: prev.totalClicks + 1
    }));

    // Remove after animation
    addTimer(() => {
      setBugs(prev => prev.filter(b => b.id !== bug.id));
    }, 300);

    spawnExplosion(cx, cy, '#39ff14');
    spawnPopup(cx, cy, '+10', true);
    AudioEngine.catch();
  }, []);

  const handleBackgroundClick = useCallback((e) => {
    if (gameStateRef.current !== 'playing') return;
    if (e.target !== gameAreaRef.current) return;

    setScore(prev => Math.max(0, prev - 5));
    setStats(prev => ({
      ...prev,
      missed: prev.missed + 1,
      totalClicks: prev.totalClicks + 1
    }));

    setShake(true);
    setFlash(true);
    addTimer(() => { setShake(false); setFlash(false); }, 400);

    spawnPopup(e.clientX, e.clientY, '-5', false);
    AudioEngine.miss();
  }, []);

  /* ---- FX Helpers ---- */
  const spawnPopup = (x, y, text, positive) => {
    const id = Date.now() + Math.random();
    setPopups(prev => [...prev, { id, x, y, text, positive }]);
    addTimer(() => setPopups(prev => prev.filter(p => p.id !== id)), 1000);
  };

  const spawnExplosion = (x, y, color) => {
    const count = 12;
    const batch = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const vel = 50 + Math.random() * 100;
      batch.push({
        id: Date.now() + Math.random(),
        x, y, color,
        tx: Math.cos(angle) * vel,
        ty: Math.sin(angle) * vel
      });
    }
    setParticles(prev => [...prev, ...batch]);
    addTimer(() => setParticles(prev => prev.filter(p => !batch.find(b => b.id === p.id))), 700);
  };

  /* ---- Keyboard shortcut ---- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space') {
        if (gameStateRef.current === 'menu' || gameStateRef.current === 'gameover') {
          e.preventDefault();
          startGame();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [startGame]);

  /* ---- Derived ---- */
  const accuracy = stats.totalClicks > 0
    ? Math.round((stats.caught / stats.totalClicks) * 100)
    : 0;

  const isNewHighScore = gameState === 'gameover' && score >= highScore && score > 0;

  /* ==================== RENDER ==================== */
  return (
    <div className={`ctb-root ${shake ? 'ctb-shake' : ''}`}>
      <div className="ctb-bg-grid" />
      <div className={`ctb-wrong-flash ${flash ? 'active' : ''}`} />

      {/* ---------- MENU ---------- */}
      {gameState === 'menu' && (
        <div className="ctb-screen">
          <div className="ctb-bug-icon">🐞</div>
          <h1 className="ctb-title">Catch the Bug</h1>
          <p className="ctb-subtitle">Games Arena</p>

          <div className="ctb-rules">
            <h3>🎮 How to Play</h3>
            <div className="ctb-rule"><span>⏱️</span> You have 60 seconds</div>
            <div className="ctb-rule"><span>🐞</span> Bugs appear randomly & disappear after 2 seconds</div>
            <div className="ctb-rule"><span>📈</span> Difficulty increases every 20 seconds</div>
            <div className="ctb-rule"><span>✅</span> Catch bug: <strong style={{ color: '#39ff14' }}>+10 pts</strong></div>
            <div className="ctb-rule"><span>❌</span> Miss click: <strong style={{ color: '#ff073a' }}>-5 pts</strong></div>
          </div>

          <button className="ctb-btn" onClick={startGame}>Start Game</button>
          <p className="ctb-hint">Press SPACE to start</p>
        </div>
      )}

      {/* ---------- COUNTDOWN ---------- */}
      {countdownVal && (
        <div className="ctb-countdown">{countdownVal}</div>
      )}

      {/* ---------- HUD ---------- */}
      {(gameState === 'playing' || gameState === 'countdown') && (
        <>
          <div className="ctb-hud">
            <div className="ctb-hud-item">
              <span className="ctb-hud-label">Score</span>
              <span className="ctb-hud-value">{score}</span>
            </div>
            <div className="ctb-hud-item">
              <span className="ctb-hud-label">Time</span>
              <span className={`ctb-hud-value ${
                timeLeft <= 10 ? 'red' : timeLeft <= 30 ? 'yellow' : ''
              }`}>
                {Math.ceil(timeLeft)}
              </span>
            </div>
            <div className="ctb-hud-item">
              <span className="ctb-hud-label">Level</span>
              <span className="ctb-hud-value">{level}</span>
            </div>
          </div>
          <div
            className="ctb-timer-bar"
            style={{
              width: `${(timeLeft / DURATION) * 100}%`,
              background: timeLeft <= 10
                ? 'linear-gradient(90deg, #ff073a, #ff5500)'
                : 'linear-gradient(90deg, #39ff14, #00f3ff)',
              boxShadow: timeLeft <= 10
                ? '0 0 20px #ff073a'
                : '0 0 20px #39ff14'
            }}
          />
        </>
      )}

      {/* ---------- DIFFICULTY WARNING ---------- */}
      {diffWarning && (
        <div className="ctb-difficulty-warning">⚠️ Difficulty Increased!</div>
      )}

      {/* ---------- GAME AREA ---------- */}
      {gameState === 'playing' && (
        <div
          ref={gameAreaRef}
          className="ctb-game-area"
          onClick={handleBackgroundClick}
          onContextMenu={e => e.preventDefault()}
        >
          {bugs.map(bug => (
            <div
              key={bug.id}
              className={`ctb-bug ${bug.caught ? 'caught' : ''}`}
              style={{ left: bug.x, top: bug.y }}
              onClick={(e) => handleBugClick(e, bug)}
            >
              {bug.emoji}
            </div>
          ))}
        </div>
      )}

      {/* ---------- PARTICLES ---------- */}
      {particles.map(p => (
        <div
          key={p.id}
          className="ctb-particle"
          style={{
            left: p.x,
            top: p.y,
            background: p.color,
            boxShadow: `0 0 10px ${p.color}`,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`
          }}
        />
      ))}

      {/* ---------- POPUPS ---------- */}
      {popups.map(p => (
        <div
          key={p.id}
          className={`ctb-popup ${p.positive ? 'positive' : 'negative'}`}
          style={{ left: p.x, top: p.y }}
        >
          {p.text}
        </div>
      ))}

      {/* ---------- GAME OVER ---------- */}
      {gameState === 'gameover' && (
        <div className="ctb-screen">
          <div className="ctb-gameover-title">Game Over</div>
          <div className="ctb-bug-icon" style={{ animation: 'none', fontSize: '3rem' }}>🏆</div>

          <div className="ctb-final-box">
            <div className="ctb-final-label">Final Score</div>
            <div className="ctb-final-value">{score}</div>
            <div className="ctb-highscore">
              {isNewHighScore ? '🎉 NEW HIGH SCORE!' : `High Score: ${highScore}`}
            </div>
          </div>

          <div className="ctb-stats-grid">
            <div className="ctb-stat-card">
              <div className="ctb-stat-value">{stats.caught}</div>
              <div className="ctb-stat-label">Bugs Caught</div>
            </div>
            <div className="ctb-stat-card">
              <div className="ctb-stat-value">{stats.missed}</div>
              <div className="ctb-stat-label">Miss Clicks</div>
            </div>
            <div className="ctb-stat-card">
              <div className="ctb-stat-value">{accuracy}%</div>
              <div className="ctb-stat-label">Accuracy</div>
            </div>
          </div>

          <button className="ctb-btn" onClick={startGame}>Play Again</button>
          <p className="ctb-hint">Press SPACE to restart</p>
        </div>
      )}
    </div>
  );
}