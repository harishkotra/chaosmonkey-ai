"use client";

import { useMemo, useState } from "react";
import { Bot, LoaderCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useChaosStore } from "@/lib/store/chaos-store";

export function AiAppPreview() {
  const { enabled, confidenceScore } = useChaosStore();
  const [idea, setIdea] = useState("AI CRM for seed-stage SaaS teams");
  const [style, setStyle] = useState("Neobrutalist");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [generatedData, setGeneratedData] = useState<{
    title: string;
    sections: string[];
    cta: string;
    confidence: number;
    note?: string;
  } | null>(null);

  const canGenerate = !enabled.removeGenerate;
  const delay = enabled.delayResponse ? 4000 : 900;
  const showInfinite = enabled.infiniteLoader;

  const sections = useMemo(() => {
    if (enabled.emptyResponse) return [];
    const base = ["Hero", "Testimonials", "Feature Grid", "Pricing", "Footer"];
    if (enabled.missingPricing) return base.filter((s) => s !== "Pricing");
    return base;
  }, [enabled.emptyResponse, enabled.missingPricing]);

  const handleGenerate = async () => {
    setLoading(true);
    if (showInfinite) return;
    await new Promise((r) => setTimeout(r, delay));
    const res = await fetch("/api/generate-site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea, style, breakModes: enabled })
    });
    if (res.ok) {
      const data = await res.json();
      setGeneratedData(data);
    } else {
      setGeneratedData(null);
    }
    setGenerated(true);
    setLoading(false);
  };

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">AI Website Generator</h2>
        <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-1 text-xs text-primary">AI confidence {confidenceScore}%</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm">Startup Idea
          <input
            className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm">Style
          <select className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2" value={style} onChange={(e) => setStyle(e.target.value)}>
            <option>Neobrutalist</option>
            <option>Futurist Glass</option>
            <option>Editorial Dark</option>
          </select>
        </label>
      </div>
      <div className="mt-3 flex items-center gap-3">
        {canGenerate ? (
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />} Generate Website
          </Button>
        ) : (
          <p className="text-sm text-danger">Generate button removed by chaos mode.</p>
        )}
      </div>

      <div className={`mt-4 rounded-xl border border-white/10 p-4 ${enabled.brokenMobile ? "max-w-[280px] overflow-hidden" : ""}`}>
        {!generated && !loading && <p className="text-sm text-slate-400">Generated preview appears here.</p>}
        {loading && <p className="terminal-text text-sm text-primary">Generating layout for: {idea} [{style}]...</p>}
        {generated && (
          <div className="space-y-3" id="generated-site-preview">
            <h3 className="text-lg font-semibold">{generatedData?.title || (enabled.hallucination ? "Quantum Unicorn Banking Cloud" : idea)}</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(generatedData?.sections ?? sections).map((s) => (
                <div key={s} className="rounded border border-white/10 bg-white/5 px-2 py-1">{s}</div>
              ))}
            </div>
            {(generatedData?.cta || !enabled.hideCTA) && <Button size="sm">{generatedData?.cta || "Start Free Trial"}</Button>}
            {(generatedData?.note || enabled.hallucination) && <p className="text-xs text-amber-400">{generatedData?.note || "Hallucination: promises 10,000% conversion gains in 5 seconds."}</p>}
            {generatedData?.confidence && <p className="text-xs text-primary">model confidence: {generatedData.confidence}%</p>}
          </div>
        )}
      </div>
    </Card>
  );
}
