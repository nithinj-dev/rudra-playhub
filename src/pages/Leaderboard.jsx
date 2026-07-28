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

  useEffect(() => {
    const q = query(
  collection(db, "leaderboard"),
  orderBy("totalScore", "desc")
);

const unsubscribe = onSnapshot(q, (snapshot) => {
  const players = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  setScores(players);
});
  }, []);

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
          <div className="leaderboard-list">

            {scores.map((item, index) => (
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
      ⭐ {item.totalScore || 0}
    </div>
  </div>
))}

          </div>
        )}

        <button
          className="back-btn"
          onClick={() => navigate("/gamehub")}
        >
          🎮 Back
        </button>

      </div>
    </div>
  );
}

export default Leaderboard;