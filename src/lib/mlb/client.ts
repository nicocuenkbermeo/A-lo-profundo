// MLB Stats API client.
//
// Responsibilities:
//   1. Typed JSON fetch with retry + timeout.
//   2. Next.js data-cache integration via `next.revalidate` and `next.tags`
//      so callers can later `revalidateTag('power-rankings')`, etc.
//   3. Basic in-process rate limiting (~10 req/sec) to avoid hammering MLB.
//
// Convention: every feature folder imports `mlbFetch` from here — no raw
// `fetch("https://statsapi.mlb.com...")` calls anywhere else in the app.

type FetchInit = Parameters<typeof fetch>[1];

export interface MlbFetchOptions {
  /** Seconds until Next's data cache revalidates this response. Default 300s. */
  revalidate?: number | false;
  /** Tags for on-demand invalidation via `revalidateTag()`. */
  tags?: string[];
  /** Per-request timeout in ms. Default 8s. */
  timeoutMs?: number;
  /** How many times to retry on 5xx or network errors. Default 2. */
  retries?: number;
  /** Optional tag for logs so failures are identifiable. */
  label?: string;
}

// ---------------------------------------------------------------------------
// Rate limiter — simple token bucket, 10 req/sec, shared across the process.
// Good enough for Vercel Fluid Compute where a single instance handles many
// concurrent requests. Per-region, not global, but MLB's free API tolerates
// much more than 10/s; this is just a sanity cap.
// ---------------------------------------------------------------------------

const RATE_LIMIT_PER_SECOND = 10;
let windowStart = Date.now();
let callsInWindow = 0;

async function throttle(): Promise<void> {
  const now = Date.now();
  if (now - windowStart >= 1000) {
    windowStart = now;
    callsInWindow = 0;
  }
  if (callsInWindow >= RATE_LIMIT_PER_SECOND) {
    const wait = 1000 - (now - windowStart) + 1;
    await new Promise((r) => setTimeout(r, wait));
    windowStart = Date.now();
    callsInWindow = 0;
  }
  callsInWindow++;
}

// ---------------------------------------------------------------------------
// Core fetch
// ---------------------------------------------------------------------------

function isTransientStatus(status: number): boolean {
  return status === 408 || status === 429 || (status >= 500 && status < 600);
}

async function fetchWithTimeout(url: string, init: FetchInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Typed fetch for the MLB Stats API.
 *
 * @throws Error — only after retries are exhausted. Callers should catch and
 *         surface a "datos temporalmente no disponibles" UI state instead of
 *         letting a 500 propagate.
 */
export async function mlbFetch<T>(url: string, opts: MlbFetchOptions = {}): Promise<T> {
  const {
    revalidate = 300,
    tags = [],
    timeoutMs = 8000,
    retries = 2,
    label = url,
  } = opts;

  const init: FetchInit = {
    headers: { Accept: "application/json" },
    next: { revalidate, tags },
  };

  let attempt = 0;
  let lastError: unknown;

  while (attempt <= retries) {
    await throttle();
    try {
      const res = await fetchWithTimeout(url, init, timeoutMs);
      if (!res.ok) {
        if (isTransientStatus(res.status) && attempt < retries) {
          attempt++;
          await backoff(attempt);
          continue;
        }
        throw new Error(`[mlb:${label}] HTTP ${res.status} ${res.statusText}`);
      }
      return (await res.json()) as T;
    } catch (err) {
      lastError = err;
      if (attempt >= retries) break;
      attempt++;
      await backoff(attempt);
    }
  }

  console.error(`[mlb:${label}] failed after ${retries + 1} attempts:`, lastError);
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

async function backoff(attempt: number): Promise<void> {
  const delay = 200 * 2 ** (attempt - 1); // 200ms, 400ms, 800ms...
  await new Promise((r) => setTimeout(r, delay));
}

// ---------------------------------------------------------------------------
// Cache tag helpers — keep feature tag names consistent across files.
// ---------------------------------------------------------------------------

export const MLB_TAGS = {
  schedule: "mlb:schedule",
  liveFeed: "mlb:live-feed",
  bullpens: "mlb:bullpens",
  powerRankings: "mlb:power-rankings",
  momentOfDay: "mlb:moment-of-day",
  duelOfDay: "mlb:duel-of-day",
  chase: "mlb:chase",
  latinos: "mlb:latinos",
  dailyRecap: "mlb:daily-recap",
  predictions: "mlb:predictions",
} as const;

export type MlbTag = (typeof MLB_TAGS)[keyof typeof MLB_TAGS];
