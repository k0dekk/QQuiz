import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import type { Attempt, Question } from "../types/quiz";
import { getQuizById } from "../storage/quizzesStorage";
import { getAttemptById } from "../storage/attemptsStorage";

type LocationState = {
  attempt?: Attempt;
  attemptId?: string;
};

export default function ReviewPage() {
  const location = useLocation() as { state?: LocationState };
  const initialAttempt = location.state?.attempt;
  const attemptId = location.state?.attemptId;

  const [attempt, setAttempt] = useState<Attempt | null>(initialAttempt ?? null);
  const [loading, setLoading] = useState(!initialAttempt);

  useEffect(() => {
    if (attempt || !attemptId) return;
    const found = getAttemptById(attemptId) ?? null;
    setAttempt(found);
    setLoading(false);
  }, [attempt, attemptId]);

  if (!attempt && loading) {
    return (
      <div className="page">
        <div className="content-box">
          <h2>Review</h2>
          <p>Loading attempt...</p>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return <Navigate to="/results" replace />;
  }

  const quiz = getQuizById(attempt.quizId);
  if (!quiz) {
    return (
      <div className="page">
        <div className="content-box">
          <h2>Review</h2>
          <p>Quiz no longer exists.</p>
        </div>
      </div>
    );
  }

  const answers = attempt.answers ?? {};

  function optionClass(question: Question, optionId: string) {
    const selected = answers[question.id] ?? [];
    const isSelected = selected.includes(optionId);
    const option = question.options.find((o) => o.id === optionId);
    const isCorrect = option?.isCorrect;

    let cls = "option-label";
    if (isCorrect) cls += " option-correct";
    if (isSelected && !isCorrect) cls += " option-incorrect";
    if (!isCorrect && !isSelected) {
      cls += " option-muted";
    }
    return cls;
  }

  return (
    <div className="page">
      <div className="content-box question-island">
        <div className="question-header">
          <span className="question-progress">Review</span>
          <span className="question-quiz-title">{quiz.title}</span>
          {attempt.percent !== undefined && (
            <span className="quiz-timer">Score: {attempt.percent}%</span>
          )}
        </div>

        {quiz.questions.map((q, idx) => (
          <div key={q.id} style={{ marginBottom: "18px" }}>
            <div className="question-header">
              <span className="question-progress">
                Question {idx + 1} of {quiz.questions.length}
              </span>
              <span className="question-quiz-title">{q.text}</span>
            </div>

            <div className="question-options">
              {q.options.map((o) => (
                <label key={o.id} className={optionClass(q, o.id)}>
                  <input
                    type={
                      (q.mode as "multiple" | "single" | "true_false") ===
                      "multiple"
                        ? "checkbox"
                        : "radio"
                    }
                    checked={(answers[q.id] ?? []).includes(o.id)}
                    readOnly
                  />
                  <span>{o.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

