import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import BackButton from "./components/BackButton";
import "./App.css";

import HomePage from "./pages/HomePage";
import CreateQuizPage from "./pages/CreateQuizPage";
import QuizPage from "./pages/QuizPage";
import QuizResultPage from "./pages/QuizResultPage";
import ResultsPage from "./pages/ResultsPage";
import ReviewPage from "./pages/ReviewPage";
import authorGif from "./assets/creator.gif";


export default function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const logoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const el = logoRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const maxOffset = 4; // px
      const dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(maxOffset, dist) / dist;
      const ox = dx * k;
      const oy = dy * k;

      el.style.setProperty("--pupil-x", `${ox}px`);
      el.style.setProperty("--pupil-y", `${oy}px`);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <nav className="top-nav">
        <div className="nav-left">
          <div className="logo-placeholder" ref={logoRef}>
            <span className="logo-eye">Q</span>
            <span className="logo-eye">Q</span>
          </div>
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/quiz/create">Create quiz</Link>
          <Link to="/results">Results</Link>
        </div>
      </nav>

      {!isHome && (
        <div className="back-floating">
          <BackButton />
        </div>
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz/create" element={<CreateQuizPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz/result" element={<QuizResultPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/quiz/review" element={<ReviewPage />} />
      </Routes>

      <footer className="footer-bar">
      <span>@Created by Banyak Team</span>
      <img src={authorGif} alt="author" className="footer-gif" />
      </footer>

      <button
        className="theme-toggle"
        onClick={() => document.body.classList.toggle("mlp-theme")}
      >
        MLP theme
      </button>
    </>
  );
}
