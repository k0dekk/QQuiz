import { useState } from "react";
import { Link } from "react-router-dom";
import type { Attempt } from "../types/quiz";
import { getAllAttempts, clearAttempts } from "../storage/attemptsStorage";

export default function ResultsPage() {
  const [attempts, setAttempts] = useState<Attempt[]>(() => getAllAttempts());

  const hasAttempts = attempts.length > 0;

  const sortedAttempts = [...attempts].sort(
    (a, b) => b.finishedAt - a.finishedAt
  );

  function formatDuration(ms?: number) {
    if (ms === undefined) return "—";
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function formatEstimate(seconds?: number) {
    if (!seconds) return "—";
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return `${minutes > 0 ? `${minutes}m ` : ""}${rest}s`;
  }

  function handleClear() {
    if (!hasAttempts) return;
    if (!confirm("Clear results history?")) return;

    clearAttempts();
    setAttempts([]);
  }

  return (
    <div className="page">
      <div className="content-box">
        <h2>Results history</h2>

        <div style={{ marginBottom: "12px" }}>
          <Link to="/quiz" style={{ marginRight: "12px" }}>
            Take a quiz
          </Link>
          <button type="button" onClick={handleClear} disabled={!hasAttempts}>
            Clear history
          </button>
        </div>

        {!hasAttempts ? (
          <p>Take at least one quiz</p>
        ) : (
          <table className="results-table">
            <thead>
              <tr>
                <th>Test</th>
                <th>Result</th>
                <th>%</th>
                <th>Time</th>
                <th>Est.</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedAttempts.map((a) => {
                const date = new Date(a.finishedAt);
                return (
                  <tr key={a.id}>
                    <td>
                      <Link
                        to="/quiz/review"
                        state={{ attempt: a, attemptId: a.id }}
                      >
                        {a.quizTitle}
                      </Link>
                    </td>
                    <td>
                      {a.correct}/{a.total}
                    </td>
                    <td>{a.percent}%</td>
                    <td>{formatDuration(a.durationMs)}</td>
                    <td>{formatEstimate(a.estimatedSeconds)}</td>
                    <td>
                      {date.toLocaleString(undefined, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
