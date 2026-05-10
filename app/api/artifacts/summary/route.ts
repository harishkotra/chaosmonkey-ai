import { NextResponse } from "next/server";
import { readRunArtifacts } from "@/lib/server/artifacts";
import { generateJson } from "@/lib/server/llm";

export async function GET() {
  const run = readRunArtifacts();

  const fallback = {
    headline: `Latest run: ${run.status.toUpperCase()} (${run.passed}/${run.total} passed)`,
    summary: `Detected ${run.failed + run.timedOut} failing or timed-out tests. Top failing test: ${run.tests.find((t) => t.status !== "passed")?.name ?? "none"}.`,
    recommendations: [
      "Fix highest-frequency failure in heatmap first.",
      "Re-run flagship and golden specs after fix.",
      "Attach artifacts in release notes for QA sign-off."
    ]
  };

  const prompt = `Summarize this AI regression run as JSON with keys headline, summary, recommendations(string[]). Data=${JSON.stringify(run)}`;
  const data = await generateJson(prompt, fallback);

  return NextResponse.json(data);
}
