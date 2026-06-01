# Hotel Review Analyzer

A full-stack AI-powered application that automatically analyzes hotel reviews using Claude AI. Built as a hands-on project to explore agentic workflows, data pipelines, and LLM integration.

## What It Does

- Submit hotel reviews through a clean dashboard UI
- Claude AI automatically analyzes each review and extracts:
  - **Sentiment** — positive, negative, or neutral
  - **Summary** — one-sentence AI-generated summary
  - **Issues** — specific problems mentioned (e.g. dirty room, slow WiFi)
- Filter reviews by sentiment
- Track token usage and processing time per request (observability)
- View real-time stats: total reviews, sentiment breakdown, average processing time

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + TypeScript | REST API server |
| Express.js | HTTP routing |
| PostgreSQL (Neon) | Cloud database |
| Anthropic Claude API (`claude-haiku`) | AI analysis agent |
| `pg` | PostgreSQL client |
| `dotenv` | Environment variable management |

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 15 (App Router) | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Axios | HTTP client |
| Custom React Hooks | Data fetching logic |

## Project Structure

```
hotel-review-analyzer/
├── hotel-review-agent/          # Backend
│   ├── src/
│   │   ├── agent.ts             # Claude AI integration
│   │   ├── api.ts               # REST API routes
│   │   ├── database.ts          # PostgreSQL setup & schema
│   │   └── index.ts             # Server entry point
│   ├── .env
│   └── package.json
│
└── hotel-review-dashboard/      # Frontend
    ├── app/
    │   └── page.tsx             # Main dashboard page
    ├── components/
    │   ├── AddReviewForm.tsx    # Review submission form
    │   ├── FilterBar.tsx        # Sentiment filter
    │   ├── ReviewCard.tsx       # Individual review card
    │   └── StatsBar.tsx         # Statistics overview
    ├── hooks/
    │   └── useReviews.ts        # Data fetching hook
    ├── types/
    │   └── index.ts             # Shared TypeScript types
    └── package.json
```

## Architecture

```
User submits review (Frontend)
        ↓
POST /api/reviews (Express)
        ↓
Save to PostgreSQL (reviews table)
        ↓
Send to Claude AI → analyze sentiment, summary, issues
        ↓
Save analysis to PostgreSQL (analysis table)
        ↓
Return result to frontend
        ↓
Dashboard auto-refreshes
```

For **GET /api/reviews** — Claude is NOT called again. Results are already stored in the database, so reads are fast and cost-free.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/reviews` | Add new review + trigger AI analysis |
| `GET` | `/api/reviews` | Get all reviews with analysis |
| `GET` | `/api/reviews?sentiment=negative` | Filter by sentiment |
| `GET` | `/api/stats` | Get dashboard statistics |

## Database Schema

```sql
-- Stores raw hotel reviews
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  hotel_name VARCHAR(255) NOT NULL,
  review_text TEXT NOT NULL,
  rating INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Stores Claude AI analysis results
CREATE TABLE analysis (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews(id),
  sentiment VARCHAR(50),
  summary TEXT,
  issues TEXT[],
  tokens_used INTEGER,
  processing_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or [Neon](https://neon.tech) free tier)
- [Anthropic API key](https://console.anthropic.com)

### Backend Setup

```bash
cd hotel-review-agent
npm install
```

Create `.env`:
```
ANTHROPIC_API_KEY=your_api_key_here
DATABASE_URL=your_postgres_connection_string
```

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Frontend Setup

```bash
cd hotel-review-dashboard
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

```bash
npm run dev
```

Dashboard runs on `http://localhost:3001`

## Key Design Decisions

**Why store analysis results in the database?**
Claude is only called once per review — when it's submitted. Results are persisted so that subsequent reads are instant and don't incur additional API costs.

**Why `claude-haiku`?**
Haiku is Claude's fastest and most cost-efficient model. For structured sentiment analysis, it performs as well as larger models at a fraction of the cost.

**Why separate `reviews` and `analysis` tables?**
Separation of concerns — raw user data and AI-generated metadata are kept distinct. This makes it easy to re-analyze reviews with a different model in the future without touching the original data.

## Observability

Each analysis record stores:
- `tokens_used` — tracks API cost per request
- `processing_time_ms` — tracks latency per request

These are surfaced in the dashboard as average processing time.
