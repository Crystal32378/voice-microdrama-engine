# Public Safety — What's NOT Included

This document lists what has been intentionally omitted from this public-safe showcase edition.

## Rationale

The private production repository (`life-blind-box`) contains proprietary content, internal QA data, full production code, and secrets that must not be exposed publicly. This public repo is a **sanitized showcase edition** built from scratch with clean commits — it is not a fork or mirror of the private repo.

## Public repo vs live demo

| | Public repo (this repo) | Live demo (Railway) |
|---|---|---|
| Purpose | Documentation, reference, showcase | Working product experience |
| Runnable? | No — skeleton + docs only | Yes — full 5-round gameplay |
| Contains secrets? | No | No (secrets in Railway env) |
| Has full code? | No (reference modules only) | Yes (private) |

## Omitted Items

### 1. Private Production Prompts
- The full system prompt that drives the narrator's personality, tone, and rules
- The complete ending format instructions
- Internal prompt engineering iterations and A/B variants

**What's here instead:** Simplified placeholder prompts in scene templates that demonstrate the structure without revealing the production voice.

### 2. Full Scene Template Library
- Production has 40+ scenes across 8 categories (absurd survival, identity reversal, revenge drama, high-stakes romance, workplace betrayal, family secret, fantasy rebellion, social humiliation)
- Each production scene has carefully tuned opening prompts

**What's here instead:** 3 demo scenes (power fantasy, transmigration, sci-fi trial) with minimal placeholders.

### 3. Full Production Code
- Next.js 16 frontend (full React components, UI, audio playback logic)
- Bun voice-game backend (Socket.io server, full game state management, circuit breakers)

**What's here instead:** Sanitized reference modules showing the provider abstraction pattern, ending parser, and narrator pipeline structure.

### 4. Founder / Tester Token Logic
- Production has a `FOUNDER_MODE_ENABLED` system with token-based quota bypass for internal testing
- Founder tokens, daily limit overrides, and user-mode classification

**What's here instead:** No founder mode. The `.env.example` documents the env vars for reference.

### 5. Usage Logging Infrastructure
- Production logs every event (ASR, LLM, TTS, turn transitions, errors) to structured JSONL
- Includes latency tracking, circuit breaker states, event chain diagnostics

**What's here instead:** Console logging only. No persistent usage logs.

### 6. Internal QA Notes and Bug Tracking
- Production has detailed docs on alpha testing findings, bug reports, and fix history
- Internal worklog with commit-by-commit analysis

**What's here instead:** Nothing. Internal QA stays private.

### 7. Real Provider Keys
- No `OPENAI_API_KEY`, `FIREWORKS_API_KEY`, `ZAI_API_KEY`, or any other credential is included
- `.env.example` contains only empty placeholders

**What's here instead:** Mock providers that run without any keys (reference only).

### 8. Private Staging URL
- Production has a private staging environment for founder QA

**What's here instead:** Public Railway demo URL is referenced in README. No private staging URL is exposed.

### 9. Complete Git History
- This repo starts from a fresh initial commit
- No git history from the private repo is carried over

### 10. Circuit Breakers and Rate Limiting
- Production has TTS and ASR circuit breakers (429 handling, cooldown logic)
- Per-session and global rate limit tracking
- Full implementation with file-persisted state

**What's here instead:** Not included in the public demo. Architecture docs mention the concept. The `src/` modules do not include circuit breaker code.

### 11. Quota Management
- Production has per-IP daily limits, global caps, quota refund on failure
- Server-side quota as source of truth

**What's here instead:** No quota system. `.env.example` documents the env vars for reference.

## What IS Included

- Clean, documented reference modules (provider interfaces, ending parser, narrator pipeline)
- 3 demo scene templates
- Architecture documentation
- Public safety documentation (this file)
- Dockerfile skeleton (for reference)
- Environment variable template
- Setup notes (clarifying this is a skeleton, not a runnable app)

## Verification

Before each commit to this repo, verify:
- [ ] No `.env` file with real values is committed
- [ ] No real API keys appear in any file
- [ ] No private staging URLs are referenced
- [ ] No production prompts are copied verbatim
- [ ] No usage logs or QA notes are included
- [ ] `.gitignore` covers `.env`, `*.log`, `usage*.jsonl`, `/tmp`
- [ ] README accurately describes this repo as a skeleton, not a runnable app
