import Image from "next/image";
import { useMemo } from "react";
import type { GameState, Product } from "@/types/game";
import { useRandomProduct } from "@/hooks/useRandomProduct";
import { Button } from "@/components/ui/button";
import { PriceOptions } from "@/components/game/price-options";
import type { AnswerState } from "@/app/page";
import { Loader } from "@/components/loader";
import { BottomProgress } from "@/components/game/bottom-progress";

interface Props {
  stats: GameState;
  onCheckAnswer: (price: number, userGuess: number, product: Product) => void;
  answerState: AnswerState;
}

export function GamePlay({ stats, onCheckAnswer, answerState }: Props) {
  const { product, isLoading, error } = useRandomProduct({
    round: stats.round,
  });

  const actualPrice = useMemo(() => {
    if (!product?.price) return null;
    return parseInt(product.price.replace(/[^0-9]/g, ""));
  }, [product?.price]);

  const getAbsoluteImageUrl = (relativeUrl: string) => {
    if (relativeUrl.startsWith("//")) {
      return `https:${relativeUrl}`;
    }
    return relativeUrl;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString() + "원";
  };

  const handleSubmit = (price: number) => {
    if (answerState.isChecking || !actualPrice || !product) return;
    onCheckAnswer(actualPrice, price, product);
  };

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error.message}</p>
        <Button onClick={() => window.location.reload()}>새로고침</Button>
      </div>
    );
  }

  if (isLoading || !product || !actualPrice) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center gap-6 h-full p-2 w-full">
      <div className="flex w-full flex-col text-left mb-4 bg-secondary text-secondary-foreground p-4 rounded-lg">
        <p className="text-lg font-bold">라운드 {stats.round} / 10</p>
        <div className="flex items-center justify-between gap-2">
          <div>남은 목숨: {stats.lives}</div>
          <div>점수: {stats.score}</div>
        </div>
      </div>

      {product.img && (
        <div className="relative aspect-square w-[200px] h-[200px] mb-4">
          <Image
            src={getAbsoluteImageUrl(product.img)}
            alt={product.name}
            fill
            className="object-contain rounded-lg w-full h-full"
            sizes="200px"
          />
        </div>
      )}

      <div className="h-[3rem] flex items-center">
        <h2
          className="text-xl font-bold text-center line-clamp-2"
          title={product.name}
        >
          {product.name}
        </h2>
      </div>

      <div className="h-20 w-full flex items-center justify-center">
        {answerState.isChecking && (
          <div className="text-lg text-center">
            <p
              className={`font-bold mb-1 ${
                answerState.isCorrect ? "text-primary" : "text-red-500"
              }`}
            >
              {answerState.isCorrect ? "정답입니다" : "틀렸습니다"}
            </p>
            <p className="text-gray-700">
              정답: {formatPrice(answerState.actualPrice!)}
            </p>
            <p className="text-sm text-gray-500">
              내 답변: {formatPrice(answerState.userGuess!)}
            </p>
          </div>
        )}
      </div>

      <div className="w-full mt-auto">
        <PriceOptions onSubmit={handleSubmit} />
      </div>

      <BottomProgress isChecking={answerState.isChecking} />
    </div>
  );
}
