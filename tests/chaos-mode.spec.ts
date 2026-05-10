import { test, expect } from "@playwright/test";
import { runSteps } from "passmark";

test("chaos modes trigger detectable regressions", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/dashboard");

  await runSteps({
    page,
    userFlow: "Enable chaos modes and verify regressions",
    steps: [
      { description: "Enable the break mode Remove Generate Button." },
      { description: "Enable the break mode Missing Pricing Section." },
      { description: "Enable the break mode Hide CTA Button." },
      { description: "Run AI tests using the Run AI Tests button." }
    ],
    assertions: [{ assertion: "Regressions are detected in the results feed." }],
    test,
    expect
  });

  await expect(page.getByText("Generate button removed by chaos mode.")).toBeVisible();
  await expect(page.getByText("regressions detected by Passmark flows.")).toBeVisible();
  await expect(page.getByText(/status:\s+(failed|timedOut|unknown)/i)).toBeVisible();
});
