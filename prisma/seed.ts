import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ── Clean existing data ──────────────────────────────
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

  const hash = await bcrypt.hash("profundo123", 10);

  // ── Users ────────────────────────────────────────────
  const users = await prisma.$transaction([
    prisma.user.create({
      data: {
        email: "profeta@aloprofundo.com",
        username: "el_profeta",
        password: hash,
        displayName: "El Profeta",
        avatar: "\u{1F52E}",
        role: "ADMIN",
      },
    }),
    prisma.user.create({
      data: {
        email: "batflip@aloprofundo.com",
        username: "batflip_king",
        password: hash,
        displayName: "BatFlip King",
        avatar: "\u{1F451}",
        role: "TIPSTER",
      },
    }),
    prisma.user.create({
      data: {
        email: "joe@aloprofundo.com",
        username: "sabermetrics_joe",
        password: hash,
        displayName: "Sabermetrics Joe",
        avatar: "\u{1F9EE}",
        role: "TIPSTER",
      },
    }),
    prisma.user.create({
      data: {
        email: "maquina@aloprofundo.com",
        username: "la_maquina",
        password: hash,
        displayName: "La M\u00e1quina",
        avatar: "\u2699\uFE0F",
        role: "TIPSTER",
      },
    }),
    prisma.user.create({
      data: {
        email: "zurdo@aloprofundo.com",
        username: "el_zurdo",
        password: hash,
        displayName: "El Zurdo",
        avatar: "\u{1FAF2}",
        role: "TIPSTER",
      },
    }),
    prisma.user.create({
      data: {
        email: "fan@aloprofundo.com",
        username: "fan_casual",
        password: hash,
        displayName: "Fan Casual",
        avatar: "\u26BE",
        role: "USER",
      },
    }),
  ]);

  const [profeta, batflip, joe, maquina, zurdo] = users;

  // ── Teams ────────────────────────────────────────────
  const teamData = [
    { abbreviation: "NYY", name: "Yankees", city: "New York", league: "AL" as const, division: "EAST" as const, primaryColor: "#003087", secondaryColor: "#C4CED4" },
    { abbreviation: "BOS", name: "Red Sox", city: "Boston", league: "AL" as const, division: "EAST" as const, primaryColor: "#BD3039", secondaryColor: "#0C2340" },
    { abbreviation: "BAL", name: "Orioles", city: "Baltimore", league: "AL" as const, division: "EAST" as const, primaryColor: "#DF4601", secondaryColor: "#27251F" },
    { abbreviation: "TBR", name: "Rays", city: "Tampa Bay", league: "AL" as const, division: "EAST" as const, primaryColor: "#092C5C", secondaryColor: "#8FBCE6" },
    { abbreviation: "TOR", name: "Blue Jays", city: "Toronto", league: "AL" as const, division: "EAST" as const, primaryColor: "#134A8E", secondaryColor: "#E8291C" },
    { abbreviation: "CLE", name: "Guardians", city: "Cleveland", league: "AL" as const, division: "CENTRAL" as const, primaryColor: "#00385D", secondaryColor: "#E31937" },
    { abbreviation: "CHW", name: "White Sox", city: "Chicago", league: "AL" as const, division: "CENTRAL" as const, primaryColor: "#27251F", secondaryColor: "#C4CED4" },
    { abbreviation: "DET", name: "Tigers", city: "Detroit", league: "AL" as const, division: "CENTRAL" as const, primaryColor: "#0C2340", secondaryColor: "#FA4616" },
    { abbreviation: "KCR", name: "Royals", city: "Kansas City", league: "AL" as const, division: "CENTRAL" as const, primaryColor: "#004687", secondaryColor: "#BD9B60" },
    { abbreviation: "MIN", name: "Twins", city: "Minnesota", league: "AL" as const, division: "CENTRAL" as const, primaryColor: "#002B5C", secondaryColor: "#D31145" },
    { abbreviation: "HOU", name: "Astros", city: "Houston", league: "AL" as const, division: "WEST" as const, primaryColor: "#002D62", secondaryColor: "#EB6E1F" },
    { abbreviation: "LAA", name: "Angels", city: "Los Angeles", league: "AL" as const, division: "WEST" as const, primaryColor: "#BA0021", secondaryColor: "#003263" },
    { abbreviation: "OAK", name: "Athletics", city: "Oakland", league: "AL" as const, division: "WEST" as const, primaryColor: "#003831", secondaryColor: "#EFB21E" },
    { abbreviation: "SEA", name: "Mariners", city: "Seattle", league: "AL" as const, division: "WEST" as const, primaryColor: "#0C2C56", secondaryColor: "#005C5C" },
    { abbreviation: "TEX", name: "Rangers", city: "Texas", league: "AL" as const, division: "WEST" as const, primaryColor: "#003278", secondaryColor: "#C0111F" },
    { abbreviation: "ATL", name: "Braves", city: "Atlanta", league: "NL" as const, division: "EAST" as const, primaryColor: "#CE1141", secondaryColor: "#13274F" },
    { abbreviation: "MIA", name: "Marlins", city: "Miami", league: "NL" as const, division: "EAST" as const, primaryColor: "#00A3E0", secondaryColor: "#EF3340" },
    { abbreviation: "NYM", name: "Mets", city: "New York", league: "NL" as const, division: "EAST" as const, primaryColor: "#002D72", secondaryColor: "#FF5910" },
    { abbreviation: "PHI", name: "Phillies", city: "Philadelphia", league: "NL" as const, division: "EAST" as const, primaryColor: "#E81828", secondaryColor: "#002D72" },
    { abbreviation: "WSH", name: "Nationals", city: "Washington", league: "NL" as const, division: "EAST" as const, primaryColor: "#AB0003", secondaryColor: "#14225A" },
    { abbreviation: "CHC", name: "Cubs", city: "Chicago", league: "NL" as const, division: "CENTRAL" as const, primaryColor: "#0E3386", secondaryColor: "#CC3433" },
    { abbreviation: "CIN", name: "Reds", city: "Cincinnati", league: "NL" as const, division: "CENTRAL" as const, primaryColor: "#C6011F", secondaryColor: "#000000" },
    { abbreviation: "MIL", name: "Brewers", city: "Milwaukee", league: "NL" as const, division: "CENTRAL" as const, primaryColor: "#12284B", secondaryColor: "#FFC52F" },
    { abbreviation: "PIT", name: "Pirates", city: "Pittsburgh", league: "NL" as const, division: "CENTRAL" as const, primaryColor: "#27251F", secondaryColor: "#FDB827" },
    { abbreviation: "STL", name: "Cardinals", city: "St. Louis", league: "NL" as const, division: "CENTRAL" as const, primaryColor: "#C41E3A", secondaryColor: "#0C2340" },
    { abbreviation: "ARI", name: "Diamondbacks", city: "Arizona", league: "NL" as const, division: "WEST" as const, primaryColor: "#A71930", secondaryColor: "#E3D4AD" },
    { abbreviation: "COL", name: "Rockies", city: "Colorado", league: "NL" as const, division: "WEST" as const, primaryColor: "#33006F", secondaryColor: "#C4CED4" },
    { abbreviation: "LAD", name: "Dodgers", city: "Los Angeles", league: "NL" as const, division: "WEST" as const, primaryColor: "#005A9C", secondaryColor: "#EF3E42" },
    { abbreviation: "SDP", name: "Padres", city: "San Diego", league: "NL" as const, division: "WEST" as const, primaryColor: "#2F241D", secondaryColor: "#FFC425" },
    { abbreviation: "SFG", name: "Giants", city: "San Francisco", league: "NL" as const, division: "WEST" as const, primaryColor: "#FD5A1E", secondaryColor: "#27251F" },
  ];

  const teams: Record<string, any> = {};
  for (const t of teamData) {
    teams[t.abbreviation] = await prisma.team.create({
      data: {
        ...t,
        logoUrl: `/logos/${t.abbreviation.toLowerCase()}.svg`,
      },
    });
  }

  // ── Players (5 per team = 150) ───────────────────────
  const playersByTeam: Record<string, Array<{ firstName: string; lastName: string; position: string; bats: "L" | "R" | "S"; throws_: "L" | "R"; number: number }>> = {
    NYY: [
      { firstName: "Aaron", lastName: "Judge", position: "RF", bats: "R", throws_: "R", number: 99 },
      { firstName: "Juan", lastName: "Soto", position: "LF", bats: "L", throws_: "L", number: 22 },
      { firstName: "Gerrit", lastName: "Cole", position: "SP", bats: "R", throws_: "R", number: 45 },
      { firstName: "Jazz", lastName: "Chisholm", position: "3B", bats: "L", throws_: "R", number: 13 },
      { firstName: "Anthony", lastName: "Volpe", position: "SS", bats: "R", throws_: "R", number: 11 },
    ],
    BOS: [
      { firstName: "Rafael", lastName: "Devers", position: "3B", bats: "L", throws_: "R", number: 11 },
      { firstName: "Jarren", lastName: "Duran", position: "CF", bats: "L", throws_: "L", number: 16 },
      { firstName: "Brayan", lastName: "Bello", position: "SP", bats: "R", throws_: "R", number: 66 },
      { firstName: "Trevor", lastName: "Story", position: "SS", bats: "R", throws_: "R", number: 10 },
      { firstName: "Masataka", lastName: "Yoshida", position: "LF", bats: "L", throws_: "R", number: 7 },
    ],
    BAL: [
      { firstName: "Gunnar", lastName: "Henderson", position: "SS", bats: "L", throws_: "R", number: 2 },
      { firstName: "Adley", lastName: "Rutschman", position: "C", bats: "S", throws_: "R", number: 35 },
      { firstName: "Corbin", lastName: "Burnes", position: "SP", bats: "R", throws_: "R", number: 39 },
      { firstName: "Anthony", lastName: "Santander", position: "RF", bats: "S", throws_: "R", number: 25 },
      { firstName: "Ryan", lastName: "Mountcastle", position: "1B", bats: "R", throws_: "R", number: 6 },
    ],
    TBR: [
      { firstName: "Yandy", lastName: "Diaz", position: "1B", bats: "R", throws_: "R", number: 2 },
      { firstName: "Brandon", lastName: "Lowe", position: "2B", bats: "L", throws_: "R", number: 8 },
      { firstName: "Shane", lastName: "McClanahan", position: "SP", bats: "L", throws_: "L", number: 18 },
      { firstName: "Josh", lastName: "Lowe", position: "CF", bats: "L", throws_: "R", number: 15 },
      { firstName: "Randy", lastName: "Arozarena", position: "LF", bats: "R", throws_: "R", number: 56 },
    ],
    TOR: [
      { firstName: "Vladimir", lastName: "Guerrero Jr.", position: "1B", bats: "R", throws_: "R", number: 27 },
      { firstName: "Bo", lastName: "Bichette", position: "SS", bats: "R", throws_: "R", number: 11 },
      { firstName: "Kevin", lastName: "Gausman", position: "SP", bats: "R", throws_: "R", number: 34 },
      { firstName: "George", lastName: "Springer", position: "CF", bats: "R", throws_: "R", number: 4 },
      { firstName: "Daulton", lastName: "Varsho", position: "C", bats: "L", throws_: "R", number: 25 },
    ],
    CLE: [
      { firstName: "Jose", lastName: "Ramirez", position: "3B", bats: "S", throws_: "R", number: 11 },
      { firstName: "Steven", lastName: "Kwan", position: "LF", bats: "L", throws_: "L", number: 38 },
      { firstName: "Tanner", lastName: "Bibee", position: "SP", bats: "R", throws_: "R", number: 27 },
      { firstName: "Josh", lastName: "Naylor", position: "1B", bats: "L", throws_: "L", number: 22 },
      { firstName: "Andres", lastName: "Gimenez", position: "2B", bats: "L", throws_: "R", number: 0 },
    ],
    CHW: [
      { firstName: "Andrew", lastName: "Vaughn", position: "1B", bats: "R", throws_: "R", number: 25 },
      { firstName: "Luis", lastName: "Robert Jr.", position: "CF", bats: "R", throws_: "R", number: 88 },
      { firstName: "Garrett", lastName: "Crochet", position: "SP", bats: "L", throws_: "L", number: 45 },
      { firstName: "Colson", lastName: "Montgomery", position: "SS", bats: "L", throws_: "R", number: 2 },
      { firstName: "Eloy", lastName: "Jimenez", position: "DH", bats: "R", throws_: "R", number: 74 },
    ],
    DET: [
      { firstName: "Riley", lastName: "Greene", position: "CF", bats: "L", throws_: "L", number: 31 },
      { firstName: "Spencer", lastName: "Torkelson", position: "1B", bats: "R", throws_: "R", number: 20 },
      { firstName: "Tarik", lastName: "Skubal", position: "SP", bats: "L", throws_: "L", number: 29 },
      { firstName: "Matt", lastName: "Vierling", position: "RF", bats: "R", throws_: "R", number: 8 },
      { firstName: "Javier", lastName: "Baez", position: "SS", bats: "R", throws_: "R", number: 28 },
    ],
    KCR: [
      { firstName: "Bobby", lastName: "Witt Jr.", position: "SS", bats: "R", throws_: "R", number: 7 },
      { firstName: "Salvador", lastName: "Perez", position: "C", bats: "R", throws_: "R", number: 13 },
      { firstName: "Cole", lastName: "Ragans", position: "SP", bats: "L", throws_: "L", number: 55 },
      { firstName: "Vinnie", lastName: "Pasquantino", position: "1B", bats: "L", throws_: "R", number: 9 },
      { firstName: "MJ", lastName: "Melendez", position: "LF", bats: "L", throws_: "R", number: 1 },
    ],
    MIN: [
      { firstName: "Carlos", lastName: "Correa", position: "SS", bats: "R", throws_: "R", number: 4 },
      { firstName: "Byron", lastName: "Buxton", position: "CF", bats: "R", throws_: "R", number: 25 },
      { firstName: "Pablo", lastName: "Lopez", position: "SP", bats: "L", throws_: "R", number: 49 },
      { firstName: "Royce", lastName: "Lewis", position: "3B", bats: "R", throws_: "R", number: 23 },
      { firstName: "Edouard", lastName: "Julien", position: "2B", bats: "L", throws_: "R", number: 47 },
    ],
    HOU: [
      { firstName: "Yordan", lastName: "Alvarez", position: "DH", bats: "L", throws_: "R", number: 44 },
      { firstName: "Kyle", lastName: "Tucker", position: "RF", bats: "L", throws_: "R", number: 30 },
      { firstName: "Framber", lastName: "Valdez", position: "SP", bats: "L", throws_: "L", number: 59 },
      { firstName: "Alex", lastName: "Bregman", position: "3B", bats: "R", throws_: "R", number: 2 },
      { firstName: "Jose", lastName: "Altuve", position: "2B", bats: "R", throws_: "R", number: 27 },
    ],
    LAA: [
      { firstName: "Mike", lastName: "Trout", position: "CF", bats: "R", throws_: "R", number: 27 },
      { firstName: "Nolan", lastName: "Schanuel", position: "1B", bats: "L", throws_: "L", number: 18 },
      { firstName: "Tyler", lastName: "Anderson", position: "SP", bats: "L", throws_: "L", number: 31 },
      { firstName: "Zach", lastName: "Neto", position: "SS", bats: "R", throws_: "R", number: 9 },
      { firstName: "Logan", lastName: "O'Hoppe", position: "C", bats: "R", throws_: "R", number: 14 },
    ],
    OAK: [
      { firstName: "Brent", lastName: "Rooker", position: "DH", bats: "R", throws_: "R", number: 25 },
      { firstName: "JJ", lastName: "Bleday", position: "RF", bats: "L", throws_: "L", number: 33 },
      { firstName: "JP", lastName: "Sears", position: "SP", bats: "L", throws_: "L", number: 38 },
      { firstName: "Zack", lastName: "Gelof", position: "2B", bats: "R", throws_: "R", number: 20 },
      { firstName: "Lawrence", lastName: "Butler", position: "1B", bats: "L", throws_: "R", number: 4 },
    ],
    SEA: [
      { firstName: "Julio", lastName: "Rodriguez", position: "CF", bats: "R", throws_: "R", number: 44 },
      { firstName: "Cal", lastName: "Raleigh", position: "C", bats: "S", throws_: "R", number: 29 },
      { firstName: "Logan", lastName: "Gilbert", position: "SP", bats: "R", throws_: "R", number: 36 },
      { firstName: "JP", lastName: "Crawford", position: "SS", bats: "L", throws_: "R", number: 3 },
      { firstName: "Mitch", lastName: "Haniger", position: "RF", bats: "R", throws_: "R", number: 17 },
    ],
    TEX: [
      { firstName: "Corey", lastName: "Seager", position: "SS", bats: "L", throws_: "R", number: 5 },
      { firstName: "Marcus", lastName: "Semien", position: "2B", bats: "R", throws_: "R", number: 2 },
      { firstName: "Nathan", lastName: "Eovaldi", position: "SP", bats: "R", throws_: "R", number: 17 },
      { firstName: "Wyatt", lastName: "Langford", position: "LF", bats: "R", throws_: "R", number: 36 },
      { firstName: "Josh", lastName: "Jung", position: "3B", bats: "R", throws_: "R", number: 6 },
    ],
    ATL: [
      { firstName: "Ronald", lastName: "Acuna Jr.", position: "RF", bats: "R", throws_: "R", number: 13 },
      { firstName: "Matt", lastName: "Olson", position: "1B", bats: "L", throws_: "R", number: 28 },
      { firstName: "Spencer", lastName: "Strider", position: "SP", bats: "R", throws_: "R", number: 65 },
      { firstName: "Austin", lastName: "Riley", position: "3B", bats: "R", throws_: "R", number: 27 },
      { firstName: "Ozzie", lastName: "Albies", position: "2B", bats: "S", throws_: "R", number: 1 },
    ],
    MIA: [
      { firstName: "Jazz", lastName: "Chisholm Jr.", position: "CF", bats: "L", throws_: "R", number: 2 },
      { firstName: "Jesus", lastName: "Luzardo", position: "SP", bats: "L", throws_: "L", number: 44 },
      { firstName: "Bryan", lastName: "De La Cruz", position: "RF", bats: "R", throws_: "R", number: 14 },
      { firstName: "Jake", lastName: "Burger", position: "3B", bats: "R", throws_: "R", number: 36 },
      { firstName: "Xavier", lastName: "Edwards", position: "SS", bats: "S", throws_: "R", number: 9 },
    ],
    NYM: [
      { firstName: "Francisco", lastName: "Lindor", position: "SS", bats: "S", throws_: "R", number: 12 },
      { firstName: "Pete", lastName: "Alonso", position: "1B", bats: "R", throws_: "R", number: 20 },
      { firstName: "Kodai", lastName: "Senga", position: "SP", bats: "R", throws_: "R", number: 34 },
      { firstName: "Brandon", lastName: "Nimmo", position: "CF", bats: "L", throws_: "R", number: 9 },
      { firstName: "Mark", lastName: "Vientos", position: "3B", bats: "R", throws_: "R", number: 27 },
    ],
    PHI: [
      { firstName: "Bryce", lastName: "Harper", position: "1B", bats: "L", throws_: "R", number: 3 },
      { firstName: "Trea", lastName: "Turner", position: "SS", bats: "R", throws_: "R", number: 7 },
      { firstName: "Zack", lastName: "Wheeler", position: "SP", bats: "L", throws_: "R", number: 45 },
      { firstName: "Kyle", lastName: "Schwarber", position: "LF", bats: "L", throws_: "R", number: 12 },
      { firstName: "JT", lastName: "Realmuto", position: "C", bats: "R", throws_: "R", number: 10 },
    ],
    WSH: [
      { firstName: "CJ", lastName: "Abrams", position: "SS", bats: "L", throws_: "R", number: 5 },
      { firstName: "James", lastName: "Wood", position: "CF", bats: "L", throws_: "R", number: 29 },
      { firstName: "MacKenzie", lastName: "Gore", position: "SP", bats: "L", throws_: "L", number: 1 },
      { firstName: "Jesse", lastName: "Winker", position: "LF", bats: "L", throws_: "L", number: 6 },
      { firstName: "Keibert", lastName: "Ruiz", position: "C", bats: "S", throws_: "R", number: 20 },
    ],
    CHC: [
      { firstName: "Dansby", lastName: "Swanson", position: "SS", bats: "R", throws_: "R", number: 7 },
      { firstName: "Ian", lastName: "Happ", position: "LF", bats: "S", throws_: "R", number: 8 },
      { firstName: "Justin", lastName: "Steele", position: "SP", bats: "L", throws_: "L", number: 35 },
      { firstName: "Cody", lastName: "Bellinger", position: "CF", bats: "L", throws_: "L", number: 24 },
      { firstName: "Nico", lastName: "Hoerner", position: "2B", bats: "R", throws_: "R", number: 2 },
    ],
    CIN: [
      { firstName: "Elly", lastName: "De La Cruz", position: "SS", bats: "S", throws_: "R", number: 44 },
      { firstName: "Spencer", lastName: "Steer", position: "3B", bats: "R", throws_: "R", number: 7 },
      { firstName: "Hunter", lastName: "Greene", position: "SP", bats: "R", throws_: "R", number: 21 },
      { firstName: "TJ", lastName: "Friedl", position: "CF", bats: "L", throws_: "L", number: 29 },
      { firstName: "Jonathan", lastName: "India", position: "2B", bats: "R", throws_: "R", number: 6 },
    ],
    MIL: [
      { firstName: "William", lastName: "Contreras", position: "C", bats: "R", throws_: "R", number: 24 },
      { firstName: "Willy", lastName: "Adames", position: "SS", bats: "R", throws_: "R", number: 27 },
      { firstName: "Freddy", lastName: "Peralta", position: "SP", bats: "R", throws_: "R", number: 51 },
      { firstName: "Christian", lastName: "Yelich", position: "LF", bats: "L", throws_: "R", number: 22 },
      { firstName: "Jackson", lastName: "Chourio", position: "CF", bats: "R", throws_: "R", number: 11 },
    ],
    PIT: [
      { firstName: "Ke'Bryan", lastName: "Hayes", position: "3B", bats: "R", throws_: "R", number: 13 },
      { firstName: "Bryan", lastName: "Reynolds", position: "CF", bats: "S", throws_: "R", number: 10 },
      { firstName: "Jared", lastName: "Jones", position: "SP", bats: "R", throws_: "R", number: 37 },
      { firstName: "Andrew", lastName: "McCutchen", position: "DH", bats: "R", throws_: "R", number: 22 },
      { firstName: "Oneil", lastName: "Cruz", position: "SS", bats: "L", throws_: "R", number: 15 },
    ],
    STL: [
      { firstName: "Nolan", lastName: "Arenado", position: "3B", bats: "R", throws_: "R", number: 28 },
      { firstName: "Paul", lastName: "Goldschmidt", position: "1B", bats: "R", throws_: "R", number: 46 },
      { firstName: "Sonny", lastName: "Gray", position: "SP", bats: "R", throws_: "R", number: 54 },
      { firstName: "Willson", lastName: "Contreras", position: "C", bats: "R", throws_: "R", number: 40 },
      { firstName: "Masyn", lastName: "Winn", position: "SS", bats: "R", throws_: "R", number: 0 },
    ],
    ARI: [
      { firstName: "Corbin", lastName: "Carroll", position: "CF", bats: "L", throws_: "L", number: 7 },
      { firstName: "Ketel", lastName: "Marte", position: "2B", bats: "S", throws_: "R", number: 4 },
      { firstName: "Zac", lastName: "Gallen", position: "SP", bats: "R", throws_: "R", number: 23 },
      { firstName: "Christian", lastName: "Walker", position: "1B", bats: "R", throws_: "R", number: 53 },
      { firstName: "Lourdes", lastName: "Gurriel Jr.", position: "LF", bats: "R", throws_: "R", number: 12 },
    ],
    COL: [
      { firstName: "Ezequiel", lastName: "Tovar", position: "SS", bats: "R", throws_: "R", number: 14 },
      { firstName: "Brenton", lastName: "Doyle", position: "CF", bats: "R", throws_: "R", number: 35 },
      { firstName: "Kyle", lastName: "Freeland", position: "SP", bats: "L", throws_: "L", number: 21 },
      { firstName: "Ryan", lastName: "McMahon", position: "3B", bats: "L", throws_: "R", number: 24 },
      { firstName: "Charlie", lastName: "Blackmon", position: "DH", bats: "L", throws_: "L", number: 19 },
    ],
    LAD: [
      { firstName: "Shohei", lastName: "Ohtani", position: "DH", bats: "L", throws_: "R", number: 17 },
      { firstName: "Mookie", lastName: "Betts", position: "SS", bats: "R", throws_: "R", number: 50 },
      { firstName: "Yoshinobu", lastName: "Yamamoto", position: "SP", bats: "R", throws_: "R", number: 18 },
      { firstName: "Freddie", lastName: "Freeman", position: "1B", bats: "L", throws_: "R", number: 5 },
      { firstName: "Teoscar", lastName: "Hernandez", position: "RF", bats: "R", throws_: "R", number: 37 },
    ],
    SDP: [
      { firstName: "Fernando", lastName: "Tatis Jr.", position: "RF", bats: "R", throws_: "R", number: 23 },
      { firstName: "Manny", lastName: "Machado", position: "3B", bats: "R", throws_: "R", number: 13 },
      { firstName: "Yu", lastName: "Darvish", position: "SP", bats: "R", throws_: "R", number: 11 },
      { firstName: "Xander", lastName: "Bogaerts", position: "SS", bats: "R", throws_: "R", number: 2 },
      { firstName: "Ha-Seong", lastName: "Kim", position: "2B", bats: "R", throws_: "R", number: 7 },
    ],
    SFG: [
      { firstName: "Matt", lastName: "Chapman", position: "3B", bats: "R", throws_: "R", number: 26 },
      { firstName: "Jung Hoo", lastName: "Lee", position: "CF", bats: "L", throws_: "L", number: 51 },
      { firstName: "Logan", lastName: "Webb", position: "SP", bats: "R", throws_: "R", number: 62 },
      { firstName: "Michael", lastName: "Conforto", position: "LF", bats: "L", throws_: "R", number: 8 },
      { firstName: "Patrick", lastName: "Bailey", position: "C", bats: "S", throws_: "R", number: 14 },
    ],
  };

  let playerIdx = 0;
  for (const [abbr, players] of Object.entries(playersByTeam)) {
    for (const p of players) {
      playerIdx++;
      await prisma.player.create({
        data: {
          externalId: `mlb-${abbr.toLowerCase()}-${playerIdx}`,
          firstName: p.firstName,
          lastName: p.lastName,
          teamId: teams[abbr].id,
          position: p.position,
          bats: p.bats as any,
          throws_: p.throws_ as any,
          number: p.number,
          isActive: true,
        },
      });
    }
  }

  // ── Games ────────────────────────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const gameDate = (d: Date, hour: number, min: number) => {
    const dt = new Date(d);
    dt.setHours(hour, min, 0, 0);
    return dt;
  };

  // FINAL games (yesterday)
  const finalGames = [
    { home: "NYY", away: "BOS", homeScore: 5, awayScore: 3, time: "19:05", venue: "Yankee Stadium", ext: "mlb-2026-040301" },
    { home: "LAD", away: "SFG", homeScore: 7, awayScore: 2, time: "22:10", venue: "Dodger Stadium", ext: "mlb-2026-040302" },
    { home: "HOU", away: "TEX", homeScore: 4, awayScore: 6, time: "20:10", venue: "Minute Maid Park", ext: "mlb-2026-040303" },
    { home: "PHI", away: "ATL", homeScore: 3, awayScore: 3, time: "19:05", venue: "Citizens Bank Park", ext: "mlb-2026-040304" },
    { home: "CHC", away: "STL", homeScore: 8, awayScore: 5, time: "20:20", venue: "Wrigley Field", ext: "mlb-2026-040305" },
  ];

  const inningBreakdowns = [
    { away: [0,1,0,0,0,2,0,0,0], home: [2,0,0,1,0,0,2,0,0] },
    { away: [0,0,1,0,0,0,1,0,0], home: [3,0,0,2,0,1,0,1,0] },
    { away: [1,0,2,0,0,1,0,2,0], home: [0,0,1,0,2,0,1,0,0] },
    { away: [0,0,1,0,0,2,0,0,0], home: [1,0,0,0,1,0,0,0,1] },
    { away: [0,2,0,1,0,0,2,0,0], home: [3,0,1,0,0,2,0,2,0] },
  ];

  // LIVE games (today)
  const liveGames = [
    { home: "BAL", away: "TOR", homeScore: 3, awayScore: 2, inning: 5, inningHalf: "TOP" as const, time: "13:05", venue: "Camden Yards", ext: "mlb-2026-040401" },
    { home: "MIN", away: "CLE", homeScore: 1, awayScore: 4, inning: 3, inningHalf: "BOTTOM" as const, time: "14:10", venue: "Target Field", ext: "mlb-2026-040402" },
    { home: "SEA", away: "LAA", homeScore: 2, awayScore: 2, inning: 7, inningHalf: "TOP" as const, time: "16:10", venue: "T-Mobile Park", ext: "mlb-2026-040403" },
    { home: "SDP", away: "ARI", homeScore: 5, awayScore: 1, inning: 4, inningHalf: "BOTTOM" as const, time: "16:40", venue: "Petco Park", ext: "mlb-2026-040404" },
    { home: "MIL", away: "CIN", homeScore: 0, awayScore: 3, inning: 6, inningHalf: "TOP" as const, time: "14:20", venue: "American Family Field", ext: "mlb-2026-040405" },
  ];

  // SCHEDULED games (today, future)
  const scheduledGames = [
    { home: "NYM", away: "MIA", time: "19:10", venue: "Citi Field", ext: "mlb-2026-040406" },
    { home: "DET", away: "KCR", time: "18:40", venue: "Comerica Park", ext: "mlb-2026-040407" },
    { home: "PIT", away: "WSH", time: "18:35", venue: "PNC Park", ext: "mlb-2026-040408" },
    { home: "OAK", away: "CHW", time: "21:40", venue: "Oakland Coliseum", ext: "mlb-2026-040409" },
    { home: "COL", away: "TBR", time: "20:40", venue: "Coors Field", ext: "mlb-2026-040410" },
  ];

  const createdGames: Record<string, any> = {};

  for (let i = 0; i < finalGames.length; i++) {
    const g = finalGames[i];
    const [h, m] = g.time.split(":").map(Number);
    const game = await prisma.game.create({
      data: {
        externalId: g.ext,
        homeTeamId: teams[g.home].id,
        awayTeamId: teams[g.away].id,
        date: gameDate(yesterday, h, m),
        status: "FINAL",
        homeScore: g.homeScore,
        awayScore: g.awayScore,
        startTime: g.time,
        venue: g.venue,
      },
    });
    createdGames[g.ext] = game;

    const bd = inningBreakdowns[i];
    for (let inn = 0; inn < 9; inn++) {
      await prisma.gameInning.create({
        data: {
          gameId: game.id,
          inningNumber: inn + 1,
          homeRuns: bd.home[inn],
          awayRuns: bd.away[inn],
        },
      });
    }
  }

  for (const g of liveGames) {
    const [h, m] = g.time.split(":").map(Number);
    const game = await prisma.game.create({
      data: {
        externalId: g.ext,
        homeTeamId: teams[g.home].id,
        awayTeamId: teams[g.away].id,
        date: gameDate(today, h, m),
        status: "LIVE",
        homeScore: g.homeScore,
        awayScore: g.awayScore,
        inning: g.inning,
        inningHalf: g.inningHalf,
        outs: Math.floor(Math.random() * 3),
        startTime: g.time,
        venue: g.venue,
      },
    });
    createdGames[g.ext] = game;
  }

  for (const g of scheduledGames) {
    const [h, m] = g.time.split(":").map(Number);
    const game = await prisma.game.create({
      data: {
        externalId: g.ext,
        homeTeamId: teams[g.home].id,
        awayTeamId: teams[g.away].id,
        date: gameDate(today, h, m),
        status: "SCHEDULED",
        homeScore: 0,
        awayScore: 0,
        startTime: g.time,
        venue: g.venue,
      },
    });
    createdGames[g.ext] = game;
  }

  // ── Betting Lines ────────────────────────────────────
  const allGameExts = [
    ...finalGames.map((g) => g.ext),
    ...liveGames.map((g) => g.ext),
    ...scheduledGames.map((g) => g.ext),
  ];

  const lineData: Record<string, { hml: number; aml: number; rlh: number; rla: number; total: number; over: number; under: number }> = {
    "mlb-2026-040301": { hml: -155, aml: 135, rlh: -120, rla: 100, total: 8.5, over: -110, under: -110 },
    "mlb-2026-040302": { hml: -180, aml: 155, rlh: -135, rla: 115, total: 7.5, over: -105, under: -115 },
    "mlb-2026-040303": { hml: -130, aml: 110, rlh: -110, rla: -110, total: 9.0, over: -110, under: -110 },
    "mlb-2026-040304": { hml: -140, aml: 120, rlh: -115, rla: -105, total: 8.0, over: -105, under: -115 },
    "mlb-2026-040305": { hml: 105, aml: -125, rlh: 100, rla: -120, total: 9.5, over: -115, under: -105 },
    "mlb-2026-040401": { hml: -145, aml: 125, rlh: -120, rla: 100, total: 8.0, over: -110, under: -110 },
    "mlb-2026-040402": { hml: 110, aml: -130, rlh: 120, rla: -140, total: 7.5, over: -105, under: -115 },
    "mlb-2026-040403": { hml: -120, aml: 100, rlh: -105, rla: -115, total: 7.0, over: -110, under: -110 },
    "mlb-2026-040404": { hml: -160, aml: 140, rlh: -130, rla: 110, total: 8.5, over: -110, under: -110 },
    "mlb-2026-040405": { hml: -135, aml: 115, rlh: -115, rla: -105, total: 8.0, over: -105, under: -115 },
    "mlb-2026-040406": { hml: -150, aml: 130, rlh: -125, rla: 105, total: 7.5, over: -110, under: -110 },
    "mlb-2026-040407": { hml: 115, aml: -135, rlh: 130, rla: -150, total: 8.5, over: -105, under: -115 },
    "mlb-2026-040408": { hml: -110, aml: -110, rlh: 100, rla: -120, total: 8.0, over: -110, under: -110 },
    "mlb-2026-040409": { hml: -125, aml: 105, rlh: -110, rla: -110, total: 7.5, over: -115, under: -105 },
    "mlb-2026-040410": { hml: 130, aml: -150, rlh: 145, rla: -165, total: 10.5, over: -110, under: -110 },
  };

  for (const ext of allGameExts) {
    const ld = lineData[ext];
    await prisma.bettingLine.create({
      data: {
        gameId: createdGames[ext].id,
        source: "FanDuel",
        homeMoneyline: ld.hml,
        awayMoneyline: ld.aml,
        runLineSpread: -1.5,
        runLineHome: ld.rlh,
        runLineAway: ld.rla,
        totalLine: ld.total,
        overOdds: ld.over,
        underOdds: ld.under,
      },
    });
  }

  // ── Picks ────────────────────────────────────────────
  const calcProfit = (odds: number, stake: number, result: string): number => {
    if (result === "PUSH") return 0;
    if (result === "LOSS") return -stake;
    if (result === "PENDING") return 0;
    if (odds > 0) return (odds / 100) * stake;
    return (100 / Math.abs(odds)) * stake;
  };

  const resolvedAt = new Date(yesterday);
  resolvedAt.setHours(23, 0, 0, 0);

  // El Profeta: 10 picks, 7W 2L 1P, streak 5
  const profetaPicks = [
    {
      gameExt: "mlb-2026-040301", pickType: "MONEYLINE" as const, selection: "NYY ML", odds: -155, stake: 4, result: "WIN" as const,
      analysis: "Los Yankees en casa contra Boston siempre es garantia. Cole en el monticulo tiene un ERA de 2.45 en sus ultimas 6 salidas y el lineup de Nueva York viene caliente con Judge conectando 3 HR en la ultima semana. El patron historico favorece al local en esta rivalidad.",
    },
    {
      gameExt: "mlb-2026-040302", pickType: "MONEYLINE" as const, selection: "LAD ML", odds: -180, stake: 5, result: "WIN" as const,
      analysis: "Yamamoto contra los Giants es un mismatch brutal. Los Dodgers tienen un record de 8-2 en los ultimos 10 enfrentamientos contra San Francisco. Ohtani viene con un OPS de .950 en abril y Freeman esta en racha. Mi intuicion dice paliza de los de azul.",
    },
    {
      gameExt: "mlb-2026-040303", pickType: "MONEYLINE" as const, selection: "HOU ML", odds: -130, stake: 3, result: "LOSS" as const,
      analysis: "Houston en casa con Valdez deberia ser victoria segura, pero Texas tiene mucho poder ofensivo con Seager y Semien. Aun asi, confio en la experiencia de Valdez y el patron historico del Minute Maid Park donde Houston gana el 62% de los juegos.",
    },
    {
      gameExt: "mlb-2026-040304", pickType: "MONEYLINE" as const, selection: "PHI ML", odds: -140, stake: 4, result: "PUSH" as const,
      analysis: "Filadelfia con Wheeler en el monticulo es una apuesta solida. Los Phillies en casa tienen una ventaja notable contra Atlanta este ano. Harper viene con extra base hits en 5 juegos consecutivos. Mi sexto sentido me dice que Filadelfia domina este duelo.",
    },
    {
      gameExt: "mlb-2026-040305", pickType: "MONEYLINE" as const, selection: "CHC ML", odds: 105, stake: 3, result: "WIN" as const,
      analysis: "Chicago como local contra los Cardinals es una pick con valor tremendo. Steele ha sido dominante en Wrigley con un ERA de 1.98 en casa. El lineup de los Cubs viene produciendo carreras de manera consistente y el patron historico dice que Chicago gana esta serie.",
    },
    {
      gameExt: "mlb-2026-040401", pickType: "MONEYLINE" as const, selection: "BAL ML", odds: -145, stake: 4, result: "WIN" as const,
      analysis: "Baltimore con Burnes en el monticulo contra Toronto es una de mis picks favoritas. Los Orioles en Camden Yards son un equipo completamente diferente. Henderson esta bateando .340 en casa y Rutschman tiene un OBP de .400 en abril. Intuicion pura aqui.",
    },
    {
      gameExt: "mlb-2026-040402", pickType: "MONEYLINE" as const, selection: "CLE ML", odds: -130, stake: 3, result: "WIN" as const,
      analysis: "Cleveland con Bibee ha sido una combinacion letal. Los Guardians viajan bien y Ramirez esta en modo MVP con un promedio de .315 y 6 HR en las ultimas dos semanas. El patron indica que Cleveland domina en Target Field contra pitchers zurdos locales.",
    },
    {
      gameExt: "mlb-2026-040404", pickType: "MONEYLINE" as const, selection: "SDP ML", odds: -160, stake: 5, result: "WIN" as const,
      analysis: "San Diego con Darvish en casa contra Arizona es casi un regalo. Los Padres dominan en Petco Park con un record de 12-4 y Tatis Jr. viene encendido con un slugging de .620. Mi olfato me dice que esto es victoria comoda para los frailes de San Diego.",
    },
    {
      gameExt: "mlb-2026-040406", pickType: "MONEYLINE" as const, selection: "NYM ML", odds: -150, stake: 4, result: "PENDING" as const,
      analysis: "Mets en casa contra Miami con Senga en el monticulo. Lindor viene de una semana espectacular y Alonso empieza a calentar el bate. Los Marlins tienen uno de los peores records como visitante y mi intuicion apunta a victoria neoyorquina clara esta noche.",
    },
    {
      gameExt: "mlb-2026-040305", pickType: "MONEYLINE" as const, selection: "STL ML", odds: -125, stake: 2, result: "LOSS" as const,
      analysis: "Segunda lectura del juego Cubs-Cardinals. Gray tiene numeros decentes en Wrigley y los Cardinals historicamente pelean en esta rivalidad. Mi patron me dice que St. Louis puede dar la sorpresa pero el resultado final me demuestra que los Cubs fueron superiores.",
    },
  ];

  // BatFlip King: 9 picks, 5W 3L 1PUSH, streak 2
  const batflipPicks = [
    {
      gameExt: "mlb-2026-040301", pickType: "RUNLINE" as const, selection: "NYY -1.5", odds: -120, stake: 5, result: "WIN" as const,
      analysis: "Yankees por paliza! Cole va a dominar a estos Red Sox que no le ven la bola. Judge esta que rompe y Soto se prende contra Boston. Run line facil, estos Yankees no solo ganan, destruyen. Meto 5 unidades sin pensarlo dos veces.",
    },
    {
      gameExt: "mlb-2026-040302", pickType: "RUNLINE" as const, selection: "LAD -1.5", odds: -135, stake: 5, result: "WIN" as const,
      analysis: "Dodgers por goleada en casa contra unos Giants que no tienen pitching! Ohtani va a hacer lo suyo y Freeman esta imparable. Yamamoto va a lanzar joya y el lineup va a explotar. Run line sin dudas, esto es un atropello total en Dodger Stadium.",
    },
    {
      gameExt: "mlb-2026-040303", pickType: "PROP" as const, selection: "TEX Total Runs Over 4.5", odds: 110, stake: 4, result: "WIN" as const,
      analysis: "Texas va a masacrar a Valdez hoy! Seager y Semien estan on fire y el bullpen de Houston esta agotado. Prop de carreras de Texas facil, estos Rangers van a explotar el marcador. Apuesta agresiva pero segura con este lineup texano.",
    },
    {
      gameExt: "mlb-2026-040304", pickType: "RUNLINE" as const, selection: "PHI -1.5", odds: -115, stake: 4, result: "LOSS" as const,
      analysis: "Phillies van a barrer! Wheeler es un monstruo y Harper esta en modo bestia. Los Braves sin Acuna al 100% estan heridos y Filadelfia huele sangre. Run line agresivo pero estoy convencido de la paliza. Vamos con todo al ataque!",
    },
    {
      gameExt: "mlb-2026-040305", pickType: "TOTAL" as const, selection: "Over 9.5", odds: -115, stake: 3, result: "WIN" as const,
      analysis: "Cubs-Cardinals en Wrigley con viento soplando hacia afuera? OVER facilisimo! Ambos bullpens estan destruidos y los bates van a hablar. Espero un juego de doble digito, esto va a ser una fiesta de carreras totales en Chicago.",
    },
    {
      gameExt: "mlb-2026-040401", pickType: "PROP" as const, selection: "Henderson 2+ Hits", odds: 145, stake: 3, result: "WIN" as const,
      analysis: "Gunnar Henderson esta IMPOSIBLE. Le pega a todo lo que le lanzan y contra el pitching de Toronto va a tener fiesta. Prop de 2+ hits es dinero regalado. Este muchacho esta jugando en otro nivel completamente diferente, meto sin dudas.",
    },
    {
      gameExt: "mlb-2026-040403", pickType: "RUNLINE" as const, selection: "SEA -1.5", odds: -105, stake: 4, result: "PUSH" as const,
      analysis: "Seattle en casa con Gilbert va a dominar a unos Angels sin ofensiva real. Julio Rodriguez esta encendido y Raleigh pega bombas. Run line de los Mariners, estos Angels no tienen chance de mantenerse cerca en T-Mobile Park.",
    },
    {
      gameExt: "mlb-2026-040407", pickType: "RUNLINE" as const, selection: "KCR -1.5", odds: -150, stake: 5, result: "PENDING" as const,
      analysis: "Kansas City con Ragans va a destruir a Detroit! Witt Jr. es el mejor jugador del planeta ahora mismo y Perez sigue pegando duro. Run line de los Royals, esto es un mismatch total contra el pitching mediocre de los Tigers.",
    },
    {
      gameExt: "mlb-2026-040305", pickType: "PROP" as const, selection: "Bellinger HR", odds: 180, stake: 2, result: "LOSS" as const,
      analysis: "Bellinger contra Gray es una combinacion historica donde Cody le pega duro al pitcher. Prop de HR con valor +180 es irresistible. Bellinger va a conectar bombazo, meto unidades en esta prop agresiva y con mucho valor en Wrigley Field.",
    },
  ];

  // Sabermetrics Joe: 8 picks, 6W 2L, streak 4
  const joePicks = [
    {
      gameExt: "mlb-2026-040301", pickType: "TOTAL" as const, selection: "Under 8.5", odds: -110, stake: 3, result: "WIN" as const,
      analysis: "Cole vs Bello es un duelo de pitchers con ERAs combinados de 5.12 en temporada. Pero los datos muestran que ambos tienen un FIP sub-3.00, lo que indica que la corrida de suerte negativa se revierte. xBA del lineup de Boston es .218 contra RHP elite. Under claro.",
    },
    {
      gameExt: "mlb-2026-040302", pickType: "TOTAL" as const, selection: "Over 7.5", odds: -105, stake: 4, result: "WIN" as const,
      analysis: "Yamamoto tiene un WHIP de 0.95 pero los Giants tienen un wRC+ de 118 contra RHP asiaticos en los ultimos 30 dias. El factor Dodger Stadium con temperatura de 78F aumenta distancia de fly balls un 4.2%. Over basado en datos de Statcast y condiciones ambientales.",
    },
    {
      gameExt: "mlb-2026-040303", pickType: "MONEYLINE" as const, selection: "TEX ML", odds: 110, stake: 3, result: "WIN" as const,
      analysis: "Valdez tiene un spin rate 3% debajo de su promedio en las ultimas 3 salidas segun Statcast. Texas tiene un xwOBA de .355 contra zurdos con sinker como pitch primario. Eovaldi tiene un K/BB de 4.2 en sus ultimas 5 salidas. El valor esta claramente en Texas.",
    },
    {
      gameExt: "mlb-2026-040304", pickType: "TOTAL" as const, selection: "Under 8.0", odds: -115, stake: 3, result: "LOSS" as const,
      analysis: "Wheeler tiene un xERA de 2.18 y Atlanta genera un hard hit% de solo 28% contra pitchers con 4-seam por encima de 96mph. Los datos de contact quality sugieren un juego de bajo marcador. Under fundamentado en sabermetrics puro y metricas avanzadas.",
    },
    {
      gameExt: "mlb-2026-040305", pickType: "MONEYLINE" as const, selection: "CHC ML", odds: 105, stake: 4, result: "WIN" as const,
      analysis: "Steele en casa tiene un ERA de 1.98 con un K% de 28.3 y un BB% de 4.1. Los Cardinals contra zurdos con slider como out-pitch tienen un wRC+ de apenas 82. El modelo de proyeccion da 56.4% de probabilidad a Chicago, lo que hace el +105 una apuesta con valor.",
    },
    {
      gameExt: "mlb-2026-040401", pickType: "MONEYLINE" as const, selection: "BAL ML", odds: -145, stake: 3, result: "WIN" as const,
      analysis: "Burnes tiene un CSW% de 32.4% que es top-10 en MLB. Toronto tiene un chase rate de 34.2% que es bottom-5 en la liga, pero contra el curveball de Burnes con 41% whiff rate se neutraliza. Baltimore gana por pitching dominante segun todos los modelos.",
    },
    {
      gameExt: "mlb-2026-040405", pickType: "MONEYLINE" as const, selection: "CIN ML", odds: 115, stake: 3, result: "WIN" as const,
      analysis: "Greene tiene un expected K/9 de 12.3 segun datos de Statcast y Milwaukee tiene un strikeout rate de 26.8% contra RHP con fastball sobre 98mph. El bullpen de Cincinnati tiene un ERA de 2.45 en las ultimas dos semanas. El valor en +115 es extraordinario.",
    },
    {
      gameExt: "mlb-2026-040408", pickType: "TOTAL" as const, selection: "Over 8.0", odds: -110, stake: 3, result: "PENDING" as const,
      analysis: "PNC Park con viento a 12mph hacia el outfield y temperatura de 72F genera un aumento del 6.1% en HR segun datos de Ballpark Pal. Washington tiene un ISO de .178 como visitante y Pittsburgh un barrel% de 9.2. Los numeros dicen over en estas condiciones.",
    },
  ];

  // La Maquina: 8 picks, 4W 3L 1P, streak 1
  const maquinaPicks = [
    {
      gameExt: "mlb-2026-040301", pickType: "MONEYLINE" as const, selection: "NYY ML", odds: -155, stake: 3, result: "WIN" as const,
      analysis: "Yankees moneyline. Cole en casa con WHIP 0.91. Boston con porcentaje de victorias visitante de .380. Linea correcta, ejecucion directa sin complicaciones innecesarias en esta seleccion.",
    },
    {
      gameExt: "mlb-2026-040302", pickType: "MONEYLINE" as const, selection: "LAD ML", odds: -180, stake: 4, result: "WIN" as const,
      analysis: "Dodgers en Dodger Stadium con Yamamoto. San Francisco tiene record negativo contra equipos sobre .500 como visitante. Apuesta metodica basada en ventaja de pitching y factor de localia.",
    },
    {
      gameExt: "mlb-2026-040303", pickType: "MONEYLINE" as const, selection: "HOU ML", odds: -130, stake: 3, result: "LOSS" as const,
      analysis: "Houston con ventaja de localia y Valdez en el monticulo. Linea de -130 ofrece valor adecuado. Texas tiene vulnerabilidad contra zurdos segun datos recientes. Ejecucion standard de moneyline favorito moderado.",
    },
    {
      gameExt: "mlb-2026-040304", pickType: "MONEYLINE" as const, selection: "PHI ML", odds: -140, stake: 3, result: "PUSH" as const,
      analysis: "Filadelfia con Wheeler. Ratio de victorias en casa de .620 esta temporada. Atlanta inconsistente en ruta con record negativo. Moneyline directo basado en ventaja de pitching titular y factor local.",
    },
    {
      gameExt: "mlb-2026-040305", pickType: "MONEYLINE" as const, selection: "STL ML", odds: -125, stake: 3, result: "LOSS" as const,
      analysis: "Cardinals con Gray contra Cubs. Gray tiene ERA de 2.80 en ruta y Saint Louis tiene record positivo en rivalidad divisional reciente. Moneyline conservador basado en pitcher titular y matchup historico.",
    },
    {
      gameExt: "mlb-2026-040402", pickType: "MONEYLINE" as const, selection: "CLE ML", odds: -130, stake: 3, result: "WIN" as const,
      analysis: "Cleveland en Minnesota con Bibee. Bibee tiene K/9 de 10.2 contra Minnesota en su carrera profesional. Guardians con mejor bullpen de la division central. Moneyline directo fundamentado en matchup.",
    },
    {
      gameExt: "mlb-2026-040403", pickType: "MONEYLINE" as const, selection: "SEA ML", odds: -120, stake: 3, result: "LOSS" as const,
      analysis: "Seattle con Gilbert en T-Mobile Park. Angels tienen ofensiva bottom-5 en wRC+ de la liga americana. Factor parque favorece al pitcher local. Moneyline de bajo riesgo basado en ventaja sistematica.",
    },
    {
      gameExt: "mlb-2026-040409", pickType: "MONEYLINE" as const, selection: "OAK ML", odds: -125, stake: 2, result: "PENDING" as const,
      analysis: "Oakland contra White Sox. Chicago es el peor equipo de la liga por diferencial de carreras negativo. Sears contra lineup debil de Chicago. Moneyline conservador con buen valor en la linea actual.",
    },
  ];

  // El Zurdo: 7 picks, 3W 3L 1PUSH, streak 0
  const zurdoPicks = [
    {
      gameExt: "mlb-2026-040301", pickType: "MONEYLINE" as const, selection: "BOS ML", odds: 135, stake: 3, result: "LOSS" as const,
      analysis: "Bello es zurdo y tiene ventaja contra el lineup de los Yankees que batea .230 contra pitchers zurdos en los ultimos 15 dias. La historia dice que Boston da pelea en el Bronx cuando tiene zurdo en el monticulo. Me voy contra la corriente esta vez.",
    },
    {
      gameExt: "mlb-2026-040302", pickType: "MONEYLINE" as const, selection: "SFG ML", odds: 155, stake: 2, result: "LOSS" as const,
      analysis: "San Francisco con Lee en el lineup tiene un lefty que batea .310 contra RHP. Los Giants tienen varios zurdos clave que pueden hacer dano contra Yamamoto. Chapman como zurdo switch-hitter es pieza clave en este matchup de lanzadores.",
    },
    {
      gameExt: "mlb-2026-040303", pickType: "MONEYLINE" as const, selection: "TEX ML", odds: 110, stake: 3, result: "WIN" as const,
      analysis: "Valdez es zurdo pero Texas tiene a Seager, otro zurdo elite que paradojicamente le pega muy bien a pitchers zurdos con sinker. El matchup zurdo vs zurdo favorece a Seager por su mecanica de swing unica. Texas tiene ventaja en este duelo especifico.",
    },
    {
      gameExt: "mlb-2026-040305", pickType: "MONEYLINE" as const, selection: "CHC ML", odds: 105, stake: 4, result: "WIN" as const,
      analysis: "Steele es un zurdo elite y contra los Cardinals que tienen lineup pesado hacia la derecha, tiene ventaja natural. El slider de Steele genera un whiff rate de 42% contra bateadores derechos. La ventaja del zurdo en casa es enorme aqui en Wrigley.",
    },
    {
      gameExt: "mlb-2026-040401", pickType: "MONEYLINE" as const, selection: "TOR ML", odds: 125, stake: 3, result: "LOSS" as const,
      analysis: "Toronto tiene a Varsho como catcher zurdo que batea .295 contra RHP elite. Gausman no es zurdo pero el lineup de Toronto tiene suficientes bateadores zurdos para hacer dano contra Burnes y su breaking ball de brazo derecho.",
    },
    {
      gameExt: "mlb-2026-040403", pickType: "MONEYLINE" as const, selection: "LAA ML", odds: 100, stake: 3, result: "PUSH" as const,
      analysis: "Anderson es un zurdo que domina en T-Mobile Park historicamente. Su sinker genera groundballs contra el lineup pesado de Seattle. Trout como bateador derecho puede hacer dano pero el enfoque zurdo de Anderson neutraliza a Crawford y otros lefties.",
    },
    {
      gameExt: "mlb-2026-040405", pickType: "MONEYLINE" as const, selection: "CIN ML", odds: 115, stake: 3, result: "WIN" as const,
      analysis: "Peralta de los Brewers no es zurdo, y eso beneficia a Cincinnati que tiene varios zurdos peligrosos como Friedl con OBP de .380 contra RHP. Greene como derecho dominante complementa un lineup que sabe atacar pitchers de brazo convencional. Zurdo strategy.",
    },
  ];

  // Create all picks
  const allPicks = [
    ...profetaPicks.map((p) => ({ ...p, tipsterId: profeta.id })),
    ...batflipPicks.map((p) => ({ ...p, tipsterId: batflip.id })),
    ...joePicks.map((p) => ({ ...p, tipsterId: joe.id })),
    ...maquinaPicks.map((p) => ({ ...p, tipsterId: maquina.id })),
    ...zurdoPicks.map((p) => ({ ...p, tipsterId: zurdo.id })),
  ];

  for (const p of allPicks) {
    const profit = calcProfit(p.odds, p.stake, p.result);
    await prisma.pick.create({
      data: {
        tipsterId: p.tipsterId,
        gameId: createdGames[p.gameExt].id,
        pickType: p.pickType,
        selection: p.selection,
        odds: p.odds,
        stake: p.stake,
        analysis: p.analysis,
        result: p.result,
        profit: parseFloat(profit.toFixed(2)),
        resolvedAt: p.result !== "PENDING" ? resolvedAt : null,
      },
    });
  }

  // ── Streaks ──────────────────────────────────────────
  const streakData = [
    { userId: profeta.id, type: "CURRENT" as const, count: 5, isActive: true },
    { userId: profeta.id, type: "BEST" as const, count: 7, isActive: false },
    { userId: batflip.id, type: "CURRENT" as const, count: 2, isActive: true },
    { userId: batflip.id, type: "BEST" as const, count: 5, isActive: false },
    { userId: joe.id, type: "CURRENT" as const, count: 4, isActive: true },
    { userId: joe.id, type: "BEST" as const, count: 6, isActive: false },
    { userId: maquina.id, type: "CURRENT" as const, count: 1, isActive: true },
    { userId: maquina.id, type: "BEST" as const, count: 4, isActive: false },
    { userId: zurdo.id, type: "CURRENT" as const, count: 0, isActive: true },
    { userId: zurdo.id, type: "BEST" as const, count: 3, isActive: false },
  ];

  for (const s of streakData) {
    await prisma.streak.create({
      data: {
        userId: s.userId,
        type: s.type,
        count: s.count,
        startDate: yesterday,
        endDate: s.isActive ? null : yesterday,
        isActive: s.isActive,
      },
    });
  }

  console.log("Seed completed successfully!");
  console.log(`  - 6 users (5 tipsters + 1 fan)`);
  console.log(`  - 30 teams`);
  console.log(`  - 150 players`);
  console.log(`  - 15 games (5 FINAL, 5 LIVE, 5 SCHEDULED)`);
  console.log(`  - 45 game innings`);
  console.log(`  - 15 betting lines`);
  console.log(`  - ${allPicks.length} picks`);
  console.log(`  - 10 streaks`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
