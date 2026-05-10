import { DashboardShell } from "@/components/layout/dashboard-shell";
import { BreakModesPanel } from "@/components/dashboard/break-modes-panel";
import { AiAppPreview } from "@/components/dashboard/ai-app-preview";
import { TestRunnerCard } from "@/components/dashboard/test-runner-card";
import { ResultsFeed } from "@/components/dashboard/results-feed";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="glass rounded-2xl p-4">
        <h1 className="text-2xl font-bold">Chaos Control Center</h1>
        <p className="mt-1 text-sm text-slate-400">Inject failures, run AI tests, and watch Passmark catch regressions in real time.</p>
        <div className="mt-3 rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs text-cyan-100">
          <p className="font-semibold">Judge Demo Script (30-45s, deterministic)</p>
          <p>1) Click Break Everything or Start Demo Mode.</p>
          <p>2) Run AI Tests and watch step runner animation.</p>
          <p>3) Show failed assertions + screenshot evidence in Results/Testing.</p>
          <p>4) Open Reports to show trend, heatmap, and share card.</p>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div id="break-modes-panel">
          <BreakModesPanel />
        </div>
        <div id="ai-preview-panel">
          <AiAppPreview />
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div id="test-runner-panel">
          <TestRunnerCard />
        </div>
        <div id="results-feed-panel">
          <ResultsFeed />
        </div>
      </div>
    </DashboardShell>
  );
}
