export type GameStatus = "before" | "playing" | "end";

export interface Product {
  name: string;
  price: string;
  category?: string;
  img: string;
  url: string;
}

export interface GameLog {
  round: number;
  product: Product;
  actualPrice: number;
  userGuess: number;
  isCorrect: boolean;
  score: number;
}

export interface GameState {
  status: GameStatus;
  round: number;
  score: number;
  logs: GameLog[];
  isChecking: boolean;
  userGuess: number;
}
