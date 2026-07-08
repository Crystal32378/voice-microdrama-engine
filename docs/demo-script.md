# Demo Video Script (60–90 seconds)

For AMD Developer Hackathon: ACT II — Unicorn Track submission.

---

## Script

### [0:00–0:10] Problem

**Visual**: Black screen, text fades in.

**Voiceover / text**:

> AI voice experiences are easy to demo.
> But hard to make affordable, replayable, and commercially viable.

**On-screen text**:

```
AI voice experiences are easy to demo.
But hard to make affordable, replayable, and commercially viable.
```

---

### [0:10–0:15] Introduce product

**Visual**: Cut to landing screen of Life Blind Box demo.

**Voiceover**:

> This is Life Blind Box — a voice-first AI microdrama engine.
> Every session is a different life. Five minutes. Five rounds. No save points.

**On-screen text**:

```
Life Blind Box Runtime
Voice-first AI microdrama engine
```

---

### [0:15–0:45] Live demo walkthrough

**Visual**: Screen recording of actual gameplay.

**Action sequence**:

1. Click "開啟盲盒" (Open the blind box)
2. Narrator speaks — show subtitles appearing
3. Hold mic button, speak a choice
4. Release — narrator responds with voice
5. Quick montage of 2-3 turns (subtitles + voice playing)
6. Turn counter visible: TURN 3/5 → TURN 5/5

**Voiceover**:

> You speak. The world answers.
> Each round, your spoken choices shape a branching narrative.
> The narrator responds in real time — voice, not text.

---

### [0:45–0:55] Ending card

**Visual**: Ending card appears after final narration.

**Action**:

1. Final narration plays
2. Brief pause (~400ms)
3. Ending card slides in with title, ending type, verdict

**Voiceover**:

> Every life ends with a story card — a title, a verdict, a moment worth sharing.

**On-screen text**:

```
父子之約
懸念結局
「你以為的復仇，原來是試煉」
```

---

### [0:55–0:75] Why "always playable" matters

**Visual**: Cut to clean text screen.

**Voiceover / text**:

> Most voice AI demos die in production — rate limits, latency, cost spikes.
> Life Blind Box Runtime solves this with:
> — Provider abstraction (swap LLM, ASR, TTS without rewriting code)
> — Circuit breakers (graceful degradation, not crash loops)
> — Quota refund on failure (users don't lose credits to provider errors)

**On-screen text**:

```
Always Playable
• Provider abstraction
• Circuit breakers
• Quota refund on failure
• Stable 5-round sessions
```

---

### [0:75–0:90] Hackathon positioning

**Visual**: Logo / team identity.

**Voiceover / text**:

> Built for AMD Developer Hackathon, Unicorn Track.
> Life Blind Box is the first showcase from Always Playable Lab —
> AI-native experiences that don't just demo well, but stay alive.

**On-screen text**:

```
AMD Developer Hackathon: ACT II
Unicorn Track

Always Playable Lab
Life Blind Box Runtime

Live demo: frontend-production-9b60.up.railway.app
```

---

## Production notes

### Timing

| Section | Duration | Cumulative |
|---|---|---|
| Problem | 10s | 0:10 |
| Introduce product | 5s | 0:15 |
| Live demo walkthrough | 30s | 0:45 |
| Ending card | 10s | 0:55 |
| Why always playable | 20s | 1:15 |
| Hackathon positioning | 15s | 1:30 |

**Total**: ~90 seconds

### Recording tips

1. **Screen recording**: Use QuickTime (Mac) or OBS (cross-platform)
2. **Resolution**: 1920×1080 or 1280×720
3. **Audio**: Record system audio (narrator voice) + optional voiceover
4. **Demo flow**: Practice the run beforehand — pick a scene that reaches ending in 5 turns
5. **Editing**: Keep cuts fast during montage section; slow down for ending card

### What to avoid

- Do NOT show the URL with `?founder=` token
- Do NOT show Railway dashboard or internal logs
- Do NOT show code editor or terminal
- Do NOT mention z.ai or internal provider issues
- Keep it product-focused, not engineering-focused

### Alternative: text-only version

If video production is not feasible, this script can be adapted into:
- A slide deck (10-12 slides)
- A written demo walkthrough in README
- A Twitter/X thread with screenshots
