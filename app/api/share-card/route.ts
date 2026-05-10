import { NextResponse } from "next/server";
import { readRunArtifacts } from "@/lib/server/artifacts";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function GET() {
  const run = readRunArtifacts();
  const top = run.tests.find((t) => t.status !== "passed");
  const title = "ChaosMonkey AI Regression Report";
  const line1 = `Run: ${run.runId ?? "latest"}  Status: ${run.status.toUpperCase()}`;
  const line2 = `Passed: ${run.passed}  Failed: ${run.failed + run.timedOut}  Total: ${run.total}`;
  const line3 = `Top failure: ${top ? top.name : "No failures"}`;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="628" viewBox="0 0 1200 628">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#07111f"/>
      <stop offset="100%" stop-color="#130a1c"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="628" fill="url(#bg)"/>
  <rect x="42" y="42" width="1116" height="544" rx="24" fill="#0b1220" stroke="#334155"/>
  <text x="84" y="140" fill="#e2e8f0" font-family="Arial" font-size="52" font-weight="700">${esc(title)}</text>
  <text x="84" y="220" fill="#22d3ee" font-family="Arial" font-size="30">${esc(line1)}</text>
  <text x="84" y="276" fill="#f8fafc" font-family="Arial" font-size="28">${esc(line2)}</text>
  <text x="84" y="332" fill="#fb7185" font-family="Arial" font-size="26">${esc(line3)}</text>
  <text x="84" y="560" fill="#94a3b8" font-family="Arial" font-size="20">Generated: ${esc(run.generatedAt)}</text>
</svg>`;

  return new NextResponse(svg, { headers: { "Content-Type": "image/svg+xml" } });
}
