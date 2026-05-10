import { test, expect } from "@playwright/test";
import { runSteps } from "passmark";

test("flagship: passmark-only AI website generation regression", async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto("/dashboard");

  await runSteps({
    page,
    userFlow: "Generate a startup website and validate critical UI sections",
    steps: [
      { description: "Ensure no break modes are enabled by clicking Reset in the Break Modes panel." },
      { description: "Enter the startup idea as AI legal copilot for founders in the startup idea input." },
      { description: "Select the style option Futurist Glass." },
      { description: "Click the Generate Website button." },
      { description: "Confirm the generated website preview appears with section chips like Hero, Testimonials, Feature Grid, Pricing, and Footer." }
    ],
    assertions: [
      { assertion: "The generated website preview is visible and contains the provided startup idea heading." },
      { assertion: "A call to action button labeled Start Free Trial is visible in the generated preview." },
      { assertion: "The generated sections include Pricing and do not appear empty." }
    ],
    test,
    expect
  });
});
