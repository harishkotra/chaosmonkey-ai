import { test, expect } from "@playwright/test";
import { runSteps } from "passmark";

test("onboarding and dashboard navigation", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/");

  await runSteps({
    page,
    userFlow: "Complete onboarding and navigate dashboard",
    steps: [
      { description: "From the landing page, click Launch Chaos Lab." },
      { description: "Confirm the Chaos Control Center dashboard is visible." },
      { description: "Navigate to the Testing page from the left sidebar." },
      { description: "Navigate back to the Dashboard from the left sidebar." }
    ],
    test,
    expect
  });

  await expect(page.getByRole("heading", { name: "Chaos Control Center" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Testing" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByText("No run yet.")).toBeVisible();
});
