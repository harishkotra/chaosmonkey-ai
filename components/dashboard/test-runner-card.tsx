"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clapperboard, FlaskConical, Timer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { liveRunnerSteps } from "@/lib/data/mock-data";
import { useChaosStore } from "@/lib/store/chaos-store";
import { AI_STRATEGY_LABELS } from "@/lib/data/ai-strategies";

export function TestRunnerCard() {
  const { enabled, setLastRunStatus, isDemoMode, demoNarration, startDemoMode, setDemoNarration, endDemoMode, aiStrategy, setAIStrategy } = useChaosStore();
  const [running, setRunning] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [lastDuration, setLastDuration] = useState(0);

  const run = async () => {
    const emit = async (type: "log" | "status" | "assertion" | "artifact", message: string) => {
      await fetch("/api/test-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message })
      });
    };
    const start = Date.now();
    setRunning(true);
    setLastRunStatus("running");
    void emit("status", "run started");
    for (let i = 0; i < liveRunnerSteps.length; i += 1) {
      setActiveIndex(i);
      void emit("log", `step ${i + 1} started: ${liveRunnerSteps[i]}`);
      await new Promise((r) => setTimeout(r, aiStrategy === "fast" ? 420 : aiStrategy === "deep" ? 820 : 650));
      void emit("assertion", `step ${i + 1} completed`);
    }
    setRunning(false);
    setActiveIndex(-1);
    setLastDuration(Date.now() - start);
    const broken = Object.values(enabled).some(Boolean);
    setLastRunStatus(broken ? "fail" : "pass");
    void emit("artifact", `run completed with status=${broken ? "fail" : "pass"}`);
  };

  const runCinematicDemo = async () => {
    if (running) return;
    document.getElementById("break-modes-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
    startDemoMode();
    setDemoNarration(`Break preset active. Executing ${AI_STRATEGY_LABELS[aiStrategy]} regression sequence...`);
    await new Promise((r) => setTimeout(r, 700));
    document.getElementById("test-runner-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
    await run();
    document.getElementById("results-feed-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
    setDemoNarration("Passmark detected regressions with visual evidence.");
    await new Promise((r) => setTimeout(r, 500));
    endDemoMode();
  };

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Test Runner</h2>
        <div className="flex gap-2">
          <Button onClick={run} disabled={running}>
            <FlaskConical className="h-4 w-4" /> {running ? "Running..." : "Run AI Tests"}
          </Button>
          <Button onClick={runCinematicDemo} disabled={running} variant="glass">
            <Clapperboard className="h-4 w-4" /> Start Demo Mode
          </Button>
        </div>
      </div>
      <div className="mb-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
        <label className="text-xs text-slate-300" htmlFor="ai-strategy-select">Per-step AI strategy override</label>
        <select
          id="ai-strategy-select"
          className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm"
          value={aiStrategy}
          onChange={(e) => setAIStrategy(e.target.value as typeof aiStrategy)}
        >
          <option value="fast">{AI_STRATEGY_LABELS.fast}</option>
          <option value="balanced">{AI_STRATEGY_LABELS.balanced}</option>
          <option value="deep">{AI_STRATEGY_LABELS.deep}</option>
        </select>
        <p className="mt-2 terminal-text text-[11px] text-slate-400">
          passmark.ai override: {aiStrategy === "fast" ? "gemini-3-flash / 2.5-flash" : aiStrategy === "deep" ? "gemini-3.1-pro / 3.1-pro" : "gemini-3-flash-preview / 2.5-flash"}
        </p>
      </div>
      <div className="space-y-2">
        {liveRunnerSteps.map((step, index) => (
          <motion.div
            key={step}
            className={`rounded-lg border px-3 py-2 text-sm ${index === activeIndex ? "border-primary/60 bg-primary/10" : "border-white/10 bg-white/[0.02]"}`}
            animate={index === activeIndex ? { scale: 1.01 } : { scale: 1 }}
          >
            {step}
          </motion.div>
        ))}
      </div>
      <div className={`mt-3 rounded-lg border px-3 py-2 text-xs ${isDemoMode ? "border-accent/50 bg-accent/10 text-pink-200" : "border-white/10 bg-white/[0.02] text-slate-400"}`}>
        narrator: {demoNarration}
      </div>
      <p className="mt-3 flex items-center gap-2 text-xs text-slate-400"><Timer className="h-3.5 w-3.5" /> Last run: {(lastDuration / 1000).toFixed(2)}s</p>
    </Card>
  );
}
