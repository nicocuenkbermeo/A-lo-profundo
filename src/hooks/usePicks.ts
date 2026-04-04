"use client";

import { useState, useEffect, useCallback } from "react";
import type { Pick } from "@/types/pick";

interface UsePicksReturn {
  picks: Pick[];
  isLoading: boolean;
  error: string | null;
  loadMore: () => void;
  hasMore: boolean;
}

const PAGE_SIZE = 20;

export function usePicks(filters: Record<string, string>): UsePicksReturn {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterKey = JSON.stringify(filters);

  // Reset when filters change
  useEffect(() => {
    setPicks([]);
    setPage(1);
    setHasMore(true);
  }, [filterKey]);

  useEffect(() => {
    let cancelled = false;

    async function fetchPicks() {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          ...filters,
          page: String(page),
          limit: String(PAGE_SIZE),
        });
        const res = await fetch(`/api/picks?${params}`);
        if (!res.ok) throw new Error("Failed to fetch picks");
        const json = await res.json();
        if (!cancelled) {
          const newPicks: Pick[] = json.data ?? [];
          setPicks((prev) => (page === 1 ? newPicks : [...prev, ...newPicks]));
          setHasMore(newPicks.length >= PAGE_SIZE);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchPicks();
    return () => {
      cancelled = true;
    };
  }, [page, filterKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) setPage((p) => p + 1);
  }, [isLoading, hasMore]);

  return { picks, isLoading, error, loadMore, hasMore };
}
