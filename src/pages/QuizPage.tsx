import { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import type { Quiz, Attempt, Question } from "../types/quiz";
import { getQuizById } from "../storage/quizzesStorage";
import { saveAttempt } from "../storage/attemptsStorage";
import { useToast } from "../hooks/useToast";

type AnswersState = Record<string, string[]>;
type QuestionMode = "true_false" | "single" | "multiple";

type LocationState = {
  quizId?: string;
};

export default function QuizPage() {
  const location = useLocation() as { state?: LocationState };
  const navigate = useNavigate();
  const { showToast } = useToast();

  const quizId = location.state?.quizId ?? "";
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submittedMap, setSubmittedMap] = useState<Record<string, boolean>>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [estimatedSeconds, setEstimatedSeconds] = useState<number>(0);

  useEffect(() => {
    if (!quizId) return;
    const found = getQuizById(quizId);
    setQuiz(found ?? null);
    setStartTime(Date.now());
    if (found) {
      setEstimatedSeconds(found.questions.length * 15);
    }
  }, [quizId]);

  useEffect(() => {
    if (!startTime) return;
    const id = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  if (!quizId) {
    return <Navigate to="/" replace />;
  }

  function handleAnswerChange(question: Question, optionId: string) {
    const mode: QuestionMode =
      (question.mode as QuestionMode | undefined) ?? "single";

    setAnswers((prev) => {
      const current = prev[question.id] ?? [];

      if (mode === "multiple") {
        const exists = current.includes(optionId);
        const next = exists
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [question.id]: next };
      }

      return { ...prev, [question.id]: [optionId] };
    });
  }

  function handlePrevious() {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }

  function handleFinish() {
    if (!quiz) return;

    const unanswered = quiz.questions.filter(
      (q) => !answers[q.id] || answers[q.id].length === 0
    );
    if (unanswered.length > 0) {
      showToast("Please answer all questions before finishing.", "error");
      return;
    }

    let correct = 0;
    const total = quiz.questions.length;

    function sameSet(a: string[], b: string[]): boolean {
      if (a.length !== b.length) return false;
      const setA = new Set(a);
      return b.every((id) => setA.has(id));
    }

    quiz.questions.forEach((q) => {
      const selected = answers[q.id] ?? [];
      if (selected.length === 0) return;

      const correctIds = q.options
        .filter((o) => o.isCorrect)
        .map((o) => o.id);

      if (correctIds.length === 0) return;

      if (sameSet(selected, correctIds)) {
        correct++;
      }
    });

    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    const durationMs = startTime ? Date.now() - startTime : undefined;

    const attempt: Attempt = {
      id: Date.now().toString(36),
      quizId: quiz.id,
      quizTitle: quiz.title,
      correct,
      total,
      percent,
      finishedAt: Date.now(),
      durationMs,
      answers,
      questionCount: total,
      estimatedSeconds,
    };

    saveAttempt(attempt);
    navigate("/quiz/result", { state: { attempt } });
  }

  function handlePrimaryAction() {
    if (!quiz) return;
    const currentQuestion = quiz.questions[currentIndex];
    const selected = answers[currentQuestion.id] ?? [];
    const isLast = currentIndex === quiz.questions.length - 1;
    const isSubmitted = submittedMap[currentQuestion.id];

    if (!isSubmitted) {
      if (selected.length === 0) {
        showToast("Please select at least one answer.", "error");
        return;
      }

      setSubmittedMap((prev) => ({
        ...prev,
        [currentQuestion.id]: true,
      }));

      return;
    }

    if (isLast) {
      handleFinish();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  if (!quiz) {
    return (
      <div className="page">
        <div className="content-box">
          <h2>Quiz</h2>
          <p>Quiz not found. It may have been deleted.</p>
        </div>
      </div>
    );
  }

  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentIndex];
  const mode: QuestionMode =
    (currentQuestion.mode as QuestionMode | undefined) ?? "single";
  const isMultiple = mode === "multiple";
  const selected = answers[currentQuestion.id] ?? [];
  const isSubmitted = submittedMap[currentQuestion.id] ?? false;
  const isLast = currentIndex === totalQuestions - 1;
  const timerText = new Date(elapsedMs).toISOString().substring(14, 19);

  let primaryLabel = "Submit";
  if (isSubmitted) {
    primaryLabel = isLast ? "Finish" : "Next";
  }

  return (
    <div className="page">
      <div className="content-box question-island">
        <div className="question-header">
          <span className="question-progress">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="question-quiz-title">{quiz.title}</span>
          <span className="quiz-timer">⏱ {timerText}</span>
        </div>

        <h3 className="question-text">{currentQuestion.text}</h3>

        <div className="question-options">
          {currentQuestion.options.map((o) => {
            const isSelected = selected.includes(o.id);
            const isCorrect = o.isCorrect;

            let optionClass = "option-label";

            if (isSubmitted) {
              if (isCorrect) {
                optionClass += " option-correct";
              }
              if (!isCorrect && isSelected) {
                optionClass += " option-incorrect";
              }
            } else if (isSelected) {
              optionClass += " option-selected";
            }

            return (
              <label key={o.id} className={optionClass}>
                <input
                  type={isMultiple ? "checkbox" : "radio"}
                  name={isMultiple ? undefined : currentQuestion.id}
                  value={o.id}
                  checked={
                    isMultiple ? isSelected : selected[0] === o.id
                  }
                  onChange={() =>
                    !isSubmitted && handleAnswerChange(currentQuestion, o.id)
                  }
                  disabled={isSubmitted}
                />
                <span>{o.text}</span>
              </label>
            );
          })}
        </div>

        <div className="question-nav">
          {currentIndex > 0 && (
            <button type="button" onClick={handlePrevious}>
              Previous
            </button>
          )}

          <div style={{ flex: 1 }} />

          <button type="button" onClick={handlePrimaryAction}>
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
