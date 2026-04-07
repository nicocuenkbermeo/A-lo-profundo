// Minimal consumption example for the new MLB layer.
//
// This file is a reference — it is not imported anywhere. Delete it once
// Feature 6 lands and we have a real page using the layer.
//
// Usage pattern from a Server Component / route handler:
//
//     import { mlbFetch, MLB_TAGS } from "@/lib/mlb/client";
//     import { scheduleByDateRange } from "@/lib/mlb/endpoints";
//     import { getCurrentSeason, getSeasonDateRange } from "@/lib/mlb/season";
//     import type { ScheduleResponse } from "@/lib/mlb/types";
//
//     export const revalidate = 7200; // 2 hours
//
//     export default async function BullpensPage() {
//       const season = getCurrentSeason();
//       const { regularSeasonStart, regularSeasonEnd } = getSeasonDateRange(season);
//
//       const schedule = await mlbFetch<ScheduleResponse>(
//         scheduleByDateRange({
//           startDate: regularSeasonStart,
//           endDate: regularSeasonEnd,
//           teamId: 147, // Yankees, just as a smoke test
//         }),
//         {
//           revalidate: 7200,
//           tags: [MLB_TAGS.schedule, MLB_TAGS.bullpens],
//           label: "schedule:yankees:season",
//         },
//       );
//
//       const totalGames = schedule.dates.reduce((n, d) => n + d.games.length, 0);
//       return <p>Yankees tienen {totalGames} juegos esta temporada.</p>;
//     }

export {};
