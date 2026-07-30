import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EnterName from "./pages/EnterName";
import GameHub from "./pages/GameHub";
import Results from "./pages/Results";
import Leaderboard from "./pages/Leaderboard";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

import ReactionTime from "./games/ReactionTime";
import MemoryMatch from "./games/MemoryMatch";
import CatchBug from "./games/CatchBug";
import FindRudralogo from "./games/FindRudralogo";
import Memories from "./pages/Memories";
import "./responsive.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/player" element={<EnterName />} />
        <Route path="/games" element={<GameHub />} />
        <Route path="/results" element={<Results />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/memories" element={<Memories />} />

        {/* Games */}
        <Route path="/games/reaction" element={<ReactionTime />} />
        <Route path="/games/memory" element={<MemoryMatch />} />
        <Route path="/games/catch-bug" element={<CatchBug />} />
        <Route path="/games/find-rudra" element={<FindRudralogo />} />


        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
