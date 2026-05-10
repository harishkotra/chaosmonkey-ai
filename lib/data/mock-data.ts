export const terminalLogLines = [
  "[09:41:02] Initializing chaos kernels...",
  "[09:41:03] Connected to Passmark execution graph",
  "[09:41:06] Injected regression: hide_cta_button=true",
  "[09:41:07] AI website generation request queued",
  "[09:41:12] Assertion failed: pricing section missing",
  "[09:41:12] Screenshot captured: run_22_step_6.png"
];

export const reportSeries = [
  { day: "Mon", passRate: 93, failures: 2 },
  { day: "Tue", passRate: 88, failures: 4 },
  { day: "Wed", passRate: 91, failures: 3 },
  { day: "Thu", passRate: 86, failures: 6 },
  { day: "Fri", passRate: 95, failures: 1 },
  { day: "Sat", passRate: 89, failures: 5 }
];

export const regressionBuckets = [
  { name: "Missing CTA", value: 33 },
  { name: "Hallucinations", value: 19 },
  { name: "Broken Nav", value: 15 },
  { name: "Latency", value: 22 },
  { name: "Validation", value: 11 }
];

export const liveRunnerSteps = [
  "Open ChaosMonkey AI app",
  "Start AI website generation flow",
  "Validate primary CTA visibility",
  "Validate pricing block and testimonials",
  "Capture failures and attach diagnostics"
];
