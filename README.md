# ChaosMonkey AI

> Break AI apps intentionally. Let AI test them automatically.

ChaosMonkey AI is a standalone AI regression testing platform for teams shipping AI-native products. It combines intentional chaos injection, Passmark natural-language browser testing, and artifact-driven reporting so regressions are caught before production.

## Why this project matters

AI apps fail differently from traditional apps:

- output quality drifts
- prompt/model updates alter behavior
- async inference can degrade UX
- selector-only tests are brittle

ChaosMonkey AI provides a repeatable QA loop:

1. inject controlled failures
2. execute Passmark tests in natural language
3. collect screenshots/videos/assertion evidence
4. analyze failure trends over time

## Core capabilities

- Break Modes panel (latency, navigation, mobile layout, empty response, hallucination, CTA/pricing failures)
- Real AI Website Generator API using OpenRouter (`/api/generate-site`)
- Passmark test suites including a flagship + golden flow
- Hybrid Passmark CUA demo spec (`tests/hybrid-cua-mode.spec.ts`)
- Model consensus replay panel (primary/secondary/arbiter)
- Per-step AI strategy controls (fast / balanced / deep)
- Real run-history ingestion (`artifacts/run-history.json`)
- Failure heatmap + observability timeline
- Share card API for social summaries (`/api/share-card`)
- SSE live test stream (`/api/test-stream`)
- AI run summarizer from real artifacts (`/api/artifacts/summary`)

## Passmark integration

Configured in `playwright.config.ts`:

```ts
import dotenv from "dotenv";
import path from "path";
import { configure } from "passmark";

dotenv.config({ path: path.resolve(__dirname, ".env") });

configure({
  ai: {
    gateway: "openrouter"
  }
});
```

## Coverage map

| Break mode family | Primary spec(s) |
|---|---|
| Latency / inference delay | `tests/latency-mode.spec.ts`, `tests/chaos-mode.spec.ts` |
| Navigation risk | `tests/navigation-mode.spec.ts`, `tests/onboarding.spec.ts` |
| Broken mobile layout | `tests/mobile-layout-mode.spec.ts` |
| Empty response | `tests/empty-response-mode.spec.ts` |
| Hallucinated output | `tests/hallucination-mode.spec.ts` |
| Missing pricing / CTA | `tests/generate-site.spec.ts`, `tests/golden-passmark.spec.ts` |

## Quick start

```bash
npm install
cp .env.example .env
# set OPENROUTER_API_KEY
npm run dev
```

Run test suite:

```bash
npx playwright test --project chromium
```

Open Playwright report:

```bash
npx playwright show-report
```

## Demo flow (45 seconds)

1. Open `/dashboard`
2. Click `Start Demo Mode`
3. Run `Run AI Tests`
4. Open `/testing` for real-time logs + failure evidence
5. Open `/reports` for trend + heatmap + share card

## API surfaces

- `/api/generate-site` - real AI generation output
- `/api/test-stream` - SSE live narration/log stream
- `/api/test-events` - publish live run events
- `/api/artifacts` - latest run
- `/api/artifacts/history` - historical runs
- `/api/artifacts/heatmap` - failure heatmap data
- `/api/artifacts/timeline` - observability events
- `/api/artifacts/summary` - AI run summary
- `/api/share-card` - social-ready run card

## Hybrid CUA demo note

`tests/hybrid-cua-mode.spec.ts` is skipped unless `OPENAI_API_KEY` is set, because the CUA step requires direct OpenAI access (`mode: "cua", gateway: "none"`).

## Real vs simulated

Real:

- Passmark execution and assertions
- Playwright artifacts and run history
- SSE logs and artifact APIs
- AI generation + AI run summary (when keys are present)

Simulated:

- Some cinematic narration language and visual framing
- Intentional break-mode mutation layer for demonstration

## Deployment

Vercel-ready:

1. Push repo to GitHub
2. Import project into Vercel
3. Set `OPENROUTER_API_KEY` (and `OPENAI_API_KEY` if running CUA demo)
4. Deploy