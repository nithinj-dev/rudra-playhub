import React, { useState, useEffect, useCallback, useRef } from "react";
import "./FindRudralogo.css";
import { useNavigate } from "react-router-dom";
const MAX_LEVELS = 20;

const DIFFICULTY = {
  casual:  { name: "Casual",      gridBase: 3, scoreMult: 1,   time: 60, moveInterval: 0,    glitch: false },
  analyst: { name: "Analyst",     gridBase: 4, scoreMult: 1.5, time: 30, moveInterval: 2000, glitch: false },
  cyber:   { name: "Cyber Expert",gridBase: 5, scoreMult: 2.5, time: 15, moveInterval: 1500, glitch: true  },
};

const RudraLogo = ({ className = "" }) => (
  <svg viewBox="0 0 200 200" className={`rudra-logo-svg ${className}`}>
    <defs>
      <linearGradient id="rudraBorder" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="50%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#0ea5e9" />
      </linearGradient>
      <filter id="rudraGlow">
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <circle cx="100" cy="100" r="96" fill="none" stroke="url(#rudraBorder)" strokeWidth="10" />
    <circle cx="100" cy="100" r="91" fill="#0a0a0a" />
    <circle cx="100" cy="6"   r="7" fill="#0ea5e9" />
    <circle cx="100" cy="194" r="7" fill="#0ea5e9" opacity="0.3" />
    <circle cx="6"   cy="100" r="5" fill="#0ea5e9" opacity="0.5" />
    <circle cx="194" cy="100" r="5" fill="#0ea5e9" opacity="0.5" />
    <g transform="translate(42,68)">
      <polygon points="0,30 58,0 116,30 58,60" fill="#1e293b" stroke="#334155" strokeWidth="0.5" opacity="0.6"/>
      <polygon points="0,30 58,60 58,68 0,38" fill="#0f172a" opacity="0.8"/>
      <polygon points="58,60 116,30 116,38 58,68" fill="#1e293b" opacity="0.9"/>
      <rect x="6"  y="42" width="18" height="28" fill="#0ea5e9" stroke="#0284c7" strokeWidth="0.8"/>
      <rect x="6"  y="42" width="18" height="7"  fill="#38bdf8" />
      <rect x="30" y="22" width="18" height="48" fill="#0ea5e9" stroke="#0284c7" strokeWidth="0.8"/>
      <rect x="30" y="22" width="18" height="7"  fill="#38bdf8" />
      <rect x="54" y="32" width="18" height="38" fill="#0ea5e9" stroke="#0284c7" strokeWidth="0.8"/>
      <rect x="54" y="32" width="18" height="7"  fill="#38bdf8" />
      <rect x="78" y="12" width="18" height="58" fill="#0ea5e9" stroke="#0284c7" strokeWidth="0.8"/>
      <rect x="78" y="12" width="18" height="7"  fill="#38bdf8" />
    </g>
    <polyline points="52,118 78,98 102,108 128,78 152,58"
      fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#rudraGlow)"/>
    <polygon points="152,58 142,62 144,72" fill="white" />
    <text x="100" y="158" textAnchor="middle" fill="#38bdf8" fontSize="28" fontWeight="900"
      fontFamily="'Segoe UI', system-ui, sans-serif" letterSpacing="4" filter="url(#rudraGlow)">RUDRA</text>
    <text x="100" y="172" textAnchor="middle" fill="#64748b" fontSize="6.5" fontWeight="600"
      fontFamily="'Segoe UI', system-ui, sans-serif" letterSpacing="0.8">RESOURCEFUL UNIT FOR DATA RESEARCH</text>
    <text x="100" y="180" textAnchor="middle" fill="#64748b" fontSize="6.5" fontWeight="600"
      fontFamily="'Segoe UI', system-ui, sans-serif" letterSpacing="0.8">AND ANALYTICS</text>
    <polyline points="132,178 158,158 188,138" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.5"/>
    <polygon points="188,138 180,142 182,150" fill="#0ea5e9" opacity="0.5" />
  </svg>
);

const FakeIcons = {
  systemAlert: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <rect x="10" y="8" width="44" height="48" rx="3" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.7"/>
      <rect x="14" y="12" width="36" height="6" fill="#ef4444" opacity="0.3"/>
      <line x1="18" y1="28" x2="46" y2="28" stroke="#ef4444" strokeWidth="2" opacity="0.6"/>
      <line x1="18" y1="36" x2="38" y2="36" stroke="#ef4444" strokeWidth="2" opacity="0.4"/>
      <line x1="18" y1="44" x2="42" y2="44" stroke="#ef4444" strokeWidth="2" opacity="0.5"/>
      <circle cx="50" cy="50" r="5" fill="none" stroke="#ef4444" strokeWidth="2"/>
      <line x1="47" y1="50" x2="53" y2="50" stroke="#ef4444" strokeWidth="2"/>
    </svg>
  ),
  financialFeed: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <rect x="8" y="8" width="48" height="48" rx="3" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.5"/>
      <polyline points="12,48 20,40 28,44 36,32 44,36 52,20" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="52" cy="20" r="3" fill="#22c55e" opacity="0.8"/>
      <rect x="10" y="50" width="44" height="1.5" fill="#334155"/>
      <rect x="10" y="10" width="1.5" height="42" fill="#334155"/>
    </svg>
  ),
  bandwidthLoss: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <rect x="8" y="8" width="48" height="48" rx="3" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.5"/>
      <polyline points="12,20 20,28 28,24 36,36 44,32 52,48" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="52" cy="48" r="3" fill="#f59e0b" opacity="0.8"/>
      <rect x="10" y="50" width="44" height="1.5" fill="#334155"/>
      <rect x="10" y="10" width="1.5" height="42" fill="#334155"/>
    </svg>
  ),
  cpuLoad: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <rect x="12" y="12" width="40" height="40" rx="2" fill="none" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.5"/>
      <rect x="18" y="38" width="6" height="10" fill="#0ea5e9" opacity="0.6"/>
      <rect x="28" y="30" width="6" height="18" fill="#0ea5e9" opacity="0.7"/>
      <rect x="38" y="22" width="6" height="26" fill="#0ea5e9" opacity="0.8"/>
      <line x1="14" y1="52" x2="50" y2="52" stroke="#334155" strokeWidth="1"/>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <path d="M32,10 L50,18 L50,32 Q50,46 32,54 Q14,46 14,32 L14,18 Z" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.6"/>
      <path d="M24,32 L30,38 L40,26" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <rect x="18" y="28" width="28" height="22" rx="3" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.6"/>
      <path d="M24,28 V20 A8,8 0 0,1 40,20 V28" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.6"/>
      <circle cx="32" cy="39" r="3" fill="#f59e0b" opacity="0.7"/>
      <line x1="32" y1="42" x2="32" y2="46" stroke="#f59e0b" strokeWidth="2"/>
    </svg>
  ),
  database: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <ellipse cx="32" cy="16" rx="16" ry="6" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.6"/>
      <path d="M16,16 V30 A16,6 0 0,0 48,30 V16" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.6"/>
      <path d="M16,30 V44 A16,6 0 0,0 48,44 V30" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.6"/>
      <line x1="16" y1="23" x2="48" y2="23" stroke="#a855f7" strokeWidth="1" opacity="0.3"/>
      <line x1="16" y1="37" x2="48" y2="37" stroke="#a855f7" strokeWidth="1" opacity="0.3"/>
    </svg>
  ),
  network: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <circle cx="20" cy="20" r="5" fill="none" stroke="#0ea5e9" strokeWidth="1.5"/>
      <circle cx="44" cy="20" r="5" fill="none" stroke="#0ea5e9" strokeWidth="1.5"/>
      <circle cx="32" cy="46" r="5" fill="none" stroke="#0ea5e9" strokeWidth="1.5"/>
      <line x1="24" y1="24" x2="38" y2="42" stroke="#38bdf8" strokeWidth="1.2" opacity="0.5"/>
      <line x1="40" y1="24" x2="26" y2="42" stroke="#38bdf8" strokeWidth="1.2" opacity="0.5"/>
      <line x1="20" y1="25" x2="20" y2="41" stroke="#38bdf8" strokeWidth="1.2" opacity="0.5"/>
      <line x1="44" y1="25" x2="44" y2="41" stroke="#38bdf8" strokeWidth="1.2" opacity="0.5"/>
    </svg>
  ),
  fingerprint: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <path d="M20,32 Q20,18 32,18 Q44,18 44,32" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.5"/>
      <path d="M24,32 Q24,24 32,24 Q40,24 40,32" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.5"/>
      <path d="M28,32 Q28,28 32,28 Q36,28 36,32" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.5"/>
      <line x1="32" y1="30" x2="32" y2="48" stroke="#38bdf8" strokeWidth="2" opacity="0.6"/>
    </svg>
  ),
  bug: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <circle cx="32" cy="30" r="9" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.7"/>
      <line x1="32" y1="21" x2="32" y2="13" stroke="#ef4444" strokeWidth="1.5"/>
      <line x1="25" y1="24" x2="19" y2="18" stroke="#ef4444" strokeWidth="1.5"/>
      <line x1="39" y1="24" x2="45" y2="18" stroke="#ef4444" strokeWidth="1.5"/>
      <line x1="23" y1="33" x2="15" y2="31" stroke="#ef4444" strokeWidth="1.5"/>
      <line x1="41" y1="33" x2="49" y2="31" stroke="#ef4444" strokeWidth="1.5"/>
      <path d="M26,40 Q32,48 38,40" fill="none" stroke="#ef4444" strokeWidth="1.5"/>
    </svg>
  ),
  pieChart: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <circle cx="32" cy="32" r="18" fill="none" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.6"/>
      <path d="M32,32 L32,14 A18,18 0 0,1 46,22 Z" fill="#0ea5e9" opacity="0.3"/>
      <path d="M32,32 L46,22 A18,18 0 0,1 50,32 Z" fill="#38bdf8" opacity="0.2"/>
    </svg>
  ),
  waveform: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <rect x="8" y="8" width="48" height="48" rx="3" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.4"/>
      <polyline points="12,32 18,20 24,44 30,24 36,40 42,18 48,36 52,28" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
    </svg>
  ),
  target: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <circle cx="32" cy="32" r="18" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.6"/>
      <circle cx="32" cy="32" r="10" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.5"/>
      <circle cx="32" cy="32" r="3" fill="#ef4444" opacity="0.7"/>
      <line x1="32" y1="8" x2="32" y2="18" stroke="#ef4444" strokeWidth="1.5" opacity="0.5"/>
      <line x1="32" y1="46" x2="32" y2="56" stroke="#ef4444" strokeWidth="1.5" opacity="0.5"/>
      <line x1="8" y1="32" x2="18" y2="32" stroke="#ef4444" strokeWidth="1.5" opacity="0.5"/>
      <line x1="46" y1="32" x2="56" y2="32" stroke="#ef4444" strokeWidth="1.5" opacity="0.5"/>
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <path d="M20,40 Q14,40 14,32 Q14,24 22,24 Q24,16 34,16 Q44,16 46,24 Q54,24 54,32 Q54,40 48,40 Z" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.6"/>
      <line x1="28" y1="44" x2="36" y2="44" stroke="#38bdf8" strokeWidth="2" opacity="0.5"/>
      <line x1="30" y1="48" x2="34" y2="48" stroke="#38bdf8" strokeWidth="2" opacity="0.4"/>
    </svg>
  ),
  code: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <rect x="10" y="10" width="44" height="44" rx="3" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.5"/>
      <polyline points="24,24 16,32 24,40" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="40,24 48,32 40,40" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="30" y1="42" x2="34" y2="22" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  wifi: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <path d="M16,28 Q32,16 48,28" fill="none" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.6"/>
      <path d="M22,36 Q32,28 42,36" fill="none" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.5"/>
      <path d="M28,44 Q32,40 36,44" fill="none" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.4"/>
      <circle cx="32" cy="50" r="3" fill="#0ea5e9" opacity="0.7"/>
    </svg>
  ),
  key: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <circle cx="24" cy="32" r="10" fill="none" stroke="#f59e0b" strokeWidth="2.5" opacity="0.7"/>
      <line x1="32" y1="32" x2="52" y2="32" stroke="#f59e0b" strokeWidth="3" opacity="0.7"/>
      <line x1="42" y1="32" x2="42" y2="26" stroke="#f59e0b" strokeWidth="2.5" opacity="0.7"/>
      <line x1="48" y1="32" x2="48" y2="26" stroke="#f59e0b" strokeWidth="2.5" opacity="0.7"/>
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <circle cx="32" cy="32" r="20" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.5"/>
      <ellipse cx="32" cy="32" rx="8" ry="20" fill="none" stroke="#0ea5e9" strokeWidth="1.2" opacity="0.4"/>
      <line x1="12" y1="32" x2="52" y2="32" stroke="#0ea5e9" strokeWidth="1.2" opacity="0.4"/>
      <path d="M16,20 Q32,28 48,20" fill="none" stroke="#0ea5e9" strokeWidth="1" opacity="0.3"/>
      <path d="M16,44 Q32,36 48,44" fill="none" stroke="#0ea5e9" strokeWidth="1" opacity="0.3"/>
    </svg>
  ),
  file: (
    <svg viewBox="0 0 64 64" className="fake-icon">
      <path d="M18,10 L38,10 L50,22 L50,54 L18,54 Z" fill="none" stroke="#94a3b8" strokeWidth="2" opacity="0.5"/>
      <polyline points="38,10 38,22 50,22" fill="none" stroke="#94a3b8" strokeWidth="2" opacity="0.5"/>
      <line x1="24" y1="32" x2="44" y2="32" stroke="#94a3b8" strokeWidth="1.5" opacity="0.4"/>
      <line x1="24" y1="40" x2="40" y2="40" stroke="#94a3b8" strokeWidth="1.5" opacity="0.4"/>
    </svg>
  ),
};

const FAKE_KEYS = Object.keys(FakeIcons);

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  const ms = Math.floor((seconds % 1) * 100).toString().padStart(2, "0");
  return `${m}:${s}.${ms}`;
};

export default function RudraGame() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("menu");
  const [difficulty, setDifficulty] = useState("casual");
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY.casual.time);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [correctClicks, setCorrectClicks] = useState(0);
  const [breached, setBreached] = useState(0);
  const [grid, setGrid] = useState([]);
  const [realIdx, setRealIdx] = useState(0);
  const [glitchSet, setGlitchSet] = useState(new Set());
  const [flash, setFlash] = useState(null);
  const [levelFlash, setLevelFlash] = useState(false);
  const [personalBest, setPersonalBest] = useState(() => {
    const saved = localStorage.getItem("rudra_best");
    return saved ? JSON.parse(saved) : { score: 0, diff: "casual" };
  });

  const timerRef = useRef(null);
  const moveRef = useRef(null);
  const glitchRef = useRef(null);
  const comboRef = useRef(0);
  const levelRef = useRef(1);
  const timeRef = useRef(DIFFICULTY.casual.time);

  useEffect(() => { comboRef.current = combo; }, [combo]);
  useEffect(() => { levelRef.current = level; }, [level]);
  useEffect(() => { timeRef.current = timeLeft; }, [timeLeft]);

  const diffConfig = DIFFICULTY[difficulty];

  const gridSize = useCallback(() => {
    const base = diffConfig.gridBase;
    const add = Math.min(2, Math.floor((levelRef.current - 1) / 3));
    return base + add;
  }, [diffConfig]);

  const nodeCount = useCallback(() => gridSize() * gridSize(), [gridSize]);

  const getMoveInterval = useCallback(() => {
    const base = diffConfig.moveInterval || 3000;
    const speedUp = Math.max(0.3, 1 - (levelRef.current - 1) * 0.08);
    return Math.max(400, base * speedUp);
  }, [diffConfig]);

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
    const cfg = DIFFICULTY[diff];
    setLevel(1);
    setScore(0);
    setTimeLeft(cfg.time);
    setCombo(0);
    setBestCombo(0);
    setTotalClicks(0);
    setCorrectClicks(0);
    setBreached(0);
    setFlash(null);
    setPhase("playing");
  };

  const endGame = useCallback(() => {
    setPhase("gameover");
    clearInterval(timerRef.current);
    clearInterval(moveRef.current);
    clearInterval(glitchRef.current);
    setPersonalBest((prev) => {
      if (score > prev.score) {
        const next = { score, diff: difficulty };
        localStorage.setItem("rudra_best", JSON.stringify(next));
        return next;
      }
      return prev;
    });
  }, [score, difficulty]);

  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0.05) {
          clearInterval(timerRef.current);
          endGame();
          return 0;
        }
        return Math.max(0, t - 0.05);
      });
    }, 50);
    return () => clearInterval(timerRef.current);
  }, [phase, endGame]);

  useEffect(() => {
    if (phase === "playing") buildGrid();
  }, [phase, level, buildGrid]);

  useEffect(() => {
    if (phase !== "playing") return;
    clearInterval(moveRef.current);
    if (level >= 4) {
      const interval = getMoveInterval();
      moveRef.current = setInterval(() => {
        setGrid((prev) => {
          const shuffled = [...prev].sort(() => Math.random() - 0.5);
          const newReal = shuffled.findIndex((n) => n.isReal);
          setRealIdx(newReal);
          return shuffled;
        });
      }, interval);
    }
    return () => clearInterval(moveRef.current);
  }, [phase, level, getMoveInterval]);

  useEffect(() => {
    if (phase !== "playing") return;
    clearInterval(glitchRef.current);
    if (level >= 8 || (diffConfig.glitch && level >= 5)) {
      const glitchSpeed = Math.max(400, 1200 - (level - 8) * 80);
      glitchRef.current = setInterval(() => {
        const n = nodeCount();
        const pct = Math.min(0.5, 0.2 + (level - 8) * 0.03);
        const count = Math.max(1, Math.floor(n * pct));
        const set = new Set();
        while (set.size < count) {
          const idx = Math.floor(Math.random() * n);
          if (idx !== realIdx) set.add(idx);
        }
        setGlitchSet(set);
        setTimeout(() => setGlitchSet(new Set()), Math.max(300, 700 - (level - 8) * 30));
      }, glitchSpeed);
    }
    return () => clearInterval(glitchRef.current);
  }, [phase, level, realIdx, nodeCount, diffConfig.glitch]);

  const handleNodeClick = (idx) => {
    if (phase !== "playing") return;
    setTotalClicks((t) => t + 1);

    if (idx === realIdx) {
      const newCombo = comboRef.current + 1;
      setCombo(newCombo);
      if (newCombo > bestCombo) setBestCombo(newCombo);
      const pts = Math.round(10 * newCombo * diffConfig.scoreMult);
      setScore((s) => s + pts);
      setCorrectClicks((c) => c + 1);
      setBreached((b) => b + 1);
      setFlash("good");
      setTimeout(() => setFlash(null), 250);

      if (levelRef.current >= MAX_LEVELS) {
        endGame();
        return;
      }
      setLevelFlash(true);
      setTimeout(() => setLevelFlash(false), 350);
      setLevel((lv) => lv + 1);
    } else {
      setCombo(0);
      comboRef.current = 0;
      setScore((s) => Math.max(0, s - 5));
      setTimeLeft((t) => Math.max(0, t - 3));
      setFlash("bad");
      setTimeout(() => setFlash(null), 250);
    }
  };

  const accuracy = totalClicks > 0 ? Math.round((correctClicks / totalClicks) * 100) : 0;
  const elapsed = diffConfig.time - timeLeft;
  const cpuLoad = Math.min(100, Math.round((elapsed / diffConfig.time) * 100));
  const threatLevel = Math.min(100, Math.round((level / MAX_LEVELS) * 100));
  const latency = Math.min(100, Math.round(5 + level * 3.5));

  return (
    <div className={`rudra-game ${flash || ""} ${levelFlash ? "level-up" : ""}`}>
      {phase === "menu" && (
        <div className="rg-menu">
          <div className="rg-top-bar">
            <span className="rg-security-badge">🔒 SECURITY CLEARANCE LEVEL 00</span>
          </div>

          <h1 className="rg-main-title">DATA NODE BREACH</h1>
          <p className="rg-sub-title">// RUDRA PROTOCOL //</p>

          <div className="rg-menu-body">
            <div className="rg-panel rg-left-panel">
              <div className="rg-panel-header">TARGET SPECIFICATION</div>
              <div className="rg-logo-box">
                <RudraLogo />
              </div>
              <div className="rg-logo-label">RUDRA EMBLEM OBJECTIVE</div>

              <div className="rg-guide">
                <div className="rg-guide-title">🎯 RECOGNITION GUIDE:</div>
                <ul>
                  <li>3D Isometric Bar Chart on diamond platform</li>
                  <li>White/Blue zigzag Trend Arrow pointing up-right</li>
                  <li>Bold blue "RUDRA" title text</li>
                  <li>Full subtitle: "RESOURCEFUL UNIT FOR DATA RESEARCH AND ANALYTICS"</li>
                </ul>
              </div>
            </div>

            <div className="rg-panel rg-right-panel">
              <div className="rg-panel-header">🛡 SELECT BREACH DIFFICULTY</div>

              <div className="rg-diff-list">
                {Object.entries(DIFFICULTY).map(([key, cfg]) => (
                  <button
                    key={key}
                    className={`rg-diff-card ${difficulty === key ? "active" : ""}`}
                    onClick={() => setDifficulty(key)}
                  >
                    <div className="rg-diff-top">
                      <span className="rg-diff-name">{cfg.name}</span>
                      <span className="rg-diff-grid">{cfg.gridBase}×{cfg.gridBase} GRID</span>
                    </div>
                    <div className="rg-diff-mid">
                      <span className="rg-diff-desc">
                        {key === "casual" && "Static grid layout with " + (cfg.gridBase*cfg.gridBase) + " nodes. Ideal for initial data research."}
                        {key === "analyst" && (cfg.gridBase*cfg.gridBase) + " data nodes. Positions swap dynamically with glowing decoy accents."}
                        {key === "cyber" && (cfg.gridBase*cfg.gridBase) + " data nodes with rapid node shifting and decoy glitch mimics."}
                      </span>
                      <div className="rg-diff-stats">
                        <span className="rg-stat-mult">{cfg.scoreMult}x SCORE</span>
                        <span className="rg-stat-time">{cfg.time}s TIMER</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="rg-personal-best">
                <span>🏆 PERSONAL BEST</span>
                <span className="rg-best-score">
                  {personalBest.score.toLocaleString()} PTS
                  <span className="rg-best-diff">({personalBest.diff.toUpperCase()})</span>
                </span>
              </div>
            </div>
          </div>

          <button className="rg-initiate-btn" onClick={() => startGame(difficulty)}>
            <span className="rg-play-icon">▶</span>
            <span>INITIATE SYSTEM BREACH</span>
          </button>
        </div>
      )}

      {phase === "playing" && (
        <div className="rg-play">
          <div className="rg-play-top">
            <div className="rg-play-title">Data Node Breach: RUDRA Protocol</div>
            <div className="rg-play-meta">
              <span className="rg-meta-badge">⚡ Remote</span>
              <span className="rg-meta-badge">💻 Desktop</span>
            </div>
          </div>

          <div className="rg-play-body">
            <div className="rg-side-panel rg-scan-panel">
              <div className="rg-side-header">SECTOR SCANNER</div>
              <div className="rg-radar">
                <div className="rg-radar-ring rg-r1" />
                <div className="rg-radar-ring rg-r2" />
                <div className="rg-radar-ring rg-r3" />
                <div className="rg-radar-sweep" />
                <div className="rg-radar-dot" style={{ top: "30%", left: "25%" }} />
                <div className="rg-radar-dot" style={{ top: "60%", left: "70%", animationDelay: "1s" }} />
                <div className="rg-radar-dot" style={{ top: "45%", left: "50%", animationDelay: "2s" }} />
              </div>

              <div className="rg-terminal">
                <div className="rg-term-line">
                  <span className="rg-term-arrow">➤</span> INITIATING_BREACH...
                </div>
                <div className="rg-term-line">
                  <span className="rg-term-arrow">➤</span> NODE_SIGNATURES: {nodeCount()}
                </div>
                <div className="rg-term-line">
                  <span className="rg-term-arrow">➤</span> NODE_STABILITY: {(100 - threatLevel * 0.6).toFixed(1)}%
                </div>
                <div className="rg-term-line rg-term-highlight">
                  <span className="rg-term-arrow">➤</span> TARGET_ACQUIRED: RUDRA_0{level}
                </div>
              </div>
            </div>

            <div className="rg-center-area">
              <div className="rg-grid-frame">
                <div className="rg-grid-labels">
                  {Array.from({ length: gridSize() }, (_, i) => (
                    <span key={i} className="rg-grid-label">NODE_{(i + 1).toString().padStart(2, "0")}</span>
                  ))}
                </div>
                <main
                  className="rg-grid"
                  style={{ gridTemplateColumns: `repeat(${gridSize()}, 1fr)` }}
                >
                  {grid.map((node, idx) => {
                    const isGlitch = glitchSet.has(idx);
                    return (
                      <button
                        key={`${level}-${node.id}-${idx}`}
                        className={`rg-node ${node.isReal ? "rg-real" : ""} ${isGlitch ? "rg-glitch" : ""}`}
                        onClick={() => handleNodeClick(idx)}
                        style={{ animationDelay: `${idx * 30}ms` }}
                      >
                        <div className="rg-node-glow" />
                        <div className="rg-node-content">
                          {node.isReal || isGlitch ? (
                            <RudraLogo className={isGlitch ? "rg-glitch-logo" : ""} />
                          ) : (
                            <>
                              {FakeIcons[node.icon]}
                              <span className="rg-node-caption">
                                {node.icon === "systemAlert" && "SYSTEM ALERT"}
                                {node.icon === "financialFeed" && "FINANCIAL FEED"}
                                {node.icon === "bandwidthLoss" && "BANDWIDTH LOSS"}
                                {node.icon === "cpuLoad" && "CPU LOAD"}
                                {node.icon === "shield" && "FIREWALL"}
                                {node.icon === "lock" && "ENCRYPTED"}
                                {node.icon === "database" && "DATABASE"}
                                {node.icon === "network" && "NETWORK"}
                                {node.icon === "fingerprint" && "BIOMETRIC"}
                                {node.icon === "bug" && "MALWARE"}
                                {node.icon === "pieChart" && "ANALYTICS"}
                                {node.icon === "waveform" && "SIGNAL"}
                                {node.icon === "target" && "THREAT"}
                                {node.icon === "cloud" && "CLOUD"}
                                {node.icon === "code" && "SOURCE"}
                                {node.icon === "wifi" && "WIRELESS"}
                                {node.icon === "key" && "ACCESS KEY"}
                                {node.icon === "globe" && "GLOBAL"}
                                {node.icon === "file" && "DOCUMENT"}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="rg-node-border" />
                      </button>
                    );
                  })}
                </main>
              </div>
            </div>

            <div className="rg-side-panel rg-perf-panel">
              <div className="rg-side-header">ANALYST PERFORMANCE</div>

              <div className="rg-perf-big">
                <div className="rg-perf-number">{accuracy.toFixed(1)}%</div>
                <div className="rg-perf-label">THREAT ACCURACY</div>
              </div>

              <div className="rg-perf-bars">
                <div className="rg-bar-row">
                  <span className="rg-bar-label">CPU_LOAD</span>
                  <div className="rg-bar-track">
                    <div className="rg-bar-fill" style={{ width: `${cpuLoad}%`, background: cpuLoad > 80 ? "#ef4444" : cpuLoad > 50 ? "#f59e0b" : "#0ea5e9" }} />
                  </div>
                  <span className="rg-bar-val">{cpuLoad >= 95 ? "CRITICAL" : cpuLoad >= 70 ? "HIGH" : "OPTIMAL"}</span>
                </div>
                <div className="rg-bar-row">
                  <span className="rg-bar-label">LATENCY</span>
                  <div className="rg-bar-track">
                    <div className="rg-bar-fill rg-bar-cyan" style={{ width: `${latency}%` }} />
                  </div>
                  <span className="rg-bar-val">{latency}ms</span>
                </div>
                <div className="rg-bar-row">
                  <span className="rg-bar-label">THREAT_LEVEL</span>
                  <div className="rg-bar-track">
                    <div className="rg-bar-fill rg-bar-red" style={{ width: `${threatLevel}%` }} />
                  </div>
                  <span className="rg-bar-val">{threatLevel >= 80 ? "EXTREME" : threatLevel >= 50 ? "ELEVATED" : "LOW"}</span>
                </div>
              </div>

              <div className="rg-perf-stats">
                <div className="rg-stat-box">
                  <span className="rg-stat-label">SCORE</span>
                  <span className="rg-stat-num">{score.toLocaleString()}</span>
                </div>
                <div className="rg-stat-box">
                  <span className="rg-stat-label">COMBO</span>
                  <span className={`rg-stat-num ${combo >= 3 ? "hot" : ""}`}>×{combo + 1}</span>
                </div>
                <div className="rg-stat-box">
                  <span className="rg-stat-label">LEVEL</span>
                  <span className="rg-stat-num">{level}</span>
                </div>
                <div className="rg-stat-box">
                  <span className="rg-stat-label">BREACHED</span>
                  <span className="rg-stat-num">{breached}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rg-play-bottom">
            <span className="rg-status-text">BREACH_STATUS: {level >= 8 ? "CRITICAL" : level >= 4 ? "ENGAGING" : "SCANNING"}</span>
            <span className={`rg-timer ${timeLeft <= 10 ? "critical" : ""}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      )}

      {phase === "gameover" && (
        <div className="rg-menu">
          <div className="rg-top-bar">
            <span className="rg-security-badge">🔒 SECURITY CLEARANCE LEVEL 00</span>
          </div>

          <h1 className="rg-main-title">MISSION REPORT</h1>
          <p className="rg-sub-title">// RUDRA PROTOCOL //</p>

          <div className="rg-report-card">
            <div className="rg-report-grid">
              <div className="rg-report-item">
                <span className="rg-r-label">FINAL SCORE</span>
                <span className="rg-r-value">{score.toLocaleString()}</span>
              </div>
              <div className="rg-report-item">
                <span className="rg-r-label">ACCURACY</span>
                <span className="rg-r-value">{accuracy}%</span>
              </div>
              <div className="rg-report-item">
                <span className="rg-r-label">NODES BREACHED</span>
                <span className="rg-r-value">{breached}</span>
              </div>
              <div className="rg-report-item">
                <span className="rg-r-label">HIGHEST COMBO</span>
                <span className="rg-r-value">×{bestCombo + 1}</span>
              </div>
              <div className="rg-report-item">
                <span className="rg-r-label">MAX LEVEL</span>
                <span className="rg-r-value">{level}</span>
              </div>
              <div className="rg-report-item">
                <span className="rg-r-label">DIFFICULTY</span>
                <span className="rg-r-value">{diffConfig.name.toUpperCase()}</span>
              </div>
            </div>

            <div className="rg-grade-wrap">
              <div className={`rg-grade ${accuracy >= 90 ? "grade-s" : accuracy >= 75 ? "grade-a" : accuracy >= 50 ? "grade-b" : accuracy >= 30 ? "grade-c" : "grade-d"}`}>
                {accuracy >= 90 ? "S" : accuracy >= 75 ? "A" : accuracy >= 50 ? "B" : accuracy >= 30 ? "C" : "D"}
              </div>
            </div>

            
            <div className="ctb-buttons">
  <button className="rg-initiate-btn reboot" onClick={() => setPhase("menu")}>
    <button
    style={{
        background: "red",
        color: "white",
        padding: "20px",
        fontSize: "20px"
    }}
>
TEST
</button>
  </button>

  <button className="rg-initiate-btn reboot" onClick={() => navigate("/games")}>
    <span className="rg-play-icon">🎮</span>
    <span>GAME HUB</span>
  </button>

  <button className="rg-initiate-btn reboot" onClick={() => navigate("/leaderboard")}>
    <span className="rg-play-icon">🏆</span>
    <span>LEADERBOARD</span>
  </button>
</div>
          </div>
        </div>
      )}
    </div>
  );
}