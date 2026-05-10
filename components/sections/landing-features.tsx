import { AlertTriangle, Bot, GaugeCircle, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  { title: "Chaos Injection", icon: AlertTriangle, desc: "Toggle intentional regressions instantly." },
  { title: "AI Regression Testing", icon: Bot, desc: "Natural language flows powered by Passmark." },
  { title: "Visual Failure Reports", icon: GaugeCircle, desc: "Screenshots, logs, assertions, and timing." },
  { title: "Prompt Reliability Testing", icon: Sparkles, desc: "Validate output quality under stress." }
];

export function LandingFeatures() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <Card key={f.title} className="p-5 transition hover:border-primary/40">
            <f.icon className="h-5 w-5 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
