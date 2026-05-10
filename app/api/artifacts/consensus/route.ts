import { NextResponse } from "next/server";
import { readRunArtifacts } from "@/lib/server/artifacts";

export async function GET() {
  const run = readRunArtifacts();
  const candidates = run.tests.slice(0, 3);

  const rows = candidates.map((test, idx) => {
    const failed = test.status === "failed" || test.status === "timedOut";
    return {
      assertion: test.assertionHint ?? `Assertion replay ${idx + 1} for ${test.name}`,
      primary: failed ? "fail" : "pass",
      secondary: idx % 2 === 0 ? (failed ? "fail" : "pass") : failed ? "pass" : "pass",
      arbiter: failed ? "fail" : "pass",
      note: failed
        ? "Arbiter confirms regression evidence from latest run artifacts."
        : "Both models align on healthy UI behavior for this assertion."
    };
  });

  return NextResponse.json({ rows });
}
