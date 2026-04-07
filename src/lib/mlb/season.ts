// Season helpers.
//
// The MLB calendar doesn't line up neatly with the civil year:
//   - Spring Training: mid-February → late March
//   - Regular season:  late March → early October
//   - Postseason:      October → early November
//   - Offseason / Winter Meetings: November → January
//
// During January and February we want stats pages to keep showing the
// season that just ended, not "2026 stats: empty". From March onward,
// everything points at the current calendar year.

const BOGOTA_TZ = "America/Bogota";

/**
 * Return the MLB season year that should be treated as "current" right now.
 * Jan–Feb roll back to the previous year; Mar–Dec use the current year.
 */
export function getCurrentSeason(now: Date = new Date()): number {
  const bogotaMonth = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: BOGOTA_TZ, month: "numeric" }).format(now),
  );
  const bogotaYear = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: BOGOTA_TZ, year: "numeric" }).format(now),
  );
  if (bogotaMonth <= 2) return bogotaYear - 1;
  return bogotaYear;
}

export interface SeasonDateRange {
  /** Inclusive YYYY-MM-DD, approximate start of regular season. */
  regularSeasonStart: string;
  /** Inclusive YYYY-MM-DD, approximate end of regular season. */
  regularSeasonEnd: string;
  /** Inclusive YYYY-MM-DD, start of Spring Training (useful for some byDateRange queries). */
  springTrainingStart: string;
  /** Inclusive YYYY-MM-DD, end of postseason window (November safety). */
  postseasonEnd: string;
}

/**
 * Approximate date ranges for an MLB season. These are intentionally a little
 * wide on both ends so byDateRange queries never miss data because of a
 * schedule tweak. Exact opening day moves year to year; this is close enough
 * for stats and schedule windows.
 */
export function getSeasonDateRange(season: number): SeasonDateRange {
  return {
    springTrainingStart: `${season}-02-15`,
    regularSeasonStart: `${season}-03-20`,
    regularSeasonEnd: `${season}-10-05`,
    postseasonEnd: `${season}-11-10`,
  };
}
