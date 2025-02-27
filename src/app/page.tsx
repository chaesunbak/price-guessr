"use client";

import { useState } from "react";
import type { GameState, GameLog, Product } from "@/types/game";
import { GameStart } from "@/components/game/game-start";
import { GamePlay } from "@/components/game/game-play";
import { GameEnd } from "@/components/game/game-end";
import { getScore } from "@/lib/game";
export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    status: "before",
    round: 1,
    score: 0,
    logs: [],
    isChecking: false,
    userGuess: 0,
  });

  const handleGameStart = () => {
    setGameState((prev) => ({
      ...prev,
      status: "playing",
      round: 1,
      score: 0,
    }));
  };

  // const handleGameEnd = () => {
  //   setGameState((prev) => ({
  //     ...prev,
  //     status: "end",
  //   }));
  // };

  const handleBackToBefore = () => {
    setGameState((prev) => ({
      ...prev,
      status: "before",
      difficulty: "easy",
    }));
  };

  const handleCheckAnswer = (userGuess: number, product: Product) => {
    setGameState((prev) => ({
      ...prev,
      isChecking: true,
      userGuess,
    }));

    const { isCorrect, earnedScore } = getScore(userGuess, product);

    // 최소 점수 제한 없음 (음수 허용)

    // 점수 업데이트
    setGameState((prev) => ({
      ...prev,
      score: prev.score + earnedScore,
    }));

    // 게임 로그 기록
    const gameLog: GameLog = {
      round: gameState.round,
      product,
      actualPrice: Number(product.price),
      userGuess,
      isCorrect,
      score: earnedScore,
    };

    setGameState((prev) => ({
      ...prev,
      logs: [...prev.logs, gameLog],
    }));
  };

  const handleNextRound = () => {
    setGameState((prev) => ({
      ...prev,
      isChecking: false,
    }));

    const isLastRound = gameState.round >= 10;
    if (isLastRound) {
      setGameState((prev) => ({
        ...prev,
        status: "end",
      }));
    } else {
      setGameState((prev) => ({
        ...prev,
        round: prev.round + 1,
      }));
    }
  };

  const renderGameContent = () => {
    switch (gameState.status) {
      case "before":
        return <GameStart onGameStart={handleGameStart} />;
      case "playing":
        return (
          <GamePlay
            stats={gameState}
            onCheckAnswer={handleCheckAnswer}
            onNextRound={handleNextRound}
          />
        );
      case "end":
        return (
          <GameEnd stats={gameState} onBackToBefore={handleBackToBefore} />
        );
      default:
        return null;
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center">
      {renderGameContent()}
    </main>
  );
}
