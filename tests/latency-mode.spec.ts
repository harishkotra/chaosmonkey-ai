import { test, expect } from "@playwright/test";
import { runSteps } from "passmark";

test("latency break mode shows delayed inference failure signature", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/dashboard");

  await runSteps({
    page,
    userFlow: "Enable delay response mode and validate delayed-inference risk signal",
    steps: [
      { description: "Click Reset in Break Modes." },
      { description: "Enable the break mode Delay AI Response." }
    ],
    assertions: [
      { assertion: "The Delay AI Response break mode is enabled and the app reflects delayed-inference risk state." }
    ],
    test,
    expect
  });

  await expect(page.getByText("AI confidence")).toBeVisible();
  await expect(page.getByText("AI confidence 87%")).toBeVisible();
});
