"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useChaosStore } from "@/lib/store/chaos-store";
import { RunArtifacts } from "@/lib/data/artifact-types";

export function ResultsFeed() {
  const { enabled, lastRunStatus } = useChaosStore();
  const activeBreaks = Object.entries(enabled).filter(([, v]) => v).length;
  const [artifacts, setArtifacts] = useState<RunArtifacts | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/artifacts", { cache: "no-store" });
      if (!res.ok) return;
      setArtifacts(await res.json());
    };
    void load();
  }, [lastRunStatus]);

  const evidence = artifacts?.tests.find((t) => t.status === "failed" || t.status === "timedOut");

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold">Results Feed</h2>
      <div className="mt-3 space-y-2 text-sm">
        <div className="rounded-xl border border-white/10 bg-black/35 p-3">
          {lastRunStatus === "pass" && <p className="flex items-center gap-2 text-emerald-400"><CheckCircle2 className="h-4 w-4" />All checks passed.</p>}
          {lastRunStatus === "fail" && <p className="flex items-center gap-2 text-danger"><XCircle className="h-4 w-4" />{activeBreaks} regressions detected by Passmark flows.</p>}
          {lastRunStatus === "running" && <p className="flex items-center gap-2 text-primary"><AlertTriangle className="h-4 w-4" />Executing natural language assertions...</p>}
          {lastRunStatus === "idle" && <p className="text-slate-400">No run yet.</p>}
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 terminal-text text-xs text-slate-300">
          screenshot: {evidence?.screenshotPaths[0] ? evidence.screenshotPaths[0].split("/").at(-1) : "none"} · assertion: {evidence?.assertionHint ?? "&quot;Pricing section visible&quot;"} · status: {evidence?.status ?? (lastRunStatus === "fail" ? "failed" : "passed")}
        </div>
      </div>
    </Card>
  );
}
