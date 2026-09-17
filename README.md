# Automom

**AI-powered meeting minutes generator.** Upload a raw meeting transcript, and Automom turns it into a structured summary, decisions, action items, and keywords — downloadable as a professional PDF in seconds.

🔗 **Live app:** [automom.vercel.app](https://automom.vercel.app/)

---

## 🎥 Demo Video

<!--
  TODO: Replace this section once the demo video is recorded.

  Recommended: embed a Loom link, or upload to YouTube (unlisted) and
  embed a thumbnail image linking to it, like this:

  [![Automom Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://github.com/user-attachments/assets/d744a7a8-7e53-4634-92b3-646d21690464)
-->
https://github.com/user-attachments/assets/be77595c-cc2e-43c4-827c-b32eac814765

transcript file downloaded from - https://gist.github.com/cdmwebs/6055994

---

## ✨ Features

- **Transcript Upload** — drag-and-drop or file picker, supports `.txt` and `.docx`
- **AI-Powered Extraction** — structured JSON output (title, date, summary, decisions, action items, keywords), validated against a strict schema so malformed AI responses never reach the UI
- **Multi-Model Resilience** — races three free-tier LLMs (DeepSeek, Mistral, Llama) in parallel with automatic fallback, so a single provider outage or rate limit doesn't take down generation
- **Professional PDF Export** — auto-paginated, branded PDF built with `pdf-lib`
- **Free Usage Limit** — 5 free downloads per browser, with sign-in prompt and auto-resume download after authentication
- **Authentication** — Clerk (sign-in modal, account menu, session state)
- **Public Reviews** — star ratings + comments, persisted in Supabase, displayed with reviewer name/avatar (or "Anonymous")
- **Dark Mode** — full app-wide light/dark theme toggle, persisted across sessions
- **Help Center** — step-by-step transcript export instructions for Google Meet, Zoom, and Microsoft Teams
- **Sample Transcript** — one-click demo flow with no file required

---

## 🛠 Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | Clerk |
| LLM | DeepSeek V4 Flash / Mistral Medium / Llama 3.3 — via NVIDIA's free NIM API |
| Database | Supabase (Postgres) — reviews storage |
| Document Parsing | Mammoth (`.docx` → text) |
| PDF Generation | pdf-lib |
| Validation | Zod |
| UI Components | shadcn/ui-style patterns, lucide-react icons |
| Notifications | Sonner |
| Deployment | Vercel |

---

## 🏗 Architecture

```
User uploads transcript (.txt / .docx)
        ↓
POST /api/upload → mammoth extracts plain text
        ↓
POST /api/generate-minutes
        ↓
Races 3 LLMs (NVIDIA NIM) → first success wins
        ↓
Zod validates response shape
        ↓
Results page (sessionStorage transport)
        ↓
POST /api/generate-pdf → pdf-lib builds PDF
        ↓
POST /api/feedback → Supabase (reviews table)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (`corepack enable` if you don't have it)

### 1. Clone and install
```bash
git clone https://github.com/shivanam28/Automom.git
cd automom
pnpm install
```

### 2. Set up environment variables
Copy the template and fill in your own keys:
```bash
cp .env.example .env.local
```

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys |
| `CLERK_SECRET_KEY` | Same page as above |
| `NVIDIA_API_KEY` | [build.nvidia.com](https://build.nvidia.com) → any model page → Generate API Key (free tier) |
| `SUPABASE_URL` | [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page — use the **service_role** key, not `anon` |

### 3. Set up the database
Run `supabase-schema.sql` once in your Supabase project's **SQL Editor** to create the `reviews` table.

### 4. Set up Clerk middleware
Already included at `src/middleware.ts` — required for server-side auth calls (like attaching a reviewer's name to feedback) to work at all.

### 5. Run locally
```bash
pnpm run dev
```
Visit `http://localhost:3000`.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # upload, generate-minutes, generate-pdf, feedback, reviews
│   ├── upload/            # transcript upload page
│   ├── results/           # generated minutes display + PDF download
│   ├── reviews/           # public reviews page
│   ├── help/              # transcript export instructions
│   └── page.tsx           # landing page
├── components/            # Header, Card, UploadZone, FeedbackForm, etc.
├── lib/
│   ├── ai/                # LLM client (multi-model race), prompt orchestration
│   ├── parsing/            # .txt / .docx text extraction
│   ├── pdf/                # PDF generation (pdf-lib)
│   ├── validation.ts       # shared file validation (client + server)
│   ├── usageLimit.ts       # free download tracking
│   └── supabase.ts         # server-only Supabase client
├── prompts/                # LLM prompt templates
└── types/                  # shared Zod schemas + TS types
```

---

## ⚠️ Known Limitations

Being upfront about these since they're deliberate MVP tradeoffs, not oversights:

- **Free usage limit is client-side** (`localStorage`) — easily reset by clearing browser storage. Fine for an MVP demo; a real production limit would need server-side enforcement (by IP or account).
- **Results transport uses `sessionStorage`** — results are shareable within the same browser tab/session only, not via a cross-device link. True sharing would need server-side persistence keyed by ID.
- **No moderation on public reviews** — feedback is displayed as submitted, with no profanity filter or approval step.
- **LLM latency depends on free-tier capacity** — NVIDIA's free NIM endpoints are shared across all users; the multi-model race mitigates this but doesn't eliminate it entirely.
- **Long transcripts are capped** at ~40,000 characters per request; true chunked/map-reduce processing for very long meetings isn't implemented yet.

---

## 📄 License

MIT

---

## 👤 Author

Built by [Shivani Singh](https://github.com/shivanam28) — an AI/ML engineering portfolio project.
