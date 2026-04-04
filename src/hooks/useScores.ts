"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Game } from "@/types/game";

interface UseScoresReturn {
  games: Game[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useScores(date: string): UseScoresReturn {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchScores = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`/api/scores?date=${date}`);
      if (!res.ok) throw new Error("Failed to fetch scores");
      const json = await res.json();
      setGames(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  useEffect(() => {
    setIsLoading(true);
    fetchScores();

    // Poll every 30 seconds for live game updates
    intervalRef.current = setInterval(fetchScores, 30_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchScores]);

  return { games, isLoading, error, refresh: fetchScores };
}
