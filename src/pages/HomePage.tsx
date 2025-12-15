import { useState } from "react";
import { Link } from "react-router-dom";
import type { Quiz } from "../types/quiz";
import { getAllQuizzes, deleteQuiz } from "../storage/quizzesStorage";
import { useToast } from "../hooks/useToast";

export default function HomePage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => getAllQuizzes());
  const { showToast } = useToast();

  function handleDelete(id: string) {
    if (!confirm("Delete this quiz?")) return;

    deleteQuiz(id);
    setQuizzes(getAllQuizzes());
    showToast("Quiz deleted", "success");
  }

  function renderEstimate(q: Quiz) {
    const seconds = (q.questions?.length ?? 0) * 15;
    if (!seconds) return null;
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    const text = `${minutes > 0 ? `${minutes}m ` : ""}${rest}s`;
    return text;
  }

  return (
    <div className="page">
      <div className="content-box">
        <div className="page-header">
          <h2>Quizzes</h2>
          <Link to="/quiz/create">+ Create new quiz</Link>
        </div>

        {quizzes.length === 0 ? (
          <p>No quizzes yet.</p>
        ) : (
          <ul className="quiz-list">
            {quizzes.map((q) => (
              <li key={q.id} className="card quiz-card">
                <div className="quiz-card-inner">
                  {renderEstimate(q) && (
                    <div className="estimate-badge">⏱ {renderEstimate(q)}</div>
                  )}
                  <div className="quiz-blur-area">
                    <div className="quiz-main">
                      <h3 className="card-title">{q.title}</h3>

                      {q.description && <p>{q.description}</p>}
                    </div>

                    <div className="quiz-side">
                      <h4>Description</h4>
                      <p>{q.description || "No description available"}</p>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleDelete(q.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="quiz-card-overlay">
                  <Link
                    to="/quiz"
                    state={{ quizId: q.id }}
                    className="quiz-card-cta"
                  >
                    Take Quiz
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
