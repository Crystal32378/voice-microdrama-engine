# Life Blind Box Runtime

> Speak once. Another life begins.

A voice-first AI microdrama engine for short, replayable interactive story sessions.

**Live demo**: https://frontend-production-9b60.up.railway.app/

---

## What is this?

Life Blind Box Runtime is a voice-first AI interaction engine. Each session is a 5-minute, 5-round interactive microdrama — you speak, the world answers, and every playthrough is a different life.

It's not a chatbot. It's not a visual novel. It's a **voice-only interactive story experience** where your spoken choices shape a branching narrative that ends with a shareable ending card.

> 語音優先的 AI 互動小劇場引擎 — 每次開局都是一個隨機人生，5 分鐘、5 回合、沒有存檔。

## Why this matters

Voice-first AI experiences are engaging, but each session involves speech recognition, LLM generation, voice playback, latency handling, and repeated replay. If the system is unstable or too expensive, the product cannot scale.

> AI 語音互動體驗很容易做出炫的 demo，但真正困難的是讓它可負擔、可重玩，而且有商業可行性。

Life Blind Box Runtime explores how to make voice-first AI microdramas **always playable** — stable, replayable, and economically viable — rather than dying from cost, latency, or provider instability.

## Current demo

**Try it now**: https://frontend-production-9b60.up.railway.app/

1. Open the link
2. Click "開啟盲盒" (Open the blind box)
3. Hold the mic button to speak
4. Release to send — the narrator responds with voice
5. Play through 5 rounds to reach your ending card
6. Share your ending, or play again for a different life

**What you'll experience**:
- A randomly generated scenario (betrayal, transmigration, power fantasy, sci-fi trial, and more)
- Voice narration with dramatic tone
- Your spoken choices shape the story
- An ending card with title, ending type, and AI verdict
- Each playthrough is unique

## Current status

**Playable checkpoint** — last verified 2026-07-06

| Feature | Status |
|---|---|
| Complete 5-round session | ✅ Working |
| Ending card with title/type/verdict | ✅ Working |
| Voice narration (OpenAI TTS) | ✅ Working |
| Speech recognition (OpenAI ASR) | ✅ Working |
| LLM story generation (OpenAI) | ✅ Working |
| Railway deployment | ✅ Live |
| Founder/tester mode | ✅ Working |
| Quota management + refund on failure | ✅ Working |
| ASR/TTS circuit breakers (429 handling) | ✅ Working |
| Audio queue stability (no choppy playback) | ✅ Working |
| Ending card timing (waits for narration) | ✅ Working |

### What's been fixed (private QA history)

Over 3 days of iterative QA, these runtime issues were diagnosed and fixed:
- Audio queue desync causing choppy playback from turn 3+
- META JSON leaking into subtitles/TTS
- Premature ending on turn 4 instead of turn 5
- Residual audio after ending card
- ASR 429 retry loops (circuit breaker added)
- Stale generation audio not being discarded
- Ending card appearing before final narration completed

## Tech stack

**Actually in use** (not aspirational):
- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Bun, Socket.io (voice-game service)
- **LLM**: OpenAI gpt-4o-mini
- **ASR**: OpenAI gpt-4o-mini-transcribe
- **TTS**: OpenAI gpt-4o-mini-tts (voice: fable)
- **Deployment**: Railway (2 services: frontend + voice-game)
- **Provider abstraction**: Modular — can switch LLM/ASR/TTS providers via env vars

**Planned hackathon extensions** (not yet implemented):
- Fireworks AI integration (AMD-compatible route)
- Cost-aware provider routing
- Usage telemetry dashboard

## Setup

### Prerequisites

- Node.js 18+ or Bun
- OpenAI API key

### Local development

```bash
# Clone
git clone https://github.com/Crystal32378/voice-microdrama-engine.git
cd voice-microdrama-engine

# Install frontend dependencies
npm install

# Install voice-game dependencies
cd mini-services/voice-game
bun install
cd ..

# Copy env template
cp .env.example .env
# Edit .env — add your OPENAI_API_KEY

# Run frontend (port 3000)
npm run dev

# In another terminal, run voice-game (port 3003)
cd mini-services/voice-game
bun run dev

# Open http://localhost:3000
```

### Environment variables

Only put these in `.env` (gitignored). Never commit real keys.

```bash
# Required
OPENAI_API_KEY=

# Provider selection (default: openai)
LLM_PROVIDER=openai
ASR_PROVIDER=openai
TTS_PROVIDER=openai

# Models (defaults shown)
OPENAI_LLM_MODEL=gpt-4o-mini
OPENAI_TTS_MODEL=gpt-4o-mini-tts
OPENAI_TTS_VOICE=fable
OPENAI_ASR_MODEL=gpt-4o-mini-transcribe

# Optional: founder mode (bypass public quota)
FOUNDER_MODE_ENABLED=false
FOUNDER_DAILY_LIMIT=100
FOUNDER_TOKEN=

# Optional: quota limits
PER_IP_DAILY_LIMIT=5
GLOBAL_DAILY_CAP=200
```

### Deployment

This project is deployed on Railway with 2 services:
- **frontend** (Next.js) — port 3000
- **voice-game** (Bun + Socket.io) — port 3003

See `Dockerfile` for containerization skeleton.

## Architecture

```
Voice input (mic)
  → ASR (OpenAI gpt-4o-mini-transcribe)
  → LLM story engine (OpenAI gpt-4o-mini, streaming)
  → Sentence splitting + subtitle display
  → TTS narration (OpenAI gpt-4o-mini-tts, queued playback)
  → 5-round loop
  → Ending card ([[END]] + META parser)
  → Share / replay
```

Key design decisions:
- **Provider abstraction**: LLM/ASR/TTS are behind interfaces, swappable via env vars
- **Circuit breakers**: ASR and TTS 429s trigger cooldown, not infinite retry
- **Generation tracking**: Each turn has a generationId; stale audio is discarded
- **Ending timing**: Server waits for TTS to complete before signaling game_over; frontend waits for audio playback to drain before showing ending card

See [`docs/architecture.md`](./docs/architecture.md) for details.

## Demo scenes

3 scene categories included (production has more):

| Category | Vibe |
|---|---|
| Power Fantasy | 突然擁有強大力量，如何使用？ |
| Transmigration | 醒來發現自己穿越到另一個身份 |
| Sci-Fi Trial | 被送上星際法庭，為自己辯護 |

See [`src/scenes/templates.ts`](./src/scenes/templates.ts).

## Known limitations

Being honest about what's not done yet:

- **Voice UX is experimental**: TTS voice (fable) has a slight non-native accent in Chinese; acceptable for demo, needs tuning for production
- **No cost telemetry**: Provider cost tracking is planned as a hackathon extension
- **No Fireworks/AMD integration**: Currently OpenAI-only; Fireworks route is planned
- **Scene library is small**: 3 demo scenes; production has 40+ across 8 categories (private)
- **No persistence**: Games are in-memory only; no save/resume
- **Single language**: Chinese primarily; English support is planned
- **No mobile optimization**: Desktop browser focused for now

## Hackathon positioning

This project is being prepared for **AMD Developer Hackathon: ACT II** — **Unicorn Track**.

### Thesis

> AI voice experiences are easy to demo, but hard to make affordable, replayable, and commercially viable.

Life Blind Box Runtime is an exploration of how voice-first AI microdramas can become **always playable** — surviving cost pressure, provider instability, and scaling challenges — rather than being impressive demos that die in production.

### Team identity

**Always Playable Lab** — building AI-native interactive experiences that are not only impressive in demos, but remain stable, replayable, and economically viable.

> AI 原生互動體驗不應該只是 demo 很炫，而是要能穩定、可重玩，而且經濟上能成立。

Life Blind Box is the first showcase from Always Playable Lab.

## What's NOT in this public repo

This is a public-safe edition. The following are intentionally omitted (see [`docs/public-safety.md`](./docs/public-safety.md)):

- Private production prompts (system prompt, ending format instructions)
- Full scene template library (40+ scenes in production; 3 here)
- Founder token logic (simplified for public demo)
- Usage logging infrastructure (JSONL logs, event chain diagnostics)
- Internal QA notes and bug tracking
- Real provider keys
- Private staging URL (this README links to the public Railway demo)
- Circuit breaker implementation details (concept documented, not full code)
- Complete git history (fresh repo, no private history)

## License

MIT — see [LICENSE](./LICENSE).

## Acknowledgments

Built for AMD Developer Hackathon: ACT II. Voice-first storytelling inspired by Chinese web novel culture (穿越 / 重生 / 無敵流) and interactive fiction traditions.

---

> This is a public-safe showcase edition of Life Blind Box Runtime.
> The private production repository contains full prompts, complete scene library, internal QA logs, and secrets — these are not included here.
