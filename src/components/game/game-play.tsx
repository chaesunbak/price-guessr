import Image from "next/image";
import type { GameState, Product } from "@/types/game";
import { useRandomProduct } from "@/hooks/useRandomProduct";
import { Button } from "@/components/ui/button";
import { PriceOptions } from "@/components/game/price-options";
import { Loader } from "@/components/loader";
import { getScore } from "@/lib/game";
import { ArrowBigRight } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useEffect } from "react";

interface Props {
  stats: GameState;
  onCheckAnswer: (userGuess: number, product: Product) => void;
  onNextRound: () => void;
}

export function GamePlay({ stats, onCheckAnswer, onNextRound }: Props) {
  const { product, isLoading, error } = useRandomProduct({
    round: stats.round,
  });

  const getAbsoluteImageUrl = (relativeUrl: string) => {
    if (relativeUrl.startsWith("//")) {
      return `https:${relativeUrl}`;
    }
    return relativeUrl;
  };

  const handleSubmit = (inputPrice: number) => {
    if (stats.isChecking || !product) return;
    onCheckAnswer(inputPrice, product);
  };

  const handleNextRound = () => {
    onNextRound();
  };

  // 키보드 이벤트 리스너 추가
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 엔터 키를 누르고, 정답 확인 중일 때만 다음 라운드로 진행
      if (
        (e.key === "Enter" || e.code === "Enter" || e.keyCode === 13) &&
        stats.isChecking
      ) {
        handleNextRound();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [stats.isChecking, onNextRound]);

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error.message}</p>
        <Button onClick={() => window.location.reload()}>새로고침</Button>
      </div>
    );
  }

  if (isLoading || !product) {
    return <Loader />;
  }

  const { earnedScore, difference, accuracy } = getScore(
    stats.userGuess,
    product,
  );

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center gap-6 p-2">
      <div className="mb-4 flex w-full flex-none flex-col rounded-lg bg-secondary p-4 text-left text-secondary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">라운드</span>
            <span className="text-lg">{stats.round} / 10</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">점수:</span>
            <AnimatedCounter
              value={stats.score}
              className="text-lg"
              formatFn={(val) => val.toLocaleString()}
              duration={0.8}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center">
        {product.img && (
          <div className="relative mb-4 aspect-square h-[200px] w-[200px]">
            <Image
              src={getAbsoluteImageUrl(product.img)}
              alt={product.name}
              fill
              className="h-full w-full rounded-lg object-contain"
              sizes="200px"
            />
          </div>
        )}

        <div className="flex h-[3rem] items-center">
          <h2
            className="line-clamp-2 text-center text-xl font-bold"
            title={product.name}
          >
            {product.name}
          </h2>
        </div>
      </div>

      <div className="mt-auto w-full flex-none">
        {stats.isChecking && (
          <div className="fixed bottom-32 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 transform">
            <div className="animate-slide-up flex w-full items-center justify-between rounded-full bg-slate-700/50 p-4 text-center transition-all duration-200 ease-in-out">
              <div className="flex flex-1 flex-col items-center justify-center text-sm text-white lg:text-base">
                <div className="flex items-center justify-center gap-2">
                  <span>가격 : {Number(product.price).toLocaleString()}원</span>
                  <span>
                    예측 : {stats.userGuess.toLocaleString()}원 (
                    {difference.toLocaleString()}원)
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span>정확도 : {(accuracy * 100).toFixed(0)}%</span>
                  <span>획득 점수 : {earnedScore.toLocaleString()}점</span>
                </div>
              </div>

              <Button
                onClick={handleNextRound}
                className="flex-none animate-pulse rounded-full bg-slate-800/50 text-lg hover:bg-slate-800/70"
                tabIndex={1}
                aria-label="다음 라운드"
              >
                <ArrowBigRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}

        <PriceOptions onSubmit={handleSubmit} stats={stats} />
      </div>
    </div>
  );
}
