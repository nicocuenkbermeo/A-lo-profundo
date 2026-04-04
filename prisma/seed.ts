// NOTE: Run `npm install -D tsx` before using this seed.
// package.json should include:
//   "prisma": { "seed": "npx tsx prisma/seed.ts" }

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data in reverse dependency order
  await prisma.$transaction([
    prisma.streak.deleteMany(),
    prisma.pick.deleteMany(),
    prisma.bettingLine.deleteMany(),
    prisma.gameInning.deleteMany(),
    prisma.game.deleteMany(),
    prisma.player.deleteMany(),
    prisma.team.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // ── Users ──────────────────────────────────────────

  const passwordHash = await hash("Password123!", 12);

  const [admin, proTipster, regularUser] = await prisma.$transaction([
    prisma.user.create({
      data: {
        email: "admin@aloprofundo.com",
        username: "admin_mlb",
        password: passwordHash,
        displayName: "Carlos Admin",
        role: "ADMIN",
        avatar: "/avatars/admin.jpg",
      },
    }),
    prisma.user.create({
      data: {
        email: "protipster@aloprofundo.com",
        username: "el_profeta",
        password: passwordHash,
        displayName: "Miguel Pro Tipster",
        role: "TIPSTER",
        avatar: "/avatars/tipster.jpg",
      },
    }),
    prisma.user.create({
      data: {
        email: "user@aloprofundo.com",
        username: "fanbeisbol",
        password: passwordHash,
        displayName: "Juan Usuario",
        role: "USER",
      },
    }),
  ]);

  // ── Teams ──────────────────────────────────────────

  const teamsData: {
    name: string;
    abbreviation: string;
    city: string;
    league: "AL" | "NL";
    division: "EAST" | "CENTRAL" | "WEST";
    primaryColor: string;
    secondaryColor: string;
  }[] = [
    // AL East
    { name: "Yankees", abbreviation: "NYY", city: "New York", league: "AL", division: "EAST", primaryColor: "#003087", secondaryColor: "#E4002C" },
    { name: "Red Sox", abbreviation: "BOS", city: "Boston", league: "AL", division: "EAST", primaryColor: "#BD3039", secondaryColor: "#0C2340" },
    { name: "Rays", abbreviation: "TBR", city: "Tampa Bay", league: "AL", division: "EAST", primaryColor: "#092C5C", secondaryColor: "#8FBCE6" },
    { name: "Blue Jays", abbreviation: "TOR", city: "Toronto", league: "AL", division: "EAST", primaryColor: "#134A8E", secondaryColor: "#1D2D5C" },
    { name: "Orioles", abbreviation: "BAL", city: "Baltimore", league: "AL", division: "EAST", primaryColor: "#DF4601", secondaryColor: "#000000" },
    // AL Central
    { name: "Guardians", abbreviation: "CLE", city: "Cleveland", league: "AL", division: "CENTRAL", primaryColor: "#00385D", secondaryColor: "#E50022" },
    { name: "Twins", abbreviation: "MIN", city: "Minnesota", league: "AL", division: "CENTRAL", primaryColor: "#002B5C", secondaryColor: "#D31145" },
    { name: "Tigers", abbreviation: "DET", city: "Detroit", league: "AL", division: "CENTRAL", primaryColor: "#0C2340", secondaryColor: "#FA4616" },
    { name: "White Sox", abbreviation: "CHW", city: "Chicago", league: "AL", division: "CENTRAL", primaryColor: "#27251F", secondaryColor: "#C4CED4" },
    { name: "Royals", abbreviation: "KCR", city: "Kansas City", league: "AL", division: "CENTRAL", primaryColor: "#004687", secondaryColor: "#BD9B60" },
    // AL West
    { name: "Astros", abbreviation: "HOU", city: "Houston", league: "AL", division: "WEST", primaryColor: "#002D62", secondaryColor: "#EB6E1F" },
    { name: "Mariners", abbreviation: "SEA", city: "Seattle", league: "AL", division: "WEST", primaryColor: "#0C2C56", secondaryColor: "#005C5C" },
    { name: "Rangers", abbreviation: "TEX", city: "Texas", league: "AL", division: "WEST", primaryColor: "#003278", secondaryColor: "#C0111F" },
    { name: "Angels", abbreviation: "LAA", city: "Los Angeles", league: "AL", division: "WEST", primaryColor: "#BA0021", secondaryColor: "#003263" },
    { name: "Athletics", abbreviation: "OAK", city: "Oakland", league: "AL", division: "WEST", primaryColor: "#003831", secondaryColor: "#EFB21E" },
    // NL East
    { name: "Braves", abbreviation: "ATL", city: "Atlanta", league: "NL", division: "EAST", primaryColor: "#CE1141", secondaryColor: "#13274F" },
    { name: "Phillies", abbreviation: "PHI", city: "Philadelphia", league: "NL", division: "EAST", primaryColor: "#E81828", secondaryColor: "#002D72" },
    { name: "Mets", abbreviation: "NYM", city: "New York", league: "NL", division: "EAST", primaryColor: "#002D72", secondaryColor: "#FF5910" },
    { name: "Marlins", abbreviation: "MIA", city: "Miami", league: "NL", division: "EAST", primaryColor: "#00A3E0", secondaryColor: "#EF3340" },
    { name: "Nationals", abbreviation: "WSH", city: "Washington", league: "NL", division: "EAST", primaryColor: "#AB0003", secondaryColor: "#14225A" },
    // NL Central
    { name: "Brewers", abbreviation: "MIL", city: "Milwaukee", league: "NL", division: "CENTRAL", primaryColor: "#FFC52F", secondaryColor: "#12284B" },
    { name: "Cubs", abbreviation: "CHC", city: "Chicago", league: "NL", division: "CENTRAL", primaryColor: "#0E3386", secondaryColor: "#CC3433" },
    { name: "Cardinals", abbreviation: "STL", city: "St. Louis", league: "NL", division: "CENTRAL", primaryColor: "#C41E3A", secondaryColor: "#0C2340" },
    { name: "Pirates", abbreviation: "PIT", city: "Pittsburgh", league: "NL", division: "CENTRAL", primaryColor: "#27251F", secondaryColor: "#FDB827" },
    { name: "Reds", abbreviation: "CIN", city: "Cincinnati", league: "NL", division: "CENTRAL", primaryColor: "#C6011F", secondaryColor: "#000000" },
    // NL West
    { name: "Dodgers", abbreviation: "LAD", city: "Los Angeles", league: "NL", division: "WEST", primaryColor: "#005A9C", secondaryColor: "#EF3E42" },
    { name: "Padres", abbreviation: "SDP", city: "San Diego", league: "NL", division: "WEST", primaryColor: "#2F241D", secondaryColor: "#FFC425" },
    { name: "Diamondbacks", abbreviation: "ARI", city: "Arizona", league: "NL", division: "WEST", primaryColor: "#A71930", secondaryColor: "#E3D4AD" },
    { name: "Giants", abbreviation: "SFG", city: "San Francisco", league: "NL", division: "WEST", primaryColor: "#FD5A1E", secondaryColor: "#27251F" },
    { name: "Rockies", abbreviation: "COL", city: "Colorado", league: "NL", division: "WEST", primaryColor: "#33006F", secondaryColor: "#C4CED4" },
  ];

  const teams = await prisma.$transaction(
    teamsData.map((t) =>
      prisma.team.create({
        data: { ...t, logoUrl: `/logos/${t.abbreviation}.svg` },
      })
    )
  );

  const teamMap = Object.fromEntries(teams.map((t) => [t.abbreviation, t]));

  // ── Players ────────────────────────────────────────

  const playersByTeam: Record<string, { firstName: string; lastName: string; position: string; bats: "L" | "R" | "S"; throws_: "L" | "R"; number: number }[]> = {
    NYY: [
      { firstName: "Aaron", lastName: "Judge", position: "RF", bats: "R", throws_: "R", number: 99 },
      { firstName: "Juan", lastName: "Soto", position: "LF", bats: "L", throws_: "L", number: 22 },
      { firstName: "Gerrit", lastName: "Cole", position: "SP", bats: "R", throws_: "R", number: 45 },
      { firstName: "Jazz", lastName: "Chisholm", position: "3B", bats: "L", throws_: "R", number: 13 },
      { firstName: "Austin", lastName: "Wells", position: "C", bats: "L", throws_: "R", number: 28 },
    ],
    BOS: [
      { firstName: "Rafael", lastName: "Devers", position: "3B", bats: "L", throws_: "R", number: 11 },
      { firstName: "Jarren", lastName: "Duran", position: "CF", bats: "L", throws_: "L", number: 16 },
      { firstName: "Brayan", lastName: "Bello", position: "SP", bats: "R", throws_: "R", number: 66 },
      { firstName: "Trevor", lastName: "Story", position: "SS", bats: "R", throws_: "R", number: 10 },
      { firstName: "Connor", lastName: "Wong", position: "C", bats: "R", throws_: "R", number: 12 },
    ],
    TBR: [
      { firstName: "Yandy", lastName: "Diaz", position: "1B", bats: "R", throws_: "R", number: 2 },
      { firstName: "Josh", lastName: "Lowe", position: "LF", bats: "L", throws_: "L", number: 15 },
      { firstName: "Shane", lastName: "McClanahan", position: "SP", bats: "L", throws_: "L", number: 18 },
      { firstName: "Brandon", lastName: "Lowe", position: "2B", bats: "L", throws_: "R", number: 8 },
      { firstName: "Isaac", lastName: "Paredes", position: "3B", bats: "R", throws_: "R", number: 17 },
    ],
    TOR: [
      { firstName: "Vladimir", lastName: "Guerrero Jr.", position: "1B", bats: "R", throws_: "R", number: 27 },
      { firstName: "Bo", lastName: "Bichette", position: "SS", bats: "R", throws_: "R", number: 11 },
      { firstName: "Kevin", lastName: "Gausman", position: "SP", bats: "L", throws_: "R", number: 34 },
      { firstName: "George", lastName: "Springer", position: "DH", bats: "R", throws_: "R", number: 4 },
      { firstName: "Daulton", lastName: "Varsho", position: "CF", bats: "L", throws_: "R", number: 25 },
    ],
    BAL: [
      { firstName: "Gunnar", lastName: "Henderson", position: "SS", bats: "L", throws_: "R", number: 2 },
      { firstName: "Adley", lastName: "Rutschman", position: "C", bats: "S", throws_: "R", number: 35 },
      { firstName: "Corbin", lastName: "Burnes", position: "SP", bats: "R", throws_: "R", number: 39 },
      { firstName: "Anthony", lastName: "Santander", position: "RF", bats: "S", throws_: "R", number: 25 },
      { firstName: "Ryan", lastName: "Mountcastle", position: "1B", bats: "R", throws_: "R", number: 6 },
    ],
    CLE: [
      { firstName: "Jose", lastName: "Ramirez", position: "3B", bats: "S", throws_: "R", number: 11 },
      { firstName: "Steven", lastName: "Kwan", position: "LF", bats: "L", throws_: "L", number: 38 },
      { firstName: "Tanner", lastName: "Bibee", position: "SP", bats: "R", throws_: "R", number: 27 },
      { firstName: "Josh", lastName: "Naylor", position: "1B", bats: "L", throws_: "L", number: 22 },
      { firstName: "Andres", lastName: "Gimenez", position: "2B", bats: "L", throws_: "R", number: 0 },
    ],
    MIN: [
      { firstName: "Carlos", lastName: "Correa", position: "SS", bats: "R", throws_: "R", number: 4 },
      { firstName: "Byron", lastName: "Buxton", position: "CF", bats: "R", throws_: "R", number: 25 },
      { firstName: "Pablo", lastName: "Lopez", position: "SP", bats: "L", throws_: "R", number: 49 },
      { firstName: "Royce", lastName: "Lewis", position: "3B", bats: "R", throws_: "R", number: 23 },
      { firstName: "Ryan", lastName: "Jeffers", position: "C", bats: "R", throws_: "R", number: 27 },
    ],
    DET: [
      { firstName: "Riley", lastName: "Greene", position: "CF", bats: "L", throws_: "L", number: 31 },
      { firstName: "Spencer", lastName: "Torkelson", position: "1B", bats: "R", throws_: "R", number: 20 },
      { firstName: "Tarik", lastName: "Skubal", position: "SP", bats: "L", throws_: "L", number: 29 },
      { firstName: "Colt", lastName: "Keith", position: "2B", bats: "L", throws_: "R", number: 33 },
      { firstName: "Jake", lastName: "Rogers", position: "C", bats: "R", throws_: "R", number: 34 },
    ],
    CHW: [
      { firstName: "Luis", lastName: "Robert Jr.", position: "CF", bats: "R", throws_: "R", number: 88 },
      { firstName: "Andrew", lastName: "Vaughn", position: "1B", bats: "R", throws_: "R", number: 25 },
      { firstName: "Garrett", lastName: "Crochet", position: "SP", bats: "L", throws_: "L", number: 45 },
      { firstName: "Corey", lastName: "Julks", position: "RF", bats: "R", throws_: "R", number: 10 },
      { firstName: "Korey", lastName: "Lee", position: "C", bats: "R", throws_: "R", number: 38 },
    ],
    KCR: [
      { firstName: "Bobby", lastName: "Witt Jr.", position: "SS", bats: "R", throws_: "R", number: 7 },
      { firstName: "Salvador", lastName: "Perez", position: "C", bats: "R", throws_: "R", number: 13 },
      { firstName: "Cole", lastName: "Ragans", position: "SP", bats: "L", throws_: "L", number: 55 },
      { firstName: "Vinnie", lastName: "Pasquantino", position: "1B", bats: "L", throws_: "R", number: 9 },
      { firstName: "MJ", lastName: "Melendez", position: "LF", bats: "L", throws_: "R", number: 1 },
    ],
    HOU: [
      { firstName: "Yordan", lastName: "Alvarez", position: "DH", bats: "L", throws_: "L", number: 44 },
      { firstName: "Kyle", lastName: "Tucker", position: "RF", bats: "L", throws_: "R", number: 30 },
      { firstName: "Framber", lastName: "Valdez", position: "SP", bats: "L", throws_: "L", number: 59 },
      { firstName: "Alex", lastName: "Bregman", position: "3B", bats: "R", throws_: "R", number: 2 },
      { firstName: "Jeremy", lastName: "Pena", position: "SS", bats: "R", throws_: "R", number: 3 },
    ],
    SEA: [
      { firstName: "Julio", lastName: "Rodriguez", position: "CF", bats: "R", throws_: "R", number: 44 },
      { firstName: "Cal", lastName: "Raleigh", position: "C", bats: "S", throws_: "R", number: 29 },
      { firstName: "Logan", lastName: "Gilbert", position: "SP", bats: "R", throws_: "R", number: 36 },
      { firstName: "J.P.", lastName: "Crawford", position: "SS", bats: "L", throws_: "R", number: 3 },
      { firstName: "Mitch", lastName: "Haniger", position: "RF", bats: "R", throws_: "R", number: 17 },
    ],
    TEX: [
      { firstName: "Corey", lastName: "Seager", position: "SS", bats: "L", throws_: "R", number: 5 },
      { firstName: "Marcus", lastName: "Semien", position: "2B", bats: "R", throws_: "R", number: 2 },
      { firstName: "Nathan", lastName: "Eovaldi", position: "SP", bats: "R", throws_: "R", number: 17 },
      { firstName: "Adolis", lastName: "Garcia", position: "RF", bats: "R", throws_: "R", number: 53 },
      { firstName: "Jonah", lastName: "Heim", position: "C", bats: "S", throws_: "R", number: 28 },
    ],
    LAA: [
      { firstName: "Mike", lastName: "Trout", position: "CF", bats: "R", throws_: "R", number: 27 },
      { firstName: "Nolan", lastName: "Schanuel", position: "1B", bats: "L", throws_: "L", number: 18 },
      { firstName: "Tyler", lastName: "Anderson", position: "SP", bats: "L", throws_: "L", number: 31 },
      { firstName: "Zach", lastName: "Neto", position: "SS", bats: "R", throws_: "R", number: 9 },
      { firstName: "Logan", lastName: "O'Hoppe", position: "C", bats: "R", throws_: "R", number: 14 },
    ],
    OAK: [
      { firstName: "Lawrence", lastName: "Butler", position: "LF", bats: "L", throws_: "R", number: 4 },
      { firstName: "Zack", lastName: "Gelof", position: "2B", bats: "R", throws_: "R", number: 20 },
      { firstName: "Mason", lastName: "Miller", position: "CL", bats: "R", throws_: "R", number: 19 },
      { firstName: "JJ", lastName: "Bleday", position: "RF", bats: "L", throws_: "L", number: 33 },
      { firstName: "Shea", lastName: "Langeliers", position: "C", bats: "R", throws_: "R", number: 23 },
    ],
    ATL: [
      { firstName: "Ronald", lastName: "Acuna Jr.", position: "RF", bats: "R", throws_: "R", number: 13 },
      { firstName: "Matt", lastName: "Olson", position: "1B", bats: "L", throws_: "R", number: 28 },
      { firstName: "Spencer", lastName: "Strider", position: "SP", bats: "R", throws_: "R", number: 99 },
      { firstName: "Austin", lastName: "Riley", position: "3B", bats: "R", throws_: "R", number: 27 },
      { firstName: "Sean", lastName: "Murphy", position: "C", bats: "R", throws_: "R", number: 12 },
    ],
    PHI: [
      { firstName: "Bryce", lastName: "Harper", position: "1B", bats: "L", throws_: "R", number: 3 },
      { firstName: "Trea", lastName: "Turner", position: "SS", bats: "R", throws_: "R", number: 7 },
      { firstName: "Zack", lastName: "Wheeler", position: "SP", bats: "L", throws_: "R", number: 45 },
      { firstName: "Kyle", lastName: "Schwarber", position: "DH", bats: "L", throws_: "R", number: 12 },
      { firstName: "J.T.", lastName: "Realmuto", position: "C", bats: "R", throws_: "R", number: 10 },
    ],
    NYM: [
      { firstName: "Francisco", lastName: "Lindor", position: "SS", bats: "S", throws_: "R", number: 12 },
      { firstName: "Pete", lastName: "Alonso", position: "1B", bats: "R", throws_: "R", number: 20 },
      { firstName: "Kodai", lastName: "Senga", position: "SP", bats: "L", throws_: "R", number: 34 },
      { firstName: "Brandon", lastName: "Nimmo", position: "LF", bats: "L", throws_: "R", number: 9 },
      { firstName: "Francisco", lastName: "Alvarez", position: "C", bats: "R", throws_: "R", number: 4 },
    ],
    MIA: [
      { firstName: "Jazz", lastName: "Chisholm Jr.", position: "CF", bats: "L", throws_: "R", number: 2 },
      { firstName: "Jesus", lastName: "Sanchez", position: "RF", bats: "L", throws_: "R", number: 7 },
      { firstName: "Sandy", lastName: "Alcantara", position: "SP", bats: "R", throws_: "R", number: 22 },
      { firstName: "Xavier", lastName: "Edwards", position: "SS", bats: "S", throws_: "R", number: 1 },
      { firstName: "Nick", lastName: "Fortes", position: "C", bats: "R", throws_: "R", number: 84 },
    ],
    WSH: [
      { firstName: "CJ", lastName: "Abrams", position: "SS", bats: "L", throws_: "R", number: 5 },
      { firstName: "James", lastName: "Wood", position: "CF", bats: "L", throws_: "R", number: 29 },
      { firstName: "MacKenzie", lastName: "Gore", position: "SP", bats: "L", throws_: "L", number: 1 },
      { firstName: "Dylan", lastName: "Crews", position: "RF", bats: "R", throws_: "R", number: 21 },
      { firstName: "Keibert", lastName: "Ruiz", position: "C", bats: "S", throws_: "R", number: 20 },
    ],
    MIL: [
      { firstName: "Willy", lastName: "Adames", position: "SS", bats: "R", throws_: "R", number: 27 },
      { firstName: "Christian", lastName: "Yelich", position: "LF", bats: "L", throws_: "R", number: 22 },
      { firstName: "Freddy", lastName: "Peralta", position: "SP", bats: "R", throws_: "R", number: 51 },
      { firstName: "William", lastName: "Contreras", position: "C", bats: "R", throws_: "R", number: 24 },
      { firstName: "Jackson", lastName: "Chourio", position: "CF", bats: "R", throws_: "R", number: 11 },
    ],
    CHC: [
      { firstName: "Dansby", lastName: "Swanson", position: "SS", bats: "R", throws_: "R", number: 7 },
      { firstName: "Ian", lastName: "Happ", position: "LF", bats: "S", throws_: "R", number: 8 },
      { firstName: "Justin", lastName: "Steele", position: "SP", bats: "L", throws_: "L", number: 35 },
      { firstName: "Nico", lastName: "Hoerner", position: "2B", bats: "R", throws_: "R", number: 2 },
      { firstName: "Miguel", lastName: "Amaya", position: "C", bats: "R", throws_: "R", number: 9 },
    ],
    STL: [
      { firstName: "Nolan", lastName: "Arenado", position: "3B", bats: "R", throws_: "R", number: 28 },
      { firstName: "Masyn", lastName: "Winn", position: "SS", bats: "R", throws_: "R", number: 0 },
      { firstName: "Sonny", lastName: "Gray", position: "SP", bats: "R", throws_: "R", number: 54 },
      { firstName: "Willson", lastName: "Contreras", position: "C", bats: "R", throws_: "R", number: 40 },
      { firstName: "Lars", lastName: "Nootbaar", position: "RF", bats: "L", throws_: "R", number: 21 },
    ],
    PIT: [
      { firstName: "Bryan", lastName: "Reynolds", position: "CF", bats: "S", throws_: "R", number: 10 },
      { firstName: "Ke'Bryan", lastName: "Hayes", position: "3B", bats: "R", throws_: "R", number: 13 },
      { firstName: "Mitch", lastName: "Keller", position: "SP", bats: "R", throws_: "R", number: 23 },
      { firstName: "Oneil", lastName: "Cruz", position: "SS", bats: "L", throws_: "R", number: 15 },
      { firstName: "Henry", lastName: "Davis", position: "C", bats: "R", throws_: "R", number: 32 },
    ],
    CIN: [
      { firstName: "Elly", lastName: "De La Cruz", position: "SS", bats: "S", throws_: "R", number: 44 },
      { firstName: "Spencer", lastName: "Steer", position: "3B", bats: "R", throws_: "R", number: 7 },
      { firstName: "Hunter", lastName: "Greene", position: "SP", bats: "R", throws_: "R", number: 21 },
      { firstName: "Tyler", lastName: "Stephenson", position: "C", bats: "R", throws_: "R", number: 37 },
      { firstName: "TJ", lastName: "Friedl", position: "CF", bats: "L", throws_: "L", number: 29 },
    ],
    LAD: [
      { firstName: "Mookie", lastName: "Betts", position: "SS", bats: "R", throws_: "R", number: 50 },
      { firstName: "Freddie", lastName: "Freeman", position: "1B", bats: "L", throws_: "R", number: 5 },
      { firstName: "Yoshinobu", lastName: "Yamamoto", position: "SP", bats: "R", throws_: "R", number: 18 },
      { firstName: "Shohei", lastName: "Ohtani", position: "DH", bats: "L", throws_: "R", number: 17 },
      { firstName: "Will", lastName: "Smith", position: "C", bats: "R", throws_: "R", number: 16 },
    ],
    SDP: [
      { firstName: "Fernando", lastName: "Tatis Jr.", position: "RF", bats: "R", throws_: "R", number: 23 },
      { firstName: "Manny", lastName: "Machado", position: "3B", bats: "R", throws_: "R", number: 13 },
      { firstName: "Yu", lastName: "Darvish", position: "SP", bats: "R", throws_: "R", number: 11 },
      { firstName: "Ha-Seong", lastName: "Kim", position: "SS", bats: "R", throws_: "R", number: 7 },
      { firstName: "Luis", lastName: "Campusano", position: "C", bats: "R", throws_: "R", number: 39 },
    ],
    ARI: [
      { firstName: "Ketel", lastName: "Marte", position: "2B", bats: "S", throws_: "R", number: 4 },
      { firstName: "Corbin", lastName: "Carroll", position: "CF", bats: "L", throws_: "L", number: 7 },
      { firstName: "Zac", lastName: "Gallen", position: "SP", bats: "R", throws_: "R", number: 23 },
      { firstName: "Christian", lastName: "Walker", position: "1B", bats: "R", throws_: "R", number: 53 },
      { firstName: "Gabriel", lastName: "Moreno", position: "C", bats: "R", throws_: "R", number: 14 },
    ],
    SFG: [
      { firstName: "Matt", lastName: "Chapman", position: "3B", bats: "R", throws_: "R", number: 26 },
      { firstName: "Jung Hoo", lastName: "Lee", position: "CF", bats: "L", throws_: "L", number: 51 },
      { firstName: "Logan", lastName: "Webb", position: "SP", bats: "R", throws_: "R", number: 62 },
      { firstName: "LaMonte", lastName: "Wade Jr.", position: "1B", bats: "L", throws_: "L", number: 31 },
      { firstName: "Patrick", lastName: "Bailey", position: "C", bats: "S", throws_: "R", number: 14 },
    ],
    COL: [
      { firstName: "Ezequiel", lastName: "Tovar", position: "SS", bats: "R", throws_: "R", number: 14 },
      { firstName: "Brenton", lastName: "Doyle", position: "CF", bats: "R", throws_: "R", number: 35 },
      { firstName: "Kyle", lastName: "Freeland", position: "SP", bats: "L", throws_: "L", number: 21 },
      { firstName: "Ryan", lastName: "McMahon", position: "3B", bats: "L", throws_: "R", number: 24 },
      { firstName: "Elias", lastName: "Diaz", position: "C", bats: "R", throws_: "R", number: 35 },
    ],
  };

  let extId = 100001;
  const allPlayerOps = Object.entries(playersByTeam).flatMap(([abbr, players]) =>
    players.map((p) =>
      prisma.player.create({
        data: {
          externalId: String(extId++),
          firstName: p.firstName,
          lastName: p.lastName,
          teamId: teamMap[abbr].id,
          position: p.position,
          bats: p.bats,
          throws_: p.throws_,
          number: p.number,
          isActive: true,
        },
      })
    )
  );
  await prisma.$transaction(allPlayerOps);

  // ── Games ──────────────────────────────────────────

  const venues: Record<string, string> = {
    NYY: "Yankee Stadium",
    BOS: "Fenway Park",
    LAD: "Dodger Stadium",
    CHC: "Wrigley Field",
    HOU: "Minute Maid Park",
    ATL: "Truist Park",
    PHI: "Citizens Bank Park",
    SFG: "Oracle Park",
    STL: "Busch Stadium",
    SEA: "T-Mobile Park",
    MIN: "Target Field",
    MIL: "American Family Field",
    ARI: "Chase Field",
    TEX: "Globe Life Field",
    SDP: "Petco Park",
  };

  interface GameSeed {
    externalId: string;
    home: string;
    away: string;
    date: Date;
    status: "FINAL" | "LIVE" | "SCHEDULED";
    homeScore: number;
    awayScore: number;
    inning?: number;
    inningHalf?: "TOP" | "BOTTOM";
    outs?: number;
    startTime: string;
    venue: string;
  }

  const gamesData: GameSeed[] = [
    // FINAL games (past)
    { externalId: "MLB2026040101", home: "NYY", away: "BOS", date: new Date("2026-04-01T23:05:00Z"), status: "FINAL", homeScore: 5, awayScore: 3, startTime: "7:05 PM ET", venue: venues.NYY },
    { externalId: "MLB2026040102", home: "LAD", away: "SDP", date: new Date("2026-04-01T02:10:00Z"), status: "FINAL", homeScore: 8, awayScore: 2, startTime: "10:10 PM ET", venue: venues.LAD },
    { externalId: "MLB2026040201", home: "HOU", away: "TEX", date: new Date("2026-04-02T00:10:00Z"), status: "FINAL", homeScore: 4, awayScore: 6, startTime: "8:10 PM ET", venue: venues.HOU },
    { externalId: "MLB2026040202", home: "ATL", away: "PHI", date: new Date("2026-04-02T23:20:00Z"), status: "FINAL", homeScore: 3, awayScore: 3, startTime: "7:20 PM ET", venue: venues.ATL },
    { externalId: "MLB2026040301", home: "CHC", away: "STL", date: new Date("2026-04-03T00:20:00Z"), status: "FINAL", homeScore: 7, awayScore: 1, startTime: "8:20 PM ET", venue: venues.CHC },
    // LIVE games
    { externalId: "MLB2026040401", home: "SFG", away: "ARI", date: new Date("2026-04-04T02:45:00Z"), status: "LIVE", homeScore: 3, awayScore: 2, inning: 6, inningHalf: "BOTTOM", outs: 1, startTime: "9:45 PM ET", venue: venues.SFG },
    { externalId: "MLB2026040402", home: "SEA", away: "MIN", date: new Date("2026-04-04T02:10:00Z"), status: "LIVE", homeScore: 0, awayScore: 1, inning: 4, inningHalf: "TOP", outs: 2, startTime: "9:10 PM ET", venue: venues.SEA },
    { externalId: "MLB2026040403", home: "NYY", away: "BAL", date: new Date("2026-04-04T23:05:00Z"), status: "LIVE", homeScore: 6, awayScore: 4, inning: 7, inningHalf: "TOP", outs: 0, startTime: "7:05 PM ET", venue: venues.NYY },
    { externalId: "MLB2026040404", home: "MIL", away: "CIN", date: new Date("2026-04-04T00:10:00Z"), status: "LIVE", homeScore: 2, awayScore: 2, inning: 5, inningHalf: "BOTTOM", outs: 1, startTime: "8:10 PM ET", venue: venues.MIL },
    { externalId: "MLB2026040405", home: "LAD", away: "COL", date: new Date("2026-04-04T02:10:00Z"), status: "LIVE", homeScore: 5, awayScore: 0, inning: 3, inningHalf: "TOP", outs: 2, startTime: "10:10 PM ET", venue: venues.LAD },
    // SCHEDULED games (future)
    { externalId: "MLB2026040501", home: "BOS", away: "TBR", date: new Date("2026-04-05T17:10:00Z"), status: "SCHEDULED", homeScore: 0, awayScore: 0, startTime: "1:10 PM ET", venue: venues.BOS },
    { externalId: "MLB2026040502", home: "PHI", away: "NYM", date: new Date("2026-04-05T23:05:00Z"), status: "SCHEDULED", homeScore: 0, awayScore: 0, startTime: "7:05 PM ET", venue: venues.PHI },
    { externalId: "MLB2026040503", home: "HOU", away: "SEA", date: new Date("2026-04-06T00:10:00Z"), status: "SCHEDULED", homeScore: 0, awayScore: 0, startTime: "8:10 PM ET", venue: venues.HOU },
    { externalId: "MLB2026040504", home: "SDP", away: "LAD", date: new Date("2026-04-06T02:10:00Z"), status: "SCHEDULED", homeScore: 0, awayScore: 0, startTime: "10:10 PM ET", venue: venues.SDP },
    { externalId: "MLB2026040505", home: "TEX", away: "ATL", date: new Date("2026-04-07T00:05:00Z"), status: "SCHEDULED", homeScore: 0, awayScore: 0, startTime: "8:05 PM ET", venue: venues.TEX },
  ];

  const games = await prisma.$transaction(
    gamesData.map((g) =>
      prisma.game.create({
        data: {
          externalId: g.externalId,
          homeTeamId: teamMap[g.home].id,
          awayTeamId: teamMap[g.away].id,
          date: g.date,
          status: g.status,
          homeScore: g.homeScore,
          awayScore: g.awayScore,
          inning: g.inning ?? null,
          inningHalf: g.inningHalf ?? null,
          outs: g.outs ?? 0,
          startTime: g.startTime,
          venue: g.venue,
        },
      })
    )
  );

  const gameMap = Object.fromEntries(games.map((g) => [g.externalId, g]));

  // ── Game Innings (for FINAL games) ─────────────────

  // Realistic inning-by-inning scores that add up to final totals
  const inningScores: Record<string, { home: number[]; away: number[] }> = {
    MLB2026040101: { home: [0, 1, 0, 2, 0, 0, 1, 1, 0], away: [1, 0, 0, 0, 2, 0, 0, 0, 0] }, // 5-3
    MLB2026040102: { home: [2, 0, 1, 0, 3, 0, 2, 0, 0], away: [0, 0, 1, 0, 0, 1, 0, 0, 0] }, // 8-2
    MLB2026040201: { home: [0, 1, 0, 0, 2, 0, 1, 0, 0], away: [2, 0, 0, 1, 0, 0, 3, 0, 0] }, // 4-6
    MLB2026040202: { home: [0, 0, 1, 0, 0, 2, 0, 0, 0], away: [0, 1, 0, 0, 0, 0, 2, 0, 0] }, // 3-3
    MLB2026040301: { home: [3, 0, 0, 2, 0, 0, 1, 1, 0], away: [0, 0, 1, 0, 0, 0, 0, 0, 0] }, // 7-1
  };

  const inningOps = Object.entries(inningScores).flatMap(([extGameId, scores]) =>
    scores.home.map((_, i) =>
      prisma.gameInning.create({
        data: {
          gameId: gameMap[extGameId].id,
          inningNumber: i + 1,
          homeRuns: scores.home[i],
          awayRuns: scores.away[i],
        },
      })
    )
  );
  await prisma.$transaction(inningOps);

  // ── Betting Lines ──────────────────────────────────

  const linesData: { gameExtId: string; homeML: number; awayML: number; total: number; rlHome: number; rlAway: number; over: number; under: number }[] = [
    { gameExtId: "MLB2026040101", homeML: -155, awayML: 135, total: 8.5, rlHome: -125, rlAway: 105, over: -110, under: -110 },
    { gameExtId: "MLB2026040102", homeML: -210, awayML: 175, total: 7.5, rlHome: -145, rlAway: 125, over: -105, under: -115 },
    { gameExtId: "MLB2026040201", homeML: -130, awayML: 110, total: 9.0, rlHome: -110, rlAway: -110, over: -110, under: -110 },
    { gameExtId: "MLB2026040202", homeML: -140, awayML: 120, total: 8.0, rlHome: -120, rlAway: 100, over: -115, under: -105 },
    { gameExtId: "MLB2026040301", homeML: 105, awayML: -115, total: 8.5, rlHome: 140, rlAway: -160, over: -110, under: -110 },
    { gameExtId: "MLB2026040401", homeML: -120, awayML: 100, total: 7.5, rlHome: -105, rlAway: -115, over: -110, under: -110 },
    { gameExtId: "MLB2026040402", homeML: -150, awayML: 130, total: 7.0, rlHome: -120, rlAway: 100, over: -105, under: -115 },
    { gameExtId: "MLB2026040403", homeML: -175, awayML: 150, total: 9.0, rlHome: -140, rlAway: 120, over: -110, under: -110 },
    { gameExtId: "MLB2026040404", homeML: -135, awayML: 115, total: 8.0, rlHome: -115, rlAway: -105, over: -110, under: -110 },
    { gameExtId: "MLB2026040405", homeML: -250, awayML: 210, total: 8.5, rlHome: -165, rlAway: 145, over: -115, under: -105 },
    { gameExtId: "MLB2026040501", homeML: -145, awayML: 125, total: 8.0, rlHome: -120, rlAway: 100, over: -110, under: -110 },
    { gameExtId: "MLB2026040502", homeML: -130, awayML: 110, total: 7.5, rlHome: -110, rlAway: -110, over: -105, under: -115 },
    { gameExtId: "MLB2026040503", homeML: -160, awayML: 140, total: 8.5, rlHome: -130, rlAway: 110, over: -110, under: -110 },
    { gameExtId: "MLB2026040504", homeML: 115, awayML: -135, total: 8.0, rlHome: 145, rlAway: -165, over: -110, under: -110 },
    { gameExtId: "MLB2026040505", homeML: -125, awayML: 105, total: 9.0, rlHome: -105, rlAway: -115, over: -115, under: -105 },
  ];

  await prisma.$transaction(
    linesData.map((l) =>
      prisma.bettingLine.create({
        data: {
          gameId: gameMap[l.gameExtId].id,
          source: "DraftKings",
          homeMoneyline: l.homeML,
          awayMoneyline: l.awayML,
          runLineSpread: -1.5,
          runLineHome: l.rlHome,
          runLineAway: l.rlAway,
          totalLine: l.total,
          overOdds: l.over,
          underOdds: l.under,
        },
      })
    )
  );

  // ── Picks ──────────────────────────────────────────

  const picksData: {
    tipster: string;
    gameExtId: string;
    pickType: "MONEYLINE" | "RUNLINE" | "TOTAL" | "PROP" | "PARLAY";
    selection: string;
    odds: number;
    stake: number;
    analysis: string;
    result: "WIN" | "LOSS" | "PUSH" | "PENDING" | "VOID";
    profit: number;
  }[] = [
    // Admin tipster picks (15)
    { tipster: "admin", gameExtId: "MLB2026040101", pickType: "MONEYLINE", selection: "NYY ML", odds: -155, stake: 3, analysis: "Cole en la loma en casa contra un lineup de Boston que viene frío. Los Yankees son 8-2 en sus últimos 10 en casa y Cole tiene ERA de 2.10 vs BOS en carrera. Apuesta de confianza media.", result: "WIN", profit: 1.94 },
    { tipster: "admin", gameExtId: "MLB2026040101", pickType: "TOTAL", selection: "Over 8.5", odds: -110, stake: 2, analysis: "Ambos bullpens vienen cargados de trabajo en la serie anterior. El viento sopla hacia afuera en Yankee Stadium hoy. Esperamos ofensiva.", result: "LOSS", profit: -2.0 },
    { tipster: "admin", gameExtId: "MLB2026040102", pickType: "RUNLINE", selection: "LAD -1.5", odds: -145, stake: 4, analysis: "Yamamoto domina a los Padres, con 18K en sus últimas 2 salidas contra SDP. Dodgers ofensiva imparable en casa, promedio de 6.2 carreras en últimos 10 juegos como locales.", result: "WIN", profit: 2.76 },
    { tipster: "admin", gameExtId: "MLB2026040201", pickType: "MONEYLINE", selection: "HOU ML", odds: -130, stake: 3, analysis: "Valdez en la loma en Minute Maid. Historial dominante contra Texas con 3-0 en últimas 3 salidas. Houston 7-1 en casa en abril.", result: "LOSS", profit: -3.0 },
    { tipster: "admin", gameExtId: "MLB2026040202", pickType: "MONEYLINE", selection: "ATL ML", odds: -140, stake: 2, analysis: "Atlanta en casa con Strider regresando de IL. Lineup completo con Acuña de vuelta. Phillies sin Wheeler por descanso programado.", result: "PUSH", profit: 0 },
    { tipster: "admin", gameExtId: "MLB2026040301", pickType: "MONEYLINE", selection: "CHC ML", odds: 105, stake: 5, analysis: "Gran valor en los Cubs como ligeros underdogs. Steele ha sido el mejor pitcher zurdo de la NL Central, y los Cardinals cometen errores defensivos. Wrigley a favor.", result: "WIN", profit: 5.25 },
    { tipster: "admin", gameExtId: "MLB2026040301", pickType: "TOTAL", selection: "Under 8.5", odds: -110, stake: 2, analysis: "Steele y Gray son dos pitchers de contacto bajo. Ambos bullpens frescos. Condiciones frías reducen poder ofensivo.", result: "WIN", profit: 1.82 },
    { tipster: "admin", gameExtId: "MLB2026040401", pickType: "MONEYLINE", selection: "SFG ML", odds: -120, stake: 3, analysis: "Webb en casa es otro nivel. Oracle Park favorece al pitcheo y Arizona viene de una serie de 4 juegos agotadora. Giants 6-2 en últimos 8 en casa.", result: "PENDING", profit: 0 },
    { tipster: "admin", gameExtId: "MLB2026040402", pickType: "TOTAL", selection: "Under 7.0", odds: -115, stake: 2, analysis: "Gilbert vs López es duelo de pitchers élite. T-Mobile Park deprime ofensiva. Esperamos máximo 5 carreras combinadas.", result: "PENDING", profit: 0 },
    { tipster: "admin", gameExtId: "MLB2026040403", pickType: "RUNLINE", selection: "NYY -1.5", odds: -140, stake: 4, analysis: "Yankees en racha de 5 victorias. Cole contra un pitcheo débil de Baltimore. Lineup de NYY con Judge, Soto conectados. Victoria holgada esperada.", result: "PENDING", profit: 0 },
    { tipster: "admin", gameExtId: "MLB2026040501", pickType: "MONEYLINE", selection: "BOS ML", odds: -145, stake: 3, analysis: "Bello en Fenway con récord de 5-1 y ERA 2.80 en casa. Tampa viene con lineup diezmado por lesiones. Red Sox favoritos claros.", result: "PENDING", profit: 0 },
    { tipster: "admin", gameExtId: "MLB2026040502", pickType: "PROP", selection: "Lindor Over 1.5 Hits", odds: 120, stake: 2, analysis: "Lindor batea .380 contra pitcheo zurdo y hoy enfrenta al zurdo de Philly. En sus últimos 7 juegos tiene 13 hits. Prop con valor.", result: "PENDING", profit: 0 },
    { tipster: "admin", gameExtId: "MLB2026040503", pickType: "MONEYLINE", selection: "HOU ML", odds: -160, stake: 3, analysis: "Astros dominan en Minute Maid vs Seattle con récord de 8-2 en últimos 10. Valdez en la loma con 4-0 en casa esta temporada.", result: "PENDING", profit: 0 },
    { tipster: "admin", gameExtId: "MLB2026040504", pickType: "RUNLINE", selection: "LAD -1.5", odds: -165, stake: 2, analysis: "Dodgers con Yamamoto contra un Colorado que permite 6+ carreras por juego en la ruta. Petco favorece al pitcheo pero la ofensiva de LAD es élite.", result: "PENDING", profit: 0 },
    { tipster: "admin", gameExtId: "MLB2026040505", pickType: "TOTAL", selection: "Over 9.0", odds: -115, stake: 3, analysis: "Globe Life Field es un parque de bateadores. Ambos equipos promedian 5+ carreras en la temporada. Pitchers abridores con ERA alta en la ruta.", result: "PENDING", profit: 0 },
    // Pro tipster picks (15)
    { tipster: "pro", gameExtId: "MLB2026040101", pickType: "RUNLINE", selection: "NYY -1.5", odds: -125, stake: 4, analysis: "Cole con WHIP de 0.89 contra Boston. Yankees lineup profundo y bullpen descansado. Esperamos victoria por 2+. Alto nivel de confianza.", result: "WIN", profit: 3.2 },
    { tipster: "pro", gameExtId: "MLB2026040102", pickType: "MONEYLINE", selection: "LAD ML", odds: -210, stake: 5, analysis: "Yamamoto es inbateable en Dodger Stadium. Padres con bullpen agotado después de extras ayer. LAD 12-1 en últimos 13 como favoritos de -200+.", result: "WIN", profit: 2.38 },
    { tipster: "pro", gameExtId: "MLB2026040102", pickType: "PROP", selection: "Ohtani Over 1.5 Total Bases", odds: -130, stake: 3, analysis: "Ohtani destroza a los zurdos con OPS de 1.150. Hoy enfrenta al zurdo de SDP. Espero doble o cuadrangular mínimo.", result: "WIN", profit: 2.31 },
    { tipster: "pro", gameExtId: "MLB2026040201", pickType: "MONEYLINE", selection: "TEX ML", odds: 110, stake: 3, analysis: "Rangers como underdogs en Houston tienen valor. Eovaldi domina en la postemporada mental y las primeras semanas de abril. Texas 5-2 en últimos 7 como visitantes.", result: "WIN", profit: 3.3 },
    { tipster: "pro", gameExtId: "MLB2026040202", pickType: "TOTAL", selection: "Under 8.0", odds: -105, stake: 2, analysis: "Strider y Wheeler equivalente en poder. Truist Park favorece pitcheo nocturno. Línea 8 es alta para este duelo élite.", result: "WIN", profit: 1.9 },
    { tipster: "pro", gameExtId: "MLB2026040301", pickType: "MONEYLINE", selection: "CHC ML", odds: 105, stake: 4, analysis: "Steele con 2.40 ERA en abril en carrera. Cardinals con el peor record de bateo en clima frío. Wrigley Field factor intimidante. Gran valor.", result: "WIN", profit: 4.2 },
    { tipster: "pro", gameExtId: "MLB2026040301", pickType: "RUNLINE", selection: "CHC -1.5", odds: 155, stake: 2, analysis: "Si los Cubs ganan, será por paliza. Steele domina y el bullpen de STL es el peor de la división. Apuesta arriesgada pero con gran payout.", result: "WIN", profit: 3.1 },
    { tipster: "pro", gameExtId: "MLB2026040401", pickType: "TOTAL", selection: "Under 7.5", odds: -110, stake: 3, analysis: "Webb y Gallen son dos ases. Oracle Park depress bateo a diestra. Ambos bullpens top 5 en la liga. Juego bajo y cerrado.", result: "PENDING", profit: 0 },
    { tipster: "pro", gameExtId: "MLB2026040403", pickType: "MONEYLINE", selection: "NYY ML", odds: -175, stake: 5, analysis: "Yankees con momentum de 5 victorias seguidas. Cole la figura de los Yanquis en casa. Baltimore sin su ace. Apuesta segura de alto stake.", result: "PENDING", profit: 0 },
    { tipster: "pro", gameExtId: "MLB2026040404", pickType: "MONEYLINE", selection: "MIL ML", odds: -135, stake: 3, analysis: "Peralta dominant en American Family Field. Reds con el peor bullpen ERA de la liga. Brewers en racha de 4 victorias.", result: "PENDING", profit: 0 },
    { tipster: "pro", gameExtId: "MLB2026040405", pickType: "RUNLINE", selection: "LAD -1.5", odds: -165, stake: 4, analysis: "Dodgers aplastan a Colorado en casa. Yamamoto con 25K en últimas 3 salidas. Rockies con ERA de equipo de 6.20 en la ruta. Paliza anunciada.", result: "PENDING", profit: 0 },
    { tipster: "pro", gameExtId: "MLB2026040501", pickType: "TOTAL", selection: "Over 8.0", odds: -110, stake: 2, analysis: "Fenway Park siempre genera carreras. Bello ha permitido hits en primeras entradas. Tampa necesita batear para ganar. Juego ofensivo.", result: "PENDING", profit: 0 },
    { tipster: "pro", gameExtId: "MLB2026040503", pickType: "MONEYLINE", selection: "SEA ML", odds: 140, stake: 2, analysis: "Mariners como underdogs con valor. Gilbert lanza gema en Houston con ERA de 1.80 en últimas 4 salidas en ruta. Seattle callado pero peligroso.", result: "PENDING", profit: 0 },
    { tipster: "pro", gameExtId: "MLB2026040504", pickType: "PARLAY", selection: "LAD ML + Over 8.0", odds: 210, stake: 2, analysis: "Parlay de Dodgers ganando y juego ofensivo. LAD anota 6+ contra Colorado regularmente. Petco no es factor suficiente para frenar esta ofensiva.", result: "PENDING", profit: 0 },
    { tipster: "pro", gameExtId: "MLB2026040505", pickType: "MONEYLINE", selection: "ATL ML", odds: 105, stake: 3, analysis: "Braves como ligeros underdogs en Texas tienen valor tremendo. Strider de vuelta lanzando fuego. Atlanta 9-3 en últimos 12 como visitantes. Valor puro.", result: "PENDING", profit: 0 },
  ];

  await prisma.$transaction(
    picksData.map((p) =>
      prisma.pick.create({
        data: {
          tipsterId: p.tipster === "admin" ? admin.id : proTipster.id,
          gameId: gameMap[p.gameExtId].id,
          pickType: p.pickType,
          selection: p.selection,
          odds: p.odds,
          stake: p.stake,
          analysis: p.analysis,
          result: p.result,
          profit: p.profit,
          resolvedAt: ["WIN", "LOSS", "PUSH", "VOID"].includes(p.result) ? new Date() : null,
        },
      })
    )
  );

  // ── Streaks ────────────────────────────────────────

  await prisma.$transaction([
    prisma.streak.create({
      data: {
        userId: admin.id,
        type: "CURRENT",
        count: 3,
        startDate: new Date("2026-04-01"),
        isActive: true,
      },
    }),
    prisma.streak.create({
      data: {
        userId: admin.id,
        type: "BEST",
        count: 8,
        startDate: new Date("2026-03-15"),
        endDate: new Date("2026-03-25"),
        isActive: false,
      },
    }),
    prisma.streak.create({
      data: {
        userId: proTipster.id,
        type: "CURRENT",
        count: 7,
        startDate: new Date("2026-03-28"),
        isActive: true,
      },
    }),
    prisma.streak.create({
      data: {
        userId: proTipster.id,
        type: "BEST",
        count: 12,
        startDate: new Date("2026-03-10"),
        endDate: new Date("2026-03-26"),
        isActive: false,
      },
    }),
  ]);

  console.log("Seed completed successfully!");
  console.log(`  - 3 users`);
  console.log(`  - 30 teams`);
  console.log(`  - 150 players`);
  console.log(`  - 15 games`);
  console.log(`  - 45 game innings`);
  console.log(`  - 15 betting lines`);
  console.log(`  - 30 picks`);
  console.log(`  - 4 streaks`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
