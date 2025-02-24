export type Difficulty = "easy" | "normal" | "hard";
export type GameStatus = "before" | "playing" | "end";

export interface Product {
  name: string;
  price: string;
  category?: string;
  img: string;
  url: string;
}

export const DIFFICULTY_SETTINGS = {
  easy: {
    deviation: 20, // ±20%
    lives: 1000,
    label: "쉬움",
  },
  normal: {
    deviation: 10, // ±10%
    lives: 500,
    label: "보통",
  },
  hard: {
    deviation: 5, // ±5%
    lives: 100,
    label: "어려움",
  },
} as const;

export type DifficultyProgress = {
  easy: boolean;
  normal: boolean;
  hard: boolean;
};

export interface GameLog {
  round: number;
  product: Product;
  actualPrice: number;
  userGuess: number;
  isCorrect: boolean;
  score: number;
  livesLost: number;
}

export interface GameState {
  status: GameStatus;
  round: number;
  lives: number;
  score: number;
  difficulty: Difficulty;
  logs: GameLog[];
}
