import { test, expect } from "@playwright/test";
import { runSteps, configure } from "passmark";
import { PASSMARK_STRATEGY_CONFIG } from "../lib/data/ai-strategies";

configure({
  ai: {
    gateway: "openrouter"
  }
});

test("hybrid demo: snapshot + CUA in one flow", async ({ page }) => {
  test.setTimeout(180_000);

  test.skip(!process.env.OPENAI_API_KEY, "OPENAI_API_KEY is required for the CUA step in this hybrid demo.");

  await page.goto("/dashboard");

  await runSteps({
    page,
    userFlow: "Hybrid run with snapshot steps and one CUA visual step",
    ai: PASSMARK_STRATEGY_CONFIG.balanced.ai,
    steps: [
      { description: "Click Reset in Break Modes." },
      { description: "Enter AI legal copilot for founders in the Startup Idea field." },
      {
        description: "Visually verify and click Generate Website using the on-screen button.",
        ai: {
          mode: "cua",
          gateway: "none"
        }
      },
      { description: "Wait until the generated website preview appears." }
    ],
    assertions: [
      { assertion: "The generated preview is visible and includes startup-themed website sections." }
    ],
    test,
    expect
  });
});
