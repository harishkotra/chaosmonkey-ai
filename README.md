# ChaosMonkey AI

> Break AI apps intentionally. Let AI test them automatically.

ChaosMonkey AI is a standalone AI regression testing platform for teams shipping AI-native products. It combines intentional chaos injection, Passmark natural-language browser testing, and artifact-driven reporting so regressions are caught before production.

## Screenshots

<img width="1164" height="720" alt="Reports Example" src="https://github.com/user-attachments/assets/9364495f-dffd-4ba2-b08c-fedfa353f355" />
<img width="1164" height="720" alt="Failure Modes with Passmark" src="https://github.com/user-attachments/assets/83637aa2-1061-4f1b-8538-e5d883ce2960" />
<img width="1160" height="720" alt="Success with Passmark" src="https://github.com/user-attachments/assets/ad4aad2e-cae0-4434-997d-16413b6001d1" />

<img width="1721" height="1058" alt="screencapture-localhost-3000-2026-05-11-00_02_09" src="https://github.com/user-attachments/assets/85b633dd-c5c0-4e87-8577-d46a9cf2daec" />
<img width="1721" height="1058" alt="screencapture-localhost-3000-testing-2026-05-11-00_02_19" src="https://github.com/user-attachments/assets/8784873c-d4df-450a-bb6c-4650f8287b3a" />
<img width="1721" height="1125" alt="screencapture-localhost-3000-dashboard-2026-05-11-00_02_26" src="https://github.com/user-attachments/assets/23122558-353f-434b-bf52-dad38e61cb61" />
<img width="1721" height="1058" alt="screencapture-localhost-3000-reports-2026-05-11-00_02_32" src="https://github.com/user-attachments/assets/ec3a4623-3645-413c-b663-59dc9a57c7f7" />
<img width="1721" height="1058" alt="screencapture-localhost-3000-about-2026-05-11-00_02_38" src="https://github.com/user-attachments/assets/5f38888d-ebe8-4c35-93c5-f2d71ef4befa" />
<img width="1721" height="1157" alt="screencapture-localhost-3000-dashboard-2026-05-11-00_08_05" src="https://github.com/user-attachments/assets/5b5f8cc9-f508-4408-9117-176d7d748410" />
<img width="1721" height="1189" alt="screencapture-localhost-3000-dashboard-2026-05-11-00_10_01" src="https://github.com/user-attachments/assets/ff903ffd-bc8e-413f-ae9d-56b8d79de1b5" />
<img width="1721" height="1189" alt="screencapture-localhost-3000-dashboard-2026-05-11-00_10_18" src="https://github.com/user-attachments/assets/ea4337b7-945f-460d-a617-519e5d25025e" />

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
