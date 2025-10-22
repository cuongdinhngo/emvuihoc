export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium', 
  HARD: 'hard'
} as const

export const DIFFICULTY_LABELS = {
  [DIFFICULTY_LEVELS.EASY]: 'Dễ',
  [DIFFICULTY_LEVELS.MEDIUM]: 'Trung bình',
  [DIFFICULTY_LEVELS.HARD]: 'Khó'
} as const

export const DIFFICULTY_LABELS_EN = {
  [DIFFICULTY_LEVELS.EASY]: 'Easy',
  [DIFFICULTY_LEVELS.MEDIUM]: 'Medium',
  [DIFFICULTY_LEVELS.HARD]: 'Hard'
} as const

export const DIFFICULTY_DESCRIPTIONS = {
  [DIFFICULTY_LEVELS.EASY]: 'Câu hỏi cơ bản',
  [DIFFICULTY_LEVELS.MEDIUM]: 'Câu hỏi nâng cao',
  [DIFFICULTY_LEVELS.HARD]: 'Câu hỏi thử thách'
} as const

export const DIFFICULTY_DESCRIPTIONS_EN = {
  [DIFFICULTY_LEVELS.EASY]: 'Basic questions',
  [DIFFICULTY_LEVELS.MEDIUM]: 'Advanced questions',
  [DIFFICULTY_LEVELS.HARD]: 'Challenging questions'
} as const

export const DIFFICULTY_ICONS = {
  [DIFFICULTY_LEVELS.EASY]: '🌟',
  [DIFFICULTY_LEVELS.MEDIUM]: '⭐',
  [DIFFICULTY_LEVELS.HARD]: '💎'
} as const

export const DIFFICULTY_COLORS = {
  [DIFFICULTY_LEVELS.EASY]: 'bg-green-100 text-green-600',
  [DIFFICULTY_LEVELS.MEDIUM]: 'bg-yellow-100 text-yellow-600',
  [DIFFICULTY_LEVELS.HARD]: 'bg-red-100 text-red-600'
} as const

export const DIFFICULTY_PIECES_REQUIRED = {
  [DIFFICULTY_LEVELS.EASY]: 12,
  [DIFFICULTY_LEVELS.MEDIUM]: 15,
  [DIFFICULTY_LEVELS.HARD]: 18
} as const

export const DIFFICULTY_QUESTION_COUNTS = {
  [DIFFICULTY_LEVELS.EASY]: 3,
  [DIFFICULTY_LEVELS.MEDIUM]: 4,
  [DIFFICULTY_LEVELS.HARD]: 5
} as const

export type DifficultyLevel = typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS]
