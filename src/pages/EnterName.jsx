import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EnterName.css";

function EnterName() {
    const [playerName, setPlayerName] = useState("");
    const navigate = useNavigate();

    const handleContinue = () => {
        if (playerName.trim().length < 3) {
            alert("Please enter at least 3 characters.");
            return;
        }

        localStorage.setItem("playerName", playerName);

        navigate("/games");
    };

    return (
        <div className="enter-page">

            <div className="background-grid"></div>

            <div className="enter-card">

                <h1>Enter Your Name</h1>

                <p>
                    Your journey begins here.
                </p>

                <input
                    type="text"
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                />

                <button onClick={handleContinue}>
                    Continue →
                </button>

            </div>

        </div>
    );
}

export default EnterName;