import { test, expect } from "@playwright/test";
import { runSteps } from "passmark";

test("mobile layout break mode exposes viewport regression signature", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/dashboard");

  await runSteps({
    page,
    userFlow: "Enable broken mobile layout and verify visible degradation",
    steps: [
      { description: "Click Reset in Break Modes." },
      { description: "Enable the break mode Broken Mobile Layout." },
      { description: "Click the Generate Website button." }
    ],
    assertions: [
      { assertion: "The generated preview area appears constrained or degraded, consistent with a broken mobile layout mode." }
    ],
    test,
    expect
  });

  await expect(page.getByText("AI Website Generator")).toBeVisible();
  await expect(page.getByText("AI confidence 87%")).toBeVisible();
});
