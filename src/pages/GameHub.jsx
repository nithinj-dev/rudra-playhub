import "./GameHub.css";
import { useNavigate } from "react-router-dom";

function GameHub() {
    const navigate = useNavigate();

    const playerName = localStorage.getItem("playerName") || "Player";

    const games = [
        {
            title: "Memory Match",
            emoji: "🧠",
            description: "Match all pairs before time runs out.",
            difficulty: "Medium",
            route: "/games/memory",
            color: "#00F5FF",
        },
        {
            title: "Reaction Time",
            emoji: "⚡",
            description: "Test your reflexes and reaction speed.",
            difficulty: "Easy",
            route: "/games/reaction",
            color: "#FFD93D",
        },
        {
            title: "Catch the Bug",
            emoji: "🐞",
            description: "Catch as many bugs as possible in 60 seconds.",
            difficulty: "Hard",
            route: "/games/catch-bug",
            color: "#66FF4D",
        },
        {
            title: "Find Rudra Logo",
            emoji: "🔍",
            description: "Spot the hidden Rudra logo before time runs out.",
            difficulty: "Medium",
            route: "/games/find-rudra",
            color: "#FF4DA6",
        },
    ];

    return (
        <div className="gamehub">
            <div className="background-grid"></div>

            <div className="header">
                <p className="arena-text">GAME ARENA</p>

                <h1>
                    Welcome <span>{playerName}</span> 👋
                </h1>

                <p className="subtitle">
                    Select a game and climb the leaderboard.
                </p>
            </div>

            <div className="game-grid">
                {games.map((game) => (
                    <div
                        key={game.title}
                        className="game-card"
                        style={{ "--accent": game.color }}
                    >
                        <div className="card-glow"></div>

                        <span className="badge">
                            {game.difficulty}
                        </span>

                        <div className="emoji">
                            {game.emoji}
                        </div>

                        <h2>{game.title}</h2>

                        <p>{game.description}</p>

                        <button
                            className="play-btn"
                            onClick={() => navigate(game.route)}
                        >
                            PLAY NOW →
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GameHub;