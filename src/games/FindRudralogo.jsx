import React, { useState, useEffect, useCallback, useRef } from "react";
import "./RudraGame.css";

/* ───────────── CONFIGURATION ───────────── */
const TOTAL_TIME = 60;
const MAX_LEVELS = 12;

const DIFFICULTY = {
  casual:     { name: "Casual",      gridBase: 3, moveInterval: 0,    glitch: false },
  analyst:    { name: "Analyst",     gridBase: 4, moveInterval: 2000, glitch: false },
  cyber:      { name: "Cyber Expert",gridBase: 5, moveInterval: 1500, glitch: true  },
};

/* ───────────── ASSETS ───────────── */
const RudraLogo = ({ className = "" }) => (
  <svg viewBox="0 0 200 200" className={`rudra-logo-svg ${className}`}>
    <defs>
      <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Outer ring */}
    <circle cx="100" cy="100" r="96" fill="none" stroke="url(#borderGrad)" strokeWidth="10" />
    <circle cx="100" cy="100" r="91" fill="#0a0a0a" />
    {/* Decorative ring dots */}
    <circle cx="100" cy="8"  r="6" fill="#0ea5e9" />
    <circle cx="100" cy="192" r="6" fill="#0ea5e9" opacity="0.4" />
    {/* 3D Bars */}
    <g transform="translate(40,70)">
      <rect x="0"  y="40" width="22" height="40" fill="#0ea5e9" stroke="#0284c7" strokeWidth="1"/>
      <rect x="0"  y="40" width="22" height="8"  fill="#38bdf8" />
      <rect x="28" y="20" width="22" height="60" fill="#0ea5e9" stroke="#0284c7" strokeWidth="1"/>
      <rect x="28" y="20" width="22" height="8"  fill="#38bdf8" />
      <rect x="56" y="30" width="22" height="50" fill="#0ea5e9" stroke="#0284c7" strokeWidth="1"/>
      <rect x="56" y="30" width="22" height="8"  fill="#38bdf8" />
      <rect x="84" y="10" width="22" height="70" fill="#0ea5e9" stroke="#0284c7" strokeWidth="1"/>
      <rect x="84" y="10" width="22" height="8"  fill="#38bdf8" />
    </g>
    {/* Zigzag arrow */}
    <polyline points="50,115 75,95 100,105 125,75 150,55"
      fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)"/>
    <polygon points="150,55 140,58 142,68" fill="white" />
    {/* Base plate */}
    <rect x="35" y="115" width="110" height="4" fill="#334155" rx="1" />
    {/* RUDRA Text */}
    <text x="100" y="155" textAnchor="middle" fill="#38bdf8" fontSize="26" fontWeight="900"
      fontFamily="'Segoe UI', system-ui, sans-serif" letterSpacing="3" filter="url(#glow)">RUDRA</text>
    {/* Subtitle */}
    <text x="100" y="170" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="600"
      fontFamily="'Segoe UI', system-ui, sans-serif" letterSpacing="0.5">RESOURCEFUL UNIT FOR DATA RESEARCH</text>
    <text x="100" y="180" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="600"
      fontFamily="'Segoe UI', system-ui, sans-serif" letterSpacing="0.5">AND ANALYTICS</text>
    {/* Trend arrow */}
    <polyline points="130,175 160,150 190,130" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.6"/>
    <polygon points="190,130 182,134 184,142" fill="#0ea5e9" opacity="0.6" />
  </svg>
);

const FakeIcons = {
  chart: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <rect x="8" y="8" width="48" height="48" rx="4" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.6"/>
      <polyline points="12,48 24,36 36,42 52,20" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="52" cy="20" r="3" fill="#0ea5e9"/>
      <rect x="10" y="50" width="44" height="2" fill="#334155"/>
      <rect x="10" y="10" width="2" height="42" fill="#334155"/>
    </svg>
  ),
  pie: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <circle cx="32" cy="32" r="20" fill="none" stroke="#0ea5e9" strokeWidth="3" opacity="0.7"/>
      <path d="M32,32 L32,12 A20,20 0 0,1 48,20 Z" fill="#0ea5e9" opacity="0.4"/>
      <path d="M32,32 L48,20 A20,20 0 0,1 52,32 Z" fill="#38bdf8" opacity="0.3"/>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <path d="M32,8 L52,16 L52,30 Q52,48 32,56 Q12,48 12,30 L12,16 Z" fill="none" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.7"/>
      <path d="M22,30 L30,38 L42,24" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <rect x="16" y="28" width="32" height="26" rx="3" fill="none" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.7"/>
      <path d="M22,28 V20 A10,10 0 0,1 42,20 V28" fill="none" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.7"/>
      <circle cx="32" cy="41" r="3" fill="#38bdf8" opacity="0.8"/>
      <line x1="32" y1="44" x2="32" y2="48" stroke="#38bdf8" strokeWidth="2"/>
    </svg>
  ),
  bug: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <circle cx="32" cy="30" r="10" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.8"/>
      <line x1="32" y1="20" x2="32" y2="12" stroke="#ef4444" strokeWidth="2"/>
      <line x1="24" y1="24" x2="18" y2="18" stroke="#ef4444" strokeWidth="2"/>
      <line x1="40" y1="24" x2="46" y2="18" stroke="#ef4444" strokeWidth="2"/>
      <line x1="22" y1="34" x2="14" y2="32" stroke="#ef4444" strokeWidth="2"/>
      <line x1="42" y1="34" x2="50" y2="32" stroke="#ef4444" strokeWidth="2"/>
      <path d="M26,40 Q32,50 38,40" fill="none" stroke="#ef4444" strokeWidth="2"/>
    </svg>
  ),
  database: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <ellipse cx="32" cy="16" rx="18" ry="6" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.7"/>
      <path d="M14,16 V32 A18,6 0 0,0 50,32 V16" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.7"/>
      <path d="M14,32 V48 A18,6 0 0,0 50,48 V32" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.7"/>
      <line x1="14" y1="24" x2="50" y2="24" stroke="#0ea5e9" strokeWidth="1" opacity="0.4"/>
      <line x1="14" y1="40" x2="50" y2="40" stroke="#0ea5e9" strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  network: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <circle cx="20" cy="20" r="6" fill="none" stroke="#0ea5e9" strokeWidth="2"/>
      <circle cx="44" cy="20" r="6" fill="none" stroke="#0ea5e9" strokeWidth="2"/>
      <circle cx="32" cy="48" r="6" fill="none" stroke="#0ea5e9" strokeWidth="2"/>
      <line x1="24" y1="24" x2="38" y2="44" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6"/>
      <line x1="40" y1="24" x2="26" y2="44" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6"/>
      <line x1="20" y1="26" x2="20" y2="42" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6"/>
      <line x1="44" y1="26" x2="44" y2="42" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6"/>
    </svg>
  ),
  fingerprint: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <path d="M20,32 Q20,16 32,16 Q44,16 44,32" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.6"/>
      <path d="M24,32 Q24,22 32,22 Q40,22 40,32" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.6"/>
      <path d="M28,32 Q28,26 32,26 Q36,26 36,32" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.6"/>
      <line x1="32" y1="30" x2="32" y2="48" stroke="#38bdf8" strokeWidth="2" opacity="0.7"/>
    </svg>
  ),
};

const FAKE_KEYS = Object.keys(FakeIcons);

/* ───────────── MAIN COMPONENT ───────────── */
export default function RudraGame() {
  /* ---- state ---- */
  const [phase, setPhase] = useState("menu"); // menu | playing | gameover
  const [difficulty, setDifficulty] = useState("casual");
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [correctClicks, setCorrectClicks] = useState(0);
  const [breached, setBreached] = useState(0);
  const [grid, setGrid] = useState([]);
  const [realIdx, setRealIdx] = useState(0);
  const [glitchSet, setGlitchSet] = useState(new Set());
  const [statusMsg, setStatusMsg] = useState("SYSTEM STANDBY");
  const [flash, setFlash] = useState(null); // 'good' | 'bad' | null
  const [levelFlash, setLevelFlash] = useState(false);

  /* ---- refs ---- */
  const timerRef = useRef(null);
  const moveRef = useRef(null);
  const glitchRef = useRef(null);
  const comboRef = useRef(0);
  const scoreRef = useRef(0);
  const totalRef = useRef(0);
  const correctRef = useRef(0);
  const breachedRef = useRef(0);
  const levelRef = useRef(1);
  const timeRef = useRef(TOTAL_TIME);

  /* keep refs in sync */
  useEffect(() => { comboRef.current = combo; }, [combo]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { totalRef.current = totalClicks; }, [totalClicks]);
  useEffect(() => { correctRef.current = correctClicks; }, [correctClicks]);
  useEffect(() => { breachedRef.current = breached; }, [breached]);
  useEffect(() => { levelRef.current = level; }, [level]);
  useEffect(() => { timeRef.current = timeLeft; }, [timeLeft]);

  /* ---- helpers ---- */
  const gridSize = useCallback(() => {
    const base = DIFFICULTY[difficulty].gridBase;
    const add = Math.min(2, Math.floor((levelRef.current - 1) / 3));
    return base + add;
  }, [difficulty]);

  const nodeCount = useCallback(() => gridSize() * gridSize(), [gridSize]);

  const buildGrid = useCallback(() => {
    const n = nodeCount();
    const real = Math.floor(Math.random() * n);
    const arr = Array.from({ length: n }, (_, i) => ({
      id: i,
      icon: FAKE_KEYS[Math.floor(Math.random() * FAKE_KEYS.length)],
      isReal: i === real,
    }));
    setRealIdx(real);
    setGrid(arr);
    setGlitchSet(new Set());
  }, [nodeCount]);

  const startGame = (diff) => {
    setDifficulty(diff);
    setLevel(1);
    setScore(0);
    setTimeLeft(TOTAL_TIME);
    setCombo(0);
    setBestCombo(0);
    setTotalClicks(0);
    setCorrectClicks(0);
    setBreached(0);
    setStatusMsg("SYSTEM BREACH INITIATED");
    setPhase("playing");
    setFlash(null);
    // grid built in effect
  };

  const endGame = useCallback(() => {
    setPhase("gameover");
    clearInterval(timerRef.current);
    clearInterval(moveRef.current);
    clearInterval(glitchRef.current);
    setStatusMsg("CONNECTION TERMINATED");
  }, []);

  /* ---- timer ---- */
  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, endGame]);

  /* ---- build grid on level / start ---- */
  useEffect(() => {
    if (phase === "playing") buildGrid();
  }, [phase, level, buildGrid]);

  /* ---- movement (levels 4-7) ---- */
  useEffect(() => {
    if (phase !== "playing") return;
    clearInterval(moveRef.current);
    if (level >= 4 && level <= 7) {
      const interval = DIFFICULTY[difficulty].moveInterval || 2000;
      moveRef.current = setInterval(() => {
        setGrid((prev) => {
          const shuffled = [...prev].sort(() => Math.random() - 0.5);
          // find where real went
          const newReal = shuffled.findIndex((n) => n.isReal);
          setRealIdx(newReal);
          return shuffled;
        });
      }, interval);
    }
    return () => clearInterval(moveRef.current);
  }, [phase, level, difficulty]);

  /* ---- glitch protocol (level 8+) ---- */
  useEffect(() => {
    if (phase !== "playing") return;
    clearInterval(glitchRef.current);
    if (level >= 8) {
      glitchRef.current = setInterval(() => {
        const n = nodeCount();
        const count = Math.max(1, Math.floor(n * 0.25));
        const set = new Set();
        while (set.size < count) {
          const idx = Math.floor(Math.random() * n);
          if (idx !== realIdx) set.add(idx);
        }
        setGlitchSet(set);
        setTimeout(() => setGlitchSet(new Set()), 600);
      }, 1200);
    }
    return () => clearInterval(glitchRef.current);
  }, [phase, level, realIdx, nodeCount]);

  /* ---- click handler ---- */
  const handleNodeClick = (idx) => {
    if (phase !== "playing") return;
    setTotalClicks((t) => t + 1);
    totalRef.current += 1;

    if (idx === realIdx) {
      // CORRECT
      const newCombo = comboRef.current + 1;
      setCombo(newCombo);
      comboRef.current = newCombo;
      if (newCombo > bestCombo) setBestCombo(newCombo);
      const pts = 10 * newCombo;
      setScore((s) => s + pts);
      setCorrectClicks((c) => c + 1);
      setBreached((b) => b + 1);
      setStatusMsg(`NODE BREACHED — +${pts} PTS`);
      setFlash("good");
      setTimeout(() => setFlash(null), 300);

      if (levelRef.current >= MAX_LEVELS) {
        endGame();
        return;
      }
      setLevelFlash(true);
      setTimeout(() => setLevelFlash(false), 400);
      setLevel((lv) => lv + 1);
    } else {
      // WRONG
      setCombo(0);
      comboRef.current = 0;
      setScore((s) => Math.max(0, s - 5));
      setTimeLeft((t) => Math.max(0, t - 3));
      setStatusMsg("FAKE NODE DETECTED — PENALTY APPLIED");
      setFlash("bad");
      setTimeout(() => setFlash(null), 300);
    }
  };

  /* ---- accuracy ---- */
  const accuracy = totalClicks > 0 ? Math.round((correctClicks / totalClicks) * 100) : 0;

  /* ---- render helpers ---- */
  const getStatusColor = () => {
    if (timeLeft <= 10) return "status-critical";
    if (level >= 8) return "status-glitch";
    if (level >= 4) return "status-alert";
    return "status-normal";
  };

  /* ───────────── RENDER ───────────── */
  return (
    <div className={`rudra-container ${flash || ""} ${levelFlash ? "level-up" : ""}`}>
      {/* ===== MENU ===== */}
      {phase === "menu" && (
        <div className="menu-screen">
          <div className="menu-card">
            <div className="menu-logo-wrap">
              <RudraLogo />
            </div>
            <h1 className="menu-title">RUDRA PROTOCOL</h1>
            <p className="menu-subtitle">Resourceful Unit for Data Research and Analytics</p>
            <div className="menu-separator" />
            <p className="menu-desc">
              The RUDRA network has been infiltrated with fake data nodes.
              Identify and breach the authentic node before the system timer expires.
            </p>
            <div className="difficulty-grid">
              {Object.entries(DIFFICULTY).map(([key, cfg]) => (
                <button
                  key={key}
                  className={`diff-btn ${difficulty === key ? "active" : ""}`}
                  onClick={() => setDifficulty(key)}
                >
                  <span className="diff-name">{cfg.name}</span>
                  <span className="diff-meta">
                    Grid {cfg.gridBase}×{cfg.gridBase}
                    {cfg.moveInterval ? " • Moving" : " • Static"}
                    {cfg.glitch ? " • Glitch" : ""}
                  </span>
                </button>
              ))}
            </div>
            <button className="initiate-btn" onClick={() => startGame(difficulty)}>
              <span className="initiate-text">INITIATE SYSTEM BREACH</span>
              <span className="initiate-glow" />
            </button>
          </div>
        </div>
      )}

      {/* ===== PLAYING ===== */}
      {phase === "playing" && (
        <>
          {/* HUD */}
          <header className="hud">
            <div className="hud-left">
              <div className="hud-item">
                <span className="hud-label">LEVEL</span>
                <span className="hud-value">{level}</span>
              </div>
              <div className="hud-item">
                <span className="hud-label">SCORE</span>
                <span className="hud-value">{score}</span>
              </div>
              <div className="hud-item">
                <span className="hud-label">COMBO</span>
                <span className={`hud-value combo ${combo >= 3 ? "combo-hot" : ""}`}>×{combo + 1}</span>
              </div>
            </div>
            <div className="hud-center">
              <div className={`timer-ring ${timeLeft <= 10 ? "timer-critical" : ""}`}>
                <span className="timer-value">{timeLeft}</span>
                <span className="timer-label">SEC</span>
              </div>
            </div>
            <div className="hud-right">
              <div className="hud-item">
                <span className="hud-label">ACCURACY</span>
                <span className="hud-value">{accuracy}%</span>
              </div>
              <div className="hud-item">
                <span className="hud-label">BREACHED</span>
                <span className="hud-value">{breached}</span>
              </div>
              <div className="hud-item">
                <span className="hud-label">STATUS</span>
                <span className={`hud-value status ${getStatusColor()}`}>{statusMsg}</span>
              </div>
            </div>
          </header>

          {/* RADAR BAR */}
          <div className="radar-bar">
            <div className="radar-line" />
            <span className="radar-text">RADAR SCANNER ACTIVE</span>
            <div className="radar-line" />
          </div>

          {/* GRID */}
          <main
            className="game-grid"
            style={{
              gridTemplateColumns: `repeat(${gridSize()}, 1fr)`,
            }}
          >
            {grid.map((node, idx) => {
              const isGlitch = glitchSet.has(idx);
              return (
                <button
                  key={`${level}-${node.id}`}
                  className={`data-node ${node.isReal ? "real-node" : ""} ${isGlitch ? "glitch-node" : ""}`}
                  onClick={() => handleNodeClick(idx)}
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <div className="node-inner">
                    {node.isReal || isGlitch ? (
                      <RudraLogo className={isGlitch ? "glitch-logo" : ""} />
                    ) : (
                      FakeIcons[node.icon]
                    )}
                  </div>
                  <div className="node-scanline" />
                  <div className="node-corner tl" />
                  <div className="node-corner tr" />
                  <div className="node-corner bl" />
                  <div className="node-corner br" />
                </button>
              );
            })}
          </main>

          {/* LEVEL INDICATOR */}
          <div className="level-badge">
            {level >= 8 && <span className="badge glitch-badge">⚠ GLITCH PROTOCOL</span>}
            {level >= 4 && level < 8 && <span className="badge move-badge">◈ NODES UNSTABLE</span>}
            {level < 4 && <span className="badge calm-badge">◉ STATIC FIELD</span>}
          </div>
        </>
      )}

      {/* ===== GAME OVER ===== */}
      {phase === "gameover" && (
        <div className="menu-screen">
          <div className="menu-card report-card">
            <h2 className="report-title">MISSION REPORT</h2>
            <div className="report-separator" />
            <div className="report-grid">
              <div className="report-item">
                <span className="report-label">FINAL SCORE</span>
                <span className="report-value">{score}</span>
              </div>
              <div className="report-item">
                <span className="report-label">ACCURACY</span>
                <span className="report-value">{accuracy}%</span>
              </div>
              <div className="report-item">
                <span className="report-label">NODES BREACHED</span>
                <span className="report-value">{breached}</span>
              </div>
              <div className="report-item">
                <span className="report-label">HIGHEST COMBO</span>
                <span className="report-value">×{bestCombo + 1}</span>
              </div>
              <div className="report-item">
                <span className="report-label">HIGHEST LEVEL</span>
                <span className="report-value">{level}</span>
              </div>
              <div className="report-item">
                <span className="report-label">DIFFICULTY</span>
                <span className="report-value">{DIFFICULTY[difficulty].name}</span>
              </div>
            </div>
            <div className="report-grade">
              {accuracy >= 90 ? "S" : accuracy >= 75 ? "A" : accuracy >= 50 ? "B" : accuracy >= 30 ? "C" : "D"}
            </div>
            <button className="initiate-btn reboot" onClick={() => setPhase("menu")}>
              <span className="initiate-text">REBOOT SYSTEM</span>
              <span className="initiate-glow" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}