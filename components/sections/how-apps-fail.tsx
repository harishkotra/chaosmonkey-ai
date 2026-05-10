import { Card } from "@/components/ui/card";

const failures = [
  "Hallucinated responses",
  "Missing buttons",
  "Broken onboarding",
  "Delayed inference",
  "Layout regressions",
  "Disabled actions",
  "Incorrect outputs"
];

export function HowAppsFail() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <h2 className="text-3xl font-bold">How AI Apps Fail</h2>
      <p className="mt-2 text-slate-400">Most AI regressions are subtle, non-deterministic, and difficult to catch with brittle selectors.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {failures.map((item) => (
          <Card key={item} className="p-4 text-sm text-slate-200">{item}</Card>
        ))}
      </div>
    </section>
  );
}
