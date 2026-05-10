"use client";

import { AlertOctagon } from "lucide-react";
import { BREAK_MODES, useChaosStore } from "@/lib/store/chaos-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function BreakModesPanel() {
  const { enabled, toggleMode, breakEverything, clearBreaks } = useChaosStore();

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Break Modes</h2>
        <div className="flex gap-2">
          <Button variant="danger" size="sm" onClick={breakEverything}>
            <AlertOctagon className="h-4 w-4" /> Break Everything
          </Button>
          <Button variant="glass" size="sm" onClick={clearBreaks}>Reset</Button>
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {BREAK_MODES.map((mode) => (
          <button
            key={mode.key}
            onClick={() => toggleMode(mode.key)}
            aria-label={`Toggle ${mode.label}`}
            aria-pressed={enabled[mode.key]}
            className={`rounded-xl border p-3 text-left transition ${
              enabled[mode.key] ? "border-danger/60 bg-danger/10" : "border-white/10 bg-white/[0.02]"
            }`}
          >
            <p className="text-sm font-medium">{mode.label}</p>
            <p className="mt-1 text-xs text-slate-400">{mode.description}</p>
          </button>
        ))}
      </div>
    </Card>
  );
}
