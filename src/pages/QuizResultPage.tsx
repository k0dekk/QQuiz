import { useLocation, Link } from "react-router-dom";
import type { Attempt } from "../types/quiz";
import { useMemo } from "react";
type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

type LocationState = {
  attempt?: Attempt;
};

export default function QuizResultPage() {
  const location = useLocation() as { state?: LocationState };
  const attempt = location.state?.attempt;
  const clampedPercent = useMemo(
    () => Math.max(0, Math.min(100, attempt?.percent ?? 0)),
    [attempt?.percent]
  );
  const ringStyle = useMemo<CSSVars>(
  () => ({ "--percent": clampedPercent }),
  [clampedPercent]
    );


  // If the user opened this page without an attempt object
  if (!attempt) {
    return (
      <div className="page">
        <div className="content-box">
          <h2>Quiz result</h2>
          <p>No result data available. Please try taking the quiz again.</p>
          <Link to="/quiz">Back to quizzes</Link>
        </div>
      </div>
    );
  }

  const date = new Date(attempt.finishedAt);

  return (
    <div className="page">
      <div className="content-box">
        <h2>Quiz result</h2>
        <h3>{attempt.quizTitle}</h3>

          <div className="result-ring" style={ringStyle}>
            <div className="result-ring-inner">
              <div className="result-ring-value">
                <span>{clampedPercent}</span>
                <small>%</small>
              </div>
            </div>
          </div>

        <p>
          Correct answers: <strong>{attempt.correct}</strong> out of{" "}
          <strong>{attempt.total}</strong>
        </p>

        <p>
          Completed on:{" "}
          {date.toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>

        <div className="result-buttons">
          <Link to="/quiz" state={{ quizId: attempt.quizId }} className="btn-left">
            Take again
          </Link>

          <Link to="/" className="btn-right">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
