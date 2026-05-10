import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <DashboardShell>
      <div className="glass rounded-2xl p-4">
        <h1 className="text-2xl font-bold">Why ChaosMonkey AI + Passmark</h1>
        <p className="mt-1 text-sm text-slate-400">ChaosMonkey AI is a standalone AI QA platform that stress-tests modern AI products and validates behavior with natural-language regression flows.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-lg font-semibold">Why selector-based testing is fragile</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>DOM updates break brittle selectors.</li>
            <li>AI outputs are probabilistic and context-heavy.</li>
            <li>Visual regressions often pass static assertions.</li>
          </ul>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-semibold">Why AI apps need regression testing</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Prompt updates can alter product behavior.</li>
            <li>Latency and output quality vary by model/provider.</li>
            <li>Agentic workflows fail in non-obvious edge cases.</li>
          </ul>
        </Card>
      </div>
      <Card className="p-4">
        <h2 className="text-lg font-semibold">High-level Testing Loop</h2>
        <pre className="mt-3 overflow-auto rounded-lg border border-white/10 bg-black/40 p-4 text-xs text-slate-300">
{`User Intent -> Chaos Injection -> Passmark runSteps -> Assertions + Screenshots -> Failure Analytics -> Fix + Re-run`}
        </pre>
      </Card>
    </DashboardShell>
  );
}
