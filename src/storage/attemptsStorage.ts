import type { Attempt } from "../types/quiz";

const STORAGE_KEY = "quiz_attempts";

function readAll(): Attempt[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Attempt[]) : [];
  } catch {
    console.warn("Failed to parse quiz_attempts from localStorage.");
    return [];
  }
}

function writeAll(attempts: Attempt[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
}

export function saveAttempt(attempt: Attempt): void {
  const all = readAll();
  all.push(attempt);
  writeAll(all);
}

export function getAttemptById(id: string): Attempt | undefined {
  return readAll().find((a) => a.id === id);
}

export function getAllAttempts(): Attempt[] {
  return readAll();
}

export function clearAttempts(): void {
  localStorage.removeItem(STORAGE_KEY);
}
