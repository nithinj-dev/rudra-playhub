import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";

import { db } from "../firebase/firebase";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

function Leaderboard() {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
const [mode, setMode] = useState("overall");
  useEffect(() => {
    const q = query(collection(db, "leaderboard"));

const unsubscribe = onSnapshot(q, (snapshot) => {
  const players = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  setScores(players);
});
return () => unsubscribe();
  }, []);
  const sortedScores = [...scores].sort((a, b) => {
  switch (mode) {

    case "reaction":
      return (b.reactionTime || 0) - (a.reactionTime || 0);

    case "memory":
      return (b.memoryMatch || 0) - (a.memoryMatch || 0);

    case "catch":
      return (b.catchBug || 0) - (a.catchBug || 0);

    case "find":
      return (b.findLogo || 0) - (a.findLogo || 0);

    default:
      return (b.totalScore || 0) - (a.totalScore || 0);
  }
});

  const getMedal = (index) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `#${index + 1}`;
    }
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-card">

        <h1>🏆 Live Leaderboard</h1>

        {scores.length === 0 ? (
  <div className="empty-state">
    <h2>No Scores Yet!</h2>
    <p>Be the first player!</p>
  </div>
) : (
  <>
    <div className="leaderboard-tabs">

      <button
        className={mode === "overall" ? "active" : ""}
        onClick={() => setMode("overall")}
      >
        🏆 Overall
      </button>

      <button
        className={mode === "reaction" ? "active" : ""}
        onClick={() => setMode("reaction")}
      >
        ⚡ Reaction
      </button>

      <button
        className={mode === "memory" ? "active" : ""}
        onClick={() => setMode("memory")}
      >
        🧠 Memory
      </button>

      <button
        className={mode === "catch" ? "active" : ""}
        onClick={() => setMode("catch")}
      >
        🐞 Catch Bug
      </button>

      <button
        className={mode === "find" ? "active" : ""}
        onClick={() => setMode("find")}
      >
        🔍 Find Rudra
      </button>

    </div>

    <div className="leaderboard-list">

      {sortedScores.map((item, index) => (
  <div
    className={`leaderboard-item ${index === 0 ? "first" : ""}`}
    key={item.id}
  >
    <div className="rank">
      {getMedal(index)}
    </div>

    <div className="player-details">
      <h3>{item.player}</h3>

      <p className="game-name">
        ⚡ {item.reactionTime || "--"} | 🐞 {item.catchBug || "--"} | 🧠 {item.memoryMatch || "--"} | 🔍 {item.findLogo || "--"}
      </p>
    </div>

    <div className="score">
  <span className="total-score">
    ⭐ {item.totalScore || 0}
  </span>

  <span className="total-label">
    Total Score
  </span>
</div>
  </div>
))}

          </div>
          </>
        )}

        <button
          className="back-btn"
          onClick={() => navigate("/games")}
        >
          🎮 Back
        </button>

      </div>
    </div>
  );
}

export default Leaderboard;