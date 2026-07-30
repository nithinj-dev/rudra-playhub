import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="home">

            <div className="background-grid"></div>

            <nav className="navbar">
                <div className="logo">
                    🎮 RUDRA GAME ARENA
                </div>

                <div className="nav-links">
    <button onClick={() => navigate("/games")}>
        Games
    </button>

    <button onClick={() => navigate("/leaderboard")}>
        Leaderboard
    </button>

    <button onClick={() => navigate("/memories")}>
        📸 Memories
    </button>

    <button onClick={() => navigate("/about")}>
        About
    </button>
</div>
            </nav>

            <section className="hero">

                <div className="hero-glow"></div>

                <p className="event">SANTHE 2026</p>

                <h1>
                    Interactive <span>Game Hub</span>
                </h1>

                <p className="subtitle">
                    Challenge yourself. Beat the leaderboard.
                    Win exciting rewards.
                </p>

                <button
                    className="start-btn"
                    onClick={() => navigate("/player")}
                >
                    Start Playing →
                </button>

            </section>

        </div>
    );
}

export default Home;
