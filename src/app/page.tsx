"use client";

import { useState } from "react";
import type { Difficulty, GameState, GameLog, Product } from "@/types/game";
import { DIFFICULTY_SETTINGS } from "@/types/game";
import { GameStart } from "@/components/game/game-start";
import { GamePlay } from "@/components/game/game-play";
import { GameEnd } from "@/components/game/game-end";

const STORAGE_KEY = "difficulty_progress";

export interface AnswerState {
  isChecking: boolean;
  isCorrect: boolean | null;
  actualPrice: number | null;
  userGuess: number | null;
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    status: "before",
    round: 1,
    lives: 3,
    score: 0,
    difficulty: "easy",
    logs: [],
  });

  const [answerState, setAnswerState] = useState<AnswerState>({
    isChecking: false,
    isCorrect: null,
    actualPrice: null,
    userGuess: null,
  });

  const handleSelectDifficulty = (selectedDifficulty: Difficulty) => {
    setGameState((prev) => ({
      ...prev,
      difficulty: selectedDifficulty,
    }));
  };

  const handleGameStart = () => {
    setGameState((prev) => ({
      ...prev,
      status: "playing",
      round: 1,
      lives: DIFFICULTY_SETTINGS[prev.difficulty].lives,
      score: 0,
    }));
  };

  const handleGameEnd = () => {
    setGameState((prev) => ({
      ...prev,
      status: "end",
    }));
  };

  const handleBackToBefore = () => {
    setGameState((prev) => ({
      ...prev,
      status: "before",
      difficulty: "easy",
    }));
  };

  const handleCheckAnswer = (
    price: number,
    userGuess: number,
    product: Product
  ) => {
    const deviation = DIFFICULTY_SETTINGS[gameState.difficulty].deviation / 100;
    const allowedDifference = price * deviation;
    const difference = Math.abs(price - userGuess);
    const isCorrect = difference <= allowedDifference;

    // 허용 오차 범위를 벗어난 만큼만 생명력 감소 계산
    let livesLost = 0;
    if (!isCorrect) {
      const excessDifference = difference - allowedDifference;
      const excessRate = excessDifference / price;
      livesLost = Math.round(excessRate * 100);
    }

    // 정답 근접도에 따른 점수 계산
    let earnedScore = 0;
    if (isCorrect) {
      const accuracyRate = 1 - difference / allowedDifference; // 0 ~ 1 사이 값
      // 기본 100점에 정확도에 따라 최대 100점 추가 보너스
      earnedScore = Math.round(100 + accuracyRate * 100);

      // 난이도 보너스
      switch (gameState.difficulty) {
        case "hard":
          earnedScore *= 10; // 하드 모드는 3배
          break;
        case "normal":
          earnedScore *= 5; // 노말 모드는 2배
          break;
        // easy는 기본 점수
      }
    }

    setAnswerState({
      isChecking: true,
      isCorrect,
      actualPrice: price,
      userGuess,
    });

    if (isCorrect) {
      setGameState((prev) => ({
        ...prev,
        score: prev.score + earnedScore,
      }));
    } else {
      setGameState((prev) => ({
        ...prev,
        lives: Math.max(0, prev.lives - livesLost),
      }));
    }

    // 로그 기록
    const log: GameLog = {
      round: gameState.round,
      product: product,
      actualPrice: price,
      userGuess: userGuess,
      isCorrect: isCorrect,
      score: earnedScore,
      livesLost: livesLost,
    };

    setGameState((prev) => ({
      ...prev,
      logs: [...prev.logs, log],
    }));

    setTimeout(() => {
      setAnswerState({
        isChecking: false,
        isCorrect: null,
        actualPrice: null,
        userGuess: null,
      });

      if (gameState.lives <= livesLost) {
        // 남은 생명력보다 감소량이 더 크면 게임 오버
        handleGameEnd();
        return;
      }

      if (gameState.round === 10) {
        handleGameEnd();
        const progress = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        progress[gameState.difficulty] = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        return;
      }

      setGameState((prev) => ({
        ...prev,
        round: prev.round + 1,
      }));
    }, 3000);
  };

  const renderGameContent = () => {
    switch (gameState.status) {
      case "before":
        return (
          <GameStart
            onSelectDifficulty={handleSelectDifficulty}
            onGameStart={handleGameStart}
          />
        );
      case "playing":
        return (
          <GamePlay
            stats={gameState}
            onCheckAnswer={handleCheckAnswer}
            answerState={answerState}
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
    <main className="flex flex-col items-center justify-center min-h-screen max-w-md mx-auto">
      {renderGameContent()}
    </main>
  );
}
