# 🧪 QQuiz

A web app for creating and taking quizzes. Create your own tests, pass them, review results, and learn from mistakes.

Built with **React + TypeScript**, featuring a clean component structure, themed UI, and local persistence via **localStorage**.

---

## 🚀 Features

### 🏠 Home & Navigation
- Hero-style entry point and clear navigation between pages
- **BackButton** component for easy return navigation
- Smooth UI flow for creating and taking quizzes

### 🧠 Quiz Creation
- Create quizzes in three formats:
  - **Single Choice**
  - **Multiple Choice**
  - **True / False**
- User-friendly form for adding questions and answers

### ✅ Taking Quizzes & Results
- Take quizzes and instantly get your score
- View completed quizzes and detailed results
- **Mistakes review**: see your incorrect answers and correct ones

### 💾 Local Persistence
- All quizzes and results are saved in **localStorage**
- Data stays on the device even after refresh / reopen

### 🎨 UI & UX
- **Toast notifications** via `ToastContext`
- Theme switching via a CSS button toggle: **MLP Theme**
- Seed test included: **My Little Pony (MLP) demo quiz**

---

## 🛠️ Tech Stack
- **React**
- **TypeScript**
- **Vite** (or CRA — replace if needed)
- **localStorage** for persistence
- Custom UI components (ToastContext, BackButton, Theme Switch)

---

## 📦 Getting Started

### 1) Install dependencies
```bash
npm install
