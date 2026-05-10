"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { liveRunnerSteps } from "@/lib/data/mock-data";
import { ObservabilityEvent, RunArtifacts } from "@/lib/data/artifact-types";
import { ModelConsensusPanel } from "@/components/testing/model-consensus-panel";

export default function TestingPage() {
  const [artifacts, setArtifacts] = useState<RunArtifacts | null>(null);
  const [timeline, setTimeline] = useState<ObservabilityEvent[]>([]);
  const [summary, setSummary] = useState<{ headline: string; summary: string; recommendations: string[] } | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const bootLogs = useMemo(
    () => [
      "Launching playwright worker #1",
      "Passmark: runSteps connected to OpenRouter",
      "Assertion[3] CTA visible => failed",
      "Capture: /artifacts/run-73/step-3.png",
      "Final result: 6 pass · 2 fail"
    ],
    []
  );

  useEffect(() => {
    const load = async () => {
      const [a, t, s] = await Promise.all([
        fetch("/api/artifacts", { cache: "no-store" }),
        fetch("/api/artifacts/timeline", { cache: "no-store" }),
        fetch("/api/artifacts/summary", { cache: "no-store" })
      ]);
      if (a.ok) setArtifacts(await a.json());
      if (t.ok) {
        const payload = (await t.json()) as { events: ObservabilityEvent[] };
        setTimeline(payload.events);
      }
      if (s.ok) setSummary(await s.json());
    };
    void load();
  }, []);

  useEffect(() => {
    setLogs(bootLogs);
    const source = new EventSource("/api/test-stream");
    source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as { type: string; message: string; at: string };
        setLogs((prev) => [...prev.slice(-50), `[${payload.type}] ${payload.message}`]);
      } catch {
        // noop
      }
    };
    return () => source.close();
  }, [bootLogs]);

  const latestFailed = artifacts?.tests.find((t) => t.status === "failed" || t.status === "timedOut");
  const screenshot = latestFailed?.screenshotPaths[0];
  const video = latestFailed?.videoPaths[0];

  return (
    <DashboardShell>
      <div className="glass rounded-2xl p-4">
        <h1 className="text-2xl font-bold">Live Passmark Testing View</h1>
        <p className="mt-1 text-sm text-slate-400">Cinematic execution timeline with logs, assertions, screenshots, and timing metrics from your latest real test run.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card className="p-4">
          <h2 className="text-lg font-semibold">Execution Steps</h2>
          <div className="mt-3 space-y-2">
            {liveRunnerSteps.map((step, idx) => (
              <div key={step} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm">
                <span className="text-primary">{idx + 1}.</span> {step}
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-semibold">Streamed Logs</h2>
          <div className="mt-3 space-y-2 terminal-text text-xs">
            {logs.map((l, i) => (
              <p key={`${i}-${l}`} className="rounded bg-black/40 px-2 py-1 text-slate-300">{l}</p>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs">tests: {artifacts?.total ?? 0}</div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs">screenshots: {artifacts?.tests.reduce((n, t) => n + t.screenshotPaths.length, 0) ?? 0}</div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs">passed: {artifacts?.passed ?? 0}</div>
            <div className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-xs text-danger">failed: {(artifacts?.failed ?? 0) + (artifacts?.timedOut ?? 0)}</div>
          </div>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-lg font-semibold">Failure Evidence</h2>
          {latestFailed ? (
            <div className="mt-3 space-y-2 text-sm">
              <p className="text-slate-200">test: {latestFailed.name}</p>
              <p className="text-slate-400">status: {latestFailed.status}</p>
              <p className="terminal-text text-xs text-danger">{latestFailed.errorSnippet ?? "No error snippet recorded."}</p>
              <p className="terminal-text text-xs text-primary">{latestFailed.assertionHint ?? "assertion hint unavailable"}</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-400">Run tests to populate real failure evidence.</p>
          )}
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-semibold">Latest Screenshot / Video</h2>
          <div className="mt-3 space-y-3">
            {screenshot && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/artifacts/file?path=${encodeURIComponent(screenshot)}`}
                alt="Latest failed test screenshot"
                className="w-full rounded-xl border border-white/10"
              />
            )}
            {!screenshot && <p className="text-sm text-slate-400">No screenshot artifact found in latest run.</p>}
            {video && (
              <video controls className="w-full rounded-xl border border-white/10">
                <source src={`/api/artifacts/file?path=${encodeURIComponent(video)}`} type="video/webm" />
              </video>
            )}
          </div>
        </Card>
      </div>
      <Card className="p-4">
        <h2 className="text-lg font-semibold">Observability Timeline</h2>
        <div className="mt-3 space-y-2">
          {timeline.map((event, i) => (
            <div
              key={`${event.kind}-${i}`}
              className={`rounded-lg border px-3 py-2 text-xs ${
                event.level === "error"
                  ? "border-danger/50 bg-danger/10 text-rose-200"
                  : event.level === "warn"
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
                    : "border-primary/40 bg-primary/10 text-cyan-200"
              }`}
            >
              [{event.kind}] {event.message} · confidence {event.confidence ?? 0}%
            </div>
          ))}
          {timeline.length === 0 && <p className="text-sm text-slate-400">Run tests to populate observability timeline.</p>}
        </div>
      </Card>
      <ModelConsensusPanel />
      <Card className="p-4">
        <h2 className="text-lg font-semibold">AI Run Summary</h2>
        {summary ? (
          <div className="mt-2 space-y-2 text-sm">
            <p className="text-cyan-200">{summary.headline}</p>
            <p className="text-slate-300">{summary.summary}</p>
            <div className="space-y-1 text-xs text-slate-400">
              {summary.recommendations.map((r) => <p key={r}>- {r}</p>)}
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-400">Run tests to generate AI summary from artifacts history.</p>
        )}
      </Card>
    </DashboardShell>
  );
}
