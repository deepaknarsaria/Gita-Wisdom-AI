# GitaVerse — Gita Wisdom AI

An AI-powered life guidance platform that provides personalized wisdom inspired by the Bhagavad Gita. Ask questions about stress, career, relationships, purpose, or any life challenge and receive structured guidance grounded in Gita teachings — in Hinglish or Hindi.

---

## Features

- **AI Chat**: Bhagavad Gita-based responses with empathy, insight, action steps, and verse references
- **Multi-language**: Hinglish (Hindi + English mix) and pure Hindi
- **Daily Wisdom**: Daily inspirational content
- **Saved Guidance**: Bookmark responses for later
- **Freemium**: 5 free chats, unlimited with premium (Razorpay payments)
- **Text-to-Speech**: Listen to responses

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, TailwindCSS, Shadcn/ui |
| Backend | Node.js 24, Express 5, TypeScript |
| Database | PostgreSQL + Drizzle ORM |
| AI | OpenAI API (GPT chat, speech) |
| Payments | Razorpay |
| Monorepo | pnpm workspaces |

---

## Prerequisites

Before you start, make sure you have:

- **Node.js 24+** — [Download](https://nodejs.org/)
- **pnpm** — Install with `npm install -g pnpm`
- **PostgreSQL** — Local install or a hosted instance (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app))
- **OpenAI API Key** — [Get one here](https://platform.openai.com/api-keys)
- **Razorpay Account** *(optional, for payments)* — [Sign up](https://razorpay.com)

---

## Quick Demo Setup

### 1. Clone the Repository

```bash
git clone https://github.com/deepaknarsaria/Gita-Wisdom-AI.git
cd Gita-Wisdom-AI
```

### 2. Install Dependencies

```bash
pnpm install
```

> **Note:** npm and yarn are blocked by the workspace config — you must use `pnpm`.

### 3. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env   # if provided, or create manually
```

Then fill in the values:

```env
# Server
PORT=8080

# Database — PostgreSQL connection string
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME

# OpenAI
AI_INTEGRATIONS_OPENAI_API_KEY=sk-...your-openai-api-key...
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1

# Razorpay (optional — only needed for payment features)
RAZORPAY_SECRET=your_razorpay_webhook_secret

# Frontend
BASE_PATH=/
```

**Getting a free PostgreSQL URL:**
- [Neon](https://neon.tech) — free tier, instant setup, gives you a `DATABASE_URL` directly
- [Supabase](https://supabase.com) — free tier with connection pooler URL
- Local: `postgresql://postgres:password@localhost:5432/gitaverse`

### 4. Push Database Schema

Apply the database schema to your PostgreSQL instance:

```bash
pnpm --filter @workspace/db run push
```

This creates the `conversations` and `messages` tables using Drizzle ORM.

### 5. Run in Development Mode

Open **two terminals**:

**Terminal 1 — API Server:**
```bash
PORT=8080 DATABASE_URL=<your-url> AI_INTEGRATIONS_OPENAI_API_KEY=<your-key> \
  pnpm --filter @workspace/api-server run dev
```

**Terminal 2 — Frontend:**
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/gitaverse run dev
```

Then open your browser at **http://localhost:5173**

> The frontend dev server proxies API calls to `localhost:8080` automatically.

---

## Build for Production

### 1. Build All Packages

```bash
pnpm run build
```

This runs TypeScript checks and builds:
- `artifacts/api-server/dist/index.mjs` — API server bundle
- `artifacts/gitaverse/dist/public/` — Static frontend files

### 2. Start the Production Server

```bash
# Set all required env vars, then:
node --enable-source-maps artifacts/api-server/dist/index.mjs
```

Serve the `artifacts/gitaverse/dist/public/` directory with any static file server (nginx, Caddy, Vercel, etc.), or have Express serve it.

---

## Project Structure

```
Gita-Wisdom-AI/
├── artifacts/
│   ├── api-server/        # Express REST API (Node.js)
│   ├── gitaverse/         # React frontend (Vite)
│   └── mockup-sandbox/    # Component demo/sandbox
├── lib/
│   ├── db/                # PostgreSQL schema + Drizzle ORM
│   ├── api-spec/          # OpenAPI 3.1 spec (source of truth)
│   ├── api-zod/           # Auto-generated Zod schemas
│   ├── api-client-react/  # Auto-generated React Query hooks
│   ├── integrations-openai-ai-server/  # OpenAI server-side client
│   └── integrations-openai-ai-react/   # OpenAI React hooks
├── scripts/               # Dev utility scripts
├── pnpm-workspace.yaml    # Monorepo workspace config
└── tsconfig.base.json     # Shared TypeScript config
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/healthz` | Health check |
| GET | `/api/openai/conversations` | List all conversations |
| POST | `/api/openai/conversations` | Start a new conversation |
| GET | `/api/openai/conversations/:id` | Get a conversation with messages |
| DELETE | `/api/openai/conversations/:id` | Delete a conversation |
| POST | `/api/razorpay/verify-payment` | Verify Razorpay payment |

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm install` | Install all dependencies |
| `pnpm run build` | Typecheck + build all packages |
| `pnpm run typecheck` | TypeScript type check only |
| `pnpm --filter @workspace/api-server run dev` | Start API server in dev mode |
| `pnpm --filter @workspace/gitaverse run dev` | Start frontend in dev mode |
| `pnpm --filter @workspace/db run push` | Apply DB schema (safe) |
| `pnpm --filter @workspace/db run push-force` | Force apply DB schema |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate API client + Zod schemas from OpenAPI spec |

---

## Deploying to Replit

This project was built on Replit. To deploy there:

1. Import the GitHub repo into [Replit](https://replit.com)
2. Set the Secrets (environment variables) in the Replit Secrets panel
3. Replit auto-detects the `.replit` config and runs the correct build/start commands
4. Hit **Deploy** — health check is `GET /api/healthz`

---

## Deploying to Railway / Render / Fly.io

1. Connect your GitHub repo
2. Set environment variables (`DATABASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY`, `PORT`, etc.)
3. Set build command: `pnpm install && pnpm run build`
4. Set start command: `node --enable-source-maps artifacts/api-server/dist/index.mjs`
5. Serve `artifacts/gitaverse/dist/public/` as a static site (or proxy from the API server)

---

## Skipping Payments (Demo Mode)

To demo without Razorpay:
- The app stores the free/premium plan state in **localStorage**
- You can manually set `localStorage.setItem('plan', 'premium')` in browser DevTools to unlock unlimited chats
- Leave `RAZORPAY_SECRET` unset — payment routes will simply return errors if hit

---

## Troubleshooting

**`pnpm` not found**
```bash
npm install -g pnpm
```

**Database connection errors**
- Confirm `DATABASE_URL` is correctly formatted: `postgresql://user:pass@host:port/dbname`
- For Neon/Supabase, ensure SSL mode is enabled: append `?sslmode=require`

**OpenAI errors**
- Confirm your API key starts with `sk-`
- Check you have credits/quota on your OpenAI account

**Port already in use**
```bash
# Change PORT in your env, e.g.:
PORT=3000 pnpm --filter @workspace/api-server run dev
```

**TypeScript errors on build**
```bash
pnpm run typecheck   # see specific errors
```

---

## License

MIT
