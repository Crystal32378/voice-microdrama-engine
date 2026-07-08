# Screenshot Guide

Three public-safe screenshots are needed for the README and hackathon submission.

## How to capture

1. Open the live demo: https://frontend-production-9b60.up.railway.app/
2. Use `?founder=<token>` if you need to bypass quota (Crystal has the token)
3. Take screenshots in desktop browser (1280×800 or similar)
4. Save as PNG in `screenshots/` directory
5. Crop to remove browser chrome (address bar, bookmarks)

## Required screenshots

### 1. Landing / start screen

**Filename**: `screenshots/01-landing.png`

**How to capture**:
- Open the demo URL
- Wait for `CONNECTED` (green dot)
- Do NOT start a game yet
- Capture the idle screen with "人生盲盒" title and "開啟盲盒" button

**What it shows**:
- Product name and branding
- "Speak once. Another life begins." tagline
- Clean, dark, cinematic UI
- Ready state (connected)

### 2. Active voice interaction

**Filename**: `screenshots/02-active-voice.png`

**How to capture**:
- Start a game (click "開啟盲盒")
- Wait for narrator to start speaking
- Capture while subtitles are showing and mic button is in "narrating" state
- Ideally capture mid-narration with text visible

**What it shows**:
- Subtitle text (narrator's voice converted to text)
- Turn counter (e.g., "TURN 2 / 5")
- Mic button state (narrating / listening)
- Scene category badge

### 3. Ending card

**Filename**: `screenshots/03-ending-card.png`

**How to capture**:
- Play through to turn 5/5
- Wait for ending card to appear (after narration completes)
- Capture the ending card with title, ending type, and verdict

**What it shows**:
- Ending card design
- Title (e.g., "父子之約")
- Ending type badge (好結局 / 壞結局 / 懸念結局)
- AI verdict text
- Share / replay buttons

## Public safety check

Before committing screenshots, verify:
- [ ] No API keys visible
- [ ] No tokens in URL bar (use clean URL without `?founder=`)
- [ ] No internal IP addresses
- [ ] No private staging URLs
- [ ] No user PII

## README placement

Screenshots will be referenced in README as:

```markdown
## Screenshots

| | | |
|---|---|---|
| ![Landing](./screenshots/01-landing.png) | ![Active voice](./screenshots/02-active-voice.png) | ![Ending card](./screenshots/03-ending-card.png) |
| Landing screen | Active voice interaction | Ending card |
```
