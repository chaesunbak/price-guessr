import { Button } from "@/components/ui/button";

interface Props {
  onGameStart: () => void;
}

export function GameStart({ onGameStart }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-2 w-full min-h-screen">
      <div className="flex flex-col items-center justify-center gap-2 w-full flex-1">
        <h1 className="text-4xl font-bold text-center">
          <span className="text-[rgb(128,65,31)]">시</span>
          <span className="text-[rgb(242,60,36)]">장</span>
          <span className="text-[rgb(254,185,7)]">에</span>{" "}
          <span className="text-[rgb(121,197,44)]">가</span>
          <span className="text-[rgb(44,164,213)]">면</span>
        </h1>
        <p className="text-xl mb-6">전국민 물가 체감 프로젝트</p>
      </div>

      <div className="flex flex-col gap-2 w-full flex-none">
        <Button variant="default" onClick={onGameStart} className="w-full">
          게임 시작하기
        </Button>
      </div>
    </div>
  );
}
