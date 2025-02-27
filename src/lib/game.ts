import type { Product } from "@/types/game";

export function getScore(userGuess: number, product: Product) {
  const difference = Math.abs(Number(product.price) - userGuess);
  const errorRate = difference / Number(product.price);

  // 정확도 계산 (0~1 사이의 값)
  const accuracy = Math.max(0, 1 - errorRate);

  // 정확도에 따른 점수 계산 (0~100점)
  const earnedScore = Math.round(accuracy * 100);

  // 정답 여부 판단 (기존 로직 유지)
  let isCorrect: boolean;
  if (difference <= 1000) {
    isCorrect = true;
  } else if (errorRate <= 0.1) {
    isCorrect = true;
  } else {
    isCorrect = false;
  }

  return {
    isCorrect,
    earnedScore,
    difference,
    errorRate,
    accuracy,
  };
}
