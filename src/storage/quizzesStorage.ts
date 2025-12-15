import type { Quiz } from "../types/quiz";

const STORAGE_KEY = "quizzes";

const MLP_QUIZ_ID = "mlp-quiz-1";

const DEFAULT_QUIZZES: Quiz[] = [
  {
    id: MLP_QUIZ_ID,
    title: "My Little Pony Quiz",
    description: "How well do you know the world of Equestria?",
    category: "Cartoons",
    questions: [
      {
        id: "q1",
        text: "Who is the Princess of Friendship?",
        mode: "single",
        options: [
          { id: "q1o1", text: "Twilight Sparkle", isCorrect: true },
          { id: "q1o2", text: "Pinkie Pie", isCorrect: false },
          { id: "q1o3", text: "Fluttershy", isCorrect: false },
        ],
      },
      {
        id: "q2",
        text: "What is Rainbow Dash known for?",
        mode: "single",
        options: [
          { id: "q2o1", text: "Baking cupcakes", isCorrect: false },
          { id: "q2o2", text: "Flying fast", isCorrect: true },
          { id: "q2o3", text: "Making dresses", isCorrect: false },
        ],
      },
      {
        id: "q3",
        text: "Which pony loves parties the most?",
        mode: "single",
        options: [
          { id: "q3o1", text: "Applejack", isCorrect: false },
          { id: "q3o2", text: "Pinkie Pie", isCorrect: true },
          { id: "q3o3", text: "Rarity", isCorrect: false },
        ],
      },
      {
        id: "q4",
        text: "Twilight Sparkle has a dragon assistant.",
        mode: "true_false",
        options: [
          { id: "q4o1", text: "True", isCorrect: true },
          { id: "q4o2", text: "False", isCorrect: false },
        ],
      },
      {
        id: "q5",
        text: "Which of these are elements of harmony? (Select all that apply)",
        mode: "multiple",
        options: [
          { id: "q5o1", text: "Loyalty", isCorrect: true },
          { id: "q5o2", text: "Kindness", isCorrect: true },
          { id: "q5o3", text: "Greed", isCorrect: false },
          { id: "q5o4", text: "Honesty", isCorrect: true },
        ],
      },
      {
        id: "q6",
        text: "The capital of Equestria is Ponyville.",
        mode: "true_false",
        options: [
          { id: "q6o1", text: "True", isCorrect: false },
          { id: "q6o2", text: "False", isCorrect: true },
        ],
      },
      {
        id: "q7",
        text: "What is Fluttershy's special talent?",
        mode: "single",
        options: [
          { id: "q7o1", text: "Animal care", isCorrect: true },
          { id: "q7o2", text: "Weather control", isCorrect: false },
          { id: "q7o3", text: "Apple farming", isCorrect: false },
          { id: "q7o4", text: "Fashion design", isCorrect: false },
        ],
      },
      {
        id: "q8",
        text: "Select all the alicorn princesses:",
        mode: "multiple",
        options: [
          { id: "q8o1", text: "Twilight Sparkle", isCorrect: true },
          { id: "q8o2", text: "Celestia", isCorrect: true },
          { id: "q8o3", text: "Luna", isCorrect: true },
          { id: "q8o4", text: "Cadance", isCorrect: true },
          { id: "q8o5", text: "Rainbow Dash", isCorrect: false },
        ],
      },
      {
        id: "q9",
        text: "Spike is a baby dragon.",
        mode: "true_false",
        options: [
          { id: "q9o1", text: "True", isCorrect: true },
          { id: "q9o2", text: "False", isCorrect: false },
        ],
      },
      {
        id: "q10",
        text: "Which pony represents the element of Generosity?",
        mode: "single",
        options: [
          { id: "q10o1", text: "Rarity", isCorrect: true },
          { id: "q10o2", text: "Applejack", isCorrect: false },
          { id: "q10o3", text: "Pinkie Pie", isCorrect: false },
          { id: "q10o4", text: "Fluttershy", isCorrect: false },
        ],
      },
      {
        id: "q11",
        text: "The Cutie Mark Crusaders are searching for their cutie marks. (Select all that apply)",
        mode: "multiple",
        options: [
          { id: "q11o1", text: "Apple Bloom", isCorrect: true },
          { id: "q11o2", text: "Sweetie Belle", isCorrect: true },
          { id: "q11o3", text: "Scootaloo", isCorrect: true },
          { id: "q11o4", text: "Diamond Tiara", isCorrect: false },
        ],
      },
    ],
  },
];

function readAll(): Quiz[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Quiz[]) : [];
  } catch {
    console.warn("Failed to parse quizzes from localStorage.");
    return [];
  }
}

function writeAll(quizzes: Quiz[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
}

export function getAllQuizzes(): Quiz[] {
  let quizzes = readAll();

  if (quizzes.length === 0) {
    quizzes = [...DEFAULT_QUIZZES];
    writeAll(quizzes);
    return quizzes;
  }

  const hasMlp = quizzes.some((q) => q.id === MLP_QUIZ_ID);
  if (!hasMlp) {
    quizzes = [...quizzes, ...DEFAULT_QUIZZES];
    writeAll(quizzes);
  }

  return quizzes;
}

export function getQuizById(id: string): Quiz | undefined {
  return getAllQuizzes().find((q) => q.id === id);
}

export function saveQuiz(quiz: Quiz): void {
  const quizzes = getAllQuizzes();
  const index = quizzes.findIndex((q) => q.id === quiz.id);

  if (index === -1) {
    quizzes.push(quiz);
  } else {
    quizzes[index] = quiz;
  }

  writeAll(quizzes);
}

export function deleteQuiz(id: string): void {
  const quizzes = getAllQuizzes().filter((q) => q.id !== id);
  writeAll(quizzes);
}
