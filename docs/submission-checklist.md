# Submission Checklist

## Repo readiness ✅

- [x] README rewritten with clear framing
- [x] Live demo URL at top of README
- [x] "Public repo vs live demo" section
- [x] Setup instructions (honest about mock mode)
- [x] Environment variables documented (no secrets)
- [x] Current status table (all features marked)
- [x] Known limitations (honest)
- [x] Hackathon positioning (AMD ACT II, Unicorn Track)
- [x] Screenshots (3 public-safe images, verified)
- [x] Demo video script (60-90 seconds)
- [x] Architecture docs
- [x] Public safety docs
- [x] .gitignore covers .env, logs, secrets
- [x] No secrets / tokens / private URLs in repo
- [x] .env not tracked by git
- [x] All README links verified working
- [x] All screenshots verified public-safe
- [x] Last verified date: 2026-07-08

## Live demo ✅

- [x] Railway frontend: https://frontend-production-9b60.up.railway.app/
- [x] Railway voice-game: https://voice-game-production.up.railway.app/
- [x] OpenAI providers connected (LLM/ASR/TTS)
- [x] Full 5-round session works
- [x] Ending card works
- [x] Founder mode works
- [x] Quota management works
- [x] Bug E (ending timing) PASS

## Private repo checkpoint ✅

- [x] Branch: `fix-alpha-p0-recovery`
- [x] Commit: `532f210` (Bug E PASS + QA log)
- [x] All fixes pushed to GitHub
- [x] Railway running correct commit
- [x] QA log recorded in `docs/qa-log.md`

## Submission assets (to produce)

- [ ] Cover image (1280×720 or similar)
- [ ] Slide presentation (10-12 slides)
- [ ] 60-90 second demo video (see `docs/demo-script.md`)
- [ ] Submission form text (final copy)

## Pre-submission final checks

- [ ] Open README on GitHub — screenshots render correctly
- [ ] Click live demo link — loads and connects
- [ ] Play one full round on demo — voice works
- [ ] Check no `?founder=` token in any public-facing URL
- [ ] Verify Railway services are both running
- [ ] Screenshot the demo for submission form
- [ ] Record demo video following `docs/demo-script.md`
