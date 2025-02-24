"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Trophy, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/config";
import type { GameState } from "@/types/game";

interface Props {
  stats: GameState;
}

export function SubmitScoreDialog({ stats }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const { error: submitError } = await supabase.from("log").insert({
        nickname: nickname.trim(),
        score: stats.score,
        difficulty: stats.difficulty as string,
      });

      if (submitError) {
        console.error("기록 등록 실패:", submitError);
        throw new Error(submitError.message || "기록 등록에 실패했습니다.");
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error("에러 발생:", err);
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="px-3" title="기록 등록하기">
          <Trophy size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>기록 등록하기</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <div className="flex flex-col gap-1 bg-secondary text-secondary-foreground p-3 rounded-lg text-sm">
              <p>난이도: {stats.difficulty}</p>
              <p>최종 점수: {stats.score.toLocaleString()}점</p>
            </div>
            <Input
              placeholder="닉네임을 입력해주세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={10}
              disabled={isSubmitting || isSuccess}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!nickname.trim() || isSubmitting || isSuccess}
              className="w-full"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isSuccess ? (
                "등록 완료!"
              ) : (
                "등록하기"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
