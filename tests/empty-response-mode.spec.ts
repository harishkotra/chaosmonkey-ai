import { test, expect } from "@playwright/test";
import { runSteps } from "passmark";

test("empty response break mode shows missing output failure signature", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/dashboard");

  await runSteps({
    page,
    userFlow: "Enable empty response and verify missing generation evidence",
    steps: [
      { description: "Click Reset in Break Modes." },
      { description: "Enable the break mode Empty AI Response." },
      { description: "Click the Generate Website button and wait for completion." }
    ],
    assertions: [
      { assertion: "The generated output lacks expected website section content because empty response mode is active." }
    ],
    test,
    expect
  });

  await expect(page.getByRole("heading", { name: "AI CRM for seed-stage SaaS teams" })).toBeVisible();
});
