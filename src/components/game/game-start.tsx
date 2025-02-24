import { useEffect, useState } from "react";
import {
  Difficulty,
  DIFFICULTY_SETTINGS,
  DifficultyProgress,
} from "@/types/game";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CircleHelp } from "lucide-react";

interface Props {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onGameStart: () => void;
}

const INITIAL_PROGRESS: DifficultyProgress = {
  easy: true,
  normal: false,
  hard: false,
};

const STORAGE_KEY = "difficulty_progress";

export function GameStart({ onSelectDifficulty, onGameStart }: Props) {
  const [progress, setProgress] =
    useState<DifficultyProgress>(INITIAL_PROGRESS);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("easy");

  // 로컬스토리지에서 진행상황 불러오기
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  // 난이도 버튼 클릭 핸들러
  const handleDifficultyClick = (difficulty: Difficulty) => {
    if (!progress[difficulty]) return; // 잠긴 난이도는 선택 불가
    setSelectedDifficulty(difficulty);
    onSelectDifficulty(difficulty);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-2 w-full">
      <div className="flex flex-col items-center justify-center gap-2 w-full">
        <h1 className="text-4xl font-bold text-center">
          <span className="text-[rgb(128,65,31)]">X</span>
          <span className="text-[rgb(242,60,36)]">팡</span>
          <span className="text-[rgb(254,185,7)]">에</span>{" "}
          <span className="text-[rgb(121,197,44)]">가</span>
          <span className="text-[rgb(44,164,213)]">면</span>
        </h1>
        <p className="text-xl mb-6">전국민 물가 체감 프로젝트</p>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                className="rounded-full p-3 text-xs w-6 h-6"
              >
                <CircleHelp className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <span>
                난이도를 선택해주세요.
                <br />
              </span>
            </PopoverContent>
          </Popover>
        </div>

        {Object.entries(DIFFICULTY_SETTINGS).map(([key, { label }]) => {
          const difficulty = key as Difficulty;
          const isLocked = !progress[difficulty];
          const isSelected = selectedDifficulty === difficulty;

          return (
            <Button
              key={key}
              onClick={() => handleDifficultyClick(difficulty)}
              className={`
                ${
                  isLocked
                    ? "bg-gray-500 cursor-not-allowed"
                    : isSelected
                    ? "bg-green-500 text-white ring-2"
                    : ""
                }
                transition-colors
              `}
              disabled={isLocked}
            >
              <span>{label}</span>
            </Button>
          );
        })}
      </div>
      <Button
        variant="default"
        onClick={onGameStart}
        disabled={!selectedDifficulty}
        className="w-full"
      >
        게임 시작하기
      </Button>
    </div>
  );
}
