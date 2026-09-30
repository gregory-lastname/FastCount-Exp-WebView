export type GameMode =
  | 'addition'
  | 'subtraction'
  | 'number_bonds'
  | 'three_terms'
  | 'multiplication'
  | 'division'
  | 'all_mixed'
  | 'adaptive_training';

export type DifficultyLevel = 1 | 2 | 3 | 'differential';

export type InputMode = 'keyboard' | 'test';

export type TableRange = 'up_to_5' | 'up_to_9';

export type NumberBondTarget = 'auto' | 'all_to_10' | '10' | '9' | '8' | '7' | '6' | '5' | 'to_20';

export type SoundTheme = 'classic' | 'funny';

export type PrizeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
  grade?: string; // '1 класс' | '2 класс' | '3 класс' | 'Дошкольник'
}

export interface PrizePet {
  id: string;
  name: string;
  title: string;
  emoji: string;
  rarity: PrizeRarity;
  quote: string;
  unlockedAt?: string;
}

export interface MathProblem {
  id: string;
  expression: string; // e.g. "4 + 3", "10 = 7 + ?", "6 + 3 − 2"
  operands: number[];
  operators: string[];
  answer: number;
  options?: number[]; // 4 test options for test mode
  isRetry?: boolean;
  adaptiveTier?: number;
  // Number bond specific properties
  isNumberBond?: boolean;
  bondTarget?: number;
  bondKnownPart?: number;
  bondMissingPosition?: 'left' | 'right';
}

export interface SessionSettings {
  mode: GameMode;
  difficulty: DifficultyLevel;
  inputMode: InputMode;
  tableRange: TableRange;
  numberBondTarget: NumberBondTarget;
  soundTheme: SoundTheme;
  soundEnabled: boolean;
  timerEnabled: boolean;
  timerSeconds: 5 | 8 | 10 | 15;
  sessionLength: 10 | 20 | 30;
}

export interface SessionResult {
  id: string;
  totalProblems: number;
  correctCount: number;
  mistakesCount: number;
  accuracy: number;
  averageTimeSec: number;
  bestStreak: number;
  stars: number; // 1 to 5
  mode: GameMode;
  difficulty: DifficultyLevel;
  date: string;
  prizeAwarded?: PrizePet;
  adaptiveMaxTier?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: {
    current: number;
    max: number;
  };
}

export interface UserStats {
  totalSolved: number;
  totalCorrect: number;
  totalMistakes: number;
  totalStars: number;
  totalSessions: number;
  highestStreak: number;
  bestTimeSec?: number;
}
