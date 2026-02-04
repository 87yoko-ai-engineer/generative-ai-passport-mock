
export enum TabType {
  SYLLABUS = 'syllabus',
  CHAPTER = 'chapter',
  MOCK = 'mock',
  REVIEW = 'review'
}

export enum Difficulty {
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard',
  EXAM = 'exam'
}

export interface Question {
  id: string;
  chapter: number;
  topicTag: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  difficulty?: Difficulty;
}

export interface ExamResult {
  date: string;
  score: number;
  total: number;
  chapterScores: Record<number, { correct: number; total: number }>;
  questions: (Question & { selectedIndex: number | null })[];
  isPassed?: boolean;
  difficulty: Difficulty;
}

export interface AppState {
  questions: Question[];
  wrongQuestionIds: string[];
  examHistory: ExamResult[];
  difficulty: Difficulty;
}
