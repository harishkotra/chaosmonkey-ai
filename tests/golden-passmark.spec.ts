import { test, expect } from "@playwright/test";
import { runSteps } from "passmark";

test("golden: chaos injection reveals visible failure signatures", async ({ page }) => {
  test.setTimeout(180_000);

  await page.goto("/dashboard");

  await runSteps({
    page,
    userFlow: "Inject severe chaos and validate visible regression evidence",
    steps: [
      { description: "Enable the break mode Remove Generate Button." },
      { description: "Enable the break mode Hide CTA Button." },
      { description: "Enable the break mode Missing Pricing Section." },
      { description: "Run AI tests using the Run AI Tests button." },
      { description: "Wait until the results feed shows regression outcomes." }
    ],
    assertions: [
      { assertion: "The AI website generator area shows that the generate button has been removed by chaos mode." },
      { assertion: "The results feed reports regressions detected by Passmark flows." },
      { assertion: "The regression evidence includes a failed status marker tied to a pricing visibility assertion." },
      { assertion: "The page does not show a healthy all checks passed state for this run." }
    ],
    test,
    expect
  });
});
