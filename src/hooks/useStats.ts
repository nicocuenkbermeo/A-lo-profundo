"use client";

import { useState, useEffect } from "react";

interface UseStatsReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useStats<T = unknown>(
  type: "teams" | "players",
  filters: Record<string, string>
): UseStatsReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams(filters);
        const res = await fetch(`/api/stats/${type}?${params}`);
        if (!res.ok) throw new Error("Failed to fetch stats");
        const json = await res.json();
        if (!cancelled) setData(json.data ?? null);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, [type, filterKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, isLoading, error };
}
