# `src/lib/mlb/` — MLB Stats API layer

This is the **single entry point** for every feature that consumes the MLB
Stats API. Pages and route handlers MUST NOT call `fetch("https://statsapi…")`
directly — always go through `mlbFetch`.

## Files

- **`client.ts`** — `mlbFetch<T>(url, opts)` with retry, timeout, rate-limit
  and `next.revalidate` + `next.tags` integration. Also exports `MLB_TAGS`.
- **`endpoints.ts`** — URL constructors. Add one per endpoint you consume.
- **`season.ts`** — `getCurrentSeason()` and `getSeasonDateRange(season)`.
  Jan–Feb intentionally roll back to the previous season so stats pages
  don't go blank during the offseason.
- **`types.ts`** — TypeScript types for API responses. Type **only what
  you use**. `MLBRaw` is an escape hatch for exploratory calls.

## Conventions

1. **Never** hardcode `2026` (or any season) in feature code. Call
   `getCurrentSeason()`.
2. Every fetch passes a `tags` array so we can `revalidateTag('mlb:…')`
   later. Use the constants in `MLB_TAGS`.
3. Every fetch passes a `label` so errors in the logs are grep-able.
4. The legacy `src/lib/mlb-api.ts` is left untouched on purpose. Existing
   pages keep using it until they are explicitly migrated.
