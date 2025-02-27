"use client";

import { supabase } from "@/lib/supabase/config";
import { useEffect, useState } from "react";

export function Leaderboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("log")
          .select()
          .order("score", { ascending: false });

        if (fetchError) {
          console.error(fetchError.message);
          throw new Error("데이터를 불러오는데 실패했습니다.");
        }

        setLogs(data);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "알 수 없는 오류가 발생했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (isLoading) {
    return <div className="text-center">로딩 중...</div>;
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-lg bg-secondary text-secondary-foreground">
        <div className="flex items-center border-b p-3 font-bold">
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
