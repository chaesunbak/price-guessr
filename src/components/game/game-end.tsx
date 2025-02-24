import type { GameState } from "@/types/game";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown, ChevronUp, Share2, Check } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { SubmitScoreDialog } from "@/components/game/submit-score-dialog";
import { Leaderboard } from "@/components/game/leaderboard";

interface Props {
  stats: GameState;
  onBackToBefore: () => void;
}

export function GameEnd({ stats, onBackToBefore }: Props) {
  const [showLogs, setShowLogs] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const formatPrice = (price: number) => {
    return price.toLocaleString() + "원";
  };

  const getShareText = () => {
    const difficulty = {
      easy: "쉬움",
      normal: "보통",
      hard: "어려움",
    }[stats.difficulty];

    return `[Xpang에 가면]
난이도: ${difficulty}
최종 점수: ${stats.score}점
남은 목숨: ${stats.lives}
진행한 라운드: ${stats.round}/10

https://xpang.vercel.app`;
  };

  const handleShare = async () => {
    const shareText = getShareText();

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Xpang에 가면",
          text: shareText,
        });
        setIsShared(true);
      } else {
        await navigator.clipboard.writeText(shareText);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      }
    } catch (error) {
      console.error("공유하기 실패:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 text-center h-full p-2 w-full">
      <h1 className="text-3xl font-bold">게임 종료</h1>
      <div className="flex flex-col gap-1 bg-secondary text-secondary-foreground p-4 rounded-lg w-full text-left">
        <p>난이도: {stats.difficulty}</p>
        <p>최종 점수: {stats.score}점</p>
        <p>남은 목숨: {stats.lives}</p>
        <p>진행한 라운드: {stats.round}/10</p>
      </div>

      <div className="flex gap-2 w-full max-w-md">
        <Button
          variant="outline"
          onClick={() => {
            setShowLogs(false);
            setShowLeaderboard(!showLeaderboard);
          }}
          className="flex-1 flex items-center justify-between"
        >
          리더보드{" "}
          {showLeaderboard ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setShowLeaderboard(false);
            setShowLogs(!showLogs);
          }}
          className="flex-1 flex items-center justify-between"
        >
          로그 조회{" "}
          {showLogs ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Button>
        <Button
          variant="outline"
          onClick={handleShare}
          className={clsx(
            "px-3 transition-colors",
            isShared && "text-green-500 border-green-500 border-2"
          )}
          title={isShared ? "복사 완료!" : "공유하기"}
        >
          {isShared ? <Check size={20} /> : <Share2 size={20} />}
        </Button>
        <SubmitScoreDialog stats={stats} />
      </div>

      {showLeaderboard && (
        <div className="w-full">
          <Leaderboard difficulty={stats.difficulty} />
        </div>
      )}

      <div
        className={clsx(
          "w-full max-w-md bg-secondary text-secondary-foreground rounded-lg transition-all duration-200 ease-in-out origin-top",
          showLogs
            ? "h-[332px] opacity-100 p-2 mb-2"
            : "h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto divide-y text-left">
          {stats.logs.map((log, index) => (
            <div key={index} className="p-2 first:pt-0 last:pb-0">
              <div className="flex items-center gap-1">
                <span className="font-bold">라운드 {log.round}</span>
                <span
                  className={clsx(
                    "rounded px-1 text-sm",
                    log.isCorrect
                      ? "text-blue-500 bg-blue-100"
                      : "text-red-500 bg-red-100"
                  )}
                >
                  {log.isCorrect ? "정답" : "오답"}
                </span>
              </div>
              <Link
                href={log.product.url}
                target="_blank"
                className="underline hover:text-primary transition-colors"
                title="상품 상세 페이지로 이동하기"
              >
                <p className="text-sm mb-1 line-clamp-1">{log.product.name}</p>
              </Link>
              <div className="text-sm text-gray-600">
                <p>정답: {formatPrice(log.actualPrice)}</p>
                <p>답변: {formatPrice(log.userGuess)}</p>
                <div className="flex justify-between mt-1">
                  <span>획득 점수: +{log.score}</span>
                  {log.livesLost > 0 && (
                    <span className="text-red-500">
                      생명력 -{log.livesLost}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={onBackToBefore} className="w-full max-w-md">
        돌아가기
      </Button>
    </div>
  );
}
