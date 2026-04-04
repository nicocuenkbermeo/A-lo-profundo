# A Lo Profundo

Plataforma MLB de analisis deportivo, picks de apuestas y estadisticas en tiempo real. Tema oscuro con acentos ambar.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth v5 (Credentials + Google OAuth)
- **Validation:** Zod
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand
- **Charts:** Recharts
- **Deploy:** Vercel / Docker

## Prerequisites

- Node.js 20+
- PostgreSQL 16+ (or Docker)
- npm

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd a-lo-profundo
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values. At minimum set `DATABASE_URL` and `NEXTAUTH_SECRET`.

### 3. Database setup

```bash
# Start PostgreSQL with Docker (optional)
docker compose up db -d

# Generate Prisma client and run migrations
npx prisma generate
npx prisma db push

# Seed the database
npx prisma db seed
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docker

Run the full stack with Docker:

```bash
docker compose up --build
```

This starts PostgreSQL and the Next.js app. The app will be available at `http://localhost:3000`.

## Project Structure

```
src/
  app/
    api/
      auth/          # NextAuth routes + registration
      scores/        # Game scores by date
      stats/         # Team and player statistics
      picks/         # Tipster picks (GET + POST)
      rachas/        # Streak leaderboard
      trends/        # Hot teams, pitchers, betting trends
      cron/          # Score updates + pick resolution
    auth/
      login/         # Login page
      register/      # Registration page
  lib/
    auth.ts          # NextAuth v5 configuration
    prisma.ts        # Prisma client singleton
    constants.ts     # App constants
    utils.ts         # Utility functions
    calculations/    # Business logic helpers
  generated/
    prisma/          # Generated Prisma client
prisma/
  schema.prisma      # Database schema
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scores?date=YYYY-MM-DD` | Games for a date |
| GET | `/api/scores/[gameId]` | Single game detail |
| GET | `/api/stats?type=teams\|batters\|pitchers` | Statistics with pagination |
| GET | `/api/stats/players/[id]` | Player detail with stats |
| GET | `/api/picks` | List picks with filters |
| POST | `/api/picks` | Create pick (TIPSTER/ADMIN) |
| GET | `/api/rachas` | Tipster streak leaderboard |
| GET | `/api/trends` | Hot teams, pitchers, betting trends |
| GET | `/api/cron/update-scores` | Update live scores (cron) |
| GET | `/api/cron/resolve-picks` | Resolve pending picks (cron) |

## Features

- Real-time MLB game scores with inning-by-inning detail
- Team and player statistics (batting and pitching)
- Tipster pick system with Moneyline, Run Line, and Total picks
- Streak tracking and leaderboard (Rachas)
- Betting trend analysis
- User authentication (email/password + Google)
- Role-based access (USER, TIPSTER, ADMIN)
- Dark theme with amber accents
- Responsive design
- Cron jobs for score updates and pick resolution

## Roadmap

- Live score integration with external MLB API
- Push notifications for pick results
- Social features (comments, follows)
- Advanced analytics and charting
- Mobile app (React Native)
- Telegram/Discord bot for picks
- Bankroll management tools
- Historical season data import

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request
