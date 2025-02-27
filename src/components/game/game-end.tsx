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
    return `[Xpang에 가면]
최종 점수: ${stats.score}점

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

  function handleToggleLeaderboard() {
    setShowLeaderboard(!showLeaderboard);
    setShowLogs(false);
  }

  function handleToggleLogs() {
    setShowLogs(!showLogs);
    setShowLeaderboard(false);
  }

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center gap-2 p-2 text-center">
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-2 p-2 text-center">
        <h1 className="text-3xl font-bold">게임 종료</h1>
        <div className="flex w-full flex-col gap-1 rounded-lg bg-secondary p-4 text-left text-secondary-foreground">
          <p>최종 점수: {stats.score}점</p>
          <p>진행한 라운드: {stats.round}/10</p>
        </div>

        <div className="flex w-full max-w-md gap-2">
          <Button
            variant="outline"
            onClick={handleToggleLeaderboard}
            className="flex flex-1 items-center justify-between"
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
            onClick={handleToggleLogs}
            className="flex flex-1 items-center justify-between"
          >
            로그 조회{" "}
            {showLogs ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className={clsx(
              "px-3 transition-colors",
              isShared && "border-2 border-green-500 text-green-500",
            )}
            title={isShared ? "복사 완료!" : "공유하기"}
          >
            {isShared ? <Check size={20} /> : <Share2 size={20} />}
          </Button>
          <SubmitScoreDialog stats={stats} />
        </div>
        {showLeaderboard && (
          <div className="w-full">
            <Leaderboard />
          </div>
        )}

        <div
          className={clsx(
            "w-full max-w-md origin-top rounded-lg bg-secondary text-secondary-foreground transition-all duration-200 ease-in-out",
            showLogs
              ? "mb-2 h-[332px] p-2 opacity-100"
              : "h-0 overflow-hidden opacity-0",
          )}
        >
          <div className="flex max-h-[300px] flex-col gap-2 divide-y overflow-y-auto text-left">
            {stats.logs.map((log, index) => (
              <div key={index} className="p-2 first:pt-0 last:pb-0">
                <div className="flex items-center gap-1">
                  <span className="font-bold">라운드 {log.round}</span>
                  <span
                    className={clsx(
                      "rounded px-1 text-sm",
                      log.isCorrect
                        ? "bg-blue-100 text-blue-500"
                        : "bg-red-100 text-red-500",
                    )}
                  >
                    {log.isCorrect ? "정답" : "오답"}
                  </span>
                </div>
                <Link
                  href={log.product.url}
                  target="_blank"
                  className="underline transition-colors hover:text-primary"
                  title="상품 상세 페이지로 이동하기"
                >
                  <p className="mb-1 line-clamp-1 text-sm">
                    {log.product.name}
                  </p>
                </Link>
                <div className="text-sm text-gray-600">
                  <p>정답: {formatPrice(log.actualPrice)}</p>
                  <p>답변: {formatPrice(log.userGuess)}</p>
                  <div className="mt-1 flex justify-between">
                    <span>획득 점수: +{log.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button onClick={onBackToBefore} className="w-full max-w-md flex-none">
        돌아가기
      </Button>
    </div>
  );
}
