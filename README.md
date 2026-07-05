# Voice Microdrama Engine

> Speak once. Another life begins.

A voice-first interactive micro-drama engine inspired by power fantasy, transmigration fiction, and Chinese web novel storytelling.

> Say what you want.
> The world will answer.

---

## What is this?

This is a **public-safe hackathon edition** of Life Blind Box.

The private production repository, full prompts, complete scene library, internal QA logs, and secrets are **not** included.

This repo is purpose-built for the AMD Showcase demo. It contains:
- A simplified voice-first game loop (voice input → story → narration → ending)
- Modular provider abstraction (LLM / ASR / TTS can be swapped)
- 2–3 demo scene templates (not the full production library)
- Containerization skeleton for hackathon deployment
- Mock providers so the demo runs without real API keys

## Architecture (high-level)

```
Voice input
→ ASR (mock / browser / provider)
→ LLM story engine (Fireworks / AMD-compatible / mock)
→ sentence streaming
→ TTS narration (browser / mock / provider)
→ ending card
→ replay / share
```

See [`docs/architecture.md`](./docs/architecture.md) for details.

## Provider Abstraction

This engine is designed to be **provider-agnostic**. The public demo ships with mock providers so it runs without secrets.

### LLM Provider
- **Fireworks** (recommended for AMD hackathon — AMD-compatible route)
- **AMD-compatible** (any OpenAI-compatible endpoint)
- **Mock** (default — returns canned narration, no API key needed)

### ASR Provider
- **Browser** (Web Speech API, client-side, no key needed)
- **Mock** (default — returns predefined text)

### TTS Provider
- **Browser** (Web Speech API `speechSynthesis`, no key needed)
- **Mock** (default — text-only mode)

See [`src/providers/`](./src/providers/) for the abstraction layer.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env template (no real keys needed for mock mode)
cp .env.example .env

# 3. Run in mock mode (no API keys required)
npm run dev

# 4. Open http://localhost:3000
```

### Using real providers

Edit `.env` to enable real providers:

```bash
LLM_PROVIDER=fireworks
FIREWORKS_API_KEY=your_key_here

# or AMD-compatible route
LLM_PROVIDER=amd
OPENAI_API_KEY=your_key_here
```

## Docker

```bash
docker build -t voice-microdrama-engine .
docker run -p 3000:3000 --env-file .env voice-microdrama-engine
```

See [`Dockerfile`](./Dockerfile).

## What's NOT included

This public edition intentionally omits:

- Private production system prompts
- Full scene template library (40+ scenes in production; 3 in this demo)
- Founder / tester token logic
- Usage logging infrastructure
- Internal QA notes and bug tracking
- Real provider keys
- Private staging URL
- Complete git history (this is a fresh repo)

See [`docs/public-safety.md`](./docs/public-safety.md) for the full list.

## Demo Scenes

This edition includes 3 simplified scene categories:

| Category | Vibe |
|---|---|
| `power_fantasy` | 突然擁有強大力量，如何使用？ |
| `transmigration` | 醒來發現自己穿越到另一個身份 |
| `sci_fi_trial` | 被送上星際法庭，為自己辯護 |

See [`src/scenes/templates.ts`](./src/scenes/templates.ts).

## License

MIT — see [LICENSE](./LICENSE).

## Acknowledgments

Built for the AMD Showcase. Voice-first storytelling inspired by Chinese web novel culture (穿越 / 重生 / 無敵流) and interactive fiction traditions.

---

> This is a public-safe hackathon edition of Life Blind Box.
> The private production repository, full prompts, complete scene library, internal QA logs, and secrets are not included.
