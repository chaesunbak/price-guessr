"use client";

import { supabase } from "@/lib/supabase/config";
import { Difficulty } from "@/types/game";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DIFFICULTY_SETTINGS } from "@/types/game";

interface Props {
  difficulty: Difficulty;
}

export function Leaderboard({ difficulty }: Props) {
  const [mode, setMode] = useState<"easy" | "normal" | "hard" | "all">(
    difficulty
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let query = supabase.from("log").select();

        if (mode !== "all") {
          query = query.eq("difficulty", mode);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          console.error(fetchError.message);
          throw new Error("데이터를 불러오는데 실패했습니다.");
        }

        setLogs(data);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [mode]);

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (isLoading) {
    return <div className="text-center">로딩 중...</div>;
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex gap-2 mb-4">
        <Button
          variant={mode === "all" ? "default" : "outline"}
          onClick={() => setMode("all")}
          className="flex-1"
        >
          전체
        </Button>
        {(Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map((key) => (
          <Button
            key={key}
            variant={mode === key ? "default" : "outline"}
            onClick={() => setMode(key)}
            className="flex-1"
          >
            {DIFFICULTY_SETTINGS[key].label}
          </Button>
        ))}
      </div>

      <div className="bg-secondary text-secondary-foreground rounded-lg">
        <div className="flex items-center p-3 font-bold border-b">
          <span className="w-12 text-center">순위</span>
          <span className="flex-1">닉네임</span>
          <span className="w-20 text-right">점수</span>
        </div>
        <div className="divide-y">
          {logs.map((log, index) => (
            <div key={index} className="flex items-center p-3">
              <span className="w-12 text-center">{index + 1}</span>
              <span className="flex-1">{log.nickname || "무명"}</span>
              <span className="w-20 text-right">
                {log.score.toLocaleString()}
              </span>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="p-3 text-center text-gray-500">
              기록이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
