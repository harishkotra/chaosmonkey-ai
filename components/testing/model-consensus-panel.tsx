"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type ConsensusRow = {
  assertion: string;
  primary: "pass" | "fail";
  secondary: "pass" | "fail";
  arbiter: "pass" | "fail";
  note: string;
};

type ApiPayload = {
  rows: ConsensusRow[];
};

function pill(status: "pass" | "fail") {
  return status === "pass"
    ? "rounded px-2 py-1 text-[11px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
    : "rounded px-2 py-1 text-[11px] bg-rose-500/15 text-rose-300 border border-rose-500/40";
}

export function ModelConsensusPanel() {
  const [rows, setRows] = useState<ConsensusRow[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/artifacts/consensus", { cache: "no-store" });
      if (!res.ok) return;
      const payload = (await res.json()) as ApiPayload;
      setRows(payload.rows);
    };
    void load();
  }, []);

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold">Model Consensus Replay</h2>
      <p className="mt-1 text-xs text-slate-400">Primary vs Secondary vs Arbiter decisions for latest assertion replay.</p>
      <div className="mt-3 space-y-2">
        {rows.map((row, idx) => (
          <div key={`${row.assertion}-${idx}`} className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs">
            <p className="mb-2 text-slate-200">{row.assertion}</p>
            <div className="flex flex-wrap gap-2">
              <span className={pill(row.primary)}>primary: {row.primary}</span>
              <span className={pill(row.secondary)}>secondary: {row.secondary}</span>
              <span className={pill(row.arbiter)}>arbiter: {row.arbiter}</span>
            </div>
            <p className="mt-2 text-slate-400">{row.note}</p>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-slate-400">Run tests to replay model consensus for assertions.</p>}
      </div>
    </Card>
  );
}
