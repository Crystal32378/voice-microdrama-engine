# Architecture

> High-level overview of the Voice Microdrama Engine.

## Game Loop

```
┌─────────────────────────────────────────────────────────────┐
│                        Player                                │
│                    (voice input via mic)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     ASR Provider                             │
│  mock | browser (Web Speech API) | provider (future)        │
│                                                              │
│  Audio (base64) → Transcribed text                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  LLM Story Engine                            │
│  mock | fireworks | amd (OpenAI-compatible)                 │
│                                                              │
│  Transcribed text + conversation history + scene template   │
│  → Streamed narration (sentence by sentence)                │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Sentence Streaming                          │
│                                                              │
│  Split LLM output into sentences                            │
│  → Emit each sentence as text chunk (subtitles)             │
│  → Queue each sentence for TTS                              │
└───────────────┬───────────────────────────┬─────────────────┘
                │                           │
                ▼                           ▼
┌──────────────────────┐    ┌─────────────────────────────────┐
│   Subtitle Display   │    │        TTS Provider             │
│  (real-time text)    │    │  mock | browser | provider      │
└──────────────────────┘    │                                 │
                            │  Sentence → Audio narration     │
                            └───────────────┬─────────────────┘
                                            │
                                            ▼
                            ┌─────────────────────────────────┐
                            │       Audio Playback             │
                            │  (queued, sequential, per-seq)   │
                            └─────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Ending Card                               │
│                                                              │
│  When LLM outputs ending signal:                             │
│  → Parse title / endingType / verdict                       │
│  → Display ending card                                       │
│  → Offer replay / share                                      │
└─────────────────────────────────────────────────────────────┘
```

## Provider Abstraction

All external dependencies (LLM, ASR, TTS) are behind interfaces, so the demo can run in **mock mode** without any API keys.

### LLM Provider Interface

```typescript
interface LLMProvider {
  streamChat(
    messages: Array<{ role: string; content: string }>,
    onChunk: (delta: string) => void,
  ): Promise<string>  // returns full text
}
```

**Implementations:**
- `MockLLMProvider` — returns canned narration based on scene template
- `FireworksProvider` — calls Fireworks AI (AMD-compatible)
- `AMDProvider` — calls any OpenAI-compatible endpoint

### ASR Provider Interface

```typescript
interface ASRProvider {
  transcribe(audioBase64: string, mimeType: string): Promise<string>
}
```

**Implementations:**
- `MockASRProvider` — returns predefined text
- `BrowserASRProvider` — uses Web Speech API (client-side)

### TTS Provider Interface

```typescript
interface TTSProvider {
  synthesize(text: string): Promise<Buffer | null>
}
```

**Implementations:**
- `MockTTSProvider` — returns null (text-only mode)
- `BrowserTTSProvider` — uses `speechSynthesis` API (client-side)

## Scene Templates

Each scene template defines:
- `id` — unique identifier
- `category` — scene type (power_fantasy, transmigration, sci_fi_trial)
- `title` — display name
- `opening` — trigger prompt for the LLM

The public edition includes 3 demo scenes. The private production repo has 40+ scenes across 8 categories — those are not included here.

## Ending Detection

The LLM signals story ending with:
```
[[END]]
META:{"title":"...","endingType":"...","verdict":"..."}
```

The engine:
1. Detects `[[END]]` or `META:` in the streamed output
2. Buffers metadata (does not emit as subtitles/TTS)
3. Parses JSON on stream completion
4. Falls back to a default ending card if parsing fails

## State Management

The engine tracks per-session state:
- `messages` — conversation history
- `turnCount` — current turn (max 5)
- `ended` — whether ending card has been shown
- `generationId` — used to discard stale events from previous turns

## Why mock mode?

For the AMD Showcase hackathon:
- Demo must run reliably without internet dependency on specific providers
- Judges can try it instantly without API keys
- Reduces secrets management burden
- Real providers can be swapped in via `.env` for production deployment
