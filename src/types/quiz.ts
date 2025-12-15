export type AnswerOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  text: string;
  options: AnswerOption[];
  mode?: "true_false" | "single" | "multiple";
};

export type Quiz = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  questions: Question[];
};

export type Attempt = {
  id: string;
  quizId: string;
  quizTitle: string;
  correct: number;
  total: number;
  percent: number;
  finishedAt: number;
  durationMs?: number;
  answers?: Record<string, string[]>;
  questionCount?: number;
  estimatedSeconds?: number;
};