"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from "recharts";
import { HeatmapPoint, RunArtifacts, RunHistory } from "@/lib/data/artifact-types";

const colors = ["#00E5FF", "#FF528E", "#7C4DFF", "#3DDC97", "#FFB020"];

export default function ReportsPage() {
  const [artifacts, setArtifacts] = useState<RunArtifacts | null>(null);
  const [history, setHistory] = useState<RunHistory>({ runs: [] });
  const [heatmap, setHeatmap] = useState<HeatmapPoint[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/artifacts", { cache: "no-store" });
      const [h, hm] = await Promise.all([
        fetch("/api/artifacts/history", { cache: "no-store" }),
        fetch("/api/artifacts/heatmap", { cache: "no-store" })
      ]);
      if (res.ok) setArtifacts(await res.json());
      if (h.ok) setHistory(await h.json());
      if (hm.ok) {
        const payload = (await hm.json()) as { points: HeatmapPoint[] };
        setHeatmap(payload.points);
      }
    };
    void load();
  }, []);

  const passRate = useMemo(() => {
    if (!artifacts || artifacts.total === 0) return 0;
    return Math.round((artifacts.passed / artifacts.total) * 100);
  }, [artifacts]);

  const stats = [
    `Total Runs: ${artifacts?.total ?? 0}`,
    `Pass Rate: ${passRate}%`,
    `Avg Runtime: ${((artifacts?.tests.reduce((sum, t) => sum + t.durationMs, 0) ?? 0) / Math.max(1, artifacts?.total ?? 1) / 1000).toFixed(1)}s`,
    `Failures Detected: ${(artifacts?.failed ?? 0) + (artifacts?.timedOut ?? 0)}`
  ];

  const trendSeries = useMemo(
    () =>
      history.runs
        .slice(0, 8)
        .reverse()
        .map((run, idx) => ({
          day: `R${idx + 1}`,
          passRate: run.total ? Math.round((run.passed / run.total) * 100) : 0,
          failures: run.failed + run.timedOut
        })),
    [history]
  );

  const pieData = useMemo(
    () =>
      heatmap.map((p) => ({
        name: p.breakMode,
        value: p.failures
      })),
    [heatmap]
  );

  const latestFailed = artifacts?.tests.find((t) => t.status !== "passed");

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/api/share-card`);
  };

  return (
    <DashboardShell>
      <div className="glass rounded-2xl p-4">
        <h1 className="text-2xl font-bold">Test History & Analytics</h1>
        <p className="mt-1 text-sm text-slate-400">Track pass rate, regressions, runtime trends, and common failure patterns.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s} className="p-4 text-sm">{s}</Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="h-[320px] p-4">
          <h2 className="text-sm font-semibold">Pass Rate Trend</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendSeries}>
              <CartesianGrid stroke="#ffffff22" />
              <XAxis dataKey="day" stroke="#aab" />
              <YAxis stroke="#aab" />
              <Tooltip />
              <Line type="monotone" dataKey="passRate" stroke="#00E5FF" strokeWidth={2} />
              <Line type="monotone" dataKey="failures" stroke="#FF528E" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="h-[320px] p-4">
          <h2 className="text-sm font-semibold">Most Common Regressions</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90}>
                {pieData.map((entry, i) => (
                  <Cell key={entry.name} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-sm font-semibold">Failure Heatmap</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {heatmap.slice(0, 8).map((p) => (
              <div key={`${p.breakMode}-${p.impactedSurface}`} className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-xs">
                <p className="font-semibold text-rose-100">{p.breakMode}</p>
                <p className="text-rose-200/90">{p.impactedSurface}</p>
                <p className="mt-1 text-rose-300">fails: {p.failures}</p>
              </div>
            ))}
            {heatmap.length === 0 && <p className="text-sm text-slate-400">No failure heatmap data yet. Run tests to populate.</p>}
          </div>
        </Card>
        <Card className="p-4">
          <h2 className="text-sm font-semibold">Generate Share Card</h2>
          <p className="mt-2 text-xs text-slate-400">Create a social-ready run summary card for LinkedIn/X with pass/fail stats and top failure context.</p>
          <div className="mt-3 flex gap-2">
            <Button asChild size="sm">
              <a href="/api/share-card" target="_blank" rel="noreferrer">Open Share Card</a>
            </Button>
            <Button size="sm" variant="glass" onClick={copyShareLink}>Copy Share URL</Button>
          </div>
          {latestFailed && (
            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs">
              <p className="text-slate-200">top failure: {latestFailed.name}</p>
              <p className="text-slate-400">{latestFailed.errorSnippet ?? "no snippet"}</p>
            </div>
          )}
        </Card>
      </div>
      <Card className="p-4">
        <h2 className="text-sm font-semibold">Latest Run Evidence Feed</h2>
        <div className="mt-3 space-y-2 text-xs terminal-text">
          {(artifacts?.tests ?? []).length === 0 && <p className="text-slate-400">No parsed run artifacts yet. Run `npx playwright test` to populate evidence.</p>}
          {(artifacts?.tests ?? []).map((t) => (
            <div key={t.id} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
              <p className="text-slate-200">{t.name}</p>
              <p className="text-slate-400">status={t.status} duration={(t.durationMs / 1000).toFixed(2)}s screenshots={t.screenshotPaths.length}</p>
              {t.errorSnippet && <p className="text-danger">{t.errorSnippet}</p>}
            </div>
          ))}
        </div>
      </Card>
    </DashboardShell>
  );
}
