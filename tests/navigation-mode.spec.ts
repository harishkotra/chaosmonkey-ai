import { test, expect } from "@playwright/test";
import { runSteps } from "passmark";

test("navigation break family surfaces routing-risk signature", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/dashboard");

  await runSteps({
    page,
    userFlow: "Enable wrong navigation mode and validate navigation behavior",
    steps: [
      { description: "Click Reset in Break Modes." },
      { description: "Enable the break mode Wrong Navigation." }
    ],
    assertions: [
      { assertion: "The dashboard remains functional while wrong navigation mode is enabled." }
    ],
    test,
    expect
  });

  await page.getByRole("link", { name: "Testing" }).click();
  await page.getByRole("link", { name: "Dashboard" }).click();
  await expect(page.getByRole("heading", { name: "Chaos Control Center" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Testing" })).toBeVisible();
});
