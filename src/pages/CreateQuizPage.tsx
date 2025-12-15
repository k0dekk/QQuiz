import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Quiz, Question, AnswerOption } from "../types/quiz";
import { saveQuiz } from "../storage/quizzesStorage";
import { useToast } from "../hooks/useToast";

type QuestionMode = "true_false" | "single" | "multiple";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function CreateQuizPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  function createEmptyOptions(count: number): AnswerOption[] {
    return Array.from({ length: count }, () => ({
      id: generateId(),
      text: "",
      isCorrect: false,
    }));
  }

  function handleAddQuestion() {
    const newQuestion: Question = {
      id: generateId(),
      text: "",
      options: createEmptyOptions(3),
      mode: "single",
    };
    setQuestions((prev) => [...prev, newQuestion]);
  }

  function handleQuestionTextChange(id: string, text: string) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, text } : q))
    );
  }

  function handleQuestionModeChange(id: string, mode: QuestionMode) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;

        if (mode === "true_false") {
          const options: AnswerOption[] = [
            { id: generateId(), text: "True", isCorrect: false },
            { id: generateId(), text: "False", isCorrect: false },
          ];
          return { ...q, mode, options };
        }

        let options = q.options;
        if (options.length < 3) {
          options = [...options, ...createEmptyOptions(3 - options.length)];
        }

        return { ...q, mode, options };
      })
    );
  }

  function handleDeleteQuestion(id: string) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  function handleAddOption(questionId: string) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [
                ...q.options,
                { id: generateId(), text: "", isCorrect: false },
              ],
            }
          : q
      )
    );
  }

  function handleOptionTextChange(
    questionId: string,
    optionId: string,
    text: string
  ) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionId ? { ...o, text } : o
              ),
            }
          : q
      )
    );
  }

  function handleMarkOptionCorrect(questionId: string, optionId: string) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;

        const mode: QuestionMode = (q.mode as QuestionMode) ?? "single";

        if (mode === "multiple") {
          return {
            ...q,
            options: q.options.map((o) =>
              o.id === optionId ? { ...o, isCorrect: !o.isCorrect } : o
            ),
          };
        }
        return {
          ...q,
          options: q.options.map((o) => ({
            ...o,
            isCorrect: o.id === optionId,
          })),
        };
      })
    );
  }

  function handleDeleteOption(questionId: string, optionId: string) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((o) => o.id !== optionId),
            }
          : q
      )
    );
  }

  function validateQuiz(): string | null {
    if (!title.trim()) return "Please enter a quiz title.";
    if (questions.length === 0) return "Add at least one question.";

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.text.trim()) {
        return `Question #${i + 1} has empty text.`;
      }

      if (q.options.length < 2) {
        return `Question #${i + 1} must have at least 2 answer options.`;
      }

      const hasCorrect = q.options.some((o) => o.isCorrect);
      if (!hasCorrect) {
        return `Question #${i + 1} has no correct answer selected.`;
      }

      const hasEmptyOption = q.options.some((o) => !o.text.trim());
      if (hasEmptyOption) {
        return `Question #${i + 1} has an empty answer option.`;
      }
    }

    return null;
  }

  function handleSaveQuiz() {
    const error = validateQuiz();
    if (error) {
      showToast(error, "error");
      return;
    }

    const quiz: Quiz = {
      id: generateId(),
      title: title.trim(),
      description: description.trim() || undefined,
      category: category.trim() || undefined,
      questions,
    };

    saveQuiz(quiz);

    showToast("Quiz created successfully!", "success", 2000);

    setTitle("");
    setDescription("");
    setCategory("");
    setQuestions([]);

    setTimeout(() => {
      navigate("/");
    }, 800);
  }

  return (
    <div className="page">
      <div className="content-box">
        <h2>Create quiz</h2>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Quiz title:
          </label>
          <input
            type="text"
            value={title}
            placeholder="Enter a quiz title"
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "4px 8px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Category (optional):
          </label>
          <input
            type="text"
            value={category}
            placeholder="Enter a category"
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "100%", padding: "4px 8px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Description (optional):
          </label>
          <textarea
            value={description}
            placeholder="Enter a description"
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: "4px 8px" }}
          />
        </div>

        <hr style={{ margin: "16px 0" }} />

        <div style={{ marginBottom: "12px" }}>
          <h3>Questions</h3>

          {questions.length === 0 && (
            <p style={{ fontStyle: "italic" }}>
              No questions yet. Add the first one
            </p>
          )}

          {questions.map((q, index) => {
            const mode: QuestionMode = (q.mode as QuestionMode) ?? "single";
            const isTrueFalse = mode === "true_false";
            const isMultiple = mode === "multiple";

            return (
              <div key={q.id} className="card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <label
                      style={{ display: "block", marginBottom: "4px" }}
                    >{`Question #${index + 1}:`}</label>
                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) =>
                        handleQuestionTextChange(q.id, e.target.value)
                      }
                      style={{ width: "100%", padding: "4px 8px" }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      alignItems: "flex-end",
                    }}
                  >
                    <select
                      value={mode}
                      onChange={(e) =>
                        handleQuestionModeChange(
                          q.id,
                          e.target.value as QuestionMode
                        )
                      }
                      style={{ padding: "4px 8px" }}
                    >
                      <option value="single">Single choice</option>
                      <option value="multiple">Multiple choice</option>
                      <option value="true_false">True / False</option>
                    </select>

                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleDeleteQuestion(q.id)}
                    >
                      Delete question
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: "8px" }}>
                  <strong>Answers:</strong>

                  {q.options.length === 0 && (
                    <p style={{ fontStyle: "italic" }}>
                      Add at least two answer options.
                    </p>
                  )}

                  {q.options.map((o) => (
                    <div
                      key={o.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "4px",
                      }}
                    >
                      <input
                        type={isMultiple ? "checkbox" : "radio"}
                        name={isMultiple ? undefined : `correct-${q.id}`}
                        checked={o.isCorrect}
                        onChange={() => handleMarkOptionCorrect(q.id, o.id)}
                        title="Correct answer"
                      />
                      <input
                        type="text"
                        value={o.text}
                        onChange={(e) =>
                          handleOptionTextChange(q.id, o.id, e.target.value)
                        }
                        placeholder="Answer text"
                        style={{ flex: 1, padding: "4px 8px" }}
                        disabled={isTrueFalse}
                      />
                      {!isTrueFalse && (
                        <button
                          type="button"
                          className="btn-danger"
                          onClick={() => handleDeleteOption(q.id, o.id)}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}

                  {!isTrueFalse && (
                    <button
                      type="button"
                      onClick={() => handleAddOption(q.id)}
                      style={{ marginTop: "6px" }}
                    >
                      Add answer
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <button type="button" onClick={handleAddQuestion}>
            Add question
          </button>
        </div>

        <hr style={{ margin: "16px 0" }} />

        <button type="button" onClick={handleSaveQuiz}>
          Save quiz
        </button>
      </div>
    </div>
  );
}
