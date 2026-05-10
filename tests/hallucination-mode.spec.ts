import { test, expect } from "@playwright/test";
import { runSteps } from "passmark";

test("hallucination break mode surfaces incorrect output signature", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/dashboard");

  await runSteps({
    page,
    userFlow: "Enable hallucinated output and validate incorrect content detection",
    steps: [
      { description: "Click Reset in Break Modes." },
      { description: "Enable the break mode Hallucinated Output." },
      { description: "Click the Generate Website button." }
    ],
    assertions: [
      { assertion: "The generated output includes unrealistic or fabricated claims consistent with hallucinated output mode." }
    ],
    test,
    expect
  });

  await expect(page.getByText("Hallucination: promises 10,000% conversion gains in 5 seconds.")).toBeVisible();
});
