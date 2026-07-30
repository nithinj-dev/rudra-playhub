import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigationRef = useRef(null);

    useEffect(() => {
        const closeMenu = (event) => {
            if (event.key === "Escape") {
                setMenuOpen(false);
                return;
            }

            if (
                menuOpen &&
                navigationRef.current &&
                !navigationRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("keydown", closeMenu);
        document.addEventListener("pointerdown", closeMenu);

        return () => {
            document.removeEventListener("keydown", closeMenu);
            document.removeEventListener("pointerdown", closeMenu);
        };
    }, [menuOpen]);

    return (
        <div className="home">

            <div className="background-grid"></div>

            <nav
                ref={navigationRef}
                className="navbar"
                aria-label="Main navigation"
            >
                <div className="logo">
                    🎮 RUDRA GAME ARENA
                </div>

                <button
                    className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
                    type="button"
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={menuOpen}
                    aria-controls="primary-navigation"
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <div
                    className={`nav-links ${menuOpen ? "is-open" : ""}`}
                    id="primary-navigation"
                >
    <Link to="/games">
        Games
    </Link>

    <Link to="/leaderboard">
        Leaderboard
    </Link>

    <Link to="/memories">
        📸 Memories
    </Link>

    <Link to="/about">
        About
    </Link>
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

                <div className="hero-buttons">

    <button
        className="start-btn"
        onClick={() => navigate("/player")}
    >
        🎮 Start Playing →
    </button>

    <button
        className="memory-btn"
        onClick={() => navigate("/memories")}
    >
        📸 Capture a Moment
    </button>

</div>

            </section>

        </div>
    );
}

export default Home;
