import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

interface BottomProgressProps {
  isChecking: boolean;
  duration?: number;
}

export function BottomProgress({
  isChecking,
  duration = 3000,
}: BottomProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isChecking) {
      setProgress(0);
      // 약간의 딜레이 후 프로그레스 시작
      const timer = setTimeout(() => {
        setProgress(100);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setProgress(0);
    }
  }, [isChecking]);

  if (!isChecking) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full">
      <Progress
        value={progress}
        className={`w-full transition-all duration-[${
          duration - 50
        }ms] ease-linear`}
      />
    </div>
  );
}
